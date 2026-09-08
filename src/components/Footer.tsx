import Image from "next/image";
import Container from "@/components/Container";

const footerNavLinks = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/service" },
  { label: "À propos", href: "/about" },
  { label: "Galerie", href: "/gallery" },
];

export default function Footer() {
  return (
    <footer className="relative bg-navy overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-orange via-blue to-orange" />

      <Container>
        {/* Main footer content */}
        <div className="pt-16 pb-10">
          <div className="grid lg:grid-cols-[1.2fr_1fr_1fr] gap-12 lg:gap-16">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Image
                  src="/logo.jpg"
                  alt="Au Coeur Des Anges"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-contain border-2 border-white/10"
                />
                <div>
                  <div className="font-heading font-bold text-white text-lg">
                    Au Coeur Des Anges
                  </div>
                  <div className="font-heading text-[10px] text-orange tracking-[0.2em] uppercase">
                    École Primaire
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/35 leading-relaxed max-w-xs">
                Former les citoyens de demain avec bienveillance, excellence et
                innovation depuis 2011.
              </p>

              {/* Social icons */}
              <div className="flex gap-2.5 mt-6">
                {[
                  { name: "Facebook", d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                  { name: "Instagram", d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 3h11A3.5 3.5 0 0121 6.5v11a3.5 3.5 0 01-3.5 3.5h-11A3.5 3.5 0 013 17.5v-11A3.5 3.5 0 016.5 3z" },
                  { name: "Twitter", d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="w-9 h-9 rounded-[5px] bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-orange hover:border-orange/30 transition-all duration-200"
                    aria-label={social.name}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d={social.d} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Links column */}
            <div>
              <h4 className="font-heading font-semibold text-white text-xs tracking-widest uppercase mb-5">
                Navigation
              </h4>
              <ul className="space-y-3">
                {footerNavLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/35 hover:text-orange transition-colors duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-orange transition-all duration-200 group-hover:w-3" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact column */}
            <div>
              <h4 className="font-heading font-semibold text-white text-xs tracking-widest uppercase mb-5">
                Contact
              </h4>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white/35">Kn41, 25, Nyarugenge, Kigali</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+250788123456" className="text-white/35 hover:text-orange transition-colors">
                    +250 788 123 456
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@aucoeurdesanges.rw" className="text-white/35 hover:text-orange transition-colors">
                    info@aucoeurdesanges.rw
                  </a>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-6">
                <p className="text-[10px] text-white/25 font-heading font-semibold uppercase tracking-widest mb-2.5">
                  Newsletter
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="flex-1 min-w-0 px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-l-[5px] text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-orange/40 transition-colors"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-orange text-white text-xs font-heading font-semibold rounded-r-[5px] hover:bg-orange-light transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/25">
              &copy; 2026 Au Coeur Des Anges. Tous droits réservés.
            </p>
            <div className="flex gap-5">
              {["Mentions légales", "Confidentialité"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[11px] text-white/25 hover:text-orange/60 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
