import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/auth-context";
import { useCart } from "../../lib/cart-context";

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
  const navigate = useNavigate();
  const { user, needsOnboarding, signOut } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!accountMenuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target || !accountMenuRef.current?.contains(target)) {
        setAccountMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountMenuOpen]);

  const goAccount = () => {
    setMobileMenuOpen(false);
    if (!user) {
      setAccountMenuOpen(false);
      navigate("/login?redirect=/profile");
      return;
    }
    if (needsOnboarding) {
      setAccountMenuOpen(false);
      navigate("/onboarding");
      return;
    }
    setAccountMenuOpen((open) => !open);
  };

  const handleSignOut = async () => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    navigate("/");
  };

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
            <div className="relative hidden md:block" ref={accountMenuRef}>
              <button
                type="button"
                className="flex cursor-pointer text-cream/85 transition-colors hover:text-cream"
                aria-label={t("nav.account")}
                aria-expanded={accountMenuOpen}
                onClick={goAccount}
              >
                <AccountIcon />
              </button>
              {user && accountMenuOpen && (
                <div className="absolute right-0 top-full mt-3 min-w-[160px] border border-white/15 bg-charcoal p-3 text-cream">
                  <p className="mb-2 truncate font-body text-[11px] tracking-[-0.04em] text-cream/60">
                    {user.email || user.name}
                  </p>
                  <Link
                    to="/profile"
                    className="mb-2 block font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-70"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    {t("nav.profile")}
                  </Link>
                  {needsOnboarding && (
                    <Link
                      to="/onboarding"
                      className="mb-2 block font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-70"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      {t("nav.finish_profile")}
                    </Link>
                  )}
                  <button
                    type="button"
                    className="cursor-pointer font-body text-[13px] lowercase tracking-[-0.04em] text-cream transition-opacity hover:opacity-70"
                    onClick={() => void handleSignOut()}
                  >
                    {t("nav.sign_out")}
                  </button>
                </div>
              )}
            </div>
            <Link
              to="/cart"
              className="relative hidden cursor-pointer text-cream/85 transition-colors hover:text-cream md:flex"
              aria-label={t("nav.cart")}
            >
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-red px-1 font-body text-[10px] leading-none text-cream">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

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
            <div className="flex flex-col gap-4 border-t border-white/15 px-5 py-5">
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2.5 font-body text-[14px] lowercase tracking-[-0.07em] text-cream transition-opacity hover:opacity-70"
                aria-label={t("nav.account")}
                onClick={goAccount}
              >
                <AccountIcon />
                <span>{user ? t("nav.account") : t("nav.sign_in")}</span>
              </button>
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="self-start font-body text-[14px] lowercase tracking-[-0.07em] text-cream/70 transition-opacity hover:opacity-70"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.profile")}
                  </Link>
                  <button
                    type="button"
                    className="cursor-pointer self-start font-body text-[14px] lowercase tracking-[-0.07em] text-cream/70 transition-opacity hover:opacity-70"
                    onClick={() => void handleSignOut()}
                  >
                    {t("nav.sign_out")}
                  </button>
                </>
              )}
              <Link
                to="/cart"
                className="relative flex cursor-pointer items-center gap-2.5 font-body text-[14px] lowercase tracking-[-0.07em] text-cream transition-opacity hover:opacity-70"
                aria-label={t("nav.cart")}
                onClick={() => setMobileMenuOpen(false)}
              >
                <CartIcon />
                <span>{t("nav.cart")}</span>
                {itemCount > 0 && (
                  <span className="bg-red px-1.5 py-0.5 font-body text-[10px] leading-none text-cream">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}

      {!overlay && <div className="h-16 md:h-20" />}
    </>
  );
}
