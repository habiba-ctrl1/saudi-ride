-- 0031: vendor ledger (private /vendor portal). Additive + idempotent. Independent of quotations/payments:
-- it tracks the owner's per-ride profit on rides fulfilled by vendor Asim, and what Asim has paid so far.
-- profit = quoted_amount - effective cost; effective cost = vendor_cost if set, else the route rate.

CREATE TABLE IF NOT EXISTS public.vendor_rates (
  route_key text PRIMARY KEY,           -- two city keys sorted alphabetically, e.g. 'doha-riyadh' (both directions share one rate)
  label text NOT NULL,
  cost numeric(10,2) NOT NULL CHECK (cost >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vendor_rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_no int NOT NULL UNIQUE,
  date_label text,                      -- as written on the paper list (e.g. '12-15 Oct'); exact day not always known
  route text NOT NULL,
  route_key text,
  client_phone text,
  quoted_amount numeric(10,2) NOT NULL CHECK (quoted_amount >= 0),
  vat boolean NOT NULL DEFAULT false,
  vendor_cost numeric(10,2) CHECK (vendor_cost >= 0),  -- NULL = use the route rate
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vendor_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  paid_at date,
  note text,
  recorded_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  voided_at timestamptz
);

ALTER TABLE public.vendor_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_payments ENABLE ROW LEVEL SECURITY;

INSERT INTO public.vendor_rates (route_key, label, cost) VALUES
  ('doha-riyadh', 'Riyadh ↔ Doha', 2000),
  ('dubai-riyadh', 'Riyadh ↔ Dubai', 3700),
  ('abudhabi-riyadh', 'Riyadh ↔ Abu Dhabi', 3500),
  ('bahrain-riyadh', 'Riyadh ↔ Bahrain', 1300),
  ('bahrain-dammam', 'Dammam ↔ Bahrain', 350)
ON CONFLICT (route_key) DO NOTHING
