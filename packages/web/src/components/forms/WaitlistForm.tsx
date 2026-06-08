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
      setError('Failed to join waitlist. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-4 border border-charcoal bg-cream text-center">
        <p className="font-body text-sm text-charcoal">
          {t('waitlist.confirm')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block font-body text-sm uppercase tracking-wide text-charcoal mb-2">
          {t('waitlist.email')} *
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-charcoal bg-cream font-body text-sm text-charcoal placeholder-charcoal placeholder-opacity-50"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block font-body text-sm uppercase tracking-wide text-charcoal mb-2">
          {t('waitlist.phone')}
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border border-charcoal bg-cream font-body text-sm text-charcoal placeholder-charcoal placeholder-opacity-50"
          placeholder="@yourlinehere or 0xx-xxx-xxxx"
        />
      </div>

      <div>
        <label className="block font-body text-sm uppercase tracking-wide text-charcoal mb-2">
          {t('waitlist.campus')}
        </label>
        <input
          type="text"
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          className="w-full px-3 py-2 border border-charcoal bg-cream font-body text-sm text-charcoal placeholder-charcoal placeholder-opacity-50"
          placeholder="Samyan, CU, etc."
        />
      </div>

      {error && (
        <p className="font-body text-sm text-red">{error}</p>
      )}

      <Button variant="primary" className="w-full" disabled={loading}>
        {loading ? '...' : t('waitlist.submit')}
      </Button>
    </form>
  )
}
