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
    const interval = setInterval(fetchActiveDrop, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  if (!activeDrop) return null

  return (
    <Link
      to={`/drop/${activeDrop.slug}`}
      className="sticky top-14 z-30 bg-charcoal border-b border-charcoal py-2.5 text-center text-cream hover:bg-black transition-colors block"
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 font-mono text-[10px] tracking-wider uppercase">
        <span className="flex items-center gap-1.5 font-bold text-red">
          <span className="w-1.5 h-1.5 bg-red animate-pulse inline-block" />
          [SYSTEM_NOTICE: UPCOMING_DROP]
        </span>
        <span className="opacity-40 hidden sm:inline">||</span>
        <span className="font-bold">{activeDrop.name}</span>
        <span className="opacity-40 hidden sm:inline">||</span>
        <div className="flex items-center gap-1">
          <span>STARTS_IN:</span>
          <CountdownTimer targetDate={activeDrop.drop_at} variant="simple" className="text-red font-bold" />
        </div>
      </div>
    </Link>
  )
}
