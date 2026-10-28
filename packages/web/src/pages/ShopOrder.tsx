import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { getDrops, saveShopOrder, sortShopProducts, type Product } from '../lib/api'

function priceLabel(price: number) {
  return `฿${price.toLocaleString('th-TH')}`
}

export default function ShopOrder() {
  const { t } = useTranslation()
  const dragIndex = useRef<number | null>(null)
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const drops = await getDrops()
        setItems(sortShopProducts(drops.flatMap((drop) => drop.products || [])))
      } catch (err) {
        console.error('Failed to load shop order', err)
        setError(t('admin.shop.error'))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [t])

  function onDragStart(index: number) {
    dragIndex.current = index
  }

  function onDragOver(event: React.DragEvent, index: number) {
    event.preventDefault()
    const from = dragIndex.current
    if (from === null || from === index) return
    setItems((current) => {
      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      return next
    })
    dragIndex.current = index
    setSaved(false)
  }

  function onDragEnd() {
    dragIndex.current = null
  }

  async function save() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      await saveShopOrder(
        items.map((item) => ({ id: item.id, featured: Boolean(item.shop_featured) })),
      )
      setItems((current) => current.map((item, index) => ({ ...item, shop_position: index })))
      setSaved(true)
    } catch (err) {
      console.error('Failed to save shop order', err)
      setError(t('admin.shop.error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-6 pt-8 pb-16 md:px-8 md:pt-10">
        <h1 className="font-display text-2xl font-bold lowercase leading-none tracking-[-0.07em] text-charcoal">
          {t('admin.shop.title')}
        </h1>
        <p className="mt-3 font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
          {t('admin.shop.note')}
        </p>

        {loading ? (
          <p className="py-16 font-body text-sm tracking-[-0.04em] text-charcoal/50">{t('admin.shop.loading')}</p>
        ) : items.length === 0 ? (
          <p className="py-16 font-body text-sm tracking-[-0.04em] text-charcoal/60">{t('admin.shop.empty')}</p>
        ) : (
          <ol className="mt-8 border-t border-charcoal/15">
            {items.map((item, index) => {
              const image = item.images?.[0]
              return (
                <li
                  key={item.id}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(event) => onDragOver(event, index)}
                  onDragEnd={onDragEnd}
                  className="flex cursor-grab items-center gap-4 border-b border-charcoal/15 py-3 active:cursor-grabbing"
                >
                  <span className="w-6 font-body text-[12px] tracking-[-0.04em] text-charcoal/40">
                    {index + 1}
                  </span>
                  {image ? (
                    <img src={image.url} alt="" className="h-16 w-12 object-cover" />
                  ) : (
                    <span className="h-16 w-12 bg-charcoal/10" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-body text-[14px] lowercase tracking-[-0.04em] text-charcoal">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block font-body text-[12px] tracking-[-0.04em] text-charcoal">
                      {priceLabel(item.price)}
                    </span>
                  </span>
                  <button
                    type="button"
                    draggable={false}
                    onDragStart={(event) => event.stopPropagation()}
                    onClick={() => {
                      setItems((current) =>
                        current.map((row) =>
                          row.id === item.id ? { ...row, shop_featured: !row.shop_featured } : row,
                        ),
                      )
                      setSaved(false)
                    }}
                    className={`cursor-pointer border px-3 py-2 font-body text-[12px] lowercase tracking-[-0.04em] ${
                      item.shop_featured
                        ? 'border-charcoal bg-charcoal text-cream'
                        : 'border-charcoal/20 text-charcoal'
                    }`}
                  >
                    {item.shop_featured ? t('admin.shop.highlighted') : t('admin.shop.highlight')}
                  </button>
                </li>
              )
            })}
          </ol>
        )}

        {error && (
          <p className="mt-4 font-body text-[12px] lowercase tracking-[-0.04em] text-red">{error}</p>
        )}

        {items.length > 0 && (
          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              disabled={saving}
              onClick={() => void save()}
              className="cursor-pointer bg-charcoal px-5 py-3 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? t('admin.shop.saving') : t('admin.shop.save')}
            </button>
            {saved && (
              <span className="font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/60">
                {t('admin.shop.saved')}
              </span>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
