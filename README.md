# Au Coeur Des Anges — École Primaire

> Un environnement sûr, bienveillant et inspirant où chaque enfant développe ses talents, sa confiance et sa créativité.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

---

## Aperçu

Site web professionnel pour l'école primaire **Au Coeur Des Anges**, construit avec Next.js 16 et conçu pour offrir une expérience premium, moderne et accessible aux familles.

### Pages

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil — Hero, introduction, fonctionnalités, galerie, contact |
| `/service` | Services — Enseignement, accompagnement, activités sportives et créatives |
| `/about` | À propos — Histoire, mission, vision, valeurs, philosophie, équipe |
| `/gallery` | Galerie — Filtrage par catégorie, grille asymétrique, lightbox |
| `/contact` | Contact — Informations, formulaire validé, FAQ, carte |
| `/login` | Connexion — Portail d'authentification (prêt pour backend) |

---

## Fonctionnalités

### Design
- Système de design complet avec palette navy/blue/orange
- Typographie Plus Jakarta Sans (titres) + Inter (texte)
- Formes organiques SVG flottantes comme signature visuelle
- Composants responsive de 320px mobile jusqu'aux grands écrans
- Mode sombre pour le header et le login

### Navigation
- Navbar sticky avec transition transparente → solide au scroll
- Indicateur de page active animé
- Menu mobile avec tiroir animé et items accessibles
- Fermeture automatique après navigation

### Animations
- Animations d'entrée de page avec Framer Motion
- Révélations au scroll avec `useInView`
- Micro-interactions sur les boutons (effet press)
- Hover cards avec elevation et rotation d'icônes
- Zoom d'images dans la galerie
- Lightbox avec navigation clavier
- Respect de `prefers-reduced-motion`

### Accessibilité
- HTML sémantique (`<nav>`, `<main>`, `<section>`, `<footer>`)
- Labels `aria-label` sur tous les formulaires
- Navigation clavier complète
- `focus-visible` sur tous les éléments interactifs
- `aria-hidden` sur les éléments décoratifs
- `aria-current="page"` pour la navigation active

### SEO
- Métadonnées complètes pour chaque page
- Open Graph et Twitter Cards
- Viewport configuré
- Favicon et Apple Touch Icon
- `robots` désactivé pour la page login

### Formulaire de contact
- Validation côté client (email, requis, longueur minimale)
- États de chargement, succès et erreur
- Accessibilité des messages d'erreur

---

## Technologies

| Technologie | Version | Usage |
|-------------|---------|-------|
| Next.js | 16.3 | Framework React avec App Router |
| React | 19.2 | Bibliothèque UI |
| TypeScript | 5 | Typage statique |
| Tailwind CSS | 4 | Styling utility-first |
| Framer Motion | 12 | Animations déclaratives |

---

## Installation

### Prérequis

- Node.js 18+ 
- npm, yarn ou pnpm

### Développement

```bash
# Cloner le dépôt
git clone git@github.com:mug1sha/Au-Coeur-Des-Anges-cole-Primaire.git

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

### Production

```bash
# Build de production
npm run build

# Lancer le serveur de production
npm start
```

---

## Structure du projet

```
src/
├── app/
│   ├── layout.tsx          # Layout racine (metadata, fonts)
│   ├── page.tsx            # Page d'accueil
│   ├── globals.css         # Système de design global
│   ├── about/page.tsx      # Page À propos
│   ├── contact/page.tsx    # Page Contact
│   ├── gallery/page.tsx    # Page Galerie
│   ├── login/page.tsx      # Page Connexion
│   └── service/page.tsx    # Page Services
├── components/
│   ├── Navbar.tsx          # Navigation responsive
│   ├── Footer.tsx          # Pied de page
│   ├── Hero.tsx            # Hero accueil
│   ├── Introduction.tsx    # Section introduction
│   ├── Features.tsx        # Section fonctionnalités
│   ├── WhyChooseUs.tsx     # Section pourquoi nous
│   ├── Approach.tsx        # Section approche
│   ├── Gallery.tsx         # Section galerie (accueil)
│   ├── CTA.tsx             # Appel à l'action
│   ├── Contact.tsx         # Formulaire contact (accueil)
│   ├── about/              # Composants À propos
│   │   ├── AboutHero.tsx
│   │   ├── OurStory.tsx
│   │   ├── OurMission.tsx
│   │   ├── OurVision.tsx
│   │   ├── OurValues.tsx
│   │   ├── EducationalPhilosophy.tsx
│   │   ├── TeamPreview.tsx
│   │   └── AboutCTA.tsx
│   ├── contact/            # Composants Contact
│   │   ├── ContactHero.tsx
│   │   ├── ContactInfo.tsx
│   │   ├── ContactForm.tsx
│   │   ├── MapPlaceholder.tsx
│   │   ├── FAQ.tsx
│   │   └── ContactCTA.tsx
│   ├── gallery/            # Composants Galerie
│   │   ├── GalleryHero.tsx
│   │   ├── GalleryClient.tsx
│   │   ├── GalleryGrid.tsx
│   │   ├── GalleryCTA.tsx
│   │   └── CategoryFilter.tsx
│   ├── login/              # Composants Connexion
│   │   └── LoginForm.tsx
│   └── service/            # Composants Services
│       ├── ServiceHero.tsx
│       ├── ServicesGrid.tsx
│       ├── HowWeSupport.tsx
│       ├── EducationalValues.tsx
│       └── ServiceCTA.tsx
└── lib/
    └── auth.ts             # Service d'authentification (abstraction)
```

---

## Palette de couleurs

| Couleur | Code | Usage |
|---------|------|-------|
| Navy | `#023250` | Titres, texte principal, fond sombre |
| Blue | `#0783BD` | Accents, liens, icônes |
| Orange | `#FF7800` | CTA, highlights, accents chauds |
| Off-white | `#F0F3F4` | Fonds de section |
| Light Gray | `#DCE3E7` | Bordures, séparateurs |

---

## Commandes disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Lancer la production
npm run lint     # Vérification ESLint
```

---

## Contribution

Ce projet est maintenu par [mug1sha](https://github.com/mug1sha). Pour toute question ou suggestion, veuillez ouvrir une issue sur GitHub.

---

## Licence

© 2026 Au Coeur Des Anges — École Primaire. Tous droits réservés.
