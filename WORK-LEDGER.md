# WORK LEDGER — TaxiSaudiArabia.com
> Har session yahan update karo. Duplicate work se bachne ke liye pehle yeh file parho.
> Verify: `python scripts/ui_consistency_check.py --summary` (0 violations = us page ka UI theme done)
> Priority order: `../SITE-URLS-PRIORITY.md` (Tier 1 → 2 → 3 → 4)

## 🚧 IN PROGRESS (2026-07-20) — Money Pages AIO/GEO + Backend CRM plan (6 chunks)
Full plan agreed with user: Tier-1 money pages best-in-class AIO/GEO/SEO/UI-UX, quotations backend fixed, off-page assets prepared, 5 strategic blogs. Order: 1) backend CRM 2) service pages schema 3) location/route pages schema 4) UI/UX conversion pass 5) OFFPAGE-ASSETS.md 6) 5 blogs.

**Chunk 1 DONE — Quotations admin CRM** (migration `0010_quotation_details_edit.sql` applied to live DB, verified via scratch script — edit applies, audit_logs `details_edit` row written, lock on completed/cancelled blocks customer/trip edits, admin_notes stays editable post-lock):
- New RPC `admin_update_quotation_details` (service-role only) — edits customer/trip fields, writes its own audit_logs row (existing `trg_quotations_audit` trigger only covers status changes, NOT detail edits — don't assume it covers everything).
- `lib/supabase/quotations.ts`: `updateQuotationDetails()`. `app/api/quotations/[id]/route.ts` PATCH now accepts `{ details: {...} }` alongside existing `{ status, quotedPrice, driverId }`.
- `/admin/quotations` page.tsx now reads `searchParams` (Next 15 async prop) and passes to `listQuotations()` — that function already supported search/dateFrom/dateTo/source/paymentStatus/sort/page/limit, it just wasn't wired to the UI before.
- `QuotationsClient.tsx`: filter bar (search debounced 400ms, date range, source, payment status, sort — all URL-driven via `router.push` so filters are bookmarkable), status chips now URL-driven too, pagination (25/page), per-card Edit (locked/read-only once completed/cancelled), always-editable admin_notes + follow-up-flag toggle button.
- ⚠️ **git note:** working tree also has a large set of unrelated uncommitted changes (another session's `/ar` SSR i18n work — `app/ar/`, `lib/config/i18n.ts`, `middleware.ts`, several `layout.tsx`/`page.tsx`). Only Chunk-1 files were staged/committed — do NOT `git add -A` until that other work is confirmed done or explicitly reviewed.

## ✅ DONE (2026-07)

### Homepage (`/`) — COMPLETE
- Contrast fix: #A1A1A6 / #7C8088 → #6B7280 (WCAG AA)
- 9 hardcoded EN strings AR-translated (`t.misc.*` block); 3 parallax banners translated
- Nested `<main>` fix (SiteShell hi `<main>` deta hai — pages `<div>` use karein)
- aria-labels (route arrows), aria-hidden (slideshow dots, marquee)
- Code: scroll handlers merged, heroCars hoisted

### Navbar + Footer (site-wide) — COMPLETE
- Footer AR/UR: purana brand "الرياض لوكس / ریاض لوکس" → Taxi Saudi Arabia
- Footer AR/UR taglines entity-rich rewrite (EN se aligned)
- Mislinks fix: "Jeddah Airport → Makkah" → `/routes/jeddah-airport-to-makkah`; "Madinah → Jeddah Airport" → `/routes/madinah-to-jeddah-airport` (Footer ×3 lang + Navbar)
- Footer Company column: + Our Fleet, Pricing, FAQ, Contact (×3 lang)
- Footer contrast 0.35/0.38 → 0.55; Navbar dropdowns keyboard-accessible (group-focus-within)

### Driver pages content fix — COMPLETE
- "company car / join with our fleet" hataya — drivers must own vehicle
- Files: DriverJobBody.tsx (×3), DriverJobsHubBody.tsx, lib/data/driver-jobs.ts

### Services (13 detail + hub) — LIGHT THEME COMPLETE
- Dark (#0A0A0A/#111/gold) → brand light theme (codemod: scratchpad services-light-theme.js)
- Invisible-text fixes: intercity route cards, tourism destination cards (text-white on overlays)
- Dark CTA/form boxes → white cards: airport, intercity, corporate, makkah-ziyarat, umrah
- intercity: missing `<ServiceRelatedLinks />` added
- Hub `/services`: rainbow (blue/purple/rose/…) → green tints; card titles ab detail pages ko link karte hain (DETAIL_PAGES map); 50K+ → 5,000+ (trustStats); "GTA" typo → TGA; fake review counts hataye
- corporate: fake client logos (AL-RAJHI/SABIC) → generic sectors (EEAT risk)
- airport-transfers: 90-min wait claim → 60 min (site-wide canonical)

### Infra
- `scripts/ui_consistency_check.py` — banned dark/off-brand class scanner (admin/dashboard excluded, overlay idiom allowed)
- robots.txt checked — theek hai, AI crawlers allowed, koi change nahi

## ✅ PRICES RESOLVED (2026-07-16) — market research se estimated prices set
User decision: website par ESTIMATED prices; original price client ko quotation se milti hai.
Canonical sedan "From" estimates (market data: umrahcabs4u, vipumrahtaxi, umrahtaxisa etc.):
- JED Airport ↔ Makkah: **249** · Jeddah city → Makkah: **199**
- Makkah ↔ Madinah: **499** · Jeddah/JED → Madinah: **549** · Riyadh → Dammam: **699**
Fixed in: lib/data/routes.ts (8 slugs), home-page.tsx (route cards + AR/UR FAQ 180→249, 799→499, 749→549), layout.tsx FAQ schema (799→499 + "estimated" wording), umrah-transport (180→249), airport-transfers (180→249, 650→549), intercity (1200→699, 650→549, 350→349).
**Rule aage ke liye:** naye prices routes.ts basePrice se lo; "From SAR X" (estimate) likho.

### Payment removal + forms audit + estimate disclaimers (2026-07-19)
- /book: fake payment simulator (card/ApplePay/deposit) REMOVED — ab quotation-based
  request flow ("No Payment Required Now" card; paymentMethod hamesha "arrival")
- Forms backend status: book→db.booking ✅ · quote forms→/api/quotations RPC ✅ ·
  driver-reg→register_driver_application RPC ✅ · contact/partners→/api/contact (email-only,
  Resend chahiye) ⚠️ · corporate form DEAD tha → CorporateAccountForm.tsx bana ke
  /api/contact se wire kiya ✅
- "Estimated fare — final quotation via WhatsApp/email" wording: book summary,
  PriceCalculator, routes/[slug], airport/intercity tables, root FAQ schema

## 🔶 KNOWN ISSUES
1. Homepage About blurb "50k+ trips" vs trustStats 5,000+ — harmonize karna hai.
2. `hourly-charter`, `wedding-events`, `car-recovery` hub cards ke detail pages nahi hain (link nahi kiye).
3. Baaki ~40 routes ke basePrice abhi purane (sirf Tier-1 corridor update hua) — Tier-2 pass mein market-check karo.

### Locations pages — LIGHT THEME COMPLETE (2026-07-16)
- Hub + [city] + [subarea] templates converted (light-theme codemod), vehicle-recommendation dark box → white card, 0 checker violations

### Routes pages — LIGHT THEME COMPLETE (2026-07-16)
- [slug] + RoutesClient + hub converted; vehicle-card overlay white gradient; RouteRelatedLinks + Breadcrumbs + ui/table components fixed
- **DB prices bhi update** (scripts/update_route_prices.js — Supabase REST API se, kyunke pooler local se unreachable): 8 Tier-1 slugs market estimates par

### /book + /track-booking — LIGHT THEME COMPLETE (2026-07-16)
- Booking console + tracking: inputs bg-[#FAFAF7], payment tiles white, booking-ref card white, map light
- Intentional dark rakha: vehicle-image badge, dispatch console box
- ⚠️ NOTE: book page ke AR strings **mojibake/corrupted hain (pehle se, HEAD mein bhi)** — re-translation chahiye

### 🎉 POORI PUBLIC SITE LIGHT THEME COMPLETE (2026-07-16)
Batch mein convert hue: pricing, fleet hub + [slug], airports/[slug], contact, partners,
driver-registration, about, guides hub + [slug], faq, blog hub + [slug], gallery,
privacy-policy, terms-conditions, not-found, error + DriverJobsHubBody/RelatedLinks/TLDRSummary.
guides hub ke rainbow category colors → green/gold. Checker: **PASS — 0 violations site-wide.**
(Dark intentionally bacha: Footer, WhatsApp tooltip, admin/dashboard, image overlays, lightbox, console box.)

## 📋 BACKLOG (dark→light theme + audit; violation counts from checker)
**Tier 2:** airports/[slug] (17) · fleet hub (18) + fleet/[slug] (28) · locations hub (11) · pricing (29)
**Tier 3:** blog/[slug] (14) + blog hub (6) · guides (17) + guides/[slug] (13) · gallery (13)
**Tier 4 (conversion-critical pehle):** book (96 — sabse bara, conversion page!) · track-booking (41) · contact (23) · partners (21) + driver-registration (27) · about (17) · faq (15) · login (14) · privacy (10) · terms (10) · not-found (9) · error (7)
**Components:** Breadcrumbs (2) · RouteRelatedLinks (2) · LanguageSwitcher (2) · ui/table (2)

## 📋 GEO/AIO BACKLOG (Tier-1 pages par, SEO folder priorities)
- [ ] Speakable schema — homepage + Tier-1 services/routes
- [ ] "People Also Ask" style Q&A sections — Tier-1 routes/locations (FAQ schema already hai services par)
- [ ] Internal links har 150–250 words (routes/locations body content mein)
- [ ] Semantic clusters: Umrah corridor (JED→Makkah→Madinah) cross-linking audit
- [ ] JEDDAH-TOPICAL-AUTHORITY.md (SEO folder) ke gaps implement karna
- [ ] GSC data (SEO/*.zip) analyze — kaunse queries impressions de rahi hain, unke pages pehle

## Rules
- Kaam se pehle: yeh ledger + SITE-URLS-PRIORITY.md parho
- Kaam ke baad: ledger update karo + `python scripts/ui_consistency_check.py --summary` chalao
- UI patterns: `UI-PLAN.md` follow karo — naye colors invent mat karo
