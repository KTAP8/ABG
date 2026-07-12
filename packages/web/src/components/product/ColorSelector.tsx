import { useTranslation } from 'react-i18next'

interface ColorSelectorProps {
  colors: string[]
  selectedColor: string
  onSelect: (color: string) => void
}

export function resolveColorValue(colorName: string): string {
  const normalized = colorName.toLowerCase().trim()
  if (normalized === 'cream') return '#F5F1E8'
  if (normalized === 'black') return '#0A0A0A'
  if (normalized === 'charcoal') return '#3F3F44'
  if (normalized === 'white') return '#FFFFFF'
  if (normalized === 'red') return '#C0392B'
  return colorName
}

export function ColorSelector({ colors, selectedColor, onSelect }: ColorSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55">
          {t('product.color')}
        </span>
        <span className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal select-none">
          {selectedColor || ''}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 py-1">
        {colors.map((color) => {
          const isSelected = selectedColor === color
          const colorValue = resolveColorValue(color)
          const isLight = ['white', 'cream', '#ffffff', '#f5f1e8'].includes(color.toLowerCase())

          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center border transition-opacity focus:outline-none ${
                isSelected
                  ? 'border-charcoal'
                  : 'border-charcoal/15 hover:border-charcoal/40'
              }`}
              style={{ backgroundColor: colorValue }}
              title={color}
              type="button"
            >
              {isSelected && (
                <span className={`h-2 w-2 ${isLight ? 'bg-charcoal' : 'bg-cream'}`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
