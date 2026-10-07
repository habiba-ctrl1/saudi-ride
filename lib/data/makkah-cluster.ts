// Makkah cluster — single content source for the Makkah hub (/locations/makkah)
// and its child page(s). Rebuilt 2026-10-08 from seo/makkah-keyword-map.md.
//
// Truth rules (CLAUDE.md §2, §14, §16, §17):
// - Distances/times only via routeFact() (ROUTES_DATA) — never typed by hand.
// - Business facts from seo/facts.md: EN/AR drivers, 24/7, fare agreed before
//   booking, free cancellation up to 24h, cash or bank transfer, e-receipt on
//   request, corporate invoicing via sister company, flight tracking (owner-
//   confirmed 2026-10-03), 15–30 min free waiting (never longer).
// - Vehicle capacities come from lib/fleet-data.ts (FLEET_VEHICLES) at render.
// - No Miqat claims on Jeddah-origin trips (Jeddah is inside the Miqat
//   boundary); Miqat is mentioned only neutrally and never as a ruling.
// - Makkah entry is for Muslims only (existing site tip, kept).
// - No hotel partnership claims; hotel pages are existing /routes/* pages.
import { routeFact, corpEmail, CORPORATE_INVOICE_LINE, type ClusterPage, type ClusterCity, type TripType } from "@/lib/data/cluster";

export const MK_JED_AIRPORT = routeFact("makkah-to-jeddah-airport")!; // 80 km
export const JED_AIRPORT_MK = routeFact("jeddah-airport-to-makkah")!; // 80 km
export const MK_JEDDAH = routeFact("makkah-to-jeddah")!; // 85 km
export const MK_MADINAH = routeFact("makkah-to-madinah")!; // 430 km
export const MK_TAIF = routeFact("makkah-to-taif")!; // 90 km
export const MK_RIYADH = routeFact("makkah-to-riyadh")!;
export const MK_MED_AIRPORT = routeFact("makkah-to-madinah-airport")!;

export const FREE_WAIT = "15–30 minutes";

export const MAKKAH_FACTS: { label: string; value: string }[] = [
  { label: "Makkah → JED Airport", value: `${MK_JED_AIRPORT.km} km · ${MK_JED_AIRPORT.time}` },
  { label: "Makkah → Madinah", value: `${MK_MADINAH.km} km · ${MK_MADINAH.time}` },
  { label: "Makkah → Taif", value: `${MK_TAIF.km} km · ${MK_TAIF.time}` },
  { label: "Flights", value: "We track your flight" },
  { label: "Drivers", value: "English- & Arabic-speaking" },
  { label: "Cancellation", value: "Free up to 24 hours before" },
  { label: "Payment", value: "Cash to the driver or bank transfer" },
  { label: "Companies", value: "Invoicing via our sister company" },
];

/* ─── Hub: trip-type selector ───────────────────────────────────────── */

