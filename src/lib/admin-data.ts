/**
 * Admin data layer.
 * All functions return mock data with realistic shapes.
 * Replace each function body with real API/database calls when backend is ready.
 * The function signatures and return types must remain stable.
 */

import type {
  AdminUser, Teacher, Service, Announcement, GalleryImage, GalleryAlbum,
  Revenue, Expense, AccountingPeriod, AuditLog, SchoolSettings,
  DashboardStats, PaginatedResponse, PaginationParams,
  FinanceSummary, RevenueCategory, ExpenseCategoryKey,
} from "./admin-types";
import {
  REVENUE_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS,
} from "./admin-types";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function paginate<T>(items: T[], params: PaginationParams): PaginatedResponse<T> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const search = (params.search ?? "").toLowerCase();

  let filtered = items;
  if (search) {
    filtered = items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay();

  const comparisonByMonth = [
    { month: "Jan", revenue: 3_800_000, expenses: 1_620_000 },
    { month: "Fév", revenue: 3_950_000, expenses: 1_580_000 },
    { month: "Mar", revenue: 4_100_000, expenses: 1_710_000 },
    { month: "Avr", revenue: 3_900_000, expenses: 1_650_000 },
    { month: "Mai", revenue: 4_050_000, expenses: 1_760_000 },
    { month: "Jun", revenue: 4_250_000, expenses: 1_820_000 },
  ];

  const recentTransactions = [
    { id: "tx1", date: "2026-09-09", description: "Frais de scolarité – Crèche", type: "revenue" as const, category: "Scolarité", amount: 150_000, currency: "RWF", status: "completed" as const },
    { id: "tx2", date: "2026-09-09", description: "Salaires enseignants", type: "expense" as const, category: "Personnel", amount: 980_000, currency: "RWF", status: "completed" as const },
    { id: "tx3", date: "2026-09-08", description: "Frais de scolarité – Maternelle", type: "revenue" as const, category: "Scolarité", amount: 120_000, currency: "RWF", status: "completed" as const },
    { id: "tx4", date: "2026-09-07", description: "Fournitures scolaires", type: "expense" as const, category: "Fournitures", amount: 145_000, currency: "RWF", status: "completed" as const },
    { id: "tx5", date: "2026-09-07", description: "Frais d'inscription – Nouveau", type: "revenue" as const, category: "Inscription", amount: 50_000, currency: "RWF", status: "pending" as const },
    { id: "tx6", date: "2026-09-06", description: "Repas enfants – Semaine 1", type: "expense" as const, category: "Alimentation", amount: 87_000, currency: "RWF", status: "completed" as const },
    { id: "tx7", date: "2026-09-05", description: "Activités parascolaires", type: "revenue" as const, category: "Activités", amount: 30_000, currency: "RWF", status: "completed" as const },
    { id: "tx8", date: "2026-09-04", description: "Maintenance climatisation", type: "expense" as const, category: "Maintenance", amount: 65_000, currency: "RWF", status: "pending" as const },
  ];

  const recentAnnouncements = [
    { id: "a1", title: "Rentrée scolaire 2026", category: "Administratif", publishedAt: "2026-08-15", status: "published" as const },
    { id: "a2", title: "Réunion parents-enseignants", category: "Événement", publishedAt: "2026-09-01", status: "draft" as const },
    { id: "a3", title: "Inscription 2027 ouvertes", category: "Inscription", publishedAt: "2026-09-05", status: "draft" as const },
    { id: "a4", title: "Nouvelle activité : Yoga enfants", category: "Activités", publishedAt: "2026-09-08", status: "published" as const },
  ];

  return {
    // KPIs
    totalStudents: 87,
    totalTeachers: 24,
    activeServices: 8,
    publishedAnnouncements: 6,
    monthlyRevenue: 4_250_000,
    monthlyExpenses: 2_180_000,
    monthlyBalance: 2_070_000,
    revenueChange: 12.4,
    expenseChange: -3.1,
    balanceChange: 8.7,
    teachersChange: 0,
    servicesChange: 1,
    announcementsChange: 2,
    // Charts
    comparisonByMonth,
    expenseByCategory: [
      { category: "Salaires", amount: 980_000, color: "#FF6B35" },
      { category: "Fournitures", amount: 320_000, color: "#463ACB" },
      { category: "Cantine", amount: 280_000, color: "#22c55e" },
      { category: "Infrastructure", amount: 200_000, color: "#eab308" },
      { category: "Transport", amount: 150_000, color: "#8b5cf6" },
      { category: "Services", amount: 130_000, color: "#06b6d4" },
      { category: "Autres", amount: 120_000, color: "#94a3b8" },
    ],
    // Lists
    recentTransactions,
    recentAnnouncements,
    recentActivities: await getRecentAuditLogs(),
    // Legacy
    pendingAnnouncements: 2,
    revenueByMonth: comparisonByMonth.map((d) => ({ month: d.month, amount: d.revenue })),
  };
}

