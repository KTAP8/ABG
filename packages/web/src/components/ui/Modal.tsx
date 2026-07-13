import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  bgClass?: string
}

export function Modal({ isOpen, onClose, title, children, bgClass = 'bg-cream' }: ModalProps) {
  const { t } = useTranslation()

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 p-4 backdrop-blur-[2px]">
      <div
        className={`relative flex w-full max-w-xl flex-col border border-charcoal/15 ${bgClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-between border-b border-charcoal/15 px-6 py-4 font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal ${bgClass}`}
        >
          <span>{title || t('modal.dialog')}</span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[12px] lowercase tracking-[-0.04em] text-charcoal/55 transition-opacity hover:text-charcoal"
          >
            {t('modal.close')}
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto p-6 font-body text-[14px] tracking-[-0.04em] text-charcoal/80">
          {children}
        </div>
      </div>
      <div className="absolute inset-0 z-[-1]" onClick={onClose} />
    </div>
  )
}
