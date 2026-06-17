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
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 4

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

  const products = latestDrop?.products || []
  const totalPages = Math.ceil(products.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage)

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <DropBanner />

      {/* Redesigned Minimalist Hero */}
      <section className="h-[calc(100vh-7rem)] min-h-[500px] border-b border-charcoal flex flex-col items-center justify-center text-center p-8 lg:p-16 relative">
        <h1 className="font-display font-black text-[10vw] lg:text-[7vw] leading-[0.9] uppercase text-charcoal tracking-[-0.12em] mb-6 select-none z-10">
          ACOUSTIC<br />
          BUT<br />
          GOATED
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-charcoal max-w-sm z-10">
          {t('hero.sub')}
        </p>
        <div className="absolute bottom-8 w-0.5 h-10 bg-charcoal animate-pulse hidden md:block" />
      </section>

      {/* Marquee Ticker Tape */}
      <div className="border-b border-charcoal bg-charcoal overflow-hidden py-2 select-none">
        <div className="animate-marquee whitespace-nowrap flex font-mono text-[9px] uppercase tracking-widest text-cream font-bold">
          <span className="mx-6">* BATCH_01 RELEASE *</span>
          <span className="mx-6">ACOUSTIC BUT GOATED</span>
          <span className="mx-6">* NO RESTOCKS // ARCHIVED FOREVER *</span>
          
          {/* Duplicate content to loop smoothly */}
          <span className="mx-6">* BATCH_01 RELEASE *</span>
          <span className="mx-6">ACOUSTIC BUT GOATED</span>
          <span className="mx-6">* NO RESTOCKS // ARCHIVED FOREVER *</span>
        </div>
      </div>

      {/* Editorial Grid / Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="py-24 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-charcoal animate-pulse">
              Loading...
            </span>
          </div>
        ) : latestDrop && latestDrop.products ? (
          <div className="flex flex-col items-center">
            <div className="w-full mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-charcoal pb-4">
              <h2 className="font-display font-black text-2xl md:text-3xl uppercase text-charcoal">
                {latestDrop.name}
              </h2>
            </div>
            <div className="w-full">
              <ProductGrid products={paginatedProducts} />
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-12 font-mono text-[11px] select-none">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2 border border-charcoal text-charcoal font-bold uppercase transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-charcoal hover:text-cream cursor-pointer"
                >
                  &lt; {t('pagination.prev')}
                </button>
                <span className="text-charcoal uppercase tracking-wider font-bold">
                  {t('pagination.page')} {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 border border-charcoal text-charcoal font-bold uppercase transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-charcoal hover:text-cream cursor-pointer"
                >
                  {t('pagination.next')} &gt;
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-charcoal/40">
            <p className="font-mono text-sm uppercase tracking-wider text-charcoal opacity-70">
              {t('something.coming')}
            </p>
          </div>
        )}
      </section>

      {/* Section divider rule */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="hr-tech opacity-40" />
      </div>

      {/* Brand Statement */}
      <section className="my-24 max-w-3xl mx-auto px-4 text-center">
        <blockquote className="font-display font-black text-3xl md:text-5xl leading-tight text-charcoal uppercase mb-6">
          {t('hero.sub')}
        </blockquote>
        <p className="font-mono text-xs tracking-wider leading-relaxed text-charcoal/70 uppercase">
          The raw culture of Samyan campus, captured and expressed through heavy cotton fibers. Produced in limited batches.
        </p>
      </section>

      <Footer />
    </div>
  )
}
