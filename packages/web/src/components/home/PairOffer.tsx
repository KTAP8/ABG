import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../lib/cart-context'
import type { Product } from '../../lib/api'
import { productProps, track } from '../../lib/analytics'
import { useUIStore } from '../../store/ui'
import { ProductCard } from '../product/ProductCard'

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

/** A child component, because PairOffer can return null before any hook would run. */
function PairOfferImpression({ offer }: { offer: 'couple' | 'bestie' | 'both' }) {
  useEffect(() => {
    track('pair_offer_viewed', { offer })
  }, [offer])
  return null
}

export type PairOfferData = NonNullable<ReturnType<typeof getPairOffer>>

/** The his & hers pair, or null when it isn't in the catalog or can't be sold. */
export function getPairOffer(products: Product[]) {
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

  return { henley, plunge, henleySizes, plungeVariant, coupleReady, bestieReady }
}

/**
 * The pair shown inside the drop grid: the two product cards plus a combo panel,
 * laid out on the same columns as ProductGrid so it reads as part of the drop.
 */
export function PairOffer({ offer }: { offer: PairOfferData }) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const [busy, setBusy] = useState<'couple' | 'bestie' | null>(null)
  const [error, setError] = useState('')

  const { henley, plunge, henleySizes, plungeVariant, coupleReady, bestieReady } = offer
  const henleyProps = productProps(henley)
  const plungeProps = productProps(plunge)

  const coupleWas = henley.price + plunge.price
  const coupleNow = coupleWas - PAIR_SAVE
  const bestieNow = plunge.price * 2 - PAIR_SAVE
  const singleHenleySize = henleySizes.length === 1

  async function addCouple() {
    if (!plungeVariant || !singleHenleySize || busy) return
    setBusy('couple')
    setError('')
    try {
      // Tracked one at a time, because the second add can fail after the first succeeds.
      await addItem(henleySizes[0].id, 1)
      track('item_added_to_cart', {
        ...henleyProps,
        size: henleySizes[0].size,
        sku: henleySizes[0].sku,
        quantity: 1,
        source: 'pair_couple',
      })
      await addItem(plungeVariant.id, 1)
      track('item_added_to_cart', {
        ...plungeProps,
        size: plungeVariant.size,
        sku: plungeVariant.sku,
        quantity: 1,
        source: 'pair_couple',
      })
      setBusy(null)
      useUIStore.getState().openCart('add')
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
      track('item_added_to_cart', {
        ...plungeProps,
        size: plungeVariant.size,
        sku: plungeVariant.sku,
        quantity: 2,
        source: 'pair_bestie',
      })
      setBusy(null)
      useUIStore.getState().openCart('add')
    } catch (err) {
      console.error('Failed to add two plunges', err)
      setError(t('cart.add_error'))
      setBusy(null)
    }
  }

  const buttonClass =
    'cursor-pointer bg-charcoal px-4 py-2.5 text-center font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40'

  // Featured cards would span two columns and break the pair layout.
  const cards = [henley, plunge].map((product) => ({ ...product, shop_featured: false }))

  return (
    <div className="mb-3 grid grid-cols-2 gap-3 md:mb-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      <PairOfferImpression
        offer={coupleReady && bestieReady ? 'both' : coupleReady ? 'couple' : 'bestie'}
      />
      {cards.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      <aside className="col-span-2 flex flex-col justify-between border border-charcoal/15 p-5 md:col-span-1 md:p-6 lg:col-span-2">
        <div>
          <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
            {t('promo.his')} &amp; {t('promo.hers')}
          </p>
          <h3 className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-none tracking-[-0.07em] text-charcoal">
            {t('promo.name')}
          </h3>
          <p className="mt-3 max-w-sm font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
            {t('promo.line')}
          </p>
        </div>

        <div className="mt-6">
          {coupleReady && (
            <>
              <p className="font-display text-4xl font-bold leading-none tracking-[-0.07em] text-charcoal">
                {formatPrice(coupleNow)}
              </p>
              <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
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
                  className={`${buttonClass} mt-5 w-full`}
                >
                  {busy === 'couple' ? t('product.loading') : t('promo.add')}
                </button>
              ) : (
                <Link
                  to={`/products/${henley.slug}`}
                  className={`${buttonClass} mt-5 block w-full no-underline`}
                >
                  {t('promo.add')}
                </Link>
              )}
            </>
          )}

          {bestieReady && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => void addBestie()}
              className="mt-4 block cursor-pointer text-left font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/70 underline decoration-charcoal/30 underline-offset-4 transition-opacity hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
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
      </aside>
    </div>
  )
}
