-- 0007: dashboard + analytics views (security_invoker: RLS of the caller applies;
-- server reads them with the service-role key).

create or replace view public.admin_dashboard_summary
with (security_invoker = on) as
select
  (select count(*) from public.drivers    where status = 'pending')                 as pending_driver_approvals,
  (select count(*) from public.quotations where status = 'new')                     as new_quotations,
  (select count(*) from public.drivers    where expiring_soon)                      as expiring_documents,
  (select count(*) from public.quotations where status in ('confirmed','assigned')
                                            and trip_date = current_date)           as todays_confirmed_trips,
  (select count(*) from public.quotations where followup_flagged and status = 'new') as needs_followup;

create or replace view public.drivers_per_city
with (security_invoker = on) as
select city,
       count(*)                                        as total_drivers,
       count(*) filter (where status = 'approved')     as approved,
       count(*) filter (where status = 'pending')      as pending
from public.drivers
group by city
order by total_drivers desc;

create or replace view public.vehicle_type_demand
with (security_invoker = on) as
select vehicle_type_requested as vehicle_type,
       count(*)               as requests
from public.quotations
where vehicle_type_requested is not null
group by 1
order by requests desc;

create or replace view public.quotation_conversion_monthly
with (security_invoker = on) as
select date_trunc('month', created_at)::date as month,
       count(*)                              as total_quotations,
       count(*) filter (where status in ('confirmed','assigned','completed')) as confirmed,
       round(100.0 * count(*) filter (where status in ('confirmed','assigned','completed'))
             / nullif(count(*), 0), 1)       as conversion_pct
from public.quotations
group by 1
order by month desc;

create or replace view public.drivers_expiring_documents
with (security_invoker = on) as
select id, full_name, phone, city, status,
       license_expiry_date, iqama_expiry_date, istimara_expiry_date, insurance_expiry_date,
       least(
         coalesce(license_expiry_date,  'infinity'::date),
         coalesce(iqama_expiry_date,    'infinity'::date),
         coalesce(istimara_expiry_date, 'infinity'::date),
         coalesce(insurance_expiry_date,'infinity'::date)
       ) as next_expiry
from public.drivers
where status not in ('rejected','blacklisted')
  and least(
        coalesce(license_expiry_date,  'infinity'::date),
        coalesce(iqama_expiry_date,    'infinity'::date),
        coalesce(istimara_expiry_date, 'infinity'::date),
        coalesce(insurance_expiry_date,'infinity'::date)
      ) <= current_date + 30
order by next_expiry;
