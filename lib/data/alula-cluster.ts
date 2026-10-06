// AlUla cluster — single content source for the AlUla hub (/locations/alula)
// and its child pages. Rebuilt 2026-10-07 on the shared cluster system
// (lib/data/cluster.ts, components/location/cluster/*).
//
// Truth rules (CLAUDE.md §2, §14, §16, §17):
// - Distances/times only via routeFact() (ROUTES_DATA). RSI↔AlUla is an
//   OSRM-measured road figure (2026-10-07): RSI → AlUla Old Town 260 km /
//   ~264 min. Treat as planning figures, never as promises.
// - Business facts from seo/facts.md only: EN/AR drivers, 24/7, fare agreed
//   before booking, free cancellation up to 24h, cash or bank transfer,
//   e-receipt on request, corporate invoicing via sister company, flight
//   tracking (owner-confirmed 2026-10-03), 15–30 min free waiting.
//   Meet & greet at arrivals confirmed by the owner 2026-10-07 (facts.md).
//   NOT claimed anywhere here: dedicated airport desk, named representative,
//   hotel partnerships, vehicle models, ratings, years operating, prices.
// - Place facts verified 2026-10-07 from official / news sources:
//   * Hegra = Saudi Arabia's first UNESCO World Heritage Site. Visits run as
//     Experience AlUla tours that meet or depart at the Hegra Visitor Centre
//     (experiencealula.com Hegra Day / Premium / Family tours).
//   * Maraya concert hall: Wadi (Ashar) Valley, mirrored façade, Guinness
//     record for largest mirrored building; concert series are seasonal.
//   * Properties named (no partnership claimed): Banyan Tree AlUla (Ashar
//     Valley), Dar Tantora The House Hotel (AlUla Old Town), The Chedi Hegra,
//     Habitas AlUla, Caravan by Habitas — all listed in the 2026 MICHELIN
//     Guide Saudi Arabia selection (Asharq Al-Awsat / TradeArabia).
//   * Red Sea: Four Seasons Resort and Residences Red Sea at Shura Island
//     opened 20 May 2026; Four Seasons Resort and Residences AMAALA at Triple
//     Bay opened June 2026; Red Sea International Airport (RSI) is ~25 min
//     drive from Shura Island (Euronews 2026-06-17, Travel Tomorrow).
//   * Shura Island, AMAALA and RSI are SEPARATE destinations from AlUla.
import { routeFact, corpEmail, CORPORATE_INVOICE_LINE, type ClusterPage, type ClusterCity, type TripType } from "@/lib/data/cluster";

export const ALULA_AIRPORT_RESORTS = routeFact("alula-airport-to-resorts")!; // 30 km · 30 min
export const ALULA_AIRPORT_BANYAN = routeFact("alula-airport-to-banyan-tree")!;
export const MADINAH_ALULA = routeFact("madinah-to-alula")!;
export const RIYADH_ALULA = routeFact("riyadh-to-alula")!;
export const JEDDAH_ALULA = routeFact("jeddah-to-alula")!;
export const RSI_ALULA = routeFact("red-sea-airport-to-alula")!;
export const ALULA_RSI = routeFact("alula-to-red-sea-airport")!;
export const RSI_AMAALA = routeFact("red-sea-airport-to-amaala")!;

export const FREE_WAIT = "15–30 minutes";

export const ALULA_FACTS: { label: string; value: string }[] = [
  { label: "ULH → AlUla resorts", value: `~${ALULA_AIRPORT_RESORTS.km} km · ${ALULA_AIRPORT_RESORTS.time}` },
  { label: "Airport", value: "Meet & greet · we track your flight" },
  { label: "Free waiting", value: `${FREE_WAIT} on every trip` },
  { label: "Drivers", value: "English- & Arabic-speaking" },
  { label: "Fare", value: "Agreed before booking" },
  { label: "Cancellation", value: "Free up to 24 hours before" },
  { label: "Payment", value: "Cash to the driver or bank transfer" },
  { label: "Companies", value: "Invoicing via our sister company" },
];

/* ─── Hub: "What are you planning?" selector ────────────────────────── */

