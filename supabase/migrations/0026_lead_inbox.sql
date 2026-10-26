-- 0026: Universal Lead Inbox. Additive + idempotent. Nothing existing is touched.
-- One row per incoming enquiry from any source. Website `leads` / `contact_submissions` are mirrored in
-- (external_key makes the mirror idempotent). Rows link to clients/quotations but never replace them.

CREATE SEQUENCE IF NOT EXISTS public.lead_ref_seq START 1;

CREATE TABLE IF NOT EXISTS public.lead_inbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('LD-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.lead_ref_seq')::text, 4, '0')),
  source text NOT NULL DEFAULT 'manual'
    CHECK (source IN ('website_form','website_quote','contact_form','email','manual','whatsapp_paste')),
  external_key text UNIQUE,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','unreviewed','contacted','awaiting_info','quotation_in_prep','quotation_sent','follow_up','confirmed','lost','converted')),
  customer_name text,
  customer_phone text,
  customer_email text,
  language text,
  pickup text,
  dropoff text,
  trip_date date,
  trip_time text,
  trip_type text,
  passengers int,
  luggage text,
  vehicle text,
  budget_text text,
  prior_quote_text text,
  preferences text,
  notes text,
  raw_text text,
  missing text[] NOT NULL DEFAULT '{}',
  group_key text,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE SET NULL,
  assigned_to text,
  next_followup date,
  processing_status text NOT NULL DEFAULT 'ok' CHECK (processing_status IN ('ok','failed')),
  processing_error text,
  received_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_inbox_status_idx ON public.lead_inbox (status);
CREATE INDEX IF NOT EXISTS lead_inbox_received_idx ON public.lead_inbox (received_at DESC);
CREATE INDEX IF NOT EXISTS lead_inbox_phone_idx ON public.lead_inbox (customer_phone);
CREATE INDEX IF NOT EXISTS lead_inbox_quotation_idx ON public.lead_inbox (quotation_id);

CREATE TABLE IF NOT EXISTS public.lead_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.lead_inbox(id) ON DELETE CASCADE,
  kind text NOT NULL,
  detail text,
  actor text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_activity_lead_idx ON public.lead_activity (lead_id, created_at);

ALTER TABLE public.lead_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activity ENABLE ROW LEVEL SECURITY
