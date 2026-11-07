import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product, ProductImage } from '../../lib/api'
import { BlueprintPlaceholder } from '../ui/BlueprintPlaceholder'
import { Modal } from '../ui/Modal'
import { useTranslation } from 'react-i18next'
import { resolveColorValue } from './ColorSelector'
import { useCart } from '../../lib/cart-context'
import { productProps, track } from '../../lib/analytics'
import {
  SizeGuideContent,
  hasStructuredSizeChart,
  productHasSizeGuide,
} from './SizeGuideContent'

interface ProductCardProps {
  product: Product & { images?: ProductImage[] }
  bgClass?: string
  showAddToCart?: boolean
}

export function ProductCard({ product, bgClass = 'bg-cream', showAddToCart = false }: ProductCardProps) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [sizeOpen, setSizeOpen] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [needsSize, setNeedsSize] = useState(false)

  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
  const isSoldOut = totalStock === 0
  const priceDisplay = `฿${product.price.toLocaleString('th-TH')}`
  const images = product.images ?? []
  const primary = images[0]
  const secondary = images[1]

  const colors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean))
  ) as string[]
  const inStock = (product.variants ?? []).filter((variant) => variant.stock > 0)
  const [selectedId, setSelectedId] = useState(inStock.length === 1 ? inStock[0].id : '')
  const showColorOnPill = colors.length > 1
  const hasGuide = productHasSizeGuide(product.size_guide, product.size_chart)

  function closeSizePrompt() {
    setSizeOpen(false)
    setShowGuide(false)
    setNeedsSize(false)
  }

  async function addToCart(variantId: string) {
    if (!variantId || adding) return
    setAdding(true)
    setAddError('')
    try {
      await addItem(variantId, 1)
      const variant = product.variants?.find((item) => item.id === variantId)
      track('item_added_to_cart', {
        ...productProps(product),
        size: variant?.size,
        sku: variant?.sku,
        quantity: 1,
        source: 'listing',
      })
      closeSizePrompt()
    } catch (err) {
      console.error('Failed to add from shop card', err)
      setAddError(t('cart.add_error'))
    } finally {
      setAdding(false)
    }
  }

  function onCardAdd() {
    if (isSoldOut || adding) return
    if (inStock.length === 1 && inStock[0]) {
      void addToCart(inStock[0].id)
      return
    }
    setAddError('')
    setSizeOpen(true)
  }

  function onModalAdd() {
    if (!selectedId) {
      setNeedsSize(true)
      return
    }
    void addToCart(selectedId)
  }

  return (
    <div className={`${bgClass}${product.shop_featured ? ' col-span-2 md:col-span-1 lg:col-span-2' : ''}`}>
    <Link
      to={`/products/${product.slug}`}
      className="group block select-none hover:no-underline"
    >
      <div className="relative mb-3 aspect-3/4 overflow-hidden">
        {primary ? (
          <>
            <img
              src={primary.url}
              alt={primary.alt_text || product.name}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            {secondary && (
              <img
                src={secondary.url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:opacity-0"
              />
            )}
          </>
        ) : (
          <BlueprintPlaceholder
            title={product.name}
            subtitle={priceDisplay}
            aspectRatio="3/4"
            className="border-0 bg-transparent"
          />
        )}
      </div>

      <div className="text-left">
        <h3 className="font-body text-[13px] font-medium lowercase leading-snug tracking-[-0.04em] text-charcoal md:text-sm">
          {product.name}
        </h3>
        <span className="mt-0.5 block font-body text-[12px] tracking-[-0.04em] text-charcoal md:text-[13px]">
          {priceDisplay}
        </span>
        {isSoldOut && !showAddToCart && (
          <span className="mt-1 block font-body text-[12px] lowercase tracking-[-0.04em] text-red">
            {t('product.soldout')}
          </span>
        )}

        {colors.length > 0 && (
          <div className="mt-2.5 flex gap-1.5 select-none">
            {colors.map((color) => (
              <span
                key={color}
                className="inline-block h-2 w-2 border border-charcoal/15"
                style={{ backgroundColor: resolveColorValue(color) }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
    {showAddToCart && (
      <div className="mt-3">
        <button
          type="button"
          disabled={isSoldOut || adding}
          onClick={onCardAdd}
          className="w-full cursor-pointer bg-charcoal px-3 py-2.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:bg-charcoal/10 disabled:text-charcoal/40"
        >
          {isSoldOut ? t('product.soldout') : adding ? t('product.loading') : t('product.add_to_cart')}
        </button>
        {addError && !sizeOpen && (
          <p className="mt-1 font-body text-[12px] lowercase tracking-[-0.04em] text-red">{addError}</p>
        )}
      </div>
    )}

    <Modal
      isOpen={sizeOpen}
      onClose={closeSizePrompt}
      title={t('product.select_variant')}
      maxWidthClass={showGuide && hasStructuredSizeChart(product.size_chart) ? 'max-w-3xl' : 'max-w-xl'}
    >
      <div className="space-y-5">
        <div>
          <div className={`flex flex-wrap gap-1.5 ${needsSize ? 'border border-red p-2' : ''}`}>
            {inStock.map((variant) => {
              const selected = selectedId === variant.id
              const label =
                showColorOnPill && variant.color
                  ? `${variant.size} / ${variant.color}`
                  : variant.size
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(variant.id)
                    setNeedsSize(false)
                    track('size_selected', {
                      product_id: product.id,
                      size: variant.size,
                      sku: variant.sku,
                      source: 'listing',
                    })
                  }}
                  className={`cursor-pointer border px-3 py-1.5 font-body text-[12px] lowercase tracking-[-0.04em] ${
                    selected
                      ? 'border-charcoal bg-charcoal text-cream'
                      : 'border-charcoal/20 text-charcoal hover:border-charcoal'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
          {needsSize && (
            <p className="mt-2 font-body text-[12px] lowercase tracking-[-0.04em] text-red">
              {t('product.select_variant')}
            </p>
          )}
        </div>

        {hasGuide && (
          <div>
            <button
              type="button"
              onClick={() => {
                if (!showGuide) {
                  track('size_guide_opened', { product_id: product.id, source: 'listing' })
                }
                setShowGuide(!showGuide)
              }}
              className="cursor-pointer font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/70 underline decoration-charcoal/30 underline-offset-4 hover:text-charcoal"
            >
              {showGuide ? t('product.sizeguide.hide') : t('product.sizeguide.title')}
            </button>
            {showGuide && (
              <div className="mt-4">
                <SizeGuideContent sizeGuide={product.size_guide} sizeChart={product.size_chart} />
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          disabled={adding}
          onClick={onModalAdd}
          className="w-full cursor-pointer bg-charcoal px-3 py-2.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {adding ? t('product.loading') : t('product.add_to_cart')}
        </button>
        {addError && (
          <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-red">{addError}</p>
        )}
      </div>
    </Modal>
    </div>
  )
}
