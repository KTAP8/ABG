import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { joinWaitlist } from '../../lib/api'

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
      <div className="py-8 font-mono text-xs space-y-2.5 text-center">
        <div className="text-green-700 font-bold tracking-wider uppercase">
          ✓ Successfully Registered
        </div>
        <p className="font-body text-sm text-charcoal/80 max-w-xs mx-auto leading-relaxed">
          {t('waitlist.confirm')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left max-w-sm mx-auto pt-4">
      
      <div className="space-y-1.5">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-charcoal/60">
          Email Address (Required)
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-charcoal/20 font-mono text-xs text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-charcoal transition-all"
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-charcoal/60">
          LINE ID / Phone Number (Optional)
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-charcoal/20 font-mono text-xs text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-charcoal transition-all"
          placeholder="@line or 0xx-xxx-xxxx"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-charcoal/60">
          Campus / Location (Optional)
        </label>
        <input
          type="text"
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-charcoal/20 font-mono text-xs text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-charcoal transition-all"
          placeholder="Bangkok, CU, etc."
        />
      </div>

      {error && (
        <p className="font-mono text-[10px] text-red uppercase tracking-wider">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black border border-black text-white font-mono text-xs uppercase tracking-widest py-3.5 px-5 transition-all duration-200 cursor-pointer text-center hover:bg-white hover:text-black focus:outline-none disabled:bg-charcoal/10 disabled:border-charcoal/10 disabled:text-charcoal/30 disabled:cursor-not-allowed"
      >
        {loading ? 'JOINING...' : t('waitlist.submit').toUpperCase()}
      </button>
    </form>
  )
}
