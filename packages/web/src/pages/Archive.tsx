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
        // Get ended drops (all drops, filter for ones in the past)
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
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="border border-charcoal p-6 bg-cream mb-12">
            <h1 className="font-display font-black text-3xl md:text-5xl uppercase text-charcoal mt-1">
              {t('archive.title')}
            </h1>
            <p className="font-mono text-xs text-charcoal/70 mt-2">
              {t('archive.subtitle').toUpperCase()}
            </p>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-charcoal animate-pulse">
                Loading...
              </span>
            </div>
          ) : drops.length > 0 ? (
            <div className="space-y-4">
              {drops.map((drop) => (
                <DropCard
                  key={drop.id}
                  drop={drop}
                  isEnded={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-charcoal/30 bg-charcoal/5">
              <p className="font-mono text-xs uppercase tracking-widest text-charcoal/60">
                NO ARCHIVED DROPS AVAILABLE
              </p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
