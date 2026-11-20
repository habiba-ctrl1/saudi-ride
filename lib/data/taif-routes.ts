// Taif route pages (2026-11-21): Jeddah → Taif, Jeddah Airport → Taif,
// Madinah → Taif, Taif → Al Baha. Rendered by
// components/location/cluster/SouthernRoutePage.tsx from /routes/[slug].
//
// PROTECTED (CLAUDE.md rule 3): h1 and metaTitle below reproduce the titles/H1s
// these URLs already ranked with (GSC 3mo to 2026-11-15: jeddah-to-taif pos
// 8.7, jeddah-airport-to-taif 7.7, madinah-to-taif 8.6; taif-to-albaha has no
// GSC row → treated as ranking). Do not edit them without owner approval.
//
// Truth sources:
// - Distance/time: ROUTES_DATA only (rendered by the component, never typed here
//   except in prose, which mirrors routes.ts).
// - Service facts: seo/facts.md (fixed fare agreed before booking, 15–30 min free
//   waiting, flight tracking, meet & greet, EN/AR drivers, free cancellation to
//   24 h, cash/bank transfer, quote usually within 1–2 hours).
// - Roads: Al Hada road (Makkah → Taif escarpment) and the Al Sail road via
//   As-Sail Al-Kabir — visitsaudi.com (Al-Hada Mountain), saudipedia.com
//   (Aqabat al-Kurr: "al-Sayl Road … less challenging"). Non-Muslims may not
//   enter Makkah (Saudi law; en.wikivoyage.org/wiki/Ta'if notes the signed
//   bypass and checkpoint). We do NOT name a bypass route number — unverified.
// - Arab News reported a temporary Al Hada closure for expansion with traffic
//   sent via Al Sail → "closures happen; Al Sail is the alternative" only.
// - Qarn al-Manazil (As-Sail Al-Kabir) is the Miqat on the Taif/Najd side;
//   consistent with the site's Miqat guide. No rulings.
// - Al Baha: Aqabat al-Bahah descent described by saudipedia; we only say the
//   road runs south through the Sarawat highlands (route number unverified).
// - Vehicle models named (Toyota Camry, GMC Yukon XL, Hyundai Staria) are in
//   facts.md; seats/bags come from lib/fleet-data.ts at render time.
// - No prices, no hotel names, no terminal procedures, no licence/ownership.

import type { SouthernRoutePageData } from "@/lib/data/southern-cluster";

const INVOICE = "Corporate invoicing can be arranged through our sister company.";

const VEHICLES_MOUNTAIN: SouthernRoutePageData["vehicleGuide"] = [
  { fleetSlug: "toyota-camry", name: "Executive sedan (e.g. Toyota Camry)", fit: "One to three adults with normal luggage. Comfortable on the mountain road for a short transfer." },
  { fleetSlug: "gmc-yukon-xl", name: "Full-size SUV (e.g. GMC Yukon XL)", fit: "Families and anyone with several large cases — more room and a higher seat on the climb." },
  { fleetSlug: "hyundai-staria", name: "Van (e.g. Hyundai Staria)", fit: "Larger families and small groups who want everyone and the luggage in one vehicle." },
];

