# Price Book Audit & Consolidation — 2026-09-20/21

Full audit and consolidation of every pricing source in the project, per the
"audit first, then consolidate, then implement" instruction. Nothing was
deleted or silently overwritten at any point.

---

## 1. Sources checked

| Source | What it is | Rows/entries |
|---|---|---|
| **A — Existing Price Book** | `PriceBookEntry` DB table, built 2026-09-20 from WhatsApp client-chat evidence; managed at `/admin/pricing-book` | 83 rows |
| **B — Naimatullah price sheet** | `drivers/naimatullah/price sheet.xlsx` — a driver/vendor **cost** rate card (sheet literally labeled "Vendor Rate (SAR)") | 16 routes × up to 3 vehicles = 37 rate lines |
| C, D | Not yet provided | — |

Source B's numeric cells were corrupted into Excel dates by a prior copy/paste (e.g. `540` had been stored with a date format and displayed as `1901-06-23`). Recovered by converting back via the Excel epoch and cross-checked against the sheet's own "Client Lookup" tab, which matched exactly — no data was guessed.

---

## 2. Pre-existing pricing infrastructure (audit, before any change)

The project had **four disconnected pricing systems** before this work, discovered by grep + live DB counts:

| System | Status found | Evidence |
|---|---|---|
| `FareRule` model | **Fully dead** — 0 rows, 0 code references anywhere in `app/`/`lib/` | Confirmed via `prisma.fareRule.count()` = 0 and repo-wide grep |
| `Route.basePrice` / `priceOnRequest` | **Read but not displayed** — 76 rows exist, but every route-card template (`RoutesClient.tsx`, `locations/[city]/page.tsx`) hardcodes the text "On WhatsApp" regardless of the stored number | `app/(en)/(marketing)/routes/RoutesClient.tsx:181-188` |
| `Vehicle.pricePerKm` / `basePrice` | **Admin-only** — editable in `/admin/vehicles` (5 DB rows), never read by any customer-facing calculation | `app/(en)/(dashboard)/admin/vehicles/AddVehicleForm.tsx:96-97` |
| `lib/pricing/*` calculator engine | **Orphaned** — its only entry point (`app/api/pricing/route.ts`) has zero live callers since the "WhatsApp-only quotes" decision (2026-08-15) | Confirmed no importers in `app/`/`components/` |

Two more static files carry pricing-shaped content but are not part of any "Price Book": `lib/fleet-data.ts` (18 vehicles, `startingPrice` field, powers `/fleet` — independent of the 5-row DB `Vehicle` table) and `lib/data/locations.ts` (SEO city pages — mostly "Quoted on WhatsApp," but a few FAQ sentences still hardcode SAR figures in prose, e.g. "starts from around SAR 249").

**Conclusion:** the 83-row `PriceBookEntry` table built 2026-09-20 was, and remains, the only real, actively-maintained pricing evidence store in the project. This audit did not touch `FareRule`, `Route`, `Vehicle`, or `lib/pricing/*` — they're flagged as separate legacy cleanup, not in scope here.

---

## 3. Normalization rules applied

**Cities** — collapsed to a canonical city for route-family grouping only (e.g. "Riyadh Airport," "Al-Irqah District, Riyadh," "W KAFD, Riyadh" → `Riyadh`). The *original* pickup/dropoff string is preserved untouched in the Pricing Source Details sheet — nothing was merged away.

**Intra-city trips** (e.g. a Riyadh district → Riyadh Airport) are labeled `"{City} (local / airport transfer)"` instead of the confusing `"Riyadh → Riyadh"`.

**Vehicles** — mapped from the existing controlled `vehicleType` values to the 3 standard categories:
- `Sedan` → Sedan
- `SUV`, `GMC Yukon XL` → GMC/SUV
- `Van`, `Staria` → Staria
- `Luxury`, `Unspecified`, `SUV/Van` (ambiguous) → kept **outside** the 3 standard columns, visible only in Pricing Source Details, flagged in each route's Notes
- `Recovery/Tow Truck` (1 entry: Ras Tanura → Safwa car-towing job) → **excluded entirely** — not a passenger taxi fare

**Trip type is part of the grouping key.** A one-way fare and a round-trip total are never comparable — a route with both (e.g. Dammam ↔ Abha, Tabuk ↔ Aqaba, Madinah → Al-Ula) appears as two separate rows, one per trip type. An earlier draft of this consolidation mistakenly blended one-way and round-trip prices into the same range (e.g. showed Dammam→Abha as "4,600–10,000 SAR"); this was caught and fixed before the workbook was finalized.

**Currency** — SAR throughout except one entry (a booked AlUla resort-to-resort transfer, 100 USD) which is Luxury/Unspecified category and stays out of the SAR aggregate columns.

---

## 4. Vendor cost vs. client price — the key distinction

Source B ("Vendor Rate (SAR)") is what a driver/vendor charges TSA, not what a client is charged. Blending it into the same "observed price" range as real client quotes would misrepresent cost as revenue. Per owner instruction (2026-09-20):

> Vendor cost + a flat **SAR 100 margin** = a *derived, suggested* client price.

