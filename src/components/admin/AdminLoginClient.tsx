"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { adminLogin, isAdminAuthenticated } from "@/lib/admin-auth";
import { Button, Input } from "@/components/admin/ui";

export default function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Veuillez saisir votre email."); return; }
    if (!password) { setError("Veuillez saisir votre mot de passe."); return; }

    setLoading(true);
    try {
      const result = await adminLogin(email, password, remember);
      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.error ?? "Une erreur est survenue.");
      }
    } catch {
      setError("Impossible de se connecter. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-[#0B1B3D] px-12 py-16">
        <div className="max-w-sm text-center">
          <div className="relative mx-auto mb-8 h-24 w-24 overflow-hidden rounded-2xl shadow-xl">
            <Image src="/images/logo.png" alt="Au Coeur Des Anges" fill className="object-cover" />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-white">
            Au Coeur Des Anges
          </h1>
          <p className="mt-2 text-lg text-white/60">Crèche & Maternelle</p>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <p className="text-sm font-semibold text-white/80">Accès Administration</p>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              Gérez les services, enseignants, finances et le contenu de votre école depuis un seul tableau de bord sécurisé.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-xl shadow">
              <Image src="/images/logo.png" alt="Au Coeur Des Anges" fill className="object-cover" />
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#0B1B3D]">
              Au Coeur Des Anges
            </h1>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#0B1B3D]">
              Connexion administrateur
            </h2>
            <p className="mt-1 text-sm text-slate-400">Entrez vos identifiants pour accéder au tableau de bord.</p>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <Input
                id="email"
                label="Adresse email"
                type="email"
                placeholder="admin@aucoeurddesanges.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                required
              />

              <div className="relative w-full">
                <Input
                  id="password"
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-[#FF6B35]"
                />
                Se souvenir de moi
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={LogIn}
                className="mt-2 w-full justify-center"
              >
                {loading ? "Connexion…" : "Se connecter"}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Accès réservé au personnel autorisé de l&apos;école.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