export const TAIF_ROUTE_PAGES: Record<string, SouthernRoutePageData> = {
  "jeddah-to-taif": {
    slug: "jeddah-to-taif",
    h1: "Jeddah to Taif",
    eyebrow: "Red Sea coast → Taif highlands",
    fromPlace: "Jeddah",
    toPlace: "Taif",
    ctaLabel: "Get my Jeddah to Taif quote",
    bestFor: "Families, summer stays, weekend trips, business visits",
    lead: "One private car and one driver from your Jeddah hotel or home up to the cooler Taif highlands — door to door, with the fare agreed before you book.",
    quickAnswer:
      "Jeddah to Taif is about 170 km by road, roughly 2 hours of driving. The road crosses inland towards Makkah and then climbs the Sarawat escarpment to Taif, either on the steep Al Hada road or the gentler Al Sail road. Taxi Saudi Arabia arranges a private car with driver from any Jeddah address to any Taif hotel, resort or home, with one fixed fare confirmed on WhatsApp before booking.",
    metaTitle: "Taxi Jeddah to Taif | Taxi Saudi Arabia",
    metaDescription:
      "Private car from any Jeddah hotel or home to Taif — about 170 km, 2 hours, up the Al Hada or Al Sail road. Sedan, SUV or van; one fixed fare agreed on WhatsApp.",
    stages: [
      { label: "Pickup", title: "Jeddah", desc: "Your hotel, home or office anywhere in Jeddah — the Corniche, Al Balad, Obhur or the city districts. Give us the exact address and the time you want to leave.", kind: "origin" },
      { label: "Inland", title: "Towards Makkah", desc: "The first part runs east across the coastal plain. Non-Muslim travellers cannot enter Makkah under Saudi law, so for them the driver takes the signed road that bypasses the city — tell us when you book and the route is planned around it.", kind: "road" },
      { label: "The climb", title: "Al Hada or Al Sail road", desc: "Al Hada climbs the escarpment in tight bends with wide views; the Al Sail road via As-Sail Al-Kabir is longer but gentler. Either way the air is noticeably cooler at the top.", kind: "road" },
      { label: "Drop-off", title: "Taif", desc: "Your hotel, resort or home in Taif city, Al Hada or Al Shafa, or Taif Regional Airport (TIF).", kind: "destination" },
    ],
    tradeOff: {
      heading: "Private car, rental car or bus from Jeddah to Taif?",
      body: [
        "A private car suits families, travellers with luggage and anyone who would rather not drive the mountain bends themselves. You leave at your own time, stop where you want and are dropped at the exact door, and you pay for the vehicle rather than per seat.",
        "A rental car is cheaper if you are confident on steep, winding roads and want the car in Taif for several days. Intercity buses cost less per person but run to their own timetable and stations, so you still need a taxi at the Taif end.",
        "If you are staying several days and want a car with driver in Taif as well, ask for a transfer plus hourly hire in one quote.",
      ],
    },
    endPoints: {
      heading: "Where we pick up in Jeddah and drop off in Taif",
      intro: "Give us the exact address at both ends when you book. These are the most common points on this route.",
      points: [
        { name: "Jeddah hotels and homes", desc: "Any address in the city, including the Corniche, Al Balad and Obhur." },
        { name: "Taif city", desc: "Hotels, family homes and apartments across Taif." },
        { name: "Al Hada and Al Shafa", desc: "The mountain resort areas above the city — tell us the resort name so the driver goes straight there." },
        { name: "Taif Regional Airport (TIF)", desc: "For an onward flight; share the departure time and we plan the pickup from it." },
      ],
    },
    whoBooks: [
      { title: "Families escaping the coastal heat", desc: "Taif's altitude makes it a popular summer and weekend escape from Jeddah; an SUV keeps everyone and the bags together." },
      { title: "Visitors on a day trip", desc: "A timed return, or a driver by the hour in Taif, for the rose farms, Al Hada and Al Shafa." },
      { title: "Business and government visits", desc: "Executive sedan with a written quote for companies; " + INVOICE.toLowerCase() },
    ],
    vehicleGuide: VEHICLES_MOUNTAIN,
    booking: {
      heading: "One-way, return or a day in Taif",
      body: [
        "Most Jeddah to Taif bookings are one-way to a hotel or family home. If you are coming back, ask for the return in the same request and both legs are agreed up front.",
        "For a day trip, choose a timed return, or hourly hire so the car waits while you visit the rose farms, Al Hada or Al Shafa. Free waiting is 15–30 minutes on every trip; longer waits are part of an hourly booking.",
        "To quote we need the pickup and drop-off addresses, date and time, passengers, large bags and whether anyone in the group is non-Muslim (so the route around Makkah is planned).",
      ],
    },
    tips: [
      { title: "Weekend traffic", desc: "Weekend evenings are the busiest times on the road to Taif, especially in summer. Leaving earlier in the day usually saves time." },
      { title: "Car sickness on the climb", desc: "Children and older passengers often find the Al Sail road easier than the bends of Al Hada. Say which you prefer." },
      { title: "Road works", desc: "Al Hada road has been closed for upgrades before, with traffic sent via Al Sail. The driver uses whichever road is open on the day." },
      { title: "Bring a layer", desc: "Taif sits much higher than Jeddah, so evenings can be cool even when the coast is hot." },
    ],
    faqs: [
      { question: "How far is Jeddah from Taif by car?", answer: "About 170 km by road, roughly 2 hours of driving. The time depends on which road is used to climb to Taif — Al Hada or Al Sail — and on weekend traffic out of Jeddah." },
      { question: "Can non-Muslims travel from Jeddah to Taif?", answer: "Yes. Non-Muslims cannot enter Makkah, so the driver uses the signed road that bypasses the city. Tell us when you book and the route is planned accordingly; it can add some time." },
      { question: "How much is a private car from Jeddah to Taif?", answer: "The fare is fixed and agreed on WhatsApp before you book. It depends on the vehicle, the exact addresses and whether you want a return or waiting time — send those and we usually reply within 1–2 hours." },
      { question: "Which vehicle is best for a family going to Taif?", answer: "A full-size SUV such as a GMC Yukon XL suits most families with luggage; a van such as a Hyundai Staria suits larger groups. We confirm the vehicle against your passenger and bag count when we quote." },
      { question: "Can I book a day trip from Jeddah to Taif and back?", answer: "Yes. Book a timed return, or hourly hire so the car stays with you in Taif. Both legs are quoted together before you travel." },
      { question: "Can a company book Jeddah to Taif transfers?", answer: "Yes. Email an RFQ for a written quote for single or recurring trips. " + INVOICE },
    ],
    related: [
      { href: "/locations/taif", label: "Private driver and transfers in Taif" },
      { href: "/locations/jeddah", label: "Getting around Jeddah by private car" },
      { href: "/routes/jeddah-airport-to-taif", label: "Landing at JED? Airport pickup straight to Taif" },
      { href: "/distance/jeddah-to-taif", label: "Jeddah–Taif road distance and drive time" },
      { href: "/routes/taif-to-makkah", label: "Continuing from Taif down to Makkah" },
      { href: "/services/intercity", label: "Intercity transfers across Saudi Arabia" },
    ],
  },

  "jeddah-airport-to-taif": {
    slug: "jeddah-airport-to-taif",
    h1: "Jeddah Airport to Taif",
    eyebrow: "JED arrivals → Taif",
    fromPlace: "Jeddah Airport (JED)",
    toPlace: "Taif",
    ctaLabel: "Arrange my airport pickup",
    bestFor: "International arrivals, families with luggage, late-night landings",
    lead: "Land at King Abdulaziz International Airport and go straight to Taif — meet & greet at arrivals, your luggage loaded, no change of vehicle in Jeddah.",
    quickAnswer:
      "King Abdulaziz International Airport (JED) is about 180 km from Taif, roughly 2 hours 10 minutes by road. Taxi Saudi Arabia arranges a private pickup at JED with meet & greet: you send your flight number, we track the flight, and the driver takes you directly to your Taif hotel, resort or home. Up to 15–30 minutes of free waiting is included and the fare is agreed before booking.",
    metaTitle: "Taxi Jeddah Airport to Taif | Taxi Saudi Arabia",
    metaDescription:
      "Private pickup from Jeddah Airport (JED) to Taif — about 180 km, 2 hr 10 min. Meet & greet, flight tracking, 15–30 min free waiting; fare agreed on WhatsApp first.",
    stages: [
      { label: "Before you fly", title: "Send your flight number", desc: "Share the flight number, landing time, passengers and bags. We confirm the meeting point with you before you land and the driver's details reach you on WhatsApp.", kind: "origin" },
      { label: "Arrival", title: "Meet & greet at JED", desc: "We track your flight, so a delay moves the pickup with it. After immigration and baggage you meet the driver, and 15–30 minutes of free waiting is included.", kind: "road" },
      { label: "The drive", title: "Coast to the highlands", desc: "Inland from the airport towards Makkah, then up the escarpment on the Al Hada or Al Sail road. Non-Muslim passengers are driven on the road that bypasses Makkah.", kind: "road" },
      { label: "Drop-off", title: "Your door in Taif", desc: "Hotel, resort, family home or apartment in Taif city, Al Hada or Al Shafa.", kind: "destination" },
    ],
    tradeOff: {
      heading: "Drive from JED, or connect to a flight into Taif?",
      body: [
        "Taif has its own airport (TIF), but many international arrivals land at Jeddah. Waiting for a connection, then arranging a car at Taif, often takes longer door to door than driving straight up from JED — and the luggage only moves once.",
        "A private car makes most sense for families, groups with heavy bags and late-night landings. If you are travelling alone with light luggage and a short connection is available, flying on to TIF can be reasonable; we can collect you at Taif airport instead.",
        "Tell us your arrival details and we will say honestly which works better.",
      ],
    },
    endPoints: {
      heading: "Pickup at JED, drop-off anywhere in Taif",
      intro: "We confirm the meeting point with you before you land. Give us the exact Taif address so the driver goes straight there.",
      points: [
        { name: "King Abdulaziz International Airport (JED)", desc: "Meet & greet at arrivals; we track your flight." },
        { name: "Taif city", desc: "Hotels, family homes and apartments across the city." },
        { name: "Al Hada and Al Shafa resorts", desc: "Mountain resort hotels above Taif — share the resort name." },
        { name: "Stopping on the way?", desc: "A stop in Jeddah can be added on the way; tell us when you book so it is in the quote." },
      ],
    },
    whoBooks: [
      { title: "Families arriving for the summer", desc: "Long-haul arrivals with several large cases, driven straight to a Taif home or resort." },
      { title: "Night and early-morning landings", desc: "Bookings are 24/7; the pickup is set from your landing time, not a fixed slot." },
      { title: "Business travellers and delegations", desc: "Executive sedans and SUVs with a written quote; " + INVOICE.toLowerCase() },
    ],
    vehicleGuide: VEHICLES_MOUNTAIN,
    booking: {
      heading: "Booking an airport pickup to Taif",
      body: [
        "Book before you fly so the driver is planned around your landing. Send the flight number, date, passengers, large bags and the Taif address; we usually reply within 1–2 hours with the vehicle and one fixed fare.",
        "If your flight is delayed, we track it and move the pickup. Free waiting is 15–30 minutes after landing; tell us if you expect a long wait at baggage.",
        "Flying out later? Book the Taif to Jeddah Airport return in the same request and the pickup is worked back from your departure time.",
      ],
    },
    tips: [
      { title: "Count the bags", desc: "Long-haul luggage fills a sedan quickly. With more than two large cases, choose an SUV or van." },
      { title: "Keep your phone on", desc: "The driver's details and meeting point come on WhatsApp, so a working number after landing makes the meeting simple." },
      { title: "Child seats", desc: "Ask when you book if you need a child seat, and we confirm whether it can be arranged for your date." },
    ],
    faqs: [
      { question: "How far is Jeddah Airport from Taif?", answer: "King Abdulaziz International Airport (JED) is about 180 km from Taif, roughly 2 hours 10 minutes by road via the Al Hada or Al Sail road." },
      { question: "Is meet & greet included at Jeddah Airport?", answer: "Yes. Meet & greet at arrivals is included. We confirm the meeting point with you before you land, and the driver's details reach you on WhatsApp." },
      { question: "What happens if my flight is delayed?", answer: "We track your flight and move the pickup with it. 15–30 minutes of free waiting is included after landing on every trip." },
      { question: "Can I go straight from JED to a resort in Al Hada or Al Shafa?", answer: "Yes. Give us the resort name and the driver takes you directly there — no change of vehicle in Jeddah." },
      { question: "How much is a taxi from Jeddah Airport to Taif?", answer: "The fare is fixed and agreed on WhatsApp before you book. It depends on the vehicle and your exact Taif address; send your flight details and we usually reply within 1–2 hours." },
      { question: "Can I book the return from Taif to Jeddah Airport?", answer: "Yes. Ask for both legs together and the pickup from Taif is planned back from your departure time." },
    ],
    related: [
      { href: "/airports/king-abdulaziz-jeddah", label: "All transfers from Jeddah Airport (JED)" },
      { href: "/locations/taif", label: "Taif city transfers and private driver" },
      { href: "/routes/jeddah-to-taif", label: "Leaving from a Jeddah hotel instead?" },
      { href: "/distance/jeddah-to-taif", label: "How far Taif is from Jeddah by road" },
      { href: "/airports/taif-regional", label: "Taif Regional Airport (TIF) pickups" },
      { href: "/services/airport-transfers", label: "Airport transfer service" },
    ],
  },

  "madinah-to-taif": {
    slug: "madinah-to-taif",
    h1: "Madinah to Taif",
    eyebrow: "Madinah → Taif, long-distance",
    fromPlace: "Madinah",
    toPlace: "Taif",
    ctaLabel: "Request my private transfer",
    bestFor: "Families and pilgrims continuing to Taif, groups with luggage",
    lead: "A long private drive from Madinah south to the Taif highlands — one vehicle, one driver, rest and prayer stops when you ask.",
    quickAnswer:
      "Madinah to Taif is about 480 km by road, roughly 4.5 hours of driving before stops, and in practice most of a day with rest and prayer breaks. Taxi Saudi Arabia arranges a private car with driver from your Madinah hotel or Prince Mohammad bin Abdulaziz Airport (MED) to any Taif address, with one fixed fare agreed on WhatsApp before booking.",
    metaTitle: "Taxi Madinah to Taif | Taxi Saudi Arabia",
    metaDescription:
      "Private car from Madinah or MED airport to Taif — about 480 km, 4.5 hours before stops, rest and prayer breaks on request. Sedan, SUV or van; fare agreed first.",
    stages: [
      { label: "Pickup", title: "Madinah", desc: "Your hotel near Masjid an-Nabawi, a home, or Prince Mohammad bin Abdulaziz Airport (MED) after landing.", kind: "origin" },
      { label: "Long stretch", title: "South through the Hejaz", desc: "Most of the trip is open highway. The driver stops for prayer, food or rest whenever you ask — plan on several breaks for a family.", kind: "road" },
      { label: "Final approach", title: "Up to the Taif plateau", desc: "The last part climbs to Taif's altitude. The exact road is chosen on the day; non-Muslim passengers are routed around Makkah.", kind: "road" },
      { label: "Drop-off", title: "Taif", desc: "Hotel, resort or home in Taif city, Al Hada or Al Shafa, or Taif Regional Airport (TIF).", kind: "destination" },
    ],
    tradeOff: {
      heading: "Private car or fly from Madinah to Taif?",
      body: [
        "Flying is quicker in the air, but direct flights between the two cities are limited, and you add check-in, baggage and transfers at both ends. For a family with luggage, a private car is often simpler: one pickup at the hotel door and one drop-off in Taif.",
        "The trade-off is time on the road. If you are travelling alone and light, a flight may suit you better; if you are a family or group, or want to stop on the way, the car usually wins.",
        "Some travellers split the trip — Madinah to Makkah for Umrah, then on to Taif later. Tell us the plan and we quote each leg.",
      ],
    },
    endPoints: {
      heading: "Pickup in Madinah, drop-off in Taif",
      intro: "Give us the exact addresses. These are the common start and end points.",
      points: [
        { name: "Madinah hotels", desc: "Including the Markaziyah hotels around Masjid an-Nabawi." },
        { name: "Madinah Airport (MED)", desc: "Meet & greet at arrivals; send your flight number and we track the flight." },
        { name: "Taif city and resorts", desc: "Hotels and homes in Taif, and resorts in Al Hada and Al Shafa." },
        { name: "Taif Regional Airport (TIF)", desc: "For an onward flight from Taif." },
      ],
    },
    whoBooks: [
      { title: "Pilgrim families after Madinah", desc: "Visitors ending their Madinah stay and continuing to family or a cooler summer stay in Taif." },
      { title: "Groups with heavy luggage", desc: "A van keeps the whole group and its bags together for the full day." },
      { title: "Residents relocating or visiting family", desc: "Door to door with no luggage transfers between buses or flights." },
    ],
    vehicleGuide: [
      { fleetSlug: "toyota-camry", name: "Executive sedan (e.g. Toyota Camry)", fit: "One or two adults travelling light. Fine for the distance, limited for luggage." },
      { fleetSlug: "gmc-yukon-xl", name: "Full-size SUV (e.g. GMC Yukon XL)", fit: "Most families choose this for space and comfort over a long day." },
      { fleetSlug: "hyundai-staria", name: "Van (e.g. Hyundai Staria)", fit: "Extended families and Umrah groups who want everyone in one vehicle." },
    ],
    booking: {
      heading: "Planning a long drive to Taif",
      body: [
        "Book a few days ahead if you can: a drive of this length takes a driver and vehicle for most of the day. Short-notice requests are checked against availability and we tell you plainly what can be arranged.",
        "To quote we need the pickup and drop-off addresses, date and time, passengers, large bags and any stops you want — for example a stop in Makkah, or a Miqat stop if you are travelling for Umrah.",
      ],
    },
    tips: [
      { title: "Leave in the morning", desc: "An early start puts most of the long stretch in daylight and gets you to Taif before evening." },
      { title: "Plan your breaks", desc: "Tell the driver how often you want to stop; families with children usually want more." },
      { title: "Combine with Makkah", desc: "If Makkah is part of the trip, ask for a multi-stop quote rather than two separate bookings." },
    ],
    faqs: [
      { question: "How far is Madinah from Taif by road?", answer: "About 480 km, roughly 4.5 hours of driving before stops. With prayer and rest breaks, plan on most of the day." },
      { question: "Can we stop for prayer and rest on the way?", answer: "Yes. Tell the driver whenever you want to stop for prayer, food or rest. Say how many breaks you expect when you book so the timing is planned." },
      { question: "Can I be picked up at Madinah Airport and driven to Taif?", answer: "Yes. Send your flight number; we track the flight and meet you at arrivals, with 15–30 minutes of free waiting included." },
      { question: "Can we stop in Makkah on the way to Taif?", answer: "Yes. Ask for a multi-stop trip and we quote it as one journey. Non-Muslim passengers are routed around Makkah." },
      { question: "How much is a private car from Madinah to Taif?", answer: "The fare is fixed and agreed on WhatsApp before you book. It depends on the vehicle, date and any stops; send your details and we usually reply within 1–2 hours." },
    ],
    related: [
      { href: "/locations/madinah", label: "Madinah transfers and private driver" },
      { href: "/locations/taif", label: "Taif city and mountain transfers" },
      { href: "/routes/madinah-to-makkah", label: "Madinah to Makkah first? Book that leg" },
      { href: "/routes/taif-to-makkah", label: "Taif onward to Makkah" },
      { href: "/services/intercity", label: "Long-distance intercity transfers" },
    ],
  },

  "taif-to-albaha": {
    slug: "taif-to-albaha",
    h1: "Taif to Al Baha",
    eyebrow: "Sarawat highlands, Taif → Al Baha",
    fromPlace: "Taif",
    toPlace: "Al Baha",
    ctaLabel: "Get my Taif to Al Baha quote",
    bestFor: "Highland road trips, families, visitors continuing south",
    lead: "A private car south along the Sarawat highlands from Taif to Al Baha — two mountain cities, one driver, door to door.",
    quickAnswer:
      "Taif to Al Baha is about 220 km by road through the Sarawat highlands, around 2 hours 40 minutes of driving before stops. Taxi Saudi Arabia arranges a private car with driver from any Taif hotel, home or Taif Regional Airport (TIF) to an address in Al Baha, with one fixed fare agreed on WhatsApp before booking.",
    metaTitle: "Taxi Taif to Al Baha | Taxi Saudi Arabia",
    metaDescription:
      "Private car from Taif or Taif Airport (TIF) to Al Baha — about 220 km through the Sarawat highlands, around 2 hr 40 min. Door to door; fare agreed on WhatsApp.",
    stages: [
      { label: "Pickup", title: "Taif", desc: "Your hotel, home or resort in Taif, Al Hada or Al Shafa, or Taif Regional Airport (TIF) after landing.", kind: "origin" },
      { label: "Highland road", title: "South along the Sarawat", desc: "The road stays high, running through the mountain country between the two cities. Expect bends, small towns and changing weather rather than a straight motorway.", kind: "road" },
      { label: "Drop-off", title: "Al Baha", desc: "Your hotel or address in Al Baha city or the surrounding highland areas.", kind: "destination" },
    ],
    tradeOff: {
      heading: "Private car or self-drive from Taif to Al Baha?",
      body: [
        "If you are comfortable on mountain roads and want a car for several days in Al Baha, renting can work out cheaper. A private car with driver suits families, visitors who do not want to drive unfamiliar highland roads, and anyone with luggage going door to door.",
        "There is no rail link between the two cities, and buses run to their own schedule. Tell us how many days you are staying and we can quote a one-way transfer or a return.",
      ],
    },
    endPoints: {
      heading: "Pickup in Taif, drop-off in Al Baha",
      intro: "Share the exact addresses when you book.",
      points: [
        { name: "Taif city, Al Hada and Al Shafa", desc: "Hotels, resorts and homes across the Taif area." },
        { name: "Taif Regional Airport (TIF)", desc: "Meet & greet at arrivals; we track your flight." },
        { name: "Al Baha", desc: "Hotels and addresses in Al Baha city and the nearby highland areas." },
      ],
    },
    whoBooks: [
      { title: "Highland road-trippers", desc: "Visitors exploring the south-west mountains who want a driver for the long legs." },
      { title: "Families visiting relatives", desc: "Door to door with luggage, no changes between buses." },
      { title: "Business travel", desc: "Executive sedan with a written quote for companies; " + INVOICE.toLowerCase() },
    ],
    vehicleGuide: VEHICLES_MOUNTAIN,
    tips: [
      { title: "Travel in daylight", desc: "Mountain roads are easier and the views are the point — a daytime departure is the usual choice." },
      { title: "Weather changes quickly", desc: "Fog and rain are possible in the highlands; we plan your pickup with margin and never promise an exact arrival minute." },
      { title: "Going further south?", desc: "If Abha is next, ask for a multi-leg quote." },
    ],
    faqs: [
      { question: "How far is Taif from Al Baha by road?", answer: "About 220 km, around 2 hours 40 minutes of driving before stops. Mountain bends and weather can add time." },
      { question: "Can I book from Taif Airport straight to Al Baha?", answer: "Yes. Send your flight number; we track the flight and meet you at arrivals at Taif Regional Airport (TIF), with 15–30 minutes of free waiting." },
      { question: "Which vehicle suits the mountain road?", answer: "A sedan is fine for one to three people with normal luggage; a full-size SUV gives families more room. We confirm the vehicle with your quote." },
      { question: "How much is a taxi from Taif to Al Baha?", answer: "The fare is fixed and agreed on WhatsApp before you book. It depends on the vehicle, addresses and whether you need a return." },
      { question: "Can I book a return from Al Baha to Taif?", answer: "Yes. Ask for both legs in one request and each is agreed before you travel." },
    ],
    related: [
      { href: "/locations/taif", label: "Taif transfers and private driver" },
      { href: "/airports/taif-regional", label: "Taif Regional Airport (TIF) pickups" },
      { href: "/routes/jeddah-to-taif", label: "Getting to Taif from Jeddah" },
      { href: "/locations/abha", label: "Continuing south to Abha" },
      { href: "/services/intercity", label: "Intercity transfers" },
    ],
  },
};

export const TAIF_ROUTE_SLUGS = Object.keys(TAIF_ROUTE_PAGES);
