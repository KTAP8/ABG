import { and, asc, eq } from 'drizzle-orm'
import {
  carts,
  cart_items,
  product_variants,
  products,
  product_images,
} from './schema'
import type { Db } from './db'
import { AppError } from '../middleware/errorHandler'

const GUEST_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function parseGuestId(raw: string | undefined | null): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  return GUEST_ID_RE.test(trimmed) ? trimmed : null
}

export type CartIdentity = {
  userId?: string
  guestId?: string | null
}

export type EnrichedCartItem = {
  id: string
  cart_id: string
  variant_id: string
  quantity: number
  available_stock: number
  size: string
  color: string | null
  sku: string | null
  product_id: string
  product_slug: string
  product_name: string
  product_name_th: string | null
  price: number
  image_url: string | null
  sold_out: boolean
}

export type CartResponse = {
  id: string | null
  items: EnrichedCartItem[]
  item_count: number
  subtotal: number
}

type CartRow = typeof carts.$inferSelect

/** Prefer user cart when signed in; otherwise guest cart. */
export async function findCart(db: Db, identity: CartIdentity): Promise<CartRow | null> {
  if (identity.userId) {
    const [row] = await db
      .select()
      .from(carts)
      .where(eq(carts.user_id, identity.userId))
      .limit(1)
    return row ?? null
  }

  if (identity.guestId) {
    const [row] = await db
      .select()
      .from(carts)
      .where(eq(carts.guest_id, identity.guestId))
      .limit(1)
    return row ?? null
  }

  return null
}

export async function getOrCreateCart(db: Db, identity: CartIdentity): Promise<CartRow> {
  const existing = await findCart(db, identity)
  if (existing) return existing

  if (identity.userId) {
    const [row] = await db
      .insert(carts)
      .values({ user_id: identity.userId, guest_id: null })
      .returning()
    return row
  }

  if (identity.guestId) {
    const [row] = await db
      .insert(carts)
      .values({ guest_id: identity.guestId, user_id: null })
      .returning()
    return row
  }

  throw new AppError(400, 'Cart identity required')
}

export async function enrichCartItems(db: Db, cartId: string): Promise<EnrichedCartItem[]> {
  const rows = await db
    .select({
      id: cart_items.id,
      cart_id: cart_items.cart_id,
      variant_id: cart_items.variant_id,
      quantity: cart_items.quantity,
      size: product_variants.size,
      color: product_variants.color,
      sku: product_variants.sku,
      stock: product_variants.stock,
      product_id: products.id,
      product_slug: products.slug,
      product_name: products.name,
      product_name_th: products.name_th,
      price: products.price,
    })
    .from(cart_items)
    .innerJoin(product_variants, eq(cart_items.variant_id, product_variants.id))
    .innerJoin(products, eq(product_variants.product_id, products.id))
    .where(eq(cart_items.cart_id, cartId))
    .orderBy(asc(cart_items.created_at))

  const enriched: EnrichedCartItem[] = []

  for (const row of rows) {
    const stock = row.stock ?? 0

    const images = await db
      .select({
        url: product_images.url,
        color: product_images.color,
        position: product_images.position,
      })
      .from(product_images)
      .where(eq(product_images.product_id, row.product_id))
      .orderBy(asc(product_images.position))

    const colorMatch = row.color
      ? images.find((img) => img.color && img.color.toLowerCase() === row.color!.toLowerCase())
      : undefined
    const imageUrl = colorMatch?.url ?? images[0]?.url ?? null

    enriched.push({
      id: row.id,
      cart_id: row.cart_id,
      variant_id: row.variant_id,
      quantity: row.quantity,
      available_stock: stock,
      size: row.size,
      color: row.color,
      sku: row.sku,
      product_id: row.product_id,
      product_slug: row.product_slug,
      product_name: row.product_name,
      product_name_th: row.product_name_th,
      price: row.price,
      image_url: imageUrl,
      sold_out: stock === 0,
    })
  }

  return enriched
}

export async function buildCartResponse(db: Db, cart: CartRow | null): Promise<CartResponse> {
  if (!cart) {
    return { id: null, items: [], item_count: 0, subtotal: 0 }
  }

  const items = await enrichCartItems(db, cart.id)
  const item_count = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return { id: cart.id, items, item_count, subtotal }
}

/**
 * POST add: increment existing line by delta, or insert.
 * Caps at available stock. Rejects sold-out.
 */
