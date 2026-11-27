-- 0025: verified ride reviews. One review per completed ride, collected via a signed link (/review?ref=..&k=..).
-- Nothing is shown publicly until the owner approves it. No aggregate rating is ever published (no AggregateRating schema).
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  quote_reference text NOT NULL,
  customer_name text NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','hidden')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS reviews_quotation_uidx ON public.reviews (quotation_id);
CREATE INDEX IF NOT EXISTS reviews_status_idx ON public.reviews (status);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY
