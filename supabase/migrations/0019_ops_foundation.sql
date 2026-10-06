-- 0019: Ops foundation (additive + idempotent; nothing dropped or renamed).
-- clients, partners (profit-share), partner settlements, per-ride financial
-- columns, communication log, app settings. quotations stays the single
-- enquiry→quote→booking→ride spine (stage = status).

CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS clients_phone_uidx ON public.clients (phone) WHERE phone IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  phone text,
  default_share_pct numeric(5,2) NOT NULL DEFAULT 50,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.partner_settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id),
  direction text NOT NULL CHECK (direction IN ('received_from_partner','paid_to_partner')),
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  settled_on date NOT NULL DEFAULT current_date,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.communication_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE SET NULL,
  channel text NOT NULL DEFAULT 'email',
  template text NOT NULL,
  recipient text,
  bcc text,
  subject text,
  status text NOT NULL CHECK (status IN ('sent','failed')),
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS communication_log_quotation_idx ON public.communication_log (quotation_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id);
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS driver_cost numeric(10,2);
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS extra_cost numeric(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS partner_id uuid REFERENCES public.partners(id);
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS partner_share_pct numeric(5,2);
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS financial_status text NOT NULL DEFAULT 'n/a';
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS financial_note text;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS driver_name text;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS driver_phone text;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS vehicle_plate text;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS vehicle_detail text;
CREATE INDEX IF NOT EXISTS quotations_client_idx ON public.quotations (client_id);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY
