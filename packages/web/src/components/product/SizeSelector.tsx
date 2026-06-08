import { useState } from 'react'
import { ProductVariant } from '../../lib/api'
import { SizePill } from '../ui/SizePill'
import { useTranslation } from 'react-i18next'

interface SizeSelectorProps {
  variants: ProductVariant[]
  onSelect: (variant: ProductVariant) => void
}

export function SizeSelector({ variants, onSelect }: SizeSelectorProps) {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = (variant: ProductVariant) => {
    if (variant.stock > 0) {
      setSelectedId(variant.id)
      onSelect(variant)
    }
  }

  return (
    <div className="space-y-3">
      <p className="font-body text-sm uppercase tracking-wide text-charcoal">
        {t('product.orderbutton')}
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
      {selectedId && (
        <div className="pt-2">
          <p className="font-mono text-sm text-charcoal">
            Stock:{' '}
            {
              variants.find((v) => v.id === selectedId)?.stock
            }
          </p>
        </div>
      )}
    </div>
  )
}
