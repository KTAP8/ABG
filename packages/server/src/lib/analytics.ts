import { PostHog } from 'posthog-node'

type AnalyticsEnv = { POSTHOG_KEY?: string; POSTHOG_HOST?: string }

export type OrderEvent = {
  orderId: string
  /** The browser's PostHog ID, present only if the shopper accepted analytics. */
  analyticsId?: string
  properties: Record<string, unknown>
}

export type Analytics = {
  captureOrderEvent: (event: string, details: OrderEvent) => void
}

/**
 * Sends server-side order events, and no-ops without POSTHOG_KEY. Delivery happens
 * in waitUntil, so analytics can't delay or fail a webhook.
 *
 * Without an analytics ID the event stays anonymous. Never fall back to
 * orders.user_id: that would tie a declined shopper's order to their identity.
 */
export function createAnalytics(
  env: AnalyticsEnv,
  waitUntil: (promise: Promise<unknown>) => void,
): Analytics {
  if (!env.POSTHOG_KEY) return { captureOrderEvent: () => {} }

  const client = new PostHog(env.POSTHOG_KEY, {
    host: env.POSTHOG_HOST ?? 'https://eu.i.posthog.com',
    // Workers can stop before a batch is sent, so send each event straight away.
    flushAt: 1,
    flushInterval: 0,
  })

  return {
    captureOrderEvent(event, { orderId, analyticsId, properties }) {
      const delivery = client
        .captureImmediate({
          distinctId: analyticsId ?? `order_${orderId}`,
          event,
          properties: {
            ...properties,
            order_id: orderId,
            ...(analyticsId ? {} : { $process_person_profile: false }),
          },
        })
        .catch((err) => console.error(`PostHog ${event} failed:`, err))
      waitUntil(delivery)
    },
  }
}
