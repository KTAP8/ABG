import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useAuth } from '../lib/auth-context'
import { updateProfile } from '../lib/api'

const HEARD_FROM = ['ig', 'friend', 'facebook', 'found_myself'] as const
const SHOP_FOR = ['men', 'women', 'both'] as const
const NOTIFY = ['email', 'line', 'both'] as const

type HeardFrom = (typeof HEARD_FROM)[number]
type ShopFor = (typeof SHOP_FOR)[number]
type Notify = (typeof NOTIFY)[number]

export default function Profile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, profile, needsOnboarding, loading, refresh, signOut } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [lineId, setLineId] = useState('')
  const [heardFrom, setHeardFrom] = useState<HeardFrom | ''>('')
  const [shopFor, setShopFor] = useState<ShopFor | ''>('')
  const [notifyChannel, setNotifyChannel] = useState<Notify | ''>('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login?redirect=/profile', { replace: true })
    }
  }, [loading, user, navigate])

  useEffect(() => {
    setDisplayName(profile?.display_name || user?.name || '')
    setLineId(profile?.line_id || '')
    setHeardFrom((profile?.heard_from as HeardFrom | null) || '')
    setShopFor((profile?.shop_for as ShopFor | null) || '')
    setNotifyChannel((profile?.notify_channel as Notify | null) || '')
  }, [profile, user])

  const canSave = Boolean(heardFrom && shopFor && notifyChannel)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSave || !user) return

    setSaving(true)
    setError('')
    setSaved(false)
    try {
      await updateProfile({
        display_name: displayName.trim() || null,
        line_id: lineId.trim() || null,
        heard_from: heardFrom,
        shop_for: shopFor,
        notify_channel: notifyChannel,
      })
      await refresh()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
      setError(t('profile.error'))
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <p className="animate-pulse font-body text-sm tracking-[-0.04em] text-charcoal/50">
            {t('profile.loading')}
          </p>
        </div>
      </div>
    )
  }

  const fieldClass =
    'w-full border-0 border-b border-charcoal/15 bg-transparent px-0 py-3 font-body text-[14px] tracking-[-0.04em] text-charcoal placeholder:text-charcoal/30 focus:border-charcoal/50 focus:outline-none'

  const optionClass = (selected: boolean) =>
    `cursor-pointer border px-3 py-2.5 font-body text-[12px] lowercase tracking-[-0.04em] transition-colors ${
      selected
        ? 'border-charcoal bg-charcoal text-cream'
        : 'border-charcoal/20 bg-transparent text-charcoal hover:border-charcoal/50'
    }`

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-12 md:py-16">
        <div className="space-y-2">
          <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
            {t('profile.eyebrow')}
          </p>
          <h1 className="font-display text-[28px] font-bold lowercase leading-none tracking-[-0.06em] text-charcoal">
            {t('profile.title')}
          </h1>
          <p className="font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
            {t('profile.lead')}
          </p>
        </div>

        {needsOnboarding && (
          <p className="mt-6 border border-charcoal/15 px-4 py-3 font-body text-[13px] leading-snug tracking-[-0.04em] text-charcoal/70">
            {t('profile.incomplete')}{' '}
            <Link
              to="/onboarding"
              className="underline decoration-charcoal/30 underline-offset-4 hover:text-charcoal"
            >
              {t('nav.finish_profile')}
            </Link>
          </p>
        )}

        <form onSubmit={(e) => void handleSave(e)} className="mt-10 space-y-10">
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="block font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55">
                {t('profile.email')}
              </label>
              <p className="border-b border-charcoal/10 py-3 font-body text-[14px] tracking-[-0.04em] text-charcoal/50">
                {user.email || '—'}
              </p>
              <p className="font-body text-[11px] tracking-[-0.04em] text-charcoal/40">
                {t('profile.email_note')}
              </p>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="display_name"
                className="block font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55"
              >
                {t('profile.display_name')}
              </label>
              <input
                id="display_name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={fieldClass}
                placeholder={t('profile.display_name_placeholder')}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="line_id"
                className="block font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55"
              >
                {t('profile.line_id')}
              </label>
              <input
                id="line_id"
                type="text"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                className={fieldClass}
                placeholder={t('profile.line_id_placeholder')}
              />
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55">
              {t('onboarding.heard.title')}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {HEARD_FROM.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={optionClass(heardFrom === value)}
                  onClick={() => setHeardFrom(value)}
                >
                  {t(`onboarding.heard.${value}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55">
              {t('onboarding.shop.title')}
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {SHOP_FOR.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={optionClass(shopFor === value)}
                  onClick={() => setShopFor(value)}
                >
                  {t(`onboarding.shop.${value}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55">
              {t('onboarding.notify.title')}
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {NOTIFY.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={optionClass(notifyChannel === value)}
                  onClick={() => setNotifyChannel(value)}
                >
                  {t(`onboarding.notify.${value}`)}
                </button>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="font-body text-[12px] tracking-[-0.04em] text-red">{error}</p>
          )}
          {saved && (
            <p className="font-body text-[12px] tracking-[-0.04em] text-charcoal/70">
              {t('profile.saved')}
            </p>
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="cursor-pointer font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/45 transition-colors hover:text-charcoal"
            >
              {t('nav.sign_out')}
            </button>
            <button
              type="submit"
              disabled={!canSave || saving}
              className="cursor-pointer bg-charcoal px-8 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30"
            >
              {saving ? t('profile.saving') : t('profile.save')}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}
