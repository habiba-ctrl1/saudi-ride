# Money Pages SEO Strategy — taxisaudiarabia.com

**Date:** 2026-07-25
**Goal:** Stop optimizing for driver-jobs traffic (already have enough drivers) and get routes/services/locations pages ranking so real customers (leads/bookings) find the site.
**Sources used:** GSC Coverage + Performance-on-Search exports (2026-07-23), Screaming Frog crawl (`SEO/*.csv`), live codebase (`app/(marketing)/...`), competitor reference site `ksa-reference/taxiserviceksa-main`.
**Note on Ahrefs PDFs:** `ahref reports/new ahref*.pdf` and `ahref report.pdf` are image/screenshot exports with no text layer, and this machine has no PDF-to-image tool (`pdftoppm`) installed, so they could not be read. Numbers below come from GSC + Screaming Frog instead, which is actually more precise (per-URL, not just category counts). **For future audits: in Ahrefs, use the CSV/"Export" button on each Site Audit issue instead of "Print to PDF"** — CSV can be read directly and gives exact URLs, not just screenshots.

---

## 0. Do this FIRST — a fix for the #1 problem is already sitting on disk, unshipped

Before anything else in this report: `SEO-WORK-LOG.md` and `git status` show that a fix for the **`/ar` duplicate-content bug** — the leading suspected cause of the "151 pages Discovered — currently not indexed" problem — was finished, verified (`tsc --noEmit` clean, tested via raw `curl` SSR output), and written to disk on **2026-07-20**. It has never been committed or deployed. Five days of no benefit from a completed fix.

What it fixes: `/ar/*` used to serve a byte-identical English clone of ~140+ pages (client-side-only language switch meant the server always rendered English). Google was very likely treating this as a large duplicate-content footprint across the whole site, which drags down trust for every page, including money pages. The fix makes only the 6 pages with real Arabic content live under `/ar/`, and 301-redirects everything else instead of duplicating it.

A second, unrelated, also-finished improvement is sitting in the same uncommitted tree: `locations/[city]/page.tsx` now attaches real `GeoCoordinates` and `speakableSchema` to every city page's structured data — a concrete win for local/voice search that this report would otherwise have recommended from scratch.

**Verified just now (2026-07-25): the full working tree still compiles clean (`npx tsc --noEmit` → zero errors).** This is not a proposal — it's finished work waiting for a `git commit` + push to `main` (Vercel auto-deploys). Re-verify locally with `next dev` if it's been a few days since the original test, then ship it before starting anything in §7. Nothing else in this report will show results if Google is still crawling the pre-fix code.

---

## 1. Executive summary

