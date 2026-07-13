import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CountdownTimer } from '../ui/CountdownTimer'
import { getDrops } from '../../lib/api'
import { Drop } from '../../lib/api'

export function DropBanner() {
  const [activeDrop, setActiveDrop] = useState<Drop | null>(null)

  useEffect(() => {
    const fetchActiveDrop = async () => {
      try {
        const drops = await getDrops()
        const upcoming = drops.find(
          (d) => new Date(d.drop_at) > new Date(),
        )
        setActiveDrop(upcoming || null)
      } catch (err) {
        console.error('Failed to fetch active drop', err)
      }
    }

    fetchActiveDrop()
    const interval = setInterval(fetchActiveDrop, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!activeDrop) return null

  return (
    <Link
      to={`/drop/${activeDrop.slug}`}
      className="block border-b border-charcoal/10 bg-cream py-3 text-center text-charcoal transition-opacity hover:opacity-70"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-1 px-4 font-body text-[13px] tracking-[-0.04em] sm:flex-row sm:gap-3">
        <span className="text-charcoal/55 lowercase">upcoming drop</span>
        <span className="hidden text-charcoal/25 sm:inline">·</span>
        <span className="font-medium lowercase">{activeDrop.name}</span>
        <span className="hidden text-charcoal/25 sm:inline">·</span>
        <div className="flex items-center gap-1.5 text-charcoal/70">
          <span className="lowercase">starts in</span>
          <CountdownTimer
            targetDate={activeDrop.drop_at}
            variant="simple"
            className="font-medium text-charcoal"
          />
        </div>
      </div>
    </Link>
  )
}
