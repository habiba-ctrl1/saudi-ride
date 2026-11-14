import type { BlogPost } from "../types";

// Rewritten 2026-10-02. Removed time-sensitive, unverifiable project claims
// (budget figure, "Sindalah nearing completion", NEOM Bay airport flight
// status, "we offer dedicated transfers to operational zones"). Kept to what a
// traveller can act on; project status deferred to official NEOM channels.
// Distances: routes.ts (TUU→NEOM 120 km/80 min, Jeddah→NEOM 1,000 km/540 min,
// Riyadh→NEOM 1,300 km/720 min).
const post: BlogPost = {
  slug: "neom-the-line-visiting-saudi-arabia-city-of-future",
  title: "Travelling to NEOM and the Tabuk Region: Airports, Road Distances and Transfers",
  seoTitle: "Visiting NEOM: Airports, Distances & Transfers",
  excerpt:
    "How business visitors and travellers reach the NEOM area in Tabuk province: flying into Tabuk (TUU), road distances from Jeddah and Riyadh, site access and choosing a vehicle.",
  category: "City Guides",
  coverImage: "/blog/neom-the-line-visiting-saudi-arabia-city-of-future.webp",
  coverAlt: "Coastal development and marina on turquoise water beneath desert mountains at sunset",
  publishedAt: "2026-08-28",
  updatedAt: "2026-10-02",
  quickAnswer:
    "NEOM is a development region in Tabuk province, in Saudi Arabia's far north-west on the Red Sea and the Gulf of Aqaba. Most visitors fly into Tabuk Regional Airport (TUU) and continue by road — about 120 km, around 80 minutes, to the NEOM area. By road from Jeddah it is about 1,000 km, and from Riyadh about 1,300 km. Many locations are active project sites, so access usually needs to be arranged with your host in advance.",
  related: ["saudi-arabia-business-travel-transportation-guide", "saudi-arabia-intercity-transfer-guide", "alula-travel-guide-hegra-dadan-transport"],
  links: [
    { label: "Tabuk Airport to NEOM", href: "/routes/tabuk-airport-to-neom" },
    { label: "Tabuk Regional Airport (TUU)", href: "/airports/tabuk-regional" },
    { label: "Private car in the NEOM area", href: "/locations/neom" },
    { label: "Jeddah to NEOM", href: "/routes/jeddah-to-neom" },
    { label: "Riyadh to NEOM", href: "/routes/riyadh-to-neom" },
  ],
  cta: {
    kind: "corporate",
    intro: "Hello, I need transport to the NEOM area.",
    from: "Tabuk Airport (TUU)",
    to: "NEOM area — site / location:",
    heading: "Travelling to NEOM for work?",
    text: "Send your flight, the exact site or location, your host company and the dates. We confirm a suitable vehicle and a fixed fare; companies can request a written quote.",
  },
  content: `
## What NEOM is, for a traveller

NEOM is one of Saudi Arabia's giga-projects: a large development region in **Tabuk province**, covering coast and mountains along the Red Sea and the Gulf of Aqaba. It includes several named projects at different stages of development. For up-to-date information on what is open and what is still under construction, use NEOM's official channels — plans and timelines change.

Most people travelling to the area today are **business visitors**: consultants, engineers, suppliers and project staff, plus some leisure travellers exploring the Tabuk region's coast and mountains.

## Getting there

| From | Mode | Distance / time | Notes |
|---|---|---|---|
| **Tabuk Regional Airport (TUU)** | [Private transfer](/routes/tabuk-airport-to-neom) | ~120 km · ~80 min | The usual gateway |
| **Jeddah** | [Road](/routes/jeddah-to-neom) | ~1,000 km · ~9 hr | A full day on the coast road |
| **Riyadh** | [Road](/routes/riyadh-to-neom) | ~1,300 km · ~12 hr | Most travellers fly instead |
| **Madinah** | Road via Tabuk | Long — plan an overnight | Combine with AlUla if sightseeing |

Check current flight schedules into Tabuk and any airports serving the NEOM area before you plan.

## Site access

Many NEOM locations are **active construction and project sites**. Before you travel:

- Confirm with your host **exactly where you are going** — a site name, gate or a map pin, not just "NEOM".
- Ask whether you need a **visitor pass, permit or escort**, and bring the reference with you.
- Share the host's **contact number** when you book, so the driver can call ahead at the gate.

A driver can take you to the access point your host specifies; they cannot arrange entry permissions on your behalf.

## Choosing a vehicle

Distances are long and some approach roads are rougher than main highways, so most visitors choose a **full-size SUV** for comfort and ground clearance; teams travel in a **van**. See [vehicle classes](/fleet).

## Planning tips

- **Leave margin** between your flight and any site appointment.
- **Fuel, food and prayer stops** — on long road legs, plan them with the driver.
- **Mobile coverage** can be patchy on remote stretches; save documents and contacts offline.
- **Multi-day visits** — book the airport transfers and daily site runs together so one contact manages the whole trip.

## Exploring the wider region

The Tabuk region also has historic sites, a long Red Sea coastline and mountain scenery, and it connects north to Jordan. For cross-border options see [Tabuk to Aqaba](/routes/tabuk-to-aqaba) and [NEOM to Aqaba](/routes/neom-to-aqaba); you carry your own valid documents.

## Common questions

### How far is NEOM from Tabuk Airport?

About 120 km — around 80 minutes by road.

### Can I visit NEOM as a tourist?

It depends on which part and what is open at the time. Check NEOM's official channels before planning a leisure trip.

### Can companies book regular transport to NEOM sites?

Yes — send the pattern of trips and we return a written quote. Company invoices are available on request.
`,
};

export default post;