export const ALULA_TRIPS: TripType[] = [
  {
    id: "arriving",
    icon: "plane",
    label: "Arriving in AlUla",
    short: "Airport → hotel",
    answer: `AlUla International Airport (ULH) is a small regional airport, and on-demand cars there are limited, so most visitors pre-book. Meet & greet is provided at arrivals, and a private car takes you to your hotel — about ${ALULA_AIRPORT_RESORTS.km} km and ${ALULA_AIRPORT_RESORTS.time} to the resort area. We track your flight, so a delay moves your pickup.`,
    send: ["Flight number and arrival time", "Hotel or resort name", "Passengers and large bags", "Any onward plans (Hegra, Maraya)"],
    href: "/airports/alula",
    linkLabel: "AlUla airport transfers",
    waPrefill: "Salam! AlUla airport (ULH) arrival transfer.\n• Flight number & arrival time: \n• To (hotel / resort): \n• Date: \n• Passengers & large bags: \n• Vehicle (Executive sedan / SUV / Van): ",
  },
  {
    id: "private-driver",
    icon: "clock",
    label: "Exploring AlUla",
    short: "Private driver, several stops",
    answer: "AlUla's sites are spread across the valley, with the car park or visitor centre at each one. A private driver keeps one car with you for the day — it waits at every stop, carries your bags, and lets you change the order as you go.",
    send: ["Date and start time", "Hotel pickup point", "The places you want to see", "Passengers and ages of children"],
    href: "/locations/alula/private-driver",
    linkLabel: "Private driver in AlUla",
    waPrefill: "Salam! Private driver in AlUla (several stops).\n• Date & start time: \n• Hotel / pickup: \n• Places (Hegra / Old Town / Maraya / Elephant Rock / other): \n• Hours needed: \n• Passengers: \n• Vehicle (Executive sedan / SUV / Van): ",
  },
  {
    id: "hegra",
    icon: "landmark",
    label: "Visiting Hegra",
    short: "Hotel → Hegra → hotel",
    answer: "Hegra is visited through Experience AlUla tours that meet at the Hegra Visitor Centre. You book the tour with them; we arrange the car to the visitor centre and the return, timed to your slot — useful because the site is a drive out of AlUla town.",
    send: ["Tour date and start time", "Hotel pickup point", "Passengers", "Whether you want to add Old Town or Maraya"],
    href: "/locations/alula/hegra",
    linkLabel: "Transport to Hegra",
    waPrefill: "Salam! Transfer to Hegra Visitor Centre and back.\n• Tour date & start time: \n• Hotel / pickup: \n• Passengers: \n• Return straight to hotel or add other stops?: \n• Vehicle (Executive sedan / SUV / Van): ",
  },
  {
    id: "maraya",
    icon: "ticket",
    label: "Visiting Maraya",
    short: "Concerts & events",
    answer: "Maraya is the mirrored concert hall in Wadi Ashar. For an evening event, the practical problem is the return: everyone leaves at once. Agree a pickup point and time in advance and the car is waiting instead of searched for.",
    send: ["Event and date", "Hotel pickup time", "Return plan (straight back, or dinner first)", "Passengers"],
    href: "/locations/alula/maraya",
    linkLabel: "Transport to Maraya",
    waPrefill: "Salam! Transfer to Maraya and back.\n• Event / date: \n• Hotel / pickup & time: \n• Return time or after-event pickup: \n• Passengers: \n• Vehicle (Executive sedan / SUV / Van): ",
  },
  {
    id: "sightseeing",
    icon: "landmark",
    label: "Sightseeing day",
    short: "Several attractions",
    answer: "Plan the day on the multi-stop planner below: choose your start, tick the places, and it builds a message you can send for a quote. Three or more stops usually make a private driver better than separate transfers.",
    send: ["The stops you ticked", "Start and finish point", "Date", "Passengers"],
    href: "#planner",
    linkLabel: "Open the multi-stop planner",
    waPrefill: "Salam! AlUla sightseeing day by car.\n• Date & start time: \n• Start / finish: \n• Stops (Hegra / Old Town / Dadan / Jabal Ikmah / Maraya / Elephant Rock): \n• Passengers: ",
  },
  {
    id: "leaving",
    icon: "route",
    label: "Leaving AlUla",
    short: "Airport or another city",
    answer: `From AlUla the road goes to Madinah (about ${MADINAH_ALULA.km} km), on to Riyadh (about ${RIYADH_ALULA.km} km) or Jeddah (about ${JEDDAH_ALULA.km} km), and west to the Red Sea. For a flight home, we work the pickup back from your departure time.`,
    send: ["Pickup (hotel) and date", "Destination city or flight time", "Passengers and large bags", "Stops you want on the way"],
    href: "#onward",
    linkLabel: "Onward journeys from AlUla",
    waPrefill: "Salam! Leaving AlUla — transfer.\n• From (hotel): \n• To (airport / Madinah / Riyadh / Jeddah / other): \n• Date & time: \n• Passengers & large bags: \n• Vehicle (Executive sedan / SUV / Van): ",
  },
  {
    id: "red-sea",
    icon: "route",
    label: "Red Sea combination",
    short: "AlUla ↔ RSI · Shura · AMAALA",
    answer: `The Red Sea coast and AlUla are different destinations about ${RSI_ALULA.km} km apart by road. Red Sea International Airport (RSI) serves the coast resorts, and a private inter-destination transfer connects it to AlUla — a long drive, so most travellers book it as a planned leg of the trip.`,
    send: ["Direction (RSI → AlUla or AlUla → RSI)", "Flight number if arriving at RSI", "Resort or hotel at each end", "Passengers and large bags"],
    href: "/routes/red-sea-airport-to-alula",
    linkLabel: "RSI to AlUla transfer",
    waPrefill: "Salam! Red Sea ↔ AlUla private transfer.\n• Direction (RSI → AlUla / AlUla → RSI): \n• Pickup (RSI / Shura Island / AMAALA / AlUla hotel): \n• Drop-off: \n• Date & time / flight no.: \n• Passengers & large bags: \n• Vehicle (Executive sedan / SUV / Van): ",
  },
  {
    id: "business",
    icon: "briefcase",
    label: "Business & private groups",
    short: "Teams, delegations, VIP",
    answer: `Visiting teams, incentive groups and delegations get one point of contact and a written quote by email, with vehicles from executive sedans to coasters through our partner network. ${CORPORATE_INVOICE_LINE}`,
    send: ["Company and contact", "Dates and trip list", "Passengers per trip", "Whether you need an invoice"],
    href: "/services/corporate",
    linkLabel: "Corporate transportation",
    waPrefill: "Salam! Corporate / group transport in AlUla.\n• Company / group: \n• Dates & trips: \n• Passengers per trip: \n• Vehicle (Executive sedan / SUV / Van / Coaster): \n• Invoice needed?: ",
  },
];

/* ─── Hub: arrival flow (ARRIVE → MEET → LUGGAGE → RIDE → HOTEL) ───── */

export const ALULA_FLOW = {
  arrival: [
    { title: "Book with your flight", desc: "Send the flight number and your hotel. The fare is agreed before you travel." },
    { title: "Land at ULH", desc: "AlUla International Airport is a small regional airport — we track your flight, so a delay simply moves the pickup." },
    { title: "Meet & greet", desc: "Your driver meets you at arrivals. Name and number reach you on WhatsApp before pickup, so you can call as soon as you have your bags." },
    { title: "Luggage loaded", desc: "The vehicle is sized to your bags when you book — golf bags, photo gear and family cases included." },
    { title: "Private ride", desc: `${FREE_WAIT} of free waiting after landing. The ride to the resort area is about ${ALULA_AIRPORT_RESORTS.km} km.` },
    { title: "Your hotel", desc: "Dropped at the hotel entrance. Ask us to add the next morning's pickup for Hegra or the Old Town." },
  ],
  departure: [
    { title: "Book your return", desc: "Send your flight time and hotel." },
    { title: "Pickup worked back", desc: "We set the pickup from your departure time, allowing for the drive to ULH." },
    { title: "Hotel pickup", desc: "The driver meets you at the lobby and loads the bags." },
    { title: "Drop at ULH", desc: "Straight to the terminal for your flight." },
  ],
};

