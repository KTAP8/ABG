interface SizePillProps {
  size: string
  status: 'available' | 'selected' | 'soldout'
  onClick?: () => void
}

export function SizePill({ size, status, onClick }: SizePillProps) {
  const baseClasses =
    'px-3.5 py-1.5 font-body text-[12px] lowercase tracking-[-0.04em] border transition-opacity'
  const statusClasses = {
    available:
      'cursor-pointer border-charcoal/15 bg-transparent text-charcoal hover:border-charcoal/40',
    selected: 'cursor-pointer border-charcoal bg-charcoal text-cream',
    soldout:
      'cursor-not-allowed border-charcoal/10 bg-transparent text-charcoal/30 line-through',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === 'soldout'}
      className={`${baseClasses} ${statusClasses[status]}`}
    >
      {size}
    </button>
  )
}
