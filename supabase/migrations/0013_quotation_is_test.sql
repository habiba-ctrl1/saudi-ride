-- 0013: additive is_test flag on quotations, mirrors Booking.isTest — lets
-- admin mark leftover dev/test quotations and safely delete only those.
alter table public.quotations add column if not exists is_test boolean not null default false;
