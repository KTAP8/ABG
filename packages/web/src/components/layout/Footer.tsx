import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-cream border-t border-charcoal py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left */}
          <div className="space-y-4">
            <p className="font-mono text-xs leading-relaxed text-charcoal/70">
              // ARCHIVE_REF: SAMYAN_CAMPUS_SYSTEM // TEXTILE_DOCUMENTATION.
            </p>
            <p className="font-body text-xs uppercase tracking-widest text-charcoal font-bold">
              {t('hero.sub')}
            </p>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-widest text-charcoal hover:text-red transition-colors inline-flex items-center gap-1.5"
              >
                <span>[LINK: INSTAGRAM]</span>
              </a>
            </div>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <div className="font-mono text-[10px] uppercase tracking-wider text-charcoal opacity-60">
                $ sys.join_loop_request()
              </div>
              <div className="flex border border-charcoal bg-transparent">
                <span className="bg-charcoal text-cream font-mono text-xs px-3 flex items-center select-none">
                  EMAIL &gt;
                </span>
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 px-3 py-2 bg-transparent font-mono text-xs text-charcoal placeholder-charcoal/40 focus:outline-none"
                />
                <button className="px-4 py-2 bg-charcoal text-cream font-body text-xs uppercase tracking-widest hover:bg-black transition-colors cursor-pointer border-l border-charcoal">
                  {t('footer.email')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-charcoal pt-6 text-center">
          <p className="font-mono text-[9px] uppercase tracking-wider text-charcoal/60">
            [SYS_STATE: OPERATIONAL] // {t('footer.rights')} 2026©
          </p>
        </div>
      </div>
    </footer>
  )
}
