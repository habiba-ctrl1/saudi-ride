# Admin Panel — Security Check + Upgrade Plan
**Date:** 12 Sep 2026 — plan only, nothing in this doc has been built yet except the one bug fix noted in §2.

## 1. Security check — "any email logs into admin?"

**Checked directly, not a bug.** There are exactly two legitimate admin identities, both intentional:

| Login method | Email | How it gets admin access |
|---|---|---|
| Password (`/admin/login` form) | `infotaxisaudiarabia@gmail.com` | Matches `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env.local` — a single hardcoded pair |
| Google sign-in | `habiti747@gmail.com` | The only row in the `User` table, with `role = ADMIN` set explicitly |

I checked the `User` table directly — it has exactly **1 row total**, and new sign-ups default to `role = CUSTOMER` (confirmed in the Prisma schema). So a stranger signing in with Google cannot get admin by accident. The two emails you're switching between are both correctly yours.

## 2. Important: another session is working on this same codebase right now

While checking git history I found a commit from **today**, already on `main` (`dd841c3`, co-authored with Claude), that built **automatic** Trustpilot review-request emails — but for the *old* `/admin/bookings` (Prisma) system, via a cron job, triggered when a booking's status flips to `COMPLETED`. That's a different, complementary thing from what I built this session (a manual "Send Receipt" button for the *new* `/admin/quotations` system, with a PDF attached).

Both are legitimate and don't fight each other, but I found and fixed one real bug from the overlap:

- **Bug (fixed):** my receipt button was reading a BCC address from `TRUSTPILOT_BCC_EMAIL`, but the other session's cron reads it from `TRUSTPILOT_INVITE_EMAIL` — and only the second one is actually set in `.env.local`. My button's Trustpilot BCC has been silently doing nothing since I built it. Renamed my code to use the same `TRUSTPILOT_INVITE_EMAIL` everyone else uses — one setting, both features now honor it.
- **Not yet working, needs your action:** the other session's cron (`/api/cron/review-requests`) requires a `CRON_SECRET` env var **and** an external scheduler (they used cron-job.org, since Vercel's free tier can't run sub-daily crons) hitting that URL every 30 minutes with that secret. Neither is set up yet — until both exist, that automatic email never fires, even after deploy. Worth asking that other session (or me) to finish wiring it, or I can do it if you want.

## 3. Deploy — don't push blindly yet

Current `main` already has 3 commits from today that I didn't make. My session has real uncommitted work sitting on top of that (receipt PDFs, schedule page, DB backfill, the fix above). Before anything goes to production:

1. I should **commit my changes** as their own commit(s) — I won't do this without you saying go, per normal practice.
2. **Confirm the deploy mechanism** — is this on Vercel with auto-deploy on push to `main`? If so, `git push` *is* the deploy. If there's a separate manual step, tell me what it is.
3. Decide the `CRON_SECRET` question above before or after deploy — the cron literally cannot work without it either way, so it's not blocking, just incomplete.

**I won't push to `main` without you telling me to.** Say the word and I'll commit + push.

## 4. Admin upgrade plan (priority order — plan only)

Builds on `BOOKING-SYSTEM-AUDIT-AND-PLAN-2026-09-12.md` from earlier today; this supersedes its priority list with what I now know.

### P0
1. **Finish the Trustpilot cron setup** — `CRON_SECRET` + external scheduler, so the already-built automatic review emails actually start firing.
2. **"+ New Quotation" manual-add button** in `/admin/quotations` — still the biggest gap: a WhatsApp-only lead has no self-serve way into the system.
3. **Status-change customer emails** for the Supabase quotations flow (quoted/confirmed/assigned) — the Prisma side already has richer automated emails (confirmation, driver-assigned, reminder); the newer system doesn't yet.

### P1 — filters worth adding
- **`/admin/quotations`**: filter by *assigned driver* (currently only settable, not filterable); filter by *trip type* (the `TRIP_TYPES` list already exists in code but isn't wired to a UI filter); an *"unpaid & completed"* one-click filter (the exact thing the new Schedule page's "Needs Attention" section surfaces — would be nice as a filter chip here too, for when you're not on the Schedule page).
- **`/admin/bookings`** (legacy): same date-preset filters (today/tomorrow/week) that `/admin/quotations` already has — currently missing there.
- **`/admin/schedule`** (new): add a status filter and a text search — right now it always shows everything non-cancelled in the window, no way to narrow it.
- **Cross-cutting**: a single search box that checks *both* tables (Prisma bookings + Supabase quotations) by phone number — right now you have to know which system a customer is in before you can find them.

### P2
4. Unify the two PDF/email templates fully — the old system's emails are still on the gold/black brand; only the Supabase-side PDF and email got rebranded this session.
5. Auto-bridge `/book` → `/admin/quotations` the moment a price is set (removes the manual "Generate Quotation" click).
6. Merge the two "mark review requested" mechanisms into one once the systems are closer together — right now there are two separate `reviewRequestedAt`-style fields on two separate tables.

## Open questions
- OK to commit + push what's on my side now (after you confirm deploy mechanism)?
- Want me to finish the `CRON_SECRET`/scheduler setup, or is that already being handled by the other session?
- Start P0 #2/#3 next?
