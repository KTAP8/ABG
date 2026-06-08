interface BadgeProps {
  variant: 'soldout' | 'lowstock' | 'live' | 'upcoming'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const variants = {
    soldout: 'text-charcoal/50 border-charcoal/30 bg-charcoal/5',
    lowstock: 'text-red border-red font-bold animate-pulse',
    live: 'text-red border-red font-bold animate-pulse',
    upcoming: 'text-charcoal border-charcoal bg-transparent',
  }

  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider bg-cream select-none ${variants[variant]} ${className}`}
    >
      [{children}]
    </span>
  )
}
