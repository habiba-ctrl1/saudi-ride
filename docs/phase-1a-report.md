# Phase 1A — "Stop the Bleeding" — Implementation Report

**Date:** 2026‑08‑05 · **Scope:** the six items only, no unrelated refactors · **Build:** `npm run build` passes (no visual change). All DB/endpoint changes verified against the live database.

---

## TL;DR

- **A real lead was sitting unread.** The bookings table held **1** enquiry — a Qatar customer, Dammam→Doha, SAR 500, booked 2026‑08‑01 for pickup **2026‑08‑03**, left `PENDING`/`UNPAID`. Because `/api/bookings` never notified anyone, nobody actioned it and the pickup date passed. This is the exact bleeding you suspected — now stopped.
- Bookings now send a **real customer email + real internal email + WhatsApp alert**; failures are recorded in a new `notification_failures` table instead of vanishing. All fake "SMS sent / queued" messages are gone.
- The homepage widget now **captures the lead to the DB before** the WhatsApp hand‑off (verified: POST → `201`, row written).
- The global **TLS‑verification bypass is removed** (was a MITM hole); Prisma still connects.
- Fabricated **"4.9/5" and "Google Review — Verified Trip"** removed; "Ministry of Transport / ZATCA" claims are now gated behind a credentials file that renders nothing until a real number is present. **No `Review`/`AggregateRating` schema exists** on the site.
- **GA4 + GTM + Microsoft Clarity** installed (env‑gated) with conversion events and session‑persisted UTM capture.

---

## 1 · Lead recovery — what was found

Script: [`scripts/export-leads.ts`](../scripts/export-leads.ts) (read‑only). Output: [`docs/audit/existing-leads.csv`](audit/existing-leads.csv).

| Metric | Value |
|---|---|
| Rows in `Booking` table | **1** |
| Date range | 2026‑08‑01T07:24:32Z → 2026‑08‑01T07:24:32Z (a single row) |
| The lead | `jagdish yashvantrai soni` · +974 3032 5916 · qatarvismaya@gmail.com · **Dammam → Doha, Qatar** · Toyota Camry · pickup **2026‑08‑03 10:00** · **SAR 500** · `PENDING` / `UNPAID` |

**Interpretation:** low volume overall (consistent with the "no traffic yet" finding in the audit), but the one genuine enquiry that did arrive was **lost to silence**, not to lack of interest. Follow up with this customer even though the date passed — and every future one now reaches you automatically.

> Note: the `Booking` table had no UTM/source columns before Phase 1A, so those CSV columns are empty for historical rows. New leads capture UTMs going forward.

---

## 2 · Notifications — faked → real

**Files:** [`lib/notifications.ts`](../lib/notifications.ts), [`app/api/bookings/route.ts`](../app/api/bookings/route.ts), [`app/book/page.tsx`](../app/book/page.tsx).

- New orchestrator **`notifyNewBooking()`** runs on every new booking (the booking is saved first, so a send failure can never lose the lead):
  - **Customer email** (Resend) + **customer SMS** (Twilio when configured).
  - **Internal email** to `ADMIN_EMAIL`.
  - **Internal WhatsApp** via **`sendAdminWhatsApp()`** — uses **CallMeBot** (simplest zero‑infra option) when `CALLMEBOT_PHONE` + `CALLMEBOT_APIKEY` are set; falls back to Twilio WhatsApp; otherwise logs a simulation.
- **Failures are durable:** any channel that fails is written to the new **`notification_failures`** table via `recordNotificationFailure()` — nothing is silently dropped.
- **No more lies:** the API response `"SMS confirmation sent"` is replaced with an honest message + a real per‑channel `notified` status; the booking wizard's hard‑coded "Twilio/Resend queued" logs are replaced with truthful lines derived from that status. Customer/admin emails no longer say "Confirmed & Secured" / "payment processed / (Paid)" on an unpaid enquiry.

**To go fully live, you set (env):** `RESEND_FROM_EMAIL` (+ verify your domain in Resend — until then Resend test mode only delivers to your own address), `ADMIN_EMAIL`, and `CALLMEBOT_PHONE` + `CALLMEBOT_APIKEY` (one‑time WhatsApp setup documented in `lib/notifications.ts`).

