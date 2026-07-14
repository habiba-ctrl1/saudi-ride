-- 0008: admin status-change RPCs. They set app.admin_id inside the same
-- transaction so audit_logs records WHO acted (PostgREST can't set config
-- across requests). Service-role only: execute revoked from anon/authenticated.

create or replace function public.admin_update_driver_status(
  p_id uuid,
  p_status public.driver_status,
  p_admin text,
  p_reason text default null
) returns public.drivers
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.drivers;
begin
  perform set_config('app.admin_id', coalesce(nullif(p_admin, ''), 'admin'), true);
  update public.drivers
    set status = p_status,
        suspension_reason = case when p_status in ('suspended','blacklisted')
                                 then coalesce(p_reason, suspension_reason)
                                 else null end
    where id = p_id
    returning * into v_row;
  if v_row.id is null then
    raise exception 'Driver % not found', p_id;
  end if;
  return v_row;
end $$;

create or replace function public.admin_update_quotation_status(
  p_id uuid,
  p_status public.quotation_status,
  p_admin text,
  p_driver uuid default null,
  p_price numeric default null
) returns public.quotations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.quotations;
begin
  perform set_config('app.admin_id', coalesce(nullif(p_admin, ''), 'admin'), true);
  update public.quotations
    set status = p_status,
        assigned_driver_id = coalesce(p_driver, assigned_driver_id),
        quoted_price = coalesce(p_price, quoted_price)
    where id = p_id
    returning * into v_row;
  if v_row.id is null then
    raise exception 'Quotation % not found', p_id;
  end if;
  return v_row;
end $$;

revoke execute on function public.admin_update_driver_status(uuid, public.driver_status, text, text) from public, anon, authenticated;
revoke execute on function public.admin_update_quotation_status(uuid, public.quotation_status, text, uuid, numeric) from public, anon, authenticated;
