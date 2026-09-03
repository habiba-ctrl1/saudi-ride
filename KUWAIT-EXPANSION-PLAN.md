# Kuwait Expansion Plan — TaxiSaudiArabia.com

**Status:** Planning locked. Build not started.
**Created:** 2026-09-03
**Owner review model:** 1 page → build → user reviews → next page. NEVER one giant "make all Kuwait pages" prompt.

This doc is the single source of truth for the Kuwait rollout. Read it before building any Kuwait page. Update the checklist at the bottom after each page.

---

## 0. Core principle

We are extending the **existing** data-driven architecture — not creating a parallel folder of thin pages. Every Kuwait route/location becomes a row in an existing data array and is rendered by an existing template + auto-added to the sitemap.

**Beat the competitor with usefulness + honest facts + tight internal linking, NOT with 66 clone pages.**

Hard rules (from CLAUDE.md — non-negotiable):
- ❌ No invented distances, times, prices, reviews, ratings, rider counts, licenses, local office, "we track every flight."
- ❌ No fake landmarks / AI-looking hero images pretending to be real photos.
- ✅ Pricing = "Quote on WhatsApp" (no SAR numbers in body — site-wide policy).
- ✅ TSA is a **platform**, not a fleet owner / licensed operator. No own CR/VAT. Corporate invoicing via licensed Saudi partner (Arabian Eagle Eyes) — use the approved verbatim answer.
- ✅ Every distance/duration must be independently verified before publish. Competitor numbers are NOT truth.
- ✅ Report before implementing. Wait for approval.

---

## 1. How the architecture actually works (verified)

The site is fully data-driven. You do NOT create per-page folders.

### Routes
- **Data:** `lib/data/routes.ts` → `ROUTES_DATA` array (one object per route).
- **Template:** `app/(en)/(marketing)/routes/[slug]/page.tsx` (dynamic `[slug]`, `generateStaticParams`).
- **Arabic content:** `lib/data/routes-content-ar.ts` + curated `app/(ar)/ar/routes/*`.
- **Route object shape:**
  ```ts
  {
    fromCity, toCity,
    fromCityAr, toCityAr,
    distance,        // km — MUST be verified
    duration,        // minutes — MUST be verified (state whether border wait is included)
    basePrice,       // legacy field; site is WhatsApp-quote only
    popular,         // boolean
    description, descriptionAr,
    slug,            // e.g. "kuwait-to-khobar"
    priceOnRequest,  // true for cross-border/long-distance
  }
  ```

### Locations
- **Data:** `lib/data/locations.ts` → `CITY_DETAILS` (Record keyed by slug).
- **Template:** `app/(en)/(marketing)/locations/[city]/page.tsx`.
- **Shape:** name, nameAr, image, tagline, description, attractions[], tips[], tldr, tldrFacts[], faqs[], testimonials[], relatedLinks[].
  - ⚠️ `testimonials` on existing city pages are FAKE (flagged in prior audits). **Do NOT add testimonials to Kuwait pages.** Omit the field.
- Sub-areas live in `SUB_AREAS_DATA` (rendered at `/locations/<city>/<subarea>`).

