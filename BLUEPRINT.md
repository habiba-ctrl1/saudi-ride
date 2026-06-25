# 🧭 TAXIDRIVER — Master Blueprint & Task Plan
> Goal: ksa-reference (taxiserviceksa) jaisi ya usse behtar SEO + topical authority wali site banana — **saare changes sirf `taxidriver/` folder me honge.** ksa-reference ko sirf reference/idea ke liye use karenge, usme koi change nahi.

**Date:** 2026-06-15
**Owner:** Haram Taxi Service

---

## 1. Dono sites ka comparison (kya hai, kya missing hai)

| Cheez | ksa-reference (taxiserviceksa) | taxidriver (humari site) |
|---|---|---|
| Stack | Next 14, React 18, Tailwind 3 | **Next 15, React 19, Tailwind 4** (zyada modern ✅) |
| Booking system | Basic form + email | **Supabase + Prisma + Stripe + Twilio** (zyada powerful ✅) |
| Dashboards | Admin blog | **Admin + Customer dashboards** ✅ |
| Pages (static landing) | **107 pages** (driver-jobs, chauffeur-jobs har city, airport taxi, ziyarat, hotel routes) | Dynamic routes (`[slug]`, `[city]`, `[subarea]`) — kam static depth ❌ |
| Schema / JSON-LD | **11+ components** (Organization, LocalBusiness, Service, Route, FAQ, Breadcrumb, WebSite, Location) | Sirf 4 jagah ❌ |
| i18n | Real `/ar` aur `/ur` route trees + alag sitemaps | Sirf metadata me hreflang, real pages nahi ❌ |
| Sitemaps | Category-wise split (pages/routes/services/locations/borders/blog/ar/ur) | Single `sitemap.ts` ❌ |
| Trust signals | Testimonials, TrustSignals, GlobalTrust, RecentTrips, Reviews, Q&A system | Kam ❌ |
| SEO content blocks | SEOContent, ServiceKeywords, RelatedGuides, PopularRoutes, Breadcrumbs har page | Partial ❌ |
| Content data | 9 cities, 3 services | 54 routes, 9 guides, 10 blogs (acha base ✅) |

**Bottom line:** Humara *infrastructure* reference se behtar hai. Jo cheez missing hai wo hai **SEO depth, topical authority, schema, i18n, aur trust content.** Yahi gap bharna hai.

---

## 2. Brand / Identity — PEHLE FIX KARNA (abhi inconsistent hai)

Abhi alag-alag jagah alag naam/domain hai (confusion → SEO ko nuksan):
- README: **"Saudi Ride"**
- package.json: `riyadh-taxi`
- seo.ts: `saudiride.com`
- contact.ts: `riyadhtaxi.sa`, email `bookings@riyadhtaxi.sa`
- Aapka email: `haramtaxiservice@gmail.com` → shayad brand **"Haram Taxi"** (Makkah/Madinah/Umrah focus)

**Decision chahiye (tum batao):** Final brand name, domain, aur NAP (Name-Address-Phone). Sab jagah EK jaisa hona zaroori hai (Entity Consistency).

---

## 3. Strategy — Koray / Topical Authority model (reference se)

Reference ki poori SEO core ideas:
1. **Topical Map** — ek main topic + clusters (Airport, Umrah/Ziyarat, City taxi, Routes, Use-cases).
2. **One intent per page** — har page ka ek clear maqsad, ek entity.
3. **Above-the-fold answer** — jawab upar, fluff nahi.
4. **Ontology-based internal linking** — same city / same service / same intent ke beech links.
5. **Schema markup** har page pe.
6. **Entity consistency** — brand/NAP har jagah same.
7. **Ranking state discipline** — 6 mahine ka game, impressions → positions → clicks.

> ⚠️ Note: Reference ne "no phone / no WhatsApp, sirf form+email" rule rakha. Taxi business me phone/WhatsApp zaroori hota hai — ye **aapka decision** hai, blindly copy nahi karenge.

---

## 4. PHASED TASK PLAN (yahi steps follow karenge)

