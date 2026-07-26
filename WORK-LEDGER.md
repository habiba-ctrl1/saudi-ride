# WORK LEDGER — TaxiSaudiArabia.com
> Har session yahan update karo. Duplicate work se bachne ke liye pehle yeh file parho.
> Verify: `python scripts/ui_consistency_check.py --summary` (0 violations = us page ka UI theme done)
> Priority order: `../SITE-URLS-PRIORITY.md` (Tier 1 → 2 → 3 → 4)

## 🚧 IN PROGRESS (2026-07-25) — Money Pages ranking plan, revised to 8 chunks after fresh GSC/Ahrefs audit
Full audit: `SEO-MONEY-PAGES-STRATEGY.md` (2026-07-25, GSC Performance/Coverage 07-23 exports + live Screaming Frog crawl + competitor gap vs `ksa-reference`). Goal unchanged: real customer leads, not driver-jobs traffic. Order below supersedes the old chunk 3-6 description (chunks 1-2 already done, kept as-is below).

**Chunk 0 DONE (2026-07-25) — Shipped + fixed a build-breaking bug found along the way:**
- Commit `06421eb`: the `/ar` duplicate-content fix (2026-07-20 work) + `locations/[city]` GeoCoordinates/speakable schema + EEAT stat cleanup, all finally committed and pushed.
- **Found: every deploy since commit `5fc0cf5` had been silently failing** (`npm run build exited with 1`) — root cause was `db.route.findMany()` calls in `airports/[slug]/page.tsx` and `locations/[city]/page.tsx` with zero error handling, run at build time for every static page. The Supabase pooler (`aws-1-us-east-1.pooler.supabase.com`) had a transient hiccup mid-build (`P1001 Can't reach database server`), which is normally recoverable, but with no try/catch it aborted the *entire* production build — meaning the site had been running on a **4.8-day-old deployment** (from `448c3c1`) the whole time, silently. `routes/page.tsx` already had the correct try/catch-with-fallback pattern; applied the same pattern to the other two. Commit `d555775`.
- **Verified live in production (2026-07-25):** `/ar/about` serves real Arabic SSR HTML, `/ar/services` 301-redirects, homepage shows new honest stats (not old fabricated "5,000+ trips"), `/airports/king-fahd-dammam` (the page that broke the build) loads fine.
- ⚠️ **Standing risk:** the same unguarded-DB-call-at-build-time pattern may exist elsewhere — if a future deploy fails with the same P1001 error, check for another un-try/caught `db.*.findMany()` in a statically-generated page first before assuming it's a new bug.

