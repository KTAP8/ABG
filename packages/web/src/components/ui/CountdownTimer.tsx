import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetDate: string // UTC ISO string
  className?: string
  variant?: 'simple' | 'segmented'
}

export function CountdownTimer({ targetDate, className = '', variant = 'segmented' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft('00:00:00:00')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft(
        `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      )
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const parts = timeLeft.split(':')
  const labels = ['DAYS', 'HOURS', 'MINS', 'SECS']

  if (variant === 'simple' || parts.length < 4) {
    return (
      <span className={`font-mono text-xs tracking-widest ${className}`}>
        {timeLeft}
      </span>
    )
  }

  return (
    <div className={`flex justify-center gap-3 ${className}`}>
      {parts.map((part, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="border border-charcoal bg-transparent px-3 py-1.5 font-mono text-lg md:text-2xl font-bold text-charcoal min-w-[2.8rem] md:min-w-[3.5rem] text-center select-none">
            {part}
          </div>
          <span className="font-mono text-[8px] tracking-wider text-charcoal/60 mt-1">
            {labels[idx]}
          </span>
        </div>
      ))}
    </div>
  )
}
