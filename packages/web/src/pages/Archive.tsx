import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { DropCard } from '../components/drop/DropCard'
import { getDrops } from '../lib/api'
import type { Drop } from '../lib/api'

export default function Archive() {
  const { t } = useTranslation()
  const [drops, setDrops] = useState<Drop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const allDrops = await getDrops()
        const endedDrops = allDrops.filter((d) => new Date(d.drop_at) <= new Date())
        setDrops(endedDrops)
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

      <main className="w-full bg-cream px-6 pt-8 pb-16 md:px-8 md:pt-10 md:pb-20 lg:px-[27px] lg:pb-24">
        <div className="mx-auto w-full max-w-7xl">
          <header className="mb-10 border-b border-charcoal/15 pb-6 md:mb-12">
            <p className="mb-2 font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
              {t('archive.section_label')}
            </p>
            <h1 className="font-display text-2xl font-bold lowercase leading-none tracking-[-0.07em] text-charcoal md:text-[28px] lg:text-[32px]">
              {t('archive.title')}
            </h1>
            <p className="mt-3 max-w-md font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
              {t('archive.subtitle')}
            </p>
          </header>

          {loading ? (
            <p className="py-24 text-center font-body text-sm tracking-[-0.04em] text-charcoal/50 animate-pulse">
              {t('archive.loading')}
            </p>
          ) : drops.length > 0 ? (
            <div className="space-y-0 divide-y divide-charcoal/15 border-b border-charcoal/15">
              {drops.map((drop) => (
                <DropCard key={drop.id} drop={drop} isEnded />
              ))}
            </div>
          ) : (
            <p className="py-24 text-center font-body text-sm tracking-[-0.04em] text-charcoal/60">
              {t('archive.empty')}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
