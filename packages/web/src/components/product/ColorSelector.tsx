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
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-charcoal/50 font-bold">
          [PARAM_COLOR_SPEC]
        </span>
        <span className="font-mono text-[9px] uppercase font-bold text-charcoal tracking-wide bg-charcoal/5 px-2 py-0.5 border border-charcoal/10 select-none">
          {selectedColor || 'NOT_SELECTED'}
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
              className={`w-8 h-8 border transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 focus:outline-none ${
                isSelected
                  ? 'border-charcoal ring-4 ring-charcoal/15 scale-105'
                  : 'border-charcoal/20 hover:border-charcoal/50'
              }`}
              style={{ backgroundColor: colorValue }}
              title={color}
              type="button"
            >
              {isSelected && (
                <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-charcoal' : 'bg-cream'}`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
