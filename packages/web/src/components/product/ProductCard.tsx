import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product, ProductImage } from '../../lib/api'
import { BlueprintPlaceholder } from '../ui/BlueprintPlaceholder'
import { useTranslation } from 'react-i18next'
import { resolveColorValue } from './ColorSelector'
import { useCart } from '../../lib/cart-context'

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

  async function addToCart() {
    if (!selectedId || adding) return
    setAdding(true)
    setAddError('')
    try {
      await addItem(selectedId, 1)
    } catch (err) {
      console.error('Failed to add from shop card', err)
      setAddError(t('cart.add_error'))
    } finally {
      setAdding(false)
    }
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
        {inStock.length > 1 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {inStock.map((variant) => {
              const selected = selectedId === variant.id
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedId(variant.id)}
                  className={`cursor-pointer border px-2 py-1 font-body text-[11px] lowercase tracking-[-0.04em] ${
                    selected
                      ? 'border-charcoal bg-charcoal text-cream'
                      : 'border-charcoal/20 text-charcoal'
                  }`}
                >
                  {variant.size}
                </button>
              )
            })}
          </div>
        )}
        <button
          type="button"
          disabled={isSoldOut || !selectedId || adding}
          onClick={() => void addToCart()}
          className="w-full cursor-pointer bg-charcoal px-3 py-2.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:bg-charcoal/10 disabled:text-charcoal/40"
        >
          {isSoldOut ? t('product.soldout') : adding ? t('product.loading') : t('product.add_to_cart')}
        </button>
        {addError && (
          <p className="mt-1 font-body text-[12px] lowercase tracking-[-0.04em] text-red">{addError}</p>
        )}
      </div>
    )}
    </div>
  )
}
