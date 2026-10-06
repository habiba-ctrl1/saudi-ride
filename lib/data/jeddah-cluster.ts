// Jeddah cluster — single content source for the Jeddah hub (/locations/jeddah)
// and every Jeddah child page. Rebuilt 2026-10-06.
//
// Truth rules (CLAUDE.md §2, §14, §16, §17):
// - Distances/times only via routeFact() (ROUTES_DATA).
// - Business facts from seo/facts.md: EN/AR drivers, 24/7, fare agreed before
//   booking, free cancellation up to 24h, cash or bank transfer, e-receipt on
//   request, corporate invoicing via sister company, flight tracking (owner-
//   confirmed 2026-10-03), 15–30 min free waiting on every trip (never longer).
// - Place facts verified 2026-10-06 (sources in comments / seo/venues.md):
//   JED terminals + Haramain airport station (SPA, Wikipedia); Historic Jeddah
//   UNESCO 2014, Nasseef House, Souq Al-Alawi, Bab Makkah, no-driving core
//   (Wikipedia, Arab News); Corniche ~30 km, King Fahd's Fountain viewed from
//   Al Hamra Corniche, Al-Rahma (Floating) Mosque in Al Shati (Wikipedia);
//   Red Sea Mall + Jeddah Yacht Club in Ash Shati; Obhur Creek north Jeddah;
//   district streets (Prince Sultan Rd / Prince Majid Rd / Sari St / Madinah Rd).
// - No Miqat-on-the-road claims here (religious guidance lives on
//   /guides/miqat-jeddah-makkah); no visa/entry claims; no hotel partnerships.
import { routeFact, corpEmail, CORPORATE_INVOICE_LINE, type ClusterPage, type ClusterCity, type TripType } from "@/lib/data/cluster";

export const JED_CITY = routeFact("jeddah-airport-to-jeddah-city")!; // 20 km · 30 min
export const JED_MAKKAH = routeFact("jeddah-airport-to-makkah")!; // 80 km · 60 min
export const JEDDAH_MAKKAH = routeFact("jeddah-to-makkah")!; // 85 km · 70 min
export const JEDDAH_MADINAH = routeFact("jeddah-to-madinah")!; // 420 km · 240 min
export const JED_MADINAH = routeFact("jeddah-airport-to-madinah")!; // 410 km · 230 min
export const JEDDAH_HARAMAIN = routeFact("jeddah-to-haramain-station")!; // 15 km · 25 min
export const JEDDAH_TAIF = routeFact("jeddah-to-taif")!;

export const FREE_WAIT = "15–30 minutes";

export const JEDDAH_FACTS: { label: string; value: string }[] = [
  { label: "JED → central Jeddah", value: `${JED_CITY.km} km · ${JED_CITY.time}` },
  { label: "JED → Makkah", value: `${JED_MAKKAH.km} km · ${JED_MAKKAH.time}` },
  { label: "Flights", value: "We track your flight" },
  { label: "Free waiting", value: `${FREE_WAIT} on every trip` },
  { label: "Drivers", value: "English- & Arabic-speaking" },
  { label: "Cancellation", value: "Free up to 24 hours before" },
  { label: "Payment", value: "Cash to the driver or bank transfer" },
  { label: "Companies", value: "Invoicing via our sister company" },
];

/* ─── Hub: trip-type selector ───────────────────────────────────────── */

export const JEDDAH_TRIPS: TripType[] = [
  {
    id: "airport",
    icon: "plane",
    label: "JED airport transfer",
    short: "Terminal 1, North, Hajj",
    answer: `King Abdulaziz International Airport (JED) is about ${JED_CITY.km} km north of central Jeddah. Your driver meets you after baggage claim and takes you to your hotel, a meeting, or straight on to Makkah or Madinah. We track your flight, so a delayed landing simply moves the pickup.`,
    send: ["Flight number", "Terminal, if you know it", "Hotel or destination", "Passengers and large bags"],
    href: "/airports/king-abdulaziz-jeddah",
    linkLabel: "JED arrivals & terminals",
    waPrefill: "Salam! Jeddah airport (JED) transfer.\n• Arrival or departure: \n• Flight number & time: \n• From / to (hotel, Makkah, Madinah): \n• Passengers & bags: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "makkah",
    icon: "route",
    label: "Jeddah ↔ Makkah",
    short: `${JED_MAKKAH.km} km from JED`,
    answer: `A private car from JED to Makkah is about ${JED_MAKKAH.km} km (${JED_MAKKAH.time}); from central Jeddah about ${JEDDAH_MAKKAH.km} km. The driver drops you at your Makkah hotel as close as vehicles are allowed — no transfer at a station, no luggage carried between modes.`,
    send: ["Pickup (JED terminal or Jeddah hotel)", "Makkah hotel name", "Date and time", "Passengers and bags"],
    href: "/routes/jeddah-airport-to-makkah",
    linkLabel: "JED Airport to Makkah",
    waPrefill: "Salam! Jeddah to Makkah transfer.\n• From (JED / Jeddah hotel): \n• To (Makkah hotel): \n• Date & time: \n• Passengers & bags: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "madinah",
    icon: "route",
    label: "Jeddah ↔ Madinah",
    short: `${JEDDAH_MADINAH.km} km, door to door`,
    answer: `Jeddah to Madinah is about ${JEDDAH_MADINAH.km} km — ${JEDDAH_MADINAH.time} of driving, plus the prayer and rest stops you ask for. Common trips are JED straight to a Madinah hotel, and Jeddah hotel to Madinah hotel for families with luggage.`,
    send: ["Pickup (JED or Jeddah hotel)", "Madinah hotel", "Date and time", "Passengers and bags"],
    href: "/routes/jeddah-to-madinah",
    linkLabel: "Jeddah to Madinah route",
    waPrefill: "Salam! Jeddah to Madinah transfer.\n• From (JED / Jeddah hotel): \n• To (Madinah hotel): \n• Date & time: \n• Passengers & bags: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "hotel",
    icon: "hotel",
    label: "Hotel transfers",
    short: "Hotel ↔ airport, station, Makkah",
    answer: "From a Jeddah hotel you can book any single leg: back to JED for a flight, to the Haramain station, on to Makkah or Madinah, or across town to Al-Balad or the Corniche. Give us the hotel name and the driver comes to the right entrance.",
    send: ["Hotel name", "Where you are going", "Date and time", "Passengers and bags"],
    href: "#hotels",
    linkLabel: "Jeddah hotel transfer options",
    waPrefill: "Salam! Jeddah hotel transfer.\n• Hotel (pickup): \n• To (JED / Makkah / Madinah / station / city): \n• Date & time: \n• Passengers & bags: ",
  },
  {
    id: "private-driver",
    icon: "clock",
    label: "Private driver",
    short: "By the hour or full day",
    answer: "Keep one car and driver for a block of hours — the car waits outside each stop. Useful for a day of meetings, a family day out, or a shopping run where you would otherwise wait for a new car at every door.",
    send: ["Date and start time", "Hours needed", "Rough list of stops", "Passengers"],
    href: "/locations/jeddah/private-driver",
    linkLabel: "Private driver in Jeddah",
    waPrefill: "Salam! Private driver in Jeddah (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "sightseeing",
    icon: "landmark",
    label: "Sightseeing",
    short: "Al-Balad, Corniche, Obhur",
    answer: "Historic Al-Balad, the Corniche and King Fahd's Fountain, the Floating Mosque in Al Shati, and the beaches of Obhur are spread along 30-plus km of coast. A half-day or full-day car links them without parking or re-booking.",
    send: ["Places you want to see", "Date and start time", "Half day or full day", "Passengers (children's ages help)"],
    href: "/locations/jeddah/city-tour",
    linkLabel: "Jeddah city tour by car",
    waPrefill: "Salam! Jeddah sightseeing by car.\n• Places (Al-Balad / Corniche / Obhur / other): \n• Date & start time: \n• Half day or full day: \n• Passengers: ",
  },
  {
    id: "intercity",
    icon: "route",
    label: "Intercity",
    short: "Taif, KAEC, Yanbu, Riyadh",
    answer: "Beyond Makkah and Madinah, the regular Jeddah corridors are Taif up the escarpment, King Abdullah Economic City (KAEC) up the coast, Yanbu, and the long drive to Riyadh. One fare for the whole car, agreed before you go.",
    send: ["Pickup address", "Destination city and address", "Date and time", "Passengers and bags"],
    href: "#destinations",
    linkLabel: "Every route from Jeddah",
    waPrefill: "Salam! Intercity trip from Jeddah.\n• From (Jeddah address / JED): \n• To (city / address): \n• Date & time: \n• Passengers & bags: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "corporate",
    icon: "briefcase",
    label: "Business & corporate",
    short: "Executives, teams, accounts",
    answer: `Visiting executives, recurring staff movements and delegations get one point of contact and a written quote by email, with vehicles from executive sedans to coasters through our partner network. ${CORPORATE_INVOICE_LINE}`,
    send: ["Company and contact", "Dates and trip list", "Passengers per trip", "Whether you need an invoice"],
    href: "/services/corporate",
    linkLabel: "Corporate transportation",
    waPrefill: "Salam! Corporate transport in Jeddah.\n• Company: \n• Dates & trips: \n• Passengers per trip: \n• Vehicle (Executive sedan / SUV / Van): \n• Invoice needed?: ",
  },
  {
    id: "events",
    icon: "ticket",
    label: "Events",
    short: "Exhibitions & big nights",
    answer: "Exhibitions at the Jeddah Center for Forums and Events and large events on the waterfront bring thousands to one place at once. Agree a drop-off and a fixed pickup point in advance rather than searching for a car at closing.",
    send: ["Event and venue", "Dates and timings", "Pickup hotel(s)", "Number of people"],
    href: "/events/jeddah-event-transportation",
    linkLabel: "Jeddah event transportation",
    waPrefill: "Salam! Event transport in Jeddah.\n• Event & venue: \n• Dates & timings: \n• Pickup hotel(s): \n• Number of people: ",
  },
];

