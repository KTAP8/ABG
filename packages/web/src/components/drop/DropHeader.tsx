import { Drop } from '../../lib/api'
import { useTranslation } from 'react-i18next'

interface DropHeaderProps {
  drop: Drop
}

export function DropHeader({ drop }: DropHeaderProps) {
  const { i18n } = useTranslation()

  const dropDate = new Date(drop.drop_at).toLocaleDateString(
    i18n.language === 'th' ? 'th-TH' : 'en-GB',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  )

  const description = i18n.language === 'th' ? drop.description_th || drop.description : drop.description

  return (
    <div className="space-y-4 mb-8">
      <h1 className="font-display font-bold text-4xl md:text-6xl uppercase text-charcoal">
        {drop.name}
      </h1>
      <p className="font-mono text-sm uppercase tracking-wide text-charcoal">
        {dropDate}
      </p>
      {description && (
        <p className="font-body text-base leading-relaxed text-charcoal max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}
