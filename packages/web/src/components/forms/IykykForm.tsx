import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { submitIykyk } from '../../lib/api'

export function IykykForm() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [igHandle, setIgHandle] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [discountCode, setDiscountCode] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await submitIykyk({
        name,
        email,
        ig_handle: igHandle || undefined,
      })
      setDiscountCode(response.discount_code)
      setSubmitted(true)
      setName('')
      setEmail('')
      setIgHandle('')
    } catch (err) {
      const errMessage = (err as any)?.message || ''
      if (errMessage.includes('already claimed')) {
        setError(t('iykyk.error_claimed'))
      } else {
        setError(t('iykyk.error'))
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted && discountCode) {
    return (
      <div className="py-8 font-mono text-xs space-y-6 text-center">
        <div className="space-y-2.5">
          <div className="text-green-700 font-bold tracking-wider uppercase">
            ✓ Code Claimed
          </div>
          <p className="font-body text-sm text-charcoal/80 max-w-xs mx-auto leading-relaxed">
            {t('iykyk.confirm')}
          </p>
        </div>
        <div className="bg-charcoal/5 border border-charcoal/20 p-6 rounded">
          <p className="text-charcoal/60 text-[10px] uppercase tracking-wider mb-3">
            Your Discount Code
          </p>
          <p className="font-mono text-2xl font-bold text-charcoal tracking-[4px] break-all select-all">
            {discountCode}
          </p>
          <p className="text-charcoal/50 text-[10px] uppercase tracking-wider mt-4">
            50 THB off • One-time use
          </p>
        </div>
        <p className="font-body text-xs text-charcoal/70 max-w-xs mx-auto leading-relaxed">
          {t('iykyk.check_email')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left max-w-sm mx-auto pt-4">
      <div className="space-y-1.5">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-charcoal/60">
          {t('iykyk.name')} (Required)
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-charcoal/20 font-mono text-xs text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-charcoal transition-all"
          placeholder="Your name"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-charcoal/60">
          {t('iykyk.email')} (Required)
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
          {t('iykyk.ig')} (Optional)
        </label>
        <input
          type="text"
          value={igHandle}
          onChange={(e) => setIgHandle(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-charcoal/20 font-mono text-xs text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-charcoal transition-all"
          placeholder="@instagram"
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
        {loading ? 'CLAIMING...' : t('iykyk.submit').toUpperCase()}
      </button>
    </form>
  )
}
