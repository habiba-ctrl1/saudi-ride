import type { BlogPost } from "../types";

// New 2026-10-02 (approved new-article #9). Hub above the route + distance
// pages; does not duplicate individual route articles — links down to them.
// Every distance/time from lib/data/routes.ts.
const post: BlogPost = {
  slug: "saudi-arabia-intercity-transfer-guide",
  title: "Saudi Arabia Intercity Transfer Guide: Riyadh, Jeddah, Makkah, Madinah & AlUla",
  seoTitle: "Saudi Arabia Intercity Transfer Guide: Routes, Times & Tips",
  excerpt:
    "Planning a private transfer between Saudi cities: distances and drive times for the main routes, car vs train vs plane, what affects journey time, vehicles, luggage, families and how booking works.",
  category: "Routes",
  coverImage: "/services/intercity-hero.webp",
  coverAlt: "Black SUV on a desert highway beside a railway line at sunset",
  publishedAt: "2026-10-02",
  quickAnswer:
    "An intercity transfer is a private car with a driver between two cities, priced as one fixed fare agreed before booking. The busiest routes are Jeddah–Makkah (about 80 km), Makkah–Madinah (about 430 km, around 4 hours), Riyadh–Dammam (about 390 km) and Madinah–AlUla (about 330 km). For distances above roughly 800 km, such as Riyadh–Jeddah, flying is usually faster for individuals; the car wins for families, groups, luggage and door-to-door trips.",
  related: ["madinah-to-makkah-taxi-price-distance-time", "jeddah-to-madinah-taxi-guide-fares", "riyadh-to-dubai-taxi-gcc-road-trip"],
  links: [
    { label: "Intercity transfer service", href: "/services/intercity" },
    { label: "All routes with distances", href: "/routes" },
    { label: "Distance guides between cities", href: "/distance" },
    { label: "Long-distance transfers", href: "/services/long-distance" },
    { label: "Cross-border transfers", href: "/services/border-crossings" },
    { label: "Vehicle categories", href: "/fleet" },
  ],
  cta: {
    intro: "Hello, I'd like a fixed fare for an intercity transfer.",
    heading: "Ask for your route fare",
    text: "Send the two cities (with exact pickup and drop-off), date and time, passengers, bags and any stops. We confirm the vehicle and a fixed fare before you book.",
  },
  content: `
## When travellers use intercity transfers

- **Pilgrims** moving between Jeddah, Makkah and Madinah.
- **Families and groups** who want to stay together with all their luggage.
- **Business travellers** on Riyadh–Eastern Province or Jeddah–KAEC trips who want to work on the way.
- **Tourists** linking Madinah and AlUla, or Jeddah and Taif.
- **Anyone arriving late** who doesn't want to wait for a train or a morning flight.

## The main routes

### The Hejaz (west)

| Route | Distance | Typical drive | Details |
|---|---|---|---|
| Jeddah Airport → Makkah | ~80 km | ~1 hr | [Route](/routes/jeddah-airport-to-makkah) |
| Jeddah → Makkah | ~85 km | ~1 hr 10 min | [Route](/routes/jeddah-to-makkah) · [Distance](/distance/jeddah-to-makkah) |
| Makkah → Madinah | ~430 km | ~4 hr | [Route](/routes/makkah-to-madinah) · [Guide](/blog/madinah-to-makkah-taxi-price-distance-time) |
| Jeddah Airport → Madinah | ~410 km | ~3 hr 50 min | [Route](/routes/jeddah-airport-to-madinah) · [Guide](/blog/jeddah-to-madinah-taxi-guide-fares) |
| Makkah → Taif | ~90 km | ~1 hr 10 min | [Route](/routes/makkah-to-taif) · [Distance](/distance/makkah-to-taif) |
| Jeddah → Taif | ~170 km | ~2 hr | [Route](/routes/jeddah-to-taif) · [Distance](/distance/jeddah-to-taif) |
| Jeddah → KAEC | ~120 km | ~1 hr 20 min | [Route](/routes/jeddah-to-kaec) |
| Madinah → Yanbu | ~240 km | ~2 hr 50 min | [Route](/routes/madinah-to-yanbu) |

### To AlUla and the north-west

| Route | Distance | Typical drive | Details |
|---|---|---|---|
| Madinah → AlUla | ~330 km | ~3 hr | [Route](/routes/madinah-to-alula) · [Distance](/distance/madinah-to-alula) |
| Jeddah → AlUla | ~700 km | ~6 hr 40 min | [Route](/routes/jeddah-to-alula) |
| Riyadh → AlUla | ~1,050 km | ~10 hr | [Route](/routes/riyadh-to-alula) · [Distance](/distance/riyadh-to-alula) |
| Madinah → Tabuk | ~620 km | ~5 hr 40 min | [Route](/routes/madinah-to-tabuk) |

### Riyadh and the east

| Route | Distance | Typical drive | Details |
|---|---|---|---|
| Riyadh → Dammam | ~390 km | ~3 hr 30 min | [Route](/routes/riyadh-to-dammam) · [Distance](/distance/riyadh-to-dammam) |
| Riyadh → Al Khobar | ~400 km | ~3 hr 40 min | [Route](/routes/riyadh-to-alkhobar) · [Distance](/distance/riyadh-to-alkhobar) |
| Riyadh → Al Ahsa | ~330 km | ~3 hr | [Route](/routes/riyadh-to-alahsa) |
| Riyadh → Buraydah | ~350 km | ~3 hr 10 min | [Route](/routes/riyadh-to-buraydah) |

### Long hauls across the Kingdom

| Route | Distance | Typical drive | Details |
|---|---|---|---|
| Riyadh → Jeddah | ~950 km | ~9 hr | [Route](/routes/riyadh-to-jeddah) · [Distance](/distance/riyadh-to-jeddah) |
| Riyadh → Makkah | ~870 km | ~8 hr | [Route](/routes/riyadh-to-makkah) · [Distance](/distance/riyadh-to-makkah) |
| Riyadh → Madinah | ~840 km | ~7 hr 30 min | [Route](/routes/riyadh-to-madinah) · [Distance](/distance/riyadh-to-madinah) |

For cross-border trips — Bahrain, Qatar, the UAE, Kuwait, Jordan — see [cross-border transfers](/services/border-crossings) and our [Riyadh to Dubai guide](/blog/riyadh-to-dubai-taxi-gcc-road-trip).

## Car, train or plane?

| | Private car | Haramain train | Domestic flight |
|---|---|---|---|
| Door to door | Yes | No — station at each end | No — airport at each end |
| Luggage | As much as the vehicle holds | Limits apply | Airline allowance |
| Timing | Whenever you want | Timetable | Timetable + check-in |
| Best distances | Up to ~450 km, or longer for groups | Jeddah, Makkah, KAEC, Madinah | 800 km+ for individuals |
| Best for | Families, groups, luggage, night arrivals | Light travellers on the Hejaz corridor | Solo business travellers on long routes |

## What affects journey time

- **City exits and entries.** Leaving central Makkah after a prayer, or crossing Riyadh at rush hour, can take longer than the open highway.
- **Stops.** A Miqat stop takes 20–40 minutes; a meal and prayer stop on long routes about the same.
- **Season.** Ramadan, Hajj and school holidays bring heavier traffic around the holy cities.
- **Time of day.** Night drives are quicker in summer and cooler, but tiring for the passengers.
- **Weather.** Occasional sandstorms or heavy rain slow traffic.

## Choosing the vehicle

For a four-hour drive, comfort and luggage space matter more than on a city ride.

- **1–3 people, light luggage:** executive sedan.
- **Family of 4–6:** full-size SUV.
- **Lots of luggage, a wheelchair or 7 people:** van.
- **8–17 people:** minibus or coaster.

Details in our [family and group vehicle guide](/blog/saudi-arabia-family-group-transport-guide) and on [vehicle categories](/fleet).

## Combining airports and cities

Some of the most efficient itineraries mix flights and road transfers:

- **Fly into Jeddah, out of Madinah** — JED → Makkah by car, Makkah → Madinah by car, fly home from MED.
- **Fly into Madinah, then AlUla by road** — and fly out of AlUla (ULH).
- **Fly into Riyadh, drive to the Eastern Province**, fly out of Dammam (DMM).

See the [Saudi Arabia airport transfer guide](/blog/saudi-arabia-airport-transfer-guide) for each airport.

## How booking works

1. Send the **exact pickup and drop-off** (hotel names or map pins), date, time, passengers, bags and stops.
2. We confirm the **vehicle and one fixed fare** before you book — no meter, no surge.
3. You receive the **driver's details** before pickup.
4. Pay **cash to the driver or by bank transfer**; **electronic receipts** on request; companies can request an invoice.
5. **Free cancellation up to 24 hours before pickup.**

## Common questions

### What is the most popular intercity route?

Jeddah Airport to Makkah, followed by Makkah ↔ Madinah.

### Can I stop on the way?

Yes — mention every stop when you book (Miqat, meals, a detour) so it is included in the fare.

### Is it safe to travel between cities at night?

The main highways are well-used day and night. Many families travel overnight in summer to avoid the heat.
`,
};

export default post;
