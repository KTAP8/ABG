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
    <motion.div
      className="flex flex-col items-center gap-2"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      <div className="text-xs tracking-widest text-charcoal/40" style={{ fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif' }}>
        keep going
      </div>
      <svg width="20" height="20" viewBox="0 0 20 20" className="text-charcoal/30">
        <polyline points="2,6 10,14 18,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}

function ParallaxSection({
  section,
  index,
  scrollYProgress,
}: {
  section: (typeof SECTIONS)[0]
  index: number
  scrollYProgress: any
}) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const sectionStart = index * 0.25
  const sectionEnd = (index + 1) * 0.25

  const y = useTransform(scrollYProgress, [sectionStart, sectionEnd], prefersReducedMotion ? [0, 0] : [40, -40])
  const opacity = useTransform(scrollYProgress, [sectionStart - 0.1, sectionStart, sectionEnd], [0, 1, 0.8])
  const bgY = useTransform(scrollYProgress, [sectionStart, sectionEnd], prefersReducedMotion ? [0, 0] : [20, -20])

  return (
    <motion.section
      className="relative w-full min-h-screen flex items-center justify-center px-4 py-20"
      style={{ backgroundColor: '#F5F1E8' }}
    >
      <motion.div className="absolute inset-0 opacity-[0.03]" style={{ y: bgY }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="#3F3F44" filter="url(#noise)" />
        </svg>
      </motion.div>

      <motion.div className="relative max-w-md text-center" style={{ y, opacity }}>
        <div className="space-y-6">
          {section.lines.map((line, i) => (
            <p
              key={i}
              className="text-lg leading-relaxed"
              style={{
                fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif',
                color: '#3F3F44',
                fontSize: i === 0 ? '2rem' : '1rem',
                fontWeight: i === 0 ? 600 : 400,
                letterSpacing: i === 0 ? '0.02em' : '0',
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {section.id === 'hero' && <div className="mt-16">
          <ScrollCue />
        </div>}
      </motion.div>
    </motion.section>
  )
}

export default function Iykyk() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showReward, setShowReward] = useState(false)
  const { scrollYProgress } = useScroll({ container: containerRef })

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setShowReward(v > 0.85)
    })
    return unsubscribe
  }, [scrollYProgress])

  return (
    <div
      ref={containerRef}
      className="overflow-y-scroll snap-y snap-mandatory"
      style={{ height: '100vh', scrollBehavior: 'smooth' }}
    >
      {SECTIONS.map((section, index) => (
        <motion.div key={section.id} className="snap-start">
          <ParallaxSection section={section} index={index} scrollYProgress={scrollYProgress} />
        </motion.div>
      ))}

      {showReward && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="snap-start">
          <RewardReveal />
        </motion.div>
      )}
    </div>
  )
}
