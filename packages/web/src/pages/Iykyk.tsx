import { useEffect } from 'react'
import { motion } from 'framer-motion'
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
]

export default function Iykyk() {
  // Set up route specific brand colors on mount
  useEffect(() => {
    const origBg = document.body.style.backgroundColor
    const origColor = document.body.style.color
    document.body.style.backgroundColor = '#F5F1E8'
    document.body.style.color = '#3F3F44'

    return () => {
      document.body.style.backgroundColor = origBg
      document.body.style.color = origColor
    }
  }, [])

  return (
    <div className="relative w-full min-h-screen bg-[#F5F1E8] text-[#3F3F44] font-sans flex flex-col justify-center items-center py-12 md:py-24 px-6 md:px-12 lg:px-20 overflow-x-hidden">
      <div className="w-full max-w-5xl z-10 flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-12 lg:gap-16 my-auto">
        
        {/* Left Side: Spacious Minimalist Editorial Narrative Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[52%] flex flex-col justify-center space-y-8 text-left"
        >
          <div className="space-y-6">
            <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tighter text-[#3F3F44] leading-[0.95]">
              {SECTIONS[0].lines[0]}
            </h1>

            <div className="space-y-6 text-[#3F3F44]/90 text-sm md:text-base leading-relaxed font-sans max-w-lg">
              <p>
                {SECTIONS[0].lines[1]}{' '}
                <span className="font-bold text-[#3F3F44] block mt-1">{SECTIONS[0].lines[2]}</span>
              </p>
              
              <p className="opacity-80">
                {SECTIONS[1].lines[1]}
              </p>

              <p className="font-bold tracking-wide border-l border-[#3F3F44]/25 pl-4 py-0.5 opacity-90">
                {SECTIONS[2].lines[0]}
              </p>

              <p className="opacity-80">
                {SECTIONS[2].lines[1]}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Direct Access form card (Zero-Friction Minimalist) */}
        <motion.div 
          initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[42%] flex items-center justify-center z-10"
        >
          <div className="w-full max-w-md">
            <RewardReveal />
          </div>
        </motion.div>

      </div>
    </div>
  )
}
