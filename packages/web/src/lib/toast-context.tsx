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
import { AnimatePresence, motion } from 'framer-motion'

type Toast = {
  id: number
  message: string
}

type ToastContextValue = {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_DURATION_MS = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null)
  const idRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const showToast = useCallback(
    (message: string) => {
      clearTimer()
      idRef.current += 1
      const id = idRef.current
      setToast({ id, message })
      timerRef.current = setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current))
        timerRef.current = null
      }, TOAST_DURATION_MS)
    },
    [clearTimer],
  )

  useEffect(() => clearTimer, [clearTimer])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed top-20 right-5 z-[100] w-full max-w-xs md:top-24 md:right-10"
      >
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div
              key={toast.id}
              role="status"
              initial={{ opacity: 0, y: -8, x: 8 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -6, x: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="border border-charcoal/15 bg-charcoal px-5 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream"
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}
