-- 0003: quotations table + auto quote_reference (TSA-YYYY-NNNN, resets each year).

do $$ begin
  create type public.trip_type as enum ('one_way','round_trip','event','multi_day','airport_transfer','hourly');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.quotation_status as enum ('new','quoted','confirmed','assigned','completed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.quotation_payment_status as enum ('unpaid','partial','paid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lead_source as enum ('website','whatsapp','referral','event_management');
exception when duplicate_object then null; end $$;

create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  quote_reference text unique,

  -- customer
  customer_name text not null,
  customer_phone text not null,
  customer_email text,

  -- trip
  pickup_location text not null,
  drop_location text not null,
  trip_type public.trip_type not null default 'one_way',
  trip_date date not null,
  trip_time time,
  return_date date,
  passengers_count int check (passengers_count >= 1),
  luggage_notes text,
  vehicle_type_requested public.driver_vehicle_type,

  -- pricing
  quoted_price numeric(10,2) check (quoted_price >= 0),
  currency text not null default 'SAR',
  price_notes text,

  -- workflow
  status public.quotation_status not null default 'new',
  assigned_driver_id uuid references public.drivers(id) on delete set null,
  payment_status public.quotation_payment_status not null default 'unpaid',
  source public.lead_source not null default 'website',
  followup_flagged boolean not null default false,

  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index if not exists quotations_status_idx on public.quotations (status);
create index if not exists quotations_trip_type_idx on public.quotations (trip_type);
create index if not exists quotations_trip_date_idx on public.quotations (trip_date);
create index if not exists quotations_payment_status_idx on public.quotations (payment_status);
create index if not exists quotations_source_idx on public.quotations (source);
create index if not exists quotations_customer_phone_idx on public.quotations (customer_phone);
create index if not exists quotations_created_at_idx on public.quotations (created_at desc);
create index if not exists quotations_assigned_driver_idx on public.quotations (assigned_driver_id);

-- per-year counter for quote references (concurrency-safe upsert)
create table if not exists public.quote_ref_counters (
  year int primary key,
  counter int not null default 0
);

-- security definer: anon form submissions must be able to bump the counter
-- without having any direct grant on quote_ref_counters.
create or replace function public.generate_quote_reference()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_year int := extract(year from now())::int;
  v_counter int;
begin
  if new.quote_reference is null or new.quote_reference = '' then
    insert into public.quote_ref_counters (year, counter)
    values (v_year, 1)
    on conflict (year) do update set counter = quote_ref_counters.counter + 1
    returning counter into v_counter;
    new.quote_reference := 'TSA-' || v_year || '-' || lpad(v_counter::text, 4, '0');
  end if;
  return new;
end $$;

drop trigger if exists trg_quotations_quote_ref on public.quotations;
create trigger trg_quotations_quote_ref
  before insert on public.quotations
  for each row execute function public.generate_quote_reference();
