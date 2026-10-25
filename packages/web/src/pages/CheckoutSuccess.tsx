import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { getCheckoutOrder, type CheckoutOrder } from '../lib/api'

function formatPrice(price: number) {
  return `฿${price.toLocaleString('en-US')}`
}

export default function CheckoutSuccess() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [order, setOrder] = useState<CheckoutOrder | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sessionId) {
      setError(t('checkout.error.order_not_found'))
      return
    }

    let cancelled = false
    let attempts = 0

    const load = async () => {
      try {
        const next = await getCheckoutOrder(sessionId)
        if (cancelled) return
        setOrder(next)
        if (next.status === 'pending' && attempts < 5) {
          attempts += 1
          window.setTimeout(() => void load(), 2000)
        }
      } catch {
        if (!cancelled) setError(t('checkout.error.order_not_found'))
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [sessionId, t])

  const statusCopy =
    order?.status === 'paid'
      ? t('checkout.success.paid')
      : order?.status === 'expired'
        ? t('checkout.success.expired')
        : t('checkout.success.pending')

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 md:px-10 md:py-14">
        <h1 className="font-display text-3xl font-bold lowercase tracking-[-0.04em] text-charcoal md:text-4xl">
          {t('checkout.success.title')}
        </h1>
        <p className="mt-6 font-body text-sm lowercase tracking-[-0.04em] text-charcoal/70">
          {error || statusCopy}
        </p>

        {order && order.status === 'paid' && (
          <div className="mt-8 space-y-3 border-t border-charcoal/15 pt-6">
            {order.items.map((item) => (
              <div key={`${item.product_name}-${item.size}-${item.color}`} className="flex justify-between gap-4">
                <span className="font-body text-sm lowercase tracking-[-0.04em] text-charcoal">
                  {item.product_name}
                  {item.color || item.size ? ` / ${[item.color, item.size].filter(Boolean).join(' / ')}` : ''} ×{' '}
                  {item.quantity}
                </span>
                <span className="font-body text-sm tracking-[-0.04em] text-charcoal">
                  {formatPrice(item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-3">
              <span className="font-body text-sm lowercase tracking-[-0.04em] text-charcoal">
                {t('cart.total')}
              </span>
              <span className="font-body text-lg tracking-[-0.04em] text-charcoal">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        )}

        <Link
          to="/products"
          className="mt-10 inline-block border border-charcoal bg-charcoal px-5 py-3 font-body text-[13px] lowercase tracking-[-0.04em] text-cream"
        >
          {t('checkout.success.back')}
        </Link>
      </main>
      <Footer />
    </div>
  )
}
