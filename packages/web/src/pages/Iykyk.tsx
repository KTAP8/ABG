import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

// Luxurious slide transition styling
const slideTransition = {
  duration: 0.85,
  ease: [0.16, 1, 0.3, 1], // easeOutExpo
}

const slideVariants = {
  initial: { opacity: 0, y: 35, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -35, filter: 'blur(8px)' },
}

function VibeVisualizer() {
  const [bars, setBars] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(Array.from({ length: 15 }, () => Math.random() * 35 + 10))
    }, 120)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-end gap-[4px] h-8 w-32 border border-[#3F3F44]/10 p-1.5 bg-transparent">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-[4px] bg-[#3F3F44]/40"
          animate={{ height: `${height}%` }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          style={{ height: '10%' }}
        />
      ))}
    </div>
  )
}

// Left side CAD drawing components
function HeroGraphic() {
  return (
    <div className="relative w-full aspect-square border border-[#3F3F44]/15 bg-transparent flex items-center justify-center p-6">
      <motion.div 
        className="absolute w-4/5 h-4/5 border border-[#3F3F44]/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 w-[0.5px] h-1/2 bg-[#3F3F44]/20 origin-bottom" />
      </motion.div>
      <div className="absolute w-2/5 h-2/5 border border-[#3F3F44]/5 rounded-full" />
      
      <div className="absolute top-2 left-2 border-t border-l border-[#3F3F44]/25 w-2 h-2" />
      <div className="absolute top-2 right-2 border-t border-r border-[#3F3F44]/25 w-2 h-2" />
      <div className="absolute bottom-2 left-2 border-b border-l border-[#3F3F44]/25 w-2 h-2" />
      <div className="absolute bottom-2 right-2 border-b border-r border-[#3F3F44]/25 w-2 h-2" />
      
      <div className="text-center space-y-2 z-10">
        <span className="text-[8px] text-[#3F3F44]/40 uppercase tracking-[0.25em] font-mono block">// ARCHIVE_ACQUISITION</span>
        <span className="text-xs font-display font-bold uppercase tracking-wider text-[#3F3F44] block">SUPPORTER_IDENTIFIED</span>
        <span className="text-[8px] text-[#3F3F44]/40 font-mono block">BATCH // 001 // SECURE</span>
      </div>
    </div>
  )
}

function SizingGraphic() {
  return (
    <div className="relative w-full aspect-square border border-[#3F3F44]/15 bg-transparent flex items-center justify-center p-6">
      <svg className="w-4/5 h-4/5 text-[#3F3F44]/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M 32,18 L 43,18 C 45,21 55,21 57,18 L 68,18 L 82,32 L 73,41 L 68,36 L 68,82 L 32,82 L 32,36 L 27,41 L 18,32 Z" strokeDasharray="1 1" />
        
        {/* Width indicators */}
        <line x1="32" y1="46" x2="68" y2="46" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="32" cy="46" r="1" fill="currentColor" />
        <circle cx="68" cy="46" r="1" fill="currentColor" />
        
        {/* Height indicators */}
        <line x1="50" y1="22" x2="50" y2="82" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="22" r="1" fill="currentColor" />
        <circle cx="50" cy="82" r="1" fill="currentColor" />
      </svg>
      
      <div className="absolute bottom-2 left-2 font-mono text-[8px] text-[#3F3F44]/60 space-y-0.5 bg-[#F5F1E8] border border-[#3F3F44]/10 p-1.5">
        <div className="text-[#3F3F44]/30">// APPAREL_SCHEMATICS</div>
        <div>CHEST_DEV: +1.2cm [CORRECTED]</div>
        <div>LENGTH_CAL: [OK]</div>
      </div>
    </div>
  )
}

