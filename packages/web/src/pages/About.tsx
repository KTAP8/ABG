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

  return (
    <div className="min-h-screen bg-cream selection:bg-charcoal selection:text-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Clean Hero Panel */}
        <section className="border border-charcoal bg-cream grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px]">
          {/* Left Column: Hero Image */}
          <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-charcoal overflow-hidden group">
            <img 
              src="/images/about_hero.png" 
              alt="ABG Streetwear Concrete Campus Model Shot" 
              className="absolute inset-0 w-full h-full object-cover grayscale contrast-115 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>

          {/* Right Column: Title */}
          <div className="lg:col-span-7 flex flex-col justify-center p-6 md:p-10 lg:p-12 relative bg-cream">
            <div className="z-10">
              <span className="font-mono text-[10px] tracking-[0.2em] text-red uppercase block mb-2 font-bold">
                ABOUT US
              </span>
              <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl uppercase text-charcoal tracking-tighter leading-[0.9]">
                {t('about.intro.title')}
              </h1>
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
            <span className="opacity-60">CHAPTER 01</span>
            <h2 className="font-bold uppercase tracking-widest">{t('about.chapter1.title')}</h2>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 font-body text-xs md:text-sm leading-relaxed text-charcoal">
            <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-charcoal/20 pb-6 md:pb-0 md:pr-8 font-mono text-xs uppercase tracking-widest text-charcoal/60 font-bold">
              {t('about.chapter1.title')}
            </div>
            <div className="md:col-span-8 space-y-4 font-body text-charcoal">
              <p className="font-medium text-sm md:text-base leading-snug">
                {t('about.chapter1.text1')}
              </p>
              <p className="opacity-85 text-xs md:text-sm">
                {t('about.chapter1.text2')}
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
            <span className="opacity-60">CHAPTER 02</span>
            <h2 className="font-bold uppercase tracking-widest">{t('about.chapter2.title')}</h2>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 font-body text-xs md:text-sm leading-relaxed text-charcoal">
            <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-charcoal/20 pb-6 md:pb-0 md:pr-8 font-mono text-xs uppercase tracking-widest text-charcoal/60 font-bold">
              {t('about.chapter2.title')}
            </div>
            <div className="md:col-span-8 space-y-4 font-body text-charcoal">
              <p className="font-medium text-sm md:text-base leading-snug">
                {t('about.chapter2.text1')}
              </p>
              <p className="opacity-85 text-xs md:text-sm">
                {t('about.chapter2.text2')}
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
            <span className="opacity-60">CHAPTER 03</span>
            <h2 className="font-bold uppercase tracking-widest">{t('about.chapter3.title')}</h2>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 font-body text-xs md:text-sm leading-relaxed text-charcoal">
            {/* Visual Sub-Panel */}
            <div className="lg:col-span-5 relative aspect-square border border-charcoal overflow-hidden group bg-charcoal/5">
              <img 
                src="/images/about_detail.png" 
                alt="ABG Streetwear Textile Specification Shot" 
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Spec descriptions */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="font-medium text-sm md:text-base leading-snug">
                  {t('about.chapter3.text1')}
                </p>
                <p className="opacity-85 text-xs md:text-sm">
                  {t('about.chapter3.text2')}
                </p>
              </div>

              {/* Monospace Bullet Specs */}
              <div className="border-t border-dashed border-charcoal/30 pt-4 font-mono text-[9px] tracking-wide text-charcoal/60 grid grid-cols-2 gap-2 uppercase">
                <div>SILHOUETTE: OVERSIZED</div>
                <div>COTTON BASE: 100% COMBED</div>
                <div>STITCH PATTERN: REINFORCED</div>
                <div>RELEASE MODEL: BATCH LIMITED</div>
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
            <span className="opacity-60">CHAPTER 04</span>
            <h2 className="font-bold uppercase tracking-widest">{t('about.chapter4.title')}</h2>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 font-body text-xs md:text-sm leading-relaxed text-charcoal">
            <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-charcoal/20 pb-6 md:pb-0 md:pr-8 font-mono text-xs uppercase tracking-widest text-charcoal/60 font-bold">
              {t('about.chapter4.title')}
            </div>
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-4 font-body text-charcoal">
                <p className="font-medium text-sm md:text-base leading-snug">
                  {t('about.chapter4.text1')}
                </p>
                <p className="opacity-85 text-xs md:text-sm">
                  {t('about.chapter4.text2')}
                </p>
              </div>

              {/* Minimalist Manifesto Footer */}
              <div className="border-t border-charcoal/20 pt-6 mt-4 text-center select-none">
                <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-red font-bold block">
                  {t('about.chapter4.footer')}
                </span>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}
