import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import th from './locales/th.json'
import en from './locales/en.json'

const savedLanguage = localStorage.getItem('abg_lang') || 'en'

i18n.use(initReactI18next).init({
  resources: {
    th: { translation: th },
    en: { translation: en },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

// Sync localStorage when language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('abg_lang', lng)
})

export default i18n
