import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface NavbarProps {
  bgClass?: string;
  /** When true, skip the layout spacer so content can sit under the fixed nav */
  overlay?: boolean;
}

function AccountIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19.5c1.5-3.2 3.8-4.8 6.5-4.8s5 1.6 6.5 4.8" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 6h2.2l1.4 10.2a1.5 1.5 0 0 0 1.5 1.3h7.8a1.5 1.5 0 0 0 1.5-1.3L19.5 9H7" />
      <circle cx="10" cy="20" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="20" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Navbar({ bgClass, overlay = false }: NavbarProps) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t("nav.products"), href: "/products" },
    { label: t("nav.archive"), href: "/archive" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.waitlist"), href: "/waitlist" },
  ];

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Desktop + closed mobile top bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 ${mobileMenuOpen ? "md:block hidden" : ""} ${bgClass ?? ""}`}
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #3F3F44 0%, rgba(63, 63, 68, 0.72) 45%, transparent 100%)",
        }}
      >
        <div className="relative flex h-16 items-start justify-between px-5 pt-3 md:h-20 md:px-10 md:pt-3.5">
          <Link
            to="/"
            className="relative z-10 flex items-center transition-opacity hover:opacity-80"
          >
            <img
              src="/logos/abg_logo_cream.svg"
              alt="ABG"
              className="h-7 w-auto md:h-8"
            />
          </Link>

          <div className="pointer-events-none absolute inset-0 hidden items-start justify-center pt-3.5 md:flex md:pt-4">
            <div className="pointer-events-auto flex items-center gap-8 lg:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-body text-[14px] lowercase tracking-[-0.07em] text-cream/85 transition-colors hover:text-cream"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 md:gap-5">
            <button
              type="button"
              className="hidden cursor-pointer text-cream/85 transition-colors hover:text-cream md:flex"
              aria-label={t("nav.account")}
              onClick={() => {}}
            >
              <AccountIcon />
            </button>
            <button
              type="button"
              className="hidden cursor-pointer text-cream/85 transition-colors hover:text-cream md:flex"
              aria-label={t("nav.cart")}
              onClick={() => {}}
            >
              <CartIcon />
            </button>

            <button
              type="button"
              className="cursor-pointer font-body text-[14px] lowercase tracking-[-0.07em] text-cream/85 transition-colors hover:text-cream md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              {t("nav.menu")}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-black/20"
            aria-label={t("nav.close")}
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative bg-charcoal text-cream">
            {/* Header: logo + close */}
            <div className="flex items-center justify-between border-b border-white/15 px-5 py-3.5">
              <Link
                to="/"
                className="flex items-center transition-opacity hover:opacity-80"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img
                  src="/logos/abg_logo_cream.svg"
                  alt="ABG"
                  className="h-7 w-auto"
                />
              </Link>
              <button
                type="button"
                className="cursor-pointer font-body text-[14px] lowercase tracking-[-0.07em] text-cream transition-opacity hover:opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.close")}
              </button>
            </div>

            {/* Primary links */}
            <div className="flex flex-col gap-5 px-5 py-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-body text-[28px] font-bold lowercase leading-none tracking-[-0.06em] text-cream transition-opacity hover:opacity-70"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Account + cart */}
            <div className="flex items-center gap-8 border-t border-white/15 px-5 py-5">
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2.5 font-body text-[14px] lowercase tracking-[-0.07em] text-cream transition-opacity hover:opacity-70"
                aria-label={t("nav.account")}
                onClick={() => {}}
              >
                <AccountIcon />
                <span>{t("nav.account")}</span>
              </button>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2.5 font-body text-[14px] lowercase tracking-[-0.07em] text-cream transition-opacity hover:opacity-70"
                aria-label={t("nav.cart")}
                onClick={() => {}}
              >
                <CartIcon />
                <span>{t("nav.cart")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!overlay && <div className="h-16 md:h-20" />}
    </>
  );
}
