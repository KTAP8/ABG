import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  acceptAnalytics,
  declineAnalytics,
  getConsent,
  isAnalyticsEnabled,
  onConsentSettingsOpened,
  syncReplay,
} from '../lib/analytics'

const buttonClass =
  'flex-1 cursor-pointer border border-charcoal bg-charcoal px-5 py-2.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80'

/** Mounted once inside the router, so it also keeps replay in step with the route. */
export function ConsentBanner() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(() => isAnalyticsEnabled() && getConsent() === 'pending')

  useEffect(() => {
    syncReplay()
  }, [pathname])

  useEffect(() => onConsentSettingsOpened(() => setOpen(true)), [])

  if (!open) return null

  const choose = (apply: () => void) => {
    apply()
    setOpen(false)
  }

  return (
    <div
      role="region"
      aria-label={t('consent.title')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal bg-cream px-4 py-4 md:right-auto md:bottom-6 md:left-6 md:max-w-md md:border md:px-5"
    >
      <p className="font-body text-[13px] font-medium lowercase tracking-[-0.04em] text-charcoal">
        {t('consent.title')}
      </p>
      <p className="mt-1.5 font-body text-[12px] leading-snug tracking-[-0.04em] text-charcoal/70">
        {t('consent.body')}{' '}
        <Link to="/privacy" className="underline underline-offset-2">
          {t('consent.learn_more')}
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" className={buttonClass} onClick={() => choose(declineAnalytics)}>
          {t('consent.decline')}
        </button>
        <button type="button" className={buttonClass} onClick={() => choose(acceptAnalytics)}>
          {t('consent.accept')}
        </button>
      </div>
    </div>
  )
}