// ─────────────────────────────────────────────
// TEACHERS
// Mutable in-memory store — replace array mutations with DB calls.
// Sensitive fields (email, phone) must never be sent to public endpoints.
// ─────────────────────────────────────────────
// eslint-disable-next-line prefer-const
let MOCK_TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "Marie Uwimana",
    position: "Directrice Pédagogique",
    subject: "Direction & Maternelle",
    bio: "Éducatrice spécialisée petite enfance avec 12 ans d'expérience. Passionnée par le développement cognitif et affectif du jeune enfant.",
    qualifications: ["Licence en Sciences de l'Éducation", "Certificat en Éducation de la Petite Enfance", "Formation Montessori Niveau 1"],
    experience: 12,
    email: "marie@aucoeurddesanges.rw",
    phone: "+250 788 001 001",
    joinedAt: "2020-09-01",
    publicVisible: true,
    status: "active",
  },
  {
    id: "t2",
    name: "Jean-Paul Habimana",
    position: "Éducateur — Crèche",
    subject: "Crèche (3 mois – 2 ans)",
    bio: "Spécialiste du développement de l'enfant en bas âge. Il crée un environnement sécurisant et stimulant pour les tout-petits.",
    qualifications: ["Licence en Psychologie de l'Enfant", "Diplôme en Puériculture"],
    experience: 7,
    email: "jean@aucoeurddesanges.rw",
    phone: "+250 788 002 002",
    joinedAt: "2021-01-15",
    publicVisible: true,
    status: "active",
  },
  {
    id: "t3",
    name: "Aline Mukamana",
    position: "Enseignante — Arts & Créativité",
    subject: "Arts plastiques & Éveil créatif",
    bio: "Artiste et pédagogue, Aline transforme chaque atelier en voyage créatif. Elle croit fermement que l'art développe l'intelligence émotionnelle.",
    qualifications: ["Master en Arts Appliqués", "Certificat en Pédagogie par l'Art"],
    experience: 9,
    email: "aline@aucoeurddesanges.rw",
    phone: "+250 788 003 003",
    joinedAt: "2019-08-20",
    publicVisible: true,
    status: "active",
  },
  {
    id: "t4",
    name: "Eric Nshimiyimana",
    position: "Éducateur Musical",
    subject: "Éveil Musical & Percussions",
    bio: "Musicien professionnel reconverti en éducateur, Eric transmet sa passion pour la musique aux enfants dès leur plus jeune âge.",
    qualifications: ["Conservatoire National — Piano & Percussions", "Formation en Musicothérapie"],
    experience: 5,
    email: "eric@aucoeurddesanges.rw",
    phone: "+250 788 004 004",
    joinedAt: "2022-03-01",
    publicVisible: false,
    status: "inactive",
  },
  {
    id: "t5",
    name: "Claudine Ingabire",
    position: "Éducatrice — Motricité",
    subject: "Développement Moteur & Sport",
    bio: "Spécialiste en développement moteur et éducation physique. Elle accompagne chaque enfant dans la découverte de son corps et de ses capacités.",
    qualifications: ["Licence en STAPS — Éducation Physique", "Brevet d'État en Natation"],
    experience: 8,
    email: "claudine@aucoeurddesanges.rw",
    phone: "+250 788 005 005",
    joinedAt: "2021-09-01",
    publicVisible: true,
    status: "active",
  },
  {
    id: "t6",
    name: "Olivier Nkurunziza",
    position: "Enseignant — Maternelle Grande Section",
    subject: "Maternelle (5 – 6 ans)",
    bio: "Patient et rigoureux, Olivier prépare les enfants à l'entrée en primaire avec des méthodes ludiques et progressives.",
    qualifications: ["Master en Sciences de l'Éducation", "Spécialisation Préscolaire"],
    experience: 6,
    email: "olivier@aucoeurddesanges.rw",
    phone: "+250 788 006 006",
    joinedAt: "2022-08-01",
    publicVisible: true,
    status: "active",
  },
];

export async function getTeachers(params: PaginationParams = {}): Promise<PaginatedResponse<Teacher>> {
  await delay();
  return paginate(MOCK_TEACHERS, params);
}

export async function getTeacher(id: string): Promise<Teacher | null> {
  await delay();
  return MOCK_TEACHERS.find((t) => t.id === id) ?? null;
}

export async function createTeacher(data: Omit<Teacher, "id" | "joinedAt">): Promise<Teacher> {
  await delay(400);
  // Defence-in-depth validation (API routes validate too, but data layer validates as well)
  if (!data.name?.trim()) throw new Error("Le nom de l'enseignant(e) est requis.");
  if (!data.email?.trim()) throw new Error("L'email de l'enseignant(e) est requis.");
  if (!data.position?.trim()) throw new Error("Le poste est requis.");
  const teacher: Teacher = { ...data, id: `t${Date.now()}`, joinedAt: new Date().toISOString() };
  MOCK_TEACHERS.push(teacher);
  return teacher;
}

export async function updateTeacher(id: string, data: Partial<Omit<Teacher, "id" | "joinedAt">>): Promise<Teacher> {
  await delay(400);
  const idx = MOCK_TEACHERS.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Teacher not found");
  const updated: Teacher = { ...MOCK_TEACHERS[idx], ...data };
  MOCK_TEACHERS[idx] = updated;
  return updated;
}

export async function archiveTeacher(id: string): Promise<Teacher> {
  return updateTeacher(id, { status: "archived", publicVisible: false });
}

/** @deprecated Use archiveTeacher — hard delete is intentionally avoided. */
export async function deleteTeacher(id: string): Promise<void> {
  await archiveTeacher(id);
}

