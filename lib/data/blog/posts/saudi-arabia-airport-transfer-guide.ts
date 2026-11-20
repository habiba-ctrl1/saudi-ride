import type { BlogPost } from "../types";

// New 2026-10-02 (approved new-article #1). Hub for the 9 airport pages.
// Every distance/time from lib/data/routes.ts; airport names/codes from
// lib/data/airports.ts. Flight wording = approved facts.md line. No free-waiting,
// name-sign or terminal-desk claims.
const post: BlogPost = {
  slug: "saudi-arabia-airport-transfer-guide",
  title: "Saudi Arabia Airport Transfer Guide for International Travellers",
  seoTitle: "Saudi Arabia Airport Transfer Guide for International Travellers",
  excerpt:
    "Arriving in Saudi Arabia: how airport transfers work at Jeddah, Riyadh, Madinah, Dammam, AlUla and other airports — distances to the city, Makkah and business districts, vehicles and booking.",
  category: "Airport Transfers",
  coverImage: "/services/airport-transfers-hero.webp",
  coverAlt: "Chauffeur in a suit holding a name card beside a black sedan inside an airport terminal",
  publishedAt: "2026-10-02",
  featured: true,
  quickAnswer:
    "Most international visitors land at Jeddah (JED), Riyadh (RUH), Madinah (MED) or Dammam (DMM). A pre-booked private transfer takes you from the terminal straight to your hotel, office, Makkah or another city at one fixed fare agreed before booking. Share your flight number and terminal when you book and we check the flight before pickup; choose the vehicle by passengers and luggage, not just seats.",
  related: ["vip-airport-meet-greet-saudi-arabia", "riyadh-airport-ruh-taxi-guide", "jeddah-to-madinah-taxi-guide-fares"],
  links: [
    { label: "Airport transfer service", href: "/services/airport-transfers" },
    { label: "Jeddah Airport (JED)", href: "/airports/king-abdulaziz-jeddah" },
    { label: "Riyadh Airport (RUH)", href: "/airports/king-khalid-riyadh" },
    { label: "Madinah Airport (MED)", href: "/airports/prince-mohammad-madinah" },
    { label: "Dammam Airport (DMM)", href: "/airports/king-fahd-dammam" },
    { label: "Hotel transfers", href: "/services/hotel-transfers" },
  ],
  cta: {
    intro: "Hello, I'd like to book an airport transfer in Saudi Arabia.",
    from: "Airport & terminal:",
    heading: "Request an airport transfer",
    text: "Send your flight number, arrival date, terminal, destination, passengers and bags. We confirm the vehicle and a fixed fare before you book.",
  },
  content: `
## How an airport transfer works

A private airport transfer is a car with a driver, booked before you fly, that takes you from the terminal to a specific address. In Saudi Arabia it is the most common way international visitors leave the airport, for three reasons: the main airports are some distance from where people stay, many flights land late at night, and a large share of arrivals are families or pilgrims with heavy luggage.

With Taxi Saudi Arabia, the process is:

1. **Send your details** — flight number, date, terminal, destination, passengers and bags.
2. **Agree the fare** — one fixed price for the trip, before you book. No meter, no surge.
3. **Get your driver's details** on WhatsApp before pickup. We check your flight before pickup, so an early or late landing is seen in advance.
4. **Land, clear immigration, collect bags,** message the driver and meet.
5. **Go straight to your destination** — hotel, office, Makkah, another city.

Bookings run **24/7**, drivers speak **English or Arabic**, and you can **cancel free of charge up to 24 hours before pickup**. Payment is **cash to the driver or by bank transfer**, with an **electronic receipt** on request.

## The main airports at a glance

| Airport | Code | Typical onward trips | Distance / drive |
|---|---|---|---|
| [King Abdulaziz International, Jeddah](/airports/king-abdulaziz-jeddah) | JED | Makkah · Jeddah city · Madinah · Taif | Makkah ~80 km / ~1 hr; city ~20 km / ~30 min |
| [King Khalid International, Riyadh](/airports/king-khalid-riyadh) | RUH | Central Riyadh · KAFD · Olaya | City ~35 km / ~30 min; KAFD ~40 km / ~35 min |
| [Prince Mohammad bin Abdulaziz, Madinah](/airports/prince-mohammad-madinah) | MED | Haram hotels · Makkah · AlUla | Markaziyah ~22 km / ~25 min; Makkah ~450 km |
| [King Fahd International, Dammam](/airports/king-fahd-dammam) | DMM | Dhahran · Al Khobar · Dammam · Jubail | Dhahran ~25 km / ~25 min; Jubail ~90 km / ~65 min |
| [AlUla International](/airports/alula) | ULH | AlUla resorts · Hegra tour points | Resort area ~30 km / ~30 min |
| [Tabuk Regional](/airports/tabuk-regional) | TUU | NEOM area · Tabuk | NEOM ~120 km / ~80 min |
| [Red Sea International](/airports/red-sea) | RSI | Red Sea resorts · AMAALA | AMAALA ~35 km / ~30 min |
| [Taif Regional](/airports/taif-regional) | TIF | Taif · Makkah | — |
| [Abha International](/airports/abha-regional) | AHB | Abha · Al Soudah | Al Soudah ~45 km / ~50 min |

Drive times are for normal traffic; city rush hours add time.

## Jeddah (JED): the gateway for Umrah

Jeddah handles the largest share of international pilgrims, so the airport's busiest hours are often at night. The key journey is **JED to Makkah** — about 80 km, around an hour — usually made **already in Ihram**, because the Miqat is crossed in the air before landing (see our [Miqat guide](/blog/complete-miqat-locations-guide-umrah-pilgrims)). Keep passports handy for the checkpoint on the road into Makkah.

Other common trips: Jeddah city and the Corniche (~20 km), [Madinah](/blog/jeddah-to-madinah-taxi-guide-fares) (~410 km, ~4 hr) and [Taif](/routes/jeddah-airport-to-taif) (~180 km). The Haramain high-speed railway also has a station at the airport — a good option for light travellers, though you need a car at the Makkah or Madinah end.

## Riyadh (RUH): business arrivals

RUH serves the capital and most business visitors. Central Riyadh is about 35 km away and KAFD about 40 km — 30–35 minutes off-peak, much longer at commuter peaks. The Riyadh Metro's Yellow Line links the airport with KAFD for light travellers. Many executives turn the airport transfer into the start of a working day by adding hours to the booking. Full detail in our [RUH arrival guide](/blog/riyadh-airport-ruh-taxi-guide).

## Madinah (MED): the gentle start

MED is close to the city: the hotels around Masjid an-Nabawi are about 22 km away. Many pilgrims start their trip here, then travel to Makkah by road with a stop at the Abyar Ali Miqat (see [Madinah to Makkah by car](/blog/madinah-to-makkah-taxi-price-distance-time)). Others go straight from [MED to Makkah](/routes/madinah-airport-to-makkah) — about 450 km.

## Dammam (DMM): the Eastern Province

DMM serves Dammam, Al Khobar, Dhahran and Jubail. Distances across the region vary a lot, so give the exact address. Business visitors often go straight to sites with controlled gates — share the gate and host details. See our [Eastern Province guide](/blog/eastern-province-corporate-visitor-transport-guide).

## AlUla, Tabuk, the Red Sea and the south

Smaller airports have **few on-demand taxis**, so a pre-booked transfer is essential rather than optional. At [AlUla (ULH)](/blog/alula-travel-guide-hegra-dadan-transport), resorts are spread through the valley; at Tabuk, the NEOM area is about 120 km away; at Red Sea International, resorts are reached by road from the terminal.

## Choosing the vehicle

Luggage decides more than seats, especially for Umrah.

| Vehicle category | Example models | Passengers | Large bags |
|---|---|---|---|
| Executive sedan | Toyota Camry, Ford Taurus, Genesis G80 | 3–4 | 2 |
| Full-size SUV | GMC Yukon XL, Cadillac Escalade | Up to 7 | 4–5 |
| Van | Hyundai Staria, Hyundai Starex | Up to 7 | 4–10 |
| Luxury sedan | Mercedes S-Class, BMW 7 Series | 3 | 2 |
| Minibus / coaster | Toyota Hiace, Toyota Coaster | 11–17 | 16–20 |

Capacities vary by model — check [vehicle categories](/fleet). Vehicles are provided through our partner network.

## What international travellers should prepare

- **Your flight number and terminal.** JED and RUH have several terminals; overnight flights often land on the next calendar day.
- **A way to be reached on landing.** A Saudi SIM, an eSIM, or the airport Wi-Fi with WhatsApp — see [SIM cards at Jeddah Airport](/blog/buying-sim-cards-jeddah-airport-stc-mobily-zain).
- **Your destination in writing.** Hotel name and area, or a map pin for a private address.
- **Documents in your hand luggage** — passport and hotel confirmation.
- **Some local currency** for small expenses — see our [riyal guide](/blog/saudi-riyal-cash-cards-guide-pilgrims).

## Private transfer, taxi rank, app or train?

| Option | Strengths | Weaknesses |
|---|---|---|
| **Pre-booked transfer** | Fixed fare, no queue, right-sized vehicle, door to door | Needs booking in advance |
| **Airport taxi rank** | No booking needed | Queues at busy times; price not agreed in the same way |
| **Ride-hailing app** | Often cheapest for short trips | Needs mobile data; pickup zones; prices rise with demand |
| **Train / metro** | Fast between stations (Haramain at JED, metro at RUH) | Car still needed at the other end; luggage limits |

For a solo traveller with a carry-on landing at midday, an app or train is perfectly reasonable. For families, pilgrims, night arrivals and business travellers, a pre-booked transfer usually wins.

## Departures

For an international departure, work back from your flight: allow time for check-in and security plus the drive, plus a margin for traffic. From Makkah, most travellers leave for JED 4–5 hours before departure; from central Riyadh, around 3 hours. Tell us your flight time and we suggest a pickup time.

## Groups and companies

Delegations, tour groups and Umrah groups can be met by several cars or a coaster timed to one flight. Companies can request a written quote and a company invoice — corporate invoicing can be arranged through our sister company. See our [event and conference transport guide](/blog/saudi-arabia-event-conference-transportation-guide).

## Common questions

### Do I need to book an airport transfer in advance?

At JED, RUH, MED and DMM it's strongly recommended, especially at night and in peak seasons. At smaller airports such as AlUla, it's essential — on-demand taxis are limited.

### What happens if my flight is delayed?

Share your flight number when you book and we check it before pickup, so the pickup is planned around your actual arrival.

### Can I pay by card?

Our transfers are paid in cash to the driver or by bank transfer. An electronic receipt is available on request.

### Can I book for someone else arriving?

Yes — give us the traveller's name, flight and phone number, plus your own number as a backup.
`,
};

export default post;
