import { ProductVariant } from '../../lib/api'
import { SizePill } from '../ui/SizePill'

interface SizeSelectorProps {
  variants: ProductVariant[]
  selectedId: string | null
  onSelect: (variant: ProductVariant) => void
}

export function SizeSelector({ variants, selectedId, onSelect }: SizeSelectorProps) {
  const handleSelect = (variant: ProductVariant) => {
    if (variant.stock > 0) {
      onSelect(variant)
    }
  }

  const selectedVariant = variants.find((v) => v.id === selectedId)

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-charcoal/50 font-bold">
          [PARAM_SIZE_SPEC]
        </span>
        <span className="font-mono text-[9px] uppercase font-bold text-charcoal tracking-wide bg-charcoal/5 px-2 py-0.5 border border-charcoal/10 select-none">
          {selectedVariant?.size || 'NOT_SELECTED'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 py-1">
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
    </div>
  )
}
