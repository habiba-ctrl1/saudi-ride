# 🟢 JEDDAH — Complete AI-First Topical Authority Map
**Brand:** Taxi Saudi Arabia · **Domain:** taxisaudiarabia.com
**Scope:** JEDDAH ONLY (one location done fully, then next). Built on existing Next.js URL structure (`/locations/[city]/[subarea]`, `/routes/[slug]`, `/airports/[slug]`, `/services/...`).
**Central Entity:** *Jeddah taxi & airport transfer service — the gateway to Makkah & Madinah for Umrah/Hajj pilgrims.*

> Strategy in one line: Jeddah is the **arrival gateway**. 80% of commercial value sits in **JED Airport → Makkah/Madinah** transfers. Everything else (subareas, landmarks, guides) exists to feed authority into that core.

---

## 0. ENTITY MODEL (the brain — everything maps to these)

**Primary entity:** `Jeddah` (city, Saudi Arabia, Makkah Province, Red Sea coast)
**Brand entity:** `Taxi Saudi Arabia` (Service/LocalBusiness providing the transport)

| Entity class | Entities (used as nouns across every Jeddah page) |
|---|---|
| **Core place** | Jeddah, Makkah Province, Red Sea, Hejaz region, Saudi Arabia |
| **Transport hub** | King Abdulaziz International Airport (JED), North Terminal / Terminal 1, Hajj Terminal, Haramain High-Speed Railway – Jeddah (Sulaymaniyah) Station, Jeddah Islamic Port |
| **Religious destinations (intent magnets)** | Makkah, Masjid al-Haram (Holy Mosque), Kaaba, Madinah, Masjid an-Nabawi, Miqat ( As-Sayl / Juhfa ) |
| **Neighbourhoods (subareas)** | Al Balad, Al Corniche / Waterfront, Al Hamra, Al Shati, Al Rawdah, Al Salamah, Obhur (Abhur), Al Aziziyah, Al Faisaliyah, Al Andalus, An Nahda |
| **Landmarks / POI** | Jeddah Corniche, King Fahd Fountain, Al-Balad (UNESCO), Floating Mosque (Al-Rahma), Red Sea Mall, Mall of Arabia, Jeddah Waterfront |
| **Services (your offer)** | airport transfer, Umrah taxi, Hajj transport, intercity, hourly chauffeur, group/family van, VIP/luxury, city tour |
| **Vehicles (your fleet)** | Toyota Camry, GMC Yukon, Hyundai Staria, Hyundai Sonata, luxury bus, Genesis G80 VIP |
| **Attributes (trust modifiers)** | fixed price / no surge, meet & greet, flight tracking, English/Urdu-speaking driver, 24/7, female-friendly, child seat, free waiting, luggage space |
| **Problems (intent triggers)** | "no taxi at airport at night", "Uber expensive surge", "lots of luggage + family", "first Umrah, don't know the way", "need Miqat stop for Ihram" |

**Semantic triples** to reinforce on-page (subject → predicate → object):
- *Taxi Saudi Arabia* → **operates from** → *King Abdulaziz International Airport (JED)*
- *JED Airport* → **is the gateway to** → *Makkah*
- *Jeddah → Makkah* → **distance is** → *~80 km / ~1 hour*
- *Umrah pilgrim* → **needs** → *Miqat stop for Ihram* → **on** → *Jeddah–Makkah route*
- *Taxi Saudi Arabia* → **offers** → *fixed-price airport transfer* → **with** → *flight tracking + meet & greet*

These triples should literally appear as sentences in TL;DR boxes and FAQ answers so LLMs can extract them cleanly.

---

## 1. FULL TOPICAL MAP (intent-layered)

