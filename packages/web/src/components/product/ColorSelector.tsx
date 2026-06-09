interface ColorSelectorProps {
  colors: string[]
  selectedColor: string
  onSelect: (color: string) => void
  bgClass?: string
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

export function ColorSelector({ colors, selectedColor, onSelect, bgClass = 'bg-cream' }: ColorSelectorProps) {
  return (
    <div className={`space-y-4 border border-charcoal p-4 ${bgClass}`}>
      <p className="font-mono text-xs uppercase tracking-widest text-charcoal font-bold">
        [SELECT_COLOR_SPEC] {selectedColor && `// ${selectedColor.toUpperCase()}`}
      </p>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => {
          const isSelected = selectedColor === color
          const colorValue = resolveColorValue(color)
          const isLight = ['white', 'cream', '#ffffff', '#f5f1e8'].includes(color.toLowerCase())

          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={`w-7 h-7 border transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 focus:outline-none ${
                isSelected
                  ? 'border-charcoal ring-2 ring-charcoal/20 scale-105'
                  : 'border-charcoal/30 hover:border-charcoal/60'
              }`}
              style={{ backgroundColor: colorValue }}
              title={color}
              type="button"
            >
              {isSelected && (
                <span className={`w-1.5 h-1.5 ${isLight ? 'bg-charcoal' : 'bg-cream'}`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
