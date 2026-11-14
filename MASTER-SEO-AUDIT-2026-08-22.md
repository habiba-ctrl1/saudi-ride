# TaxiSaudiArabia.com — MASTER SEO / CRO / GEO AUDIT & ACTION PLAN
**Date:** 2026-08-22
**Prepared as:** Senior SEO strategist + technical auditor + CRO + topical-authority + GEO consultant
**Objective:** WEBSITE → QUALIFIED VISITOR → WHATSAPP → GENUINE INQUIRY → BOOKING → REVENUE
**Status:** AUDIT ONLY. No code changed. Implementation waits for approval, then runs in ~10-URL batches.

**Evidence base used:**
- GSC 7-day/24h report (2026-08-18): Queries, Pages, Countries, Devices, Coverage drilldown
- GSC 3-month performance (audit 3, 2026-07-31): Queries, Pages
- Ahrefs organic-keywords history (2026-07-31)
- Live codebase: `app/`, `lib/data/*`, `app/sitemap.ts`, `app/robots.ts`, `lib/config/contact.ts`, route/service page templates

---

## 1. EXECUTIVE DIAGNOSIS — What is actually blocking leads

The site is **not** failing on content quality, page templates, CRO, or the WhatsApp path. Those are genuinely good (see §11). It is failing on **two structural things**, and everything else is secondary:

**BLOCKER 1 — The commercial money inventory is not indexed / not ranking.**
The GSC Coverage drilldown (2026-08-18) lists ~100 URLs as *Discovered/Crawled – currently not indexed* (last-crawled `1970-01-01` = never truly indexed). Among them are the exact pages the business wants leads from:
- `services/vip-luxury`, `services/corporate`, `services/business-executive` — **the premium/B2B pages are invisible.**
- Airports: `king-abdulaziz-jeddah`, `king-khalid-riyadh` — the two biggest airports, not indexed.
- Fleet detail pages: `mercedes-s-class`, `cadillac-escalade`, `gmc-yukon-xl`, `hyundai-staria` etc. — the "luxury vehicle with driver" proof, not indexed.
- Dozens of routes: `riyadh-to-madinah`, `makkah-to-jeddah`, `jeddah-to-riyadh`, `dammam-airport-to-jubail`, `jeddah-airport-to-kaec`, etc.
The pages that *are* indexed mostly rank **position 30–100** (page 3–10) for commercial queries → structurally impossible to earn clicks.

**BLOCKER 2 — The historical "traffic" was job-seekers, and it's gone.**
The 3-month top pages are dominated by `driver-jobs/*` and `chauffeur-jobs/*` (Riyadh 52 clicks, Dammam 38, Khobar 31…). Those are **people looking for employment, not transportation customers** — zero commercial value. Those page directories are now **deleted** from the codebase. Result: the 7-day window shows only **3 total clicks / ~215 impressions**. The site looks like it "had traffic," but it never had *commercial* traffic.

**Underlying cause of both:** near-zero domain authority (Ahrefs shows **0 tracked organic keywords**) combined with a **large thin programmatic footprint** (76 routes + subareas + fleet + guides + services ≈ 200+ URLs). A no-authority domain cannot get 200 pages indexed; Google indexes a fraction and the crawl equity is diluted across low-value pages instead of concentrated on the ~15 pages that could actually convert.

**Therefore the strategy is NOT "more pages."** It is: **concentrate crawl equity + internal links + a handful of authority signals onto a tight set of already-near-page-1 commercial money pages, get the premium/airport/route inventory indexed, and push the pages sitting at position 6–12 into positions 1–5 where clicks actually happen.** Evidence shows several are already there (see §5).

---

## 2. BUSINESS MODEL UNDERSTANDING
Remote-operated Saudi private-transportation lead-gen + coordination business. Revenue path is WhatsApp inquiry → manual quote → booking → coordinate driver/partner. No automated pricing (quotes are WhatsApp-only, confirmed in code + memory). Primary number `966539388072`. Recovery/satha is a parallel sub-business (Dammam, bhai's truck) routed to the same WhatsApp for lead intake, with a direct-call number for the driver. Commercial priorities in rough value order: cross-border & premium intercity > airport transfers > VIP/corporate/executive > Umrah/ziyarat transport > event transport > standard intercity/city taxi (kept, not chased).

---

## 3. CURRENT SEO STATE (evidence snapshot)
| Signal | Value | Meaning |
|---|---|---|
| 7-day clicks | 3 | Commercial traffic ≈ zero |
| 7-day impressions | ~215 | Pages surface but rank too low to click |
| Ahrefs tracked keywords | 0 | Negligible external authority / backlinks |
| ~URLs not indexed | ~100 | Money inventory invisible |
| Best commercial positions | 5–12 (a few) | Real, protectable near-page-1 assets exist |
| Historical clicks | Job-seekers (now deleted) | Vanity; ignore for strategy |
| Robots/sitemap | Well-built, AI crawlers allowed | Technical foundation is sound |
| Money-page templates | High quality (schema, FAQ, speakable, WhatsApp prefill) | Not the bottleneck |

---

## 4. GSC QUERY → PAGE → INTENT ANALYSIS (commercial queries only; jobs excluded)

Intent key: **F**=intercity private · **E**=airport · **B**=premium/VIP · **D**=corporate · **I**=Umrah/pilgrim · **H**=tourism · **F+**=cross-border (highest value)

| Query | Best URL | Imp (3mo/7d) | Pos | Intent | Value | Action |
|---|---|---|---|---|---|---|
| riyadh to dammam taxi (+price/one-way) | routes/riyadh-to-dammam | 26 / 3 | **8** | F | High | **PUSH** — near page 1, flagship |
| dammam to doha / dammam to qatar | routes/dammam-to-doha | 38 / 15 | **9** | F+ | Very high | **PUSH** — already earns clicks |
| riyadh to dubai (car with driver) | routes/riyadh-to-dubai | 4 | 21 | F+/B | Very high | **PUSH** — premium cross-border |
| riyadh to doha | routes/riyadh-to-doha | 6 | 6–8 | F+ | High | **PUSH** |
| madinah to alula | routes/madinah-to-alula | 4 | **5** | H/F | High (AlUla premium) | PROTECT + push |
| jeddah airport to makkah (+fare/cost/cheap) | routes/jeddah-airport-to-makkah | 13 | 80–90 | E/I | Very high volume | **INDEX+AUTH** — huge demand, ranks nowhere |
| makkah to madinah taxi | routes/makkah-to-madinah | 22 | 57–82 | I | High | INDEX+AUTH |
| jeddah to madinah taxi (cost/price) | routes/jeddah-to-madinah | 11 | 76–92 | I | High | INDEX+AUTH |
| jeddah chauffeur service / chauffeur jeddah | locations/jeddah or services/vip-luxury | 2 | 68 | B/C | Very high | **BUILD** chauffeur intent (see §12) |
| airport transfers saudi arabia | services/airport-transfers | 20 | 77–89 | E | High | INDEX+AUTH + metadata |
| umrah transport / umrah airport transfer | services/umrah-transport | 10 | 84–98 | I | High | INDEX+AUTH |
| satha riyadh / satha dammam / satha price ksa | services/car-recovery/* | 9 | 6–10 | recovery | Medium (sub-biz) | PROTECT (recovery cluster working) |
| jeddah to kaec | routes/jeddah-to-kaec | 13 | 10–11 | F | Medium | PUSH |
| madinah to jeddah airport | routes/madinah-to-jeddah-airport | 3 | 65 | E/I | Medium | Index/improve |

**Reading:** two tiers. **Tier A** (positions 5–12, already close): riyadh-to-dammam, dammam-to-doha, riyadh-to-dubai, riyadh-to-doha, madinah-to-alula, jeddah-to-kaec. These convert with a small push. **Tier B** (high-demand pilgrim/airport queries stuck at 55–100): jeddah-airport-to-makkah, makkah-to-madinah, jeddah-to-madinah, airport-transfers, umrah-transport — big volume but blocked by indexing + authority, not by content.

Job/irrelevant queries (`driver jobs *`, `أنا سائق`, `okay got it`, `zain vs stc`) → **do not optimize for these.**

---

## 5. TOP MONEY-PAGE OPPORTUNITIES (prioritized)

| # | URL | Pos | Intent | Why it's the opportunity | Priority |
|---|---|---|---|---|---|
| 1 | routes/dammam-to-doha | 9 | Cross-border | Only page reliably earning clicks; high-margin cross-border | **P0 MONEY NOW** |
| 2 | routes/riyadh-to-dammam | 8 | Intercity flagship | Most impressions of any route; "taxi/price" cluster | **P0 MONEY NOW** |
| 3 | routes/riyadh-to-dubai | 21 | Cross-border premium | "car with driver riyadh to dubai" = premium intent | P1 MONEY OPP |
| 4 | routes/riyadh-to-doha | 6–8 | Cross-border | Already near top | P1 MONEY OPP |
| 5 | routes/madinah-to-alula | 5 | Tourism premium | AlUla = luxury tourism; near top | P1 PROTECT+ |
| 6 | routes/jeddah-airport-to-makkah | 83 | Airport/Umrah | Highest real demand on the site; unlock = biggest upside | **P1 (needs index+auth)** |
| 7 | services/airport-transfers | 80 | Airport pillar | Pillar page ranking too low; index + internal links | P1 |
| 8 | routes/makkah-to-madinah | 57 | Umrah pillar route | High volume; index + push | P1 |
| 9 | services/vip-luxury | not indexed | Premium pillar | Business's core premium page — invisible | **P0 INDEX** |
| 10 | services/corporate + business-executive | not indexed | B2B pillar | B2B revenue page — invisible | **P0 INDEX** |
| 11 | locations/jeddah (chauffeur) | 65 | Chauffeur/city | "jeddah chauffeur service" demand exists | P2 |
| 12 | routes/jeddah-to-kaec | 10 | Intercity | Near page 1 | P2 |

---

## 6. PAGES TO PROTECT — NO UNNECESSARY CHANGES
These are healthy or near-healthy. Do **not** rewrite, re-slug, or re-metadata them without a specific reason:
- `routes/dammam-to-doha` — **PROTECT** (only click-earner; touch only to strengthen, never restructure)
- `routes/riyadh-to-dammam` — **PROTECT** (best impressions)
- `routes/madinah-to-alula` (pos 5), `routes/madinah-to-tabuk` (pos 1), `routes/riyadh-to-doha` (pos 6)
- `locations/alkhobar` (pos 8.75), `locations/abha` (earned a click)
- `blog/car-towing-cost-saudi-arabia-2026` (pos 2–3), `blog/car-breakdown-saudi-highway-guide` (pos 6) — recovery cluster working
- `guides/saudi-riyal-pilgrim-guide` (pos 9.5), `blog/riyadh-to-diriyah-visitor-transport-guide` (pos 6)
- `services/car-recovery/*` cluster (satha queries pos 6–10) — **PROTECT** the whole recovery sub-site
- `robots.ts`, `sitemap.ts`, `lib/config/contact.ts`, route/service page templates, WhatsApp CTA — **PROTECT** (well-built)

---

## 7. INDEXING PROBLEMS (the #1 revenue lever)
~100 URLs not indexed. Do **not** try to force-index all of them — many *should* stay thin/deprioritized. Triage:

**P0 — force-index (money pages wrongly excluded):**
`services/vip-luxury`, `services/corporate`, `services/business-executive`, `airports/king-abdulaziz-jeddah`, `airports/king-khalid-riyadh`, `fleet/mercedes-s-class`, `fleet/toyota-hiace`(indexed) → index the premium fleet pages, `routes/riyadh-to-madinah`, `routes/makkah-to-jeddah`, `routes/jeddah-to-riyadh`, `routes/jeddah-airport-to-kaec`.
*Levers (no new pages):* add contextual internal links from indexed/ranking pages → these; ensure each is in sitemap (most are); strengthen unique content signals; submit via GSC after batch.

**P2 — low priority, let Google decide:** most `locations/[city]/[subarea]` pages (Jeddah/Makkah/Madinah micro-areas), niche routes (`tabuk-to-aqaba`, `taif-to-albaha`), thin guides. These dilute crawl budget. **Candidate for consolidation or `noindex`** if they stay unindexed after money pages are fixed.

**Root cause is authority, not tags** — there is no evidence of accidental `noindex` on money pages; the exclusions are "discovered/crawled – not indexed" = Google judging them low-value. The fix is internal-link equity + external authority (§19), not meta changes.

---

## 8. TECHNICAL SEO PROBLEMS
Foundation is sound. Confirmed-good: clean `robots.ts` (AI crawlers explicitly allowed = GEO win), data-driven `sitemap.ts` auto-including routes/locations/airports/fleet/guides, `/ar/*` 301→English except real Arabic pages (no thin-duplicate risk), `/book`/`/track-booking`/driver-registration correctly noindex, high-quality schema on route pages (Service + FAQ + speakable + breadcrumb).

Issues to verify in Batch 0 (only if they touch money pages):
- **Crawl-budget dilution** from ~200 URLs on a 0-authority domain → the real technical problem. Fix by trimming/deprioritizing thin subareas, not by adding pages.
- **Fleet/airport/premium-service pages not indexed** — verify each renders unique content + has internal links pointing in (thin/orphan is the likely cause).
- Confirm no money page accidentally excluded by canonical pointing elsewhere.
- Verify `/taxi-driver-jobs/*` (still crawled in 7-day data though dirs deleted) now return 410/301 cleanly so dead job URLs stop wasting crawl budget.

Classification: crawl dilution = **P0** (affects money-page indexing). Dead job URLs = **P1**. Thin subareas = **P2**.

---

## 9. INTERNAL LINKING / TOPICAL-AUTHORITY GAPS
The programmatic pages exist but are weakly interlinked → orphan-like → not indexed. Priorities (contextual, natural anchors only — no "click here" spam):

- **Airport pillar cluster:** `services/airport-transfers` ↔ `airports/king-abdulaziz-jeddah` ↔ `routes/jeddah-airport-to-makkah` ↔ `services/umrah-transport`. Currently disconnected; this cluster owns the biggest demand.
- **Premium cluster:** `services/vip-luxury` ↔ `fleet/mercedes-s-class`/`cadillac-escalade` ↔ `services/business-executive`/`corporate` ↔ premium routes (`riyadh-to-dubai`, `madinah-to-alula`). Build this to make premium indexable + authoritative.
- **Cross-border cluster:** `routes/dammam-to-doha` ↔ `routes/riyadh-to-doha` ↔ `routes/riyadh-to-dubai` ↔ `services/border-crossings`. Link the earner to its siblings to spread equity.
- **Umrah/pilgrim cluster:** `services/umrah-transport` ↔ `routes/jeddah-airport-to-makkah` ↔ `routes/makkah-to-madinah` ↔ pilgrim guides (already ranking) — pass guide authority into money routes.

Cannibalization check: `routes/jeddah-airport-to-makkah` vs `blog/jeddah-to-madinah-taxi-guide` vs `guides/jeddah-airport-to-makkah-guide` — three URLs on overlapping intent. Decide one canonical money page per intent; blogs/guides link **to** it, don't compete.

---

## 10. COMPETITOR GAP ANALYSIS (iyeloplus, sauditaxi.cab, taxiserviceksa)
*Structural read — validate live during Batch 4.*
| | Competitors typically have | We have | Adopt? |
|---|---|---|---|
| Fleet with photos + capacity | Yes, prominent | Yes (better templates) | Already ahead — just index them |
| VIP/chauffeur landing pages | Yes | Yes but **not indexed** | Fix indexing, not build |
| Airport-transfer hub | Yes, strong | Yes but ranks low | Push |
| Fixed price tables | Often | No (WhatsApp-only by design) | **Do NOT copy** — quote model is deliberate |
| Trust (reviews, WhatsApp) | Some | WhatsApp strong | Add *genuine* trust signals only |
| Arabic site | Usually full | Minimal | Selective Arabic (§13) |
**We are already better at:** page-template depth, schema, GEO/AI-crawler readiness, honest no-surge quote positioning. **Don't copy:** fake reviews, fabricated fleet counts, fixed-price tables that break the quote model, keyword-stuffed doorway pages.

---

## 11. UX / CRO / WHATSAPP ANALYSIS
**Strengths (PROTECT):** WhatsApp CTAs are context-prefilled per route (`wa.me/966539388072?text=<route context>`), number is consistent site-wide via `lib/config/contact.ts`, recovery pages correctly route to business WhatsApp with a separate direct-call number by design. Route template has clear "how it works," meet & greet, free-waiting, FAQ. This is genuinely good conversion design.
**Corrections to my own first pass:** the "extra" numbers are **not** a bug — `592052681` is the intentional recovery call number; `501234567` appears only in an auth API placeholder (not a public CTA).
**Real CRO gaps (low effort, high value):**
- Premium/corporate pages that would convert B2B are not indexed → no traffic to convert (indexing, not CRO).
- Verify above-the-fold WhatsApp CTA on the airport/Umrah money pages (highest-intent visitors).
- Trust signals are thin — add only *verifiable* ones (years operating, service coverage, response-time promise). **No fabricated reviews/counts.**

---

## 12. PREMIUM / VIP / CORPORATE OPPORTUNITIES
Demand evidence is thin but present (`jeddah chauffeur service`, `car with driver riyadh to dubai`, `vip chauffeur`). The blocker is that the premium pages **exist but aren't indexed**. So the play is **make existing premium pages visible**, then selectively deepen:
- P0: index `services/vip-luxury`, `services/corporate`, `services/business-executive` + premium fleet pages via internal links from ranking pages.
- P1: strengthen `routes/riyadh-to-dubai` (premium cross-border), build "chauffeur service [city]" intent on `locations/jeddah`/`riyadh` where demand shows.
- **Truthfulness rule:** only claim vehicles actually available, no fabricated licenses/certifications/fleet sizes/guarantees. Premium positioning must be honest.

---

## 13. ARABIC PAGE STRATEGY (no mass generation)
Current Arabic = ~6 static pages + recovery cluster. Prioritize Arabic **only** for proven-demand money pages. First ~10 Arabic candidates (mirror English winners), each with proper hreflang + canonical + Arabic WhatsApp CTA:
1. `/ar/routes/riyadh-to-dammam` 2. `/ar/routes/dammam-to-doha` 3. `/ar/services/airport-transfers` 4. `/ar/routes/jeddah-airport-to-makkah` 5. `/ar/services/umrah-transport` 6. `/ar/routes/makkah-to-madinah` 7. `/ar/services/vip-luxury` 8. `/ar/locations/jeddah` 9. `/ar/locations/riyadh` 10. `/ar/services/car-recovery` (exists — verify). Only build an Arabic page if the English source has real impressions. Batch 3.

---

## 14. EVENT / SEASONAL OPPORTUNITIES (validate before building)
**No GSC demand signal for event queries currently.** Recommendation: build **one evergreen hub** `events/` + `events/riyadh-event-transportation` and `events/corporate-event-transportation-saudi-arabia` first; add specific named-event pages **only** if the event is confirmed current/annual and shows search intent. 
- LEAP (Feb, annual, huge) and Riyadh Season (Oct–Mar, annual) → **worth evergreen pages**, not year-locked.
- Black Hat MEA / Money20/20 / Global AI Summit / Future Minerals Forum → **defer**; build only after core money pages convert and only if validated. **Do not create thin event pages now.** Batch 5, conditional.

---

## 15. AI / GEO / AIO / LLM READINESS
Above baseline already: AI crawlers explicitly allowed in robots, speakable + FAQ + Service + breadcrumb schema on route pages, clear entity/contact. To improve machine-readability: ensure consistent Organization/LocalBusiness schema sitewide with one canonical NAP, concise factual FAQ answers on money pages (what's provided, pickup, vehicles, booking flow, meet & greet), transparent service boundaries. **Do not claim** any LLM "will recommend" the company. GEO is a supporting win, not the primary lever — indexing/authority comes first.

---

## 16. IMAGE / UI IMPROVEMENT PLAN
Existing image audit docs present (`IMAGE-FIX-LIST.md`, `REMAINING-IMAGES-TABLE.md`, `FLEET-IMAGE-REPORT.md`). Do **not** auto-replace images. For money pages only, verify: hero relevance (real Saudi context vs generic stock), fleet photos load and are compressed, alt text describes vehicle+context (e.g. "Mercedes S-Class chauffeur Riyadh airport transfer"). Report-then-approve per image. P2 unless a broken/blurry image is on a Tier-A money page (then P1).

---

## 17. METADATA OPPORTUNITIES (surgical, not mass)
Only touch pages with a demand/position mismatch. Examples to draft (current→proposed→reason→risk) in the relevant batch:
- `services/airport-transfers` — align title to "Private Airport Transfers Saudi Arabia" cluster (pos 80, high demand). Risk: low.
- `routes/jeddah-airport-to-makkah` — ensure title carries "taxi/fare/private transfer" modifiers users search. Risk: low.
- `routes/riyadh-to-dubai` — surface "car with driver" premium modifier. Risk: low.
- **Do not** force "VIP" into every title or keyword-stuff. Preserve strong existing metadata on protected pages.

---

## 18. NEW PAGE OPPORTUNITIES (only where demand is proven)
Bias is **against** new pages until existing money pages are indexed and converting. Justified candidates:
- `events/` evergreen hub (+2 corporate/Riyadh pages) — §14.
- "Chauffeur service in Jeddah/Riyadh" intent — likely better served by strengthening existing `locations/*` + `services/vip-luxury` than new URLs. Validate first.
- Everything else: **do not create.**

---

## 19. BACKLINK / EXTERNAL AUTHORITY NEEDS
Ahrefs = 0 keywords ⇒ the domain has almost no external authority, which is *why* good pages won't index/rank. On-site fixes (Batches 0–2) unlock the low-hanging near-page-1 wins, but breaking the high-demand airport/Umrah queries (pos 55–100 → page 1) **requires real authority**. Off-page (after on-site): existing off-page assets doc (`OFFPAGE-ASSETS.md`, `saudieventmanagement.com` in the reports) — leverage owned properties for contextual links to money pages, genuine local/business citations with consistent NAP, and legitimate partnerships (hotels/DMCs/event agencies per §21 outreach). **No link schemes.**

---

## 20. MASTER PRIORITIZED ROADMAP
| Priority | Theme | Pages | Expected effect |
|---|---|---|---|
| **P0** | Index the premium + push Tier-A routes | vip-luxury, corporate, business-executive, dammam-to-doha, riyadh-to-dammam, riyadh-to-dubai, riyadh-to-doha | Make premium visible; move click-earners to pos 1–5 |
| **P0** | Kill crawl-budget waste | Confirm dead job URLs 410/301; deprioritize thin subareas | Free crawl equity for money pages |
| **P1** | Unlock airport/Umrah demand | airport-transfers, jeddah-airport-to-makkah, makkah-to-madinah, umrah-transport, big airports | Biggest volume upside |
| **P1** | Internal-link clusters | 4 clusters in §9 | Indexation + authority flow |
| **P2** | Arabic money mirrors | ~10 pages §13 | Arabic demand capture |
| **P2** | Premium/chauffeur/corporate deepening | §12 | B2B leads |
| **P3** | Events/seasonal (validated) | §14 | Seasonal leads |
| **P3** | Images/metadata polish | §16–17 | Incremental CTR |
| **DO NOT TOUCH** | Protected pages §6 | — | Preserve what works |

---

## 21. B2B / CORPORATE OUTREACH CATEGORIES (genuine demand only)
Event/exhibition organizers, hotels (airport-transfer partnerships), DMCs & inbound travel companies, corporate travel managers of firms with Saudi operations, relocation/concierge firms. Small, targeted — not a mass list.

---

## BATCH PLAN (execution sequence — ~10 URLs each, approval-gated)

**Batch 0 — Technical/indexing unblock (money-page-affecting only):**
Confirm dead `/taxi-driver-jobs/*` & `/driver-jobs/*` return 410/301; verify no canonical/robots mistake on the 12 money pages; deprioritize or `noindex` the thinnest unindexed subareas to free crawl budget. *No content rewrites.*

**Batch 1 — Top 10 money pages (index + push):**
dammam-to-doha, riyadh-to-dammam, riyadh-to-dubai, riyadh-to-doha, madinah-to-alula, jeddah-to-kaec, services/vip-luxury, services/corporate, services/business-executive, services/airport-transfers. Action = internal links in + surgical metadata + GSC submit. *Protected pages: strengthen only, never restructure.*

**Batch 2 — Airport/Umrah demand unlock (next 10):**
jeddah-airport-to-makkah, makkah-to-madinah, jeddah-to-madinah, umrah-transport, airports/king-abdulaziz-jeddah, airports/king-khalid-riyadh, premium fleet pages (mercedes-s-class, cadillac-escalade), routes/riyadh-to-madinah, routes/makkah-to-jeddah. Build the 4 internal-link clusters (§9).

**Batch 3 — Arabic money mirrors (~10):** §13 list, with hreflang/canonical/Arabic CTA.

**Batch 4 — VIP/chauffeur/corporate/event deepening:** validate competitor gaps live; deepen premium pages; chauffeur-intent on locations.

**Batch 5 — Events/seasonal (validated only):** events hub + Riyadh/corporate + LEAP/Riyadh Season evergreen if validated.

**Batch 6 — Remaining technical/image/metadata polish + off-page authority push.**

---
**STOP. Awaiting approval before any implementation.**
Guiding rules honored: evidence > assumptions · revenue > vanity metrics · protect working pages · no fabricated claims · no mass generation · concentrate authority, don't dilute it.