```
JEDDAH (Pillar) ─ /locations/jeddah
│
├── A. AIRPORT SILO (JED) ───────────────── transactional + local  [HIGHEST VALUE]
│   ├── Pillar: Jeddah Airport Taxi (JED)            /airports/jeddah
│   ├── JED → Makkah                                 /routes/jeddah-airport-to-makkah ✅
│   ├── JED → Madinah                                /routes/jeddah-airport-to-madinah ✅
│   ├── JED → Jeddah Hotels / City                   /routes/jeddah-airport-to-jeddah-city ⭐NEW
│   ├── JED → Taif                                   /routes/jeddah-airport-to-taif ✅
│   ├── JED → KAEC                                   /routes/jeddah-airport-to-kaec ✅
│   ├── North Terminal / Terminal 1 pickup           (section on airport pillar)
│   ├── Hajj Terminal pickup                         (section on airport pillar)
│   └── Meet & Greet / night arrival                 (section + FAQ cluster)
│
├── B. ROUTE SILO (intercity from Jeddah) ── transactional
│   ├── Jeddah → Makkah                              /routes/jeddah-to-makkah ✅
│   ├── Jeddah → Madinah                             /routes/jeddah-to-madinah ✅
│   ├── Jeddah → Taif                                /routes/jeddah-to-taif ✅
│   ├── Jeddah → Riyadh                              /routes/jeddah-to-riyadh ✅
│   ├── Jeddah → Yanbu                               /routes/jeddah-to-yanbu ✅
│   ├── Jeddah → KAEC                                /routes/jeddah-to-kaec ✅
│   └── Jeddah → Haramain Station (Makkah/Madinah)   /routes/jeddah-to-haramain-station ⭐NEW
│
├── C. SERVICE-IN-JEDDAH SILO ─────────────── commercial
│   ├── Umrah Taxi from Jeddah                       /services/umrah-transport (Jeddah section)
│   ├── Hajj Transport Jeddah                        /services/hajj-transport (Jeddah section)
│   ├── Jeddah City Tour / Sightseeing taxi          /locations/jeddah/city-tour ⭐NEW
│   ├── Hourly Chauffeur / Driver-for-day Jeddah     /services/business-executive (Jeddah)
│   ├── Group & Family Van Jeddah                    /services/group-transport (Jeddah)
│   └── VIP / Luxury car Jeddah                      /services/vip-luxury (Jeddah)
│
├── D. SUBAREA SILO (hyperlocal) ──────────── local "near me"  [PROGRAMMATIC]
│   └── /locations/jeddah/[subarea]
│       Al-Balad · Corniche · Al-Hamra · Al-Shati · Al-Rawdah · Al-Salamah ·
│       Obhur · Al-Aziziyah · Al-Faisaliyah · Al-Andalus · An-Nahda
│
├── E. INFORMATIONAL SILO ─────────────────── informational + AEO  [AUTHORITY FUEL]
│   ├── Jeddah Airport to Makkah: complete guide     /guides/jeddah-airport-to-makkah-guide
│   ├── How to get from JED to Makkah (all options)  /blog/...  (taxi vs Haramain vs bus)
│   ├── Miqat & Ihram on the Jeddah–Makkah road      /guides/miqat-jeddah-makkah ⭐
│   ├── Jeddah airport terminals explained           /guides/jeddah-airport-terminals
│   ├── Jeddah taxi fare / cost guide                 /blog/jeddah-taxi-fares
│   └── First Umrah from Jeddah: step-by-step         /guides/first-umrah-from-jeddah
│
└── F. TRUST / EEAT SILO (site-wide, Jeddah proof) ── trust
    ├── About / Operator + license                   /about
    ├── Jeddah driver profiles (Person schema)       /about (team) or /locations/jeddah#drivers
    ├── Jeddah customer reviews / testimonials        on pillar + routes
    └── Editorial / pricing policy (fixed-fare)       /pricing
```

**Intent coverage check (all 6 intent types present):**
- Informational → Silo E (guides/blog) + every FAQ block
- Commercial → Silo C (service-in-Jeddah)
- Transactional → Silo A + B (airport + routes, "book")
- Local → Silo D (subareas) + airport "near me"
- Comparison → "Taxi vs Haramain vs Uber" blog, "fixed price vs surge"
- Problem-solving → night-arrival, big-luggage, first-Umrah, Miqat-stop content

---

## 2. SEMANTIC CLUSTER TREE (pillar → support → leaf)

**PILLAR: `/locations/jeddah` — "Jeddah Taxi & Airport Transfer Service"**
This page must answer "everything about getting a taxi in/around Jeddah" and link DOWN to every cluster head. It is the authority sink — all Jeddah pages link UP to it.

