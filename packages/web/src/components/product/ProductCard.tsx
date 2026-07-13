import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product, ProductImage } from '../../lib/api'
import { BlueprintPlaceholder } from '../ui/BlueprintPlaceholder'
import { useTranslation } from 'react-i18next'
import { resolveColorValue } from './ColorSelector'

interface ProductCardProps {
  product: Product & { images?: ProductImage[] }
  bgClass?: string
}

export function ProductCard({ product, bgClass = 'bg-cream' }: ProductCardProps) {
  const { t } = useTranslation()
  const [imageIndex, setImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
  const isSoldOut = totalStock === 0
  const priceDisplay = `฿${product.price.toLocaleString('th-TH')}`

  const colors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean))
  ) as string[]

  return (
    <Link
      to={`/products/${product.slug}`}
      className={`group block select-none hover:no-underline ${bgClass}`}
    >
      <div className="relative mb-3 aspect-3/4 overflow-hidden bg-white">
        <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between">
          {isSoldOut ? (
            <span className="font-body text-[11px] lowercase tracking-[-0.04em] text-red">
              {t('product.soldout').toLowerCase()}
            </span>
          ) : totalStock <= 15 ? (
            <span className="font-body text-[11px] lowercase tracking-[-0.04em] text-charcoal/55">
              {t('product.lowstock', { count: totalStock })}
            </span>
          ) : (
            <span className="font-body text-[11px] lowercase tracking-[-0.04em] text-charcoal/40">
              {t('product.available')}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className="cursor-pointer p-0.5 text-charcoal/40 transition-colors hover:text-charcoal"
            title="Favorite"
          >
            <svg
              className="h-3.5 w-3.5"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>

        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[imageIndex].url}
            alt={product.images[imageIndex].alt_text || product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <BlueprintPlaceholder
            title={product.name}
            subtitle={priceDisplay}
            aspectRatio="3/4"
            className="border-0 bg-transparent"
          />
        )}

        {product.images && product.images.length > 1 && (
          <div className="pointer-events-none absolute inset-x-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setImageIndex((prev) =>
                  prev === 0 ? product.images!.length - 1 : prev - 1
                )
              }}
              className="pointer-events-auto flex h-7 w-7 cursor-pointer items-center justify-center bg-cream/90 font-body text-xs text-charcoal transition-opacity hover:opacity-80"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setImageIndex((prev) =>
                  prev === product.images!.length - 1 ? 0 : prev + 1
                )
              }}
              className="pointer-events-auto flex h-7 w-7 cursor-pointer items-center justify-center bg-cream/90 font-body text-xs text-charcoal transition-opacity hover:opacity-80"
            >
              ›
            </button>
          </div>
        )}

        <div className="absolute right-3 bottom-3 z-10">
          {isSoldOut ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                alert(`${t('product.notify_me')}: ${product.name}`)
              }}
              className="flex h-7 w-7 cursor-pointer items-center justify-center text-charcoal/50 transition-colors hover:text-charcoal"
              title={t('product.notify_me')}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button>
          ) : (
            <span className="flex h-7 w-7 items-center justify-center font-body text-lg leading-none text-charcoal/40 transition-colors group-hover:text-charcoal">
              +
            </span>
          )}
        </div>
      </div>

      <div className="px-0.5 text-left">
        <h3 className="font-body text-[13px] font-medium lowercase leading-snug tracking-[-0.04em] text-charcoal md:text-sm">
          {product.name}
        </h3>
        <span className="mt-0.5 block font-body text-[12px] tracking-[-0.04em] text-charcoal/55 md:text-[13px]">
          {priceDisplay}
        </span>

        {colors.length > 0 && (
          <div className="mt-2.5 flex gap-1.5 select-none">
            {colors.map((color) => (
              <span
                key={color}
                className="inline-block h-2 w-2 border border-charcoal/15 transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: resolveColorValue(color) }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
