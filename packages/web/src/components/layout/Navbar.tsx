import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '../ui/LanguageToggle'

export function Navbar() {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: t('nav.drops'), href: '/' },
    { label: t('nav.archive'), href: '/archive' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.waitlist'), href: '/waitlist' },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-cream border-b border-charcoal">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-display font-bold text-xl uppercase text-charcoal hover:text-red transition-colors"
          >
            ABG
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-sm uppercase tracking-wide text-charcoal hover:underline transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language toggle + mobile menu button */}
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <button
              className="md:hidden text-2xl font-body text-charcoal"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '×' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-cream z-50">
            <div className="flex flex-col gap-4 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-body text-sm uppercase tracking-wide text-charcoal hover:underline"
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
      <div className="h-16" />
    </>
  )
}
