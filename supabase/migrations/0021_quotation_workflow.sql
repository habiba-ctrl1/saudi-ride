-- 0021: quotation workflow (additive + idempotent). quote_stage tracks the SALES lifecycle of the quote
-- (draft → ready → sent → follow_up → accepted / rejected / expired); `status` keeps tracking the operational
-- lifecycle (new → quoted → confirmed → assigned → completed / cancelled). "Converted to booking" = status >= confirmed.
-- "Viewed" is intentionally not tracked: email open-tracking is unreliable and we do not fake it.

ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS quote_stage text NOT NULL DEFAULT 'draft';
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS sent_at timestamptz;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS sent_via text;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS valid_until date;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS followup_at timestamptz;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS est_driver_cost numeric(10,2);
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS pricing_rule_id text;
ALTER TABLE public.quotations DROP CONSTRAINT IF EXISTS quotations_quote_stage_check;
ALTER TABLE public.quotations ADD CONSTRAINT quotations_quote_stage_check CHECK (quote_stage IN ('draft','ready','sent','follow_up','accepted','rejected','expired'));
CREATE INDEX IF NOT EXISTS quotations_quote_stage_idx ON public.quotations (quote_stage)
