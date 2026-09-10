"use client";

import {
  useEffect, useState, useCallback, useRef, useMemo,
} from "react";
import {
  Plus, Pencil, Archive, Eye, GraduationCap,
  Mail, Phone, Calendar, Award, Briefcase,
  Globe, EyeOff, RotateCcw, X, Camera,
  CheckCircle2, XCircle, ArchiveIcon, ExternalLink,
  LayoutGrid, List, Filter, Info, Users,
  ChevronDown, ShieldAlert,
} from "lucide-react";
import {
  getTeachers, createTeacher, updateTeacher, archiveTeacher, addAuditLog,
} from "@/lib/admin-data";
import type { Teacher, TeacherStatus } from "@/lib/admin-types";
import { ROLE_PERMISSIONS } from "@/lib/admin-types";
import { useAdminSession } from "@/lib/AdminSessionContext";
import {
  Card, CardHeader, CardBody, Button, Badge, EmptyState,
  Modal, Input, Textarea, Select, Toggle, Skeleton,
  ConfirmDialog, SearchInput, useToast, StatusDot, Table, Th, Td,
} from "@/components/admin/ui";
import Link from "next/link";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const STATUS_CONFIG: Record<TeacherStatus, {
  label: string;
  badge: "success" | "warning" | "neutral";
  icon: React.ElementType;
}> = {
  active:   { label: "Actif",    badge: "success", icon: CheckCircle2 },
  inactive: { label: "Inactif",  badge: "warning", icon: XCircle },
  archived: { label: "Archivé",  badge: "neutral", icon: ArchiveIcon },
};

const SUBJECT_OPTIONS = [
  "Crèche (3 mois – 2 ans)",
  "Maternelle (2 – 4 ans)",
  "Maternelle (4 – 6 ans)",
  "Arts plastiques & Éveil créatif",
  "Éveil Musical & Percussions",
  "Développement Moteur & Sport",
  "Langues",
  "Sciences de la Nature",
  "Direction & Administration",
  "Accompagnement des Parents",
  "Autre",
];

// Avatar color palette — deterministic from id char code
const AVATAR_PALETTE = [
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-blue-100",   text: "text-blue-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100",  text: "text-amber-700" },
  { bg: "bg-rose-100",   text: "text-rose-700" },
  { bg: "bg-cyan-100",   text: "text-cyan-700" },
  { bg: "bg-[#FF6B35]/10", text: "text-[#FF6B35]" },
  { bg: "bg-[#463ACB]/10", text: "text-[#463ACB]" },
];

