import { useTranslation } from 'react-i18next'
import { formatPrice } from '../../lib/format'

interface FreeShippingBarProps {
  threshold: number
  remaining: number
}

export function FreeShippingBar({ threshold, remaining }: FreeShippingBarProps) {
  const { t } = useTranslation()
  const reached = remaining <= 0
  const progress = reached ? 100 : Math.min(100, Math.max(0, ((threshold - remaining) / threshold) * 100))

  return (
    <div className="space-y-2" aria-live="polite">
      <div
        className="h-1.5 w-full bg-charcoal/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-valuenow={Math.max(0, threshold - remaining)}
      >
        <div
          className={`h-full transition-[width] duration-500 ease-out ${reached ? 'bg-red' : 'bg-charcoal'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p
        className={`font-body text-[12px] lowercase tracking-[-0.04em] ${reached ? 'text-red' : 'text-charcoal/70'}`}
      >
        {reached
          ? t('cart.free_ship.reached')
          : t('cart.free_ship.remaining', { amount: formatPrice(remaining) })}
      </p>
    </div>
  )
}