```
Jeddah Pillar
 ├─ Cluster head: Jeddah Airport Taxi (/airports/jeddah)        [pillar of Silo A]
 │   ├─ leaf: JED→Makkah   ├─ leaf: JED→Madinah   ├─ leaf: JED→city/hotels
 │   ├─ leaf: terminals    └─ leaf: night/meet&greet  (+ FAQ leaf)
 ├─ Cluster head: Jeddah Intercity Routes (/routes hub, filtered Jeddah)
 │   └─ 7 route leaves (Makkah/Madinah/Taif/Riyadh/Yanbu/KAEC/Haramain)
 ├─ Cluster head: Umrah from Jeddah (/services/umrah-transport#jeddah)
 │   └─ leaves: Miqat guide, first-Umrah guide, Hajj transport
 ├─ Cluster head: Jeddah Neighbourhoods (/locations/jeddah → subarea index)
 │   └─ 11 subarea leaves
 └─ Cluster head: Jeddah Travel Guides (/guides hub, Jeddah-tagged)
     └─ guide + blog leaves
```

---

## 3. PAGE-LEVEL SPECS (full format for the money pages)

> Format applied in full to the **highest-priority** pages. Programmatic pages (subareas) use the **template** in §7 so you don't hand-write 11 of them.

### 🥇 PAGE 1 — Jeddah Pillar (`/locations/jeddah`)
- **SEO Title:** Jeddah Taxi & Airport Transfer Service | Fixed Price 24/7 – Taxi Saudi Arabia
- **H1:** Jeddah Taxi & Airport Transfer Service
- **Meta Description:** Book a fixed-price Jeddah taxi — King Abdulaziz Airport (JED) pickups, Makkah & Madinah transfers, city rides. Flight tracking, meet & greet, English/Urdu drivers, 24/7.
- **Search Intent:** Local + commercial (orientation hub)
- **Primary Entity:** Jeddah · **Supporting:** JED Airport, Makkah, Madinah, Corniche, Al-Balad
- **NLP terms:** jeddah taxi, jeddah cab, airport taxi jeddah, jeddah to makkah taxi, taxi service in jeddah, jeddah private car, 24/7 taxi jeddah
- **Semantic keywords:** gateway to Makkah, Red Sea city, fixed fare, meet and greet, Umrah transfer
- **TL;DR block (above fold):** "Taxi Saudi Arabia provides 24/7 fixed-price taxi and private-car service in Jeddah, including King Abdulaziz International Airport (JED) pickups and transfers to Makkah (~80 km, ~1 hr) and Madinah (~420 km, ~4–5 hr)."
- **Suggested FAQs:** How much is a taxi in Jeddah? · Is there a taxi at Jeddah airport 24/7? · How far is Jeddah from Makkah? · Can I book a Jeddah taxi in advance? · Do drivers speak English/Urdu?
- **Schema:** `LocalBusiness`/`TaxiService` + `BreadcrumbList` + `FAQPage` (+ `Place` for Jeddah)
- **Internal links OUT:** airport pillar, all 7 Jeddah routes, Umrah service, subarea index, guides hub
- **Internal links IN (from):** homepage, footer "Cities", every Jeddah subarea/route/airport page (up-link)
- **External authority:** Wikipedia (Jeddah), GACA/airport official site, Saudi Tourism Authority (Visit Saudi)
- **Word count:** 1,400–1,800
- **AI snippet op:** "taxi in Jeddah" definition + price range · **Featured snippet:** distance table (Jeddah → Makkah/Madinah/Taif)

