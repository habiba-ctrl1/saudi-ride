-- 0002: drivers table — public driver-registration + admin approval pipeline.
-- Note: the Prisma "Driver" table (in-app trip assignment) is separate and untouched.

do $$ begin
  create type public.driver_vehicle_type as enum ('sedan','suv','van','bus','limousine');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.driver_status as enum ('pending','approved','rejected','suspended','blacklisted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.availability_type as enum ('full_time','part_time');
exception when duplicate_object then null; end $$;

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),

  -- identity & contact
  full_name text not null,
  phone text not null unique,
  whatsapp_number text,

  -- coverage
  city text not null,
  coverage_areas text[] not null default '{}',

  -- vehicle
  vehicle_type public.driver_vehicle_type not null,
  vehicle_model text,
  vehicle_year int check (vehicle_year between 1990 and 2100),
  vehicle_plate_number text,

  -- legal documents
  license_number text not null unique,
  license_expiry_date date,
  iqama_number text not null unique,
  iqama_expiry_date date,
  istimara_number text,
  istimara_expiry_date date,
  insurance_expiry_date date,

  -- profile
  years_experience int check (years_experience >= 0),
  languages_spoken text[] not null default '{}',
  availability public.availability_type not null default 'full_time',
  availability_days text[] not null default '{}',
  availability_hours text,

  -- document uploads (paths inside private "driver-documents" bucket; access via signed URLs)
  profile_photo_url text,
  license_doc_url text,
  iqama_doc_url text,
  istimara_doc_url text,

  -- workflow
  status public.driver_status not null default 'pending',
  suspension_reason text,
  expiring_soon boolean not null default false,
  rating numeric(3,2) check (rating between 1 and 5),
  total_trips_completed int not null default 0,

  -- legal record
  terms_accepted boolean not null default false,
  terms_accepted_at timestamptz,

  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by text
);

create index if not exists drivers_status_idx on public.drivers (status);
create index if not exists drivers_city_idx on public.drivers (city);
create index if not exists drivers_vehicle_type_idx on public.drivers (vehicle_type);
create index if not exists drivers_expiring_soon_idx on public.drivers (expiring_soon) where expiring_soon;
create index if not exists drivers_rating_idx on public.drivers (rating desc nulls last);
create index if not exists drivers_coverage_areas_idx on public.drivers using gin (coverage_areas);

-- shared updated_at helper (reused by quotations)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- stamp terms acceptance time at registration (legal record)
create or replace function public.drivers_before_insert()
returns trigger language plpgsql as $$
begin
  if new.terms_accepted and new.terms_accepted_at is null then
    new.terms_accepted_at := now();
  end if;
  return new;
end $$;

drop trigger if exists trg_drivers_before_insert on public.drivers;
create trigger trg_drivers_before_insert
  before insert on public.drivers
  for each row execute function public.drivers_before_insert();
