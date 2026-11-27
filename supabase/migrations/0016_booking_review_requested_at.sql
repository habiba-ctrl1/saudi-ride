-- 0016: additive reviewRequestedAt flag on the Prisma-managed "Booking" table
-- (NOT the legacy snake_case public.bookings from 0001 — that's a separate,
-- older table used by lib/supabase/bookings.ts). Lets the review-request cron
-- (/api/cron/review-requests) send the Trustpilot review email exactly once
-- per completed booking, a few hours after completion.
alter table "Booking" add column if not exists "reviewRequestedAt" timestamp(3);

-- Backfill: existing completed bookings should NOT retroactively fire a
-- review email the moment this cron goes live. Mark anything already
-- COMPLETED as already-requested; only bookings completed AFTER this
-- migration runs will be picked up by the cron.
update "Booking"
set "reviewRequestedAt" = coalesce("completedAt", now())
where status = 'COMPLETED' and "reviewRequestedAt" is null;
