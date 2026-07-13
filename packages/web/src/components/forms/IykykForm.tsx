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
      const errMessage = (err as Error)?.message || ''
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

  const inputClass =
    'w-full h-8 px-2 bg-white border border-[#d6d6d6] rounded-md text-xs text-charcoal placeholder-[#d6d6d6] tracking-[-0.04em] focus:outline-none focus:border-charcoal/40 transition-colors'

  const labelClass = 'font-body text-xs tracking-[-0.04em] text-charcoal'

  if (submitted && discountCode && !revealDone) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-8">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-charcoal/10 border-t-charcoal" />
        <p className="font-body text-xs uppercase tracking-widest text-charcoal/50 animate-pulse">
          {t('iykyk.generating')}
        </p>
      </div>
    )
  }

  if (revealDone && discountCode) {
    return (
      <div className="animate-fade-in space-y-5 py-1 text-center font-body">
        <div className="space-y-1.5">
          <div className="font-body text-2xl font-bold leading-none tracking-[-0.05em] text-charcoal">
            {t('iykyk.ready')}
          </div>
          <p className="mx-auto max-w-xs text-xs leading-relaxed text-charcoal/70">
            {t('iykyk.confirm')}
          </p>
        </div>

        <div className="relative rounded-lg border border-[#d6d6d6] bg-cream/40 p-4">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-charcoal/40">
            {t('iykyk.code_label')}
          </p>
          <p className="select-all font-display text-xl font-black uppercase tracking-[3px] text-charcoal">
            {discountCode}
          </p>
          <p className="mt-2 text-[10px] font-medium tracking-wider text-charcoal/50">
            {t('iykyk.code_meta')}
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full cursor-pointer rounded bg-charcoal py-2 font-brand text-lg tracking-[0.13em] text-white transition-opacity hover:opacity-90"
          >
            {copied ? t('iykyk.copied') : t('iykyk.copy')}
          </button>

          <p className="mx-auto max-w-xs text-[10px] leading-relaxed text-charcoal/50">
            {t('iykyk.check_email')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full flex-col items-center gap-3.5">
      <h2 className="font-body text-xl font-bold tracking-[-0.05em] text-charcoal md:text-2xl">
        {t('iykyk.form_title')}
      </h2>

      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <label className={labelClass}>
            <span className="font-bold">{t('iykyk.name')} </span>
            <span className="font-normal">({t('iykyk.required')})</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder={t('iykyk.name_placeholder')}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <label className={labelClass}>
            <span className="font-bold">{t('iykyk.email')} </span>
            <span className="font-normal">({t('iykyk.required')})</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder={t('iykyk.email_placeholder')}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <label className={labelClass}>
            <span className="font-bold">{t('iykyk.ig')} </span>
            <span className="font-normal">({t('iykyk.optional')})</span>
          </label>
          <input
            type="text"
            value={igHandle}
            onChange={(e) => setIgHandle(e.target.value)}
            className={inputClass}
            placeholder={t('iykyk.ig_placeholder')}
          />
        </div>
      </div>

      {error && (
        <p className="text-center text-xs font-medium tracking-wide text-red animate-pulse">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-0.5 w-full cursor-pointer rounded border border-[#6c6c6c] bg-charcoal py-2 font-brand text-lg tracking-[0.13em] text-white transition-opacity hover:opacity-90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? t('iykyk.processing') : t('iykyk.submit')}
      </button>
    </form>
  )
}
