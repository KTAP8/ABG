import { useTranslation } from 'react-i18next'
import { Drop } from '../../lib/api'

interface DropHeaderProps {
  drop: Drop
}

export function DropHeader({ drop }: DropHeaderProps) {
  const { t } = useTranslation()
  const dropDate = new Date(drop.drop_at)
    .toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .toLowerCase()

  const isUpcoming = new Date(drop.drop_at) > new Date()

  return (
    <header className="border-b border-charcoal/15 pb-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
            {t('drop.section_label')}
          </p>
          <h1 className="font-display text-2xl font-bold lowercase leading-none tracking-[-0.07em] text-charcoal md:text-[28px] lg:text-[32px]">
            {drop.name}
          </h1>
          {drop.description && (
            <p className="mt-4 max-w-xl font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
              {drop.description}
            </p>
          )}
        </div>
        <div className="space-y-1 text-left md:text-right">
          <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
            {dropDate}
          </p>
          <p className="font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal/70">
            {isUpcoming ? t('drop.status.waitlist') : t('drop.status.live')}
          </p>
        </div>
      </div>
    </header>
  )
}
