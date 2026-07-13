import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import {
  ChapterFilmStrip,
  type AboutChapter,
} from '../components/about/ChapterFilmStrip'

export default function About() {
  const { t } = useTranslation()

  const chapters: AboutChapter[] = [
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
      closing: t('about.chapter4.footer'),
    },
  ]

  return (
    <div className="min-h-screen bg-cream">
      <Navbar overlay />

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

      <ChapterFilmStrip chapters={chapters} />

      <Footer />
    </div>
  )
}
