import { ProductVariant } from '../../lib/api'
import { SizePill } from '../ui/SizePill'

interface SizeSelectorProps {
  variants: ProductVariant[]
  selectedId: string | null
  onSelect: (variant: ProductVariant) => void
  bgClass?: string
}

export function SizeSelector({ variants, selectedId, onSelect, bgClass = 'bg-cream' }: SizeSelectorProps) {
  const handleSelect = (variant: ProductVariant) => {
    if (variant.stock > 0) {
      onSelect(variant)
    }
  }

  const selectedVariant = variants.find((v) => v.id === selectedId)

  return (
    <div className={`space-y-4 border border-charcoal p-4 ${bgClass}`}>
      <p className="font-mono text-xs uppercase tracking-widest text-charcoal font-bold">
        [SELECT_SIZE_SPEC]
      </p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <SizePill
            key={variant.id}
            size={variant.size}
            status={
              variant.stock === 0
                ? 'soldout'
                : selectedId === variant.id
                  ? 'selected'
                  : 'available'
            }
            onClick={() => handleSelect(variant)}
          />
        ))}
      </div>
      {selectedVariant && (
        <div className="pt-2 border-t border-charcoal/20 font-mono text-[9px] tracking-widest text-charcoal/70 space-y-1">
          <div>// SKU: ABG-VAR-{selectedVariant.id.slice(0, 8).toUpperCase()}</div>
          {selectedVariant.color && <div>// COLOR: {selectedVariant.color.toUpperCase()}</div>}
          <div>// STATE: {selectedVariant.stock <= 15 ? 'LOW_STOCK_WARNING' : 'IN_STOCK'}</div>
          <div>// QUANTITY: {selectedVariant.stock} UNITS REGISTERED</div>
        </div>
      )}
    </div>
  )
}