// ─────────────────────────────────────────────
// SERVICES
// Mutable in-memory store so reorders/edits persist within the session.
// Replace the array mutations with DB calls when a backend is connected.
// ─────────────────────────────────────────────
// eslint-disable-next-line prefer-const
let MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    title: "La Crèche",
    slug: "creche",
    description: "Un environnement chaleureux et sécurisé pour les tout-petits, favorisant leur développement sensoriel et affectif.",
    longDescription: "Notre crèche accueille les enfants dès 3 mois dans un cadre bienveillant conçu pour stimuler les sens et accompagner les premières étapes du développement. Équipe qualifiée, espaces adaptés et activités d'éveil.",
    icon: "🍼",
    ageRange: "3 mois – 2 ans",
    price: "150 000 RWF / mois",
    schedule: "Lun – Ven, 07h00 – 17h30",
    status: "active",
    order: 1,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "s2",
    title: "L'École Maternelle",
    slug: "maternelle",
    description: "Un cadre stimulant pour les 3–6 ans alliant jeu, apprentissage et épanouissement collectif.",
    longDescription: "La maternelle offre un programme structuré adapté au développement cognitif et émotionnel de l'enfant. Activités ludiques, préparation à la lecture et aux mathématiques, éveil à la créativité.",
    icon: "✏️",
    ageRange: "3 ans – 6 ans",
    price: "120 000 RWF / mois",
    schedule: "Lun – Ven, 07h30 – 16h30",
    status: "active",
    order: 2,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "s3",
    title: "Activités Parascolaires",
    slug: "parascolaires",
    description: "Musique, arts plastiques et motricité pour enrichir le parcours de chaque enfant après les cours.",
    longDescription: "Proposées en fin de journée, ces activités complémentaires permettent à l'enfant d'explorer d'autres disciplines : percussions, peinture, danse, yoga, expression corporelle.",
    icon: "🎨",
    ageRange: "Tous âges",
    price: "30 000 RWF / activité",
    schedule: "Lun, Mer, Ven — 16h30 – 17h30",
    status: "active",
    order: 3,
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "s4",
    title: "Accompagnement des Parents",
    slug: "accompagnement-parents",
    description: "Ateliers, réunions et ressources pour construire un véritable partenariat éducatif avec les familles.",
    longDescription: "Nous croyons que la famille est le premier pilier de l'éducation. Ce programme propose des conférences mensuelles, des ateliers pratiques et un accès à des ressources pédagogiques.",
    icon: "👨‍👩‍👧",
    ageRange: "Parents",
    schedule: "1 fois / mois",
    status: "inactive",
    order: 4,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-09-01T00:00:00Z",
  },
  {
    id: "s5",
    title: "Garderie du Soir",
    slug: "garderie-soir",
    description: "Service de garde étendu pour les familles ayant besoin d'une prise en charge après 17h30.",
    icon: "🌙",
    ageRange: "3 mois – 6 ans",
    price: "20 000 RWF / mois",
    schedule: "Lun – Ven, 17h30 – 19h00",
    status: "archived",
    order: 5,
    createdAt: "2022-09-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
];

export async function getServices(params: PaginationParams = {}): Promise<PaginatedResponse<Service>> {
  await delay();
  // Sort by order before paginating
  const sorted = [...MOCK_SERVICES].sort((a, b) => a.order - b.order);
  return paginate(sorted, params);
}

export async function getService(id: string): Promise<Service | null> {
  await delay();
  return MOCK_SERVICES.find((s) => s.id === id) ?? null;
}

export async function createService(data: Omit<Service, "id" | "createdAt" | "updatedAt">): Promise<Service> {
  await delay(400);
  // Defence-in-depth validation (API routes validate too, but data layer validates as well)
  if (!data.title?.trim()) throw new Error("Le nom du service est requis.");
  if (!data.slug?.trim()) throw new Error("Le slug du service est requis.");
  if (!data.description?.trim()) throw new Error("La description du service est requise.");
  if (!data.ageRange?.trim()) throw new Error("La tranche d'âge est requise.");
  const now = new Date().toISOString();
  const service: Service = { ...data, id: `s${Date.now()}`, createdAt: now, updatedAt: now };
  MOCK_SERVICES.push(service);
  return service;
}

export async function updateService(id: string, data: Partial<Omit<Service, "id" | "createdAt">>): Promise<Service> {
  await delay(400);
  const idx = MOCK_SERVICES.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Service not found");
  const updated: Service = { ...MOCK_SERVICES[idx], ...data, updatedAt: new Date().toISOString() };
  MOCK_SERVICES[idx] = updated;
  return updated;
}

export async function archiveService(id: string): Promise<Service> {
  return updateService(id, { status: "archived" });
}

export async function reorderServices(orderedIds: string[]): Promise<void> {
  await delay(300);
  orderedIds.forEach((id, idx) => {
    const i = MOCK_SERVICES.findIndex((s) => s.id === id);
    if (i !== -1) {
      MOCK_SERVICES[i] = { ...MOCK_SERVICES[i], order: idx + 1, updatedAt: new Date().toISOString() };
    }
  });
}

/** @deprecated Use archiveService instead. Hard delete is intentionally avoided. */
export async function deleteService(id: string): Promise<void> {
  await delay(300);
  // Soft-delete: archive instead of removing
  await archiveService(id);
}

