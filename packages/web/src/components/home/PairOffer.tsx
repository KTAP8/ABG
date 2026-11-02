import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../lib/cart-context'
import type { Product } from '../../lib/api'

const UNCOMMON_HENLEY_ID = '84c31f18-564d-49c5-8591-d93a78ff1b06'
const PLUNGE_LONG_SLEEVE_ID = '081ab031-7177-4dfb-9be8-539ea77e4e97'
const PLUNGE_VARIANT_ID = 'a4b16246-91ac-441d-b9ed-f3b347b01257'
const PAIR_SAVE = 190

function formatPrice(price: number) {
  return `฿${price.toLocaleString('en-US')}`
}

function inStock(product: Product) {
  return (product.variants ?? []).filter((variant) => variant.stock > 0)
}

function stockOf(product: Product) {
  return (product.variants ?? []).reduce((sum, variant) => sum + variant.stock, 0)
}

export function PairOffer({ products }: { products: Product[] }) {
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [busy, setBusy] = useState<'couple' | 'bestie' | null>(null)
  const [error, setError] = useState('')

  const henley = products.find((product) => product.id === UNCOMMON_HENLEY_ID)
  const plunge = products.find((product) => product.id === PLUNGE_LONG_SLEEVE_ID)
  if (!henley || !plunge) return null

  const henleySizes = inStock(henley)
  const plungeSizes = inStock(plunge)
  const plungeVariant =
    plungeSizes.find((variant) => variant.id === PLUNGE_VARIANT_ID) ??
    (plungeSizes.length === 1 ? plungeSizes[0] : undefined)
  const coupleReady = henleySizes.length > 0 && Boolean(plungeVariant)
  const bestieReady = Boolean(plungeVariant) && stockOf(plunge) >= 2
  if (!coupleReady && !bestieReady) return null

  const nameFor = (product: Product) => {
    if (i18n.language?.startsWith('th') && product.name_th) return product.name_th
    return product.name
  }
  const coupleWas = henley.price + plunge.price
  const coupleNow = coupleWas - PAIR_SAVE
  const bestieNow = plunge.price * 2 - PAIR_SAVE
  const singleHenleySize = henleySizes.length === 1

  async function addCouple() {
    if (!plungeVariant || !singleHenleySize || busy) return
    setBusy('couple')
    setError('')
    try {
      await addItem(henleySizes[0].id, 1)
      await addItem(plungeVariant.id, 1)
      navigate('/cart')
    } catch (err) {
      console.error('Failed to add the pair', err)
      setError(t('cart.add_error'))
      setBusy(null)
    }
  }

  async function addBestie() {
    if (!plungeVariant || busy) return
    setBusy('bestie')
    setError('')
    try {
      await addItem(plungeVariant.id, 2)
      navigate('/cart')
    } catch (err) {
      console.error('Failed to add two plunges', err)
      setError(t('cart.add_error'))
      setBusy(null)
    }
  }

  const buttonClass =
    'cursor-pointer bg-charcoal px-4 py-2.5 text-center font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40'

  const shots = [
    { product: henley, caption: t('promo.his') },
    { product: plunge, caption: t('promo.hers') },
  ]

  return (
    <section className="w-full bg-cream px-6 pt-12 pb-4 md:px-8 md:pt-16 lg:px-[27px]">
      <div className="mx-auto w-full max-w-7xl lg:px-20 xl:px-32">
        <header className="mb-6 flex flex-col gap-6 md:mb-8 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-x-12 md:gap-y-3">
          <h2 className="max-w-xl font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.07em] text-charcoal md:col-start-1 md:row-start-1 md:self-end">
            {t('promo.name')}
          </h2>
          <p className="max-w-sm font-body text-[15px] leading-snug tracking-[-0.04em] text-charcoal/70 md:col-start-1 md:row-start-2 md:text-base">
            {t('promo.line')}
          </p>

          {coupleReady && (
            <>
              <p className="font-display text-4xl font-bold leading-none tracking-[-0.07em] text-charcoal md:col-start-2 md:row-start-1 md:self-end md:text-right">
                {formatPrice(coupleNow)}
              </p>
              <div className="md:col-start-2 md:row-start-2 md:text-right">
                <p className="flex flex-wrap items-baseline gap-x-3 md:justify-end">
                  <span className="font-body text-sm tracking-[-0.04em] text-charcoal/40 line-through">
                    {formatPrice(coupleWas)}
                  </span>
                  <span className="font-body text-sm tracking-[-0.04em] text-red">
                    −{formatPrice(PAIR_SAVE)}
                  </span>
                  <span className="font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/60">
                    {t('promo.shipping')}
                  </span>
                </p>
                {singleHenleySize ? (
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void addCouple()}
                    className={`${buttonClass} mt-4 w-full md:w-auto`}
                  >
                    {busy === 'couple' ? t('product.loading') : t('promo.add')}
                  </button>
                ) : (
                  <Link
                    to={`/products/${henley.slug}`}
                    className={`${buttonClass} mt-4 block w-full no-underline md:inline-block md:w-auto`}
                  >
                    {t('promo.add')}
                  </Link>
                )}
              </div>
            </>
          )}
        </header>

        <div className="grid grid-cols-2 items-start gap-3 md:gap-4">
          {shots.map(({ product, caption }) => {
            const image = product.images?.[0]
            return (
              <figure key={product.id}>
                <Link
                  to={`/products/${product.slug}`}
                  className="block overflow-hidden no-underline max-h-[58vw] md:max-h-[420px] lg:max-h-[460px]"
                >
                  {image ? (
                    <img
                      src={image.url}
                      alt={nameFor(product)}
                      className="block h-auto w-full"
                    />
                  ) : null}
                </Link>
                <figcaption className="mt-2 font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
                  {caption}
                </figcaption>
              </figure>
            )
          })}
        </div>

        {bestieReady && (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void addBestie()}
            className="mt-6 block cursor-pointer text-left font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/70 underline decoration-charcoal/30 underline-offset-4 transition-opacity hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy === 'bestie'
              ? t('product.loading')
              : t('promo.bestie', { price: formatPrice(bestieNow) })}
          </button>
        )}

        {!coupleReady && bestieReady && (
          <p className="mt-2 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/60">
            {t('promo.shipping')}
          </p>
        )}

        {error && (
          <p className="mt-2 font-body text-[12px] lowercase tracking-[-0.04em] text-red">{error}</p>
        )}
      </div>
    </section>
  )
}
