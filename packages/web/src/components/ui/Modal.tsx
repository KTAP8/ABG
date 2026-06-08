import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative w-full max-w-2xl max-h-[80vh] overflow-auto bg-cream p-8 border border-charcoal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-body text-charcoal hover:text-red"
        >
          ×
        </button>
        {title && (
          <h2 className="mb-6 text-2xl font-display font-bold uppercase text-charcoal">
            {title}
          </h2>
        )}
        {children}
      </div>
      <div
        className="absolute inset-0 z-[-1]"
        onClick={onClose}
      />
    </div>
  )
}
