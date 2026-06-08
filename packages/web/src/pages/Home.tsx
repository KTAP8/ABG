import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { DropBanner } from '../components/drop/DropBanner'
import { ProductGrid } from '../components/product/ProductGrid'
import { getDrops } from '../lib/api'
import type { Drop } from '../lib/api'

export default function Home() {
  const { t } = useTranslation()
  const [latestDrop, setLatestDrop] = useState<Drop | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const drops = await getDrops()
        if (drops.length > 0) {
          setLatestDrop(drops[0])
        }
      } catch (err) {
        console.error('Failed to fetch drops', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <DropBanner />

      {/* Hero */}
      <section className="h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display font-black text-[8vw] md:text-[10vw] leading-none uppercase text-charcoal mb-4">
          ACOUSTIC<br />
          BUT<br />
          GOATED.
        </h1>
        <p className="font-body text-base md:text-lg text-charcoal mb-12">
          {t('hero.sub')}
        </p>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 w-0.5 h-8 bg-charcoal animate-pulse" />
      </section>

      {/* Editorial Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <p className="text-center font-body text-charcoal">Loading...</p>
        ) : latestDrop && latestDrop.products ? (
          <>
            <div className="mb-8">
              <h2 className="font-display font-bold text-2xl md:text-4xl uppercase text-charcoal">
                {latestDrop.name}
              </h2>
            </div>
            <ProductGrid products={latestDrop.products.slice(0, 4)} />
          </>
        ) : (
          <p className="text-center font-body text-charcoal opacity-60">
            {t('something.coming')}
          </p>
        )}
      </section>

      {/* Brand Statement */}
      <section className="my-16">
        <div className="aspect-video bg-charcoal mb-8" />
        <div className="max-w-7xl mx-auto px-4">
          <blockquote className="font-display font-bold text-2xl md:text-4xl leading-tight text-charcoal mb-4">
            {t('hero.sub')}
          </blockquote>
          <p className="font-body text-sm text-charcoal opacity-75 max-w-2xl">
            The culture of Samyan campus, expressed through textile.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
