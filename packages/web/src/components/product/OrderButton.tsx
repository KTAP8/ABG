import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'

interface OrderButtonProps {
  googleFormUrl?: string
  isSoldOut: boolean
  className?: string
}

export function OrderButton({ googleFormUrl, isSoldOut, className = '' }: OrderButtonProps) {
  const { t } = useTranslation()

  if (isSoldOut) {
    return (
      <div className={`border border-charcoal/30 bg-charcoal/5 p-4 text-center ${className}`}>
        <span className="font-mono text-xs uppercase tracking-widest text-charcoal/40 font-bold">
          [ACCESS_CLOSED: {t('product.soldout')}]
        </span>
      </div>
    )
  }

  if (!googleFormUrl) {
    return (
      <div className={`border border-charcoal p-4 text-center ${className}`}>
        <span className="font-mono text-xs uppercase tracking-widest text-charcoal font-bold">
          [STATUS: {t('product.comingsoon')}]
        </span>
      </div>
    )
  }

  return (
    <a href={googleFormUrl} target="_blank" rel="noopener noreferrer" className={`block ${className}`}>
      <Button variant="primary" className="w-full text-center">
        $ {t('product.orderbutton').toUpperCase()}_LINK()
      </Button>
    </a>
  )
}