/* ─── Hub: multi-stop planner (client component data) ───────────────── */

export interface PlannerStop {
  id: string;
  name: string;
  group: "Heritage" | "Architecture & culture" | "Nature";
  note: string;
  /** Internal page for this stop, when one exists. */
  href?: string;
}

export const PLANNER_STOPS: PlannerStop[] = [
  { id: "hegra", name: "Hegra", group: "Heritage", note: "UNESCO site; visited on an Experience AlUla tour from the Hegra Visitor Centre", href: "/locations/alula/hegra" },
  { id: "dadan", name: "Dadan", group: "Heritage", note: "Ancient Dadan and Lihyan-era site; access via Experience AlUla" },
  { id: "jabal-ikmah", name: "Jabal Ikmah", group: "Heritage", note: "Rock-face inscriptions; access via Experience AlUla" },
  { id: "old-town", name: "AlUla Old Town", group: "Heritage", note: "Historic mudbrick town and its lanes" },
  { id: "maraya", name: "Maraya", group: "Architecture & culture", note: "Mirrored concert hall in Wadi Ashar", href: "/locations/alula/maraya" },
  { id: "aljadidah", name: "AlJadidah Arts District", group: "Architecture & culture", note: "Galleries, cafés and dining" },
  { id: "elephant-rock", name: "Elephant Rock", group: "Nature", note: "Sandstone formation, popular at sunset", href: "/locations/alula/elephant-rock" },
  { id: "sharaan", name: "Sharaan", group: "Nature", note: "Nature reserve north-west of AlUla; access arranged through Experience AlUla" },
];

export const PLANNER_STARTS = ["Hotel in AlUla", "AlUla Airport (ULH)", "Another AlUla address"];
export const PLANNER_ENDS = ["Back to the same hotel", "AlUla Airport (ULH)", "Another AlUla address"];

/* ─── Hub: attraction groups (transport use-case per destination) ───── */

export const ALULA_ATTRACTION_GROUPS: {
  id: string;
  label: string;
  intro: string;
  items: { name: string; transport: string; href?: string }[];
}[] = [
  {
    id: "heritage",
    label: "Heritage",
    intro: "The stone-age-to-Nabataean story of the oasis. These are the trips where timing to a guided slot matters most.",
    items: [
      { name: "Hegra", transport: "A drive out of town to the Hegra Visitor Centre, timed to your tour slot, with a return when it ends.", href: "/locations/alula/hegra" },
      { name: "Dadan & Jabal Ikmah", transport: "Usually combined on one outing; book the Experience AlUla access first, then fix the car around it." },
      { name: "AlUla Old Town", transport: "A short drop-off from most resorts, and easy to add on the way back from Hegra." },
    ],
  },
  {
    id: "architecture",
    label: "Architecture & culture",
    intro: "Evening-led trips: the cars are needed at dusk and after dark, when pickups are hardest to improvise.",
    items: [
      { name: "Maraya", transport: "Hotel → Maraya for a concert or dinner, with a pre-agreed pickup after the event.", href: "/locations/alula/maraya" },
      { name: "AlJadidah Arts District", transport: "A short evening hop from a resort for galleries and dinner, with a timed return." },
    ],
  },
  {
    id: "nature",
    label: "Nature",
    intro: "Sunset and photography stops — pair them with a heritage morning for a complete day.",
    items: [
      { name: "Elephant Rock", transport: "A sunset run from your hotel, with the car waiting for the return after dark.", href: "/locations/alula/elephant-rock" },
      { name: "Sharaan", transport: "A longer outing; access and any off-road section are arranged through Experience AlUla, so book the experience first." },
    ],
  },
];

/* ─── Hub: hotel & resort transfers ─────────────────────────────────── */
// Properties named only as examples of where trips start and end. No
// partnership is claimed and none exists (CLAUDE.md §2, brief §14–15).
export const ALULA_STAYS: { name: string; area: string; note: string }[] = [
  { name: "Banyan Tree AlUla", area: "Ashar Valley", note: "Villa resort among the sandstone canyons" },
  { name: "Habitas AlUla & Caravan by Habitas", area: "Ashar Valley", note: "Desert camps and caravan stays" },
  { name: "Dar Tantora The House Hotel", area: "AlUla Old Town", note: "Restored mudbrick boutique hotel" },
  { name: "The Chedi Hegra", area: "AlUla", note: "Desert resort in the 2026 MICHELIN Guide selection" },
];

export const ALULA_HOTEL_LEGS: { label: string; when: string; waPrefill: string }[] = [
  { label: "ULH Airport → your hotel", when: "Arrival day", waPrefill: "Salam! AlUla Airport (ULH) to hotel.\n• Flight no. & time: \n• Hotel: \n• Passengers & bags: " },
  { label: "Hotel → Hegra Visitor Centre → hotel", when: "Tour day, timed to your slot", waPrefill: "Salam! Hotel to Hegra and back.\n• Hotel: \n• Tour date & time: \n• Passengers: " },
  { label: "Hotel → Maraya → hotel", when: "Evening events", waPrefill: "Salam! Hotel to Maraya and back.\n• Hotel: \n• Event date & time: \n• Passengers: " },
  { label: "Hotel → Old Town / AlJadidah → hotel", when: "Dinner and wandering", waPrefill: "Salam! Hotel to AlUla Old Town / AlJadidah.\n• Hotel: \n• Date & time: \n• Passengers: " },
  { label: "Hotel → Elephant Rock → hotel", when: "Sunset", waPrefill: "Salam! Hotel to Elephant Rock for sunset.\n• Hotel: \n• Date: \n• Passengers: " },
  { label: "Hotel → ULH Airport", when: "Departure day", waPrefill: "Salam! AlUla hotel to ULH airport.\n• Hotel: \n• Flight no. & time: \n• Passengers & bags: " },
];

