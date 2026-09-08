"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Service", href: "/service" },
  { label: "About Us", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const prevPathname = useRef(pathname);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      // Focus the close button when menu opens
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setMobileOpen(false);
    }
  }, [pathname]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-[0_1px_0_rgba(2,50,80,0.06),0_4px_20px_rgba(2,50,80,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              scrolled ? "h-16" : "h-20 lg:h-24"
            }`}
          >
            {/* ── Logo ─────────────────────────────── */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0"
              aria-label="Au Coeur Des Anges — Accueil"
            >
              <div className="relative">
                <img
                  src="/logo.jpg"
                  alt="Au Coeur Des Anges"
                  className={`rounded-xl object-cover transition-all duration-500 ${
                    scrolled ? "w-9 h-9" : "w-10 h-10 lg:w-11 lg:h-11"
                  }`}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`font-heading font-bold leading-tight transition-all duration-500 truncate ${
                    scrolled
                      ? "text-sm lg:text-base text-navy"
                      : "text-base lg:text-lg text-white"
                  }`}
                >
                  Au Coeur Des Anges
                </span>
                <span
                  className={`font-heading text-[9px] lg:text-[10px] tracking-[0.18em] uppercase transition-all duration-500 ${
                    scrolled ? "text-blue" : "text-white/60"
                  }`}
                >
                  École Primaire
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ───────────────────────── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 font-heading text-sm font-medium rounded-full transition-all duration-250 ${
                      scrolled
                        ? active
                          ? "text-navy bg-navy/[0.06]"
                          : "text-navy/60 hover:text-navy hover:bg-navy/[0.04]"
                        : active
                          ? "text-white bg-white/[0.12]"
                          : "text-white/70 hover:text-white hover:bg-white/[0.08]"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full ${
                          scrolled ? "bg-orange" : "bg-white"
                        }`}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Desktop Login Button ───────────────── */}
            <div className="hidden lg:flex items-center">
              <Link
                href="/login"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-heading text-sm font-semibold transition-all duration-300 ${
                  scrolled
                    ? "bg-navy text-white hover:bg-navy-light hover:shadow-lg hover:shadow-navy/15 hover:-translate-y-0.5"
                    : "bg-white text-navy hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Login
              </Link>
            </div>

            {/* ── Mobile Hamburger ───────────────────── */}
            <button
              ref={hamburgerRef}
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden relative w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 ${
                scrolled
                  ? "text-navy hover:bg-navy/5"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-5 h-[14px] flex flex-col justify-between">
                <span
                  className={`block w-full h-[2px] rounded-full transition-all duration-300 origin-center ${
                    scrolled ? "bg-navy" : "bg-white"
                  } ${mobileOpen ? "rotate-45 translate-[6px]" : ""}`}
                />
                <span
                  className={`block w-full h-[2px] rounded-full transition-all duration-300 ${
                    scrolled ? "bg-navy" : "bg-white"
                  } ${mobileOpen ? "opacity-0 scale-x-0" : ""}`}
                />
                <span
                  className={`block w-full h-[2px] rounded-full transition-all duration-300 origin-center ${
                    scrolled ? "bg-navy" : "bg-white"
                  } ${mobileOpen ? "-rotate-45 -translate-[6px]" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ─────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu mobile"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy/95 backdrop-blur-sm"
              onClick={closeMobile}
              aria-hidden="true"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-y-0 right-0 w-full max-w-sm bg-navy-light/95 backdrop-blur-xl shadow-2xl flex flex-col"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-6 h-16">
                <span className="font-heading text-sm font-semibold text-white/50">
                  Menu
                </span>
                <button
                  ref={closeButtonRef}
                  onClick={closeMobile}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-2"
                  aria-label="Fermer le menu"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex-1 flex flex-col justify-center px-6 py-8" aria-label="Navigation mobile">
                <div className="space-y-1">
                  {navLinks.map((link, i) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMobile}
                          className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-heading text-lg font-semibold transition-all duration-200 ${
                            active
                              ? "text-white bg-white/10"
                              : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                          }`}
                          aria-current={active ? "page" : undefined}
                        >
                          {active && (
                            <span className="w-1 h-6 rounded-full bg-orange" />
                          )}
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              {/* Login action at bottom */}
              <div className="px-6 pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2.5 w-full px-6 py-4 bg-orange text-white font-heading font-semibold rounded-2xl text-base hover:bg-orange-light transition-all duration-300 hover:shadow-lg hover:shadow-orange/25"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Login
                  </Link>
                </motion.div>
              </div>

              {/* Decorative blob */}
              <div className="absolute bottom-0 left-0 w-48 h-48 opacity-[0.06] pointer-events-none" aria-hidden="true">
                <svg viewBox="0 0 200 200" className="w-full h-full" style={{ animation: "blob-float-reverse 20s ease-in-out infinite" }}>
                  <path
                    d="M44.4,-65.2C57.6,-58.8,68.8,-47.6,75.2,-34.2C81.6,-20.8,83.2,-5.2,79.2,8.8C75.2,22.8,65.6,36.2,54.4,46.4C43.2,56.6,30.4,63.6,16.4,68.8C2.4,74,-12.8,77.4,-27.2,74.2C-41.6,71,-55.2,61.2,-64,48C-72.8,34.8,-76.8,18.2,-76.4,1.8C-76,-14.6,-71.2,-30.8,-62,-43.2C-52.8,-55.6,-39.2,-64.2,-25.2,-70C-11.2,-75.8,3.2,-78.8,17.2,-76.8C31.2,-74.8,31.2,-71.6,44.4,-65.2Z"
                    fill="#FF7800"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
