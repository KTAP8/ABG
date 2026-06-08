import { create } from 'zustand'

interface UIStore {
  language: string
  setLanguage: (lang: string) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  language: localStorage.getItem('abg_lang') || 'th',
  setLanguage: (lang: string) => {
    localStorage.setItem('abg_lang', lang)
    set({ language: lang })
  },
  mobileMenuOpen: false,
  setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
}))
