# Master SEO + Bookings + GEO/AIO/LLM + Route Opportunity Audit
Date: 2026-09-27 · Scope: full-site Phase 0 audit (no code changes made)

---

## A. EXECUTIVE DIAGNOSIS

**Confirmed technical problems**
1. Funnel is almost completely dark for measurement. Of 7 target events (`whatsapp_click`, `quote_form_start`, `quote_form_submit`, `booking_form_start`, `booking_form_success`, `phone_click`, `email_click`), only `whatsapp_click` fires, and only from 2 components. You cannot currently tell which page, route, or CTA produces a lead. **This alone can explain "traffic without visible bookings" even if bookings are actually happening** — you may be flying blind, not actually underperforming.
2. Lead capture is split across **three unrelated backends** with no single source of truth: `app/api/leads` → Prisma `Lead`, `app/api/bookings` → Prisma `Booking`, `app/api/quotations` → Supabase RPC. A 4th, fully built corporate form (`booking-form.tsx`) is dead code, never rendered. This makes "how many leads did we get" an unanswerable question without querying 3 systems.
3. `twitter.title` (G1) is fixed on locations/distance/routes/about via the shared `lib/seo.ts` helper, but **still falls back to the site default on airport pages and car-recovery service pages** — confirmed by direct file inspection, not assumption.
4. Hero image LCP issue (G3) is fixed on the homepage and route-detail template, but **still present on location pages, airport-transfer service page, and Ziyarat service pages** — copy-pasted hero markup, no shared `Hero` component, so the fix didn't propagate.
5. Duplicate `FAQPage` JSON-LD (G12) is real and reproducible today: `RootDocument.tsx` emits a sitewide FAQ schema on every page, and `/faq` additionally emits its own — two `FAQPage` scripts on one URL.
6. No Arabic language-switcher exists anywhere in the Navbar or Footer. `/ar/*` pages are only reachable by typing the URL or via sitemap crawl — a real user on the English site cannot find the Arabic version, and this weakens hreflang's practical value even where it's correctly coded.
7. `/guides` (22 pages) has zero internal links from Navbar or Footer — fully orphaned except for sitemap discovery.

