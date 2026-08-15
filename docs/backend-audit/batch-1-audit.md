# Batch 1 — Production Backend Master Audit
**Taxi Saudi Arabia (taxidriver)** · Audit date: 2026-08-13 · Mode: read-only, no code changed · Repo: local git, `origin/main` in sync (121 commits, HEAD `78a668a`)

This audit supersedes/updates the 2026-08-04 audit (`docs/audit/`) where findings have changed. That audit's #2 and #3 top issues ("homepage widget captures no lead," "`/book` notifies nobody") were fixed by the **Phase 1A** commit (`635b364`, 2026-08-05, `docs/phase-1a-report.md`) and a follow-up fix (`bcdcf11`) that patched fabricated data + HTML-injection in email templates. This audit verifies that fix against live code, and goes further into the database layer, the full form/API inventory, and admin/security — none of which the prior audit covered in depth.

---

## 1. Executive Summary

| Area | Score | Basis |
|---|:---:|---|
| Backend maturity | **5/10** | Real Prisma + Supabase backend with RPCs, audit logging, and security-definer functions — genuinely well-designed where it's finished. But it's two unreconciled systems (see §Architecture), several admin routes have auth checks that are no-ops, and one endpoint has zero access control on live customer data. |
| Database maturity | **6/10** | Supabase migrations (0001–0010) are high quality: real RLS, audit triggers, idempotent, security-definer RPCs to avoid trusting the client. But two full tables are dead (Prisma `Driver`, Supabase `bookings`), ownership is split without a plan to unify, and two migrations both claim the filename prefix `0010`. |
| Form reliability | **6/10** | 8 of ~13 public-facing forms genuinely persist data and/or send email. Concrete gaps: the lead-capture form (`/api/leads`) saves to DB but emails no one; the contact form has **no DB persistence at all**; zero rate-limiting or duplicate-submission protection on any public POST endpoint. |
| Booking reliability | **6/10** | The `/book` wizard → `/api/bookings` → `notifyNewBooking()` chain is the single best-engineered flow in the codebase (per-channel try/catch, durable failure logging). But `PUT`/`PATCH /api/bookings/[id]` — same table — has **zero authentication**, undermining the whole flow's integrity. |
| Email reliability | **5/10** | Resend is properly guarded (env-gated, HTML-escaped, best-effort separated from DB writes). But the one durable failure-tracking table (`notification_failures`) is **write-only — nothing ever reads it**, and `RESEND_FROM_EMAIL` status in production is unverified. |
| Admin readiness | **3/10** | Of the ~14 modules a real ops team needs, only **Quotations** and **Driver Applications** are fully functional end-to-end. Dashboard is real but read-only. Vehicles/Blog CMS read real data but their edit buttons have no click handlers. Analytics is 100% hardcoded mock data. Bookings/Customers/Reviews/Promo Codes/Revenue have working backends and **no UI at all**. |

### The blunt answer

**If a real customer submits a booking through `/book` right now**: it is saved to the database, and the customer + admin genuinely get emailed/SMS'd/WhatsApp'd, with failures durably logged instead of silently dropped. This part works and is well-built.

**If a real visitor uses the homepage quote widget** (`WhatsAppQuoteForm`, the one that's actually live — `PriceCalculator.tsx` is dead code, not imported anywhere): their quote is saved to the `leads` table, but **no one is ever told a new lead arrived** — the only notification is whatever the visitor themselves types into WhatsApp. This is the exact same bug class Phase 1A already fixed once for bookings ("saved, nobody told") — it just resurfaced in the new pipe that replaced the old broken one.

**The single most serious finding this audit adds to the record**: `PUT`/`PATCH /api/bookings/[id]/route.ts` has no authentication or ownership check. Anyone who knows or guesses a booking reference can cancel it, reassign a fake driver, or rewrite its price/status — live, in production, right now. This needs to be the first thing fixed, ahead of any UI or admin-panel work.

---

## 2. Architecture Map

```
Visitor
  │
  ├─ Homepage widget (WhatsAppQuoteForm) ──POST /api/leads──────► Prisma `leads` table [no email sent]
  │        └──────────────────────────────► WhatsApp deep link (always opens, fetch is fire-and-forget)
  │
  ├─ /book (6-step wizard) ──POST /api/bookings──► Prisma `Booking` ──► notifyNewBooking()
  │                                                                       ├─ customer email (Resend) + SMS (Twilio)
  │                                                                       ├─ admin email (Resend)
  │                                                                       ├─ admin WhatsApp (CallMeBot/Twilio)
  │                                                                       └─ any failed channel → `notification_failures` (write-only, unread)
  │
  ├─ /contact, /partners (B2B) ──POST /api/contact──► email only, NO DB WRITE ──► admin+customer email (Resend)
  │
  ├─ /services/car-recovery (RecoveryLeadForm) ──┐
  ├─ /partners/driver-registration ───────────────┤
  │                                                └─ (recovery) POST /api/quotations ──► Supabase RPC `request_quotation` ──► `quotations` table ──► best-effort admin+customer email
  │
  └─ /partners/driver-registration ──POST /api/partners/driver──► Supabase RPC `register_driver_application` ──► `drivers` table ──► admin email

Admin (NextAuth, single shared credential) ──/admin/quotations, /admin/driver-applications──► service-role Supabase client ──► RPCs (`admin_update_*`, audit-logged)
                                              /admin (dashboard) ──► `admin_dashboard_summary` view (real, read-only)
                                              /admin/vehicles, /admin/content/blog ──► real Prisma reads, dead-button writes
                                              /admin/analytics ──► 100% hardcoded mock arrays, not connected to any table
```

**Two unreconciled data layers**, settled by accretion rather than design:
- **Supabase owns** `drivers` and `quotations` — newer, RPC-gated, RLS-protected, audit-logged. This is where real engineering investment went.
- **Prisma owns** everything else live: `Booking`, `Payment`, `Vehicle`, `Review`, `PromoCode`, `BlogPost`, `Route`, `User`/`Account`/`Session`, plus `Lead`/`NotificationFailure` (physically Supabase-hosted tables, but exclusively accessed via Prisma's `@@map()`, never via a Supabase `.from()` call — this one is intentional, not a bug).
- **Dead, orphaned, safe to drop** (confirmed by exhaustive call-site grep, not inferred): Prisma `Driver` model (zero `db.driver.` call sites anywhere) and the Supabase `bookings` table (has RLS + an insert policy but zero writers — `lib/supabase/bookings.ts`'s only export is misleadingly named and actually queries Prisma's `Booking`, not this table).
- **Two independent auth systems coexist**: NextAuth (JWT, `role: ADMIN|CUSTOMER`) is what actually gates `/admin/**` and `/api/admin/**` via `middleware.ts`. A second, separate Supabase-Auth system exists (`lib/supabase/auth-browser.ts`, `auth-server.ts`) whose only tie-in is the SQL `is_admin()` function that the RLS admin policies depend on — but no live code path ever authenticates an admin through Supabase-Auth, so **those RLS admin policies are effectively unreachable dead code**; real admin access goes through the service-role key (which bypasses RLS entirely) behind the NextAuth check instead.

---

## 3. Database Inventory

| Table/Model | Source | Purpose | Key Relationships | RLS | Actively used? |
|---|---|---|---|---|---|
| `User` | Prisma | NextAuth identity, role, loyalty | 1—1 `Driver`, 1—N `Booking`/`Review` | N/A | Y |
| `Driver` | Prisma | Legacy in-app driver profile | `Booking.driverId` | N/A | **N — dead, zero call sites** |
| `Vehicle` | Prisma | Fleet catalog | 1—N `Booking` | N/A | Y — admin/vehicles, booking pricing |
| `Booking` | Prisma | **Live customer booking record** | `Vehicle`, `Driver`(unused), `User`, `Payment`, `Review` | N/A | Y — `/book` wizard, `/api/admin/bookings` |
| `Payment` | Prisma | Gateway transaction / ZATCA invoice | 1—1 `Booking` | N/A | Y in code, but **orphaned from UI** — nothing in the booking flow calls `/api/payments/initiate` |
| `PromoCode` | Prisma | Discount codes | none | N/A | Y — validated at checkout, no admin UI |
| `FareRule` | Prisma | DB-driven pricing rules | none | N/A | **N — zero callers**; pricing computed from static `lib/pricing/data/*` instead |
| `Route` | Prisma | SEO route pages | none | N/A | Y — public marketing only, not admin-managed |
| `Review` | Prisma | Trip ratings | `User`, `Booking` | N/A | Y — write path exists, no admin moderation UI |
| `BlogPost` | Prisma | CMS content | none | N/A | Y — read-only in admin (edit/delete buttons non-functional) |
| `Lead` (`@@map("leads")`) | Prisma, table created by Supabase migration | Pre-WhatsApp quote capture | none | none defined | Y — `/api/leads`, **no email fires on write** |
| `NotificationFailure` (`@@map("notification_failures")`) | Prisma, table created by Supabase migration | Durable failed-send log | none | none defined | Written Y, **read N — nothing ever queries it** |
| `bookings` (raw SQL) | Supabase | Early booking table | none | RLS: anon insert, admin full | **N — dead, zero writers** |
| `drivers` | Supabase | **Live driver registration/approval** | `quotations.assigned_driver_id`, `driver_ratings.driver_id` | RLS: anon insert-only forced `status='pending'`; admin full via `is_admin()` (unreachable path — see §2) | **Y — real backend for `/admin/driver-applications`** |
| `quotations` | Supabase | **Live quote/booking-request pipeline** | `drivers` | RLS: anon insert-only forced `status='new'`; admin full | **Y — real backend for `/admin/quotations` + dashboard revenue** |
| `quote_ref_counters` | Supabase | Per-year `TSA-YYYY-NNNN` sequence | none | RLS on, no policies — trigger-only access | Y, implicit |
| `driver_ratings` | Supabase | 1–5 trip ratings, feeds `drivers.rating` | `drivers`, `quotations` | RLS: admin-only | Y |
| `audit_logs` | Supabase | Status-change + edit history | loose text refs | RLS: admin select-only | Written Y (triggers), **read N — no admin UI ever displays it** |
| `notifications` | Supabase | Placeholder alert outbox (doc expiry, follow-up) | `drivers`, `quotations` | RLS: admin-only | Written by cron, **no consumer reads or sends these rows** |
| Views (`admin_dashboard_summary`, `drivers_per_city`, `vehicle_type_demand`, `quotation_conversion_monthly`, `drivers_expiring_documents`) | Supabase | Analytics rollups | reads `drivers`/`quotations` | inherits invoker role | Only `admin_dashboard_summary` has a caller; the other 4 are unused — `/admin/analytics` uses hardcoded mock data instead of any of them |
| Storage bucket `driver-documents` | Supabase Storage | Private license/iqama/istimara uploads | — | admin-only via `is_admin()` (service-role bypasses in practice) | Y |

**Migration quality**: 0001–0010 are individually well-built — idempotent, security-definer RPCs so the client is never trusted with privileged writes, a real audit trail, a working `pg_cron` document-expiry job (**UNVERIFIED — REQUIRES LIVE CHECK** whether `pg_cron` extension is actually enabled on the live project; the SQL has a graceful fallback if not). One hygiene issue: **two migrations both use the `0010` prefix** (`0010_phase1a_leads_and_notification_failures.sql` and `0010_quotation_details_edit.sql`) — both applied fine since Supabase migrations here are run manually/idempotently rather than through a strict sequential migration runner, but this will cause real problems the first time an automated migration tool is introduced.

---

## 4. Form Inventory

| Form | Route | Handler | DB Target | Email | Status | Critical Issue |
|---|---|---|---|---|---|---|
| Homepage WhatsApp Quote Form | `/` | `POST /api/leads` (fire-and-forget) | Prisma `leads` | **None** | **PARTIALLY WORKING** | Saves silently — no admin is ever notified of a new lead |
| `/book` 6-step Booking Wizard | `/book` | `POST /api/bookings` | Prisma `Booking` | Customer email+SMS, admin email+WhatsApp (`notifyNewBooking`) | **WORKING** | None on the write path — but see §8, the sibling `PUT/PATCH` on the same resource has no auth |
| Standalone zod Booking Form | — | `POST /api/quotations` | Supabase `quotations` | Best-effort | **DEAD CODE** | `components/booking/booking-form.tsx` not imported by any page |
| Contact / Concierge Form | `/contact` | `POST /api/contact` | **None** | Admin + customer auto-reply (Resend) | **PARTIALLY WORKING** | Zero DB persistence — a Resend outage loses the enquiry completely, no recoverable trace |
| Driver Registration | `/partners/driver-registration` | `POST /api/partners/driver` | Supabase `drivers` (RPC) | Admin email only | **WORKING**, minor gap | Email call isn't isolated from the outer try/catch — a flaky Resend send can make a *successful* registration look like a failure to the applicant |
| Car Recovery Lead Form | `/services/car-recovery[/[city]]` | `POST /api/quotations` (reused) | Supabase `quotations` | Admin + customer (best-effort) | **PARTIALLY WORKING** | Admin email template has no `notes` field — recovery-specific details (service type, car) are saved to DB but never surface in the notification email |
| Corporate/B2B Account Form | `/services/corporate` | `POST /api/contact` (reused) | **None** | Admin + customer | **PARTIALLY WORKING** | Same no-persistence issue as Contact |
| B2B Partners Registration | `/partners` | `POST /api/contact` (reused) | **None** | Admin + customer | **PARTIALLY WORKING** | Same no-persistence issue as Contact |
| Track Booking (lookup + cancel) | `/track-booking` | `GET`/`PUT /api/bookings/[id]` | Prisma `Booking` | N/A | **WORKING** (lookup, phone-matched) / **BROKEN** (cancel — see §8, no real auth beyond client-side UX) | |
| Customer Login (OTP) | `/login` | `POST /api/auth/send-otp`, `/verify-otp` | Prisma `User` | SMS (Twilio) | **WORKING** | No rate limit on `send-otp` despite an `OTP_LIMIT` constant existing unused — abuse/SMS-bombing risk |
| Admin Login | `/admin/login` | NextAuth `admin-login` credentials provider | env var comparison | N/A | **WORKING** | Single shared plaintext-compared credential, no MFA, no lockout |
| Admin Quotations editor | `/admin/quotations` | `PATCH /api/quotations/[id]` | Supabase `quotations` (RPC) | N/A | **WORKING** | Properly session-checked |
| Admin Driver Applications | `/admin/driver-applications` | `PATCH /api/driver-applications/[id]` | Supabase `drivers` (RPC) | N/A | **WORKING** | Properly session-checked |

**Pattern across every public POST endpoint** (`leads`, `quotations`, `contact`, `partners/driver`, `bookings`, `send-otp`): **no rate limiting, no idempotency key, no duplicate-submission guard beyond a disabled submit button** — a `lib/rate-limit.ts` module exists with `AUTH_LIMIT`/`OTP_LIMIT`/`FARES_LIMIT`/`BOOKING_LIMIT` constants defined, but only `fares/validate-promo` and `auth/register` actually call it.

---

## 5. Booking Flow Audit

**What happens today when a customer submits `/book`:**

1. `app/book/page.tsx:339` → `POST /api/bookings` with pickup/dropoff/date/vehicle/passenger/name/phone/price.
2. `app/api/bookings/route.ts:62` validates required fields (presence only — no phone/date format regex, looser than `/api/quotations`).
3. Looks up/auto-seeds the vehicle, computes price server-side via `lib/pricing/quote.ts` if no client price was given.
4. `db.booking.create(...)` — this is the actual, durable save. **Verified**: `docs/phase-1a-report.md` found exactly **one** real row in this table before Phase 1A (a Qatar customer, Dammam→Doha, left unactioned past its pickup date because nobody was notified) — direct proof this exact failure mode happened for real, once, before being fixed.
5. `notifyNewBooking(...)` (`lib/notifications.ts:435`) fires customer email+SMS, admin email, admin WhatsApp — each wrapped in its own try/catch, each failure durably written to `notification_failures` instead of silently dropped. The booking's DB write and the notification step are **not** in the same try/catch, so a total notification-provider outage cannot roll back or fail the booking itself — correct design.
6. Response returns honest per-channel `notified` status; the UI (`app/book/page.tsx:365-382`) displays it truthfully — the old fake "SMS confirmation sent" language is confirmed gone.

**Where it can still fail**: the same `Booking` row, once created, can be freely rewritten or cancelled by anyone with the booking reference via `PUT`/`PATCH /api/bookings/[id]` — **no session, no phone-match, no ownership check on the mutating verbs** (the `GET` handler in the same file does correctly check the caller's phone against `customerPhone`; `PUT`/`PATCH` do not). This is the audit's top production-critical finding — see §8.

---

## 6. Customer Flow Audit

There is **no unified "Customer" entity** shared across the booking and quotation systems. `User` (Prisma) exists for authenticated bookers (Google OAuth or phone-OTP login) and is the closest thing to a customer record — it has real create/retrieve/booking-association working (`/api/auth/register`, `/api/auth/send-otp`+`/verify-otp`, `Booking.userId` FK). But:

- **Quotations and driver applications capture name/phone/email as plain inline columns** with no FK to `User` — a repeat customer who books via the quote form and later creates an account has no link between the two.
- **`/api/admin/customers` (list customers) has no in-route auth check** — it is protected only by the fact that it lives under `/api/admin/*` and `middleware.ts` covers that path (confirmed real, but a single point of failure — see §8).
- **No admin UI page exists for customers at all** — the backend read endpoint exists, but there's no way for an admin to actually browse/search customer history from the panel.
- **Customer history/edit**: no update path exists for `User` records from the admin side; only read.

**Where it breaks**: not at persistence (bookings do correctly link to `User` when the customer is logged in) but at *visibility and unification* — an admin operating the business from Pakistan currently has no single place to look up "everything about this customer."

---

## 7. Email/Resend Findings

**CONFIRMED WORKING**
- `resend` (`^6.12.3`) and `twilio` (`^6.0.2`) are real dependencies; client init is properly guarded (`lib/notifications.ts:36,40` — `resendApiKey ? new Resend(...) : null`, simulates + logs instead of throwing when unset).
- `ADMIN_EMAIL` has a sane hardcoded fallback in all 4 call sites.
- HTML-escaping is present and consistently applied (`escapeHtml()` / `esc()` helpers) across every email template checked — user-submitted fields cannot break out of `href="tel:"`/`mailto:"` attributes.
- **Past-incident fix verified live, not just trusted from the ledger**: `sendDriverAssignment()` now uses the real `booking.vehicle?.plateNumber` with an honest fallback, no stock photo. `sendBookingReminder()` has zero weather-related content. Both confirmed by direct code read, not by re-reading the changelog.
- Email sends are architecturally separated from DB writes as best-effort steps in every flow except one (see below) — a Resend outage cannot roll back an already-saved DB row.
- The dead-letter table (`notification_failures`) is correctly *populated* for the `/api/bookings` flow, covering every failure branch.

**CONFIRMED BROKEN**
- `notification_failures` is **write-only** — no admin page, cron, or alert ever reads it. Failed sends accumulate invisibly forever.
- `/api/leads`, `/api/quotations`, `/api/partners/driver`, `/api/contact` never call `recordNotificationFailure` — their email failures are `console.error`-only, invisible in production unless someone is tailing server logs.
- `/api/contact` (and its two reused callers, Corporate + B2B Partners forms) has no DB write at all — if the admin-email send specifically fails, the route returns 500 and the enquiry is **fully and permanently lost**, unlike every other flow which keeps at least a DB row.
- The car-recovery admin email omits the recovery-specific details (service type, vehicle) that were saved to `luggage_notes` — an operational, not a technical, failure.
- `/api/leads` sends **no email of any kind** — this is the same "saved but nobody told" bug class Phase 1A explicitly fixed for `/api/bookings`, now present again in the pipe that replaced the old broken homepage widget.

**NOT VERIFIED (needs a live test)**
- Whether `RESEND_FROM_EMAIL`/`RESEND_API_KEY` are actually set correctly in the deployed (Vercel) environment vs. only locally — code defaults to the Resend sandbox address (`onboarding@resend.dev`, which only delivers to the account owner) until a verified domain is configured.
- Actual deliverability (inbox vs. spam) for any of the six email-sending flows.
- Whether `CALLMEBOT_PHONE`/`CALLMEBOT_APIKEY`/`TWILIO_*` are configured in production — code gracefully handles both states, which state is live is unknown from static code.

---

## 8. Security Findings

**CRITICAL**
- **`app/api/bookings/[id]/route.ts` `PUT` and `PATCH` — no authentication, no ownership check.** Any caller who knows or guesses a `bookingRef` can cancel a live booking, reassign a fake driver, or arbitrarily rewrite `status`/`totalPrice`/`paymentStatus`. The `GET` handler in the same file correctly validates the caller's phone against `customerPhone`; `PUT`/`PATCH` do not replicate that check. This route is **not** under `/api/admin`, so `middleware.ts` provides zero protection here — this is a live, unauthenticated write path on real customer/business data. **Fix before anything else in this audit.**

**HIGH**
- Several `/api/admin/**` routes contain an authorization check that **runs but never enforces** — the code branches on `role === "ADMIN"` and logs a message, with no `else { return 401 }` for the failure case (`app/api/admin/bookings/route.ts`, `bookings/[id]/route.ts`, `vehicles/route.ts`, `vehicles/[id]/route.ts`, `stats/route.ts` — the `stats` route even has a code comment admitting the check is intentionally decorative). These are currently protected *only* because `middleware.ts`'s matcher happens to cover `/api/admin/:path*` — a single layer of defense with no fallback if that matcher ever changes or a handler is reused elsewhere.
- `app/api/admin/bookings/[id]/assign`, `app/api/admin/promo-codes` (+`[id]`), `app/api/admin/reviews` have **no session check of any kind**, not even a broken one — full reliance on the middleware matcher for routes that create/delete promo codes and mutate bookings/reviews.
- No rate limiting or idempotency protection on any public lead/quote/booking/contact/OTP endpoint (see §4) — enables spam submissions, duplicate leads, and (for `send-otp`) potential SMS-cost abuse.
- `notification_failures` being write-only (see §7) is as much a security-adjacent operational blind spot as a reliability one — failed admin-notification sends on booking mutations would be invisible.

**MEDIUM**
- Admin authentication is a single shared credential pair compared in plaintext against env vars (`ADMIN_EMAIL`/`ADMIN_PASSWORD`), no MFA, no lockout/throttle visible in the `authorize()` callback, and no per-admin identity — `audit_logs`' actor field can only ever say "the shared account," not "which person."
- `app/api/setup-admin` and `app/api/seed-routes` reuse `NEXTAUTH_SECRET` (the session-signing secret) as a bearer "setup secret" header/query param — conflates two different secret purposes and increases blast radius if it ever leaks via logs.
- Two unreconciled data systems (§2) and one entirely unreachable RLS admin path (`is_admin()`/Supabase-Auth) create real risk of a future engineer assuming a protection exists that doesn't — not a live vulnerability today, but a maintenance trap.

**LOW**
- `/admin/vehicles` Add/Edit/Toggle-Active buttons have no click handlers despite a working backend API.
- `/admin/content/blog` Edit/Delete have no handlers; "New Article" links to a nonexistent page (404).
- Sidebar links to `/admin/promo-codes`, which has no page at all (backend fully built, zero UI).
- `/admin/analytics` is 100% hardcoded mock data (explicit `MOCK DATA` comment in source) — not a security issue, but could mislead real business decisions if trusted at face value.

**Confirmed clean** (checked, not assumed): `SUPABASE_SERVICE_ROLE_KEY` is referenced only in server-only files with no client-side import path found by grep; no `NEXT_PUBLIC_`-prefixed secret exists; RLS policies correctly restrict `anon` to insert-only on `drivers`/`quotations`/`bookings` with no `SELECT` policy, meaning IDOR-by-ID-guessing against those Supabase tables is not possible via the public anon key (all admin reads go through the service-role key behind the NextAuth check).

---

## 9. Broken / Missing Features

| Priority | Feature | Current State | Root Cause | Recommended Fix |
|---|---|---|---|---|
| P0 | Booking cancel/reassign/status endpoint is publicly writable | `PUT`/`PATCH /api/bookings/[id]` has no auth | Missing auth check, not covered by middleware (route isn't under `/api/admin`) | Add the same phone-match check the `GET` handler already has, or require a session for state-changing verbs |
| P0 | Homepage leads get no notification | `/api/leads` writes to DB only | New pipe built without reusing the `notifyNewBooking`/email pattern already proven elsewhere | Fire an admin email (reuse `sendEmail`) on lead creation; log failures to `notification_failures` |
| P1 | Contact/Corporate/B2B enquiries can be silently lost | No DB write in `/api/contact` | Route was built email-only | Add a lightweight `contact_submissions` insert before sending email, so a Resend outage doesn't destroy the enquiry |
| P1 | Admin "checks" that don't enforce | 5 routes branch on role but never return 401 on failure | Copy-pasted pattern, likely from an early draft, never finished | Add the missing `else { return 401 }`; add a shared `requireAdmin()` helper to prevent recurrence |
| P1 | No admin UI for Bookings, Customers, Reviews, Promo Codes, Revenue | Backends exist and work; zero front-end | Admin panel build stopped after Quotations/Driver Applications | Build UI against the existing, already-working APIs — no new backend needed |
| P2 | Vehicles/Blog admin pages have dead buttons | `onClick` handlers never wired to the existing working API | Incomplete implementation | Wire the buttons — API already works |
| P2 | `/admin/analytics` is fake | Hardcoded mock arrays | Never connected to the 4 unused DB views that already compute this data | Wire to `drivers_per_city`/`vehicle_type_demand`/`quotation_conversion_monthly` views — they already exist |
| P2 | `notification_failures` never surfaced | No reader anywhere | Table built, consumer not | Add a small admin widget/page listing recent failures |
| P3 | Two dead tables (`Driver` Prisma model, Supabase `bookings`) | Confirmed zero live callers | Superseded during earlier migrations, never cleaned up | Safe to drop in a dedicated, reviewed migration once confirmed once more against production |
| P3 | Duplicate `0010` migration prefix | Cosmetic | Two features shipped same-day without checking the last-used number | Rename one file with a proper sequence number before any automated migration tool is introduced |

---

## 10. Reference-Based Admin Gap Analysis

Comparing against the reference concept's benchmark modules (clean layout, booking/customer/driver/calendar/contracts/B2B/pricing/WhatsApp templates/email client/reports):

| Module | Status |
|---|---|
| Dashboard | EXISTS (real data, read-only) |
| Bookings management | **MISSING UI** (backend exists) |
| Customer management | **MISSING UI** (backend read-only exists, no search/edit/history view) |
| Driver management | EXISTS and functional (approve/reject/suspend/blacklist) |
| Vehicle/Fleet management | PARTIAL (read works, all writes dead-button) |
| Quotation pipeline | EXISTS and functional — this is the strongest module in the panel |
| Calendar | MISSING entirely |
| Contracts | MISSING entirely |
| B2B clients | MISSING entirely (only a public-facing form exists) |
| Pricing config | MISSING (pricing lives in static code files, not admin-editable) |
| WhatsApp templates | MISSING (hardcoded in components, not admin-configurable) |
| Email client / inbox | MISSING |
| Notifications console | MISSING (table exists, `notification_failures` write-only, no viewer) |
| Promo codes | **MISSING UI** (backend fully built) |
| Reports/Revenue | **MISSING UI** (backend endpoint exists, `revenue` model + views computed and unused) |
| Admin users/permissions | MISSING — single shared credential, no per-admin identity |

**Reading**: the panel is not evenly unfinished — it's finished in exactly two places (Quotations, Driver Applications) to a genuinely high standard (filters, pagination, audit trail, locking on completed records), and essentially unstarted everywhere else, several times with a working backend just sitting unused behind no UI.

---

## 11. Production-Critical Issues (fix before relying on this for daily ops)

1. **Unauthenticated booking mutation endpoint** (§8, CRITICAL) — live data-integrity and business risk today.
2. **Leads pipeline notifies no one** — real enquiries can sit unread exactly like the one Phase 1A already found and had to manually recover.
3. **Contact-form enquiries have no persistence** — a transient Resend hiccup means the enquiry is gone, not delayed.
4. **No admin UI to see/manage real bookings** — an admin currently cannot review or act on bookings from the panel at all; they'd need direct DB access.
5. **`notification_failures` is invisible** — the one safety net this codebase built for itself is never checked.

---

## 12. Recommended Implementation Batches

**Batch 2 — Security & booking-integrity hardening** *(do first, small and surgical)*
Fix the `bookings/[id]` auth hole; add the missing `else { return 401 }` to the 5 no-op admin checks; add a shared `requireAdmin()` helper; add rate-limiting to the public POST endpoints that lack it (reuse the existing `lib/rate-limit.ts`).

**Batch 3 — Close the "saved but nobody told" gaps**
Wire an admin-notification email into `/api/leads`; add DB persistence to `/api/contact` before its email step; add `notes`/service details to the car-recovery admin email; add `notification_failures` logging to the 4 flows that currently only `console.error`.

**Batch 4 — Admin Bookings/Customers/Reviews/Promo Codes UI**
Build front-ends against the already-working backends — no new API work required for most of this batch.

**Batch 5 — Notification visibility + admin reliability**
A small "failed sends" admin view over `notification_failures`; wire `/admin/analytics` to the real (already-built) DB views instead of mock data; fix the dead Vehicles/Blog CMS buttons.

**Batch 6 — Data-layer cleanup**
Drop the confirmed-dead Prisma `Driver` model and Supabase `bookings` table (in a reviewed migration); resolve the duplicate `0010` migration filename; decide and document Prisma-vs-Supabase ownership going forward so this split doesn't grow a third time.

**Batch 7 — Quotation/Invoice/PDF + B2B/Reports**
Pricing-config admin UI, promo-code UI, revenue/reports UI, quotation PDF/invoice polish, B2B client management — these are genuinely new build, not reconnection work.

**Batch 8 — Admin identity & auth hardening**
Move off single shared admin credential toward per-admin accounts (even a simple multi-row credentials table would let `audit_logs` attribute actions to a real person); decide the fate of the unused Supabase-Auth/`is_admin()` path (remove or actually wire it up — don't leave it as a trap).

---

*Compiled from a 4-way parallel deep audit (forms/API inventory, Supabase/Prisma schema reconciliation, live booking/email flow trace, admin panel + security) cross-checked against `docs/audit/` (2026-08-04), `docs/phase-1a-report.md` (2026-08-05), and `WORK-LEDGER.md` through 2026-08-07. All findings are file:line-cited in the underlying agent transcripts; claims marked UNVERIFIED require a live-environment check this audit could not perform (no destructive or live DB actions were taken).*
