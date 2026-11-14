# 02 — SEO Findings

Severity: **Critical** (actively harmful / risk of penalty) · **High** · **Medium** · **Low**
Every item cites file:line and the exact fix.

---

## A. Fabricated reviews & ratings (manual‑action / deceptive‑practice risk)

> Per the brief, these are listed **separately** as the highest‑priority trust risk.

| # | Sev | Finding | Location | Exact fix |
|---|-----|---------|----------|-----------|
| A1 | 🔴 Critical | 6 hard‑coded 5★ reviews with invented names (e.g. "Dr. Farhan Malik", "Evelyn Sterling") displayed under a **"Google Review — Verified Trip"** badge, with **no link** to any real review. | reviews [home-page.tsx:611‑618](../../components/sections/home-page.tsx#L611); badge text [:165](../../components/sections/home-page.tsx#L165) | Remove the "Google Review — Verified Trip" label. Either delete the reviews or relabel as "Illustrative testimonial." Re‑introduce only real, linkable Google reviews. |
| A2 | 🔴 Critical | Every location page renders a hard‑coded **"4.9/5"** aggregate rating next to fake named testimonials ("Yusuf A., Manchester" …). | rating [locations/[city]/page.tsx:737](../../app/(marketing)/locations/[city]/page.tsx#L737); testimonials [:94‑98](../../app/(marketing)/locations/[city]/page.tsx#L94) | Remove the "4.9/5" and the fabricated quotes until backed by real reviews. |
| A3 | 🟢 Good — preserve | JSON‑LD `AggregateRating`/`Review` was **deliberately removed** from schema with an explanatory comment. This correctly avoids a structured‑data manual action. | [schema.ts:101](../../lib/schema.ts#L101), [layout.tsx:96](../../app/layout.tsx#L96), [fleet/[slug]/page.tsx:130](../../app/fleet/[slug]/page.tsx#L130) | Keep it removed until real reviews exist. Do **not** re‑add fake markup. |

**Why this matters:** A1/A2 are *on‑page* fabrications (not in schema, so not a structured‑data penalty), but presenting invented "verified Google reviews" is a deceptive‑practices risk and, for a YMYL/trust niche, actively undermines the E‑E‑A‑T signal Google is weighing on a young domain.

---

## B. Per‑page metadata (title / description / canonical / hreflang / OG / robots)

| # | Sev | Finding | Location | Exact fix |
|---|-----|---------|----------|-----------|
| B1 | 🟢 Good | `generateMetadata` helper emits canonical, hreflang (when paths given), robots, OG, Twitter correctly. | [lib/seo.ts:35‑75](../../lib/seo.ts#L35) | Preserve. Route more pages through it. |
| B2 | 🔴 Critical | **`<html lang="en">` is hard‑coded** in the root layout, so all `/ar/*` pages declare English and get no document‑level `dir="rtl"`. Google reads Arabic pages as English → hreflang mismatch, poor Arabic ranking. | [layout.tsx:222](../../app/layout.tsx#L222) | Set `lang`/`dir` from the active locale (per‑segment layout or a locale‑aware root). `/ar` → `lang="ar" dir="rtl"`. |
| B3 | 🟠 High | **hreflang coverage is tiny** — only `/` and 6 `/ar` pages declare alternates ([sitemap.ts:16](../../app/sitemap.ts#L16)); the other ~120 pages have no `ar`/`x-default`. | [page.tsx:6‑12](../../app/page.tsx#L6), [seo.ts:41](../../lib/seo.ts#L41) | Acceptable *only because* most `/ar/*` 301 to English ([middleware.ts:12](../../middleware.ts#L12)). Document this intent; when you add Arabic pages, pass `hreflangPaths`. |
| B4 | 🟡 Medium | Root‑layout `metadata` (home) has no `alternates.canonical`; the canonical for `/` lives in `page.tsx`. Works, but split across two files. | [layout.tsx:31](../../app/layout.tsx#L31) vs [page.tsx:6](../../app/page.tsx#L6) | Fine as‑is; just be aware home canonical is in `page.tsx`. |
| B5 | 🟡 Medium | OG image for location pages points to `/{city}-og.webp` files — verify each of the 11 exists or it falls back to a 404. | [locations/[city]/page.tsx:505](../../app/(marketing)/locations/[city]/page.tsx#L505) | Confirm all 11 `-og.webp` assets exist in `public/locations/`; else use the dynamic `opengraph-image`. |

---

## C. Structured data (JSON‑LD)

| # | Sev | Finding | Location | Exact fix |
|---|-----|---------|----------|-----------|
| C1 | 🟢 Good | `TaxiService`+`LocalBusiness`, `WebSite`, `HowTo`, `FAQPage` on home; `Service`, `FAQPage`, `BreadcrumbList`, `Speakable` on inner pages. Solid coverage. | [layout.tsx:53‑214](../../app/layout.tsx#L53), [schema.ts](../../lib/schema.ts) | Preserve. |
| C2 | 🟠 High | `LocalBusiness` includes a physical `address` (Sanaiya Industrial Area, Dammam) and `geo` that are **unverified** and shown nowhere on‑page. If not a real, consistent NAP, this hurts local trust and risks GBP mismatch. | [layout.tsx:67‑78](../../app/layout.tsx#L67) | Make address real and identical to the Google Business Profile, or remove it from schema. |
| C3 | 🟠 High | **No `Offer`/price in Service schema** — you removed ratings (correct) but Services carry no `priceSpecification`, so no price rich‑result eligibility. | [schema.ts:82‑105](../../lib/schema.ts#L82) | Add `offers`/`priceSpecification` **once you have one true price source** (see [05](05-duplication-map.md)); don't add conflicting numbers. |
| C4 | 🟡 Medium | `sameAs` social profiles (facebook/instagram/youtube/taxisaudiarabia) appear to be **placeholders**; linking to non‑existent profiles weakens the entity. | [schema.ts:10‑14](../../lib/schema.ts#L10), [layout.tsx:107](../../app/layout.tsx#L107) | Only list profiles that exist; add the **Google Business Profile** URL to `sameAs`. |
| C5 | 🟡 Medium | `FAQPage` schema in [layout.tsx:136](../../app/layout.tsx#L136) duplicates the visible homepage FAQ but with prices (249/374/499) that conflict with the calculator (180/350). Schema must match on‑page + reality. | [layout.tsx:150‑170](../../app/layout.tsx#L150) | After unifying prices, regenerate this block from the same source. |

---

## D. Sitemap & robots

| # | Sev | Finding | Location | Exact fix |
|---|-----|---------|----------|-----------|
| D1 | 🟢 Good | `robots.ts` blocks `/admin /customer /api /_next`, allows AI crawlers, points to sitemap. | [robots.ts](../../app/robots.ts) | Preserve. |
| D2 | 🟡 Medium | Sitemap `LOCATIONS`, `AIRPORTS`, `SUB_AREAS` are **hard‑coded lists** parallel to the page data — drift risk (add a city page, forget the sitemap). | [sitemap.ts:46‑105](../../app/sitemap.ts#L46) | Derive these from the same data modules the pages use (`CITY_DETAILS`, `SUB_AREAS`, airport data). |
| D3 | 🟡 Medium | Comment says "56 routes" but `ROUTES_DATA` has **67**; `trustStats.routesCovered = "56+"`. Numbers drift across the app. | [sitemap.ts:11](../../app/sitemap.ts#L11), [stats.ts:5](../../lib/config/stats.ts#L5) | Compute counts from `ROUTES_DATA.length`; don't hard‑code "56". |
| D4 | 🟢 Good | `/book`, `/track-booking`, `/partners/driver-registration` correctly excluded (noindex). | [sitemap.ts:10](../../app/sitemap.ts#L10) | Preserve. |
| D5 | 🟡 Medium | All priorities are near‑identical (0.6–0.9) and `changeFrequency: weekly` everywhere — low signal value (Google largely ignores these, but the uniformity is a smell). | [sitemap.ts:110‑178](../../app/sitemap.ts#L110) | Low priority; leave unless simplifying. |

---

## E. Thin / duplicate / doorway pages

| # | Sev | Finding | Location | Similarity | Exact fix |
|---|-----|---------|----------|:----------:|-----------|
| E1 | 🟠 High | **Hotel‑swap route cluster** — `jeddah-airport-to-{fairmont,swissotel,conrad,hilton-suites,movenpick,pullman-zamzam}-makkah`. All 80 km / ~1 hr / **from SAR 249**, near‑identical TLDR + FAQs with only the hotel name swapped. | [routes.ts:176‑228](../../lib/data/routes.ts#L176), content [routes/[slug]/page.tsx:58‑90](../../app/(marketing)/routes/[slug]/page.tsx#L58) | **~90%** | Doorway‑page risk. Either consolidate into one "Jeddah Airport → Makkah hotels" page with a hotel list, or add genuinely unique per‑hotel content (drop‑off logistics, distance from Haram, real photos). |
| E2 | 🟡 Medium | "Clock Tower" / "Markaziyah" landmark variants (`jeddah-airport-to-makkah-clock-tower`, `makkah-clock-tower-to-madinah-markaziyah`, `madinah-airport-to-madinah-markaziyah`) largely re‑use the corridor content. | [routes.ts:824‑876](../../lib/data/routes.ts#L824) | **~80%** | Same remedy as E1 — differentiate or consolidate. |
| E3 | 🟢 Good — preserve | **Location `/locations/[city]` pages are NOT doorway pages** — each has genuinely unique description, TLDR, attractions, tips, FAQs (the old byte‑identical template was already fixed, per the code comment). | [locations/[city]/page.tsx:59‑460](../../app/(marketing)/locations/[city]/page.tsx#L59), meta comment [:468](../../app/(marketing)/locations/[city]/page.tsx#L468) | **~30%** | Keep this quality bar for new cities. |
| E4 | 🟡 Medium | Recovery `[city]` pages depend on a "unique per‑city intro" field — verify all 12 are actually unique, not the fallback. | [recovery.ts:11‑12](../../lib/data/recovery.ts#L11) | n/a | Spot‑check each city's `intro`. |

---

## F. Internal linking & orphans

| # | Sev | Finding | Location | Exact fix |
|---|-----|---------|----------|-----------|
| F1 | 🟠 High | **Airport pages (8) are orphans** — not in nav or footer; only reachable from the parent city page. High‑intent "King Khalid Airport taxi" pages buried at depth 3+. | footer has no airports [Footer.tsx:53‑95](../../components/layout/Footer.tsx#L53); linked only from [locations/[city]/page.tsx:671](../../app/(marketing)/locations/[city]/page.tsx#L671) | Add an "Airports" column/section to the footer and a hub page linking all 8. |
| F2 | 🟠 High | **Footer lists only 8 of 11 cities** — `alkhobar`, `yanbu`, `abha` missing → weaker internal signal to those money pages. | [Footer.tsx:53‑62](../../components/layout/Footer.tsx#L53) | Add the 3 missing cities (or link a `/locations` hub that lists all). |
| F3 | 🟡 Medium | Footer links only 7 of 67 routes; the other 60 rely on the `/routes` hub. Sub‑areas (33) only linked from their city. Deepish but not broken. | [Footer.tsx:75‑83](../../components/layout/Footer.tsx#L75) | Ensure `/routes` and `/locations` hubs list *everything*; add contextual `RelatedLinks` (already built) to more pages. |
| F4 | 🟢 Good | Footer route links all resolve to valid slugs (checked against `ROUTES_DATA`). No broken internal links found there. | [Footer.tsx:75](../../components/layout/Footer.tsx#L75) vs [routes.ts](../../lib/data/routes.ts) | — |
| F5 | 🟡 Medium | Max click depth from home to a sub‑area is **3** (home → /locations → city → subarea); airports similar. | — | Add hub‑level links to flatten to ≤2 for priority pages. |

---

## G. Images

| # | Sev | Finding | Location | Exact fix |
|---|-----|---------|----------|-----------|
| G1 | 🟢 Good | `next/image` used across the site (162 `<Image>` usages), with `priority` on heroes, `sizes`, and `blurDataURL` placeholders. | [locations/[city]/page.tsx:587](../../app/(marketing)/locations/[city]/page.tsx#L587), [home-page.tsx:674](../../components/sections/home-page.tsx#L674) | Preserve. |
| G2 | 🟡 Medium | Some alt text trends keyword‑stuffy: `"Taxi service in {city}, Saudi Arabia — airport transfers and intercity rides"`. | [locations/[city]/page.tsx:589](../../app/(marketing)/locations/[city]/page.tsx#L589) | Shorten to natural description: `"{city} skyline"` / `"{vehicle} exterior"`. |
| G3 | 🟡 Medium | Driver assignment **email** embeds a random **Unsplash** stock photo as "your chauffeur." | [notifications.ts:193](../../lib/notifications.ts#L193) | Remove or use a real driver photo; a stock face erodes trust. |
| G4 | 🟢 Good | Only `images.unsplash.com` is allow‑listed as a remote pattern; everything else is local `/public`. | [next.config.ts:76‑83](../../next.config.ts#L76) | Preserve. |

---

## H. Heading hierarchy

| # | Sev | Finding | Location | Exact fix |
|---|-----|---------|----------|-----------|
| H1 | 🟢 Good | Location & route pages have a single `<h1>` and logical `<h2>`/`<h3>`. | [locations/[city]/page.tsx:602](../../app/(marketing)/locations/[city]/page.tsx#L602) | Preserve. |
| H2 | 🟡 Medium | Homepage `<h1>` is the hero title; the "car image card" overlay uses a large `<p>` (not a competing heading) — OK, but verify no service page ships two `<h1>`s. | [home-page.tsx:846](../../components/sections/home-page.tsx#L846) | Spot‑check the 18 service pages for exactly one `<h1>` each. *(Unverified across all service pages.)* |

---

## I. Quick wins (do these first)

1. Remove "Google Review — Verified Trip" label + "4.9/5" (A1, A2) — **minutes, removes the biggest trust/penalty risk.**
2. Fix `<html lang>`/`dir` per locale (B2) — **hours, unblocks Arabic SEO.**
3. Add airports + 3 missing cities to footer (F1, F2) — **minutes.**
4. Consolidate/differentiate hotel‑swap routes (E1) — **half a day, removes doorway risk.**
5. Unify prices so schema, FAQ, and calculator agree (C5, and [05](05-duplication-map.md)) — **1 day.**
