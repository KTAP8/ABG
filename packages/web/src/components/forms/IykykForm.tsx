import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { submitIykyk } from '../../lib/api'

// Luxurious slot-machine typographic resolve component
function CodeDecryptor({ 
  code, 
  onComplete 
}: { 
  code: string 
  onComplete: () => void 
}) {
  const [displayText, setDisplayText] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  useEffect(() => {
    const logSteps = [
      'RESOLVING SIGNATURE REGISTRY...',
      'MATCHING FIRST DROP DATABASE...',
      'GENERATING ARCHIVAL TOKEN...',
      'DECRYPTING VERIFICATION KEY...',
    ]

    let logIdx = 0
    const logInterval = setInterval(() => {
      if (logIdx < logSteps.length) {
        setLogs((prev) => [...prev, logSteps[logIdx]])
        logIdx++
      } else {
        clearInterval(logInterval)
        
        let iterations = 0
        const textInterval = setInterval(() => {
          setDisplayText(() => {
            return code
              .split('')
              .map((_, index) => {
                if (index < iterations) return code[index]
                return chars[Math.floor(Math.random() * chars.length)]
              })
              .join('')
          })

          if (iterations >= code.length) {
            clearInterval(textInterval)
            setTimeout(onComplete, 550)
          }
          iterations += 0.4
        }, 45)
      }
    }, 200)

    return () => {
      clearInterval(logInterval)
    }
  }, [code, onComplete])

  return (
    <div className="font-mono text-[9px] text-left space-y-2 py-2">
      <div className="space-y-1 text-[#3F3F44]/50">
        {logs.map((log, i) => (
          <div key={i} className="flex justify-between items-center border-b border-[#3F3F44]/5 pb-0.5">
            <span>&gt; {log}</span>
            <span className="text-[#3F3F44]/80 font-bold">DONE</span>
          </div>
        ))}
        {logs.length < 4 && (
          <div className="flex items-center gap-1 text-[#3F3F44]/30 pt-0.5">
            <span>&gt; RESOLVING SECURE CHANNEL...</span>
            <span className="w-1 h-3 bg-[#3F3F44] animate-cursor-blink" />
          </div>
        )}
      </div>

      {logs.length >= 4 && (
        <div className="border border-[#3F3F44]/20 bg-white/40 p-4 text-center space-y-1.5 mt-3 relative">
          <div className="absolute top-1 left-1 font-mono text-[6px] text-[#3F3F44]/40">SYS_DECRYPTOR_v1.0</div>
          <div className="text-[#3F3F44]/50 uppercase text-[8px] tracking-[0.2em] pt-0.5">
            RESOLVING ACCESS CODE
          </div>
          <div className="text-lg font-display font-black tracking-[4px] text-[#3F3F44] break-all select-none">
            {displayText || 'RESOLVING'}
          </div>
        </div>
      )}
    </div>
  )
}

