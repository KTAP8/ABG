import { useEffect, useState } from 'react'
import { CountdownTimer } from '../ui/CountdownTimer'
import { useTranslation } from 'react-i18next'
import { getDrops } from '../../lib/api'
import { Drop } from '../../lib/api'

export function DropBanner() {
  const { t } = useTranslation()
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
    <div className="sticky top-16 z-30 bg-cream border-b border-charcoal px-4 py-3 text-center">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-wide text-charcoal mb-1">
          {t('drop.countdown.label')}
        </p>
        <CountdownTimer targetDate={activeDrop.drop_at} className="text-charcoal" />
        <p className="font-display font-bold text-lg uppercase mt-2 text-charcoal">
          {activeDrop.name}
        </p>
      </div>
    </div>
  )
}
