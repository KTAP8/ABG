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
        className={`w-full bg-charcoal/10 border border-charcoal/10 text-charcoal/40 font-mono text-xs uppercase tracking-widest py-3.5 px-5 select-none cursor-not-allowed ${className}`}
      >
        {t('product.soldout').toUpperCase()}
      </button>
    )
  }

  if (!googleFormUrl) {
    return (
      <button
        disabled
        type="button"
        className={`w-full bg-charcoal/10 border border-charcoal/10 text-charcoal/40 font-mono text-xs uppercase tracking-widest py-3.5 px-5 select-none cursor-not-allowed ${className}`}
      >
        {t('product.comingsoon').toUpperCase()}
      </button>
    )
  }

  const showStockWarning = stock !== undefined && stock > 0 && stock <= 15

  return (
    <div className={`space-y-3.5 ${className}`}>
      {showStockWarning && (
        <div className="font-mono text-xs tracking-wider text-red font-bold text-center select-none py-1">
          {t('product.lowstock', { count: stock }).toUpperCase()}
        </div>
      )}

      <a href={googleFormUrl} target="_blank" rel="noopener noreferrer" className="block">
        <button
          type="button"
          className="w-full bg-black border border-black text-white font-mono text-xs uppercase tracking-widest py-3.5 px-5 transition-all duration-200 cursor-pointer text-center hover:bg-white hover:text-black focus:outline-none"
        >
          {t('product.orderbutton').toUpperCase()}
        </button>
      </a>
    </div>
  )
}
