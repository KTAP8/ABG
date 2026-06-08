import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n } = useTranslation()

  const toggle = () => {
    const newLang = i18n.language === 'th' ? 'en' : 'th'
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 font-body text-sm uppercase tracking-wide text-charcoal hover:underline transition-all"
    >
      {i18n.language === 'th' ? 'EN' : 'TH'}
    </button>
  )
}
