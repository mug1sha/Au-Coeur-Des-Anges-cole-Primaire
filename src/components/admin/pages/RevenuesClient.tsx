"use client";

/**
 * RevenuesClient — full revenue management page.
 * - CRUD: create, edit, soft-delete (cancel)
 * - All 6 categories with labels
 * - Reference number field
 * - Status, date range, category filters
 * - Server-side summary via /api/finance/summary
 * - Audit logging on write operations
 * - Permission-aware UI (canWrite / canDelete)
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus, TrendingUp, Download, Pencil, Trash2, Filter,
  ChevronDown, X, Info, CheckCircle2, Clock, Ban,
  Receipt,
} from "lucide-react";
import {
  getRevenues, createRevenue, updateRevenue, deleteRevenue, addAuditLog,
} from "@/lib/admin-data";
import type { Revenue, RevenueCategory, PaymentMethod, TransactionStatus } from "@/lib/admin-types";
import { REVENUE_CATEGORY_LABELS } from "@/lib/admin-types";
import { getAdminSession } from "@/lib/admin-auth";
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

const STATUS_CFG: Record<TransactionStatus, {
  label: string; badge: "success" | "warning" | "neutral"; icon: React.ElementType;
}> = {
  completed: { label: "Complété",   badge: "success", icon: CheckCircle2 },
  pending:   { label: "En attente", badge: "warning", icon: Clock },
  cancelled: { label: "Annulé",     badge: "neutral", icon: Ban },
};

const REV_CATS = Object.entries(REVENUE_CATEGORY_LABELS) as [RevenueCategory, string][];

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " RWF";
}

// ─────────────────────────────────────────────
// FORM
// ─────────────────────────────────────────────
interface RevForm {
  description: string; amount: string; category: RevenueCategory;
  studentName: string; reference: string; paymentMethod: PaymentMethod;
  status: TransactionStatus; date: string; notes: string;
}
type RevErrors = Partial<Record<keyof RevForm, string>>;

const EMPTY: RevForm = {
  description: "", amount: "", category: "frais_scolaires",
  studentName: "", reference: "", paymentMethod: "mobile_money",
  status: "completed", date: new Date().toISOString().split("T")[0], notes: "",
};

function validate(f: RevForm): RevErrors {
  const e: RevErrors = {};
  if (!f.description.trim()) e.description = "Requis.";
  if (!f.amount || isNaN(Number(f.amount)) || Number(f.amount) <= 0) e.amount = "Montant invalide.";
  if (!f.date) e.date = "Requis.";
  return e;
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const PAGE_SIZE = 12;

export default function RevenuesClient() {
  const session = getAdminSession();
  const { canWrite, canDelete } = getFinancePermissions(session?.role);

  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [catFilter, setCatFilter] = useState<RevenueCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Revenue | null>(null);
  const [form, setFormState] = useState<RevForm>(EMPTY);
  const [errors, setErrors] = useState<RevErrors>({});
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Revenue | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { show, ToastComponent } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRevenues({ page, pageSize: PAGE_SIZE, search });
      setRevenues(res.data);
      setTotal(res.total);
    } finally { setLoading(false); }
  }, [page, search]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // Client-side filtering (display only — authoritative totals come from server)
  const filtered = useMemo(() => {
    return revenues.filter((r) => {
      if (catFilter !== "all" && r.category !== catFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (dateFrom && r.date < dateFrom) return false;
      if (dateTo && r.date > dateTo) return false;
      return true;
    });
  }, [revenues, catFilter, statusFilter, dateFrom, dateTo]);

  // Display-only totals (UI feedback only — not for official reporting)
  const displayTotal    = filtered.filter((r) => r.status === "completed").reduce((s, r) => s + r.amount, 0);
  const displayPending  = filtered.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const displayCount    = filtered.filter((r) => r.status === "completed").length;

  function setField<K extends keyof RevForm>(k: K, v: RevForm[K]) {
    setFormState((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  }

  function openCreate() {
    setEditing(null); setFormState(EMPTY); setErrors({}); setModalOpen(true);
  }

  function openEdit(r: Revenue) {
    setEditing(r);
    setFormState({
      description: r.description, amount: String(r.amount), category: r.category,
      studentName: r.studentName ?? "", reference: r.reference ?? "",
      paymentMethod: r.paymentMethod, status: r.status,
      date: r.date, notes: r.notes ?? "",
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
        studentName: form.studentName.trim() || undefined,
        reference: form.reference.trim() || undefined,
        paymentMethod: form.paymentMethod,
        status: form.status,
        date: form.date,
        notes: form.notes.trim() || undefined,
        recordedBy: session?.userId,
      };
      if (editing) {
        await updateRevenue(editing.id, payload);
        await addAuditLog({
          userId: session?.userId ?? "unknown",
          userName: session?.name ?? "Utilisateur",
          userRole: session?.role ?? "admin",
          action: "update",
          resource: "revenue",
          resourceId: editing.id,
          details: `Revenu modifié : ${payload.description} — ${fmt(payload.amount)}`,
        });
        show("Revenu mis à jour.", "success");
      } else {
        const created = await createRevenue(payload);
        await addAuditLog({
          userId: session?.userId ?? "unknown",
          userName: session?.name ?? "Utilisateur",
          userRole: session?.role ?? "admin",
          action: "create",
          resource: "revenue",
          resourceId: created.id,
          details: `Nouveau revenu : ${payload.description} — ${fmt(payload.amount)}`,
        });
        show("Revenu enregistré.", "success");
      }
      setModalOpen(false);
      load();
    } catch { show("Erreur lors de l'enregistrement.", "error"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRevenue(deleteTarget.id);
      await addAuditLog({
        userId: session?.userId ?? "unknown",
        userName: session?.name ?? "Utilisateur",
        userRole: session?.role ?? "admin",
        action: "delete",
        resource: "revenue",
        resourceId: deleteTarget.id,
        details: `Revenu annulé : ${deleteTarget.description} — ${fmt(deleteTarget.amount)}`,
      });
      show("Revenu annulé.", "success");
      setDeleteTarget(null);
      load();
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

      const res = await fetch(`/api/export/revenues?${params}`, {
        headers: { Authorization: `Bearer ${session?.token ?? ""}` },
      });
      if (!res.ok) { show("Erreur lors de l'export.", "error"); return; }

      if (format === "csv") {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `revenus_${new Date().toISOString().slice(0, 10)}.csv`;
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
        description="Le revenu sera marqué comme annulé. Cette action est enregistrée dans le journal d'audit."
        confirmLabel="Annuler le revenu"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Modifier le revenu" : "Enregistrer un revenu"}
        width="max-w-2xl"
      >
        <div className="max-h-[75vh] overflow-y-auto space-y-4 pr-1">
          <Input id="r-desc" label="Description *" placeholder="Ex : Frais scolaires — Crèche"
            value={form.description} onChange={(e) => setField("description", e.target.value)} error={errors.description} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="r-amount" label="Montant (RWF) *" type="number" min="0" placeholder="150000"
              value={form.amount} onChange={(e) => setField("amount", e.target.value)} error={errors.amount} />
            <Input id="r-ref" label="Référence / N° reçu"
              placeholder="REV-2026-001"
              value={form.reference} onChange={(e) => setField("reference", e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#463ACB]" htmlFor="r-cat">Catégorie</label>
              <select id="r-cat" value={form.category}
                onChange={(e) => setField("category", e.target.value as RevenueCategory)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#463ACB] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20">
                {REV_CATS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <Input id="r-student" label="Élève (optionnel)"
              placeholder="Nom de l'élève"
              value={form.studentName} onChange={(e) => setField("studentName", e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#463ACB]" htmlFor="r-method">Mode de paiement</label>
              <select id="r-method" value={form.paymentMethod}
                onChange={(e) => setField("paymentMethod", e.target.value as PaymentMethod)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#463ACB] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20">
                {Object.entries(METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#463ACB]" htmlFor="r-status">Statut</label>
              <select id="r-status" value={form.status}
                onChange={(e) => setField("status", e.target.value as TransactionStatus)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#463ACB] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20">
                <option value="completed">✅ Complété</option>
                <option value="pending">⏳ En attente</option>
                <option value="cancelled">❌ Annulé</option>
              </select>
            </div>
            <Input id="r-date" label="Date *" type="date"
              value={form.date} onChange={(e) => setField("date", e.target.value)} error={errors.date} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#463ACB]" htmlFor="r-notes">Notes</label>
            <textarea id="r-notes" rows={2} placeholder="Notes complémentaires…"
              value={form.notes} onChange={(e) => setField("notes", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#463ACB] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 resize-none" />
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
            <Info size={13} className="mt-0.5 shrink-0" />
            Les totaux officiels sont calculés côté serveur. Cette interface sert uniquement à la saisie.
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
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#463ACB]">Revenus</h1>
            <p className="mt-0.5 text-sm text-slate-500">Enregistrement et suivi des recettes</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" size="sm" icon={Download} onClick={() => handleExport("csv")}>CSV</Button>
            {canWrite && <Button icon={Plus} onClick={openCreate}>Nouveau revenu</Button>}
          </div>
        </div>

        {/* KPI cards — display only, labelled as such */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Complétés (affiché)", value: fmt(displayTotal), color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
            { label: "En attente", value: fmt(displayPending), color: "text-amber-700", bg: "bg-amber-50 border-amber-100" },
            { label: "Transactions", value: String(displayCount), color: "text-[#463ACB]", bg: "bg-white border-slate-100" },
            { label: "Résultats filtrés", value: String(filtered.length), color: "text-slate-500", bg: "bg-white border-slate-100" },
          ].map((kpi) => (
            <div key={kpi.label} className={`rounded-[16px] border p-4 shadow-sm ${kpi.bg}`}>
              <p className="text-xs text-slate-400">{kpi.label}</p>
              <p className={`mt-1 font-[family-name:var(--font-heading)] text-xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        {/* Filter panel */}
        {filtersOpen && (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Catégorie</label>
              <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as RevenueCategory | "all")}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                <option value="all">Toutes</option>
                {REV_CATS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Statut</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | "all")}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                <option value="all">Tous</option>
                <option value="completed">Complété</option>
                <option value="pending">En attente</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Du</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Au</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
            </div>
            {hasActiveFilters && (
              <div className="sm:col-span-2 lg:col-span-4">
                <button
                  onClick={() => { setCatFilter("all"); setStatusFilter("all"); setDateFrom(""); setDateTo(""); }}
                  className="flex items-center gap-1 text-xs text-[#FF6B35] hover:underline"
                >
                  <X size={12} /> Réinitialiser les filtres
                </button>
              </div>
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
              <EmptyState icon={TrendingUp} title="Aucun revenu"
                description="Commencez par enregistrer le premier paiement reçu."
                action={canWrite ? <Button icon={Plus} onClick={openCreate}>Ajouter un revenu</Button> : undefined}
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
                      <Th>Élève</Th>
                      <Th>Mode</Th>
                      <Th>Date</Th>
                      <Th>Statut</Th>
                      <Th className="text-right">Montant</Th>
                      {(canWrite || canDelete) && <Th className="w-20">Actions</Th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => {
                      const sc = STATUS_CFG[r.status];
                      return (
                        <tr key={r.id} className={`group transition hover:bg-slate-50/40 ${r.status === "cancelled" ? "opacity-50" : ""}`}>
                          <Td>
                            <div>
                              <p className="font-medium text-[#463ACB] max-w-[200px] truncate">{r.description}</p>
                              {r.notes && <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{r.notes}</p>}
                            </div>
                          </Td>
                          <Td>
                            {r.reference ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600">
                                <Receipt size={9} /> {r.reference}
                              </span>
                            ) : <span className="text-slate-300">—</span>}
                          </Td>
                          <Td>
                            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                              {REVENUE_CATEGORY_LABELS[r.category]}
                            </span>
                          </Td>
                          <Td className="text-sm text-slate-500">{r.studentName ?? "—"}</Td>
                          <Td className="text-xs text-slate-500">{METHOD_LABELS[r.paymentMethod]}</Td>
                          <Td className="text-xs text-slate-400">{new Date(r.date).toLocaleDateString("fr-FR")}</Td>
                          <Td>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              r.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                              r.status === "pending" ? "bg-amber-50 text-amber-700" :
                              "bg-slate-100 text-slate-500"
                            }`}>
                              <sc.icon size={10} /> {sc.label}
                            </span>
                          </Td>
                          <Td className={`text-right font-bold tabular-nums ${
                            r.status === "cancelled" ? "line-through text-slate-400" :
                            r.status === "pending" ? "text-amber-600" : "text-emerald-700"
                          }`}>
                            {fmt(r.amount)}
                          </Td>
                          {(canWrite || canDelete) && (
                            <Td>
                              <div className="flex items-center gap-1">
                                {canWrite && r.status !== "cancelled" && (
                                  <button onClick={() => openEdit(r)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#463ACB] transition" title="Modifier">
                                    <Pencil size={13} />
                                  </button>
                                )}
                                {canDelete && r.status !== "cancelled" && (
                                  <button onClick={() => setDeleteTarget(r)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition" title="Annuler">
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
                      <td colSpan={(canWrite || canDelete) ? 7 : 6} className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Total affiché (complétés)
                      </td>
                      <td className="px-4 py-3 text-right font-extrabold text-emerald-700 tabular-nums">{fmt(displayTotal)}</td>
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

        {/* Note */}
        <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          <Info size={13} className="mt-0.5 shrink-0" />
          <p>
            Les totaux affichés ici sont des indicateurs de la vue filtrée.
            Les <strong>totaux officiels</strong> pour la comptabilité sont calculés côté serveur et disponibles dans <strong>Comptabilité</strong> et <strong>Rapports</strong>.
          </p>
        </div>
      </div>
    </>
  );
}
