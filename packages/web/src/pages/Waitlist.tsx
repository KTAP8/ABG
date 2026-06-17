import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { WaitlistForm } from '../components/forms/WaitlistForm'
import { CountdownTimer } from '../components/ui/CountdownTimer'
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
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-xl mx-auto px-4 py-16">
          <div className="border border-charcoal p-6 bg-cream mb-8">
            <h1 className="font-display font-black text-3xl md:text-4xl uppercase text-charcoal mt-1">
              {t('nav.waitlist')}
            </h1>
          </div>

          {loading ? (
            <div className="p-8 text-center font-mono text-xs uppercase tracking-widest text-charcoal/60 animate-pulse">
              Loading...
            </div>
          ) : upcomingDrop ? (
            <div className="space-y-6">
              <div className="border border-charcoal p-6 bg-cream space-y-4">
                <div>
                  <h3 className="font-display font-black text-xl md:text-2xl uppercase text-charcoal mt-1">
                    {upcomingDrop.name}
                  </h3>
                </div>
                <div className="border-t border-charcoal/20 pt-4">
                  <CountdownTimer targetDate={upcomingDrop.drop_at} />
                </div>
              </div>
              <WaitlistForm dropId={upcomingDrop.id} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border border-charcoal p-6 bg-cream text-center">
                <span className="font-mono text-xs uppercase tracking-widest text-charcoal font-bold">
                  {t('something.coming').toUpperCase()}
                </span>
              </div>
              <WaitlistForm />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
