import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
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
  const [, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

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

  // Track the active image index in the viewport using Intersection Observer
  useEffect(() => {
    if (!product || !product.images || product.images.length === 0) return

    const observers = product.images.map((_, index) => {
      const el = document.getElementById(`product-image-${index}`)
      if (!el) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveImageIndex(index)
          }
        },
        {
          root: null,
          rootMargin: '-20% 0px -50% 0px',
          threshold: 0.2,
        }
      )
      observer.observe(el)
      return { observer, el }
    })

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el)
      })
    }
  }, [product])

  const scrollToImage = (index: number) => {
    const el = document.getElementById(`product-image-${index}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

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
  const priceDisplay = `฿${product.price.toLocaleString(i18n.language === 'th' ? 'th-TH' : 'en-US')}`

  const displayName = product.name
  const displayDescription = i18n.language === 'th' ? product.description_th || product.description : product.description

  const sizeGuideContent = 'Size guide content coming soon.'
  const materialContent = product.description || 'Material information not available.'

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Thumbnails Column (Leftmost) */}
          <div className="hidden md:flex md:col-span-1 flex-col gap-3 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            {product.images && product.images.length > 1 && product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => scrollToImage(index)}
                className={`w-full aspect-[3/4] border bg-cream overflow-hidden transition-all duration-300 cursor-pointer ${
                  index === activeImageIndex
                    ? 'border-charcoal scale-105 opacity-100'
                    : 'border-charcoal/20 opacity-40 hover:opacity-80'
                }`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover grayscale mix-blend-multiply"
                />
              </button>
            ))}
          </div>

          {/* Stacked Images Column (Center) */}
          <div className="col-span-1 md:col-span-7 space-y-6">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div 
                  key={image.id} 
                  id={`product-image-${index}`}
                  className="relative w-full aspect-[3/4] bg-cream border border-charcoal p-6 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.alt_text || `${displayName} - view ${index + 1}`}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                  {/* Technical visual tag */}
                  <div className="absolute bottom-4 right-4 font-mono text-[8px] text-charcoal/40 bg-cream/90 border border-charcoal/15 px-1.5 py-0.5 select-none">
                    [VIEW_{String(index + 1).padStart(2, '0')} // ID: {image.id.slice(0, 8).toUpperCase()}]
                  </div>
                </div>
              ))
            ) : (
              <div className="aspect-[3/4] bg-charcoal border border-charcoal" />
            )}
          </div>

          {/* Sticky Details Column (Right) */}
          <div className="col-span-1 md:col-span-4 md:sticky md:top-24 space-y-6">
            <div className="border border-charcoal p-6 bg-cream space-y-4">
              <div>
                <span className="font-mono text-[9px] tracking-widest text-charcoal/50 uppercase block">// MODEL_NOMENCLATURE</span>
                <h1 className="font-display font-black text-3xl md:text-4xl uppercase text-charcoal tracking-tighter mt-1">
                  {displayName}
                </h1>
              </div>
              
              <div className="flex justify-between items-center border-t border-b border-charcoal/20 py-2">
                <span className="font-mono text-[9px] tracking-widest text-charcoal/50 uppercase block">// VALUE_REGISTRY</span>
                <span className="font-mono text-sm uppercase font-bold text-charcoal">{priceDisplay}</span>
              </div>

              {displayDescription && (
                <div className="space-y-1">
                  <span className="font-mono text-[9px] tracking-widest text-charcoal/50 uppercase block">// DESIGN_SPECIFICATION</span>
                  <p className="font-body text-xs leading-relaxed text-charcoal">
                    {displayDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Size Selector */}
            {product.variants && product.variants.length > 0 && (
              <SizeSelector
                variants={product.variants}
                onSelect={setSelectedVariant}
              />
            )}

            {/* Order Button */}
            <OrderButton
              googleFormUrl={product.google_form_url}
              isSoldOut={isSoldOut}
            />

            {/* Modals/Accordions */}
            <div className="border border-charcoal p-6 bg-cream space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-charcoal/20 pb-2">
                <span className="text-charcoal/50 uppercase tracking-widest text-[9px]">// FITMENT_SYSTEM</span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="font-mono text-[10px] uppercase tracking-wider text-charcoal hover:text-red transition-colors cursor-pointer"
                >
                  [VIEW_SIZE_GUIDE]
                </button>
              </div>
              <Accordion
                items={[
                  {
                    title: 'MATERIAL & SPECIFICATIONS',
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
