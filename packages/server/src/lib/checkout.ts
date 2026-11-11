import { and, asc, eq, inArray, sql } from 'drizzle-orm'
import {
  cart_items,
  coupons,
  order_items,
  order_surveys,
  orders,
  product_images,
  product_variants,
  products,
  user_profiles,
} from './schema'
import type { Db } from './db'
import { AppError } from '../middleware/errorHandler'
import type { CartIdentity } from './cart'
import { findCart } from './cart'
import { createStripe, integrationIdentifier } from './stripe'
import { createEmailClient, sendOrderConfirmationEmail } from './email'
import type { Analytics } from './analytics'
import type Stripe from 'stripe'

export const FREE_SHIPPING_THRESHOLD = 1000
export const SHIPPING_FEE = 50
export const UNCOMMON_HENLEY_ID = '84c31f18-564d-49c5-8591-d93a78ff1b06'
export const PLUNGE_LONG_SLEEVE_ID = '081ab031-7177-4dfb-9be8-539ea77e4e97'
const PAIR_SAVE = 190
// Stripe rejects an expiry under 30 minutes from when it receives the request.
const CHECKOUT_HOLD_SECONDS = 31 * 60

export type CheckoutLine = {
  variantId: string
  productId: string
  quantity: number
  unitPrice: number
  productName: string
  size: string
  color: string | null
  stock: number
}

export type CheckoutQuote = {
  subtotal: number
  discount: number
  bundleDiscount: number
  couponDiscount: number
  couplePairs: number
  bestiePairs: number
  shipping: number
  total: number
  couponId: string | null
  lines: CheckoutLine[]
}

function shippingFor(merchandiseAfterDiscount: number) {
  return merchandiseAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}

export async function loadCartLines(db: Db, cartId: string): Promise<CheckoutLine[]> {
  const rows = await db
    .select({
      variantId: product_variants.id,
      productId: products.id,
      quantity: cart_items.quantity,
      unitPrice: products.price,
      productName: products.name,
      size: product_variants.size,
      color: product_variants.color,
      stock: product_variants.stock,
    })
    .from(cart_items)
    .innerJoin(product_variants, eq(cart_items.variant_id, product_variants.id))
    .innerJoin(products, eq(product_variants.product_id, products.id))
    .where(eq(cart_items.cart_id, cartId))

  return rows.map((row) => ({
    variantId: row.variantId,
    productId: row.productId,
    quantity: row.quantity,
    unitPrice: row.unitPrice,
    productName: row.productName,
    size: row.size,
    color: row.color,
    stock: row.stock ?? 0,
  }))
}

async function resolveCoupon(
  db: Db,
  cartId: string,
  code: string | undefined,
  subtotal: number,
): Promise<{ couponId: string | null; discount: number; freeShipping: boolean }> {
  const trimmed = code?.trim()
  if (!trimmed) return { couponId: null, discount: 0, freeShipping: false }

  const [coupon] = await db
    .select()
    .from(coupons)
    .where(sql`lower(${coupons.code}) = ${trimmed.toLowerCase()}`)
    .limit(1)

  if (!coupon) throw new AppError(400, 'coupon_invalid')

  const now = new Date()
  if (coupon.starts_at && coupon.starts_at > now) throw new AppError(400, 'coupon_invalid')
  if (coupon.expires_at && coupon.expires_at <= now) throw new AppError(400, 'coupon_invalid')
  if (!coupon.multi_use && coupon.used_at) throw new AppError(400, 'coupon_used')

  if (!coupon.multi_use) {
    const [held] = await db
      .select({ id: orders.id })
      .from(orders)
      .where(
        and(
          eq(orders.coupon_id, coupon.id),
          eq(orders.status, 'pending'),
          sql`${orders.cart_id} is distinct from ${cartId}`,
        ),
      )
      .limit(1)

    if (held) throw new AppError(400, 'coupon_used')
  }

  let discount = 0
  if (coupon.discount_amount != null) {
    discount = coupon.discount_amount
  } else if (coupon.discount_percent != null) {
    discount = Math.floor((subtotal * coupon.discount_percent) / 100)
    if (coupon.max_discount_amount != null) {
      discount = Math.min(discount, coupon.max_discount_amount)
    }
  }

  discount = Math.max(0, Math.min(discount, subtotal))
  return { couponId: coupon.id, discount, freeShipping: Boolean(coupon.free_shipping) }
}