export async function addCartItem(
  db: Db,
  cartId: string,
  variantId: string,
  quantityDelta: number,
): Promise<void> {
  if (quantityDelta < 1) {
    throw new AppError(400, 'Quantity must be at least 1')
  }

  const [variant] = await db
    .select()
    .from(product_variants)
    .where(eq(product_variants.id, variantId))
    .limit(1)

  if (!variant) {
    throw new AppError(404, 'Variant not found')
  }

  const stock = variant.stock ?? 0
  if (stock <= 0) {
    throw new AppError(409, 'Variant is sold out')
  }

  const [existing] = await db
    .select()
    .from(cart_items)
    .where(and(eq(cart_items.cart_id, cartId), eq(cart_items.variant_id, variantId)))
    .limit(1)

  const now = new Date()

  if (existing) {
    const nextQty = Math.min(existing.quantity + quantityDelta, stock)
    await db
      .update(cart_items)
      .set({ quantity: nextQty, updated_at: now })
      .where(eq(cart_items.id, existing.id))
  } else {
    const qty = Math.min(quantityDelta, stock)
    await db.insert(cart_items).values({
      cart_id: cartId,
      variant_id: variantId,
      quantity: qty,
      created_at: now,
      updated_at: now,
    })
  }

  await db.update(carts).set({ updated_at: now }).where(eq(carts.id, cartId))
}

/** PATCH: set absolute quantity; 0 removes the line. */
export async function setCartItemQuantity(
  db: Db,
  cartId: string,
  itemId: string,
  quantity: number,
): Promise<void> {
  const [item] = await db
    .select()
    .from(cart_items)
    .where(and(eq(cart_items.id, itemId), eq(cart_items.cart_id, cartId)))
    .limit(1)

  if (!item) {
    throw new AppError(404, 'Cart item not found')
  }

  if (quantity <= 0) {
    await db.delete(cart_items).where(eq(cart_items.id, itemId))
    await db.update(carts).set({ updated_at: new Date() }).where(eq(carts.id, cartId))
    return
  }

  const [variant] = await db
    .select()
    .from(product_variants)
    .where(eq(product_variants.id, item.variant_id))
    .limit(1)

  if (!variant) {
    throw new AppError(404, 'Variant not found')
  }

  const stock = variant.stock ?? 0
  if (stock <= 0) {
    throw new AppError(409, 'Variant is sold out')
  }

  const nextQty = Math.min(quantity, stock)
  await db
    .update(cart_items)
    .set({ quantity: nextQty, updated_at: new Date() })
    .where(eq(cart_items.id, itemId))

  await db.update(carts).set({ updated_at: new Date() }).where(eq(carts.id, cartId))
}

export async function removeCartItem(db: Db, cartId: string, itemId: string): Promise<void> {
  const [item] = await db
    .select()
    .from(cart_items)
    .where(and(eq(cart_items.id, itemId), eq(cart_items.cart_id, cartId)))
    .limit(1)

  if (!item) {
    throw new AppError(404, 'Cart item not found')
  }

  await db.delete(cart_items).where(eq(cart_items.id, itemId))
  await db.update(carts).set({ updated_at: new Date() }).where(eq(carts.id, cartId))
}

export async function clearCartItems(db: Db, cartId: string): Promise<void> {
  await db.delete(cart_items).where(eq(cart_items.cart_id, cartId))
  await db.update(carts).set({ updated_at: new Date() }).where(eq(carts.id, cartId))
}

/**
 * Idempotent merge: move guest cart lines into user cart, then delete guest cart.
 * If no guest cart exists, returns user cart unchanged.
 */
export async function mergeGuestCart(db: Db, userId: string, guestId: string): Promise<CartRow> {
  const parsed = parseGuestId(guestId)
  if (!parsed) {
    throw new AppError(400, 'Invalid guest_id')
  }

  const userCart = await getOrCreateCart(db, { userId })

  const [guestCart] = await db
    .select()
    .from(carts)
    .where(eq(carts.guest_id, parsed))
    .limit(1)

  if (!guestCart) {
    return userCart
  }

  if (guestCart.id === userCart.id) {
    return userCart
  }

  const guestItems = await db
    .select()
    .from(cart_items)
    .where(eq(cart_items.cart_id, guestCart.id))

  const now = new Date()

  for (const guestItem of guestItems) {
    const [variant] = await db
      .select()
      .from(product_variants)
      .where(eq(product_variants.id, guestItem.variant_id))
      .limit(1)

    const stock = variant?.stock ?? 0
    if (stock <= 0) continue

    const [existing] = await db
      .select()
      .from(cart_items)
      .where(
        and(eq(cart_items.cart_id, userCart.id), eq(cart_items.variant_id, guestItem.variant_id)),
      )
      .limit(1)

    if (existing) {
      const nextQty = Math.min(existing.quantity + guestItem.quantity, stock)
      await db
        .update(cart_items)
        .set({ quantity: nextQty, updated_at: now })
        .where(eq(cart_items.id, existing.id))
    } else {
      await db.insert(cart_items).values({
        cart_id: userCart.id,
        variant_id: guestItem.variant_id,
        quantity: Math.min(guestItem.quantity, stock),
        created_at: now,
        updated_at: now,
      })
    }
  }

  await db.delete(carts).where(eq(carts.id, guestCart.id))
  await db.update(carts).set({ updated_at: now }).where(eq(carts.id, userCart.id))

  return userCart
}
