import { useTranslation } from 'react-i18next'

interface DropNotesProps {
  notes?: string
  notes_th?: string
}

export function DropNotes({ notes, notes_th }: DropNotesProps) {
  const { i18n, t } = useTranslation()

  if (!notes && !notes_th) {
    return null
  }

  const displayNotes = i18n.language === 'th' ? notes_th || notes : notes

  return (
    <div className="my-12 pt-8 border-t border-charcoal">
      <p className="font-body text-xs uppercase tracking-wide text-charcoal mb-4">
        {t('drop.notes.label')}
      </p>
      <p className="font-display font-bold text-lg md:text-2xl leading-relaxed text-charcoal max-w-2xl">
        {displayNotes}
      </p>
    </div>
  )
}
