-- ─────────────────────────────────────────────────────────────────────────────
-- Finance Aggregation Views
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- These views allow the API to use native PostgreSQL aggregation
-- instead of fetching all records and computing in JavaScript.
-- ─────────────────────────────────────────────────────────────────────────────

-- Monthly revenue summary
CREATE OR REPLACE VIEW public.v_monthly_revenue AS
SELECT
  DATE_TRUNC('month', date) AS month,
  category,
  SUM(amount) FILTER (WHERE status = 'completed') AS completed_amount,
  SUM(amount) FILTER (WHERE status = 'pending')   AS pending_amount,
  COUNT(*) FILTER (WHERE status = 'completed')    AS completed_count,
  COUNT(*) FILTER (WHERE status = 'pending')      AS pending_count
FROM public.revenues
GROUP BY DATE_TRUNC('month', date), category;

-- Monthly expense summary
CREATE OR REPLACE VIEW public.v_monthly_expense AS
SELECT
  DATE_TRUNC('month', date) AS month,
  category,
  SUM(amount) FILTER (WHERE status = 'completed') AS completed_amount,
  SUM(amount) FILTER (WHERE status = 'pending')   AS pending_amount,
  COUNT(*) FILTER (WHERE status = 'completed')    AS completed_count,
  COUNT(*) FILTER (WHERE status = 'pending')      AS pending_count
FROM public.expenses
GROUP BY DATE_TRUNC('month', date), category;

-- Finance summary totals (current month)
CREATE OR REPLACE VIEW public.v_finance_current_month AS
SELECT
  'revenue'  AS type,
  SUM(amount) FILTER (WHERE status = 'completed') AS total_completed,
  SUM(amount) FILTER (WHERE status = 'pending')   AS total_pending
FROM public.revenues
WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE)
UNION ALL
SELECT
  'expense'  AS type,
  SUM(amount) FILTER (WHERE status = 'completed') AS total_completed,
  SUM(amount) FILTER (WHERE status = 'pending')   AS total_pending
FROM public.expenses
WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE);

-- Note: Apply RLS to views if needed via security definer functions.
-- For now the underlying tables have RLS so direct queries are protected.