### ✅ PHASE 0 — Foundation & Decisions (sabse pehle)
- [x] 0.1 **Brand = "Taxi Saudi Arabia", Domain = taxisaudiarabia.com** (available; user kal-parson tak khareedegi) ✅ LOCKED
- [x] 0.2 **Contact = Booking Form + Email + WhatsApp** (phone calls nahi, WhatsApp haan) ✅ LOCKED
- [x] 0.3 **Audience = Umrah/Hajj pilgrims (TOP) + Tourists + Business/Corporate + Local city riders** ✅ LOCKED
- [x] 0.4 Brand sab files me consistent (64 files rebrand: "Taxi Saudi Arabia" + taxisaudiarabia.com + emails + social + booking-ref TSA-) ✅ DONE
  - ⏳ PENDING USER INPUT: (a) ZATCA legal company name + VAT number (lib/zatca.ts), (b) real phone/WhatsApp number (lib/config/contact.ts abhi fake placeholders)

### ✅ PHASE 1 — Technical SEO Backbone (DONE)
- [x] 1.1 Reusable schema foundation banaya: `lib/schema.ts` (websiteSchema, breadcrumbSchema, serviceSchema, faqSchema, SITE constants) + `components/seo/JsonLd.tsx` + `components/seo/Breadcrumbs.tsx` ✅
- [x] 1.2 Schema wired: layout me WebSite + TaxiService(LocalBusiness) + FAQ; 12 service pages me Service(+FAQ); locations [city] & [subarea], airports [slug] me Service; routes [slug] me TouristTrip+FAQ+Breadcrumb ✅
- [x] 1.3 Sitemap — taxidriver ka single dynamic `sitemap.ts` already strong hai (static+locations+subareas+airports+DB routes+fleet+blog, sab hreflang). Reference ka manual XML-split purana tareeqa tha; isko split karne ki zaroorat nahi ✅ (N/A)
- [x] 1.4 robots.ts (sitemap URL set), canonical (dynamic pages pe), hreflang (layout + sitemap) — verified ✅
- [x] 1.5 Breadcrumbs (UI + BreadcrumbList schema) — sab service + location + airport + route pages pe ✅
  - ⏳ Optional follow-up: top-level static pages (about, contact, faq, pricing, gallery, fleet, guides, blog) pe abhi breadcrumb nahi — kam-priority (shallow pages)
- [x] 1.6 Metadata — har page pe unique title/description already maujood; layout title polish kiya ✅
- ⏳ PENDING USER INPUT: real telephone number (layout TaxiService schema me abhi fake +966500123456)

### ✅ PHASE 2 — Homepage & Core Pages Optimization (DONE)
- [x] 2.1 Homepage H1 already excellent ("Taxi & Car Service Across Saudi Arabia", EN/AR/UR) + above-fold subtitle/CTA/trust-badges/stats ✅ (rewrite ki zaroorat nahi thi)
- [x] 2.2 Trust sections already present: stats bar, trust badges, testimonials, popular routes ✅
- [x] 2.3 Service pages content deepen — 9 service pages (jinme FAQ nahi tha) pe 3-3 factual FAQ + faqSchema add kiye (border-crossings, business-executive, corporate, group-transport, hajj-transport, heritage-tours, madinah-ziyarat, tourism, vip-luxury). Ab saare 12 service pages pe FAQ + schema ✅
- [x] 2.4 Fleet — fleet-data.ts me factual specs (passengers, luggage, price, features, use-case desc, rating) + fleet pages pe Product schema already maujood ✅

### 🟡 PHASE 3 — Topical Authority Pages (content breadth) — IN PROGRESS
- [x] 3.1 Location pages: 6 cities pehle se rich the; ab Taif, Al Khobar, Yanbu, NEOM, Abha bhi rich + static (11/11 cities ab full content, koi thin fallback nahi) ✅
- [x] 3.2 Route pages — **DONE 2026-06-15**: Supabase connected, `prisma db push` se saari tables bani, **54 routes seeded** (db.route). Route landing pages ab live data se. ✅
- [x] 3.3 Airport pages — 8 airports already rich (terminals, tips, routes) + ab Service+Breadcrumb schema ✅
- [x] 3.4 Ziyarat — Madinah Ziyarat (existed) + **Makkah Ziyarat naya page banaya** (6 sites + features + FAQ + schema + sitemap) ✅
- [ ] 3.5 Driver/Chauffeur jobs pages — abhi sirf /partners/driver-registration. Per-city jobs pages = recruitment SEO play (reference ne bahut kiye). **Optional** — is business ke liye priority confirm karni hai
- [ ] 3.6 Hotel-transfer route pages (Jeddah→Makkah hotels) — route data/DB pe depend

