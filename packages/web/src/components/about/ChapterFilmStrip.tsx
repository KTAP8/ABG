import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export type AboutChapter = {
  title: string
  text1: string
  text2: string
  specs?: string[]
  closing?: string
}

type ChapterFilmStripProps = {
  chapters: AboutChapter[]
}

function padIndex(n: number) {
  return String(n).padStart(2, '0')
}

export function ChapterFilmStrip({ chapters }: ChapterFilmStripProps) {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const nodes = sectionRefs.current.filter(Boolean) as HTMLElement[]
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length === 0) return

        const idx = nodes.indexOf(visible[0].target as HTMLElement)
        if (idx >= 0) setActiveIndex(idx)
      },
      {
        root: null,
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [chapters.length])

  const scrollToChapter = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  if (chapters.length === 0) return null

  return (
    <section className="relative bg-cream px-6 py-16 md:px-8 md:py-20 lg:px-[27px] lg:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-10 lg:gap-14">
        {/* Sticky title rail */}
        <aside className="md:col-span-4 lg:col-span-3">
          <div className="md:sticky md:top-28">
            <p className="mb-8 font-body text-[11px] lowercase tracking-[-0.04em] text-charcoal/40">
              {t('about.chapter_of', {
                current: padIndex(activeIndex + 1),
                total: padIndex(chapters.length),
              })}
            </p>

            <nav aria-label={t('about.title')} className="relative">
              {/* Continuous vertical progress */}
              <div
                className="pointer-events-none absolute top-0 bottom-0 left-0 hidden w-px bg-charcoal/15 md:block"
                aria-hidden
              >
                <div
                  className="w-px bg-charcoal transition-[height] duration-300 ease-out"
                  style={{
                    height: `${((activeIndex + 1) / chapters.length) * 100}%`,
                  }}
                />
              </div>

              <div className="flex flex-row gap-5 overflow-x-auto scrollbar-none md:flex-col md:gap-7 md:pl-5">
                {chapters.map((chapter, index) => {
                  const active = index === activeIndex
                  return (
                    <button
                      key={chapter.title}
                      type="button"
                      onClick={() => scrollToChapter(index)}
                      className={`shrink-0 cursor-pointer text-left transition-colors duration-200 ${
                        active
                          ? 'text-charcoal'
                          : 'text-charcoal/35 hover:text-charcoal/60'
                      }`}
                    >
                      <span className="mb-1 block font-body text-[11px] tracking-[-0.04em]">
                        {padIndex(index + 1)}
                      </span>
                      <span
                        className={`block font-brand text-[22px] lowercase leading-none tracking-normal md:text-[26px] ${
                          active ? '' : 'opacity-90'
                        }`}
                      >
                        {chapter.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            </nav>
          </div>
        </aside>

        {/* Scrolling chapter bodies */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="space-y-0">
            {chapters.map((chapter, index) => (
              <article
                key={chapter.title}
                ref={(el) => {
                  sectionRefs.current[index] = el
                }}
                className="border-b border-charcoal/15 py-12 last:border-b-0 md:min-h-[70svh] md:py-16 md:first:pt-0"
              >
                <h2 className="mb-6 font-brand text-[28px] lowercase leading-none tracking-normal text-charcoal md:hidden">
                  {chapter.title}
                </h2>

                <div className="max-w-xl space-y-4">
                  <p className="font-body text-[15px] leading-snug tracking-[-0.04em] text-charcoal md:text-base">
                    {chapter.text1}
                  </p>
                  <p className="font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70 md:text-[15px]">
                    {chapter.text2}
                  </p>
                </div>

                {chapter.specs && (
                  <ul className="mt-8 max-w-xl space-y-2 border-t border-charcoal/15 pt-6">
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

                {chapter.closing && (
                  <p className="mt-10 max-w-xl border-t border-charcoal/15 pt-6 font-body text-[15px] leading-snug tracking-[-0.04em] text-charcoal/70 md:text-base">
                    {chapter.closing}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
