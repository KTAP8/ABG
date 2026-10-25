import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useCart } from '../lib/cart-context'
import { useAuth } from '../lib/auth-context'
import { createCheckoutSession, quoteCheckout } from '../lib/api'
import { getGuestId } from '../lib/guest-id'

const FREE_SHIPPING_AT = 900
const SHIPPING_FEE = 50

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
  const { items, itemCount, subtotal, loading, updateQuantity, removeItem } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)
  const [quotedShipping, setQuotedShipping] = useState<number | null>(null)
  const [formError, setFormError] = useState('')
  const [applying, setApplying] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)

  const cartOpts = () => ({
    signedIn: Boolean(user?.id),
    guestId: user?.id ? null : getGuestId(),
  })

  useEffect(() => {
    if (!appliedCode) return
    let cancelled = false
    void quoteCheckout(appliedCode, cartOpts())
      .then((quote) => {
        if (cancelled) return
        setDiscount(quote.discount)
        setQuotedShipping(quote.shipping)
      })
      .catch((err) => {
        if (cancelled) return
        setAppliedCode(null)
        setDiscount(0)
        setQuotedShipping(null)
        setFormError(errorText(t, err))
      })
    return () => {
      cancelled = true
    }
  }, [appliedCode, subtotal, user?.id, t])

  const nameFor = (item: (typeof items)[number]) => {
    if (i18n.language?.startsWith('th') && item.product_name_th) {
      return item.product_name_th
    }
    return item.product_name
  }

  const afterDiscount = Math.max(0, subtotal - discount)
  const shipping = quotedShipping ?? (afterDiscount >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE)
  const total = afterDiscount + shipping
  const hasSoldOut = items.some((item) => item.sold_out)

  const applyCoupon = async () => {
    const code = couponInput.trim()
    if (!code) return
    setApplying(true)
    setFormError('')
    try {
      const quote = await quoteCheckout(code, cartOpts())
      setAppliedCode(code)
      setDiscount(quote.discount)
      setQuotedShipping(quote.shipping)
    } catch (err) {
      setAppliedCode(null)
      setDiscount(0)
      setQuotedShipping(null)
      setFormError(errorText(t, err))
    } finally {
      setApplying(false)
    }
  }

  const clearCoupon = () => {
    setAppliedCode(null)
    setCouponInput('')
    setDiscount(0)
    setQuotedShipping(null)
    setFormError('')
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
                <span className="font-body text-lg tracking-[-0.04em] text-charcoal">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {appliedCode ? (
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="font-body text-sm lowercase tracking-[-0.04em] text-charcoal/60">
                      {t('cart.discount')} ({appliedCode})
                    </span>
                    <span className="font-body text-sm tracking-[-0.04em] text-charcoal">
                      −{formatPrice(discount)}
                    </span>
                  </div>
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
                <span className="font-body text-sm lowercase tracking-[-0.04em] text-charcoal">
                  {t('cart.total')}
                </span>
                <span className="font-body text-lg tracking-[-0.04em] text-charcoal">
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
      <Footer />
    </div>
  )
}
