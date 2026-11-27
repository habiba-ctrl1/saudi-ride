# Programmatic SEO Architecture — Premium/GCC/NEOM Expansion

Audit date: 2026-08-05. Written for taxisaudiarabia.com (`taxidriver/`, Next.js App Router). Goal: scale from ~140 pages to thousands, zero duplicate content, priced toward the priority corridor the CEO named — **Dammam↔Kuwait, Dammam↔Qatar, Tabuk, AlUla, NEOM** (high-paying, low-competition).

## Current state (confirmed by codebase audit)
- Data-driven templates already exist: `ROUTES_DATA` (67), `SUB_AREAS` (33), `CITY_DETAILS` (11 cities — **Tabuk missing**, exists only as an airport stub), `AIRPORT_DETAILS` (8), `FLEET_VEHICLES`, `RECOVERY_CITIES`, `GUIDES`, `BLOG_POSTS_DATA`.
- `lib/seo.ts` + `lib/schema.ts` are solid, reusable builders — new page types should plug into these, not reinvent.
- **Bug**: `app/sitemap.ts` hardcodes `LOCATIONS`/`SUB_AREAS`/`AIRPORTS` arrays separately from the real `lib/data/*` source files → any page added to data without a matching sitemap edit silently never gets indexed. **Fix this first** — it's the foundation everything below depends on.
- No cross-border GCC routes exist in `ROUTES_DATA` at all (only a generic `/services/border-crossings` page).
- `/ar/*` real SSR pages: only 6 (home, about, contact, faq, pricing, partners). Everything commercial (routes, locations, airports) is English-only — a real gap for Kuwait/Qatar/Bahrain searchers who query in Arabic.
- Reviews: no real reviews live yet (fake `aggregateRating` was deliberately removed earlier for EEAT risk). CEO just closed a real booking (275 SAR quotation, client very satisfied) — this is the first real review to seed the system with.

## Architecture principle (what keeps this durable to 2050)
One URL per real-world entity, ever. Never fork a page just to catch a keyword variant — add a section + schema block to the existing entity page instead. Duplicate-but-reworded pages are what dies in every Google update; data-driven single-source-of-truth templates don't. Concretely: `/locations/neom` carries both "NEOM city info" AND "Private Chauffeur NEOM" AND "VIP transfer NEOM" intent inside one page (H2 sections + separate FAQ schema entries), rather than three separate thin pages competing with each other.

## URL structure (additions)
- `/locations/[city]` — add `tabuk`. Keep as single source for city + luxury-chauffeur intent (see principle above).
- `/routes/[slug]` — extend `ROUTES_DATA` with a `crossBorder: boolean` + `borderInfo` field (customs/visa notes, border name) for: `dammam-to-kuwait`, `dammam-to-doha`, `riyadh-to-doha`, `tabuk-to-aqaba`, `neom-to-tabuk`, `tabuk-to-red-sea-airport`, `red-sea-airport-to-amaala`, `red-sea-airport-to-neom`. Same template, conditional "Border Crossing Info" section — no new route tree needed.
- `/resorts/[slug]` — **new template**, same pattern as `airports/[slug]`. Entries: St Regis Red Sea Resort, Nujuma Ritz-Carlton Reserve, Six Senses Southern Dunes, Desert Rock Resort, Shebara Resort. Fields: `name, distanceFromAirport, distanceFromNeom, tldr, faqs, priorityRoutes[]`. Linked from `red-sea-international`/`neom` airport and location pages both directions.
- Do **not** create `/airports/neom-airport-transfer` as a separate page from `/airports/neom` — same entity. Instead make sure the existing airport page's `<title>` and H1 already speak the commercial phrase ("NEOM Airport Transfer & Chauffeur Service"), which it should via `lib/seo.ts`.
- Corporate: keep under existing `/services/corporate`, `/services/business-executive` — do not fragment further; instead deepen these two with per-city sections (Riyadh KAFD, Jeddah, Dammam, NEOM) since embassy/gov/bank clients search "corporate car service Riyadh" not a separate URL per city.

## Metadata & canonical
Every new page calls `generateMetadata()` from `lib/seo.ts` (already handles title/description/canonical/OG/hreflang) — no manual `<head>` tags anywhere. Rule: title ≤60 chars, meta description 120–155 chars, never reuse a title string (script-check before deploy, same method as the June duplicate-title sweep). Canonical is self-referencing on every new page by default (`lib/seo.ts` already does this).

## Schema markup
- Route/resort/cross-border pages: `serviceSchema` + `faqSchema` + `breadcrumbSchema` (existing builders in `lib/schema.ts`) — no new schema type needed.
- Resort pages: keep `serviceSchema` framed as "chauffeur service to/from [resort]", not `LodgingBusiness` — we're not the hotel, don't claim to be.
- Reviews: add the real review (once screenshot received) as a single `Review` node on the relevant page (e.g. the route/city page the trip was on) via a new `reviewSchema` helper. **Do not** add `aggregateRating` back until there are at least 3–5 real reviews — one real review with an aggregate rating looks as fabricated as zero.

