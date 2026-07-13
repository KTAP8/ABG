import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
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

  const fadeIn = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="w-full px-6 md:px-8 lg:px-[27px]">
        <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-7xl grid-cols-1 lg:grid-cols-12 lg:gap-8">
          {/* Editorial signal */}
          <motion.section
            {...fadeIn}
            className="flex flex-col justify-end border-b border-charcoal/15 py-16 md:py-20 lg:col-span-6 lg:justify-center lg:border-b-0 lg:border-r lg:py-24 lg:pr-10 xl:pr-16"
          >
            <span className="mb-6 font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
              {t('nav.waitlist')}
            </span>

            <h1 className="max-w-md font-brand text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] tracking-normal text-charcoal select-none">
              {t('something.coming')}
            </h1>

            <p className="mt-6 max-w-sm font-body text-[15px] leading-snug tracking-[-0.04em] text-charcoal/70 md:text-base">
              {t('waitlist.lead')}
            </p>

            <div className="mt-10 space-y-4 border-t border-charcoal/15 pt-8">
              {loading ? (
                <p className="font-body text-sm tracking-[-0.04em] text-charcoal/50 animate-pulse">
                  {t('waitlist.loading')}
                </p>
              ) : upcomingDrop ? (
                <>
                  <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
                    {t('waitlist.upcoming_label')}
                  </p>
                  <h2 className="font-display text-xl font-bold lowercase leading-snug tracking-[-0.07em] text-charcoal md:text-2xl">
                    {upcomingDrop.name}
                  </h2>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-body text-[13px] tracking-[-0.04em] text-charcoal/70">
                    <span className="lowercase">{t('waitlist.starts_in')}</span>
                    <CountdownTimer
                      targetDate={upcomingDrop.drop_at}
                      variant="simple"
                      className="font-medium text-charcoal"
                    />
                  </div>
                </>
              ) : (
                <p className="max-w-xs font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/60">
                  {t('drop.waitlist.cta')}
                </p>
              )}
            </div>
          </motion.section>

          {/* Form */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center py-16 md:py-20 lg:col-span-6 lg:py-24 lg:pl-10 xl:pl-16"
          >
            <div className="w-full max-w-sm">
              <p className="mb-8 font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
                {t('waitlist.cta')}
              </p>
              <WaitlistForm dropId={upcomingDrop?.id} />
            </div>
          </motion.section>
        </div>

        <section className="mx-auto max-w-7xl border-t border-charcoal/15 pb-20 pt-10 md:pb-24">
          <p className="max-w-lg font-body text-[15px] leading-snug tracking-[-0.04em] text-charcoal/70 md:text-base">
            {t('waitlist.closer')}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