export async function quoteCheckout(
  db: Db,
  identity: CartIdentity,
  couponCode?: string,
): Promise<{ cartId: string; quote: CheckoutQuote }> {
  const cart = await findCart(db, identity)
  if (!cart) throw new AppError(400, 'cart_empty')

  const lines = await loadCartLines(db, cart.id)
  if (lines.length === 0) throw new AppError(400, 'cart_empty')

  const heldByCart = new Map<string, number>()
  const pending = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.cart_id, cart.id), eq(orders.status, 'pending')))
  for (const order of pending) {
    const heldLines = await db
      .select({ variantId: order_items.variant_id, quantity: order_items.quantity })
      .from(order_items)
      .where(eq(order_items.order_id, order.id))
    for (const held of heldLines) {
      heldByCart.set(held.variantId, (heldByCart.get(held.variantId) ?? 0) + held.quantity)
    }
  }

  for (const line of lines) {
    const available = line.stock + (heldByCart.get(line.variantId) ?? 0)
    if (available <= 0 || line.quantity > available) {
      throw new AppError(409, 'sold_out')
    }
  }

  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  const { couplePairs, bestiePairs, bundleDiscount } = pairDiscount(lines)
  const merchandise = Math.max(0, subtotal - bundleDiscount)
  const { couponId, discount: couponDiscount, freeShipping } = await resolveCoupon(
    db,
    cart.id,
    couponCode,
    merchandise,
  )
  const discount = bundleDiscount + couponDiscount
  const afterDiscount = subtotal - discount
  const shipping = freeShipping ? 0 : shippingFor(afterDiscount)
  const total = afterDiscount + shipping

  if (total <= 0) throw new AppError(400, 'zero_total')

  return {
    cartId: cart.id,
    quote: {
      subtotal,
      discount,
      bundleDiscount,
      couponDiscount,
      couplePairs,
      bestiePairs,
      shipping,
      total,
      couponId,
      lines,
    },
  }
}

function pairDiscount(lines: CheckoutLine[]) {
  const quantityOf = (productId: string) =>
    lines.filter((line) => line.productId === productId).reduce((sum, line) => sum + line.quantity, 0)
  const couplePairs = Math.min(quantityOf(UNCOMMON_HENLEY_ID), quantityOf(PLUNGE_LONG_SLEEVE_ID))
  const bestiePairs = Math.floor((quantityOf(PLUNGE_LONG_SLEEVE_ID) - couplePairs) / 2)
  return { couplePairs, bestiePairs, bundleDiscount: (couplePairs + bestiePairs) * PAIR_SAVE }
}

async function decrementStock(db: Db, lines: CheckoutLine[]) {
  const held: CheckoutLine[] = []
  try {
    for (const line of lines) {
      const updated = await db
        .update(product_variants)
        .set({ stock: sql`${product_variants.stock} - ${line.quantity}` })
        .where(
          and(
            eq(product_variants.id, line.variantId),
            sql`${product_variants.stock} >= ${line.quantity}`,
          ),
        )
        .returning({ id: product_variants.id })

      if (!updated.length) throw new AppError(409, 'sold_out')
      held.push(line)
    }
  } catch (err) {
    await incrementStock(db, held)
    throw err
  }
}

async function incrementStock(db: Db, lines: { variantId: string; quantity: number }[]) {
  for (const line of lines) {
    await db
      .update(product_variants)
      .set({ stock: sql`${product_variants.stock} + ${line.quantity}` })
      .where(eq(product_variants.id, line.variantId))
  }
}

type ExpiredReason = 'timeout' | 'superseded' | 'stripe_error' | 'stock_failure'

