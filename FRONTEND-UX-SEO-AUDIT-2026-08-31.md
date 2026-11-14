# Taxi Saudi Arabia — Master Frontend / UX / SEO / CRO Audit & Implementation Roadmap
**Date:** 2026-08-31 · **Scope:** Audit + roadmap only. **No code, content, metadata, images, or config were modified.** · **Site:** https://taxisaudiarabia.com

> This document is the master implementation specification. It is written so another senior dev/agent can execute the batches without re-auditing the site. Every finding uses the format **OBSERVATION → PROBLEM → RECOMMENDATION → PRIORITY → IMPLEMENTATION (batch)**.

---

## PART 1 — THE EXISTING SYSTEM (verified from source)

| Layer | Implementation | Evidence |
|---|---|---|
| Framework | Next.js 15.3 (App Router) + React 19 | `package.json` |
| Rendering | Static Site Generation (SSG) via `generateStaticParams`; data lives in `lib/data/*.ts` (no CMS for marketing) | `app/(en)/(marketing)/**` |
| Route architecture | Route groups: `(en)` and `(ar)`, plus `(marketing)`, `(auth)`, `(dashboard)`. **Two separate root layouts** (`app/(en)/layout.tsx`, `app/(ar)/layout.tsx`) — deliberately, to preserve SSG (see memory `root-layout-i18n-split`). | `app/` tree |
| Styling | Tailwind v4 (`@import "tailwindcss"`) + shadcn/ui + `class-variance-authority`; design tokens in `app/globals.css` `:root` | `globals.css` |
| Typography | CSS vars `--font-heading/--font-body/--font-arabic`; utility classes `.text-hero`, `.text-section-title`, `.text-card-title` | `globals.css:614-639` |
| Fonts | Amiri (Arabic PDF), body/heading via next/font vars (Cairo fallback for Arabic) | `globals.css:637` |
| Images | `next/image`; assets in `public/` (26 MB, **171 webp**, 5 png, 4 jpeg, 1 jpg). `next.config.ts` allows remote `images.unsplash.com`. **No `formats`/AVIF, no `deviceSizes` tuning.** | `next.config.ts:86-93` |
| SEO metadata | Centralized `lib/seo.ts` `generateMetadata()` — canonical, hreflang, OG, Twitter, robots all in one helper. **Mature and correct.** | `lib/seo.ts` |
| Sitemap | Fully data-driven `app/sitemap.ts` — derives from the same data files pages render from | `app/sitemap.ts` |
| Robots | `app/robots.ts` — disallows admin/customer/api/`/book?`; explicitly allows AI crawlers | `app/robots.ts` |
| i18n | Middleware 301-redirects most `/ar/*` → English; only curated `/ar` pages have real SSR files (avoids duplicate-content). hreflang wired via `hreflangPaths`. | `middleware.ts`, `lib/config/i18n.ts` |
| Structured data | `components/seo/JsonLd.tsx`, `lib/schema.ts` + `Breadcrumbs`, `RelatedLinks`, `TLDRSummary` | `components/seo/*` |
| Conversion | WhatsApp-first (`contactConfig.whatsappLink`); `WhatsAppQuoteForm`, `WhatsAppButton`, `StickyRecoveryCTA`. **No live automated pricing** (removed site-wide per memory `pricing-neutralization`). | `components/booking/*`, `components/shared/*` |
| Backend (not in scope) | Supabase + Prisma + NextAuth; admin/customer dashboards; Stripe/Moyasar/Twilio/Resend | `app/api/**`, `lib/supabase/*` |

### Classification of the codebase

