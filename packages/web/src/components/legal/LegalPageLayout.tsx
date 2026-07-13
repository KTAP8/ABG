import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'

export interface LegalPageLayoutProps {
  title: string
  lastUpdated: string
  children: ReactNode
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pt-8 pb-20 md:px-8 md:pt-10 lg:px-[27px]">
        <header className="mb-10 border-b border-charcoal/15 pb-8">
          <span className="block font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
            {t('legal.eyebrow')}
          </span>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,4vw,2.45rem)] font-bold leading-none tracking-[-0.07em] text-charcoal">
            {title}
          </h1>
          <p className="mt-4 font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
            {t('legal.lastUpdated', { date: lastUpdated })}
          </p>
        </header>

        <div className="space-y-8 font-body text-[14px] leading-relaxed tracking-[-0.01em] text-charcoal/80 [&_a]:text-charcoal [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-70 [&_h2]:font-body [&_h2]:text-[15px] [&_h2]:font-bold [&_h2]:lowercase [&_h2]:tracking-[-0.04em] [&_h2]:text-charcoal [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}