type ExpiryTracking = { analytics: Analytics; analyticsId?: string; reason: ExpiredReason }

function trackExpired({ analytics, analyticsId, reason }: ExpiryTracking, orderId: string) {
  analytics.captureOrderEvent('order_expired', { orderId, analyticsId, properties: { reason } })
}

/** Restore stock only when this call is the one that moves pending → expired. */
export async function expireOrder(db: Db, orderId: string, tracking: ExpiryTracking) {
  const [expired] = await db
    .update(orders)
    .set({ status: 'expired', updated_at: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.status, 'pending')))
    .returning({ id: orders.id })

  if (!expired) return

  const items = await db
    .select({ variantId: order_items.variant_id, quantity: order_items.quantity })
    .from(order_items)
    .where(eq(order_items.order_id, orderId))

  await incrementStock(db, items)
  trackExpired(tracking, orderId)
}

async function expirePendingForCart(
  db: Db,
  cartId: string,
  analytics: Analytics,
  analyticsId?: string,
) {
  const pending = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.cart_id, cartId), eq(orders.status, 'pending')))

  for (const order of pending) {
    await expireOrder(db, order.id, { analytics, analyticsId, reason: 'superseded' })
  }
}

export async function createCheckoutSession(
  db: Db,
  identity: CartIdentity,
  env: {
    secretKey: string
    webUrl: string
    customerEmail?: string
    analytics: Analytics
    analyticsId?: string
  },
  couponCode?: string,
) {
  const { analytics, analyticsId } = env
  const cart = await findCart(db, identity)
  if (!cart) throw new AppError(400, 'cart_empty')
  await expirePendingForCart(db, cart.id, analytics, analyticsId)

  const { cartId, quote } = await quoteCheckout(db, identity, couponCode)

  const now = new Date()
  const [order] = await db
    .insert(orders)
    .values({
      cart_id: cartId,
      user_id: identity.userId ?? null,
      email: env.customerEmail ?? null,
      status: 'pending',
      subtotal: quote.subtotal,
      discount: quote.discount,
      shipping: quote.shipping,
      total: quote.total,
      coupon_id: quote.couponId,
      created_at: now,
      updated_at: now,
    })
    .returning()

  await db.insert(order_items).values(
    quote.lines.map((line) => ({
      order_id: order.id,
      variant_id: line.variantId,
      quantity: line.quantity,
      unit_price: line.unitPrice,
      product_name: line.productName,
      size: line.size,
      color: line.color,
      created_at: now,
    })),
  )

  try {
    await decrementStock(db, quote.lines)
  } catch (err) {
    await db
      .update(orders)
      .set({ status: 'expired', updated_at: new Date() })
      .where(eq(orders.id, order.id))
    trackExpired({ analytics, analyticsId, reason: 'stock_failure' }, order.id)
    throw err
  }

  const stripe = createStripe(env.secretKey)
  const webUrl = env.webUrl.replace(/\/$/, '')

  try {
    let stripeCouponId: string | undefined
    if (quote.discount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: quote.discount * 100,
        currency: 'thb',
        duration: 'once',
        max_redemptions: 1,
        name: couponCode?.trim() || 'discount',
      })
      stripeCouponId = stripeCoupon.id
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      integration_identifier: integrationIdentifier(),
      customer_email: env.customerEmail,
      success_url: `${webUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${webUrl}/cart?cancelled=1`,
      metadata: { order_id: order.id, ...(analyticsId ? { analytics_id: analyticsId } : {}) },
      client_reference_id: order.id,
      expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_HOLD_SECONDS,
      shipping_address_collection: { allowed_countries: ['TH'] },
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: quote.shipping === 0 ? 'Free shipping' : 'Shipping',
            fixed_amount: { amount: quote.shipping * 100, currency: 'thb' },
          },
        },
      ],
      line_items: quote.lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: 'thb',
          unit_amount: line.unitPrice * 100,
          product_data: {
            name: line.productName,
            description: [line.color, line.size].filter(Boolean).join(' / ') || undefined,
          },
        },
      })),
      ...(stripeCouponId ? { discounts: [{ coupon: stripeCouponId }] } : {}),
    })

    await db
      .update(orders)
      .set({ stripe_session_id: session.id, updated_at: new Date() })
      .where(eq(orders.id, order.id))

    if (!session.url) throw new AppError(500, 'stripe_not_configured')
    return { url: session.url, quote }
  } catch (err) {
    await expireOrder(db, order.id, { analytics, analyticsId, reason: 'stripe_error' })
    if (err instanceof AppError) throw err
    console.error('Stripe checkout session failed:', err)
    throw new AppError(502, 'stripe_not_configured')
  }
}

