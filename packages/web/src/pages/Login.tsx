import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useAuth } from '../lib/auth-context'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, needsOnboarding, loading, signInWithGoogle } = useAuth()
  const [error, setError] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  const redirectTo = searchParams.get('redirect') || '/'

  useEffect(() => {
    if (loading || !user) return
    navigate(needsOnboarding ? '/onboarding' : redirectTo, { replace: true })
  }, [loading, user, needsOnboarding, redirectTo, navigate])

  const handleGoogle = async () => {
    setSigningIn(true)
    setError('')
    try {
      const callbackURL = `${window.location.origin}/onboarding`
      await signInWithGoogle(callbackURL)
    } catch (err) {
      console.error(err)
      setError(t('auth.error'))
      setSigningIn(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="space-y-3">
            <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
              {t('auth.eyebrow')}
            </p>
            <h1 className="font-display text-[32px] font-bold lowercase leading-none tracking-[-0.06em] text-charcoal">
              {t('auth.login.title')}
            </h1>
            <p className="font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
              {t('auth.login.lead')}
            </p>
          </div>

          <button
            type="button"
            disabled={signingIn || loading}
            onClick={() => void handleGoogle()}
            className="w-full cursor-pointer bg-charcoal px-8 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30"
          >
            {signingIn ? t('auth.login.signing_in') : t('auth.login.google')}
          </button>

          {error && (
            <p className="font-body text-[12px] tracking-[-0.04em] text-red">{error}</p>
          )}

          <p className="font-body text-[12px] tracking-[-0.04em] text-charcoal/45">
            <Link
              to="/"
              className="underline decoration-charcoal/20 underline-offset-4 hover:text-charcoal"
            >
              {t('auth.back_home')}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
