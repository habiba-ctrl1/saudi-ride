-- 0027: payments ledger. Additive + idempotent. One row per payment actually received.
-- quotations.actual_amount_paid / payment_status / payment_method_used stay as the denormalised result
-- (sum of non-voided payments), so every existing report keeps working. Payments are never deleted, only voided.
-- Backfill: each ride that already has actual_amount_paid > 0 gets ONE legacy payment row (date unknown -> NULL, never invented).

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'SAR',
  method text,
  reference text,
  paid_at date,
  closes_balance boolean NOT NULL DEFAULT false,
  note text,
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','legacy_backfill')),
  recorded_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  voided_at timestamptz,
  void_reason text
);
CREATE INDEX IF NOT EXISTS payments_quotation_idx ON public.payments (quotation_id, created_at);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL;

INSERT INTO public.payments (quotation_id, amount, currency, method, paid_at, closes_balance, note, source, recorded_by)
SELECT q.id, q.actual_amount_paid, COALESCE(q.currency,'SAR'), q.payment_method_used, NULL,
       (q.payment_status::text = 'paid' AND (q.quoted_price IS NULL OR q.actual_amount_paid < q.quoted_price)),
       'Backfilled from the single paid amount recorded before the payments ledger existed (payment date was not recorded).', 'legacy_backfill', 'migration 0027'
FROM public.quotations q
WHERE q.actual_amount_paid IS NOT NULL AND q.actual_amount_paid > 0
  AND NOT EXISTS (SELECT 1 FROM public.payments p WHERE p.quotation_id = q.id)
