-- 0010: admin edit of quotation customer/trip details (separate from status
-- changes in 0008). NOTE: the existing trg_quotations_audit (0004) only
-- fires on status changes (old.status is distinct from new.status), so it
-- does NOT cover detail edits — this RPC inserts its own audit_logs row
-- (action='details_edit', full before/after JSON snapshot) when anything
-- actually changes. Customer/trip fields lock once a quotation is
-- completed/cancelled (record integrity); admin_notes and followup_flagged
-- stay editable in any status.

create or replace function public.admin_update_quotation_details(
  p_id uuid,
  p_admin text,
  p_customer_name text default null,
  p_customer_phone text default null,
  p_customer_email text default null,
  p_pickup text default null,
  p_drop text default null,
  p_trip_type public.trip_type default null,
  p_trip_date date default null,
  p_trip_time time default null,
  p_return_date date default null,
  p_passengers int default null,
  p_luggage_notes text default null,
  p_vehicle_type public.driver_vehicle_type default null,
  p_admin_notes text default null,
  p_followup_flagged boolean default null
) returns public.quotations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.quotations;
  v_old public.quotations;
  v_locked boolean;
begin
  perform set_config('app.admin_id', coalesce(nullif(p_admin, ''), 'admin'), true);

  select * into v_old from public.quotations where id = p_id;
  if v_old.id is null then
    raise exception 'Quotation % not found', p_id;
  end if;
  v_locked := v_old.status in ('completed', 'cancelled');

  if v_locked and (
    p_customer_name is not null or p_customer_phone is not null or p_customer_email is not null or
    p_pickup is not null or p_drop is not null or p_trip_type is not null or p_trip_date is not null or
    p_trip_time is not null or p_return_date is not null or p_passengers is not null or
    p_luggage_notes is not null or p_vehicle_type is not null
  ) then
    raise exception 'Quotation % is completed/cancelled — customer and trip details are locked. Only notes and follow-up flag can change.', p_id;
  end if;

  update public.quotations set
    customer_name = coalesce(p_customer_name, customer_name),
    customer_phone = coalesce(p_customer_phone, customer_phone),
    customer_email = coalesce(p_customer_email, customer_email),
    pickup_location = coalesce(p_pickup, pickup_location),
    drop_location = coalesce(p_drop, drop_location),
    trip_type = coalesce(p_trip_type, trip_type),
    trip_date = coalesce(p_trip_date, trip_date),
    trip_time = coalesce(p_trip_time, trip_time),
    return_date = coalesce(p_return_date, return_date),
    passengers_count = coalesce(p_passengers, passengers_count),
    luggage_notes = coalesce(p_luggage_notes, luggage_notes),
    vehicle_type_requested = coalesce(p_vehicle_type, vehicle_type_requested),
    admin_notes = coalesce(p_admin_notes, admin_notes),
    followup_flagged = coalesce(p_followup_flagged, followup_flagged)
  where id = p_id
  returning * into v_row;

  if v_old is distinct from v_row then
    insert into public.audit_logs (entity_type, entity_id, action, old_value, new_value, actor)
    values ('quotations', p_id::text, 'details_edit', row_to_json(v_old)::text, row_to_json(v_row)::text,
            coalesce(nullif(p_admin, ''), 'admin'));
  end if;

  return v_row;
end $$;

revoke execute on function public.admin_update_quotation_details(
  uuid, text, text, text, text, text, text, public.trip_type, date, time, date, int, text,
  public.driver_vehicle_type, text, boolean
) from public, anon, authenticated;