async function orderLines(db: Db, orderId: string) {
  const lines = await db
    .select({
      variantId: order_items.variant_id,
      quantity: order_items.quantity,
      unitPrice: order_items.unit_price,
      productName: order_items.product_name,
      size: order_items.size,
      color: order_items.color,
      productId: product_variants.product_id,
    })
    .from(order_items)
    .leftJoin(product_variants, eq(order_items.variant_id, product_variants.id))
    .where(eq(order_items.order_id, orderId))

  const productIds = [...new Set(lines.map((line) => line.productId).filter((id): id is string => Boolean(id)))]
  const images = productIds.length
    ? await db
        .select({
          productId: product_images.product_id,
          url: product_images.url,
        })
        .from(product_images)
        .where(inArray(product_images.product_id, productIds))
        .orderBy(asc(product_images.position))
    : []

  const firstImage = new Map<string, string>()
  for (const image of images) {
    if (image.productId && !firstImage.has(image.productId)) {
      firstImage.set(image.productId, image.url)
    }
  }

  return lines.map((line) => ({
    ...line,
    imageUrl: line.productId ? (firstImage.get(line.productId) ?? null) : null,
  }))
}

function addressFromSession(session: Stripe.Checkout.Session) {
  const details = session.collected_information?.shipping_details
  const address = details?.address
  return {
    shipping_name: details?.name ?? null,
    shipping_line1: address?.line1 ?? null,
    shipping_line2: address?.line2 ?? null,
    shipping_city: address?.city ?? null,
    shipping_state: address?.state ?? null,
    shipping_postal_code: address?.postal_code ?? null,
    shipping_country: address?.country ?? null,
    shipping_phone: session.customer_details?.phone ?? null,
    email: session.customer_details?.email ?? session.customer_email ?? null,
  }
}

/** Never throws: finalizePaid must still burn the coupon, clear the cart and send the email. */
async function trackPurchase(
  db: Db,
  order: typeof orders.$inferSelect,
  session: Stripe.Checkout.Session,
  analytics: Analytics,
) {
  try {
    const lines = await orderLines(db, order.id)
    analytics.captureOrderEvent('purchase_completed', {
      orderId: order.id,
      analyticsId: session.metadata?.analytics_id,
      properties: {
        revenue: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        currency: 'THB',
        item_count: lines.reduce((sum, line) => sum + line.quantity, 0),
        has_coupon: Boolean(order.coupon_id),
        product_ids: [
          ...new Set(lines.map((line) => line.productId).filter((id): id is string => Boolean(id))),
        ],
      },
    })
  } catch (err) {
    console.error('Purchase analytics failed:', err)
  }
}

