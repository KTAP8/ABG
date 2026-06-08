import { Link } from 'react-router-dom'
import { Product, ProductImage } from '../../lib/api'
import { Badge } from '../ui/Badge'
import { BlueprintPlaceholder } from '../ui/BlueprintPlaceholder'
import { useTranslation } from 'react-i18next'

interface ProductCardProps {
  product: Product & { images?: ProductImage[] }
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation()
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
  const isSoldOut = totalStock === 0

  const priceDisplay = `฿${(product.price / 100).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  return (
    <Link to={`/products/${product.slug}`} className="group block border border-charcoal p-3 bg-cream hover:bg-charcoal/5 transition-colors">
      <div className="relative mb-3">
        <BlueprintPlaceholder title={product.name} subtitle={priceDisplay} aspectRatio="3/4" />
        <div className="absolute top-3 right-3 z-10">
          {isSoldOut ? (
            <Badge variant="soldout">{t('product.soldout')}</Badge>
          ) : totalStock <= 15 ? (
            <Badge variant="lowstock">
              {totalStock} {t('product.lowstock').split('{{count}}')[1]?.trim() || 'LEFT'}
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="flex justify-between items-start font-mono text-xs tracking-wider uppercase text-charcoal">
        <span className="group-hover:text-red transition-colors font-bold">
          {product.name}
        </span>
        <span className="opacity-80">{priceDisplay}</span>
      </div>
      <div className="mt-1 font-mono text-[9px] tracking-widest text-charcoal opacity-40 uppercase">
        // REF: {product.slug}
      </div>
    </Link>
  )
}
