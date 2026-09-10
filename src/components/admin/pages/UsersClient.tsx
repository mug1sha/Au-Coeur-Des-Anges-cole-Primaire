"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Shield, Users } from "lucide-react";
import { getAdminUsers, createAdminUser, updateAdminUser } from "@/lib/admin-data";
import type { AdminUser, UserRole } from "@/lib/admin-types";
import { ROLE_PERMISSIONS } from "@/lib/admin-types";
import {
  Card, CardBody, Button, Badge, EmptyState, Modal,
  Input, Select, Toggle, Skeleton, Pagination, SearchInput,
  useToast, StatusDot, Table, Th, Td,
} from "@/components/admin/ui";

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Administrateur",
  teacher: "Enseignant",
  accountant: "Comptable",
  parent: "Parent",
  content_manager: "Gestionnaire Contenu",
};

const ROLE_BADGE: Record<UserRole, "danger" | "warning" | "info" | "success" | "neutral"> = {
  super_admin: "danger",
  admin: "warning",
  teacher: "info",
  accountant: "success",
  parent: "neutral",
  content_manager: "info",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const EMPTY_FORM = {
  name: "", email: "", role: "teacher" as UserRole, active: true,
};
type FormState = typeof EMPTY_FORM;
type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): FormErrors {
  const errs: FormErrors = {};
  if (!f.name.trim()) errs.name = "Le nom est requis.";
  if (!f.email.trim()) errs.email = "L'email est requis.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = "Email invalide.";
  return errs;
}

export default function UsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [permOpen, setPermOpen] = useState(false);
  const [_selectedRole, _setSelectedRole] = useState<UserRole>("admin");
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const { show, ToastComponent } = useToast();

  const PAGE_SIZE = 10;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getAdminUsers({ page, pageSize: PAGE_SIZE, search });
    setUsers(res.data);
    setTotal(res.total);
    setLoading(false);
  }, [page, search]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(u: AdminUser) {
    setEditing(u);
    setForm({ name: u.name, email: u.email, role: u.role, active: u.active });
    setErrors({});
    setModalOpen(true);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  async function handleSave() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateAdminUser(editing.id, form);
        show("Utilisateur mis à jour.", "success");
      } else {
        await createAdminUser({ ...form, lastLogin: undefined });
        show("Utilisateur créé. Un email d'invitation sera envoyé (backend requis).", "success");
      }
      setModalOpen(false);
      load();
    } catch {
      show("Erreur lors de la sauvegarde.", "error");
    } finally {
      setSaving(false);
    }
  }

  const permDescriptions: Record<string, string> = {
    "*": "Accès complet à toutes les ressources",
    dashboard: "Tableau de bord",
    services: "Gestion des services",
    teachers: "Gestion des enseignants",
    announcements: "Gestion des annonces",
    gallery: "Gestion de la galerie",
    website: "Contenu du site web",
    finance: "Finance & comptabilité",
    users: "Gestion des utilisateurs",
    settings: "Paramètres de l'école",
    activity: "Journal d'activité",
  };

  return (
    <>
      {ToastComponent}

      {/* Permissions reference modal */}
      <Modal open={permOpen} onClose={() => setPermOpen(false)} title="Référentiel des rôles et permissions" width="max-w-2xl">
        <div className="space-y-4">
          {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([role, label]) => {
            const perms = ROLE_PERMISSIONS[role];
            return (
              <div key={role} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={ROLE_BADGE[role]}>{label}</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {perms.map((p) => (
                    <span key={p} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {permDescriptions[p] ?? p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
      >
        <div className="space-y-4">
          <Input id="usr-name" label="Nom complet" placeholder="Marie Dupont"
            value={form.name} onChange={(e) => setField("name", e.target.value)} error={errors.name} />
          <Input id="usr-email" label="Email" type="email" placeholder="marie@example.com"
            value={form.email} onChange={(e) => setField("email", e.target.value)} error={errors.email} />
          <Select id="usr-role" label="Rôle"
            value={form.role}
            onChange={(e) => setField("role", e.target.value as UserRole)}
            options={(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([v, l]) => ({ value: v, label: l }))}
          />
          <Toggle checked={form.active} onChange={(v) => setField("active", v)} label="Compte actif" />
          {!editing && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700">
              Un mot de passe temporaire sera généré et envoyé par email (backend requis).
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button variant="primary" className="flex-1" loading={saving} onClick={handleSave}>
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </div>
      </Modal>

      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full max-w-xs">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Rechercher un utilisateur…" />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" icon={Shield} onClick={() => setPermOpen(true)}>
              Permissions
            </Button>
            <Button icon={Plus} onClick={openCreate}>Nouvel utilisateur</Button>
          </div>
        </div>

        <Card>
          {loading ? (
            <CardBody className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </CardBody>
          ) : users.length === 0 ? (
            <CardBody>
              <EmptyState icon={Users} title="Aucun utilisateur"
                description="Créez le premier compte d'accès à l'administration."
                action={<Button icon={Plus} onClick={openCreate}>Créer un utilisateur</Button>}
              />
            </CardBody>
          ) : (
            <>
              <Table>
                <thead>
                  <tr>
                    <Th>Utilisateur</Th>
                    <Th>Rôle</Th>
                    <Th>Statut</Th>
                    <Th>Créé le</Th>
                    <Th>Dernière connexion</Th>
                    <Th className="w-20">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-xs font-bold text-white">
                            {initials(u.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#463ACB]">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <Badge variant={ROLE_BADGE[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1.5">
                          <StatusDot active={u.active} />
                          <span className="text-xs">{u.active ? "Actif" : "Inactif"}</span>
                        </div>
                      </Td>
                      <Td className="text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</Td>
                      <Td className="text-xs text-slate-400">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </Td>
                      <Td>
                        <button onClick={() => openEdit(u)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#463ACB]" aria-label="Modifier">
                          <Pencil size={14} />
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="border-t border-slate-100 px-4">
                <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
