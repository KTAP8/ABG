import { Hono } from 'hono'
import { AppError } from '../middleware/errorHandler'
import { sendDailyPackDigest, telegramBearerMatches } from '../lib/packDigest'
import type { Env } from '../types'

const router = new Hono<Env>()

router.post('/pack-digest', async (c) => {
  const token = c.env.TELEGRAM_BOT_TOKEN?.trim()
  if (!token) throw new AppError(503, 'telegram_not_configured')
  const allowed = await telegramBearerMatches(c.req.header('Authorization'), token)
  if (!allowed) throw new AppError(401, 'Unauthorized')
  return c.json(await sendDailyPackDigest(c.env))
})

export default router
