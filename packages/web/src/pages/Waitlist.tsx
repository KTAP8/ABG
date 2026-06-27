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

        <main className="max-w-md mx-auto px-4 py-20 text-center space-y-10">
          
          {/* Header & Subtitle */}
          <div className="space-y-3">
            <h1 className="font-display font-black text-4xl md:text-5xl uppercase text-charcoal tracking-tight leading-none">
              {t('nav.waitlist')}
            </h1>
            <p className="font-mono text-xs uppercase tracking-wider text-charcoal/50 leading-relaxed max-w-sm mx-auto select-none">
              {t('drop.waitlist.cta')}
            </p>
          </div>

          {loading ? (
            <div className="py-8 font-mono text-xs uppercase tracking-widest text-charcoal/40 animate-pulse">
              Loading...
            </div>
          ) : upcomingDrop ? (
            <div className="space-y-6">
              <div className="space-y-2.5 pb-6 border-b border-charcoal/10">
                <span className="font-mono text-[9px] uppercase tracking-widest text-red font-bold select-none bg-red/10 border border-red/15 px-2.5 py-0.5 inline-block">
                  NEXT DROP PREPARATION
                </span>
                <h3 className="font-display font-black text-2xl uppercase text-charcoal leading-tight">
                  {upcomingDrop.name}
                </h3>
                <div className="pt-2">
                  <CountdownTimer targetDate={upcomingDrop.drop_at} />
                </div>
              </div>
              <WaitlistForm dropId={upcomingDrop.id} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="pb-6 border-b border-charcoal/10">
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