---

## 3 · Homepage widget lead capture

**Files:** new [`app/api/leads/route.ts`](../app/api/leads/route.ts), new [`lib/utm.ts`](../lib/utm.ts), [`components/booking/PriceCalculator.tsx`](../components/booking/PriceCalculator.tsx), [`components/shared/WhatsAppButton.tsx`](../components/shared/WhatsAppButton.tsx).

- The calculator's **"Book This Journey"** now POSTs the quote (origin, destination, date, vehicle, price, locale, page URL, UTMs) to `/api/leads` **before** opening WhatsApp. The call is **non‑blocking** (`fetch(..., { keepalive: true })`) so the WhatsApp hand‑off still happens instantly.
- **Verified end‑to‑end:** `scripts/verify-leads-endpoint.ts` exercised the real handler → **HTTP 201**, `leads` row count **0 → 1**, test row cleaned up.
- Analytics events fire on the same click (`lead_captured`, `whatsapp_click`) and on quote generation (`quote_generated`). The floating WhatsApp button fires `whatsapp_click`.

> Interpretation of "every other wa.me link": the highest‑value pre‑booking links (homepage calculator + floating button) capture a lead/fire events now. The remaining `wa.me` links (navbar, footer, service pages, driver‑contact on track‑booking) should adopt the same 2‑line `trackEvent(...)` pattern next; driver‑contact/support links should fire `whatsapp_click` only (not a lead). Left out of this pass to keep scope tight — noted for Phase 1B.

---

## 4 · Security

- **Global TLS bypass removed.** `.env.local` had `NODE_TLS_REJECT_UNAUTHORIZED="0"`, which disables certificate verification for **every** outbound TLS connection in the Node process (Resend, CallMeBot, webhooks, Google) — a man‑in‑the‑middle hole. **The underlying issue it was hiding:** Prisma's query engine could not verify the Supabase **connection‑pooler** certificate against Node's default CA trust store. The correct, scoped fix was already partly in place — the connection strings carry `sslaccept=accept_invalid_certs`, which tells **only Prisma's DB connection** to accept that cert. Removing the global flag restores verification everywhere else. **Verified:** Prisma still connects after removal (re‑ran the export successfully). *Fully‑correct upgrade path for later: download Supabase's CA cert and switch to `sslmode=verify-full&sslrootcert=…`.*
- **`.env.local` was never committed.** `git ls-files` shows no env file tracked and `git log` has no history for it; `.gitignore` covers `.env*`. Good — but rotate the keys anyway if this machine is shared, since they've now been read.
- **Service‑role key audit — clean.** `SUPABASE_SERVICE_ROLE_KEY` is read **only** in [`lib/supabase/server.ts`](../lib/supabase/server.ts) (`getSupabaseServerClient`), imported only by server modules (`lib/supabase/drivers.ts`, `lib/supabase/quotations.ts`) and the **server‑component** admin page. It has **no `NEXT_PUBLIC_` prefix**, so Next.js cannot inline it into any client bundle, and no client component imports it. **No leakage found.**

---

## 5 · Unbacked claims removed / gated

**Files:** [`components/sections/home-page.tsx`](../components/sections/home-page.tsx), [`app/(marketing)/locations/[city]/page.tsx`](../app/(marketing)/locations/[city]/page.tsx), [`components/booking/PriceCalculator.tsx`](../components/booking/PriceCalculator.tsx), [`components/layout/Footer.tsx`](../components/layout/Footer.tsx), new [`lib/config/credentials.ts`](../lib/config/credentials.ts).

- **No `Review`/`AggregateRating` JSON‑LD exists** (verified by grep — only explanatory code comments remain; the fabricated schema had already been removed). ✔ Acceptance met.
- Hard‑coded **"4.9/5"** on every location page → removed.
- **"Google Review — Verified Trip"** labels (EN/AR/UR) → relabelled honestly ("Traveller testimonial" / "رأي مسافر" / "مسافر کی رائے"). *(The testimonial quotes themselves are still illustrative; removing/replacing them with real reviews is a follow‑up.)*
- **Credentials gate:** new `lib/config/credentials.ts` holds `motLicenseNumber`, `vatNumber`, `commercialRegistration`, `legalEntityName` — all `null` with TODOs. The price calculator's "Ministry of Transport Certified" line now renders the MoT licence **only if `motLicenseNumber` is set**, otherwise just "Prices include 15% VAT". Footer badge softened "ZATCA VAT Compliant" → "ZATCA‑Ready Invoicing".

