# WORK LEDGER — TaxiSaudiArabia.com
> Har session yahan update karo. Duplicate work se bachne ke liye pehle yeh file parho.
> Verify: `python scripts/ui_consistency_check.py --summary` (0 violations = us page ka UI theme done)
> Priority order: `../SITE-URLS-PRIORITY.md` (Tier 1 → 2 → 3 → 4)

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

## 🔶 KNOWN ISSUES
1. Homepage About blurb "50k+ trips" vs trustStats 5,000+ — harmonize karna hai.
2. `hourly-charter`, `wedding-events`, `car-recovery` hub cards ke detail pages nahi hain (link nahi kiye).
3. Baaki ~40 routes ke basePrice abhi purane (sirf Tier-1 corridor update hua) — Tier-2 pass mein market-check karo.

### Locations pages — LIGHT THEME COMPLETE (2026-07-16)
- Hub + [city] + [subarea] templates converted (light-theme codemod), vehicle-recommendation dark box → white card, 0 checker violations

## 📋 BACKLOG (dark→light theme + audit; violation counts from checker)
**Tier 1 (pehle):** routes/[slug] (21) + RoutesClient (22)
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
