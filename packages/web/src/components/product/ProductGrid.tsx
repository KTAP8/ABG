import { Product, ProductImage } from '../../lib/api'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: (Product & { images?: ProductImage[] })[]
  className?: string
}

export function ProductGrid({ products, className = '' }: ProductGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