/* ─── Hub: onward journeys (ROUTES_DATA slugs) ──────────────────────── */

export const ALULA_ONWARD: { slug: string; note: string }[] = [
  { slug: "alula-to-madinah", note: "Door to door from AlUla to Madinah hotels or MED — the natural next leg, and the start of Ziyarat for many travellers." },
  { slug: "madinah-to-alula", note: "From Madinah to AlUla — a popular add-on after Ziyarat. Book both legs together if you like." },
  { slug: "alula-to-riyadh", note: "A full day on the road; many travellers fly from ULH instead and use a car at each end." },
  { slug: "riyadh-to-alula", note: "The same journey northwest from the capital, with rest and prayer stops." },
  { slug: "alula-to-jeddah", note: "Across the Kingdom to Jeddah hotels or JED — for families, groups and heavy luggage." },
  { slug: "jeddah-to-alula", note: "From Jeddah or JED to your AlUla hotel in one vehicle." },
  { slug: "alula-to-neom", note: "North-west to NEOM Bay Airport, Sharma, Magna or Oxagon. Some NEOM sites need access clearance." },
  { slug: "neom-to-alula", note: "From NEOM to AlUla's heritage sites — business visitors adding a heritage stop." },
  { slug: "alula-to-amaala", note: "From the inland oasis to the Red Sea coast and AMAALA — a separate destination." },
  { slug: "amaala-to-alula", note: "From AMAALA to AlUla as a planned leg of a Red Sea and heritage trip." },
  { slug: "alula-to-red-sea-airport", note: "Continue to Red Sea International Airport and the Shura Island resorts." },
  { slug: "red-sea-airport-to-alula", note: "From Red Sea International Airport to your AlUla hotel; we track your flight." },
  { slug: "alula-to-aqaba", note: "West to the Red Sea coast and across Al Durrah into Jordan. Valid travel documents required." },
  { slug: "alula-to-amman", note: "North via Tabuk and the Halat Ammar crossing. Valid travel documents required." },
];

/* ─── Hub: cross-destination (separate destinations) ────────────────── */

export const RED_SEA_NODES = [
  {
    id: "alula",
    title: "AlUla",
    sub: "Inland, north-west Saudi Arabia",
    body: "Heritage oasis with Hegra, the Old Town, Maraya and Elephant Rock. Airport: ULH.",
    href: "/locations/alula",
    label: "AlUla hub",
  },
  {
    id: "rsi",
    title: "Red Sea International Airport (RSI)",
    sub: "Red Sea coast",
    body: "The airport that serves the Red Sea Global resorts. This is the arrival point for guests flying in to the coast.",
    href: "/routes/red-sea-airport-to-alula",
    label: "RSI ↔ AlUla transfer",
  },
  {
    id: "coast",
    title: "Shura Island & AMAALA",
    sub: "Red Sea coast resorts",
    body: "Four Seasons Resort and Residences Red Sea at Shura Island opened in May 2026, and Four Seasons Resort and Residences AMAALA at Triple Bay in June 2026. Separate from AlUla and from each other.",
    href: "/routes/red-sea-airport-to-amaala",
    label: "RSI → AMAALA transfer",
  },
] as const;

export const RED_SEA_COMPARE = [
  { point: "Door to door", car: "Resort or hotel at one end to hotel at the other, one vehicle", fly: "Airport to airport; a car is still needed at both ends" },
  { point: "Luggage", car: "One vehicle, no re-handling", fly: "Subject to airline allowance and schedule" },
  { point: "Timing", car: "You choose the departure time", fly: "Fixed schedule — check which airlines currently connect the two airports" },
  { point: "Best for", car: "Families, groups, golf or photo gear, travellers who want the landscape", fly: "Solo or light travellers when a suitable flight exists" },
];

/* ─── Hub: visitor guide, FAQ, booking steps, guides ────────────────── */

export const ALULA_BOOKING_STEPS = [
  { title: "Send your trip", desc: "Form or WhatsApp: pickup, drop-off, date, passengers, bags, flight number." },
  { title: "Agree one fare", desc: "We confirm the vehicle and one fixed fare before anything is booked." },
  { title: "Driver details", desc: "Name and number arrive on WhatsApp before pickup. We track your flight." },
  { title: "Ride & pay", desc: `${FREE_WAIT} free waiting. Pay cash or by bank transfer; an e-receipt is available on request.` },
];

export const ALULA_TIMING = [
  { title: "Season", body: "October to March is the main season, with daytime temperatures of roughly 15–25°C. Summer is very hot — plan outdoor stops for early morning and after sunset." },
  { title: "Book ahead", body: "AlUla has a limited supply of cars and on-demand taxis at the airport are scarce, especially during festival weeks. Pre-book arrivals and event nights." },
  { title: "Guided sites", body: "Hegra, Dadan, Jabal Ikmah and Sharaan are visited through Experience AlUla experiences. Book the experience first, then we fix the car around the slot." },
  { title: "Event nights", body: "After concerts at Maraya everyone leaves at once. Agree a pickup point and time in advance." },
  { title: "Sunset", body: "Elephant Rock is busiest around sunset. Arrive ahead of the light and ask the driver to wait for the return." },
  { title: "Long drives", body: `Madinah is about ${MADINAH_ALULA.time} away and the Red Sea coast about ${RSI_ALULA.time}. Tell the driver your rest and prayer stops at the start.` },
];

