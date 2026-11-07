import posthog, { type CaptureResult } from 'posthog-js'
import type { Product } from './api'

/**
 * The only module that talks to PostHog. It no-ops without VITE_POSTHOG_KEY.
 *
 * Consent model:
 * - pending or denied: anonymous, cookieless counts with no identity or replay
 * - granted: full tracking, identity and masked replay
 *
 * Never put email, name, phone, address, LINE ID, Instagram handle, coupon codes,
 * Stripe session IDs or guest IDs in an event.
 */

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const SETTINGS_EVENT = 'abg:consent-settings'
// The Stripe success URL carries a session ID that unlocks the buyer's order and email.
const REPLAY_BLOCKED_PATHS = ['/checkout/success']

export type ConsentStatus = 'granted' | 'denied' | 'pending'

export type AddSource = 'pdp' | 'listing' | 'pair_couple' | 'pair_bestie' | 'cart_upsell'

type ProductProps = {
  product_id: string
  slug: string
  name: string
  price: number
  category?: string
  gender?: string
  drop_id?: string
}

type EventMap = {
  product_viewed: ProductProps
  product_list_filtered: { category: string | null; gender: string | null }
  size_selected: { product_id: string; size: string; sku?: string; source: 'pdp' | 'listing' }
  size_guide_opened: { product_id: string; source: 'pdp' | 'listing' }
  item_added_to_cart: Partial<ProductProps> & {
    product_id: string
    quantity: number
    source: AddSource
    size?: string
    sku?: string
  }
  item_removed_from_cart: { product_id: string; quantity: number; size?: string }
  pair_offer_viewed: { offer: 'couple' | 'bestie' | 'both' }
  cart_upsell_responded: { accepted: boolean }
  coupon_applied: { success: boolean; error_code?: string }
  checkout_started: { value: number; currency: 'THB'; item_count: number; has_coupon: boolean }
  checkout_blocked: { error_code: string }
  checkout_cancelled: Record<string, never>
  survey_finished: {
    status: 'completed' | 'partial' | 'skipped'
    steps_answered: number
    persona?: string
  }
  waitlist_joined: { drop_id?: string }
  iykyk_signup_completed: Record<string, never>
  login_completed: { first_login: boolean }
  onboarding_finished: { skipped: boolean }
}

type PersonProps = {
  onboarding_completed: boolean
  heard_from?: string | null
  shop_for?: string | null
}

let enabled = false
let identity: { id: string; props: PersonProps } | null = null
let identifiedAs: string | null = null

function appEnv() {
  if (import.meta.env.DEV) return 'development'
  return window.location.hostname.endsWith('.abg-web.pages.dev') ? 'preview' : 'production'
}

function scrubString(value: string) {
  return value
    .replace(/([?&]session_id=)[^&#"\s]+/g, '$1redacted')
    .replace(/cs_(?:test|live)_[A-Za-z0-9]+/g, 'cs_redacted')
}

/** Walks keys as well as values, because heatmap data is keyed by page URL. */
function scrub<T>(value: T): T {
  if (typeof value === 'string') return scrubString(value) as T
  if (Array.isArray(value)) return value.map(scrub) as T
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [scrubString(key), scrub(item)]),
    ) as T
  }
  return value
}

function beforeSend(event: CaptureResult | null) {
  if (!event || event.event === '$snapshot') return event
  return {
    ...event,
    // Set per event because reset() clears registered super properties.
    properties: { ...scrub(event.properties), app_env: appEnv() },
    ...(event.$set ? { $set: scrub(event.$set) } : {}),
    ...(event.$set_once ? { $set_once: scrub(event.$set_once) } : {}),
  }
}

export function initAnalytics() {
  if (!POSTHOG_KEY || enabled) return
  enabled = true
  posthog.init(POSTHOG_KEY, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-08-30',
    // Together these make undecided visitors cookieless. With on_reject alone,
    // nothing is sent until the visitor chooses. The status stays "pending",
    // so the banner still shows.
    cookieless_mode: 'on_reject',
    opt_out_capturing_by_default: true,
    person_profiles: 'identified_only',
    // Started by syncReplay() once consent and the route allow it.
    disable_session_recording: true,
    session_recording: { maskAllInputs: true },
    before_send: beforeSend,
  })
}

export function isAnalyticsEnabled() {
  return enabled
}

export function getConsent(): ConsentStatus {
  return enabled ? posthog.get_explicit_consent_status() : 'pending'
}

function applyIdentity() {
  if (!identity || getConsent() !== 'granted') return
  const key = JSON.stringify(identity)
  if (key === identifiedAs) return
  posthog.identify(identity.id, identity.props)
  identifiedAs = key
}

/** Starts or stops replay for the current route and consent state. */
export function syncReplay() {
  if (!enabled) return
  const allowed =
    getConsent() === 'granted' && !REPLAY_BLOCKED_PATHS.includes(window.location.pathname)
  if (allowed) {
    if (!posthog.sessionRecordingStarted()) posthog.startSessionRecording()
  } else if (posthog.sessionRecordingStarted()) {
    posthog.stopSessionRecording()
  }
}

export function acceptAnalytics() {
  if (!enabled) return
  posthog.opt_in_capturing()
  applyIdentity()
  syncReplay()
}

export function declineAnalytics() {
  if (!enabled) return
  identifiedAs = null
  posthog.opt_out_capturing()
  syncReplay()
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(SETTINGS_EVENT))
}

export function onConsentSettingsOpened(listener: () => void) {
  window.addEventListener(SETTINGS_EVENT, listener)
  return () => window.removeEventListener(SETTINGS_EVENT, listener)
}

/** Remembered until consent is granted, so accepting later still links the account. */
export function identifyUser(id: string, props: PersonProps) {
  if (!enabled) return
  identity = { id, props }
  applyIdentity()
}

export function resetAnalyticsUser() {
  if (!enabled) return
  identity = null
  identifiedAs = null
  // Only consenting visitors are ever identified.
  if (getConsent() !== 'granted') return
  // reset() clears stored consent, so restore it or they silently become anonymous.
  posthog.reset()
  posthog.opt_in_capturing({ captureEventName: false })
  syncReplay()
}

/** Only sent when consent is granted, so a declined order is never tied to a person. */
export function getAnalyticsId() {
  if (!enabled || getConsent() !== 'granted') return undefined
  return posthog.get_distinct_id()
}

export function track<E extends keyof EventMap>(event: E, properties: EventMap[E]) {
  if (!enabled) return
  posthog.capture(event, properties)
}

export function productProps(product: Product): ProductProps {
  return {
    product_id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    category: product.category,
    gender: product.gender,
    drop_id: product.drop_id,
  }
}
