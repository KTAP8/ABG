import { Navbar } from '../components/layout/Navbar'
import { RewardReveal } from '../components/iykyk/RewardReveal'

export default function Iykyk() {
  return (
    <div className="relative h-svh w-full overflow-hidden bg-cream text-charcoal">
      <Navbar overlay />

      <img
        src="/images/iykyk/iykyk_background.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <main className="relative z-10 flex h-svh items-center justify-center px-4 pt-14 pb-4 md:px-8 md:pt-16 md:pb-6">
        <div className="w-full max-w-[720px]">
          <RewardReveal />
        </div>
      </main>
    </div>
  )
}