// ─────────────────────────────────────────────
// ANNOUNCEMENTS
// Mutable in-memory store — replace array mutations with DB calls.
// ─────────────────────────────────────────────
// eslint-disable-next-line prefer-const
let MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "Rentrée scolaire 2026–2027",
    content: "<h2>Bienvenue pour cette nouvelle année scolaire&nbsp;!</h2><p>Nous avons le plaisir d'accueillir toutes les familles pour la rentrée scolaire <strong>2026–2027</strong>. Les classes reprennent le <strong>lundi 2 septembre 2026</strong>.</p><p>Merci de vous assurer que votre enfant est muni de son matériel scolaire et de sa tenue réglementaire.</p><ul><li>Crèche : accueil dès 7h00</li><li>Maternelle : accueil dès 7h30</li></ul><p>Nous vous souhaitons une excellente année scolaire pleine d'apprentissage et de joie&nbsp;!</p>",
    excerpt: "Les classes reprennent le lundi 2 septembre 2026. Informations pratiques pour les familles.",
    category: "academic",
    status: "published",
    publishedAt: "2026-08-15T08:00:00Z",
    pinned: true,
    author: "Directeur Admin",
    createdAt: "2026-08-10T09:00:00Z",
    updatedAt: "2026-08-15T08:00:00Z",
  },
  {
    id: "a2",
    title: "Réunion parents-enseignants — 20 septembre",
    content: "<p>Nous organisons une <strong>réunion parents-enseignants</strong> le <strong>samedi 20 septembre 2026 à 18h00</strong> dans la salle polyvalente de l'école.</p><p>Cette réunion sera l'occasion de&nbsp;:</p><ul><li>Rencontrer les enseignants de vos enfants</li><li>Découvrir le programme de l'année</li><li>Poser vos questions</li></ul><p>La présence de l'un des parents est fortement encouragée.</p>",
    excerpt: "Réunion le samedi 20 septembre à 18h00 — rencontrez les enseignants et découvrez le programme.",
    category: "event",
    status: "scheduled",
    publishedAt: "2026-09-12T08:00:00Z",
    pinned: false,
    author: "Directeur Admin",
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-01T10:00:00Z",
  },
  {
    id: "a3",
    title: "Inscriptions 2026–2027 ouvertes",
    content: "<p>Les <strong>inscriptions pour l'année scolaire 2026–2027</strong> sont désormais ouvertes.</p><p>Pour inscrire votre enfant, veuillez vous rendre au secrétariat avec les documents suivants&nbsp;:</p><ul><li>Acte de naissance (original + copie)</li><li>Carnet de santé à jour</li><li>Deux photos d'identité</li><li>Justificatif de domicile</li></ul><p>Les places sont limitées — inscrivez votre enfant dès maintenant&nbsp;!</p>",
    excerpt: "Inscriptions ouvertes pour l'année 2026-2027. Dossier complet à déposer au secrétariat.",
    category: "important",
    status: "draft",
    pinned: false,
    author: "Directeur Admin",
    createdAt: "2026-09-05T11:00:00Z",
    updatedAt: "2026-09-05T11:00:00Z",
  },
  {
    id: "a4",
    title: "Nouvelle activité : Yoga pour enfants",
    content: "<p>À partir du <strong>15 septembre 2026</strong>, l'école propose un nouvel atelier de <strong>yoga adapté aux enfants</strong> de 3 à 6 ans.</p><p>Séances chaque <strong>mercredi de 16h30 à 17h15</strong>, animées par une professeure certifiée.</p><p>Inscriptions au secrétariat — places limitées à 12 enfants par groupe.</p>",
    excerpt: "Nouvel atelier yoga chaque mercredi dès le 15 septembre — places limitées.",
    category: "general",
    status: "published",
    publishedAt: "2026-09-08T09:00:00Z",
    expiresAt: "2026-12-31T23:59:00Z",
    pinned: false,
    author: "Directeur Admin",
    createdAt: "2026-09-07T15:00:00Z",
    updatedAt: "2026-09-08T09:00:00Z",
  },
  {
    id: "a5",
    title: "Fermeture exceptionnelle — 25 septembre",
    content: "<p>L'école sera <strong>fermée exceptionnellement le jeudi 25 septembre 2026</strong> en raison d'une journée pédagogique.</p><p>Toutes les familles sont informées que la garderie ne sera pas disponible ce jour-là.</p><p>Nous nous excusons pour la gêne occasionnée.</p>",
    excerpt: "L'école sera fermée le 25 septembre pour journée pédagogique — pas de garderie.",
    category: "parents",
    status: "published",
    publishedAt: "2026-09-09T07:00:00Z",
    expiresAt: "2026-09-26T00:00:00Z",
    pinned: false,
    author: "Coordinatrice Admin",
    createdAt: "2026-09-09T07:00:00Z",
    updatedAt: "2026-09-09T07:00:00Z",
  },
];

export async function getAnnouncements(params: PaginationParams = {}): Promise<PaginatedResponse<Announcement>> {
  await delay();
  // Sort: pinned first, then by publishedAt/createdAt descending
  const sorted = [...MOCK_ANNOUNCEMENTS].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    const dateA = a.publishedAt ?? a.createdAt;
    const dateB = b.publishedAt ?? b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  return paginate(sorted, params);
}

/** Returns only published, non-expired announcements for the public website */
export async function getPublicAnnouncements(): Promise<Announcement[]> {
  await delay();
  const now = new Date();
  return MOCK_ANNOUNCEMENTS
    .filter((a) => {
      if (a.status !== "published") return false;
      if (a.expiresAt && new Date(a.expiresAt) < now) return false;
      if (a.publishedAt && new Date(a.publishedAt) > now) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime();
    });
}

