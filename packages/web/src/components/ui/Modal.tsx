import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  bgClass?: string
}

export function Modal({ isOpen, onClose, title, children, bgClass = 'bg-cream' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/30 backdrop-blur-[2px]">
      <div
        className={`relative w-full max-w-xl border border-charcoal flex flex-col ${bgClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Register */}
        <div className={`flex items-center justify-between border-b border-charcoal px-6 py-4 font-mono text-xs ${bgClass}`}>
          <span>{title ? `[MODAL: ${title.toUpperCase()}]` : '[SYSTEM_DIALOG]'}</span>
          <button
            onClick={onClose}
            className="text-[10px] uppercase font-bold tracking-widest text-charcoal hover:text-red transition-colors cursor-pointer"
          >
            [CLOSE]
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[70vh] font-mono text-xs text-charcoal/80">
          {children}
        </div>
      </div>
      <div
        className="absolute inset-0 z-[-1]"
        onClick={onClose}
      />
    </div>
  )
}