export const ALULA_HUB_FAQS: { question: string; answer: string; category: string }[] = [
  { category: "Getting started", question: "Is a private driver useful in AlUla?", answer: "Yes, if you plan more than one or two stops. AlUla's sites are spread across the valley and on-demand taxis are limited, so a private driver keeps one car with you for the whole day, waits at each stop and carries your bags." },
  { category: "Airport", question: "How do I get from AlUla airport to my hotel?", answer: `Pre-book a private car from AlUla International Airport (ULH). It is about ${ALULA_AIRPORT_RESORTS.km} km and ${ALULA_AIRPORT_RESORTS.time} to the resort area. We track your flight, so a delay moves your pickup, and ${FREE_WAIT} of waiting is free.` },
  { category: "Airport", question: "Can I arrange a private transfer before arriving?", answer: "Yes — that is the usual way. Send your flight number, hotel and passenger count by form or WhatsApp. The fare is agreed before you book and you receive driver details before pickup." },
  { category: "Sightseeing", question: "How do I visit several attractions in one day?", answer: "Book a private driver by the hour or for the day, and list the places you want. Hegra, Dadan and Jabal Ikmah are visited through Experience AlUla experiences, so book those slots first and we plan the drive times around them." },
  { category: "Sightseeing", question: "Can you take me to Hegra?", answer: "Yes — to the Hegra Visitor Centre, where Experience AlUla tours meet. Book the tour with them; we arrange the car there and back, timed to your slot. We provide transport only, not the tour." },
  { category: "Sightseeing", question: "How do I get home from a Maraya concert?", answer: "Agree a pickup time and point in advance. Because the audience leaves together, a pre-arranged car is much easier than finding one at closing." },
  { category: "Onward travel", question: "Can I travel from AlUla to another Saudi city?", answer: `Yes. Madinah is about ${MADINAH_ALULA.km} km, Riyadh about ${RIYADH_ALULA.km} km and Jeddah about ${JEDDAH_ALULA.km} km by road, each as one private car with a fixed fare agreed before booking.` },
  { category: "Red Sea", question: "Can I travel from Red Sea resorts to AlUla?", answer: `Yes. Red Sea International Airport and AlUla are separate destinations about ${RSI_ALULA.km} km apart by road (${RSI_ALULA.time}). We arrange the private transfer from RSI, or from a Red Sea resort, to your AlUla hotel — and the reverse. Treat it as a planned leg of the trip.` },
  { category: "Red Sea", question: "Is Shura Island or AMAALA part of AlUla?", answer: "No. Shura Island and AMAALA are on the Red Sea coast and AlUla is inland; they are separate destinations. Travellers combine them, which is why a private inter-destination transfer helps." },
  { category: "Airport", question: "Is there a meet and greet at AlUla airport?", answer: "Yes. Meet & greet is provided at arrivals. Share your flight number when you book; we track the flight, so the driver is there when you land, and driver details reach you on WhatsApp before pickup." },
  { category: "Onward travel", question: "Can I travel from AlUla to NEOM or AMAALA?", answer: "Yes. NEOM is about 400 km from AlUla by road (roughly 6 hours 45 minutes to the NEOM Bay Airport area) and AMAALA about 295 km as a planning estimate. Both are separate destinations, so we treat each as a planned private transfer with the fare agreed before booking. Some NEOM sites need access clearance, which you arrange in advance." },
  { category: "Booking", question: "What should I provide when requesting a quote?", answer: "Pickup and drop-off, date and time, number of passengers and large bags, your flight number for airport trips, and the stops you want for a day with a driver. The vehicle category is chosen with you." },
  { category: "Booking", question: "Can families travel with luggage?", answer: "Yes. Tell us the number of large cases and the ages of children, and we choose a full-size SUV or a van so everyone travels together." },
  { category: "Payment", question: "What payment options are available, and can companies get invoices?", answer: `Cash to the driver or bank transfer, with an electronic receipt on request. ${CORPORATE_INVOICE_LINE}` },
  { category: "Booking", question: "Can I cancel or change a booking?", answer: "Cancellation is free up to 24 hours before pickup, and changes to time or address can be made on WhatsApp." },
];

export const ALULA_GUIDES = [
  { href: "/guides/alula-transport-guide", label: "AlUla visitor guide: Hegra, Dadan & the Old Town" },
  { href: "/blog/alula-travel-guide-hegra-dadan-transport", label: "How to get to AlUla and get around" },
  { href: "/blog/alula-winter-season-travel-guide", label: "AlUla in the winter season" },
  { href: "/distance/madinah-to-alula", label: "Madinah to AlUla distance & drive time" },
  { href: "/distance/riyadh-to-alula", label: "Riyadh to AlUla distance & drive time" },
  { href: "/fleet", label: "Vehicle categories in the partner network" },
];

/* ─── Child pages ───────────────────────────────────────────────────── */

const sharedBook = {
  pickup: "AlUla",
};

