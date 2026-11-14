-- Pricing book — durable record of real prices quoted to clients per
-- route + vehicle (from WhatsApp/chat negotiation), so admin can look up
-- "what did we quote last time" before quoting a new client.
-- Owned by Prisma (same pattern as contact_submissions/leads): no RLS needed
-- because Prisma connects via DATABASE_URL, not the RLS-restricted anon key.
-- Idempotent: safe to run more than once. No existing table is touched.

CREATE TABLE IF NOT EXISTS price_book_entries (
  id           text PRIMARY KEY,
  from_city    text NOT NULL,
  to_city      text NOT NULL,
  vehicle_type text NOT NULL,
  price        double precision NOT NULL,
  currency     text NOT NULL DEFAULT 'SAR',
  trip_type    text NOT NULL DEFAULT 'ONE_WAY',
  notes        text,
  source       text NOT NULL DEFAULT 'manual',
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS price_book_entries_route_idx ON price_book_entries (from_city, to_city);
CREATE INDEX IF NOT EXISTS price_book_entries_created_at_idx ON price_book_entries (created_at);
