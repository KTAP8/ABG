import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useAuth } from '../lib/auth-context'
import { submitOnboarding } from '../lib/api'
import { useToast } from '../lib/toast-context'

const HEARD_FROM = ['ig', 'friend', 'facebook', 'found_myself'] as const
const SHOP_FOR = ['men', 'women', 'both'] as const
const NOTIFY = ['email', 'line', 'both'] as const

type Step = 0 | 1 | 2

interface OptionButtonProps {
  isSelected: boolean
  onClick: () => void
  label: string
}

function OptionButton({ isSelected, onClick, label }: OptionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.995 }}
      className={`group relative flex w-full items-center justify-between border p-4 text-left font-body text-[13px] lowercase tracking-[-0.04em] transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'border-charcoal bg-charcoal text-cream font-medium'
          : 'border-charcoal/15 bg-transparent text-charcoal/70 hover:border-charcoal/45 hover:text-charcoal'
      }`}
    >
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        {label}
      </span>
      <span
        className={`transition-all duration-300 font-body text-[13px] ${
          isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
        }`}
      >
        →
      </span>
    </motion.button>
  )
}

export default function Onboarding() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, needsOnboarding, loading, refresh } = useAuth()
  const { showToast } = useToast()
  const [step, setStep] = useState<Step>(0)
  const [heardFrom, setHeardFrom] = useState<(typeof HEARD_FROM)[number] | ''>('')
  const [shopFor, setShopFor] = useState<(typeof SHOP_FOR)[number] | ''>('')
  const [notifyChannel, setNotifyChannel] = useState<(typeof NOTIFY)[number] | ''>('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login?redirect=/onboarding', { replace: true })
      return
    }
    if (!needsOnboarding) {
      navigate('/', { replace: true })
    }
  }, [loading, user, needsOnboarding, navigate])

  const canContinue =
    (step === 0 && heardFrom) || (step === 1 && shopFor) || (step === 2 && notifyChannel)

  const handleSkip = () => {
    navigate('/', { replace: true })
  }

  const handleNext = async () => {
    if (step < 2) {
      setStep((s) => (s + 1) as Step)
      return
    }

    if (!heardFrom || !shopFor || !notifyChannel || !user) return

    setSaving(true)
    setError('')
    try {
      await submitOnboarding({
        heard_from: heardFrom,
        shop_for: shopFor,
        notify_channel: notifyChannel,
        email: user.email || undefined,
        display_name: user.name || undefined,
      })
      await refresh()
      showToast(t('toast.onboarding.complete'))
      navigate('/', { replace: true })
    } catch (err) {
      console.error(err)
      setError(t('onboarding.error'))
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <p className="font-body text-sm tracking-[-0.04em] text-charcoal/50 animate-pulse">
            {t('onboarding.loading')}
          </p>
        </div>
      </div>
    )
  }

  const steps = [
    { label: 'onboarding.step1_label', value: 0 },
    { label: 'onboarding.step2_label', value: 1 },
    { label: 'onboarding.step3_label', value: 2 },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-md space-y-10">
          {/* Stepper progress */}
          <div className="space-y-4">
            <div className="flex items-center gap-6 font-body text-[11px] tracking-[-0.04em] text-charcoal/50 lowercase">
              {steps.map((s) => (
                <div
                  key={s.value}
                  className={`transition-colors duration-300 ${
                    step === s.value ? 'text-charcoal font-medium' : 'text-charcoal/30'
                  }`}
                >
                  {t(s.label)}
                </div>
              ))}
            </div>
            <div className="relative h-[1px] w-full bg-charcoal/10">
              <motion.div
                className="absolute left-0 top-0 h-full bg-charcoal"
                initial={{ width: '33.33%' }}
                animate={{
                  width: `${((step + 1) / 3) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h1 className="font-display text-[28px] font-bold lowercase leading-none tracking-[-0.06em] text-charcoal">
                    {step === 0 && t('onboarding.heard.title')}
                    {step === 1 && t('onboarding.shop.title')}
                    {step === 2 && t('onboarding.notify.title')}
                  </h1>
                  <p className="font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
                    {step === 0 && t('onboarding.heard.lead')}
                    {step === 1 && t('onboarding.shop.lead')}
                    {step === 2 && t('onboarding.notify.lead')}
                  </p>
                </div>

                <div className="space-y-3">
                  {step === 0 &&
                    HEARD_FROM.map((value) => (
                      <OptionButton
                        key={value}
                        isSelected={heardFrom === value}
                        onClick={() => setHeardFrom(value)}
                        label={t(`onboarding.heard.${value}`)}
                      />
                    ))}

                  {step === 1 &&
                    SHOP_FOR.map((value) => (
                      <OptionButton
                        key={value}
                        isSelected={shopFor === value}
                        onClick={() => setShopFor(value)}
                        label={t(`onboarding.shop.${value}`)}
                      />
                    ))}

                  {step === 2 &&
                    NOTIFY.map((value) => (
                      <OptionButton
                        key={value}
                        isSelected={notifyChannel === value}
                        onClick={() => setNotifyChannel(value)}
                        label={t(`onboarding.notify.${value}`)}
                      />
                    ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {error && (
            <p className="font-body text-[12px] tracking-[-0.04em] text-red">{error}</p>
          )}

          {/* Actions Footer */}
          <div className="flex items-center justify-between gap-4 border-t border-charcoal/10 pt-8">
            <button
              type="button"
              onClick={handleSkip}
              className="cursor-pointer font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/45 transition-colors hover:text-charcoal"
            >
              {t('onboarding.skip')}
            </button>
            <button
              type="button"
              disabled={!canContinue || saving}
              onClick={() => void handleNext()}
              className="cursor-pointer bg-charcoal px-8 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30"
            >
              {saving
                ? t('onboarding.saving')
                : step === 2
                  ? t('onboarding.done')
                  : t('onboarding.next')}
            </button>
          </div>

          <p className="font-body text-[12px] tracking-[-0.04em] text-charcoal/40">
            <Link to="/" className="underline decoration-charcoal/20 underline-offset-4">
              {t('auth.back_home')}
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
