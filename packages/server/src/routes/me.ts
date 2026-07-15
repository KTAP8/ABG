import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { requireUser } from '../middleware/auth'
import { AppError } from '../middleware/errorHandler'
import { user_profiles, waitlist, drops } from '../lib/schema'
import type { Env } from '../types'

const heardFromSchema = z.enum(['ig', 'friend', 'facebook', 'found_myself'])
const shopForSchema = z.enum(['men', 'women', 'both'])
const notifyChannelSchema = z.enum(['email', 'line', 'both'])

const onboardingSchema = z.object({
  heard_from: heardFromSchema,
  shop_for: shopForSchema,
  notify_channel: notifyChannelSchema,
  email: z.string().email().optional(),
  display_name: z.string().min(1).max(120).optional(),
  line_id: z.string().max(120).optional(),
})

const patchProfileSchema = z.object({
  heard_from: heardFromSchema.optional(),
  shop_for: shopForSchema.optional(),
  notify_channel: notifyChannelSchema.optional(),
  display_name: z.string().min(1).max(120).nullable().optional(),
  line_id: z.string().max(120).nullable().optional(),
})

const me = new Hono<Env>()

me.use('*', requireUser)

me.get('/', async (c) => {
  const user = c.get('user')
  if (!user) {
    throw new AppError(401, 'Unauthorized')
  }
  const db = c.get('db')

  const [profile] = await db
    .select()
    .from(user_profiles)
    .where(eq(user_profiles.user_id, user.id))
    .limit(1)

  return c.json({
    user: {
      id: user.id,
      email: profile?.email ?? user.email ?? null,
      name: profile?.display_name ?? user.name ?? null,
    },
    profile: profile ?? null,
    needs_onboarding: !profile?.onboarding_completed_at,
  })
})

me.patch('/', async (c) => {
  const user = c.get('user')
  if (!user) {
    throw new AppError(401, 'Unauthorized')
  }
  const db = c.get('db')
  const body = await c.req.json().catch(() => null)
  const parsed = patchProfileSchema.safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, 'Invalid profile data')
  }

  const [existing] = await db
    .select()
    .from(user_profiles)
    .where(eq(user_profiles.user_id, user.id))
    .limit(1)

  const now = new Date()
  const data = parsed.data

  if (!existing) {
    const email = user.email
    if (!email) {
      throw new AppError(400, 'Email is required')
    }

    const heard_from = data.heard_from ?? null
    const shop_for = data.shop_for ?? null
    const notify_channel = data.notify_channel ?? null
    const complete = Boolean(heard_from && shop_for && notify_channel)

    const [profile] = await db
      .insert(user_profiles)
      .values({
        user_id: user.id,
        email,
        display_name: data.display_name ?? user.name ?? null,
        heard_from,
        shop_for,
        notify_channel,
        line_id: data.line_id ?? null,
        onboarding_completed_at: complete ? now : null,
        created_at: now,
        updated_at: now,
      })
      .returning()

    return c.json({ profile })
  }

  const nextHeard = data.heard_from !== undefined ? data.heard_from : existing.heard_from
  const nextShop = data.shop_for !== undefined ? data.shop_for : existing.shop_for
  const nextNotify =
    data.notify_channel !== undefined ? data.notify_channel : existing.notify_channel
  const complete = Boolean(nextHeard && nextShop && nextNotify)

  const [profile] = await db
    .update(user_profiles)
    .set({
      ...data,
      onboarding_completed_at: complete
        ? existing.onboarding_completed_at ?? now
        : existing.onboarding_completed_at,
      updated_at: now,
    })
    .where(eq(user_profiles.user_id, user.id))
    .returning()

  return c.json({ profile })
})

me.post('/onboarding', async (c) => {
  const user = c.get('user')
  if (!user) {
    throw new AppError(401, 'Unauthorized')
  }
  const db = c.get('db')
  const body = await c.req.json().catch(() => null)
  const parsed = onboardingSchema.safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, 'Invalid onboarding data')
  }

  const email = parsed.data.email ?? user.email
  if (!email) {
    throw new AppError(400, 'Email is required')
  }

  const now = new Date()
  const values = {
    user_id: user.id,
    email,
    display_name: parsed.data.display_name ?? user.name ?? null,
    heard_from: parsed.data.heard_from,
    shop_for: parsed.data.shop_for,
    notify_channel: parsed.data.notify_channel,
    line_id: parsed.data.line_id ?? null,
    onboarding_completed_at: now,
    created_at: now,
    updated_at: now,
  }

  const [profile] = await db
    .insert(user_profiles)
    .values(values)
    .onConflictDoUpdate({
      target: user_profiles.user_id,
      set: {
        email: values.email,
        display_name: values.display_name,
        heard_from: values.heard_from,
        shop_for: values.shop_for,
        notify_channel: values.notify_channel,
        line_id: values.line_id,
        onboarding_completed_at: values.onboarding_completed_at,
        updated_at: values.updated_at,
      },
    })
    .returning()

  // Soft-link: join active drop waitlist when notifying by email/LINE
  try {
    const [activeDrop] = await db
      .select({ id: drops.id })
      .from(drops)
      .where(eq(drops.is_active, true))
      .limit(1)

    if (activeDrop) {
      try {
        await db.insert(waitlist).values({
          email,
          drop_id: activeDrop.id,
          phone: parsed.data.line_id ?? null,
        })
      } catch {
        // Already on waitlist for this drop — fine
      }
    }
  } catch (err) {
    console.error('Waitlist upsert after onboarding failed:', err)
  }

  return c.json({ profile, needs_onboarding: false })
})

export default me
