import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Home, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas ou a été déplacée.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA]">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-5">
        <div className="relative h-12 w-12">
          <Image src="/images/logo.png" alt="Au Coeur Des Anges" fill className="object-contain" />
        </div>
        <span className="font-[family-name:var(--font-heading)] font-bold text-[#0B1B3D]">
          Au Coeur Des Anges
        </span>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
        {/* Decorative number */}
        <div className="relative mb-8 select-none">
          <span
            className="font-[family-name:var(--font-heading)] text-[160px] font-extrabold leading-none text-[#0B1B3D]/[0.06] sm:text-[220px]"
            aria-hidden="true"
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FF6B35]/10">
              <Search size={36} className="text-[#FF6B35]" aria-hidden="true" />
            </div>
          </div>
        </div>

        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#0B1B3D] sm:text-3xl">
          Oops, cette page est introuvable
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[#0B1B3D]/55">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
          Revenez à l&apos;accueil pour continuer.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#FF6B35] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#F95738] hover:shadow-lg"
          >
            <Home size={16} />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-[14px] border-2 border-[#0B1B3D] bg-white px-6 py-3 text-sm font-bold text-[#0B1B3D] transition hover:bg-[#0B1B3D] hover:text-white"
          >
            Nous contacter
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12">
          <p className="mb-4 text-sm font-semibold text-[#0B1B3D]/40">Pages populaires</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Nos Services", href: "/services" },
              { label: "À Propos", href: "/about" },
              { label: "Galerie", href: "/gallery" },
              { label: "Annonces", href: "/announcements" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-[#0B1B3D]/65 transition hover:border-[#FF6B35] hover:text-[#FF6B35]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 text-center text-xs text-[#0B1B3D]/35">
        © {new Date().getFullYear()} Au Coeur Des Anges. Tous droits réservés.
      </footer>
    </div>
  );
}
