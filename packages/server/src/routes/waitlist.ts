import { Hono } from 'hono'
import { waitlist } from '../lib/schema'
import { z } from 'zod'
import type { Env } from '../types'

const router = new Hono<Env>()

const WaitlistInputSchema = z.object({
  email: z.string().email(),
  drop_id: z.string().uuid().optional(),
  phone: z.string().optional(),
  campus: z.string().optional(),
})

router.post('/', async (c) => {
  const db = c.get('db')
  const body = await c.req.json()
  const parsed = WaitlistInputSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', issues: parsed.error.issues }, 400)
  }

  const { email, drop_id, phone, campus } = parsed.data

  try {
    await db.insert(waitlist).values({
      email,
      drop_id: drop_id || null,
      phone: phone || null,
      campus: campus || null,
    })
  } catch {
    // Unique constraint violation: treat as success
  }

  return c.json({ success: true, message: 'Added to waitlist' })
})

export default router
