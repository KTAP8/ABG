import { Hono } from 'hono'
import { z } from 'zod'
import { requireUser } from '../middleware/auth'
import { optionalAuth } from '../middleware/optionalAuth'
import { AppError } from '../middleware/errorHandler'
import {
  addCartItem,
  buildCartResponse,
  clearCartItems,
  findCart,
  getOrCreateCart,
  mergeGuestCart,
  parseGuestId,
  removeCartItem,
  setCartItemQuantity,
} from '../lib/cart'
import type { Env } from '../types'

const addItemSchema = z.object({
  variant_id: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
})

const patchItemSchema = z.object({
  quantity: z.number().int().min(0),
})

const mergeSchema = z.object({
  guest_id: z.string().min(1),
})

const cart = new Hono<Env>()

cart.use('*', optionalAuth)

function requireIdentity(c: { get: (k: 'user') => { id: string } | undefined; req: { header: (n: string) => string | undefined } }) {
  const user = c.get('user')
  const guestId = parseGuestId(c.req.header('X-Guest-Cart-Id'))

  if (user?.id) {
    return { userId: user.id as string }
  }
  if (guestId) {
    return { guestId }
  }
  return null
}

/** GET /api/cart — read only; empty if no identity / no cart. */
cart.get('/', async (c) => {
  const db = c.get('db')
  const identity = requireIdentity(c)

  if (!identity) {
    return c.json({ id: null, items: [], item_count: 0, subtotal: 0 })
  }

  const existing = await findCart(db, identity)
  return c.json(await buildCartResponse(db, existing))
})

/** POST /api/cart/items — increment quantity (or insert). Creates cart + guest id as needed. */
cart.post('/items', async (c) => {
  const db = c.get('db')
  const identity = requireIdentity(c)

  if (!identity) {
    throw new AppError(400, 'Cart identity required (sign in or provide X-Guest-Cart-Id)')
  }

  const body = await c.req.json().catch(() => null)
  const parsed = addItemSchema.safeParse(body)
  if (!parsed.success) {
    throw new AppError(400, 'Invalid cart item data')
  }

  const cartRow = await getOrCreateCart(db, identity)
  await addCartItem(db, cartRow.id, parsed.data.variant_id, parsed.data.quantity)
  return c.json(await buildCartResponse(db, cartRow))
})

/** PATCH /api/cart/items/:id — set absolute quantity; 0 removes. */
cart.patch('/items/:id', async (c) => {
  const db = c.get('db')
  const identity = requireIdentity(c)

  if (!identity) {
    throw new AppError(400, 'Cart identity required')
  }

  const body = await c.req.json().catch(() => null)
  const parsed = patchItemSchema.safeParse(body)
  if (!parsed.success) {
    throw new AppError(400, 'Invalid quantity')
  }

  const existing = await findCart(db, identity)
  if (!existing) {
    throw new AppError(404, 'Cart not found')
  }

  await setCartItemQuantity(db, existing.id, c.req.param('id'), parsed.data.quantity)
  return c.json(await buildCartResponse(db, existing))
})

/** DELETE /api/cart/items/:id */
cart.delete('/items/:id', async (c) => {
  const db = c.get('db')
  const identity = requireIdentity(c)

  if (!identity) {
    throw new AppError(400, 'Cart identity required')
  }

  const existing = await findCart(db, identity)
  if (!existing) {
    throw new AppError(404, 'Cart not found')
  }

  await removeCartItem(db, existing.id, c.req.param('id'))
  return c.json(await buildCartResponse(db, existing))
})

/** DELETE /api/cart — clear all items */
cart.delete('/', async (c) => {
  const db = c.get('db')
  const identity = requireIdentity(c)

  if (!identity) {
    throw new AppError(400, 'Cart identity required')
  }

  const existing = await findCart(db, identity)
  if (!existing) {
    return c.json({ id: null, items: [], item_count: 0, subtotal: 0 })
  }

  await clearCartItems(db, existing.id)
  return c.json(await buildCartResponse(db, existing))
})

/** POST /api/cart/merge — requireUser; idempotent guest → user merge */
cart.post('/merge', requireUser, async (c) => {
  const db = c.get('db')
  const user = c.get('user')
  if (!user) {
    throw new AppError(401, 'Unauthorized')
  }

  const body = await c.req.json().catch(() => null)
  const parsed = mergeSchema.safeParse(body)
  if (!parsed.success) {
    throw new AppError(400, 'guest_id is required')
  }

  const userCart = await mergeGuestCart(db, user.id, parsed.data.guest_id)
  return c.json(await buildCartResponse(db, userCart))
})

export default cart
