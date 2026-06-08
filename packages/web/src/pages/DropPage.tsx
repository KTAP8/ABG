import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
        setError('Drop not found')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDrop()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="h-screen flex items-center justify-center">
          <p className="font-body text-charcoal">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !drop) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="h-screen flex items-center justify-center">
          <p className="font-body text-charcoal">{error}</p>
        </div>
      </div>
    )
  }

  const isLive = new Date(drop.drop_at) <= new Date()
  const isEnded = isLive && (!drop.products || drop.products.length === 0)

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <DropHeader drop={drop} />

        {/* Pre-drop or Countdown */}
        {!isLive ? (
          <>
            <DropCountdown targetDate={drop.drop_at} />
            <div className="my-8 border-t border-charcoal pt-8">
              <h2 className="font-body text-sm uppercase tracking-wide text-charcoal mb-4">
                Get notified when this drops
              </h2>
              <WaitlistForm dropId={drop.id} />
            </div>
          </>
        ) : null}

        {/* Product Grid */}
        {drop.products && drop.products.length > 0 && (
          <>
            <div className="my-12">
              <ProductGrid
                products={drop.products}
                className={isEnded ? 'opacity-50 pointer-events-none' : ''}
              />
            </div>
            <DropNotes notes={drop.description} notes_th={drop.description_th} />
          </>
        )}

        {isEnded && (
          <div className="text-center py-12">
            <p className="font-body text-sm uppercase tracking-wide text-charcoal">
              This drop has ended
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
