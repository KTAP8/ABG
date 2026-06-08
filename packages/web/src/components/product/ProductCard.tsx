import { Link } from 'react-router-dom'
import { Product, ProductImage } from '../../lib/api'
import { Badge } from '../ui/Badge'
import { useTranslation } from 'react-i18next'

interface ProductCardProps {
  product: Product & { images?: ProductImage[] }
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation()
  const primaryImage = product.images?.[0]
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
  const isSoldOut = totalStock === 0

  const priceDisplay = `฿${(product.price / 100).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-charcoal mb-3 relative">
        {primaryImage && (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity cursor-crosshair"
          />
        )}
        <div className="absolute top-3 right-3">
          {isSoldOut ? (
            <Badge variant="soldout">{t('product.soldout')}</Badge>
          ) : totalStock <= 15 ? (
            <Badge variant="lowstock">
              {totalStock} {t('product.lowstock').split('{{count}}')[1]?.trim() || 'LEFT'}
            </Badge>
          ) : null}
        </div>
      </div>
      <h3 className="font-body text-sm uppercase tracking-wide text-charcoal group-hover:underline">
        {product.name}
      </h3>
      <p className="font-mono text-sm text-charcoal mt-1">{priceDisplay}</p>
    </Link>
  )
}
