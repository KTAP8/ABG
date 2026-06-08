import { CountdownTimer } from '../ui/CountdownTimer'
import { useTranslation } from 'react-i18next'

interface DropCountdownProps {
  targetDate: string
}

export function DropCountdown({ targetDate }: DropCountdownProps) {
  const { t } = useTranslation()

  return (
    <div className="border border-charcoal p-6 md:p-10 bg-cream text-center flex flex-col items-center justify-center space-y-4 mb-8">
      <p className="font-mono text-xs uppercase tracking-widest text-charcoal/60">
        // {t('drop.countdown.label').toUpperCase()}_SEQUENCE_ACTIVATED
      </p>
      <CountdownTimer targetDate={targetDate} className="justify-center" />
    </div>
  )
}
