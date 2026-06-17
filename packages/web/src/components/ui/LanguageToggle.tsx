import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language || 'en'

  return (
    <div className="flex border border-white/20 font-mono text-xs overflow-hidden">
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-2.5 py-1 uppercase transition-all cursor-pointer ${
          currentLang === 'en' ? 'bg-white text-charcoal font-bold' : 'text-white hover:bg-white/10'
        }`}
      >
        EN
      </button>
      <div className="w-[1px] bg-white/20" />
      <button
        onClick={() => i18n.changeLanguage('th')}
        className={`px-2.5 py-1 uppercase transition-all cursor-pointer ${
          currentLang === 'th' ? 'bg-white text-charcoal font-bold' : 'text-white hover:bg-white/10'
        }`}
      >
        TH
      </button>
    </div>
  )
}
