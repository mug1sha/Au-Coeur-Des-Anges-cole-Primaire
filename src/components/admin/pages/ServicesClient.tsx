"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Plus, Pencil, Archive, Eye, BookOpen,
  ArrowUp, ArrowDown, LayoutGrid, List,
  ChevronRight, Clock, Tag, Banknote,
  Users, CheckCircle2, XCircle, ArchiveIcon,
  RotateCcw, ExternalLink, Info, ShieldAlert,
} from "lucide-react";
import {
  getServices, createService, updateService,
  archiveService, reorderServices, addAuditLog,
} from "@/lib/admin-data";
import type { Service, ServiceStatus } from "@/lib/admin-types";
import { ROLE_PERMISSIONS } from "@/lib/admin-types";
import { getAdminSession } from "@/lib/admin-auth";
import {
  Card, CardHeader, CardBody, Button, Badge, EmptyState,
  Modal, Input, Textarea, Select, Toggle, Skeleton,
  ConfirmDialog, SearchInput, useToast, StatusDot,
  Table, Th, Td,
} from "@/components/admin/ui";
import Link from "next/link";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const STATUS_CONFIG: Record<ServiceStatus, {
  label: string;
  badge: "success" | "warning" | "neutral";
  icon: React.ElementType;
  description: string;
}> = {
  active:   { label: "Actif",    badge: "success", icon: CheckCircle2,  description: "Visible sur le site public" },
  inactive: { label: "Inactif",  badge: "warning", icon: XCircle,       description: "Masqué du site public" },
  archived: { label: "Archivé",  badge: "neutral", icon: ArchiveIcon,   description: "Archivé — non visible" },
};

const ICON_OPTIONS = [
  { value: "🍼", label: "🍼 Crèche" },
  { value: "✏️", label: "✏️ École" },
  { value: "🎨", label: "🎨 Arts" },
  { value: "⚽", label: "⚽ Sport" },
  { value: "🎵", label: "🎵 Musique" },
  { value: "📚", label: "📚 Bibliothèque" },
  { value: "🌿", label: "🌿 Nature" },
  { value: "👨‍👩‍👧", label: "👨‍👩‍👧 Famille" },
  { value: "🌙", label: "🌙 Garderie" },
  { value: "🔬", label: "🔬 Sciences" },
  { value: "🎭", label: "🎭 Théâtre" },
  { value: "💻", label: "💻 Numérique" },
];

// ─────────────────────────────────────────────
// SLUG HELPER
// ─────────────────────────────────────────────
function toSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─────────────────────────────────────────────
// SERVICE FORM
// ─────────────────────────────────────────────
interface ServiceFormState {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  ageRange: string;
  price: string;
  schedule: string;
  status: ServiceStatus;
  order: number;
}

type FormErrors = Partial<Record<keyof ServiceFormState, string>>;

const EMPTY_FORM: ServiceFormState = {
  title: "", slug: "", description: "", longDescription: "",
  icon: "✏️", ageRange: "", price: "", schedule: "",
  status: "active", order: 1,
};

function validateForm(f: ServiceFormState): FormErrors {
  const errs: FormErrors = {};
  if (!f.title.trim()) errs.title = "Le nom du service est requis.";
  if (!f.slug.trim()) errs.slug = "Le slug est requis.";
  else if (!/^[a-z0-9-]+$/.test(f.slug)) errs.slug = "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets.";
  if (!f.description.trim()) errs.description = "La description courte est requise.";
  if (f.description.length > 200) errs.description = `Trop long (${f.description.length}/200 caractères).`;
  if (!f.ageRange.trim()) errs.ageRange = "La tranche d'âge est requise.";
  return errs;
}

interface ServiceFormProps {
  value: ServiceFormState;
  errors: FormErrors;
  onChange: <K extends keyof ServiceFormState>(key: K, val: ServiceFormState[K]) => void;
  isEditing: boolean;
}