**Confirmed SEO problems**
8. Cannibalization: primary keyword **"dhahran taxi"** is claimed by both `/locations/dhahran` and `/locations/dammam/dhahran` in `keyword-map.csv` — a real, previously unflagged conflict.
9. Three-way overlapping intent, never resolved: `/routes/jeddah-airport-to-makkah` vs `/blog/jeddah-to-madinah-taxi-guide` vs `/guides/jeddah-airport-to-makkah-guide`.
10. Hreflang is inconsistent by design-so-far: only the 27 curated Arabic route slugs get reciprocal `hreflang`; the other ~73 English routes, and all location/distance/airport/fleet/blog/guide pages, have canonical but no hreflang (acceptable *if* no Arabic counterpart exists — but it means Arabic expansion silently changes an SEO signal every time a page gets translated, and this isn't tracked anywhere as a checklist item).

**Likely conversion problems (evidence-based, not yet root-caused)**
11. WhatsApp CTA quality is wildly inconsistent: the best implementation (`WhatsAppQuoteForm.tsx`) is fully data-driven and bilingual; several page-level CTAs are one unstructured line; the global floating button (present on *every* page) is generic; and — correcting a prior assumption — the production **Footer has no prefilled text at all** (`site-footer.tsx`, which does have the good bulleted message, is dead code never rendered). A large share of first-touch WhatsApp clicks site-wide are hitting the weakest version, not the best one.
12. Corporate form (`CorporateAccountForm.tsx`, only on `/services/corporate`) collects company/contact/email/phone/frequency but **not VAT number, PO reference, city, or vehicle type** — Path B intake is still thinner than the CLAUDE.md-approved invoicing answer implies it should be.
13. On car-recovery pages, two full-width `z-50` WhatsApp CTAs (floating round button + sticky mobile bar) render simultaneously on mobile — visual collision, not measured but visually confirmable.

**Hypotheses requiring more data (do not act on these without confirmation)**
14. `/driver-jobs/*`, `/chauffeur-jobs/*`, `/taxi-driver-jobs/*` don't exist as live pages — they're pure 301s to nearest location/recovery/home pages — yet the 2026-09-25 GSC export (6-month window) shows `/driver-jobs/riyadh` as the single highest-performing URL (187 clicks / 1,475 impressions / pos 7.07). This is very likely **stale ranking signal**: Google indexed the old URL, hasn't fully migrated authority to the redirect target yet, and users are still clicking the old SERP snippet. It is *not* evidence the redirect is broken. But it means: (a) we don't yet know if the redirect targets are actually capturing and converting that traffic, and (b) this was previously mis-reported in an earlier audit as "deleted" — it's redirected, not deleted, and that distinction matters for expectations.
15. Whether the apparent 2026-09-25 `keyword-map.csv` batch (subarea/distance/fleet pages) was actually shipped is unclear — `page-log.md` stops at 2026-09-22 and doesn't document it.
16. Whether the built-but-undeployed Jordan Phase 1+2 pages (7 pages, 2026-09-22) are still pending deploy or shipped since.

**Missing data**
17. No real GSC data older than the single 2026-09-25 (last-6-months) pull — can't see trend direction, seasonality, or pre/post-redirect comparison for `/driver-jobs`.
18. `seo/facts.md` still has ~14 unresolved `{{TODO}}`s (quote turnaround, cancellation window, payment terms, languages, TGA regulatory status, etc.) that block writing trust blocks on any page touched going forward.

---

## B. CURRENT SITE HEALTH (important issues only)

| Area | Status |
|---|---|
| Route/IA structure | Solid, data-driven (100 routes, 15 locations, 33 sub-areas, 9 airports, 22 services, 16 distance guides) — genuinely structured content, not a naked city-swap matrix |
| Sitemap/robots | Correct, comprehensive, explicitly whitelists AI crawlers |
| Redirects | Clean, purposeful (dedupe, retired job pages, service renames) |
| Canonical | Present on essentially every route category |
| Hreflang | Correct where implemented, but only covers ~27% of routes and 0% of locations/airports/distance/fleet/blog |
| Schema | Clean — no forbidden `AggregateRating`/`Review`, `Offer` has no invented price (explicit code comment shows this was a deliberate removal). One real duplicate (`/faq`) |
| Tracking | Broken/absent for 6 of 7 key events — this is the biggest blind spot on the whole site |
| Lead backend | Fragmented across 3 systems + 1 dead component |
| Arabic | Technically correct where it exists, but undiscoverable (no switcher) and covers a small fraction of the site |
| Fake trust signals | None found in this pass (prior fake testimonials issue from 2026-08-31 audit — not re-verified in this pass, carry forward) |

---

## C. DUPLICATE / CANNIBALIZATION MAP

| URL | Competing URL | Intent | Recommendation | Reason | Risk |
|---|---|---|---|---|---|
| `/locations/dhahran` | `/locations/dammam/dhahran` | Same primary keyword "dhahran taxi" literally duplicated in registry | **Differentiate by buyer/keyword, not delete** | Sub-area page should target hyper-local intent (e.g. "Dhahran Camp / KFUPM pickup"), parent should keep the head term | Real ranking dilution risk today |
| `/routes/makkah-to-madinah` | `/distance/makkah-to-madinah` | Transactional vs informational — same head term | **Keep both**, verify registry rows use distinct primary keywords (transactional "private transfer" vs informational "distance/how far") | Legitimate content-type pairing, well cross-linked already | Low — monitor only |
| `/routes/jeddah-airport-to-makkah` | `/routes/riyadh-to-jeddah` pattern repeats | Same transactional/informational split | Same as above | Same pattern | Low |
| `/routes/jeddah-airport-to-makkah` | `/blog/jeddah-to-madinah-taxi-guide` | `/guides/jeddah-airport-to-makkah-guide` | 3-way overlap, never resolved | **Consolidate or clearly differentiate by funnel stage** (guide = pre-purchase research, route = booking-ready, blog = should probably fold into one of the two) | Never decided in any prior audit | Medium — name the survivor |
| `/services/corporate`, `/services/business-executive`, `/services/corporate-bahrain-transport` | — | Corporate/B2B intent split 3 ways | **Differentiate by buyer**, not synonym (corporate = recurring account, business-executive = single VIP trip, corporate-bahrain = cross-border corporate) — flagged in prior audit, still unresolved | Carried forward, unresolved | Medium |
| `/services/intercity`, `/services/long-distance` | — | Near-identical service framing | Needs a look — not investigated this pass | — | Unknown — flag only |

---

## D. BOOKING FUNNEL PROBLEMS (search → landing → CTA → WhatsApp/form → lead)

1. **CTA inconsistency** — see A.11. The single highest-traffic touchpoint (global floating button, every page) uses the weakest generic prefill of the three tiers that exist in the codebase.
2. **No visibility into what's working** — A.1/A.2. This is the root problem this whole exercise was trying to diagnose, and it's the honest answer: you can't currently know why bookings are or aren't happening because almost nothing is instrumented.
3. **Corporate intake is shallow** — A.12. A delegation/PCO buyer filling the one corporate form still can't submit VAT/PO/city/vehicle detail in one step; likely falls back to email, adding friction exactly where CLAUDE.md flags Path B as highest-value.
4. **Mobile CTA collision on recovery pages** — A.13. Visual, not yet quantified with a screenshot, but structurally confirmed in code.
5. **Sticky/mobile CTA dead code** (`ScrollCTA.tsx`) exists but is unused — not a bug, just confirms there's no single owned "sticky CTA" pattern site-wide; each vertical invented its own.
6. **`booking-form.tsx`** — a fully-built form wired to the (correct, RPC-based) Supabase backend is not rendered anywhere. Either finish wiring it in, or delete it; right now it's neither used nor a working improvement.

---

## E. COMPETITOR GAP MAP (TSA vs taxiserviceksa.com)

**Legitimate structural patterns worth considering**
- Dedicated Umrah/Ziyarat vertical with its own nav category and linked educational content (TSA already has 6 Ziyarat/Umrah pages — the gap is *nav visibility and internal linking depth*, not the content itself).
- Explicit "customized monthly billing" framing for recurring corporate rides — a concrete Path B hook TSA's corporate page could adopt in real, verifiable terms once `seo/facts.md` invoicing terms are filled in.
- Multi-channel contact parity (WhatsApp + phone + email + form all visible at once) — TSA has the pieces but not always together on one page.
- Trilingual (EN/UR/AR) targeting the Umrah/labor demographic — TSA has no Urdu content; flag as a future consideration only, not this batch.
- Route pages with logistical detail (rest stops, traveler-segment-to-vehicle matching) — TSA's `distance/[slug]` guides already do this reasonably well; the gap is that `routes/[slug]` pages for the ~73 non-curated slugs may be thinner.
- Named founder bio as a trust substitute — directly matches CLAUDE.md §14's own prescribed EEAT substitute; not yet seen implemented on TSA (verify).

**Things competitor has that TSA must NOT copy**
- Unverifiable "25,000+ Happy Travelers" statistic.
- Superlative claims: "the best online transfer service for Umrah pilgrims," "better than Uber, Careem, or Kaiian," "#1 Airport Taxi," "BEST VIP Private Transfer" — all forbidden under CLAUDE.md §7.
- Blanket "Licensed by Transport General Authority (TGA)" claim with no visible certificate — TSA is explicitly a platform, not a licensed operator (CLAUDE.md §14); must never mirror this framing.
- Reviews badge with no visible verifiable count/rating.
- Visible "From 300 SAR" teaser pricing with no stated basis — conflicts with TSA's locked pricing-neutralization decision; do not reverse it to compete.

---

## F. SERVICE OPPORTUNITIES

| Opportunity | Current state | Verdict |
|---|---|---|
| Hourly chauffeur (Riyadh/Jeddah/Dammam) | **No page exists.** Directional research: highly contested by established specialist brands (Blacklane, Roark, ET Chauffeurs). | Build only with real differentiation (e.g. paired with corporate Path B, not a generic "hourly hire" page) — not a quick win |
| Full-day / multi-day chauffeur | No dedicated page; closest are `intercity`, `long-distance`, `vip-transportation` | Genuine gap, but needs `seo/facts.md` operational confirmation (standby capability, multi-day terms) before writing anything |
| Corporate / recurring agreements | Exists (`/services/corporate`) but shallow form (A.12) | **Strengthen existing page, don't create a new one** |
| Travel agency / Umrah operator / hotel B2B | Not found as a dedicated page | Real gap, but needs an operational answer first (does TSA actually support B2B accounts?) — facts-blocked |
| Event transport | `/events` hub + 22 event pages already exist (per memory, deployed 2026-08-23) | Already covered — leave alone |
| Airport transfers | 9 airport pages exist, well-linked from Footer | Already covered — leave alone |
| Umrah / Ziyarat | 6 pages exist (`umrah-transport`, `hajj-transport`, `makkah-ziyarat`, `madinah-ziyarat`, `badr-ziyarat`, `taif-ziyarat`) | Already covered — the gap is *nav discoverability*, not content existence |
| Car recovery (Satha) | Full cluster exists, actively maintained (bhai's business) | Already covered — leave alone, only fix the CTA collision (A.13) |

---

## G. ROUTE OPPORTUNITY MAP

| Cluster | Current state | Directional demand signal | Verdict |
|---|---|---|---|
| Makkah/Madinah/Jeddah core | Both route + distance pages exist, well cross-linked | Highly competitive, mature niche — multiple dedicated commercial pages already rank | Protect and refine existing pages; do not expect new pages to break in easily |
| Saudi ↔ Kuwait | 2 of a larger plan built (`kuwait-to-dammam`, `kuwait-to-riyadh`); architecture locked, 1-page-at-a-time | Dammam↔Kuwait specifically looks **underserved** (thin/generic competing results) | Continue the existing locked plan — good use of effort |
| Saudi ↔ Jordan | 11 routes approved in principle; 7 more built 2026-09-22 but **not confirmed deployed**; hub pages held back pending GSC proof | "Riyadh to Amman private transfer" ground-transfer competition is almost nonexistent — but this may reflect weak real demand (14-hr drive vs. flying) rather than opportunity | Confirm deploy status first; do not build the held-back hub pages yet — still no GSC proof as the plan requires |
| GCC (Bahrain/Qatar/UAE) | Bahrain/Abu Dhabi/UAE clusters substantially built per memory (2026-09-13/14) | Not freshly tested this pass | Leave alone, already active work |
| Domestic expansion beyond core cities | 15 locations + 33 sub-areas already exist | Not tested this pass | No evidence-based reason to expand further right now |

---

## H. ARABIC OPPORTUNITY MAP

The technical implementation (canonical, reciprocal hreflang, genuine translated prose) is correct where it exists — confirmed by direct inspection of `/ar/services/car-recovery`. The problems are coverage and discoverability, not quality:

| Issue | Detail | Priority |
|---|---|---|
| No language switcher | Zero links to `/ar/*` from Navbar or Footer anywhere on the English site | **P0-equivalent** — undermines the value of every correctly-built Arabic page |
| Coverage is thin | Only 27 of 100 routes, 0 of 15 locations, 0 of 9 airports, a handful of services have Arabic versions | Expand only where GSC shows Arabic-language query evidence — no such evidence was found in this pass (only one English-language GSC export exists) |
| Locale-mixing breadcrumb | `/ar/services/car-recovery` breadcrumb links "الخدمات" → `/services` (English URL) instead of an Arabic hub that doesn't exist | Minor, fix opportunistically |

**Recommendation**: fix the switcher (small, high-leverage, no content risk) before expanding Arabic coverage further — expanding pages nobody can find is wasted effort.

---

## I. INTERNAL LINKING PLAN

- **Add an Arabic language switcher** to Navbar and Footer (English pages → their real `/ar` counterpart where one exists; hide/disable where none exists — do not link to a redirect).
- **Link `/guides` from somewhere real** — currently zero internal links from Navbar/Footer/Footer "Company" column (which does link `/distance`, `/blog`, `/pricing`, `/faq`, `/gallery`, `/track-booking` but not `/guides`). Add it to Footer's Company column.
- **Hub → Route**: only 5 of ~100 routes and 12 of 15 locations get direct Navbar exposure today; the rest rely on sitemap crawl + in-content `related[]` links. This is acceptable for a site this size but means new routes should always populate their `related[]` array — verify this is being done for every new route added.
- **Corporate page → related Path B pages**: `/services/corporate` should link to `/services/business-executive` and `/services/corporate-bahrain-transport` with differentiated anchor text once C's 3-way split is resolved.

---

## J. URL STRUCTURE PLAN

**Stays as-is** (no changes proposed — architecture is sound):
- `/routes/[slug]`, `/distance/[slug]`, `/locations/[city]/[subarea]`, `/airports/[slug]`, `/services/*`, `/events/[slug]`, `/fleet/[slug]`, `/blog/[slug]`, `/guides/[slug]`, `/ar/*` pattern.

**No merges, no redirects, no re-canonicals proposed in this report** — per protocol, any such action requires explicit approval and this is a report, not an implementation.

**Flagged for a future decision (not a URL change today)**:
- `/locations/dhahran` vs `/locations/dammam/dhahran` keyword conflict (C).
- The 3-way `/routes` / `/blog` / `/guides` Jeddah–Makkah overlap (C).

---

## K. NEW PAGE INVENTORY

Given the evidence gathered, I'm **not recommending any new page be built yet**. Reasoning: every "gap" found either (a) needs a `seo/facts.md` answer first (hourly rates/terms, multi-day/standby capability, B2B account terms), (b) is already covered and just needs a linking/CTA fix, or (c) lacks real demand evidence (Arabic expansion, further domestic routes). Building pages now would violate the site's own restraint principle (§29: "does an existing URL already serve this intent?").

**Not recommended to build right now**: generic hourly-chauffeur page (too contested without differentiation), Jordan hub pages (still no GSC proof), further Arabic route pages (no demand evidence yet), any city×city matrix expansion.

---

## L. BATCH PLAN

### Batch 0 — Technical/conversion blockers (do first, low risk, no content decisions needed)
1. Fix `twitter.title` on airport pages + car-recovery service pages (extend existing `lib/seo.ts` helper usage).
2. Fix hero image LCP (`priority` + `sizes`) on location pages, airport-transfers, and Ziyarat service pages (reuse the already-correct pattern from `routes/[slug]`).
3. Remove the duplicate `/faq` `FAQPage` JSON-LD (keep the page-specific one, drop the sitewide one for that route, or vice versa).
4. Add `whatsapp_click`, `phone_click`, `email_click`, `quote_form_submit` tracking calls at the actual CTA/form call sites (types already exist in `lib/analytics.ts` for most of these — this is wiring, not new infrastructure).
5. Replace the weakest-tier WhatsApp prefills (global floating button + bare-link Navbar/home-page instances) with the structured bulleted message already proven in `WhatsAppQuoteForm.tsx`.
6. Delete or finish `booking-form.tsx` (dead code decision) and `site-footer.tsx`/`ScrollCTA.tsx` (dead code decision) — your call which.

### Batch 1 — Arabic discoverability
7. Add language switcher to Navbar + Footer.
8. Link `/guides` from Footer.

### Batch 2 — Conversion depth
9. Add VAT number, PO reference, city, and vehicle-type fields to `CorporateAccountForm.tsx`.
10. Fix the mobile CTA collision on car-recovery pages (choose one sticky pattern, not two).

**Not batched yet** (blocked on facts or explicit decisions): the corporate/business-executive/corporate-bahrain-transport split, hourly/full-day/multi-day chauffeur pages, any Jordan hub pages, any new Arabic route pages.

---

## M. DO-NOT-TOUCH LIST

- Route/location/airport/distance data architecture (`lib/data/*`) — well-structured, don't refactor.
- Sitemap, robots, redirect config in `next.config.ts` and `middleware.ts` — correct and purposeful.
- Schema types in use — clean, no forbidden types, don't add anything "just because."
- Pricing neutralization (no SAR figures in body copy) — locked decision, do not reverse to compete with competitor's visible pricing.
- `/routes/dammam-to-doha` and other GSC-confirmed working pages — best-performing real commercial page in the export; don't touch title/H1 without approval per CLAUDE.md rule 3.
- Kuwait/Bahrain/Abu Dhabi/GCC route-building work already in progress — continue per existing locked plan, don't re-plan it here.
- `/events` hub and 22 event pages, `/services/car-recovery` cluster — already deployed and working, per memory.

---

## N. TOP PRIORITY BLOCKERS

1. **Tracking is dark.** Fix this before making any more content/SEO decisions based on "what converts" — right now that's a guess. (Batch 0.4)
2. **Corroborate `/driver-jobs` GSC anomaly.** Confirm whether the redirect targets are actually retaining that traffic, or whether it's decaying/lost. Needs a second GSC pull in a few weeks to compare, not a code fix today.
3. **Confirm deploy status** of the 2026-09-22 Jordan pages and the apparent 2026-09-25 keyword-map batch — `page-log.md` is out of sync with `keyword-map.csv`, and I can't tell what's actually live without your confirmation.
4. **`seo/facts.md` TODOs** — still the single biggest thing blocking any new trust/pricing/corporate content, unchanged from prior audits.
5. **Footer WhatsApp CTA has zero prefill text** — corrects a standing (wrong) assumption in prior memory that the footer had the *good* message; it's actually the worst one, and it's sitewide.

---

**Approve which items?** (e.g. "Batch 0 all", "Batch 0 items 1-3 only", "skip tracking, do the rest")
