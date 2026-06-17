import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ProductGrid } from '../components/product/ProductGrid'
import { getDrops } from '../lib/api'
import type { Product } from '../lib/api'

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'accessories', label: 'Accessories' },
]

const GENDERS = [
  { value: '', label: 'All Genders' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
]

export default function Products() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(8)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedGender, setSelectedGender] = useState('')
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const drops = await getDrops({
          category: selectedCategory || undefined,
          gender: selectedGender || undefined,
        })
        // Flatten all products from all drops
        const allProducts = drops.flatMap((drop) => drop.products || [])
        setProducts(allProducts)
        setVisibleCount(8) // Reset visible items count when filters change
      } catch (err) {
        console.error('Failed to fetch products', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, selectedGender])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && !loading && !loadingMore && visibleCount < products.length) {
          setLoadingMore(true)
          // Add a subtle delay (400ms) for premium visual feedback on loading
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 8, products.length))
            setLoadingMore(false)
          }, 400)
        }
      },
      { threshold: 0.1 }
    )

    const currentSentinel = sentinelRef.current
    if (currentSentinel) {
      observer.observe(currentSentinel)
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel)
      }
    }
  }, [loading, loadingMore, visibleCount, products.length])

  const displayedProducts = products.slice(0, visibleCount)

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-12 bg-white">
        {/* Centered, capped header */}
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase text-charcoal mb-2">
            {t('products.title')}
          </h1>
          <p className="font-body text-sm text-charcoal opacity-75">
            {t('products.subtitle')}
          </p>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-charcoal text-charcoal font-mono text-sm uppercase bg-cream focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-4 py-2 border border-charcoal text-charcoal font-mono text-sm uppercase bg-cream focus:outline-none"
            >
              {GENDERS.map((gender) => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
            </select>

            {(selectedCategory || selectedGender) && (
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedGender('')
                }}
                className="px-4 py-2 border border-charcoal text-charcoal font-mono text-sm uppercase hover:bg-charcoal hover:text-cream transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Full-bleed products grid */}
        {loading ? (
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-body text-charcoal text-center py-12">Loading...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="w-full flex flex-col items-center">
            <div className="w-full">
              <ProductGrid products={displayedProducts} className="border-x-0" cardBgClass="bg-white" />
            </div>
            
            {/* Infinite scroll sentinel / loader */}
            <div 
              ref={sentinelRef} 
              className="w-full flex justify-center py-12 font-mono text-[11px] text-charcoal/60 uppercase tracking-widest"
            >
              {loadingMore ? (
                <span>{t('products.loading_more')}</span>
              ) : visibleCount >= products.length ? (
                <span>{t('products.all_loaded')}</span>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 text-center py-12">
            <p className="font-body text-charcoal opacity-60">
              No products available yet. Check back when the first drop launches.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
