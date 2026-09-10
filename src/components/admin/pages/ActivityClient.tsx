"use client";

import { useEffect, useState, useCallback } from "react";
import { Activity, Download } from "lucide-react";
import { getAuditLogs } from "@/lib/admin-data";
import type { AuditLog, AuditAction, UserRole } from "@/lib/admin-types";
import {
  Card, CardBody, Button, Badge, EmptyState, Skeleton,
  Pagination, SearchInput, useToast, Table, Th, Td,
} from "@/components/admin/ui";

const ACTION_LABELS: Record<AuditAction, string> = {
  login: "Connexion", logout: "Déconnexion",
  create: "Création", update: "Modification", delete: "Suppression",
  publish: "Publication", archive: "Archivage",
  upload: "Import", download: "Export",
  settings_change: "Paramètre", role_change: "Rôle modifié",
};

const ACTION_BADGE: Record<AuditAction, "success" | "info" | "warning" | "danger" | "neutral"> = {
  login: "success", logout: "neutral",
  create: "info", update: "warning", delete: "danger",
  publish: "success", archive: "neutral",
  upload: "info", download: "neutral",
  settings_change: "warning", role_change: "danger",
};

const RESOURCE_LABELS: Record<string, string> = {
  auth: "Authentification",
  announcement: "Annonce",
  teacher: "Enseignant",
  service: "Service",
  gallery: "Galerie",
  revenue: "Revenu",
  expense: "Dépense",
  user: "Utilisateur",
  settings: "Paramètres",
};

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  teacher: "Enseignant",
  accountant: "Comptable",
  parent: "Parent",
  content_manager: "Gestionnaire Contenu",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function relative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  return formatDateTime(iso);
}

export default function ActivityClient() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all");
  const [loading, setLoading] = useState(true);
  const { show, ToastComponent } = useToast();

  const PAGE_SIZE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getAuditLogs({ page, pageSize: PAGE_SIZE, search });
    const filtered = actionFilter === "all"
      ? res.data
      : res.data.filter((l) => l.action === actionFilter);
    setLogs(filtered);
    setTotal(res.total);
    setLoading(false);
  }, [page, search, actionFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const FILTER_OPTIONS: { value: AuditAction | "all"; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "login", label: "Connexions" },
    { value: "create", label: "Créations" },
    { value: "update", label: "Modifications" },
    { value: "delete", label: "Suppressions" },
  ];

  return (
    <>
      {ToastComponent}
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-64">
              <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Rechercher dans les logs…" />
            </div>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs font-medium">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setActionFilter(opt.value); setPage(1); }}
                  className={`px-3 py-2 transition ${actionFilter === opt.value ? "bg-[#FF6B35] text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <Button variant="secondary" icon={Download} onClick={() => show("Export (backend requis).", "info")}>
            Exporter
          </Button>
        </div>

        <Card>
          {loading ? (
            <CardBody className="space-y-3">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </CardBody>
          ) : logs.length === 0 ? (
            <CardBody>
              <EmptyState icon={Activity} title="Aucune activité"
                description="Les actions des utilisateurs apparaîtront ici."
              />
            </CardBody>
          ) : (
            <>
              <Table>
                <thead>
                  <tr>
                    <Th>Heure</Th>
                    <Th>Utilisateur</Th>
                    <Th>Rôle</Th>
                    <Th>Action</Th>
                    <Th>Ressource</Th>
                    <Th>Détails</Th>
                    <Th>IP</Th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <Td>
                        <div>
                          <p className="text-xs font-medium text-[#463ACB]">{relative(log.createdAt)}</p>
                          <p className="text-[10px] text-slate-400">{formatDateTime(log.createdAt)}</p>
                        </div>
                      </Td>
                      <Td>
                        <p className="font-medium text-sm text-[#463ACB]">{log.userName}</p>
                      </Td>
                      <Td>
                        <span className="text-xs text-slate-500">{ROLE_LABELS[log.userRole]}</span>
                      </Td>
                      <Td>
                        <Badge variant={ACTION_BADGE[log.action]}>
                          {ACTION_LABELS[log.action]}
                        </Badge>
                      </Td>
                      <Td>
                        <div>
                          <span className="text-xs font-medium text-[#463ACB]">
                            {RESOURCE_LABELS[log.resource] ?? log.resource}
                          </span>
                          {log.resourceId && (
                            <span className="ml-1 text-[10px] text-slate-400">#{log.resourceId}</span>
                          )}
                        </div>
                      </Td>
                      <Td className="max-w-xs">
                        <p className="truncate text-xs text-slate-500">{log.details ?? "—"}</p>
                      </Td>
                      <Td>
                        <span className="font-mono text-[10px] text-slate-400">{log.ipAddress ?? "—"}</span>
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
