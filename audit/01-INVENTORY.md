# 01 — Inventory

Audit date: 2026-08-06. Read-only pass against the working tree at commit `d7dcfa2` ("Add Red Sea International Airport page + fix live-DB drift on its 2 routes"). A prior internal audit exists at `docs/audit/*` dated 2026-08-04 — where this pass confirms an item from that audit is now fixed or still broken, it is noted explicitly with today's evidence rather than assumed.

## 1. Framework & hosting

| Item | Value | Evidence |
|---|---|---|
| Framework | Next.js 15.3.2, App Router | `package.json:34` (`"next": "^15.3.2"`) |
| React | 19.0.0 | `package.json:39-41` |
| Hosting target | Vercel | `vercel.json:1-3` (`{"framework":"nextjs"}`), `@vercel/analytics` dep, Vercel-specific comment in `next.config.ts:5-7` about `outputFileTracingIncludes` for the PDF invoice route |
| Styling | Tailwind CSS v4 + shadcn/ui + Radix primitives + `@base-ui/react` (three overlapping UI systems) | `package.json:20-21,25,46,56,64` |
| DB clients | Prisma (`@prisma/client` 6.19.3) AND Supabase JS (`@supabase/supabase-js` 2.105.4, `@supabase/ssr` 0.10.3) — both live against the **same** Postgres instance | `lib/db.ts:4-7` ("we never open two separate connection pools... important on Supabase free-tier"), `lib/prisma.ts` |
| Auth | NextAuth v4 (`next-auth@4.24.14`) + `@auth/prisma-adapter` | `package.json:15,35`, `lib/auth.ts` |

## 2. Route tree & rendering strategy

Full `app/` tree (file count from `find app -type f`): **~130 route/layout/API files**.

| Route group | Example paths | Rendering | Evidence |
|---|---|---|---|
| `app/(marketing)/routes/[slug]` | 71 static route pages (see §4) | SSG, `generateStaticParams()` + `revalidate = 86400` (daily ISR) | `app/(marketing)/routes/[slug]/page.tsx:1,23-25` |
| `app/(marketing)/routes` (grid/hub) | `/routes` | SSR-ish: fetches from Prisma `db.route.findMany()` at request time, `revalidate = 86400` | `app/(marketing)/routes/page.tsx:5,29-36` |
| `app/(marketing)/locations/[city]`, `[city]/[subarea]` | city + sub-area pages | Static content object (`CITY_DETAILS`, `SUB_AREAS`), no DB | `lib/data/locations.ts:1-3`, `lib/data/subareas.ts` |
| `app/(marketing)/services/*` | 19 hand-authored service pages | Static server components, hardcoded per-page content | e.g. `app/(marketing)/services/airport-transfers/page.tsx` |
| `app/(marketing)/airports/[slug]` | airport pages | Static data-driven | `lib/data/airports.ts` |
| `app/blog/[slug]`, `app/guides/[slug]` | 28 blog posts, 15 guides | Static data arrays | `lib/data/blog-posts.ts`, `lib/data/guides.ts` |
| `app/fleet/[slug]` | fleet/vehicle pages | Static, `lib/fleet-data.ts` |
| `app/ar/*` | 6 real Arabic pages: `/`, `/about`, `/contact`, `/faq`, `/pricing`, `/partners` | SSR/SSG per-page, real translated content, own metadata + `alternates.languages` | `lib/config/i18n.ts:2`, `app/ar/page.tsx:4-25` |
| `app/(dashboard)/admin/*`, `app/(dashboard)/customer/*` | Admin/customer portal | Client-heavy, auth-gated via middleware | `middleware.ts:21-24` |
| `app/api/*` | 32 route handlers | Server, see §5 | — |

**Route count claim vs. reality (CONFIRMED contradiction, three different numbers):**

