-- 0004: business rules — approval guard, double-booking check, trip counter,
-- ratings, audit log, notifications placeholder.
-- Admin identity: server code can run `select set_config('app.admin_id', '<id>', true)`
-- in the same transaction so audit rows record who acted; falls back to 'system'.

-- ── audit log ────────────────────────────────────────────────────────────────
create table if not exists public.audit_logs (
  id bigserial primary key,
  entity_type text not null,          -- 'drivers' | 'quotations'
  entity_id text not null,
  action text not null,               -- 'status_change'
  old_value text,
  new_value text,
  actor text,                         -- admin id/email via app.admin_id, else 'system'
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

create or replace function public.audit_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into public.audit_logs (entity_type, entity_id, action, old_value, new_value, actor)
    values (tg_table_name, new.id::text, 'status_change', old.status::text, new.status::text,
            coalesce(nullif(current_setting('app.admin_id', true), ''), 'system'));
  end if;
  return new;
end $$;

-- ── notifications placeholder (WhatsApp/email integration reads 'pending' rows later) ──
create table if not exists public.notifications (
  id bigserial primary key,
  type text not null,                 -- document_expiring | document_expired | quotation_followup | ...
  channel text not null default 'whatsapp',
  driver_id uuid references public.drivers(id) on delete cascade,
  quotation_id uuid references public.quotations(id) on delete cascade,
  message text not null,
  status text not null default 'pending',   -- pending | sent | failed
  created_at timestamptz not null default now()
);
create index if not exists notifications_status_idx on public.notifications (status);

create or replace function public.notify_admin(
  p_type text, p_message text, p_driver uuid default null, p_quotation uuid default null
) returns void
language sql
security definer
set search_path = public
as $$
  insert into public.notifications (type, message, driver_id, quotation_id)
  values (p_type, p_message, p_driver, p_quotation);
$$;

-- ── drivers: before update ───────────────────────────────────────────────────
create or replace function public.drivers_before_update()
returns trigger language plpgsql as $$
declare
  v_next_expiry date;
begin
  new.updated_at := now();

  -- approval guard: pending → approved only when every document field is filled
  if new.status = 'approved' and old.status is distinct from new.status then
    if new.license_number is null or new.license_expiry_date is null
       or new.iqama_number is null or new.iqama_expiry_date is null
       or new.istimara_number is null or new.istimara_expiry_date is null
       or new.insurance_expiry_date is null
       or new.profile_photo_url is null or new.license_doc_url is null
       or new.iqama_doc_url is null or new.istimara_doc_url is null then
      raise exception 'Cannot approve driver: all document numbers, expiry dates and uploads must be filled first.';
    end if;
    new.approved_at := now();
    if new.approved_by is null then
      new.approved_by := coalesce(nullif(current_setting('app.admin_id', true), ''), 'system');
    end if;
  end if;

  v_next_expiry := least(
    coalesce(new.license_expiry_date,  'infinity'::date),
    coalesce(new.iqama_expiry_date,    'infinity'::date),
    coalesce(new.istimara_expiry_date, 'infinity'::date),
    coalesce(new.insurance_expiry_date,'infinity'::date)
  );

  -- auto-unsuspend when expired documents are renewed (only doc-expiry suspensions)
  if old.status = 'suspended' and new.status = 'suspended'
     and old.suspension_reason = 'documents_expired'
     and new.license_expiry_date   >= current_date
     and new.iqama_expiry_date     >= current_date
     and new.istimara_expiry_date  >= current_date
     and new.insurance_expiry_date >= current_date then
    new.status := 'approved';
    new.suspension_reason := null;
  end if;

  -- clear expiry flag once all documents are valid for 30+ days
  if new.expiring_soon and v_next_expiry > current_date + 30 then
    new.expiring_soon := false;
  end if;

  return new;
end $$;

drop trigger if exists trg_drivers_before_update on public.drivers;
create trigger trg_drivers_before_update
  before update on public.drivers
  for each row execute function public.drivers_before_update();

drop trigger if exists trg_drivers_audit on public.drivers;
create trigger trg_drivers_audit
  after update on public.drivers
  for each row execute function public.audit_status_change();

-- ── quotations: before update ────────────────────────────────────────────────
create or replace function public.quotations_before_update()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();

  if new.status = 'confirmed' and old.status is distinct from new.status then
    new.confirmed_at := coalesce(new.confirmed_at, now());
  end if;

  if new.status = 'assigned' and new.assigned_driver_id is null then
    raise exception 'Cannot mark quotation as assigned without an assigned driver.';
  end if;

  -- double-booking guard: same driver, same date & time, already confirmed/assigned
  if new.status in ('confirmed','assigned') and new.assigned_driver_id is not null then
    if exists (
      select 1 from public.quotations q
      where q.assigned_driver_id = new.assigned_driver_id
        and q.id <> new.id
        and q.status in ('confirmed','assigned')
        and q.trip_date = new.trip_date
        and q.trip_time is not distinct from new.trip_time
    ) then
      raise exception 'Double booking: this driver already has a confirmed/assigned trip on % at %.',
        new.trip_date, coalesce(new.trip_time::text, '(no time)');
    end if;
  end if;

  return new;
end $$;

drop trigger if exists trg_quotations_before_update on public.quotations;
create trigger trg_quotations_before_update
  before update on public.quotations
  for each row execute function public.quotations_before_update();

-- completed trip → bump driver's total_trips_completed
create or replace function public.quotations_after_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'completed' and old.status is distinct from new.status
     and new.assigned_driver_id is not null then
    update public.drivers
      set total_trips_completed = total_trips_completed + 1
      where id = new.assigned_driver_id;
  end if;
  return new;
end $$;

drop trigger if exists trg_quotations_after_update on public.quotations;
create trigger trg_quotations_after_update
  after update on public.quotations
  for each row execute function public.quotations_after_update();

drop trigger if exists trg_quotations_audit on public.quotations;
create trigger trg_quotations_audit
  after update on public.quotations
  for each row execute function public.audit_status_change();

-- ── driver ratings (admin enters 1-5 per completed trip; avg auto-syncs) ─────
create table if not exists public.driver_ratings (
  id bigserial primary key,
  driver_id uuid not null references public.drivers(id) on delete cascade,
  quotation_id uuid unique references public.quotations(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  feedback text,
  created_at timestamptz not null default now()
);
create index if not exists driver_ratings_driver_idx on public.driver_ratings (driver_id);

create or replace function public.refresh_driver_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_driver uuid := coalesce(new.driver_id, old.driver_id);
begin
  update public.drivers
    set rating = (select round(avg(rating)::numeric, 2) from public.driver_ratings where driver_id = v_driver)
    where id = v_driver;
  return coalesce(new, old);
end $$;

drop trigger if exists trg_driver_ratings_refresh on public.driver_ratings;
create trigger trg_driver_ratings_refresh
  after insert or update or delete on public.driver_ratings
  for each row execute function public.refresh_driver_rating();