export async function getAnnouncement(id: string): Promise<Announcement | null> {
  await delay();
  return MOCK_ANNOUNCEMENTS.find((a) => a.id === id) ?? null;
}

export async function createAnnouncement(data: Omit<Announcement, "id" | "createdAt" | "updatedAt">): Promise<Announcement> {
  await delay(400);
  const now = new Date().toISOString();
  const ann: Announcement = { ...data, id: `ann${Date.now()}`, createdAt: now, updatedAt: now };
  MOCK_ANNOUNCEMENTS.push(ann);
  return ann;
}

export async function updateAnnouncement(id: string, data: Partial<Omit<Announcement, "id" | "createdAt">>): Promise<Announcement> {
  await delay(400);
  const idx = MOCK_ANNOUNCEMENTS.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Announcement not found");
  const updated: Announcement = { ...MOCK_ANNOUNCEMENTS[idx], ...data, updatedAt: new Date().toISOString() };
  MOCK_ANNOUNCEMENTS[idx] = updated;
  return updated;
}

export async function archiveAnnouncement(id: string): Promise<Announcement> {
  return updateAnnouncement(id, { status: "archived", pinned: false });
}

/** Soft-delete: archive instead of removing. Hard delete intentionally avoided. */
export async function deleteAnnouncement(id: string): Promise<void> {
  await archiveAnnouncement(id);
}

// ─────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────
const MOCK_GALLERY: GalleryImage[] = [
  { id: "g1", src: "/images/hero.jpg", alt: "Enfants en activité", category: "activites", uploadedAt: "2026-09-01" },
  { id: "g2", src: "/images/school.jpg", alt: "L'école", category: "espaces", uploadedAt: "2026-09-01" },
  { id: "g3", src: "/images/creche.jpg", alt: "La crèche", category: "espaces", uploadedAt: "2026-09-01" },
  { id: "g4", src: "/images/maternelle.jpg", alt: "La maternelle", category: "activites", uploadedAt: "2026-09-01" },
  { id: "g5", src: "/gallery/home1.jpg", alt: "Activité", category: "activites", uploadedAt: "2026-08-20" },
  { id: "g6", src: "/gallery/home2.jpg", alt: "Espace jeu", category: "espaces", uploadedAt: "2026-08-20" },
  { id: "g7", src: "/gallery/home3.jpg", alt: "Atelier", category: "activites", uploadedAt: "2026-08-20" },
  { id: "g8", src: "/gallery/home4.jpg", alt: "Repos", category: "repos", uploadedAt: "2026-08-20" },
];

export async function getGalleryImages(params: PaginationParams = {}): Promise<PaginatedResponse<GalleryImage>> {
  await delay();
  return paginate(MOCK_GALLERY, params);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await delay(300);
  console.log("Delete gallery image", id);
}

// ─────────────────────────────────────────────
// REVENUES
// Mutable in-memory store — replace with DB calls.
// ─────────────────────────────────────────────
// eslint-disable-next-line prefer-const
let MOCK_REVENUES: Revenue[] = [
  { id: "r1",  description: "Frais scolaires – Crèche (Emma Mugenzi)",        amount: 150_000, currency: "RWF", category: "frais_scolaires", studentName: "Emma Mugenzi",       reference: "REV-2026-001", paymentMethod: "mobile_money",  status: "completed", date: "2026-09-01", createdAt: "2026-09-01T08:00:00Z", recordedBy: "u3" },
  { id: "r2",  description: "Frais scolaires – Maternelle (Lucas Ndayambaje)", amount: 120_000, currency: "RWF", category: "frais_scolaires", studentName: "Lucas Ndayambaje",   reference: "REV-2026-002", paymentMethod: "bank_transfer", status: "completed", date: "2026-09-02", createdAt: "2026-09-02T09:00:00Z", recordedBy: "u3" },
  { id: "r3",  description: "Inscription – Sofia Kantarama",                   amount:  50_000, currency: "RWF", category: "inscription",      studentName: "Sofia Kantarama",    reference: "REV-2026-003", paymentMethod: "cash",          status: "completed", date: "2026-09-03", createdAt: "2026-09-03T10:00:00Z", recordedBy: "u3" },
  { id: "r4",  description: "Frais scolaires – Crèche (Noah Bizimana)",        amount: 150_000, currency: "RWF", category: "frais_scolaires", studentName: "Noah Bizimana",       reference: "REV-2026-004", paymentMethod: "mobile_money",  status: "pending",   date: "2026-09-05", createdAt: "2026-09-05T11:00:00Z", recordedBy: "u3" },
  { id: "r5",  description: "Activités parascolaires (Zoe Muhawenimana)",       amount:  30_000, currency: "RWF", category: "activites",        studentName: "Zoe Muhawenimana",   reference: "REV-2026-005", paymentMethod: "cash",          status: "completed", date: "2026-09-06", createdAt: "2026-09-06T08:30:00Z", recordedBy: "u3" },
  { id: "r6",  description: "Cantine – Septembre (groupe A)",                  amount:  45_000, currency: "RWF", category: "cantine",                                             reference: "REV-2026-006", paymentMethod: "mobile_money",  status: "completed", date: "2026-09-06", createdAt: "2026-09-06T09:00:00Z", recordedBy: "u3" },
  { id: "r7",  description: "Transport scolaire – Septembre",                  amount:  25_000, currency: "RWF", category: "transport",                                           reference: "REV-2026-007", paymentMethod: "bank_transfer", status: "completed", date: "2026-09-07", createdAt: "2026-09-07T10:00:00Z", recordedBy: "u3" },
  { id: "r8",  description: "Inscription – Marc Habimana",                     amount:  50_000, currency: "RWF", category: "inscription",      studentName: "Marc Habimana",      reference: "REV-2026-008", paymentMethod: "cash",          status: "completed", date: "2026-09-08", createdAt: "2026-09-08T11:00:00Z", recordedBy: "u3" },
  { id: "r9",  description: "Frais scolaires – Maternelle (Ines Uwera)",       amount: 120_000, currency: "RWF", category: "frais_scolaires", studentName: "Ines Uwera",         reference: "REV-2026-009", paymentMethod: "bank_transfer", status: "pending",   date: "2026-09-08", createdAt: "2026-09-08T12:00:00Z", recordedBy: "u3" },
  { id: "r10", description: "Autres revenus – Don association parents",         amount:  80_000, currency: "RWF", category: "autres",                                             reference: "REV-2026-010", paymentMethod: "bank_transfer", status: "completed", date: "2026-09-09", createdAt: "2026-09-09T07:00:00Z", recordedBy: "u1" },
];

