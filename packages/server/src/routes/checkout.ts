import { Hono } from 'hono'
import { z } from 'zod'
import { optionalAuth } from '../middleware/optionalAuth'
import { AppError } from '../middleware/errorHandler'
import { parseGuestId } from '../lib/cart'
import { createAnalytics } from '../lib/analytics'
import {
  SURVEY_AGE,
  SURVEY_HANGOUT,
  SURVEY_HEARD_FROM,
  SURVEY_LANGUAGE,
  SURVEY_LINE,
  SURVEY_NEXT_PIECE,
  SURVEY_SILHOUETTE,
  createCheckoutSession,
  customerEmailForUser,
  getOrderBySession,
  quoteCheckout,
  saveOrderSurvey,
} from '../lib/checkout'
import type { Env } from '../types'

const bodySchema = z.object({
  coupon_code: z.string().max(80).optional(),
  // Optional and forgiving: a bad analytics ID must never block a checkout.
  analytics_id: z.string().max(200).optional().catch(undefined),
})

const surveySchema = z.object({
  status: z.enum(['partial', 'completed', 'skipped']),
  answers: z.object({
    hangout: z.enum(SURVEY_HANGOUT).optional(),
    silhouette: z.enum(SURVEY_SILHOUETTE).optional(),
    line: z.enum(SURVEY_LINE).optional(),
    next_piece: z.enum(SURVEY_NEXT_PIECE).optional(),
    heard_from: z.enum(SURVEY_HEARD_FROM).optional(),
    age_range: z.enum(SURVEY_AGE).optional(),
    language: z.enum(SURVEY_LANGUAGE).optional(),
  }),
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
    {
      secretKey,
      webUrl: c.env.WEB_URL,
      customerEmail,
      analytics: createAnalytics(c.env, (promise) => c.executionCtx.waitUntil(promise)),
      analyticsId: parsed.data.analytics_id,
    },
    parsed.data.coupon_code,
  )

  return c.json({ url })
})

checkout.get('/orders/:sessionId', async (c) => {
  const order = await getOrderBySession(c.get('db'), c.req.param('sessionId'))
  if (!order) throw new AppError(404, 'order_not_found')
  return c.json(order)
})

checkout.post('/orders/:sessionId/survey', async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = surveySchema.safeParse(body)
  if (!parsed.success) throw new AppError(400, 'invalid_survey')
  const survey = await saveOrderSurvey(
    c.get('db'),
    c.req.param('sessionId'),
    parsed.data.answers,
    parsed.data.status,
  )
  return c.json({ ok: true, survey })
})

export default checkout
