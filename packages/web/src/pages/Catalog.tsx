import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import {
  getCatalog,
  saveCatalogDrop,
  saveCatalogProduct,
  type CatalogDrop,
  type CatalogImage,
  type CatalogProduct,
  type CatalogResponse,
} from '../lib/api'

const fieldClass =
  'w-full border border-charcoal/20 bg-cream px-3 py-2 font-body text-[13px] tracking-[-0.04em] text-charcoal outline-none'
const labelClass = 'mb-1 block font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50'

const CATEGORIES = ['tops', 'bottoms', 'accessories'] as const
const GENDERS = ['men', 'women', 'unisex'] as const

function toLocalInput(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function textOrNull(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function placeProduct(catalog: CatalogResponse, product: CatalogProduct): CatalogResponse {
  const without = (items: CatalogProduct[]) => items.filter((item) => item.id !== product.id)
  const drops = catalog.drops.map((drop) => ({ ...drop, products: without(drop.products) }))
  const loose = without(catalog.loose)
  if (product.drop_id) {
    const drop = drops.find((item) => item.id === product.drop_id)
    if (drop) {
      drop.products = [...drop.products, product].sort((a, b) => a.name.localeCompare(b.name))
      return { drops, loose }
    }
  }
  return { drops, loose: [...loose, product].sort((a, b) => a.name.localeCompare(b.name)) }
}

export default function Catalog() {
  const { t } = useTranslation()
  const dragIndex = useRef<number | null>(null)
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [photoDraft, setPhotoDraft] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setCatalog(await getCatalog())
      } catch (err) {
        console.error('Failed to load catalog', err)
        setError(t('admin.catalog.error'))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [t])

  function updateDrop(dropId: string, patch: Partial<CatalogDrop>) {
    setCatalog((current) =>
      current
        ? {
            ...current,
            drops: current.drops.map((drop) => (drop.id === dropId ? { ...drop, ...patch } : drop)),
          }
        : current,
    )
    setSavedId(null)
  }

  function updateProduct(productId: string, patch: Partial<CatalogProduct>) {
    setCatalog((current) => {
      if (!current) return current
      const mapProduct = (product: CatalogProduct) =>
        product.id === productId ? { ...product, ...patch } : product
      return {
        drops: current.drops.map((drop) => ({ ...drop, products: drop.products.map(mapProduct) })),
        loose: current.loose.map(mapProduct),
      }
    })
    setSavedId(null)
  }

  async function saveDrop(drop: CatalogDrop) {
    setSavingId(drop.id)
    setError('')
    setSavedId(null)
    try {
      await saveCatalogDrop({
        id: drop.id,
        name: drop.name.trim(),
        name_th: textOrNull(drop.name_th ?? ''),
        description: textOrNull(drop.description ?? ''),
        description_th: textOrNull(drop.description_th ?? ''),
        drop_at: drop.drop_at,
        is_active: Boolean(drop.is_active),
      })
      setSavedId(drop.id)
    } catch (err) {
      console.error('Failed to save drop', err)
      setError(t('admin.catalog.error'))
    } finally {
      setSavingId(null)
    }
  }

  async function saveProduct(product: CatalogProduct) {
    setSavingId(product.id)
    setError('')
    setSavedId(null)
    try {
      const saved = await saveCatalogProduct({
        ...product,
        name: product.name.trim(),
        name_th: textOrNull(product.name_th ?? ''),
        description: textOrNull(product.description ?? ''),
        description_th: textOrNull(product.description_th ?? ''),
        category: product.category || 'accessories',
        gender: GENDERS.includes(product.gender as (typeof GENDERS)[number]) ? product.gender : 'unisex',
        is_active: product.is_active !== false,
      })
      setCatalog((current) => (current ? placeProduct(current, saved) : current))
      setSavedId(product.id)
    } catch (err) {
      console.error('Failed to save product', err)
      setError(t('admin.catalog.error'))
    } finally {
      setSavingId(null)
    }
  }

  function moveImage(product: CatalogProduct, index: number) {
    const from = dragIndex.current
    if (from === null || from === index) return
    const images = [...product.images]
    const [moved] = images.splice(from, 1)
    images.splice(index, 0, moved)
    dragIndex.current = index
    updateProduct(product.id, { images })
  }

  function addPhoto(product: CatalogProduct) {
    const url = photoDraft.trim()
    if (!url.startsWith('https://')) {
      setError(t('admin.catalog.invalid_photo'))
      return
    }
    setError('')
    updateProduct(product.id, {
      images: [...product.images, { url, alt_text: '', position: product.images.length }],
    })
    setPhotoDraft('')
  }

  const drops = catalog?.drops ?? []
  const loose = catalog?.loose ?? []

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-6 pt-8 pb-16 md:px-8 md:pt-10">
        <h1 className="font-display text-2xl font-bold lowercase leading-none tracking-[-0.07em] text-charcoal">
          {t('admin.catalog.title')}
        </h1>
        <p className="mt-3 font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
          {t('admin.catalog.note')}
        </p>
        <Link
          to="/admin/shop"
          className="mt-3 inline-block font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal underline decoration-charcoal/30 underline-offset-4"
        >
          {t('admin.catalog.shop_order')}
        </Link>

        {loading ? (
          <p className="py-16 font-body text-sm tracking-[-0.04em] text-charcoal/50">
            {t('admin.catalog.loading')}
          </p>
        ) : drops.length === 0 && loose.length === 0 ? (
          <p className="py-16 font-body text-sm tracking-[-0.04em] text-charcoal/60">
            {t('admin.catalog.empty')}
          </p>
        ) : (
          <div className="mt-10 space-y-12">
            {drops.map((drop) => (
              <section key={drop.id} className="border-t border-charcoal/15 pt-8">
                <DropFields
                  drop={drop}
                  saving={savingId === drop.id}
                  saved={savedId === drop.id}
                  onChange={(patch) => updateDrop(drop.id, patch)}
                  onSave={() => void saveDrop(drop)}
                />
                <div className="mt-8 space-y-3">
                  {drop.products.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      drops={drops}
                      open={openId === product.id}
                      saving={savingId === product.id}
                      saved={savedId === product.id}
                      photoDraft={openId === product.id ? photoDraft : ''}
                      onToggle={() => {
                        setOpenId(openId === product.id ? null : product.id)
                        setPhotoDraft('')
                      }}
                      onChange={(patch) => updateProduct(product.id, patch)}
                      onSave={() => void saveProduct(product)}
                      onPhotoDraft={setPhotoDraft}
                      onAddPhoto={() => addPhoto(product)}
                      onImageDragStart={(index) => {
                        dragIndex.current = index
                      }}
                      onImageDragOver={(index) => moveImage(product, index)}
                      onImageDragEnd={() => {
                        dragIndex.current = null
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}

            {loose.length > 0 && (
              <section className="border-t border-charcoal/15 pt-8">
                <h2 className="font-display text-lg font-bold lowercase tracking-[-0.07em] text-charcoal">
                  {t('admin.catalog.no_drop')}
                </h2>
                <div className="mt-6 space-y-3">
                  {loose.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      drops={drops}
                      open={openId === product.id}
                      saving={savingId === product.id}
                      saved={savedId === product.id}
                      photoDraft={openId === product.id ? photoDraft : ''}
                      onToggle={() => {
                        setOpenId(openId === product.id ? null : product.id)
                        setPhotoDraft('')
                      }}
                      onChange={(patch) => updateProduct(product.id, patch)}
                      onSave={() => void saveProduct(product)}
                      onPhotoDraft={setPhotoDraft}
                      onAddPhoto={() => addPhoto(product)}
                      onImageDragStart={(index) => {
                        dragIndex.current = index
                      }}
                      onImageDragOver={(index) => moveImage(product, index)}
                      onImageDragEnd={() => {
                        dragIndex.current = null
                      }}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {error && (
          <p className="mt-4 font-body text-[12px] lowercase tracking-[-0.04em] text-red">{error}</p>
        )}
      </main>
      <Footer />
    </div>
  )
}

function SaveRow({
  saving,
  saved,
  onSave,
}: {
  saving: boolean
  saved: boolean
  onSave: () => void
}) {
  const { t } = useTranslation()
  return (
    <div className="mt-4 flex items-center gap-4">
      <button
        type="button"
        disabled={saving}
        onClick={onSave}
        className="cursor-pointer bg-charcoal px-5 py-3 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? t('admin.catalog.saving') : t('admin.catalog.save')}
      </button>
      {saved && (
        <span className="font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/60">
          {t('admin.catalog.saved')}
        </span>
      )}
    </div>
  )
}

function DropFields({
  drop,
  saving,
  saved,
  onChange,
  onSave,
}: {
  drop: CatalogDrop
  saving: boolean
  saved: boolean
  onChange: (patch: Partial<CatalogDrop>) => void
  onSave: () => void
}) {
  const { t } = useTranslation()
  const active = Boolean(drop.is_active)
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-xl font-bold lowercase leading-none tracking-[-0.07em] text-charcoal">
          {drop.name}
        </h2>
        <button
          type="button"
          onClick={() => onChange({ is_active: !active })}
          className={`cursor-pointer border px-3 py-2 font-body text-[12px] lowercase tracking-[-0.04em] ${
            active ? 'border-charcoal bg-charcoal text-cream' : 'border-charcoal/20 text-charcoal'
          }`}
        >
          {active ? t('admin.catalog.active') : t('admin.catalog.hidden')}
        </button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label>
          <span className={labelClass}>{t('admin.catalog.name')}</span>
          <input
            value={drop.name}
            onChange={(event) => onChange({ name: event.target.value })}
            className={fieldClass}
          />
        </label>
        <label>
          <span className={labelClass}>{t('admin.catalog.name_th')}</span>
          <input
            value={drop.name_th ?? ''}
            onChange={(event) => onChange({ name_th: event.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="md:col-span-2">
          <span className={labelClass}>{t('admin.catalog.description')}</span>
          <textarea
            value={drop.description ?? ''}
            onChange={(event) => onChange({ description: event.target.value })}
            rows={3}
            className={fieldClass}
          />
        </label>
        <label className="md:col-span-2">
          <span className={labelClass}>{t('admin.catalog.description_th')}</span>
          <textarea
            value={drop.description_th ?? ''}
            onChange={(event) => onChange({ description_th: event.target.value })}
            rows={3}
            className={fieldClass}
          />
        </label>
        <label>
          <span className={labelClass}>{t('admin.catalog.drop_at')}</span>
          <input
            type="datetime-local"
            value={toLocalInput(drop.drop_at)}
            onChange={(event) => {
              const next = new Date(event.target.value)
              if (!Number.isNaN(next.getTime())) onChange({ drop_at: next.toISOString() })
            }}
            className={fieldClass}
          />
        </label>
      </div>
      <SaveRow saving={saving} saved={saved} onSave={onSave} />
    </div>
  )
}

function ProductRow({
  product,
  drops,
  open,
  saving,
  saved,
  photoDraft,
  onToggle,
  onChange,
  onSave,
  onPhotoDraft,
  onAddPhoto,
  onImageDragStart,
  onImageDragOver,
  onImageDragEnd,
}: {
  product: CatalogProduct
  drops: CatalogDrop[]
  open: boolean
  saving: boolean
  saved: boolean
  photoDraft: string
  onToggle: () => void
  onChange: (patch: Partial<CatalogProduct>) => void
  onSave: () => void
  onPhotoDraft: (value: string) => void
  onAddPhoto: () => void
  onImageDragStart: (index: number) => void
  onImageDragOver: (index: number) => void
  onImageDragEnd: () => void
}) {
  const { t } = useTranslation()
  const active = product.is_active !== false
  const categories = Array.from(new Set([product.category || 'accessories', ...CATEGORIES]))
  const genders = Array.from(new Set([product.gender || 'unisex', ...GENDERS]))

  return (
    <article className="border border-charcoal/15">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left"
      >
        <span className="min-w-0">
          <span className="block truncate font-body text-[14px] tracking-[-0.04em] text-charcoal">
            {product.name}
          </span>
          <span className="mt-0.5 block font-body text-[12px] tracking-[-0.04em] text-charcoal/60">
            ฿{product.price.toLocaleString('th-TH')}
            {!active ? ` · ${t('admin.catalog.hidden')}` : ''}
          </span>
        </span>
        <span className="font-body text-[12px] tracking-[-0.04em] text-charcoal/40">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="border-t border-charcoal/15 px-4 py-4">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => onChange({ is_active: !active })}
              className={`cursor-pointer border px-3 py-2 font-body text-[12px] lowercase tracking-[-0.04em] ${
                active ? 'border-charcoal bg-charcoal text-cream' : 'border-charcoal/20 text-charcoal'
              }`}
            >
              {active ? t('admin.catalog.active') : t('admin.catalog.hidden')}
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className={labelClass}>{t('admin.catalog.name')}</span>
              <input
                value={product.name}
                onChange={(event) => onChange({ name: event.target.value })}
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>{t('admin.catalog.name_th')}</span>
              <input
                value={product.name_th ?? ''}
                onChange={(event) => onChange({ name_th: event.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="md:col-span-2">
              <span className={labelClass}>{t('admin.catalog.description')}</span>
              <textarea
                value={product.description ?? ''}
                onChange={(event) => onChange({ description: event.target.value })}
                rows={3}
                className={fieldClass}
              />
            </label>
            <label className="md:col-span-2">
              <span className={labelClass}>{t('admin.catalog.description_th')}</span>
              <textarea
                value={product.description_th ?? ''}
                onChange={(event) => onChange({ description_th: event.target.value })}
                rows={3}
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>{t('admin.catalog.price')}</span>
              <input
                inputMode="numeric"
                value={product.price}
                onChange={(event) => {
                  if (/^\d+$/.test(event.target.value)) onChange({ price: Number(event.target.value) })
                }}
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>{t('admin.catalog.category')}</span>
              <select
                value={product.category || 'accessories'}
                onChange={(event) => onChange({ category: event.target.value })}
                className={fieldClass}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORIES.includes(category as (typeof CATEGORIES)[number])
                      ? t(`products.filter.${category}`)
                      : category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>{t('admin.catalog.gender')}</span>
              <select
                value={product.gender || 'unisex'}
                onChange={(event) => onChange({ gender: event.target.value })}
                className={fieldClass}
              >
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {GENDERS.includes(gender as (typeof GENDERS)[number])
                      ? t(`products.filter.${gender}`)
                      : gender}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>{t('admin.catalog.drop')}</span>
              <select
                value={product.drop_id ?? ''}
                onChange={(event) => onChange({ drop_id: event.target.value || null })}
                className={fieldClass}
              >
                <option value="">{t('admin.catalog.no_drop')}</option>
                {drops.map((drop) => (
                  <option key={drop.id} value={drop.id}>
                    {drop.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {product.variants.length > 0 && (
            <div className="mt-6">
              <p className={labelClass}>{t('admin.catalog.stock')}</p>
              <ul className="border-t border-charcoal/15">
                {product.variants.map((variant) => (
                  <li
                    key={variant.id}
                    className="flex items-center justify-between gap-4 border-b border-charcoal/15 py-2"
                  >
                    <span className="font-body text-[13px] tracking-[-0.04em] text-charcoal">
                      {variant.size}
                      {variant.color ? ` / ${variant.color}` : ''}
                    </span>
                    <input
                      inputMode="numeric"
                      value={variant.stock ?? 0}
                      onChange={(event) => {
                        if (!/^\d+$/.test(event.target.value)) return
                        onChange({
                          variants: product.variants.map((row) =>
                            row.id === variant.id ? { ...row, stock: Number(event.target.value) } : row,
                          ),
                        })
                      }}
                      className={`${fieldClass} w-24`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <p className={labelClass}>{t('admin.catalog.photos')}</p>
            <ul className="border-t border-charcoal/15">
              {product.images.map((image, index) => (
                <li
                  key={image.id ?? `${image.url}-${index}`}
                  onDragOver={(event) => {
                    event.preventDefault()
                    onImageDragOver(index)
                  }}
                  className="flex items-center gap-3 border-b border-charcoal/15 py-2"
                >
                  <span
                    draggable
                    onDragStart={() => onImageDragStart(index)}
                    onDragEnd={onImageDragEnd}
                    className="cursor-grab px-1 font-body text-[12px] text-charcoal/40 active:cursor-grabbing"
                  >
                    {index + 1}
                  </span>
                  <img src={image.url} alt="" className="h-16 w-12 object-cover" />
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">{t('admin.catalog.alt')}</span>
                    <input
                      value={image.alt_text ?? ''}
                      placeholder={t('admin.catalog.alt')}
                      onChange={(event) => {
                        const images: CatalogImage[] = product.images.map((row, rowIndex) =>
                          rowIndex === index ? { ...row, alt_text: event.target.value } : row,
                        )
                        onChange({ images })
                      }}
                      className={fieldClass}
                    />
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <input
                value={photoDraft}
                onChange={(event) => onPhotoDraft(event.target.value)}
                placeholder={t('admin.catalog.photo_url')}
                className={fieldClass}
              />
              <button
                type="button"
                onClick={onAddPhoto}
                className="cursor-pointer border border-charcoal px-3 py-2 font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal"
              >
                {t('admin.catalog.add_photo')}
              </button>
            </div>
          </div>

          {product.specs.length > 0 && (
            <div className="mt-6">
              <p className={labelClass}>{t('admin.catalog.specs')}</p>
              <ul>
                {product.specs.map((spec) => (
                  <li key={spec.id} className="font-body text-[13px] tracking-[-0.04em] text-charcoal/70">
                    {spec.label}: {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <SaveRow saving={saving} saved={saved} onSave={onSave} />
        </div>
      )}
    </article>
  )
}
