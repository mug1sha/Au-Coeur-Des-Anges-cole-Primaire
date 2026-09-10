import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aucoeurddesanges.rw"),
  title: {
    default: "Au Coeur Des Anges — Crèche & Maternelle",
    template: "%s | Au Coeur Des Anges",
  },
  description:
    "Au Coeur Des Anges — Une crèche et école maternelle chaleureuse, bienveillante et stimulante à Kigali, Rwanda.",
  openGraph: {
    type: "website",
    siteName: "Au Coeur Des Anges",
    title: "Au Coeur Des Anges — Crèche & Maternelle",
    description:
      "Une crèche et école maternelle chaleureuse, bienveillante et stimulante à Kigali, Rwanda.",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: "Au Coeur Des Anges" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Au Coeur Des Anges — Crèche & Maternelle",
    description:
      "Une crèche et école maternelle chaleureuse, bienveillante et stimulante à Kigali, Rwanda.",
    images: ["/images/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${nunito.variable} font-[family-name:var(--font-body)]`}>
        {children}
      </body>
    </html>
  );
}