function TelemetryGraphic() {
  return (
    <div className="relative w-full aspect-square border border-[#3F3F44]/15 bg-transparent flex items-center justify-center">
      <div className="absolute w-4/5 h-4/5 border border-[#3F3F44]/5 rounded-full" />
      <div className="absolute w-3/5 h-3/5 border border-[#3F3F44]/5 rounded-full" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[85%] h-[0.5px] bg-[#3F3F44]/10" />
        <div className="h-[85%] w-[0.5px] bg-[#3F3F44]/10 absolute" />
      </div>
      
      <motion.div 
        className="absolute w-1.5 h-1.5 bg-[#3F3F44]/60 rounded-full"
        animate={{
          x: [10, 35, -20, 10],
          y: [-25, 10, 25, -25],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute w-1 h-1 bg-[#3F3F44]/40 rounded-full"
        animate={{
          x: [-35, -10, 25, -35],
          y: [10, -25, -10, 10],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute top-2 left-2 font-mono text-[8px] text-[#3F3F44]/30">
        SYS_AURA_TELEMETRY // BATCH_01
      </div>
    </div>
  )
}

function AccessGraphic() {
  return (
    <div className="relative w-full aspect-square border border-[#3F3F44]/15 bg-transparent flex flex-col justify-between p-3.5 font-mono">
      <div className="flex justify-between text-[7px] text-[#3F3F44]/40">
        <span>[CERTIFICATE_EMITTANCE]</span>
        <span>AUTH_SYS_ECDSA</span>
      </div>
      
      <div className="space-y-2 my-auto">
        <div className="flex justify-between items-center text-[9px] border-b border-[#3F3F44]/5 pb-0.5">
          <span>ORIGIN_REGISTRY</span>
          <span className="text-[#3F3F44] font-bold">MATCHED</span>
        </div>
        <div className="flex justify-between items-center text-[9px] border-b border-[#3F3F44]/5 pb-0.5">
          <span>SUPPORTER_VALID</span>
          <span className="text-[#3F3F44] font-bold">VERIFIED</span>
        </div>
        <div className="flex justify-between items-center text-[9px] border-b border-[#3F3F44]/5 pb-0.5">
          <span>DISCOUNT_TOKEN</span>
          <span className="text-[#3F3F44] font-bold">PENDING_DECRYPT</span>
        </div>
      </div>

      <div className="text-[7px] text-center text-[#3F3F44]/40 uppercase tracking-widest animate-pulse">
        Awaiting input registry
      </div>
    </div>
  )
}

function TechBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02] z-0">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'linear-gradient(to right, #3F3F44 1px, transparent 1px), linear-gradient(to bottom, #3F3F44 1px, transparent 1px)',
          backgroundSize: '25px 25px',
        }}
      />
    </div>
  )
}

export default function Iykyk() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const isTransitioning = useRef(false)
  const lastTransitionTime = useRef(0)

  // Configure light-theme and mouse listeners on mount
  useEffect(() => {
    const origBg = document.body.style.backgroundColor
    const origColor = document.body.style.color
    document.body.style.backgroundColor = '#F5F1E8'
    document.body.style.color = '#3F3F44'

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.body.style.backgroundColor = origBg
      document.body.style.color = origColor
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Lock scrolling step-by-step
  useEffect(() => {
    const scrollDelay = 1400 // Match slide transition duration + breathing room

    const triggerNextSlide = (direction: 'down' | 'up') => {
      if (isTransitioning.current) return

      const now = Date.now()
      if (now - lastTransitionTime.current < scrollDelay) return

      if (direction === 'down') {
        if (activeIndex < 4) {
          isTransitioning.current = true
          lastTransitionTime.current = now
          setActiveIndex((prev) => prev + 1)
          setTimeout(() => { 
            isTransitioning.current = false 
          }, scrollDelay)
        }
      } else {
        if (activeIndex > 0) {
          isTransitioning.current = true
          lastTransitionTime.current = now
          setActiveIndex((prev) => prev - 1)
          setTimeout(() => { 
            isTransitioning.current = false 
          }, scrollDelay)
        }
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 35) return
      triggerNextSlide(e.deltaY > 0 ? 'down' : 'up')
    }

    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const diffY = touchStartY - touchEndY

      if (Math.abs(diffY) < 55) return
      triggerNextSlide(diffY > 0 ? 'down' : 'up')
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [activeIndex])

  const renderGraphic = () => {
    switch (activeIndex) {
      case 0:
        return <HeroGraphic />
      case 1:
        return <SizingGraphic />
      case 2:
        return <TelemetryGraphic />
      case 3:
      case 4:
        return <AccessGraphic />
      default:
        return <HeroGraphic />
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#F5F1E8] text-[#3F3F44] select-none font-sans flex flex-col md:flex-row">
      <TechBackground />

      {/* Left Side Sticky CAD Frame (Desktop) */}
      <div className="hidden md:flex w-1/2 h-full flex-col justify-between p-12 border-r border-[#3F3F44]/10 bg-[#F5F1E8]/50 backdrop-blur-sm z-20">
        
        {/* HUD Info */}
        <div className="flex justify-between items-start w-full text-[9px] text-[#3F3F44]/40 font-mono">
          <div className="space-y-0.5">
            <div>WORKSPACE: STEP_0{activeIndex + 1}</div>
            <div>STATUS: LOCKED</div>
          </div>
          <div className="text-right space-y-0.5">
            <div>COORDINATES: {mousePos.x}X / {mousePos.y}Y</div>
            <div>DECK: {activeIndex * 25}%</div>
          </div>
        </div>

        {/* Central Graphic Container withSynced Transitions */}
        <div className="w-full max-w-xs mx-auto space-y-3">
          <div className="flex items-center justify-between text-[8px] text-[#3F3F44]/50 uppercase tracking-[0.25em] px-0.5 font-mono">
            <span>// DESIGN_CAD</span>
            <span>INDEX_0{activeIndex}</span>
          </div>
          
          <div className="relative overflow-hidden aspect-square">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
                transition={slideTransition}
              >
                {renderGraphic()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom indicators */}
        <div className="flex justify-between items-end w-full">
          <div className="space-y-1">
            <div className="text-[8px] text-[#3F3F44]/40 font-mono">// BADDIE_VIBES_FREQUENCY</div>
            <VibeVisualizer />
          </div>
          <div className="text-right font-mono text-[8px] text-[#3F3F44]/35">
            ABG.ARCHIVAL.STUDIOS.v1.1
          </div>
        </div>
      </div>

      {/* Right Side: syncd slide-locked Narrative Panel */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-between px-6 md:px-16 py-12 relative z-10">
        
        {/* Mobile top CAD slot */}
        <div className="md:hidden w-full h-28 flex items-center justify-center border-b border-[#3F3F44]/10 py-1 relative overflow-hidden bg-[#F5F1E8]/70 backdrop-blur-sm">
          <div className="w-24 h-24 scale-75">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(4px)' }}
                transition={slideTransition}
              >
                {renderGraphic()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Central presentation area */}
        <div className="my-auto max-w-md w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideTransition}
              className="space-y-6"
            >
              {activeIndex === 0 && (
                <div className="space-y-4">
                  <div className="text-[#3F3F44]/40 text-[9px] font-mono tracking-[0.2em] uppercase">// 01 / RECORD</div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-[#3F3F44] leading-tight">
                    {SECTIONS[0].lines[0]}
                  </h2>
                  <p className="text-sm md:text-base leading-relaxed text-[#3F3F44]/80">
                    {SECTIONS[0].lines[1]}
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-[#3F3F44] font-bold">
                    {SECTIONS[0].lines[2]}
                  </p>
                </div>
              )}

              {activeIndex === 1 && (
                <div className="space-y-4">
                  <div className="text-[#3F3F44]/40 text-[9px] font-mono tracking-[0.2em] uppercase">// 02 / DEV_STRESS</div>
                  <h2 className="text-xl md:text-2xl font-display font-bold uppercase tracking-wider text-[#3F3F44]">
                    {SECTIONS[1].lines[0]}
                  </h2>
                  <p className="text-sm md:text-base leading-relaxed text-[#3F3F44]/80">
                    {SECTIONS[1].lines[1]}
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-[#3F3F44] font-bold border-l border-[#3F3F44]/20 pl-4 py-0.5">
                    {SECTIONS[1].lines[2]}
                  </p>
                </div>
              )}

              {activeIndex === 2 && (
                <div className="space-y-4">
                  <div className="text-[#3F3F44]/40 text-[9px] font-mono tracking-[0.2em] uppercase">// 03 / AURA_MARKET</div>
                  <h2 className="text-xl md:text-2xl font-display font-bold uppercase tracking-wider text-[#3F3F44]">
                    {SECTIONS[2].lines[0]}
                  </h2>
                  <p className="text-sm md:text-base leading-relaxed text-[#3F3F44]/80">
                    {SECTIONS[2].lines[1]}
                  </p>
                </div>
              )}

              {activeIndex === 3 && (
                <div className="space-y-4">
                  <div className="text-[#3F3F44]/40 text-[9px] font-mono tracking-[0.2em] uppercase">// 04 / INTERFACE</div>
                  <h2 className="text-xl md:text-2xl font-display font-bold uppercase tracking-wider text-[#3F3F44]">
                    {SECTIONS[3].lines[0]}
                  </h2>
                </div>
              )}

              {activeIndex === 4 && (
                <div className="w-full">
                  <RewardReveal />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation Bullets / Slide Progress Cue */}
        <div className="flex justify-between items-center w-full mt-4">
          <div className="flex gap-4 font-mono text-[9px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isTransitioning.current) {
                    setActiveIndex(i)
                  }
                }}
                className={`transition-all duration-200 cursor-pointer font-bold ${
                  activeIndex === i 
                    ? 'text-[#3F3F44] underline tracking-widest' 
                    : 'text-[#3F3F44]/35 hover:text-[#3F3F44]/75'
                }`}
              >
                0{i + 1}
              </button>
            ))}
          </div>
          
          {activeIndex < 4 && (
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono text-[#3F3F44]/40 uppercase tracking-widest">
                scroll to advance
              </span>
              <svg width="10" height="10" viewBox="0 0 20 20" className="text-[#3F3F44]/40 animate-bounce">
                <polyline points="4,7 10,13 16,7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

      </div>

      {/* Mobile HUD Status */}
      <div className="md:hidden fixed bottom-2 right-4 z-30 text-[8px] text-[#3F3F44]/50 font-mono">
        STEP 0{activeIndex + 1} // 05
      </div>
    </div>
  )
}
