import { customAlphabet } from 'nanoid'
import { eq } from 'drizzle-orm'
import type { Db } from './db'
import { coupons, iykyk_signups } from './schema'
import { AppError } from '../middleware/errorHandler'

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const generateCode = customAlphabet(ALPHABET, 8)
const MAX_ATTEMPTS = 5

export function generateDiscountCode(): string {
  return generateCode()
}

export type CouponRow = {
  id: string
  code: string
  discount_amount: number | null
  discount_percent: number | null
  max_discount_amount: number | null
}

async function insertUniqueCoupon(
  db: Db,
  values: {
    discount_amount?: number | null
    discount_percent?: number | null
    max_discount_amount?: number | null
    note?: string | null
  }
): Promise<CouponRow> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = generateDiscountCode()
    try {
      const result = await db
        .insert(coupons)
        .values({
          code,
          discount_amount: values.discount_amount ?? null,
          discount_percent: values.discount_percent ?? null,
          max_discount_amount: values.max_discount_amount ?? null,
          note: values.note ?? null,
        })
        .returning({
          id: coupons.id,
          code: coupons.code,
          discount_amount: coupons.discount_amount,
          discount_percent: coupons.discount_percent,
          max_discount_amount: coupons.max_discount_amount,
        })

      if (result.length === 0) {
        throw new Error('Insert returned empty result')
      }

      return result[0]
    } catch (error: unknown) {
      const err = error as { message?: string }
      if (attempt < MAX_ATTEMPTS - 1 && err?.message?.includes('coupons_code_unique')) {
        continue
      }
      throw error
    }
  }

  throw new AppError(500, 'Could not generate a unique coupon code')
}

/** IYKYK signup: create a 10% coupon, then link signup via FK. */
export async function insertSignupWithUniqueCode(
  db: Db,
  data: { name: string; email: string; ig_handle?: string }
): Promise<{
  id: string
  discount_code: string
  discount_amount: number
  discount_percent: number
}> {
  const existing = await db
    .select({ id: iykyk_signups.id })
    .from(iykyk_signups)
    .where(eq(iykyk_signups.email, data.email))
    .limit(1)

  if (existing.length > 0) {
    throw new AppError(409, 'This email has already claimed a code')
  }

  const coupon = await insertUniqueCoupon(db, {
    discount_percent: 10,
    note: 'iykyk signup',
  })

  try {
    const result = await db
      .insert(iykyk_signups)
      .values({
        name: data.name,
        email: data.email,
        ig_handle: data.ig_handle,
        coupon_id: coupon.id,
      })
      .returning({ id: iykyk_signups.id })

    if (result.length === 0) {
      throw new Error('Signup insert returned empty result')
    }

    return {
      id: result[0].id,
      discount_code: coupon.code,
      discount_amount: coupon.discount_amount ?? 0,
      discount_percent: coupon.discount_percent ?? 10,
    }
  } catch (error) {
    // Best-effort cleanup if signup fails after coupon insert
    await db.delete(coupons).where(eq(coupons.id, coupon.id))
    throw error
  }
}

export type BulkCoupon = {
  code: string
  discount_percent: number | null
  max_discount_amount: number | null
}

/** Pre-generate one-time percent coupons (no signup). */
export async function createBulkPercentCoupons(
  db: Db,
  options: {
    count: number
    discountPercent: number
    maxDiscountAmount: number
    note?: string
  }
): Promise<BulkCoupon[]> {
  const created: BulkCoupon[] = []

  for (let i = 0; i < options.count; i++) {
    const coupon = await insertUniqueCoupon(db, {
      discount_percent: options.discountPercent,
      max_discount_amount: options.maxDiscountAmount,
      note: options.note ?? null,
    })

    created.push({
      code: coupon.code,
      discount_percent: coupon.discount_percent,
      max_discount_amount: coupon.max_discount_amount,
    })
  }

  return created
}