export const MAKKAH_TRIPS: TripType[] = [
  {
    id: "airport",
    icon: "plane",
    label: "Jeddah Airport ↔ Makkah",
    short: `${JED_AIRPORT_MK.km} km from JED`,
    answer: `A private car from King Abdulaziz International Airport (JED) to your Makkah hotel is about ${JED_AIRPORT_MK.km} km (${JED_AIRPORT_MK.time}). We track your flight, the driver meets you after baggage claim, and the fare is agreed before you travel. The return leg is booked the same way — pickup is worked back from your flight time.`,
    send: ["Flight number and terminal", "Makkah hotel name", "Passengers and large bags", "Return flight, if booking both ways"],
    href: "/routes/jeddah-airport-to-makkah",
    linkLabel: "Jeddah Airport to Makkah transfer",
    waPrefill: "Salam! Jeddah Airport ↔ Makkah transfer.\n• From: \n• To: \n• Date & time: \n• Flight number: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "madinah",
    icon: "route",
    label: "Makkah ↔ Madinah",
    short: `${MK_MADINAH.km} km, hotel to hotel`,
    answer: `Makkah to Madinah is about ${MK_MADINAH.km} km — roughly ${MK_MADINAH.time} of driving, plus the prayer and rest stops you ask for. A private car goes hotel to hotel with all your luggage in one vehicle, and the same route is available in reverse.`,
    send: ["Makkah pickup address or hotel", "Madinah hotel", "Date and time", "Passengers and large bags"],
    href: "/routes/makkah-to-madinah",
    linkLabel: "Makkah to Madinah private transfer",
    waPrefill: "Salam! Makkah ↔ Madinah transfer.\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "jeddah",
    icon: "route",
    label: "Makkah ↔ Jeddah",
    short: `${MK_JEDDAH.km} km to the city`,
    answer: `Makkah to anywhere in Jeddah is about ${MK_JEDDAH.km} km (${MK_JEDDAH.time}) — hotels, the Corniche, Al-Balad or a business meeting. For flights, book the Jeddah Airport leg instead, which is about ${MK_JED_AIRPORT.km} km.`,
    send: ["Makkah pickup", "Jeddah address", "Date and time", "Passengers and bags"],
    href: "/routes/makkah-to-jeddah",
    linkLabel: "Makkah to Jeddah private car",
    waPrefill: "Salam! Makkah ↔ Jeddah transfer.\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "ziyarat",
    icon: "landmark",
    label: "Ziyarat by car",
    short: "Half-day, flexible waiting",
    answer: "A private car takes you between the Makkah sites you choose — for example Jabal al-Nour, Jabal Thawr, Mina, Muzdalifah, Arafat and Jannat al-Mu'alla — and waits at each stop. We provide the transport; we do not give religious guidance.",
    send: ["Date and start time", "Sites you want to visit", "Passengers (elders or children?)", "Pickup hotel"],
    href: "/services/makkah-ziyarat",
    linkLabel: "Makkah Ziyarat transportation",
    waPrefill: "Salam! Makkah Ziyarat by private car.\n• Date & start time: \n• Sites to visit: \n• Pickup hotel: \n• Passengers: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "private-driver",
    icon: "clock",
    label: "Private driver by the hour",
    short: "Half-day or full day",
    answer: "One car and driver for a block of hours — the car waits outside each stop. Useful for a day of meetings, shopping and family errands across Makkah, or a flexible schedule around prayer times.",
    send: ["Date and start time", "Hours needed", "Rough list of stops", "Passengers"],
    href: "/locations/makkah/private-driver",
    linkLabel: "Private driver in Makkah",
    waPrefill: "Salam! Private driver in Makkah (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "hotel",
    icon: "hotel",
    label: "Hotel pickup & drop-off",
    short: "Haram-area & Aziziyah hotels",
    answer: "Give us the hotel name and the leg you need — airport, station, another hotel or a city. Near Masjid al-Haram some roads close at prayer times, so the driver uses the nearest permitted drop-off point and tells you where to meet.",
    send: ["Hotel name", "Where you are going", "Date and time", "Passengers and bags"],
    href: "#hotels",
    linkLabel: "Makkah hotel transfers",
    waPrefill: "Salam! Makkah hotel transfer.\n• Hotel (pickup): \n• To (airport / station / hotel / city): \n• Date & time: \n• Passengers & luggage: ",
  },
  {
    id: "intercity",
    icon: "route",
    label: "Taif, Riyadh & beyond",
    short: "One fare for the whole car",
    answer: `Beyond Madinah and Jeddah, the regular Makkah corridors are Taif up the escarpment (about ${MK_TAIF.km} km) and the long drive to Riyadh (about ${MK_RIYADH.km} km). A private car runs door to door with rest and prayer stops on request.`,
    send: ["Pickup address", "Destination city", "Date and time", "Passengers and bags"],
    href: "#destinations",
    linkLabel: "Every route from Makkah",
    waPrefill: "Salam! Intercity trip from Makkah.\n• To (Taif / Riyadh / other): \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "corporate",
    icon: "briefcase",
    label: "Corporate & groups",
    short: "Delegations, teams, Umrah groups",
    answer: `Companies, Umrah group organisers and delegations get one point of contact and a written quote by email, with vehicles from executive sedans to coasters through our partner network. Larger coaches are arranged on request. ${CORPORATE_INVOICE_LINE}`,
    send: ["Company or group name", "Dates and trip list", "Passengers per trip", "Whether you need an invoice"],
    href: "/services/group-transport",
    linkLabel: "Group and corporate transportation",
    waPrefill: "Salam! Corporate / group transport in Makkah.\n• Company / group: \n• Dates & trips: \n• Passengers per trip: \n• Vehicle (Sedan / SUV / Van / Coaster): \n• Invoice needed?: ",
  },
];

