import { useState } from 'react'
import { Drop } from '../../lib/api'
import { Badge } from '../ui/Badge'
import { ProductGrid } from '../product/ProductGrid'

interface DropCardProps {
  drop: Drop
  isEnded: boolean
}

export function DropCard({ drop, isEnded }: DropCardProps) {
  const [expanded, setExpanded] = useState(false)

  const dropDate = new Date(drop.drop_at).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="border border-charcoal">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left hover:bg-charcoal hover:text-cream transition-colors p-4"
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg uppercase text-inherit">
                {drop.name}
              </h3>
              <p className="font-mono text-xs uppercase tracking-wide text-inherit mt-1">
                {dropDate}
              </p>
            </div>
            {isEnded && (
              <Badge variant="soldout">SOLD OUT</Badge>
            )}
          </div>
          <p className="font-body text-sm text-inherit opacity-75">
            {drop.description || 'No description'}
          </p>
        </div>
      </button>

      {expanded && drop.products && drop.products.length > 0 && (
        <div className={`p-6 border-t border-charcoal ${isEnded ? 'opacity-50 pointer-events-none' : ''}`}>
          <p className="font-body text-sm uppercase tracking-wide text-charcoal mb-6">
            Products from this drop
          </p>
          <ProductGrid products={drop.products} />
        </div>
      )}
    </div>
  )
}
