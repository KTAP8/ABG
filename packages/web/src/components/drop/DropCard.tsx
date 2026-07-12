import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Drop } from '../../lib/api'
import { ProductGrid } from '../product/ProductGrid'

interface DropCardProps {
  drop: Drop
  isEnded: boolean
}

export function DropCard({ drop, isEnded }: DropCardProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const dropDate = new Date(drop.drop_at).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).toLowerCase()

  return (
    <div className="bg-cream">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer flex-col gap-3 py-5 text-left transition-opacity hover:opacity-70 md:flex-row md:items-center md:justify-between md:gap-8 select-none"
      >
        <div className="flex flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-8">
          <span className="min-w-[100px] font-body text-[12px] tracking-[-0.04em] text-charcoal/50">
            {dropDate}
          </span>
          <div>
            <h3 className="font-display text-base font-bold lowercase leading-snug tracking-[-0.07em] text-charcoal md:text-lg">
              {drop.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isEnded && (
            <span className="font-body text-[11px] lowercase tracking-[-0.04em] text-charcoal/50">
              {t('archive.ended')}
            </span>
          )}
          <span className="font-body text-[13px] tracking-[-0.04em] text-charcoal/40">
            {expanded ? '−' : '+'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="space-y-8 border-t border-charcoal/15 pb-10 pt-6">
          {drop.description && (
            <p className="max-w-2xl font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
              {drop.description}
            </p>
          )}
          {drop.products && drop.products.length > 0 && (
            <ProductGrid products={drop.products} />
          )}
        </div>
      )}
    </div>
  )
}
