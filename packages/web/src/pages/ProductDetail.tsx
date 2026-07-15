import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ColorSelector } from '../components/product/ColorSelector'
import { SizeSelector } from '../components/product/SizeSelector'
import { Accordion } from '../components/ui/Accordion'
import { Modal } from '../components/ui/Modal'
import { getProduct } from '../lib/api'
import type { Product, ProductVariant } from '../lib/api'
import { useCart } from '../lib/cart-context'
import { useToast } from '../lib/toast-context'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [adding, setAdding] = useState(false)
  const imageColumnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!slug) throw new Error('No slug provided')
        const data = await getProduct(slug)
        setProduct(data)
        if (data.variants && data.variants.length > 0) {
          const firstColorVariant = data.variants.find((v) => v.color)
          const initialColor = firstColorVariant?.color || data.variants[0].color || ''
          setSelectedColor(initialColor)
          const firstMatch = data.variants.find((v) => (v.color || '') === initialColor)
          setSelectedVariant(firstMatch || data.variants[0])
        }
      } catch (err) {
        setError(t('product.not_found'))
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug, t])

  const colors = Array.from(
    new Set(product?.variants?.map((v) => v.color).filter(Boolean)),
  ) as string[]

  const filteredImages =
    product?.images?.filter((img) => !img.color || img.color === selectedColor) || []

  const variantsForColor =
    product?.variants?.filter((v) => (v.color || '') === selectedColor) || []

  useEffect(() => {
    if (!product || filteredImages.length === 0) return

    const root = imageColumnRef.current
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
          root,
          rootMargin: '-20% 0px -50% 0px',
          threshold: 0.2,
        },
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
      const currentSize = selectedVariant?.size
      const exactMatch = product.variants.find(
        (v) => v.color === color && v.size === currentSize,
      )
      const fallbackMatch = product.variants.find((v) => v.color === color)
      setSelectedVariant(exactMatch || fallbackMatch || null)
    }
    setActiveImageIndex(0)
  }

  const scrollToImage = (index: number) => {
    const el = document.getElementById(`product-image-${index}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <p className="font-body text-sm tracking-[-0.04em] text-charcoal/50 animate-pulse">
            {t('product.loading')}
          </p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <p className="font-body text-sm tracking-[-0.04em] text-charcoal/60">{error}</p>
        </div>
        <Footer />
      </div>
    )
  }

  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
  const isSoldOut = totalStock === 0
  const isVariantSoldOut = selectedVariant ? selectedVariant.stock === 0 : isSoldOut
  const priceDisplay = `฿${product.price.toLocaleString('en-US')}`
  const showStockWarning =
    selectedVariant !== null &&
    selectedVariant.stock > 0 &&
    selectedVariant.stock <= 15

  const handleAddToCart = async () => {
    if (!selectedVariant || isVariantSoldOut || adding) return
    setAdding(true)
    try {
      await addItem(selectedVariant.id, 1)
      showToast(t('cart.added'))
    } catch (err) {
      console.error(err)
      showToast(err instanceof Error ? err.message : t('cart.add_error'))
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream md:h-svh md:overflow-hidden">
      <Navbar />

      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-6 pt-6 pb-12 md:overflow-hidden md:px-8 md:pt-6 md:pb-0 lg:px-[27px]">
        <div className="grid min-h-0 flex-1 grid-cols-1 items-start gap-8 md:grid-cols-12 md:items-stretch md:gap-10 md:overflow-hidden">
          {/* Image column */}
          <div
            ref={imageColumnRef}
            className="col-span-1 min-h-0 md:col-span-8 md:overflow-y-auto md:overscroll-contain md:pr-2 scrollbar-none"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:gap-4 md:pb-10">
              <div className="sticky top-0 hidden max-h-[calc(100svh-5rem)] flex-col gap-3 self-start overflow-y-auto pr-1 scrollbar-none md:flex md:w-16 lg:w-20">
                {filteredImages.length > 1 &&
                  filteredImages.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => scrollToImage(index)}
                      className={`aspect-3/4 w-full cursor-pointer overflow-hidden border bg-white transition-opacity duration-200 ${
                        index === activeImageIndex
                          ? 'border-charcoal opacity-100'
                          : 'border-charcoal/15 opacity-45 hover:opacity-85'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
              </div>

              <div className="space-y-6">
                {filteredImages.length > 0 ? (
                  filteredImages.map((image, index) => (
                    <div
                      key={image.id}
                      id={`product-image-${index}`}
                      className="relative aspect-3/4 w-full overflow-hidden bg-white"
                    >
                      <img
                        src={image.url}
                        alt={image.alt_text || `${product.name} - view ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="aspect-3/4 bg-white" />
                )}
              </div>
            </div>
          </div>

          {/* Details column */}
          <div className="col-span-1 min-h-0 md:col-span-4 md:overflow-y-auto md:overscroll-contain md:pb-10 scrollbar-none">
            <div className="space-y-6 pr-2">
              <div className="space-y-2 border-b border-charcoal/15 pb-6">
                <div className="flex items-center justify-between">
                  <span className="font-body text-[11px] lowercase tracking-[-0.04em] text-charcoal/40 select-none">
                    {t('product.series')}
                  </span>
                  <span
                    className={`font-body text-[11px] lowercase tracking-[-0.04em] ${
                      isVariantSoldOut ? 'text-red' : 'text-charcoal/55'
                    }`}
                  >
                    {isVariantSoldOut ? t('product.soldout') : t('product.in_stock')}
                  </span>
                </div>

                <h1 className="font-display text-2xl font-bold lowercase leading-tight tracking-[-0.07em] text-charcoal md:text-3xl">
                  {product.name}
                </h1>

                <p className="font-body text-lg tracking-[-0.04em] text-charcoal">
                  {priceDisplay}
                </p>
              </div>

              <div className="space-y-6 border-b border-charcoal/15 pb-6">
                <div className="space-y-4">
                  {colors.length > 0 && (
                    <ColorSelector
                      colors={colors}
                      selectedColor={selectedColor}
                      onSelect={handleColorChange}
                    />
                  )}

                  {variantsForColor.length > 0 && (
                    <SizeSelector
                      variants={variantsForColor}
                      selectedId={selectedVariant?.id || null}
                      onSelect={setSelectedVariant}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  {showStockWarning && (
                    <p className="text-center font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55 select-none">
                      {t('product.lowstock', { count: selectedVariant!.stock })}
                    </p>
                  )}

                  {isVariantSoldOut ? (
                    <button
                      disabled
                      type="button"
                      className="w-full cursor-not-allowed border border-charcoal/15 bg-charcoal/5 px-5 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/40 select-none"
                    >
                      {t('product.soldout')}
                    </button>
                  ) : !selectedVariant ? (
                    <button
                      disabled
                      type="button"
                      className="w-full cursor-not-allowed border border-charcoal/15 bg-charcoal/5 px-5 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/40 select-none"
                    >
                      {t('product.select_variant')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={adding}
                      onClick={() => void handleAddToCart()}
                      className="w-full cursor-pointer bg-charcoal px-5 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {adding ? t('product.loading') : t('product.add_to_cart')}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6 pt-2">
                {product.description && (
                  <div className="space-y-2">
                    <span className="block font-body text-[11px] lowercase tracking-[-0.04em] text-charcoal/40 select-none">
                      {t('product.description_label')}
                    </span>
                    <p className="font-body text-sm leading-snug tracking-[-0.04em] text-charcoal/70">
                      {product.description}
                    </p>
                  </div>
                )}

                {(product.specs?.length || product.size_guide) && (
                  <div className="space-y-3 pt-2">
                    <span className="block font-body text-[11px] lowercase tracking-[-0.04em] text-charcoal/40 select-none">
                      {t('product.specs_label')}
                    </span>

                    {product.specs?.map((spec) => (
                      <div
                        key={spec.id}
                        className="grid grid-cols-3 border-b border-charcoal/10 py-2"
                      >
                        <span className="col-span-1 font-body text-[12px] lowercase text-charcoal/40">
                          {spec.label}
                        </span>
                        <span className="col-span-2 text-right font-body text-[12px] lowercase text-charcoal">
                          {spec.value}
                        </span>
                      </div>
                    ))}

                    {product.size_guide && (
                      <div className="flex items-center justify-between py-2">
                        <span className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/40">
                          {t('product.sizeguide.title')}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowSizeGuide(true)}
                          className="cursor-pointer font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/70 transition-opacity hover:text-charcoal"
                        >
                          {t('product.sizeguide.view')}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {product.care && (
                  <div className="border-t border-charcoal/15 pt-4">
                    <Accordion
                      items={[
                        {
                          title: t('product.material.laundry_title'),
                          content: product.care,
                        },
                      ]}
                    />
                  </div>
                )}
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
        <p className="font-body text-sm text-charcoal">{product.size_guide}</p>
      </Modal>

      <div className="md:hidden">
        <Footer />
      </div>
    </div>
  )
}