async function finalizePaid(
  db: Db,
  orderId: string,
  session: Stripe.Checkout.Session,
  emailEnv: { apiKey?: string; from?: string },
  analytics: Analytics,
) {
  const snapshot = addressFromSession(session)
  const [paid] = await db
    .update(orders)
    .set({
      status: 'paid',
      email: snapshot.email,
      shipping_name: snapshot.shipping_name,
      shipping_line1: snapshot.shipping_line1,
      shipping_line2: snapshot.shipping_line2,
      shipping_city: snapshot.shipping_city,
      shipping_state: snapshot.shipping_state,
      shipping_postal_code: snapshot.shipping_postal_code,
      shipping_country: snapshot.shipping_country,
      shipping_phone: snapshot.shipping_phone,
      updated_at: new Date(),
    })
    .where(and(eq(orders.id, orderId), eq(orders.status, 'pending')))
    .returning()

  let order = paid
  if (!order) {
    const [existing] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
    if (!existing || existing.status === 'paid') return existing ?? null
    if (existing.status === 'expired') {
      const lines = await orderLines(db, orderId)
      try {
        await decrementStock(
          db,
          lines.map((line) => ({
            variantId: line.variantId,
            productId: '',
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            productName: line.productName,
            size: '',
            color: null,
            stock: line.quantity,
          })),
        )
      } catch (err) {
        console.error('Paid after expiry but stock could not be re-held:', err)
      }
      const [repaid] = await db
        .update(orders)
        .set({
          status: 'paid',
          email: snapshot.email ?? existing.email,
          shipping_name: snapshot.shipping_name,
          shipping_line1: snapshot.shipping_line1,
          shipping_line2: snapshot.shipping_line2,
          shipping_city: snapshot.shipping_city,
          shipping_state: snapshot.shipping_state,
          shipping_postal_code: snapshot.shipping_postal_code,
          shipping_country: snapshot.shipping_country,
          shipping_phone: snapshot.shipping_phone,
          updated_at: new Date(),
        })
        .where(and(eq(orders.id, orderId), eq(orders.status, 'expired')))
        .returning()
      order = repaid
    }
  }

  if (!order) return null

  // Past the early returns, so a redelivered webhook can't count a purchase twice.
  await trackPurchase(db, order, session, analytics)

  if (order.coupon_id) {
    await db
      .update(coupons)
      .set({ used_at: new Date() })
      .where(
        and(
          eq(coupons.id, order.coupon_id),
          eq(coupons.multi_use, false),
          sql`${coupons.used_at} is null`,
        ),
      )
  }

  if (order.cart_id) {
    await db.delete(cart_items).where(eq(cart_items.cart_id, order.cart_id))
  }

  const to = order.email
  if (to && emailEnv.apiKey && emailEnv.from) {
    try {
      const lines = await orderLines(db, order.id)
      const resend = createEmailClient(emailEnv.apiKey)
      await sendOrderConfirmationEmail(resend, emailEnv.from, to, {
        orderRef: order.id.slice(0, 8),
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        total: order.total,
        shipTo: {
          name: order.shipping_name,
          line1: order.shipping_line1,
          line2: order.shipping_line2,
          city: order.shipping_city,
          state: order.shipping_state,
          postalCode: order.shipping_postal_code,
          country: order.shipping_country,
          phone: order.shipping_phone,
        },
        items: lines.map((line) => ({
          name: line.productName,
          size: line.size,
          color: line.color,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          imageUrl: line.imageUrl,
        })),
      })
    } catch (err) {
      console.error('Order confirmation email failed:', err)
    }
  }

  return order
}

export async function handleCheckoutEvent(
  db: Db,
  event: Stripe.Event,
  emailEnv: { apiKey?: string; from?: string },
  analytics: Analytics,
) {
  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.expired') {
    return
  }

  const session = event.data.object as Stripe.Checkout.Session
  const orderId = session.metadata?.order_id ?? session.client_reference_id
  if (!orderId) return

  if (event.type === 'checkout.session.expired') {
    await expireOrder(db, orderId, {
      analytics,
      analyticsId: session.metadata?.analytics_id,
      reason: 'timeout',
    })
    return
  }

  if (session.payment_status !== 'paid') return
  await finalizePaid(db, orderId, session, emailEnv, analytics)
}

export async function customerEmailForUser(db: Db, userId: string | undefined, jwtEmail?: string) {
  if (!userId) return jwtEmail
  const [profile] = await db
    .select({ email: user_profiles.email })
    .from(user_profiles)
    .where(eq(user_profiles.user_id, userId))
    .limit(1)
  return profile?.email ?? jwtEmail
}

