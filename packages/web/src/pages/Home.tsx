import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { DropBanner } from '../components/drop/DropBanner'
import { ProductGrid } from '../components/product/ProductGrid'
import { BlueprintPlaceholder } from '../components/ui/BlueprintPlaceholder'
import { getDrops } from '../lib/api'
import type { Drop } from '../lib/api'

export default function Home() {
  const { t } = useTranslation()
  const [latestDrop, setLatestDrop] = useState<Drop | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const drops = await getDrops()
        if (drops.length > 0) {
          setLatestDrop(drops[0])
        }
      } catch (err) {
        console.error('Failed to fetch drops', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <DropBanner />

      {/* Deconstructed 3-Panel Hero */}
      <section className="h-[calc(100vh-7rem)] min-h-[500px] border-b border-charcoal grid grid-cols-1 lg:grid-cols-4">
        {/* Left Column - Systems Diagnostics */}
        <div className="hidden lg:flex flex-col justify-between h-full border-r border-charcoal p-6 font-mono text-[9px] tracking-wider text-charcoal/60 text-left">
          <div className="space-y-4">
            <div>
              <div className="text-charcoal font-bold mb-1">[SYSTEM_STATUS]</div>
              <div>SYS_INITIALIZED: YES</div>
              <div>LOC: SAMYAN.BADDIE.CORP</div>
              <div>PORT: 4000 // EXPRESS</div>
              <div>DB_CONN: NEON_PG</div>
            </div>
            <div>
              <div className="text-charcoal font-bold mb-1">[ARCHIVE_INDEX]</div>
              <div>TOTAL_RELEASES: 04</div>
              <div>ACTIVE_REGISTRY: 01</div>
              <div>WAITLIST: ONLINE</div>
            </div>
          </div>
          <div className="animate-pulse text-red font-bold">
            ● SYS_STREAM_ACTIVE
          </div>
        </div>

        {/* Center Columns (Spans 2 columns) - Brand Display */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center text-center p-8 lg:p-16 h-full relative">
          {/* Coordinates grid watermark */}
          <div className="absolute inset-0 tech-grid-bg opacity-40 pointer-events-none" />
          
          <h1 className="font-display font-black text-[10vw] lg:text-[7vw] leading-[0.9] uppercase text-charcoal tracking-tighter mb-6 select-none z-10">
            ACOUSTIC<br />
            BUT<br />
            GOATED.
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-charcoal max-w-sm z-10">
            // {t('hero.sub')}
          </p>
          <div className="absolute bottom-8 w-0.5 h-10 bg-charcoal animate-pulse hidden md:block" />
        </div>

        {/* Right Column - Product Specs */}
        <div className="hidden lg:flex flex-col justify-between h-full border-l border-charcoal p-6 font-mono text-[9px] tracking-wider text-charcoal/60 text-right">
          <div className="space-y-4">
            <div>
              <div className="text-charcoal font-bold mb-1">[UNIFORM_SPEC]</div>
              <div>FIT_PROFILE: OVERSIZED</div>
              <div>PATTERN_TYPE: EXPERIMENTAL</div>
              <div>TEXTILE_BASE: 100% COTTON</div>
              <div>GSM_WEIGHT: 380G HEAVY</div>
            </div>
            <div>
              <div className="text-charcoal font-bold mb-1">[CORE_STACK]</div>
              <div>JS_RUNTIME: NODE22</div>
              <div>DEV_ENGINE: VITE5+TS5</div>
              <div>STYLE_SET: TAILWIND4</div>
            </div>
          </div>
          <div>
            SAMYAN // THAILAND
          </div>
        </div>
      </section>

      {/* Marquee Ticker Tape */}
      <div className="border-b border-charcoal bg-charcoal overflow-hidden py-2 select-none">
        <div className="animate-marquee whitespace-nowrap flex font-mono text-[9px] uppercase tracking-widest text-cream font-bold">
          <span className="mx-6">* SYSTEM ACTIVE *</span>
          <span className="mx-6">ABG TEXTILE CORP // ACOUSTIC BUT GOATED</span>
          <span className="mx-6">* BATCH_01 RELEASE *</span>
          <span className="mx-6">NO RESTOCKS // ARCHIVED FOREVER *</span>
          <span className="mx-6">SYS_REF: SAMYAN_BADDIE_UNIFORM_v1.0</span>
          
          {/* Duplicate content to loop smoothly */}
          <span className="mx-6">* SYSTEM ACTIVE *</span>
          <span className="mx-6">ABG TEXTILE CORP // ACOUSTIC BUT GOATED</span>
          <span className="mx-6">* BATCH_01 RELEASE *</span>
          <span className="mx-6">NO RESTOCKS // ARCHIVED FOREVER *</span>
          <span className="mx-6">SYS_REF: SAMYAN_BADDIE_UNIFORM_v1.0</span>
        </div>
      </div>

      {/* Editorial Grid / Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="py-24 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-charcoal animate-pulse">
              $ loading_catalogue_data...
            </span>
          </div>
        ) : latestDrop && latestDrop.products ? (
          <>
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-charcoal pb-4">
              <h2 className="font-display font-black text-2xl md:text-3xl uppercase text-charcoal">
                {latestDrop.name}
              </h2>
              <span className="font-mono text-[10px] tracking-widest text-charcoal/50 uppercase mt-1 md:mt-0">
                [CATALOGUE_REF: {latestDrop.slug.toUpperCase()}]
              </span>
            </div>
            <ProductGrid products={latestDrop.products.slice(0, 4)} />
          </>
        ) : (
          <div className="py-24 text-center border border-dashed border-charcoal/40">
            <p className="font-mono text-sm uppercase tracking-wider text-charcoal opacity-70">
              // {t('something.coming')}
            </p>
          </div>
        )}
      </section>

      {/* Section divider rule */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="hr-tech opacity-40" />
      </div>

      {/* Brand Statement / Blueprint mock */}
      <section className="my-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <BlueprintPlaceholder 
              title="ABG_CORE_DOCUMENTATION_MOCK" 
              subtitle="TEXTILE_MANIFESTO // ASPECT_16:9" 
              aspectRatio="16/9" 
            />
          </div>
          <div className="flex flex-col justify-between h-full pt-4 lg:pt-0">
            <blockquote className="font-display font-black text-2xl md:text-3xl leading-tight text-charcoal uppercase mb-6">
              {t('hero.sub')}
            </blockquote>
            <p className="font-mono text-[10px] tracking-wider leading-relaxed text-charcoal/70 uppercase">
              // SPECS: The raw culture of Samyan campus, captured and expressed through heavy cotton fibers. Produced in limited batches.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