export function IykykForm() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [igHandle, setIgHandle] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [discountCode, setDiscountCode] = useState<string | null>(null)
  const [revealDone, setRevealDone] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await submitIykyk({
        name,
        email,
        ig_handle: igHandle || undefined,
      })
      setDiscountCode(response.discount_code)
      setSubmitted(true)
      setName('')
      setEmail('')
      setIgHandle('')
    } catch (err) {
      const errMessage = (err as any)?.message || ''
      if (errMessage.includes('already claimed')) {
        setError(t('iykyk.error_claimed'))
      } else {
        setError(t('iykyk.error'))
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (discountCode) {
      navigator.clipboard.writeText(discountCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Resolving code animation
  if (submitted && discountCode && !revealDone) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-0.5">
          <div className="text-[9px] tracking-[0.2em] text-[#3F3F44]/40 uppercase font-mono">
            ARCHIVAL_VAULT
          </div>
          <div className="text-xs text-[#3F3F44] font-display font-bold uppercase tracking-wider">
            RESOLVING REWARD ACCESS
          </div>
        </div>
        <CodeDecryptor code={discountCode} onComplete={() => setRevealDone(true)} />
      </div>
    )
  }

  // Certificate of Authenticity reveal card
  if (revealDone && discountCode) {
    return (
      <div className="py-1.5 space-y-6 text-center animate-fade-in">
        <div className="space-y-1.5">
          <div className="text-[#3F3F44] font-display font-black tracking-[0.15em] uppercase text-xs">
            ACCESS GRANTED
          </div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#3F3F44]/75 max-w-xs mx-auto leading-relaxed">
            {t('iykyk.confirm')}
          </p>
        </div>
        
        <div className="bg-[#F5F1E8]/50 border border-[#3F3F44]/25 p-5 rounded-none relative">
          <div className="absolute top-1 left-1 font-mono text-[6px] text-[#3F3F44]/40">CERTIFICATE_OF_AUTHENTICITY</div>
          <p className="text-[#3F3F44]/40 text-[8px] uppercase tracking-[0.2em] mb-2 font-mono">
            YOUR EXCLUSIVE REWARD KEY
          </p>
          <p className="font-display font-black text-2xl text-[#3F3F44] tracking-[3px] break-all select-all">
            {discountCode}
          </p>
          <p className="text-[#3F3F44]/60 font-mono text-[8px] uppercase tracking-[0.15em] mt-3">
            50 THB off • Drop #2 Supporter Item
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full bg-[#3F3F44] border border-[#3F3F44] text-[#F5F1E8] hover:bg-[#F5F1E8] hover:text-[#3F3F44] font-mono text-[10px] uppercase tracking-[0.25em] py-3.5 transition-all cursor-pointer font-bold"
          >
            {copied ? 'COPIED_TO_CLIPBOARD' : 'COPY_ACCESS_KEY'}
          </button>
          
          <p className="font-mono text-[8px] text-[#3F3F44]/55 max-w-xs mx-auto leading-relaxed uppercase">
            {t('iykyk.check_email')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left max-w-sm mx-auto pt-1.5">
      <div className="text-center mb-5 space-y-0.5">
        <div className="text-[9px] tracking-[0.25em] text-[#3F3F44]/40 uppercase font-mono">
          SECURE_PORTAL
        </div>
        <div className="text-xs font-display font-black text-[#3F3F44] uppercase tracking-widest">
          CLAIM SUPPORTER VOUCHER
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block font-mono text-[8px] uppercase tracking-[0.15em] text-[#3F3F44]/50">
          [01] {t('iykyk.name')}
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-2.5 font-mono text-xs text-[#3F3F44]/30">[</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-6 pr-6 py-2.5 bg-white/40 border border-[#3F3F44]/20 font-mono text-xs text-[#3F3F44] placeholder-[#3F3F44]/20 focus:outline-none focus:border-[#3F3F44]/80 transition-all"
            placeholder="Your name"
          />
          <span className="absolute right-2.5 font-mono text-xs text-[#3F3F44]/30">]</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block font-mono text-[8px] uppercase tracking-[0.15em] text-[#3F3F44]/50">
          [02] {t('iykyk.email')}
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-2.5 font-mono text-xs text-[#3F3F44]/30">[</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-6 pr-6 py-2.5 bg-white/40 border border-[#3F3F44]/20 font-mono text-xs text-[#3F3F44] placeholder-[#3F3F44]/20 focus:outline-none focus:border-[#3F3F44]/80 transition-all"
            placeholder="your@email.com"
          />
          <span className="absolute right-2.5 font-mono text-xs text-[#3F3F44]/30">]</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block font-mono text-[8px] uppercase tracking-[0.15em] text-[#3F3F44]/50">
          [03] {t('iykyk.ig')}
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-2.5 font-mono text-xs text-[#3F3F44]/30">[</span>
          <input
            type="text"
            value={igHandle}
            onChange={(e) => setIgHandle(e.target.value)}
            className="w-full pl-6 pr-6 py-2.5 bg-white/40 border border-[#3F3F44]/20 font-mono text-xs text-[#3F3F44] placeholder-[#3F3F44]/20 focus:outline-none focus:border-[#3F3F44]/80 transition-all"
            placeholder="@instagram"
          />
          <span className="absolute right-2.5 font-mono text-xs text-[#3F3F44]/30">]</span>
        </div>
      </div>

      {error && (
        <p className="font-mono text-[8px] text-red-600 uppercase tracking-wider text-center pt-1 animate-pulse">
          &gt; EXCEPTION: {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-transparent border border-[#3F3F44]/30 hover:border-[#3F3F44] text-[#3F3F44] hover:bg-[#3F3F44] hover:text-[#F5F1E8] font-mono text-xs uppercase tracking-[0.25em] py-3.5 transition-all duration-200 cursor-pointer text-center font-bold focus:outline-none disabled:border-[#3F3F44]/10 disabled:text-[#3F3F44]/20 disabled:bg-transparent disabled:cursor-not-allowed"
      >
        {loading ? 'CALCULATING...' : `[ ${t('iykyk.submit').toUpperCase()} ]`}
      </button>
    </form>
  )
}
