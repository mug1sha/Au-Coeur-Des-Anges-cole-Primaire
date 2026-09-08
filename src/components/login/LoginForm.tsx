"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { login, storeAuthData, type AuthResponse } from "@/lib/auth";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Veuillez entrer votre adresse e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide.";
    }

    if (!formData.password) {
      newErrors.password = "Veuillez entrer votre mot de passe.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setFeedback("");

    try {
      const response: AuthResponse = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (response.success && response.user && response.token) {
        storeAuthData(response.user, response.token, formData.rememberMe);
        setStatus("success");
        setFeedback("Connexion réussie. Redirection...");
        // TODO: Redirect to dashboard or return URL
      } else {
        setStatus("error");
        setFeedback(response.error || "Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setFeedback("Erreur de connexion. Veuillez réessayer.");
    }
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy" aria-hidden="true">
        {/* Decorative blobs */}
        <svg
          className="absolute -top-32 -right-32 w-[600px] h-[600px] opacity-[0.03]"
          viewBox="0 0 200 200"
        >
          <path
            d="M45.3,-73.4C58.4,-66.1,68.9,-53.3,75.8,-39.1C82.7,-24.9,86,-9.3,83.7,5.8C81.4,20.9,73.5,35.5,63.4,47.2C53.3,58.9,41,67.7,27.2,73.3C13.4,78.9,-1.9,81.3,-16.8,78.5C-31.7,75.7,-46.2,67.7,-57.7,56.1C-69.2,44.5,-77.7,29.3,-80.3,13.3C-82.9,-2.7,-79.6,-19.4,-71.8,-33.2C-64,-47,-51.7,-57.9,-38.2,-65.1C-24.7,-72.3,-10,-75.8,3.4,-80.3C16.8,-84.8,32.2,-80.7,45.3,-73.4Z"
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] opacity-[0.02]"
          viewBox="0 0 200 200"
        >
          <path
            d="M44.4,-65.2C57.6,-58.8,68.8,-47.6,75.2,-34.2C81.6,-20.8,83.2,-5.2,79.2,8.8C75.2,22.8,65.6,36.2,54.4,46.4C43.2,56.6,30.4,63.6,16.4,68.8C2.4,74,-12.8,77.4,-27.2,74.2C-41.6,71,-55.2,61.2,-64,48C-72.8,34.8,-76.8,18.2,-76.4,1.8C-76,-14.6,-71.2,-30.8,-62,-43.2C-52.8,-55.6,-39.2,-64.2,-25.2,-70C-11.2,-75.8,3.2,-78.8,17.2,-76.8C31.2,-74.8,31.2,-71.6,44.4,-65.2Z"
            fill="#0783BD"
            transform="translate(100 100)"
          />
        </svg>
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Login card */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {/* Logo / branding */}
          <div className="text-center mb-8">
            <Image
              src="/logo.jpg"
              alt="Au Coeur Des Anges"
              width={112}
              height={112}
              priority
              className="w-24 h-24 lg:w-28 lg:h-28 rounded-full object-contain mx-auto mb-4"
            />
            <h1 className="font-heading text-2xl font-bold text-navy">
              Au Coeur Des Anges
            </h1>
            <p className="text-sm text-navy/45 mt-1">École Primaire</p>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="font-heading text-xl font-bold text-navy">
              Connexion
            </h2>
            <p className="text-sm text-navy/50 mt-1">
              Accédez à votre espace personnel
            </p>
          </div>

          {/* Feedback messages */}
          {status === "success" && (
            <div className="mb-6 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2.5">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700 font-medium">{feedback}</p>
            </div>
          )}
          {status === "error" && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-700 font-medium">{feedback}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-heading font-semibold text-navy mb-1.5">
                Adresse e-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-navy/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="votre@email.com"
                  autoComplete="email"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-offwhite border text-navy placeholder-navy/30 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue ${
                    errors.email ? "border-red-400" : "border-lightgray"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-heading font-semibold text-navy mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-navy/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl bg-offwhite border text-navy placeholder-navy/30 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue ${
                    errors.password ? "border-red-400" : "border-lightgray"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-navy/40 hover:text-navy/60 transition-colors duration-200"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleChange("rememberMe", e.target.checked)}
                  className="w-4 h-4 rounded border-lightgray text-blue focus:ring-blue/30 cursor-pointer"
                />
                <span className="text-sm text-navy/55 group-hover:text-navy/70 transition-colors">
                  Se souvenir de moi
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-blue hover:text-blue-light font-medium transition-colors duration-200"
                onClick={() => {
                  // TODO: Implement password reset flow
                  alert("Fonctionnalité à venir. Contactez l'administration.");
                }}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="group w-full flex items-center justify-center gap-2.5 px-8 py-3.5 bg-navy text-white font-heading font-semibold rounded-full text-base hover:bg-navy-light transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {status === "loading" ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 2a10 10 0 019.75 7.75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-lightgray text-center">
            <p className="text-sm text-navy/45">
              Vous n&apos;avez pas encore de compte ?{" "}
              <span className="text-navy/60 font-medium">
                Contactez l&apos;administration.
              </span>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour à l&apos;accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
