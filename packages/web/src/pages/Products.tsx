import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ProductGrid } from '../components/product/ProductGrid'
import { getDrops } from '../lib/api'
import type { Product } from '../lib/api'

export default function Products() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const drops = await getDrops()
        // Flatten all products from all drops
        const allProducts = drops.flatMap((drop) => drop.products || [])
        setProducts(allProducts)
      } catch (err) {
        console.error('Failed to fetch products', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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
        </div>

        {/* Full-bleed products grid */}
        {loading ? (
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-body text-charcoal text-center py-12">Loading...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="w-full">
            <ProductGrid products={products} className="border-x-0" cardBgClass="bg-white" />
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
