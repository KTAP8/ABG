import { CountdownTimer } from '../ui/CountdownTimer'
import { useTranslation } from 'react-i18next'

interface DropCountdownProps {
  targetDate: string
}

export function DropCountdown({ targetDate }: DropCountdownProps) {
  const { t } = useTranslation()

  return (
    <div className="text-center py-8 md:py-12">
      <p className="font-body text-sm uppercase tracking-wide text-charcoal mb-4">
        {t('drop.countdown.label')}
      </p>
      <CountdownTimer targetDate={targetDate} className="text-2xl md:text-4xl text-charcoal justify-center" />
    </div>
  )
}
