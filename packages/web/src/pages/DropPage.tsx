import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { DropHeader } from '../components/drop/DropHeader'
import { DropCountdown } from '../components/drop/DropCountdown'
import { DropNotes } from '../components/drop/DropNotes'
import { ProductGrid } from '../components/product/ProductGrid'
import { WaitlistForm } from '../components/forms/WaitlistForm'
import { getDrop } from '../lib/api'
import type { Drop } from '../lib/api'

export default function DropPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const [drop, setDrop] = useState<Drop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDrop = async () => {
      try {
        if (!slug) throw new Error('No slug provided')
        const data = await getDrop(slug)
        setDrop(data)
      } catch (err) {
        setError(t('drop.not_found'))
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDrop()
  }, [slug, t])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <p className="font-body text-sm tracking-[-0.04em] text-charcoal/50 animate-pulse">
            {t('drop.loading')}
          </p>
        </div>
      </div>
    )
  }

  if (error || !drop) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <p className="font-body text-sm tracking-[-0.04em] text-charcoal/60">{error}</p>
        </div>
        <Footer />
      </div>
    )
  }

  const isLive = new Date(drop.drop_at) <= new Date()
  const isEnded = isLive && (!drop.products || drop.products.length === 0)

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="w-full bg-cream px-6 pt-8 pb-16 md:px-8 md:pt-10 md:pb-20 lg:px-[27px] lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <DropHeader drop={drop} />

          {!isLive && (
            <div className="mt-12 space-y-10">
              <DropCountdown targetDate={drop.drop_at} />
              <div className="mx-auto max-w-md border-t border-charcoal/15 pt-10">
                <h2 className="mb-6 text-center font-display text-lg font-bold lowercase tracking-[-0.07em] text-charcoal">
                  {t('drop.waitlist.title')}
                </h2>
                <WaitlistForm dropId={drop.id} />
              </div>
            </div>
          )}

          {drop.products && drop.products.length > 0 && (
            <>
              <div className="my-12">
                <ProductGrid products={drop.products} />
              </div>
              <DropNotes notes={drop.description} />
            </>
          )}

          {isEnded && (
            <p className="py-16 text-center font-body text-sm tracking-[-0.04em] text-charcoal/60">
              {t('drop.ended')}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
