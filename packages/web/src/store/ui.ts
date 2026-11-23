import { create } from 'zustand'

export type CartOpenTrigger = 'add' | 'icon'

interface UIStore {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  cartOpen: boolean
  cartTrigger: CartOpenTrigger
  openCart: (trigger?: CartOpenTrigger) => void
  closeCart: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
  cartOpen: false,
  cartTrigger: 'add',
  openCart: (trigger = 'add') => set({ cartOpen: true, cartTrigger: trigger, mobileMenuOpen: false }),
  closeCart: () => set({ cartOpen: false }),
}))
