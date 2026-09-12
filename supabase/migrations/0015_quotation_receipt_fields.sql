-- 0015: receipt + review-invite tracking, and actual payment capture per ride.
-- Additive only — no backfill, no RLS/trigger changes.
alter table public.quotations
  add column if not exists receipt_sent_at timestamptz,
  add column if not exists review_invited_at timestamptz,
  add column if not exists actual_amount_paid numeric(10,2),
  add column if not exists payment_method_used text;
