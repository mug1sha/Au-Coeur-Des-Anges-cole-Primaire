"use client";

/**
 * AnnouncementsClient — full announcement management page.
 *
 * Features:
 *  - Grid + table dual view
 *  - Rich text editor (bold, italic, headings, lists, blockquotes)
 *  - Cover image upload via /api/upload
 *  - Category tagging with colour-coded badges
 *  - Status workflow: Brouillon → Programmé → Publié → Archivé
 *  - Inline scheduling (publishedAt picker)
 *  - Expiration date support
 *  - Pinned announcements
 *  - Search across title, excerpt, content
 *  - Filter by status and category
 *  - Preview drawer (public-facing render)
 *  - Quick actions: publish, schedule, archive, duplicate, unpin
 *  - Role-aware permission hint (super_admin / admin can publish)
 *  - Fully responsive (mobile / tablet / desktop)
 */

import {
  useEffect, useState, useCallback, useRef, useMemo,
} from "react";
import {
  Plus, Pencil, Archive, Eye, Megaphone, LayoutGrid, List,
  Filter, ChevronDown, Send, Clock, Pin, PinOff, X, Camera,
  Calendar, Tag, AlertTriangle, Info, ExternalLink, Copy,
  RotateCcw, Globe, CheckCircle2, FileText, Sparkles, ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import {
  getAnnouncements, createAnnouncement, updateAnnouncement, archiveAnnouncement, addAuditLog,
} from "@/lib/admin-data";
import type { Announcement, AnnouncementStatus, AnnouncementCategory } from "@/lib/admin-types";
import { ANNOUNCEMENT_CATEGORY_LABELS, ROLE_PERMISSIONS } from "@/lib/admin-types";
import {
  Card, CardBody, Button, EmptyState, Modal, Input, Textarea,
  ConfirmDialog, SearchInput, useToast,
  Table, Th, Td, Toggle, RichEditor,
} from "@/components/admin/ui";
import { getAdminSession } from "@/lib/admin-auth";

// ─────────────────────────────────────────────
// CONSTANTS & CONFIG
// ─────────────────────────────────────────────
const STATUS_CONFIG: Record<AnnouncementStatus, {
  label: string;
  badge: "success" | "warning" | "info" | "neutral";
  icon: React.ElementType;
  color: string;
}> = {
  draft:     { label: "Brouillon",  badge: "neutral", icon: FileText,    color: "text-slate-500" },
  scheduled: { label: "Programmé",  badge: "info",    icon: Clock,       color: "text-blue-600" },
  published: { label: "Publié",     badge: "success",  icon: CheckCircle2, color: "text-emerald-600" },
  archived:  { label: "Archivé",    badge: "neutral",  icon: Archive,     color: "text-slate-400" },
};

const CATEGORY_CONFIG: Record<AnnouncementCategory, {
  label: string;
  badge: "success" | "warning" | "danger" | "info" | "neutral";
  color: string;
  bg: string;
}> = {
  general:   { label: "Général",     badge: "neutral", color: "text-slate-600", bg: "bg-slate-100" },
  academic:  { label: "Académique",  badge: "info",    color: "text-blue-700",  bg: "bg-blue-50" },
  event:     { label: "Événement",   badge: "success", color: "text-emerald-700", bg: "bg-emerald-50" },
  important: { label: "Important",   badge: "danger",  color: "text-red-700",   bg: "bg-red-50" },
  parents:   { label: "Parents",     badge: "warning", color: "text-amber-700", bg: "bg-amber-50" },
};

// ─────────────────────────────────────────────
// FORM TYPES
// ─────────────────────────────────────────────
interface AnnouncementForm {
  title: string;
  content: string;
  excerpt: string;
  category: AnnouncementCategory;
  coverImage: string;
  status: AnnouncementStatus;
  /** ISO date string YYYY-MM-DDTHH:mm */
  publishedAt: string;
  /** ISO date string YYYY-MM-DDTHH:mm — empty means no expiry */
  expiresAt: string;
  pinned: boolean;
}

type FormErrors = Partial<Record<keyof AnnouncementForm | "_general", string>>;

const EMPTY_FORM: AnnouncementForm = {
  title: "",
  content: "",
  excerpt: "",
  category: "general",
  coverImage: "",
  status: "draft",
  publishedAt: "",
  expiresAt: "",
  pinned: false,
};

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────
function validateForm(f: AnnouncementForm, canPublish: boolean): FormErrors {
  const errs: FormErrors = {};
  if (!f.title.trim()) errs.title = "Le titre est requis.";
  else if (f.title.trim().length > 120) errs.title = `Trop long (${f.title.length}/120 caractères).`;

  const plain = stripHtml(f.content);
  if (!plain.trim()) errs.content = "Le contenu est requis.";

  if (f.excerpt && f.excerpt.length > 200) errs.excerpt = `Trop long (${f.excerpt.length}/200 caractères).`;

  if (f.status === "scheduled" && !f.publishedAt) {
    errs.publishedAt = "La date de publication est requise pour une annonce programmée.";
  }
  if (f.publishedAt && f.expiresAt && new Date(f.publishedAt) >= new Date(f.expiresAt)) {
    errs.expiresAt = "La date d'expiration doit être postérieure à la date de publication.";
  }
  if ((f.status === "published" || f.status === "scheduled") && !canPublish) {
    errs._general = "Vous n'avez pas les permissions pour publier une annonce.";
  }
  return errs;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function isExpired(ann: Announcement): boolean {
  if (!ann.expiresAt) return false;
  return new Date(ann.expiresAt) < new Date();
}

function isScheduledButReady(ann: Announcement): boolean {
  if (ann.status !== "scheduled" || !ann.publishedAt) return false;
  return new Date(ann.publishedAt) <= new Date();
}

function formatDatetime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function toInputDatetime(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

function fromInputDatetime(s: string): string {
  return s ? new Date(s).toISOString() : "";
}

// Allowed HTML tags on the public site (allowlist for sanitisation)
const ALLOWED_TAGS = /^(p|br|strong|em|u|s|h2|h3|ul|ol|li|blockquote|a|span|div)$/i;

/** Minimal HTML sanitiser — strips unknown/script tags, keeps safe formatting */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/on\w+\s*=\s*(['"])[^'"]*\1/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<([a-z][a-z0-9]*)(\s[^>]*)?(\/?)>/gi, (match, tag, attrs, selfClose) => {
      if (!ALLOWED_TAGS.test(tag)) return "";
      // Allow only safe attrs: href, class, target, rel
      const safeAttrs = (attrs ?? "")
        .replace(/\s(href|class|target|rel)\s*=\s*(['"])[^'"]*\2/gi, (m: string) => m)
        .replace(/\s(?!href|class|target|rel)\w+\s*=\s*(['"])[^'"]*\1/gi, "");
      return `<${tag}${safeAttrs}${selfClose}>`;
    });
}

// ─────────────────────────────────────────────
// CATEGORY BADGE
// ─────────────────────────────────────────────
function CategoryBadge({ category }: { category: AnnouncementCategory }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.bg} ${cfg.color}`}>
      <Tag size={9} />
      {cfg.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// ANNOUNCEMENT PREVIEW DRAWER
// ─────────────────────────────────────────────
function AnnouncementPreview({ ann, onClose, onEdit }: {
  ann: Announcement;
  onClose: () => void;
  onEdit: () => void;
}) {
  const statusCfg = STATUS_CONFIG[ann.status];
  const expired = isExpired(ann);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label="Aperçu de l'annonce"
    >
      <div className="flex h-full w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl sm:rounded-l-[24px]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <p className="text-sm font-semibold text-[#0B1B3D]">Aperçu — vue publique</p>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Cover image */}
          {ann.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ann.coverImage}
              alt={ann.title}
              className="h-48 w-full object-cover"
            />
          )}

          <div className="px-6 py-6">
            {/* Badges row */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <CategoryBadge category={ann.category} />
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                ann.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}>
                <statusCfg.icon size={9} />
                {statusCfg.label}
              </span>
              {ann.pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6B35]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#FF6B35]">
                  <Pin size={9} /> Épinglée
                </span>
              )}
              {expired && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-500">
                  <AlertTriangle size={9} /> Expirée
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold leading-snug text-[#0B1B3D]">
              {ann.title}
            </h2>

            {/* Meta */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {formatDatetime(ann.publishedAt ?? ann.createdAt)}
              </span>
              <span>par {ann.author}</span>
              {ann.expiresAt && (
                <span className={`flex items-center gap-1 ${expired ? "text-red-400" : ""}`}>
                  <Clock size={11} />
                  Expire {formatDatetime(ann.expiresAt)}
                </span>
              )}
            </div>

            {/* Excerpt */}
            {ann.excerpt && (
              <p className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm italic text-slate-500">
                {ann.excerpt}
              </p>
            )}

            {/* Rich content */}
            <div
              className="rich-editor prose prose-sm mt-5 max-w-none text-[#0B1B3D]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(ann.content) }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-100 bg-white px-6 py-4 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Fermer</Button>
          <Button variant="primary" className="flex-1" icon={Pencil} onClick={onEdit}>Modifier</Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ANNOUNCEMENT CARD (grid view)
// ─────────────────────────────────────────────
interface AnnCardProps {
  ann: Announcement;
  onEdit: () => void;
  onPreview: () => void;
  onArchive: () => void;
  onPublish: () => void;
  onRestore: () => void;
  onPin: () => void;
  onDuplicate: () => void;
}

function AnnouncementCard({
  ann, onEdit, onPreview, onArchive, onPublish, onRestore, onPin, onDuplicate,
}: AnnCardProps) {
  const statusCfg = STATUS_CONFIG[ann.status];
  const catCfg = CATEGORY_CONFIG[ann.category];
  const expired = isExpired(ann);
  const ready = isScheduledButReady(ann);
  const isArchived = ann.status === "archived";
  const excerpt = ann.excerpt || stripHtml(ann.content).slice(0, 120) + (stripHtml(ann.content).length > 120 ? "…" : "");

  return (
    <div className={`flex flex-col rounded-[20px] border bg-white transition duration-200 hover:shadow-md ${
      isArchived ? "border-slate-100 opacity-60" :
      ann.status === "draft" ? "border-slate-200" :
      ann.status === "scheduled" ? "border-blue-100" :
      expired ? "border-red-100" : "border-slate-100"
    }`}>
      {/* Cover image */}
      {ann.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ann.coverImage} alt={ann.title} className="h-36 w-full rounded-t-[20px] object-cover" />
      ) : (
        <div className={`flex h-28 items-center justify-center rounded-t-[20px] ${catCfg.bg}`}>
          <Megaphone size={28} className={`${catCfg.color} opacity-40`} />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <CategoryBadge category={ann.category} />
            {ann.pinned && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FF6B35]/10 px-2 py-0.5 text-[10px] font-semibold text-[#FF6B35]">
                <Pin size={8} /> Épinglée
              </span>
            )}
          </div>
          <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            ann.status === "published" ? "bg-emerald-100 text-emerald-700" :
            ann.status === "scheduled" ? "bg-blue-100 text-blue-700" :
            ann.status === "draft" ? "bg-slate-100 text-slate-500" :
            "bg-slate-100 text-slate-400"
          }`}>
            <statusCfg.icon size={8} />
            {statusCfg.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-2 font-[family-name:var(--font-heading)] text-sm font-bold leading-snug text-[#0B1B3D] line-clamp-2">
          {ann.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-slate-400">{excerpt}</p>

        {/* Timestamps */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
          {ann.publishedAt ? (
            <span className="flex items-center gap-1">
              <Globe size={9} />
              {formatDatetime(ann.publishedAt)}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-300">
              <FileText size={9} /> Brouillon
            </span>
          )}
          {ann.expiresAt && (
            <span className={`flex items-center gap-1 ${expired ? "text-red-400 font-medium" : ""}`}>
              <Clock size={9} />
              {expired ? "Expirée" : `Expire ${formatDatetime(ann.expiresAt)}`}
            </span>
          )}
          {ready && (
            <span className="flex items-center gap-1 text-blue-500 font-medium">
              <Sparkles size={9} /> Prêt à publier
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-1 border-t border-slate-100 pt-3">
          <button onClick={onPreview} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0B1B3D] transition" aria-label="Aperçu" title="Aperçu">
            <Eye size={14} />
          </button>
          <button onClick={onEdit} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0B1B3D] transition" aria-label="Modifier" title="Modifier">
            <Pencil size={14} />
          </button>
          <button onClick={onDuplicate} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0B1B3D] transition" aria-label="Dupliquer" title="Dupliquer">
            <Copy size={14} />
          </button>
          <button
            onClick={onPin}
            className={`rounded-lg p-1.5 transition ${ann.pinned ? "text-[#FF6B35] hover:bg-[#FF6B35]/10" : "text-slate-400 hover:bg-slate-100"}`}
            aria-label={ann.pinned ? "Désépingler" : "Épingler"}
            title={ann.pinned ? "Désépingler" : "Épingler en haut"}
            disabled={isArchived}
          >
            {ann.pinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>

          <span className="mx-0.5 h-4 w-px bg-slate-200" />

          {(ann.status === "draft" || (ann.status === "scheduled" && ready)) && (
            <button onClick={onPublish} className="ml-auto rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-50 transition" aria-label="Publier" title="Publier maintenant">
              <Send size={14} />
            </button>
          )}
          {!isArchived && ann.status === "published" && (
            <button onClick={onArchive} className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition" aria-label="Archiver" title="Archiver">
              <Archive size={14} />
            </button>
          )}
          {isArchived && (
            <button onClick={onRestore} className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition" aria-label="Restaurer" title="Restaurer en brouillon">
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FORM PANEL
// ─────────────────────────────────────────────
interface FormPanelProps {
  form: AnnouncementForm;
  errors: FormErrors;
  setField: <K extends keyof AnnouncementForm>(k: K, v: AnnouncementForm[K]) => void;
  onCoverUpload: (file: File) => Promise<void>;
  coverUploading: boolean;
}

function AnnouncementFormPanel({ form, errors, setField, onCoverUpload, coverUploading }: FormPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <Input
          id="ann-title"
          label={`Titre * (${form.title.length}/120)`}
          placeholder="Ex : Rentrée scolaire 2026–2027"
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          error={errors.title}
          maxLength={120}
        />
      </div>

      {/* Cover image */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">
          Image de couverture
        </label>
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {form.coverImage ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.coverImage} alt="Couverture" className="h-40 w-full object-cover" />
              <button
                type="button"
                onClick={() => setField("coverImage", "")}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                aria-label="Supprimer l'image"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={coverUploading}
              className="flex h-32 w-full flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#FF6B35] transition"
            >
              {coverUploading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FF6B35] border-t-transparent" />
              ) : (
                <>
                  <Camera size={24} />
                  <span className="text-xs font-medium">Ajouter une image de couverture</span>
                  <span className="text-[11px]">JPG, PNG ou WebP · Max 2 Mo</span>
                </>
              )}
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onCoverUpload(f);
              e.target.value = "";
            }}
          />
        </div>
        {form.coverImage && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={coverUploading}
            className="mt-1.5 text-xs font-medium text-[#FF6B35] hover:underline disabled:opacity-50"
          >
            {coverUploading ? "Téléchargement…" : "Changer l'image"}
          </button>
        )}
      </div>

      {/* Content */}
      <RichEditor
        label="Contenu *"
        value={form.content}
        onChange={(html) => setField("content", html)}
        placeholder="Rédigez votre annonce ici…"
        error={errors.content}
        minHeight={200}
      />

      {/* Excerpt */}
      <Textarea
        id="ann-excerpt"
        label={`Extrait (${form.excerpt.length}/200) — résumé court affiché dans les listes`}
        rows={2}
        placeholder="Résumé court affiché dans la liste des annonces…"
        value={form.excerpt}
        onChange={(e) => setField("excerpt", e.target.value)}
        error={errors.excerpt}
        maxLength={200}
      />

      {/* Category + Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]" htmlFor="ann-cat">
            Catégorie
          </label>
          <select
            id="ann-cat"
            value={form.category}
            onChange={(e) => setField("category", e.target.value as AnnouncementCategory)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0B1B3D] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
          >
            {(Object.keys(ANNOUNCEMENT_CATEGORY_LABELS) as AnnouncementCategory[]).map((k) => (
              <option key={k} value={k}>{ANNOUNCEMENT_CATEGORY_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]" htmlFor="ann-status">
            Statut
          </label>
          <select
            id="ann-status"
            value={form.status}
            onChange={(e) => setField("status", e.target.value as AnnouncementStatus)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0B1B3D] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
          >
            <option value="draft">📝 Brouillon</option>
            <option value="scheduled">🕐 Programmé</option>
            <option value="published">✅ Publier maintenant</option>
            <option value="archived">🗄️ Archiver</option>
          </select>
        </div>
      </div>

      {/* Schedule / expiry */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input
            id="ann-pub"
            type="datetime-local"
            label={form.status === "scheduled" ? "Date de publication *" : "Date de publication"}
            value={form.publishedAt}
            onChange={(e) => setField("publishedAt", e.target.value)}
            error={errors.publishedAt}
          />
          {form.status === "scheduled" && !form.publishedAt && (
            <p className="mt-1 text-[11px] text-blue-600">Requis pour les annonces programmées.</p>
          )}
        </div>
        <div>
          <Input
            id="ann-exp"
            type="datetime-local"
            label="Date d'expiration (optionnel)"
            value={form.expiresAt}
            onChange={(e) => setField("expiresAt", e.target.value)}
            error={errors.expiresAt}
          />
          <p className="mt-1 text-[11px] text-slate-400">L&apos;annonce sera automatiquement retirée du site.</p>
        </div>
      </div>

      {/* Pin toggle */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[#0B1B3D]">Épingler en haut</p>
          <p className="text-xs text-slate-400">Cette annonce apparaît en premier sur le site public.</p>
        </div>
        <Toggle
          checked={form.pinned}
          onChange={(v) => setField("pinned", v)}
        />
      </div>

      {/* Permission warning */}
      {errors._general && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={14} className="shrink-0" />
          {errors._general}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETONS
// ─────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-[20px] border border-slate-100 bg-white overflow-hidden">
          <div className="h-28 animate-pulse bg-slate-200" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-8 w-full animate-pulse rounded-xl bg-slate-100 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonTable() {
  return (
    <Card>
      <CardBody className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </CardBody>
    </Card>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function AnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AnnouncementStatus | "all">("all");
  const [catFilter, setCatFilter] = useState<AnnouncementCategory | "all">("all");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setFormState] = useState<AnnouncementForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  // Preview
  const [previewAnn, setPreviewAnn] = useState<Announcement | null>(null);

  // Archive confirm
  const [archiveTarget, setArchiveTarget] = useState<Announcement | null>(null);
  const [archiving, setArchiving] = useState(false);

  const { show, ToastComponent } = useToast();

  // Derive permission from session
  // canAccess guard is placed after all hooks (before main return) to comply with Rules of Hooks.
  const session = getAdminSession();
  const canPublish = session?.role === "super_admin" || session?.role === "admin";
  const canAccess = session && (
    ROLE_PERMISSIONS[session.role]?.includes("*") ||
    ROLE_PERMISSIONS[session.role]?.includes("announcements")
  );

  // ── Load ───────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getAnnouncements({ pageSize: 200 });
      setAnnouncements(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // ── Filtered list ──────────────────────────
  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch = !q || [a.title, a.excerpt ?? "", stripHtml(a.content)].some((v) =>
        v.toLowerCase().includes(q)
      );
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchCat = catFilter === "all" || a.category === catFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [announcements, search, statusFilter, catFilter]);

  // ── Counts ─────────────────────────────────
  const counts = useMemo(() => ({
    all:       announcements.length,
    draft:     announcements.filter((a) => a.status === "draft").length,
    scheduled: announcements.filter((a) => a.status === "scheduled").length,
    published: announcements.filter((a) => a.status === "published").length,
    archived:  announcements.filter((a) => a.status === "archived").length,
    expired:   announcements.filter((a) => isExpired(a)).length,
    readyToPublish: announcements.filter((a) => isScheduledButReady(a)).length,
  }), [announcements]);

  // ── Form helpers ───────────────────────────
  function setField<K extends keyof AnnouncementForm>(key: K, val: AnnouncementForm[K]) {
    setFormState((f) => ({ ...f, [key]: val }));
    setFormErrors((e) => { const n = { ...e }; delete n[key]; delete n._general; return n; });
  }

  async function handleCoverUpload(file: File) {
    if (file.size > 2 * 1024 * 1024) { show("L'image dépasse 2 Mo.", "error"); return; }
    setCoverUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "general");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.url) { show(json.error ?? "Échec du téléchargement.", "error"); return; }
      setField("coverImage", json.url);
      show("Image téléchargée.", "success");
    } catch {
      show("Erreur réseau.", "error");
    } finally {
      setCoverUploading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setFormState(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(a: Announcement) {
    setEditing(a);
    setFormState({
      title: a.title,
      content: a.content,
      excerpt: a.excerpt ?? "",
      category: a.category,
      coverImage: a.coverImage ?? "",
      status: a.status,
      publishedAt: toInputDatetime(a.publishedAt),
      expiresAt: toInputDatetime(a.expiresAt),
      pinned: a.pinned,
    });
    setFormErrors({});
    setModalOpen(true);
  }

  async function handleSave() {
    const errs = validateForm(form, canPublish);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      const payload: Omit<Announcement, "id" | "createdAt" | "updatedAt"> = {
        title: form.title.trim(),
        content: form.content,
        excerpt: form.excerpt.trim() || undefined,
        category: form.category,
        coverImage: form.coverImage || undefined,
        status: form.status,
        publishedAt: form.status === "published" && !form.publishedAt
          ? new Date().toISOString()
          : form.publishedAt
          ? fromInputDatetime(form.publishedAt)
          : editing?.publishedAt,
        expiresAt: form.expiresAt ? fromInputDatetime(form.expiresAt) : undefined,
        pinned: form.pinned,
        author: session?.name ?? "Admin",
      };
      if (editing) {
        await updateAnnouncement(editing.id, payload);
        // Audit log: update (or publish if status changed to published)
        if (session) {
          const action = form.status === "published" && editing.status !== "published"
            ? "publish"
            : "update";
          await addAuditLog({
            userId: session.userId,
            userName: session.name,
            userRole: session.role,
            action,
            resource: "announcement",
            resourceId: editing.id,
            details: action === "publish"
              ? `Annonce publiée : ${form.title}`
              : `Annonce mise à jour : ${form.title}`,
          });
        }
        show(`"${form.title}" mis à jour.`, "success");
      } else {
        const created = await createAnnouncement(payload);
        // Audit log: create
        if (session) {
          await addAuditLog({
            userId: session.userId,
            userName: session.name,
            userRole: session.role,
            action: "create",
            resource: "announcement",
            resourceId: created.id,
            details: `Nouvelle annonce créée : ${form.title} (${form.status})`,
          });
        }
        show(`"${form.title}" créée.`, "success");
      }
      setModalOpen(false);
      load();
    } catch {
      show("Erreur lors de la sauvegarde.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleQuickPublish(a: Announcement) {
    if (!canPublish) { show("Permissions insuffisantes pour publier.", "error"); return; }
    try {
      await updateAnnouncement(a.id, { status: "published", publishedAt: new Date().toISOString() });
      // Audit log: publish
      if (session) {
        await addAuditLog({
          userId: session.userId,
          userName: session.name,
          userRole: session.role,
          action: "publish",
          resource: "announcement",
          resourceId: a.id,
          details: `Annonce publiée (action rapide) : ${a.title}`,
        });
      }
      show(`"${a.title}" publiée.`, "success");
      load();
    } catch { show("Erreur.", "error"); }
  }

  async function handleArchive() {
    if (!archiveTarget) return;
    setArchiving(true);
    try {
      await archiveAnnouncement(archiveTarget.id);
      // Audit log: archive
      if (session) {
        await addAuditLog({
          userId: session.userId,
          userName: session.name,
          userRole: session.role,
          action: "archive",
          resource: "announcement",
          resourceId: archiveTarget.id,
          details: `Annonce archivée : ${archiveTarget.title}`,
        });
      }
      show(`"${archiveTarget.title}" archivée.`, "success");
      setArchiveTarget(null);
      if (previewAnn?.id === archiveTarget.id) setPreviewAnn(null);
      load();
    } catch { show("Erreur.", "error"); }
    finally { setArchiving(false); }
  }

  async function handleRestore(a: Announcement) {
    try {
      await updateAnnouncement(a.id, { status: "draft" });
      show(`"${a.title}" restaurée en brouillon.`, "success");
      load();
    } catch { show("Erreur.", "error"); }
  }

  async function handleTogglePin(a: Announcement) {
    if (a.status === "archived") return;
    try {
      await updateAnnouncement(a.id, { pinned: !a.pinned });
      show(a.pinned ? "Annonce désépinglée." : "Annonce épinglée.", "success");
      load();
    } catch { show("Erreur.", "error"); }
  }

  async function handleDuplicate(a: Announcement) {
    try {
      await createAnnouncement({
        title: `Copie — ${a.title}`,
        content: a.content,
        excerpt: a.excerpt,
        category: a.category,
        coverImage: a.coverImage,
        status: "draft",
        pinned: false,
        author: session?.name ?? "Admin",
      });
      show("Annonce dupliquée en brouillon.", "success");
      load();
    } catch { show("Erreur.", "error"); }
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
          Vous n&apos;avez pas les permissions nécessaires pour accéder à la gestion des annonces.
          Contactez un administrateur si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
        </p>
      </div>
    );
  }

  return (
    <>
      {ToastComponent}

      {/* Preview drawer */}
      {previewAnn && (
        <AnnouncementPreview
          ann={previewAnn}
          onClose={() => setPreviewAnn(null)}
          onEdit={() => { openEdit(previewAnn); setPreviewAnn(null); }}
        />
      )}

      {/* Archive confirm */}
      <ConfirmDialog
        open={!!archiveTarget}
        title={`Archiver "${archiveTarget?.title}" ?`}
        description="L'annonce sera retirée du site public et archivée. Vous pourrez la restaurer."
        confirmLabel="Archiver"
        onConfirm={handleArchive}
        onCancel={() => setArchiveTarget(null)}
        loading={archiving}
      />

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Modifier — ${editing.title.slice(0, 40)}${editing.title.length > 40 ? "…" : ""}` : "Nouvelle annonce"}
        width="max-w-3xl"
      >
        <div className="max-h-[78vh] overflow-y-auto pr-1">
          <AnnouncementFormPanel
            form={form}
            errors={formErrors}
            setField={setField}
            onCoverUpload={handleCoverUpload}
            coverUploading={coverUploading}
          />
        </div>

        {/* Status preview hint */}
        {form.status === "published" && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-700">
            <Globe size={12} className="shrink-0" />
            Cette annonce sera <strong className="ml-1">immédiatement visible sur le site public.</strong>
          </div>
        )}
        {form.status === "scheduled" && form.publishedAt && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs text-blue-700">
            <Clock size={12} className="shrink-0" />
            Publication prévue le <strong className="ml-1">{formatDatetime(fromInputDatetime(form.publishedAt))}</strong>.
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => { setField("status", "draft"); setTimeout(handleSave, 0); }}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-[#0B1B3D] hover:bg-slate-50 transition disabled:opacity-50"
          >
            💾 Brouillon
          </button>
          <Button variant="primary" loading={saving} onClick={handleSave} className="w-full justify-center">
            {form.status === "published" ? "✅ Publier" : form.status === "scheduled" ? "🕐 Programmer" : "Enregistrer"}
          </Button>
        </div>
      </Modal>

      {/* ── PAGE ── */}
      <div className="space-y-5">

        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#0B1B3D]">
              Annonces
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Communiquez avec les familles —{" "}
              <Link href="/announcements" target="_blank" className="inline-flex items-center gap-1 font-medium text-[#FF6B35] hover:underline">
                Voir la page publique <ExternalLink size={11} />
              </Link>
            </p>
          </div>
          <Button icon={Plus} onClick={openCreate}>Nouvelle annonce</Button>
        </div>

        {/* Ready-to-publish alert */}
        {counts.readyToPublish > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <Sparkles size={15} className="shrink-0" />
            <span>
              <strong>{counts.readyToPublish}</strong> annonce{counts.readyToPublish > 1 ? "s" : ""} programmée{counts.readyToPublish > 1 ? "s" : ""} prête{counts.readyToPublish > 1 ? "s" : ""} à être publiée{counts.readyToPublish > 1 ? "s" : ""}.
            </span>
          </div>
        )}

        {/* Expired alert */}
        {counts.expired > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle size={15} className="shrink-0" />
            <span>
              <strong>{counts.expired}</strong> annonce{counts.expired > 1 ? "s" : ""} expirée{counts.expired > 1 ? "s" : ""} — toujours visible{counts.expired > 1 ? "s" : ""} en admin, retirée{counts.expired > 1 ? "s" : ""} du site public.
            </span>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {([
            ["all",       "Toutes",    "text-[#0B1B3D]"],
            ["draft",     "Brouillons","text-slate-500"],
            ["scheduled", "Programmées","text-blue-600"],
            ["published", "Publiées",  "text-emerald-600"],
            ["archived",  "Archivées", "text-slate-400"],
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
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-full sm:max-w-xs">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Rechercher une annonce…"
              />
            </div>
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                filtersOpen || catFilter !== "all"
                  ? "border-[#FF6B35]/30 bg-[#FF6B35]/5 text-[#FF6B35]"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Filter size={13} /> Catégorie
              {catFilter !== "all" && <span className="text-[#FF6B35]">·</span>}
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

        {/* Category filter */}
        {filtersOpen && (
          <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-4">
            <button
              onClick={() => setCatFilter("all")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                catFilter === "all" ? "bg-[#FF6B35] text-white" : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              Toutes
            </button>
            {(Object.keys(ANNOUNCEMENT_CATEGORY_LABELS) as AnnouncementCategory[]).map((k) => {
              const cfg = CATEGORY_CONFIG[k];
              return (
                <button
                  key={k}
                  onClick={() => setCatFilter(k)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    catFilter === k ? `${cfg.bg} ${cfg.color}` : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Results label */}
        {(search || statusFilter !== "all" || catFilter !== "all") && (
          <p className="text-xs text-slate-400">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            {search && <> pour «&nbsp;{search}&nbsp;»</>}
            {" · "}
            <button
              className="text-[#FF6B35] hover:underline"
              onClick={() => { setSearch(""); setStatusFilter("all"); setCatFilter("all"); }}
            >
              Réinitialiser
            </button>
          </p>
        )}

        {/* ── CONTENT ── */}
        {loading ? (
          view === "grid" ? <SkeletonGrid /> : <SkeletonTable />
        ) : error ? (
          <Card>
            <CardBody>
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                  <Megaphone size={22} className="text-red-400" />
                </div>
                <p className="font-bold text-[#0B1B3D]">Erreur de chargement</p>
                <p className="mt-1 text-sm text-slate-400">Impossible de charger les annonces.</p>
                <Button variant="secondary" className="mt-4" onClick={load}>Réessayer</Button>
              </div>
            </CardBody>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                icon={Megaphone}
                title={search || statusFilter !== "all" || catFilter !== "all" ? "Aucun résultat" : "Aucune annonce"}
                description={
                  search || statusFilter !== "all" || catFilter !== "all"
                    ? "Essayez d'autres filtres ou termes de recherche."
                    : "Créez la première communication de l'école."
                }
                action={
                  !search && statusFilter === "all" && catFilter === "all"
                    ? <Button icon={Plus} onClick={openCreate}>Créer une annonce</Button>
                    : <button className="text-sm text-[#FF6B35] hover:underline" onClick={() => { setSearch(""); setStatusFilter("all"); setCatFilter("all"); }}>Réinitialiser</button>
                }
              />
            </CardBody>
          </Card>
        ) : view === "grid" ? (
          /* ── GRID ── */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <AnnouncementCard
                key={a.id}
                ann={a}
                onEdit={() => openEdit(a)}
                onPreview={() => setPreviewAnn(a)}
                onArchive={() => setArchiveTarget(a)}
                onPublish={() => handleQuickPublish(a)}
                onRestore={() => handleRestore(a)}
                onPin={() => handleTogglePin(a)}
                onDuplicate={() => handleDuplicate(a)}
              />
            ))}
          </div>
        ) : (
          /* ── TABLE ── */
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <Th>Annonce</Th>
                    <Th>Catégorie</Th>
                    <Th>Statut</Th>
                    <Th>Publié le</Th>
                    <Th>Expire le</Th>
                    <Th className="w-40">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => {
                    const statusCfg = STATUS_CONFIG[a.status];
                    const expired = isExpired(a);
                    const ready = isScheduledButReady(a);
                    const isArchived = a.status === "archived";
                    return (
                      <tr key={a.id} className={`transition hover:bg-slate-50/40 ${isArchived ? "opacity-60" : ""}`}>
                        <Td>
                          <div className="flex items-start gap-3">
                            {a.coverImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={a.coverImage} alt="" className="h-10 w-16 shrink-0 rounded-lg object-cover" />
                            ) : (
                              <div className={`flex h-10 w-16 shrink-0 items-center justify-center rounded-lg ${CATEGORY_CONFIG[a.category].bg}`}>
                                <Megaphone size={13} className={CATEGORY_CONFIG[a.category].color} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                {a.pinned && <Pin size={11} className="shrink-0 text-[#FF6B35]" />}
                                <p className="truncate font-semibold text-[#0B1B3D] max-w-[220px]">{a.title}</p>
                              </div>
                              <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                                {a.excerpt || stripHtml(a.content).slice(0, 80)}
                              </p>
                            </div>
                          </div>
                        </Td>
                        <Td><CategoryBadge category={a.category} /></Td>
                        <Td>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            a.status === "published" ? "bg-emerald-50 text-emerald-700" :
                            a.status === "scheduled" ? "bg-blue-50 text-blue-700" :
                            a.status === "draft" ? "bg-slate-100 text-slate-500" :
                            "bg-slate-100 text-slate-400"
                          }`}>
                            <statusCfg.icon size={10} />
                            {statusCfg.label}
                            {ready && <Sparkles size={9} className="text-blue-500" />}
                          </span>
                        </Td>
                        <Td className="text-xs text-slate-400">{formatDatetime(a.publishedAt)}</Td>
                        <Td>
                          {a.expiresAt ? (
                            <span className={`text-xs ${expired ? "font-medium text-red-500" : "text-slate-400"}`}>
                              {expired ? "Expirée" : formatDatetime(a.expiresAt)}
                            </span>
                          ) : <span className="text-xs text-slate-300">—</span>}
                        </Td>
                        <Td>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setPreviewAnn(a)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0B1B3D] transition" title="Aperçu"><Eye size={13} /></button>
                            <button onClick={() => openEdit(a)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0B1B3D] transition" title="Modifier"><Pencil size={13} /></button>
                            <button onClick={() => handleDuplicate(a)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition" title="Dupliquer"><Copy size={13} /></button>
                            <button
                              onClick={() => handleTogglePin(a)}
                              disabled={isArchived}
                              className={`rounded-lg p-1.5 transition disabled:opacity-30 ${a.pinned ? "text-[#FF6B35] hover:bg-[#FF6B35]/10" : "text-slate-400 hover:bg-slate-100"}`}
                              title={a.pinned ? "Désépingler" : "Épingler"}
                            >
                              {a.pinned ? <PinOff size={13} /> : <Pin size={13} />}
                            </button>
                            {(a.status === "draft" || ready) && canPublish && (
                              <button onClick={() => handleQuickPublish(a)} className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-50 transition" title="Publier"><Send size={13} /></button>
                            )}
                            {!isArchived && a.status === "published" && (
                              <button onClick={() => setArchiveTarget(a)} className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition" title="Archiver"><Archive size={13} /></button>
                            )}
                            {isArchived && (
                              <button onClick={() => handleRestore(a)} className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition" title="Restaurer"><RotateCcw size={13} /></button>
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
              {filtered.length} annonce{filtered.length !== 1 ? "s" : ""}
            </div>
          </Card>
        )}

        {/* Public site note */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-blue-700">
          <Info size={13} className="mt-0.5 shrink-0" />
          <p>
            Seules les annonces <strong>Publiées</strong> et non expirées apparaissent sur le site.
            Les annonces <strong>Programmées</strong> sont publiées automatiquement à la date prévue.{" "}
            <Link href="/announcements" target="_blank" className="inline-flex items-center gap-1 font-semibold underline hover:text-blue-900">
              Voir la page Annonces <ExternalLink size={10} />
            </Link>
          </p>
        </div>

      </div>
    </>
  );
}
