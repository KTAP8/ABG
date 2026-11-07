import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { track } from '../../lib/analytics'

const STEPS = ['hangout', 'silhouette', 'line', 'next_piece', 'heard_from', 'age_range', 'language'] as const

const OPTIONS = {
  hangout: ['home', 'cafe_main', 'cafe_niche', 'community', 'friend', 'campus'],
  silhouette: ['oversize', 'baby', 'longsleeve', 'neckline'],
  line: ['attitude', 'anti_graphic', 'scarcity', 'no_copy'],
  next_piece: ['top', 'sleeve', 'bottoms', 'object'],
  heard_from: ['word', 'instagram', 'facebook', 'tiktok', 'line'],
  age_range: ['18_22', '23_27', '28_34', '35_plus'],
  language: ['en', 'th', 'either'],
} as const

export type BuyerGameAnswers = {
  hangout?: string
  silhouette?: string
  line?: string
  next_piece?: string
  heard_from?: string
  age_range?: string
  language?: string
}

export type BuyerGameStatus = 'partial' | 'completed' | 'skipped'

type StepKey = (typeof STEPS)[number]

const ease = [0.16, 1, 0.3, 1] as const

const POLAROIDS = [
  '/images/iykyk/polaroid-01.jpg',
  '/images/iykyk/polaroid-03.jpg',
  '/images/iykyk/polaroid-05.jpg',
]

function CornerTicks({ active }: { active: boolean }) {
  const color = active ? 'border-cream/60' : 'border-charcoal/30 group-hover:border-charcoal'
  return (
    <>
      <span className={`pointer-events-none absolute left-1.5 top-1.5 h-1.5 w-1.5 border-l border-t transition-colors ${color}`} />
      <span className={`pointer-events-none absolute right-1.5 top-1.5 h-1.5 w-1.5 border-r border-t transition-colors ${color}`} />
      <span className={`pointer-events-none absolute bottom-1.5 left-1.5 h-1.5 w-1.5 border-b border-l transition-colors ${color}`} />
      <span className={`pointer-events-none absolute bottom-1.5 right-1.5 h-1.5 w-1.5 border-b border-r transition-colors ${color}`} />
    </>
  )
}

function SilhouetteSketch({ option }: { option: string }) {
  switch (option) {
    case 'oversize':
      // Boxy drop-shoulder tee block with wide hem and pattern guide lines
      return (
        <svg viewBox="0 0 88 64" className="h-14 w-20" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <path d="M8 14 L80 14" strokeDasharray="2 2" strokeOpacity="0.4" />
          <path d="M8 11 L8 17 M80 11 L80 17" strokeOpacity="0.4" />
          <path d="M29 14 C34 19 54 19 59 14 L82 23 L74 39 L63 35 L63 58 L25 58 L25 35 L14 39 L6 23 Z" />
          <path d="M25 22 L19 36 M63 22 L69 36" strokeDasharray="2 2" strokeOpacity="0.55" />
          <path d="M25 53 L63 53" strokeDasharray="1.5 2" strokeOpacity="0.45" />
        </svg>
      )
    case 'baby':
      // Cropped, fitted baby tee with high-hip proportion line
      return (
        <svg viewBox="0 0 88 64" className="h-14 w-20" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <path d="M34 12 C38 16 50 16 54 12 L68 19 L63 29 L56 26 L55 41 L33 41 L32 26 L25 29 L20 19 Z" />
          <path d="M16 41 L72 41" strokeDasharray="2 2" strokeOpacity="0.5" />
          <path d="M33 49 L55 49" strokeDasharray="1.5 2.5" strokeOpacity="0.3" />
          <path d="M68 41 L68 54 M65 44 L68 41 L71 44" strokeOpacity="0.5" />
        </svg>
      )
    case 'longsleeve':
      // Long sleeve tee with bunched/shoved-up forearm pleats
      return (
        <svg viewBox="0 0 88 64" className="h-14 w-20" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <path d="M32 12 C37 16 51 16 56 12 L72 19 L80 42 L71 45 L62 27 L60 56 L28 56 L26 27 L17 45 L8 42 L16 19 Z" />
          <path d="M11 33 L19 36 M10 37 L18 40 M77 33 L69 36 M78 37 L70 40" strokeOpacity="0.7" />
          <path d="M6 46 L11 32 M11 32 L7 35 M82 46 L77 32 M77 32 L81 35" strokeOpacity="0.45" />
        </svg>
      )
    case 'neckline':
      // Open collarbone / wide architectural boat-neck detail
      return (
        <svg viewBox="0 0 88 64" className="h-14 w-20" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <path d="M20 20 C32 31 56 31 68 20" />
          <path d="M18 23 C32 34 56 34 70 23" strokeDasharray="2 2" strokeOpacity="0.5" />
          <path d="M20 20 L8 27 L12 52 L76 52 L80 27 L68 20" />
          <path d="M24 20 L64 20" strokeDasharray="2 2" strokeOpacity="0.45" />
          <path d="M44 13 L44 36" strokeDasharray="1.5 2" strokeOpacity="0.35" />
        </svg>
      )
    default:
      return null
  }
}

