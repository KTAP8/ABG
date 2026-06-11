import { useEffect, useState } from 'react'
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
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedGender, setSelectedGender] = useState('')
  const productsPerPage = 4

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
        setCurrentPage(1) // Reset to first page when filters change
      } catch (err) {
        console.error('Failed to fetch products', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, selectedGender])

  const totalPages = Math.ceil(products.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage)

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
              <ProductGrid products={paginatedProducts} className="border-x-0" cardBgClass="bg-white" />
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
