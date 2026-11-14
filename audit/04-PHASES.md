# 04 — Phases

Ordered by revenue impact per hour of work, not technical tidiness. Every phase ships a working site; none is a rewrite. Maximum 8 phases (using 7).

---

## Phase 0 — Safety net: verify production config, no visual change

**Goal:** Resolve every UNVERIFIED item from `02-PROBLEMS.md` that gates whether P0-2/P0-6/P0-7 are even live in production, and confirm the two unauthenticated-risk endpoints, before touching any code. This phase is pure verification plus, if needed, adding missing production env vars — reversible by design.

**Exact actions (no file changes unless a var is genuinely missing):**
- Run `vercel env ls` (or equivalent dashboard check) against the production project for: `NEXT_PUBLIC_GOOGLE_MAPS_KEY`, `ZATCA_VAT_NUMBER`, `ZATCA_API_URL`, `ZATCA_CERTIFICATE`, `MOYASAR_API_KEY`, `STRIPE_SECRET_KEY`, `HYPERPAY_*`.
- Open `app/api/seed-routes/route.ts` and `app/api/setup-admin/route.ts` and confirm each has its own auth/secret check independent of `middleware.ts`'s `/api/admin/*` matcher.
- If `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is missing in production, add it — this alone may resolve P0-2 with zero code change.
- If either maintenance endpoint lacks auth, add a simple shared-secret header check (small, isolated change, not a redesign).

**Acceptance criteria:** A written answer (even a one-line note in the repo) to "is the price calculator using real distances in production right now, yes or no" and "are the two maintenance endpoints protected, yes or no." If the Maps key was missing and is now added, a manual test quote (e.g. Jeddah Airport → Jeddah City) returns a distance close to the real ~20 km, not a text-length-derived number.

**Rollback:** Env var changes are additive and instantly revertible in the Vercel dashboard; no code risk.

**Effort:** S (under 2 hours, mostly waiting on dashboard access).

**Metric moved:** Removes the single biggest unknown blocking every other phase's priority order — specifically de-risks whether P0-2 (fake pricing) is a live production bug or already fixed.

---

## Phase 1 — Kill the visible price/fact contradictions

**Goal:** Every number a human visitor can compare across two pages in the same session agrees. This is the fastest, lowest-risk fix for the exact pattern 00-FINDINGS.md opens with, and it's mechanical (delete literals, add a lookup), not a redesign.

**Exact file changes:**
- `app/layout.tsx:151-155,165-171` — replace hardcoded distance/duration/price strings in the root FAQPage JSON-LD with values pulled from `ROUTES_DATA` by slug (`jeddah-airport-to-makkah`, `makkah-to-madinah`).
- `components/sections/home-page.tsx:530-536` and `:1406-1410` — delete both hardcoded route arrays; render from `ROUTES_DATA` (map by slug for the specific routes each widget wants to feature).
- `lib/data/routes.ts:36` vs `:410` (Jeddah↔Madinah) and `:49` vs `:397` (Jeddah Airport↔Madinah) — either equalize the two directions' prices or add a one-line, visible reason on both route pages if the asymmetry is intentional (e.g. empty-return deadheading).
- `lib/config/stats.ts:5-6`, `app/(marketing)/routes/RoutesClient.tsx:60`, `app/(marketing)/routes/page.tsx:8`, `app/(marketing)/locations/[city]/page.tsx:249` — replace "56+"/"50+" literals with `ROUTES_DATA.length` (or a rounded-down computed value if an exact count feels too precise for marketing copy).
- `app/(marketing)/routes/RoutesClient.tsx:18,23` — fix the filter to key off a real city field instead of `fromCity.split(' ')[0]`.

**Acceptance criteria:** Manually visit homepage → click through to `/routes/madinah-to-jeddah-airport` → price matches. Visit `/routes` and use the city filter → no truncated tokens ("Al", "Doha,") appear in the dropdown. `view-source:` the homepage and confirm the root FAQPage JSON-LD numbers match the route pages. Route count displayed on homepage stats, `/routes` H1, and `/routes` meta description are identical to each other and to `ROUTES_DATA.length`.

**Rollback:** Each change is an isolated literal→lookup swap in a single file; revert via git per-file if any single page regresses visually.

**Effort:** S–M (1–2 days).

**Metric moved:** Direct trust/bounce-rate impact on the highest-traffic pages (homepage, `/routes`); expected to show up as improved time-on-page and reduced immediate-exit rate on GA4 once Phase 3 installs proper event tracking to measure it.

---

## Phase 2 — Fix or gate every unbacked trust/legal claim

**Goal:** No page states a regulatory or verification claim ("ZATCA-compliant," "Ministry of Transport Certified," a legal entity name) that isn't backed by a real value in `lib/config/credentials.ts`. This directly targets the corporate-account segment the owner wants to grow — that segment is the one most likely to actually check these claims.

**Exact file changes:**
- Obtain and enter real values in `lib/config/credentials.ts:8-17` (CR number, MoT/TGA licence, VAT number, legal entity name) — this is a business/ops task, not a code task, and unblocks everything else in this phase.
- Wrap every remaining unbacked claim in `hasCredential(...)`, matching the existing pattern at `components/booking/PriceCalculator.tsx:605-608`: `components/sections/home-page.tsx:116`, `app/about/page.tsx:62`, `app/(marketing)/services/corporate/page.tsx:35,49,89,152,187`, `app/(marketing)/services/business-executive/page.tsx:12,121`, `components/layout/Footer.tsx:16,298`.
- `lib/zatca.ts:63-64` — read `sellerName` from `credentials.legalEntityName` instead of the hardcoded "Riyadh Luxe Transportation Co."; `sellerVATNumber` from `credentials.vatNumber` with no placeholder fallback — if either is null, `buildZATCAInvoice` should throw/return an explicit "not configured" error rather than fabricate a value.
- `components/layout/Footer.tsx:14,26,38` — replace "Created with absolute elegance" copyright line with the real entity name once available (or drop the phrase now, independent of the entity-name work).

**Acceptance criteria:** Repo-wide grep for "ZATCA" and "Ministry of Transport" in `app/**`/`components/**` shows every remaining occurrence either reads from `credentials.*` or is wrapped in `hasCredential(...)`. If `credentials.vatNumber` is still null at ship time, none of those claims render anywhere (verified by a full click-through of about/corporate/business-executive/footer with credentials left null) — the site makes zero unbacked claims rather than fewer unbacked claims.

**Rollback:** Each `hasCredential()` wrap is additive (worst case, a claim that used to show now doesn't, which is the safe failure direction) — revertible per-file.

**Effort:** S–M (1 day of code, plus however long it takes the business to obtain the real CR/VAT/licence numbers — that part is off the critical path and can run in parallel with Phase 1).

**Metric moved:** Corporate-account enquiry rate (once Phase 3 tracks it) and reduced legal exposure — not directly measurable via analytics, but the highest-leverage phase for the "growth-blocking" segment specifically named by the owner.

---

## Phase 3 — Close the lead-capture and measurement gaps

**Goal:** No lead is lost to a failed email, an abandoned form, or a missing analytics event. This is the phase that lets every later marketing dollar (ads, GBP, content) actually be measured.

**Exact file changes:**
- `app/api/contact/route.ts` — add a `prisma.lead.create` (or a new minimal `B2BLead`-shaped write) before/alongside the existing Resend email send, so `/partners` and `CorporateAccountForm` submissions survive an email failure. Mirrors the existing pattern in `app/api/leads/route.ts:19`.
- `lib/analytics.ts:4-11` — fire the two dead event types: add `trackEvent("booking_completed", ...)` in `app/api/bookings/route.ts`'s success response handling (client-side, on the step-6 confirmation render in `app/book/page.tsx`) and `trackEvent("phone_click", ...)` on every `tel:` link (`contactConfig.primaryPhoneLink` usages).
- `app/book/page.tsx:161-169` — in addition to the existing `sessionStorage` draft, POST a partial-lead record to `/api/leads` as soon as pickup+dropoff+date are known (step 1 complete), not only on final submit — mirrors what `PriceCalculator.tsx:534-550` already does before its WhatsApp hand-off.
- `components/shared/WhatsAppButton.tsx:110-113` — remove the hardcoded fake "1" unread badge (quick, unrelated cleanup bundled here since it's the same file family).

**Acceptance criteria:** Submit a test `/partners` form with Resend temporarily misconfigured (or check logs) → confirm a DB row exists regardless. In GA4/GTM debug view, confirm `booking_completed` and `phone_click` fire on a real test booking and a real `tel:` click. Abandon a `/book` flow after step 1 → confirm a partial lead row exists in the `Lead` table.

**Rollback:** All additive (new DB writes, new event calls) — no existing behavior is removed except the fake badge; revert per-file if any write causes an error spike.

**Effort:** M (2–3 days).

**Metric moved:** Enquiries (the owner's stated top metric) — this phase doesn't necessarily create more enquiries, but it stops losing the ones already happening and, critically, makes every subsequent phase's impact measurable for the first time.

---

## Phase 4 — Fix the pricing engine's fake-distance fallback

**Goal:** No visitor ever sees a fabricated distance/duration. Builds directly on Phase 0's verification.

**Exact file changes:**
- `app/api/pricing/route.ts:61-65` — replace the char-count fallback (`distance = max(30, min(650, charSum*4.5))`) with: (a) if the pickup/dropoff match a known `ROUTES_DATA` city/airport pair, use that route's real `distanceKm`/`durationMinutes`; (b) if genuinely free-text and unmatched, return a clear "request a manual quote on WhatsApp" response instead of a fabricated number — never synthesize geography from string length.
- `lib/pricing/data/routes.ts` — this file already wraps `ROUTES_DATA` with pricing-relevant fields; wire `app/api/pricing/route.ts`'s known-pair matching to call `getRoute(slug)` from this module instead of duplicating a lookup.

**Acceptance criteria:** Test quotes for 5 known route pairs (e.g. every route in `ROUTES_DATA` used in Phase 1's manual spot-check) return distances within a few km of the `ROUTES_DATA` value. A deliberately nonsense pickup/dropoff pair (e.g. random strings) no longer returns a plausible-looking fake price — it returns the "request a manual quote" path instead.

**Rollback:** Isolated to one route handler; revert to the previous fallback (imperfect but no worse) if the new matching logic misfires on real user input.

**Effort:** M (2 days, mostly building the known-pair matcher and testing edge cases in free-text input).

**Metric moved:** Quote-to-WhatsApp-click conversion rate on `PriceCalculator` (trackable via the `quote_generated`→`whatsapp_click` funnel now that Phase 3 has proper event tracking) — directly targets the "1.5 hours for 20km" bounce mechanism named in 00-FINDINGS as likely the single largest lead-loss cause.

---

## Phase 5 — Wire the built payment backend to the booking UI

**Goal:** A visitor who wants to pay a deposit or the full fare online, right now, can — using the Moyasar/HyperPay/Stripe backend that already exists and works, just isn't reachable.

**Exact file changes:**
- `app/book/page.tsx` — add a payment step between the existing "Summary/Review" step and "Confirmation" step, calling the already-built `app/api/payments/create-session/route.ts` (or `/initiate` for HyperPay). Keep "pay cash/card to driver" as an explicit alternative option, not a forced flow — some segments (walk-up airport bookings) will still prefer it.
- No changes needed to the webhook handlers (`app/api/webhooks/moyasar/route.ts`, `app/api/payments/webhook/hyperpay/route.ts`) — confirmed already functionally complete, they just need traffic.
- `lib/zatca.ts` — ensure Phase 2's credential-gating is in place before this ships, since a real payment now triggers real invoice generation.

**Acceptance criteria:** A test booking with Moyasar test-mode keys completes an end-to-end payment and the resulting `Payment`/`Booking` rows show `PAID`/`CONFIRMED` status, matching what the webhook handler already does today when manually triggered. Cash/card-to-driver remains available as a selectable option, not removed.

**Rollback:** The new payment step is additive UI; if it misbehaves, hide it behind a feature flag and fall back to the current cash-only flow with zero other regression.

**Effort:** M–L (3–4 days, mostly UI + edge-case testing of payment failure/retry states).

**Metric moved:** Enables online payment capture at all (currently zero), which is a hard requirement for the corporate/international/VIP segments the owner wants to grow — those bookers frequently need to prepay for expense/procurement reasons regardless of price.

---

## Phase 6 — Consolidate the route/location data layer and fix `/routes` DB drift

**Goal:** Reduce "how many places to change one price" from 10+ back to 1, permanently, and stop the recurring live-DB-drift hotfix pattern seen in recent commits.

**Exact file changes:**
- Decide the single source: recommend keeping `lib/data/routes.ts` (`ROUTES_DATA`) as canonical and making `/routes` (`app/(marketing)/routes/page.tsx:29-46`) render directly from it instead of `db.route.findMany()` — removes the Prisma `Route` table's role as a second, driftable copy. (Alternative direction — DB canonical, static array generated from it at build time — is also valid; either is acceptable as long as only one is authoritative.)
- `app/(marketing)/services/airport-transfers/page.tsx:34-40`, `intercity/page.tsx:34-39`, `long-distance/page.tsx:38`, `app/pricing/page.tsx:156-162` — replace the remaining hardcoded route-fact arrays with lookups against `ROUTES_DATA` by slug.
- `app/(marketing)/routes/[slug]/page.tsx`'s `ROUTE_CONTENT` object — keep the hand-written prose (that's genuinely valuable, unique content) but pull its `tldrFacts` distance/time/price values from `ROUTES_DATA` instead of retyping them, so prose and facts can never disagree even though the prose stays hand-authored.
- `public/llms.txt` — regenerate its route-fact section (currently has its own "Riyadh to Dammam ~410 km" figure vs `ROUTES_DATA`'s 390 km) from `ROUTES_DATA` at build time, or add a script that checks it against `ROUTES_DATA` in CI.
- `components/seo/ServiceRelatedLinks.tsx:8-42` — replace the static 8-route/6-city arrays with a per-service computed related-set (same algorithmic approach already proven in `RouteRelatedLinks.tsx`).
- `app/(marketing)/locations/page.tsx` — derive its hardcoded `LOCATIONS` array from `Object.keys(CITY_DETAILS)`.

**Acceptance criteria:** Grep for `basePrice:` or route-shaped literal objects outside `lib/data/routes.ts` returns zero matches in `app/**`/`components/**`. `/routes` grid and every route detail page show identical distance/duration/price for the same slug, verified programmatically (a small script comparing `ROUTES_DATA` to the rendered page facts) rather than only by manual spot-check. Every one of the 71 routes and 12 locations receives at least one inbound link from a hub or related-links component (verifiable via the same internal-linking check already run in this audit).

**Rollback:** This is a larger refactor; ship it behind route-by-route verification (compare rendered output before/after per template) rather than one big-bang change, and keep the old Prisma `Route` table read-path available (commented, not deleted) for one release in case a rollback is needed.

**Effort:** L (1–2 weeks, given 10+ locations to consolidate and the need to verify no page's rendered content silently changes).

**Metric moved:** Indexed-page consistency (fewer contradicting facts for Google to devalue), and directly unblocks safe scaling to the 2,000+ page target — this is the prerequisite for Phase 7's expansion, not optional polish.

---

## Phase 7 — Arabic parity for money pages + CWV pass on the homepage

**Goal:** The largest named-but-unaddressed growth opportunity (Arabic search, per 00-FINDINGS and the owner's stated priority) gets real coverage on the pages that actually convert, and the homepage stops shipping unnecessary client JS to the mobile-heavy target audience.

**Exact file changes:**
- `components/shared/LanguageSwitcher.tsx` — change the Arabic option to a real `<Link href="/ar">` (or the closest matching `/ar/*` page per `AR_REAL_ROUTES`), not a pure client-state string swap.
- `components/layout/SiteShell.tsx` / `app/layout.tsx:223` — make `<html lang>` conditional on the resolved locale instead of hardcoded `"en"`.
- Extend `AR_REAL_ROUTES` (`lib/config/i18n.ts:2`) and add real `/ar/routes/[slug]` and `/ar/locations/[city]` templates for at minimum the top 10–15 routes/locations by traffic/intent (Jeddah Airport→Makkah, Makkah→Madinah, the Eastern Province↔Bahrain corridor named as Tier 1 in 00-FINDINGS, etc.) — this is a content-production task as much as an engineering one; scope the first batch narrowly.
- `components/sections/home-page.tsx` — split into a server-component shell (static copy/sections) plus small client islands for the hero slideshow (`useState`/`useEffect` around line 748) and scroll-triggered CTAs, removing the blanket `"use client"` from the 1,671-line file.

**Acceptance criteria:** Googlebot-simulated fetch of an `/ar/*` route page returns `<html lang="ar" dir="rtl">` (or equivalent) and correct hreflang back to English. Clicking "Arabic" in the nav from any page navigates to a real `/ar/*` URL. Lighthouse mobile score on the homepage (LCP specifically) improves measurably after the client/server split, verified by before/after Lighthouse runs, not assumed.

**Rollback:** Arabic template additions are new pages (zero risk to existing English pages). The homepage server/client split is riskier — ship behind a visual diff check (the interactive slideshow/CTA behavior must be pixel- and functionally-identical) and roll back the specific file if any interaction breaks.

**Effort:** L (Arabic content production is the long pole — budget 2–4 weeks depending on translation resourcing; the homepage CWV split is a parallel, independent M-effort 3–4 day task within this phase).

**Metric moved:** Arabic organic rankings/impressions (Search Console, once available), Core Web Vitals (Lighthouse/CrUX), and indexed-page count — this phase is explicitly the start of the "demand generation" work that 00-FINDINGS and the owner's stated priorities both point to as the real lead-volume lever, now safe to build on top of Phase 6's consolidated data layer.
