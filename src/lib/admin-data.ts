/**
 * Admin data layer — all data-fetching functions used by the admin UI.
 *
 * Every function calls the corresponding REST API route using the browser's
 * cookie-based session (credentials: "include").  None of these run on the
 * server — they are client-side fetch helpers called from "use client"
 * components.
 *
 * Conventions:
 *  - GET  requests are sent with no body.
 *  - POST / PATCH / DELETE requests send JSON.
 *  - On HTTP error the function throws an Error with a French message
 *    so callers can surface it in a toast without any extra mapping.
 *  - snake_case → camelCase mapping is done here so the rest of the UI
 *    only ever sees the TypeScript interface fields.
 *  - List functions accept both `limit` and `pageSize` (alias) so that
 *    callers can use either convention.
 */

import type {
  Teacher,
  Service,
  Announcement,
  Revenue,
  Expense,
  GalleryImage,
  AdminUser,
  DashboardStats,
  AuditLog,
  AuditAction,
  SchoolSettings,
  AccountingPeriod,
  FinanceSummary,
} from "./admin-types";

// ─────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────

/** Unwrap a JSON response or throw on HTTP error. */
async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  const url = new URL(path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    });
  }
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as Record<string, string>).error ?? `Erreur ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as Record<string, string>).error ?? `Erreur ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as Record<string, string>).error ?? `Erreur ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function apiDelete(path: string): Promise<void> {
  const res = await fetch(path, { method: "DELETE", credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as Record<string, string>).error ?? `Erreur ${res.status}`);
  }
}

// ─────────────────────────────────────────────
// CAMELCASE MAPPERS
// ─────────────────────────────────────────────

type Row = Record<string, unknown>;

function mapAnnouncement(row: Row): Announcement {
  return {
    id:          row.id as string,
    title:       row.title as string,
    content:     row.content as string,
    excerpt:     row.excerpt as string | undefined,
    category:    row.category as Announcement["category"],
    coverImage:  (row.cover_image ?? row.coverImage) as string | undefined,
    status:      row.status as Announcement["status"],
    publishedAt: (row.published_at ?? row.publishedAt) as string | undefined,
    expiresAt:   (row.expires_at  ?? row.expiresAt)  as string | undefined,
    pinned:      row.pinned as boolean,
    author:      row.author as string,
    createdAt:   (row.created_at  ?? row.createdAt)  as string,
    updatedAt:   (row.updated_at  ?? row.updatedAt)  as string,
  };
}

function mapTeacher(row: Row): Teacher {
  return {
    id:            row.id as string,
    name:          row.name as string,
    position:      row.position as string,
    subject:       row.subject as string,
    bio:           row.bio as string | undefined,
    qualifications: row.qualifications as string[] | undefined,
    experience:    row.experience as number | undefined,
    email:         row.email as string,
    phone:         row.phone as string | undefined,
    avatar:        row.avatar as string | undefined,
    joinedAt:      (row.joined_at  ?? row.joinedAt)  as string,
    publicVisible: (row.public_visible ?? row.publicVisible) as boolean,
    status:        row.status as Teacher["status"],
  };
}

function mapService(row: Row): Service {
  return {
    id:              row.id as string,
    title:           row.title as string,
    slug:            row.slug as string,
    description:     row.description as string,
    longDescription: (row.long_description ?? row.longDescription) as string | undefined,
    icon:            row.icon as string,
    image:           row.image as string | undefined,
    ageRange:        (row.age_range ?? row.ageRange) as string,
    price:           row.price as string | undefined,
    schedule:        row.schedule as string | undefined,
    status:          row.status as Service["status"],
    order:           row.order as number,
    createdAt:       (row.created_at ?? row.createdAt) as string,
    updatedAt:       (row.updated_at ?? row.updatedAt) as string,
  };
}

function mapRevenue(row: Row): Revenue {
  return {
    id:            row.id as string,
    description:   row.description as string,
    amount:        row.amount as number,
    currency:      (row.currency ?? "RWF") as string,
    category:      row.category as Revenue["category"],
    studentName:   (row.student_name ?? row.studentName) as string | undefined,
    reference:     row.reference as string | undefined,
    paymentMethod: (row.payment_method ?? row.paymentMethod) as Revenue["paymentMethod"],
    status:        row.status as Revenue["status"],
    date:          row.date as string,
    createdAt:     (row.created_at ?? row.createdAt) as string,
    updatedAt:     (row.updated_at ?? row.updatedAt) as string | undefined,
    notes:         row.notes as string | undefined,
    recordedBy:    (row.recorded_by ?? row.recordedBy) as string | undefined,
  };
}

function mapExpense(row: Row): Expense {
  return {
    id:            row.id as string,
    description:   row.description as string,
    amount:        row.amount as number,
    currency:      (row.currency ?? "RWF") as string,
    category:      row.category as Expense["category"],
    vendor:        row.vendor as string | undefined,
    reference:     row.reference as string | undefined,
    paymentMethod: (row.payment_method ?? row.paymentMethod) as Expense["paymentMethod"],
    status:        row.status as Expense["status"],
    date:          row.date as string,
    createdAt:     (row.created_at ?? row.createdAt) as string,
    updatedAt:     (row.updated_at ?? row.updatedAt) as string | undefined,
    receiptUrl:    (row.receipt_url ?? row.receiptUrl) as string | undefined,
    notes:         row.notes as string | undefined,
    recordedBy:    (row.recorded_by ?? row.recordedBy) as string | undefined,
  };
}

function mapGalleryImage(row: Row): GalleryImage {
  return {
    id:         row.id as string,
    src:        row.src as string,
    alt:        row.alt as string,
    category:   row.category as GalleryImage["category"],
    albumId:    (row.album_id ?? row.albumId) as string | undefined,
    uploadedAt: (row.uploaded_at ?? row.uploadedAt) as string,
    size:       row.size as number | undefined,
  };
}

function mapAdminUser(row: Row): AdminUser {
  return {
    id:        row.id as string,
    name:      row.name as string,
    email:     row.email as string,
    role:      row.role as AdminUser["role"],
    avatar:    row.avatar as string | undefined,
    active:    row.active as boolean,
    createdAt: (row.created_at ?? row.createdAt) as string,
    lastLogin: (row.last_login  ?? row.lastLogin)  as string | undefined,
  };
}

function mapAuditLog(row: Row): AuditLog {
  return {
    id:         row.id as string,
    userId:     (row.user_id   ?? row.userId)   as string,
    userName:   (row.user_name ?? row.userName) as string,
    userRole:   (row.user_role ?? row.userRole) as AuditLog["userRole"],
    action:     row.action as AuditAction,
    resource:   row.resource as string,
    resourceId: (row.resource_id ?? row.resourceId) as string | undefined,
    details:    row.details as string | undefined,
    ipAddress:  (row.ip_address ?? row.ipAddress) as string | undefined,
    createdAt:  (row.created_at ?? row.createdAt) as string,
  };
}

// ─────────────────────────────────────────────
// PAGINATION RESULT
// ─────────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/** Resolve the effective page-size from `limit` or `pageSize` alias. */
function resolveLimit(limit?: number, pageSize?: number, defaultVal = 20): number {
  return limit ?? pageSize ?? defaultVal;
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────

/**
 * Aggregates all data needed for the admin dashboard.
 * Fetches finance summary + teachers + services + announcements in parallel
 * to avoid a request waterfall — then shapes the result to DashboardStats.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await apiGet<{ data: DashboardStats }>("/api/dashboard");
  return res.data;
}

// ─────────────────────────────────────────────
// TEACHERS
// ─────────────────────────────────────────────

export interface GetTeachersOptions {
  page?: number;
  limit?: number;
  /** Alias for limit — use either */
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function getTeachers(
  opts: GetTeachersOptions = {}
): Promise<{ data: Teacher[]; total: number }> {
  const params: Record<string, string | number | boolean> = {};
  if (opts.page)   params.page  = opts.page;
  const effectiveLimit = resolveLimit(opts.limit, opts.pageSize);
  params.limit = effectiveLimit;
  if (opts.search) params.search = opts.search;
  if (opts.status) params.status = opts.status;

  const res = await apiGet<{ data: Row[]; total?: number }>("/api/teachers", params);
  const data = (res.data ?? []).map(mapTeacher);
  return { data, total: res.total ?? data.length };
}

export async function createTeacher(payload: Partial<Teacher>): Promise<Teacher> {
  const { data } = await apiPost<{ data: Row }>("/api/teachers", payload);
  return mapTeacher(data);
}

export async function updateTeacher(id: string, payload: Partial<Teacher>): Promise<Teacher> {
  const { data } = await apiPatch<{ data: Row }>(`/api/teachers/${id}`, payload);
  return mapTeacher(data);
}

export async function archiveTeacher(id: string): Promise<Teacher> {
  const { data } = await apiPatch<{ data: Row }>(`/api/teachers/${id}`, { status: "archived" });
  return mapTeacher(data);
}

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────

export interface GetServicesOptions {
  page?: number;
  limit?: number;
  /** Alias for limit */
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function getServices(
  opts: GetServicesOptions = {}
): Promise<{ data: Service[]; total: number }> {
  const params: Record<string, string | number | boolean> = {};
  if (opts.page)   params.page  = opts.page;
  const effectiveLimit = resolveLimit(opts.limit, opts.pageSize);
  params.limit = effectiveLimit;
  if (opts.search) params.search = opts.search;
  if (opts.status) params.status = opts.status;

  const res = await apiGet<{ data: Row[]; total?: number }>("/api/services", params);
  const data = (res.data ?? []).map(mapService);
  return { data, total: res.total ?? data.length };
}

export async function createService(payload: Partial<Service>): Promise<Service> {
  const { data } = await apiPost<{ data: Row }>("/api/services", payload);
  return mapService(data);
}

export async function updateService(id: string, payload: Partial<Service>): Promise<Service> {
  const { data } = await apiPatch<{ data: Row }>(`/api/services/${id}`, payload);
  return mapService(data);
}

export async function archiveService(id: string): Promise<Service> {
  const { data } = await apiPatch<{ data: Row }>(`/api/services/${id}`, { status: "archived" });
  return mapService(data);
}

/**
 * Reorder services — sends an ordered array of IDs; the API updates the
 * `order` column for each record in a single batch operation.
 */
export async function reorderServices(orderedIds: string[]): Promise<void> {
  await apiPost("/api/services/reorder", { ids: orderedIds });
}

// ─────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────

export interface GetAnnouncementsOptions {
  page?: number;
  limit?: number;
  /** Alias for limit */
  pageSize?: number;
  status?: string;
  category?: string;
}

export async function getAnnouncements(
  opts: GetAnnouncementsOptions = {}
): Promise<PaginatedResult<Announcement>> {
  const params: Record<string, string | number | boolean> = {};
  if (opts.page) params.page = opts.page;
  params.limit = resolveLimit(opts.limit, opts.pageSize);
  if (opts.status)   params.status   = opts.status;
  if (opts.category) params.category = opts.category;

  const res = await apiGet<{
    data: Row[];
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  }>("/api/announcements", params);

  return {
    data:    (res.data ?? []).map(mapAnnouncement),
    total:   res.total   ?? 0,
    page:    res.page    ?? 1,
    limit:   res.limit   ?? 20,
    hasMore: res.hasMore ?? false,
  };
}

export async function createAnnouncement(payload: Partial<Announcement>): Promise<Announcement> {
  const { data } = await apiPost<{ data: Row }>("/api/announcements", payload);
  return mapAnnouncement(data);
}

export async function updateAnnouncement(
  id: string,
  payload: Partial<Announcement>
): Promise<Announcement> {
  const { data } = await apiPatch<{ data: Row }>(`/api/announcements/${id}`, payload);
  return mapAnnouncement(data);
}

export async function archiveAnnouncement(id: string): Promise<Announcement> {
  const { data } = await apiPatch<{ data: Row }>(`/api/announcements/${id}`, {
    status: "archived",
  });
  return mapAnnouncement(data);
}

// ─────────────────────────────────────────────
// FINANCE — SUMMARY
// ─────────────────────────────────────────────

export interface GetFinanceSummaryOptions {
  year?: number | string;
  month?: number | string;
  startDate?: string;
  endDate?: string;
}

/**
 * Fetches the server-computed finance summary.
 * Used by the export route and accounting page.
 */
export async function getFinanceSummary(
  opts: GetFinanceSummaryOptions = {}
): Promise<FinanceSummary> {
  const params: Record<string, string | number | boolean> = {};
  if (opts.year)      params.year      = opts.year;
  if (opts.month)     params.month     = opts.month;
  if (opts.startDate) params.startDate = opts.startDate;
  if (opts.endDate)   params.endDate   = opts.endDate;

  const res = await apiGet<{ data: FinanceSummary }>("/api/finance/summary", params);
  return res.data;
}

// ─────────────────────────────────────────────
// FINANCE — REVENUES
// ─────────────────────────────────────────────

export interface GetRevenuesOptions {
  page?: number;
  limit?: number;
  /** Alias for limit */
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  category?: string;
  search?: string;
}

export async function getRevenues(
  opts: GetRevenuesOptions = {}
): Promise<PaginatedResult<Revenue>> {
  const params: Record<string, string | number | boolean> = {};
  if (opts.page)      params.page      = opts.page;
  params.limit = resolveLimit(opts.limit, opts.pageSize);
  if (opts.startDate) params.startDate = opts.startDate;
  if (opts.endDate)   params.endDate   = opts.endDate;
  if (opts.status)    params.status    = opts.status;
  if (opts.category)  params.category  = opts.category;
  if (opts.search)    params.search    = opts.search;

  const res = await apiGet<{
    data: Row[];
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  }>("/api/finance/revenues", params);

  return {
    data:    (res.data ?? []).map(mapRevenue),
    total:   res.total   ?? 0,
    page:    res.page    ?? 1,
    limit:   res.limit   ?? 20,
    hasMore: res.hasMore ?? false,
  };
}

export async function createRevenue(payload: Partial<Revenue>): Promise<Revenue> {
  const { data } = await apiPost<{ data: Row }>("/api/finance/revenues", payload);
  return mapRevenue(data);
}

export async function updateRevenue(id: string, payload: Partial<Revenue>): Promise<Revenue> {
  const { data } = await apiPatch<{ data: Row }>(`/api/finance/revenues/${id}`, payload);
  return mapRevenue(data);
}

export async function deleteRevenue(id: string): Promise<void> {
  await apiDelete(`/api/finance/revenues/${id}`);
}

// ─────────────────────────────────────────────
// FINANCE — EXPENSES
// ─────────────────────────────────────────────

export interface GetExpensesOptions {
  page?: number;
  limit?: number;
  /** Alias for limit */
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  category?: string;
  search?: string;
}

export async function getExpenses(
  opts: GetExpensesOptions = {}
): Promise<PaginatedResult<Expense>> {
  const params: Record<string, string | number | boolean> = {};
  if (opts.page)      params.page      = opts.page;
  params.limit = resolveLimit(opts.limit, opts.pageSize);
  if (opts.startDate) params.startDate = opts.startDate;
  if (opts.endDate)   params.endDate   = opts.endDate;
  if (opts.status)    params.status    = opts.status;
  if (opts.category)  params.category  = opts.category;
  if (opts.search)    params.search    = opts.search;

  const res = await apiGet<{
    data: Row[];
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  }>("/api/finance/expenses", params);

  return {
    data:    (res.data ?? []).map(mapExpense),
    total:   res.total   ?? 0,
    page:    res.page    ?? 1,
    limit:   res.limit   ?? 20,
    hasMore: res.hasMore ?? false,
  };
}

export async function createExpense(payload: Partial<Expense>): Promise<Expense> {
  const { data } = await apiPost<{ data: Row }>("/api/finance/expenses", payload);
  return mapExpense(data);
}

export async function updateExpense(id: string, payload: Partial<Expense>): Promise<Expense> {
  const { data } = await apiPatch<{ data: Row }>(`/api/finance/expenses/${id}`, payload);
  return mapExpense(data);
}

export async function deleteExpense(id: string): Promise<void> {
  await apiDelete(`/api/finance/expenses/${id}`);
}

// ─────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────

export interface GetGalleryImagesOptions {
  page?: number;
  pageSize?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export async function getGalleryImages(
  opts: GetGalleryImagesOptions = {}
): Promise<{ data: GalleryImage[]; total: number }> {
  const params: Record<string, string | number | boolean> = {};
  if (opts.page)    params.page  = opts.page;
  params.limit = resolveLimit(opts.limit, opts.pageSize, 12);
  if (opts.search)   params.search   = opts.search;
  if (opts.category) params.category = opts.category;

  const res = await apiGet<{ data: Row[]; total?: number }>("/api/gallery", params);
  return {
    data:  (res.data ?? []).map(mapGalleryImage),
    total: res.total ?? 0,
  };
}

export async function uploadAdminFile(file: File, type: "avatar" | "gallery" | "receipt" | "cover") {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("type", type);
  const res = await fetch("/api/upload", { method: "POST", credentials: "include", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as { error?: string }).error ?? "Échec de l'upload.");
  return json as { url: string; persistUrl: string; path: string; bucket: string };
}

export async function createGalleryImage(payload: {
  src: string;
  alt: string;
  category: string;
  size?: number;
}): Promise<GalleryImage> {
  const { data } = await apiPost<{ data: Row }>("/api/gallery", payload);
  return mapGalleryImage(data);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await apiDelete(`/api/gallery/${id}`);
}

// ─────────────────────────────────────────────
// ADMIN USERS
// ─────────────────────────────────────────────

export interface GetAdminUsersOptions {
  page?: number;
  limit?: number;
  /** Alias for limit */
  pageSize?: number;
  search?: string;
}

export async function getAdminUsers(
  opts: GetAdminUsersOptions = {}
): Promise<{ data: AdminUser[]; total: number }> {
  const params: Record<string, string | number | boolean> = {};
  if (opts.page)   params.page  = opts.page;
  params.limit = resolveLimit(opts.limit, opts.pageSize);
  if (opts.search) params.search = opts.search;

  const res = await apiGet<{ data: Row[]; total?: number }>("/api/users", params);
  const data = (res.data ?? []).map(mapAdminUser);
  return { data, total: res.total ?? data.length };
}

export async function createAdminUser(
  payload: Partial<AdminUser> & { password?: string }
): Promise<AdminUser> {
  const { data } = await apiPost<{ data: Row }>("/api/users", payload);
  return mapAdminUser(data);
}

export async function updateAdminUser(id: string, payload: Partial<AdminUser>): Promise<AdminUser> {
  const { data } = await apiPatch<{ data: Row }>(`/api/users/${id}`, payload);
  return mapAdminUser(data);
}

// ─────────────────────────────────────────────
// ACCOUNTING PERIODS
// ─────────────────────────────────────────────

export async function getAccountingPeriods(): Promise<AccountingPeriod[]> {
  // Accounting periods are derived from the finance summary by year.
  // Build a simple list: one entry per month with available data.
  const currentYear = new Date().getFullYear();
  try {
    const summary = await getFinanceSummary({ year: currentYear });
    if (!summary) return [];

    // Turn monthly trend entries into AccountingPeriod objects
    return (summary.monthlyTrend ?? []).map((m, i) => {
      const parts = m.month.split(" ");
      const monthStr = parts[0];
      const yearStr  = parts[1] ?? "";
      const fullYear = yearStr ? parseInt("20" + yearStr, 10) : currentYear;
      const monthIndex = new Date(`${monthStr} 1 2000`).getMonth();
      const start = new Date(fullYear, monthIndex, 1).toISOString().split("T")[0];
      const end   = new Date(fullYear, monthIndex + 1, 0).toISOString().split("T")[0];

      return {
        id:            String(i + 1),
        name:          m.month,
        startDate:     start,
        endDate:       end,
        closed:        new Date(end) < new Date(),
        totalRevenue:  m.revenue,
        totalExpenses: m.expenses,
        balance:       m.balance,
      };
    });
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
// SCHOOL SETTINGS
// ─────────────────────────────────────────────

/** Fallback default settings when no DB record exists yet. */
const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName:        "Au Coeur Des Anges",
  subtitle:          "Crèche & École Maternelle",
  tagline:           "Un environnement chaleureux pour grandir avec amour et apprendre avec joie.",
  email:             "contact@aucoeurddesanges.rw",
  phone:             "+250 788 000 000",
  address:           "KG 123 St",
  city:              "Kigali",
  country:           "Rwanda",
  currency:          "RWF",
  academicYearStart: "09-01",
  academicYearEnd:   "06-30",
  openingTime:       "07:00",
  closingTime:       "17:30",
  openDays:          ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
};

export async function getSchoolSettings(): Promise<SchoolSettings> {
  const { data } = await apiGet<{ data: SchoolSettings | null }>("/api/settings");
  return data ?? DEFAULT_SETTINGS;
}

export async function updateSchoolSettings(settings: SchoolSettings): Promise<SchoolSettings> {
  const { data } = await apiPatch<{ data: SchoolSettings }>("/api/settings", settings);
  return data ?? settings;
}

// ─────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────

export interface GetAuditLogsOptions {
  page?: number;
  limit?: number;
  /** Alias for limit */
  pageSize?: number;
  userId?: string;
  resource?: string;
  action?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export async function getAuditLogs(
  opts: GetAuditLogsOptions = {}
): Promise<{ data: AuditLog[]; total: number }> {
  try {
    const params: Record<string, string | number | boolean> = {};
    if (opts.page)      params.page      = opts.page;
    params.limit = resolveLimit(opts.limit, opts.pageSize);
    if (opts.userId)    params.userId    = opts.userId;
    if (opts.resource)  params.resource  = opts.resource;
    if (opts.action)    params.action    = opts.action;
    if (opts.search)    params.search    = opts.search;
    if (opts.startDate) params.startDate = opts.startDate;
    if (opts.endDate)   params.endDate   = opts.endDate;

    const res = await apiGet<{ data: Row[]; total?: number }>("/api/audit-logs", params);
    return {
      data:  (res.data ?? []).map(mapAuditLog),
      total: res.total ?? 0,
    };
  } catch {
    return { data: [], total: 0 };
  }
}

/**
 * Appends an audit log entry.
 * Accepts the full AuditLog shape (minus id/createdAt) OR positional args.
 * Silently fails — audit logging must never block the primary action.
 */
export async function addAuditLog(
  entryOrAction:
    | AuditAction
    | Pick<AuditLog, "userId" | "userName" | "userRole" | "action" | "resource"> & {
        resourceId?: string;
        details?: string;
      },
  resource?: string,
  resourceId?: string,
  details?: string
): Promise<void> {
  try {
    // Object form: addAuditLog({ userId, userName, userRole, action, resource, ... })
    if (typeof entryOrAction === "object") {
      await apiPost("/api/audit-logs", entryOrAction);
    } else {
      // Positional form: addAuditLog("create", "teacher", id, details)
      await apiPost("/api/audit-logs", {
        action: entryOrAction,
        resource,
        resourceId,
        details,
      });
    }
  } catch {
    // Non-blocking — never propagate audit log errors to the user
  }
}
