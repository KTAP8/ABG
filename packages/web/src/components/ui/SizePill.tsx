interface SizePillProps {
  size: string
  status: 'available' | 'selected' | 'soldout'
  onClick?: () => void
}

export function SizePill({ size, status, onClick }: SizePillProps) {
  const baseClasses = 'px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider border cursor-pointer transition-all'
  const statusClasses = {
    available: 'bg-transparent border-charcoal text-charcoal hover:bg-charcoal hover:text-cream',
    selected: 'bg-charcoal border-charcoal text-cream font-bold',
    soldout: 'bg-charcoal/5 border-charcoal/20 text-charcoal/30 cursor-not-allowed line-through',
  }

  return (
    <button
      onClick={onClick}
      disabled={status === 'soldout'}
      className={`${baseClasses} ${statusClasses[status]}`}
    >
      {size}
    </button>
  )
}
