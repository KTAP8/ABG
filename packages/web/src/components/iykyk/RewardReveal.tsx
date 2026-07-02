import { useState, useEffect } from 'react'
import { IykykForm } from '../forms/IykykForm'

export function RewardReveal() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!isVisible) return null

  return (
    <div className="w-full flex items-center justify-center p-1">
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-100 shadow-xl p-8 md:p-10 relative">
        <IykykForm />
      </div>
    </div>
  )
}
