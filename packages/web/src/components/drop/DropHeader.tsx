import { Drop } from '../../lib/api'

interface DropHeaderProps {
  drop: Drop
}

export function DropHeader({ drop }: DropHeaderProps) {
  const dropDate = new Date(drop.drop_at).toLocaleDateString(
    'en-GB',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  )

  const description = drop.description
  const isUpcoming = new Date(drop.drop_at) > new Date()

  return (
    <div className="border border-charcoal p-6 bg-cream mb-8 font-mono text-xs text-charcoal/80 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-charcoal pb-4 gap-4">
        <div>
          <span className="text-charcoal/40 uppercase tracking-widest text-[9px] block">DROP NAME</span>
          <h1 className="font-display font-black text-3xl md:text-5xl uppercase text-charcoal tracking-tighter mt-1">
            {drop.name}
          </h1>
        </div>
        <div className="sm:text-right">
          <span className="text-charcoal/40 uppercase tracking-widest text-[9px] block">LAUNCH DATE</span>
          <span className="font-bold text-sm block mt-1">{dropDate}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="md:col-span-2">
          <span className="text-charcoal/40 uppercase tracking-widest text-[9px] block mb-1">DESCRIPTION</span>
          <p className="font-body text-xs text-charcoal leading-relaxed">
            {description}
          </p>
        </div>
        <div className="md:text-right flex flex-col justify-end">
          <span className="text-charcoal/40 uppercase tracking-widest text-[9px] block mb-1">STATUS</span>
          <span className="text-red font-bold uppercase">
            {isUpcoming ? 'WAITLIST OPEN' : 'DROP LIVE'}
          </span>
        </div>
      </div>
    </div>
  )
}
