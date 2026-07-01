import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { IykykForm } from '../components/forms/IykykForm'

export default function Iykyk() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-md mx-auto px-4 py-20 text-center space-y-10">
          <div className="space-y-3">
            <h1 className="font-display font-black text-4xl md:text-5xl uppercase text-charcoal tracking-tight leading-none">
              IYKYK
            </h1>
            <p className="font-mono text-xs uppercase tracking-wider text-charcoal/50 leading-relaxed max-w-sm mx-auto select-none">
              {t('iykyk.subtitle')}
            </p>
          </div>

          <div className="space-y-6">
            <div className="pb-6 border-b border-charcoal/10">
              <span className="font-mono text-[9px] uppercase tracking-widest text-red font-bold select-none bg-red/10 border border-red/15 px-2.5 py-0.5 inline-block">
                EXCLUSIVE ACCESS
              </span>
            </div>
            <IykykForm />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
