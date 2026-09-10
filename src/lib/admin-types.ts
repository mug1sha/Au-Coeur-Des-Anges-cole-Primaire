// ─────────────────────────────────────────────
// USERS & AUTH
// ─────────────────────────────────────────────

export type UserRole = "super_admin" | "admin" | "teacher" | "accountant" | "parent" | "content_manager";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Permission {
  resource: string;
  actions: ("read" | "write" | "delete" | "manage")[];
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ["*"],
  admin: ["dashboard", "services", "teachers", "announcements", "gallery", "website", "users", "settings", "activity"],
  teacher: ["dashboard", "announcements"],
  accountant: ["dashboard", "finance"],
  parent: [],
  content_manager: ["dashboard", "services", "teachers", "announcements", "gallery", "website"],
};

// ─────────────────────────────────────────────
// TEACHERS
// ─────────────────────────────────────────────

export type TeacherStatus = "active" | "inactive" | "archived";

export interface Teacher {
  id: string;
  /** Full display name */
  name: string;
  /** Job title shown publicly, e.g. "Éducatrice — Maternelle" */
  position: string;
  /** Subject / class, e.g. "Arts & Créativité" */
  subject: string;
  /** Short bio shown on the public website */
  bio?: string;
  /** Extended qualifications list */
  qualifications?: string[];
  /** Years of experience */
  experience?: number;
  /** Contact email — NOT shown publicly */
  email: string;
  /** Contact phone — NOT shown publicly */
  phone?: string;
  /** Path to uploaded avatar/photo */
  avatar?: string;
  /** ISO date string */
  joinedAt: string;
  /** Whether this teacher card is shown on the public About/Team page */
  publicVisible: boolean;
  /** Admin visibility / workflow status */
  status: TeacherStatus;
}

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────

export type ServiceStatus = "active" | "inactive" | "archived";

export interface Service {
  id: string;
  /** Display title shown on the public website */
  title: string;
  /** URL-safe slug, e.g. "creche", "maternelle" */
  slug: string;
  /** Short description (used in cards / list) */
  description: string;
  /** Extended description (optional, used in detail view) */
  longDescription?: string;
  /** Emoji or icon name key, e.g. "🍼" or "graduation-cap" */
  icon: string;
  /** Optional cover image path */
  image?: string;
  /** Target age range, e.g. "3 mois – 2 ans" */
  ageRange: string;
  /** Optional price label, e.g. "150 000 RWF / mois" */
  price?: string;
  /** Schedule / hours, e.g. "Lun–Ven, 07h00–17h30" */
  schedule?: string;
  /** Visibility status — archived records are never hard-deleted */
  status: ServiceStatus;
  /** Display order on the public website (ascending) */
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────

export type AnnouncementStatus = "draft" | "scheduled" | "published" | "archived";

export type AnnouncementCategory =
  | "general"
  | "academic"
  | "event"
  | "important"
  | "parents";

export const ANNOUNCEMENT_CATEGORY_LABELS: Record<AnnouncementCategory, string> = {
  general:   "Général",
  academic:  "Académique",
  event:     "Événement",
  important: "Important",
  parents:   "Parents",
};

export interface Announcement {
  id: string;
  /** Main headline */
  title: string;
  /** Rich HTML content (sanitised before rendering) */
  content: string;
  /** Optional short plain-text excerpt used in list cards */
  excerpt?: string;
  /** Category tag — controls the badge colour on the public site */
  category: AnnouncementCategory;
  /** Path to uploaded cover image */
  coverImage?: string;
  /** Current workflow status */
  status: AnnouncementStatus;
  /** ISO date-time when the announcement was (or will be) published */
  publishedAt?: string;
  /** ISO date-time — when set, the announcement auto-archives after this date */
  expiresAt?: string;
  /** If true, announcement is pinned at the top of the public list */
  pinned: boolean;
  /** Display name of the admin who created/last-edited this */
  author: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────

export type GalleryCategory = "espaces" | "activites" | "repos" | "evenements";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  albumId?: string;
  uploadedAt: string;
  size?: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  imageCount: number;
  createdAt: string;
}

// ─────────────────────────────────────────────
// FINANCE
// ─────────────────────────────────────────────

export type TransactionType = "revenue" | "expense";
export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money" | "check";
export type TransactionStatus = "pending" | "completed" | "cancelled";

/** Revenue categories */
export type RevenueCategory =
  | "frais_scolaires"
  | "inscription"
  | "cantine"
  | "transport"
  | "activites"
  | "autres";

export const REVENUE_CATEGORY_LABELS: Record<RevenueCategory, string> = {
  frais_scolaires: "Frais scolaires",
  inscription:     "Inscription",
  cantine:         "Cantine",
  transport:       "Transport",
  activites:       "Activités",
  autres:          "Autres",
};

/** Expense categories */
export type ExpenseCategoryKey =
  | "salaires"
  | "fournitures"
  | "cantine"
  | "infrastructure"
  | "electricite"
  | "eau"
  | "internet"
  | "transport"
  | "entretien"
  | "marketing"
  | "autres";

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategoryKey, string> = {
  salaires:       "Salaires",
  fournitures:    "Fournitures scolaires",
  cantine:        "Cantine",
  infrastructure: "Infrastructure",
  electricite:    "Électricité",
  eau:            "Eau",
  internet:       "Internet",
  transport:      "Transport",
  entretien:      "Entretien",
  marketing:      "Marketing",
  autres:         "Autres",
};

export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategoryKey, string> = {
  salaires:       "#FF6B35",
  fournitures:    "#463ACB",
  cantine:        "#22c55e",
  infrastructure: "#eab308",
  electricite:    "#8b5cf6",
  eau:            "#06b6d4",
  internet:       "#f97316",
  transport:      "#ec4899",
  entretien:      "#14b8a6",
  marketing:      "#a855f7",
  autres:         "#94a3b8",
};

export interface Revenue {
  id: string;
  description: string;
  amount: number;
  currency: string;
  category: RevenueCategory;
  /** Legacy string category — kept for backwards compat */
  categoryLabel?: string;
  studentName?: string;
  /** Invoice / receipt reference number */
  reference?: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  date: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  /** ID of the admin who recorded this */
  recordedBy?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  category: ExpenseCategoryKey;
  /** Legacy id field — kept for backwards compat */
  categoryId?: string;
  /** Legacy label — kept for backwards compat */
  categoryName?: string;
  vendor?: string;
  /** Invoice / receipt reference number */
  reference?: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  date: string;
  createdAt: string;
  updatedAt?: string;
  /** Path to uploaded receipt/document */
  receiptUrl?: string;
  notes?: string;
  /** ID of the admin who recorded this */
  recordedBy?: string;
}

/**
 * FinanceSummary is ALWAYS computed server-side.
 * Clients must never trust locally-calculated totals for financial reporting.
 */
export interface FinanceSummary {
  /** Computed at: ISO timestamp */
  computedAt: string;
  /** Total completed revenues for the requested period */
  totalRevenue: number;
  /** Total completed expenses for the requested period */
  totalExpenses: number;
  /** Net balance = totalRevenue - totalExpenses */
  balance: number;
  /** Pending revenue (not yet completed) */
  pendingRevenue: number;
  /** Pending expenses (not yet completed) */
  pendingExpenses: number;
  /** Revenue broken down by category */
  revenueByCategory: { category: RevenueCategory; label: string; amount: number; count: number }[];
  /** Expenses broken down by category */
  expenseByCategory: { category: ExpenseCategoryKey; label: string; amount: number; count: number; color: string }[];
  /** Monthly trend — last 6 months */
  monthlyTrend: { month: string; revenue: number; expenses: number; balance: number }[];
  /** Count of transactions */
  revenueCount: number;
  expenseCount: number;
}

export interface AccountingPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  closed: boolean;
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
}

