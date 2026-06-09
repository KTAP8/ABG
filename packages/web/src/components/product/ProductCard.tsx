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
  const isWhite = bgClass.includes('white')
  const btnBgClass = isWhite ? 'bg-white' : 'bg-cream'
  const btnBgOpacityClass = isWhite ? 'bg-white/90' : 'bg-cream/90'
  const [imageIndex, setImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
  const isSoldOut = totalStock === 0

  const priceDisplay = `฿${product.price.toLocaleString('th-TH')}`

  // Extract unique colors from variant data
  const colors = Array.from(
    new Set(product.variants?.map(v => v.color).filter(Boolean))
  ) as string[]

  return (
    <Link 
      to={`/products/${product.slug}`} 
      className={`group block overflow-hidden hover:no-underline select-none transition-all duration-300 ${bgClass}`}
    >
      {/* Top half: Image / Carousel area */}
      <div className="relative w-full aspect-[3/4] p-4 flex flex-col justify-center items-center overflow-hidden border-b border-charcoal/10">
        
        {/* Absolute Header Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          {/* Status Indicator */}
          {isSoldOut ? (
            <span className="text-red font-mono text-[9px] font-bold tracking-wider flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 bg-red inline-block" />
              {t('product.soldout')}
            </span>
          ) : totalStock <= 15 ? (
            <span className="text-charcoal font-mono text-[9px] font-bold tracking-wider flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 bg-charcoal inline-block animate-pulse" />
              {totalStock} {t('product.lowstock').split('{{count}}')[1]?.trim() || 'LEFT'}
            </span>
          ) : (
            <span className="text-charcoal opacity-60 font-mono text-[9px] tracking-wider flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 bg-charcoal/40 inline-block" />
              {t('product.available')}
            </span>
          )}

          {/* Favorite Star Toggle */}
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className="text-charcoal/60 hover:text-charcoal transition-colors cursor-pointer p-1 z-20"
            title="Favorite"
          >
            <svg 
              className="w-3.5 h-3.5" 
              fill={isFavorite ? "var(--color-charcoal)" : "none"} 
              stroke="currentColor" 
              strokeWidth="1.5" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M11.48 3.499c.195-.39.736-.39.93 0l2.35 4.76 5.244.762c.427.062.597.585.289.89l-3.8 3.705.897 5.228c.078.455-.4-.766-.347.886l-4.7-2.47-4.7 2.47c-.77.405-1.24-.038-1.162-.886l.898-5.228-3.8-3.705c-.308-.305-.138-.828.289-.89l5.244-.762 2.35-4.76z" 
              />
            </svg>
          </button>
        </div>

        {/* Product Image Display */}
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[imageIndex].url} 
            alt={product.images[imageIndex].alt_text || product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
        ) : (
          <BlueprintPlaceholder 
            title={product.name} 
            subtitle={priceDisplay} 
            aspectRatio="3/4" 
            className="border-0 bg-transparent"
          />
        )}

        {/* Carousel Overlay Arrows */}
        {product.images && product.images.length > 1 && (
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setImageIndex((prev) => (prev === 0 ? product.images!.length - 1 : prev - 1))
              }}
              className={`w-6 h-6 flex items-center justify-center ${btnBgOpacityClass} border border-charcoal text-charcoal hover:bg-charcoal hover:text-cream transition-colors duration-200 text-xs font-mono select-none pointer-events-auto cursor-pointer`}
            >
              &lt;
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setImageIndex((prev) => (prev === product.images!.length - 1 ? 0 : prev + 1))
              }}
              className={`w-6 h-6 flex items-center justify-center ${btnBgOpacityClass} border border-charcoal text-charcoal hover:bg-charcoal hover:text-cream transition-colors duration-200 text-xs font-mono select-none pointer-events-auto cursor-pointer`}
            >
              &gt;
            </button>
          </div>
        )}

        {/* Action Icon Overlay (Bottom-Right) */}
        <div className="absolute bottom-4 right-4 z-10">
          {isSoldOut ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                alert(`${t('product.notify_me')}: ${product.name}`)
              }}
              className={`w-7 h-7 flex items-center justify-center ${btnBgClass} border border-charcoal text-charcoal hover:bg-red hover:text-cream hover:border-red transition-colors duration-200 cursor-pointer`}
              title={t('product.notify_me')}
            >
              <svg 
                className="w-4 h-4" 
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
            <div className={`w-7 h-7 flex items-center justify-center ${btnBgClass} border border-charcoal text-charcoal font-mono text-sm select-none group-hover:bg-charcoal group-hover:text-cream transition-colors duration-200`}>
              +
            </div>
          )}
        </div>
      </div>

      {/* Bottom half: Dark metadata area */}
      <div className="bg-charcoal text-cream p-4 md:p-6 flex flex-col items-center justify-center text-center">
        <h3 className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-cream leading-tight max-w-[90%] mb-1 select-all">
          {product.name}
        </h3>
        <span className="font-mono text-[9px] md:text-[10px] text-cream/70">
          {priceDisplay}
        </span>

        {/* Color swatches */}
        {colors.length > 0 && (
          <div className="flex gap-1.5 mt-3 select-none">
            {colors.map((color) => (
              <span 
                key={color} 
                className="w-2.5 h-2.5 border border-cream/20 inline-block hover:scale-110 hover:border-cream transition-transform duration-200"
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