/* ─── Hub: JED airport flow ─────────────────────────────────────────── */

export const JED_FLOW = {
  arrival: [
    { title: "Book with your flight", desc: "Send the flight number and where you are going. The fare is agreed before you travel." },
    { title: "Land at JED", desc: "Terminal 1, the North Terminal or the Hajj Terminal — tell us which if you know." },
    { title: "We track the flight", desc: `Delays move your pickup automatically, and ${FREE_WAIT} of waiting is free once you land.` },
    { title: "Meet your driver", desc: "Driver details arrive on WhatsApp before pickup, so you can call as soon as you clear baggage." },
    { title: "Luggage loaded", desc: "The vehicle is sized to your bags at booking — families and pilgrims with heavy cases get an SUV or van." },
    { title: "Hotel, Makkah or Madinah", desc: `Central Jeddah is about ${JED_CITY.km} km; Makkah about ${JED_MAKKAH.km} km; Madinah about ${JED_MADINAH.km} km.` },
  ],
  departure: [
    { title: "Book your return", desc: "Send your flight time and pickup address in Jeddah, Makkah or Madinah." },
    { title: "Pickup worked back", desc: "We set the pickup from your flight time, allowing for the distance and the season's traffic." },
    { title: "Hotel pickup", desc: "The driver meets you at the lobby and loads the bags." },
    { title: "Drop at your terminal", desc: "Straight to the departures kerb for your terminal." },
  ],
};

/* ─── Hub: Makkah & Madinah corridor board ──────────────────────────── */

export const CORRIDORS: { slug: string; label: string; note: string }[] = [
  { slug: "jeddah-airport-to-makkah", label: "JED Airport → Makkah", note: "Most-booked arrival. Straight from the terminal to your Makkah hotel." },
  { slug: "jeddah-to-makkah", label: "Jeddah city → Makkah", note: "From any Jeddah hotel or home, any time of day." },
  { slug: "makkah-to-jeddah-airport", label: "Makkah → JED Airport", note: "Departure leg, pickup worked back from your flight." },
  { slug: "jeddah-airport-to-madinah", label: "JED Airport → Madinah", note: "One car from arrivals to your Madinah hotel." },
  { slug: "jeddah-to-madinah", label: "Jeddah city → Madinah", note: "Hotel-to-hotel with prayer and rest stops on request." },
  { slug: "madinah-to-jeddah-airport", label: "Madinah → JED Airport", note: "For flights home after the Madinah leg." },
];

/* ─── Hub: coast strip (north → south) ──────────────────────────────── */

export const COAST_STOPS: { slug: string; name: string; nameAr: string; what: string; tag: string }[] = [
  { slug: "obhur", name: "Obhur", nameAr: "أبحر", what: "Obhur Creek, beach resorts and watersports in the far north — the coast closest to the airport.", tag: "Resorts & beach" },
  { slug: "al-shati", name: "Al Shati", nameAr: "الشاطئ", what: "The Al-Rahma (Floating) Mosque, Red Sea Mall and Jeddah Yacht Club & Marina on the northern Corniche.", tag: "Corniche north" },
  { slug: "corniche", name: "Jeddah Corniche", nameAr: "الكورنيش", what: "Around 30 km of waterfront promenade, parks and the Jeddah Waterfront.", tag: "Waterfront" },
  { slug: "al-hamra", name: "Al Hamra", nameAr: "الحمراء", what: "Corniche hotels with the best views of King Fahd's Fountain.", tag: "Hotels & fountain" },
  { slug: "al-balad", name: "Al-Balad", nameAr: "البلد", what: "Historic Jeddah, UNESCO World Heritage since 2014 — coral-stone houses and old souqs.", tag: "Heritage" },
];

export const INLAND_AREAS: { slug: string; name: string; what: string }[] = [
  { slug: "al-andalus", name: "Al Andalus", what: "Central, next to Al Andalus Mall at King Abdullah Rd" },
  { slug: "al-salamah", name: "Al Salamah", what: "North-central, between the airport road and the coast" },
  { slug: "al-rawdah", name: "Al Rawdah", what: "Prince Sultan Road offices, cafés and Al Rawdah Park" },
  { slug: "al-safaa", name: "Al Safaa", what: "North Jeddah residential, along Prince Majid Road" },
  { slug: "al-faisaliyah", name: "Al Faisaliyah", what: "North Jeddah, Sari Street and Al Tayebat museum" },
  { slug: "al-aziziyah-jeddah", name: "Al Aziziyah", what: "Between central Jeddah and the airport, off Madinah Road" },
];

/* ─── Hub: hotel transfer matrix (all real ROUTES_DATA slugs) ───────── */

export const HOTEL_LEGS: { slug: string; label: string; when: string }[] = [
  { slug: "jeddah-airport-to-jeddah-city", label: "JED ↔ your Jeddah hotel", when: "Arrival and departure days" },
  { slug: "jeddah-to-haramain-station", label: "Hotel → Haramain train station", when: "If you are taking the train to Makkah or Madinah" },
  { slug: "jeddah-to-makkah", label: "Hotel → Makkah hotel", when: "Umrah from a Jeddah stay" },
  { slug: "jeddah-to-madinah", label: "Hotel → Madinah hotel", when: "Family trips with luggage" },
  { slug: "jeddah-to-taif", label: "Hotel → Taif", when: "Mountain day trip or summer stay" },
  { slug: "jeddah-to-kaec", label: "Hotel → KAEC", when: "Business at King Abdullah Economic City" },
];

/* ─── Hub: destinations (DestinationExplorer) ───────────────────────── */

export const JEDDAH_DEST_GROUPS: { id: string; label: string; intro: string; items: { slug: string; name: string; purpose: string; from?: string }[] }[] = [
  {
    id: "holy",
    label: "Makkah & Madinah",
    intro: "The corridors most Jeddah visitors book. Door to door, one fare for the car.",
    items: [
      { slug: "jeddah-airport-to-makkah", name: "Makkah", purpose: "From the terminal to your hotel", from: "JED Airport" },
      { slug: "jeddah-to-makkah", name: "Makkah", purpose: "From any Jeddah address" },
      { slug: "jeddah-airport-to-madinah", name: "Madinah", purpose: "Arrivals straight to Madinah", from: "JED Airport" },
      { slug: "jeddah-to-madinah", name: "Madinah", purpose: "Hotel to hotel" },
    ],
  },
  {
    id: "saudi",
    label: "Saudi cities",
    intro: "Intercity cars from Jeddah, with rest and prayer stops on request.",
    items: [
      { slug: "jeddah-to-kaec", name: "KAEC", purpose: "King Abdullah Economic City & port" },
      { slug: "jeddah-to-taif", name: "Taif", purpose: "Mountain city via Al Hada" },
      { slug: "jeddah-to-yanbu", name: "Yanbu", purpose: "Red Sea industrial port city" },
      { slug: "jeddah-to-abha", name: "Abha", purpose: "Asir highlands" },
      { slug: "jeddah-to-alula", name: "AlUla", purpose: "Hegra & heritage sites" },
      { slug: "jeddah-to-riyadh", name: "Riyadh", purpose: "Cross-Kingdom to the capital" },
      { slug: "jeddah-to-neom", name: "NEOM", purpose: "Project & site travel" },
    ],
  },
  {
    id: "airport",
    label: "From JED Airport",
    intro: "Direct from arrivals — no stop in Jeddah needed.",
    items: [
      { slug: "jeddah-airport-to-jeddah-city", name: "Central Jeddah", purpose: "Any Jeddah hotel", from: "JED Airport" },
      { slug: "jeddah-airport-to-kaec", name: "KAEC", purpose: "Business arrivals", from: "JED Airport" },
      { slug: "jeddah-airport-to-taif", name: "Taif", purpose: "Straight up the mountain", from: "JED Airport" },
    ],
  },
  {
    id: "gcc",
    label: "Cross-border",
    intro: "Long-distance pre-booked car to the UAE. Passengers need their own valid travel documents.",
    items: [{ slug: "jeddah-to-abudhabi", name: "Abu Dhabi, UAE", purpose: "Business & family trips" }],
  },
];

export const JEDDAH_VEHICLE_FIT = [
  { id: "sedan", label: "Executive sedan", fleetSlug: "toyota-camry", forWho: "One to three people with normal luggage", href: "/fleet/toyota-camry" },
  { id: "suv", label: "Full-size SUV", fleetSlug: "gmc-yukon-xl", forWho: "Families and Umrah travellers with heavy cases", href: "/fleet/gmc-yukon-xl" },
  { id: "van", label: "VIP van", fleetSlug: "hyundai-staria", forWho: "Small groups travelling together", href: "/fleet/hyundai-staria" },
  { id: "coaster", label: "Coaster / minibus", fleetSlug: "toyota-coaster", forWho: "Umrah groups, teams and delegations", href: "/fleet/toyota-coaster" },
  { id: "luxury", label: "Luxury chauffeur", fleetSlug: "mercedes-s-class", forWho: "VIP arrivals and senior guests", href: "/services/vip-transportation" },
];

/* ─── Hub: timing ───────────────────────────────────────────────────── */

export const JEDDAH_TIMING = [
  { title: "Night arrivals at JED", body: "Many international flights land late at night or before dawn. Transfers run 24/7 — book ahead so the car is waiting rather than searched for at 3 am." },
  { title: "Umrah peaks and Ramadan", body: "Jeddah–Makkah traffic and airport crowds build sharply in Ramadan and peak Umrah weeks. Leave extra time for departures, and book vans and SUVs early in those weeks." },
  { title: "Corniche evenings", body: "The waterfront is busiest on Thursday and Friday evenings. A fixed pickup time and point saves circling the promenade." },
  { title: "Old town access", body: "Cars cannot drive through the historic core of Al-Balad. Drop-off and pickup happen at its edge — agree the exact point in advance." },
  { title: "Summer heat", body: "From late spring to autumn, plan outdoor sightseeing for early morning and after sunset, with the car close by between stops." },
  { title: "Long drives", body: `Madinah is about ${JEDDAH_MADINAH.time} of driving and Taif climbs a steep escarpment road. Tell the driver your preferred prayer and rest stops at the start.` },
];

/* ─── Hub: Haramain train vs private car (honest comparison) ────────── */
// Haramain station at JED Terminal 1: ~45 min to Makkah, ~1 h 45 to Madinah
// (SPA, spa.gov.sa/en/N2586844). Trains arrive at the city stations, not at
// your hotel.
export const TRAIN_VS_CAR = [
  { point: "Door to door", car: "Yes — terminal or hotel to hotel", train: "Station to station; a transfer is needed at each end" },
  { point: "Luggage", car: "All bags in one vehicle, loaded by the driver", train: "Carried through two stations" },
  { point: "Family or group", car: "One fare for the whole car", train: "A ticket per person" },
  { point: "Time in motion", car: `About ${JED_MAKKAH.time} JED → Makkah`, train: "About 45 min airport station → Makkah station" },
  { point: "Timetable", car: "Leave when you are ready, 24/7", train: "Fixed departures" },
];

/* ─── Hub: visitor guide + FAQ ──────────────────────────────────────── */

export const JEDDAH_VISITOR_GUIDE = [
  { q: "How do I get from Jeddah airport to Makkah?", a: `The simplest way is a pre-booked private car from your JED terminal to your Makkah hotel — about ${JED_MAKKAH.km} km and ${JED_MAKKAH.time}, with your bags in the same vehicle. The Haramain train from the Terminal 1 station is the alternative if you travel light and are happy to transfer at Makkah station.` },
  { q: "Which terminal will I arrive at?", a: "JED has Terminal 1, the North Terminal and, in pilgrimage season, the Hajj Terminal. Your airline confirms which; send us the flight number and we plan the pickup for that terminal." },
  { q: "Can I go straight from the airport to Madinah?", a: `Yes. JED Airport to Madinah is about ${JED_MADINAH.km} km by road. Many families do this on arrival day rather than stopping in Jeddah — tell us if you want a meal or prayer stop on the way.` },
  { q: "What should I book for a day in Jeddah?", a: "If you have three or more stops — Al-Balad, the Corniche, a mall, a restaurant — book a car by the hour. For a single trip, book a one-way transfer and a timed return." },
  { q: "Can I travel with a lot of luggage?", a: "Yes. Tell us the number of large cases when you book. Full-size SUVs, vans and coasters are the usual choice for Umrah families with luggage and zamzam." },
  { q: "How do I pay?", a: "Cash to the driver or bank transfer. An electronic receipt is available on request." },
];

export const JEDDAH_BOOKING_STEPS = [
  { title: "Send your trip", desc: "Form or WhatsApp: pickup, drop-off, date, passengers, bags, flight number." },
  { title: "Agree one fare", desc: "We confirm the vehicle and one fixed fare before anything is booked." },
  { title: "Driver details", desc: "Name and number arrive on WhatsApp before pickup. We track your flight." },
  { title: "Ride & pay", desc: `${FREE_WAIT} free waiting. Pay cash or by bank transfer.` },
];

export const JEDDAH_HUB_FAQS: { question: string; answer: string; category: string }[] = [
  { category: "Airport", question: "How far is Jeddah airport from the city centre?", answer: `King Abdulaziz International Airport (JED) is about ${JED_CITY.km} km from central Jeddah — ${JED_CITY.time} on a clear road. Hotels in the far north (Obhur) are closer; Al-Balad in the south is further.` },
  { category: "Airport", question: "Do you track my flight if it is delayed?", answer: `Yes. Share your flight number when you book and we track the flight, so a delay moves your pickup. ${FREE_WAIT} of waiting after landing is free.` },
  { category: "Makkah & Madinah", question: "What is the best way to get from Jeddah Airport to Makkah?", answer: `For most visitors, a pre-booked private car: about ${JED_MAKKAH.km} km and ${JED_MAKKAH.time} from your terminal to your Makkah hotel, with all your luggage in one vehicle. The Haramain train is faster in motion but runs station to station, so you still need a car at the Makkah end.` },
  { category: "Makkah & Madinah", question: "How long is the drive from Jeddah to Madinah?", answer: `About ${JEDDAH_MADINAH.km} km — ${JEDDAH_MADINAH.time} of driving, longer with the prayer and rest stops you ask for. From JED airport it is about ${JED_MADINAH.km} km.` },
  { category: "Makkah & Madinah", question: "Can the driver take us to our Makkah hotel door?", answer: "The driver takes you as close to your hotel as vehicles are permitted. Near the Haram some roads close at peak times, and the driver uses the nearest allowed drop-off point." },
  { category: "Booking", question: "Can I hire a car with driver in Jeddah for a day?", answer: "Yes. Book a private driver by the hour or for a full day; the car waits between stops. It suits sightseeing across Al-Balad and the Corniche, a day of meetings, or a long shopping day." },
  { category: "Booking", question: "How much does a private transfer in Jeddah cost?", answer: "The fare depends on the route, vehicle, date and any waiting time. It is quoted per trip and agreed before booking — one fixed price, no meter, no surge." },
  { category: "Booking", question: "What vehicle should a family with luggage book?", answer: "A full-size SUV takes up to seven passengers with several large cases; a VIP van or a coaster suits larger families and groups. A sedan fits one to three people with normal luggage." },
  { category: "Booking", question: "Can I cancel or change a booking?", answer: "Yes. Cancellation is free up to 24 hours before pickup, and changes to time or address can be made on WhatsApp." },
  { category: "Payment", question: "Can my company be invoiced?", answer: `Yes. ${CORPORATE_INVOICE_LINE} Email your company details and trip list for a written quote before booking.` },
  { category: "Booking", question: "Do the drivers speak English?", answer: "Yes. Drivers in our Jeddah partner network speak English and Arabic, and trips run 24 hours a day." },
];

export const JEDDAH_GUIDES = [
  { href: "/guides/jeddah-airport-guide", label: "JED arrivals: terminal walk-through" },
  { href: "/guides/jeddah-airport-to-makkah-guide", label: "JED to Makkah: car, train and bus compared" },
  { href: "/guides/miqat-jeddah-makkah", label: "Miqat and Ihram when arriving via Jeddah" },
  { href: "/guides/jeddah-airport-sim-card", label: "Buying a SIM card at Jeddah Airport" },
  { href: "/blog/jeddah-to-madinah-taxi-guide-fares", label: "Jeddah to Madinah by car" },
  { href: "/fleet", label: "Vehicle categories in the partner network" },
];

/* ─── Child pages ───────────────────────────────────────────────────── */

const mk = JEDDAH_MAKKAH;

export const JEDDAH_PAGES: Record<string, ClusterPage> = {
  /* NEW — private driver (GSC: "jeddah chauffeur service" + variants ~118 impr, pos ~78) */
  "private-driver": {
    slug: "private-driver",
    kind: "service",
    name: "Private Driver",
    nameAr: "سائق خاص",
    title: "Private Driver in Jeddah | Chauffeur by the Hour or Day",
    metaDescription: "Hire a private driver in Jeddah by the hour or for a full day — meetings, Al-Balad and Corniche sightseeing, shopping or a Makkah day. Fare agreed first.",
    h1: "Private Driver & Chauffeur Service in Jeddah",
    eyebrow: "Car with driver · Jeddah",
    heroImage: "/gallery/business-transfer.webp",
    heroAlt: "Business traveller working on a laptop in the back seat of a chauffeured car",
    intro: `A private driver in Jeddah is a car and chauffeur booked for a block of hours or a whole day. The car waits outside every stop — a meeting in Al Rawdah, a walk through Al-Balad, dinner on the Corniche — so you never re-book a ride. ${FREE_WAIT} of free waiting applies to single transfers; on hourly hire the waiting is the point. The fare is agreed before booking.`,
    facts: [
      { label: "Booked by", value: "The hour or the full day" },
      { label: "Driver", value: "Waits at every stop" },
      { label: "Languages", value: "English & Arabic" },
      { label: "Cancellation", value: "Free up to 24h before" },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Who books a driver in Jeddah",
        heading: "Three kinds of Jeddah day",
        items: [
          { title: "The business day", body: "Hotel, two or three meetings across Al Rawdah and Al Andalus, lunch, and an evening flight from JED — one car all day, bags stay in the boot." },
          { title: "The visitor day", body: "Al-Balad in the cooler morning, the Corniche and King Fahd's Fountain after sunset, the Floating Mosque in between — with no parking to find." },
          { title: "The family errand day", body: "Malls, clinics and family visits across north and central Jeddah, with children and shopping bags in one vehicle." },
        ],
      },
      {
        type: "timeline",
        eyebrow: "Sample itinerary",
        heading: "A full sightseeing day with one driver",
        intro: "An example plan — the route is yours to change on the day.",
        items: [
          { time: "08:30", title: "Hotel pickup", desc: "Start early, before the midday heat." },
          { time: "09:00", title: "Al-Balad", desc: "Dropped at the edge of the old town — cars cannot drive its core. Walk Souq Al-Alawi and Nasseef House." },
          { time: "13:00", title: "Lunch and rest", desc: "Back to the hotel or a restaurant of your choice." },
          { time: "17:00", title: "Al-Rahma (Floating) Mosque", desc: "On the northern Corniche in Al Shati." },
          { time: "19:00", title: "Corniche & King Fahd's Fountain", desc: "The fountain is best seen after dark from Al Hamra Corniche." },
        ],
      },
      {
        type: "compare",
        heading: "Driver for the day or separate transfers?",
        intro: "Count your stops — that usually decides it.",
        options: [
          { title: "Separate transfers", tone: "ink", when: ["One or two trips in the day", "Long gaps between them", "No waiting needed"] },
          { title: "Private driver", tone: "green", when: ["Three or more stops", "Children, elders or heavy bags", "Plans that may change on the day"] },
        ],
      },
    ],
    ctaHeading: "Request a private driver",
    ctaBody: "Date, start time, hours needed and the stops you have in mind — we confirm the vehicle and fare before booking.",
    ctaLabel: "Request a Private Driver",
    waPrefill: "Salam! Private driver in Jeddah (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers: \n• Vehicle (Sedan / SUV / Van): ",
    form: { pickup: "Jeddah", vehicle: "Sedan", tripType: "By the Hour" },
    pathB: { heading: "Drivers for a visiting team?", body: `Daily drivers for staff or a delegation can be quoted in writing by email. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Private driver RFQ — Jeddah", emailBody: corpEmail("a private driver / hourly hire in Jeddah") },
    faqs: [
      { question: "How much is a private driver in Jeddah?", answer: "It depends on the vehicle and the number of hours. The fare for the whole block is agreed on WhatsApp before booking — no meter and no surge." },
      { question: "Can I book a driver for just a few hours?", answer: "Yes. Hourly hire is booked in blocks of hours. Send your date, start time and how long you need the car, and we confirm availability and the fare." },
      { question: "Can the private driver take us to Makkah and back the same day?", answer: `Yes. Jeddah to Makkah is about ${mk.km} km each way. Book it as a full-day hire, or as a transfer there and a timed return — tell us your plan and we suggest the better option.` },
      { question: "Does the driver wait while we are in Al-Balad?", answer: "Yes. The driver drops you at the edge of the old town — cars cannot enter its core — and waits nearby until you message." },
      { question: "Can companies book daily drivers?", answer: `Yes. ${CORPORATE_INVOICE_LINE}` },
      { question: "Which cars are available with a driver?", answer: "Executive sedans and full-size SUVs are the usual choice; vans, coasters and luxury vehicles are available through our partner network on request." },
    ],
    related: [
      { href: "/locations/jeddah/city-tour", label: "Jeddah city tour", desc: "A set sightseeing route by car" },
      { href: "/airports/king-abdulaziz-jeddah", label: "JED airport transfers", desc: "When you only need the airport leg" },
      { href: "/services/corporate", label: "Corporate transportation", desc: "Accounts and invoicing" },
      { href: "/routes/jeddah-to-makkah", label: "Jeddah to Makkah", desc: "A single transfer to Makkah" },
    ],
    schema: { serviceType: "Hourly & full-day chauffeur hire" },
  },

  /* Al-Balad — heritage destination */
  "al-balad": {
    slug: "al-balad",
    kind: "attraction",
    name: "Al-Balad",
    nameAr: "البلد",
    title: "Al-Balad Jeddah Transport | Getting to Historic Jeddah by Car",
    metaDescription: "Private car to Al-Balad, Historic Jeddah (UNESCO) — where the driver can drop you, timed returns, and combining the old town with the Corniche. 24/7.",
    h1: "Getting to Al-Balad, Historic Jeddah, by Private Car",
    eyebrow: "Historic Jeddah · UNESCO World Heritage",
    intro: "Al-Balad is the historic heart of Jeddah, inscribed by UNESCO in 2014 as \"Historic Jeddah, the Gate to Makkah\". Its coral-stone houses, Nasseef House and Souq Al-Alawi sit in lanes built long before cars, so you cannot drive through the core — a private car drops you at its edge and collects you at a time or point you agree.",
    facts: [
      { label: "Status", value: "UNESCO World Heritage (2014)" },
      { label: "Inside the old town", value: "On foot — no driving" },
      { label: "Landmarks", value: "Nasseef House · Souq Al-Alawi · Bab Makkah" },
      { label: "Book as", value: "Drop-off + timed return" },
    ],
    blocks: [
      {
        type: "steps",
        eyebrow: "How the visit works",
        heading: "Arriving and leaving Al-Balad by car",
        items: [
          { title: "Choose a drop-off", desc: "Tell us where you want to start — Bab Makkah or a named café or house — and the driver plans the nearest point vehicles can reach." },
          { title: "Walk the old town", desc: "Souq Al-Alawi, Nasseef House and the coral-stone lanes are all on foot." },
          { title: "Message when ready", desc: "Send a map pin on WhatsApp if you finish somewhere else." },
          { title: "Pickup at the edge", desc: "The driver collects you at the agreed point, ready for the next stop." },
        ],
      },
      {
        type: "prose",
        heading: "When to go, and what to pair it with",
        paragraphs: [
          "Al-Balad is most comfortable in the early morning and after sunset — the lanes hold the heat in the middle of the day. Weekend evenings are the busiest time in the old town.",
          "Most visitors pair it with the Corniche: the old town in the morning or late afternoon, then King Fahd's Fountain after dark from Al Hamra Corniche. That is two or three stops — a car by the hour is usually simpler than separate rides.",
        ],
      },
      {
        type: "routes",
        heading: "Al-Balad to the rest of your trip",
        intro: "Al-Balad sits in the south of central Jeddah; these are the onward journeys visitors book most.",
        items: [
          { slug: "jeddah-to-makkah", note: "Old town in the morning, Makkah by the afternoon — one car, one fare." },
          { slug: "jeddah-airport-to-jeddah-city", note: "Arriving at JED and heading straight to an Al-Balad hotel." },
        ],
      },
    ],
    ctaHeading: "Plan your Al-Balad visit",
    ctaBody: "Your hotel, the date, roughly how long you will stay, and anywhere you want to go after.",
    ctaLabel: "Get My Al-Balad Ride",
    waPrefill: "Salam! Trip to Al-Balad (Historic Jeddah).\n• Pickup hotel: \n• Date & time: \n• Return time or wait?: \n• Next stop (Corniche / hotel / other): \n• Passengers: ",
    form: { dropoff: "Al-Balad (Historic Jeddah)", vehicle: "Sedan", tripType: "Round Trip" },
    faqs: [
      { question: "Can a car drive into Al-Balad?", answer: "Not through its historic core — the lanes are pedestrian. A private car drops you and collects you at the edge of the old town, at a point you agree in advance." },
      { question: "What is there to see in Al-Balad?", answer: "Historic Jeddah's coral-stone houses, Nasseef House (built 1872–1881), the Souq Al-Alawi market street and Bab Makkah, the old gate on the road to Makkah." },
      { question: "When is the best time to visit Al-Balad?", answer: "Early morning or after sunset, when it is cooler. Weekend evenings are the busiest." },
      { question: "Can I combine Al-Balad and the Corniche in one trip?", answer: "Yes. Book a car by the hour: the old town first, then the Corniche and King Fahd's Fountain after dark." },
    ],
    related: [
      { href: "/locations/jeddah/corniche", label: "Jeddah Corniche", desc: "The usual second stop" },
      { href: "/locations/jeddah/city-tour", label: "Jeddah city tour", desc: "Al-Balad within a full day" },
      { href: "/locations/jeddah/private-driver", label: "Private driver", desc: "Keep the car while you walk" },
      { href: "/locations/jeddah/al-hamra", label: "Al Hamra", desc: "Nearby Corniche hotels" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "Historic Jeddah (Al-Balad)", type: "TouristAttraction", description: "UNESCO World Heritage historic district of Jeddah, inscribed 2014." } },
  },

  /* Corniche — waterfront (Waterfront folded in) */
  corniche: {
    slug: "corniche",
    kind: "attraction",
    name: "Jeddah Corniche",
    nameAr: "كورنيش جدة",
    title: "Jeddah Corniche & Waterfront Transfers | Evening Pickups",
    metaDescription: "Private car to the Jeddah Corniche and Waterfront — King Fahd's Fountain, the Floating Mosque and the promenade, with a fixed evening pickup. 24/7.",
    h1: "Jeddah Corniche & Waterfront by Private Car",
    eyebrow: "Red Sea waterfront · Jeddah",
    heroImage: "/locations/jeddah-hero.webp",
    heroAlt: "Waves breaking on the rocks below the Jeddah Corniche promenade, with palm trees and towers",
    intro: "The Jeddah Corniche runs for around 30 km along the Red Sea, from the north of the city past the Jeddah Waterfront to Al Hamra. It is where Jeddah goes in the evening — for King Fahd's Fountain, the Al-Rahma (Floating) Mosque, the parks and the seafront cafés — so the useful thing to book is a drop-off at the stretch you want and a fixed pickup later.",
    facts: [
      { label: "Length", value: "About 30 km of coast" },
      { label: "Highlights", value: "King Fahd's Fountain · Floating Mosque" },
      { label: "Busiest", value: "Thursday & Friday evenings" },
      { label: "Book as", value: "Drop-off + fixed pickup" },
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "Which stretch?",
        heading: "The Corniche, north to south",
        intro: "Tell the driver which stretch you want — it is too long to say just \"the Corniche\".",
        columns: ["Stretch", "What is there", "District page"],
        rows: [
          ["Northern Corniche", "Al-Rahma (Floating) Mosque, Red Sea Mall, Jeddah Yacht Club & Marina", "Al Shati"],
          ["Jeddah Waterfront", "Promenade, parks, play areas and cafés", "This page"],
          ["Al Hamra Corniche", "Corniche hotels and the best views of King Fahd's Fountain", "Al Hamra"],
        ],
      },
      {
        type: "compare",
        heading: "Fixed pickup or keep the car?",
        options: [
          { title: "Drop-off + fixed pickup", tone: "ink", when: ["One stretch of the Corniche", "You know when you will leave", "Lowest total fare"] },
          { title: "Car for the evening", tone: "green", when: ["Fountain, mosque and dinner in one night", "Children or elders", "No fixed end time"] },
        ],
      },
    ],
    ctaHeading: "Book your Corniche evening",
    ctaBody: "Which stretch, the date, drop-off time and when you plan to leave.",
    ctaLabel: "Get My Corniche Ride",
    waPrefill: "Salam! Jeddah Corniche trip.\n• Stretch (North / Waterfront / Al Hamra): \n• Pickup hotel: \n• Date & drop-off time: \n• Pickup time or wait?: \n• Passengers: ",
    form: { dropoff: "Jeddah Corniche", vehicle: "VIP SUV", tripType: "Round Trip" },
    faqs: [
      { question: "How long is the Jeddah Corniche?", answer: "Around 30 km of coastline. It is worth naming the stretch you want — the northern Corniche, the Jeddah Waterfront, or Al Hamra." },
      { question: "Where is the best place to see King Fahd's Fountain?", answer: "Along Al Hamra Corniche, where the hotels face the fountain. It is lit after dark." },
      { question: "Where is the Floating Mosque?", answer: "The Al-Rahma Mosque stands on the Corniche Road in Al Shati, on the northern Corniche." },
      { question: "Is it easy to get a ride home from the Corniche at night?", answer: "On Thursday and Friday evenings it is busy. A pickup booked in advance, at a point you agree, avoids searching for a car." },
    ],
    related: [
      { href: "/locations/jeddah/al-hamra", label: "Al Hamra", desc: "Fountain views and Corniche hotels" },
      { href: "/locations/jeddah/al-shati", label: "Al Shati", desc: "Floating Mosque and Red Sea Mall" },
      { href: "/locations/jeddah/al-balad", label: "Al-Balad", desc: "Pair the old town with the sea" },
      { href: "/locations/jeddah/private-driver", label: "Private driver", desc: "Keep the car all evening" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "Jeddah Corniche", type: "TouristAttraction", description: "Red Sea waterfront of Jeddah, around 30 km long." } },
  },

  /* Obhur — title/H1 locked (GSC pos 4.5) */
  obhur: {
    slug: "obhur",
    kind: "district",
    name: "Obhur (Abhur)",
    nameAr: "أبحر",
    title: "Taxi & Private Transfer in Obhur (Abhur), Jeddah | Taxi Saudi Arabia",
    metaDescription: "Private transfers to and from Obhur (Abhur), north Jeddah — Obhur Creek beach resorts, JED airport runs and day trips to Makkah. Fare agreed first, 24/7.",
    h1: "Taxi Service in Obhur (Abhur)",
    tagline: "Resort and beach transfers on Obhur Creek, north Jeddah — the stretch of coast closest to the airport.",
    eyebrow: "North Jeddah · Obhur Creek",
    intro: "Obhur (Abhur) is the resort coast in the far north of Jeddah, spread along both banks of Obhur Creek — Obhur Al Shamaliyah on the north side and South Obhur opposite. It is the part of the coast nearest King Abdulaziz International Airport, so most bookings are airport-to-resort transfers, weekend trips from the city, and families heading on to Makkah.",
    facts: [
      { label: "Where", value: "Far north Jeddah, on Obhur Creek" },
      { label: "Best for", value: "Beach resorts, watersports" },
      { label: "Airport", value: "The coast closest to JED" },
      { label: "Hours", value: "24/7" },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Typical Obhur trips",
        heading: "Why people book a car in Obhur",
        items: [
          { title: "Resort arrivals", body: "JED to a north or south Obhur resort or villa, with bags and beach gear in an SUV." },
          { title: "City evenings", body: "Obhur to the Corniche or a restaurant in central Jeddah and back — the city is a long drive south." },
          { title: "Onward to Makkah", body: "Resort stays that finish with a transfer to a Makkah hotel." },
        ],
      },
      {
        type: "checklist",
        heading: "Make your Obhur pickup quick",
        items: [
          "Say North Obhur (Al Shamaliyah) or South Obhur — they are on opposite sides of the creek",
          "Give the resort or compound name, not just \"Obhur\"",
          "Mention any gate or security check at a private compound",
          "Tell us about surfboards, diving kit or extra beach gear",
        ],
      },
      {
        type: "routes",
        heading: "From Obhur to the rest of the region",
        items: [
          { slug: "jeddah-to-makkah", note: "Resort to Makkah hotel — plan extra time to cross the city first." },
          { slug: "jeddah-to-kaec", note: "KAEC is further north up the coast from Obhur." },
        ],
      },
    ],
    ctaHeading: "Book an Obhur transfer",
    ctaBody: "North or South Obhur, the resort name, date, time and bags.",
    ctaLabel: "Get My Obhur Transfer Quote",
    waPrefill: "Salam! Obhur (Abhur) transfer.\n• North or South Obhur, resort name: \n• From / to (JED / city / Makkah): \n• Date & time: \n• Passengers & bags: ",
    form: { pickup: "King Abdulaziz Airport (JED)", dropoff: "Obhur, Jeddah", vehicle: "VIP SUV" },
    faqs: [
      { question: "Is Obhur close to Jeddah airport?", answer: "Yes — Obhur is in the far north of Jeddah, the stretch of coast closest to King Abdulaziz International Airport. Central Jeddah and Al-Balad are much further south." },
      { question: "Do you pick up from North and South Obhur?", answer: "Yes. Tell us which side of Obhur Creek and the resort or compound name, and the driver comes to its entrance, 24/7." },
      { question: "Can I go from an Obhur resort straight to Makkah?", answer: "Yes. Book a direct transfer from your resort to your Makkah hotel; allow extra time for crossing Jeddah first." },
      { question: "Can you carry beach and diving gear?", answer: "Yes — mention it when you book so we send an SUV or van with enough space." },
    ],
    related: [
      { href: "/airports/king-abdulaziz-jeddah", label: "JED airport transfers", desc: "The airport is close by" },
      { href: "/locations/jeddah/al-shati", label: "Al Shati", desc: "Northern Corniche, south of Obhur" },
      { href: "/locations/jeddah/corniche", label: "Jeddah Corniche", desc: "Evenings in the city" },
      { href: "/routes/jeddah-to-kaec", label: "Jeddah to KAEC", desc: "Further up the coast" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "Obhur Creek, Jeddah", type: "Place", description: "Resort and beach area in far north Jeddah." } },
  },

  /* Al Hamra — fountain-view hotel district */
  "al-hamra": {
    slug: "al-hamra",
    kind: "district",
    name: "Al Hamra",
    nameAr: "الحمراء",
    title: "Al Hamra Jeddah Transfers | Corniche Hotels & King Fahd's Fountain",
    metaDescription: "Private transfers for Al Hamra, Jeddah — Corniche hotels facing King Fahd's Fountain, JED airport runs, Al-Balad trips and Makkah transfers. 24/7.",
    h1: "Al Hamra Transfers — Corniche Hotels & King Fahd's Fountain",
    eyebrow: "Al Hamra Corniche · Jeddah",
    intro: "Al Hamra is the Corniche district facing King Fahd's Fountain, and home to several of Jeddah's large seafront hotels — among them the InterContinental, Swissôtel Jeddah Al Hamra, the Ritz-Carlton and Park Hyatt Jeddah. Most trips start or end at one of those hotels: airport arrivals and departures, short hops to Al-Balad, and transfers on to Makkah.",
    facts: [
      { label: "Known for", value: "King Fahd's Fountain views" },
      { label: "Hotels", value: "Seafront hotels on the Corniche" },
      { label: "Nearby", value: "Al-Balad, the Jeddah Waterfront" },
      { label: "Hours", value: "24/7" },
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "From an Al Hamra hotel",
        heading: "Common trips from Al Hamra",
        columns: ["Trip", "Book as", "Note"],
        rows: [
          ["Hotel → JED for a flight", "Single transfer", "Pickup worked back from your flight time"],
          ["Hotel → Al-Balad", "Drop-off + timed return", "Dropped at the edge of the old town"],
          ["Hotel → Makkah hotel", "Single transfer", "All luggage in one vehicle"],
          ["Hotel → meetings around the city", "Hourly hire", "The car waits outside each meeting"],
        ],
      },
      {
        type: "prose",
        heading: "Seeing King Fahd's Fountain",
        paragraphs: [
          "King Fahd's Fountain, one of the tallest in the world, rises from the sea off the Al Hamra Corniche and is lit after dark. The hotels along this stretch face it directly; from elsewhere in the city, the Al Hamra Corniche is the place to stop and look.",
          "If you are staying elsewhere, an evening drop-off on Al Hamra Corniche with a fixed pickup is an easy short trip.",
        ],
      },
    ],
    ctaHeading: "Book from your Al Hamra hotel",
    ctaBody: "Hotel name, where you are going, date, time and bags.",
    ctaLabel: "Request My Hotel Transfer Quote",
    waPrefill: "Salam! Transfer from Al Hamra, Jeddah.\n• Hotel: \n• To (JED / Al-Balad / Makkah / other): \n• Date & time: \n• Passengers & bags: ",
    form: { pickup: "Al Hamra, Jeddah", vehicle: "Sedan" },
    faqs: [
      { question: "Which hotels are in Al Hamra?", answer: "Al Hamra's seafront includes the InterContinental Jeddah, Swissôtel Jeddah Al Hamra, the Ritz-Carlton Jeddah and Park Hyatt Jeddah. Give us the hotel name and the driver comes to its entrance." },
      { question: "Where can I see King Fahd's Fountain?", answer: "From the Al Hamra Corniche, opposite the fountain. It is lit after dark." },
      { question: "How far is Al Hamra from Al-Balad?", answer: "They are close — Al-Balad is a short drive south. Book a drop-off at the edge of the old town and a timed return." },
      { question: "Can I go from my Al Hamra hotel to Makkah?", answer: `Yes. Jeddah to Makkah is about ${mk.km} km — one car, door to door, fare agreed before booking.` },
    ],
    related: [
      { href: "/locations/jeddah/corniche", label: "Jeddah Corniche", desc: "The waterfront north of Al Hamra" },
      { href: "/locations/jeddah/al-balad", label: "Al-Balad", desc: "Historic Jeddah, a short drive away" },
      { href: "/routes/jeddah-to-makkah", label: "Jeddah to Makkah", desc: "Hotel to Makkah hotel" },
      { href: "/airports/king-abdulaziz-jeddah", label: "JED airport transfers", desc: "Arrivals and departures" },
    ],
    schema: { serviceType: "Hotel transfer service", place: { name: "Al Hamra, Jeddah", type: "Place", description: "Corniche district of Jeddah facing King Fahd's Fountain." } },
  },

  /* Al Shati — northern Corniche */
  "al-shati": {
    slug: "al-shati",
    kind: "district",
    name: "Al Shati",
    nameAr: "الشاطئ",
    title: "Al Shati Jeddah Transfers | Floating Mosque, Red Sea Mall & Marina",
    metaDescription: "Private transfers in Al Shati (Ash Shati), north Jeddah — the Al-Rahma Floating Mosque, Red Sea Mall and Jeddah Yacht Club & Marina. Fare agreed first.",
    h1: "Al Shati Transfers — Floating Mosque, Red Sea Mall & Marina",
    eyebrow: "Northern Corniche · Jeddah",
    intro: "Al Shati (Ash Shati) is the district on Jeddah's northern Corniche. Three of the city's best-known stops are here: the Al-Rahma Mosque — the \"Floating Mosque\" built on pillars over the sea — Red Sea Mall on King Abdulaziz Road, and Jeddah Yacht Club & Marina. Trips here are mostly evening outings, shopping runs and seafront hotel pickups.",
    facts: [
      { label: "Landmarks", value: "Al-Rahma (Floating) Mosque" },
      { label: "Shopping", value: "Red Sea Mall, King Abdulaziz Rd" },
      { label: "Waterfront", value: "Jeddah Yacht Club & Marina" },
      { label: "Hours", value: "24/7" },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Three Al Shati stops",
        heading: "What brings people to Al Shati",
        items: [
          { title: "The Floating Mosque", body: "The Al-Rahma Mosque on the Corniche Road appears to float at high tide. Visitors usually come late afternoon or after sunset." },
          { title: "Red Sea Mall", body: "One of north Jeddah's big malls. Agree the entrance for pickup — large malls have several doors." },
          { title: "The marina", body: "Jeddah Yacht Club & Marina for waterfront dining and boat trips." },
        ],
      },
      {
        type: "compare",
        heading: "One stop or the whole evening?",
        options: [
          { title: "One-way + pickup", tone: "ink", when: ["Mall or mosque only", "A set leaving time"] },
          { title: "Car for the evening", tone: "green", when: ["Mosque, marina and dinner", "Shopping bags and children"] },
        ],
      },
    ],
    ctaHeading: "Plan an Al Shati trip",
    ctaBody: "Which stop, your pickup point, date and time.",
    ctaLabel: "Get My Al Shati Ride",
    waPrefill: "Salam! Al Shati, Jeddah trip.\n• Stop (Floating Mosque / Red Sea Mall / Marina): \n• Pickup: \n• Date & time: \n• Return or wait?: \n• Passengers: ",
    form: { dropoff: "Al Shati, Jeddah", vehicle: "Sedan", tripType: "Round Trip" },
    faqs: [
      { question: "Where is the Floating Mosque in Jeddah?", answer: "The Al-Rahma Mosque is on the Corniche Road in Al Shati, on Jeddah's northern Corniche." },
      { question: "Where is Red Sea Mall?", answer: "On King Abdulaziz Road in Al Shati. Tell the driver which entrance you will use for pickup." },
      { question: "Can I visit the Floating Mosque and the Corniche in one evening?", answer: "Yes. Book a car for the evening, or a drop-off with a fixed pickup if you are staying in one place." },
    ],
    related: [
      { href: "/locations/jeddah/corniche", label: "Jeddah Corniche", desc: "The rest of the waterfront" },
      { href: "/locations/jeddah/obhur", label: "Obhur", desc: "Beach resorts further north" },
      { href: "/locations/jeddah/al-salamah", label: "Al Salamah", desc: "Inland, just east" },
      { href: "/locations/jeddah/private-driver", label: "Private driver", desc: "A car for the evening" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "Al-Rahma Mosque, Jeddah", type: "TouristAttraction", description: "Mosque on the Corniche Road in Al Shati, built on pillars over the Red Sea." } },
  },

  /* Al Andalus — title/H1 locked (GSC pos 5.7) */
  "al-andalus": {
    slug: "al-andalus",
    kind: "district",
    name: "Al Andalus",
    nameAr: "الأندلس",
    title: "Taxi & Private Transfer in Al Andalus, Jeddah | Taxi Saudi Arabia",
    metaDescription: "Private transfers in Al Andalus, central Jeddah — Al Andalus Mall area hotels, JED airport runs and Makkah transfers. Fare agreed before booking, 24/7.",
    h1: "Taxi Service in Al Andalus",
    tagline: "Central Jeddah pickups around Al Andalus Mall and King Abdullah Road — airport, city and Makkah.",
    eyebrow: "Central Jeddah",
    intro: "Al Andalus is a central Jeddah district beside Al Andalus Mall, at the junction of King Abdullah Road and Prince Majid Road, with mall-side hotels such as the DoubleTree by Hilton Jeddah Al Andalus Mall. Its central position makes it a practical base: most trips are airport runs, cross-town rides and transfers to Makkah.",
    facts: [
      { label: "Landmark", value: "Al Andalus Mall" },
      { label: "Roads", value: "King Abdullah Rd · Prince Majid Rd" },
      { label: "Best for", value: "Central base, shopping, airport" },
      { label: "Hours", value: "24/7" },
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "From a central base",
        heading: "Where Al Andalus guests usually go",
        columns: ["Trip", "Why", "Book as"],
        rows: [
          ["JED airport", "Arrival and departure days", "Single transfer"],
          ["Makkah hotel", "Umrah from a Jeddah stay", "Single transfer"],
          ["Al-Balad & Corniche", "Sightseeing", "Hourly hire"],
          ["Haramain train station", "Taking the train to Makkah or Madinah", "Single transfer"],
        ],
      },
      {
        type: "routes",
        heading: "Journeys from Al Andalus",
        items: [
          { slug: "jeddah-to-haramain-station", note: "A short ride to the Haramain station if you are travelling by train." },
          { slug: "jeddah-to-makkah", note: "Straight to your Makkah hotel instead." },
        ],
      },
    ],
    ctaHeading: "Book from Al Andalus",
    ctaBody: "Hotel or address, destination, date and bags.",
    ctaLabel: "Get My Al Andalus Quote",
    waPrefill: "Salam! Pickup in Al Andalus, Jeddah.\n• Pickup (hotel / address): \n• To: \n• Date & time: \n• Passengers & bags: ",
    form: { pickup: "Al Andalus, Jeddah", vehicle: "Sedan" },
    faqs: [
      { question: "Where is Al Andalus Mall?", answer: "In central Jeddah, at King Abdullah Road and Prince Majid Road, beside the Al Andalus district." },
      { question: "Can I get from Al Andalus to the Haramain station?", answer: "Yes — it is a short ride. Book a single transfer and allow time for the station before your train." },
      { question: "Do you pick up from hotels at Al Andalus Mall?", answer: "Yes. Give us the hotel name and the driver comes to its entrance, 24/7." },
    ],
    related: [
      { href: "/locations/jeddah/al-rawdah", label: "Al Rawdah", desc: "Offices and cafés nearby" },
      { href: "/routes/jeddah-to-haramain-station", label: "To the Haramain station", desc: "If you take the train" },
      { href: "/airports/king-abdulaziz-jeddah", label: "JED airport transfers", desc: "Arrival and departure" },
      { href: "/locations/jeddah/private-driver", label: "Private driver", desc: "A day of stops" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "Al Andalus, Jeddah", type: "Place", description: "Central Jeddah district beside Al Andalus Mall." } },
  },

  /* Al Salamah — north-central residential/serviced apartments */
  "al-salamah": {
    slug: "al-salamah",
    kind: "district",
    name: "Al Salamah",
    nameAr: "السلامة",
    title: "Al Salamah Jeddah Transfers | Airport, Corniche & Makkah",
    metaDescription: "Private transfers from Al Salamah, north-central Jeddah — between the airport road and the coast. JED runs, Corniche evenings and Makkah trips, 24/7.",
    h1: "Al Salamah Transfers — Between the Airport and the Sea",
    eyebrow: "North-central Jeddah",
    intro: "Al Salamah is a north-central Jeddah district of apartments and serviced residences, placed between the main airport roads and the northern Corniche. That position decides most trips: quick runs to JED, evenings on the Corniche, and longer transfers to Makkah for residents and visitors staying here.",
    facts: [
      { label: "Where", value: "North-central Jeddah" },
      { label: "Between", value: "Airport roads and the Corniche" },
      { label: "Best for", value: "Residents, serviced apartments" },
      { label: "Hours", value: "24/7" },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Residents' trips",
        heading: "What Al Salamah residents book",
        items: [
          { title: "Early departures", body: "Pre-dawn JED runs booked the night before, with the pickup set from the flight time." },
          { title: "Coast evenings", body: "Short trips west to the northern Corniche and the Floating Mosque." },
          { title: "Visiting family in Makkah", body: "Day trips and one-way transfers to Makkah hotels." },
        ],
      },
      {
        type: "checklist",
        heading: "For apartment and compound pickups",
        items: [
          "Share a map pin — building numbers can be hard to find at night",
          "Say if the driver must wait at a gate or call from outside",
          "Give a WhatsApp number that will be on during the pickup",
        ],
      },
    ],
    ctaHeading: "Book from Al Salamah",
    ctaBody: "Pickup pin or building, destination, date and time.",
    ctaLabel: "Get My Al Salamah Quote",
    waPrefill: "Salam! Pickup in Al Salamah, Jeddah.\n• Building / map pin: \n• To (JED / Corniche / Makkah / other): \n• Date & time: \n• Passengers & bags: ",
    form: { pickup: "Al Salamah, Jeddah", vehicle: "Sedan" },
    faqs: [
      { question: "Is Al Salamah close to the Corniche?", answer: "Yes — it sits inland of the northern Corniche, so evening trips to the waterfront and the Floating Mosque are short." },
      { question: "Can I book an early-morning airport run from Al Salamah?", answer: "Yes, 24/7. Send your flight time the day before and we set the pickup from it." },
      { question: "Do you pick up from serviced apartments?", answer: "Yes. A map pin on WhatsApp is the quickest way for the driver to find the right entrance." },
    ],
    related: [
      { href: "/locations/jeddah/al-shati", label: "Al Shati", desc: "The northern Corniche, just west" },
      { href: "/locations/jeddah/al-faisaliyah", label: "Al Faisaliyah", desc: "Neighbouring north Jeddah" },
      { href: "/airports/king-abdulaziz-jeddah", label: "JED airport transfers", desc: "Departures and arrivals" },
      { href: "/routes/jeddah-to-makkah", label: "Jeddah to Makkah", desc: "Visiting Makkah" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "Al Salamah, Jeddah", type: "Place", description: "North-central residential district of Jeddah." } },
  },

  /* Al Rawdah — Prince Sultan Road offices & cafés */
  "al-rawdah": {
    slug: "al-rawdah",
    kind: "district",
    name: "Al Rawdah",
    nameAr: "الروضة",
    title: "Al Rawdah Jeddah Chauffeur | Prince Sultan Road Meetings & Cafés",
    metaDescription: "Private transfers and chauffeur hire in Al Rawdah, Jeddah — Prince Sultan Road offices, cafés and Al Rawdah Park. Meetings, airport runs, 24/7.",
    h1: "Al Rawdah Chauffeur — Prince Sultan Road Meetings & Cafés",
    eyebrow: "Al Rawdah · Jeddah",
    intro: "Al Rawdah is a central-north Jeddah district bordered on its west by Prince Sultan Road, one of the city's main commercial streets, lined with offices, clinics and cafés; Al Rawdah Park sits at Prince Sultan and Al Rawdah streets. Trips here are mostly business: meetings along Prince Sultan Road, airport runs for visiting staff, and evening dinners.",
    facts: [
      { label: "Main road", value: "Prince Sultan Road (west edge)" },
      { label: "Known for", value: "Offices, clinics, cafés" },
      { label: "Green space", value: "Al Rawdah Park" },
      { label: "Best for", value: "Meetings, business visitors" },
    ],
    blocks: [
      {
        type: "compare",
        eyebrow: "For a meeting day",
        heading: "Transfers or a car that waits?",
        options: [
          { title: "Single transfers", tone: "ink", when: ["One meeting on Prince Sultan Road", "Hotel to office and back"] },
          { title: "Chauffeur by the hour", tone: "green", when: ["Several meetings across the city", "A visitor to host all day", "Meetings that may overrun"] },
        ],
      },
      {
        type: "prose",
        heading: "Pickups on Prince Sultan Road",
        paragraphs: [
          "Prince Sultan Road is a busy divided road. Give the driver the building or café name rather than just the street, and we plan the side of the road and the stopping point before arriving.",
        ],
      },
    ],
    ctaHeading: "Book an Al Rawdah chauffeur",
    ctaBody: "Office or café, time, and whether the car should wait.",
    ctaLabel: "Request a Chauffeur Quote",
    waPrefill: "Salam! Al Rawdah, Jeddah — chauffeur / transfer.\n• Building or café: \n• From / to: \n• Date & time: \n• Single trip or hourly?: ",
    form: { pickup: "Al Rawdah, Jeddah", vehicle: "Sedan" },
    pathB: { heading: "Hosting visitors in Al Rawdah?", body: `Companies can book drivers for visiting staff with a written quote. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Chauffeur RFQ — Al Rawdah, Jeddah", emailBody: corpEmail("chauffeur hire in Al Rawdah, Jeddah") },
    faqs: [
      { question: "Can the driver wait while I am in a meeting on Prince Sultan Road?", answer: "Yes, on hourly hire — the driver waits nearby and collects you when you message." },
      { question: "Where is Al Rawdah in Jeddah?", answer: "In central-north Jeddah, bordered on its west by Prince Sultan Road. Al Rawdah Park is at the junction of Prince Sultan and Al Rawdah streets." },
      { question: "Can companies be invoiced?", answer: `Yes. ${CORPORATE_INVOICE_LINE}` },
    ],
    related: [
      { href: "/locations/jeddah/private-driver", label: "Private driver", desc: "Hourly hire for meeting days" },
      { href: "/locations/jeddah/al-andalus", label: "Al Andalus", desc: "Central Jeddah, nearby" },
      { href: "/services/corporate", label: "Corporate transportation", desc: "Accounts and invoicing" },
      { href: "/airports/king-abdulaziz-jeddah", label: "JED airport transfers", desc: "Visiting staff arrivals" },
    ],
    schema: { serviceType: "Chauffeur service", place: { name: "Al Rawdah, Jeddah", type: "Place", description: "Central-north Jeddah district along Prince Sultan Road." } },
  },

  /* Al Safaa — north Jeddah residential on Prince Majid Road */
  "al-safaa": {
    slug: "al-safaa",
    kind: "district",
    name: "Al Safaa",
    nameAr: "الصفا",
    title: "Al Safaa Jeddah Transfers | Family Trips & Airport Runs",
    metaDescription: "Private transfers from Al Safaa, north Jeddah, along Prince Majid Road — family trips to Makkah and Madinah, JED airport runs and city rides. 24/7.",
    h1: "Al Safaa Transfers — Family Trips from North Jeddah",
    eyebrow: "North Jeddah · Prince Majid Road",
    intro: "Al Safaa is a residential district in north Jeddah, along Prince Majid Road and next to Al Faisaliyah. It is a family neighbourhood, so bookings lean towards larger vehicles: whole-family trips to Makkah and Madinah, visiting relatives at the airport, and weekend outings to the coast.",
    facts: [
      { label: "Where", value: "North Jeddah" },
      { label: "Main road", value: "Prince Majid Road" },
      { label: "Typical vehicle", value: "SUV or van for families" },
      { label: "Hours", value: "24/7" },
    ],
    blocks: [
      {
        type: "routes",
        eyebrow: "Family journeys",
        heading: "Where Al Safaa families travel",
        items: [
          { slug: "jeddah-to-makkah", note: "Umrah with the whole family in one SUV or van." },
          { slug: "jeddah-to-madinah", note: "A long drive — tell us your prayer and meal stops." },
          { slug: "jeddah-to-taif", note: "A cooler weekend in the mountains." },
        ],
      },
      {
        type: "checklist",
        heading: "Booking for a family",
        items: [
          "Count child seats and tell us the children's ages",
          "List large cases and zamzam containers for the return",
          "For Madinah, say where you would like to stop on the way",
        ],
      },
    ],
    ctaHeading: "Book a family trip from Al Safaa",
    ctaBody: "Destination, date, passengers (with children's ages) and bags.",
    ctaLabel: "Get My Family Trip Quote",
    waPrefill: "Salam! Family trip from Al Safaa, Jeddah.\n• To (Makkah / Madinah / Taif / JED): \n• Date & time: \n• Adults / children (ages): \n• Bags: ",
    form: { pickup: "Al Safaa, Jeddah", vehicle: "VIP SUV" },
    faqs: [
      { question: "Which vehicle suits a family from Al Safaa going to Makkah?", answer: "A full-size SUV for up to seven people with luggage; a VIP van or coaster for bigger families." },
      { question: "Can we stop on the way to Madinah?", answer: "Yes. Tell the driver your prayer, meal and rest stops at the start of the trip." },
      { question: "Can you pick up relatives from JED and bring them to Al Safaa?", answer: "Yes. Send their flight number — we track the flight — and the address in Al Safaa." },
    ],
    related: [
      { href: "/locations/jeddah/al-faisaliyah", label: "Al Faisaliyah", desc: "The neighbouring district" },
      { href: "/routes/jeddah-to-madinah", label: "Jeddah to Madinah", desc: "Family road trip" },
      { href: "/routes/jeddah-to-taif", label: "Jeddah to Taif", desc: "Weekend in the mountains" },
      { href: "/locations/jeddah", label: "All Jeddah transport", desc: "Every trip type" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "Al Safaa, Jeddah", type: "Place", description: "Residential district in north Jeddah along Prince Majid Road." } },
  },

  /* Al Faisaliyah — north Jeddah, Sari Street */
  "al-faisaliyah": {
    slug: "al-faisaliyah",
    kind: "district",
    name: "Al Faisaliyah",
    nameAr: "الفيصلية",
    title: "Al Faisaliyah Jeddah Transfers | Sari Street & Al Tayebat",
    metaDescription: "Private transfers in Al Faisaliyah, north Jeddah — Sari Street pickups, Al Tayebat International City museum visits and JED airport runs. 24/7.",
    h1: "Al Faisaliyah Transfers — Sari Street & Al Tayebat",
    eyebrow: "North Jeddah",
    intro: "Al Faisaliyah is a north Jeddah district crossed by Sari Street and home to Al Tayebat International City, a large museum complex of science, heritage and Islamic art. Visitors come for Al Tayebat; residents book airport runs, school and clinic trips, and transfers to Makkah.",
    facts: [
      { label: "Where", value: "North Jeddah" },
      { label: "Main street", value: "Sari Street" },
      { label: "Visit", value: "Al Tayebat International City" },
      { label: "Hours", value: "24/7" },
    ],
    blocks: [
      {
        type: "steps",
        eyebrow: "Visiting Al Tayebat",
        heading: "A museum visit by car",
        items: [
          { title: "Pick your time", desc: "Check the museum's opening hours for your date before booking." },
          { title: "Drop-off at the entrance", desc: "The driver drops you at the visitor entrance." },
          { title: "Message when done", desc: "Collection at the same entrance, or wherever you send the pin." },
          { title: "On to dinner or the Corniche", desc: "Add a second stop, or keep the car by the hour." },
        ],
      },
      {
        type: "routes",
        heading: "Longer trips from Al Faisaliyah",
        items: [{ slug: "jeddah-to-makkah", note: "Door to door from north Jeddah to your Makkah hotel." }],
      },
    ],
    ctaHeading: "Book from Al Faisaliyah",
    ctaBody: "Pickup, destination, date and time.",
    ctaLabel: "Get My Al Faisaliyah Quote",
    waPrefill: "Salam! Al Faisaliyah, Jeddah trip.\n• Pickup (address / Al Tayebat): \n• To: \n• Date & time: \n• Return or wait?: \n• Passengers: ",
    form: { pickup: "Al Faisaliyah, Jeddah", vehicle: "Sedan" },
    faqs: [
      { question: "Where is Al Tayebat International City?", answer: "In Al Faisaliyah, north Jeddah. It is a large museum complex — check opening times for your date before you go." },
      { question: "Can the driver wait while we visit the museum?", answer: "Yes, on hourly hire. On a single transfer, book a timed return instead." },
      { question: "Do you cover Sari Street pickups?", answer: "Yes, 24/7. Give the building or shop name so the driver stops on the right side of the road." },
    ],
    related: [
      { href: "/locations/jeddah/al-safaa", label: "Al Safaa", desc: "The neighbouring district" },
      { href: "/locations/jeddah/al-salamah", label: "Al Salamah", desc: "North-central, nearby" },
      { href: "/locations/jeddah/city-tour", label: "Jeddah city tour", desc: "Add Al-Balad and the Corniche" },
      { href: "/airports/king-abdulaziz-jeddah", label: "JED airport transfers", desc: "Arrivals and departures" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "Al Faisaliyah, Jeddah", type: "Place", description: "North Jeddah district along Sari Street, home to Al Tayebat International City." } },
  },

  /* Al Aziziyah — between the centre and the airport, off Madinah Road */
  "al-aziziyah-jeddah": {
    slug: "al-aziziyah-jeddah",
    kind: "district",
    name: "Al Aziziyah",
    nameAr: "العزيزية",
    title: "Al Aziziyah Jeddah Transfers | Madinah Road, Airport & City",
    metaDescription: "Private transfers in Al Aziziyah, Jeddah — between the city centre and the airport, off Madinah Road. JED runs, city rides and Makkah trips, 24/7.",
    h1: "Al Aziziyah Transfers — Off Madinah Road, Between City and Airport",
    eyebrow: "Al Aziziyah · Jeddah",
    intro: "Al Aziziyah is a residential Jeddah district partway between the city centre and King Abdulaziz International Airport, reached from Madinah Road (behind Prince Majid Road). Not to be confused with Aziziyah in Makkah — this is the Jeddah neighbourhood, and its main trips are airport runs, rides into central Jeddah and transfers to Makkah.",
    facts: [
      { label: "Where", value: "Between central Jeddah and JED" },
      { label: "Access", value: "Madinah Road" },
      { label: "Not to confuse with", value: "Aziziyah, Makkah" },
      { label: "Hours", value: "24/7" },
    ],
    blocks: [
      {
        type: "checklist",
        eyebrow: "Avoid a mix-up",
        heading: "Jeddah's Al Aziziyah or Makkah's Aziziyah?",
        intro: "Both are common hotel and home addresses. Make sure the driver goes to the right one.",
        items: [
          "Write \"Al Aziziyah, Jeddah\" in full when you book",
          "Share a map pin of the building",
          "If you are staying in Aziziyah, Makkah, see our Makkah Aziziyah page instead",
        ],
      },
      {
        type: "routes",
        heading: "From Al Aziziyah",
        items: [
          { slug: "jeddah-airport-to-jeddah-city", note: "Al Aziziyah lies on the airport side of the centre." },
          { slug: "jeddah-to-makkah", note: "Door to door to your Makkah hotel." },
        ],
      },
    ],
    ctaHeading: "Book from Al Aziziyah, Jeddah",
    ctaBody: "Map pin, destination, date and time.",
    ctaLabel: "Get My Al Aziziyah Quote",
    waPrefill: "Salam! Pickup in Al Aziziyah, JEDDAH.\n• Map pin / building: \n• To (JED / city / Makkah): \n• Date & time: \n• Passengers & bags: ",
    form: { pickup: "Al Aziziyah, Jeddah", vehicle: "Sedan" },
    faqs: [
      { question: "Where is Al Aziziyah in Jeddah?", answer: "Partway between central Jeddah and King Abdulaziz International Airport, reached from Madinah Road." },
      { question: "Is this the same as Aziziyah in Makkah?", answer: "No. Aziziyah in Makkah is a separate hotel district near the Haram. Write \"Al Aziziyah, Jeddah\" in full when you book." },
      { question: "Can I book an airport run from Al Aziziyah at night?", answer: "Yes, 24/7. We set the pickup from your flight time." },
    ],
    related: [
      { href: "/locations/makkah/aziziyah", label: "Aziziyah, Makkah", desc: "The Makkah district of the same name" },
      { href: "/locations/jeddah/al-safaa", label: "Al Safaa", desc: "North Jeddah, nearby" },
      { href: "/airports/king-abdulaziz-jeddah", label: "JED airport transfers", desc: "Close by" },
      { href: "/routes/jeddah-to-makkah", label: "Jeddah to Makkah", desc: "Door to door" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "Al Aziziyah, Jeddah", type: "Place", description: "Residential Jeddah district between the city centre and King Abdulaziz International Airport." } },
  },

  /* City tour — itinerary/sightseeing product */
  "city-tour": {
    slug: "city-tour",
    kind: "attraction",
    name: "Jeddah City Tour",
    nameAr: "جولة مدينة جدة",
    title: "Jeddah City Tour by Private Car | Al-Balad, Corniche & Fountain",
    metaDescription: "Private Jeddah city tour by car — Al-Balad, the Floating Mosque, the Corniche and King Fahd's Fountain. Half-day or full-day, your own driver.",
    h1: "Jeddah City Tour by Private Car",
    eyebrow: "Half day or full day · Jeddah",
    intro: "A Jeddah city tour by private car links the city's main sights in one booking: historic Al-Balad, the Al-Rahma (Floating) Mosque, the Corniche and King Fahd's Fountain. It is transport, not a guided tour — your driver takes you between the stops and waits, and you set the pace. Half-day and full-day options start from your hotel or from JED.",
    facts: [
      { label: "Format", value: "Half day or full day" },
      { label: "Stops", value: "Al-Balad · Floating Mosque · Corniche" },
      { label: "Starts from", value: "Your hotel or JED" },
      { label: "Note", value: "Transport, not a guided tour" },
    ],
    blocks: [
      {
        type: "table",
        eyebrow: "Choose a format",
        heading: "Half day or full day?",
        columns: ["Format", "Covers", "Best for"],
        rows: [
          ["Half day — morning", "Al-Balad, then a Corniche drive", "Cooler hours, a short visit"],
          ["Half day — evening", "Floating Mosque, Corniche, King Fahd's Fountain", "Sunset and the lit fountain"],
          ["Full day", "All of the above with lunch and rest", "First-time visitors, families"],
        ],
      },
      {
        type: "timeline",
        heading: "An evening tour, stop by stop",
        items: [
          { time: "16:30", title: "Hotel pickup", desc: "Before sunset to catch the light." },
          { time: "17:00", title: "Al-Rahma (Floating) Mosque", desc: "Northern Corniche, Al Shati." },
          { time: "18:15", title: "Jeddah Waterfront", desc: "Walk the promenade." },
          { time: "19:30", title: "King Fahd's Fountain", desc: "Seen from Al Hamra Corniche after dark." },
          { time: "21:00", title: "Dinner, then hotel", desc: "The driver waits." },
        ],
      },
    ],
    ctaHeading: "Plan your Jeddah city tour",
    ctaBody: "Half or full day, date, start point and anything you specially want to see.",
    ctaLabel: "Plan My City Tour",
    waPrefill: "Salam! Jeddah city tour by car.\n• Half day (morning / evening) or full day: \n• Date & start time: \n• Start from (hotel / JED): \n• Passengers: \n• Must-see stops: ",
    form: { pickup: "Jeddah hotel", dropoff: "Jeddah city tour", vehicle: "VIP SUV", tripType: "By the Hour" },
    faqs: [
      { question: "What does a Jeddah city tour by car include?", answer: "A private car and driver between Al-Balad, the Floating Mosque, the Corniche and King Fahd's Fountain, with the driver waiting at each stop. It is transport only — not a guided tour." },
      { question: "How long is the tour?", answer: "Choose a half day (morning or evening) or a full day. Tell us the stops you want and we suggest the format." },
      { question: "Can the tour start at the airport?", answer: "Yes. It can start from your hotel or straight from JED, with your luggage in the car." },
      { question: "Can we walk inside Al-Balad?", answer: "Yes — on foot. Cars cannot drive through the historic core; the driver drops you at its edge and waits." },
    ],
    related: [
      { href: "/locations/jeddah/al-balad", label: "Al-Balad", desc: "The old town in detail" },
      { href: "/locations/jeddah/corniche", label: "Jeddah Corniche", desc: "The waterfront stretches" },
      { href: "/locations/jeddah/private-driver", label: "Private driver", desc: "Build your own day" },
      { href: "/airports/king-abdulaziz-jeddah", label: "JED airport transfers", desc: "Start from arrivals" },
    ],
    schema: { serviceType: "Sightseeing transport by private car" },
  },
};

export const JEDDAH_CHILD_NAV: ClusterCity["nav"] = [
  { slug: "private-driver", label: "Private driver" },
  { slug: "city-tour", label: "City tour" },
  { slug: "al-balad", label: "Al-Balad" },
  { slug: "corniche", label: "Corniche" },
  { slug: "al-hamra", label: "Al Hamra" },
  { slug: "al-shati", label: "Al Shati" },
  { slug: "obhur", label: "Obhur" },
  { slug: "al-andalus", label: "Al Andalus" },
  { slug: "al-rawdah", label: "Al Rawdah" },
  { slug: "al-salamah", label: "Al Salamah" },
  { slug: "al-faisaliyah", label: "Al Faisaliyah" },
  { slug: "al-safaa", label: "Al Safaa" },
  { slug: "al-aziziyah-jeddah", label: "Al Aziziyah" },
];

export const JEDDAH_CITY: ClusterCity = { slug: "jeddah", name: "Jeddah", nav: JEDDAH_CHILD_NAV };