### Sitemap — auto-syncs
`app/sitemap.ts` maps over `ROUTES_DATA`, `Object.keys(CITY_DETAILS)`, `SUB_AREAS_DATA`, `AIRPORT_DETAILS`, etc.
➡️ **Add a route to `ROUTES_DATA` or a city to `CITY_DETAILS` and it is automatically in the sitemap.** No manual sitemap edit needed. Only ready/indexable pages get added (don't add drafts).

### What already exists for Kuwait
- ✅ `kuwait-to-dammam` — already in `ROUTES_DATA` (return direction), `distance: 410, duration: 250`. **⚠️ These values need verification before we lean on them.**
- ✅ `dammam-to-kuwait` — outbound direction exists.
- ❌ No Kuwait location page yet (`kuwait` not in `CITY_DETAILS`).
- Existing cross-border framing uses the **Khafji border corridor** for Kuwait↔Eastern Province.

---

## 2. Target architecture (3-layer)

```
locations/
  kuwait          (hub — links down to all Kuwait→Saudi routes)
  kuwait-city, salmiya, hawalli, farwaniya, fahaheel, mangaf, ahmadi ...
routes/
  kuwait-to-dammam, kuwait-to-khobar, kuwait-to-khafji, kuwait-to-riyadh ...
services/
  (later) kuwait airport transfers — decide folder vs location convention first
```

Rule: do NOT auto-generate every area × city combination. Only pages with real commercial/search intent.

---

## 3. Route priority (Kuwait → Saudi)

| # | Route | slug | Notes |
|---|---|---|---|
| 🥇1 | Kuwait → Dammam | `kuwait-to-dammam` | ALREADY EXISTS — enhance, verify distance/time |
| 🥈2 | Kuwait → Khobar | `kuwait-to-khobar` | new |
| 🥉3 | Kuwait → Khafji | `kuwait-to-khafji` | new — border town, shortest |
| 4 | Kuwait → Riyadh | `kuwait-to-riyadh` | new |
| 5 | Kuwait → Jubail | `kuwait-to-jubail` | new |
| 6 | Kuwait → Dhahran | `kuwait-to-dhahran` | new |
| 7 | Kuwait → Makkah | `kuwait-to-makkah` | new — long distance |
| 8 | Kuwait → Madinah | `kuwait-to-madinah` | new — long distance |
| 9 | Kuwait → Jeddah | `kuwait-to-jeddah` | new — long distance |
| 10 | Kuwait → Hafr Al-Batin | `kuwait-to-hafr-al-batin` | new |
| 11 | Kuwait → Al Ahsa | `kuwait-to-al-ahsa` | new |
| 12 | Kuwait → Buraidah | `kuwait-to-buraidah` | new |

## 4. Location priority (Kuwait side)

**Tier 1:** kuwait (hub), kuwait-city, salmiya, hawalli, farwaniya, fahaheel, mangaf, ahmadi
**Tier 2:** jabriya, mahboula, abu-halifa, fintas, khaitan, jleeb-al-shuyoukh, jahra

Only serve areas we actually cover. No fabricated coverage.

---

## 5. PHASE 1 — first 10, then next 10

**Batch A (routes first — matches core Saudi business intent):**
1. `/routes/kuwait-to-dammam` (enhance existing)
2. `/routes/kuwait-to-khobar`
3. `/routes/kuwait-to-khafji`
4. `/locations/kuwait` (hub)
5. `/routes/kuwait-to-riyadh`
6. `/routes/kuwait-to-jubail`
7. `/routes/kuwait-to-dhahran`
8. `/routes/kuwait-to-makkah`
9. `/routes/kuwait-to-madinah`
10. `/routes/kuwait-to-jeddah`

**Batch B (locations + airport):**
11. Kuwait Airport (decide `/services/kuwait-airport-transfers` vs `/locations/kuwait-airport` — inspect airport convention first)
12. kuwait-city · 13. salmiya · 14. hawalli · 15. farwaniya · 16. fahaheel · 17. mangaf · 18. ahmadi · 19. jabriya · 20. mahboula

Then expand only on GSC search demand + conversions. NOT by copying competitor's 66.

---

## 6. Route page content structure

1. **Hero** — "Private Kuwait to <City> Taxi" + direct one-line answer + primary CTA "Get quote on WhatsApp" + secondary Call/Book.
2. **Quick Answer box** (AIO/LLM-extractable): Route · Border (Khafji/Nuwaiseeb corridor) · Distance [verified] · Driving time [verified, state if border wait included] · Vehicle: private · Price: Quote on WhatsApp · Availability [only if real].
3. At a Glance.
4. How the Journey Works.
5. Kuwait Pickup Areas (only served areas).
6. Saudi Drop-off Areas (real coverage only).
7. **Border Crossing** — documents, immigration/customs, vehicle requirements; passenger visa eligibility is passenger's responsibility; link to official govt sources rather than making legal claims.
8. Vehicle Options — real fleet categories (no specific models unless in facts.md).
9. Price — WhatsApp quote, no invented numbers.
10. FAQ — real questions.
11. Related Kuwait routes (internal links).
12. Repeated CTA.

---

## 7. Internal linking (where we beat competitor)

```
/locations/kuwait  (hub)
   ↓ links down to every Kuwait→Saudi route
kuwait-to-dammam ⇄ kuwait-to-khobar ⇄ kuwait-to-khafji ⇄ kuwait-to-riyadh  (sideways)
   ↑ each route links back up to /locations/kuwait + Kuwait airport + border service
Saudi-side location pages (dammam, khobar, riyadh) link back to relevant Kuwait routes
```
Vary anchor text. Build a real topical cluster, not isolated pages.

---

## 8. Metadata

- Title pattern: `Kuwait to <City> Taxi | Private Saudi Transfer`
- Meta: door-to-door, professional driver, vehicle options, route pricing confirmed before booking.
- Generate a few options per page, pick by real intent — don't keyword-stuff.
- ⚠️ CLAUDE.md G1: verify `twitter.title` is the page title, not the site default, on each new route.

---

## 9. Schema (per route page)

Include only what fits: `BreadcrumbList`, `Service`, `FAQPage`, plus site-wide `Organization`/`WebSite`. `LocalBusiness` only where entity facts genuinely support it.
❌ Never fabricate `aggregateRating`, `reviewCount`, `ratingValue`, `price`, `availability`.
Check for duplicate JSON-LD from layout (G12). Validate with Rich Results Test + Schema.org validator; paste output in report.

---

## 10. Images (purpose-driven only)

Per route: (1) hero — premium vehicle in Gulf/Kuwait road context; (2) clean branded route map Kuwait → border → destination (NOT a fake Google Maps screenshot); (3) chauffeur + vehicle; (4) border travel concept; (5) interior/luggage.
- `next/image`, explicit w/h, lazy except hero (`priority` + `sizes` on hero — G3).
- Alt text factually accurate; name a real entity only if the photo shows it (G2).
- No AI-generated fake landmarks. Use licensed real photography for real landmarks.

---

## 11. Facts to verify before publishing (blocking)

Log these in `seo/facts.md`. Do NOT guess.
- [ ] Kuwait pickup areas actually served
- [ ] Saudi drop-off coverage per destination (airport drop-offs allowed?)
- [ ] Verified distance + driving time per route (independent, not competitor)
- [ ] Whether kuwait-to-dammam's existing 410km/250min is correct
- [ ] Border corridor used (Khafji / Nuwaiseeb) per route
- [ ] Fleet categories offered on cross-border trips
- [ ] Any genuine availability claims

---

## 12. Per-page build workflow (repeat for every page)

```
Read this doc + CLAUDE.md §4 pipeline
  ↓ verify distance/time/facts (never invent)
Add route obj to ROUTES_DATA  (or city to CITY_DETAILS)
  ↓ add Arabic content (routes-content-ar.ts) if route
Metadata (check twitter.title G1) + canonical
  ↓ Schema (no fabricated fields, check dup G12)
Internal links (hub ↔ route ↔ Saudi-side)
  ↓ image alt text (G2/G3)
Validate: npm run build (0 TS errors), Rich Results, Schema.org, 320/375/414px
  ↓ sitemap auto-syncs (only when page is ready)
Update keyword-map.csv + page-log.md
  ↓ report full diff — NO commit, NO deploy
User reviews → next page
```

---

## 13. Progress checklist

Routes:
- [x] kuwait-to-dammam (enriched in-place 2026-09-03 — Quick Answer+8 FAQs, 5 bespoke sections, distance 410→436, H1 "+Taxi"; GSC baseline 0 impr. See seo/page-log.md)
- [ ] kuwait-to-khobar
- [ ] kuwait-to-khafji
- [ ] kuwait-to-riyadh
- [ ] kuwait-to-jubail
- [ ] kuwait-to-dhahran
- [ ] kuwait-to-makkah
- [ ] kuwait-to-madinah
- [ ] kuwait-to-jeddah
- [ ] kuwait-to-hafr-al-batin
- [ ] kuwait-to-al-ahsa
- [ ] kuwait-to-buraidah

Locations:
- [ ] kuwait (hub)
- [ ] kuwait-city
- [ ] salmiya
- [ ] hawalli
- [ ] farwaniya
- [ ] fahaheel
- [ ] mangaf
- [ ] ahmadi
- [ ] jabriya
- [ ] mahboula

Other:
- [ ] Kuwait airport page (decide convention first)
- [ ] Decide: keep Kuwait routes as `priceOnRequest: true`

---

_File location: `taxidriver/KUWAIT-EXPANSION-PLAN.md`. Update the checklist after each page._
