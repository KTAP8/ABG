interface BadgeProps {
  variant: 'soldout' | 'lowstock' | 'live' | 'upcoming'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const variants = {
    soldout: 'bg-charcoal text-cream',
    lowstock: 'bg-red text-cream',
    live: 'bg-black text-cream',
    upcoming: 'border border-charcoal bg-transparent text-charcoal',
  }

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-body uppercase tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