export const ALULA_PAGES: Record<string, ClusterPage> = {
  /* Private driver — multi-stop AlUla days */
  "private-driver": {
    slug: "private-driver",
    kind: "service",
    name: "Private Driver",
    nameAr: "سائق خاص",
    title: "Private Driver in AlUla | Multi-Stop Sightseeing Day Hire",
    metaDescription: "Hire a private driver in AlUla for Hegra, the Old Town, Maraya and Elephant Rock in one day. One car waits at every stop; fare agreed before booking.",
    h1: "Private Driver in AlUla — Hegra, Old Town, Maraya & More in One Day",
    eyebrow: "Car with driver · AlUla",
    heroImage: "/locations/alula-hero.webp",
    heroAlt: "Illustrative image: a candle-lit dinner table set in a sandstone desert valley with a mirrored structure behind it",
    intro: "A private driver in AlUla is one car and driver booked for a block of hours or a whole day. AlUla's sites sit well apart across the valley, and on-demand taxis are limited, so the car that waits outside each stop does the job a series of separate rides cannot. We confirm the vehicle and one fare before you book, and you can change the order of stops on the day.",
    facts: [
      { label: "Booked as", value: "Hours or a full day" },
      { label: "Driver", value: "Waits at every stop" },
      { label: "Languages", value: "English & Arabic" },
      { label: "Cancellation", value: "Free up to 24h before" },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Who books a driver in AlUla",
        heading: "Four kinds of AlUla day",
        items: [
          { title: "Couples and honeymooners", body: "Sunrise at Elephant Rock, a slow lunch in the Old Town, Maraya at dusk — one car, no phone calls to arrange the next lift." },
          { title: "Families", body: "Children, bags and a hot day: the car is a cool base between stops and carries everything." },
          { title: "Photographers", body: "Golden hour changes by the minute. A driver who waits lets you stay for the light and move on when you are ready." },
          { title: "Business & incentive groups", body: "A senior guest or a small team, one point of contact, and a written quote on request." },
        ],
      },
      {
        type: "timeline",
        eyebrow: "Sample day",
        heading: "A full AlUla day with one driver",
        intro: "An example only — the route is yours to change. Guided sites such as Hegra run to Experience AlUla tour slots, so book those first and we plan around them.",
        items: [
          { time: "Morning", title: "Hotel → Hegra Visitor Centre", desc: "Dropped for your Experience AlUla tour; the car waits or returns at your finish time." },
          { time: "Midday", title: "AlUla Old Town", desc: "Lunch and the lanes of the old town, out of the strongest heat." },
          { time: "Afternoon", title: "Rest at the hotel or AlJadidah", desc: "Cool down; the driver is on call." },
          { time: "Sunset", title: "Elephant Rock", desc: "In place for the evening light, then back after dark." },
          { time: "Evening", title: "Maraya or dinner", desc: "A pre-agreed pickup after the event or meal." },
        ],
      },
      {
        type: "compare",
        heading: "Private driver or separate transfers?",
        intro: "Count your stops — that usually decides it.",
        options: [
          { title: "Separate transfers", tone: "ink", when: ["One or two trips in the day", "A long gap between them", "You want the hotel to arrange everything else"] },
          { title: "Private driver", tone: "green", when: ["Three or more stops", "Children, heat or heavy camera gear", "Plans that may change on the day", "Guided slots you must be on time for"] },
        ],
      },
      {
        type: "checklist",
        heading: "What to send for a quote",
        items: ["Date and start time", "Your hotel", "The places you want, even roughly", "Number of passengers (children's ages help)", "Any guided slot times already booked", "Whether you also need the airport transfer"],
      },
    ],
    ctaHeading: "Request a private driver",
    ctaBody: "Date, start time, the stops you have in mind and how long you want the car — we confirm the vehicle and fare before booking.",
    ctaLabel: "Request a Private Driver",
    waPrefill: "Salam! Private driver in AlUla (hourly / full day).\n• Date & start time: \n• Hotel / pickup: \n• Stops planned: \n• Hours needed: \n• Passengers: \n• Vehicle (Executive sedan / SUV / Van): ",
    form: { ...sharedBook, vehicle: "SUV", tripType: "By the Hour" },
    pathB: { heading: "Drivers for a visiting team or incentive group?", body: `Daily cars for a delegation can be quoted in writing by email. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Private driver RFQ — AlUla", emailBody: corpEmail("private drivers / hourly hire in AlUla") },
    faqs: [
      { question: "How much is a private driver in AlUla?", answer: "It depends on the vehicle and the hours. The fare for the whole block is agreed on WhatsApp before booking — no meter and no surge." },
      { question: "Can the driver wait while I do a guided Hegra tour?", answer: "Yes. Hegra tours run through Experience AlUla from the Hegra Visitor Centre. The car takes you there and either waits or returns at your finish time, whichever you prefer." },
      { question: "Can we change the order of stops on the day?", answer: "Yes. The list is a plan, not a contract; tell the driver. Guided slots are the only fixed points." },
      { question: "Is a private driver better than renting a car in AlUla?", answer: "It depends on who is driving. A rental gives you the wheel; a driver gives you the whole day as a passenger, which matters on long, hot days and for evening events when you may not want to drive back." },
      { question: "Can we add the airport transfer to the same booking?", answer: "Yes. Airport arrival, the day with a driver and the departure transfer can all be quoted together." },
      { question: "Can companies book drivers by the day?", answer: `Yes. ${CORPORATE_INVOICE_LINE}` },
    ],
    related: [
      { href: "/locations/alula/hegra", label: "Transport to Hegra", desc: "Hotel → visitor centre → hotel" },
      { href: "/locations/alula/maraya", label: "Transport to Maraya", desc: "Evening events and the return" },
      { href: "/locations/alula/elephant-rock", label: "Elephant Rock transport", desc: "Sunset trips" },
      { href: "/airports/alula", label: "AlUla airport transfers", desc: "Arrival and departure legs" },
    ],
    schema: { serviceType: "Private driver and sightseeing day hire" },
  },

  /* Hegra */
  hegra: {
    slug: "hegra",
    kind: "attraction",
    name: "Hegra",
    nameAr: "الحجر (مدائن صالح)",
    title: "Hegra Transport from AlUla | Private Car to the Visitor Centre",
    metaDescription: "Private car from your AlUla hotel to the Hegra Visitor Centre and back, timed to your Experience AlUla tour. Transport only; fare agreed before booking.",
    h1: "Private Transport to Hegra from Your AlUla Hotel",
    eyebrow: "Hegra · UNESCO World Heritage Site",
    intro: "Hegra is Saudi Arabia's first UNESCO World Heritage Site, a short drive from AlUla town. Visits run as Experience AlUla tours that meet or depart at the Hegra Visitor Centre — you book the tour with them, and we arrange the car there and back, timed to your slot. We provide transport only; the tour is operated by Experience AlUla.",
    facts: [
      { label: "From AlUla town", value: "About 22 km" },
      { label: "Where tours meet", value: "Hegra Visitor Centre" },
      { label: "We provide", value: "Transport only" },
      { label: "Tours booked with", value: "Experience AlUla" },
    ],
    blocks: [
      {
        type: "steps",
        eyebrow: "How it works",
        heading: "Your Hegra morning, step by step",
        items: [
          { title: "Book your tour", desc: "Choose and book a Hegra experience with Experience AlUla first. Slots, not the car, set the day." },
          { title: "Send us the slot", desc: "Your tour time, hotel and passenger count." },
          { title: "Dropped at the visitor centre", desc: "Your driver arrives in good time for the meeting point." },
          { title: "Collected afterwards", desc: "The car waits, or returns at your finish time. Add the Old Town on the way back." },
        ],
      },
      {
        type: "table",
        eyebrow: "At a glance",
        heading: "Hegra: what we do and do not handle",
        columns: ["Item", "Who arranges it"],
        rows: [
          ["Hegra tour and entry", "Experience AlUla — booked directly with them"],
          ["Car from your hotel to the Hegra Visitor Centre", "Taxi Saudi Arabia, quoted before booking"],
          ["Return to your hotel or another stop", "Taxi Saudi Arabia"],
          ["Transport inside the site", "Provided by the tour"],
        ],
      },
      {
        type: "prose",
        heading: "Combining Hegra with the rest of your day",
        paragraphs: [
          "Most visitors pair Hegra with a second stop: the Old Town for a late lunch, or Elephant Rock for sunset. Booking the whole day with a private driver means the same car continues rather than you arranging a new lift after each tour.",
          "Plan the tour in the cooler part of the day. The site is open desert, and tours run to fixed times.",
        ],
      },
    ],
    ctaHeading: "Arrange my Hegra transfer",
    ctaBody: "Your tour date and start time, hotel and passengers — we confirm the car and fare before booking.",
    ctaLabel: "Arrange My Hegra Transfer",
    waPrefill: "Salam! Transfer to Hegra Visitor Centre and back.\n• Tour date & start time: \n• Hotel / pickup: \n• Passengers: \n• Return straight to hotel or add other stops?: \n• Vehicle (Executive sedan / SUV / Van): ",
    form: { ...sharedBook, dropoff: "Hegra Visitor Centre", vehicle: "SUV", tripType: "Round Trip" },
    pathB: { heading: "Group or incentive visit to Hegra?", body: `Written quotes for groups arriving for Hegra tours can be sent by email. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Group transport RFQ — Hegra, AlUla", emailBody: corpEmail("group transport to Hegra and back from AlUla") },
    faqs: [
      { question: "Do you run Hegra tours?", answer: "No. Hegra tours are operated by Experience AlUla. We arrange the car to and from the Hegra Visitor Centre." },
      { question: "How far is Hegra from AlUla town?", answer: "About 22 km from the centre of AlUla — a short drive, but not a walk, which is why a pre-arranged car helps." },
      { question: "Can the car wait for my tour to finish?", answer: `Yes. Tell us your tour length and we agree whether the driver waits or returns at your finish time. Single transfers include ${FREE_WAIT} of free waiting.` },
      { question: "Can we add Elephant Rock or the Old Town after Hegra?", answer: "Yes. Ask for a full-day private driver and the same car continues to your next stop." },
      { question: "Do I need to book Hegra in advance?", answer: "Hegra experiences are booked with Experience AlUla — check their site for current availability and timings, then send us your slot." },
    ],
    related: [
      { href: "/locations/alula/private-driver", label: "Private driver in AlUla", desc: "Hegra plus other stops in one day" },
      { href: "/locations/alula/elephant-rock", label: "Elephant Rock transport", desc: "A sunset add-on" },
      { href: "/guides/alula-transport-guide", label: "AlUla visitor guide", desc: "Sites and seasons" },
      { href: "/airports/alula", label: "AlUla airport transfers", desc: "Arrive and head straight out" },
    ],
    schema: { serviceType: "Transfers to Hegra Visitor Centre", place: { name: "Hegra", type: "TouristAttraction", description: "Saudi Arabia's first UNESCO World Heritage Site, near AlUla." } },
  },

  /* Maraya */
  maraya: {
    slug: "maraya",
    kind: "attraction",
    name: "Maraya",
    nameAr: "مرايا",
    title: "Maraya AlUla Transport | Concert & Event Transfers",
    metaDescription: "Private car from your AlUla hotel to Maraya concert hall and a pre-agreed pickup after the event. Transport only; fare confirmed before booking.",
    h1: "Getting to Maraya, AlUla, by Private Car",
    eyebrow: "Maraya · Wadi Ashar",
    intro: "Maraya is the mirrored concert hall set in Wadi Ashar, recognised by Guinness World Records as the largest mirrored building in the world. It hosts seasonal concerts and events, and the transport problem is almost always the same: arriving relaxed, then getting out when thousands leave together. A pre-arranged car, with a pickup point and time agreed in advance, solves it. We provide transport only; tickets come from the event organiser.",
    facts: [
      { label: "Location", value: "Wadi Ashar, AlUla" },
      { label: "Events", value: "Seasonal — check the AlUla calendar" },
      { label: "We provide", value: "Transport only" },
      { label: "Best booked", value: "Return pickup agreed in advance" },
    ],
    blocks: [
      {
        type: "steps",
        eyebrow: "Event night",
        heading: "How an event night works with a booked car",
        items: [
          { title: "Confirm the event", desc: "Buy tickets from the organiser and note the doors-open time." },
          { title: "Book the outward leg", desc: "Hotel to Maraya, timed for a calm arrival." },
          { title: "Agree the pickup", desc: "A fixed pickup point and time after the event, or a message-me-when-ready arrangement." },
          { title: "Ride back", desc: "Straight to your hotel, or on to dinner in AlJadidah." },
        ],
      },
      {
        type: "compare",
        heading: "Round trip with waiting, or two separate transfers?",
        intro: "Event finish times vary, so pick the arrangement that suits yours.",
        options: [
          { title: "Two separate transfers", tone: "ink", when: ["Fixed, known finish time", "You may eat or stay on afterwards", "You prefer to pay per leg"] },
          { title: "Private driver for the evening", tone: "green", when: ["Uncertain finish time", "Dinner first, then the event", "Several people with different plans"] },
        ],
      },
    ],
    ctaHeading: "Plan my Maraya transport",
    ctaBody: "Event date, hotel, pickup time and how you want to come back — we confirm the car and fare before booking.",
    ctaLabel: "Arrange My Maraya Transfer",
    waPrefill: "Salam! Transfer to Maraya and back.\n• Event / date: \n• Hotel / pickup & time: \n• Return time or after-event pickup: \n• Passengers: \n• Vehicle (Executive sedan / SUV / Van): ",
    form: { ...sharedBook, dropoff: "Maraya, AlUla", vehicle: "SUV", tripType: "Round Trip" },
    pathB: { heading: "Corporate event or group night at Maraya?", body: `Groups and corporate guests can be quoted in writing by email. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Event transport RFQ — Maraya, AlUla", emailBody: corpEmail("transport to and from an event at Maraya, AlUla") },
    faqs: [
      { question: "What is Maraya?", answer: "A concert hall in Wadi Ashar, AlUla, with a mirrored façade that reflects the sandstone canyons around it. It holds concerts and cultural events across the season." },
      { question: "Do you sell Maraya tickets?", answer: "No. Tickets and the event programme come from the organiser. We arrange transport to and from the venue." },
      { question: "How do we get home after the show?", answer: "Agree a pickup time and point when you book, or tell the driver on the night. Pre-arranging avoids searching for a car in a crowd." },
      { question: "Can the car wait for us?", answer: "Yes. For an evening with an uncertain finish, a private driver booked for the evening is simpler than timed transfers." },
      { question: "Are there Maraya events all year?", answer: "Maraya's programme is seasonal. Check the official AlUla calendar for current dates; we do not publish event schedules." },
    ],
    related: [
      { href: "/locations/alula/private-driver", label: "Private driver in AlUla", desc: "A full evening with one car" },
      { href: "/locations/alula/elephant-rock", label: "Elephant Rock transport", desc: "Sunset before the show" },
      { href: "/airports/alula", label: "AlUla airport transfers", desc: "Fly in for the event" },
      { href: "/services/corporate", label: "Corporate transportation", desc: "Group nights and accounts" },
    ],
    schema: { serviceType: "Transfers to Maraya concert hall", place: { name: "Maraya", type: "TouristAttraction", description: "Mirrored concert hall in Wadi Ashar, AlUla." } },
  },

  /* Elephant Rock */
  "elephant-rock": {
    slug: "elephant-rock",
    kind: "attraction",
    name: "Elephant Rock",
    nameAr: "جبل الفيل",
    title: "Elephant Rock AlUla Transport | Sunset Car & Return",
    metaDescription: "Private car from your AlUla hotel to Elephant Rock (Jabal AlFil) for sunset, with the return after dark. Transport only; fare agreed before booking.",
    h1: "Getting to Elephant Rock, AlUla, by Private Car",
    eyebrow: "Elephant Rock · Jabal AlFil",
    intro: "Elephant Rock (Jabal AlFil) is a freestanding sandstone formation near AlUla and one of the most popular sunset stops. Most visitors go in the late afternoon, which is exactly when cars are hardest to find. Book a pickup from your hotel and the car waits for the return after dark. We provide transport only; confirm current access and any facilities with Experience AlUla.",
    facts: [
      { label: "Best for", value: "Sunset and photography" },
      { label: "Busy time", value: "Around sunset" },
      { label: "We provide", value: "Transport only" },
      { label: "Pair with", value: "Hegra morning or Old Town lunch" },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Plan the evening",
        heading: "Three ways to do Elephant Rock",
        items: [
          { title: "Sunset only", body: "Hotel pickup in the late afternoon, back after dark. The shortest option." },
          { title: "Sunset after Hegra", body: "A heritage morning, a rest at the hotel, then Elephant Rock — on one private-driver booking." },
          { title: "Sunset then dinner", body: "From Elephant Rock straight to AlJadidah or a resort restaurant, with a pre-agreed return." },
        ],
      },
      {
        type: "prose",
        heading: "Why a booked car matters here",
        paragraphs: [
          "Visitors arrive and leave together around sunset, and there is little to wait in. Agree the pickup time with your driver and the car is waiting when you are ready.",
          "Heat falls quickly after dusk, so bring a layer for the return in the cooler months.",
        ],
      },
    ],
    ctaHeading: "Arrange my Elephant Rock transfer",
    ctaBody: "Date, hotel, sunset plan and number of passengers — we confirm the car and fare before booking.",
    ctaLabel: "Arrange My Elephant Rock Transfer",
    waPrefill: "Salam! Transfer to Elephant Rock for sunset and back.\n• Date: \n• Hotel / pickup & time: \n• Passengers: \n• Add dinner or another stop?: \n• Vehicle (Executive sedan / SUV / Van): ",
    form: { ...sharedBook, dropoff: "Elephant Rock, AlUla", vehicle: "SUV", tripType: "Round Trip" },
    pathB: { heading: "Group evening at Elephant Rock?", body: `Groups can be quoted in writing by email. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Group transport RFQ — Elephant Rock, AlUla", emailBody: corpEmail("group transport to Elephant Rock, AlUla") },
    faqs: [
      { question: "What is Elephant Rock?", answer: "Jabal AlFil, a freestanding sandstone formation near AlUla shaped like an elephant, and a popular spot for sunset photography." },
      { question: "Can I book a car for sunset only?", answer: "Yes. A round trip from your hotel with the car waiting is the simplest way to do it." },
      { question: "Can we combine it with Hegra or the Old Town?", answer: "Yes. A private driver for the day links them in one booking." },
      { question: "Is there an entry fee or fixed opening time?", answer: "Access and facilities change. Check the official Experience AlUla information for current details; we handle the car only." },
    ],
    related: [
      { href: "/locations/alula/private-driver", label: "Private driver in AlUla", desc: "The whole day on one booking" },
      { href: "/locations/alula/hegra", label: "Transport to Hegra", desc: "A heritage morning" },
      { href: "/locations/alula/maraya", label: "Transport to Maraya", desc: "Evening events" },
      { href: "/airports/alula", label: "AlUla airport transfers", desc: "Arrival and departure legs" },
    ],
    schema: { serviceType: "Transfers to Elephant Rock", place: { name: "Elephant Rock (Jabal AlFil)", type: "TouristAttraction", description: "Freestanding sandstone formation near AlUla." } },
  },
};

export const ALULA_CHILD_NAV: ClusterCity["nav"] = [
  { slug: "private-driver", label: "Private driver" },
  { slug: "hegra", label: "Hegra" },
  { slug: "maraya", label: "Maraya" },
  { slug: "elephant-rock", label: "Elephant Rock" },
];

export const ALULA_CITY: ClusterCity = { slug: "alula", name: "AlUla", nav: ALULA_CHILD_NAV };
