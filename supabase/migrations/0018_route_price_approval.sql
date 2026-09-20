-- Price Book consolidation (2026-09-20): adds route-family grouping to
-- price_book_entries and a new route_price_approvals aggregate table for the
-- company approval workflow. Additive + idempotent. No existing row or table
-- is touched/deleted.

ALTER TABLE price_book_entries ADD COLUMN IF NOT EXISTS route_family text;
ALTER TABLE price_book_entries ADD COLUMN IF NOT EXISTS cross_border boolean NOT NULL DEFAULT false;
ALTER TABLE price_book_entries ADD COLUMN IF NOT EXISTS price_kind text NOT NULL DEFAULT 'CLIENT_OBSERVED';

CREATE INDEX IF NOT EXISTS price_book_entries_route_family_idx ON price_book_entries (route_family);

CREATE TABLE IF NOT EXISTS route_price_approvals (
  id                   text PRIMARY KEY,
  route_family         text NOT NULL,
  trip_type            text NOT NULL DEFAULT 'ONE_WAY',
  vehicle_category     text NOT NULL,
  cross_border         boolean NOT NULL DEFAULT false,
  country_from         text,
  country_to           text,
  lowest_observed      double precision,
  highest_observed     double precision,
  source_count         integer NOT NULL DEFAULT 0,
  pricing_status       text NOT NULL DEFAULT 'NEEDS_CONFIRMATION',
  final_approved_price double precision,
  approval_notes       text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (route_family, trip_type, vehicle_category)
);

CREATE INDEX IF NOT EXISTS route_price_approvals_cross_border_idx ON route_price_approvals (cross_border);