## Sitemap strategy
Fix `app/sitemap.ts` to import `LOCATIONS`/`AIRPORTS`/`SUB_AREAS` from their real `lib/data/*` files instead of hardcoded duplicates, then every new entity added below is auto-included — no manual sitemap edits per page going forward. Resubmit to GSC after each batch deploy (2 min, per standing instruction).

## Multilingual (English/Arabic)
GCC cross-border traffic (Kuwait, Qatar, Bahrain) searches Arabic more than domestic KSA traffic does. Priority order for real `/ar` SSR pages (extending `AR_REAL_ROUTES` in `lib/config/i18n.ts`, same pattern as the 6 existing): the 8 cross-border route pages first, then NEOM/AlUla/Tabuk location pages, then the 8 airport pages. Bidirectional hreflang via existing `hreflangPaths` param — already built, just needs to be passed on these pages.

## Internal linking
Every new page must be linked from ≥2 places at creation (not added later) — the 49-orphan-page incident from the Ahrefs audit was caused by exactly this. New route/resort pages: link from both endpoint city pages ("Related destinations"), the relevant airport page, and one blog/guide post.

---

## Roadmap

**HIGH — do first (this is the CEO's named priority corridor)**
1. ~~Fix `app/sitemap.ts` data-source bug~~ — correction: `ROUTES_DATA`/`FLEET_VEHICLES`/`BLOG_POSTS_DATA`/`GUIDES`/`RECOVERY_CITIES` were already dynamically imported; only `LOCATIONS`/`SUB_AREAS`/`AIRPORTS` are still hardcoded lists in `sitemap.ts` (kept in sync manually for now — `tabuk` added 2026-08-05). Real fix (extract `CITY_DETAILS` out of the page file into `lib/data/locations.ts` as single source of truth) still pending, not urgent as long as new cities are added to both places together.
2. **DONE (2026-08-05)**: Tabuk added as a full `CITY_DETAILS` entry (`/locations/tabuk`) — was only an airport stub before. Registered in `generateStaticParams`, `CITY_COORDS`, `CITY_AIRPORT`, `CITY_META_DESCRIPTION`, `sitemap.ts` LOCATIONS, Navbar, Footer (EN/AR/UR), and the `/locations` hub card. `tsc --noEmit` clean.
3. Cross-border GCC routes — correction: `dammam-to-kuwait`, `dammam-to-doha`, `riyadh-to-doha`, `dammam-to-manama`, `alkhobar-to-manama`, `riyadh-to-manama`, `riyadh-to-dubai`, `riyadh-to-abudhabi` already existed in `ROUTES_DATA` before this session. **DONE (2026-08-05)**: added the 4 that were genuinely missing — `tabuk-to-aqaba`, `tabuk-to-red-sea-airport`, `red-sea-airport-to-amaala`, `red-sea-airport-to-neom` — all `popular: true`, no page changes needed since `routes/[slug]` + sitemap already read `ROUTES_DATA` dynamically.
4. Seed the real customer review (send the screenshot) into `Review` Prisma table + homepage `customerReviews` array + a `reviewSchema` block on the relevant route/city page. Also log the booking (275 SAR quote, 26 SAR profit) — flag to me if you want a private profit-tracking note vs public review only. **Still pending — waiting on screenshot.**

**MEDIUM — next wave**
5. `/resorts/[slug]` template + 5 Red Sea/AMAALA luxury resort entries, cross-linked with NEOM/Red Sea/AlUla pages.
6. Deepen `/services/corporate` and `/services/business-executive` with per-city sections (Riyadh, Jeddah, Dammam, NEOM).
7. Extend real `/ar` SSR coverage to the new cross-border + NEOM/AlUla/Tabuk pages.
8. ~~Driver-jobs pages for Tabuk and NEOM~~ — **REJECTED, do not build.** `WORK-LEDGER.md` (2026-08-02) records that all driver-jobs/chauffeur-jobs/taxi-driver-jobs pages (54 pages, ~226 clicks/mo) were deliberately deleted — a fully-informed business decision (not recruiting drivers via SEO, don't want applicant WhatsApp spam), not an oversight. The "99% of clicks" note in this repo's memory predates that deletion. Do not re-add this page type.

**LOW — longer horizon**
9. Blog cluster: "NEOM to Tabuk travel", "Red Sea Resorts guide", "Private transfer vs Uber NEOM", "Tabuk travel guide" — each linking into the new money pages above.
10. hourly-charter / wedding-events detail pages (already flagged missing in `WORK-LEDGER.md`, lower priority than the GCC/NEOM corridor).
11. Wave 2 programmatic expansion once the above template is proven: more GCC pairs (Riyadh-Kuwait, Jeddah-Manama), more resorts.
