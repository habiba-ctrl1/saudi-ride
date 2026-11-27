-- Batch 2 — durable persistence for /api/contact. Additive only.
-- Owned by Prisma (same pattern as leads/notification_failures, migration
-- 0010_phase1a_leads_and_notification_failures.sql): no RLS needed here
-- because Prisma connects via DATABASE_URL, not the RLS-restricted anon key.
-- Idempotent: safe to run more than once. No existing table is touched.

CREATE TABLE IF NOT EXISTS contact_submissions (
  id         text PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  phone      text,
  service    text,
  message    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions (created_at);
