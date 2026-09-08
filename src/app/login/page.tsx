import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/login/LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous à votre espace personnel de l'École Primaire Au Coeur Des Anges.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main>
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}
