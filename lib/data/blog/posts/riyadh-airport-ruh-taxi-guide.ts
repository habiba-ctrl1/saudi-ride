import type { BlogPost } from "../types";

// Rewritten 2026-10-02. Figures from routes.ts via the Riyadh cluster
// (RUH→city 35 km ~30 min; RUH→KAFD hotels 40 km ~35 min). Metro Line 4
// (Yellow) KAFD↔Airport T1-2, opened 1 Dec 2024 — seo/venues.md.
const post: BlogPost = {
  slug: "riyadh-airport-ruh-taxi-guide",
  title: "Riyadh Airport (RUH) Arrival Guide: Taxi, Private Transfer & Metro to the City and Hotels",
  seoTitle: "Riyadh Airport (RUH) Taxi Guide: City Centre & Hotels",
  excerpt:
    "Arriving at King Khalid International Airport (RUH): terminals, private transfer vs taxi rank vs app vs metro, drive times to Olaya, KAFD and the Diplomatic Quarter, and departure timing.",
  category: "Airport Transfers",
  coverImage: "/blog/riyadh-airport-ruh-taxi-guide.webp",
  coverAlt: "Cars at the kerb outside a modern airport terminal with a lattice canopy roof",
  publishedAt: "2026-06-02",
  updatedAt: "2026-10-02",
  quickAnswer:
    "King Khalid International Airport (RUH) is about 35 km north of central Riyadh — around 30 minutes off-peak, longer at commuter peaks. KAFD and its hotels are about 40 km away. You can take a pre-booked private transfer (fixed fare, straight to your hotel), the taxi rank, a ride-hailing app, or the Riyadh Metro's Yellow Line, which links the airport with KAFD.",
  related: ["vip-airport-meet-greet-saudi-arabia", "saudi-arabia-business-travel-transportation-guide", "riyadh-to-diriyah-visitor-transport-guide"],
  links: [
    { label: "Riyadh Airport (RUH) transfers", href: "/airports/king-khalid-riyadh" },
    { label: "RUH to central Riyadh", href: "/routes/riyadh-airport-to-city" },
    { label: "RUH to KAFD and Olaya hotels", href: "/routes/riyadh-airport-to-kafd-hotels" },
    { label: "Riyadh hotel transfers", href: "/locations/riyadh/hotel-transfer" },
    { label: "Chauffeur for KAFD meetings", href: "/locations/riyadh/kafd" },
    { label: "Riyadh chauffeur service", href: "/locations/riyadh" },
  ],
  cta: {
    intro: "Hello, I'd like a fixed fare from Riyadh Airport (RUH).",
    from: "Riyadh Airport (RUH) — terminal:",
    to: "Riyadh hotel",
    heading: "Book your RUH pickup",
  },
  content: `
## RUH at a glance

| | |
|---|---|
| **Airport** | King Khalid International Airport (RUH), north of Riyadh |
| **Terminals** | 1 and 2, 3 and 4 (international, depending on airline), 5 (domestic) |
| **To central Riyadh** | ~35 km · ~30 min off-peak |
| **To KAFD and Olaya hotels** | ~40 km · ~35 min off-peak |
| **Metro** | Line 4 (Yellow) runs between the airport (Terminals 1–2) and KAFD |

Check your boarding pass or airline for your terminal — it decides where you are met.

## Getting into the city: four options

### Pre-booked private transfer

You agree a fixed fare before you travel, the driver's details are shared with you on WhatsApp before pickup, and you go straight from the terminal to your hotel or office. Share your **flight number** when you book and we check it before pickup. Best for: business arrivals, families, late-night flights, anyone with more than a carry-on. See [RUH transfers](/airports/king-khalid-riyadh).

### Taxi rank

Available outside arrivals. Convenient if you haven't booked, but the price is not agreed in advance in the same way, and queues build when several flights land together.

### Ride-hailing apps

Work well if you have mobile data and light luggage. Pickups are from designated areas, and prices can rise at busy times.

### Riyadh Metro (Yellow Line)

Line 4 connects the airport with **KAFD**, where it meets the Blue and Purple lines. It is a good choice if you are travelling light to KAFD or along the metro network — less so with large suitcases, children, or a hotel that is a long walk from a station.

## Drive times to the main districts

The off-peak figures below come from our route data. Riyadh's weekday morning and late-afternoon peaks on the northern roads can add significantly to them.

| From RUH to | Distance | Off-peak drive |
|---|---|---|
| [Central Riyadh](/routes/riyadh-airport-to-city) | ~35 km | ~30 min |
| [KAFD and Olaya hotels](/routes/riyadh-airport-to-kafd-hotels) | ~40 km | ~35 min |

For the [Diplomatic Quarter](/locations/riyadh/diplomatic-quarter), [Al Murabba](/locations/riyadh/al-murabba) or [Diriyah](/locations/riyadh/diriyah), give us the exact address and we will plan the route.

## Business arrivals

Most RUH arrivals are business trips, and the airport transfer often turns into the first part of a working day:

- **Straight to a meeting?** Book the airport transfer with a few hours added, so the same car takes you on to the office and then the hotel. See our [business travel guide](/blog/saudi-arabia-business-travel-transportation-guide).
- **Arriving with a team?** One SUV or van, or several cars timed to the same flight.
- **Expenses.** You can get an **electronic receipt** on request, and companies can request an invoice.

## Departing from RUH

For an international flight, most travellers leave central Riyadh **around 3 hours before departure** — more at commuter peaks or if you are flying from a busy terminal. Tell us your flight time and terminal and we will suggest a pickup time and drop you at the right departures level.

## Practical tips

- **Night arrivals** are common; booking 24/7 is normal.
- **Women travelling alone** can book a private car and share the driver's details with family before pickup.
- **Families** usually choose an SUV or van — see [vehicle classes](/fleet).
- **Connectivity:** RUH has Wi-Fi; buy a local SIM or set up an eSIM before you need maps and messaging.

## Common questions

### How far is Riyadh airport from the city centre?

About 35 km — around 30 minutes off-peak, longer at rush hour.

### How long from RUH to KAFD?

About 40 km — around 35 minutes with clear roads. The Metro Yellow Line also links the airport with KAFD.

### Can I book a pickup at any terminal?

Yes. Tell us your terminal number when you book so you are met at the right arrivals hall.
`,
};

export default post;
