import { create } from 'zustand'

interface UIStore {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
}))