/* ─── Hub: route map nodes (only real route pages) ──────────────────── */

export interface MapNode {
  id: string;
  label: string;
  labelAr: string;
  /** SVG coordinates in a 640×420 viewBox. */
  x: number;
  y: number;
  /** Route page(s) linking the node to Makkah. */
  slug: string;
  reverseSlug?: string;
}

export const MAKKAH_MAP_NODES: MapNode[] = [
  { id: "jed", label: "Jeddah Airport", labelAr: "مطار جدة", x: 130, y: 120, slug: "makkah-to-jeddah-airport", reverseSlug: "jeddah-airport-to-makkah" },
  { id: "jeddah", label: "Jeddah", labelAr: "جدة", x: 90, y: 215, slug: "makkah-to-jeddah", reverseSlug: "jeddah-to-makkah" },
  { id: "madinah", label: "Madinah", labelAr: "المدينة المنورة", x: 410, y: 60, slug: "makkah-to-madinah", reverseSlug: "madinah-to-makkah" },
  { id: "taif", label: "Taif", labelAr: "الطائف", x: 490, y: 300, slug: "makkah-to-taif" },
  { id: "riyadh", label: "Riyadh", labelAr: "الرياض", x: 560, y: 175, slug: "makkah-to-riyadh", reverseSlug: "riyadh-to-makkah" },
];

/* ─── Hub: corridor board ───────────────────────────────────────────── */

export const MAKKAH_CORRIDORS: { slug: string; label: string; note: string }[] = [
  { slug: "jeddah-airport-to-makkah", label: "Jeddah Airport → Makkah", note: "The most-booked arrival. From the terminal straight to your Makkah hotel." },
  { slug: "makkah-to-jeddah-airport", label: "Makkah → Jeddah Airport", note: "Departure leg, with pickup worked back from your flight time." },
  { slug: "makkah-to-madinah", label: "Makkah → Madinah", note: "Hotel to hotel with prayer and rest stops on request." },
  { slug: "madinah-to-makkah", label: "Madinah → Makkah", note: "The return leg, or the start of an Umrah trip from Madinah." },
  { slug: "jeddah-to-makkah", label: "Jeddah city → Makkah", note: "From any Jeddah hotel or home, at any hour." },
  { slug: "makkah-to-jeddah", label: "Makkah → Jeddah city", note: "Back to a Jeddah hotel, the Corniche or Al-Balad." },
  { slug: "makkah-to-taif", label: "Makkah → Taif", note: "Up the Al Hada escarpment to the mountain city." },
  { slug: "makkah-to-riyadh", label: "Makkah → Riyadh", note: "The long cross-Kingdom drive, with stops planned in advance." },
];

/* ─── Hub: hotel pages (existing, ranking /routes/* pages) ──────────── */

export const MAKKAH_HOTEL_ROUTES: { slug: string; hotel: string }[] = [
  { slug: "jeddah-airport-to-swissotel-makkah", hotel: "Swissotel Al Maqam Makkah" },
  { slug: "jeddah-airport-to-fairmont-makkah", hotel: "Fairmont Makkah Clock Royal Tower" },
  { slug: "jeddah-airport-to-pullman-zamzam-makkah", hotel: "Pullman Zamzam Makkah" },
  { slug: "jeddah-airport-to-hilton-suites-makkah", hotel: "Hilton Suites Makkah" },
  { slug: "jeddah-airport-to-conrad-makkah", hotel: "Conrad Makkah" },
  { slug: "jeddah-airport-to-movenpick-makkah", hotel: "Movenpick Hajar Tower Makkah" },
  { slug: "jeddah-airport-to-makkah-clock-tower", hotel: "Makkah Clock Tower hotels" },
];

