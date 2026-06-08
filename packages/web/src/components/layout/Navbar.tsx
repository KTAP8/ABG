import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '../ui/LanguageToggle'

export function Navbar() {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Products', href: '/products' },
    { label: t('nav.archive'), href: '/archive' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.waitlist'), href: '/waitlist' },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-cream bg-opacity-100 border-b border-charcoal" style={{ backgroundColor: '#F5F1E8' }}>
        <div className="flex h-14 items-center justify-between">
          
          {/* Logo / Left Cell */}
          <div className="flex items-center h-full px-4 border-r border-charcoal md:w-48 lg:w-64">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src="/logos/ABG_logo_grey.png"
                alt="ABG"
                className="h-8 w-auto"
              />
              <span className="font-mono text-[9px] font-normal tracking-wider opacity-60 border border-charcoal px-1 py-0.5 bg-charcoal/5 hidden sm:inline">
                SYS_v1.0
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links / Center Cell */}
          <div className="hidden md:flex flex-1 items-center h-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-xs uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-cream h-full flex items-center px-6 border-r border-charcoal transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* System Status / Coordinate Metadata */}
          <div className="hidden lg:flex items-center h-full px-6 border-r border-charcoal font-mono text-[9px] tracking-wider text-charcoal opacity-70">
            [LOC: 13.7367° N, 100.5231° E]
          </div>

          {/* Controls / Right Cell */}
          <div className="flex items-center h-full px-4 gap-4">
            <LanguageToggle />
            <button
              className="md:hidden text-xs font-mono text-charcoal cursor-pointer border border-charcoal px-2 py-1 hover:bg-charcoal hover:text-cream transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? 'CLOSE' : 'MENU'}
            </button>
          </div>

        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-14 bg-cream z-50 border-t border-charcoal">
            <div className="flex flex-col border-b border-charcoal">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-body text-sm uppercase tracking-widest text-charcoal p-4 border-b border-charcoal last:border-b-0 hover:bg-charcoal hover:text-cream transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="p-4 font-mono text-[9px] tracking-wider text-charcoal/60 bg-charcoal/5">
                LOC: SAMYAN // SYSTEM_STATE: ACTIVE
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-14" />
    </>
  )
}
