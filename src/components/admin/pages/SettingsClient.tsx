"use client";

import { useEffect, useState } from "react";
import { Save, Settings, Calendar, Clock, Globe, Bell, Shield } from "lucide-react";
import { getSchoolSettings, updateSchoolSettings } from "@/lib/admin-data";
import type { SchoolSettings } from "@/lib/admin-types";
import {
  Card, CardHeader, CardBody, Button, Input, Select, Skeleton, useToast, Toggle,
} from "@/components/admin/ui";

const CURRENCIES = [
  { value: "RWF", label: "RWF — Franc rwandais" },
  { value: "USD", label: "USD — Dollar américain" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "XAF", label: "XAF — Franc CFA" },
];

export default function SettingsClient() {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    newPayment: true,
    newAnnouncement: false,
    systemAlert: true,
  });
  const { show, ToastComponent } = useToast();

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
      show("Paramètres enregistrés.", "success");
    } catch {
      show("Erreur lors de la sauvegarde.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-[20px]" />)}
      </div>
    );
  }

  if (!settings) return null;

  return (
    <>
      {ToastComponent}
      <div className="space-y-5 max-w-4xl">

        {/* School identity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-[#FF6B35]" />
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">Informations de l&apos;école</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="st-name" label="Nom de l'école"
                value={settings.schoolName} onChange={(e) => setField("schoolName", e.target.value)} />
              <Input id="st-sub" label="Sous-titre"
                value={settings.subtitle} onChange={(e) => setField("subtitle", e.target.value)} />
            </div>
            <Input id="st-tag" label="Accroche (tagline)"
              value={settings.tagline} onChange={(e) => setField("tagline", e.target.value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="st-email" label="Email" type="email"
                value={settings.email} onChange={(e) => setField("email", e.target.value)} />
              <Input id="st-phone" label="Téléphone"
                value={settings.phone} onChange={(e) => setField("phone", e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input id="st-addr" label="Adresse"
                value={settings.address} onChange={(e) => setField("address", e.target.value)} />
              <Input id="st-city" label="Ville"
                value={settings.city} onChange={(e) => setField("city", e.target.value)} />
              <Input id="st-country" label="Pays"
                value={settings.country} onChange={(e) => setField("country", e.target.value)} />
            </div>
          </CardBody>
        </Card>

        {/* Academic year */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[#FF6B35]" />
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">Année scolaire</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="st-ystart" label="Début de l'année" type="date"
                value={settings.academicYearStart} onChange={(e) => setField("academicYearStart", e.target.value)} />
              <Input id="st-yend" label="Fin de l'année" type="date"
                value={settings.academicYearEnd} onChange={(e) => setField("academicYearEnd", e.target.value)} />
            </div>
            <Select id="st-currency" label="Devise"
              value={settings.currency}
              onChange={(e) => setField("currency", e.target.value)}
              options={CURRENCIES}
            />
          </CardBody>
        </Card>

        {/* Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#FF6B35]" />
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">Horaires d&apos;ouverture</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="st-open" label="Ouverture" type="time"
                value={settings.openingTime} onChange={(e) => setField("openingTime", e.target.value)} />
              <Input id="st-close" label="Fermeture" type="time"
                value={settings.closingTime} onChange={(e) => setField("closingTime", e.target.value)} />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-[#463ACB]">Jours d&apos;ouverture</p>
              <div className="flex flex-wrap gap-2">
                {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
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

        {/* Social & contact */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-[#FF6B35]" />
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">Réseaux & communication</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="st-wa" label="WhatsApp"
                placeholder="+250 000 000 000"
                value={settings.whatsappNumber ?? ""} onChange={(e) => setField("whatsappNumber", e.target.value)} />
              <Input id="st-ig" label="Instagram (URL)"
                placeholder="https://instagram.com/…"
                value={settings.instagramUrl ?? ""} onChange={(e) => setField("instagramUrl", e.target.value)} />
            </div>
            <Input id="st-fb" label="Facebook (URL)"
              placeholder="https://facebook.com/…"
              value={settings.facebookUrl ?? ""} onChange={(e) => setField("facebookUrl", e.target.value)} />
          </CardBody>
        </Card>

        {/* Notifications preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-[#FF6B35]" />
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">Notifications administrateur</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <Toggle
              checked={notifications.newPayment}
              onChange={(v) => setNotifications((n) => ({ ...n, newPayment: v }))}
              label="Notifier lors de chaque nouveau paiement"
            />
            <Toggle
              checked={notifications.newAnnouncement}
              onChange={(v) => setNotifications((n) => ({ ...n, newAnnouncement: v }))}
              label="Rappel avant publication d'annonce"
            />
            <Toggle
              checked={notifications.systemAlert}
              onChange={(v) => setNotifications((n) => ({ ...n, systemAlert: v }))}
              label="Alertes système et sécurité"
            />
          </CardBody>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-[#FF6B35]" />
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">Sécurité</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                <div>
                  <p className="text-sm font-medium text-[#463ACB]">Changer le mot de passe administrateur</p>
                  <p className="text-xs text-slate-400">Dernière modification : il y a 30 jours</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => show("Changement de mot de passe (backend requis).", "info")}>
                  Modifier
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                <div>
                  <p className="text-sm font-medium text-[#463ACB]">Sessions actives</p>
                  <p className="text-xs text-slate-400">1 session active en ce moment</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => show("Révocation des sessions (backend requis).", "info")}>
                  Révoquer tout
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Save */}
        <div className="flex justify-end">
          <Button icon={Save} loading={saving} onClick={handleSave} size="lg">
            Enregistrer les paramètres
          </Button>
        </div>
      </div>
    </>
  );
}
