import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Product } from '../../lib/api'
import { useCart } from '../../lib/cart-context'
import { productProps, track } from '../../lib/analytics'
import { formatPrice } from '../../lib/format'
import { sortVariantsBySize } from '../../lib/sizes'
import { SizePill } from '../ui/SizePill'

interface UpsellCarouselProps {
  products: Product[]
  onNavigate?: () => void
}

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
      <path
        d={dir === 'left' ? 'M10 3 L5 8 L10 13' : 'M6 3 L11 8 L6 13'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function UpsellCard({ product, onNavigate }: { product: Product; onNavigate?: () => void }) {
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const [picking, setPicking] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const variants = sortVariantsBySize(product.variants ?? [])
  const available = variants.filter((variant) => variant.stock > 0)
  const name = i18n.language?.startsWith('th') && product.name_th ? product.name_th : product.name
  const image = product.images?.[0]

  async function add(variantId: string) {
    if (adding) return
    setAdding(true)
    setError('')
    try {
      await addItem(variantId, 1)
      const variant = variants.find((item) => item.id === variantId)
      track('item_added_to_cart', {
        ...productProps(product),
        size: variant?.size,
        sku: variant?.sku,
        quantity: 1,
        source: 'cart_drawer_upsell',
      })
      setPicking(false)
    } catch (err) {
      console.error('Failed to add upsell', err)
      setError(t('cart.add_error'))
    } finally {
      setAdding(false)
    }
  }

  function onAdd() {
    if (available.length === 1 && available[0]) {
      void add(available[0].id)
      return
    }
    setPicking((open) => !open)
  }

  return (
    <li className="flex w-[85%] shrink-0 snap-start gap-3 border border-charcoal/15 p-3 md:w-[88%]">
      <Link
        to={`/products/${product.slug}`}
        onClick={onNavigate}
        className="h-24 w-20 shrink-0 overflow-hidden bg-charcoal/5"
      >
        {image ? (
          <img
            src={image.url}
            alt={image.alt_text || name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : null}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          to={`/products/${product.slug}`}
          onClick={onNavigate}
          className="line-clamp-2 font-body text-[13px] font-medium lowercase tracking-[-0.04em] text-charcoal transition-opacity hover:opacity-70"
        >
          {name}
        </Link>
        <p className="mt-1 font-body text-[13px] tracking-[-0.04em] text-charcoal/60">
          {formatPrice(product.price)}
        </p>

        {picking ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {variants.map((variant) => (
              <SizePill
                key={variant.id}
                size={variant.size}
                status={variant.stock > 0 ? 'available' : 'soldout'}
                onClick={() => void add(variant.id)}
              />
            ))}
          </div>
        ) : (
          <button
            type="button"
            disabled={adding}
            onClick={onAdd}
            className="mt-auto self-end cursor-pointer bg-charcoal px-3 py-1.5 font-body text-[12px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {adding ? t('cart.upsell.adding') : t('cart.upsell.add')}
          </button>
        )}
        {error && (
          <p className="mt-1 font-body text-[11px] lowercase tracking-[-0.04em] text-red">{error}</p>
        )}
      </div>
    </li>
  )
}

export function UpsellCarousel({ products, onNavigate }: UpsellCarouselProps) {
  const { t } = useTranslation()
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onScroll = () => {
      const card = el.firstElementChild as HTMLElement | null
      if (!card) return
      const step = card.offsetWidth + 12
      setActive(Math.min(products.length - 1, Math.round(el.scrollLeft / step)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [products.length])

  if (products.length === 0) return null

  const scrollTo = (index: number) => {
    const el = trackRef.current
    const card = el?.children[index] as HTMLElement | undefined
    if (!el || !card) return
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' })
  }

  const arrowClass =
    'flex h-6 w-6 cursor-pointer items-center justify-center bg-charcoal text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30'

  return (
    <section aria-labelledby="cart-upsell-title" className="space-y-3">
      <div className="flex items-center gap-3">
        <h3
          id="cart-upsell-title"
          className="font-body text-[13px] font-bold lowercase tracking-[-0.04em] text-charcoal"
        >
          {t('cart.upsell.title')}
        </h3>
        {products.length > 1 && (
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-label={t('cart.upsell.prev')}
              disabled={active === 0}
              onClick={() => scrollTo(active - 1)}
              className={arrowClass}
            >
              <Arrow dir="left" />
            </button>
            <button
              type="button"
              aria-label={t('cart.upsell.next')}
              disabled={active >= products.length - 1}
              onClick={() => scrollTo(active + 1)}
              className={arrowClass}
            >
              <Arrow dir="right" />
            </button>
          </div>
        )}
      </div>

      <ul ref={trackRef} className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto">
        {products.map((product) => (
          <UpsellCard key={product.id} product={product} onNavigate={onNavigate} />
        ))}
      </ul>

      {products.length > 1 && (
        <div className="flex gap-1.5" aria-hidden="true">
          {products.map((product, index) => (
            <span
              key={product.id}
              className={`h-0.5 flex-1 transition-colors ${index === active ? 'bg-charcoal' : 'bg-charcoal/15'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
