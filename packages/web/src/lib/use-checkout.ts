import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createCheckoutSession } from './api'
import { useAuth } from './auth-context'
import { useCart } from './cart-context'
import { getGuestId } from './guest-id'
import { getAnalyticsId, track } from './analytics'

export function checkoutErrorCode(err: unknown) {
  return err instanceof Error ? err.message : 'unknown'
}

export function checkoutErrorText(t: (key: string) => string, err: unknown) {
  const code = err instanceof Error ? err.message : ''
  const key = `checkout.error.${code}`
  const translated = t(key)
  return translated === key ? t('checkout.error.generic') : translated
}

export function useCartOpts() {
  const { user } = useAuth()
  return useCallback(
    () => ({
      signedIn: Boolean(user?.id),
      guestId: user?.id ? null : getGuestId(),
    }),
    [user?.id],
  )
}

interface StartCheckout {
  total: number
  couponCode?: string | null
  source: 'drawer' | 'cart_page'
}

/** Shared Stripe checkout flow for the cart page and the cart drawer. */
export function useCheckout() {
  const { t } = useTranslation()
  const { items, itemCount } = useCart()
  const cartOpts = useCartOpts()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hasSoldOut = items.some((item) => item.sold_out)

  const start = async ({ total, couponCode, source }: StartCheckout) => {
    if (hasSoldOut) {
      setError(t('checkout.error.sold_out'))
      track('checkout_blocked', { error_code: 'sold_out' })
      return
    }
    setLoading(true)
    setError('')
    track('checkout_started', {
      value: total,
      currency: 'THB',
      item_count: itemCount,
      has_coupon: Boolean(couponCode),
      source,
    })
    try {
      const { url } = await createCheckoutSession(couponCode ?? undefined, cartOpts(), getAnalyticsId())
      window.location.assign(url)
    } catch (err) {
      setError(checkoutErrorText(t, err))
      track('checkout_blocked', { error_code: checkoutErrorCode(err) })
      setLoading(false)
    }
  }

  return { start, loading, error, setError, hasSoldOut }
}
