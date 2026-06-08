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
    month: 'short',
    day: '2-digit',
  }).toUpperCase()

  return (
    <div className="border border-charcoal bg-cream">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left transition-colors p-4 md:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-charcoal/5"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 flex-1">
          {/* Date Stamp */}
          <div className="font-mono text-xs text-charcoal/60 min-w-[100px]">
            [{dropDate}]
          </div>
          {/* Drop Identifier */}
          <div>
            <h3 className="font-display font-black text-lg uppercase text-charcoal tracking-tight">
              {drop.name}
            </h3>
            <span className="font-mono text-[9px] text-charcoal/50 uppercase block mt-0.5">
              // REF: {drop.slug}
            </span>
          </div>
        </div>

        {/* Status indicator and action */}
        <div className="flex items-center justify-between md:justify-end gap-6 border-t border-charcoal/10 pt-3 md:pt-0 md:border-t-0">
          {isEnded && (
            <Badge variant="soldout">ARCHIVED_OOS</Badge>
          )}
          <span className="font-mono text-xs font-bold text-charcoal">
            {expanded ? '[-]' : '[+]'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="p-6 border-t border-charcoal bg-cream space-y-6">
          <div className="border border-charcoal/20 p-4 font-mono text-[10px] text-charcoal/70 bg-charcoal/5 leading-relaxed">
            <span className="font-bold block mb-1">// MANIFESTO_ARCHIVE_LOG:</span>
            {drop.description || 'No registry description recorded.'}
          </div>
          {drop.products && drop.products.length > 0 && (
            <div className={isEnded ? 'opacity-70 pointer-events-none' : ''}>
              <p className="font-mono text-[9px] uppercase tracking-widest text-charcoal/50 mb-4 font-bold">
                // PRODUCTS_REGISTERED_TO_THIS_DROP:
              </p>
              <ProductGrid products={drop.products} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
