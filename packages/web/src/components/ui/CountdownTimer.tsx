import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetDate: string
  className?: string
  variant?: 'simple' | 'segmented'
}

export function CountdownTimer({
  targetDate,
  className = '',
  variant = 'segmented',
}: CountdownTimerProps) {
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
      const minutes = Math.floor((diff / 1000 / 60) % 60)
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
  const labels = ['days', 'hours', 'mins', 'secs']

  if (variant === 'simple' || parts.length < 4) {
    return (
      <span className={`font-body text-[13px] tracking-[-0.04em] tabular-nums ${className}`}>
        {timeLeft}
      </span>
    )
  }

  return (
    <div className={`flex justify-center gap-4 ${className}`}>
      {parts.map((part, idx) => (
        <div key={labels[idx]} className="flex flex-col items-center">
          <span className="font-display text-2xl font-bold tabular-nums tracking-[-0.07em] text-charcoal md:text-3xl">
            {part}
          </span>
          <span className="mt-1 font-body text-[10px] lowercase tracking-[-0.04em] text-charcoal/50">
            {labels[idx]}
          </span>
        </div>
      ))}
    </div>
  )
}
