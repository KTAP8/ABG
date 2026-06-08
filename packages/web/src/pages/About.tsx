import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export default function About() {
  const { t } = useTranslation()

  // Fade-in-up transition settings for scroll animations
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }

  // Stagger children transition
  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <div className="min-h-screen bg-cream selection:bg-charcoal selection:text-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Technical Hero Panel */}
        <section className="border border-charcoal bg-cream grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px]">
          {/* Left Column: Hero Image with CAD Overlays */}
          <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-charcoal overflow-hidden group">
            {/* Visual Asset */}
            <img 
              src="/images/about_hero.png" 
              alt="ABG Streetwear Brutalist Concrete Campus Model Shot" 
              className="absolute inset-0 w-full h-full object-cover grayscale contrast-115 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* CAD coordinates watermark */}
            <div className="absolute inset-0 tech-grid-bg opacity-35 pointer-events-none" />
            
            {/* Corner Indicators */}
            <div className="absolute top-3 left-3 font-mono text-[8px] text-cream bg-charcoal/80 px-1.5 py-0.5 tracking-wider uppercase">
              [IMG_CATALOGUE_01]
            </div>
            <div className="absolute top-3 right-3 font-mono text-[8px] text-cream bg-charcoal/80 px-1.5 py-0.5 tracking-wider">
              13.7372° N, 100.5283° E
            </div>
            <div className="absolute bottom-3 left-3 font-mono text-[8px] text-cream bg-charcoal/80 px-1.5 py-0.5 tracking-wider">
              ASPECT: 3/4 // VERTICAL
            </div>
            <div className="absolute bottom-3 right-3 font-mono text-[8px] text-cream bg-charcoal/80 px-1.5 py-0.5 tracking-wider">
              REF: BATCH_01 // SAMYAN
            </div>

            {/* Asymmetric Technical Red Dot */}
            <div className="absolute top-12 left-3 flex items-center gap-1.5 bg-cream/90 border border-charcoal p-1 text-[8px] font-mono tracking-widest text-charcoal">
              <span className="w-1.5 h-1.5 bg-red animate-pulse" />
              LIVE_STREAM
            </div>
          </div>

          {/* Right Column: Title and Core Diagnostics */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-10 lg:p-12 relative bg-cream">
            {/* Background Grid */}
            <div className="absolute inset-0 tech-grid-bg opacity-15 pointer-events-none" />

            {/* Technical Header */}
            <div className="flex justify-between items-start font-mono text-[9px] tracking-widest text-charcoal/50 uppercase border-b border-charcoal/15 pb-4 z-10">
              <span>{t('about.intro.label')}</span>
              <span className="text-red font-bold">// SEC_LEVEL: UNCLASSIFIED</span>
            </div>

            {/* Animated Title block */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="my-auto py-10 z-10"
            >
              <motion.span 
                variants={staggerItem}
                className="font-mono text-[10px] tracking-[0.2em] text-red uppercase block mb-2 font-bold"
              >
                // PROTOCOL_INITIALIZATION
              </motion.span>
              <motion.h1 
                variants={staggerItem}
                className="font-display font-black text-4xl md:text-6xl lg:text-7xl uppercase text-charcoal tracking-tighter leading-[0.9]"
              >
                {t('about.intro.title')}
              </motion.h1>
              <motion.div 
                variants={staggerItem}
                className="mt-6 flex items-center gap-2 font-mono text-xs text-charcoal/70"
              >
                <span className="w-2 h-2 bg-charcoal animate-cursor-blink" />
                <span>ACOUSTIC BUT GOATED // VER_1.05</span>
              </motion.div>
            </motion.div>

            {/* Systems Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-charcoal/20 z-10 font-mono text-[9px] tracking-wider text-charcoal/60">
              <div className="border border-charcoal/15 p-2 bg-charcoal/[0.02]">
                <span className="text-charcoal/40 block mb-1">01 / STATE</span>
                <span className="text-charcoal font-bold">{t('about.metadata.status')}</span>
              </div>
              <div className="border border-charcoal/15 p-2 bg-charcoal/[0.02]">
                <span className="text-charcoal/40 block mb-1">02 / VERSION</span>
                <span className="text-charcoal font-bold">{t('about.metadata.rev')}</span>
              </div>
              <div className="border border-charcoal/15 p-2 bg-charcoal/[0.02]">
                <span className="text-charcoal/40 block mb-1">03 / REGISTRY</span>
                <span className="text-charcoal font-bold truncate block">{t('about.metadata.location')}</span>
              </div>
              <div className="border border-charcoal/15 p-2 bg-charcoal/[0.02]">
                <span className="text-charcoal/40 block mb-1">04 / PROTOCOL</span>
                <span className="text-charcoal font-bold">{t('about.metadata.system')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="hr-tech opacity-40" />

        {/* Chapter 1: The Name */}
        <motion.section 
          {...fadeInUp}
          className="border border-charcoal bg-cream hover:border-red transition-colors duration-500"
        >
          <div className="flex justify-between items-center border-b border-charcoal px-6 py-3 font-mono text-[9px] tracking-widest text-charcoal bg-charcoal/5 select-none">
            <span className="opacity-60">{t('about.chapter1.ref')}</span>
            <h2 className="font-bold uppercase tracking-widest">{t('about.chapter1.title')}</h2>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 font-body text-xs md:text-sm leading-relaxed text-charcoal">
            <div className="space-y-4">
              <span className="font-mono text-[9px] tracking-widest text-red font-bold block">// REGISTRY_TH</span>
              <p className="font-medium">
                {t('about.chapter1.text1', { lng: 'th' })}
              </p>
              <p className="opacity-80">
                {t('about.chapter1.text2', { lng: 'th' })}
              </p>
            </div>
            <div className="space-y-4 border-t md:border-t-0 md:border-l border-charcoal/20 pt-6 md:pt-0 md:pl-8">
              <span className="font-mono text-[9px] tracking-widest text-charcoal/40 block">// REGISTRY_EN</span>
              <p className="font-medium">
                {t('about.chapter1.text1', { lng: 'en' })}
              </p>
              <p className="opacity-80">
                {t('about.chapter1.text2', { lng: 'en' })}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Chapter 2: The Context */}
        <motion.section 
          {...fadeInUp}
          className="border border-charcoal bg-cream hover:border-red transition-colors duration-500"
        >
          <div className="flex justify-between items-center border-b border-charcoal px-6 py-3 font-mono text-[9px] tracking-widest text-charcoal bg-charcoal/5 select-none">
            <span className="opacity-60">{t('about.chapter2.ref')}</span>
            <h2 className="font-bold uppercase tracking-widest">{t('about.chapter2.title')}</h2>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 font-body text-xs md:text-sm leading-relaxed text-charcoal">
            <div className="space-y-4">
              <span className="font-mono text-[9px] tracking-widest text-red font-bold block">// REGISTRY_TH</span>
              <p className="font-medium">
                {t('about.chapter2.text1', { lng: 'th' })}
              </p>
              <p className="opacity-80">
                {t('about.chapter2.text2', { lng: 'th' })}
              </p>
            </div>
            <div className="space-y-4 border-t md:border-t-0 md:border-l border-charcoal/20 pt-6 md:pt-0 md:pl-8">
              <span className="font-mono text-[9px] tracking-widest text-charcoal/40 block">// REGISTRY_EN</span>
              <p className="font-medium">
                {t('about.chapter2.text1', { lng: 'en' })}
              </p>
              <p className="opacity-80">
                {t('about.chapter2.text2', { lng: 'en' })}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Chapter 3: The Product (Visual Grid Block) */}
        <motion.section 
          {...fadeInUp}
          className="border border-charcoal bg-cream hover:border-red transition-colors duration-500"
        >
          <div className="flex justify-between items-center border-b border-charcoal px-6 py-3 font-mono text-[9px] tracking-widest text-charcoal bg-charcoal/5 select-none">
            <span className="opacity-60">{t('about.chapter3.ref')}</span>
            <h2 className="font-bold uppercase tracking-widest">{t('about.chapter3.title')}</h2>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 font-body text-xs md:text-sm leading-relaxed text-charcoal">
            {/* Visual Sub-Panel */}
            <div className="lg:col-span-5 relative aspect-square border border-charcoal overflow-hidden group bg-charcoal/5">
              <img 
                src="/images/about_detail.png" 
                alt="ABG Streetwear Textile Specification Graphic" 
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 tech-grid-bg opacity-20 pointer-events-none" />
              {/* CAD Layout overlays */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--color-charcoal)" strokeWidth="0.5" />
                <line x1="100%" y1="0" x2="0" y2="100%" stroke="var(--color-charcoal)" strokeWidth="0.5" />
                <circle cx="50%" cy="50%" r="35" stroke="var(--color-charcoal)" strokeWidth="0.5" fill="none" />
              </svg>
              <div className="absolute top-2 left-2 font-mono text-[8px] text-cream bg-charcoal/85 px-1 py-0.5 uppercase">
                [FABRIC_ZOOM // 400%]
              </div>
              <div className="absolute bottom-2 right-2 font-mono text-[8px] text-cream bg-charcoal/85 px-1 py-0.5">
                GSM_WEIGHT: 380G HEAVY
              </div>
            </div>

            {/* Spec descriptions */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <span className="font-mono text-[9px] tracking-widest text-red font-bold block">// REGISTRY_TH</span>
                  <p className="font-medium">
                    {t('about.chapter3.text1', { lng: 'th' })}
                  </p>
                  <p className="opacity-80">
                    {t('about.chapter3.text2', { lng: 'th' })}
                  </p>
                </div>
                <div className="space-y-3 border-t md:border-t-0 md:border-l border-charcoal/20 pt-6 md:pt-0 md:pl-6">
                  <span className="font-mono text-[9px] tracking-widest text-charcoal/40 block">// REGISTRY_EN</span>
                  <p className="font-medium">
                    {t('about.chapter3.text1', { lng: 'en' })}
                  </p>
                  <p className="opacity-80">
                    {t('about.chapter3.text2', { lng: 'en' })}
                  </p>
                </div>
              </div>

              {/* Monospace Bullet Specs */}
              <div className="border-t border-dashed border-charcoal/30 pt-4 font-mono text-[9px] tracking-wide text-charcoal/60 grid grid-cols-2 gap-2 uppercase">
                <div>// SILHOUETTE: OVERSIZED</div>
                <div>// COTTON_BASE: 100% COMBED</div>
                <div>// STITCH_PATTERN: REINFORCED</div>
                <div>// RELEASE_MODEL: BATCH_LIMITED</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Chapter 4: The Network */}
        <motion.section 
          {...fadeInUp}
          className="border border-charcoal bg-cream hover:border-red transition-colors duration-500"
        >
          <div className="flex justify-between items-center border-b border-charcoal px-6 py-3 font-mono text-[9px] tracking-widest text-charcoal bg-charcoal/5 select-none">
            <span className="opacity-60">{t('about.chapter4.ref')}</span>
            <h2 className="font-bold uppercase tracking-widest">{t('about.chapter4.title')}</h2>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-body text-xs md:text-sm leading-relaxed text-charcoal">
              <div className="space-y-4">
                <span className="font-mono text-[9px] tracking-widest text-red font-bold block">// REGISTRY_TH</span>
                <p className="font-medium">
                  {t('about.chapter4.text1', { lng: 'th' })}
                </p>
                <p className="opacity-80">
                  {t('about.chapter4.text2', { lng: 'th' })}
                </p>
              </div>
              <div className="space-y-4 border-t md:border-t-0 md:border-l border-charcoal/20 pt-6 md:pt-0 md:pl-8">
                <span className="font-mono text-[9px] tracking-widest text-charcoal/40 block">// REGISTRY_EN</span>
                <p className="font-medium">
                  {t('about.chapter4.text1', { lng: 'en' })}
                </p>
                <p className="opacity-80">
                  {t('about.chapter4.text2', { lng: 'en' })}
                </p>
              </div>
            </div>

            {/* Technical Manifesto Footer Banner */}
            <div className="border-t border-charcoal/20 pt-6 mt-4 text-center select-none">
              <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-red font-bold block animate-pulse">
                ★ {t('about.chapter4.footer')} ★
              </span>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}
