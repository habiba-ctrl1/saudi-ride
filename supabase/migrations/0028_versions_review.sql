-- 0028: quotation version history + data review queue. Additive + idempotent.
-- quotation_versions rows are NEVER updated or deleted by the app: every price / validity / trip-detail change adds a new row.
-- Sends are linked through communication_log.quotation_version_id (no mutation of the version row).
-- review_flags: records whose real status cannot be proven from the data. Raising a flag never changes the booking.

CREATE TABLE IF NOT EXISTS public.quotation_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  version_no int NOT NULL,
  reason text NOT NULL,
  price numeric(10,2),
  currency text NOT NULL DEFAULT 'SAR',
  valid_until date,
  template_version text NOT NULL,
  fingerprint text NOT NULL,
  snapshot jsonb NOT NULL,
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (quotation_id, version_no)
);
CREATE INDEX IF NOT EXISTS quotation_versions_q_idx ON public.quotation_versions (quotation_id, version_no DESC);
ALTER TABLE public.quotation_versions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.communication_log ADD COLUMN IF NOT EXISTS quotation_version_id uuid REFERENCES public.quotation_versions(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.review_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  rule text NOT NULL,
  detail text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved')),
  resolution text,
  resolved_by text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (quotation_id, rule)
);
CREATE INDEX IF NOT EXISTS review_flags_open_idx ON public.review_flags (status);
ALTER TABLE public.review_flags ENABLE ROW LEVEL SECURITY
