# 05 — Duplication Map (Single Sources of Truth)

**The question you asked:** *"How many places must I edit today to change one price?"*
**The answer:** For Jeddah Airport → Makkah, **at least 8 files**, and even then the live calculator would still disagree because it reads a different constant.

There is **no single source of truth** for price, distance, duration, or fleet. Phone/city are *mostly* centralized. Below is every place each value is written.

---

## 1. PRICE — the worst offender

### Jeddah Airport → Makkah (one route, five different prices)

| Value shown | Meaning | File:line |
|---|---|---|
| **SAR 80** | "Airport Transfer" service card ("From SAR 80") — actually the sedan *minimum fare* | [home-page.tsx:69](../../components/sections/home-page.tsx#L69) ← [pricing.ts:13](../../lib/pricing.ts#L13) |
| **SAR 249** | Umrah service card | [home-page.tsx:75](../../components/sections/home-page.tsx#L75) |
| **SAR 249** | `ROUTES_DATA.basePrice` (route pages, location route cards, sitemap) | [routes.ts:10](../../lib/data/routes.ts#L10) |
| **SAR 249** | Homepage "top routes" list | [home-page.tsx:529](../../components/sections/home-page.tsx#L529) |
| **SAR 249 / 374** | Homepage FAQ ("sedan / Staria") | [home-page.tsx:189](../../components/sections/home-page.tsx#L189) |
| **SAR 249 / 374** | Root JSON‑LD FAQPage | [layout.tsx:153](../../app/layout.tsx#L153) |
| **SAR 249** | Location page FAQ (Makkah, Jeddah) | [locations/[city]/page.tsx:88](../../app/(marketing)/locations/[city]/page.tsx#L88),[:203](../../app/(marketing)/locations/[city]/page.tsx#L203) |
| **SAR 249** | Route page TLDR + FAQ | [routes/[slug]/page.tsx:43](../../app/(marketing)/routes/[slug]/page.tsx#L43),[:47](../../app/(marketing)/routes/[slug]/page.tsx#L47) |
| **SAR 180** ⚠️ | **What the live calculator actually returns** (`fixedRoutes.SEDAN`) | [pricing.ts:20](../../lib/pricing.ts#L20) |
| **SAR 199** | Arabic homepage "airport" card (different from EN 80) | [home-page.tsx:245](../../components/sections/home-page.tsx#L245) |

➡️ **8+ marketing sources say 249, the calculator says 180, the hero card says 80, Arabic says 199.** A user who reads the page and then uses the calculator sees the price *drop* from 249 to 180.

### Makkah → Madinah

| Value | Source | File:line |
|---|---|---|
| **SAR 499** | homepage top‑routes, homepage FAQ, layout FAQ, location FAQs | [home-page.tsx:530](../../components/sections/home-page.tsx#L530), [layout.tsx:169](../../app/layout.tsx#L169), [locations/[city]/page.tsx:89](../../app/(marketing)/locations/[city]/page.tsx#L89) |
| **SAR 350** ⚠️ | calculator `fixedRoutes.makkah-madinah.SEDAN` | [pricing.ts:21](../../lib/pricing.ts#L21) |
| basePrice | `ROUTES_DATA` (own value) | [routes.ts:533](../../lib/data/routes.ts#L533) |

### Riyadh ↔ Dammam (three prices)

| Value | Source | File:line |
|---|---|---|
| **SAR 320** | `ROUTES_DATA.basePrice` | [routes.ts:258](../../lib/data/routes.ts#L258) |
| **SAR 280** | calculator `fixedRoutes.riyadh-dammam.SEDAN` | [pricing.ts:23](../../lib/pricing.ts#L23) |
| **SAR 699** | homepage top‑routes list | [home-page.tsx:537](../../components/sections/home-page.tsx#L537) |

### Directional inconsistency *within one file*

`jeddah-to-riyadh` = **SAR 600** ([routes.ts:88](../../lib/data/routes.ts#L88)) but `riyadh-to-jeddah` = **SAR 550** ([routes.ts:308](../../lib/data/routes.ts#L308)) — the same road costs SAR 50 more one way than the other, in the same data file.

### The three price engines

| Engine | Used by | File |
|---|---|---|
| `PRICING_CONFIG` (baseFare + perKm + `fixedRoutes` + minimums) | `/api/pricing`, `/api/bookings` | [lib/pricing.ts](../../lib/pricing.ts) |
| `ROUTES_DATA[].basePrice` | route pages, location route cards, sitemap | [lib/data/routes.ts](../../lib/data/routes.ts) |
| Hard‑coded JSX strings | homepage cards, FAQs, JSON‑LD | [home-page.tsx](../../components/sections/home-page.tsx), [layout.tsx](../../app/layout.tsx) |

**Fix:** one module (e.g. `lib/data/routes.ts`) is authoritative for `{distance, duration, basePrice}` per route; `lib/pricing.ts` derives everything from it; every page and the JSON‑LD import from it. Delete `fixedRoutes` price literals and all hard‑coded price strings.

---

## 2. DISTANCE / DURATION (three definitions per route)

For Jeddah Airport → Makkah:

| Distance | Source | File:line |
|---|---|---|
| **80 km** | `ROUTES_DATA` | [routes.ts:8](../../lib/data/routes.ts#L8) |
| **85 km** | homepage top‑routes + homepage FAQ + layout JSON‑LD | [home-page.tsx:529](../../components/sections/home-page.tsx#L529), [layout.tsx:153](../../app/layout.tsx#L153) |
| **85 km / 75 min** | `/api/pricing` & `/api/bookings` `fixedRouteDetails` | [api/pricing/route.ts:7](../../app/api/pricing/route.ts#L7), [api/bookings/route.ts:9](../../app/api/bookings/route.ts#L9) |
| **~80 km / ~1 hr** | location + route TLDR copy | [locations/[city]/page.tsx:68](../../app/(marketing)/locations/[city]/page.tsx#L68) |

`fixedRouteDetails` is **duplicated verbatim** in both `/api/pricing` and `/api/bookings` — change one, forget the other.

---

## 3. FLEET / VEHICLE NAMES (five inconsistent lists)

| List | Vehicles | File:line |
|---|---|---|
| Homepage hero fleet | Mercedes S‑Class, Mercedes V‑Class, Sprinter, Cadillac Escalade, GMC Yukon | [home-page.tsx:541‑582](../../components/sections/home-page.tsx#L541) |
| `/book` bookable classes | Toyota Camry, GMC Yukon, Hyundai Staria, Mercedes S‑Class, Coaster | [book/page.tsx:60‑66](../../app/book/page.tsx#L60) |
| DB seed (`ensureVehiclesSeeded`) | Toyota Camry, GMC Yukon, Hyundai Staria, Mercedes S‑Class, VIP Bus | [lib/db.ts:14‑74](../../lib/db.ts#L14) |
| `lib/data/site.ts` marketing fleet | Toyota Camry, GMC Yukon, Hyundai Staria | [site.ts:19‑35](../../lib/data/site.ts#L19) |
| Homepage FAQ / copy | adds **Toyota Hiace** (not bookable anywhere) | [home-page.tsx:201](../../components/sections/home-page.tsx#L201) |
| `lib/fleet-data.ts` (fleet pages) | *(separate again)* | [lib/fleet-data.ts](../../lib/fleet-data.ts) |

➡️ The homepage advertises a Mercedes/Cadillac fleet; the customer can only book Camry/Yukon/Staria. "Toyota Hiace" is named in copy but exists in no bookable list.

**Fix:** one `FLEET` array (name, class, capacity, luggage, image, price multiplier). Homepage, `/book`, fleet pages, and the DB seed all read it.

---

## 4. PHONE NUMBER (centralized, but with hard‑coded copies)

Intended SSOT: `contactConfig` — value `+966 53 938 8072` / `966539388072` ([contact.ts:2](../../lib/config/contact.ts#L2)). Value is **consistent**, but it's re‑hard‑coded in:

| Copy | File:line |
|---|---|
| Notifications default | [notifications.ts:41](../../lib/notifications.ts#L41) |
| WhatsApp button default | [WhatsAppButton.tsx:11](../../components/shared/WhatsAppButton.tsx#L11) |
| Footer WhatsApp link (literal) | [Footer.tsx:321](../../components/layout/Footer.tsx#L321) |
| JSON‑LD `telephone` | [layout.tsx:63](../../app/layout.tsx#L63) |
| Recovery contact | [contact.ts:15](../../lib/config/contact.ts#L15) |

**Severity: low** (values agree today) but a number change means editing ~5 places. Route all through `contactConfig`.

---

## 5. CITY NAMES — OK

City names/slugs are consistent across `sitemap.ts`, `locations/[city]`, `Footer`, and `subareas.ts`. Minor: the sitemap's `LOCATIONS`/`AIRPORTS`/`SUB_AREAS` arrays are hand‑maintained copies of the page data (drift risk — see [02 §D2](02-seo-findings.md)).

---

## 6. FAQ CONTENT — duplicated

The same Q&As (with the conflicting prices baked in) are written in: homepage FAQ ([home-page.tsx:182](../../components/sections/home-page.tsx#L182)), root JSON‑LD ([layout.tsx:136](../../app/layout.tsx#L136)), and per city/route page. Editing the answer to "how much is Jeddah→Makkah" means touching all of them.

---

## "How many places to change one price?" — scorecard

| To change… | Files to edit today | After the fix |
|---|:---:|:---:|
| Jeddah Airport→Makkah price | **8+** (and calculator still differs) | **1** |
| Any route's distance | **3** (routes.ts + both API copies) | **1** |
| A vehicle name | **5–6** | **1** |
| The phone number | **~5** | **1** |
| A stat (e.g. "56+ routes") | **3+** ([stats.ts:4](../../lib/config/stats.ts#L4), [home-page.tsx:40](../../components/sections/home-page.tsx#L40), sitemap comment) | **1** |

**Consolidation target:** `lib/data/routes.ts` (routes: distance/duration/price), one `FLEET` module, `lib/pricing.ts` deriving from routes, `contactConfig` for all contact, `stats.ts` computed from data. Pages and JSON‑LD import — never retype.
