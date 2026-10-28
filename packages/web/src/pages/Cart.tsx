import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useCart } from '../lib/cart-context'
import { useAuth } from '../lib/auth-context'
import { createCheckoutSession, quoteCheckout, type CheckoutQuote } from '../lib/api'
import { getGuestId } from '../lib/guest-id'

const FREE_SHIPPING_AT = 1000
const SHIPPING_FEE = 50
const UNCOMMON_HENLEY_ID = '84c31f18-564d-49c5-8591-d93a78ff1b06'
const PLUNGE_LONG_SLEEVE_ID = '081ab031-7177-4dfb-9be8-539ea77e4e97'
const PLUNGE_VARIANT_ID = 'a4b16246-91ac-441d-b9ed-f3b347b01257'
const PLUNGE_IMAGE = 'https://pub-127e329007874b38b388402427a3e27f.r2.dev/women-surplice/front.webp'
const PAIR_SAVE = 190

function formatPrice(price: number) {
  return `฿${price.toLocaleString('en-US')}`
}

function errorText(t: (key: string) => string, err: unknown) {
  const code = err instanceof Error ? err.message : ''
  const key = `checkout.error.${code}`
  const translated = t(key)
  return translated === key ? t('checkout.error.generic') : translated
}

export default function Cart() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { items, itemCount, subtotal, loading, updateQuantity, removeItem, addItem } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [quote, setQuote] = useState<CheckoutQuote | null>(null)
  const [formError, setFormError] = useState('')
  const [applying, setApplying] = useState(false)
  const [addingPlunge, setAddingPlunge] = useState(false)
  const [addonOpen, setAddonOpen] = useState(false)
  const [addonDismissed, setAddonDismissed] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)

  const cartOpts = () => ({
    signedIn: Boolean(user?.id),
    guestId: user?.id ? null : getGuestId(),
  })

  useEffect(() => {
    if (itemCount === 0) {
      setQuote(null)
      return
    }
    let cancelled = false
    void quoteCheckout(appliedCode ?? undefined, cartOpts())
      .then((next) => {
        if (!cancelled) setQuote(next)
      })
      .catch((err) => {
        if (cancelled) return
        if (appliedCode) {
          setAppliedCode(null)
          setFormError(errorText(t, err))
        }
        setQuote(null)
      })
    return () => {
      cancelled = true
    }
  }, [appliedCode, subtotal, itemCount, user?.id, t])

  const nameFor = (item: (typeof items)[number]) => {
    if (i18n.language?.startsWith('th') && item.product_name_th) {
      return item.product_name_th
    }
    return item.product_name
  }

  const discount = quote?.discount ?? 0
  const afterDiscount = Math.max(0, subtotal - discount)
  const shipping = quote?.shipping ?? (afterDiscount >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE)
  const total = afterDiscount + shipping
  const hasSoldOut = items.some((item) => item.sold_out)
  const quantityOf = (productId: string) =>
    items.filter((item) => item.product_id === productId).reduce((sum, item) => sum + item.quantity, 0)
  const showPlungeOffer = quantityOf(UNCOMMON_HENLEY_ID) > quantityOf(PLUNGE_LONG_SLEEVE_ID)

  useEffect(() => {
    if (!showPlungeOffer) {
      setAddonOpen(false)
      setAddonDismissed(false)
      return
    }
    if (!addonDismissed) setAddonOpen(true)
  }, [showPlungeOffer, addonDismissed])
  const couplePairs = quote?.couplePairs ?? 0
  const bestiePairs = quote?.bestiePairs ?? 0

  const applyCoupon = async () => {
    const code = couponInput.trim()
    if (!code) return
    setApplying(true)
    setFormError('')
    try {
      const next = await quoteCheckout(code, cartOpts())
      setAppliedCode(code)
      setQuote(next)
    } catch (err) {
      setFormError(errorText(t, err))
    } finally {
      setApplying(false)
    }
  }

  const clearCoupon = () => {
    setAppliedCode(null)
    setCouponInput('')
    setFormError('')
  }

  const dismissAddon = () => {
    setAddonOpen(false)
    setAddonDismissed(true)
  }

  const addPlunge = async () => {
    setAddingPlunge(true)
    setFormError('')
    try {
      await addItem(PLUNGE_VARIANT_ID, 1)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('cart.add_error'))
    } finally {
      setAddingPlunge(false)
    }
  }

  const checkout = async () => {
    if (hasSoldOut) {
      setFormError(t('checkout.error.sold_out'))
      return
    }
    setCheckingOut(true)
    setFormError('')
    try {
      const { url } = await createCheckoutSession(appliedCode ?? undefined, cartOpts())
      window.location.assign(url)
    } catch (err) {
      setFormError(errorText(t, err))
      setCheckingOut(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 md:px-10 md:py-14">
        <h1 className="font-display text-3xl font-bold lowercase tracking-[-0.04em] text-charcoal md:text-4xl">
          {t('cart.title')}
        </h1>

        {loading ? (
          <p className="mt-10 font-body text-sm lowercase tracking-[-0.04em] text-charcoal/50">
            {t('product.loading')}
          </p>
        ) : itemCount === 0 ? (
          <div className="mt-10 space-y-6">
            <p className="font-body text-base lowercase tracking-[-0.04em] text-charcoal/60">
              {t('cart.empty')}
            </p>
            <Link
              to="/products"
              className="inline-block border border-charcoal bg-charcoal px-5 py-3 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80"
            >
              {t('nav.products')}
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-0">
            <ul className="divide-y divide-charcoal/15 border-y border-charcoal/15">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5 md:gap-6">
                  <Link
                    to={`/products/${item.product_slug}`}
                    className="h-24 w-20 shrink-0 overflow-hidden bg-charcoal/5 md:h-28 md:w-24"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={nameFor(item)}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.product_slug}`}
                          className="font-body text-sm font-medium lowercase tracking-[-0.04em] text-charcoal transition-opacity hover:opacity-70"
                        >
                          {nameFor(item)}
                        </Link>
                        <p className="mt-1 font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
                          {[item.color, item.size].filter(Boolean).join(' / ')}
                        </p>
                        {item.sold_out && (
                          <p className="mt-1 font-body text-[12px] lowercase tracking-[-0.04em] text-red">
                            {t('cart.sold_out')}
                          </p>
                        )}
                      </div>
                      <p className="shrink-0 font-body text-sm tracking-[-0.04em] text-charcoal">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      <div className="flex items-center border border-charcoal/20">
                        <button
                          type="button"
                          className="cursor-pointer px-3 py-1.5 font-body text-sm text-charcoal transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
                          disabled={item.quantity <= 1 || item.sold_out}
                          aria-label={t('cart.quantity_decrease')}
                          onClick={() => void updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center font-body text-[13px] tracking-[-0.04em] text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="cursor-pointer px-3 py-1.5 font-body text-sm text-charcoal transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
                          disabled={
                            item.sold_out || item.quantity >= item.available_stock
                          }
                          aria-label={t('cart.quantity_increase')}
                          onClick={() => void updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cursor-pointer font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50 transition-opacity hover:opacity-70"
                        onClick={() => void removeItem(item.id)}
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-4 border-t border-charcoal/15 pt-6">
              <div className="flex items-baseline justify-between">
                <span className="font-body text-sm lowercase tracking-[-0.04em] text-charcoal/60">
                  {t('cart.subtotal')}
                </span>
                <span
                  className={`font-body text-lg tracking-[-0.04em] ${
                    (quote?.discount ?? 0) > 0
                      ? 'text-charcoal/40 line-through'
                      : 'text-charcoal'
                  }`}
                >
                  {formatPrice(subtotal)}
                </span>
              </div>

              {couplePairs > 0 && (
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-body text-sm lowercase tracking-[-0.04em] text-charcoal/60">
                    {t('cart.pair.couple')}
                    {couplePairs > 1 ? ` × ${couplePairs}` : ''}
                  </span>
                  <span className="shrink-0 font-body text-sm tracking-[-0.04em] text-red">
                    −{formatPrice(PAIR_SAVE * couplePairs)}
                  </span>
                </div>
              )}

              {bestiePairs > 0 && (
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-body text-sm lowercase tracking-[-0.04em] text-charcoal/60">
                    {t('cart.pair.bestie')}
                    {bestiePairs > 1 ? ` × ${bestiePairs}` : ''}
                  </span>
                  <span className="shrink-0 font-body text-sm tracking-[-0.04em] text-red">
                    −{formatPrice(PAIR_SAVE * bestiePairs)}
                  </span>
                </div>
              )}

              {appliedCode ? (
                <div className="space-y-2">
                  {(quote?.couponDiscount ?? 0) > 0 && (
                    <div className="flex items-baseline justify-between">
                      <span className="font-body text-sm lowercase tracking-[-0.04em] text-charcoal/60">
                        {t('cart.discount')} ({appliedCode})
                      </span>
                      <span className="font-body text-sm tracking-[-0.04em] text-red">
                        −{formatPrice(quote?.couponDiscount ?? 0)}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="cursor-pointer font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50"
                    onClick={clearCoupon}
                  >
                    {t('cart.coupon_remove')}
                  </button>
                </div>
              ) : (
                <form
                  className="flex gap-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    void applyCoupon()
                  }}
                >
                  <input
                    value={couponInput}
                    onChange={(event) => setCouponInput(event.target.value)}
                    placeholder={t('cart.coupon')}
                    className="min-w-0 flex-1 border border-charcoal/20 bg-cream px-3 py-2 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal outline-none placeholder:text-charcoal/40"
                  />
                  <button
                    type="submit"
                    disabled={applying || !couponInput.trim()}
                    className="cursor-pointer border border-charcoal px-4 py-2 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t('cart.coupon_apply')}
                  </button>
                </form>
              )}

              <div className="flex items-baseline justify-between">
                <span className="font-body text-sm lowercase tracking-[-0.04em] text-charcoal/60">
                  {t('cart.shipping')}
                </span>
                <span className="font-body text-sm tracking-[-0.04em] text-charcoal">
                  {shipping === 0 ? t('cart.shipping_free') : formatPrice(shipping)}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="font-body text-sm font-bold lowercase tracking-[-0.04em] text-charcoal">
                  {t('cart.total')}
                </span>
                <span className="font-body text-2xl font-bold tracking-[-0.04em] text-charcoal">
                  {formatPrice(total)}
                </span>
              </div>

              {formError && (
                <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-red">
                  {formError}
                </p>
              )}

              {!user && (
                <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
                  {t('cart.sign_in_prompt')}{' '}
                  <Link to="/login?redirect=/cart" className="underline underline-offset-2">
                    {t('nav.sign_in')}
                  </Link>
                </p>
              )}

              <button
                type="button"
                disabled={checkingOut || hasSoldOut}
                onClick={() => void checkout()}
                className="w-full cursor-pointer bg-charcoal px-5 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('cart.checkout')}
              </button>
            </div>
          </div>
        )}
      </main>
      {addonOpen && (
        <div className="animate-offer-backdrop fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 md:p-8">
          <div
            className="animate-offer-in grid max-h-[92svh] w-full max-w-3xl grid-cols-1 overflow-y-auto border border-charcoal bg-cream md:grid-cols-2 md:overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="plunge-offer-title"
          >
            <div className="relative h-[34svh] min-h-48 bg-cream md:h-auto md:min-h-[480px]">
              <img
                src={PLUNGE_IMAGE}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[center_32%]"
              />
            </div>
            <div className="flex flex-col justify-between px-6 py-6 md:px-8 md:py-8">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <p className="font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/55">
                    {t('cart.addon.question')}
                  </p>
                  <button
                    type="button"
                    onClick={dismissAddon}
                    aria-label={t('modal.close')}
                    className="cursor-pointer text-charcoal/55 transition-opacity hover:text-charcoal"
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
                      <path d="M2 2 L14 14 M14 2 L2 14" fill="none" stroke="currentColor" strokeWidth="1.25" />
                    </svg>
                  </button>
                </div>
                <h2
                  id="plunge-offer-title"
                  className="mt-6 font-display text-[clamp(1.75rem,3vw,2.4rem)] font-bold lowercase leading-[0.95] tracking-[-0.07em] text-charcoal"
                >
                  {t('cart.addon.offer')}
                </h2>
              </div>
              <div className="mt-8">
                <div className="flex items-end gap-3">
                  <p className="font-display text-6xl font-bold leading-none tracking-[-0.07em] text-red">
                    {t('cart.addon.price')}
                  </p>
                  <p className="mb-1 font-body text-sm lowercase tracking-[-0.04em] text-charcoal/40 line-through">
                    {t('cart.addon.was')}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={addingPlunge}
                  onClick={() => void addPlunge()}
                  className="mt-8 w-full cursor-pointer bg-charcoal px-5 py-4 font-body text-[15px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('cart.addon.add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
