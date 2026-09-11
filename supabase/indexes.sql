-- ─────────────────────────────────────────────────────────────────────────────
-- Performance Indexes Migration
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Safe to run multiple times (uses CREATE INDEX IF NOT EXISTS)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── profiles ─────────────────────────────────────────────────────────────────
-- Email lookups during auth
CREATE INDEX IF NOT EXISTS idx_profiles_email      ON public.profiles(email);
-- Role-based queries in RLS policies (very frequent)
CREATE INDEX IF NOT EXISTS idx_profiles_role       ON public.profiles(role);
-- Active user filter
CREATE INDEX IF NOT EXISTS idx_profiles_active     ON public.profiles(active);

-- ── announcements ────────────────────────────────────────────────────────────
-- Status filter used on every public + admin query
CREATE INDEX IF NOT EXISTS idx_announcements_status       ON public.announcements(status);
-- Published-at for ordering
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON public.announcements(published_at DESC NULLS LAST);
-- Expiry filter for public endpoint
CREATE INDEX IF NOT EXISTS idx_announcements_expires_at   ON public.announcements(expires_at);
-- Pinned sort column
CREATE INDEX IF NOT EXISTS idx_announcements_pinned       ON public.announcements(pinned DESC);
-- Category filter
CREATE INDEX IF NOT EXISTS idx_announcements_category     ON public.announcements(category);
-- Composite: status + published_at (public query pattern)
CREATE INDEX IF NOT EXISTS idx_announcements_status_pub   ON public.announcements(status, published_at DESC NULLS LAST);

-- ── teachers ─────────────────────────────────────────────────────────────────
-- Status + public_visible (public site query)
CREATE INDEX IF NOT EXISTS idx_teachers_status         ON public.teachers(status);
CREATE INDEX IF NOT EXISTS idx_teachers_public_visible ON public.teachers(public_visible);
CREATE INDEX IF NOT EXISTS idx_teachers_status_visible ON public.teachers(status, public_visible);
-- Email unique lookup
CREATE INDEX IF NOT EXISTS idx_teachers_email         ON public.teachers(email);

-- ── services ─────────────────────────────────────────────────────────────────
-- Status filter (public shows active only)
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
-- Display order
CREATE INDEX IF NOT EXISTS idx_services_order  ON public.services("order" ASC);
-- Slug lookup
CREATE INDEX IF NOT EXISTS idx_services_slug   ON public.services(slug);
-- Composite: status + order (main query pattern)
CREATE INDEX IF NOT EXISTS idx_services_status_order ON public.services(status, "order" ASC);

-- ── revenues ─────────────────────────────────────────────────────────────────
-- Date range queries (most common finance query pattern)
CREATE INDEX IF NOT EXISTS idx_revenues_date          ON public.revenues(date DESC);
-- Status filter
CREATE INDEX IF NOT EXISTS idx_revenues_status        ON public.revenues(status);
-- Category breakdown for reports
CREATE INDEX IF NOT EXISTS idx_revenues_category      ON public.revenues(category);
-- Composite: status + date (authoritative total calculation)
CREATE INDEX IF NOT EXISTS idx_revenues_status_date   ON public.revenues(status, date DESC);
-- Recorded-by for user-specific queries
CREATE INDEX IF NOT EXISTS idx_revenues_recorded_by   ON public.revenues(recorded_by);

-- ── expenses ─────────────────────────────────────────────────────────────────
-- Date range queries
CREATE INDEX IF NOT EXISTS idx_expenses_date          ON public.expenses(date DESC);
-- Status filter
CREATE INDEX IF NOT EXISTS idx_expenses_status        ON public.expenses(status);
-- Category breakdown for reports
CREATE INDEX IF NOT EXISTS idx_expenses_category      ON public.expenses(category);
-- Composite: status + date (authoritative total calculation)
CREATE INDEX IF NOT EXISTS idx_expenses_status_date   ON public.expenses(status, date DESC);
-- Recorded-by
CREATE INDEX IF NOT EXISTS idx_expenses_recorded_by   ON public.expenses(recorded_by);

-- ── audit_logs ────────────────────────────────────────────────────────────────
-- User-specific audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id    ON public.audit_logs(user_id);
-- Resource queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource   ON public.audit_logs(resource);
-- Time-ordered audit trail
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
-- Composite: resource + created_at
CREATE INDEX IF NOT EXISTS idx_audit_logs_res_time   ON public.audit_logs(resource, created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- Finance summary optimisation: a partial index for the common
-- "completed revenues in a month" query pattern used by /api/finance/summary
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_revenues_completed ON public.revenues(date DESC)
  WHERE status = 'completed';

CREATE INDEX IF NOT EXISTS idx_expenses_completed ON public.expenses(date DESC)
  WHERE status = 'completed';
