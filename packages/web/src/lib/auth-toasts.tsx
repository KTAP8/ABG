import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PENDING_AUTH_TOAST_KEY } from './auth'
import { useAuth } from './auth-context'
import { useToast } from './toast-context'

/** Shows a toast after Google OAuth when the user lands back in the app. */
export function AuthToasts() {
  const { t } = useTranslation()
  const { user, needsOnboarding, loading } = useAuth()
  const { showToast } = useToast()
  const handledRef = useRef(false)

  useEffect(() => {
    if (loading || !user || handledRef.current) return

    const pending = sessionStorage.getItem(PENDING_AUTH_TOAST_KEY)
    if (!pending) return

    sessionStorage.removeItem(PENDING_AUTH_TOAST_KEY)
    handledRef.current = true

    if (needsOnboarding) {
      showToast(t('toast.auth.welcome'))
    }
  }, [loading, user, needsOnboarding, showToast, t])

  return null
}
