import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

interface OrderButtonProps {
  googleFormUrl?: string
  isSoldOut: boolean
  className?: string
}

export function OrderButton({ googleFormUrl, isSoldOut, className = '' }: OrderButtonProps) {
  const { t } = useTranslation()

  if (isSoldOut) {
    return (
      <div className={className}>
        <Badge variant="soldout">{t('product.soldout')}</Badge>
      </div>
    )
  }

  if (!googleFormUrl) {
    return (
      <div className={className}>
        <p className="font-body text-sm text-charcoal opacity-60">
          {t('product.comingsoon')}
        </p>
      </div>
    )
  }

  return (
    <a href={googleFormUrl} target="_blank" rel="noopener noreferrer" className={className}>
      <Button variant="primary" className="w-full md:w-auto">
        {t('product.orderbutton')}
      </Button>
    </a>
  )
}