export const MAKKAH_AREAS: { slug: string; name: string; nameAr: string; what: string }[] = [
  { slug: "ajyad", name: "Ajyad", nameAr: "أجياد", what: "Beside Masjid al-Haram; Abraj Al Bait (Clock Tower) hotels" },
  { slug: "al-shubaikah", name: "Al Shubaikah", nameAr: "الشبيكة", what: "A short walk from the Haram on the Jeddah-road side" },
  { slug: "aziziyah", name: "Aziziyah", nameAr: "العزيزية", what: "Pilgrim hotels on the road towards Mina and Arafat" },
  { slug: "al-awali-makkah", name: "Al Awali", nameAr: "العوالي", what: "Southern Makkah, quick access to the expressway" },
  { slug: "al-mansour", name: "Al Mansour", nameAr: "المنصور", what: "Residential district with a short drive to the Haram" },
  { slug: "mina", name: "Mina", nameAr: "منى", what: "East of Makkah; permitted transport in the Hajj season" },
];

/* ─── Hub: Ziyarat sites (transport only) ───────────────────────────── */

export const MAKKAH_ZIYARAT_STOPS: { name: string; nameAr: string; note: string }[] = [
  { name: "Jabal al-Nour", nameAr: "جبل النور", note: "The mountain above the Cave of Hira, on the north side of Makkah. The car waits at the base." },
  { name: "Jabal Thawr", nameAr: "جبل ثور", note: "South of Makkah. The car waits at the base." },
  { name: "Mina", nameAr: "منى", note: "The tent valley east of Makkah, about 8 km from the Haram." },
  { name: "Muzdalifah", nameAr: "مزدلفة", note: "Between Mina and Arafat." },
  { name: "Arafat & Jabal al-Rahmah", nameAr: "عرفات وجبل الرحمة", note: "East of Makkah, on the plain of Arafat." },
  { name: "Jannat al-Mu'alla", nameAr: "جنة المعلاة", note: "The historic cemetery north of the Haram." },
];

/* ─── Hub: vehicle fit ──────────────────────────────────────────────── */

export const MAKKAH_VEHICLE_FIT = [
  { id: "sedan", label: "Sedan", fleetSlug: "toyota-camry", forWho: "Individuals, couples and small groups with normal luggage", href: "/fleet/toyota-camry" },
  { id: "suv", label: "GMC / full-size SUV", fleetSlug: "gmc-yukon-xl", forWho: "Families and premium comfort with more luggage", href: "/fleet/gmc-yukon-xl" },
  { id: "staria", label: "Hyundai Staria", fleetSlug: "hyundai-staria", forWho: "Families and small groups travelling together", href: "/fleet/hyundai-staria" },
  { id: "hiace", label: "Toyota Hiace van", fleetSlug: "toyota-hiace", forWho: "Larger groups with a lot of luggage", href: "/fleet/toyota-hiace" },
  { id: "coaster", label: "Coaster / minibus", fleetSlug: "toyota-coaster", forWho: "Umrah groups, teams and delegations", href: "/fleet/toyota-coaster" },
];

/* ─── Hub: timing ───────────────────────────────────────────────────── */

export const MAKKAH_TIMING = [
  { title: "Prayer-time road closures", body: "Roads around Masjid al-Haram close or slow at prayer times. Your driver uses the nearest permitted drop-off point and tells you exactly where to meet on the way back." },
  { title: "Umrah peaks and Ramadan", body: "Jeddah–Makkah traffic and the Haram area get far busier in Ramadan and peak Umrah weeks. Allow extra time for airport departures and book vans and SUVs early." },
  { title: "Night arrivals", body: "Many international flights land at night or before dawn. Transfers run 24/7 — pre-book so the car is waiting rather than searched for at 3 am." },
  { title: "Luggage and zamzam", body: "Umrah families often carry more than expected, including zamzam on the way home. Tell us the number of large cases and the vehicle is sized to match." },
  { title: "Summer heat", body: "From late spring to autumn, plan outdoor Ziyarat stops for early morning or after sunset, with the car close by between stops." },
  { title: "Entry to Makkah", body: "Only Muslims may enter the city limits of Makkah. Non-Muslim visitors to Saudi Arabia can use our Jeddah, Madinah, Taif and AlUla services." },
];

