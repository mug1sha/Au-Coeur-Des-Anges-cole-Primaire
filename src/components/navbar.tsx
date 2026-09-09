"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, CalendarDays, ArrowRight, ArrowUp } from "lucide-react";

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Nos Services", href: "/services" },
  { label: "À Propos", href: "/about" },
  { label: "Galerie", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* SCROLL PROGRESS BAR */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 z-[100] h-[3px] w-full origin-left bg-[#FF6B35]"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-50 w-full">
        {/* TOP BAR — hide on scroll */}
        <motion.div
          animate={{ height: scrolled ? 0 : "auto", opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden hidden md:block bg-[#012dcc] text-white"
        >
          <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-2">
            <div className="flex items-center gap-6 text-xs">
              <a href="tel:+250000000000" className="flex items-center gap-2 opacity-90 transition hover:text-[#FF6B35]">
                <Phone size={13} />
                +250 XXX XXX XXX
              </a>
              <a href="mailto:contact@example.com" className="flex items-center gap-2 opacity-90 transition hover:text-[#FF6B35]">
                <Mail size={13} />
                contact@example.com
              </a>
            </div>
            <a href="/contact" className="flex items-center gap-2 rounded-full border border-[#FF6B35] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#FF6B35]">
              <CalendarDays size={13} />
              Planifier une visite
            </a>
          </div>
        </motion.div>

        {/* MAIN NAVBAR */}
        <motion.nav
          animate={{
            height: scrolled ? 64 : 82,
            boxShadow: scrolled
              ? "0 2px 20px rgba(0,0,0,0.10)"
              : "0 1px 0 rgba(0,0,0,0.06)",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white/95 backdrop-blur-md border-b border-slate-100/80"
        >
          <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-5 md:px-6">
            {/* LOGO */}
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <motion.div
                animate={{ width: scrolled ? 52 : 65, height: scrolled ? 52 : 65 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative sm:w-[72px] sm:h-[72px]"
              >
                <Image src="/images/logo.png" alt="Au Coeur Des Anges" fill priority className="object-contain" />
              </motion.div>
              <div className="hidden sm:block leading-tight">
                <div className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#0B1B3D]">
                  Au Coeur Des Anges
                </div>
                <div className="text-sm font-medium text-[#0B1B3D]/75">Crèche & Maternelle</div>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden items-center gap-8 lg:flex">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative py-2 text-sm font-semibold transition ${
                      active ? "text-[#FF6B35]" : "text-[#0B1B3D] hover:text-[#FF6B35]"
                    }`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-[#FF6B35] transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </Link>
                );
              })}
              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-[14px] bg-[#FF6B35] px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#F95738] hover:shadow-lg"
              >
                Inscrire mon enfant
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* MOBILE BUTTON */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1B3D] text-white lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {open ? <X size={22} /> : <Menu size={22} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {/* MOBILE MENU */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden border-t border-white/10 bg-[#012dcc] lg:hidden"
              >
                <div className="px-5 pb-6 pt-4">
                  <div className="mx-auto flex max-w-[1320px] flex-col gap-1">
                    {navigation.map((item, i) => {
                      const active = isActive(item.href);
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.2 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            aria-current={active ? "page" : undefined}
                            className={`block rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                              active ? "bg-white/15 text-[#FF6B35]" : "text-white hover:bg-white/10 hover:text-[#FF6B35]"
                            }`}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navigation.length * 0.05, duration: 0.2 }}
                    >
                      <Link
                        href="/contact"
                        onClick={() => setOpen(false)}
                        className="mt-3 flex items-center justify-center gap-2 rounded-[14px] bg-[#FF6B35] px-5 py-3.5 text-sm font-bold text-white"
                      >
                        Inscrire mon enfant
                        <ArrowRight size={16} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </header>

      {/* BACK TO TOP */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label="Retour en haut"
            className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#0B1B3D] text-white shadow-lg transition hover:bg-[#FF6B35]"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