| Source | Claimed count | Evidence |
|---|---|---|
| `lib/config/stats.ts` (`trustStats.routesCovered`) | "56+" | `lib/config/stats.ts:5-6` |
| `app/(marketing)/routes/page.tsx` meta description + `RoutesClient.tsx` H1 | "50+" | `app/(marketing)/routes/page.tsx:8`, `app/(marketing)/routes/RoutesClient.tsx:60` |
| `lib/data/locations.ts`-driven location page CTA | "50+ Kingdom-wide routes" | `app/(marketing)/locations/[city]/page.tsx:249` |
| **Actual count in the single route array** | **71** | `grep -c "slug:" lib/data/routes.ts` → 71 |
| `app/sitemap.ts` code comment | "56 routes" (stale comment, doesn't match either the 71 actual or the 50+/56+ marketing copy) | `app/sitemap.ts:15` |

## 3. Data sources — every place route facts (distance/duration/price) live

This is the core finding of the audit (see `audit/02-PROBLEMS.md` for full contradiction list). Route facts are NOT read from one place. Confirmed independent, hand-maintained sources:

| # | Source | Type | Consumers | Evidence |
|---|---|---|---|---|
| 1 | `lib/data/routes.ts` → `ROUTES_DATA` (71 entries) | TS array, intended "source of truth" | `lib/pricing/data/routes.ts` (re-exports for the pricing engine), `app/(marketing)/routes/[slug]/page.tsx` (`generateStaticParams`), `app/sitemap.ts`, fallback for `/routes` grid | `lib/data/routes.ts:1-945` |
| 2 | Prisma `Route` table in Postgres | DB table, seeded from #1 via `scripts/seed-routes.ts` | `app/(marketing)/routes/page.tsx:32` (`db.route.findMany()`) — this is what actually renders the `/routes` grid in production, and it can drift from #1 whenever the DB isn't reseeded | `app/(marketing)/routes/page.tsx:1,29-46`; recent commits `358aef8`, `8d3ffc4` explicitly patch "live-DB drift" |
| 3 | `ROUTE_CONTENT` object in `app/(marketing)/routes/[slug]/page.tsx` | Hand-authored prose per slug with its own `tldrFacts` (distance/time/price strings) | Rendered above-the-fold on each route detail page, and feeds that page's FAQ schema | `app/(marketing)/routes/[slug]/page.tsx:41-56` (example entries) |
| 4 | `components/sections/home-page.tsx` — "Popular routes" ticker array | Hardcoded array, own dist/dur/price fields | Homepage popular-routes widget | `components/sections/home-page.tsx:530-536` |
| 5 | `components/sections/home-page.tsx` — Umrah routes card array | Second, separate hardcoded array in the **same file** | Homepage Umrah section | `components/sections/home-page.tsx:1406-1410` |
| 6 | `app/layout.tsx` — root FAQPage JSON-LD | Hardcoded distance/duration/price strings, emitted on **every page of the site** (root layout) | Google/AI structured data sitewide | `app/layout.tsx:137-214`, specifically 151-155 and 165-171 |
| 7 | `app/(marketing)/services/airport-transfers/page.tsx` — `AIRPORT_ROUTES` | Hardcoded array | Service page fact table | `app/(marketing)/services/airport-transfers/page.tsx:34-40` |
| 8 | `app/(marketing)/services/intercity/page.tsx` — `POPULAR_COMBINATIONS` | Hardcoded array | Service page fact table | `app/(marketing)/services/intercity/page.tsx:34-39` |
| 9 | `app/(marketing)/services/long-distance/page.tsx` — route array | Hardcoded array | Service page fact table | `app/(marketing)/services/long-distance/page.tsx:38` |
| 10 | `app/pricing/page.tsx` — `FIXED_ROUTES` | Hardcoded array (currently consistent with #1 on the rows checked) | Pricing page comparison table | `app/pricing/page.tsx:156-162` |
| 11 | `public/llms.txt` | Hand-written AI-answer file | External AI crawlers (ChatGPT, Perplexity, etc.) | `public/llms.txt:29-40` |
| 12 | `app/api/pricing/route.ts` live calculator | **Not a fact source but a live computation** — see §4 "duration bug" below; feeds `PriceCalculator.tsx` and the WhatsApp prefill message | `app/api/pricing/route.ts` |

Net: **at least 10 independent hand-maintained content locations** encode the same underlying geographic/price facts, on top of a 4th storage layer (the Postgres `Route` table) that mirrors #1 but can independently drift. See `02-PROBLEMS.md` for the specific numeric contradictions this produces.

## 4. Pricing engine(s)

| Engine | Purpose | Used by | Evidence |
|---|---|---|---|
| `lib/pricing/quote.ts` → `quote()` | Current, intended single pricing function (vehicle class × distance × surcharge rules, VAT as explicit line) | `app/api/pricing/route.ts:2,68-74` | `lib/pricing/quote.ts:54-119` |
| `lib/pricing/data/vehicles.ts` | 5 vehicle classes, own `perKmRate`/`minimumFare`, marked `provisional: true` | `quote()` | `lib/pricing/data/vehicles.ts:22-28` |
| `lib/pricing/data/routes.ts` | Wraps `ROUTES_DATA` with `deadheadFactor` (marked `provisional: true`) | not used by `quote()` directly (quote takes a distance override from the API's own resolution, not from this route table) — dormant/unused for live quotes | `lib/pricing/data/routes.ts:1-64` |
| `app/api/pricing/route.ts` distance resolution | Calls Google Distance Matrix API **if `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is set**; otherwise falls back to `distance = max(30, min(650, (pickup.length+dropoff.length) * 4.5))`, `duration = distance * 0.9` | Confirmed: `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is **absent** from `.env.local` (not present as a key at all) | `app/api/pricing/route.ts:38,61-65`; env key list confirmed via `.env.local` (UNVERIFIED for the Vercel production environment — see `02-PROBLEMS.md` P0-2 for the verification command) |
| `app/pricing/page.tsx` "Dynamic Fare Estimator" | Reads `ROUTES_DATA` directly for its route dropdown | `app/pricing/page.tsx:9` | consistent with #1 |

## 5. API routes / server actions / integrations

| Route | Writes to | Notes | Evidence |
|---|---|---|---|
| `POST /api/leads` | Prisma `Lead` | Fire-and-forget capture before WhatsApp hand-off | `app/api/leads/route.ts:2,19` |
| `POST /api/contact` | **No DB** — Resend email only | Used by both `/partners` (B2B) and `CorporateAccountForm` — no persistence if email fails | `app/api/contact/route.ts` |
| `POST /api/bookings` | Prisma `Booking`, then `notifyNewBooking()` → Resend | Generates `bookingRef` (`TSA-${year}-${suffix}`) | `app/api/bookings/route.ts:139,161,193` |
| `POST /api/quotations` | Supabase `quotations` table + Resend | `app/api/quotations/route.ts:4,42,76-81` |
| `POST /api/partners/driver` | Supabase `drivers` table + Resend | `app/api/partners/driver/route.ts:2,39,71` |
| `PATCH /api/driver-applications/[id]` | Supabase `drivers` (status) | Admin-only | `app/api/driver-applications/[id]/route.ts:4,23` |
| `POST /api/pricing` | No persistence — pure calculation | See §4 | `app/api/pricing/route.ts` |
| `POST /api/payments/create-session`, `/initiate` | Real Moyasar/HyperPay calls, but **env-gated fallback to a fake "simulated" response** when keys absent; **no UI component anywhere calls these endpoints** | `app/book/page.tsx:112-113` explicitly documents payment as not wired: "Payment gateway abhi live nahi" | see `app/api/payments/create-session/route.ts:32-40`, `app/api/payments/initiate/route.ts:47-52` |
| `POST /api/webhooks/moyasar`, `/api/payments/webhook/{stripe,hyperpay}` | Real Prisma writes (`payment.upsert`, `booking.update`) when the respective secret is configured | Orphaned in practice — no initiation path reaches them | — |
| `/api/admin/*` | Prisma, admin-only (NextAuth role check in `middleware.ts:39-44`) | — | — |
| `/api/auth/*` | NextAuth + custom OTP (`send-otp`, `verify-otp`) | — | — |
| `/api/seed-routes`, `/api/setup-admin` | One-off maintenance endpoints, publicly reachable unless separately protected (UNVERIFIED — check auth guard in these two files specifically) | `app/api/seed-routes/route.ts`, `app/api/setup-admin/route.ts` |

Third-party services referenced in code: Google Maps/Places (Distance Matrix + Autocomplete, `NEXT_PUBLIC_GOOGLE_MAPS_KEY`), Resend (email), Twilio (dep present, `lib` usage UNVERIFIED — not confirmed wired to an active send path in this pass), Moyasar/HyperPay/Stripe (payments, all orphaned from UI), Cloudinary (dep present, usage UNVERIFIED), GTM/GA4/Microsoft Clarity (analytics, env-gated), Vercel Analytics (`@vercel/analytics`, always on via `app/layout.tsx:238`).

## 6. Backend: Prisma vs. Supabase — what's actually wired

Both point at the same Postgres database (`lib/db.ts:4-7`). Neither is fully "the" backend:

- **Prisma-only, active:** `Booking`, `Payment`, `User`, `Driver` (profile), `Vehicle`, `PromoCode`, `Review`, `BlogPost`, `Lead`, `NotificationFailure`, `Account`/`Session` (via NextAuth adapter).
- **Prisma model with zero callers (dormant):** `FareRule` (`prisma/schema.prisma:249-263`) — pricing is computed entirely from the static `lib/pricing/data/*` files, never from this table.
- **Supabase-only, active:** `quotations`, `drivers` (registration/status workflow) — read/written exclusively through `lib/supabase/quotations.ts` and `lib/supabase/drivers.ts`.
- **Supabase migration table with no live caller:** `public.bookings` (`supabase/migrations/0001_bookings_table.sql:4`) — the real booking flow uses the Prisma `Booking` model instead; this table appears orphaned.
- **Mislabeled module:** `lib/supabase/bookings.ts` is named as a Supabase module but its only function (`getRecentBookings`, itself uncalled anywhere) queries via Prisma, not Supabase.
- **`leads` / `notification_failures`:** provisioned via a raw Supabase SQL migration (`0010_phase1a_leads_and_notification_failures.sql`) but actually read/written through the Prisma `Lead`/`NotificationFailure` models via `@@map(...)` — same table, two client libraries.

## 7. Content volume

| Content type | Count | Source |
|---|---|---|
| Routes | 71 | `lib/data/routes.ts` |
| Locations (cities) | 12 | `lib/data/locations.ts` (`CITY_DETAILS` top-level keys) |
| Guides | 15 | `lib/data/guides.ts` |
| Blog posts | 28 (defined; published-only subset feeds sitemap via `.filter(post => post.published)`) | `lib/data/blog-posts.ts`, `app/sitemap.ts:110` |
| Services (hand-authored pages) | 19 | `app/(marketing)/services/*/page.tsx` file count |
| Fleet vehicles | 15 | `lib/fleet-data.ts` |

## 8. Environment variables — declared vs. actually configured (local)

`.env.example` declares only 2 keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — materially incomplete vs. what the app actually reads from `process.env` (Resend, NextAuth, Google Maps, ZATCA, Moyasar/HyperPay/Stripe, GTM/GA4/Clarity, admin credentials).

`.env.local` (local dev, values not reproduced) has these keys **set**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_CLARITY_ID`.

**Confirmed absent from `.env.local`** (keys not present at all): `NEXT_PUBLIC_GOOGLE_MAPS_KEY`, `ZATCA_VAT_NUMBER`, `ZATCA_API_URL`, `ZATCA_CERTIFICATE`, `MOYASAR_API_KEY`/`MOYASAR_SECRET_KEY`, `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET`, `HYPERPAY_*`, `TWILIO_*`. This is a **local-machine** finding only — production (Vercel) environment variables were not accessible in this pass. **UNVERIFIED for production; verify with `vercel env ls` against the live project.**

## 9. Dependency notes (`package.json`)

- Three overlapping component/primitive systems present at once: `@radix-ui/react-*` (2 packages only), `@base-ui/react`, and `shadcn` — suggests partial migration between UI kits rather than a settled system.
- `lucide-react: "^1.16.0"` — worth a manual npm-registry check; most of this codebase's icon imports assume the 0.x API surface used in recent lucide versions. **UNVERIFIED** — flagged for manual confirmation (`npm view lucide-react versions`), not confirmed broken in this pass.
- Payment SDKs (`stripe`, plus Moyasar/HyperPay via raw `fetch`) and `twilio` are full dependencies despite the payment flow being unreachable from any UI (§5) — dead weight shipped into the server bundle either way (server-only, so no client bundle cost, but maintenance/audit surface cost).
- `@react-pdf/renderer` + 2 bundled Arabic font `.ttf` files (`lib/pdf/fonts/*.ttf`) exist solely for the quotation invoice PDF route — confirm this is still needed given payments are unreachable.
- `next-remove-imports` present alongside a manual `outputFileTracingIncludes` workaround in `next.config.ts:8-10` for the same PDF/font issue — possible redundant tooling, worth a single fix rather than two.

## 10. Middleware / i18n routing (Arabic — corrects 00-FINDINGS.md's "English only, no ar route" claim)

**NOT REPRODUCED as stated.** `app/ar/` is real and wired, not absent:

- `AR_REAL_ROUTES = ["/", "/about", "/contact", "/faq", "/pricing", "/partners"]` have real SSR pages under `app/ar/*` with their own translated `metadata` and `alternates.languages` (en/ar/x-default) — `lib/config/i18n.ts:2`, `app/ar/page.tsx:4-25`.
- `AR_REWRITE_ROUTES = ["/book", "/track-booking", "/partners/driver-registration"]` are internally rewritten to Arabic client copy but intentionally not indexed — `lib/config/i18n.ts:6`, `middleware.ts:54-57`.
- Any other `/ar/*` path 301-redirects to the English equivalent (`middleware.ts:12-17`) — this is deliberate duplicate-content avoidance, not a broken/missing feature.
- **However**, confirmed current bug: `app/layout.tsx:223` hardcodes `<html lang="en" ...>` in the root layout with no per-locale override, so even the real `/ar/*` pages ship `lang="en"` at the document level. **CONFIRMED** (still present as of this pass; flagged in the prior 2026-08-04 audit and not yet fixed).
- Only 6 of ~30+ indexable page templates have Arabic content; the rest (all 71 route pages, all location pages, all 19 service pages, blog, guides) are English-only with no hreflang alternate. Scope of the gap: **PARTIAL** confirmation of the original finding — Arabic exists but covers a small fraction of the site's indexable surface.

## 11. What's already been fixed since the last internal audit (2026-08-04)

Confirmed via direct code read, not assumption — these items from `docs/audit/*` (dated 2026-08-04) are **no longer reproducible** in the current codebase:

- Fake "Google Review — Verified Trip" labels and hardcoded "4.9/5" aggregate rating: **removed** (repo-wide grep for both strings across `.ts`/`.tsx` returns no customer-facing matches; only a code comment in `lib/schema.ts:101-103` explaining why it was removed remains).
- `NODE_TLS_REJECT_UNAUTHORIZED=0` global TLS bypass: **removed** (`.env.local:6-8` now contains a comment recording the removal, "Phase 1A").
- `/book` wizard not notifying anyone on booking: **fixed** — `app/api/bookings/route.ts:193` now calls `notifyNewBooking()`, confirmed via fresh subagent read of the current file.
- Old three-engine pricing split (`lib/pricing.ts` fixedRoutes vs `ROUTES_DATA` vs hardcoded JSX): **partially consolidated** into `lib/pricing/quote.ts` reading from `lib/pricing/data/*`, which itself derives from `ROUTES_DATA` — but per §3 above, at least 9 other hardcoded fact sources still exist outside this engine, so the underlying duplication problem persists in a different shape, not solved.
- "Ministry of Transport Certified" unbacked claim under the price calculator: **fixed** at that one location — now gated behind `hasCredential(credentials.motLicenseNumber)` which is currently `null`, so nothing renders (`lib/config/credentials.ts:12,20-22`, `components/booking/PriceCalculator.tsx:605-608`). **However**, the same class of unbacked "ZATCA-compliant / VAT-registered / ZATCA-certified" claim remains un-gated (plain hardcoded text, not behind `hasCredential`) in at least 5 other files — see `02-PROBLEMS.md`.