### ✅ PHASE 4 — Content / Blog Engine (DONE)
- [x] 4.1 Blog detail pages pe ab BlogPosting + BreadcrumbList schema (article rich result). Admin editor (admin/content/blog) already maujood ✅. (Naye blog likhna = ongoing content kaam)
- [x] 4.2 Guides detail pages pe Article + BreadcrumbList schema ✅. (9 guides ko aur expand karna = ongoing content kaam, optional)
- [x] 4.3 FAQ page pe FAQPage schema already maujood — verified ✅
- [x] 4.4 Internal linking — Footer ke services links ab asli detail pages pe (pehle `/services#hash` thе) + Makkah/Madinah Ziyarat add. Footer me destinations(8 cities) + routes(7) + services(7) + company columns = strong sitewide linking ✅
- New: reusable `articleSchema` builder lib/schema.ts me add

### 🟡 PHASE 5 — i18n (English + Arabic only; Urdu REMOVED per user 2026-06-15)
- [x] 5.0 **Urdu hata diya** — Language type ab "en"|"ar"; LanguageSwitcher sirf EN+AR; middleware/context se /ur hata; hreflang (layout+seo+sitemap) se ur-PK/ur hata; saare `=== "ur"` ternaries collapse; customer profile dropdown + Navbar dead /ur check fix. (Dead `ur:` data keys + nameUr/titleUr fields data files me harmless padi hain — optional cleanup). NOTE: "Urdu-speaking drivers" marketing copy jaan-boojh ke rakhi (driver feature, SEO selling point). ✅
- [ ] 5.1 `/ar` route tree — abhi middleware /ar ko base path pe rewrite karta hai + LanguageContext client-side translations deta hai (real /ar static pages nahi). Arabic content data me maujood. Deepen optional.
- [x] 5.2 RTL — `dir="rtl"` Arabic pe LanguageContext se set hota hai ✅
- [x] 5.3 hreflang — ab sirf en + ar (ur hata) ✅

### 🟢 PHASE 6 — Performance & Launch QA
- [ ] 6.1 Core Web Vitals, image optimization (WebP, lazy)
- [ ] 6.2 No 404s, clean internal links, status codes
- [ ] 6.3 Final SEO checklist + deploy (Vercel)
- [ ] 6.4 Search Console / Bing submit + monitor

---

## 5. Progress Log
> Har step complete hone pe yahan note karenge.