function HangoutSketch({ option }: { option: string }) {
  switch (option) {
    case 'home':
      // Architectural window frame & vinyl sleeve
      return (
        <svg viewBox="0 0 56 44" className="h-10 w-13" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <rect x="8" y="6" width="26" height="32" />
          <line x1="21" y1="6" x2="21" y2="38" strokeOpacity="0.5" />
          <line x1="8" y1="22" x2="34" y2="22" strokeOpacity="0.5" />
          <circle cx="42" cy="28" r="8" strokeDasharray="2 1.5" />
          <circle cx="42" cy="28" r="2" />
        </svg>
      )
    case 'cafe_main':
      // Clean takeaway cup silhouette
      return (
        <svg viewBox="0 0 56 44" className="h-10 w-13" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M16 12 L40 12 L37 38 L19 38 Z" />
          <path d="M14 8 L42 8 L40 12 L16 12 Z" />
          <path d="M17.5 21 L38.5 21 M18.2 28 L37.8 28" strokeOpacity="0.55" />
        </svg>
      )
    case 'cafe_niche':
      // Overhead cortado glass on architectural coaster
      return (
        <svg viewBox="0 0 56 44" className="h-10 w-13" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <rect x="12" y="6" width="32" height="32" strokeDasharray="2 2" strokeOpacity="0.45" />
          <circle cx="28" cy="22" r="11" />
          <circle cx="28" cy="22" r="6" strokeOpacity="0.6" />
          <line x1="36" y1="14" x2="43" y2="7" />
        </svg>
      )
    case 'community':
      // Modular bench / gallery plinth grid
      return (
        <svg viewBox="0 0 56 44" className="h-10 w-13" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <rect x="6" y="18" width="20" height="18" />
          <rect x="30" y="10" width="20" height="26" />
          <line x1="6" y1="36" x2="50" y2="36" />
          <line x1="16" y1="6" x2="16" y2="14" strokeDasharray="1.5 1.5" strokeOpacity="0.5" />
        </svg>
      )
    case 'friend':
      // Two overlapping Brutalist frames
      return (
        <svg viewBox="0 0 56 44" className="h-10 w-13" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <rect x="10" y="8" width="22" height="22" />
          <rect x="24" y="14" width="22" height="22" />
          <line x1="24" y1="22" x2="32" y2="22" strokeOpacity="0.6" />
        </svg>
      )
    case 'campus':
      // Samyan brutalist architectural columns & steps
      return (
        <svg viewBox="0 0 56 44" className="h-10 w-13" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M8 36 L48 36 M12 31 L44 31 M16 26 L40 26" />
          <line x1="20" y1="8" x2="20" y2="26" />
          <line x1="28" y1="8" x2="28" y2="26" />
          <line x1="36" y1="8" x2="36" y2="26" />
          <line x1="14" y1="8" x2="42" y2="8" />
        </svg>
      )
    default:
      return null
  }
}

function NextPieceSketch({ option }: { option: string }) {
  switch (option) {
    case 'top':
      // Torso pattern block with center axis
      return (
        <svg viewBox="0 0 72 52" className="h-12 w-16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <path d="M24 8 C29 12 43 12 48 8 L62 15 L57 25 L50 22 L50 44 L22 44 L22 22 L15 25 L10 15 Z" />
          <line x1="36" y1="6" x2="36" y2="46" strokeDasharray="2 2" strokeOpacity="0.45" />
          <line x1="22" y1="30" x2="50" y2="30" strokeDasharray="2 2" strokeOpacity="0.45" />
        </svg>
      )
    case 'sleeve':
      // Heavyweight Raglan / jacket sleeve block
      return (
        <svg viewBox="0 0 72 52" className="h-12 w-16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <path d="M22 8 L48 8 L64 40 L53 44 L43 22 L43 44 L22 44 Z" />
          <path d="M35 8 L43 22" strokeDasharray="2 2" strokeOpacity="0.5" />
          <line x1="51" y1="38" x2="62" y2="34" strokeOpacity="0.6" />
        </svg>
      )
    case 'bottoms':
      // Wide-leg pleated trouser pattern block
      return (
        <svg viewBox="0 0 72 52" className="h-12 w-16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <path d="M20 6 L52 6 L56 46 L40 46 L36 20 L32 46 L16 46 Z" />
          <line x1="20" y1="11" x2="52" y2="11" strokeOpacity="0.55" />
          <line x1="27" y1="11" x2="25" y2="32" strokeDasharray="2 2" strokeOpacity="0.45" />
          <line x1="45" y1="11" x2="47" y2="32" strokeDasharray="2 2" strokeOpacity="0.45" />
        </svg>
      )
    case 'object':
      // Isometric archival object / hardware cube
      return (
        <svg viewBox="0 0 72 52" className="h-12 w-16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <polygon points="36,6 58,16 58,36 36,46 14,36 14,16" />
          <polyline points="14,16 36,26 58,16" />
          <line x1="36" y1="26" x2="36" y2="46" />
          <line x1="25" y1="11" x2="47" y2="21" strokeDasharray="2 2" strokeOpacity="0.45" />
        </svg>
      )
    default:
      return null
  }
}

function HeardFromSketch({ option }: { option: string }) {
  switch (option) {
    case 'word':
      // Word of mouth / peer-to-peer icon (two people / conversation)
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
          <circle cx="9" cy="7" r="3.5" />
          <path d="M2.5 20v-1.5A4.5 4.5 0 0 1 7 14h4a4.5 4.5 0 0 1 4.5 4.5V20" />
          <circle cx="17.5" cy="8.5" r="2.5" />
          <path d="M18 14.2a4 4 0 0 1 3.5 3.9V20" />
        </svg>
      )
    case 'instagram':
      // Official Instagram brand glyph (Simple Icons)
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    case 'facebook':
      // Official Facebook brand glyph (Simple Icons)
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z" />
        </svg>
      )
    case 'tiktok':
      // Official TikTok brand glyph (Simple Icons)
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.5.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.99-.62-4.32.21-5.18 2.05-.39.8-.45 1.76-.17 2.62.33 1.02 1.17 1.83 2.19 2.15 1.25.4 2.69.21 3.75-.54 1.02-.75 1.59-1.99 1.6-3.26.02-4.57-.01-9.14.02-13.7z" />
        </svg>
      )
    case 'line':
      // Official LINE messenger brand logo (Simple Icons)
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      )
    default:
      return null
  }
}

