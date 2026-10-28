import { Product, ProductImage } from '../../lib/api'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: (Product & { images?: ProductImage[] })[]
  className?: string
  cardBgClass?: string
  showAddToCart?: boolean
}

export function ProductGrid({ products, className = '', cardBgClass, showAddToCart }: ProductGridProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 bg-cream md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-4 ${className}`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          bgClass={cardBgClass}
          showAddToCart={showAddToCart}
        />
      ))}
    </div>
  )
}
