interface SizePillProps {
  size: string
  status: 'available' | 'selected' | 'soldout'
  onClick?: () => void
}

export function SizePill({ size, status, onClick }: SizePillProps) {
  const baseClasses = 'px-3 py-2 font-body text-sm uppercase tracking-wide border border-charcoal cursor-pointer transition-all'
  const statusClasses = {
    available: 'bg-transparent text-charcoal hover:bg-charcoal hover:text-cream',
    selected: 'bg-charcoal text-cream',
    soldout: 'bg-transparent text-charcoal opacity-50 cursor-not-allowed line-through',
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
