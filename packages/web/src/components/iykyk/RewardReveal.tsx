import { useState, useEffect } from 'react'
import { IykykForm } from '../forms/IykykForm'

export function RewardReveal() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!isVisible) return null

  return (
    <div className="w-full flex items-center justify-center px-2 py-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-sm border border-[#3F3F44]/15 p-6 md:p-8 relative">
        {/* Corner tech indicators */}
        <div className="absolute top-2 left-2 border-t border-l border-[#3F3F44]/30 w-2.5 h-2.5" />
        <div className="absolute top-2 right-2 border-t border-r border-[#3F3F44]/30 w-2.5 h-2.5" />
        <div className="absolute bottom-2 left-2 border-b border-l border-[#3F3F44]/30 w-2.5 h-2.5" />
        <div className="absolute bottom-2 right-2 border-b border-r border-[#3F3F44]/30 w-2.5 h-2.5" />
        
        {/* Subtle architectural grid lines */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(63,63,68,0)_97%,rgba(63,63,68,0.02)_97%)] bg-[size:100%_12px]" />
        
        <IykykForm />
      </div>
    </div>
  )
}
