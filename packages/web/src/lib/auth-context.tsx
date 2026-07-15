import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  authClient,
  getAccessToken,
  signInWithGoogle,
  signOut as authSignOut,
  type AuthSessionUser,
} from './auth'
import { getMe, type MeResponse } from './api'
import { useToast } from './toast-context'

type AuthContextValue = {
  user: AuthSessionUser | null
  profile: MeResponse['profile'] | null
  needsOnboarding: boolean
  loading: boolean
  refresh: () => Promise<void>
  signInWithGoogle: (callbackURL?: string) => Promise<unknown>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [user, setUser] = useState<AuthSessionUser | null>(null)
  const [profile, setProfile] = useState<MeResponse['profile'] | null>(null)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const sessionResult = await authClient.getSession()
      const sessionUser = sessionResult.data?.user as AuthSessionUser | undefined

      if (!sessionUser?.id) {
        setUser(null)
        setProfile(null)
        setNeedsOnboarding(false)
        return
      }

      setUser({
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name,
        image: sessionUser.image,
      })

      const token = await getAccessToken()
      if (!token) {
        setProfile(null)
        setNeedsOnboarding(true)
        return
      }

      try {
        const me = await getMe()
        setProfile(me.profile)
        setNeedsOnboarding(me.needs_onboarding)
        if (me.user.email || me.user.name) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  email: me.user.email ?? prev.email,
                  name: me.user.name ?? prev.name,
                }
              : prev,
          )
        }
      } catch {
        // Authenticated with Neon but profile API unavailable — still treat as signed in
        setProfile(null)
        setNeedsOnboarding(true)
      }
    } catch (err) {
      console.error('Auth refresh failed:', err)
      setUser(null)
      setProfile(null)
      setNeedsOnboarding(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const handleSignOut = useCallback(async () => {
    await authSignOut()
    setUser(null)
    setProfile(null)
    setNeedsOnboarding(false)
    showToast(t('toast.auth.signed_out'))
  }, [showToast, t])

  const value = useMemo(
    () => ({
      user,
      profile,
      needsOnboarding,
      loading,
      refresh,
      signInWithGoogle,
      signOut: handleSignOut,
    }),
    [user, profile, needsOnboarding, loading, refresh, handleSignOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