function ServiceForm({ value, errors, onChange, isEditing }: ServiceFormProps) {
  const slugTouched = useRef(false);

  function handleTitleChange(title: string) {
    onChange("title", title);
    // Auto-generate slug from title if user hasn't manually touched it
    if (!slugTouched.current || !value.slug) {
      onChange("slug", toSlug(title));
    }
  }

  return (
    <div className="space-y-5">
      {/* Name + icon row */}
      <div className="flex gap-3">
        {/* Icon picker */}
        <div className="shrink-0">
          <label className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">Icône</label>
          <Select
            id="svc-icon"
            value={value.icon}
            onChange={(e) => onChange("icon", e.target.value)}
            options={ICON_OPTIONS}
            className="w-28"
          />
        </div>
        <div className="flex-1">
          <Input
            id="svc-title"
            label="Nom du service *"
            placeholder="Ex : La Crèche"
            value={value.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            error={errors.title}
          />
        </div>
      </div>

      {/* Slug */}
      <div>
        <Input
          id="svc-slug"
          label="Slug (URL)"
          placeholder="creche"
          value={value.slug}
          onChange={(e) => {
            slugTouched.current = true;
            onChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
          }}
          error={errors.slug}
        />
        <p className="mt-1 text-[11px] text-slate-400">
          Utilisé dans l&apos;URL : <span className="font-mono">/service#{value.slug || "slug"}</span>
        </p>
      </div>

      {/* Description courte */}
      <Textarea
        id="svc-desc"
        label={`Description courte * (${value.description.length}/200)`}
        rows={3}
        placeholder="Résumé affiché dans les cartes du site public…"
        value={value.description}
        onChange={(e) => onChange("description", e.target.value)}
        error={errors.description}
      />

      {/* Description longue */}
      <Textarea
        id="svc-long"
        label="Description détaillée (optionnelle)"
        rows={4}
        placeholder="Détails affichés dans la page service complète…"
        value={value.longDescription}
        onChange={(e) => onChange("longDescription", e.target.value)}
      />

      {/* Age range + price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="svc-age"
          label="Tranche d'âge *"
          placeholder="Ex : 3 mois – 2 ans"
          value={value.ageRange}
          onChange={(e) => onChange("ageRange", e.target.value)}
          error={errors.ageRange}
        />
        <Input
          id="svc-price"
          label="Tarif (optionnel)"
          placeholder="150 000 RWF / mois"
          value={value.price}
          onChange={(e) => onChange("price", e.target.value)}
        />
      </div>

      {/* Schedule */}
      <Input
        id="svc-schedule"
        label="Horaires (optionnel)"
        placeholder="Lun–Ven, 07h00–17h30"
        value={value.schedule}
        onChange={(e) => onChange("schedule", e.target.value)}
      />

      {/* Status + order */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          id="svc-status"
          label="Statut"
          value={value.status}
          onChange={(e) => onChange("status", e.target.value as ServiceStatus)}
          options={[
            { value: "active",   label: "✅ Actif — visible sur le site" },
            { value: "inactive", label: "⏸️ Inactif — masqué du site" },
            { value: "archived", label: "🗄️ Archivé" },
          ]}
        />
        <Input
          id="svc-order"
          label="Ordre d'affichage"
          type="number"
          min={1}
          value={String(value.order)}
          onChange={(e) => onChange("order", Math.max(1, Number(e.target.value)))}
        />
      </div>

      {/* Status hint */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
        <span className="font-semibold">{STATUS_CONFIG[value.status].label} — </span>
        {STATUS_CONFIG[value.status].description}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SERVICE PREVIEW PANEL
// ─────────────────────────────────────────────
function ServicePreview({ service, onClose }: { service: Service; onClose: () => void }) {
  const cfg = STATUS_CONFIG[service.status];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg rounded-[24px] bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>{service.icon}</span>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#0B1B3D]">
                {service.title}
              </h2>
              <span className="font-mono text-xs text-slate-400">/{service.slug}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={cfg.badge}>{cfg.label}</Badge>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              aria-label="Fermer l'aperçu"
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-5">
          {/* Description */}
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</p>
            <p className="text-sm text-[#0B1B3D] leading-relaxed">{service.description}</p>
          </div>
          {service.longDescription && (
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Détails</p>
              <p className="text-sm text-slate-600 leading-relaxed">{service.longDescription}</p>
            </div>
          )}

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                <Users size={11} /> Tranche d&apos;âge
              </div>
              <p className="text-sm font-semibold text-[#0B1B3D]">{service.ageRange}</p>
            </div>
            {service.price && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  <Banknote size={11} /> Tarif
                </div>
                <p className="text-sm font-semibold text-[#0B1B3D]">{service.price}</p>
              </div>
            )}
            {service.schedule && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  <Clock size={11} /> Horaires
                </div>
                <p className="text-sm font-semibold text-[#0B1B3D]">{service.schedule}</p>
              </div>
            )}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                <Tag size={11} /> Ordre
              </div>
              <p className="text-sm font-semibold text-[#0B1B3D]">#{service.order}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
            <span>Créé le {new Date(service.createdAt).toLocaleDateString("fr-FR")}</span>
            <span>Mis à jour le {new Date(service.updatedAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50 flex items-center justify-between gap-3">
          <Link
            href="/service"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#FF6B35] transition"
          >
            <ExternalLink size={13} /> Voir sur le site public
          </Link>
          <Button variant="secondary" size="sm" onClick={onClose}>Fermer</Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SERVICE CARD (grid view)
// ─────────────────────────────────────────────
interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onPreview: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function ServiceCard({
  service, onEdit, onPreview, onArchive, onRestore, onMoveUp, onMoveDown, isFirst, isLast,
}: ServiceCardProps) {
  const cfg = STATUS_CONFIG[service.status];
  return (
    <div className={`group relative flex flex-col rounded-[20px] border bg-white transition duration-200 hover:shadow-md ${
      service.status === "archived" ? "border-slate-100 opacity-60" :
      service.status === "inactive" ? "border-amber-100" : "border-slate-100"
    }`}>
      {/* Top */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-[14px] text-2xl ${
            service.status === "active" ? "bg-[#FF6B35]/10" : "bg-slate-100"
          }`}>
            {service.icon}
          </div>
          <div>
            <p className="font-[family-name:var(--font-heading)] text-sm font-bold text-[#0B1B3D] leading-tight">
              {service.title}
            </p>
            <span className="font-mono text-[10px] text-slate-400">/{service.slug}</span>
          </div>
        </div>
        <Badge variant={cfg.badge}>{cfg.label}</Badge>
      </div>

      {/* Description */}
      <p className="line-clamp-2 flex-1 px-5 text-xs text-slate-500 leading-relaxed">{service.description}</p>

      {/* Meta */}
      <div className="px-5 pt-3 pb-4 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Users size={11} className="shrink-0" />
          <span>{service.ageRange}</span>
        </div>
        {service.price && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Banknote size={11} className="shrink-0" />
            <span>{service.price}</span>
          </div>
        )}
        {service.schedule && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={11} className="shrink-0" />
            <span>{service.schedule}</span>
          </div>
        )}
      </div>

      {/* Actions footer */}
      <div className="flex items-center gap-1 border-t border-slate-100 px-4 py-2.5">
        {/* Reorder */}
        <button
          onClick={onMoveUp} disabled={isFirst}
          className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Monter"
          title="Monter"
        >
          <ArrowUp size={13} />
        </button>
        <button
          onClick={onMoveDown} disabled={isLast}
          className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Descendre"
          title="Descendre"
        >
          <ArrowDown size={13} />
        </button>

        <span className="mx-1 h-4 w-px bg-slate-200" />

        <button
          onClick={onPreview}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0B1B3D] transition"
          aria-label="Aperçu"
          title="Aperçu"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={onEdit}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0B1B3D] transition"
          aria-label="Modifier"
          title="Modifier"
        >
          <Pencil size={14} />
        </button>
        {service.status !== "archived" ? (
          <button
            onClick={onArchive}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition"
            aria-label="Archiver"
            title="Archiver ce service"
          >
            <Archive size={14} />
          </button>
        ) : (
          <button
            onClick={onRestore}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition"
            aria-label="Restaurer"
            title="Restaurer ce service"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      {/* Order badge */}
      <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-500 shadow-sm">
        {service.order}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────
function ServicesSkeleton({ view }: { view: "grid" | "table" }) {
  if (view === "grid") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-56 rounded-[20px]" />)}
      </div>
    );
  }
  return (
    <Card>
      <CardBody className="space-y-3">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
      </CardBody>
    </Card>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────
export default function ServicesClient() {
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">("all");
  const [view, setView] = useState<"grid" | "table">("grid");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  // Preview
  const [previewService, setPreviewService] = useState<Service | null>(null);

  // Archive confirm
  const [archiveTarget, setArchiveTarget] = useState<Service | null>(null);
  const [archiving, setArchiving] = useState(false);

  const { show, ToastComponent } = useToast();

  // ── Session & permission ─────────────────
  // Computed here so session is available in audit log callbacks.
  // Access denied guard is placed after all hooks (before main return).
  const session = getAdminSession();
  const canAccess = session && (
    ROLE_PERMISSIONS[session.role]?.includes("*") ||
    ROLE_PERMISSIONS[session.role]?.includes("services")
  );

  // ── Load ────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getServices({ search, pageSize: 100 });
      const filtered = statusFilter === "all"
        ? res.data
        : res.data.filter((s) => s.status === statusFilter);
      setServices(filtered);
      setTotal(res.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // ── Summary counts ───────────────────────
  const counts = {
    all:      services.length,
    active:   services.filter((s) => s.status === "active").length,
    inactive: services.filter((s) => s.status === "inactive").length,
    archived: services.filter((s) => s.status === "archived").length,
  };

  // ── Form helpers ─────────────────────────
  function setField<K extends keyof ServiceFormState>(key: K, val: ServiceFormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setFormErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function openCreate() {
    const nextOrder = services.filter((s) => s.status !== "archived").length + 1;
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: nextOrder });
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      title: s.title,
      slug: s.slug,
      description: s.description,
      longDescription: s.longDescription ?? "",
      icon: s.icon,
      ageRange: s.ageRange,
      price: s.price ?? "",
      schedule: s.schedule ?? "",
      status: s.status,
      order: s.order,
    });
    setFormErrors({});
    setModalOpen(true);
  }

  async function handleSave() {
    const errs = validateForm(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        longDescription: form.longDescription || undefined,
        price: form.price || undefined,
        schedule: form.schedule || undefined,
      };
      if (editing) {
        await updateService(editing.id, payload);
        // Audit log: update
        if (session) {
          await addAuditLog({
            userId: session.userId,
            userName: session.name,
            userRole: session.role,
            action: "update",
            resource: "service",
            resourceId: editing.id,
            details: `Service mis à jour : ${form.title}`,
          });
        }
        show(`"${form.title}" mis à jour.`, "success");
      } else {
        const created = await createService(payload);
        // Audit log: create
        if (session) {
          await addAuditLog({
            userId: session.userId,
            userName: session.name,
            userRole: session.role,
            action: "create",
            resource: "service",
            resourceId: created.id,
            details: `Nouveau service créé : ${form.title} (${form.ageRange})`,
          });
        }
        show(`Service "${form.title}" créé.`, "success");
      }
      setModalOpen(false);
      load();
    } catch {
      show("Erreur lors de la sauvegarde.", "error");
    } finally {
      setSaving(false);
    }
  }

  // ── Reorder ──────────────────────────────
  async function moveService(id: string, dir: "up" | "down") {
    const sorted = [...services].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const newOrder = sorted.map((s) => s.id);
    const [removed] = newOrder.splice(idx, 1);
    newOrder.splice(swapIdx, 0, removed);

    try {
      await reorderServices(newOrder);
      // Optimistic local update
      setServices((prev) => {
        const updated = prev.map((s) => ({ ...s }));
        newOrder.forEach((id, i) => {
          const found = updated.find((s) => s.id === id);
          if (found) found.order = i + 1;
        });
        return [...updated].sort((a, b) => a.order - b.order);
      });
      show("Ordre mis à jour.", "success");
    } catch {
      show("Erreur lors du réordonnancement.", "error");
    }
  }

  // ── Archive ──────────────────────────────
  async function handleArchive() {
    if (!archiveTarget) return;
    setArchiving(true);
    try {
      await archiveService(archiveTarget.id);
      // Audit log: archive
      if (session) {
        await addAuditLog({
          userId: session.userId,
          userName: session.name,
          userRole: session.role,
          action: "archive",
          resource: "service",
          resourceId: archiveTarget.id,
          details: `Service archivé : ${archiveTarget.title}`,
        });
      }
      show(`"${archiveTarget.title}" archivé.`, "success");
      setArchiveTarget(null);
      load();
    } catch {
      show("Erreur lors de l'archivage.", "error");
    } finally {
      setArchiving(false);
    }
  }

  async function handleRestore(s: Service) {
    try {
      await updateService(s.id, { status: "inactive" });
      show(`"${s.title}" restauré (inactif).`, "success");
      load();
    } catch {
      show("Erreur lors de la restauration.", "error");
    }
  }

  // ── Toggle active/inactive ────────────────
  async function handleToggleStatus(s: Service) {
    const newStatus: ServiceStatus = s.status === "active" ? "inactive" : "active";
    try {
      await updateService(s.id, { status: newStatus });
      show(`"${s.title}" est maintenant ${STATUS_CONFIG[newStatus].label.toLowerCase()}.`, "success");
      load();
    } catch {
      show("Erreur lors de la mise à jour.", "error");
    }
  }

  const sortedServices = [...services].sort((a, b) => a.order - b.order);

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
          Vous n&apos;avez pas les permissions nécessaires pour accéder à la gestion des services.
          Contactez un administrateur si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
        </p>
      </div>
    );
  }

  return (
    <>
      {ToastComponent}

      {/* Preview */}
      {previewService && (
        <ServicePreview service={previewService} onClose={() => setPreviewService(null)} />
      )}

      {/* Archive confirmation */}
      <ConfirmDialog
        open={!!archiveTarget}
        title={`Archiver "${archiveTarget?.title}" ?`}
        description="Le service sera masqué du site public et marqué comme archivé. Vous pourrez le restaurer ultérieurement."
        confirmLabel="Archiver"
        onConfirm={handleArchive}
        onCancel={() => setArchiveTarget(null)}
        loading={archiving}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Modifier — ${editing.title}` : "Nouveau service"}
        width="max-w-2xl"
      >
        <ServiceForm
          value={form}
          errors={formErrors}
          onChange={setField}
          isEditing={!!editing}
        />
        {/* Public website note */}
        {form.status === "active" && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
            <Info size={13} className="mt-0.5 shrink-0" />
            <span>Ce service sera <strong>visible sur le site public</strong> une fois enregistré.</span>
          </div>
        )}
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
            Annuler
          </Button>
          <Button variant="primary" className="flex-1" loading={saving} onClick={handleSave}>
            {editing ? "Enregistrer les modifications" : "Créer le service"}
          </Button>
        </div>
      </Modal>

      <div className="space-y-5">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Gérez les services affichés sur{" "}
              <Link href="/service" target="_blank" className="inline-flex items-center gap-1 font-medium text-[#FF6B35] hover:underline">
                le site public <ExternalLink size={11} />
              </Link>
            </p>
          </div>
          <Button icon={Plus} onClick={openCreate}>Nouveau service</Button>
        </div>

        {/* ── STATUS SUMMARY CARDS ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([["all", "Tous", "text-[#0B1B3D]", "bg-slate-100"], ["active", "Actifs", "text-emerald-700", "bg-emerald-50"], ["inactive", "Inactifs", "text-amber-700", "bg-amber-50"], ["archived", "Archivés", "text-slate-500", "bg-slate-100"]] as const).map(([key, label, textClass, bgClass]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key as ServiceStatus | "all")}
              className={`rounded-[16px] border p-4 text-left transition hover:shadow-sm ${
                statusFilter === key
                  ? "border-[#FF6B35]/30 bg-[#FF6B35]/5 shadow-sm"
                  : "border-slate-100 bg-white"
              }`}
            >
              <p className={`text-2xl font-extrabold font-[family-name:var(--font-heading)] ${textClass}`}>
                {counts[key] ?? 0}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{label}</p>
              {statusFilter === key && (
                <div className="mt-1.5 h-0.5 w-8 rounded-full bg-[#FF6B35]" />
              )}
            </button>
          ))}
        </div>

        {/* ── TOOLBAR ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full max-w-sm">
            <SearchInput
              value={search}
              onChange={(v) => setSearch(v)}
              placeholder="Rechercher par nom, description…"
            />
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-xl border border-slate-200 overflow-hidden">
              {(["grid", "table"] as const).map((v) => {
                const Icon = v === "grid" ? LayoutGrid : List;
                return (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    aria-label={v === "grid" ? "Vue grille" : "Vue tableau"}
                    className={`flex h-9 w-9 items-center justify-center text-sm transition ${
                      view === v ? "bg-[#FF6B35] text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={15} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <ServicesSkeleton view={view} />
        ) : error ? (
          <Card>
            <CardBody>
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                  <BookOpen size={22} className="text-red-400" />
                </div>
                <p className="font-bold text-[#0B1B3D]">Erreur de chargement</p>
                <p className="mt-1 text-sm text-slate-400">Impossible de charger les services.</p>
                <Button variant="secondary" className="mt-4" onClick={load}>Réessayer</Button>
              </div>
            </CardBody>
          </Card>
        ) : sortedServices.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                icon={BookOpen}
                title={search || statusFilter !== "all" ? "Aucun résultat" : "Aucun service"}
                description={
                  search || statusFilter !== "all"
                    ? "Essayez un autre terme de recherche ou filtre."
                    : "Ajoutez le premier service de l'école pour qu'il apparaisse sur le site public."
                }
                action={
                  !search && statusFilter === "all"
                    ? <Button icon={Plus} onClick={openCreate}>Créer un service</Button>
                    : <Button variant="secondary" onClick={() => { setSearch(""); setStatusFilter("all"); }}>Réinitialiser les filtres</Button>
                }
              />
            </CardBody>
          </Card>
        ) : view === "grid" ? (
          /* ── GRID VIEW ── */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedServices.map((s, idx) => (
              <ServiceCard
                key={s.id}
                service={s}
                onEdit={() => openEdit(s)}
                onPreview={() => setPreviewService(s)}
                onArchive={() => setArchiveTarget(s)}
                onRestore={() => handleRestore(s)}
                onMoveUp={() => moveService(s.id, "up")}
                onMoveDown={() => moveService(s.id, "down")}
                isFirst={idx === 0}
                isLast={idx === sortedServices.length - 1}
              />
            ))}
          </div>
        ) : (
          /* ── TABLE VIEW ── */
          <Card>
            <div className="w-full overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <Th className="w-10">{"#"}</Th>
                    <Th>Service</Th>
                    <Th>Tranche d&apos;âge</Th>
                    <Th>Tarif</Th>
                    <Th>Horaires</Th>
                    <Th>Statut</Th>
                    <Th>Mis à jour</Th>
                    <Th className="w-36">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {sortedServices.map((s, idx) => {
                    const cfg = STATUS_CONFIG[s.status];
                    return (
                      <tr key={s.id} className={`group transition hover:bg-slate-50/40 ${s.status === "archived" ? "opacity-60" : ""}`}>
                        {/* Order + reorder */}
                        <Td>
                          <div className="flex flex-col items-center gap-0.5">
                            <button
                              onClick={() => moveService(s.id, "up")}
                              disabled={idx === 0}
                              className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition"
                              aria-label="Monter"
                            >
                              <ArrowUp size={11} />
                            </button>
                            <span className="text-[11px] font-bold text-slate-400">{s.order}</span>
                            <button
                              onClick={() => moveService(s.id, "down")}
                              disabled={idx === sortedServices.length - 1}
                              className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition"
                              aria-label="Descendre"
                            >
                              <ArrowDown size={11} />
                            </button>
                          </div>
                        </Td>

                        {/* Service name */}
                        <Td>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">
                              {s.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#0B1B3D] truncate">{s.title}</p>
                              <p className="text-[11px] text-slate-400 truncate max-w-[220px]">{s.description}</p>
                            </div>
                          </div>
                        </Td>

                        <Td>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            <Users size={10} /> {s.ageRange}
                          </span>
                        </Td>

                        <Td className="text-sm text-slate-500">{s.price ?? "—"}</Td>
                        <Td className="text-xs text-slate-500 max-w-[140px] truncate">{s.schedule ?? "—"}</Td>

                        <Td>
                          {/* Inline status toggle for active/inactive */}
                          {s.status !== "archived" ? (
                            <button
                              onClick={() => handleToggleStatus(s)}
                              className={`group/toggle flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                                s.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              }`}
                              title={s.status === "active" ? "Cliquer pour désactiver" : "Cliquer pour activer"}
                            >
                              <StatusDot active={s.status === "active"} />
                              {cfg.label}
                              <ChevronRight size={11} className="opacity-0 group-hover/toggle:opacity-100 transition" />
                            </button>
                          ) : (
                            <Badge variant="neutral">Archivé</Badge>
                          )}
                        </Td>

                        <Td className="text-xs text-slate-400 whitespace-nowrap">
                          {new Date(s.updatedAt).toLocaleDateString("fr-FR")}
                        </Td>

                        <Td>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setPreviewService(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0B1B3D] transition" aria-label="Aperçu" title="Aperçu">
                              <Eye size={14} />
                            </button>
                            <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0B1B3D] transition" aria-label="Modifier" title="Modifier">
                              <Pencil size={14} />
                            </button>
                            {s.status !== "archived" ? (
                              <button onClick={() => setArchiveTarget(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition" aria-label="Archiver" title="Archiver">
                                <Archive size={14} />
                              </button>
                            ) : (
                              <button onClick={() => handleRestore(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition" aria-label="Restaurer" title="Restaurer">
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
            {/* Footer: total */}
            <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
              {sortedServices.length} service{sortedServices.length !== 1 ? "s" : ""}
              {statusFilter !== "all" && ` · filtre : ${STATUS_CONFIG[statusFilter as ServiceStatus]?.label}`}
            </div>
          </Card>
        )}

        {/* ── PUBLIC SITE NOTE ── */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-blue-700">
          <Info size={13} className="mt-0.5 shrink-0" />
          <p>
            Seuls les services avec le statut <strong>Actif</strong> sont affichés sur le site public.
            Les modifications sont reflétées immédiatement.{" "}
            <Link href="/service" target="_blank" className="inline-flex items-center gap-1 font-semibold underline hover:text-blue-900">
              Voir la page services <ExternalLink size={10} />
            </Link>
          </p>
        </div>

      </div>
    </>
  );
}
