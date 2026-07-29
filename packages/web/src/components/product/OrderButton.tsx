import { useTranslation } from 'react-i18next'

interface OrderButtonProps {
  googleFormUrl?: string
  isSoldOut: boolean
  stock?: number
  className?: string
}

export function OrderButton({ googleFormUrl, isSoldOut, stock, className = '' }: OrderButtonProps) {
  const { t } = useTranslation()

  if (isSoldOut) {
    return (
      <button
        disabled
        type="button"
        className={`w-full cursor-not-allowed border border-charcoal/15 bg-charcoal/5 px-5 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/40 select-none ${className}`}
      >
        {t('product.soldout')}
      </button>
    )
  }

  if (!googleFormUrl) {
    return (
      <button
        disabled
        type="button"
        className={`w-full cursor-not-allowed border border-charcoal/15 bg-charcoal/5 px-5 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/40 select-none ${className}`}
      >
        {t('product.comingsoon')}
      </button>
    )
  }

  const showStockWarning = stock !== undefined && stock > 0 && stock < 3

  return (
    <div className={`space-y-3 ${className}`}>
      {showStockWarning && (
        <p className="text-center select-none">
          <span className="inline-block bg-red px-2 py-1 font-body text-[12px] lowercase tracking-[-0.04em] text-white">
            {t('product.lowstock', { count: stock })}
          </span>
        </p>
      )}

      <a href={googleFormUrl} target="_blank" rel="noopener noreferrer" className="block">
        <button
          type="button"
          className="w-full cursor-pointer bg-charcoal px-5 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 focus:outline-none"
        >
          {t('product.orderbutton')}
        </button>
      </a>
    </div>
  )
}
