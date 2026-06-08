interface BlueprintPlaceholderProps {
  title?: string
  subtitle?: string
  className?: string
  aspectRatio?: '3/4' | '16/9' | 'square'
}

export function BlueprintPlaceholder({
  title = 'PRODUCT_MODEL',
  subtitle = '3:4 ASPECT RATIO',
  className = '',
  aspectRatio = '3/4',
}: BlueprintPlaceholderProps) {
  const aspectClass = {
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-video',
    'square': 'aspect-square',
  }[aspectRatio]

  return (
    <div
      className={`relative w-full ${aspectClass} bg-cream border border-charcoal flex flex-col justify-between p-4 overflow-hidden tech-grid-bg select-none ${className}`}
    >
      {/* CAD Border Corners */}
      <div className="absolute top-1.5 left-1.5 font-mono text-[8px] text-charcoal/40 font-bold">┌ 13.73N</div>
      <div className="absolute top-1.5 right-1.5 font-mono text-[8px] text-charcoal/40 font-bold">100.52E ┐</div>
      <div className="absolute bottom-1.5 left-1.5 font-mono text-[8px] text-charcoal/40 font-bold">└ v1.0.4</div>
      <div className="absolute bottom-1.5 right-1.5 font-mono text-[8px] text-charcoal/40 font-bold">ABG_SYS ┘</div>

      {/* Diagonal Wireframe Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--color-charcoal)" strokeWidth="0.5" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="var(--color-charcoal)" strokeWidth="0.5" />
        {/* Center Target Circle */}
        <circle cx="50%" cy="50%" r="30" stroke="var(--color-charcoal)" strokeWidth="0.5" fill="none" />
        <circle cx="50%" cy="50%" r="2" fill="var(--color-charcoal)" />
        {/* Center Crosshairs */}
        <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="var(--color-charcoal)" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="var(--color-charcoal)" strokeWidth="0.5" strokeDasharray="2 2" />
      </svg>

      {/* Header spec */}
      <div className="flex justify-between items-start z-10 w-full">
        <span className="font-mono text-[9px] tracking-wider text-charcoal/50">
          [CAD_REF_MOCKUP]
        </span>
        <span className="font-mono text-[9px] tracking-wider text-charcoal/50">
          CONFIDENTIAL_
        </span>
      </div>

      {/* Central Specification Title */}
      <div className="text-center z-10 my-auto">
        <h4 className="font-display font-black text-sm md:text-base tracking-widest text-charcoal uppercase leading-none mb-1.5">
          {title}
        </h4>
        <p className="font-mono text-[9px] tracking-widest text-charcoal opacity-60 uppercase">
          // {subtitle}
        </p>
      </div>

      {/* Footer spec */}
      <div className="flex justify-between items-end z-10 w-full">
        <span className="font-mono text-[8px] tracking-widest text-charcoal/40">
          SYS_MODEL_REV_0
        </span>
        <span className="font-mono text-[8px] tracking-widest text-charcoal/40">
          [x=50, y=50]
        </span>
      </div>
    </div>
  )
}
