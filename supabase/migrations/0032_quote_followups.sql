-- 0032: Follow-up tracker for customers who were given a price on WhatsApp/email but have not confirmed.
-- Additive + idempotent. Nothing existing is touched.
CREATE TABLE IF NOT EXISTS public.quote_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text,
  customer_email text,
  pickup text,
  dropoff text,
  trip_date date,
  trip_time text,
  trip_type text,
  vehicle text,
  passengers text,
  luggage text,
  quoted_price numeric,
  currency text NOT NULL DEFAULT 'SAR',
  price_sent_at timestamptz,
  status text NOT NULL DEFAULT 'quoted' CHECK (status IN ('quoted','followed_up','confirmed','lost')),
  last_followup_at timestamptz,
  followup_count int NOT NULL DEFAULT 0,
  remind_days_before int NOT NULL DEFAULT 3,
  reminder_sent_at timestamptz,
  notes text,
  source_lead_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quote_followups_status_idx ON public.quote_followups (status);
CREATE INDEX IF NOT EXISTS quote_followups_trip_idx ON public.quote_followups (trip_date);
ALTER TABLE public.quote_followups ENABLE ROW LEVEL SECURITY;
