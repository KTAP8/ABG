import { useTranslation } from 'react-i18next'

interface DropNotesProps {
  notes?: string
}

export function DropNotes({ notes }: DropNotesProps) {
  const { t } = useTranslation()

  if (!notes) {
    return null
  }

  return (
    <div className="my-12 border-t border-charcoal/15 pt-10">
      <span className="mb-3 block font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
        {t('drop.notes.label')}
      </span>
      <p className="max-w-2xl font-body text-[15px] leading-snug tracking-[-0.04em] text-charcoal/70 md:text-base">
        {notes}
      </p>
    </div>
  )
}
