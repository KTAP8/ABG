import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../types'
import { insertSignupWithUniqueCode } from '../lib/discountCode'
import { createEmailClient, sendThankYouDiscountEmail } from '../lib/email'

const router = new Hono<Env>()

const IykykInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  ig_handle: z.string().optional(),
})

router.post('/', async (c) => {
  const db = c.get('db')
  const body = await c.req.json()
  const parsed = IykykInputSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', issues: parsed.error.issues }, 400)
  }

  const { name, email, ig_handle } = parsed.data

  const result = await insertSignupWithUniqueCode(db, { name, email, ig_handle })

  if (c.env.RESEND_API_KEY) {
    try {
      const resend = createEmailClient(c.env.RESEND_API_KEY)
      const fromEmail = c.env.RESEND_FROM_EMAIL || 'drop@abg.studio'
      await sendThankYouDiscountEmail(resend, fromEmail, email, {
        name,
        discountCode: result.discount_code,
        discountAmount: result.discount_amount,
      })
    } catch (err) {
      console.error('Failed to send confirmation email:', err)
    }
  }

  return c.json(
    {
      success: true,
      discount_code: result.discount_code,
      discount_amount: result.discount_amount,
    },
    201
  )
})

export default router
