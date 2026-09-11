"use client";

/**
 * ExpensesClient — full expense management page.
 * - CRUD: create, edit, soft-delete
 * - All 11 expense categories
 * - Reference + receipt upload
 * - Status, date range, category filters
 * - Audit logging
 * - Permission-aware UI
 */

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  Plus, TrendingDown, Download, Pencil, Trash2, Filter,
  ChevronDown, X, Info, CheckCircle2, Clock, Ban,
  Receipt, Paperclip,
} from "lucide-react";

function receiptHref(url?: string) {
  if (!url) return "#";
  if (url.startsWith("receipts/")) {
    return `/api/finance/receipts?path=${encodeURIComponent(url.slice("receipts/".length))}`;
  }
  return url;
}
import {
  getExpenses, createExpense, updateExpense, deleteExpense, addAuditLog,
} from "@/lib/admin-data";
import type { Expense, ExpenseCategoryKey, PaymentMethod, TransactionStatus } from "@/lib/admin-types";
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS } from "@/lib/admin-types";
import { useAdminSession } from "@/lib/AdminSessionContext";
import { getFinancePermissions } from "@/lib/finance-guard";
import {
  Card, CardBody, Button, EmptyState, Modal,
  Input, Skeleton, Pagination,
  ConfirmDialog, SearchInput, useToast, Table, Th, Td,
} from "@/components/admin/ui";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Espèces", bank_transfer: "Virement", mobile_money: "Mobile Money", check: "Chèque",
};

const STATUS_CFG: Record<TransactionStatus, { label: string; icon: React.ElementType }> = {
  completed: { label: "Complété",   icon: CheckCircle2 },
  pending:   { label: "En attente", icon: Clock },
  cancelled: { label: "Annulé",     icon: Ban },
};

const EXP_CATS = Object.entries(EXPENSE_CATEGORY_LABELS) as [ExpenseCategoryKey, string][];

function fmt(n: number) { return new Intl.NumberFormat("fr-FR").format(n) + " RWF"; }

// ─────────────────────────────────────────────
// FORM
// ─────────────────────────────────────────────
interface ExpForm {
  description: string; amount: string; category: ExpenseCategoryKey;
  vendor: string; reference: string; paymentMethod: PaymentMethod;
  status: TransactionStatus; date: string; receiptUrl: string; notes: string;
}
type ExpErrors = Partial<Record<keyof ExpForm, string>>;

const EMPTY: ExpForm = {
  description: "", amount: "", category: "salaires",
  vendor: "", reference: "", paymentMethod: "bank_transfer",
  status: "completed", date: new Date().toISOString().split("T")[0],
  receiptUrl: "", notes: "",
};

function validate(f: ExpForm): ExpErrors {
  const e: ExpErrors = {};
  if (!f.description.trim()) e.description = "Requis.";
  if (!f.amount || isNaN(Number(f.amount)) || Number(f.amount) <= 0) e.amount = "Montant invalide.";
  if (!f.date) e.date = "Requis.";
  return e;
}

// ─────────────────────────────────────────────
// CATEGORY DOT
// ─────────────────────────────────────────────
function CatDot({ cat }: { cat: ExpenseCategoryKey }) {
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: EXPENSE_CATEGORY_COLORS[cat] }} />;
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const PAGE_SIZE = 12;

