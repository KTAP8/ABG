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
    <div className="border border-charcoal p-6 bg-cream my-12">
      <span className="font-mono text-[9px] uppercase tracking-widest text-charcoal/50 block mb-2">
        {t('drop.notes.label').toUpperCase()}
      </span>
      <p className="font-display font-black text-lg md:text-xl uppercase text-charcoal leading-relaxed max-w-3xl">
        "{displayNotes}"
      </p>
    </div>
  )
}
