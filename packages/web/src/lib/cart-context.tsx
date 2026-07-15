import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  addCartItem as apiAddCartItem,
  clearCart as apiClearCart,
  getCart,
  mergeCart,
  removeCartItem as apiRemoveCartItem,
  updateCartItem as apiUpdateCartItem,
  type CartItem,
  type CartResponse,
} from './api'
import { useAuth } from './auth-context'
import { clearGuestId, getGuestId, getOrCreateGuestId } from './guest-id'

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  loading: boolean
  ready: boolean
  refresh: () => Promise<void>
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

const emptyCart: CartResponse = { id: null, items: [], item_count: 0, subtotal: 0 }

/** Module-level merge lock — survives Strict Mode remounts. */
let mergeInFlight: Promise<void> | null = null
const mergedGuestIds = new Set<string>()

function applyCart(
  setItems: (items: CartItem[]) => void,
  setItemCount: (n: number) => void,
  setSubtotal: (n: number) => void,
  cart: CartResponse,
) {
  setItems(cart.items)
  setItemCount(cart.item_count)
  setSubtotal(cart.subtotal)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const prevUserIdRef = useRef<string | null | undefined>(undefined)

  const headerOpts = useCallback(() => {
    const signedIn = Boolean(user?.id)
    return {
      signedIn,
      // Guest header only when signed out
      guestId: signedIn ? null : getGuestId(),
    }
  }, [user?.id])

  /** GET only — never mutates server. Safe on mount / refresh. */
  const refresh = useCallback(async () => {
    try {
      const opts = headerOpts()
      // No identity at all → empty cart without a network create
      if (!opts.signedIn && !opts.guestId) {
        applyCart(setItems, setItemCount, setSubtotal, emptyCart)
        return
      }
      const cart = await getCart(opts)
      applyCart(setItems, setItemCount, setSubtotal, cart)
    } catch (err) {
      console.error('Cart refresh failed:', err)
    } finally {
      setLoading(false)
      setReady(true)
    }
  }, [headerOpts])

  const mergeIfNeeded = useCallback(async () => {
    if (!user?.id) return

    const guestId = getGuestId()
    if (!guestId) return
    if (mergedGuestIds.has(guestId)) return

    if (mergeInFlight) {
      await mergeInFlight
      return
    }

    mergeInFlight = (async () => {
      try {
        const cart = await mergeCart(guestId)
        clearGuestId()
        mergedGuestIds.add(guestId)
        applyCart(setItems, setItemCount, setSubtotal, cart)
      } catch (err) {
        // Keep guest id so a later retry can recover
        console.error('Cart merge failed:', err)
        throw err
      } finally {
        mergeInFlight = null
      }
    })()

    await mergeInFlight
  }, [user?.id])

  // Initial load + when auth finishes: GET only
  useEffect(() => {
    if (authLoading) return
    void refresh()
  }, [authLoading, refresh])

  // null → signed-in transition: one-shot merge, then GET with auth only
  useEffect(() => {
    if (authLoading) return

    const prev = prevUserIdRef.current
    const next = user?.id ?? null
    prevUserIdRef.current = next

    // Skip first run (undefined → whatever) — handled by refresh above
    if (prev === undefined) return

    if (!prev && next) {
      void (async () => {
        try {
          await mergeIfNeeded()
        } catch {
          // merge failed — still refresh user cart
        }
        await refresh()
      })()
      return
    }

    // Sign-out: refresh guest cart if a guest id still exists; do not mint one
    if (prev && !next) {
      void refresh()
    }
  }, [authLoading, user?.id, mergeIfNeeded, refresh])

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      const signedIn = Boolean(user?.id)
      // Lazy-create guest id only on first guest mutation
      const guestId = signedIn ? null : getOrCreateGuestId()
      const cart = await apiAddCartItem(variantId, quantity, { signedIn, guestId })
      applyCart(setItems, setItemCount, setSubtotal, cart)
    },
    [user?.id],
  )

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      const cart = await apiUpdateCartItem(itemId, quantity, headerOpts())
      applyCart(setItems, setItemCount, setSubtotal, cart)
    },
    [headerOpts],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      const cart = await apiRemoveCartItem(itemId, headerOpts())
      applyCart(setItems, setItemCount, setSubtotal, cart)
    },
    [headerOpts],
  )

  const clearCartHandler = useCallback(async () => {
    const cart = await apiClearCart(headerOpts())
    applyCart(setItems, setItemCount, setSubtotal, cart)
  }, [headerOpts])

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      loading,
      ready,
      refresh,
      addItem,
      updateQuantity,
      removeItem,
      clearCart: clearCartHandler,
    }),
    [
      items,
      itemCount,
      subtotal,
      loading,
      ready,
      refresh,
      addItem,
      updateQuantity,
      removeItem,
      clearCartHandler,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
