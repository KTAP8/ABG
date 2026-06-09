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
      <div className={`border border-red bg-red/5 p-5 text-center font-mono text-xs select-none ${className}`}>
        <div className="text-red font-bold tracking-widest animate-pulse">
          ✖ SYSTEM_OFFLINE // ACCESS_DENIED
        </div>
        <div className="text-red/60 text-[9px] mt-1 uppercase">
          // {t('product.soldout').toUpperCase()} // ALL_UNITS_EXHAUSTED
        </div>
      </div>
    )
  }

  if (!googleFormUrl) {
    return (
      <div className={`border border-charcoal/30 bg-charcoal/5 p-5 text-center font-mono text-xs select-none ${className}`}>
        <div className="text-charcoal/50 font-bold tracking-widest">
          ⌛ SYSTEM_STANDBY // ON_HOLD
        </div>
        <div className="text-charcoal/40 text-[9px] mt-1 uppercase">
          // {t('product.comingsoon').toUpperCase()} // PROTOCOL_PENDING
        </div>
      </div>
    )
  }

  // Generate visual capacity bar if stock is low
  const showStockWarning = stock !== undefined && stock > 0 && stock <= 15
  let stockBar = ''
  if (showStockWarning) {
    const totalSlots = 10
    const filledSlots = Math.max(1, Math.ceil((stock / 15) * totalSlots))
    stockBar = '█'.repeat(filledSlots) + '░'.repeat(totalSlots - filledSlots)
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      {showStockWarning && (
        <div className="font-mono text-[9px] tracking-widest text-red/75 flex justify-between items-center select-none bg-red/5 border border-red/15 px-3 py-1.5 animate-pulse">
          <span>// CAPACITY_WARNING: {stockBar}</span>
          <span className="font-bold">{stock} UNITS REGISTERED</span>
        </div>
      )}

      <a href={googleFormUrl} target="_blank" rel="noopener noreferrer" className="block group">
        <button
          type="button"
          className="w-full bg-charcoal border-2 border-charcoal text-cream font-mono text-xs uppercase tracking-widest py-3.5 px-5 transition-all duration-300 cursor-pointer flex items-center justify-between group-hover:bg-red group-hover:border-red group-hover:text-cream shadow-[4px_4px_0px_rgba(63,63,68,0.15)] group-hover:shadow-[4px_4px_0px_rgba(192,57,43,0.15)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[2px_2px_0px_rgba(0,0,0,0.1)] focus:outline-none"
        >
          <span className="font-bold flex items-center gap-2">
            <span className="text-red group-hover:text-cream transition-colors duration-300">►</span>
            {t('product.orderbutton').toUpperCase()}_LINK()
          </span>
          <span className="text-[10px] opacity-60 group-hover:opacity-100 transition-opacity">
            [EXECUTE]
          </span>
        </button>
      </a>

      <div className="text-center">
        <span className="font-mono text-[8px] tracking-wider text-charcoal/40 uppercase block select-none">
          // SECURE_REDIRECT: INITIALIZING GOOGLE_FORM_PROTOCOL...
        </span>
      </div>
    </div>
  )
}
