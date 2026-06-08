import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-cream border-t border-charcoal py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left */}
          <div>
            <p className="font-body text-sm leading-relaxed text-charcoal">
              {t('hero.sub')}
            </p>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm uppercase tracking-wide text-charcoal hover:underline block"
            >
              {t('footer.instagram')}
            </a>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 px-3 py-2 border border-charcoal bg-cream font-body text-sm text-charcoal placeholder-charcoal placeholder-opacity-50"
              />
              <button className="px-4 py-2 bg-charcoal text-cream font-body text-sm uppercase hover:bg-black transition-colors">
                {t('footer.email')}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-charcoal pt-4 text-center">
          <p className="font-body text-xs uppercase tracking-wide text-charcoal">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