export default function ExpensesClient() {
  const { session } = useAdminSession();
  const { canWrite, canDelete } = getFinancePermissions(session?.role);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [catFilter, setCatFilter] = useState<ExpenseCategoryKey | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form, setFormState] = useState<ExpForm>(EMPTY);
  const [errors, setErrors] = useState<ExpErrors>({});
  const [saving, setSaving] = useState(false);
  const [receiptUploading, setReceiptUploading] = useState(false);
  const receiptRef = useRef<HTMLInputElement>(null);

  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { show, ToastComponent } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getExpenses({ page, pageSize: PAGE_SIZE, search });
      setExpenses(res.data);
      setTotal(res.total);
    } finally { setLoading(false); }
  }, [page, search]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (catFilter !== "all" && e.category !== catFilter) return false;
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (dateFrom && e.date < dateFrom) return false;
      if (dateTo && e.date > dateTo) return false;
      return true;
    });
  }, [expenses, catFilter, statusFilter, dateFrom, dateTo]);

  const displayTotal   = filtered.filter((e) => e.status === "completed").reduce((s, e) => s + e.amount, 0);
  const displayPending = filtered.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0);

  // Category breakdown for display
  const catBreakdown = useMemo(() => {
    const map: Partial<Record<ExpenseCategoryKey, number>> = {};
    filtered.filter((e) => e.status === "completed").forEach((e) => {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    });
    return Object.entries(map)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 5) as [ExpenseCategoryKey, number][];
  }, [filtered]);

  function setField<K extends keyof ExpForm>(k: K, v: ExpForm[K]) {
    setFormState((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  }

  async function handleReceiptUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) { show("Fichier trop grand (max 5 Mo).", "error"); return; }
    setReceiptUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "receipt");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !(json.persistUrl || json.url)) { show(json.error ?? "Échec du téléchargement.", "error"); return; }
      setField("receiptUrl", json.persistUrl ?? json.url);
      show("Reçu téléchargé.", "success");
    } catch { show("Erreur réseau.", "error"); }
    finally { setReceiptUploading(false); }
  }

  function openCreate() { setEditing(null); setFormState(EMPTY); setErrors({}); setModalOpen(true); }

  function openEdit(e: Expense) {
    setEditing(e);
    setFormState({
      description: e.description, amount: String(e.amount), category: e.category,
      vendor: e.vendor ?? "", reference: e.reference ?? "",
      paymentMethod: e.paymentMethod, status: e.status,
      date: e.date, receiptUrl: e.receiptUrl ?? "", notes: e.notes ?? "",
    });
    setErrors({}); setModalOpen(true);
  }

  async function handleSave() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        description: form.description.trim(),
        amount: Number(form.amount),
        currency: "RWF",
        category: form.category,
        vendor: form.vendor.trim() || undefined,
        reference: form.reference.trim() || undefined,
        paymentMethod: form.paymentMethod,
        status: form.status,
        date: form.date,
        receiptUrl: form.receiptUrl || undefined,
        notes: form.notes.trim() || undefined,
        recordedBy: session?.userId,
      };
      if (editing) {
        await updateExpense(editing.id, payload);
        await addAuditLog({
          userId: session?.userId ?? "unknown",
          userName: session?.name ?? "Utilisateur",
          userRole: session?.role ?? "admin",
          action: "update", resource: "expense", resourceId: editing.id,
          details: `Dépense modifiée : ${payload.description} — ${fmt(payload.amount)}`,
        });
        show("Dépense mise à jour.", "success");
      } else {
        const created = await createExpense(payload);
        await addAuditLog({
          userId: session?.userId ?? "unknown",
          userName: session?.name ?? "Utilisateur",
          userRole: session?.role ?? "admin",
          action: "create", resource: "expense", resourceId: created.id,
          details: `Nouvelle dépense : ${payload.description} — ${fmt(payload.amount)}`,
        });
        show("Dépense enregistrée.", "success");
      }
      setModalOpen(false); load();
    } catch { show("Erreur.", "error"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteExpense(deleteTarget.id);
      await addAuditLog({
        userId: session?.userId ?? "unknown",
        userName: session?.name ?? "Utilisateur",
        userRole: session?.role ?? "admin",
        action: "delete", resource: "expense", resourceId: deleteTarget.id,
        details: `Dépense annulée : ${deleteTarget.description} — ${fmt(deleteTarget.amount)}`,
      });
      show("Dépense annulée.", "success");
      setDeleteTarget(null); load();
    } catch { show("Erreur.", "error"); }
    finally { setDeleting(false); }
  }

  async function handleExport(format: "csv" | "pdf") {
    try {
      const params = new URLSearchParams({ format });
      if (dateFrom) params.set("startDate", dateFrom);
      if (dateTo) params.set("endDate", dateTo);
      if (catFilter !== "all") params.set("category", catFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/export/expenses?${params}`, {
        headers: { Authorization: `Bearer ${session?.token ?? ""}` },
      });
      if (!res.ok) { show("Erreur lors de l'export.", "error"); return; }
      if (format === "csv") {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `depenses_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click(); URL.revokeObjectURL(url);
        show("Export CSV téléchargé.", "success");
      } else {
        show("Export PDF — intégration jsPDF requise.", "info");
      }
    } catch { show("Erreur réseau.", "error"); }
  }

  const hasActiveFilters = catFilter !== "all" || statusFilter !== "all" || dateFrom || dateTo;

  return (
    <>
      {ToastComponent}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Annuler "${deleteTarget?.description}" ?`}
        description="La dépense sera marquée comme annulée. Action auditée."
        confirmLabel="Annuler la dépense"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Modifier la dépense" : "Enregistrer une dépense"}
        width="max-w-2xl"
      >
        <div className="max-h-[75vh] overflow-y-auto space-y-4 pr-1">
          <Input id="e-desc" label="Description *"
            placeholder="Ex : Salaires enseignants – Septembre"
            value={form.description} onChange={(e) => setField("description", e.target.value)} error={errors.description} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="e-amount" label="Montant (RWF) *" type="number" min="0"
              value={form.amount} onChange={(e) => setField("amount", e.target.value)} error={errors.amount} />
            <Input id="e-ref" label="Référence / N° facture"
              placeholder="DEP-2026-001"
              value={form.reference} onChange={(e) => setField("reference", e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#463ACB]" htmlFor="e-cat">Catégorie</label>
              <select id="e-cat" value={form.category}
                onChange={(e) => setField("category", e.target.value as ExpenseCategoryKey)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#463ACB] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20">
                {EXP_CATS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <Input id="e-vendor" label="Fournisseur / Bénéficiaire"
              placeholder="Nom du fournisseur"
              value={form.vendor} onChange={(e) => setField("vendor", e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#463ACB]" htmlFor="e-method">Mode</label>
              <select id="e-method" value={form.paymentMethod}
                onChange={(e) => setField("paymentMethod", e.target.value as PaymentMethod)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#463ACB] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20">
                {Object.entries(METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#463ACB]" htmlFor="e-status">Statut</label>
              <select id="e-status" value={form.status}
                onChange={(e) => setField("status", e.target.value as TransactionStatus)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#463ACB] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20">
                <option value="completed">✅ Complété</option>
                <option value="pending">⏳ En attente</option>
                <option value="cancelled">❌ Annulé</option>
              </select>
            </div>
            <Input id="e-date" label="Date *" type="date"
              value={form.date} onChange={(e) => setField("date", e.target.value)} error={errors.date} />
          </div>

          {/* Receipt upload */}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-[#463ACB]">Reçu / Justificatif</p>
            <div className={`flex items-center gap-3 rounded-xl border border-dashed p-3 transition ${form.receiptUrl ? "border-emerald-300 bg-emerald-50" : "border-slate-200 hover:border-[#FF6B35]/30"}`}>
              {form.receiptUrl ? (
                <>
                  <Paperclip size={16} className="text-emerald-600 shrink-0" />
                  <a href={receiptHref(form.receiptUrl)} target="_blank" rel="noopener noreferrer"
                    className="flex-1 truncate text-sm text-emerald-700 hover:underline">
                    {form.receiptUrl.split("/").pop()}
                  </a>
                  <button onClick={() => setField("receiptUrl", "")}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition">
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <Paperclip size={16} className="text-slate-400 shrink-0" />
                  <span className="flex-1 text-sm text-slate-400">Aucun document joint</span>
                  <button type="button" onClick={() => receiptRef.current?.click()}
                    disabled={receiptUploading}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">
                    {receiptUploading ? "Téléchargement…" : "Joindre"}
                  </button>
                </>
              )}
              <input ref={receiptRef} type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleReceiptUpload(f); e.target.value = ""; }} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#463ACB]" htmlFor="e-notes">Notes</label>
            <textarea id="e-notes" rows={2}
              value={form.notes} onChange={(e) => setField("notes", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#463ACB] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 resize-none" />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button variant="primary" className="flex-1" loading={saving} onClick={handleSave}>
            {editing ? "Enregistrer" : "Créer"}
          </Button>
        </div>
      </Modal>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#463ACB]">Dépenses</h1>
            <p className="mt-0.5 text-sm text-slate-500">Suivi des sorties de caisse et dépenses opérationnelles</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" size="sm" icon={Download} onClick={() => handleExport("csv")}>CSV</Button>
            {canWrite && <Button icon={Plus} onClick={openCreate}>Nouvelle dépense</Button>}
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Total complétées", value: fmt(displayTotal), color: "text-red-700", bg: "bg-red-50 border-red-100" },
            { label: "En attente",       value: fmt(displayPending), color: "text-amber-700", bg: "bg-amber-50 border-amber-100" },
            { label: "Transactions",     value: String(filtered.filter((e) => e.status !== "cancelled").length), color: "text-[#463ACB]", bg: "bg-white border-slate-100" },
            { label: "Avec justificatif",value: String(filtered.filter((e) => e.receiptUrl).length), color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
          ].map((kpi) => (
            <div key={kpi.label} className={`rounded-[16px] border p-4 shadow-sm ${kpi.bg}`}>
              <p className="text-xs text-slate-400">{kpi.label}</p>
              <p className={`mt-1 font-[family-name:var(--font-heading)] text-xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Category mini breakdown */}
        {catBreakdown.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {catBreakdown.map(([cat, amount]) => (
              <div key={cat} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm text-xs">
                <CatDot cat={cat} />
                <span className="font-medium text-[#463ACB]">{EXPENSE_CATEGORY_LABELS[cat]}</span>
                <span className="text-slate-400">{fmt(amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 gap-2 items-center flex-wrap">
            <div className="w-full sm:max-w-xs">
              <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Rechercher…" />
            </div>
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                filtersOpen || hasActiveFilters ? "border-[#FF6B35]/30 bg-[#FF6B35]/5 text-[#FF6B35]" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Filter size={13} /> Filtres
              {hasActiveFilters && <span className="text-[#FF6B35]">·</span>}
              <ChevronDown size={12} className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filters */}
        {filtersOpen && (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Catégorie</label>
              <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as ExpenseCategoryKey | "all")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none">
                <option value="all">Toutes</option>
                {EXP_CATS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Statut</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | "all")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none">
                <option value="all">Tous</option>
                <option value="completed">Complété</option>
                <option value="pending">En attente</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Du</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Au</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none" />
            </div>
            {hasActiveFilters && (
              <button onClick={() => { setCatFilter("all"); setStatusFilter("all"); setDateFrom(""); setDateTo(""); }}
                className="flex items-center gap-1 text-xs text-[#FF6B35] hover:underline sm:col-span-2 lg:col-span-4">
                <X size={12} /> Réinitialiser
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <Card>
          {loading ? (
            <CardBody className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </CardBody>
          ) : filtered.length === 0 ? (
            <CardBody>
              <EmptyState icon={TrendingDown} title="Aucune dépense"
                action={canWrite ? <Button icon={Plus} onClick={openCreate}>Ajouter une dépense</Button> : undefined}
              />
            </CardBody>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <thead>
                    <tr>
                      <Th>Description</Th>
                      <Th>Référence</Th>
                      <Th>Catégorie</Th>
                      <Th>Fournisseur</Th>
                      <Th>Mode</Th>
                      <Th>Date</Th>
                      <Th>Statut</Th>
                      <Th>Reçu</Th>
                      <Th className="text-right">Montant</Th>
                      {(canWrite || canDelete) && <Th className="w-20">Actions</Th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => {
                      const sc = STATUS_CFG[e.status];
                      return (
                        <tr key={e.id} className={`group transition hover:bg-slate-50/40 ${e.status === "cancelled" ? "opacity-50" : ""}`}>
                          <Td>
                            <p className="font-medium text-[#463ACB] max-w-[180px] truncate">{e.description}</p>
                            {e.notes && <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{e.notes}</p>}
                          </Td>
                          <Td>
                            {e.reference ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-600">
                                <Receipt size={9} /> {e.reference}
                              </span>
                            ) : <span className="text-slate-300">—</span>}
                          </Td>
                          <Td>
                            <div className="flex items-center gap-1.5">
                              <CatDot cat={e.category} />
                              <span className="text-xs font-medium text-[#463ACB]">{EXPENSE_CATEGORY_LABELS[e.category]}</span>
                            </div>
                          </Td>
                          <Td className="text-sm text-slate-500">{e.vendor ?? "—"}</Td>
                          <Td className="text-xs text-slate-500">{METHOD_LABELS[e.paymentMethod]}</Td>
                          <Td className="text-xs text-slate-400">{new Date(e.date).toLocaleDateString("fr-FR")}</Td>
                          <Td>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              e.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                              e.status === "pending" ? "bg-amber-50 text-amber-700" :
                              "bg-slate-100 text-slate-500"
                            }`}>
                              <sc.icon size={10} /> {sc.label}
                            </span>
                          </Td>
                          <Td>
                            {e.receiptUrl ? (
                              <a href={receiptHref(e.receiptUrl)} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition">
                                <Paperclip size={11} /> Voir
                              </a>
                            ) : <span className="text-xs text-slate-300">—</span>}
                          </Td>
                          <Td className={`text-right font-bold tabular-nums ${
                            e.status === "cancelled" ? "line-through text-slate-400" :
                            e.status === "pending" ? "text-amber-600" : "text-red-700"
                          }`}>
                            {fmt(e.amount)}
                          </Td>
                          {(canWrite || canDelete) && (
                            <Td>
                              <div className="flex items-center gap-1">
                                {canWrite && e.status !== "cancelled" && (
                                  <button onClick={() => openEdit(e)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#463ACB] transition" title="Modifier">
                                    <Pencil size={13} />
                                  </button>
                                )}
                                {canDelete && e.status !== "cancelled" && (
                                  <button onClick={() => setDeleteTarget(e)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition" title="Annuler">
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                            </Td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={(canWrite || canDelete) ? 8 : 7} className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Total affiché (complétées)
                      </td>
                      <td className="px-4 py-3 text-right font-extrabold text-red-700 tabular-nums">{fmt(displayTotal)}</td>
                      {(canWrite || canDelete) && <td />}
                    </tr>
                  </tfoot>
                </Table>
              </div>
              <div className="border-t border-slate-100 px-4">
                <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
              </div>
            </>
          )}
        </Card>

        <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          <Info size={13} className="mt-0.5 shrink-0" />
          Les totaux affichés sont indicatifs. Les totaux officiels sont calculés côté serveur dans <strong>Comptabilité</strong> et <strong>Rapports</strong>.
        </div>
      </div>
    </>
  );
}