**Chunk 1 DONE — Quotations admin CRM** (migration `0010_quotation_details_edit.sql` applied to live DB, verified via scratch script — edit applies, audit_logs `details_edit` row written, lock on completed/cancelled blocks customer/trip edits, admin_notes stays editable post-lock):
- New RPC `admin_update_quotation_details` (service-role only) — edits customer/trip fields, writes its own audit_logs row (existing `trg_quotations_audit` trigger only covers status changes, NOT detail edits — don't assume it covers everything).
- `lib/supabase/quotations.ts`: `updateQuotationDetails()`. `app/api/quotations/[id]/route.ts` PATCH now accepts `{ details: {...} }` alongside existing `{ status, quotedPrice, driverId }`.
- `/admin/quotations` page.tsx now reads `searchParams` (Next 15 async prop) and passes to `listQuotations()` — that function already supported search/dateFrom/dateTo/source/paymentStatus/sort/page/limit, it just wasn't wired to the UI before.
- `QuotationsClient.tsx`: filter bar (search debounced 400ms, date range, source, payment status, sort — all URL-driven via `router.push` so filters are bookmarkable), status chips now URL-driven too, pagination (25/page), per-card Edit (locked/read-only once completed/cancelled), always-editable admin_notes + follow-up-flag toggle button.
- ⚠️ **git note:** working tree also has a large set of unrelated uncommitted changes (another session's `/ar` SSR i18n work — `app/ar/`, `lib/config/i18n.ts`, `middleware.ts`, several `layout.tsx`/`page.tsx`). Only Chunk-1 files were staged/committed — do NOT `git add -A` until that other work is confirmed done or explicitly reviewed.

**Chunk 2 DONE — Service pages (all 14) AIO/GEO** (`tsc --noEmit` clean, `ui_consistency_check.py --summary` PASS):
- All 14 `(marketing)/services/*/page.tsx` now have full `openGraph`+`twitter` metadata (previously missing site-wide) — used each page's existing hero image as the OG image (no new assets needed) since page-specific `-og.webp` files don't exist yet.
- Added `speakableSchema()` to the 12 pages that didn't have it (only `airport-transfers`/`umrah-transport` had it before).
- `components/seo/TLDRSummary.tsx` gained an `id` prop (default `"speakable-summary"`) so the component's answer `<p>` matches `speakableSchema()`'s default `cssSelector` — previously the component rendered no id at all, so any page using it with default selectors would've pointed at nothing.
- Replaced ad-hoc `<p id="speakable-summary">` (2 pages) and added net-new `<TLDRSummary>` answer-first blocks (12 pages) with real facts pulled from each page's own pricing/data — no fabricated numbers.
- Order done: Tier-1 (umrah-transport, airport-transfers) → Tier-2 (makkah-ziyarat, madinah-ziyarat, intercity, hajj-transport, vip-luxury, corporate) → rest (business-executive, group-transport, heritage-tours, tourism, border-crossings, car-recovery).

**Chunk 3 DONE (2026-07-25) — Money-page template fixes** (`tsc --noEmit` clean, production build clean):
- Title-tag fix: `fleet/[slug]` dropped duplicate `"Taxi Saudi Arabia"` (was appearing twice in the same `<title>`); `blog/[slug]` now uses a short `" | TaxiKSA"` suffix instead of `" | Taxi Saudi Arabia Blog"` (25 chars) whenever the post's own title is already >55 chars — recovers most of the 23 blog posts + 14 fleet pages from truncating in search results.
- `fleet/[slug]` meta description template shortened (dropped the generic trailing sentence, kept the real per-vehicle description) — all 14 vehicles now 123-157 chars, was 197-231.
- 8 blog post excerpts (used as meta description) trimmed from 166-193 chars down to 139-145, meaning preserved.
- `/pricing`, `/terms-conditions`, `/services/car-recovery` + its 5 city sub-pages: meta descriptions trimmed to under ~145 chars (were 161-193).
- `locations/[city]`: replaced the single generic meta-description template (byte-identical across all 11 cities except the name) with a hand-written, genuinely distinct one-liner per city (`CITY_META_DESCRIPTION` map) — each references a real landmark/distance already in that city's own data (e.g. Makkah → Jeddah Airport ~80km/Madinah ~430km; NEOM → Tabuk/NEOM Bay airports). Old generic string kept only as a fallback for any future city not yet in the map.
- **Correction to this plan's original premise:** did NOT add `AggregateRating` schema to `routes/[slug]`. That pattern was NOT "already implemented elsewhere to reuse" — it was **deliberately removed** from `app/layout.tsx` (Day 2, fabricated 4873-review count) and from `fleet/[slug]` (explicit code comment: "vehicle.rating/reviews fabricated numbers — schema.org violation risk") for EEAT/spam-policy reasons. Adding it to `routes/[slug]` would have repeated a mistake this codebase already fixed twice. Visible (non-schema) testimonial text exists for only 3/11 cities in `locations/[city]` — that's fine (it's just UI copy, not a structured-data claim), but there is no real review dataset for routes yet. Chunk 5's "publish real reviews" item is the correct place to revisit this, and only with actual customer reviews, never fabricated ones.
- **Bonus find while auditing prices:** the Tier-1 corridor price update (2026-07-16, `routes.ts`/DB) had only been reflected in `jeddah-airport-to-makkah`'s hardcoded body copy (fixed in Chunk 0). Cross-checked every slug's hardcoded `ROUTE_CONTENT` copy against its live `basePrice` and found **6 more routes silently showing two different prices on the same page** (title/price-table pulled the new DB price, TLDR/FAQ text still said the old one): `jeddah-to-makkah` (150→199), `jeddah-airport-to-madinah` (380→549), `jeddah-to-madinah` (350→549), `makkah-to-jeddah-airport` (180→249), `makkah-to-madinah` / `madinah-to-makkah` (350→499), `riyadh-to-dammam` (300→699). All 7 now consistent — verified with a script cross-checking every `ROUTE_CONTENT` slug's SAR mentions against `lib/data/routes.ts` basePrice, 0 mismatches left.
- Not done in this chunk (moved out — needs real content decisions, not template fixes): strengthening `/locations/neom` + `/routes/dammam-to-doha` + `/routes` hub specifically, and the AggregateRating/reviews question above. Revisit in Chunk 5.

**Chunk 5 (in progress) — Content gap closure vs competitor:**
- ✅ **6 hotel-route pages DONE** (2026-07-26): `/routes/jeddah-airport-to-{fairmont,swissotel,pullman-zamzam,conrad,hilton-suites,movenpick}-makkah` — all real, well-known hotels immediately at/beside Masjid al-Haram, same corridor as `jeddah-airport-to-makkah` (~80km/~60min/SAR 249, no fabricated per-hotel distance since they're all essentially at the same destination point). Added: DB rows (`Route` table, via Supabase REST API — Prisma pooler still flaky, same workaround as `update_route_prices.js`), `ROUTES_DATA` entries (`lib/data/routes.ts`) so `generateStaticParams` picks them up, bespoke `ROUTE_CONTENT` (tldr/facts/FAQs) per hotel, title-length fix for long hotel names (same >55-char-drop-suffix pattern as blog). **Internal linking:** `RouteRelatedLinks.tsx` city-matching changed from exact-equality to substring (`.includes()`) so hotel destinations cross-link with plain "Makkah" routes both ways — but that alone wasn't enough (existing jeddah-airport-* routes crowd out the slice(0,5) on the flagship page), so added an explicit "Book by Hotel Near Masjid al-Haram" link block on `jeddah-airport-to-makkah` pointing to all 6 — without this they'd have had no real inbound link and risked staying orphaned, same lesson as the Day-9 sub-area/airport orphan-page fix. Verified: `tsc` clean, production build succeeded (62 route paths, up from 56), smoke-tested via `next start` — title/price render correctly, hotel-links block confirmed present on flagship page, non-existent slug still 404s.
- ✅ **`/pricing` fare calculator fixed (2026-07-27)** — turns out an interactive calculator already existed on `/pricing` (`CITIES`/`getPrice()`, EN/AR/UR) plus a *separate* `PriceCalculator` component already live on the homepage; the original "build one" plan item was stale. The real bug: `/pricing`'s calculator used a made-up haversine-distance + flat per-km-rate formula totally disconnected from the actual fixed prices — e.g. quoted **~SAR 333** for Jeddah→Makkah sedan while `/routes/jeddah-to-makkah` says **SAR 199 fixed**. Same price-drift bug class as Chunk 3/blog, just a 4th copy of the numbers. Fixed: calculator now looks up `ROUTES_DATA` for a real city-to-city (non-airport) match first and uses its real `basePrice`/`distance`/`duration` with the same vehicle multipliers as `routes/[slug]` (SUV ×1.5, VAN ×1.35, LUXURY ×2.5); only falls back to the haversine estimate for the 3 city pairs with no dedicated route (Jeddah/Makkah/Madinah ↔ Dammam). Also fixed a stale "90 minutes free waiting" FAQ claim (all 3 languages) → 60 minutes, matching the site-wide canonical (`services/airport-transfers`). Verified via `next start`: default Riyadh→Jeddah sedan now shows exactly SAR 600, matching `/routes/riyadh-to-jeddah`.
- ⚠️ **Found + fixed another build-breaking bug while testing:** `routes/[slug]/page.tsx`'s own `db.route.findUnique()` (both `generateMetadata` and the page body) had **no try/catch** — exactly the pattern fixed in Chunk 0 for `airports/[slug]`/`locations/[city]`, just hadn't been caught there yet. It reproduced live during this session's build (`routes/madinah-to-jeddah` hit a transient pooler timeout and took down the entire 311-page build). Now wrapped the same way: on fetch failure, treated as `route = null` → page builds as a 404 for just that one slug instead of failing the whole site. **If a future deploy fails with a Prisma P1001 "Can't reach database server" error again, grep for `db\.` calls without try/catch before assuming it's a new bug** — this is the third time this exact pattern has caused a real production failure.
- Still pending: publish real, visible customer reviews (10-15 real ones, crawlable text) — `AggregateRating` schema already exists on several templates but has no visible backing content. **Do not fabricate reviews** — wait for real ones (see Chunk 3's correction note above). Needs real review text from the business owner before this can move.

**Chunk 6 (revised) — OFFPAGE-ASSETS.md + 5 blogs + local citations (NOT started):**
- Google Business Profile listing per served city + consistent NAP — cheapest, fastest authority lever available.
- `OFFPAGE-ASSETS.md`: backlink target list (Umrah/Hajj travel agencies, hotels near the Haram, pilgrim forums/blogs) + what a linkable digital-PR asset could look like (fare calculator from Chunk 5 doubles as this).
- 5 strategic blogs — target queries already showing impressions in GSC (e.g. miqat/ziyarat/route-fare topics) over generic content.

**Chunk 7 (new, long-term) — Urdu locale (NOT started):**
- `/ur/` pages for homepage + top routes/services, same pattern as the `/ar/` real-routes fix in Chunk 0. Urdu-speaking pilgrims (Pakistan/India) are a large Umrah source market with zero current coverage and no local-KSA-operator competition in that language.

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
- [x] GSC data (SEO/*.zip) analyze — DONE 2026-07-25, see `SEO-MONEY-PAGES-STRATEGY.md` §3 (striking-distance pages) + §4 (on-page gaps)

## Rules
- Kaam se pehle: yeh ledger + SITE-URLS-PRIORITY.md parho
- Kaam ke baad: ledger update karo + `python scripts/ui_consistency_check.py --summary` chalao
- UI patterns: `UI-PLAN.md` follow karo — naye colors invent mat karo
