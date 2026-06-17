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
          <div className="space-y-6">
            <DropCountdown targetDate={drop.drop_at} />
            <div className="my-8 border border-charcoal p-6 bg-cream">
              <h2 className="font-mono text-xs uppercase tracking-widest text-charcoal font-bold mb-4">
                WAITLIST REGISTRATION
              </h2>
              <WaitlistForm dropId={drop.id} />
            </div>
          </div>
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
          <div className="text-center border border-charcoal/35 bg-charcoal/5 py-12">
            <p className="font-mono text-xs uppercase tracking-widest text-charcoal/50 font-bold">
              DROP ARCHIVED // SALES CLOSED
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