| Class | Items | Treatment |
|---|---|---|
| **Global / reusable (protect)** | `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `middleware.ts`, `lib/config/i18n.ts`, `components/ui/*` (shadcn), `components/seo/*`, split root layouts | **Do not rewrite.** Extend only. |
| **Template-level** | `routes/[slug]`, `locations/[city]`, `airports/[slug]`, `services/*`, `distance/[slug]`, `fleet/[slug]`, `blog/[slug]`, `guides/[slug]`, `events/[slug]`, recovery `[slug]` | Refactor visuals via shared components; keep data contracts. |
| **Page-specific** | `components/sections/home-page.tsx` (1,749 lines) | Refactor in isolation (Batch 2). |
| **Legacy / fragile** | `globals.css` `!important` override layer (see P1-A); hardcoded hex colours across ~1,400 class usages; hardcoded `customerReviews`/`trustStats` | Address deliberately, not casually. |
| **Already good (do not change)** | SEO infra, sitemap, robots, hreflang/middleware, i18n split, data-driven architecture | See PART 18. |

---

## PART 2 — URL INVENTORY (verified counts)

**Total indexable ≈ 300 English + ~30–40 Arabic.** Derived from data-file lengths and `generateStaticParams`.

| Page type | Route | Count | Source of truth |
|---|---|---|---|
| Homepage | `/` | 1 | `home-page.tsx` |
| Core static | `/about /contact /faq /gallery /pricing` | 5 | static |
| Index/hub pages | `/fleet /routes /services /locations /distance /guides /blog /events` | 8 | static |
| Service landing pages | `/services/*` (airport-transfers, umrah-transport, intercity, corporate, hajj, group, tourism, border-crossings, vip-transportation, wedding-car-rental, corporate-bahrain-transport, makkah/madinah/taif/badr-ziyarat, business-executive, heritage-tours, hotel-transfers, long-distance, car-recovery) | ~20 | `app/(en)/(marketing)/services/` |
| Location — city | `/locations/[city]` | **14** | `CITY_DETAILS` keys |
| Location — subarea | `/locations/[city]/[subarea]` | **34** | `SUB_AREAS` |
| Airport | `/airports/[slug]` | **9** | `AIRPORT_DETAILS` keys |
| Route | `/routes/[slug]` | **83** | `ROUTES_DATA` |
| Distance guide | `/distance/[slug]` | **13** | `DISTANCE_GUIDES` |
| Fleet vehicle | `/fleet/[slug]` | **19** | `FLEET_VEHICLES` |
| Blog | `/blog/[slug]` | **33** (all published) | `BLOG_POSTS_DATA` |
| Guide | `/guides/[slug]` | **16** | `GUIDES` |
| Event | `/events/[slug]` | **21** | `EVENT_SLUGS` |
| Recovery city | `/services/car-recovery/[slug]` | **17** | `RECOVERY_INDEXABLE_CITIES` |
| Recovery route | `/services/car-recovery/[slug]` | **5** | `RECOVERY_ROUTES` |
| Arabic | `/ar`, `/ar/{about,contact,faq,pricing,partners}`, `/ar/routes/*`, `/ar/services/car-recovery/*` | ~30–40 | `AR_PAGES`, `AR_ROUTE_SLUGS`, `RECOVERY_AR_CITIES` |
| **Noindex (correct)** | `/book`, `/track-booking`, `/partners/driver-registration`, `/admin/*`, `/customer/*`, `/login`, `/api/*` | — | robots + `noIndex` metadata |

**Inventory flags to investigate (do NOT delete — verify intent first):**
- **Cannibalization risk (P1, SEO):** `/services/makkah-ziyarat` vs `/locations/makkah` vs route pages to Makkah; `/services/corporate` vs `/services/business-executive` vs `/services/corporate-bahrain-transport`; `/services/umrah-transport` vs `/services/makkah-ziyarat`+`/services/madinah-ziyarat`. These may target distinct intents — confirm before consolidating.
- **Overlap:** `/services/intercity` vs `/services/long-distance` vs `/routes/*` — near-identical intent.
- **Thin/duplicate risk:** 34 subarea pages + 83 route pages are the most likely to be templated/thin — audit a sample (PART 8).
- **`/pricing`** exists but site is WhatsApp-only quotes — confirm it doesn't imply automated pricing.

---

## PART 3 — PAGE-BY-PAGE KEYWORD MAPPING (method + priority set)

A full 300-row map is out of scope for one document; below is the **method + the 15 money pages** (the actionable set). Apply the method to remaining pages in Batch 8.

**Method (per page):** primary keyword (1, commercial+geo) → 2–3 secondary → semantic terms → confirm intent isn't already owned by another page (cannibalization check) → title ≤60 chars leading with primary → single H1 containing primary → 150–160 char meta with a WhatsApp CTA verb → 3–6 contextual internal links.

| # | URL | Type | Primary keyword | Intent | Notes / cannibalization | Priority |
|---|---|---|---|---|---|---|
| 1 | `/routes/jeddah-airport-to-makkah` | Route | jeddah airport to makkah taxi | Transactional | Flagship. Protect current title (memory: routes already optimal). | P1 |
| 2 | `/routes/makkah-to-madinah` | Route | makkah to madinah taxi | Transactional | Core Umrah leg | P1 |
| 3 | `/services/umrah-transport` | Service | umrah taxi / umrah transport | Commercial | Hub for ziyarat pages — must link down, not compete | P1 |
| 4 | `/services/airport-transfers` | Service | airport transfer saudi arabia | Commercial | Hub for airport pages | P1 |
| 5 | `/locations/makkah` | Location | makkah taxi service | Commercial/local | Distinct from ziyarat (service) intent | P1 |
| 6 | `/locations/jeddah` | Location | jeddah taxi service | Commercial/local | | P1 |
| 7 | `/locations/riyadh` | Location | riyadh taxi service | Commercial/local | | P1 |
| 8 | `/services/vip-transportation` | Service | vip / executive chauffeur saudi | Commercial (high value) | Pillar (memory: renamed w/ 301) | P1 |
| 9 | `/services/car-recovery` | Service | car recovery saudi arabia | Commercial | Eastern-Province focus | P1 |
| 10 | `/airports/jeddah` (JED) | Airport | jeddah airport taxi | Transactional | H1 must carry city keyword (memory) | P1 |
| 11 | `/services/hajj-transport` | Service | hajj transport | Seasonal commercial | | P2 |
| 12 | `/services/corporate` | Service | corporate car service saudi | Commercial | De-dupe vs business-executive | P2 |
| 13 | `/services/intercity` | Service | intercity taxi saudi arabia | Commercial | De-dupe vs long-distance | P2 |
| 14 | `/services/wedding-car-rental` | Service | wedding car rental (Riyadh-scoped) | Commercial | | P2 |
| 15 | `/services/corporate-bahrain-transport` | Service | saudi bahrain corporate transport | Commercial cross-border | | P2 |

**Rule for Batch 8:** produce the remaining ~285 rows in a spreadsheet, not in-page. Do **not** force keywords into H1s that already read naturally.

---

## PART 4 — FRONTEND / UI AUDIT (highest priority)

### 🔴 P1-A — The `globals.css` `!important` override layer (ARCHITECTURE)
**OBSERVATION:** `globals.css` is ~660 lines, of which lines 160–405 are a wall of `!important` rules that re-colour a **legacy dark/gold theme** (`#0A0A0A`, `#C9A84C`, `bg-black/50`, `text-white`, etc.) into the current green/white light theme. The code itself documents this: *"the 1400+ existing `text-/border-/fill-[#C9A84C]` classes recolour centrally"* (`globals.css:46-49`).
**PROBLEM:** The entire site's colour system is a runtime monkey-patch. Every component still ships hardcoded dark/gold Tailwind classes; the true colour is decided by `!important` selectors with `:not(.premium-dark-section *)` guards. This is extremely fragile: (a) any new dark class not enumerated renders wrong; (b) specificity wars make local styling unpredictable; (c) it inflates CSS and hurts maintainability; (d) it is the single biggest blocker to a clean redesign. Also `.dark` block is a dead duplicate (site is light-only) and still references old gold `#C8A45D`.
**RECOMMENDATION:** Do **not** rip it out casually — it is load-bearing. Plan a deliberate migration: (1) define semantic tokens (`--surface`, `--surface-dark`, `--brand`, `--accent`) once; (2) migrate components off hardcoded hex to token classes in controlled batches; (3) delete override rules only as their source classes disappear; (4) remove the dead `.dark` block. Track with a grep counter (`grep -r "C9A84C" | wc -l`) as the burn-down metric.
**PRIORITY:** P1 · **IMPLEMENTATION:** Batch 1 (token system) → burn down across Batches 2–7.

### 🟠 P1-B — Colour usage is inconsistent (gold ghosts + green/yellow)
**OBSERVATION:** Section borders still use `border-[#C9A84C]/10` (gold) throughout `home-page.tsx` (lines 995, 1084, 1177…), recoloured to green by CSS. Sidebar/scrollbar/`.gold-accent-line`/`.text-gold-gradient` still literally render gold (`#C8A45D`) — they were **not** caught by the override layer (`globals.css:509, 643, 661`).
**PROBLEM:** Residual gold leaks (scrollbar thumb hover, premium-card accent line, gold gradient text) contradict the locked green+yellow+white identity (memory `brand-color-system`).
**RECOMMENDATION:** Replace the three remaining literal-gold utilities with brand tokens. Show the user the swatches before applying (memory rule).
**PRIORITY:** P2 · **IMPLEMENTATION:** Batch 1.

### Typography
**OBSERVATION:** Scale is defined (`.text-hero` clamp 2.6→4rem/800; `.text-section-title`; `.text-card-title`) but pages also hardcode sizes (`text-[0.82rem]`, `text-[0.74rem]`, `text-[0.55rem]` in Navbar; `text-[0.7rem]` labels). Heading weight 800 + tight `-0.03em` tracking is premium-appropriate.
**PROBLEM:** Two parallel systems (utility classes vs one-off `text-[Xrem]`) → inconsistent hierarchy across page types; sub-0.75rem uppercase labels (`0.55rem`, `0.7rem`) are below comfortable mobile legibility. Arabic typography relies on Cairo fallback — verify weights load.
**RECOMMENDATION:** Codify a 6-step type scale as utilities; forbid arbitrary `text-[Xrem]` in new work; set a `0.75rem` floor for body-adjacent text; verify Arabic font weights.
**PRIORITY:** P2 (UI) · **IMPLEMENTATION:** Batch 1.

### Spacing / Layout
**OBSERVATION:** Homepage sections use a consistent `py-24` rhythm and `.section-container` (max-w 72rem, responsive padding) — good. But Navbar uses `max-w-[1700px]` while content uses `72rem` (1152px).
**PROBLEM:** Container-width mismatch (1700 vs 1152) makes the header feel detached from content on wide screens. Some sections use `.section-container`, others inline `max-w`.
**RECOMMENDATION:** One container scale (e.g. `--container: 1200px`, `--container-wide: 1400px`); apply consistently. Keep the `py-24` rhythm.
**PRIORITY:** P2 (UI) · **IMPLEMENTATION:** Batch 1.

### Buttons / CTAs
**OBSERVATION:** Primary CTA = yellow "Book Now" pill; secondary = white "WhatsApp" pill (Navbar). Homepage hero uses `#booking-console` anchor + WhatsApp. shadcn `Button` exists but pages frequently hand-roll `<a className="rounded-full …">`.
**PROBLEM:** CTA styling is duplicated inline dozens of times rather than using `components/ui/button.tsx` variants → inconsistent padding/size/hover across templates; two competing primary actions ("Book Now" vs "WhatsApp") with unclear hierarchy.
**RECOMMENDATION:** Define `Button` variants (`primary`=green, `accent`=yellow, `whatsapp`, `outline`) once; migrate templates to them; make **WhatsApp the single primary** everywhere (business reality = WhatsApp leads). Keep "Book Now" as secondary/anchor.
**PRIORITY:** P1 (CRO+UI) · **IMPLEMENTATION:** Batch 1 (component) → Batch 2+ (adoption).

### Header / Navigation
**OBSERVATION:** Solid green fixed header, mega-menu (Transportation Services w/ nested flyout), Routes/Locations/Partners dropdowns, language switcher, Book+WhatsApp CTAs. Mobile = full drawer. Logo `h-[4.75rem]` (76px) is large.
**PROBLEM:** (a) Nested hover flyout ("Taxi Services" → sub-menu) is **not keyboard/touch friendly** and unreachable on hover-less devices except via the mobile drawer; (b) 76px logo makes the header tall on mobile, eating above-the-fold; (c) dropdowns are pure CSS `group-hover` with no `aria-expanded`.
**RECOMMENDATION:** Add keyboard/focus support + `aria-expanded`; reduce logo to ~48–56px on mobile; consider flattening the one nested flyout.
**PRIORITY:** P1 (UX/A11y) · **IMPLEMENTATION:** Batch 1.

### Footer
**OBSERVATION:** 380-line footer (migrated off gold/dark-green per memory `brand-color-system`).
**PROBLEM/REC:** Audit link freshness against current URL inventory (PART 2) during Batch 1; ensure it surfaces the money pages + top locations/routes for internal-link equity. Low risk.
**PRIORITY:** P2 · **IMPLEMENTATION:** Batch 1.

---

## PART 5 — IMAGE AUDIT

**OBSERVATION:** 171 webp assets in `public/` (26 MB total) organised by type (`fleet/real/*` = genuine photos; `fleet/*.webp` root = renders/stock e.g. `toyota-camry.webp`, `gmc-yukon-xl.webp`). `next.config.ts` still whitelists `images.unsplash.com` (remote). No AVIF/`formats`, no `deviceSizes` tuning.

| Category | Finding | Action |
|---|---|---|
| KEEP | `public/fleet/real/*` (Mercedes S-Class, Sprinter VIP, Staria real shots) | Real, on-brand — keep |
| OPTIMIZE | All `next/image` usages — enable AVIF + tuned `deviceSizes`; audit hero for `priority`/LCP; verify explicit `width/height` to prevent CLS | Batch 9 (perf) |
| REPLACE | Any remaining Unsplash remote pulls (external dependency + LCP risk); mixed real/render fleet consistency | Batch 5/6 |
| ADD | Consistent per-service hero photography system (sedan/SUV/van/VIP/airport/intercity/corporate/pilgrimage/destination) **only where a real asset improves trust** — no stock filler | Batch 2–6, per page |

**PROBLEM:** (1) Mixed real-photo + render fleet reads inconsistently; (2) remote Unsplash allowance risks slow LCP + external failure; (3) no AVIF = larger payloads.
**RECOMMENDATION:** Remove Unsplash remotePattern once no page references it; enable `formats: ['image/avif','image/webp']`; standardise fleet imagery to one look; define a photography spec (16:9 hero, 4:3 card, real vehicles only).
**PRIORITY:** P1 (image consistency, perf) · **IMPLEMENTATION:** Batch 5/6 + Batch 9.

---

## PART 6 — HOMEPAGE CONVERSION AUDIT

**OBSERVATION:** `home-page.tsx` (1,749 lines, trilingual EN/AR/UR inline). Section order: hero → trust strip → booking console (`#booking-console`) → services → about/why-us → popular routes → fleet showcase → country marquee → parallax → **testimonials** → blog → FAQ → final CTA. Hero copy: *"Reserve Your Private Taxi & Chauffeur in Saudi Arabia."*

**5-second test:**
| Q | Verdict |
|---|---|
| What does it do? | ✅ Clear (hero headline + badge) |
| Where? | ✅ "across Saudi Arabia" + cities |
| What type? | ✅ Private taxi/chauffeur/airport/Umrah |
| Why trust it? | ⚠️ Relies on fabricated reviews + unverifiable claims (see below) |
| How to book? | ✅ WhatsApp + booking console visible |

### 🔴 P0-1 — Fabricated testimonials (TRUST / policy risk)
**OBSERVATION:** `home-page.tsx:635-83` hardcodes 7 invented 5-star reviews with fake personas ("Dr. Farhan Malik 🇬🇧", "Evelyn Sterling 🇺🇸", "Verified Customer"…), rendered as a "Customer Reviews" section. (Memory noted fake testimonials were removed from service/airport pages — **the homepage set was missed.**)
**PROBLEM:** Fabricated reviews violate the project's own no-fake-claims rule, are a Google/consumer-trust liability, and undermine credibility with the very audience (pilgrims/corporate) that checks. The `Star`/5-star rendering compounds it.
**RECOMMENDATION:** Remove or replace with genuine, attributable proof only. If no real reviews exist yet, replace the section with honest trust signals (WhatsApp response commitment, coverage map, fleet, driver-language promise, partner invoicing) — never invent. Also remove any AggregateRating schema tied to these.
**PRIORITY:** P0 (CRO/Trust) · **IMPLEMENTATION:** Batch 2 (do early; also grep whole repo for other hardcoded review arrays).

### 🟠 P1-2 — Unverifiable claims in copy
**OBSERVATION:** Hero/why-us assert "60 minutes free wait", "Free Cancellation — 24 Hours, full refund, no questions asked", "Trusted by hotels, embassies, and enterprises", "ZATCA-Compliant E-Invoice".
**PROBLEM:** Several are unverifiable trust claims (embassies/enterprises); "free cancellation/refund" is a policy promise that must be real and honoured. ZATCA invoicing is real only via the partner (memory `partner-invoicing-eagle-eyes`).
**RECOMMENDATION:** Keep only claims that are true and operationally guaranteed. Remove "embassies/enterprises". Verify the cancellation/wait policies are actually offered before displaying.
**PRIORITY:** P1 · **IMPLEMENTATION:** Batch 2.

### 🟠 P1-3 — "Calculate My Price" widget contradicts WhatsApp-only model
**OBSERVATION:** Booking console button label = "Calculate My Price" / "احسب الأجرة التقديرية" (calculate estimated fare); `onClick` routes to booking console/WhatsApp — it does **not** compute a price (automated pricing was removed site-wide, memory `pricing-neutralization`).
**PROBLEM:** Label promises a calculation that doesn't happen → expectation mismatch; also risks re-implying automated pricing the business deliberately dropped.
**RECOMMENDATION:** Relabel to "Get My Price on WhatsApp" / "Send Enquiry"; keep the form as a structured WhatsApp message builder.
**PRIORITY:** P1 (CRO/honesty) · **IMPLEMENTATION:** Batch 2.

### 🟡 P2-4 — Stat drift / inconsistency
**OBSERVATION:** `stats.ts`: `citiesCovered "11+"` but 14 city pages + 12 in nav; `vehicleClasses "14"` but 19 fleet vehicles; Arabic hero hardcodes "+٥٦ routes" while `ROUTES_DATA.length` = 83; EN stat "11+" cities.
**PROBLEM:** Understated/mismatched numbers across languages look careless and leave impressions on the table.
**RECOMMENDATION:** Drive **all** stats from data (`ROUTES_DATA.length`, `Object.keys(CITY_DETAILS).length`, `FLEET_VEHICLES.length`); remove hardcoded Arabic "56". Only state counts that are true.
**PRIORITY:** P2 · **IMPLEMENTATION:** Batch 2.

### 🟡 P2-5 — Homepage monolith
**OBSERVATION:** 1,749-line client component holding EN/AR/UR translation objects + all sections.
**PROBLEM:** Hard to maintain/redesign; ships large client JS; translations inline.
**RECOMMENDATION:** Split into section components (`HeroSection`, `ServicesGrid`, `FleetShowcase`, `Faq`…); move copy to data. Behaviour-preserving refactor.
**PRIORITY:** P2 (Architecture) · **IMPLEMENTATION:** Batch 2.

---

## PART 7 — LOCATION PAGE AUDIT (`/locations/[city]`, 14 cities + 34 subareas)

**OBSERVATION:** `CITY_DETAILS` is a rich per-city record (image, tagline, description, attractions, tips, tldr, tldrFacts, faqs, testimonials, relatedLinks). Template is 522 lines.
**PROBLEM:** (a) `CITY_DETAILS` contains a `testimonials` field — **verify these aren't fabricated** (same risk as homepage); (b) subarea pages (34) are the highest thin-content risk — likely `[city] + [subarea]` string swaps; (c) confirm each city page differentiates from the matching **service** page (Makkah location vs makkah-ziyarat) to avoid cannibalization.
**RECOMMENDATION:** Standardise a location template with genuinely local modules (real attractions, real routes from that city, airport link, fleet, honest FAQ); audit subareas for uniqueness — merge or `noindex` truly thin ones rather than padding. Remove any fabricated per-city testimonials.
**PRIORITY:** P1 (location testimonials = P0 if fabricated) · **IMPLEMENTATION:** Batch 3 (cities), Batch 7 (subareas).

---

## PART 8 — ROUTE PAGE AUDIT (`/routes/[slug]`, 83 pages)

**OBSERVATION:** Template is **2,313 lines** — by far the largest file; `ROUTES_DATA` = 1,106 lines (83 routes). Memory says routes are already SEO-optimal and "protected."
**PROBLEM:** A 2,300-line template implies heavy per-route conditional rendering; risk that many of 83 routes share near-identical structure (distance/time/vehicle/FAQ) with only origin/destination swapped → templated-content perception. This is the biggest single template to redesign safely.
**RECOMMENDATION:** **Protect content/metadata** (per memory) — treat this as visual-only refactor. Extract the template into composable sections (RouteHero, DistanceTimeTable, VehicleOptions, RouteFaq, CrossBorderNotice, RelatedRoutes) **without** changing text or slugs. Verify each route has ≥1 genuinely unique element (border info, airport link, landmark). Do this **after** the template is componentised to minimise regression across 83 pages.
**PRIORITY:** P1 (UI) / P0-risk (regression across 83 URLs) · **IMPLEMENTATION:** Batch 4 (template first, then migrate in controlled groups of ~10).

---

## PART 9 — SERVICE PAGE AUDIT (~20 pages)

**OBSERVATION:** Each service is its own static page; hub = `/services`. Copy is keyword-rich and WhatsApp-CTA'd.
**PROBLEM:** (a) Overlap clusters (corporate/business-executive/corporate-bahrain; intercity/long-distance; umrah/makkah-ziyarat/madinah-ziyarat) risk cannibalization and reader confusion; (b) inconsistent section templates between service pages (built at different times); (c) confirm the "what happens after enquiry / what info to provide" step exists on each — critical for lead quality.
**RECOMMENDATION:** One service template answering the 9 CRO questions (what/who/where/vehicles/why/booking/info-needed/after-enquiry/contact); define a canonical page per intent and make siblings link up to it rather than compete.
**PRIORITY:** P1 · **IMPLEMENTATION:** Batch 5.

---

## PART 10 — MOBILE UX AUDIT

**OBSERVATION:** Mobile-first Tailwind; parallax disabled <820px & for reduced-motion (`globals.css:463`); mobile drawer nav.
**PROBLEM:** (a) 76px logo + `py-3.5` header = tall mobile header eating above-the-fold; (b) nested mega-menu only reachable via drawer on mobile (acceptable) but desktop-hover items are lost on touch tablets in the 820–1280px band where nav is `hidden xl:flex` → **only hamburger shows down to 1280px**, so tablet users get mobile nav (check intent); (c) no persistent **sticky mobile WhatsApp bar** on marketing pages (only recovery has `StickyRecoveryCTA`); (d) verify 44px min touch targets on dropdown rows (`py-2.5` ≈ 40px — borderline).
**RECOMMENDATION:** Add a global sticky mobile CTA bar (WhatsApp + Call) on all marketing templates; shrink mobile logo; bump touch targets to ≥44px; confirm no horizontal overflow on route/distance tables (wrap in `overflow-x-auto`).
**PRIORITY:** P1 (CRO — sticky WhatsApp is a direct lead lever) · **IMPLEMENTATION:** Batch 1 (sticky CTA + header) then verified Batch 9.

---

## PART 11 — PERFORMANCE / CORE WEB VITALS

| Finding | Detail | Priority | Batch |
|---|---|---|---|
| Large client components | `home-page.tsx` (1,749) + `routes/[slug]` (2,313) are heavy; homepage is `"use client"` with framer-motion | P1 | 2/4 |
| No AVIF / image formats | `next.config` lacks `formats` + `deviceSizes` | P1 | 9 |
| Remote Unsplash allowed | External LCP dependency | P2 | 5 |
| framer-motion everywhere | Navbar + homepage animations add JS; ensure not blocking LCP | P2 | 2 |
| Parallax `background-attachment:fixed` | Already correctly disabled on mobile/reduced-motion | ✅ keep | — |
| LCP image | Verify hero uses `priority` + correct sizes; logo already `priority` | P1 | 9 |
| CLS | Verify all `next/image` have explicit dimensions; reserve space for dropdowns/marquee | P1 | 9 |
| INP | Reduce client JS by componentising + server components where possible | P2 | 2/4 |

**RECOMMENDATION:** Measure real CWV (PSI/CrUX) at Batch 0 baseline; convert static marketing sections to server components where feasible; enable AVIF. Don't sacrifice the premium feel for micro-gains.
**PRIORITY:** P1 · **IMPLEMENTATION:** Batch 9 (with Batch 0 baseline).

---

## PART 12 — TECHNICAL SEO AUDIT

**OBSERVATION:** This is the site's **strongest** area. `lib/seo.ts` centralises title/desc/canonical/hreflang/OG/Twitter/robots correctly. `sitemap.ts` is fully data-driven. `robots.ts` disallows the right paths and welcomes AI crawlers. Middleware 301s duplicate `/ar/*` to English (prevents duplicate content). Breadcrumbs + JsonLd components exist.
**PROBLEM (minor):** (a) Confirm **one H1 per page** across templates (route/location); (b) verify canonical on the shared `routes/[slug]` used by both `/routes/*` and `/ar/routes/*` points correctly per locale; (c) ensure `hreflangPaths` is set only where a real translated pair exists (it is, by design) — audit for any orphan hreflang; (d) `/pricing` page indexable while pricing is WhatsApp-only — confirm content matches intent.
**RECOMMENDATION:** Preserve all SEO infra. Add only a per-template H1 lint check to the regression checklist. No rewrite.
**PRIORITY:** P2 (verification, not change) · **IMPLEMENTATION:** Batch 8 verification.

---

## PART 13 — STRUCTURED DATA / SCHEMA

**OBSERVATION:** `components/seo/JsonLd.tsx` + `lib/schema.ts` present; Breadcrumbs component present.
**PROBLEM:** (a) **Check for `Review`/`AggregateRating` schema** anywhere tied to the fabricated homepage/city testimonials — if present it must be removed (fake rating markup is a P0 policy risk); (b) verify `LocalBusiness`/`Organization` schema uses only real NAP/identifiers; (c) ensure route/service pages emit appropriate `Service`/`FAQPage` schema matching visible content.
**RECOMMENDATION:** Keep valid Organization/Service/FAQ/Breadcrumb schema; **remove any rating/review schema** not backed by genuine reviews; never add rating schema to hit a checklist.
**PRIORITY:** P0 (if fake rating schema exists) / else P2 · **IMPLEMENTATION:** Batch 2 (audit with testimonial removal) + Batch 8.

---

## PART 14 — INTERNAL LINKING

**OBSERVATION:** Dedicated components exist: `RelatedLinks`, `RouteRelatedLinks`, `ServiceRelatedLinks`; footer + nav carry money pages; recovery links to blog-guides (memory).
**PROBLEM:** With ~300 pages, the risk is orphaned subareas (34), distance guides (13), and mid-tail routes receiving too few contextual links; and service-cluster pages not linking up to their canonical hub.
**RECOMMENDATION (rules, not thousands of links):**
1. Every **city** links to: its airport, its top 3 routes, relevant services, 2 neighbouring cities.
2. Every **route** links to: origin+destination city pages, the relevant service hub, 3 sibling routes.
3. Every **airport** links to: its city, top 3 routes from it, airport-transfers service.
4. Every **service sibling** links **up** to its canonical hub (Umrah, Corporate, Airport).
5. Every **subarea** links to its parent city + 1 service.
**PRIORITY:** P1 (SEO) · **IMPLEMENTATION:** Batch 8 (after templates stabilise).

---

## PART 15 — TRUST / CRO AUDIT

**OBSERVATION:** WhatsApp-first, real fleet photos, driver-language promise, partner ZATCA invoicing.
**PROBLEM:** Current "trust" leans on fabricated reviews (P0-1) and unverifiable claims (P1-2) instead of the genuine assets available.
**RECOMMENDATION — replace fake trust with real trust:** WhatsApp response-time commitment; transparent "no surge, fixed quote" (true); coverage map (14 cities/83 routes — real numbers); real fleet gallery; driver languages; meet-&-greet process; partner VAT invoicing (where applicable); clear "what info to send" step. **Do not invent** awards/ratings/customer counts/years.
**PRIORITY:** P0/P1 · **IMPLEMENTATION:** Batch 2 (homepage) → all templates.

---

## PART 16 — ACCESSIBILITY

| Finding | Priority | Batch |
|---|---|---|
| Mega-menu dropdowns lack `aria-expanded`, keyboard operation (pure CSS hover) | P1 | 1 |
| Sub-0.75rem text (`0.55rem`, `0.7rem`) — contrast/legibility | P2 | 1 |
| Touch targets ~40px (`py-2.5`) — below 44px | P2 | 1 |
| Verify colour contrast: yellow `#FACC15` text/buttons on white fails WCAG AA — must sit on green/dark only (already the design intent) | P1 | 1 |
| Alt text: audit all `next/image` for meaningful `alt` (logo good) | P2 | 9 |
| Single H1, semantic heading order per template | P1 | 4/8 |
| `prefers-reduced-motion` already handled for parallax | ✅ | — |

**PRIORITY:** P1 · **IMPLEMENTATION:** Batch 1 + Batch 9 QA.

---

## PART 17 — DESIGN SYSTEM ANALYSIS

**OBSERVATION:** Tokens exist (`globals.css :root`) but are **undermined** by (a) the `!important` override layer, (b) ~1,400 hardcoded hex classes, (c) inline `text-[Xrem]`/`px-[X]` one-offs, (d) residual gold.
**VERDICT:** There is a *nominal* design system but not a *coherent* one in practice — pages were clearly built at different times against a shifting theme (dark/gold → green/white).
**RECOMMENDATION:** Establish real semantic tokens in Batch 1 and adopt them going forward:
- **Colour:** `--brand` #16A34A, `--brand-hover` #15803D, `--accent` #FACC15 (on dark/green only), `--ink` #1C1C1C, `--surface` #FAFAF7, `--card` #FFFFFF, `--muted` #6B7280. **Do not change the brand palette** (memory-locked); only formalise it.
- **Radius:** keep `--radius:0.75rem` scale.
- **Shadows:** define 3 elevation tokens (replace ad-hoc `shadow-2xl`).
- **Buttons/cards/badges/inputs:** one component each (extend shadcn).
- **Type + spacing + container:** as PART 4.
**PRIORITY:** P1 · **IMPLEMENTATION:** Batch 1.

---

## PART 18 — KEEP / DO NOT TOUCH (mandatory)

| Item | Why preserve |
|---|---|
| `lib/seo.ts` `generateMetadata()` | Correct, centralised canonical/hreflang/OG/robots. Rewriting risks sitewide SEO regression. |
| `app/sitemap.ts` | Data-driven; auto-includes new entities. |
| `app/robots.ts` | Correct disallows + AI-crawler policy. |
| `middleware.ts` + `lib/config/i18n.ts` | `/ar` 301 dedup logic prevents duplicate content; fragile to touch. |
| **Split root layouts** `(en)`/`(ar)` | Memory `root-layout-i18n-split`: **NEVER** reintroduce single `app/layout.tsx` or `headers()` in root — kills SSG. |
| Route pages content/metadata/slugs (83) | Memory: routes already SEO-optimal & "protected." Visual refactor only. |
| Brand palette (green/yellow/white) | Memory-locked; formalise, don't replace. |
| SAR/pricing neutralization | Pricing is WhatsApp-only by decision; don't reintroduce automated prices. |
| `noindex` on `/book`, `/track-booking`, `/partners/driver-registration`, far recovery cities | Intentional. |
| Data-file architecture (`lib/data/*`) | Single source of truth for pages + sitemap. |
| `prisma db push` | **NEVER** run on this DB (drops Supabase-native tables) — raw SQL only (memory). |
| Supabase RPCs / forms wiring (0009) | Out of scope; working. |

---

## PART 19 — PRIORITIZED ISSUE REGISTER

| ID | Issue | Cat | Priority | Batch |
|---|---|---|---|---|
| P0-1 | Fabricated homepage testimonials (+ audit city testimonials + review schema) | CRO/Trust/SEO | **P0** | 2 |
| P0-2 | Any `AggregateRating`/`Review` schema on fake reviews | Tech SEO | **P0** | 2/13 |
| P1-A | `globals.css` `!important` override layer (theme debt) | Architecture | **P1** | 1→7 |
| P1-2 | Unverifiable trust claims (embassies/enterprises, free-cancel policy) | Content/Trust | **P1** | 2 |
| P1-3 | "Calculate My Price" label vs WhatsApp-only reality | CRO | **P1** | 2 |
| P1-CTA | CTAs hand-rolled, no single Button system; WhatsApp not consistently primary | CRO/UI | **P1** | 1 |
| P1-NAV | Mega-menu keyboard/touch a11y | UX/A11y | **P1** | 1 |
| P1-STICKY | No global sticky mobile WhatsApp CTA | CRO | **P1** | 1 |
| P1-IMG | AVIF off, mixed fleet imagery, Unsplash remote | Images/Perf | **P1** | 5/9 |
| P1-LINK | Internal-linking rules for orphans/clusters | SEO | **P1** | 8 |
| P1-ROUTE | 2,313-line route template regression risk | UI/Arch | **P1** | 4 |
| P2-4 | Stat drift across languages/data | Content | **P2** | 2 |
| P2-5 | Homepage monolith (1,749 lines) | Arch | **P2** | 2 |
| P2-TYPE | Type/spacing/container inconsistency | UI | **P2** | 1 |
| P2-CANN | Service/location cannibalization clusters | SEO | **P2** | 8 |
| P2-SUB | 34 subarea thin-content audit | Content/SEO | **P2** | 7 |
| P2-GOLD | Residual literal gold (scrollbar/accent-line/gradient) | UI | **P2** | 1 |
| P3 | Dead `.dark` block, sub-0.75rem labels, container max-width mismatch | Polish | **P3** | 1 |

---

## PART 20 — IMPLEMENTATION ROADMAP (recommended order)

Order rationale: establish safety + tokens first (Batch 0–1), fix the P0 trust issue on the highest-traffic page (Batch 2), then migrate templates by traffic/value (routes before airports because 83 vs 9 and higher intent), finish with cross-cutting SEO/perf/QA. **Batch 2 is pulled early specifically to kill the fabricated-review P0.**

`0 Safety → 1 Design System → 2 Homepage (P0) → 3 Priority Locations → 4 Route Template → 5 Services → 6 Airports → 7 Subareas/Remaining → 8 SEO/Linking/Schema → 9 Perf/A11y/QA`

---

## PART 21 — BATCH SPECIFICATIONS

### Batch 0 — Safety / Baseline (no visual change)
- **Objective:** Lock a regression baseline before any change.
- **Affected:** none (tooling/docs).
- **Do:** confirm clean git tree + tag baseline; record `next build` status; snapshot current titles/meta/canonical for the 15 money pages; capture PSI/CWV for homepage + 1 route + 1 location + 1 service; screenshot (desktop+mobile) the same set; export current `sitemap.xml`; list reusable components.
- **NOT:** any visual/content/meta change.
- **Acceptance:** baseline artifacts stored; build green.
- **Complexity:** Small. **Risk:** none.

### Batch 1 — Global Design System
- **Objective:** Real semantic tokens + shared primitives; a11y nav; sticky mobile CTA. Begin `!important` burn-down.
- **Affected:** `globals.css`, `components/ui/{button,card,badge,input}.tsx`, `Navbar.tsx`, `Footer.tsx`, new `StickyMobileCTA`.
- **Exact changes:** define semantic tokens; Button variants (primary/accent/whatsapp/outline); type/spacing/container scale; fix residual gold; add `aria-expanded`+keyboard to menus; shrink mobile logo + ≥44px targets; add global sticky WhatsApp/Call bar on marketing templates.
- **NOT:** change brand palette; change page copy/metadata; touch route content; remove override rules whose source classes still exist.
- **Dependencies:** Batch 0.
- **SEO risk:** low (no content/URL change). **UX risk:** header/nav regressions. **Regression risk:** global — test every template renders.
- **Acceptance:** all templates visually unchanged except intended token/CTA/nav updates; keyboard nav works; sticky CTA on mobile; build+typecheck green.
- **Complexity:** Large.

### Batch 2 — Homepage (includes P0 fix)
- **Objective:** Remove fabricated trust; honest CRO; adopt design system; componentise.
- **Affected:** `components/sections/home-page.tsx` (+ new section components), `lib/config/stats.ts`, schema (`JsonLd`).
- **Exact changes:** delete/replace fake `customerReviews` + any review schema; remove unverifiable claims; relabel pricing widget to WhatsApp enquiry; drive stats from data; split into section components; make WhatsApp primary CTA.
- **NOT:** change indexable metadata/title; add new claims; reintroduce pricing.
- **SEO risk:** low-moderate (homepage content change) — keep H1/title. **Regression:** high visibility — screenshot diff.
- **Acceptance:** zero fabricated content; 5-second test passes on genuine trust; build green; CWV not worse than Batch 0.
- **Complexity:** Large.

### Batch 3 — Priority Location Pages (Makkah, Madinah, Jeddah, Riyadh, Dammam)
- **Objective:** Premium, genuinely-local location template.
- **Affected:** `locations/[city]/page.tsx`, `CITY_DETAILS`.
- **Exact changes:** adopt design system; remove any fabricated per-city testimonials; ensure local modules (attractions/routes/airport/fleet/honest FAQ); internal links per PART 14 rule 1.
- **NOT:** change slugs/titles; touch other cities until validated.
- **Complexity:** Medium.

### Batch 4 — Route Template (then migrate 83 in groups of ~10)
- **Objective:** Componentise the 2,313-line template visually; preserve all content/metadata/slugs.
- **Affected:** `routes/[slug]/page.tsx` → RouteHero/DistanceTimeTable/VehicleOptions/RouteFaq/CrossBorderNotice/RelatedRoutes.
- **NOT:** change route copy, titles, slugs (memory-protected); change data.
- **SEO risk:** high if content shifts — **visual-only**, verify sampled pages byte-identical in text. **Regression:** 83 URLs — migrate in controlled batches with per-group screenshot diff.
- **Complexity:** Large.

### Batch 5 — Service Pages
- **Objective:** One service template answering the 9 CRO questions; resolve cannibalization by hub-linking.
- **Affected:** `services/*`, `ServiceRelatedLinks`.
- **NOT:** merge/redirect URLs without a documented decision.
- **Complexity:** Medium.

### Batch 6 — Airport Pages (9)
- **Objective:** Airport template with city-keyword H1 (memory), meet-&-greet, top routes, service link.
- **Affected:** `airports/[slug]/page.tsx`.
- **Complexity:** Small–Medium.

### Batch 7 — Remaining (subareas 34, distance 13, events 21, guides 16, fleet 19, blog 33)
- **Objective:** Apply design system; audit subareas for thin content (merge/`noindex` genuinely thin ones).
- **Complexity:** Medium.

### Batch 8 — SEO / Internal Linking / Schema
- **Objective:** Apply linking rules (PART 14); complete keyword map (PART 3); verify schema; resolve cannibalization decisions.
- **NOT:** rewrite `lib/seo.ts`/sitemap/robots.
- **Complexity:** Medium.

### Batch 9 — Performance / Accessibility / Final QA
- **Objective:** AVIF + image config; drop Unsplash; CLS/LCP fixes; a11y pass; full regression vs Batch 0.
- **Validation:** mobile+desktop screenshots; CWV vs baseline; SEO metadata unchanged on money pages; internal links resolve; images load; schema validates; `next build` + typecheck + lint green.
- **Complexity:** Medium.

---

## PART 22 — CODE-CHANGE SAFETY RULES (for implementation)
Prefer extending existing reusable components; no app rebuild; no URL changes without documented reason; don't remove indexed pages casually; preserve SEO infra; no filler/fake claims; no unnecessary deps; don't touch brand identity; one batch = one concern, independently testable; after each batch run `next build` + typecheck + lint, test mobile+desktop, diff screenshots, verify metadata + internal links + image loading; **never** run `prisma db push`; if it already works, preserve it.

---

## PART 23 — EXECUTIVE SUMMARY

**1. Current strengths:** Best-in-class **technical SEO** (centralised metadata, data-driven sitemap, correct robots, clean `/ar` 301 dedup, SSG-safe split layouts); large genuine content footprint (~300 pages); WhatsApp-first funnel; real fleet photography; memory-locked brand palette.

**2. Biggest problems:** (1) **Fabricated homepage testimonials** (P0 trust); (2) `globals.css` `!important` theme-debt layer; (3) unverifiable claims + misleading "Calculate My Price"; (4) no shared Button/CTA system, WhatsApp not consistently primary; (5) 2,313-line route template + 1,749-line homepage monoliths; (6) mega-menu a11y; (7) no sticky mobile WhatsApp CTA; (8) AVIF off + mixed fleet imagery; (9) stat drift; (10) 34 thin subareas; (11) service/location cannibalization clusters; (12) residual gold; (13) container/type inconsistency; (14) tablet-band nav gap; (15) unverified per-city testimonials.

**3. Biggest lead opportunities:** Global sticky mobile WhatsApp bar; WhatsApp as the single primary CTA; honest trust signals replacing fake reviews; clear "what info to send" step on every service/route page.

**4. Biggest SEO opportunities:** Internal-linking rules for orphans/clusters; resolve cannibalization; complete per-page keyword map; keep the strong infra intact.

**5. Biggest UI opportunities:** Real token system + kill `!important` layer; unified Button/card/type/spacing; componentise homepage + route template.

**6. Biggest image opportunities:** AVIF + tuned sizes; consistent real-vehicle fleet photography; per-service hero system; drop remote Unsplash.

**7. Technical risks:** Route template refactor spans 83 URLs (regression-heavy); `!important` removal can break colours if source classes remain; **never** reintroduce single root layout/`headers()` (kills SSG); **never** `prisma db push`; don't reintroduce automated pricing.

**8. Do-not-touch:** SEO infra (`lib/seo.ts`, sitemap, robots, middleware/i18n), split root layouts, route content/slugs, brand palette, WhatsApp-only pricing, intentional noindex, data-file architecture, Supabase.

**9. Recommended batch order:** 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 (Batch 2 pulled early for the P0 fix).

**10. Expected impact (qualitative — no numbers promised):**
| Batch | UX | Conversion | SEO | Perf | Risk |
|---|---|---|---|---|---|
| 0 | – | – | – | – | none |
| 1 | High | High (CTA/sticky) | Neutral | Slight+ | Medium (global) |
| 2 | High | High (+trust integrity) | Neutral/+ | + | Medium |
| 3 | Med | Med | + | Neutral | Low |
| 4 | High | Med | Protected | + | High (83 URLs) |
| 5 | Med | Med/High | + (de-cannibalize) | Neutral | Low-Med |
| 6 | Med | Med | + | Neutral | Low |
| 7 | Med | Low-Med | +/cleanup | + | Low-Med |
| 8 | Low | Med | High | Neutral | Low-Med |
| 9 | Med | Low | Neutral | High | Low |

---

### Open questions for the user before implementation
1. **Fabricated reviews (P0):** remove entirely, or do real reviews exist to swap in? (Also applies to per-city `CITY_DETAILS.testimonials`.)
2. Are **"free 24h cancellation / 60-min free wait / meet-&-greet"** real, guaranteed policies we can display?
3. For cannibalization clusters (corporate×3, intercity/long-distance, umrah/ziyarat) — consolidate, or confirm they target distinct intents and keep all?