// ─────────────────────────────────────────────
// AUDIT LOG
// ─────────────────────────────────────────────

export type AuditAction =
  | "login" | "logout"
  | "create" | "update" | "delete"
  | "publish" | "archive"
  | "upload" | "download"
  | "settings_change" | "role_change";

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────
// SCHOOL SETTINGS
// ─────────────────────────────────────────────

export interface SchoolSettings {
  schoolName: string;
  subtitle: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  academicYearStart: string;
  academicYearEnd: string;
  openingTime: string;
  closingTime: string;
  openDays: string[];
  whatsappNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

// ─────────────────────────────────────────────
// DASHBOARD — TRANSACTION (combined rev + expense for recent list)
// ─────────────────────────────────────────────

export type TransactionKind = "revenue" | "expense";

export interface DashboardTransaction {
  id: string;
  date: string;
  description: string;
  type: TransactionKind;
  category: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
}

// ─────────────────────────────────────────────
// DASHBOARD — ANNOUNCEMENT PREVIEW
// ─────────────────────────────────────────────

export interface DashboardAnnouncement {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  status: AnnouncementStatus;
}

// ─────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────

export interface DashboardStats {
  // KPIs
  totalStudents: number;
  totalTeachers: number;
  activeServices: number;
  publishedAnnouncements: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  revenueChange: number;
  expenseChange: number;
  balanceChange: number;
  teachersChange: number;
  servicesChange: number;
  announcementsChange: number;
  // Charts
  comparisonByMonth: { month: string; revenue: number; expenses: number }[];
  expenseByCategory: { category: string; amount: number; color: string }[];
  // Lists
  recentTransactions: DashboardTransaction[];
  recentAnnouncements: DashboardAnnouncement[];
  recentActivities: AuditLog[];
  // Legacy — kept for backwards compat with other pages
  pendingAnnouncements: number;
  revenueByMonth: { month: string; amount: number }[];
}

// ─────────────────────────────────────────────
// API RESPONSE WRAPPER
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
