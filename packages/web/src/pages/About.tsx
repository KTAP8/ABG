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

      {/* Split frame under nav — image | manifesto */}
      <section className="grid h-svh min-h-140 w-full grid-cols-1 bg-cream md:grid-cols-2">
        <div className="relative min-h-[48svh] overflow-hidden bg-charcoal md:min-h-0">
          <img
            src="/images/about_hero.webp"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        <div className="flex flex-col justify-end px-6 pt-24 pb-12 md:justify-center md:px-10 md:pt-28 md:pb-16 lg:px-14 lg:pb-20">
          <div className="max-w-md space-y-4">
            <span className="block font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/45">
              {t('about.eyebrow')}
            </span>
            <h1 className="font-brand text-[clamp(2rem,4.5vw,3.25rem)] leading-none tracking-normal text-charcoal select-none">
              {t('about.intro.title')}
            </h1>
            <p className="font-body text-[15px] leading-snug tracking-[-0.04em] text-charcoal/70 md:text-[17px]">
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
