import { CountdownTimer } from '../ui/CountdownTimer'
import { useTranslation } from 'react-i18next'

interface DropCountdownProps {
  targetDate: string
}

export function DropCountdown({ targetDate }: DropCountdownProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center space-y-4 border-y border-charcoal/15 py-10 text-center">
      <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
        {t('drop.countdown.label')}
      </p>
      <CountdownTimer targetDate={targetDate} className="justify-center" />
    </div>
  )
}
