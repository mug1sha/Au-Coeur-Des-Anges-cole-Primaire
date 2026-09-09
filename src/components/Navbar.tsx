"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, CalendarDays, ArrowRight } from "lucide-react";

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Nos Services", href: "/services" },
  { label: "À Propos", href: "/about" },
  { label: "Galerie", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="relative z-50 w-full">

      {/* TOP BAR */}
      <div className="hidden md:block bg-[#012dcc] text-white">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-2">

          <div className="flex items-center gap-6 text-xs">
            <a
              href="tel:+250000000000"
              className="flex items-center gap-2 opacity-90 transition hover:text-[#FF6B35]"
            >
              <Phone size={13} />
              +250 XXX XXX XXX
            </a>

            <a
              href="mailto:contact@example.com"
              className="flex items-center gap-2 opacity-90 transition hover:text-[#FF6B35]"
            >
              <Mail size={13} />
              contact@example.com
            </a>
          </div>

          <a
            href="/contact"
            className="flex items-center gap-2 rounded-full border border-[#FF6B35] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#FF6B35]"
          >
            <CalendarDays size={13} />
            Planifier une visite
          </a>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-[82px] max-w-[1320px] items-center justify-between px-5 md:px-6">

          {/* LOGO */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="relative h-[65px] w-[65px] sm:h-[72px] sm:w-[72px]">
              <Image
                src="/images/logo.png"
                alt="Au Coeur Des Anges"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div className="hidden sm:block leading-tight">
              <div className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#0B1B3D]">
                Au Coeur Des Anges
              </div>
              <div className="text-sm font-medium text-[#0B1B3D]/75">
                Crèche & Maternelle
              </div>
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
                    active
                      ? "text-[#FF6B35]"
                      : "text-[#0B1B3D] hover:text-[#FF6B35]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#FF6B35] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
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
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="border-t border-white/10 bg-[#012dcc] px-5 pb-6 pt-4 lg:hidden">
            <div className="mx-auto flex max-w-[1320px] flex-col gap-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                      active
                        ? "bg-white/15 text-[#FF6B35]"
                        : "text-white hover:bg-white/10 hover:text-[#FF6B35]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 rounded-[14px] bg-[#FF6B35] px-5 py-3.5 text-sm font-bold text-white"
              >
                Inscrire mon enfant
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