/* ─── Hub: honest comparison — private car vs train ─────────────────── */

export const CAR_VS_TRAIN = [
  { point: "Door to door", car: "Yes — airport or hotel to hotel", train: "Station to station; a transfer is needed at each end" },
  { point: "Luggage", car: "All bags in one vehicle, loaded by the driver", train: "Carried through the stations" },
  { point: "Family or group", car: "One fare for the whole car", train: "A ticket per person" },
  { point: "Timetable", car: "Leave when you are ready, 24/7", train: "Fixed departures" },
  { point: "Stops on the way", car: "Prayer, meal or luggage stops on request", train: "None" },
];

/* ─── Hub: visitor guide, booking, FAQ ──────────────────────────────── */

export const MAKKAH_VISITOR_GUIDE = [
  { q: "How do I get from Jeddah Airport to my Makkah hotel?", a: `The simplest way is a pre-booked private car from your JED terminal to your hotel — about ${JED_AIRPORT_MK.km} km and ${JED_AIRPORT_MK.time}, with your luggage in the same vehicle. We track your flight, so a delay moves the pickup.` },
  { q: "Can the car take us to the door of our Makkah hotel?", a: "The driver takes you as close as vehicles are permitted. Around Masjid al-Haram some roads are closed at peak and prayer times, and the driver uses the nearest allowed drop-off point." },
  { q: "Can we travel from Makkah to Madinah by car?", a: `Yes. It is about ${MK_MADINAH.km} km and ${MK_MADINAH.time} of driving. Tell the driver your preferred prayer and rest stops when you book.` },
  { q: "What if we have elderly parents or small children?", a: "Say so when you book. An SUV or van gives more room and easier boarding, and Ziyarat days can be planned with longer waiting stops." },
  { q: "Do I need to stop at a Miqat?", a: "That depends on where you are travelling from and on your own religious circumstances, which we cannot advise on. If your route passes a Miqat and you want a stop, tell us when you book and we will plan it." },
  { q: "How do I pay?", a: "Cash to the driver or bank transfer. An electronic receipt is available on request." },
];

export const MAKKAH_BOOKING_STEPS = [
  { title: "Send your trip", desc: "Form or WhatsApp: pickup, drop-off, date, passengers, luggage and flight number if it is an airport trip." },
  { title: "Agree one fare", desc: "We confirm the vehicle and one fixed fare before anything is booked — no meter, no surge." },
  { title: "Driver details", desc: "Name and number arrive on WhatsApp before pickup. We track your flight." },
  { title: "Ride & pay", desc: `${FREE_WAIT} free waiting. Pay cash or by bank transfer.` },
];

