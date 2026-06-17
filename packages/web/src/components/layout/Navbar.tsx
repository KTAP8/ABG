import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '../ui/LanguageToggle'

export interface NavbarProps {
  bgClass?: string;
}

export function Navbar({ bgClass = 'bg-charcoal' }: NavbarProps) {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: t('nav.products'), href: '/products' },
    { label: t('nav.archive'), href: '/archive' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.waitlist'), href: '/waitlist' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 border-b border-white/10 ${bgClass}`} style={{ backgroundColor: '#3F3F44' }}>
        <div className="flex h-14 items-center justify-between">
          
          {/* Logo / Left Cell */}
          <div className="flex items-center h-full px-4 border-r border-white/10 md:w-48 lg:w-64">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src="/logos/ABG_logo_cream.png"
                alt="ABG"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Nav Links / Center Cell */}
          <div className="hidden md:flex flex-1 items-center h-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-xs uppercase tracking-widest text-white hover:bg-black hover:text-white h-full flex items-center px-6 border-r border-white/10 transition-colors hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Controls / Right Cell */}
          <div className="flex items-center h-full px-4 gap-4">
            <LanguageToggle />
            <button
              className="md:hidden text-xs font-mono text-white cursor-pointer border border-white/20 px-2 py-1 hover:bg-black hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? 'CLOSE' : 'MENU'}
            </button>
          </div>

        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden fixed inset-0 top-14 z-50 border-t border-white/10`} style={{ backgroundColor: '#3F3F44' }}>
            <div className="flex flex-col border-b border-white/10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-body text-sm uppercase tracking-widest text-white p-4 border-b border-white/10 last:border-b-0 hover:bg-black hover:text-white transition-colors hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-14" />
    </>
  )
}