function avatarStyle(id: string) {
  const idx = id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function yearsLabel(n: number) {
  if (n <= 1) return "1 an";
  return `${n} ans`;
}

function joinedLabel(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

// ─────────────────────────────────────────────
// AVATAR COMPONENT
// Renders photo if set, otherwise shows initials
// ─────────────────────────────────────────────
function TeacherAvatar({
  teacher, size = "md", className = "",
}: { teacher: Teacher; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const { bg, text } = avatarStyle(teacher.id);
  const sizeMap = { sm: "h-8 w-8 text-xs", md: "h-11 w-11 text-sm", lg: "h-16 w-16 text-xl", xl: "h-24 w-24 text-3xl" };
  const cls = `${sizeMap[size]} shrink-0 rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-heading)] ${className}`;

  if (teacher.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={teacher.avatar} alt={teacher.name} className={`${cls} object-cover`} />
    );
  }
  return (
    <div className={`${cls} ${bg} ${text}`}>
      {initials(teacher.name)}
    </div>
  );
}

// ─────────────────────────────────────────────
// TEACHER FORM
// ─────────────────────────────────────────────
interface TeacherFormState {
  name: string;
  position: string;
  subject: string;
  bio: string;
  qualificationsRaw: string; // newline-separated in UI, split to array on save
  experience: string;        // string in form, number on save
  email: string;
  phone: string;
  avatar: string;
  joinedAt: string;
  publicVisible: boolean;
  status: TeacherStatus;
}

type FormErrors = Partial<Record<keyof TeacherFormState, string>>;

const EMPTY_FORM: TeacherFormState = {
  name: "", position: "", subject: SUBJECT_OPTIONS[0],
  bio: "", qualificationsRaw: "", experience: "",
  email: "", phone: "", avatar: "",
  joinedAt: new Date().toISOString().split("T")[0],
  publicVisible: true, status: "active",
};

function validateTeacherForm(f: TeacherFormState): FormErrors {
  const errs: FormErrors = {};
  if (!f.name.trim()) errs.name = "Le nom complet est requis.";
  if (!f.position.trim()) errs.position = "Le poste est requis.";
  if (!f.email.trim()) errs.email = "L'email est requis.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = "Adresse email invalide.";
  if (f.experience && (isNaN(Number(f.experience)) || Number(f.experience) < 0)) {
    errs.experience = "Nombre d'années invalide.";
  }
  if (f.bio.length > 500) errs.bio = `Trop long (${f.bio.length}/500 caractères).`;
  return errs;
}

interface TeacherFormProps {
  value: TeacherFormState;
  errors: FormErrors;
  onChange: <K extends keyof TeacherFormState>(key: K, val: TeacherFormState[K]) => void;
  onAvatarUpload: (file: File) => void;
  avatarPreview: string;
}

function TeacherFormPanel({ value, errors, onChange, onAvatarUpload, avatarPreview }: TeacherFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5">
      {/* Photo upload */}
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarPreview} alt="Aperçu" className="h-20 w-20 rounded-full object-cover border-2 border-[#FF6B35]/30" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Camera size={24} />
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#FF6B35] text-white shadow-md transition hover:bg-[#F95738]"
            aria-label="Télécharger une photo"
          >
            <Camera size={12} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onAvatarUpload(file);
            }}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#463ACB]">Photo de profil</p>
          <p className="mt-0.5 text-xs text-slate-400">JPG, PNG ou WebP · Max 2 Mo</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-1.5 text-xs font-medium text-[#FF6B35] hover:underline"
          >
            {avatarPreview ? "Changer la photo" : "Ajouter une photo"}
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Name + position */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="t-name" label="Nom complet *"
          placeholder="Marie Uwimana"
          value={value.name} onChange={(e) => onChange("name", e.target.value)}
          error={errors.name}
        />
        <Input
          id="t-position" label="Poste / Titre *"
          placeholder="Éducatrice — Maternelle"
          value={value.position} onChange={(e) => onChange("position", e.target.value)}
          error={errors.position}
        />
      </div>

      {/* Subject */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[#463ACB]" htmlFor="t-subject">
          Classe / Matière
        </label>
        <div className="flex gap-2">
          <select
            id="t-subject"
            value={SUBJECT_OPTIONS.includes(value.subject) ? value.subject : "Autre"}
            onChange={(e) => {
              if (e.target.value !== "Autre") onChange("subject", e.target.value);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#463ACB] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
          >
            {SUBJECT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        {(!SUBJECT_OPTIONS.includes(value.subject) || value.subject === "Autre") && (
          <Input
            id="t-subject-custom" label="" className="mt-2"
            placeholder="Précisez la matière…"
            value={value.subject === "Autre" ? "" : value.subject}
            onChange={(e) => onChange("subject", e.target.value)}
          />
        )}
      </div>

      {/* Bio */}
      <Textarea
        id="t-bio"
        label={`Biographie (${value.bio.length}/500)`}
        rows={4}
        placeholder="Courte biographie affichée sur le site public…"
        value={value.bio}
        onChange={(e) => onChange("bio", e.target.value)}
        error={errors.bio}
      />

      {/* Qualifications */}
      <Textarea
        id="t-quals"
        label="Qualifications (une par ligne)"
        rows={3}
        placeholder={"Licence en Sciences de l'Éducation\nCertificat Montessori"}
        value={value.qualificationsRaw}
        onChange={(e) => onChange("qualificationsRaw", e.target.value)}
      />

      {/* Experience + joined */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="t-exp" label="Années d'expérience"
          type="number" min="0" max="60"
          placeholder="8"
          value={value.experience}
          onChange={(e) => onChange("experience", e.target.value)}
          error={errors.experience}
        />
        <Input
          id="t-joined" label="Date d'entrée"
          type="date"
          value={value.joinedAt}
          onChange={(e) => onChange("joinedAt", e.target.value)}
        />
      </div>

      {/* Contact — admin only, note */}
      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
          <Info size={12} /> Informations de contact — non visibles publiquement
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="t-email" label="Email"
            type="email" placeholder="marie@ecole.rw"
            value={value.email}
            onChange={(e) => onChange("email", e.target.value)}
            error={errors.email}
          />
          <Input
            id="t-phone" label="Téléphone"
            placeholder="+250 788 000 000"
            value={value.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>
      </div>

      {/* Status + public visibility */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          id="t-status" label="Statut"
          value={value.status}
          onChange={(e) => onChange("status", e.target.value as TeacherStatus)}
          options={[
            { value: "active",   label: "✅ Actif" },
            { value: "inactive", label: "⏸️ Inactif" },
            { value: "archived", label: "🗄️ Archivé" },
          ]}
        />
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#463ACB]">
            Visibilité publique
          </label>
          <div className="flex h-[42px] items-center">
            <Toggle
              checked={value.publicVisible}
              onChange={(v) => onChange("publicVisible", v)}
              label={value.publicVisible ? "Affiché sur le site" : "Masqué du site"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TEACHER PROFILE PREVIEW DRAWER
// ─────────────────────────────────────────────
function TeacherPreview({ teacher, onClose, onEdit }: {
  teacher: Teacher;
  onClose: () => void;
  onEdit: () => void;
}) {
  const cfg = STATUS_CONFIG[teacher.status];

  // Trap focus — close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl sm:rounded-l-[24px] sm:rounded-r-none animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <p className="text-sm font-semibold text-[#463ACB]">Profil de l&apos;enseignant(e)</p>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        {/* Profile header */}
        <div className="px-6 pt-8 pb-6 text-center border-b border-slate-100">
          <TeacherAvatar teacher={teacher} size="xl" className="mx-auto mb-4" />
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-extrabold text-[#463ACB]">
            {teacher.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-[#FF6B35]">{teacher.position}</p>
          <p className="mt-0.5 text-xs text-slate-400">{teacher.subject}</p>

          {/* Status badges */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <Badge variant={cfg.badge}>{cfg.label}</Badge>
            <Badge variant={teacher.publicVisible ? "success" : "neutral"}>
              {teacher.publicVisible ? (
                <><Globe size={10} className="mr-1 inline" />Visible publiquement</>
              ) : (
                <><EyeOff size={10} className="mr-1 inline" />Masqué du site</>
              )}
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-6 space-y-6">
          {/* Bio */}
          {teacher.bio && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Biographie</p>
              <p className="text-sm text-slate-600 leading-relaxed">{teacher.bio}</p>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {teacher.experience != null && (
              <div className="rounded-[14px] border border-slate-100 bg-slate-50 p-3 text-center">
                <p className="font-[family-name:var(--font-heading)] text-xl font-extrabold text-[#463ACB]">
                  {teacher.experience}
                </p>
                <p className="text-[10px] text-slate-400">ans d&apos;exp.</p>
              </div>
            )}
            <div className="rounded-[14px] border border-slate-100 bg-slate-50 p-3 text-center col-span-2">
              <p className="font-[family-name:var(--font-heading)] text-sm font-bold text-[#463ACB] leading-snug">
                {teacher.subject}
              </p>
              <p className="text-[10px] text-slate-400">Classe / Matière</p>
            </div>
          </div>

          {/* Qualifications */}
          {teacher.qualifications && teacher.qualifications.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Qualifications
              </p>
              <ul className="space-y-1.5">
                {teacher.qualifications.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Award size={13} className="mt-0.5 shrink-0 text-[#FF6B35]" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact — admin-only section */}
          <div className="rounded-[14px] border border-amber-100 bg-amber-50 p-4">
            <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600">
              <Info size={11} /> Contacts (admin seulement)
            </p>
            <div className="space-y-2">
              {teacher.email && (
                <a href={`mailto:${teacher.email}`} className="flex items-center gap-2 text-sm text-amber-800 hover:text-amber-900 transition">
                  <Mail size={13} className="shrink-0" />
                  {teacher.email}
                </a>
              )}
              {teacher.phone && (
                <a href={`tel:${teacher.phone}`} className="flex items-center gap-2 text-sm text-amber-800 hover:text-amber-900 transition">
                  <Phone size={13} className="shrink-0" />
                  {teacher.phone}
                </a>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
            <span className="flex items-center gap-1">
              <Calendar size={11} /> Depuis {joinedLabel(teacher.joinedAt)}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 border-t border-slate-100 bg-white px-6 py-4 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Fermer</Button>
          <Button variant="primary" className="flex-1" icon={Pencil} onClick={onEdit}>Modifier</Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TEACHER CARD (grid view)
// ─────────────────────────────────────────────
interface TeacherCardProps {
  teacher: Teacher;
  onEdit: () => void;
  onPreview: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onToggleVisibility: () => void;
}

function TeacherCard({
  teacher, onEdit, onPreview, onArchive, onRestore, onToggleVisibility,
}: TeacherCardProps) {
  const cfg = STATUS_CONFIG[teacher.status];
  const isArchived = teacher.status === "archived";

  return (
    <div className={`group flex flex-col rounded-[20px] border bg-white transition duration-200 hover:shadow-md ${
      isArchived ? "border-slate-100 opacity-60" :
      teacher.status === "inactive" ? "border-amber-100" : "border-slate-100"
    }`}>
      {/* Card top */}
      <div className="relative p-5 pb-4 text-center">
        {/* Public visibility indicator */}
        <div
          className="absolute left-4 top-4 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition"
          title={teacher.publicVisible ? "Visible sur le site" : "Masqué du site"}
        >
          {teacher.publicVisible
            ? <Globe size={10} className="text-emerald-500" />
            : <EyeOff size={10} className="text-slate-400" />
          }
        </div>

        {/* Status badge top-right */}
        <div className="absolute right-4 top-4">
          <Badge variant={cfg.badge}>{cfg.label}</Badge>
        </div>

        {/* Avatar */}
        <div className="mt-4 flex justify-center">
          <TeacherAvatar teacher={teacher} size="lg" />
        </div>

        {/* Name + position */}
        <div className="mt-3">
          <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-[#463ACB] leading-snug">
            {teacher.name}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-[#FF6B35]">{teacher.position}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{teacher.subject}</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mx-5 mb-4 grid grid-cols-2 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
        <div className="px-3 py-2 text-center">
          <p className="text-xs font-bold text-[#463ACB]">
            {teacher.experience != null ? `${teacher.experience} ans` : "—"}
          </p>
          <p className="text-[10px] text-slate-400">Expérience</p>
        </div>
        <div className="px-3 py-2 text-center">
          <p className="text-xs font-bold text-[#463ACB]">
            {teacher.qualifications?.length ?? 0}
          </p>
          <p className="text-[10px] text-slate-400">Diplôme(s)</p>
        </div>
      </div>

      {/* Bio snippet */}
      {teacher.bio && (
        <p className="line-clamp-2 px-5 text-[11px] leading-relaxed text-slate-400">{teacher.bio}</p>
      )}

      {/* Actions footer */}
      <div className="mt-auto flex items-center gap-1 border-t border-slate-100 px-4 py-2.5">
        {/* Public visibility toggle */}
        <button
          onClick={onToggleVisibility}
          disabled={isArchived}
          title={teacher.publicVisible ? "Masquer du site" : "Afficher sur le site"}
          className={`rounded-lg p-1.5 transition disabled:opacity-30 ${
            teacher.publicVisible
              ? "text-emerald-500 hover:bg-emerald-50"
              : "text-slate-400 hover:bg-slate-100"
          }`}
        >
          {teacher.publicVisible ? <Globe size={14} /> : <EyeOff size={14} />}
        </button>

        <span className="mx-1 h-4 w-px bg-slate-200" />

        <button
          onClick={onPreview}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#463ACB] transition"
          aria-label="Voir le profil"
          title="Voir le profil"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={onEdit}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#463ACB] transition"
          aria-label="Modifier"
          title="Modifier"
        >
          <Pencil size={14} />
        </button>
        {!isArchived ? (
          <button
            onClick={onArchive}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition"
            aria-label="Archiver"
            title="Archiver cet enseignant"
          >
            <Archive size={14} />
          </button>
        ) : (
          <button
            onClick={onRestore}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition"
            aria-label="Restaurer"
            title="Restaurer"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────
function TeachersSkeleton({ view }: { view: "grid" | "table" }) {
  if (view === "grid") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-[20px] border border-slate-100 bg-white p-5">
            <Skeleton className="mx-auto mb-3 h-16 w-16 rounded-full" />
            <Skeleton className="mx-auto mb-2 h-4 w-32" />
            <Skeleton className="mx-auto mb-4 h-3 w-24" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="mt-3 h-8 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <Card>
      <CardBody className="space-y-3">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
      </CardBody>
    </Card>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────
export default function TeachersClient() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TeacherStatus | "all">("all");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "public" | "hidden">("all");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState<TeacherFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);

  // Preview drawer
  const [previewTeacher, setPreviewTeacher] = useState<Teacher | null>(null);

  // Archive confirm
  const [archiveTarget, setArchiveTarget] = useState<Teacher | null>(null);
  const [archiving, setArchiving] = useState(false);

  const { show, ToastComponent } = useToast();

  // ── Session & permission ─────────────────
  // NOTE: session and canAccess are computed here so they are available
  // to audit log calls inside callbacks. The early-return guard is placed
  // right before the main JSX return below, AFTER all hooks have been
  // called, to comply with React's Rules of Hooks.
  const { session } = useAdminSession();
  const canAccess = session && (
    ROLE_PERMISSIONS[session.role]?.includes("*") ||
    ROLE_PERMISSIONS[session.role]?.includes("teachers")
  );

  // ── Load ────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getTeachers({ pageSize: 200 });
      setTeachers(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // ── Filtered list ────────────────────────
  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch = !q || [t.name, t.position, t.subject, t.bio ?? ""].some((v) =>
        v.toLowerCase().includes(q)
      );
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "public" && t.publicVisible) ||
        (visibilityFilter === "hidden" && !t.publicVisible);
      return matchSearch && matchStatus && matchVisibility;
    });
  }, [teachers, search, statusFilter, visibilityFilter]);

  // ── Counts ──────────────────────────────
  const counts = useMemo(() => ({
    all:      teachers.length,
    active:   teachers.filter((t) => t.status === "active").length,
    inactive: teachers.filter((t) => t.status === "inactive").length,
    archived: teachers.filter((t) => t.status === "archived").length,
    public:   teachers.filter((t) => t.publicVisible && t.status !== "archived").length,
  }), [teachers]);

  // ── Form helpers ─────────────────────────
  function setField<K extends keyof TeacherFormState>(key: K, val: TeacherFormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setFormErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  async function handleAvatarUpload(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      show("La photo dépasse 2 Mo.", "error");
      return;
    }

    // Show a local preview immediately for responsiveness
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "teachers");

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok || !json.url) {
        show(json.error ?? "Échec du téléchargement de la photo.", "error");
        // Revert preview
        setAvatarPreview(form.avatar);
        return;
      }

      // Update the form with the persisted server URL
      setAvatarPreview(json.url);
      setField("avatar", json.url);
      show("Photo téléchargée avec succès.", "success");
    } catch {
      show("Erreur réseau lors du téléchargement.", "error");
      setAvatarPreview(form.avatar);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setAvatarPreview("");
    setModalOpen(true);
  }

  function openEdit(t: Teacher) {
    setEditing(t);
    setForm({
      name: t.name,
      position: t.position,
      subject: t.subject,
      bio: t.bio ?? "",
      qualificationsRaw: (t.qualifications ?? []).join("\n"),
      experience: t.experience != null ? String(t.experience) : "",
      email: t.email,
      phone: t.phone ?? "",
      avatar: t.avatar ?? "",
      joinedAt: t.joinedAt.split("T")[0],
      publicVisible: t.publicVisible,
      status: t.status,
    });
    setFormErrors({});
    setAvatarPreview(t.avatar ?? "");
    setModalOpen(true);
  }

  async function handleSave() {
    const errs = validateTeacherForm(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        position: form.position.trim(),
        subject: form.subject,
        bio: form.bio.trim() || undefined,
        qualifications: form.qualificationsRaw.split("\n").map((s) => s.trim()).filter(Boolean),
        experience: form.experience ? Number(form.experience) : undefined,
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        avatar: form.avatar || undefined,
        joinedAt: new Date(form.joinedAt).toISOString(),
        publicVisible: form.publicVisible,
        status: form.status,
      };
      if (editing) {
        await updateTeacher(editing.id, payload);
        // Audit log: update
        if (session) {
          await addAuditLog({
            userId: session.userId,
            userName: session.name,
            userRole: session.role,
            action: "update",
            resource: "teacher",
            resourceId: editing.id,
            details: `Enseignant(e) mis(e) à jour : ${form.name}`,
          });
        }
        show(`${form.name} mis(e) à jour.`, "success");
      } else {
        const created = await createTeacher(payload);
        // Audit log: create
        if (session) {
          await addAuditLog({
            userId: session.userId,
            userName: session.name,
            userRole: session.role,
            action: "create",
            resource: "teacher",
            resourceId: created.id,
            details: `Nouvel(le) enseignant(e) créé(e) : ${form.name} — ${form.position}`,
          });
        }
        show(`${form.name} ajouté(e) à l'équipe.`, "success");
      }
      setModalOpen(false);
      load();
    } catch {
      show("Erreur lors de la sauvegarde.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive() {
    if (!archiveTarget) return;
    setArchiving(true);
    try {
      await archiveTeacher(archiveTarget.id);
      // Audit log: archive
      if (session) {
        await addAuditLog({
          userId: session.userId,
          userName: session.name,
          userRole: session.role,
          action: "archive",
          resource: "teacher",
          resourceId: archiveTarget.id,
          details: `Enseignant(e) archivé(e) : ${archiveTarget.name}`,
        });
      }
      show(`${archiveTarget.name} archivé(e).`, "success");
      setArchiveTarget(null);
      // Close preview if it's showing this teacher
      if (previewTeacher?.id === archiveTarget.id) setPreviewTeacher(null);
      load();
    } catch {
      show("Erreur lors de l'archivage.", "error");
    } finally {
      setArchiving(false);
    }
  }

  async function handleRestore(t: Teacher) {
    try {
      await updateTeacher(t.id, { status: "inactive" });
      show(`${t.name} restauré(e).`, "success");
      load();
    } catch {
      show("Erreur lors de la restauration.", "error");
    }
  }

  async function handleToggleVisibility(t: Teacher) {
    if (t.status === "archived") return;
    try {
      await updateTeacher(t.id, { publicVisible: !t.publicVisible });
      show(
        `${t.name} est maintenant ${!t.publicVisible ? "visible sur le site" : "masqué(e) du site"}.`,
        "success"
      );
      load();
    } catch {
      show("Erreur lors de la mise à jour.", "error");
    }
  }

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────

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
          Vous n&apos;avez pas les permissions nécessaires pour accéder à la gestion des enseignants.
          Contactez un administrateur si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
        </p>
      </div>
    );
  }

  return (
    <>
      {ToastComponent}

      {/* Preview drawer */}
      {previewTeacher && (
        <TeacherPreview
          teacher={previewTeacher}
          onClose={() => setPreviewTeacher(null)}
          onEdit={() => { openEdit(previewTeacher); setPreviewTeacher(null); }}
        />
      )}

      {/* Archive confirm */}
      <ConfirmDialog
        open={!!archiveTarget}
        title={`Archiver ${archiveTarget?.name} ?`}
        description="L'enseignant(e) sera masqué(e) du site public et archivé(e). Vous pourrez le/la restaurer ultérieurement."
        confirmLabel="Archiver"
        onConfirm={handleArchive}
        onCancel={() => setArchiveTarget(null)}
        loading={archiving}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Modifier — ${editing.name}` : "Ajouter un(e) enseignant(e)"}
        width="max-w-2xl"
      >
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          <TeacherFormPanel
            value={form}
            errors={formErrors}
            onChange={setField}
            onAvatarUpload={handleAvatarUpload}
            avatarPreview={avatarPreview}
          />
        </div>
        {form.publicVisible && form.status === "active" && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs text-blue-700">
            <Info size={12} className="shrink-0" />
            Ce profil sera <strong className="ml-1">visible sur la page Équipe</strong> du site public.
          </div>
        )}
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button variant="primary" className="flex-1" loading={saving} onClick={handleSave}>
            {editing ? "Enregistrer les modifications" : "Ajouter à l'équipe"}
          </Button>
        </div>
      </Modal>

      <div className="space-y-5">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#463ACB]">
              Équipe pédagogique
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Gérez les profils affichés sur{" "}
              <Link href="/about" target="_blank" className="inline-flex items-center gap-1 font-medium text-[#FF6B35] hover:underline">
                la page À propos <ExternalLink size={11} />
              </Link>
            </p>
          </div>
          <Button icon={Plus} onClick={openCreate}>Ajouter un enseignant</Button>
        </div>

        {/* ── SUMMARY CARDS ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {([
            ["all",      "Tous",           "text-[#463ACB]"],
            ["active",   "Actifs",         "text-emerald-700"],
            ["inactive", "Inactifs",       "text-amber-700"],
            ["archived", "Archivés",       "text-slate-400"],
          ] as const).map(([key, label, textCls]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`rounded-[16px] border p-4 text-left transition hover:shadow-sm ${
                statusFilter === key ? "border-[#FF6B35]/30 bg-[#FF6B35]/5 shadow-sm" : "border-slate-100 bg-white"
              }`}
            >
              <p className={`text-2xl font-extrabold font-[family-name:var(--font-heading)] ${textCls}`}>
                {counts[key]}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{label}</p>
              {statusFilter === key && <div className="mt-1.5 h-0.5 w-6 rounded-full bg-[#FF6B35]" />}
            </button>
          ))}
          {/* Public count — informational */}
          <div className="rounded-[16px] border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-emerald-700">
              {counts.public}
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-emerald-600">
              <Globe size={10} /> Visibles
            </div>
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-full sm:max-w-xs">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Rechercher par nom, matière…"
              />
            </div>

            {/* Advanced filters toggle */}
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                filtersOpen || visibilityFilter !== "all"
                  ? "border-[#FF6B35]/30 bg-[#FF6B35]/5 text-[#FF6B35]"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Filter size={13} />
              Filtres
              {visibilityFilter !== "all" && <span className="ml-0.5 text-[#FF6B35]">·</span>}
              <ChevronDown size={12} className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* View toggle */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden">
            {(["grid", "table"] as const).map((v) => {
              const Icon = v === "grid" ? LayoutGrid : List;
              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-label={v === "grid" ? "Vue grille" : "Vue tableau"}
                  className={`flex h-9 w-9 items-center justify-center transition ${
                    view === v ? "bg-[#FF6B35] text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={15} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced filter panel */}
        {filtersOpen && (
          <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-400">Visibilité publique</p>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs font-medium">
                {([["all", "Tous"], ["public", "Visibles"], ["hidden", "Masqués"]] as const).map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setVisibilityFilter(v)}
                    className={`px-3 py-2 transition ${
                      visibilityFilter === v ? "bg-[#FF6B35] text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS LABEL ── */}
        {(search || statusFilter !== "all" || visibilityFilter !== "all") && (
          <p className="text-xs text-slate-400">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            {search && <> pour «&nbsp;{search}&nbsp;»</>}
            {" · "}
            <button className="text-[#FF6B35] hover:underline" onClick={() => { setSearch(""); setStatusFilter("all"); setVisibilityFilter("all"); }}>
              Réinitialiser
            </button>
          </p>
        )}

        {/* ── CONTENT ── */}
        {loading ? (
          <TeachersSkeleton view={view} />
        ) : error ? (
          <Card>
            <CardBody>
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                  <GraduationCap size={22} className="text-red-400" />
                </div>
                <p className="font-bold text-[#463ACB]">Erreur de chargement</p>
                <p className="mt-1 text-sm text-slate-400">Impossible de charger les enseignants.</p>
                <Button variant="secondary" className="mt-4" onClick={load}>Réessayer</Button>
              </div>
            </CardBody>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                icon={GraduationCap}
                title={search || statusFilter !== "all" || visibilityFilter !== "all" ? "Aucun résultat" : "Aucun enseignant"}
                description={
                  search || statusFilter !== "all" || visibilityFilter !== "all"
                    ? "Essayez d'autres filtres ou termes de recherche."
                    : "Ajoutez le premier membre de l'équipe pédagogique."
                }
                action={
                  !search && statusFilter === "all" && visibilityFilter === "all"
                    ? <Button icon={Plus} onClick={openCreate}>Ajouter un enseignant</Button>
                    : <Button variant="secondary" onClick={() => { setSearch(""); setStatusFilter("all"); setVisibilityFilter("all"); }}>Réinitialiser</Button>
                }
              />
            </CardBody>
          </Card>
        ) : view === "grid" ? (
          /* ── GRID ── */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t) => (
              <TeacherCard
                key={t.id}
                teacher={t}
                onEdit={() => openEdit(t)}
                onPreview={() => setPreviewTeacher(t)}
                onArchive={() => setArchiveTarget(t)}
                onRestore={() => handleRestore(t)}
                onToggleVisibility={() => handleToggleVisibility(t)}
              />
            ))}
          </div>
        ) : (
          /* ── TABLE ── */
          <Card>
            <div className="w-full overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <Th>Enseignant(e)</Th>
                    <Th>Poste</Th>
                    <Th>Matière / Classe</Th>
                    <Th>Exp.</Th>
                    <Th>Site public</Th>
                    <Th>Statut</Th>
                    <Th>Depuis</Th>
                    <Th className="w-32">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const cfg = STATUS_CONFIG[t.status];
                    const isArchived = t.status === "archived";
                    return (
                      <tr
                        key={t.id}
                        className={`group transition hover:bg-slate-50/40 ${isArchived ? "opacity-60" : ""}`}
                      >
                        {/* Name + avatar */}
                        <Td>
                          <div className="flex items-center gap-3">
                            <TeacherAvatar teacher={t} size="sm" />
                            <div>
                              <p className="font-semibold text-[#463ACB]">{t.name}</p>
                              <p className="text-[11px] text-slate-400">{t.email}</p>
                            </div>
                          </div>
                        </Td>
                        <Td className="text-sm text-slate-600">{t.position}</Td>
                        <Td>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            <Briefcase size={10} /> {t.subject}
                          </span>
                        </Td>
                        <Td className="text-sm text-slate-500">
                          {t.experience != null ? yearsLabel(t.experience) : "—"}
                        </Td>

                        {/* Public visibility toggle — inline */}
                        <Td>
                          <button
                            onClick={() => handleToggleVisibility(t)}
                            disabled={isArchived}
                            title={t.publicVisible ? "Cliquer pour masquer" : "Cliquer pour afficher"}
                            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:opacity-40 ${
                              t.publicVisible
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {t.publicVisible ? <Globe size={10} /> : <EyeOff size={10} />}
                            {t.publicVisible ? "Visible" : "Masqué"}
                          </button>
                        </Td>

                        <Td>
                          {!isArchived ? (
                            <button
                              onClick={() => updateTeacher(t.id, { status: t.status === "active" ? "inactive" : "active" }).then(load)}
                              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                                t.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              }`}
                              title={t.status === "active" ? "Désactiver" : "Activer"}
                            >
                              <StatusDot active={t.status === "active"} />
                              {cfg.label}
                            </button>
                          ) : (
                            <Badge variant="neutral">Archivé</Badge>
                          )}
                        </Td>

                        <Td>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar size={11} />
                            {joinedLabel(t.joinedAt)}
                          </div>
                        </Td>

                        <Td>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setPreviewTeacher(t)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#463ACB] transition" aria-label="Profil" title="Voir le profil">
                              <Eye size={14} />
                            </button>
                            <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#463ACB] transition" aria-label="Modifier" title="Modifier">
                              <Pencil size={14} />
                            </button>
                            {!isArchived ? (
                              <button onClick={() => setArchiveTarget(t)} className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition" aria-label="Archiver" title="Archiver">
                                <Archive size={14} />
                              </button>
                            ) : (
                              <button onClick={() => handleRestore(t)} className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition" aria-label="Restaurer" title="Restaurer">
                                <RotateCcw size={14} />
                              </button>
                            )}
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
              {filtered.length} enseignant{filtered.length !== 1 ? "s" : ""}
            </div>
          </Card>
        )}

        {/* ── PUBLIC SITE NOTE ── */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-blue-700">
          <Info size={13} className="mt-0.5 shrink-0" />
          <p>
            Les profils <strong>Actifs</strong> avec la visibilité <strong>Site activée</strong> apparaissent sur la page publique.
            Les emails et numéros de téléphone ne sont jamais exposés aux visiteurs.{" "}
            <Link href="/about" target="_blank" className="inline-flex items-center gap-1 font-semibold underline hover:text-blue-900">
              Voir la page À propos <ExternalLink size={10} />
            </Link>
          </p>
        </div>

      </div>
    </>
  );
}