export async function getRevenues(params: PaginationParams = {}): Promise<PaginatedResponse<Revenue>> {
  await delay();
  const sorted = [...MOCK_REVENUES].sort((a, b) => b.date.localeCompare(a.date));
  return paginate(sorted, params);
}

export async function getRevenue(id: string): Promise<Revenue | null> {
  await delay();
  return MOCK_REVENUES.find((r) => r.id === id) ?? null;
}

export async function createRevenue(data: Omit<Revenue, "id" | "createdAt">): Promise<Revenue> {
  await delay(400);
  const rev: Revenue = { ...data, id: `r${Date.now()}`, createdAt: new Date().toISOString() };
  MOCK_REVENUES.push(rev);
  return rev;
}

export async function updateRevenue(id: string, data: Partial<Omit<Revenue, "id" | "createdAt">>): Promise<Revenue> {
  await delay(400);
  const idx = MOCK_REVENUES.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Revenue not found");
  const updated: Revenue = { ...MOCK_REVENUES[idx], ...data, updatedAt: new Date().toISOString() };
  MOCK_REVENUES[idx] = updated;
  return updated;
}

/** Soft-cancel: sets status to cancelled. Hard delete intentionally avoided for audit integrity. */
export async function deleteRevenue(id: string): Promise<void> {
  await updateRevenue(id, { status: "cancelled" });
}

// ─────────────────────────────────────────────
// EXPENSES
// Mutable in-memory store — replace with DB calls.
// ─────────────────────────────────────────────
// eslint-disable-next-line prefer-const
let MOCK_EXPENSES: Expense[] = [
  { id: "e1",  description: "Salaires enseignants – Septembre 2026",  amount: 980_000, currency: "RWF", category: "salaires",       vendor: "Interne",             reference: "DEP-2026-001", paymentMethod: "bank_transfer", status: "completed", date: "2026-09-01", createdAt: "2026-09-01T08:00:00Z", recordedBy: "u3" },
  { id: "e2",  description: "Fournitures scolaires – rentrée",        amount: 145_000, currency: "RWF", category: "fournitures",    vendor: "Papeterie Kigali",    reference: "DEP-2026-002", paymentMethod: "cash",          status: "completed", date: "2026-09-02", createdAt: "2026-09-02T09:00:00Z", recordedBy: "u3" },
  { id: "e3",  description: "Repas enfants – Semaine 1",              amount:  87_000, currency: "RWF", category: "cantine",        vendor: "Traiteur Local",      reference: "DEP-2026-003", paymentMethod: "cash",          status: "completed", date: "2026-09-05", createdAt: "2026-09-05T10:00:00Z", recordedBy: "u3" },
  { id: "e4",  description: "Maintenance climatisation",              amount:  65_000, currency: "RWF", category: "entretien",      vendor: "TechFroid SARL",      reference: "DEP-2026-004", paymentMethod: "mobile_money",  status: "pending",   date: "2026-09-07", createdAt: "2026-09-07T11:00:00Z", recordedBy: "u3" },
  { id: "e5",  description: "Facture électricité – Août 2026",        amount:  42_000, currency: "RWF", category: "electricite",    vendor: "REG/EUCL",            reference: "DEP-2026-005", paymentMethod: "bank_transfer", status: "completed", date: "2026-09-03", createdAt: "2026-09-03T08:00:00Z", recordedBy: "u3" },
  { id: "e6",  description: "Facture eau – Août 2026",                amount:  18_000, currency: "RWF", category: "eau",            vendor: "WASAC",               reference: "DEP-2026-006", paymentMethod: "bank_transfer", status: "completed", date: "2026-09-03", createdAt: "2026-09-03T08:30:00Z", recordedBy: "u3" },
  { id: "e7",  description: "Abonnement Internet – Septembre",        amount:  35_000, currency: "RWF", category: "internet",       vendor: "MTN Business",        reference: "DEP-2026-007", paymentMethod: "mobile_money",  status: "completed", date: "2026-09-01", createdAt: "2026-09-01T09:00:00Z", recordedBy: "u3" },
  { id: "e8",  description: "Transport visite pédagogique",           amount:  55_000, currency: "RWF", category: "transport",      vendor: "Hirwa Bus Co.",       reference: "DEP-2026-008", paymentMethod: "cash",          status: "completed", date: "2026-09-06", createdAt: "2026-09-06T10:00:00Z", recordedBy: "u3" },
  { id: "e9",  description: "Peinture & rénovation salle A",          amount: 120_000, currency: "RWF", category: "infrastructure", vendor: "Déco Kigali",         reference: "DEP-2026-009", paymentMethod: "bank_transfer", status: "pending",   date: "2026-09-08", createdAt: "2026-09-08T11:00:00Z", recordedBy: "u1" },
  { id: "e10", description: "Impression flyers rentrée",              amount:  28_000, currency: "RWF", category: "marketing",      vendor: "Print Express",       reference: "DEP-2026-010", paymentMethod: "cash",          status: "completed", date: "2026-09-04", createdAt: "2026-09-04T09:00:00Z", recordedBy: "u1" },
];

