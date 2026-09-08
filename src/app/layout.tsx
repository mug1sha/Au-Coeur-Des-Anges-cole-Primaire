import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#023250",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aucoeurdesanges.edu"),
  title: {
    default: "Au Coeur Des Anges — École Primaire",
    template: "%s | Au Coeur Des Anges",
  },
  description:
    "Au Coeur Des Anges offre une éducation bienveillante et d'excellence aux enfants de 3 à 11 ans. Découvrez notre approche pédagogique et notre engagement.",
  keywords: [
    "école primaire",
    "éducation",
    "enfants",
    "pédagogie",
    "bienveillance",
    "excellence",
    "maternelle",
    "CM2",
    "Dakar",
    "Sénégal",
  ],
  authors: [{ name: "Au Coeur Des Anges" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Au Coeur Des Anges — École Primaire",
    title: "Au Coeur Des Anges — École Primaire",
    description:
      "Un environnement sûr, bienveillant et inspirant où chaque enfant développe ses talents, sa confiance et sa créativité.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Au Coeur Des Anges — École Primaire",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Au Coeur Des Anges — École Primaire",
    description:
      "Un environnement sûr, bienveillant et inspirant où chaque enfant développe ses talents.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
