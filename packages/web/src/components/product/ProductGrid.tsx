import { Product, ProductImage } from '../../lib/api'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: (Product & { images?: ProductImage[] })[]
  className?: string
  cardBgClass?: string
}

export function ProductGrid({ products, className = '', cardBgClass }: ProductGridProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-charcoal gap-[1px] border border-charcoal ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} bgClass={cardBgClass} />
      ))}
    </div>
  )
}