export async function getExpenses(params: PaginationParams = {}): Promise<PaginatedResponse<Expense>> {
  await delay();
  const sorted = [...MOCK_EXPENSES].sort((a, b) => b.date.localeCompare(a.date));
  return paginate(sorted, params);
}

export async function getExpense(id: string): Promise<Expense | null> {
  await delay();
  return MOCK_EXPENSES.find((e) => e.id === id) ?? null;
}

export async function createExpense(data: Omit<Expense, "id" | "createdAt">): Promise<Expense> {
  await delay(400);
  const exp: Expense = { ...data, id: `e${Date.now()}`, createdAt: new Date().toISOString() };
  MOCK_EXPENSES.push(exp);
  return exp;
}

export async function updateExpense(id: string, data: Partial<Omit<Expense, "id" | "createdAt">>): Promise<Expense> {
  await delay(400);
  const idx = MOCK_EXPENSES.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Expense not found");
  const updated: Expense = { ...MOCK_EXPENSES[idx], ...data, updatedAt: new Date().toISOString() };
  MOCK_EXPENSES[idx] = updated;
  return updated;
}

/** Soft-cancel for audit integrity. */
export async function deleteExpense(id: string): Promise<void> {
  await updateExpense(id, { status: "cancelled" });
}

// ─────────────────────────────────────────────
// FINANCE SUMMARY  (server-side calculation)
// This is the authoritative source of financial totals.
// Clients must call this API; they must not recalculate totals locally.
// ─────────────────────────────────────────────
export async function getFinanceSummary(
  startDate?: string,
  endDate?: string
): Promise<FinanceSummary> {
  await delay(300);

  const now = new Date();
  const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Filter to period
  const revs = MOCK_REVENUES.filter((r) => {
    const d = new Date(r.date);
    return d >= start && d <= end;
  });
  const exps = MOCK_EXPENSES.filter((e) => {
    const d = new Date(e.date);
    return d >= start && d <= end;
  });

  // Authoritative totals — only completed transactions count toward the balance
  const totalRevenue  = revs.filter((r) => r.status === "completed").reduce((s, r) => s + r.amount, 0);
  const totalExpenses = exps.filter((e) => e.status === "completed").reduce((s, e) => s + e.amount, 0);
  const pendingRevenue  = revs.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const pendingExpenses = exps.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0);

  // Revenue by category
  const revenueByCategory = (Object.keys(REVENUE_CATEGORY_LABELS) as RevenueCategory[]).map((cat) => ({
    category: cat,
    label: REVENUE_CATEGORY_LABELS[cat],
    amount: revs.filter((r) => r.category === cat && r.status === "completed").reduce((s, r) => s + r.amount, 0),
    count:  revs.filter((r) => r.category === cat && r.status === "completed").length,
  })).filter((c) => c.amount > 0);

  // Expense by category
  const expenseByCategory = (Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategoryKey[]).map((cat) => ({
    category: cat,
    label: EXPENSE_CATEGORY_LABELS[cat],
    amount: exps.filter((e) => e.category === cat && e.status === "completed").reduce((s, e) => s + e.amount, 0),
    count:  exps.filter((e) => e.category === cat && e.status === "completed").length,
    color:  EXPENSE_CATEGORY_COLORS[cat],
  })).filter((c) => c.amount > 0);

  // Monthly trend — 6 months ending at end of period
  const monthlyTrend: FinanceSummary["monthlyTrend"] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(end);
    d.setMonth(d.getMonth() - i);
    const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const mEnd   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const mLabel = mStart.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

    const mRev = MOCK_REVENUES
      .filter((r) => r.status === "completed" && new Date(r.date) >= mStart && new Date(r.date) <= mEnd)
      .reduce((s, r) => s + r.amount, 0);
    const mExp = MOCK_EXPENSES
      .filter((e) => e.status === "completed" && new Date(e.date) >= mStart && new Date(e.date) <= mEnd)
      .reduce((s, e) => s + e.amount, 0);

    monthlyTrend.push({ month: mLabel, revenue: mRev, expenses: mExp, balance: mRev - mExp });
  }

  return {
    computedAt: new Date().toISOString(),
    totalRevenue,
    totalExpenses,
    balance: totalRevenue - totalExpenses,
    pendingRevenue,
    pendingExpenses,
    revenueByCategory,
    expenseByCategory,
    monthlyTrend,
    revenueCount: revs.filter((r) => r.status === "completed").length,
    expenseCount: exps.filter((e) => e.status === "completed").length,
  };
}

