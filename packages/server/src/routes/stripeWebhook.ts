import { Hono } from 'hono'
import { AppError } from '../middleware/errorHandler'
import { handleCheckoutEvent } from '../lib/checkout'
import { createStripe } from '../lib/stripe'
import type { Env } from '../types'

const stripeWebhook = new Hono<Env>()

stripeWebhook.post('/webhook', async (c) => {
  const secretKey = c.env.STRIPE_SECRET_KEY
  const webhookSecret = c.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret) {
    throw new AppError(500, 'stripe_not_configured')
  }

  const signature = c.req.header('stripe-signature')
  if (!signature) throw new AppError(400, 'missing_signature')

  const payload = await c.req.text()
  const stripe = createStripe(secretKey)

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook signature failed:', err)
    throw new AppError(400, 'invalid_signature')
  }

  await handleCheckoutEvent(c.get('db'), event, {
    apiKey: c.env.RESEND_API_KEY,
    from: c.env.RESEND_FROM_EMAIL,
  })

  return c.json({ received: true })
})

export default stripeWebhook
