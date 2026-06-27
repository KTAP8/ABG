import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ColorSelector } from '../components/product/ColorSelector'
import { SizeSelector } from '../components/product/SizeSelector'
import { OrderButton } from '../components/product/OrderButton'
import { Accordion } from '../components/ui/Accordion'
import { Modal } from '../components/ui/Modal'
import { getProduct } from '../lib/api'
import type { Product, ProductVariant } from '../lib/api'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!slug) throw new Error('No slug provided')
        const data = await getProduct(slug)
        setProduct(data)
        if (data.variants && data.variants.length > 0) {
          // Find first variant that has a color, or default to the first variant's color
          const firstColorVariant = data.variants.find((v) => v.color)
          const initialColor = firstColorVariant?.color || data.variants[0].color || ''
          setSelectedColor(initialColor)

          // Select the first variant matching that color
          const firstMatch = data.variants.find((v) => (v.color || '') === initialColor)
          setSelectedVariant(firstMatch || data.variants[0])
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

  // Extract unique colors from variant data
  const colors = Array.from(
    new Set(product?.variants?.map((v) => v.color).filter(Boolean))
  ) as string[]

  // Filter images by selected color (always include color-neutral images)
  const filteredImages = product?.images?.filter(
    (img) => !img.color || img.color === selectedColor
  ) || []

  // Filter variants by selected color (or empty if no color selected)
  const variantsForColor = product?.variants?.filter(
    (v) => (v.color || '') === selectedColor
  ) || []

  // Track the active image index in the viewport using Intersection Observer
  useEffect(() => {
    if (!product || filteredImages.length === 0) return

    const observers = filteredImages.map((_, index) => {
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
  }, [product, selectedColor, filteredImages.length])

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    if (product?.variants) {
      // Try to find a variant matching the current size and new color
      const currentSize = selectedVariant?.size
      const exactMatch = product.variants.find(
        (v) => v.color === color && v.size === currentSize
      )
      // Fallback to first available variant of new color
      const fallbackMatch = product.variants.find((v) => v.color === color)
      setSelectedVariant(exactMatch || fallbackMatch || null)
    }
    setActiveImageIndex(0)
  }

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
  const isVariantSoldOut = selectedVariant ? selectedVariant.stock === 0 : isSoldOut

  const priceDisplay = `฿${product.price.toLocaleString(i18n.language === 'th' ? 'th-TH' : 'en-US')}`

  const displayName = product.name
  const displayDescription = i18n.language === 'th' ? product.description_th || product.description : product.description

  const sizeGuideContent = t('product.sizeguide.content')
  const materialContent = t('product.material.laundry')

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Thumbnails Column (Leftmost) */}
          <div className="hidden md:flex md:col-span-1 flex-col gap-3 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            {filteredImages.length > 1 && filteredImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => scrollToImage(index)}
                className={`w-full aspect-[3/4] border bg-white overflow-hidden transition-all duration-200 cursor-pointer ${
                  index === activeImageIndex
                    ? 'border-charcoal opacity-100'
                    : 'border-charcoal/20 opacity-45 hover:opacity-85'
                }`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover grayscale"
                />
              </button>
            ))}
          </div>

          {/* Stacked Images Column (Center) */}
          <div className="col-span-1 md:col-span-7 space-y-6">
            {filteredImages.length > 0 ? (
              filteredImages.map((image, index) => (
                <div 
                  key={image.id} 
                  id={`product-image-${index}`}
                  className="relative w-full aspect-[3/4] bg-white overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.alt_text || `${displayName} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="aspect-[3/4] bg-cream" />
            )}
          </div>

          {/* Sticky Details Column (Right) */}
          <div className="col-span-1 md:col-span-4 md:sticky md:top-24">
            <div className="space-y-6 pr-2">
              
              {/* Region 1: Header Info (Status, Brand Category, Title, Price) */}
              <div className="space-y-2 pb-6 border-b border-charcoal/10">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-wider text-charcoal/40 uppercase select-none">
                    SAMYAN BAD DIH SERIES
                  </span>
                  
                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                    isVariantSoldOut 
                      ? 'bg-red/10 text-red border border-red/15' 
                      : 'bg-green-500/10 text-green-700 border border-green-500/15'
                  }`} style={{ 
                    color: isVariantSoldOut ? '#C0392B' : '#27AE60',
                    backgroundColor: isVariantSoldOut ? 'rgba(192, 57, 43, 0.08)' : 'rgba(39, 174, 96, 0.08)',
                    borderColor: isVariantSoldOut ? 'rgba(192, 57, 43, 0.15)' : 'rgba(39, 174, 96, 0.15)'
                  }}>
                    {isVariantSoldOut ? 'SOLD OUT' : 'IN STOCK'}
                  </span>
                </div>

                <h1 className="font-display font-black text-3xl md:text-4xl uppercase text-charcoal tracking-tight select-all leading-tight">
                  {displayName}
                </h1>

                <p className="font-mono text-xl font-black text-charcoal select-all">
                  {priceDisplay}
                </p>
              </div>

              {/* Region 2: Purchase Control Group (Variants Selection + CTA Order Button) */}
              <div className="space-y-6 pb-6 border-b border-charcoal/10">
                <div className="space-y-4">
                  {/* Color Selector */}
                  {colors.length > 0 && (
                    <ColorSelector
                      colors={colors}
                      selectedColor={selectedColor}
                      onSelect={handleColorChange}
                    />
                  )}

                  {/* Size Selector */}
                  {variantsForColor.length > 0 && (
                    <SizeSelector
                      variants={variantsForColor}
                      selectedId={selectedVariant?.id || null}
                      onSelect={setSelectedVariant}
                    />
                  )}
                </div>

                <OrderButton
                  googleFormUrl={product.google_form_url}
                  isSoldOut={isVariantSoldOut}
                  stock={selectedVariant?.stock}
                />
              </div>

              {/* Region 3: Information Group (Description + Details List + Material Accordion) */}
              <div className="space-y-6 pt-2">
                {displayDescription && (
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] tracking-wider text-charcoal/40 uppercase block select-none">
                      Description
                    </span>
                    <p className="font-body text-sm leading-relaxed text-charcoal/80">
                      {displayDescription}
                    </p>
                  </div>
                )}

                {/* Tech Specs */}
                <div className="space-y-3 font-mono text-xs pt-2">
                  <span className="font-mono text-[9px] tracking-wider text-charcoal/40 uppercase block select-none">
                    Specifications
                  </span>
                  
                  <div className="grid grid-cols-3 py-1.5 border-b border-charcoal/5">
                    <span className="col-span-1 text-charcoal/40">FIT</span>
                    <span className="col-span-2 text-charcoal font-bold text-right uppercase">Boxy / Oversized</span>
                  </div>

                  <div className="grid grid-cols-3 py-1.5 border-b border-charcoal/5">
                    <span className="col-span-1 text-charcoal/40">COMPOSITION</span>
                    <span className="col-span-2 text-charcoal font-bold text-right uppercase">100% Cotton</span>
                  </div>

                  {selectedVariant && (
                    <div className="grid grid-cols-3 py-1.5 border-b border-charcoal/5">
                      <span className="col-span-1 text-charcoal/40">SKU</span>
                      <span className="col-span-2 text-charcoal font-bold text-right uppercase select-all">
                        {`ABG-${selectedVariant.id.slice(0, 8).toUpperCase()}`}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-charcoal/40 uppercase tracking-wider">SIZE GUIDE</span>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="font-mono text-[9px] uppercase tracking-wider text-charcoal font-bold hover:text-red transition-colors cursor-pointer border border-charcoal/20 px-2 py-0.5 bg-white hover:bg-charcoal hover:text-cream"
                    >
                      VIEW CHART
                    </button>
                  </div>
                </div>

                <div className="border-t border-charcoal/10 pt-4">
                  <Accordion
                    items={[
                      {
                        title: t('product.material.laundry_title'),
                        content: materialContent,
                      },
                    ]}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        title={t('product.sizeguide.title')}
      >
        <p className="font-body text-sm text-charcoal">{sizeGuideContent}</p>
      </Modal>

      <Footer />
    </div>
  )
}
