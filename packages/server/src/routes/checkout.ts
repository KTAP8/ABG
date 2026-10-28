import { Hono } from 'hono'
import { z } from 'zod'
import { optionalAuth } from '../middleware/optionalAuth'
import { AppError } from '../middleware/errorHandler'
import { parseGuestId } from '../lib/cart'
import {
  createCheckoutSession,
  customerEmailForUser,
  getOrderBySession,
  quoteCheckout,
} from '../lib/checkout'
import type { Env } from '../types'

const bodySchema = z.object({
  coupon_code: z.string().max(80).optional(),
})

const checkout = new Hono<Env>()

checkout.use('*', optionalAuth)

function cartIdentity(c: {
  get: (key: 'user') => { id: string; email?: string } | undefined
  req: { header: (name: string) => string | undefined }
}) {
  const user = c.get('user')
  if (user?.id) return { userId: user.id, email: user.email }
  const guestId = parseGuestId(c.req.header('X-Guest-Cart-Id'))
  if (guestId) return { guestId }
  return null
}

checkout.post('/quote', async (c) => {
  const identity = cartIdentity(c)
  if (!identity) throw new AppError(400, 'identity_required')

  const body = await c.req.json().catch(() => ({}))
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) throw new AppError(400, 'coupon_invalid')

  const { quote } = await quoteCheckout(c.get('db'), identity, parsed.data.coupon_code)
  return c.json({
    subtotal: quote.subtotal,
    discount: quote.discount,
    bundleDiscount: quote.bundleDiscount,
    couponDiscount: quote.couponDiscount,
    couplePairs: quote.couplePairs,
    bestiePairs: quote.bestiePairs,
    shipping: quote.shipping,
    total: quote.total,
  })
})

checkout.post('/session', async (c) => {
  const identity = cartIdentity(c)
  if (!identity) throw new AppError(400, 'identity_required')

  const secretKey = c.env.STRIPE_SECRET_KEY
  if (!secretKey) throw new AppError(500, 'stripe_not_configured')

  const body = await c.req.json().catch(() => ({}))
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) throw new AppError(400, 'coupon_invalid')

  const user = c.get('user')
  const customerEmail = await customerEmailForUser(c.get('db'), user?.id, user?.email)

  const { url } = await createCheckoutSession(
    c.get('db'),
    identity,
    { secretKey, webUrl: c.env.WEB_URL, customerEmail },
    parsed.data.coupon_code,
  )

  return c.json({ url })
})

checkout.get('/orders/:sessionId', async (c) => {
  const order = await getOrderBySession(c.get('db'), c.req.param('sessionId'))
  if (!order) throw new AppError(404, 'order_not_found')
  return c.json(order)
})

export default checkout