### 🥇 PAGE 2 — Jeddah Airport Taxi (`/airports/jeddah`)  ⭐ #1 MONEY PAGE
- **SEO Title:** Jeddah Airport Taxi (JED) | Makkah & Madinah Transfers – Fixed Price
- **H1:** Jeddah Airport Taxi — King Abdulaziz International Airport (JED)
- **Meta Description:** Pre-book a fixed-price taxi from Jeddah Airport (JED) to Makkah, Madinah, or your hotel. Meet & greet, flight tracking, no surge, 24/7 night pickups. English/Urdu drivers.
- **Search Intent:** Transactional + local
- **Primary Entity:** King Abdulaziz International Airport (JED) · **Supporting:** Jeddah, Makkah, Madinah, North Terminal, Hajj Terminal, Saudia
- **NLP terms:** jeddah airport taxi, JED airport transfer, taxi from jeddah airport to makkah, jeddah airport to makkah price, airport pickup jeddah, jeddah airport meet and greet
- **Semantic keywords:** arrivals pickup, terminal, flight number, waiting time, fixed fare, night arrival, Ihram/Miqat stop
- **TL;DR:** "A taxi from Jeddah Airport (JED) to Makkah costs a fixed [SAR] and takes ~1 hour. Drivers track your flight and meet you at arrivals with a name sign, 24/7 — including late-night flights."
- **On-page sections (chunkable for AI):** Terminals (North/Terminal 1, Hajj Terminal) → Where to meet the driver → JED→Makkah → JED→Madinah → JED→Jeddah hotels → Night arrivals → Prices table → FAQ
- **FAQs:** Is there a taxi counter at Jeddah airport? · How much is JED to Makkah by taxi? · Where do I meet my driver at JED? · Is there taxi at the Hajj Terminal? · What if my flight is delayed? · Can the driver stop at Miqat for Ihram?
- **Schema:** `Service` + `BreadcrumbList` + `FAQPage` (+ reference `Airport` entity in body)
- **Links OUT:** JED→Makkah, JED→Madinah, JED→city, terminals guide, Miqat guide, Umrah service
- **Links IN:** Jeddah pillar, homepage airport block, every JED-route page, footer
- **External:** official airport site (jed.gacamatar / GACA), airline (Saudia) terminal info
- **Word count:** 1,200–1,600
- **AI snippet:** "taxi from Jeddah airport to Makkah price + time" · **Featured snippet:** terminal → pickup-point table

### 🥇 PAGE 3 — JED → Makkah (`/routes/jeddah-airport-to-makkah`) ✅ exists, optimize
- **SEO Title:** Jeddah Airport to Makkah Taxi | ~1 Hour, Fixed Price – Taxi Saudi Arabia
- **H1:** Jeddah Airport to Makkah Taxi
- **Meta Description:** Fixed-price taxi from Jeddah Airport (JED) to Makkah — ~80 km, about 1 hour. Meet & greet at arrivals, optional Miqat stop for Ihram, 24/7. Book online or WhatsApp.
- **Intent:** Transactional · **Primary Entity:** Jeddah–Makkah route · **Supporting:** JED, Makkah, Masjid al-Haram, Miqat, Ihram
- **NLP:** jeddah airport to makkah taxi, jed to makkah, jeddah airport to mecca, taxi to makkah from jeddah airport price, how to get from jeddah airport to makkah
- **TL;DR:** "The Jeddah Airport (JED) to Makkah taxi is ~80 km and takes about 1 hour. Fixed fare from [SAR]. Driver can stop at the Miqat so you enter Ihram before reaching Makkah."
- **FAQs:** How far is Jeddah airport from Makkah? · How long does it take? · How much is the taxi? · Can the driver stop for Ihram/Miqat? · Is it available at night? · Which is better — taxi or Haramain train?
- **Schema:** `TouristTrip`/`Trip` + `FAQPage` + `BreadcrumbList`
- **Links OUT:** airport pillar, Miqat guide, JED→Madinah (cross-sell), Umrah service, Makkah Ziyarat
- **Links IN:** airport pillar, Jeddah pillar, Umrah service, "how to get to Makkah" blog
- **Word count:** 900–1,300 · **Snippet:** distance + time + "can stop at Miqat" answer

