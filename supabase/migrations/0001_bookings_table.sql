-- 0001: bookings table (was defined in supabase/bookings.sql but never applied to the live DB;
-- lib/supabase/bookings.ts writes to it). Idempotent.

create table if not exists public.bookings (
  id bigserial primary key,
  booking_id text not null unique,
  pickup text not null,
  dropoff text not null,
  travel_date date not null,
  travel_time text not null,
  passengers int not null check (passengers >= 1 and passengers <= 8),
  locale text not null,
  source text not null default 'website',
  created_at timestamptz not null default now()
);
