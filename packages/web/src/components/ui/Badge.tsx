interface BadgeProps {
  variant: 'soldout' | 'lowstock' | 'live' | 'upcoming'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const variants = {
    soldout: 'text-red',
    lowstock: 'text-charcoal/55',
    live: 'text-charcoal',
    upcoming: 'text-charcoal/55',
  }

  return (
    <span
      className={`inline-block font-body text-[11px] lowercase tracking-[-0.04em] select-none ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
