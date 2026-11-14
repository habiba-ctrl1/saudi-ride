-- 0024: enquiries = people who only asked for a price (kept as history, NOT clients).
-- Source: owner's WhatsApp pricing log ("Saudi rides.docx"). Website-form enquiries stay in `leads` (read-only union in the UI).
-- Raw text is kept as written; nothing is interpreted beyond a coarse outcome. Additive + idempotent.

CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'whatsapp_log',
  seq_no text,
  client_name text,
  contact text,
  route_from text,
  route_to text,
  sedan_text text,
  staria_text text,
  gmc_text text,
  trip_type_text text,
  status_text text,
  reason text,
  notes text,
  outcome text NOT NULL DEFAULT 'unknown' CHECK (outcome IN ('won','lost','unknown')),
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS enquiries_source_seq_uidx ON public.enquiries (source, seq_no) WHERE seq_no IS NOT NULL;
CREATE INDEX IF NOT EXISTS enquiries_outcome_idx ON public.enquiries (outcome);
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY
