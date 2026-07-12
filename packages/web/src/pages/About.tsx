import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export default function About() {
  const { t } = useTranslation()

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }

  const chapters: {
    title: string
    text1: string
    text2: string
    specs?: string[]
  }[] = [
    {
      title: t('about.chapter1.title'),
      text1: t('about.chapter1.text1'),
      text2: t('about.chapter1.text2'),
    },
    {
      title: t('about.chapter2.title'),
      text1: t('about.chapter2.text1'),
      text2: t('about.chapter2.text2'),
    },
    {
      title: t('about.chapter3.title'),
      text1: t('about.chapter3.text1'),
      text2: t('about.chapter3.text2'),
      specs: [
        t('about.chapter3.spec1'),
        t('about.chapter3.spec2'),
        t('about.chapter3.spec3'),
        t('about.chapter3.spec4'),
      ],
    },
    {
      title: t('about.chapter4.title'),
      text1: t('about.chapter4.text1'),
      text2: t('about.chapter4.text2'),
    },
  ]

  return (
    <div className="min-h-screen bg-cream">
      <Navbar overlay />

      {/* Full-bleed hero — replace /images/about_hero.webp with final art */}
      <section className="relative h-svh min-h-140 w-full overflow-hidden bg-charcoal">
        <img
          src="/images/about_hero.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-8 md:px-8 md:pb-10 lg:px-[27px] lg:pb-12">
          <div className="max-w-xl space-y-3">
            <span className="block font-body text-[12px] lowercase tracking-[-0.04em] text-white/60">
              {t('about.eyebrow')}
            </span>
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.45rem)] font-bold leading-none tracking-[-0.07em] text-white select-none">
              {t('about.intro.title')}
            </h1>
            <p className="font-body text-[15px] leading-snug tracking-[-0.07em] text-white md:text-[18px]">
              {t('about.intro.sub')}
            </p>
          </div>
        </div>
      </section>

      <main className="w-full bg-cream px-6 py-16 md:px-8 md:py-20 lg:px-[27px] lg:py-24">
        <div className="mx-auto max-w-3xl space-y-16 md:space-y-20">
          {chapters.map((chapter) => (
            <motion.section key={chapter.title} {...fadeInUp} className="border-b border-charcoal/15 pb-16 last:border-b-0 md:pb-20">
              <h2 className="mb-6 font-display text-2xl font-bold lowercase leading-none tracking-[-0.07em] text-charcoal md:text-[28px]">
                {chapter.title}
              </h2>
              <div className="space-y-4">
                <p className="font-body text-[15px] leading-snug tracking-[-0.04em] text-charcoal md:text-base">
                  {chapter.text1}
                </p>
                <p className="font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70 md:text-[15px]">
                  {chapter.text2}
                </p>
              </div>
              {chapter.specs && (
                <ul className="mt-8 space-y-2 border-t border-charcoal/15 pt-6">
                  {chapter.specs.map((spec) => (
                    <li
                      key={spec}
                      className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50"
                    >
                      {spec}
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}

          <div className="border-t border-charcoal/15 pt-10">
            <p className="max-w-lg font-body text-[15px] leading-snug tracking-[-0.04em] text-charcoal/70 md:text-base">
              {t('about.chapter4.footer')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
