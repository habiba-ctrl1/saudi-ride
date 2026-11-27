-- 0022: drivers directory + saved documents (additive + idempotent).
-- `partners` becomes the operational driver/vendor list: kind 'main' (Naimat, Sheraz, ... the people rides are
-- actually given to) vs 'local' (local drivers the owner has not worked with yet). Website applicants stay in
-- `drivers` (application/verification pipeline) and are shown in the same "Local & applicants" category in the UI.
-- documents = every receipt/quotation actually issued, with a frozen snapshot so it never changes later.

ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'main';
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS vehicle_info text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS routes text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS nationality text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS licence_note text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.partners DROP CONSTRAINT IF EXISTS partners_kind_check;
ALTER TABLE public.partners ADD CONSTRAINT partners_kind_check CHECK (kind IN ('main','local'));

CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('quotation','receipt')),
  number text NOT NULL,
  amount numeric(10,2),
  snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS documents_quotation_idx ON public.documents (quotation_id, created_at DESC);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY
