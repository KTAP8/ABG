import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ProductGrid } from '../components/product/ProductGrid'
import { getDrops } from '../lib/api'
import type { Product } from '../lib/api'

const CATEGORY_KEYS = [
  { value: '', key: 'products.filter.category_all' },
  { value: 'tops', key: 'products.filter.tops' },
  { value: 'bottoms', key: 'products.filter.bottoms' },
  { value: 'accessories', key: 'products.filter.accessories' },
] as const

const GENDER_KEYS = [
  { value: '', key: 'products.filter.gender_all' },
  { value: 'men', key: 'products.filter.men' },
  { value: 'women', key: 'products.filter.women' },
  { value: 'unisex', key: 'products.filter.unisex' },
] as const

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
        const allProducts = drops.flatMap((drop) => drop.products || [])
        setProducts(allProducts)
        setVisibleCount(8)
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
  const hasFilters = Boolean(selectedCategory || selectedGender)

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="w-full bg-cream px-6 pt-8 pb-16 md:px-8 md:pt-10 md:pb-20 lg:px-[27px] lg:pb-24">
        <div className="mx-auto w-full max-w-7xl">
          <header className="mb-10 border-b border-charcoal/15 pb-6 md:mb-12">
            <p className="mb-2 font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
              {t('products.section_label')}
            </p>
            <h1 className="font-display text-2xl font-bold lowercase leading-none tracking-[-0.07em] text-charcoal md:text-[28px] lg:text-[32px]">
              {t('products.title')}
            </h1>
            <p className="mt-3 max-w-md font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
              {t('products.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="cursor-pointer border border-charcoal/15 bg-cream px-3 py-2 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal focus:outline-none"
              >
                {CATEGORY_KEYS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {t(cat.key)}
                  </option>
                ))}
              </select>

              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="cursor-pointer border border-charcoal/15 bg-cream px-3 py-2 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal focus:outline-none"
              >
                {GENDER_KEYS.map((gender) => (
                  <option key={gender.value} value={gender.value}>
                    {t(gender.key)}
                  </option>
                ))}
              </select>

              {hasFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('')
                    setSelectedGender('')
                  }}
                  className="cursor-pointer px-1 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/70 transition-opacity hover:text-charcoal"
                >
                  {t('products.filter.clear')}
                </button>
              )}
            </div>
          </header>

          {loading ? (
            <p className="py-24 text-center font-body text-sm tracking-[-0.04em] text-charcoal/50 animate-pulse">
              {t('products.loading')}
            </p>
          ) : products.length > 0 ? (
            <div className="flex w-full flex-col items-center">
              <div className="w-full">
                <ProductGrid products={displayedProducts} />
              </div>

              <div
                ref={sentinelRef}
                className="flex w-full justify-center py-12 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/50"
              >
                {loadingMore ? (
                  <span>{t('products.loading_more')}</span>
                ) : visibleCount >= products.length ? (
                  <span>{t('products.all_loaded')}</span>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="py-24 text-center font-body text-sm tracking-[-0.04em] text-charcoal/60">
              {t('products.empty')}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
