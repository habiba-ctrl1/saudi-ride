-- 0029: invoices. Additive + idempotent. An invoice is a frozen document: issued once, never edited; mistakes are voided and re-issued.
-- Numbers are TSA's own (TSA-INV-YYYY-NNNN). When VAT applies, the document is issued by TSA on behalf of the registered VAT billing
-- partner (same convention as the corporate proforma); the partner's official tax invoice has its own numbering and is NOT generated here.

CREATE TABLE IF NOT EXISTS public.invoice_counters (
  year int PRIMARY KEY,
  counter int NOT NULL DEFAULT 0
);
ALTER TABLE public.invoice_counters ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'issued' CHECK (status IN ('issued','void')),
  issue_date date NOT NULL,
  currency text NOT NULL DEFAULT 'SAR',
  vat_mode text NOT NULL CHECK (vat_mode IN ('none','inclusive','exclusive')),
  vat_rate numeric(5,4) NOT NULL DEFAULT 0,
  lines jsonb NOT NULL,
  subtotal numeric(12,2) NOT NULL,
  vat_amount numeric(12,2) NOT NULL,
  total numeric(12,2) NOT NULL,
  paid_at_issue numeric(12,2) NOT NULL DEFAULT 0,
  balance_at_issue numeric(12,2) NOT NULL,
  settled_at_issue boolean NOT NULL DEFAULT false,
  bill_to jsonb NOT NULL,
  po_reference text,
  payment_terms text,
  notes text,
  trip jsonb NOT NULL,
  issued_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  voided_at timestamptz,
  void_reason text
);
CREATE INDEX IF NOT EXISTS invoices_quotation_idx ON public.invoices (quotation_id, created_at DESC);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY
