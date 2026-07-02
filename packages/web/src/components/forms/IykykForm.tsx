import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { submitIykyk } from '../../lib/api'

export function IykykForm() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [igHandle, setIgHandle] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [discountCode, setDiscountCode] = useState<string | null>(null)
  const [revealDone, setRevealDone] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Trigger a soft loading delay when form is submitted before revealing code
  useEffect(() => {
    if (submitted && discountCode && !revealDone) {
      const timer = setTimeout(() => {
        setRevealDone(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [submitted, discountCode, revealDone])

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

  const handleCopy = () => {
    if (discountCode) {
      navigator.clipboard.writeText(discountCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Luxurious minimalist loading state
  if (submitted && discountCode && !revealDone) {
    return (
      <div className="py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-5 h-5 border-2 border-neutral-100 border-t-neutral-800 rounded-full animate-spin" />
        <p className="font-sans text-xs uppercase tracking-widest text-[#3F3F44]/50 animate-pulse">
          Generating voucher...
        </p>
      </div>
    )
  }

  // Luxury digital gift voucher reveal card
  if (revealDone && discountCode) {
    return (
      <div className="py-2 space-y-8 text-center animate-fade-in font-sans">
        <div className="space-y-2">
          <div className="text-[#3F3F44] font-display font-black tracking-widest uppercase text-sm">
            your code is ready.
          </div>
          <p className="text-xs text-[#3F3F44]/70 max-w-xs mx-auto leading-relaxed">
            {t('iykyk.confirm')}
          </p>
        </div>
        
        <div className="bg-[#F5F1E8]/70 border border-neutral-100/50 rounded-xl p-6 relative">
          <p className="text-[#3F3F44]/40 text-[9px] uppercase tracking-widest mb-3 font-semibold">
            supporter discount code
          </p>
          <p className="font-display font-black text-2xl text-[#3F3F44] tracking-[3px] select-all uppercase">
            {discountCode}
          </p>
          <p className="text-neutral-500 text-[10px] tracking-wider mt-3 font-medium">
            50 THB off • one-time use
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <button
            onClick={handleCopy}
            className="w-full bg-[#3F3F44] hover:bg-[#3F3F44]/90 text-white font-sans text-xs uppercase tracking-widest py-4 rounded-lg transition-all duration-200 cursor-pointer font-bold"
          >
            {copied ? 'copied to clipboard' : 'copy code'}
          </button>
          
          <p className="text-[10px] text-[#3F3F44]/50 max-w-xs mx-auto leading-relaxed">
            {t('iykyk.check_email')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-sm mx-auto font-sans">
      <div className="text-center mb-6 space-y-1">
        <div className="text-[9px] tracking-[0.25em] text-[#3F3F44]/40 uppercase font-semibold">
          exclusive reward
        </div>
        <div className="text-base font-display font-black text-[#3F3F44] uppercase tracking-wider">
          claim discount voucher
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-sans text-xs font-semibold text-[#3F3F44]/60">
          Name (Required)
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-200/80 rounded-lg text-sm text-[#3F3F44] placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-400 transition-all duration-200"
          placeholder="Your name"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-sans text-xs font-semibold text-[#3F3F44]/60">
          Email Address (Required)
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-200/80 rounded-lg text-sm text-[#3F3F44] placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-400 transition-all duration-200"
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-sans text-xs font-semibold text-[#3F3F44]/60">
          Instagram Handle (Optional)
        </label>
        <input
          type="text"
          value={igHandle}
          onChange={(e) => setIgHandle(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-200/80 rounded-lg text-sm text-[#3F3F44] placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-400 transition-all duration-200"
          placeholder="@instagram"
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 tracking-wide text-center pt-1 animate-pulse font-medium">
          Error: {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#3F3F44] hover:bg-[#3F3F44]/90 text-white font-sans text-xs uppercase tracking-widest py-4 px-6 rounded-lg transition-all duration-200 cursor-pointer text-center font-bold focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : t('iykyk.submit').toUpperCase()}
      </button>
    </form>
  )
}