- **The traffic you have is the wrong traffic.** Every single click in the last 90 days came from `driver-jobs` / `chauffeur-jobs` / `taxi-driver-jobs` pages (positions #1-9, thanks to the JobPosting rich-result and near-zero competition for those job-search terms). Every money-page query (taxi routes, city taxi service, ziyarat, airport transfer) has **zero clicks**, because none of them rank on page 1 — most sit at position 40-99 (page 4 and beyond).
- **This is not a "tweak the meta tags" problem — it's mainly an authority problem**, same conclusion as the Day-9 audit, now confirmed with fresh data: `/routes/jeddah-to-madinah` (a flagship route, 23 impressions) sits at position **84.7**. `/services/makkah-ziyarat` sits at **96.7**. These aren't page-2 problems, they're "Google barely trusts this domain for these terms yet" problems.
- **151 pages are still "Discovered — currently not indexed"** and 7 are "Crawled — currently not indexed" (Google visited and chose not to index). Google is rationing how much of the site it bothers to fully process — classic symptom of low domain authority + thin/duplicate signals, not a technical crawl blocker.
- **On-page issues flagged in the last Ahrefs audit are still open.** 84 pages have meta descriptions over 160 characters (was 88) and 77 pages have titles wide enough to truncate in search results (was 72). The Day 1-9 sprint fixed speed/canonicals/schema/internal-linking but did not touch title/meta length — these are template-level, so one code fix resolves dozens of pages.
- **There are real, findable content and feature gaps vs. the competitor** (hotel-to-hotel routes, a fare calculator, Urdu-language pages, public reviews) that are cheap to close and target exactly the customer-intent keywords you're missing.

**Bottom line:** keep doing authority-building (it's the ceiling), but there are still concrete on-page and content fixes sitting on the table that cost nothing but time — do those in parallel, prioritized below.

---

## 2. What's already fixed — leave alone

From the Day 1-9 sprint (`SEO-WORK-LOG.md`) and confirmed still intact in this audit:
- Route speed fix, canonical tags, hreflang, JSON-LD schema cleanup on the core templates.
- Internal linking for the 33 sub-areas, 8 airports, and 2 services that were previously orphaned.
- `routes/[slug]` and `locations/[city]` templates already carry `FAQPage`, `BreadcrumbList`, and `TouristTrip`/relevant schema — don't re-add these.
- `AggregateRating`/testimonial schema already exists on `locations/[city]`, `services/umrah-transport`, and `fleet/[slug]` — don't duplicate it there.
- Driver-jobs pages are working exactly as intended (rich results, #1-9 rankings) — do not change their titles/schema/structure while chasing money-page fixes; they're not the problem.

---

## 3. Striking-distance opportunities (closest to page 1 right now)

From `Performance-on-Search → Pages.csv`, ranked by how close they are to breaking through — these deserve attention **first** because they need the smallest push:

| Page | Position | Impressions | Notes |
|---|---|---|---|
| `/locations/neom` | **15.1** | 21 | Page 2, top of it. Closest money page to page 1 on the whole site. |
| `/routes/dammam-to-doha` | **27.3** | 21 | Cross-border route, page 3. |
| `/blog/complete-miqat-locations-guide-umrah-pilgrims` | **28.9** | 14 | Informational, good link-bait potential to the ziyarat/umrah service pages. |
| `/driver-jobs` (hub page) | 33.9 | 8 | Not a money page, but the hub links to money pages — worth a look. |
| `/routes/riyadh-to-makkah` | 39.8 | 12 | Highest-intent generic route query. |
| `/routes/dammam-to-doha` (query: "dammam to doha") | 39.8 | 6 | Matches page above. |
| `/routes` (index) | 50.75 | 20 | The routes hub itself — worth strengthening since it's the internal-linking spine for every route page. |
| `/routes/riyadh-to-dubai` | 51.5 | 4 | |
| `/routes/riyadh-to-dammam` | 58.4 | 7 | |

Everything else is position 60+. **Quick-win priority: `/locations/neom`, `/routes/dammam-to-doha`, and the `/routes` hub page** — these are the only three within realistic reach of page 1-2 without a big authority jump. Beef up content depth, internal links pointing to them, and check for any on-page issue (see §4) on exactly these three first.

---

## 4. Technical / on-page gaps still open

All numbers are from the live Screaming Frog crawl (`SEO/page_titles_all.csv`, `SEO/meta_description_all.csv`), so these are today's reality, not last month's.

- **77 pages have title tags ≥600px wide** (Google truncates around 580-600px on desktop). This is a **template problem, not a per-page problem** — it's concentrated in three template families:
  - `fleet/[slug]` (e.g. `/fleet/toyota-coaster`, `/fleet/genesis-g80`) — pattern `"{Car} Taxi Saudi Arabia | {Description} | Taxi Saudi Arabia"` repeats the brand name twice.
  - `chauffeur-jobs/[city]` and `driver-jobs/[city]` — long but low priority since these already rank #1-2 anyway (no competition for job-search terms, truncation isn't costing clicks there).
  - `blog/[slug]` guides — several run 85-100 characters (e.g. `car-breakdown-saudi-highway-guide` at 102 chars/933px).
  - **Fix once at the template level**: drop the trailing `" | Taxi Saudi Arabia"` when the title is already long, or shorten it to `" | TaxiKSA"` — recovers ~77 pages in one code change.
- **84 pages have meta descriptions over 160 characters**, several over 185 (e.g. `/pricing` at 187 chars, `/terms-conditions` at 186 chars) — these get cut off mid-sentence in the snippet, often losing the call-to-action at the end.
- **Near-duplicate meta descriptions across the entire `locations/[city]` template**: every city page uses "Book a fixed-price taxi in {City}, Saudi Arabia — airport transfers, Umrah rides, and 24/7 intercity trips with licensed drivers. No surge, instant quote." with only the city name swapped. Not technically a Search Console "duplicate content" error, but it signals thin per-city differentiation to Google and gives users no reason to pick one city result over another in a multi-city search. Needs at least one city-specific sentence per page (a landmark, a distance, a local price anchor).
- **151 "Discovered — currently not indexed" + 7 "Crawled — currently not indexed"** (GSC Coverage, unchanged category-wise from Day-9 baseline). No new critical crawl errors — no 404s or broken canonicals blocking these pages technically. This confirms it's an authority/priority queue issue on Google's side, not something more code can fix directly.

---

## 5. Content/semantic gaps vs. competitor (ksa-reference)

Comparing `taxisaudiarabia.com` structure against the reference competitor site page-by-page:

1. **Hotel-to-hotel route pages — you don't have this pattern at all.** Competitor has dedicated pages like `/jeddah-to-fairmont-makkah`, `/jeddah-to-pullman-makkah`, `/jeddah-to-swissotel-makkah`. Pilgrims and tourists search exactly this phrase ("taxi jeddah to [hotel name] makkah") when they've already booked a hotel — extremely high commercial intent, very low keyword competition since it's ultra-specific. Your `routes/[slug]` template already exists — this is "add more slugs using the same template," not new engineering. Start with the 5-10 most-booked hotels in Makkah/Madinah near the Haram.
2. **No fare calculator.** Competitor has `/calculator` — an interactive tool. Interactive utility pages get more backlinks, more time-on-site, and more repeat visits than static content, all of which help authority. You already have the pricing logic (`/pricing` page) — turning it into an interactive "enter your route, get an instant estimate" tool reuses that data.
3. **No Urdu-language pages.** Competitor has `/ur/` alongside `/ar/` (full sitemap: `sitemap-ur.xml`). Urdu-speaking pilgrims (Pakistan/India) are one of the largest Umrah source markets and are currently completely unaddressed on your site outside of English/Arabic. This is a large addressable audience with essentially no competition from local KSA operators who only do EN/AR.
4. **Reviews are collected but not shown publicly.** You have a review pipeline (`api/bookings/[id]/review`, `api/admin/reviews`) but no public testimonials/reviews page with `Review`/`AggregateRating` schema surfaced site-wide the way competitor does. You already generate `AggregateRating` schema on `locations`, `umrah-transport`, and `fleet` pages — but the underlying real review content isn't visible to a visitor or to Google as crawlable text, which weakens the trust signal. Publish actual review snippets (even 10-15 real ones) somewhere crawlable, not just structured data with no visible backing content — Google increasingly checks for that match.
5. **`routes/[slug]` template is missing the trust-signal block** (`AggregateRating`/testimonials) that `locations`, `umrah-transport`, and `fleet` templates already have. Since routes pages are your worst-performing money pages (positions 85-97), this is the one template most in need of the trust signals your other templates already carry — cheap to add since the component presumably already exists elsewhere in the codebase.
6. **No interactive map.** Lower priority than the above, but competitor's `/map` page is another engagement/link-magnet page you don't have an equivalent of.

---

## 6. Authority/backlink gap

This remains the dominant blocker and was already correctly identified in the Day-9 audit — restating it concretely with today's numbers: a route page with 23 impressions sitting at position 85 isn't an on-page problem, it's Google not yet trusting the domain enough to rank it competitively for a term with any real search volume. On-page fixes (§4) and content gaps (§5) will help pages that are already in "striking distance" (§3) but won't move a position-85 page to page 1 by themselves.

What building authority looks like in practice, ranked by cost/effort for a business this size:
- **Local citations first (cheapest, fastest):** Google Business Profile listings for each city you serve (Riyadh, Jeddah, Dammam, Madinah, etc.), consistent NAP (Name/Address/Phone) across them, and local directories relevant to Saudi tourism/transport. This is the single highest-leverage authority action available with near-zero cost.
- **Partnership/guest-content links from Umrah/Hajj travel agencies, hotels near the Haram, and pilgrim-focused blogs/forums** — a handful of relevant links from sites already trusted for Umrah-related content will move the needle more than volume from unrelated sites.
- **Digital PR angle already exists in the competitor's repo** (`digital-pr-assets` folder) — worth understanding what kind of linkable asset that is (likely a data-driven story, e.g. "average taxi fares across Saudi cities 2026" or similar) since journalists/bloggers link to genuinely useful data tools, not sales pages. The fare calculator (§5.2) doubles as this kind of linkable asset.
- **Avoid low-quality/paid link schemes** — for a new domain, a handful of bad links can do more damage than no links; Google's spam systems are aggressive on manipulative link patterns, and it's not reversible easily.

---

## 7. Prioritized action plan

### Quick wins (this week — code/content only, no waiting on Google)
0. **Commit and deploy the `/ar` duplicate-content fix + location schema enrichment that's already finished on disk (§0). Do this before anything else below.**
1. Fix the title-tag template for `fleet/[slug]` and `blog/[slug]` to stay under ~580px (drop redundant brand repetition) — recovers ~77 pages.
2. Trim the ~84 meta descriptions over 160 characters, starting with `/pricing`, `/terms-conditions`, and every `routes/[slug]` page (these are money pages, prioritize them over blog/legal pages).
3. Add one unique, city-specific sentence to each `locations/[city]` meta description (landmark, distance to airport, or a local price anchor) to break the template duplication.
4. Add the `AggregateRating`/testimonial block to `routes/[slug]` (component already exists on other templates — reuse it).
5. Strengthen `/locations/neom`, `/routes/dammam-to-doha`, and the `/routes` hub specifically — these three are within real reach of page 1-2 right now (§3). Add more internal links pointing to them from relevant blog posts and the homepage.

### Medium-term (next 2-4 weeks)
6. Build 5-10 hotel-to-hotel route pages (`/routes/jeddah-to-[hotel]-makkah` pattern) targeting the top hotels near Masjid al-Haram/Masjid an-Nabawi — reuses the existing `routes/[slug]` template.
7. Turn `/pricing` into an interactive fare calculator (route + vehicle type → instant estimate) — reuses existing pricing data, becomes a link-magnet.
8. Publish real, visible customer reviews/testimonials on a dedicated page (or embedded across service/location pages) backing the `AggregateRating` schema that already exists — not just structured data with no visible content behind it.
9. Set up Google Business Profile listings for every city currently served, with consistent NAP.

### Long-term (1-3 months)
10. Build out Urdu-language pages (`/ur/`) for the highest-traffic templates (homepage, top routes, top services) — new, largely uncontested audience segment.
11. Pursue a handful of relevant backlinks from Umrah travel agencies, pilgrim forums, or hotels near the Haram — quality over quantity.
12. Revisit GSC Coverage numbers monthly — watch the "Discovered — currently not indexed" count (151 now) trend down as authority and content depth improve; if it doesn't move after the above is live for 4-6 weeks, that's the signal to invest more directly in backlinks rather than more on-page work.

---

## What to send next time for a faster audit
Export Ahrefs Site Audit issues as **CSV** (not "Print to PDF") — each issue category in Ahrefs has a small export/download icon that gives a CSV with exact URLs, which can be read directly instead of needing image analysis tools this machine doesn't have installed.
