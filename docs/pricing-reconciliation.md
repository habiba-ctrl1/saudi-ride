# Pricing Reconciliation — APPROVAL REQUIRED before any code change

**Status: ⛔ STOP — awaiting your approval.** Nothing below has been changed. Fill the **APPROVED** column (or write your own number) and tell me to proceed to A2.

Your rule noted: **no "fixed price" wording — only "From / starting" prices; the real price is quoted on WhatsApp.** All proposals below are framed as *"From SAR X"* floors.

---

## What the reconciliation revealed

1. **The same route has up to 5 different numbers.** Jeddah Airport → Makkah shows **80, 199, 249, 374** in marketing but the live calculator returns **180**.
2. **The calculator silently undercuts the marketing.** `lib/pricing.ts` (the engine) uses *lower* fixed numbers (180/350/280) than every page advertises (249/499/320). A customer reads 249, opens the tool, sees 180.
3. **A wrong number is live on the homepage:** Riyadh → Dammam is shown as **SAR 699** in the homepage "top routes", while routes.ts/calculator say **320/280**. 699 looks like a mistaken SUV/round-trip figure.
4. **"SAR 374 for a Hyundai Staria" is invented** — the engine's VAN price for that route is **250**. 374 matches nothing.
5. **Arabic ≠ English.** Arabic homepage cards say 199 (airport) and 1,499 (cross-border) where English says 80 and 180.
6. **A logic bug widens the mess:** `matchFixedRoute()` maps *any* pickup+dropoff containing "jeddah"+"makkah" to the airport price (180), so the city route (advertised 199) also returns 180.
7. **"From SAR 80" airport card** is really the *Madinah-airport→city* floor — true for that route, misleading next to Jeddah→Makkah.

---

## TABLE 1 — "From" (sedan) price per marketing route × every place it appears

Numbers are SAR. Blank = route not shown there. **PROPOSED** = my recommendation; **APPROVED** = you fill in.

| Route | Engine calc `pricing.ts` | Route data `routes.ts` | Homepage card | Homepage "top routes" | Homepage FAQ | JSON-LD FAQ `layout.tsx` | airports.ts | subareas.ts | Location FAQ | **PROPOSED "From"** | Rationale | **APPROVED** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Jeddah Airport → Makkah** | **180** (`pricing.ts:20`) | 249 (`routes.ts:10`) | 80 (`home:69`) / 249 (`home:75`) | 249 (`home:529`) | 249 (`home:189`) | 249 (`layout:154`) | 249 (`airports:13,31`) | 249 (`subareas:242,268`) | 249 (`locations:203`) | **249** | Matches ~10 places; raise calculator 180→249 so tool stops undercutting | |
| **Jeddah City → Makkah** | 180 (bug, same as airport) | 199 (`routes.ts:23`) | — | — | — | — | — | — | 199 | **199** | Keep distinct from airport; fix `matchFixedRoute` so it returns 199 not 180 | |
| **Makkah → Madinah** | **350** (`pricing.ts:21`) | 499 (`routes.ts:529`) | — | 499 (`home:530`) | — | 499 (`layout:170`) | — | — | 499 (`locations:89`) | **499** | Matches all copy; raise calculator 350→499 | |
| **Madinah → Jeddah Airport** | 350 (`pricing.ts:22`) | 549 (`routes.ts:36`) | — | 549 (`home:1408`) | — | — | — | — | — | **549** | Align calculator up to advertised 549 | |
| **Riyadh → Dammam** | **280** (`pricing.ts:23`) | 320 (`routes.ts:265`) | — | **699** (`home:537`) ⚠ | — | — | — | — | — | **320** | 699 is wrong; use 320, raise calculator 280→320 | |
| **Jeddah → Taif** | 220 (`pricing.ts:27`) | 200 (`routes.ts:62`) | — | 220 (`home:536`) | — | — | — | — | 180 (Makkah→Taif, `locations:313`) | **220** | Use 220 (calculator+homepage agree); bump routes.ts 200→220 | |
| **Madinah Airport → City** | ~distance | 80 (`routes.ts:371`) | — | 80 (`home:534`) | — | — | 80 (`airports:48,65`) | — | 80 (`locations:128`) | **80** | Already consistent | |
| **Riyadh Airport → City** | ~distance | 100 (`routes.ts:239`) | — | 100 (`home:535`) | — | — | — | — | 100 (`locations:168`) | **100** | Already consistent | |

⚠ = a value I believe is simply wrong and should be corrected regardless.

---

## TABLE 2 — Per-vehicle authoritative set (route × class)

Today only `lib/pricing.ts` holds per-vehicle numbers (this is what the calculator returns). I propose adopting **one** table like this as the single source, with the **sedan bumped to the advertised "From" value** from Table 1 and the other classes kept from `pricing.ts` (or scaled). Fill APPROVED per cell or per row.

