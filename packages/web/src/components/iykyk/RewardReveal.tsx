import { useState, useEffect } from 'react'
import { IykykForm } from '../forms/IykykForm'

export function RewardReveal() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!isVisible) return null

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-20" style={{ backgroundColor: '#F5F1E8' }}>
      <div className="w-full max-w-md">
        <IykykForm />
      </div>
    </div>
  )
}
