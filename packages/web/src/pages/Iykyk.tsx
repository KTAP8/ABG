import { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { RewardReveal } from '../components/iykyk/RewardReveal'

const SECTIONS = [
  {
    id: 'hero',
    lines: [
      'you actually did it.',
      'you ordered off a four-person operation running on google forms and vibes.',
      'thank you.',
    ],
  },
  {
    id: 'vulnerability',
    lines: [
      "we won't pretend this was smooth.",
      'we fought the printer over everything. recut sizing twice. did all of it between classes and internships.',
      'you ordering meant someone outside the four of us actually believed in it.',
    ],
  },
  {
    id: 'specificity',
    lines: [
      'same energy. same aura. same streets.',
      "this next part isn't a discount banner. it's yours because you were early.",
    ],
  },
  {
    id: 'handoff',
    lines: ['one more scroll.'],
  },
]

function ScrollCue() {
  return (
    <motion.div className="flex flex-col items-center gap-2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
      <div className="text-xs tracking-widest text-charcoal/40" style={{ fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif' }}>
        keep going
      </div>
      <svg width="20" height="20" viewBox="0 0 20 20" className="text-charcoal/30">
        <polyline points="2,6 10,14 18,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}

function ParallaxText({
  children,
  offset,
  scrollY,
  isPrimary = false,
  isHero = false,
}: {
  children: string
  offset: number
  scrollY: any
  isPrimary?: boolean
  isHero?: boolean
}) {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const y = useTransform(scrollY, [offset - 400, offset + 400], prefersReducedMotion ? [0, 0] : [80, -80])
  // Hero section is visible from start, other sections fade in
  const opacity = isHero
    ? useTransform(scrollY, [offset, offset + 600], [1, 0.3])
    : useTransform(scrollY, [offset - 600, offset - 200, offset + 200, offset + 600], [0, 1, 1, 0])

  return (
    <motion.p
      style={{
        y,
        opacity,
        fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif',
        color: '#3F3F44',
        letterSpacing: isPrimary ? '0.02em' : '0',
      }}
      className={`leading-relaxed ${isPrimary ? 'text-3xl md:text-4xl font-semibold' : 'text-base md:text-lg'}`}
    >
      {children}
    </motion.p>
  )
}

function ParallaxLayer({ scrollY, depth }: { scrollY: any; depth: number }) {
  const y = useTransform(scrollY, [0, 3000], [0, -300 * depth * 0.3])

  return (
    <motion.div className="absolute inset-0 opacity-[0.02]" style={{ y }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={`noise-${depth}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#3F3F44" filter={`url(#noise-${depth})`} />
      </svg>
    </motion.div>
  )
}

export default function Iykyk() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showReward, setShowReward] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (v) => {
      setShowReward(v > 2400)
    })
    return () => unsubscribe()
  }, [scrollY])

  const sectionOffsets = [300, 900, 1500, 2100]

  return (
    <motion.div ref={containerRef} className="relative w-full bg-cream" style={{ backgroundColor: '#F5F1E8' }}>
      <ParallaxLayer scrollY={scrollY} depth={1} />
      <ParallaxLayer scrollY={scrollY} depth={2} />

      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div className="relative max-w-md text-center space-y-8">
          {SECTIONS[0].lines.map((line, i) => (
            <ParallaxText key={i} offset={sectionOffsets[0]} scrollY={scrollY} isPrimary={i === 0} isHero={true}>
              {line}
            </ParallaxText>
          ))}
          <motion.div style={{ opacity: useTransform(scrollY, [200, 400], [1, 0]) }}>
            <ScrollCue />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Vulnerability */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div className="relative max-w-md text-center space-y-8">
          {SECTIONS[1].lines.map((line, i) => (
            <ParallaxText key={i} offset={sectionOffsets[1]} scrollY={scrollY} isPrimary={i === 0}>
              {line}
            </ParallaxText>
          ))}
        </motion.div>
      </section>

      {/* Section 3: Specificity */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div className="relative max-w-md text-center space-y-8">
          {SECTIONS[2].lines.map((line, i) => (
            <ParallaxText key={i} offset={sectionOffsets[2]} scrollY={scrollY} isPrimary={i === 0}>
              {line}
            </ParallaxText>
          ))}
        </motion.div>
      </section>

      {/* Section 4: Handoff */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div className="relative max-w-md text-center space-y-8">
          {SECTIONS[3].lines.map((line, i) => (
            <ParallaxText key={i} offset={sectionOffsets[3]} scrollY={scrollY} isPrimary={i === 0}>
              {line}
            </ParallaxText>
          ))}
        </motion.div>
      </section>

      {/* Reward Reveal - lazy loaded */}
      {showReward && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <RewardReveal />
        </motion.div>
      )}

      {/* Extra spacing for scroll room */}
      <div className="h-96" />
    </motion.div>
  )
}
