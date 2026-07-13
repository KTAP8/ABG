import { useTranslation } from 'react-i18next'

export interface FooterProps {
  bgClass?: string
}

export function Footer({ bgClass = 'bg-cream' }: FooterProps) {
  const { t } = useTranslation()

  return (
    <footer className={`border-t border-charcoal/15 py-12 ${bgClass}`}>
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-[27px]">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <p className="max-w-sm font-body text-[13px] leading-snug tracking-[-0.04em] text-charcoal/70">
              {t('hero.sub')}
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-body text-[13px] lowercase tracking-[-0.04em] text-charcoal transition-opacity hover:opacity-70"
            >
              {t('footer.instagram')}
            </a>

            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <label className="block font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
                {t('footer.subscribe')}
              </label>
              <div className="flex border border-charcoal/15">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 bg-transparent px-3 py-2 font-body text-[13px] tracking-[-0.04em] text-charcoal placeholder:text-charcoal/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="cursor-pointer border-l border-charcoal/15 bg-charcoal px-4 py-2 font-body text-[12px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-80"
                >
                  {t('footer.join')}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-charcoal/15 pt-6 text-center">
          <p className="font-body text-[11px] lowercase tracking-[-0.04em] text-charcoal/50">
            {t('footer.rights')} © 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