This is applied and clearly labeled everywhere:
- `priceKind = VENDOR_COST` for the raw Naimatullah number (excluded from the client-price lowest/highest range; visible only in Pricing Source Details, shaded grey)
- `priceKind = DERIVED_SUGGESTED` for cost+100 (included in the lowest/highest range, but every note spells out "derived, not an actual client charge")
- `priceKind = CLIENT_OBSERVED` for the 83 real WhatsApp-chat quotes

---

## 5. Pricing conflicts found (flagged, not resolved)

6 route+vehicle+trip-type combinations show a >40% spread between lowest and highest observed price:

| Route (trip type) | Vehicle | Lowest | Highest | Why it matters |
|---|---|---|---|---|
| Madinah → Riyadh (one-way) | GMC/SUV | 1,400 | 2,600 | A real client was charged as low as 1,400 SAR while vendor cost + margin is 2,600 SAR — **worth checking this wasn't a loss-making booking** |
| Madinah → Tabuk (one-way) | Sedan | 450 | 850 | Large same-client negotiation swing (initial vs. discounted offer) |
| Riyadh → Doha, Qatar (one-way) | Sedan | 1,350 | 1,900 | Different clients paid notably different amounts |
| Tabuk → Aqaba, Jordan (one-way) | GMC/SUV | 1,100 | 2,200 | Two different client negotiations, large spread |

(Two more appear in the workbook's Route Review tab.) None of these were resolved automatically — they're flagged in the Excel for the company to decide.

---

## 6. Routes discovered / merged

- **46 unique route+trip-type combinations** after normalization (from 156 raw evidence rows: 83 chat quotes + 37 vendor-cost lines + 37 derived-margin lines − 1 excluded towing entry, some collapsing into the same route family).
- **31 normal Saudi routes**, **11 cross-border route families** (12 rows in the Cross Border sheet once Tabuk↔Aqaba's one-way/round-trip split is counted).
- No route was deleted. No route was invented — every row traces to a specific chat message or the Naimatullah sheet.

---

## 7. Deliverables

### A. Excel — `TAXI-SAUDI-PRICE-BOOK-APPROVAL.xlsx` (project root)
4 sheets: **Approval Price Book** (46 route rows, Sedan/GMC-SUV/Staria low-high, pricing status, notes) · **Pricing Source Details** (156 raw evidence rows, full traceability, vendor-cost rows shaded) · **Route Review** (46 rows, blank Company Decision / Final Approved Price columns for the client to fill in) · **Cross Border** (12 rows, country-from/to, Staria columns included since real evidence exists for one route).

### B. This file — `PRICE-BOOK-AUDIT.md`

### C. Backend implementation
- `PriceBookEntry` extended with `routeFamily`, `crossBorder`, `priceKind` (`CLIENT_OBSERVED` / `VENDOR_COST` / `DERIVED_SUGGESTED`) — migration `supabase/migrations/0018_route_price_approval.sql`, applied to the live DB.
- New `RoutePriceApproval` table — one row per (route family, trip type, vehicle category), holding `lowestObserved`/`highestObserved`/`sourceCount`/`pricingStatus` (observed/historical) separately from `finalApprovedPrice`/`approvalNotes` (only ever set by an admin — nothing here auto-promotes an observed price to "approved").
- All 83 Source A rows backfilled with `routeFamily`/`crossBorder` (existing `price`, `notes`, etc. untouched).
- Naimatullah's 37 rate lines inserted as **new** `PriceBookEntry` rows (both `VENDOR_COST` and `DERIVED_SUGGESTED`), never overwriting anything.
- Admin UI (`/admin/pricing-book`) extended with search/filter by pickup, destination, vehicle, and cross-border; a new **Route Review** view for the approval workflow (editable Final Approved Price / status / notes, filterable the same way).

---

## 8. Assumptions made (flag if wrong)

- **40% spread threshold** for "Conflicting Prices" vs. "Multiple Sources" — a judgment call, not a business rule you specified. Easy to change.
- Naimatullah sheet's file-modified date (2026-08-14) used as the "Date" for its evidence rows, since the sheet itself has no per-row date.
- `SUV/Van` (1 entry: Jubail → Dammam Airport, ambiguous vehicle) kept out of the 3 standard columns rather than guessed into one.
- Intra-city "local / airport transfer" grouping (4 routes: Abha, Jeddah, Madinah, Riyadh) groups different specific pickup points within the same city — flagged, not silently assumed correct.

## 9. Data intentionally NOT changed

- `FareRule`, `Route.basePrice`, `Vehicle.pricePerKm`/`basePrice`, `lib/pricing/*`, `lib/fleet-data.ts`, `lib/data/locations.ts` — all confirmed legacy/disconnected systems, left exactly as found. Cleaning these up is a separate decision, not bundled into this consolidation.
- No `PriceBookEntry` row's `price` or `notes` was edited — only new columns were backfilled (`routeFamily`, `crossBorder`, `priceKind`).
- Nothing was marked "Approved" — every `RoutePriceApproval.finalApprovedPrice` is null until the company fills in the Route Review sheet/UI.

## 10. Still pending

- Source C and Source D (not yet provided).
- Two open questions from earlier sessions: the Qatar-border trip's pickup city (1,500/2,000 SAR quote), and which page should host the Cadillac XTS VIP limousine partner vehicle.
