-- 0023: booking_events — operational timeline entries that are not already captured elsewhere
-- (status changes live in audit_logs, emails/WhatsApp in communication_log, receipts in documents).
-- Additive + idempotent.

CREATE TABLE IF NOT EXISTS public.booking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  kind text NOT NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS booking_events_quotation_idx ON public.booking_events (quotation_id, created_at DESC);
ALTER TABLE public.booking_events ENABLE ROW LEVEL SECURITY