export async function getOrderBySession(db: Db, sessionId: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.stripe_session_id, sessionId))
    .limit(1)

  if (!order) return null

  const items = await db
    .select({
      product_name: order_items.product_name,
      size: order_items.size,
      color: order_items.color,
      quantity: order_items.quantity,
      unit_price: order_items.unit_price,
    })
    .from(order_items)
    .where(eq(order_items.order_id, order.id))

  return {
    status: order.status,
    email: order.email,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    items,
    survey: await surveyStatusForOrder(db, order.id, order.email),
  }
}

export const SURVEY_HANGOUT = ['home', 'cafe_main', 'cafe_niche', 'community', 'friend', 'campus'] as const
export const SURVEY_SILHOUETTE = ['oversize', 'baby', 'longsleeve', 'neckline'] as const
export const SURVEY_LINE = ['attitude', 'anti_graphic', 'scarcity', 'no_copy'] as const
export const SURVEY_NEXT_PIECE = ['top', 'sleeve', 'bottoms', 'object'] as const
export const SURVEY_HEARD_FROM = ['word', 'instagram', 'facebook', 'tiktok', 'line'] as const
export const SURVEY_AGE = ['18_22', '23_27', '28_34', '35_plus'] as const
export const SURVEY_LANGUAGE = ['en', 'th', 'either'] as const

export type OrderSurveyAnswers = {
  hangout?: (typeof SURVEY_HANGOUT)[number]
  silhouette?: (typeof SURVEY_SILHOUETTE)[number]
  line?: (typeof SURVEY_LINE)[number]
  next_piece?: (typeof SURVEY_NEXT_PIECE)[number]
  heard_from?: (typeof SURVEY_HEARD_FROM)[number]
  age_range?: (typeof SURVEY_AGE)[number]
  language?: (typeof SURVEY_LANGUAGE)[number]
}

async function surveyStatusForOrder(db: Db, orderId: string, email: string | null) {
  const [own] = await db
    .select({ status: order_surveys.status })
    .from(order_surveys)
    .where(eq(order_surveys.order_id, orderId))
    .limit(1)
  if (own) return { status: own.status }

  if (!email) return null

  const [other] = await db
    .select({ status: order_surveys.status })
    .from(order_surveys)
    .innerJoin(orders, eq(orders.id, order_surveys.order_id))
    .where(and(eq(orders.email, email), sql`${orders.id} <> ${orderId}::uuid`))
    .limit(1)
  if (other) return { status: other.status }
  return null
}

export async function saveOrderSurvey(
  db: Db,
  sessionId: string,
  answers: OrderSurveyAnswers,
  status: 'partial' | 'completed' | 'skipped',
) {
  const [order] = await db
    .select({ id: orders.id, email: orders.email, status: orders.status })
    .from(orders)
    .where(eq(orders.stripe_session_id, sessionId))
    .limit(1)
  if (!order) throw new AppError(404, 'order_not_found')
  if (order.status !== 'paid') throw new AppError(400, 'survey_not_ready')

  const [own] = await db
    .select({ id: order_surveys.id })
    .from(order_surveys)
    .where(eq(order_surveys.order_id, order.id))
    .limit(1)

  if (!own && order.email) {
    const [other] = await db
      .select({ id: order_surveys.id })
      .from(order_surveys)
      .innerJoin(orders, eq(orders.id, order_surveys.order_id))
      .where(and(eq(orders.email, order.email), sql`${orders.id} <> ${order.id}::uuid`))
      .limit(1)
    if (other) throw new AppError(400, 'survey_done')
  }

  const row = {
    hangout: answers.hangout ?? null,
    silhouette: answers.silhouette ?? null,
    line: answers.line ?? null,
    next_piece: answers.next_piece ?? null,
    heard_from: answers.heard_from ?? null,
    age_range: answers.age_range ?? null,
    language: answers.language ?? null,
    status,
    updated_at: new Date(),
  }

  if (own) {
    await db.update(order_surveys).set(row).where(eq(order_surveys.order_id, order.id))
  } else {
    await db.insert(order_surveys).values({ order_id: order.id, ...row })
  }

  return { status }
}
