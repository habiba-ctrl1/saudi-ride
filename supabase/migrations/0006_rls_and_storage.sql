-- 0006: RLS policies + private storage bucket for driver documents.
-- Model: public forms (anon key) may only INSERT; nobody can read others' data
-- with the anon key. The Next.js server uses SUPABASE_SERVICE_ROLE_KEY, which
-- bypasses RLS — admin APIs keep working. is_admin() additionally supports
-- future Supabase-Auth admins (JWT app_metadata.role = 'admin').

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- ── drivers ──────────────────────────────────────────────────────────────────
alter table public.drivers enable row level security;

drop policy if exists "public can register as driver" on public.drivers;
create policy "public can register as driver" on public.drivers
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and terms_accepted = true
    and admin_notes is null
    and rating is null
    and total_trips_completed = 0
  );

drop policy if exists "admins manage drivers" on public.drivers;
create policy "admins manage drivers" on public.drivers
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── quotations ───────────────────────────────────────────────────────────────
alter table public.quotations enable row level security;

drop policy if exists "public can request quotation" on public.quotations;
create policy "public can request quotation" on public.quotations
  for insert to anon, authenticated
  with check (
    status = 'new'
    and quoted_price is null
    and assigned_driver_id is null
    and admin_notes is null
  );

drop policy if exists "admins manage quotations" on public.quotations;
create policy "admins manage quotations" on public.quotations
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── bookings (was created without RLS) ───────────────────────────────────────
alter table public.bookings enable row level security;

drop policy if exists "public can create booking" on public.bookings;
create policy "public can create booking" on public.bookings
  for insert to anon, authenticated
  with check (true);

drop policy if exists "admins manage bookings" on public.bookings;
create policy "admins manage bookings" on public.bookings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── internal tables: admin/service-role only (no anon policies at all) ───────
alter table public.driver_ratings enable row level security;
drop policy if exists "admins manage ratings" on public.driver_ratings;
create policy "admins manage ratings" on public.driver_ratings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

alter table public.audit_logs enable row level security;
drop policy if exists "admins read audit logs" on public.audit_logs;
create policy "admins read audit logs" on public.audit_logs
  for select to authenticated
  using (public.is_admin());

alter table public.notifications enable row level security;
drop policy if exists "admins manage notifications" on public.notifications;
create policy "admins manage notifications" on public.notifications
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

alter table public.quote_ref_counters enable row level security;
-- no policies: only the security-definer trigger touches this table.

-- ── storage: private bucket for driver documents ─────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'driver-documents', 'driver-documents', false,
  10485760, -- 10 MB per file
  array['image/jpeg','image/png','image/webp','application/pdf']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- bucket is private: uploads + signed URLs happen server-side (service role).
-- Supabase-Auth admins may also browse/manage files directly. Wrapped in a DO
-- block because some Supabase projects restrict DDL on storage.objects.
do $$
begin
  drop policy if exists "admins manage driver documents" on storage.objects;
  create policy "admins manage driver documents" on storage.objects
    for all to authenticated
    using (bucket_id = 'driver-documents' and public.is_admin())
    with check (bucket_id = 'driver-documents' and public.is_admin());
exception when others then
  raise notice 'Could not create storage.objects policy (%): create it in Dashboard -> Storage -> Policies if needed.', sqlerrm;
end $$;