| Route | SEDAN (now → **proposed**) | SUV (now) | VAN (now) | LUXURY (now) | BUS (now) | **APPROVED (all 5)** |
|---|---|---|---|---|---|---|
| Jeddah Airport → Makkah | 180 → **249** | 280 | 250 | 450 | 700 | |
| Makkah → Madinah | 350 → **499** | 500 | 450 | 800 | 1200 | |
| Madinah → Jeddah Airport | 350 → **549** | 500 | 450 | 800 | 1200 | |
| Riyadh → Dammam | 280 → **320** | 400 | 350 | 650 | 950 | |
| Riyadh → Jeddah | 600 (keep) | 900 | 800 | 1400 | 2000 | |
| Riyadh → Dubai | 1200 (keep) | 1800 | 1600 | 2800 | 4000 | |
| Dammam → Doha | 500 (keep) | 750 | 650 | 1200 | 1800 | |
| Jeddah → Taif | 220 (keep) | 320 | 280 | 500 | 750 | |

> The other **~59 routes** have only ONE price today (`routes.ts basePrice`, sedan) with **no conflict**. Proposal: engine derives their SUV/VAN/LUXURY/BUS from the sedan base × a fixed multiplier per class (e.g. SUV ×1.5, VAN ×1.35, LUXURY ×2.5, BUS ×3.8 — tune to the table above). One number per route, everything else derived. **Approve the multipliers or give me your own.**

---

## Category "From" cards on the homepage (teasers, not routes)

| Card | Now (EN) | Now (AR) | **PROPOSED** | Rationale | **APPROVED** |
|---|---|---|---|---|---|
| Airport Transfer | From SAR 80 (`home:69`) | 199 (`home:405`) | **From SAR 80** | True floor (Madinah airport→city); unify AR to 80 | |
| Umrah Taxi | From SAR 249 (`home:75`) | 249 | **From SAR 249** | = Jeddah→Makkah | |
| Private/VIP | From SAR 599 (`home:81`) | 599 | **?? need your floor** | No route backs 599 — what's your cheapest private-hire? | |
| Corporate | From SAR 799 (`home:87`) | 799 | **?? need your floor** | No route backs 799 | |
| GCC Cross-Border | From SAR 180 (`home:93`) | 1,499 (`home:429`) | **?? need your floor** | EN 180 vs AR 1,499 — huge gap; cheapest border route is Dammam→Bahrain | |
| Day Tours | From SAR 349 (`home:99`) | 999 (`home:435`) | **?? need your floor** | No route backs 349/999 | |

For the four **??** rows I need your real starting price (or I'll set them to the cheapest matching route the engine computes).

---

## Explicit list of prices that would CHANGE from what was advertised (if you approve my proposals)

| Where | Old (customer saw) | New | Direction |
|---|---|---|---|
| Calculator: Jeddah Airport→Makkah sedan | 180 | 249 | 🔺 up |
| Calculator: Makkah→Madinah sedan | 350 | 499 | 🔺 up |
| Calculator: Madinah→Jeddah Airport sedan | 350 | 549 | 🔺 up |
| Calculator: Riyadh→Dammam sedan | 280 | 320 | 🔺 up |
| Homepage top-routes: Riyadh→Dammam | 699 | 320 | 🔻 down (fixing an error) |
| Homepage FAQ: "SAR 374 Staria" | 374 | 250 (real VAN) | 🔻 down (removing invented number) |
| routes.ts: Jeddah→Taif | 200 | 220 | 🔺 up |
| Arabic airport card | 199 | 80 | 🔻 down (unify with EN) |
| Arabic cross-border card | 1,499 | (your floor) | 🔻 likely down |

**Nothing here ships until you approve.** Most changes raise the *calculator* to match what the site already advertises, so most public "From SAR 249/499" copy stays the same — the tool just stops contradicting it.

---

## Files the engine will replace in A3 (scope preview, no action yet)

`lib/pricing.ts` · `lib/data/routes.ts` · `components/sections/home-page.tsx` (cards, top-routes, FAQ, AR cards, 2nd route block) · `app/layout.tsx` (meta + JSON-LD FAQ) · `app/(marketing)/routes/[slug]/page.tsx` · `app/(marketing)/locations/[city]/page.tsx` · `lib/data/airports.ts` · `lib/data/subareas.ts` · `app/pricing/page.tsx` · `app/fleet/[slug]/page.tsx` + `lib/fleet-data.ts` · WhatsApp templates in `PriceCalculator.tsx` · `lib/notifications.ts` (email already uses the dynamic total — fine).

*(Implementation note for A2: your brief says `src/lib/pricing/`. This repo has no `src/` — everything is under the project root. I'll build it as `lib/pricing/` to match the existing layout unless you want a `src/` introduced.)*

---

### 👉 What I need from you
1. Confirm the **PROPOSED "From"** values in Table 1 (or edit them).
2. Confirm **Table 2** per-vehicle sets + the **multipliers** for the other 59 routes.
3. Give me the **four ?? category floors** (Private, Corporate, Cross-Border, Day Tours).

Reply with approvals (even just "sab theek, proceed" if you accept all proposals) and I'll build the engine (A2 → A3 → A4) and Part B.
