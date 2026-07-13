import { IykykForm } from '../forms/IykykForm'
import { useTranslation } from 'react-i18next'

export function RewardReveal() {
  const { t } = useTranslation()

  return (
    <div className="flex max-h-[calc(100svh-4.5rem)] w-full flex-col overflow-hidden rounded-[16px] bg-white/92 shadow-[0_20px_60px_rgba(63,63,68,0.18)] backdrop-blur-sm md:max-h-[calc(100svh-5.5rem)] md:rounded-[20px]">
      {/* Narrative header */}
      <div className="flex shrink-0 flex-col items-center gap-2 px-5 pt-5 pb-3 text-center md:gap-3 md:px-14 md:pt-7 md:pb-4">
        <h1 className="font-brand text-[clamp(1.75rem,4.5vw,2.75rem)] leading-none tracking-[0.08em] text-charcoal">
          {t('iykyk.headline')}
        </h1>
        <div className="max-w-[520px] space-y-1 font-body text-[13px] leading-snug tracking-[-0.04em] text-charcoal md:text-[15px]">
          <p>{t('iykyk.line1')}</p>
          <p>
            <span>{t('iykyk.line2_pre')}</span>
            <span className="font-bold">{t('iykyk.line2_bold')}</span>
            <span>{t('iykyk.line2_post')}</span>
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 md:px-14 md:pb-7">
        <IykykForm />
      </div>
    </div>
  )
}