### 🥈 PAGE 4 — JED → Madinah (`/routes/jeddah-airport-to-madinah`) ✅
- **Title:** Jeddah Airport to Madinah Taxi | ~4–5 Hours Direct – Fixed Price
- **H1:** Jeddah Airport to Madinah Taxi
- **Meta:** Direct fixed-price taxi from Jeddah Airport (JED) to Madinah — ~420 km, ~4–5 hours via Haramain highway. Comfortable for families, luggage space, 24/7 night pickups.
- **Primary Entity:** Jeddah–Madinah route · Supporting: JED, Madinah, Masjid an-Nabawi, Haramain highway
- **TL;DR:** "Jeddah Airport to Madinah by taxi is ~420 km and takes ~4–5 hours direct. Fixed fare from [SAR], with rest/prayer stops on request."
- **FAQs:** distance · time · price · rest stops · best vehicle for family/luggage · vs Haramain train
- **Schema:** `TouristTrip` + `FAQPage` + `BreadcrumbList` · **Word count:** 900–1,200

### 🥈 PAGE 5 — JED → Jeddah City / Hotels (`/routes/jeddah-airport-to-jeddah-city`) ⭐NEW
- Captures "airport to hotel/Corniche/Al-Balad" + business arrivals. Link to subarea pages (Corniche, Al-Balad, Al-Hamra hotels).
- **TL;DR:** "Jeddah Airport to the city centre / Corniche hotels is ~20–35 min depending on area. Fixed fare from [SAR], meet & greet included."

### 🥈 PAGE 6 — Umrah Taxi from Jeddah (`/services/umrah-transport` → Jeddah block) ✅ expand
- **H2 anchor:** "Umrah Taxi from Jeddah Airport"
- **Primary Entity:** Umrah transport · Supporting: JED, Makkah, Madinah, Miqat, Ihram, Ziyarat
- Must contain the **pilgrim journey chain**: Land at JED → Miqat stop (Ihram) → Makkah hotel → Ziyarat → Madinah → back. Internally links every route in that chain.
- **FAQs:** Where is the Miqat from Jeddah? · Can I do Ihram at the airport? · Do you do full Umrah packages (Makkah+Madinah)? · Female/family-friendly?

### 🥉 PAGE 7 — Jeddah Airport Terminals Guide (`/guides/jeddah-airport-terminals`) ⭐NEW (authority)
Explains North Terminal / Terminal 1 / Hajj Terminal, arrivals layout, where taxis wait, SIM/ATM. Pure informational magnet → links to airport pillar + routes. High AI-citation value.

### 🥉 PAGE 8 — Miqat & Ihram on Jeddah–Makkah Road (`/guides/miqat-jeddah-makkah`) ⭐NEW
The semantic gap competitors miss. Answers "where do I enter Ihram coming from Jeddah?" Strong GEO/AEO + Umrah authority. Links to JED→Makkah + Umrah service.

---

## 4. INTERNAL LINKING MAP (authority flow)

**Rules (ontology-based — link only within same city / same service / same intent):**

```
UP-LINKS (every page → pillar):  all Jeddah pages link to /locations/jeddah (anchor: "Jeddah taxi service")
DOWN-LINKS (pillar → heads):     pillar links to airport, routes hub, Umrah, subarea index, guides
SIDEWAYS (peer routes):          JED→Makkah ↔ JED→Madinah ↔ JED→city  (anchor: "also from Jeddah airport")
INTENT BRIDGE (info→money):      every guide/blog links to its matching route ("Book your JED→Makkah taxi")
TRUST INJECTION:                 routes & airport link to /about + /pricing (fixed-fare proof)
```

**Authority sink:** `/locations/jeddah` (pillar) receives the most internal links → ranks for head term "Jeddah taxi".
**Authority source pages** (pass equity down): homepage, footer, `/airports/jeddah`, `/services/umrah-transport`.

**Suggested anchor texts (vary — avoid exact-match spam):**
- → JED→Makkah: "Jeddah airport to Makkah taxi", "transfer from JED to Makkah", "book your Makkah ride"
- → airport pillar: "Jeddah Airport (JED) pickups", "airport taxi at JED"
- → Miqat guide: "where to enter Ihram from Jeddah", "Miqat stop on the way to Makkah"
- → pillar: "taxi service in Jeddah", "Jeddah private car"

**Breadcrumbs (BreadcrumbList schema each):**
- Home › Jeddah › Jeddah Airport (JED)
- Home › Routes › Jeddah Airport to Makkah
- Home › Jeddah › Neighbourhoods › Al-Balad
- Home › Guides › Miqat & Ihram from Jeddah

