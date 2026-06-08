import { Router } from 'express'
import { db } from '../lib/db'
import { waitlist } from '../lib/schema'
import { z } from 'zod'

const router = Router()

const WaitlistInputSchema = z.object({
  email: z.string().email(),
  drop_id: z.string().uuid().optional(),
  phone: z.string().optional(),
  campus: z.string().optional(),
})

// POST /api/waitlist - add to waitlist
router.post('/', async (req, res, next) => {
  try {
    const parsed = WaitlistInputSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues })
    }

    const { email, drop_id, phone, campus } = parsed.data

    // Try to insert; handle unique constraint silently
    try {
      await db.insert(waitlist).values({
        email,
        drop_id: drop_id || null,
        phone: phone || null,
        campus: campus || null,
      })
    } catch (err) {
      // Unique constraint violation - treat as success (user already in waitlist)
    }

    res.json({ success: true, message: 'Added to waitlist' })
  } catch (error) {
    next(error)
  }
})

export default router