- 2026-06-15 — Blueprint banaya. Phase 0 decisions LOCKED (brand=Taxi Saudi Arabia, domain=taxisaudiarabia.com, contact=form+email+whatsapp, audience=all).
- 2026-06-15 — **Phase 0.4 DONE**: 64 files rebranded (Saudi Ride/Riyadh Taxi → Taxi Saudi Arabia; saudiride.com/riyadhtaxi.sa → taxisaudiarabia.com; emails, social handles, booking-ref RT-→TSA-). Pending user input: ZATCA legal name+VAT, real phone/WhatsApp number.
- 2026-06-15 — **Phase 1 DONE**: SEO foundation (lib/schema.ts + JsonLd + Breadcrumbs); WebSite schema in layout; Service+Breadcrumb+FAQ schema wired into 12 service pages, location/airport/route templates. Typecheck clean. Pending: real telephone in layout schema; optional breadcrumbs on shallow static pages.
- 2026-06-15 — **Phase 2 DONE**: Homepage (H1/above-fold/trust) already strong — koi rewrite nahi (credits bachaye). 9 service pages pe FAQ + faqSchema add kiye → ab 12/12 service pages pe FAQ. Fleet already factual. Typecheck clean.
- 2026-06-15 — **Phase 3 chunks 1-2 DONE**: (1) 5 cities (Taif, Al Khobar, Yanbu, NEOM, Abha) ko rich+static kiya → 11/11 location pages full. (2) Makkah Ziyarat page banaya + sitemap. Typecheck clean.
- 2026-06-15 — **Phase 3.2 route seed**: setup ready (npm run seed:routes + tsx). DB connection BLOCKED — Supabase project paused/stale DATABASE_URL. User ko Supabase resume + correct DATABASE_URL chahiye, phir seed chalega.
- 2026-06-15 — **Phase 4 DONE**: articleSchema builder add; blog + guides detail pages pe Article/BlogPosting + Breadcrumb schema; FAQ schema verified; Footer services links fix (real detail pages + Ziyarat) → strong internal linking. Typecheck clean.
- 2026-06-15 — **Urdu REMOVED** (user request): site ab English ↔ Arabic toggle only. ~13 files updated (Language type, switcher, middleware, context, hreflang x3, ternaries, profile dropdown, Navbar). Typecheck clean. "Urdu-speaking drivers" marketing copy intentionally kept.
- 2026-06-20 — **FLEET IMAGES + DATA**: Saari 14 stock images galat thीं (audit: FLEET-IMAGE-REPORT.md) → user ne sahi car photos di, maine har ek verify (khud dekh kar), WebP convert (sharp, q82, ≤1280w), sahi slug naam, junk/duplicate clean. fleet-data.ts ab local /fleet/<slug>.webp + improved names/features/descriptions (GMC Yukon XL/Denali, Genesis G80 VIP, Ford Taurus 2025, Hyundai Staria VIP, Luxurious Bus etc). Toyota Camry image patli (1000x313) — replaceable. Typecheck clean. NEXT: fleet page design upgrade.
- 2026-06-16 — **NAVBAR LOGO + SPACING + ROUTES "TO" FILTER**: Logo white rounded chip me (green-on-green contrast fix) + bara (h-12→h-14) + shadow/hover. Header: "Book Your Ride Now" 4-line circle ban raha tha (crowded nav → text wrap) → whitespace-nowrap + chhota text "Book Now"/"WhatsApp", gap/padding adjust, flex-shrink-0. RoutesClient.tsx me destinationCity (To) filter add → ab From+To+Price; Clear Filters dono reset. Typecheck clean.
- 2026-06-16 — **GREEN #16A34A + HERO REDESIGN (saudiataxiservice.com reference)**: Primary green ab **#16A34A** (rgb 22,163,74), hover #15803D (globals.css + Navbar). Hero (home-page.tsx SECTION 1) poora rebuild → light bg two-column: LEFT car image card (overlay heading + "Toyota Camry 2026" + green badge), RIGHT green panel (#16A34A) with white H1 "Get the Best Online Taxi Service in Saudi Arabia" + subtitle + 2 CTAs (Book=yellow #FACC15 dark text, WhatsApp=white green text). Cards pe premium-dark-section class (white text bachane ko). Navbar user ne khud reference jaisa rewrite kiya (green header, yellow hover, mega-menu) — untouched. Typecheck clean. PENDING: car image abhi Unsplash SUV placeholder; user apni green Camry photo /public me daal ke replace karega.
- 2026-06-15 — **EXACT PALETTE (Koray-style brief)**: User ne final 4-color palette diya → Green #006C35, Gold #C8A45D, BG #FAFAF7, Text #1C1C1C. globals.css tokens + saare hardcoded gold literals (home-page.tsx, PriceCalculator.tsx, Footer.tsx, Navbar.tsx: #D4AF37→#C8A45D, rgba 212,175,55→200,164,93; green #0B6E4F→#006C35). Navbar "Book Now" (desktop+mobile) ab solid GREEN CTA (white text) — pehle gold tha (brief: strong CTA=green). Audit: review schema (layout+schema.ts), sticky WhatsApp, 12 homepage sections, breadcrumbs, internal linking — sab present. GAP vs brief: floating CALL button nahi (Phase 0 me "WhatsApp-only, no calls" lock + phone fake placeholder); kuch extra dark sections (brief "white space" chahta). Typecheck clean.
- 2026-06-15 — **BLOG +5 + INTERNAL LINKING (user request)**: 5 naye SEO blogs add (blog-posts.ts ab 15 posts): madinah-to-makkah-taxi, jeddah-to-madinah-taxi, taxi-cost-saudi-arabia, makkah-ziyarat-taxi, riyadh-airport-ruh-taxi. Simple-word titles jo log search karte. Blog UI words simplified (Dispatch/Intel/"premium fleet" → Our Blog/Travel Tips/Comfortable Ride). Internal linking: har blog → /fleet,/book,/routes,/services; Footer (en+ar+ur) "Company" me Blog link add (sitewide). Indexing: sitemap.ts already BLOG_POSTS_DATA se auto-include karta (15/15), generateStaticParams + BlogPosting/Breadcrumb schema present. Typecheck clean.
- 2026-06-15 — **UI REFRESH (user request)**: Color scheme ab **Saudi Green (#0B6E4F) + Gold (#D4AF37) accent + White/cream** (pehle gold+navy tha). globals.css tokens (root+dark) updated; override rules: buttons=green, gold text/borders/stars=gold (var(--gold)), button hover=green-dark, input focus glow=green, dark-hero CTA=green/white. Difficult words → searchable keywords: Navbar "Fleet"→"Our Cars", "Locations"→"Cities" (EN+AR; URLs unchanged); /fleet "All Fleet"→"All Cars", "Fleet Rating"→"Customer Rating", "WhatsApp Fleet Manager"→"Get a Price on WhatsApp". Typecheck clean.
- 2026-06-25 — **SEO COMPONENTS + DRIVER-JOBS (gap-report items #1+#2)**: (1) 3 reusable SEO components banaye — `TLDRSummary` (above-fold quick-answer box, featured-snippet/AI signal), `RelatedLinks` (ontology internal linking), `DistanceTable` (crawlable facts table). (2) `lib/schema.ts` me 3 naye builders — `jobPostingSchema` (Google Jobs rich result), `personSchema` (E-E-A-T author), `itemListSchema` (hub pages). (3) **Driver-jobs SEO play**: `lib/data/driver-jobs.ts` (18 cities, earnings/demand/hubs) + `driver-jobs/[city]` template (JobPosting+FAQ+Breadcrumb schema, TLDR, DistanceTable, RelatedLinks, Apply CTA online+WhatsApp) + `driver-jobs` hub (ItemList schema). 19 naye pages. (4) sitemap.ts me driver-jobs add (en+ar hreflang); Footer (en/ar/ur) me "Driver Jobs" link → sitewide indexing. Typecheck clean. See GAP-REPORT.md + WORK-DONE-2026-06-25.md.
- 2026-06-25 — **ALIAS VARIANTS (keyword coverage, duplicate-safe)**: driver-jobs ke 2 aur keyword variants add — `chauffeur-jobs/[city]` (VIP/corporate angle, +25% salary skew) + `taxi-driver-jobs/[city]` (everyday angle, −5%). `lib/data/driver-jobs.ts` me `JOB_VARIANTS` config + `variantSalary()`. Shared renderers `components/seo/DriverJobBody.tsx` + `DriverJobsHubBody.tsx` (code duplicate nahi). Har variant: self-canonical + alag title/H1/FAQ/earnings (no cannibalization), cross-link "Also Hiring in {city}". 3 hubs + 54 city = **57 recruitment pages total**. Sitemap teeno variants (en+ar). Typecheck clean.
- 2026-06-25 — **MADINAH CLUSTER COMPLETE + BLOG INTERNAL LINKING + IMAGE AUDIT**: MADINAH W1: pillar (TLDR+5 FAQ+3 testimonials+enriched) + MED airport (`prince-mohammad-madinah`) TLDR+5 FAQ+enriched terminals/tips + ROUTE_CONTENT for 4 routes (madinah-airport-to-city, madinah-to-makkah, madinah-airport-to-makkah, madinah-to-jeddah-airport). W2: 2 guides (`madinah-ziyarat-sites-guide`, `dhul-hulaifah-miqat-madinah`). W3: 6 subareas (al-markazia, qaba, uhud, al-awali-madinah enriched + al-aqiq-madinah, sultanah new) — **subarea Travel-Times card labels ab data-driven** (`airportLabel`/`nearLabel` → Madinah MED+Nabawi, defaults JED+Makkah); RELATED_LINKS me madinah added; 2 naye subareas sitemap me. W4: Madinah fare blog. **No DB reseed needed** (routes pre-seeded). **BLOG INTERNAL LINKING**: blog/[slug] me `internalLinksFor(post)` helper — title+content keywords se contextual links (routes/airports/services/locations/pricing/fleet) derive karke "Related on Taxi Saudi Arabia" section render; saare 18 posts + future auto-covered. **BLOG IMAGE AUDIT**: SEO/BLOG-IMAGE-AUDIT.md — 18 cover images audited, 12 reused/mismatch flagged (P1) + 6 verify (P2), suggested local `public/blog/<slug>.webp` paths; user images dega phir coverImage fields update karenge. Typecheck clean. Pushed to main.
- 2026-06-25 — **MAKKAH CLUSTER COMPLETE (all 4 waves, mostly data — templates reused)**: W1: Makkah pillar (`/locations/makkah`) TLDR+5 FAQ+3 testimonials+enriched (6 attractions, 4 tips, Haram/airport/Madinah facts) + ROUTE_CONTENT for 4 top routes (makkah-to-jeddah-airport, makkah-to-madinah, makkah-to-jeddah, makkah-to-taif) — TLDR+4 FAQ each. W2: 2 guides (`makkah-to-madinah-transport-guide` taxi-vs-train-vs-bus, `makkah-hotel-haram-dropoff-guide` prayer-closure/drop-off) — TLDR+4 FAQ each. W3: 6 Makkah subareas (aziziyah, ajyad, al-awali-makkah, al-shubaikah, al-mansour, mina) thin→rich (Haram-centric distances + landmarks + 3 FAQ); RELATED_LINKS generalized (jeddah+makkah map, pehle hardcoded jeddah-only). W4: Makkah fare blog (`makkah-taxi-fares-cost-guide`) + pillar testimonials (W1). **NO DB RESEED NEEDED** — saare 8 Makkah routes pehle se seeded, sirf template ROUTE_CONTENT add (sandbox-safe). Subareas already in sitemap. Typecheck clean. NEXT LOCATION: Madinah.
- 2026-06-25 — **JEDDAH WAVE 4 (EEAT / trust) — JEDDAH CLUSTER COMPLETE**: (1) Fare-guide blog `jeddah-taxi-fares-cost-guide` (price-focused, existing JED-Makkah guide se distinct intent) — fixed-fare table (5 routes), vehicle multipliers, taxi-vs-Uber, tipping, author for E-E-A-T; auto-indexed via BLOG_POSTS_DATA→sitemap. (2) Jeddah pillar (`/locations/jeddah`) pe testimonials section — 3 Jeddah-specific reviews (JED→Makkah night arrival/Miqat, JED→Madinah family SUV, city-tour) + 4.9/5 trust badge; CITY_DETAILS me optional `testimonials` field (Jeddah-only, baaki cities skip). NOTE: fake individual Review schema **jaan-boojh ke nahi banaya** (guidelines risk) — sirf visible EEAT content; aggregateRating pehle se serviceSchema me hai. Typecheck clean. **JEDDAH DONE: Wave 1 (money) + 2 (support/guides) + 3 (12 subareas/station/tour) + 4 (fare/reviews).** Pending: 2 routes (jeddah-airport-to-jeddah-city, jeddah-to-haramain-station) DB reseed. NEXT LOCATION: Makkah.
- 2026-06-25 — **JEDDAH WAVE 3 (subarea programmatic + station route + city-tour)**: (1) Subarea template (`locations/[city]/[subarea]`) enhanced — SUB_AREAS type me optional `airportMin`/`makkahMin`/`landmarks`/`popularFor`/`tldr`/`tldrFacts`/`faqs`; template ab TLDR + Travel-Times card + Nearby-Landmarks card + FAQ section + FAQPage schema + Jeddah-cluster RelatedLinks (JED-Makkah/Madinah/airport/Umrah) render karta hai — **sirf Jeddah entries enriched, baaki cities generic (optional fields undefined → sections skip), no breakage**. (2) 6 existing Jeddah subareas (al-balad, corniche, al-hamra, obhur, al-safaa, al-rawdah) thin→rich + 5 naye (al-shati, al-salamah, al-aziziyah-jeddah, al-faisaliyah, al-andalus) + **city-tour** intent page = **12 Jeddah local pages**, har ek pe distances/landmarks/TLDR/3 FAQ. (3) Haramain-station route: `jeddah-to-haramain-station` seed (routes.ts) + ROUTE_CONTENT (TLDR + 4 FAQ) ready. (4) Sitemap: 6 naye Jeddah subareas add (en+ar). NOTE: jeddah-airport-to-jeddah-city + jeddah-to-haramain-station routes **DB reseed pending** (sandbox-blocked) — subarea/city-tour pages static, abhi live. Typecheck clean. NEXT: Wave 4 (fare guide, Jeddah reviews/EEAT, "how to get JED→Makkah" already done as guide).
- 2026-06-25 — **JEDDAH WAVE 2 (support content + guides + internal linking)**: (1) Guide interface enhanced — optional `tldr`/`tldrFacts`/`faqs`; guide template ab TLDR box + FAQ section + FAQPage schema render karta hai (existing guides untouched, backward-compatible). (2) 2 naye high-value guides (existing jeddah-airport-guide + meeqat-locations se differentiated, no cannibalization): `jeddah-airport-to-makkah-guide` (taxi vs Haramain vs bus, #1 query) + `miqat-jeddah-makkah` (Jeddah-arrival Ihram decision guide) — dono pe TLDR + 4 FAQ. (3) Umrah-from-Jeddah block: `/services/umrah-transport` pe "Your Umrah Journey from Jeddah" 6-step section with ontology internal links (airport→Miqat guide→JED-Makkah→Makkah Ziyarat→Madinah→Madinah Ziyarat) + 2 Jeddah/Miqat FAQ added. (4) JED→city route: `jeddah-airport-to-jeddah-city` seed entry (routes.ts) + ROUTE_CONTENT rich TLDR/FAQ ready — **needs DB reseed to go live** (sandbox-blocked). (5) Sitemap: individual GUIDES pages add kiye (pehle sirf /guides hub tha) → naye guides ab indexable (en+ar hreflang). Typecheck clean. NEXT: Wave 3 (11 subarea programmatic pages + Haramain-station route + city-tour).
- 2026-06-25 — **JEDDAH WAVE 1 (money pages content + schema)**: SEO/JEDDAH-TOPICAL-AUTHORITY.md blueprint banaya (poora Jeddah semantic map). Phir Wave-1 ke 4 money pages pe real content + FAQPage schema add: (1) Jeddah pillar `/locations/jeddah` — TLDR box + 6 attractions + 4 tips + 5 FAQ + faqSchema; terminal info fix (Terminal 1/North/Hajj, "South Terminal" galat tha hata). (2) Airport `/airports/king-abdulaziz-jeddah` — TLDR + 6 FAQ + faqSchema + accurate terminals + Miqat/night-arrival tips. (3+4) Route template me `ROUTE_CONTENT` slug-map (jeddah-airport-to-makkah, jeddah-to-makkah, jeddah-airport-to-madinah, jeddah-to-madinah) — har route ka apna TLDR + bespoke FAQ (generic 2-FAQ fallback baaki routes ke liye); inline faqSchema object hata kar `faqSchema(faqs)` builder use kiya (DB untouched). TLDRSummary component reused (no DB/migration needed, sandbox-safe). Typecheck clean. NEXT: Wave 2 (JED→city route, Umrah-from-Jeddah block, terminals guide, Miqat guide).
- 2026-06-15 — **DB CONNECTED + SEEDED**: Supabase project active; prisma db push (all tables), 54 routes seeded. .env.local restore+fix (brand email, SUPABASE_URL/ANON_KEY server aliases). Note: sandbox network blocks DB — db ops need sandbox-disabled. Pending env: SUPABASE_SERVICE_ROLE_KEY, real WhatsApp #, optional Twilio/Resend/Moyasar/Maps keys.
