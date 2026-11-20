-- 0009: security-definer RPCs for public form submissions.
-- Anon inserts succeed but cannot RETURN the row (no SELECT policy), so the
-- website could never show the TSA quote reference. These functions insert
-- with forced-safe values and return only the identifiers the customer needs.

create or replace function public.request_quotation(
  p_customer_name text,
  p_customer_phone text,
  p_pickup text,
  p_drop text,
  p_trip_date date,
  p_customer_email text default null,
  p_trip_type public.trip_type default 'one_way',
  p_trip_time time default null,
  p_return_date date default null,
  p_passengers int default null,
  p_luggage_notes text default null,
  p_vehicle_type public.driver_vehicle_type default null
)
returns table (id uuid, quote_reference text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if length(trim(p_customer_name)) < 2 or length(trim(p_customer_phone)) < 8 then
    raise exception 'invalid customer details';
  end if;
  if length(trim(p_pickup)) < 3 or length(trim(p_drop)) < 3 then
    raise exception 'invalid trip locations';
  end if;

  return query
  insert into public.quotations (
    customer_name, customer_phone, customer_email,
    pickup_location, drop_location, trip_type, trip_date, trip_time,
    return_date, passengers_count, luggage_notes, vehicle_type_requested,
    status, source
  ) values (
    trim(p_customer_name), trim(p_customer_phone), nullif(trim(coalesce(p_customer_email, '')), ''),
    trim(p_pickup), trim(p_drop), p_trip_type, p_trip_date, p_trip_time,
    p_return_date, p_passengers, p_luggage_notes, p_vehicle_type,
    'new', 'website'
  )
  returning quotations.id, quotations.quote_reference;
end;
$$;

create or replace function public.register_driver_application(
  p_full_name text,
  p_phone text,
  p_city text,
  p_vehicle_type public.driver_vehicle_type,
  p_license_number text,
  p_iqama_number text,
  p_vehicle_model text default null,
  p_years_experience int default null,
  p_whatsapp text default null
)
returns table (id uuid)
language plpgsql
security definer
set search_path = public
as $$
begin
  if length(trim(p_full_name)) < 2 or length(trim(p_phone)) < 8 then
    raise exception 'invalid applicant details';
  end if;
  if length(trim(p_license_number)) < 3 or length(trim(p_iqama_number)) < 5 then
    raise exception 'invalid document numbers';
  end if;

  return query
  insert into public.drivers (
    full_name, phone, whatsapp_number, city,
    vehicle_type, vehicle_model, license_number, iqama_number,
    years_experience, status, terms_accepted
  ) values (
    trim(p_full_name), trim(p_phone), nullif(trim(coalesce(p_whatsapp, '')), ''), trim(p_city),
    p_vehicle_type, nullif(trim(coalesce(p_vehicle_model, '')), ''), trim(p_license_number), trim(p_iqama_number),
    p_years_experience, 'pending', true
  )
  returning drivers.id;
end;
$$;

revoke all on function public.request_quotation(text, text, text, text, date, text, public.trip_type, time, date, int, text, public.driver_vehicle_type) from public;
grant execute on function public.request_quotation(text, text, text, text, date, text, public.trip_type, time, date, int, text, public.driver_vehicle_type) to anon, authenticated, service_role;

revoke all on function public.register_driver_application(text, text, text, public.driver_vehicle_type, text, text, text, int, text) from public;
grant execute on function public.register_driver_application(text, text, text, public.driver_vehicle_type, text, text, text, int, text) to anon, authenticated, service_role;
