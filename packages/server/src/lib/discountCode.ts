import { customAlphabet } from 'nanoid'
import { eq } from 'drizzle-orm'
import type { Db } from './db'
import { iykyk_signups } from './schema'
import { AppError } from '../middleware/errorHandler'

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const generateCode = customAlphabet(ALPHABET, 8)
const MAX_ATTEMPTS = 5

export function generateDiscountCode(): string {
  return generateCode()
}

export async function insertSignupWithUniqueCode(
  db: Db,
  data: { name: string; email: string; ig_handle?: string }
): Promise<{ id: string; discount_code: string; discount_amount: number }> {
  const existing = await db
    .select({ id: iykyk_signups.id })
    .from(iykyk_signups)
    .where(eq(iykyk_signups.email, data.email))
    .limit(1)

  if (existing.length > 0) {
    throw new AppError(409, 'This email has already claimed a code')
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const code = generateDiscountCode()
      const result = await db
        .insert(iykyk_signups)
        .values({
          name: data.name,
          email: data.email,
          ig_handle: data.ig_handle,
          discount_code: code,
          discount_amount: 50,
        })
        .returning({
          id: iykyk_signups.id,
          discount_code: iykyk_signups.discount_code,
          discount_amount: iykyk_signups.discount_amount,
        })

      if (result.length === 0) {
        throw new Error('Insert returned empty result')
      }

      return result[0]
    } catch (error: unknown) {
      const err = error as any
      if (attempt < MAX_ATTEMPTS - 1 && err?.message?.includes('iykyk_signups_discount_code_unique')) {
        continue
      }
      throw error
    }
  }

  throw new AppError(500, 'Could not generate a unique code, please try again')
}
