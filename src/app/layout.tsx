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
  title: "Au Coeur Des Anges — Crèche & Maternelle",
  description:
    "Au Coeur Des Anges — Une crèche et école maternelle chaleureuse, bienveillante et stimulante.",
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