> Follow‑up: remaining ZATCA marketing copy in the homepage `whyUs`/corporate sections should be softened the same way; wire the footer/about/Terms to print CR + VAT + licence from `credentials.ts` once you have the numbers.

---

## 6 · Analytics (you are no longer blind)

**Files:** new [`components/analytics/AnalyticsScripts.tsx`](../components/analytics/AnalyticsScripts.tsx), [`lib/analytics.ts`](../lib/analytics.ts), [`app/layout.tsx`](../app/layout.tsx), [`lib/utm.ts`](../lib/utm.ts).

- **GA4 + GTM + Microsoft Clarity** loaders added, each gated on its own env id — with none set, nothing renders (build stays green, zero visual change).
- `trackEvent()` now forwards to **GA4 (`gtag`), GTM (`dataLayer`), and Clarity** in addition to Vercel Analytics.
- Conversion events available: `quote_generated`, `whatsapp_click`, `phone_click`, `booking_started`, `booking_completed`, `lead_captured`. (Wired now: `quote_generated`, `lead_captured`, `whatsapp_click` on the calculator + floating button. `phone_click` and the remaining CTAs are 2‑line additions for Phase 1B.)
- **UTM capture + session persistence** via `lib/utm.ts` — captured on first load, carried through to the lead payload.

**To activate (env):** `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_CLARITY_ID`. In GA4/GTM, mark `lead_captured`, `whatsapp_click`, `phone_click`, `booking_completed` as conversions.

---

## Database changes

New Prisma models + tables (additive, non‑destructive), applied to the live DB and verified:

- **`leads`** — captured quotes (origin, destination, date, vehicle, price, locale, page URL, UTMs, optional contact).
- **`notification_failures`** — durable log of failed sends (channel, target, booking ref, error).

Migration SQL: [`supabase/migrations/0010_phase1a_leads_and_notification_failures.sql`](../supabase/migrations/0010_phase1a_leads_and_notification_failures.sql) (idempotent `CREATE TABLE IF NOT EXISTS`). Applied via `scripts/apply-phase1a-migration.ts`; `prisma generate` run. Schema: [`prisma/schema.prisma`](../prisma/schema.prisma).

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| Submit a test booking → customer email **and** internal alert within 60 s | ✅ **Code path complete & wired.** Delivery is instant once `ADMIN_EMAIL` + Resend domain (and optionally CallMeBot) are set; without them the app logs a simulation and records a `notification_failures` row instead of faking success. |
| Homepage quote ending in a WhatsApp click → row in the database | ✅ **Verified** — `/api/leads` returned `201`, `leads` row written (0→1). |
| No `Review` schema on the site | ✅ **Verified** — none exists (grep). |
| `npm run build` passes, nothing visual changed | ✅ **Build passes.** Analytics scripts are env‑gated (render nothing without ids); claim edits are text‑equivalent swaps — no layout change. |

---

## What you need to do (config only — no code)

1. Set `ADMIN_EMAIL`, verify your domain in Resend, set `RESEND_FROM_EMAIL`.
2. (Optional, recommended) CallMeBot: message its WhatsApp bot once, then set `CALLMEBOT_PHONE` + `CALLMEBOT_APIKEY`.
3. Set `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_CLARITY_ID`; mark conversions in GA4.
4. Follow up with the recovered Qatar lead.
5. When you have them, fill `lib/config/credentials.ts` (CR / VAT / MoT licence) — the claims re‑appear automatically.

## Deferred to Phase 1B (documented, out of scope here)
- Fire `whatsapp_click`/`phone_click` on the remaining nav/footer/service `wa.me` and `tel:` links.
- Replace illustrative testimonials with real reviews; print CR/VAT/licence in footer/about/Terms.
- Soften remaining ZATCA marketing copy.
