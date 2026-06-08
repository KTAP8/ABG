import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ImageGallery } from '../components/product/ImageGallery'
import { SizeSelector } from '../components/product/SizeSelector'
import { OrderButton } from '../components/product/OrderButton'
import { Accordion } from '../components/ui/Accordion'
import { Modal } from '../components/ui/Modal'
import { getProduct } from '../lib/api'
import type { Product, ProductVariant } from '../lib/api'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { i18n } = useTranslation()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!slug) throw new Error('No slug provided')
        const data = await getProduct(slug)
        setProduct(data)
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
        }
      } catch (err) {
        setError('Product not found')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="h-screen flex items-center justify-center">
          <p className="font-body text-charcoal">{error}</p>
        </div>
      </div>
    )
  }

  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
  const isSoldOut = totalStock === 0
  const priceDisplay = `฿${(product.price / 100).toLocaleString(i18n.language === 'th' ? 'th-TH' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  const displayName = product.name
  const displayDescription = i18n.language === 'th' ? product.description_th || product.description : product.description

  const sizeGuideContent = 'Size guide content coming soon.'
  const materialContent = product.description || 'Material information not available.'

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <div>
            {product.images && product.images.length > 0 ? (
              <ImageGallery images={product.images} productName={displayName} />
            ) : (
              <div className="aspect-[3/4] bg-charcoal border border-charcoal" />
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl uppercase text-charcoal mb-2">
                {displayName}
              </h1>
              <p className="font-mono text-sm uppercase tracking-wide text-charcoal mb-4">
                {priceDisplay}
              </p>
              {displayDescription && (
                <p className="font-body text-sm leading-relaxed text-charcoal mb-4">
                  {displayDescription}
                </p>
              )}
            </div>

            {/* Size Selector */}
            {product.variants && product.variants.length > 0 && (
              <SizeSelector
                variants={product.variants}
                onSelect={setSelectedVariant}
              />
            )}

            {/* Stock Info */}
            {selectedVariant && (
              <div className="py-4 border-t border-charcoal border-b border-charcoal">
                <p className="font-mono text-sm text-charcoal">
                  Stock: {selectedVariant.stock} {selectedVariant.stock <= 15 && selectedVariant.stock > 0 && (
                    <span className="text-red"> (low)</span>
                  )}
                </p>
              </div>
            )}

            {/* Order Button */}
            <OrderButton
              googleFormUrl={product.google_form_url}
              isSoldOut={isSoldOut}
            />

            {/* Modals/Accordions */}
            <div className="space-y-4 pt-4">
              <button
                onClick={() => setShowSizeGuide(true)}
                className="font-body text-sm uppercase tracking-wide text-charcoal hover:underline"
              >
                Size Guide
              </button>
              <Accordion
                items={[
                  {
                    title: 'Material',
                    content: materialContent,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        title="Size Guide"
      >
        <p className="font-body text-sm text-charcoal">{sizeGuideContent}</p>
      </Modal>

      <Footer />
    </div>
  )
}
