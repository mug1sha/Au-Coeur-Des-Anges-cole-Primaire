"use client";

import { useEffect, useState } from "react";
import { Globe, Save, Eye, Info, ShieldAlert } from "lucide-react";
import { getSchoolSettings, updateSchoolSettings } from "@/lib/admin-data";
import type { SchoolSettings } from "@/lib/admin-types";
import { ROLE_PERMISSIONS } from "@/lib/admin-types";
import { useAdminSession } from "@/lib/AdminSessionContext";
import {
  Card, CardHeader, CardBody, Button, Input, Textarea, Skeleton, useToast,
} from "@/components/admin/ui";
import Link from "next/link";

export default function WebsiteClient() {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { show, ToastComponent } = useToast();

  // ── Session & permission ─────────────────
  const { session } = useAdminSession();
  const canAccess = session && (
    ROLE_PERMISSIONS[session.role]?.includes("*") ||
    ROLE_PERMISSIONS[session.role]?.includes("website")
  );

  useEffect(() => {
    getSchoolSettings().then((s) => { setSettings(s); setLoading(false); });
  }, []);

  function setField<K extends keyof SchoolSettings>(key: K, value: SchoolSettings[K]) {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSchoolSettings(settings);
      show("Contenu du site mis à jour.", "success");
    } catch {
      show("Erreur lors de la sauvegarde.", "error");
    } finally {
      setSaving(false);
    }
  }

  // Permission guard — placed after all hooks to comply with Rules of Hooks
  if (!canAccess) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-[24px] border border-red-100 bg-red-50 p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert size={30} className="text-red-500" />
        </div>
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-extrabold text-red-700">
          Accès refusé
        </h2>
        <p className="max-w-sm text-sm text-red-600">
          Vous n&apos;avez pas les permissions nécessaires pour accéder au contenu du site.
          Contactez un administrateur si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-5">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-[20px]" />)}
      </div>
    );
  }

  if (!settings) return null;

  return (
    <>
      {ToastComponent}

      <div className="space-y-5">
        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <Info size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Contenu dynamique du site public</p>
            <p className="text-xs mt-0.5">
              Ces informations alimentent les pages visibles par les familles.{" "}
              <Link href="/" target="_blank" className="underline font-medium">
                Voir le site public <Eye size={11} className="inline" />
              </Link>
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* School identity */}
          <Card>
            <CardHeader>
              <div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">Identité de l&apos;école</p>
                <p className="text-xs text-slate-400">Nom, sous-titre et accroche</p>
              </div>
              <Globe size={18} className="text-[#FF6B35]" />
            </CardHeader>
            <CardBody className="space-y-4">
              <Input id="wc-name" label="Nom de l'école"
                value={settings.schoolName} onChange={(e) => setField("schoolName", e.target.value)} />
              <Input id="wc-sub" label="Sous-titre"
                value={settings.subtitle} onChange={(e) => setField("subtitle", e.target.value)} />
              <Input id="wc-tag" label="Accroche (tagline)"
                value={settings.tagline} onChange={(e) => setField("tagline", e.target.value)} />
            </CardBody>
          </Card>

          {/* Contact info */}
          <Card>
            <CardHeader>
              <div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">Informations de contact</p>
                <p className="text-xs text-slate-400">Affichées sur la page Contact</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input id="wc-email" label="Email principal" type="email"
                value={settings.email} onChange={(e) => setField("email", e.target.value)} />
              <Input id="wc-phone" label="Téléphone"
                value={settings.phone} onChange={(e) => setField("phone", e.target.value)} />
              <Input id="wc-wa" label="WhatsApp"
                value={settings.whatsappNumber ?? ""} onChange={(e) => setField("whatsappNumber", e.target.value)} />
              <Input id="wc-addr" label="Adresse"
                value={settings.address} onChange={(e) => setField("address", e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input id="wc-city" label="Ville"
                  value={settings.city} onChange={(e) => setField("city", e.target.value)} />
                <Input id="wc-country" label="Pays"
                  value={settings.country} onChange={(e) => setField("country", e.target.value)} />
              </div>
            </CardBody>
          </Card>

          {/* Social */}
          <Card>
            <CardHeader>
              <div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">Réseaux sociaux</p>
                <p className="text-xs text-slate-400">Liens visibles dans le pied de page</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input id="wc-ig" label="Instagram (URL)"
                placeholder="https://instagram.com/…"
                value={settings.instagramUrl ?? ""} onChange={(e) => setField("instagramUrl", e.target.value)} />
              <Input id="wc-fb" label="Facebook (URL)"
                placeholder="https://facebook.com/…"
                value={settings.facebookUrl ?? ""} onChange={(e) => setField("facebookUrl", e.target.value)} />
            </CardBody>
          </Card>

          {/* Horaires */}
          <Card>
            <CardHeader>
              <div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">Horaires d&apos;ouverture</p>
                <p className="text-xs text-slate-400">Affichés sur la page Contact</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input id="wc-open" label="Heure d'ouverture" type="time"
                  value={settings.openingTime} onChange={(e) => setField("openingTime", e.target.value)} />
                <Input id="wc-close" label="Heure de fermeture" type="time"
                  value={settings.closingTime} onChange={(e) => setField("closingTime", e.target.value)} />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-[#463ACB]">Jours d&apos;ouverture</p>
                <div className="flex flex-wrap gap-2">
                  {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const days = settings.openDays.includes(day)
                          ? settings.openDays.filter((d) => d !== day)
                          : [...settings.openDays, day];
                        setField("openDays", days);
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                        settings.openDays.includes(day)
                          ? "bg-[#FF6B35] text-white"
                          : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button icon={Save} loading={saving} onClick={handleSave} size="lg">
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </>
  );
}
