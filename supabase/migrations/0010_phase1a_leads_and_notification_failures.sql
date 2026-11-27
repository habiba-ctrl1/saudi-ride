-- Phase 1A — additive only. Two new tables owned by Prisma.
-- Idempotent: safe to run more than once. No existing table is touched.

CREATE TABLE IF NOT EXISTS leads (
  id             text PRIMARY KEY,
  origin         text NOT NULL,
  destination    text NOT NULL,
  trip_date      text,
  vehicle_type   text,
  quoted_price   double precision,
  currency       text NOT NULL DEFAULT 'SAR',
  locale         text,
  page_url       text,
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  utm_term       text,
  utm_content    text,
  source         text NOT NULL DEFAULT 'price_calculator',
  customer_name  text,
  customer_phone text,
  customer_email text,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON leads (created_at);

CREATE TABLE IF NOT EXISTS notification_failures (
  id          text PRIMARY KEY,
  channel     text NOT NULL,
  target      text,
  booking_ref text,
  subject     text,
  error       text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "notification_failures_created_at_idx" ON notification_failures (created_at);
