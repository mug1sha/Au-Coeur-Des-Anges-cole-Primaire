import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/lib/animations";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const links = [
  { label: "Accueil", href: "/" },
  { label: "Nos Services", href: "/services" },
  { label: "À Propos", href: "/about" },
  { label: "Galerie", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="mt-8 bg-[#463ACB] text-white">
      <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-8">
        <StaggerContainer className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_0.8fr]">

          {/* BRAND */}
          <StaggerItem>
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 rounded-full bg-white">
                <Image src="/images/logo.png" alt="Au Coeur Des Anges" fill className="rounded-full object-contain p-1" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold">Au Coeur Des Anges</h3>
                <p className="text-sm text-white/65">Crèche & Maternelle</p>
              </div>
            </div>
            <p className="mt-5 max-w-[280px] text-sm leading-6 text-white/60">
              Grandir avec amour, apprendre avec joie. Un environnement chaleureux pour accompagner chaque enfant dans ses premiers pas.
            </p>
          </StaggerItem>

          {/* LINKS */}
          <StaggerItem>
            <h3 className="font-[family-name:var(--font-heading)] font-bold">Navigation</h3>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 transition hover:text-[#FF6B35]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* CONTACT */}
          <StaggerItem>
            <h3 className="font-[family-name:var(--font-heading)] font-bold">Contact</h3>
            <div className="mt-5 space-y-4 text-sm text-white/60">
              <div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[#FF6B35]" size={17} /><span>Adresse de l&apos;école, Kigali, Rwanda</span></div>
              <div className="flex gap-3"><Phone className="shrink-0 text-[#FF6B35]" size={17} /><span>+250 XXX XXX XXX</span></div>
              <div className="flex gap-3"><Mail className="shrink-0 text-[#FF6B35]" size={17} /><span>contact@example.com</span></div>
              <div className="flex gap-3"><Clock className="shrink-0 text-[#FF6B35]" size={17} /><span>Lun – Ven : 07:00 – 17:30</span></div>
            </div>
          </StaggerItem>

          {/* SOCIAL */}
          <StaggerItem>
            <h3 className="font-[family-name:var(--font-heading)] font-bold">Suivez-nous</h3>
            <div className="mt-5 flex gap-3">
              {[
                { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
                { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
              ].map(({ label, href, Icon }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition duration-200 hover:bg-[#FF6B35] hover:scale-110">
                  <Icon size={18} />
                </a>
              ))}
              <a href="https://wa.me/250000000000" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition duration-200 hover:bg-[#FF6B35] hover:scale-110">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </a>
            </div>
            <p className="mt-7 font-[family-name:var(--font-heading)] text-lg font-bold text-white/90">
              Ensemble pour<br />leur avenir.
            </p>
          </StaggerItem>
        </StaggerContainer>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-white/45">© {new Date().getFullYear()} Au Coeur Des Anges. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
