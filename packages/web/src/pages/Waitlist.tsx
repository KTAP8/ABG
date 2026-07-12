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
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="mx-auto w-full max-w-md px-6 pt-8 pb-20 md:px-8 md:pt-10 md:pb-24 lg:px-[27px]">
        <header className="mb-10 space-y-3 text-center">
          <h1 className="font-display text-2xl font-bold lowercase leading-none tracking-[-0.07em] text-charcoal md:text-[28px] lg:text-[32px]">
            {t('nav.waitlist')}
          </h1>
          <p className="mx-auto max-w-sm font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
            {t('drop.waitlist.cta')}
          </p>
        </header>

        {loading ? (
          <p className="py-8 text-center font-body text-sm tracking-[-0.04em] text-charcoal/50 animate-pulse">
            {t('waitlist.loading')}
          </p>
        ) : upcomingDrop ? (
          <div className="space-y-8">
            <div className="space-y-3 border-b border-charcoal/15 pb-8 text-center">
              <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
                {t('waitlist.upcoming_label')}
              </p>
              <h2 className="font-display text-xl font-bold lowercase leading-snug tracking-[-0.07em] text-charcoal">
                {upcomingDrop.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2 font-body text-[13px] tracking-[-0.04em] text-charcoal/70">
                <span className="lowercase">{t('waitlist.starts_in')}</span>
                <CountdownTimer
                  targetDate={upcomingDrop.drop_at}
                  variant="simple"
                  className="font-medium text-charcoal"
                />
              </div>
            </div>
            <WaitlistForm dropId={upcomingDrop.id} />
          </div>
        ) : (
          <div className="space-y-8">
            <p className="border-b border-charcoal/15 pb-8 text-center font-body text-sm tracking-[-0.04em] text-charcoal/60">
              {t('something.coming')}
            </p>
            <WaitlistForm />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