function TailorRuler({
  filled,
  current,
  onSelectStep,
  disabled,
}: {
  filled: number
  current: number
  onSelectStep?: (idx: number) => void
  disabled?: boolean
}) {
  return (
    <div className="select-none" aria-hidden="true">
      <div
        className="grid border-b border-t border-charcoal/20"
        style={{ gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))` }}
      >
        {STEPS.map((stepKey, index) => {
          const isDone = index < filled
          const isCurrent = index === current
          const canJump = Boolean(onSelectStep && index < current && !disabled)
          return (
            <button
              key={stepKey}
              type="button"
              disabled={!canJump}
              onClick={() => canJump && onSelectStep?.(index)}
              tabIndex={-1}
              className={`group relative flex flex-col justify-between border-r border-charcoal/15 px-2 py-1.5 text-left transition-colors last:border-r-0 ${
                isCurrent
                  ? 'bg-charcoal text-cream'
                  : isDone
                    ? 'bg-charcoal/10 text-charcoal hover:bg-charcoal/20'
                    : 'bg-transparent text-charcoal/35'
              } ${canJump ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-body text-[10px] tracking-[-0.04em]">
                  0{index + 1}
                </span>
                {isDone && !isCurrent && (
                  <span className="h-1.5 w-1.5 bg-charcoal" />
                )}
                {isCurrent && (
                  <span className="h-1.5 w-1.5 bg-cream" />
                )}
              </div>
              {/* Millimeter ruler ticks */}
              <div className="mt-1.5 flex items-end justify-between opacity-45">
                <span className="h-1.5 w-px bg-current" />
                <span className="h-1 w-px bg-current" />
                <span className="h-1 w-px bg-current" />
                <span className="h-1.5 w-px bg-current" />
                <span className="h-1 w-px bg-current" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function computePersona(answers: BuyerGameAnswers): {
  key: 'regular' | 'purist' | 'observer' | 'insider'
  code: string
} {
  if (answers.line === 'no_copy' || answers.next_piece === 'object') {
    return { key: 'observer', code: 'ABG-03 / CAM' }
  }
  if (answers.silhouette === 'baby' || answers.silhouette === 'neckline') {
    return { key: 'purist', code: 'ABG-02 / CUT' }
  }
  if (answers.hangout === 'campus' || answers.hangout === 'cafe_niche') {
    return { key: 'insider', code: 'ABG-04 / SMY' }
  }
  return { key: 'regular', code: 'ABG-01 / DRP' }
}

export function BuyerGame({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  onSave?: (payload: { answers: BuyerGameAnswers; status: BuyerGameStatus }) => void | Promise<void>
}) {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const [step, setStep] = useState(-1)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<BuyerGameAnswers>({})
  const [picked, setPicked] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [introPulse, setIntroPulse] = useState(0)
  const introTick = useRef<number | null>(null)
  const answersRef = useRef<BuyerGameAnswers>({})
  const stepRef = useRef(step)
  const onCloseRef = useRef(onClose)
  const onSaveRef = useRef(onSave)
  answersRef.current = answers
  stepRef.current = step
  onCloseRef.current = onClose
  onSaveRef.current = onSave

  const intro = step < 0
  const outro = step >= STEPS.length
  const key: StepKey | null = !intro && !outro ? STEPS[step] : null
  const options = key ? OPTIONS[key] : []

  useEffect(() => {
    if (!isOpen) return
    setStep(-1)
    setDirection(1)
    setAnswers({})
    setPicked(null)
    setBusy(false)
    setIntroPulse(0)
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (introTick.current) window.clearInterval(introTick.current)
        if (stepRef.current < STEPS.length) {
          const current = answersRef.current
          void onSaveRef.current?.({
            answers: current,
            status: Object.keys(current).length ? 'partial' : 'skipped',
          })
        }
        onCloseRef.current()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener('keydown', onKey)
      if (introTick.current) window.clearInterval(introTick.current)
    }
  }, [isOpen])

  function skip() {
    if (introTick.current) window.clearInterval(introTick.current)
    if (outro) {
      onClose()
      return
    }
    const status = Object.keys(answers).length ? 'partial' : 'skipped'
    track('survey_finished', { status, steps_answered: Object.keys(answers).length })
    void onSave?.({ answers, status })
    onClose()
  }

  function startGame() {
    if (busy) return
    setDirection(1)
    const hangout = answers.hangout ?? null
    if (reduce) {
      setPicked(hangout)
      setStep(0)
      return
    }
    setBusy(true)
    let n = 0
    introTick.current = window.setInterval(() => {
      n += 1
      setIntroPulse(n)
      if (n >= STEPS.length) {
        if (introTick.current) window.clearInterval(introTick.current)
        introTick.current = null
        setIntroPulse(0)
        setBusy(false)
        setPicked(hangout)
        setStep(0)
      }
    }, 65)
  }

  function goBack() {
    if (busy || intro) return
    setDirection(-1)
    if (outro) {
      const lastIdx = STEPS.length - 1
      setPicked(answers[STEPS[lastIdx]] ?? null)
      setStep(lastIdx)
      return
    }
    if (step === 0) {
      setPicked(null)
      setStep(-1)
      return
    }
    const previous = step - 1
    setPicked(answers[STEPS[previous]] ?? null)
    setStep(previous)
  }

  function jumpToStep(targetIndex: number) {
    if (busy || targetIndex < 0 || targetIndex >= step) return
    setDirection(-1)
    setPicked(answers[STEPS[targetIndex]] ?? null)
    setStep(targetIndex)
  }

  function pick(option: string) {
    if (!key || busy) return
    const next = { ...answers, [key]: option }
    setAnswers(next)
    setPicked(option)
    setBusy(true)
    setDirection(1)
    const delay = reduce ? 0 : 210
    window.setTimeout(() => {
      if (step >= STEPS.length - 1) {
        track('survey_finished', {
          status: 'completed',
          steps_answered: Object.keys(next).length,
          persona: computePersona(next).key,
        })
        void onSave?.({ answers: next, status: 'completed' })
        setBusy(false)
        setStep(STEPS.length)
        return
      }
      const upcoming = STEPS[step + 1]
      void onSave?.({ answers: next, status: 'partial' })
      setPicked(next[upcoming] ?? null)
      setBusy(false)
      setStep(step + 1)
    }, delay)
  }

  const travel = reduce
    ? { initial: { opacity: 1, x: 0 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 1, x: 0 } }
    : {
        initial: { opacity: 0, x: 26 * direction },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -26 * direction },
      }

  const persona = computePersona(answers)

  useEffect(() => {
    if (!isOpen || intro || outro || busy || !key) return
    const onNumberKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const num = Number.parseInt(event.key, 10)
      if (!Number.isNaN(num) && num >= 1 && num <= options.length) {
        event.preventDefault()
        pick(options[num - 1])
      }
    }
    window.addEventListener('keydown', onNumberKey)
    return () => window.removeEventListener('keydown', onNumberKey)
  }, [isOpen, intro, outro, busy, key, options, step, answers])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/65 p-4 md:p-8"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.22 }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label={t('buyer_game.skip')}
            onClick={skip}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="buyer-game-title"
            className="ph-no-capture relative z-10 flex max-h-[92svh] w-full max-w-xl flex-col overflow-hidden border border-charcoal bg-cream"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduce ? 0 : 0.32, ease }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-charcoal/15 px-5 py-3.5 md:px-7">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 bg-charcoal" aria-hidden="true" />
                <p
                  id="buyer-game-title"
                  className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal"
                >
                  {t('buyer_game.title')}
                </p>
                {!intro && !outro && (
                  <span className="font-body text-[11px] tracking-[-0.04em] text-charcoal/45">
                    — {t('buyer_game.step', { current: step + 1, total: STEPS.length })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {!intro && !outro && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={goBack}
                    className="cursor-pointer font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55 hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t('buyer_game.back')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={skip}
                  className="cursor-pointer font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/55 hover:text-charcoal"
                >
                  {outro ? t('buyer_game.outro.done') : t('buyer_game.skip')}
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-5 py-6 md:px-7 md:py-7">
              <AnimatePresence mode="wait">
                {intro ? (
                  <motion.div
                    key="intro"
                    initial={travel.initial}
                    animate={travel.animate}
                    exit={travel.exit}
                    transition={{ duration: reduce ? 0 : 0.28, ease }}
                  >
                    <TailorRuler
                      filled={introPulse}
                      current={introPulse > 0 && introPulse <= STEPS.length ? introPulse - 1 : -1}
                    />

                    {/* Candid Polaroid Contact Strip */}
                    <div className="mt-6 grid grid-cols-3 gap-2 border border-charcoal/15 bg-white p-2">
                      {POLAROIDS.map((src, idx) => (
                        <div key={src} className="relative aspect-[4/5] overflow-hidden bg-cream">
                          <img
                            src={src}
                            alt=""
                            className="h-full w-full object-cover grayscale contrast-115 transition-transform duration-500 hover:scale-105"
                          />
                          <span className="absolute bottom-1 left-1.5 bg-cream/90 px-1 py-0.5 font-body text-[9px] tracking-[-0.04em] text-charcoal">
                            0{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-[clamp(2.2rem,7vw,3.4rem)] font-bold lowercase leading-[0.9] tracking-[-0.07em] text-charcoal">
                        {t('buyer_game.intro.headline')}
                      </h2>
                      <span className="shrink-0 font-body text-[11px] lowercase tracking-[-0.04em] text-charcoal/45">
                        {t('buyer_game.spec.cut_ready')}
                      </span>
                    </div>

                    <p className="mt-3 max-w-sm font-body text-[15px] leading-snug tracking-[-0.04em] text-charcoal/70">
                      {t('buyer_game.intro.line')}
                    </p>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={startGame}
                      className="group relative mt-8 flex w-full cursor-pointer items-center justify-between border border-charcoal bg-charcoal px-5 py-4 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-colors hover:bg-cream hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span>{t('buyer_game.intro.ok')}</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </button>
                  </motion.div>
                ) : outro ? (
                  <motion.div
                    key="outro"
                    initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={travel.exit}
                    transition={{ duration: reduce ? 0 : 0.35, ease }}
                  >
                    {/* Woven Garment Spec Tag Card */}
                    <div className="relative border border-charcoal bg-white p-5 md:p-6">
                      {/* Stitch Marks at Top */}
                      <div className="flex items-center justify-between border-b border-dashed border-charcoal/25 pb-3">
                        <span className="font-brand text-base tracking-normal text-charcoal">
                          ABG
                        </span>
                        <span className="font-body text-[11px] uppercase tracking-[-0.02em] text-charcoal/55">
                          {persona.code}
                        </span>
                      </div>

                      <p className="mt-5 font-body text-[11px] lowercase tracking-[-0.04em] text-charcoal/50">
                        {t('buyer_game.outro.kicker')}
                      </p>
                      <h2 className="mt-1.5 font-display text-[clamp(1.85rem,5.5vw,2.75rem)] font-bold lowercase leading-[0.92] tracking-[-0.07em] text-charcoal">
                        {t(`buyer_game.persona.${persona.key}.title`)}
                      </h2>
                      <p className="mt-2.5 font-body text-[14px] lowercase leading-snug tracking-[-0.04em] text-charcoal/75">
                        {t(`buyer_game.persona.${persona.key}.sub`)}
                      </p>

                      {/* Compiled 4-Row Garment Spec Table */}
                      <div className="mt-6 grid grid-cols-2 gap-px border border-charcoal/15 bg-charcoal/15">
                        {(['hangout', 'silhouette', 'line', 'next_piece'] as const).map((field, idx) => {
                          const val = answers[field]
                          return (
                            <div key={field} className="bg-cream p-3">
                              <span className="block font-body text-[10px] lowercase tracking-[-0.04em] text-charcoal/45">
                                0{idx + 1} / {field.replace('_', ' ')}
                              </span>
                              <span className="mt-1 block font-body text-[12px] font-medium lowercase leading-tight tracking-[-0.04em] text-charcoal">
                                {val ? t(`buyer_game.${field}.${val}`) : '—'}
                              </span>
                            </div>
                          )
                        })}
                        <div className="col-span-2 bg-cream p-3">
                          <span className="block font-body text-[10px] lowercase tracking-[-0.04em] text-charcoal/45">
                            05 / {t('buyer_game.heard_from.prompt')}
                          </span>
                          <span className="mt-1 block font-body text-[12px] font-medium lowercase leading-tight tracking-[-0.04em] text-charcoal">
                            {answers.heard_from ? t(`buyer_game.heard_from.${answers.heard_from}`) : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Care Tag Barcode & Note */}
                      <div className="mt-5 flex items-center justify-between border-t border-charcoal/15 pt-4">
                        <p className="font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/65">
                          {t('buyer_game.outro.note')}
                        </p>
                        <div className="flex h-4 items-stretch gap-0.5 opacity-60" aria-hidden="true">
                          <span className="w-0.5 bg-charcoal" />
                          <span className="w-px bg-charcoal" />
                          <span className="w-1 bg-charcoal" />
                          <span className="w-px bg-charcoal" />
                          <span className="w-0.5 bg-charcoal" />
                          <span className="w-1 bg-charcoal" />
                          <span className="w-px bg-charcoal" />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-5 w-full cursor-pointer border border-charcoal bg-charcoal px-5 py-3.5 font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-colors hover:bg-cream hover:text-charcoal"
                    >
                      {t('buyer_game.outro.done')}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={key}
                    initial={travel.initial}
                    animate={travel.animate}
                    exit={travel.exit}
                    transition={{ duration: reduce ? 0 : 0.26, ease }}
                  >
                    <TailorRuler
                      filled={step}
                      current={step}
                      onSelectStep={jumpToStep}
                      disabled={busy}
                    />

                    <div className="mt-6 flex items-end justify-between gap-4">
                      <h2 className="font-display text-[clamp(1.75rem,5.2vw,2.6rem)] font-bold lowercase leading-[0.92] tracking-[-0.07em] text-charcoal">
                        {t(`buyer_game.${key}.prompt`)}
                      </h2>
                    </div>

                    {/* Step-specific interactive layouts */}
                    {key === 'line' ? (
                      /* Step 3: Editorial Manifesto Typography Slabs */
                      <div className="mt-6 flex flex-col gap-2">
                        {options.map((option, idx) => {
                          const selected = picked === option
                          return (
                            <motion.button
                              key={option}
                              type="button"
                              disabled={busy}
                              onClick={() => pick(option)}
                              initial={reduce ? false : { opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: reduce ? 0 : 0.2, delay: reduce ? 0 : idx * 0.035 }}
                              whileTap={reduce ? undefined : { scale: 0.99 }}
                              className={`group relative flex w-full cursor-pointer items-center justify-between overflow-hidden border px-4 py-4 text-left transition-colors duration-150 disabled:cursor-not-allowed ${
                                selected
                                  ? 'border-charcoal bg-charcoal text-cream'
                                  : 'border-charcoal/20 bg-cream text-charcoal hover:border-charcoal hover:bg-white'
                              }`}
                            >
                              <CornerTicks active={selected} />
                              <div className="flex items-baseline gap-3.5 pr-3">
                                <span
                                  className={`font-body text-[11px] tracking-[-0.04em] ${
                                    selected ? 'text-cream/60' : 'text-charcoal/40 group-hover:text-charcoal'
                                  }`}
                                >
                                  0{idx + 1}
                                </span>
                                <span className="font-display text-[clamp(1.05rem,3vw,1.35rem)] font-bold lowercase leading-tight tracking-[-0.06em]">
                                  {option === 'no_copy'
                                    ? t(`buyer_game.${key}.${option}`)
                                    : `“${t(`buyer_game.${key}.${option}`)}”`}
                                </span>
                              </div>
                              {option === 'no_copy' ? (
                                <span className="h-8 w-10 shrink-0 overflow-hidden border border-current/25">
                                  <img
                                    src="/images/iykyk/polaroid-02.jpg"
                                    alt=""
                                    className="h-full w-full object-cover grayscale"
                                  />
                                </span>
                              ) : (
                                <span
                                  className={`font-body text-xs transition-transform duration-150 group-hover:translate-x-0.5 ${
                                    selected ? 'text-cream' : 'text-charcoal/35 group-hover:text-charcoal'
                                  }`}
                                >
                                  →
                                </span>
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    ) : key === 'age_range' || key === 'language' ? (
                      /* Step 5 & 6: Woven Size-Tag / Spec Switches */
                      <div
                        className={`mt-7 grid gap-2.5 ${
                          key === 'age_range' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'
                        }`}
                      >
                        {options.map((option, idx) => {
                          const selected = picked === option
                          const displayCode =
                            key === 'language'
                              ? option === 'en'
                                ? 'EN'
                                : option === 'th'
                                  ? 'TH'
                                  : 'EN / TH'
                              : t(`buyer_game.${key}.${option}`)
                          return (
                            <motion.button
                              key={option}
                              type="button"
                              disabled={busy}
                              onClick={() => pick(option)}
                              initial={reduce ? false : { opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: reduce ? 0 : 0.2, delay: reduce ? 0 : idx * 0.04 }}
                              whileTap={reduce ? undefined : { scale: 0.98 }}
                              className={`group relative flex min-h-28 cursor-pointer flex-col justify-between border p-4 text-left transition-colors duration-150 disabled:cursor-not-allowed ${
                                selected
                                  ? 'border-charcoal bg-charcoal text-cream'
                                  : 'border-charcoal/20 bg-cream text-charcoal hover:border-charcoal hover:bg-white'
                              }`}
                            >
                              <CornerTicks active={selected} />
                              <div className="flex w-full items-center justify-between">
                                <span
                                  className={`font-body text-[10px] uppercase tracking-[-0.02em] ${
                                    selected ? 'text-cream/60' : 'text-charcoal/40'
                                  }`}
                                >
                                  0{idx + 1}
                                </span>
                                <span
                                  className={`h-1.5 w-1.5 ${
                                    selected ? 'bg-cream' : 'bg-charcoal/20 group-hover:bg-charcoal'
                                  }`}
                                />
                              </div>
                              <div>
                                <span className="block font-display text-2xl font-bold lowercase leading-none tracking-[-0.07em] md:text-3xl">
                                  {displayCode}
                                </span>
                                {key === 'language' && (
                                  <span
                                    className={`mt-2 block font-body text-[12px] lowercase tracking-[-0.04em] ${
                                      selected ? 'text-cream/75' : 'text-charcoal/65'
                                    }`}
                                  >
                                    {t(`buyer_game.${key}.${option}`)}
                                  </span>
                                )}
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>
                    ) : key === 'heard_from' ? (
                      /* Step 5 (Heard From): Balanced 1 + 2x2 Brand Logo Grid */
                      <div className="mt-6 grid grid-cols-2 gap-2.5">
                        {options.map((option, idx) => {
                          const selected = picked === option
                          const isWord = option === 'word'
                          return (
                            <motion.button
                              key={option}
                              type="button"
                              disabled={busy}
                              onClick={() => pick(option)}
                              initial={reduce ? false : { opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: reduce ? 0 : 0.2, delay: reduce ? 0 : idx * 0.035 }}
                              whileTap={reduce ? undefined : { scale: 0.98 }}
                              className={`group relative cursor-pointer border p-4 text-left transition-colors duration-150 disabled:cursor-not-allowed ${
                                isWord
                                  ? 'col-span-2 flex items-center justify-between py-4'
                                  : 'flex min-h-28 flex-col items-start justify-between'
                              } ${
                                selected
                                  ? 'border-charcoal bg-charcoal text-cream'
                                  : 'border-charcoal/20 bg-cream text-charcoal hover:border-charcoal hover:bg-white'
                              }`}
                            >
                              <CornerTicks active={selected} />

                              {isWord ? (
                                <>
                                  <div className="flex items-center gap-3.5">
                                    <div
                                      className={`transition-transform duration-200 group-hover:scale-105 ${
                                        selected ? 'text-cream' : 'text-charcoal'
                                      }`}
                                    >
                                      <HeardFromSketch option={option} />
                                    </div>
                                    <span className="font-display text-base font-bold lowercase leading-none tracking-[-0.05em] md:text-lg">
                                      {t(`buyer_game.${key}.${option}`)}
                                    </span>
                                  </div>
                                  <span
                                    className={`font-body text-[10px] tracking-[-0.04em] ${
                                      selected ? 'text-cream/55' : 'text-charcoal/35 group-hover:text-charcoal/70'
                                    }`}
                                  >
                                    0{idx + 1}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <div className="flex w-full items-start justify-between">
                                    <div
                                      className={`transition-transform duration-200 group-hover:scale-105 ${
                                        selected ? 'text-cream' : 'text-charcoal'
                                      }`}
                                    >
                                      <HeardFromSketch option={option} />
                                    </div>
                                    <span
                                      className={`font-body text-[10px] tracking-[-0.04em] ${
                                        selected ? 'text-cream/55' : 'text-charcoal/35 group-hover:text-charcoal/70'
                                      }`}
                                    >
                                      0{idx + 1}
                                    </span>
                                  </div>

                                  <span className="mt-3 font-body text-[13px] lowercase leading-snug tracking-[-0.04em]">
                                    {t(`buyer_game.${key}.${option}`)}
                                  </span>
                                </>
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    ) : (
                      /* Step 1 (Hangout), Step 2 (Silhouette), Step 4 (Next Piece): Bespoke Architectural Pattern Cards */
                      <div
                        className={`mt-6 grid gap-2.5 ${
                          key === 'hangout' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'
                        }`}
                      >
                        {options.map((option, idx) => {
                          const selected = picked === option
                          return (
                            <motion.button
                              key={option}
                              type="button"
                              disabled={busy}
                              onClick={() => pick(option)}
                              initial={reduce ? false : { opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: reduce ? 0 : 0.2, delay: reduce ? 0 : idx * 0.035 }}
                              whileTap={reduce ? undefined : { scale: 0.98 }}
                              className={`group relative flex min-h-30 cursor-pointer flex-col items-start justify-between border p-3.5 text-left transition-colors duration-150 disabled:cursor-not-allowed md:p-4 ${
                                selected
                                  ? 'border-charcoal bg-charcoal text-cream'
                                  : 'border-charcoal/20 bg-cream text-charcoal hover:border-charcoal hover:bg-white'
                              }`}
                            >
                              <CornerTicks active={selected} />

                              <div className="flex w-full items-start justify-between">
                                <div
                                  className={`transition-transform duration-200 group-hover:scale-105 ${
                                    selected ? 'text-cream' : 'text-charcoal'
                                  }`}
                                >
                                  {key === 'silhouette' && <SilhouetteSketch option={option} />}
                                  {key === 'hangout' && <HangoutSketch option={option} />}
                                  {key === 'next_piece' && <NextPieceSketch option={option} />}
                                </div>
                                <span
                                  className={`font-body text-[10px] tracking-[-0.04em] ${
                                    selected ? 'text-cream/55' : 'text-charcoal/35 group-hover:text-charcoal/70'
                                  }`}
                                >
                                  0{idx + 1}
                                </span>
                              </div>

                              <span className="mt-3 font-body text-[13px] lowercase leading-snug tracking-[-0.04em]">
                                {t(`buyer_game.${key}.${option}`)}
                              </span>
                            </motion.button>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Live Garment Spec Accumulator Footer Strip */}
            {!intro && !outro && (
              <div className="border-t border-charcoal/15 bg-white/60 px-5 py-2.5 md:px-7">
                <div className="flex items-center justify-between gap-3 overflow-hidden">
                  <span className="shrink-0 font-body text-[10px] lowercase tracking-[-0.04em] text-charcoal/45">
                    {t('buyer_game.spec.label')}
                  </span>
                  <div className="flex flex-wrap items-center justify-end gap-1.5 overflow-hidden">
                    {(['hangout', 'silhouette', 'line', 'next_piece', 'heard_from'] as const).map((slotKey) => {
                      const val = answers[slotKey]
                      return (
                        <span
                          key={slotKey}
                          className={`inline-block border px-1.5 py-0.5 font-body text-[10px] lowercase tracking-[-0.04em] transition-colors ${
                            val
                              ? 'border-charcoal bg-charcoal text-cream'
                              : 'border-charcoal/15 bg-transparent text-charcoal/30'
                          }`}
                        >
                          {val ? t(`buyer_game.${slotKey}.${val}`) : '···'}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function shouldOpenBuyerGame(survey: { status: string } | null | undefined) {
  return !survey
}
