const footerNavLinks = [
  { label: "Home", href: "/" },
  { label: "Service", href: "/service" },
  { label: "About Us", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

const ressources = [
  "Calendrier scolaire",
  "Bibliothèque",
  "Cantine & Repas",
  "Garderie",
  "Vie associative",
];

export default function Footer() {
  return (
    <footer className="relative bg-navy pt-16 pb-8 overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-8 lg:h-12"
        >
          <path
            d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30 L1440,0 L0,0 Z"
            fill="#0783BD"
            opacity="0.12"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg width="36" height="36" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <circle cx="22" cy="22" r="20" fill="white" opacity="0.1" />
                <path d="M14 28 L22 12 L30 28 Z" fill="#FF7800" opacity="0.9" />
                <circle cx="22" cy="22" r="6" fill="#0783BD" />
              </svg>
              <div>
                <div className="font-heading font-bold text-white text-base">
                  Au Coeur Des Anges
                </div>
                <div className="font-heading text-[10px] text-white/40 tracking-[0.2em] uppercase">
                  École Primaire
                </div>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed mt-3">
              Former les citoyens de demain avec bienveillance, excellence et
              innovation depuis 2011. Un lieu d&apos;éducation et d&apos;épanouissement pour les enfants de 3 à 11 ans.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigation footer">
            <h4 className="font-heading font-semibold text-white text-sm mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/40 hover:text-orange transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Ressources */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4">
              Ressources
            </h4>
            <ul className="space-y-2.5">
              {ressources.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-orange transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-2"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4">
              Contact
            </h4>
            <div className="space-y-2.5 text-sm text-white/40">
              <p>27, Rue des Lilas</p>
              <p>75015 Paris, France</p>
              <p className="mt-3">
                <a href="tel:+33142501234" className="hover:text-orange transition-colors duration-200">
                  01 42 50 12 34
                </a>
              </p>
              <p>
                <a href="mailto:contact@aucoeurdesanges.fr" className="hover:text-orange transition-colors duration-200">
                  contact@aucoeurdesanges.fr
                </a>
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              {[
                { name: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { name: "Instagram", path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 3h11A3.5 3.5 0 0121 6.5v11a3.5 3.5 0 01-3.5 3.5h-11A3.5 3.5 0 013 17.5v-11A3.5 3.5 0 016.5 3z" },
                { name: "Twitter", path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:bg-orange/20 hover:text-orange transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-2"
                  aria-label={`Suivez-nous sur ${social.name}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>

            <div className="mt-5">
              <label htmlFor="footer-newsletter" className="text-xs text-white/30 font-heading font-semibold uppercase tracking-wider mb-2 block">
                Newsletter
              </label>
              <div className="flex">
                <input
                  id="footer-newsletter"
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-3 py-2 bg-white/[0.06] border border-white/10 rounded-l-lg text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-orange/40 transition-colors duration-200"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-orange text-white text-xs font-heading font-semibold rounded-r-lg hover:bg-orange-light transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] mb-6" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; 2026 Au Coeur Des Anges — École Primaire. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            {["Mentions légales", "Politique de confidentialité"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-white/30 hover:text-orange/60 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-2"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
