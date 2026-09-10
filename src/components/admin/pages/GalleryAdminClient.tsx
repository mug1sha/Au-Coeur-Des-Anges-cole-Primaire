"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Upload, Trash2, Image as ImageIcon, Filter, ShieldAlert } from "lucide-react";
import { getGalleryImages, deleteGalleryImage } from "@/lib/admin-data";
import type { GalleryImage, GalleryCategory } from "@/lib/admin-types";
import { ROLE_PERMISSIONS } from "@/lib/admin-types";
import { useAdminSession } from "@/lib/AdminSessionContext";
import {
  Card, CardBody, Button, Badge, EmptyState, Skeleton,
  Pagination, ConfirmDialog, SearchInput, useToast,
} from "@/components/admin/ui";

const CATEGORY_LABELS: Record<GalleryCategory | "all", string> = {
  all: "Toutes",
  espaces: "Espaces",
  activites: "Activités",
  repos: "Repos",
  evenements: "Événements",
};

const CATEGORY_BADGE: Record<GalleryCategory, "info" | "success" | "neutral" | "warning"> = {
  espaces: "info",
  activites: "success",
  repos: "neutral",
  evenements: "warning",
};

export default function GalleryAdminClient() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<GalleryCategory | "all">("all");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { show, ToastComponent } = useToast();

  const PAGE_SIZE = 12;

  // ── Session & permission ─────────────────
  const { session } = useAdminSession();
  const canAccess = session && (
    ROLE_PERMISSIONS[session.role]?.includes("*") ||
    ROLE_PERMISSIONS[session.role]?.includes("gallery")
  );

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getGalleryImages({ page, pageSize: PAGE_SIZE, search });
    const filtered = category === "all"
      ? res.data
      : res.data.filter((img) => img.category === category);
    setImages(filtered);
    setTotal(res.total);
    setLoading(false);
  }, [page, search, category]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(images.map((i) => i.id)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGalleryImage(deleteTarget.id);
      show("Image supprimée.", "success");
      setDeleteTarget(null);
      setSelected((prev) => { const n = new Set(prev); n.delete(deleteTarget.id); return n; });
      load();
    } catch {
      show("Erreur lors de la suppression.", "error");
    } finally {
      setDeleting(false);
    }
  }

  async function deleteSelected() {
    if (selected.size === 0) return;
    setDeleting(true);
    try {
      await Promise.all([...selected].map((id) => deleteGalleryImage(id)));
      show(`${selected.size} image(s) supprimée(s).`, "success");
      setSelected(new Set());
      load();
    } catch {
      show("Erreur lors de la suppression.", "error");
    } finally {
      setDeleting(false);
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
          Vous n&apos;avez pas les permissions nécessaires pour accéder à la galerie.
          Contactez un administrateur si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
        </p>
      </div>
    );
  }

  return (
    <>
      {ToastComponent}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer cette image ?"
        description="L'image sera définitivement supprimée de la galerie."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-60">
              <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Rechercher une image…" />
            </div>
            {/* Category filter */}
            <div className="flex items-center gap-1">
              <Filter size={14} className="text-slate-400 shrink-0" />
              <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs font-medium">
                {(["all", "espaces", "activites", "repos", "evenements"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`px-3 py-2 transition ${category === cat ? "bg-[#FF6B35] text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <>
                <span className="text-xs text-slate-500">{selected.size} sélectionnée(s)</span>
                <Button variant="danger" size="sm" icon={Trash2} onClick={deleteSelected} loading={deleting}>
                  Supprimer
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>Désélectionner</Button>
              </>
            )}
            {/* Upload button — triggers file input (backend needed for actual upload) */}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#F95738]">
              <Upload size={14} />
              Importer
              <input
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    show(`${e.target.files.length} fichier(s) prêts à être importés (backend requis).`, "info");
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Select all bar */}
        {images.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <button onClick={selectAll} className="hover:text-[#FF6B35] font-medium">Tout sélectionner</button>
            {selected.size > 0 && <button onClick={clearSelection} className="hover:text-[#FF6B35]">Désélectionner tout</button>}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[...Array(12)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
          </div>
        ) : images.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                icon={ImageIcon}
                title="Aucune image"
                description="Importez des photos pour alimenter la galerie de l'école."
                action={
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white">
                    <Upload size={14} /> Importer des images
                    <input type="file" multiple accept="image/*" className="sr-only" onChange={(e) => {
                      if (e.target.files?.length) show(`${e.target.files.length} fichier(s) prêts (backend requis).`, "info");
                    }} />
                  </label>
                }
              />
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {images.map((img) => (
              <div
                key={img.id}
                className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                  selected.has(img.id) ? "border-[#FF6B35]" : "border-transparent"
                }`}
                onClick={() => toggleSelect(img.id)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                />

                {/* Selection checkbox */}
                <div className={`absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-white/80 transition ${selected.has(img.id) ? "opacity-100 bg-[#FF6B35] border-[#FF6B35]" : "opacity-0 group-hover:opacity-100"}`}>
                  {selected.has(img.id) && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>

                {/* Category badge */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition">
                  <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                    {CATEGORY_LABELS[img.category]}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(img); }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
                  aria-label="Supprimer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <Card>
            <div className="px-4">
              <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
            </div>
          </Card>
        )}

        {/* Stats bar */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {(["espaces", "activites", "repos", "evenements"] as GalleryCategory[]).map((cat) => {
              const count = images.filter((i) => i.category === cat).length;
              return (
                <div key={cat} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs">
                  <Badge variant={CATEGORY_BADGE[cat]}>{CATEGORY_LABELS[cat]}</Badge>
                  <span className="font-semibold text-[#463ACB]">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
