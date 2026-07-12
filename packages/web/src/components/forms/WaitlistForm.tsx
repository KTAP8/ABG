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
      <div className="space-y-2 py-8 text-center">
        <p className="font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal">
          {t('waitlist.success')}
        </p>
        <p className="mx-auto max-w-xs font-body text-sm leading-snug tracking-[-0.04em] text-charcoal/70">
          {t('waitlist.confirm')}
        </p>
      </div>
    )
  }

  const fieldClass =
    'w-full border border-charcoal/15 bg-white px-3.5 py-2.5 font-body text-[13px] tracking-[-0.04em] text-charcoal placeholder:text-charcoal/30 focus:border-charcoal/40 focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-5 pt-2 text-left">
      <div className="space-y-1.5">
        <label className="block font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55">
          {t('waitlist.email')}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
          placeholder={t('waitlist.email_placeholder')}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55">
          {t('waitlist.phone')}
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={fieldClass}
          placeholder={t('waitlist.phone_placeholder')}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55">
          {t('waitlist.campus')}
        </label>
        <input
          type="text"
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          className={fieldClass}
          placeholder={t('waitlist.campus_placeholder')}
        />
      </div>

      {error && (
        <p className="font-body text-[12px] tracking-[-0.04em] text-red">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer bg-charcoal px-5 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30"
      >
        {loading ? t('waitlist.joining') : t('waitlist.submit')}
      </button>
    </form>
  )
}
