# WORK LEDGER — TaxiSaudiArabia.com

## ✅ (2026-08-05) — Closed the internal-linking-gap HANDOFF from 2026-08-04

Re-ran `scripts/check_route_link_density.ts` per its own recommendation (list may have changed). It did — found 15 routes at 0 simulated inbound links, not the original 7. Before fixing, checked each one for a *real* inbound link the script doesn't model (it only simulates `RouteRelatedLinks.tsx`, not manual blocks or other pages):
- **Already covered, false positives**: `jeddah-airport-to-makkah-clock-tower`/`-conrad-makkah`/`-hilton-suites-makkah`/`-movenpick-makkah` (all 4 already in `MAKKAH_HOTEL_ROUTES`, rendered on `jeddah-airport-to-makkah` — confirms the ledger's own 2026-08-04 hedge was right), `riyadh-to-dubai` (site-wide Footer link, all 3 languages), `alula-airport-to-resorts` + `abha-airport-to-soudah` (both in `AIRPORT_DETAILS.priorityRoutes`, pulled into a live Prisma query and rendered on their `/airports/[slug]` page).
- **Real orphans, fixed (12)**: added 3 new explicit link-block sections to `routes/[slug]/page.tsx` (same proven pattern as the existing `MAKKAH_HOTEL_ROUTES` block — a typed const array + a `slug === "..."` conditional `<section>`), placed on each corridor's highest-traffic flagship page rather than a new page each:
  - `jeddah-airport-to-makkah` page → new "More Jeddah & Makkah Routes" block: `jeddah-airport-to-jeddah-city`, `jeddah-to-haramain-station`, `makkah-to-jeddah`, `makkah-to-kaec`, `makkah-to-yanbu`.
  - `madinah-to-makkah` + `makkah-to-madinah` pages → new "More Madinah Routes" block: `madinah-airport-to-madinah-markaziyah`, `makkah-clock-tower-to-madinah-markaziyah`, `madinah-to-yanbu`.
  - `riyadh-airport-to-city` page → new "More Riyadh Routes" block: `riyadh-airport-to-kafd-hotels`, `riyadh-to-alahsa`, `riyadh-to-hail`, `riyadh-to-abudhabi`.

**Verified, not assumed**: pulled real `fromCity`/`toCity`/`distance`/`basePrice` for all 12 from `ROUTES_DATA` (a naive grep -A on `slug:` first grabbed the *next* object's fields since `slug` sits near the end of each record — caught this before shipping wrong labels/prices). Confirmed all 12 slugs exist in the live Supabase `Route` table via the REST API (same class of bug as the 2026-08-04 "7 routes 404 in production" incident — checked this time before, not after). Ran `next dev` and curled all 4 host pages — all 12 new `href="/routes/..."` links render live. `tsc --noEmit` clean (pre-existing unrelated `.next/types/app/api/*` stale-cache errors only, none in the edited file). `ui_consistency_check.py --summary` PASS.

**Not done**: the root-cause fix (`RouteRelatedLinks.tsx`'s `.slice(0,5)` picking array order instead of link-need) — still a standing option for a future pass if more orphans keep surfacing, flagged again in the 2026-08-04 entry below, not attempted here (same reasoning: higher risk touching shared code across 67 pages, this session's explicit-block approach is lower-risk and proven).

## ✅ (2026-08-05) — Real customer review added to homepage; Phase 1 of GCC/NEOM expansion shipped
Real WhatsApp review (client very satisfied, screenshot provided by CEO) added to `customerReviews` in `components/sections/home-page.tsx` as `{ name: "Verified Customer", ... }` — deliberately not given a fabricated name, since the quote is real but the name is not (the other 6 entries in that array are entirely synthetic placeholder testimonials, a pre-existing issue, not touched this session). Booking economics for the record: quoted 275 SAR, 26 SAR profit. **Not yet in the Prisma `Review` table / Supabase** — that table requires a real `userId`/`bookingId` FK and this trip was arranged manually via WhatsApp (Saudi Event Management account), not through the site's `/book` flow, so there's no `Booking` row to attach it to. Also skipped touching `prisma/schema.prisma` / Supabase this session because another in-progress, uncommitted change (leads tracking, `lib/config/credentials.ts`, a new migration `0010_phase1a_leads_and_notification_failures.sql`) was already sitting in the working tree — didn't want to collide. If a real DB-backed review/booking log is wanted, do it as its own pass once that other work is committed or clarified.

Same session, Phase 1 of `SEO-PROGRAMMATIC-ARCHITECTURE-2026.md` shipped (commit `358aef8`, pushed to `main`): new `/locations/tabuk` page, 4 new NEOM/Red Sea corridor routes (`tabuk-to-aqaba`, `tabuk-to-red-sea-airport`, `red-sea-airport-to-amaala`, `red-sea-airport-to-neom`), and `CITY_DETAILS`/`AIRPORT_DETAILS` moved out of their page.tsx files into `lib/data/locations.ts`/`lib/data/airports.ts` so `sitemap.ts` derives its location/airport lists from the same source the pages render from instead of a hand-synced duplicate array.

## 🚧 HANDOFF (2026-08-04) — internal-linking gap, next agent should pick this up
Ran `scripts/check_route_link_density.ts` (new, reuses real `RouteRelatedLinks.tsx` matching logic) to find which route pages get zero real inbound links from that component (crowded out by more common same-city routes in `.slice(0,5)`). Confirmed **~15 routes at 0 inbound links**, not just the newly-fixed ones — a real, site-wide gap, not scoped to any one batch.

Fixed 1 of them the cheap, proven way: added `jeddah-airport-to-makkah-clock-tower` to the existing `MAKKAH_HOTEL_ROUTES` explicit-link block in `routes/[slug]/page.tsx` (same pattern already used for the original 6 hotel routes — reuse this pattern, don't reinvent).

**Still at 0 inbound, needs the same treatment** (run the script again for the current list — it may have changed): `madinah-airport-to-madinah-markaziyah` (fits `/locations/madinah` or `/airports/prince-mohammad-madinah`), `makkah-clock-tower-to-madinah-markaziyah` (fits alongside the `makkah-to-madinah`/`madinah-to-makkah` flagship pages), `makkah-hotels-to-taif-resorts` (fits `/services/taif-ziyarat`, already exists), `riyadh-airport-to-kafd-hotels` (fits `/services/corporate` or `/services/business-executive`), `jeddah-airport-to-jeddah-city` + `jeddah-to-haramain-station` (fit `/locations/jeddah` or `/airports/king-abdulaziz-jeddah`), plus `jeddah-airport-to-conrad-makkah`/`hilton-suites`/`movenpick` (surprising — these are already IN `MAKKAH_HOTEL_ROUTES`, so they must be losing out to `.slice(0,5)` truncation on other pages that link elsewhere; re-verify before assuming they need a new fix). Bigger-picture option instead of more explicit blocks: the root cause is `RouteRelatedLinks.tsx`'s `.slice(0, 5)` picking array order, not link-need — a smarter pass could weight the sort toward under-linked routes instead. Not attempted this session (higher risk to shared code touching 67 pages, wanted verification time this session didn't have).

## ✅ (2026-08-04) — MAJOR FIND: 7 route pages were 404ing in production, indexed and linked
Started as a routes-page AIO/GEO/content-gap pass (user asked to strengthen money pages, fill gaps, build internal linking, AIO/GEO/LLM optimization). Found something much bigger while verifying.

**Root cause**: `lib/data/routes.ts` (static file — sitemap, price calculators, homepage cards, RouteRelatedLinks matching) is a *separate* data source from the live Supabase `Route` table, which is what `routes/[slug]/page.tsx` actually queries via Prisma (`db.route.findUnique`). 7 routes existed in the static file but were **never inserted into the live DB** — so the pages 404'd for every real visitor, while still being in the sitemap (submitted to Google), linked from other pages, and used for price-calculator math, the whole time:
- The 5 newest hotel-corridor routes (`jeddah-airport-to-makkah-clock-tower`, `madinah-airport-to-madinah-markaziyah`, `makkah-clock-tower-to-madinah-markaziyah`, `makkah-hotels-to-taif-resorts`, `riyadh-airport-to-kafd-hotels`) — added 2026-07-31, never seeded to the DB.
- **Correction to an earlier session's conclusion**: `jeddah-airport-to-jeddah-city` and `jeddah-to-haramain-station` were flagged by the very first audit pass (2026-08-02) as "2 broken-link targets, likely a transient Supabase pooler flake during build, self-heals on next deploy." That was wrong — same root cause as above, not transient. Correcting the record here so a future session doesn't re-diagnose this as a build flake again.

**Fix**: `scripts/insert_missing_routes.js` (new, same Supabase-REST-API-not-Prisma-pooler pattern as `update_route_prices.js`, since direct/pooler DB access is flaky from local) — inserted all 7 missing rows. Verified all 7 return 200 on `next dev` after insert (were 404 before). **Recommend running a slug diff between `ROUTES_DATA` and the live `Route` table any time new routes are added** — this class of bug has no build-time or type-time signal, it only shows up as a runtime 404 that generateStaticParams doesn't catch (static params come from the *static* file, not the DB, so the build itself succeeds even when the DB row is missing).

**Also while in this file**:
- Fixed a real price inconsistency found while writing content: `makkah-hotels-to-taif-resorts` was priced at SAR 350 for essentially the same ~85km/75min corridor as the existing `makkah-to-taif` route (SAR 180) — nearly 2x for the same trip. Reduced to SAR 220 (modest justified premium for the day-trip/rose-distillery-stop framing the page describes, not an unexplained 2x gap).
- Wrote bespoke `tldr`/`tldrFacts`/`faqs` content for the 5 hotel-corridor routes (were falling back to generic 2-question `DEFAULT_FAQS` — thin content, exactly the kind of "gap" flagged).
- Added `speakableSchema()` to `routes/[slug]/page.tsx` — the page already renders answer-first `TLDRSummary` content with the `#speakable-summary` id (matching the site-wide convention), but the formal `Speakable` JSON-LD that tells Google/AI engines which selector is the speakable answer was never added, despite `services/*` pages already having it since Chunk 2. This was a real, site-wide (all 67 routes) AIO/GEO gap — one import + one script tag fixes all of them at once, verified live.

Verified throughout via `next dev` + curl, not assumed. `tsc --noEmit` clean, `ui_consistency_check.py --summary` PASS.

**Not yet done**: internal-linking audit for the 5 newest hotel-corridor routes specifically (they get a guaranteed inbound link from the `/routes` hub since it maps the full `ROUTES_DATA` array, plus whatever `RouteRelatedLinks`'s symmetric substring city-matching picks up — but given the WORK-LEDGER's own note that "existing jeddah-airport-* routes crowd out the slice(0,5)" for the *original* 6 hotel routes, the same crowding risk likely applies here and wasn't specifically re-checked this session).

## ✅ (2026-08-03) — Corrected "taxi" over-removal + 5 new blog posts
User pushback: the last two VIP-tone passes swapped the word "taxi" out entirely in several spots (homepage bottom CTA, WhatsApp button template/bubble, corporate page title) instead of keeping it and adding "private/VIP" alongside it — "taxi" is a real, high-volume search term per GSC query data, the ask was to strengthen already-matching pages, not strip the keyword. Restored "taxi" in all of those (kept the private/VIP additions — additive, not a revert).

Also answered two open questions and acted on the third:
- **"Pages not indexed" (144, from the 26 Jul Ahrefs/GSC audit)**: told the user exactly what to export — GSC → Indexing → Pages → click "Discovered - currently not indexed" → export the URL table. Only had the aggregate count, not the URL list, so couldn't investigate further without it.
- **Money pages ranking position 80–90 ("page 8-9")**: confirmed honestly this is a domain-authority/backlinks problem, not a code problem — Ahrefs shows zero ranked keywords for the entire site across all of July. Not fixable from the codebase; `OFFPAGE-ASSETS.md` already has the real plan (GBP listings, real citations).
- **5 new blog posts** (the one concrete lever available in code): added to `lib/data/blog-posts.ts`, VIP-angle topics not overlapping the existing 23 posts — `private-driver-cost-saudi-arabia` (real hourly rates already published elsewhere, e.g. SAR 70/hr sedan, SAR 250/hr S-Class — not invented), `vip-airport-meet-greet-saudi-arabia`, `private-car-vs-shared-van-umrah`, `how-to-choose-private-chauffeur-company-saudi-arabia`, `riyadh-to-diriyah-visitor-transport-guide`. Each reuses an existing real hero image (no new image assets needed — verified all 5 load 200) and links to real, existing service/route/airport pages (verified each link target exists before writing it in). All 5 confirmed 200 live via `next dev`, all appear on the `/blog` hub (auto-picked-up, no separate wiring needed) and will auto-appear in `sitemap.ts` (already filters `BLOG_POSTS_DATA` by `published`).

`tsc --noEmit` clean, `ui_consistency_check.py --summary` PASS on both changes.

## ✅ (2026-08-03) — Found the real source of ongoing driver-applicant WhatsApp messages
User reported still getting driver-inquiry messages despite yesterday's driver-jobs page removal. Root cause: `/partners/driver-registration` (noindex, kept live deliberately for legitimate operational use) was still linked from **both** the site-wide Footer (all 3 languages) and the Navbar's `PARTNERS_MENU` dropdown ("Join our driver network") — visible on literally every page. This, not the removed SEO pages, was the actual leak.
- Removed the Navbar dropdown entry (`components/layout/Navbar.tsx` — `PARTNERS_MENU`, now just "Partner With Us" → `/partners`, the real B2B/hotels/corporate hub, which stays) and the 3 Footer language entries.
- Left `/partners/driver-registration` page itself live and reachable by direct URL (still noindex) — for any existing driver relationship that needs it — just no longer advertised to the general public.
- **Known limit, not fixable in code**: anyone who already has the WhatsApp number saved from an old listing/screenshot/job board can still message about driving — code can only stop *new* people from being invited to ask.

Also fixed, same session — homepage hero was still 100% generic/plain "taxi" language in English while Arabic/Urdu translations already said "Private VIP driver" / "luxury trip" (someone translated these well before, English was never brought in line):
- The actual `<h1>` was hardcoded with a 2-way `language === "ar" ? … : …` ternary — meaning **Urdu silently fell back to the English H1**, and the translation object's own `hero.title`/`hero.badge` fields were dead code, never rendered. Rewired the H1 to use `t.hero.title` — fixes the Urdu bug and the tone gap in one change.
- EN `hero.badge/title/subtitle/btnBook/badges` and the bottom `cta` block rewritten to match the tone AR/UR already had (dropped the unverifiable "#1 Rated"/"Best" superlatives too, same fabricated-trust-signal pattern already fixed elsewhere in this codebase).
- **Bug found + fixed**: AR/UR `hero.badges` arrays only had 3 items while the render code (from yesterday's badge redesign) unconditionally reads index 0–3 — 4th badge was rendering blank/undefined in Arabic and Urdu. Added the missing 4th badge to both.
- Verified live via `next dev` + curl: EN and AR `<h1>` both render the correct, different text; driver-registration link confirmed gone from rendered HTML; `/partners` (200) and `/partners/driver-registration` (200, just unlinked) both still reachable. `tsc --noEmit` clean, `ui_consistency_check.py --summary` PASS.

## ✅ (2026-08-02) — Deploy verified live + Phase 2/3 of locked strategy (WhatsApp tone + VIP keywords)

**Deploy check**: curled production (`taxisaudiarabia.com`) directly — homepage 200, `/driver-jobs/riyadh` correctly 301s to `/locations/riyadh`, schema `@type` array live, `/routes` hub OG tags show its own URL (not homepage's). All of today's earlier commits confirmed live, not just pushed.

**WhatsApp templates — VIP tone shift** (site-wide, high-visibility touchpoints only, per the locked "light-touch" scope — did not touch every page's individual WhatsApp template):
- `WhatsAppButton.tsx` (floating button, every page): pre-filled message "I want to book a taxi" → "I'd like to reserve a private chauffeur"; bubble text "Need a Quote?" → "Reserve Your Private Chauffeur"; hover tooltip "Book via WhatsApp 24/7" → "Reserve via WhatsApp 24/7".
- `ScrollCTA.tsx` (scroll-triggered popup, every page): "Need a quick price?" → "Reserve your private transfer".
- `home-page.tsx`: PriceCalculator WhatsApp label was still saying "Or book instantly on WhatsApp →" (an "instantly" overclaim the earlier response-time sweep missed — this block wasn't caught then) → "Or reserve directly via our VIP WhatsApp Desk →", matching the AR/UR versions which already said "VIP support desk" (Arabic/Urdu were already ahead of English here). Umrah section "Book Umrah Taxi on WhatsApp" → "Reserve Your Private Umrah Chauffeur on WhatsApp". Main CTA "Book on WhatsApp" → "Reserve on WhatsApp".

**VIP/private-hire keyword targeting** — honest note: there is no real ranking/click data to mine for this intent (Ahrefs' keyword tracker showed zero ranked keywords for all of July; GSC's real clicks were almost entirely job-search queries, now removed). So this is standard keyword research + reusing what's already proven on-site (chauffeur/private driver/executive terms), not data-mined — flagged so nobody mistakes it for a data-driven claim later.
- `services/vip-luxury`: title "VIP & Luxury Chauffeur Service" → "Private Driver & VIP Chauffeur Service | Riyadh, Jeddah" (55 chars); description and hero intro paragraph now explicitly say "private driver" + city names (Riyadh, Jeddah) instead of only "VIP transport... across the Kingdom".
- `services/corporate`: title "Corporate Taxi Accounts & B2B Transport" → "Executive Car Service & Corporate Chauffeur | Saudi Arabia" (58 chars); description reworded to lead with "Executive car service & corporate chauffeur" instead of "B2B transport solutions".
- Deliberately did **not** touch the homepage's own root title/description (`app/layout.tsx`) — it's the site's single highest-traffic, most-established page; swapping its primary "Taxi Service" keyword match for VIP framing is a bigger, more sensitive move than what was asked (light touch, don't risk the one page with real established signal). Flagged here as a decision point for a future session if the user wants to go further.

`tsc --noEmit` clean, `ui_consistency_check.py --summary` PASS.

**Not done yet**: AR/UR translations for the vip-luxury/corporate title changes (only EN metadata touched); a full page-by-page WhatsApp-template pass (only the highest-visibility, site-wide ones were done, per "don't change the whole site").

## 🎯 BUSINESS STRATEGY DECISION (2026-08-02) — VIP-first repositioning, light-touch scope
User + advisor discussion concluded: site repositions VIP/private-hire messaging first (not a full rebuild — "poori site nhi change krni", keep everything that already brings traffic). Locked decisions:
1. **Target customer**: VIP-first, general taxi/routes/services stay live as secondary (no removal of existing money pages).
2. **Driver-jobs pages REMOVED** — business doesn't recruit via these SEO pages (driver network already staffed). This was ~99% of the site's real organic clicks (Google Jobs rich results) — a deliberate, informed trade-off, not an oversight. See entry below for what was done.
3. **Car-recovery stays live as-is** — separate vertical, not cross-promoted from VIP pages, real revenue stream (family business), don't touch.
4. **Domain stays `taxisaudiarabia.com`** — no rename (same pattern as Blacklane/Addison Lee keeping "taxi"-adjacent names for a luxury brand). Reposition messaging/content only.
5. **Scope for "VIP-first"**: WhatsApp/CTA message-template tone shifts + add private-vehicle/VIP search-keyword content to *existing* relevant pages (vip-luxury, corporate, homepage) — no new page architecture, no UI redesign, no IA rebuild. Still pending, not yet started.

## ✅ (2026-08-02) — Removed driver-jobs/chauffeur-jobs/taxi-driver-jobs (54 pages), full redirect map
Per the strategy decision above. Deleted: `app/(marketing)/{driver-jobs,chauffeur-jobs,taxi-driver-jobs}/{page.tsx,[city]/page.tsx}` (6 files), `components/seo/DriverJobBody.tsx` + `DriverJobsHubBody.tsx`, `lib/data/driver-jobs.ts`, the now-dead `jobPostingSchema()` from `lib/schema.ts`. Removed all sitemap entries (`app/sitemap.ts`). Fixed a stale code-comment example in `RelatedLinks.tsx` that referenced the deleted routes.

**Redirect strategy (not a blanket redirect — reasoned per-city, added to `next.config.ts`)**: reused the exact city-mapping data that already existed in the deleted `DriverJobBody.tsx`'s `CITY_MONEY_LINKS` (built for a different purpose — cross-linking — but it was already the correct "what's the real relevant page for this city" map). 18 cities × 3 URL variants = 54 redirects:
- Cities with a real `/locations/[city]` page → redirect there (riyadh, jeddah, makkah, madinah, dammam, taif, abha, yanbu, khobar→alkhobar, dhahran→alkhobar, khamis-mushait→abha).
- Cities with only a `/services/car-recovery/[city]` page (no location page) → redirect there (tabuk, jubail).
- Cities with neither (buraidah, al-ahsa, hail, najran, al-qassim) → homepage.
- The 3 hub pages (`/driver-jobs`, `/chauffeur-jobs`, `/taxi-driver-jobs`) → `/services`.

**Deliberately did NOT** just swap the content on the same URLs (city considered this first) — explained why: rankings are query-intent-bound, not URL-bound. Repurposing e.g. `/driver-jobs/tabuk` into recovery content would've self-cannibalized against the already-live, already-optimized `/services/car-recovery/tabuk` — split authority, no benefit. A 301 to the real existing page consolidates signal into one canonical URL per topic instead.

**Verified, not assumed**: ran a live `next dev` server and curled every redirect type (location target, recovery target, homepage target, hub target) — all resolve 200 at the right destination. Also followed the `/ar/driver-jobs/riyadh` → (middleware, no `/ar` content) → `/driver-jobs/riyadh` → (new redirect) → `/locations/riyadh` two-hop chain end to end with `curl -L`, confirmed final 200. `tsc --noEmit` clean (had to `rm -rf .next` first — stale route-type-validator cache referenced the deleted pages and threw false errors). `ui_consistency_check.py --summary` PASS.

**Known, accepted trade-off**: this removes the site's current largest real organic-traffic source (~226 clicks/month via Google Jobs rich results, per GSC). This was a fully-informed business decision (not recruiting drivers, don't want the pages), not an SEO mistake — logged here so no future session "fixes" it back by re-adding job pages without checking this context first.

**Not yet done (next up per the locked strategy)**: WhatsApp/CTA message-template tone shift toward VIP language; add private-vehicle/VIP search-keyword content to existing pages (vip-luxury, corporate, homepage) — needs actual keyword research from GSC/Ahrefs data before writing copy, not guessed.
> Har session yahan update karo. Duplicate work se bachne ke liye pehle yeh file parho.
> Verify: `python scripts/ui_consistency_check.py --summary` (0 violations = us page ka UI theme done)
> Priority order: `../SITE-URLS-PRIORITY.md` (Tier 1 → 2 → 3 → 4)

## 🚧 IN PROGRESS (2026-08-01) — SEO continuation audit: verified prior agent's work + business-honesty pass

**Context:** working tree had uncommitted changes from a prior session (driver-jobs money-page cross-linking expansion to 18 cities, meta trims, `/guides` dead-code cleanup) plus 8 fresh unreviewed commits (hotel routes, recovery cities, hero trust badges + ScrollCTA popup, `llms.txt`/`llms-full.txt`/`ai-plugin.json` AI-discoverability files). Verified all of it against the codebase rather than trusting the diffs. Found and fixed:
- **Regression**: `fleet/[slug]` `generateMetadata` had dropped `alternates.canonical` and the length-checked `title` was no longer applied to the actual `<title>` (only to `og:title`) — restored both.
- **Contradiction**: `chauffeur-jobs` extraRequirements said "or drive our luxury fleet" — directly contradicts the site-wide rule (own vehicle required to apply). Fixed to "premium own vehicle."
- **Broken UX**: new `ScrollCTA.tsx` used `animate-slide-up` — class never existed in `globals.css`. Added the keyframe/utility (matches existing `fadeUp`/`fadeIn` pattern).
- **Dead fabricated data**: deleted unused `lib/data/inspiration.ts` — had zero imports anywhere, but still carried the old fabricated "50k+ Trips Completed" / "10+ Years in Service" stats that were already deliberately replaced site-wide (the live `lib/config/stats.ts` is honest, no trip counts). Resolves the old "Known Issue #1" (50k+ vs 5,000+ harmonization) by removing the zombie copy entirely.
- **Fake trust signals (real finding, Phase 3 business-logic review)**: `fleet/[slug]` and `/fleet` hub were rendering hardcoded fake star ratings (`vehicle.rating`/`vehicle.reviews`, e.g. "4.9 · 312 verified reviews") and a hardcoded 4-person `REVIEWS` array (fake named reviewers "Abdullah Al-Dosari," "Sarah M." etc., identical on all 14 vehicle pages) as if real — even though the code's own comment already flagged these as "fabricated numbers — schema.org violation risk" and had removed them from JSON-LD for that reason. The visible on-page UI still showed them to real users. Removed the display + the `REVIEWS` array + the `rating`/`reviews` fields from `lib/fleet-data.ts` entirely (was unused anywhere else). Add back only with real reviews.
- **Price mismatches** (same recurring bug class flagged 3× before in this ledger) in the brand-new `public/llms.txt` / `public/llms-full.txt` AI-knowledge files: Riyadh Airport→City sedan (150→100), Madinah Airport→Hotel sedan (120→80), Riyadh→Dammam sedan (750→699, matching `routes.ts` basePrice) + SUV recomputed via the established ×1.5 multiplier; fleet fare table had Toyota Hiace (100→280, 12→11 passengers) and Toyota Coaster (200→500, 25→17 passengers) rows scrambled, plus S-Class/V-Class off by one row. These files are fed directly to AI assistants (ChatGPT/Perplexity/Gemini) as "official" facts — errors here are worse than a normal page typo.
- **Response-time overpromise** (Phase 5, confirmed with user: real SLA is ~1-2 hours, not instant): site-wide "instant confirmation" / "fixed price in 1 min" / "confirms within minutes" language rewritten to "usually within 1-2 hours" across: `WhatsAppButton.tsx`, new `ScrollCTA.tsx`, `home-page.tsx` (EN+AR+UR: whyUs point, CTA trust badge, FAQ answer), root `app/layout.tsx` FAQPage JSON-LD (schema-level — shown directly to Google/AI, higher priority than page copy), `app/book/page.tsx` (EN+AR), `llms.txt`, `llms-full.txt`. **Left alone deliberately**: the `/services/intercity` "instant quote" line refers to the PriceCalculator tool itself (genuinely instant, client-side math, not a human reply) — not the same claim. Also left the car-recovery "call you back within minutes" lines untouched — that's a separate emergency-dispatch line, not confirmed to be the same 1-2hr SLA, and didn't want to guess.
- `tsc --noEmit` clean after all fixes.

**Not done / needs a decision before continuing:** the recovery-specific "reply within minutes" claims (`lib/data/recovery.ts`, `car-recovery` pages, `RecoveryLeadForm.tsx`) — need to confirm with user whether the recovery/tow-truck line is actually staffed for faster response than the general taxi line before touching those.

## 🚧 (2026-08-02) — Root cause of customer complaints found: footer "Driver Jobs" link + 28 sitewide price mismatches

User reported customers messaging confused about site content. Found two real causes:

**1. "Driver Jobs" was in the site-wide Footer "Company" column** (all 3 languages), listed on every single page right next to About/Fleet/Pricing/Contact — regular customers browsing the footer saw it and clicked/messaged about it. The job pages exist only for organic search traffic (people who Google "driver jobs riyadh" land directly on `/driver-jobs/riyadh` etc.) — they were never meant to be advertised in the main customer nav. Removed the footer link in EN/AR/UR (`components/layout/Footer.tsx`). `driver-jobs`/`chauffeur-jobs`/`taxi-driver-jobs` stay fully crawlable via `app/sitemap.ts` (unaffected), so no SEO/indexing loss — only stopped surfacing recruitment content to browsing customers.

**2. Sitewide price audit** (dispatched a research-only subagent to cross-check every hardcoded SAR mention against `lib/data/routes.ts` `basePrice` + the `app/(marketing)/routes/[slug]/page.tsx` SUV=×1.5/VAN=×1.35/LUXURY=×2.5 formula) found **28 confirmed mismatches** — this is the same recurring "hardcoded price drifts from canonical DB" bug class flagged 3× before, just never swept this broadly. Fixed all of them:
- `app/pricing/page.tsx` `FIXED_ROUTES` table — **every single row wrong**, completely disconnected from `routes.ts` and not even internally following the site's own multiplier convention (a 5th, never-audited copy of the same numbers, missed when the interactive calculator was fixed on 2026-07-27). All 4 routes × 3 vehicle classes recomputed from canonical `basePrice`.
- `app/(marketing)/services/airport-transfers/page.tsx`, `app/(marketing)/airports/[slug]/page.tsx` (JED→Makkah SAR 180→249, ×3 occurrences), `lib/data/subareas.ts` (Ajyad + Al Shubaikah, same JED fare), `app/(marketing)/locations/[city]/page.tsx` (7 FAQ answers: Makkah/Madinah/Jeddah/Riyadh/Taif city pages), `components/sections/home-page.tsx` (route cards + 2 category "From SAR X" floor-price cards that overstated the real minimum), `app/(marketing)/services/intercity/page.tsx`, `app/(marketing)/services/long-distance/page.tsx` (5 GCC/intercity rows), `app/(marketing)/services/border-crossings/page.tsx` (4 rows + removed a **fully fabricated "Saudi-Jordan / SAR 1,500" route — no such route exists anywhere in `ROUTES_DATA`, no evidence the business has ever served this crossing**, removed rather than assigning it a guessed price).
- Legacy SUV price for the flagship Jeddah-Airport→Makkah route: "SAR 349" (pre-dates the 2026-07-16 price update to basePrice 249) was still hardcoded in `app/layout.tsx` FAQ schema, `public/llms.txt`, `public/llms-full.txt`, and `home-page.tsx` FAQ — recomputed to SAR 374 (249×1.5) to match what the actual `/routes/jeddah-airport-to-makkah` page charges today.
- Found + fixed a **duplicate route slug**: `jeddah-airport-to-pullman-zamzam-makkah` was defined twice in `ROUTES_DATA` (an older thin entry + the richer one from the 2026-07-31 hotel-routes commit) — removed the older duplicate.
- Also fixed an internal Dammam-airport-transfer contradiction (locations pages said SAR 90, home-page route card said SAR 199 for the same trip with a different claimed distance) — standardized to SAR 100/35km, matching the Riyadh-airport-transfer pattern (no canonical `routes.ts` entry exists for this specific pair, so this is a best-estimate, not a verified figure — flag if the business has real pricing for it).
- `tsc --noEmit` and `ui_consistency_check.py --summary` both clean after all fixes.

**Still open:** none of this is committed to git yet pending final review — see git log for the actual commit once pushed. The Abha-airport-transfer "SAR 80" FAQ and the Private-Taxi/Corporate category floor prices ("From SAR 599"/"From SAR 799") were left as-is — no contradicting mention found elsewhere, treated as reasonable uncontested estimates rather than confirmed bugs.

**Committed and pushed** (commit `e625a44`, deployed via Vercel auto-deploy from `main`).

## ✅ (2026-08-02) — Full audit-report analysis (`SEO/audit 3/`) + 2 real bugs found and fixed

User provided a fresh folder of real GSC + Ahrefs exports (crawled/exported 26–31 Jul). Read every file before touching code (2 files — `saudieventmanagement.com-*` CSVs + one "site-explorer-overview" PDF — turned out to be for the user's *other* business, misfiled by the shared Ahrefs account; excluded). Full 10-part findings report delivered to user in-chat. Headline conclusion (reconfirms Day-9): technical health is 88/100 "Good", but Ahrefs' keyword tracker shows **zero ranked keywords all of July** — domain authority/backlinks remain the only lever that moves money-page rankings, not more on-page work.

Two genuinely new bugs found this pass (both root-caused before fixing, not patched page-by-page):
1. **Schema.org validation error on 257/263 pages (97%)** — root layout's `TaxiService` JSON-LD (fires on every page) mixed in LocalBusiness-only properties (`address`, `geo`, `telephone`, `openingHoursSpecification`, `priceRange`, `paymentAccepted`) that aren't valid on a bare `Service` type. Fixed: `"@type": "TaxiService"` → `"@type": ["TaxiService", "LocalBusiness"]` in `app/layout.tsx` (multi-type JSON-LD is spec-valid and grants both vocabularies).
2. **Wrong/missing OG tags** — verified live via `next dev` + curl (not guessed): `driver-jobs`/`chauffeur-jobs`/`taxi-driver-jobs`/`blog`/`routes` hubs + all 10 `car-recovery/[city]` pages had **no page-specific `openGraph` at all**, so they silently inherited the *homepage's* title/description/URL in social previews (confirmed by curling each and seeing `og:url: https://taxisaudiarabia.com` instead of their own path). Fixed by adding explicit `openGraph`+`twitter` blocks to all 6 files. Separately, `/locations` hub (which does use the shared `lib/seo.ts` helper) was missing `og:image` specifically — the helper's assumption that Next's file-based `opengraph-image.tsx` fallback "just applies" when no image is passed turned out to be unreliable for that route (verified: worked for `/faq`, silently didn't for `/locations`). Fixed at the source: `lib/seo.ts` now always sets an explicit `images: [.../opengraph-image]` instead of relying on implicit fallback — fixes every page using the shared helper, not just `/locations`.
3. Investigated 2 broken internal links Ahrefs flagged (`jeddah-airport-to-jeddah-city`, `jeddah-to-haramain-station` as targets) — both slugs exist correctly in current `routes.ts`/`generateStaticParams`, so this is the recurring un-guarded-Supabase-fetch-at-build-time bug (documented 3× already) causing a transient 404 for that one deploy; should self-heal on the next successful build. Not a code fix — flagged to re-verify post-deploy.
4. GSC "Review snippets" report showing 54 pages with "Invalid object type" — verified stale: grepped the whole codebase for any live `aggregateRating`/`Review` schema, found none (only removal-comments dated weeks earlier). GSC just hasn't had "Validate Fix" clicked, so it's still showing an old cached result — not a live bug, no code change needed, user action (one click in Search Console) would clear it.
5. `tsc --noEmit` clean, `ui_consistency_check.py --summary` PASS after fixes.

**Not done (lower priority, noted in report, not yet actioned):** 207-page OG gap is now down to the harder-to-verify remainder (need a fresh Ahrefs crawl to see the real post-fix count); meta-description/title-too-long growth on the newest content batch (hotel routes, recovery cities, Ziyarat pages) not yet trimmed; 1 redirect chain and 2 4XX-in-sitemap entries not yet identified by exact URL (no fresh crawl-log was cheap to fully parse this session — flagged for next crawl).

**Committed and pushed** (commit `ccf6dbc`, deployed via Vercel auto-deploy).

## ✅ (2026-08-02, same day) — Worked through remaining report recommendations

- **Meta title/description length, newest content batch**: verified programmatically (not by eye) — `taif-ziyarat`, `badr-ziyarat`, `hotel-transfers`, `long-distance` all had both title (74-76 chars) and description (166-181 chars) over Google's practical limits. Trimmed all 4 to 46-54 char titles / 146-156 char descriptions. Also found the shared `routes/[slug]` `generateMetadata` description had **no length cap at all** (unlike its title, which already had a >55-char guard) — added `.slice(0, 160)`, verified against the worst-case hotel-name route (`jeddah-airport-to-movenpick-makkah`, fromCity/toCity produce a 136-char description, safely under cap). Checked the 10 recovery-city pages too — already within limits, no change needed there.
- **Redirect chain (Ahrefs, 1 new)**: root-caused, not fixed — `/ar/locations/dammam/al-khobar` → (middleware, no `/ar` content for this path) → `/locations/dammam/al-khobar` → (next.config.ts dedupe redirect) → `/locations/alkhobar`. A real 2-hop chain, but on a subarea URL already removed from the sitemap/internal links back on Day 9 — nobody currently links to it, so left alone rather than adding middleware special-casing for a dead URL. If Ahrefs still flags it after a fresh crawl, worth revisiting.
- **4XX pages in sitemap (Ahrefs, 2)**: checked `app/sitemap.ts` directly for the known stale-URL candidates (old `/guides?id=` params, the duplicate `jeddah-airport-to-pullman-zamzam-makkah` slug, the deprecated `dammam/al-khobar` subarea) — none present. Likely already resolved by the duplicate-slug fix in `e625a44`, or was the same recurring DB-fetch-flake causing a transient build-time 404 (self-healing). Couldn't pin the exact 2 URLs without a fresh crawl — not guessed at further.
- `tsc --noEmit` clean, `ui_consistency_check.py --summary` PASS.

**Genuinely can't be done from code / needs the user directly:**
1. **Backlinks / GBP citations** — the one lever every audit since Day 9 has converged on; requires actual outreach/listing creation, not a code change (see `OFFPAGE-ASSETS.md`).
2. **Fresh Ahrefs crawl** — needed to confirm the real post-fix OG/schema/orphan-page counts; requires the user's Ahrefs account.
3. **GSC "Validate Fix" click** on the Review-snippets report — one click in Search Console clears a stale cached error; can't be done from the codebase.

Committed and pushed (commit `1400dba`).

## 🚧 (2026-07-25) — Money Pages ranking plan, revised to 8 chunks after fresh GSC/Ahrefs audit
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
