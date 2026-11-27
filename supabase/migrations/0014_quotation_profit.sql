-- 0014: additive manual profit tracking per quotation/ride.
alter table public.quotations add column if not exists profit numeric(10,2);
