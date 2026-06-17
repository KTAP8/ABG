import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { joinWaitlist } from '../../lib/api'
import { Button } from '../ui/Button'

interface WaitlistFormProps {
  dropId?: string
}

export function WaitlistForm({ dropId }: WaitlistFormProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [campus, setCampus] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await joinWaitlist({
        email,
        drop_id: dropId,
        phone: phone || undefined,
        campus: campus || undefined,
      })
      setSubmitted(true)
      setEmail('')
      setPhone('')
      setCampus('')
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(t('waitlist.error'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-6 border border-charcoal bg-cream text-left font-mono text-xs space-y-2 max-w-md">
        <div className="text-charcoal font-bold">SUCCESSFULLY REGISTERED</div>
        <div className="text-red font-bold uppercase tracking-wider">
          {t('waitlist.confirm')}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md border border-charcoal p-6 bg-cream">
      <div className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50 pb-3 border-b border-charcoal/20">
        WAITLIST REGISTRATION
      </div>

      <div className="space-y-1">
        <label className="block font-mono text-[9px] uppercase tracking-wider text-charcoal/60">
          Email Address (Required)
        </label>
        <div className="flex border border-charcoal bg-transparent">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent font-mono text-xs text-charcoal placeholder-charcoal/30 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block font-mono text-[9px] uppercase tracking-wider text-charcoal/60">
          LINE ID / Phone Number (Optional)
        </label>
        <div className="flex border border-charcoal bg-transparent">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent font-mono text-xs text-charcoal placeholder-charcoal/30 focus:outline-none"
            placeholder="@line or 0xx-xxx-xxxx"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block font-mono text-[9px] uppercase tracking-wider text-charcoal/60">
          Campus / Location (Optional)
        </label>
        <div className="flex border border-charcoal bg-transparent">
          <input
            type="text"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent font-mono text-xs text-charcoal placeholder-charcoal/30 focus:outline-none"
            placeholder="Samyan, CU, etc."
          />
        </div>
      </div>

      {error && (
        <p className="font-mono text-[9px] text-red uppercase tracking-wider">
          {error}
        </p>
      )}

      <Button variant="primary" className="w-full text-center" disabled={loading}>
        {loading ? 'JOINING...' : t('waitlist.submit').toUpperCase()}
      </Button>
    </form>
  )
}
