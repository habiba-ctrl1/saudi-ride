-- 0030: website quote-form trip details on `leads`. Additive + idempotent; nothing existing is touched.
-- Owned by Prisma (same pattern as 0010). Apply this BEFORE (or with) deploying the form/API change;
-- the API falls back to a minimal insert if these columns are missing so a lead is never lost.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS trip_type        text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS passengers       text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS luggage          text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS flight_number    text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS return_date_time text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS hours_needed     text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes            text;
