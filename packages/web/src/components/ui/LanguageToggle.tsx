import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language || 'en'

  return (
    <div className="flex border border-charcoal font-mono text-xs overflow-hidden">
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-2.5 py-1 uppercase transition-all cursor-pointer ${
          currentLang === 'en' ? 'bg-charcoal text-cream font-bold' : 'text-charcoal hover:bg-charcoal/10'
        }`}
      >
        EN
      </button>
      <div className="w-[1px] bg-charcoal" />
      <button
        onClick={() => i18n.changeLanguage('th')}
        className={`px-2.5 py-1 uppercase transition-all cursor-pointer ${
          currentLang === 'th' ? 'bg-charcoal text-cream font-bold' : 'text-charcoal hover:bg-charcoal/10'
        }`}
      >
        TH
      </button>
    </div>
  )
}
