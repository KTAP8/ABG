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
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase text-charcoal mb-2">
            {t('archive.title')}
          </h1>
          <p className="font-body text-sm text-charcoal opacity-75">
            {t('archive.subtitle')}
          </p>
        </div>

        {loading ? (
          <p className="font-body text-charcoal text-center py-12">Loading...</p>
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
          <div className="text-center py-12">
            <p className="font-body text-charcoal opacity-60">
              No past drops yet. Check back after the first drop launches.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
