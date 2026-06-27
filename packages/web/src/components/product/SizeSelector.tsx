import { useTranslation } from 'react-i18next'
import { ProductVariant } from '../../lib/api'
import { SizePill } from '../ui/SizePill'

interface SizeSelectorProps {
  variants: ProductVariant[]
  selectedId: string | null
  onSelect: (variant: ProductVariant) => void
}

export function SizeSelector({ variants, selectedId, onSelect }: SizeSelectorProps) {
  const { t } = useTranslation()

  const handleSelect = (variant: ProductVariant) => {
    if (variant.stock > 0) {
      onSelect(variant)
    }
  }

  const selectedVariant = variants.find((v) => v.id === selectedId)

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs uppercase tracking-wider text-charcoal/50 font-bold">
          {t('product.size')}
        </span>
        <span className="font-mono text-xs font-bold text-charcoal select-none">
          {selectedVariant?.size || ''}
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
