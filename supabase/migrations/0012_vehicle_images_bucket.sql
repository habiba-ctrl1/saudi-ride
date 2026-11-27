-- 0012: public bucket for fleet/vehicle photos uploaded via the admin panel.
-- Public (unlike driver-documents) because fleet images are shown on the
-- public site. Uploads still go through the service-role client in the
-- admin API route; this policy covers direct Supabase-Auth admin access too.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehicle-images', 'vehicle-images', true,
  8388608, -- 8 MB per file
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  drop policy if exists "admins manage vehicle images" on storage.objects;
  create policy "admins manage vehicle images" on storage.objects
    for all to authenticated
    using (bucket_id = 'vehicle-images' and public.is_admin())
    with check (bucket_id = 'vehicle-images' and public.is_admin());
exception when others then
  raise notice 'Could not create storage.objects policy (%): create it in Dashboard -> Storage -> Policies if needed.', sqlerrm;
end $$;
