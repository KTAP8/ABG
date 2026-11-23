import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useDragControls, type PanInfo } from 'framer-motion'
import { useUIStore } from '../../store/ui'
import { useCart } from '../../lib/cart-context'
import { quoteCheckout, type CheckoutQuote } from '../../lib/api'
import { track } from '../../lib/analytics'
import { FREE_SHIPPING_FALLBACK, SHIPPING_FEE_FALLBACK, formatPrice } from '../../lib/format'
import { useCartOpts, useCheckout } from '../../lib/use-checkout'
import { useRecommendations } from '../../lib/recommendations'
import { CartLineItem } from './CartLineItem'
import { FreeShippingBar } from './FreeShippingBar'
import { UpsellCarousel } from './UpsellCarousel'

type CloseMethod = 'backdrop' | 'button' | 'escape' | 'swipe' | 'navigate'

const DESKTOP_QUERY = '(min-width: 768px)'

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(DESKTOP_QUERY).matches,
  )
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setDesktop(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return desktop
}

export function CartDrawer() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { cartOpen, cartTrigger, closeCart } = useUIStore()
  const { items, itemCount, subtotal, loading } = useCart()
  const cartOpts = useCartOpts()
  const checkout = useCheckout()
  const isDesktop = useIsDesktop()
  const dragControls = useDragControls()
  const panelRef = useRef<HTMLDivElement>(null)
  const [quote, setQuote] = useState<CheckoutQuote | null>(null)

  const close = (method: CloseMethod) => {
    if (!useUIStore.getState().cartOpen) return
    track('cart_drawer_closed', { method })
    closeCart()
  }

  // Analytics + focus on open.
  useEffect(() => {
    if (!cartOpen) return
    track('cart_drawer_opened', { trigger: cartTrigger, item_count: itemCount, subtotal })
    panelRef.current?.focus()
    // Only on the open transition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartOpen])

  // Close when the route changes (e.g. a link inside the drawer, or browser back).
  const lastPath = useRef(pathname)
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    close('navigate')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Escape + body scroll lock.
  useEffect(() => {
    if (!cartOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close('escape')
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartOpen])

  // Server quote so bundle discounts count toward free shipping.
  useEffect(() => {
    if (!cartOpen || itemCount === 0) {
      setQuote(null)
      return
    }
    let cancelled = false
    quoteCheckout(undefined, cartOpts())
      .then((next) => {
        if (!cancelled) setQuote(next)
      })
      .catch(() => {
        if (!cancelled) setQuote(null)
      })
    return () => {
      cancelled = true
    }
  }, [cartOpen, items, itemCount, cartOpts])

  const threshold = quote?.freeShippingThreshold ?? FREE_SHIPPING_FALLBACK
  const remaining = quote?.freeShippingRemaining ?? Math.max(0, threshold - subtotal)
  const shipping = quote?.shipping ?? (remaining === 0 ? 0 : SHIPPING_FEE_FALLBACK)
  const total = quote?.total ?? subtotal + shipping

  // Fire once when the shopper crosses the threshold while the drawer is open.
  const prevRemaining = useRef<number | null>(null)
  useEffect(() => {
    if (!cartOpen || !quote) {
      prevRemaining.current = null
      return
    }
    if (prevRemaining.current !== null && prevRemaining.current > 0 && remaining === 0) {
      track('free_shipping_reached', { subtotal: quote.subtotal })
    }
    prevRemaining.current = remaining
  }, [cartOpen, quote, remaining])

  const recommendations = useRecommendations(items, remaining, cartOpen)

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) close('swipe')
  }

  const hidden = isDesktop ? { x: '100%', y: 0 } : { x: 0, y: '100%' }

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-charcoal/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => close('backdrop')}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col border-t border-charcoal/15 bg-cream outline-none md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[440px] md:border-l md:border-t-0"
            initial={hidden}
            animate={{ x: 0, y: 0 }}
            exit={hidden}
            transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
            drag={isDesktop ? false : 'y'}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
          >
            {/* Header (drag handle on mobile) */}
            <div
              className="shrink-0 touch-none border-b border-charcoal/15 px-5 pb-4 pt-3 md:px-6 md:pt-5"
              onPointerDown={(event) => {
                if (!isDesktop) dragControls.start(event)
              }}
            >
              <div className="mx-auto mb-3 h-1 w-10 bg-charcoal/20 md:hidden" aria-hidden="true" />
              <div className="flex items-center justify-between">
                <h2
                  id="cart-drawer-title"
                  className="font-body text-[13px] font-bold lowercase tracking-[-0.04em] text-charcoal"
                >
                  {t('cart.drawer.title', { count: itemCount })}
                </h2>
                <button
                  type="button"
                  onClick={() => close('button')}
                  onPointerDown={(event) => event.stopPropagation()}
                  aria-label={t('modal.close')}
                  className="cursor-pointer p-1 text-charcoal/55 transition-opacity hover:text-charcoal"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
                    <path d="M2 2 L14 14 M14 2 L2 14" fill="none" stroke="currentColor" strokeWidth="1.25" />
                  </svg>
                </button>
              </div>
              {itemCount > 0 && (
                <div className="mt-4">
                  <FreeShippingBar threshold={threshold} remaining={remaining} />
                </div>
              )}
            </div>

            {/* Scrollable body */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 md:px-6">
              {loading ? (
                <p className="py-10 font-body text-sm lowercase tracking-[-0.04em] text-charcoal/50">
                  {t('product.loading')}
                </p>
              ) : itemCount === 0 ? (
                <div className="space-y-5 py-10">
                  <p className="font-body text-sm lowercase tracking-[-0.04em] text-charcoal/60">
                    {t('cart.empty')}
                  </p>
                  <Link
                    to="/products"
                    onClick={() => close('navigate')}
                    className="inline-block bg-charcoal px-5 py-3 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80"
                  >
                    {t('nav.products')}
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-charcoal/15">
                  {items.map((item) => (
                    <CartLineItem key={item.id} item={item} compact onNavigate={() => close('navigate')} />
                  ))}
                </ul>
              )}

              {recommendations.length > 0 && (
                <div className="border-t border-charcoal/15 py-5">
                  <UpsellCarousel products={recommendations} onNavigate={() => close('navigate')} />
                </div>
              )}
            </div>

            {/* Sticky footer */}
            {itemCount > 0 && (
              <div className="shrink-0 space-y-3 border-t border-charcoal/15 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 md:px-6">
                {(quote?.discount ?? 0) > 0 && (
                  <div className="flex items-baseline justify-between font-body text-[12px] lowercase tracking-[-0.04em]">
                    <span className="text-charcoal/60">{t('cart.discount')}</span>
                    <span className="text-red">−{formatPrice(quote?.discount ?? 0)}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between font-body text-[12px] lowercase tracking-[-0.04em]">
                  <span className="text-charcoal/60">{t('cart.shipping')}</span>
                  <span className="text-charcoal">
                    {shipping === 0 ? t('cart.shipping_free') : formatPrice(shipping)}
                  </span>
                </div>
                {checkout.error && (
                  <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-red">
                    {checkout.error}
                  </p>
                )}
                <button
                  type="button"
                  disabled={checkout.loading || checkout.hasSoldOut}
                  onClick={() => void checkout.start({ total, source: 'drawer' })}
                  className="flex w-full cursor-pointer items-center justify-between bg-charcoal px-5 py-4 font-body text-[14px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="font-bold">{t('cart.checkout')}</span>
                  <span>{formatPrice(total)} →</span>
                </button>
                <Link
                  to="/cart"
                  onClick={() => close('navigate')}
                  className="block text-center font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/60 underline underline-offset-2 transition-opacity hover:text-charcoal"
                >
                  {t('cart.drawer.view_cart')}
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