---

## 5. ENTITY RELATIONSHIP MAP (knowledge-graph alignment)

```
                 ┌─────────────────────────┐
                 │  Taxi Saudi Arabia      │ (Service / LocalBusiness — YOU)
                 └───────────┬─────────────┘
              operates from  │  serves
        ┌────────────────────┼─────────────────────┐
        ▼                    ▼                      ▼
  [JED Airport] ──gateway──► [Makkah] ◄──ziyarat── [Madinah]
        │ has-terminal           │ contains             │ contains
        ▼                        ▼                      ▼
 North/Hajj Terminal     Masjid al-Haram / Kaaba   Masjid an-Nabawi
        │                        ▲
   located-in                    │ requires (for pilgrim)
        ▼                        │
   [Jeddah] ──contains──► neighbourhoods ──   [Miqat → Ihram]  (on Jeddah–Makkah road)
        │ on-coast-of
        ▼
   [Red Sea] ── landmark ──► Corniche, King Fahd Fountain, Al-Balad (UNESCO)
```

**Entity reinforcement strategy:** on every Jeddah page, name JED + Jeddah + (Makkah OR Madinah) + one attribute (fixed price / meet & greet) in the first 100 words. This co-occurrence repeatedly teaches search engines: *Taxi Saudi Arabia = Jeddah airport ↔ Makkah/Madinah transport.*

**Knowledge-graph hooks:** match `sameAs` in Organization schema to Wikipedia/Wikidata entities for Jeddah, JED airport, Makkah → helps Google connect your brand to established entities.

---

## 6. GEO / LOCAL SEO STRUCTURE (Jeddah)

| Page type | URL | Local entities / modifiers |
|---|---|---|
| City pillar | `/locations/jeddah` | Jeddah, Makkah Province, Red Sea |
| Airport | `/airports/jeddah` | JED, King Abdulaziz, North Terminal, Hajj Terminal |
| Subarea (near-me) | `/locations/jeddah/al-balad` … | district name + "taxi near me", "pickup from [area]" |
| Landmark | section on subarea/city | Corniche, King Fahd Fountain, Al-Balad, Red Sea Mall |
| Service-area | pillar "Areas we cover" list | all 11 subareas + airport + port |
| Haramain station | `/routes/jeddah-to-haramain-station` | Sulaymaniyah HSR station |

**Hyperlocal NLP phrases / local intent FAQs:** "taxi near me in Al-Balad", "Corniche se airport taxi", "Obhur beach to JED airport", "taxi from [hotel] to Masjid al-Haram", "late night taxi in Jeddah".
**Google Business Profile signal:** keep NAP identical to site (Taxi Saudi Arabia + taxisaudiarabia.com + same WhatsApp); service-area = Jeddah + Makkah + Madinah.

---

## 7. PROGRAMMATIC SEO — Subarea template (build 11 at once)

**Pattern:** `/locations/jeddah/[subarea]` — one data object per subarea, one template renders all.

**Data fields per subarea:** `name, slug, type(historic/beach/business/residential), landmarks[], nearestAirportMin, makkahMin, popularFor, fareNote`.

**Template page spec (auto-filled):**
- **Title:** `{Subarea} Jeddah Taxi | Airport & Makkah Transfers – Taxi Saudi Arabia`
- **H1:** `Taxi in {Subarea}, Jeddah`
- **TL;DR:** "Book a fixed-price taxi in {Subarea}, Jeddah — about {nearestAirportMin} min to JED Airport and {makkahMin} min to Makkah. 24/7 pickup, meet & greet, English/Urdu drivers."
- **Sections:** Pickup in {Subarea} → Nearby landmarks {landmarks} → {Subarea} → Airport → {Subarea} → Makkah → Fares → FAQ
- **FAQs (templated):** Taxi fare from {Subarea} to JED? · How far is {Subarea} from Makkah? · 24/7 pickup in {Subarea}? · Which car for family/luggage?
- **Schema:** `Service` + `BreadcrumbList` + `FAQPage`
- **Links:** UP → Jeddah pillar; SIDE → 2–3 neighbouring subareas; DOWN → JED→Makkah, airport pillar
- **Word count:** 600–800 (thin-content safe via unique landmarks + distances)

