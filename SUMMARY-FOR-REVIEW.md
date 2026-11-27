# TaxiSaudiArabia — Work Summary & Findings (for review)

_Date: 2026-08-31_

## 1. Project context
- **Site:** taxisaudiarabia.com — private taxi / chauffeur + car-recovery business in Saudi Arabia.
- **Business model:** No online payment/pricing. All quotes are given on **WhatsApp** ("fare confirmed on WhatsApp"). Leads = the goal (VIP private rides, weddings, cross-border, corporate).
- **Stack:** Next.js 15 (App Router), TypeScript, Tailwind, Prisma + Supabase (Postgres). Hosted on **Vercel (Hobby/free plan)**. Repo: GitHub `habiba-ctrl1/saudi-ride`, deploys from `main`.
- **Reference competitor (local copy studied):** `taxiserviceksa` — a much bigger site that is getting leads.

## 2. Key finding — why the competitor ranks / gets leads
It is **NOT about design.** The competitor wins on **SCALE + breadth**:

| Metric | Competitor (leads) | Our site (before this work) |
|---|---|---|
| Total pages | **1049** | 73 |
| Blog posts | 214 | 33 |
| City/location pages | **151** (+ subareas) | 14 |
| Distance pages (city-to-city km/time) | **66** | 0 |
| Per-border-crossing pages | 13 | 1 |
| Bus route pages | 14 | 0 |
| City "driver/chauffeur jobs" pages | 20 | 0 |
| Languages | EN + AR + **Urdu** | EN + AR |

**Conclusion:** To rank + get leads we need to (a) add many more targeted, useful pages (programmatic SEO), (b) add missing money niches (wedding, corporate Bahrain, women/event transport), (c) keep every page rich (content + images + FAQ schema + internal links), not thin.

## 3. What has been BUILT so far (all code-complete, typecheck 0 errors)

### Phase 1 — lead pages (DONE)
- **New page** `/services/wedding-car-rental` — bridal cars (Maybach/Range Rover = Riyadh flagship; S-Class/Lexus route-dependent; GMC/Camry/Staria value), decoration, WhatsApp lead form, FAQ schema.
- **New page** `/services/corporate-bahrain-transport` — B2B monthly staff/exec transfers across King Fahd Causeway, VAT invoicing.
- **7 new cross-border routes** (both directions): manama→dammam, manama→alkhobar, manama→riyadh, doha→dammam, doha→riyadh, kuwait→dammam, alahsa→doha. Each has custom TL;DR + FAQs + keyword-rich meta title/description.
- **Toyota Veloz 2024** added to fleet (economy causeway car). Image copied from reference.
- **Fleet positioning fix:** route pages now show real models + value — "Camry/Ford 2025–26", "GMC Yukon", "S-Class/Lexus subject to route", "Staria".
- Internal linking wired everywhere (Footer, Navbar, ServiceRelatedLinks, sitemap).

### Phase 2.1 — Distance / journey guide pages (SAMPLES DONE, now upgraded)
- **New section** `/distance` (hub) + `/distance/[slug]` for 4 pairs: riyadh-to-jeddah, makkah-to-madinah, riyadh-to-dammam, jeddah-to-makkah.
- **Data file:** `lib/data/distances.ts` (real distances/times from `routes.ts` — NO invented numbers).
- **Each distance page now has:** hero image (real city photo), From→To city image cards, 4 quick-fact cards, 2-paragraph overview, "Good to Know" travel tips, numbered route/stops, "Choose Your Vehicle" (3 fleet cars with images), by car/train/flight comparison (real facts — e.g. real Haramain train, SAR Riyadh–Dammam train), image-background booking CTA (→ matching `/routes/*` + WhatsApp), FAQ (schema), cross-links to other guides.
- **All images are our own** (`public/locations/*-hero.webp`), no fakes, no fake prices/reviews.

### A route-page bug fixed
- Route detail pages fetched data only from the DB at build. New routes not seeded in DB would 404 on Vercel. Fixed with a **static `ROUTES_DATA` fallback** so all routes render without a DB seed and survive a flaky DB at build.

## 4. THE CURRENT BLOCKER (not code)
- Code builds perfectly **locally** (`npm run build` = success, 372 static pages, exit 0).
- But **Vercel is not deploying.** Reason found in Vercel notifications:
  > "Your free team has used **100% of the included free tier usage for Fluid Active CPU (4 hours)**."
- The **Vercel Hobby (free) plan's monthly compute quota is exhausted**, so new deployments fail (GitHub shows a failed check; Vercel doesn't even create the deployment). This has been happening monthly (Jul 27, Aug 10, Aug 24 notices) and this is a **commercial** site.
- **Options:** (a) upgrade to **Vercel Pro (~$20/mo)** → deploy immediately, or (b) wait for the **monthly usage reset (~1st of month)** then redeploy. User is currently waiting for the reset (no budget for Pro yet).
- **Nothing to redo** — all code is committed to GitHub `main`. When Vercel is unblocked, one push/redeploy makes everything live. Meanwhile pages are viewable locally via `npm run dev`.

## 5. Roadmap (agreed order)
- **Phase 2.1 (in progress):** finish ~25 more distance pages (Riyadh↔Makkah/Madinah/AlUla/Hail/AlAhsa/Buraydah, Jeddah↔Madinah/Taif/Yanbu/AlUla, Madinah↔Tabuk/Yanbu/Taif, Makkah↔Taif).
- **Phase 2.2:** per-border-crossing pages (King Fahd Causeway, Salwa, Al Batha, Khafji).
- **Phase 2.3:** expand city/location pages 14 → 40+.
- **Phase 2.4:** split sitemaps (routes/locations/blog/borders).
- **Phase 3:** blog 33→80+, fare calculator, reviews/Q&A (E-E-A-T), Urdu version.

## 6. The question I want reviewed
> Given the competitor's scale advantage, is the **distance-page template** (rich content + images + FAQ schema + internal links + WhatsApp CTA) the right approach to rank these city-to-city queries, and what would make them rank **better** without adding fake data? Any additional sections, schema types (e.g. `TouristTrip` / `Trip` / `HowTo`), or internal-linking structure to add?

---
### Local preview commands
```
cd "C:\Users\786\Documents\WEBSITES\project\taxidriver"
npm run dev
```
Then open: `http://localhost:3000/distance/riyadh-to-jeddah`, `/services/wedding-car-rental`, `/services/corporate-bahrain-transport`, `/routes/manama-to-dammam`
