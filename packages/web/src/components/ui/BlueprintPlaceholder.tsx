interface BlueprintPlaceholderProps {
  title?: string
  subtitle?: string
  className?: string
  aspectRatio?: '3/4' | '16/9' | 'square'
}

export function BlueprintPlaceholder({
  title = '',
  subtitle = '',
  className = '',
  aspectRatio = '3/4',
}: BlueprintPlaceholderProps) {
  const aspectClass = {
    '3/4': 'aspect-3/4',
    '16/9': 'aspect-video',
    square: 'aspect-square',
  }[aspectRatio]

  const hasBgClass = className.includes('bg-')

  return (
    <div
      className={`relative flex w-full ${aspectClass} flex-col items-center justify-center overflow-hidden select-none ${hasBgClass ? '' : 'bg-white'} ${className}`}
    >
      <div className="z-10 px-4 text-center">
        {title && (
          <h4 className="font-body text-sm font-medium lowercase tracking-[-0.04em] text-charcoal/50">
            {title}
          </h4>
        )}
        {subtitle && (
          <p className="mt-1 font-body text-[12px] tracking-[-0.04em] text-charcoal/40">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