**Other programmatic scales (later):** route × vehicle ("Jeddah to Makkah by GMC Yukon"), hotel-transfer pages ("[Makkah hotel] from JED airport"), "near me" pages per landmark.

---

## 8. NLP / AEO OPTIMIZATION RULES (apply to every Jeddah page)

1. **Answer-first:** first paragraph = direct factual answer (the TL;DR), no marketing fluff.
2. **Chunkable H2/H3:** one question or one fact per heading → AI extracts cleanly.
3. **Question-format headings:** "How much is a taxi from Jeddah airport to Makkah?" (matches PAA + voice).
4. **Definition blocks:** bold the entity + one-sentence definition near top.
5. **Facts as tables:** distance/time/price tables = featured-snippet + AI-citation gold.
6. **Conversational long-tail:** seed phrases people *say* — "kitna time lagta hai", "is there a taxi at night", "can the driver wait".
7. **Consistent entities:** always "King Abdulaziz International Airport (JED)" on first mention, then "JED" — teaches the alias.
8. **Trust signals inline:** "fixed price, no surge", "flight tracked", "24/7" repeated as attributes, not adjectives.

---

## 9. EEAT FOR JEDDAH

- **Experience:** real Jeddah trip examples ("typical JED→Makkah at 2 AM"), real photos (not stock) of cars at the airport.
- **Expertise:** Miqat/Ihram guide, terminal guide = domain knowledge competitors lack.
- **Authority:** consistent NAP, license/operator info on /about, link to official airport + Visit Saudi.
- **Trust:** fixed-fare policy page, Jeddah-specific reviews/testimonials, WhatsApp + booking ref, clear cancellation.
- **Author/Person schema:** attribute guides to a named operator/editor (use `personSchema` already in `lib/schema.ts`).

---

## 10. CONTENT PUBLISHING PRIORITY (Jeddah roadmap)

| Wave | Pages | Why |
|---|---|---|
| **Wave 1 — money (week 1)** | Jeddah pillar, Airport pillar (JED), JED→Makkah, JED→Madinah | 80% of revenue intent; quick wins, highest commercial value |
| **Wave 2 — support (week 2)** | JED→city/hotels route, Umrah-from-Jeddah block, Terminals guide, Miqat guide | feeds authority into Wave 1; fills semantic gaps competitors miss |
| **Wave 3 — local scale (week 3)** | 11 subarea pages (programmatic), Haramain-station route, city-tour | "near me" + long-tail volume; low competition |
| **Wave 4 — info/trust (week 4)** | fare guide, "how to get JED→Makkah" comparison, first-Umrah guide, Jeddah reviews | AEO/GEO citations + EEAT, top-of-funnel capture |

**Quick wins (low comp / high intent):** Miqat-from-Jeddah guide, JED terminals guide, subarea "near me" pages, "taxi vs Haramain train" comparison.
**Semantic gaps to own:** Miqat/Ihram stop on the airport route, Hajj Terminal pickup, night-arrival reliability, big-family-luggage vehicle choice.

---

## 11. SCHEMA CHECKLIST (Jeddah pages)

| Page | Schema types |
|---|---|
| Jeddah pillar | LocalBusiness/TaxiService, Place, BreadcrumbList, FAQPage |
| Airport (JED) | Service, BreadcrumbList, FAQPage (+ Airport entity in body) |
| Route pages | TouristTrip/Trip, FAQPage, BreadcrumbList |
| Subarea pages | Service, BreadcrumbList, FAQPage |
| Guides | Article, BreadcrumbList, (Person author) |
| Umrah service | Service, FAQPage, BreadcrumbList |

(Most builders already exist in `lib/schema.ts` — reuse, don't rebuild.)

---

### ✅ Definition of "Jeddah done"
Wave 1–4 published · all up/down/side internal links wired · schema on every page · NAP consistent · TL;DR + FAQ on every page · subarea programmatic template live. **Then move to next location (Makkah).**
