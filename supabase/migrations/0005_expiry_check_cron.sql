-- 0005: daily document-expiry check + quotation follow-up flagging.
-- Scheduled via pg_cron if available; otherwise run public.check_document_expiry()
-- from Supabase Dashboard → Integrations → Cron (daily).

create or replace function public.check_document_expiry()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  -- 1) any document already expired → suspend approved drivers
  for r in
    select id, full_name from public.drivers
    where status = 'approved'
      and (license_expiry_date   < current_date
        or iqama_expiry_date     < current_date
        or istimara_expiry_date  < current_date
        or insurance_expiry_date < current_date)
  loop
    update public.drivers
      set status = 'suspended', suspension_reason = 'documents_expired'
      where id = r.id;
    perform public.notify_admin('document_expired',
      'Driver "' || r.full_name || '" suspended automatically: a document has expired.', r.id);
  end loop;

  -- 2) document expiring within 30 days → flag once + notify
  for r in
    select id, full_name from public.drivers
    where status in ('approved','pending')
      and expiring_soon = false
      and least(
            coalesce(license_expiry_date,  'infinity'::date),
            coalesce(iqama_expiry_date,    'infinity'::date),
            coalesce(istimara_expiry_date, 'infinity'::date),
            coalesce(insurance_expiry_date,'infinity'::date)
          ) between current_date and current_date + 30
  loop
    update public.drivers set expiring_soon = true where id = r.id;
    perform public.notify_admin('document_expiring',
      'Driver "' || r.full_name || '": a document expires within 30 days.', r.id);
  end loop;

  -- 3) quotations sitting in 'new' for 24h+ without a quote → follow-up flag + notify
  for r in
    select id, quote_reference, customer_name from public.quotations
    where status = 'new'
      and followup_flagged = false
      and created_at < now() - interval '24 hours'
  loop
    update public.quotations set followup_flagged = true where id = r.id;
    perform public.notify_admin('quotation_followup',
      'Quotation ' || r.quote_reference || ' (' || r.customer_name || ') is 24h old with no quote — follow up.',
      null, r.id);
  end loop;
end $$;

-- schedule daily at 03:00 UTC (06:00 Saudi time)
do $$
begin
  create extension if not exists pg_cron;
  perform cron.schedule(
    'daily-document-expiry-check',
    '0 3 * * *',
    $job$ select public.check_document_expiry(); $job$
  );
exception when others then
  raise notice 'pg_cron unavailable (%): schedule check_document_expiry() via Supabase Dashboard Cron instead.', sqlerrm;
end $$;