export const MAKKAH_HUB_FAQS: { question: string; answer: string; category: string }[] = [
  { category: "Booking", question: "How do I book a private taxi in Makkah?", answer: "Send your pickup, drop-off, date, passengers and luggage by the form or on WhatsApp. We reply with the vehicle and one fixed fare before anything is booked — no meter and no surge." },
  { category: "Airport", question: "Can I book a private transfer from Jeddah Airport to Makkah?", answer: `Yes. Jeddah Airport (JED) to Makkah is about ${JED_AIRPORT_MK.km} km and ${JED_AIRPORT_MK.time}. The driver meets you after baggage claim, we track your flight, and the first ${FREE_WAIT} of waiting is free.` },
  { category: "Intercity", question: "Can I travel privately from Makkah to Madinah?", answer: `Yes. Makkah to Madinah is about ${MK_MADINAH.km} km — ${MK_MADINAH.time} of driving. A private car goes hotel to hotel with prayer and rest stops on request, and the return trip can be booked at the same time.` },
  { category: "Hotels", question: "Can I request hotel pickup in Makkah?", answer: "Yes. Give us the hotel name and the driver comes to the entrance. Near Masjid al-Haram the car may have to wait at the nearest permitted point during prayer times; the driver tells you where." },
  { category: "Ziyarat", question: "Can I book Makkah Ziyarat transportation?", answer: "Yes. A private car takes you between the sites you choose, such as Jabal al-Nour, Jabal Thawr, Mina, Muzdalifah and Arafat, and waits at each stop. We provide transport only, not religious guidance." },
  { category: "Hourly", question: "Can I hire a private driver by the hour in Makkah?", answer: "Yes. Book a car and driver for a block of hours or a full day; the car waits between stops. Send your date, start time and hours needed and we confirm the fare before booking." },
  { category: "Vehicles", question: "Which vehicle should I choose for my family?", answer: "A sedan fits individuals and couples with normal luggage. A GMC or full-size SUV, or a Hyundai Staria, suits families with more luggage. A Hiace van or coaster suits larger groups. We confirm the vehicle against your passenger and luggage count." },
  { category: "Vehicles", question: "Can you provide a GMC or a Hyundai Staria?", answer: "Both are in the vehicle categories available through our partner network. Availability is confirmed for your date, route and passenger count when we quote." },
  { category: "Groups", question: "Can you arrange a large bus for a group?", answer: "Coasters and larger coaches are arranged on request through our partner network. Send the group size, dates and routes and we confirm what is available." },
  { category: "Corporate", question: "Can I request corporate transportation in Makkah?", answer: `Yes. Email your company details and trip list for a written quote. ${CORPORATE_INVOICE_LINE}` },
  { category: "Booking", question: "Can I cancel or change a booking?", answer: "Yes. Cancellation is free up to 24 hours before pickup, and time or address changes can be made on WhatsApp." },
  { category: "Booking", question: "Do the drivers speak English?", answer: "Yes. Drivers in our partner network speak English and Arabic, and trips run 24 hours a day." },
];

export const MAKKAH_GUIDES = [
  { href: "/guides/makkah-hotel-haram-dropoff-guide", label: "Makkah hotel drop-off near the Haram" },
  { href: "/guides/jeddah-airport-to-makkah-guide", label: "Jeddah Airport to Makkah: car, train and bus compared" },
  { href: "/guides/makkah-to-madinah-transport-guide", label: "Makkah to Madinah: taxi, train or bus" },
  { href: "/blog/makkah-taxi-fares-cost-guide", label: "How taxi fares in Makkah are worked out" },
  { href: "/blog/makkah-ziyarat-taxi-holy-sites-tour", label: "Makkah Ziyarat by taxi: the holy sites" },
  { href: "/services/umrah-transport", label: "Umrah transport service" },
];

/* ─── Child pages ───────────────────────────────────────────────────── */