// ─────────────────────────────────────────────
// AUDIT LOG — addAuditLog
// ─────────────────────────────────────────────
export async function addAuditLog(entry: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
  await delay(50);
  const log: AuditLog = {
    ...entry,
    id: `l${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  MOCK_LOGS.push(log);
  return log;
}

// ─────────────────────────────────────────────
// ACCOUNTING PERIODS
// ─────────────────────────────────────────────
const MOCK_PERIODS: AccountingPeriod[] = [
  { id: "p1", name: "Septembre 2026", startDate: "2026-09-01", endDate: "2026-09-30", closed: false, totalRevenue: 4250000, totalExpenses: 1820000, balance: 2430000 },
  { id: "p2", name: "Août 2026", startDate: "2026-08-01", endDate: "2026-08-31", closed: true, totalRevenue: 4050000, totalExpenses: 1750000, balance: 2300000 },
  { id: "p3", name: "Juillet 2026", startDate: "2026-07-01", endDate: "2026-07-31", closed: true, totalRevenue: 3900000, totalExpenses: 1680000, balance: 2220000 },
];

export async function getAccountingPeriods(): Promise<AccountingPeriod[]> {
  await delay();
  return MOCK_PERIODS;
}

// ─────────────────────────────────────────────
// ADMIN USERS
// ─────────────────────────────────────────────
const MOCK_USERS: AdminUser[] = [
  { id: "u1", name: "Directeur Admin", email: "admin@aucoeurddesanges.rw", role: "super_admin", active: true, createdAt: "2023-01-01", lastLogin: "2026-09-09T10:30:00Z" },
  { id: "u2", name: "Marie Uwimana", email: "marie@example.com", role: "teacher", active: true, createdAt: "2020-09-01", lastLogin: "2026-09-08T08:00:00Z" },
  { id: "u3", name: "Comptable Principale", email: "finance@example.com", role: "accountant", active: true, createdAt: "2021-06-01", lastLogin: "2026-09-09T09:00:00Z" },
  { id: "u4", name: "Coordinatrice Admin", email: "coord@example.com", role: "admin", active: true, createdAt: "2022-01-15", lastLogin: "2026-09-07T14:20:00Z" },
];

export async function getAdminUsers(params: PaginationParams = {}): Promise<PaginatedResponse<AdminUser>> {
  await delay();
  return paginate(MOCK_USERS, params);
}

export async function createAdminUser(data: Omit<AdminUser, "id" | "createdAt">): Promise<AdminUser> {
  await delay(400);
  return { ...data, id: `u${Date.now()}`, createdAt: new Date().toISOString() };
}

export async function updateAdminUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
  await delay(400);
  const existing = MOCK_USERS.find((u) => u.id === id);
  if (!existing) throw new Error("User not found");
  return { ...existing, ...data };
}

// ─────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────
// eslint-disable-next-line prefer-const
let MOCK_LOGS: AuditLog[] = [
  { id: "l1", userId: "u1", userName: "Directeur Admin", userRole: "super_admin", action: "login", resource: "auth", details: "Connexion réussie", ipAddress: "197.243.1.1", createdAt: "2026-09-09T10:30:00Z" },
  { id: "l2", userId: "u1", userName: "Directeur Admin", userRole: "super_admin", action: "create", resource: "announcement", resourceId: "a3", details: "Nouvelle annonce créée : Inscription 2027", createdAt: "2026-09-09T10:35:00Z" },
  { id: "l3", userId: "u3", userName: "Comptable Principale", userRole: "accountant", action: "create", resource: "revenue", resourceId: "r5", details: "Nouveau revenu enregistré : 30 000 RWF", createdAt: "2026-09-09T09:10:00Z" },
  { id: "l4", userId: "u2", userName: "Marie Uwimana", userRole: "teacher", action: "login", resource: "auth", details: "Connexion réussie", createdAt: "2026-09-08T08:00:00Z" },
  { id: "l5", userId: "u4", userName: "Coordinatrice Admin", userRole: "admin", action: "update", resource: "teacher", resourceId: "t4", details: "Statut enseignant mis à jour", createdAt: "2026-09-07T14:20:00Z" },
];

export async function getAuditLogs(params: PaginationParams = {}): Promise<PaginatedResponse<AuditLog>> {
  await delay();
  return paginate(MOCK_LOGS, params);
}

async function getRecentAuditLogs(): Promise<AuditLog[]> {
  return MOCK_LOGS.slice(0, 5);
}

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────
const MOCK_SETTINGS: SchoolSettings = {
  schoolName: "Au Coeur Des Anges",
  subtitle: "Crèche & Maternelle",
  tagline: "Grandir avec amour, apprendre avec joie.",
  email: "contact@example.com",
  phone: "+250 XXX XXX XXX",
  address: "Adresse de l'école",
  city: "Kigali",
  country: "Rwanda",
  currency: "RWF",
  academicYearStart: "2026-09-01",
  academicYearEnd: "2027-06-30",
  openingTime: "07:00",
  closingTime: "17:30",
  openDays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
  whatsappNumber: "+250000000000",
};

export async function getSchoolSettings(): Promise<SchoolSettings> {
  await delay();
  return MOCK_SETTINGS;
}

export async function updateSchoolSettings(data: Partial<SchoolSettings>): Promise<SchoolSettings> {
  await delay(400);
  return { ...MOCK_SETTINGS, ...data };
}
