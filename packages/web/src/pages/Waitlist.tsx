import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { WaitlistForm } from '../components/forms/WaitlistForm'
import { DropCountdown } from '../components/drop/DropCountdown'
import { getDrops } from '../lib/api'
import type { Drop } from '../lib/api'

export default function Waitlist() {
  const { t } = useTranslation()
  const [upcomingDrop, setUpcomingDrop] = useState<Drop | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const drops = await getDrops()
        const upcoming = drops.find((d) => new Date(d.drop_at) > new Date())
        setUpcomingDrop(upcoming || null)
      } catch (err) {
        console.error('Failed to fetch drops', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDrops()
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display font-bold text-4xl md:text-5xl uppercase text-charcoal mb-8">
          {t('nav.waitlist')}
        </h1>

        {loading ? (
          <p className="font-body text-charcoal">Loading...</p>
        ) : upcomingDrop ? (
          <>
            <div className="mb-8">
              <h2 className="font-body text-sm uppercase tracking-wide text-charcoal mb-2">
                Upcoming
              </h2>
              <h3 className="font-display font-bold text-2xl uppercase text-charcoal mb-4">
                {upcomingDrop.name}
              </h3>
              <DropCountdown targetDate={upcomingDrop.drop_at} />
            </div>
            <div className="border-t border-charcoal pt-8">
              <WaitlistForm dropId={upcomingDrop.id} />
            </div>
          </>
        ) : (
          <>
            <p className="font-display font-bold text-2xl uppercase text-charcoal mb-8">
              {t('something.coming')}
            </p>
            <div className="border-t border-charcoal pt-8">
              <WaitlistForm />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