export const MAKKAH_PAGES: Record<string, ClusterPage> = {
  "private-driver": {
    slug: "private-driver",
    kind: "service",
    name: "Private Driver",
    nameAr: "سيارة مع سائق",
    title: "Private Driver in Makkah | Chauffeur by the Hour or Full Day",
    metaDescription: "Hire a private driver in Makkah by the hour or for a full day — meetings, shopping, family errands and Ziyarat. Fare agreed before booking, 24/7.",
    h1: "Private Driver & Chauffeur Service in Makkah",
    eyebrow: "Car with driver · Makkah",
    heroImage: "/locations/makkah-og.webp",
    heroAlt: "Minarets and the colonnaded facade of the Haram complex in Makkah at sunset",
    intro: `A private driver in Makkah is a car and chauffeur booked for a block of hours or a whole day. The car waits outside every stop — a meeting, a shopping trip, a family visit, a Ziyarat — so you never re-book a ride or search for a taxi at the Haram after prayers. ${FREE_WAIT} of free waiting applies to single transfers; on hourly hire the waiting is part of the booked time.`,
    facts: [
      { label: "Booked by", value: "The hour or the full day" },
      { label: "Driver", value: "Waits at every stop" },
      { label: "Languages", value: "English & Arabic" },
      { label: "Cancellation", value: "Free up to 24h before" },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Who books a driver in Makkah",
        heading: "Four kinds of Makkah day",
        items: [
          { title: "The family day", body: "Elderly parents, children and shopping bags in one vehicle, with the driver timing pickups around prayer times instead of the other way round." },
          { title: "The Ziyarat day", body: "Jabal al-Nour, Jabal Thawr, Mina, Muzdalifah and Arafat in one half-day, with waiting time at each stop. Transport only — no religious guidance." },
          { title: "The business day", body: "Hotel, two or three meetings across the city, lunch and an evening flight from Jeddah — one car all day, bags stay in the boot." },
          { title: "The Makkah–Jeddah day", body: `A morning in Makkah and an afternoon in Jeddah, or the reverse. Makkah to Jeddah is about ${MK_JEDDAH.km} km each way.` },
        ],
      },
      {
        type: "compare",
        heading: "Driver for the day or separate transfers?",
        intro: "Count your stops — that usually decides it.",
        options: [
          { title: "Separate transfers", tone: "ink", when: ["One or two trips in the day", "Long gaps between them", "No waiting needed"] },
          { title: "Private driver", tone: "green", when: ["Three or more stops", "Elders, children or heavy bags", "Plans that may change around prayer times"] },
        ],
      },
      {
        type: "table",
        heading: "Hourly hire in Makkah: what you can book",
        columns: ["Use", "How it is booked"],
        rows: [
          ["Half-day Ziyarat", "A block of hours with waiting at each site"],
          ["Full-day city driver", "Start time, hours and a rough list of stops"],
          ["Corporate meetings", "Written quote by email; invoicing via our sister company"],
          ["Makkah plus Jeddah or Taif", "Full-day hire or a transfer with a timed return"],
        ],
      },
    ],
    ctaHeading: "Request a private driver in Makkah",
    ctaBody: "Date, start time, hours needed and the stops you have in mind — we confirm the vehicle and fare before booking.",
    ctaLabel: "Request a Private Driver",
    waPrefill: "Salam! Private driver in Makkah (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers: \n• Vehicle (Sedan / SUV / Van): ",
    form: { pickup: "Makkah", vehicle: "Sedan", tripType: "By the Hour" },
    pathB: { heading: "Drivers for a visiting team?", body: `Daily drivers for staff or a delegation can be quoted in writing by email. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Private driver RFQ — Makkah", emailBody: corpEmail("a private driver / hourly hire in Makkah") },
    faqs: [
      { question: "How much is a private driver in Makkah?", answer: "It depends on the vehicle and the number of hours. The fare for the whole block is agreed on WhatsApp before booking — no meter and no surge." },
      { question: "Can I book a driver for just a few hours?", answer: "Yes. Hourly hire is booked in blocks of hours. Send your date, start time and how long you need the car, and we confirm availability and the fare." },
      { question: "Can the driver wait while we pray?", answer: "Yes. The car waits at the nearest permitted point and you message when you are ready. Allow extra time at prayer times, when roads near the Haram close." },
      { question: "Can we go to Jeddah and back in one day?", answer: `Yes. Makkah to Jeddah is about ${MK_JEDDAH.km} km each way. Book it as a full-day hire, or as a transfer there and a timed return — tell us the plan and we suggest the better option.` },
      { question: "Can companies book daily drivers?", answer: `Yes. ${CORPORATE_INVOICE_LINE}` },
      { question: "Which cars are available with a driver?", answer: "Sedans and full-size SUVs are the usual choice; a Hyundai Staria, vans and coasters are available through our partner network on request." },
    ],
    related: [
      { href: "/services/makkah-ziyarat", label: "Makkah Ziyarat transportation", desc: "A set route between the sites" },
      { href: "/routes/jeddah-airport-to-makkah", label: "Jeddah Airport to Makkah", desc: "When you only need the airport leg" },
      { href: "/services/corporate", label: "Corporate transportation", desc: "Accounts and invoicing" },
      { href: "/routes/makkah-to-madinah", label: "Makkah to Madinah", desc: "A single transfer to Madinah" },
    ],
    schema: { serviceType: "Hourly & full-day chauffeur hire" },
  },
};

export const MAKKAH_CHILD_NAV: { slug: string; label: string }[] = [
  { slug: "private-driver", label: "Private driver" },
];

export const MAKKAH_CITY: ClusterCity = { slug: "makkah", name: "Makkah", nav: MAKKAH_CHILD_NAV };

/* ─── Route-page metadata (Makkah corridor) ─────────────────────────────
 * Titles/descriptions for the Makkah route pages that sit at pos 60–100 in
 * GSC (2026-10-01 export). Numbers come from routeFact(), so the meta text can
 * never disagree with the page body. Hotel-specific pages (pos ~7) and
 * riyadh-to-makkah (pos ~29) are deliberately NOT overridden here.
 */
const about = (slug: string) => {
  const f = routeFact(slug)!;
  return `about ${f.km} km, ${f.time.replace("~", "roughly ")}`;
};

export const MAKKAH_ROUTE_META: Record<string, { title: string; description: string }> = {
  "jeddah-airport-to-makkah": {
    title: "Jeddah Airport to Makkah Taxi & Private Transfer | Fixed Fare",
    description: `Private transfer from Jeddah Airport (JED) to your Makkah hotel — ${about("jeddah-airport-to-makkah")}. We track your flight; fare agreed before booking. SUVs and vans for families. 24/7.`,
  },
  "makkah-to-jeddah-airport": {
    title: "Makkah to Jeddah Airport Taxi & Private Transfer | Fixed Fare",
    description: `Private car from your Makkah hotel to Jeddah Airport (JED) — ${about("makkah-to-jeddah-airport")}. Pickup timed back from your flight; fare agreed before booking. 24/7.`,
  },
  "makkah-to-madinah": {
    title: "Makkah to Madinah Taxi & Private Transfer | Fixed Fare",
    description: `Private car from Makkah to Madinah, hotel to hotel — ${about("makkah-to-madinah")}. Prayer and rest stops on request, one fare for the whole car, agreed before booking.`,
  },
  "madinah-to-makkah": {
    title: "Madinah to Makkah Taxi & Private Transfer | Fixed Fare",
    description: `Private car from Madinah to Makkah, hotel to hotel — ${about("madinah-to-makkah")}. Luggage and family-sized vehicles, stops on request, fare agreed before booking.`,
  },
  "jeddah-to-makkah": {
    title: "Jeddah to Makkah (Mecca) Taxi & Private Car | Fixed Fare",
    description: `Private car from any Jeddah hotel or address to Makkah — ${about("jeddah-to-makkah")}. One fixed fare for the whole car, agreed before booking. 24/7.`,
  },
  "makkah-to-jeddah": {
    title: "Makkah to Jeddah Private Taxi | Hotels, Corniche & City",
    description: `Private car from Makkah to any address in Jeddah — ${about("makkah-to-jeddah")}. For flights, book the Jeddah Airport leg. Fare agreed before booking, 24/7.`,
  },
  "makkah-to-taif": {
    title: "Makkah to Taif Taxi & Private Car | Al Hada Road Transfer",
    description: `Private car from Makkah to Taif up the Al Hada escarpment — ${about("makkah-to-taif")}. Day trip with a timed return, or a one-way transfer. Fare agreed before booking.`,
  },
  "taif-to-makkah": {
    title: "Taif to Makkah Taxi & Private Car | Hotels & Airport Pickup",
    description: `Private car from Taif hotels, resorts or Taif Regional Airport to Makkah — ${about("taif-to-makkah")}. Al Hada or Al Sail road; fare agreed before booking, 24/7.`,
  },
};

/** Route slugs that belong to the Makkah cluster (get the cluster link block). */
export const MAKKAH_CLUSTER_ROUTE_SLUGS = [
  "jeddah-airport-to-makkah", "makkah-to-jeddah-airport", "jeddah-to-makkah", "makkah-to-jeddah",
  "makkah-to-madinah", "madinah-to-makkah", "makkah-to-taif", "taif-to-makkah", "riyadh-to-makkah", "makkah-to-riyadh",
  "madinah-airport-to-makkah", "makkah-to-madinah-airport", "makkah-to-kaec", "makkah-to-yanbu",
  "jeddah-airport-to-swissotel-makkah", "jeddah-airport-to-fairmont-makkah", "jeddah-airport-to-pullman-zamzam-makkah",
  "jeddah-airport-to-hilton-suites-makkah", "jeddah-airport-to-conrad-makkah", "jeddah-airport-to-movenpick-makkah",
  "jeddah-airport-to-makkah-clock-tower", "makkah-clock-tower-to-madinah-markaziyah", "makkah-hotels-to-taif-resorts",
];
