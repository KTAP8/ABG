import { useTranslation } from 'react-i18next'

interface DropNotesProps {
  notes?: string
}

export function DropNotes({ notes }: DropNotesProps) {
  const { t } = useTranslation()

  if (!notes) {
    return null
  }

  const displayNotes = notes

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
