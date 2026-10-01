// Riyadh cluster — single content source for the Riyadh hub
// (/locations/riyadh) and every Riyadh child page rendered by
// components/location/riyadh/*. Rebuilt 2026-10-01.
//
// Truth rules (CLAUDE.md §2, §14, §17):
// - Every distance/drive time comes from ROUTES_DATA via routeFact() — never
//   typed by hand here, so the hub, child pages and route pages can't disagree.
// - Business facts only from seo/facts.md: EN/AR drivers, 24/7, fare agreed
//   before booking (no meter, no surge), free cancellation up to 24h, cash or
//   bank transfer, e-receipt on request, corporate invoicing via sister company.
// - Venue names only from seo/venues.md (Boulevard World / Boulevard City /
//   RFECC / RICEC / KAICC). Landmark facts verified 2026-10-01 and cited inline.
// - No flight tracking, no free-waiting claims, no response-time promises.
import { ROUTES_DATA } from "@/lib/data/routes";
import { DISTANCE_GUIDES } from "@/lib/data/distances";

/* ─── shared helpers ─────────────────────────────────────────────────── */

export function fmtDuration(min: number): string {
  if (min < 60) return `~${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (m === 0) return `~${h} hr`;
  if (m === 30) return `~${h}.5 hr`;
  return `~${h} hr ${m} min`;
}

export interface RouteFact {
  slug: string;
  from: string;
  to: string;
  km: number;
  minutes: number;
  time: string;
}

export function routeFact(slug: string): RouteFact | null {
  const r = ROUTES_DATA.find((x) => x.slug === slug);
  if (!r) return null;
  return { slug, from: r.fromCity, to: r.toCity, km: r.distance, minutes: r.duration, time: fmtDuration(r.duration) };
}

/** Reverse route slug if a real page exists (e.g. riyadh-to-dubai → dubai-to-riyadh). */
export function reverseSlug(slug: string): string | null {
  const m = slug.match(/^(.+)-to-(.+)$/);
  if (!m) return null;
  const rev = `${m[2]}-to-${m[1]}`;
  return ROUTES_DATA.some((r) => r.slug === rev) ? rev : null;
}

export function distanceGuideFor(routeSlug: string): string | null {
  return DISTANCE_GUIDES.find((d) => d.routeSlug === routeSlug)?.slug ?? null;
}

export const RUH_CITY = routeFact("riyadh-airport-to-city")!; // 35 km · 30 min
export const RUH_KAFD = routeFact("riyadh-airport-to-kafd-hotels")!; // 40 km · 35 min

export const CORPORATE_INVOICE_LINE = "Corporate invoicing can be arranged through our sister company.";

/** The confirmed sitewide facts, worded once and reused (facts.md 2026-10-01). */
export const RIYADH_FACTS: { label: string; value: string }[] = [
  { label: "Coverage", value: "Every Riyadh district, 24/7" },
  { label: "Drivers", value: "English- & Arabic-speaking" },
  { label: "Fare", value: "Agreed before booking — no meter, no surge" },
  { label: "Cancellation", value: "Free up to 24 hours before pickup" },
  { label: "Payment", value: "Cash to the driver or bank transfer" },
  { label: "Receipts", value: "Electronic receipt on request" },
  { label: "Companies", value: "Invoicing via our sister company" },
  { label: "Vehicles", value: "Sedan · SUV · van · luxury · coaster" },
];

/* ─── Hub: trip-type selector ────────────────────────────────────────── */

export type TripIcon = "plane" | "hotel" | "clock" | "briefcase" | "route" | "landmark" | "ticket" | "crown";

export interface TripType {
  id: string;
  icon: TripIcon;
  label: string;
  short: string;
  answer: string;
  send: string[];
  href: string;
  linkLabel: string;
  waPrefill: string;
}

export const TRIP_TYPES: TripType[] = [
  {
    id: "airport",
    icon: "plane",
    label: "Airport transfer",
    short: "RUH arrivals & departures",
    answer: `King Khalid International Airport (RUH) sits about ${RUH_CITY.km} km north of central Riyadh. A pre-booked private car meets you on arrival and drives you straight to your hotel, office or onward destination — or collects you for a departure, timed to your flight.`,
    send: ["Flight number and landing time", "Terminal, if you know it", "Hotel or drop-off address", "Passengers and number of bags"],
    href: "/airports/king-khalid-riyadh",
    linkLabel: "RUH airport transfer details",
    waPrefill: "Salam! Riyadh airport (RUH) transfer.\n• Arrival or departure: \n• Flight number & time: \n• From / to (hotel or address): \n• Passengers & bags: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "hotel",
    icon: "hotel",
    label: "Hotel transfer",
    short: "Airport, hotel-to-hotel, hotel-to-venue",
    answer: "Hotel transfers cover the airport-to-hotel run plus hotel-to-hotel moves and hotel-to-venue trips across Olaya, KAFD, the Diplomatic Quarter and the Diriyah side of the city. Tell us the hotel name and we plan the drop-off entrance before the driver sets off.",
    send: ["Hotel name (pickup and drop-off)", "Date and time", "Passengers and bags", "Any second stop on the way"],
    href: "/locations/riyadh/hotel-transfer",
    linkLabel: "Riyadh hotel transfers",
    waPrefill: "Salam! Riyadh hotel transfer.\n• From (hotel / airport): \n• To (hotel / venue): \n• Date & time: \n• Passengers & bags: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "private-driver",
    icon: "clock",
    label: "Private driver",
    short: "By the hour or full day",
    answer: "A private driver stays with you for a block of hours — the car waits outside each meeting, mall or visit, so you never re-book between stops. It is the usual choice once a Riyadh day has three or more stops.",
    send: ["Date and start time", "Hours needed (or full day)", "Rough list of stops", "Passengers"],
    href: "/locations/riyadh/private-driver",
    linkLabel: "Hire a private driver in Riyadh",
    waPrefill: "Salam! Private driver in Riyadh (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "corporate",
    icon: "briefcase",
    label: "Business & corporate",
    short: "Executives, teams, accounts",
    answer: `For executives, visiting teams and recurring staff movements we coordinate executive sedans and full-size SUVs through our vetted partner network, with one point of contact and a written quote by email. ${CORPORATE_INVOICE_LINE}`,
    send: ["Company name and contact", "Dates and trip list", "Passengers per trip", "Whether you need an invoice"],
    href: "/services/corporate",
    linkLabel: "Corporate transportation",
    waPrefill: "Salam! Corporate transportation in Riyadh.\n• Company: \n• Dates & trips: \n• Passengers per trip: \n• Vehicle (Executive sedan / SUV / Van): \n• Invoice needed?: ",
  },
  {
    id: "intercity",
    icon: "route",
    label: "Intercity & cross-border",
    short: "Dammam, Makkah, Jeddah, GCC",
    answer: "A private car from Riyadh to another city is door to door, one agreed fare for the whole car, with rest and prayer stops when you ask. The most-booked corridors are Dammam and the Eastern Province, Makkah, Madinah, Jeddah, and across the border to Bahrain, Qatar, the UAE and Kuwait.",
    send: ["Pickup address in Riyadh", "Destination city and address", "Date and time", "Passengers, bags, and passports for cross-border trips"],
    href: "#destinations",
    linkLabel: "See every Riyadh route",
    waPrefill: "Salam! Intercity trip from Riyadh.\n• From (Riyadh address): \n• To (city / address): \n• Date & time: \n• Passengers & bags: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "attraction",
    icon: "landmark",
    label: "Tourist & attractions",
    short: "Diriyah, Boulevard, museums",
    answer: "For sightseeing, book a one-way drop-off and a timed return, or keep the car for the day. Popular trips are Diriyah (At-Turaif and Bujairi Terrace), the Riyadh Season zones in Hittin, and the National Museum area in Al Murabba.",
    send: ["Places you want to visit", "Date and start time", "One-way, return, or the whole day", "Passengers (children's ages help)"],
    href: "/locations/riyadh/diriyah",
    linkLabel: "Riyadh to Diriyah transfers",
    waPrefill: "Salam! Sightseeing transport in Riyadh.\n• Places to visit: \n• Date & start time: \n• One-way / return / full day: \n• Passengers: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "events",
    icon: "ticket",
    label: "Events & exhibitions",
    short: "Conferences, Riyadh Season",
    answer: "Exhibitions and conferences at RECC in Malham, RICEC and KAICC, plus Riyadh Season nights in Hittin, all need planned arrivals and pickups. We coordinate single attendees, speakers and delegate groups with vehicles sized to the group.",
    send: ["Event name and venue", "Dates and daily timings", "Hotel(s) for pickup", "Number of people"],
    href: "/events/riyadh-event-transportation",
    linkLabel: "Riyadh event transportation",
    waPrefill: "Salam! Event transport in Riyadh.\n• Event & venue: \n• Dates & timings: \n• Pickup hotel(s): \n• Number of people: \n• Vehicle (Sedan / SUV / Van / Coaster): ",
  },
  {
    id: "vip",
    icon: "crown",
    label: "VIP & luxury",
    short: "Arrivals, weddings, guests",
    answer: "For VIP arrivals, weddings and high-profile guests, luxury vehicles are available through our partner network — booked as a separate tier above the standard executive sedan and SUV, quoted per occasion.",
    send: ["Occasion and date", "Vehicle preference", "Pickup and drop-off", "Number of guests"],
    href: "/services/vip-transportation",
    linkLabel: "VIP transportation in Riyadh",
    waPrefill: "Salam! VIP / luxury transport in Riyadh.\n• Occasion & date: \n• Vehicle preference: \n• From / to: \n• Guests: ",
  },
];

/* ─── Hub: airport flow ──────────────────────────────────────────────── */

export const AIRPORT_FLOW = {
  arrival: [
    { title: "Book ahead", desc: "Send your flight number, landing time and hotel. Your fare is agreed before you travel." },
    { title: "Land at RUH", desc: "Clear immigration and collect your bags at King Khalid International Airport." },
    { title: "Meet your driver", desc: "Your driver's details are shared on WhatsApp before pickup so you can contact them directly." },
    { title: "Load luggage", desc: "Vehicle size is matched to your passengers and bags when you book — no repacking at the kerb." },
    { title: "Private drive", desc: `About ${RUH_CITY.km} km to central Riyadh — ${RUH_CITY.time} off-peak, longer at commuter peaks.` },
    { title: "Hotel or meeting", desc: "Dropped at the right entrance — Olaya, KAFD, the Diplomatic Quarter or anywhere in Riyadh." },
  ],
  departure: [
    { title: "Book your return", desc: "Share your flight time and hotel. We work back from your departure to set the pickup time." },
    { title: "Hotel pickup", desc: "Your driver collects you from the hotel lobby or your address at the agreed time." },
    { title: "Plan for traffic", desc: "Weekday commuter peaks on the northern roads add time — pickup is planned around them." },
    { title: "Kerbside at RUH", desc: "Dropped at your terminal's departures level with your bags unloaded." },
  ],
};

/* ─── Hub: districts & destinations grid ─────────────────────────────── */

export interface DistrictCard {
  slug: string;
  name: string;
  nameAr: string;
  tag: string;
  why: string;
  reasons: string[];
  href: string;
  airportNote: string;
}

export const DISTRICT_CARDS: DistrictCard[] = [
  {
    slug: "kafd",
    name: "KAFD",
    nameAr: "المركز المالي",
    tag: "Finance & offices",
    why: "Banks, funds and regional headquarters. Most trips are meetings, office commutes and airport runs for visiting executives.",
    reasons: ["Meetings", "Corporate", "Airport"],
    href: "/locations/riyadh/kafd",
    airportNote: `${RUH_KAFD.km} km to RUH · ${RUH_KAFD.time} off-peak`,
  },
  {
    slug: "olaya",
    name: "Olaya",
    nameAr: "العليا",
    tag: "Hotels & business",
    why: "The central business strip around Kingdom Centre and Al Faisaliah Tower, with many of the city's business hotels and malls.",
    reasons: ["Hotels", "Shopping", "Meetings"],
    href: "/locations/riyadh/olaya",
    airportNote: `${RUH_CITY.km} km to RUH · ${RUH_CITY.time} off-peak`,
  },
  {
    slug: "diplomatic-quarter",
    name: "Diplomatic Quarter",
    nameAr: "الحي الدبلوماسي",
    tag: "Embassies & residences",
    why: "Embassies, residences and delegation visits on the western side of the city, where a discreet, pre-arranged car matters.",
    reasons: ["Delegations", "Discreet", "Residents"],
    href: "/locations/riyadh/diplomatic-quarter",
    airportNote: "West Riyadh — longer airport run than Olaya",
  },
  {
    slug: "diriyah",
    name: "Diriyah",
    nameAr: "الدرعية",
    tag: "Heritage & dining",
    why: "At-Turaif, a UNESCO World Heritage Site, and the restaurants of Bujairi Terrace above Wadi Hanifa — the city's top visitor trip.",
    reasons: ["Tourism", "Dinner", "Culture"],
    href: "/locations/riyadh/diriyah",
    airportNote: "North-west edge of Riyadh",
  },
  {
    slug: "boulevard",
    name: "Boulevard (Hittin)",
    nameAr: "البوليفارد",
    tag: "Riyadh Season",
    why: "Boulevard City and Boulevard World in Hittin — evening entertainment zones where a pre-arranged pickup saves the late-night queue.",
    reasons: ["Evenings", "Families", "Events"],
    href: "/locations/riyadh/boulevard",
    airportNote: "North Riyadh, Prince Turki Al Awwal Rd",
  },
  {
    slug: "riyadh-front",
    name: "Riyadh Front",
    nameAr: "واجهة روشن",
    tag: "Exhibitions & business park",
    why: "ROSHN Front and the Riyadh Front Exhibition & Conference Center (RFECC) on the airport side of the city.",
    reasons: ["Exhibitions", "Offices", "Airport"],
    href: "/locations/riyadh/riyadh-front",
    airportNote: "Airport Road — close to RUH",
  },
  {
    slug: "al-murabba",
    name: "Al Murabba",
    nameAr: "المربع",
    tag: "Museums & history",
    why: "The National Museum, Murabba Palace and the King Abdulaziz Historical Center in historic downtown Riyadh.",
    reasons: ["Museums", "History", "Families"],
    href: "/locations/riyadh/al-murabba",
    airportNote: "Downtown Riyadh",
  },
  {
    slug: "al-malaz",
    name: "Al Malaz",
    nameAr: "الملز",
    tag: "Parks & family",
    why: "King Abdullah Park, Riyadh Zoo and Prince Faisal bin Fahd Stadium in one of the city's oldest central neighbourhoods.",
    reasons: ["Families", "Parks", "Sport"],
    href: "/locations/riyadh/al-malaz",
    airportNote: "East-central Riyadh",
  },
];

/* ─── Hub: destination explorer (real ROUTES_DATA slugs only) ───────── */

export interface DestinationItem {
  slug: string;
  name: string;
  purpose: string;
}

export const DESTINATION_GROUPS: { id: string; label: string; intro: string; items: DestinationItem[] }[] = [
  {
    id: "saudi",
    label: "Saudi cities",
    intro: "Door-to-door intercity cars from any Riyadh address. One fare for the whole car, rest and prayer stops on request.",
    items: [
      { slug: "riyadh-to-alahsa", name: "Al Ahsa", purpose: "UNESCO oasis, family visits" },
      { slug: "riyadh-to-buraydah", name: "Buraydah", purpose: "Qassim business & family" },
      { slug: "riyadh-to-dammam", name: "Dammam", purpose: "Eastern Province business" },
      { slug: "riyadh-to-alkhobar", name: "Al Khobar", purpose: "Corniche, Dhahran offices" },
      { slug: "riyadh-to-hail", name: "Hail", purpose: "Northern region trips" },
      { slug: "riyadh-to-taif", name: "Taif", purpose: "Mountain summer escape" },
      { slug: "riyadh-to-madinah", name: "Madinah", purpose: "Masjid an-Nabawi visits" },
      { slug: "riyadh-to-makkah", name: "Makkah", purpose: "Umrah by road, Miqat stop" },
      { slug: "riyadh-to-jeddah", name: "Jeddah", purpose: "Cross-Kingdom to the Red Sea" },
      { slug: "riyadh-to-alula", name: "AlUla", purpose: "Hegra & heritage trips" },
      { slug: "riyadh-to-neom", name: "NEOM", purpose: "Project & site travel" },
    ],
  },
  {
    id: "gcc",
    label: "GCC cross-border",
    intro: "Pre-booked cars across the border. Bring passports and any visas needed — border requirements are the traveller's responsibility.",
    items: [
      { slug: "riyadh-to-manama", name: "Manama, Bahrain", purpose: "Via the King Fahd Causeway" },
      { slug: "riyadh-to-doha", name: "Doha, Qatar", purpose: "Via the Salwa border" },
      { slug: "riyadh-to-kuwait", name: "Kuwait City", purpose: "Northern GCC corridor" },
      { slug: "riyadh-to-abudhabi", name: "Abu Dhabi, UAE", purpose: "Long-distance business trips" },
      { slug: "riyadh-to-dubai", name: "Dubai, UAE", purpose: "Car with driver to Dubai" },
    ],
  },
  {
    id: "local",
    label: "Airport & city",
    intro: "Short transfers inside Riyadh — airport runs and the business districts.",
    items: [
      { slug: "riyadh-airport-to-city", name: "RUH → central Riyadh", purpose: "Arrivals to any district" },
      { slug: "riyadh-airport-to-kafd-hotels", name: "RUH → KAFD & Olaya hotels", purpose: "Executive arrivals" },
    ],
  },
];

/* ─── Hub: vehicle fit (categories from facts.md; capacities from fleet-data) */

export const VEHICLE_FIT = [
  { id: "sedan", label: "Executive sedan", fleetSlug: "toyota-camry", forWho: "Solo travellers and couples, one or two cases each", href: "/fleet/toyota-camry" },
  { id: "suv", label: "Full-size SUV", fleetSlug: "gmc-yukon-xl", forWho: "Families and business travellers with heavy luggage", href: "/fleet/gmc-yukon-xl" },
  { id: "van", label: "VIP van", fleetSlug: "hyundai-staria", forWho: "Small groups who want to travel together", href: "/fleet/hyundai-staria" },
  { id: "coaster", label: "Coaster / minibus", fleetSlug: "toyota-coaster", forWho: "Delegations, teams and event groups", href: "/fleet/toyota-coaster" },
  { id: "luxury", label: "Luxury chauffeur", fleetSlug: "mercedes-s-class", forWho: "VIP arrivals, weddings and senior guests", href: "/services/vip-transportation" },
];

/* ─── Hub: timing planner ────────────────────────────────────────────── */

export const TIMING_PLANNER = [
  {
    title: "Airport runs",
    body: `RUH is ${RUH_CITY.km} km from central Riyadh — ${RUH_CITY.time} on a clear road. The northern approach roads slow down sharply at weekday commuter peaks, so departure pickups are set with a buffer rather than the clear-road time.`,
  },
  {
    title: "Business districts",
    body: "KAFD, Olaya and King Fahd Road carry the heaviest office traffic in the morning and late afternoon. Meeting-to-meeting hops across these districts are short in distance but can be slow in time — the main reason people book a driver by the hour.",
  },
  {
    title: "Evenings & weekends",
    body: "Riyadh's leisure traffic runs late. Diriyah dinners, malls and the Boulevard zones in Hittin get busiest after sunset and on Thursday and Friday nights — book a fixed return time instead of searching for a car at closing.",
  },
  {
    title: "Event periods",
    body: "Large exhibitions and Riyadh Season nights concentrate thousands of arrivals at one venue. Allow extra time and agree a specific pickup point in advance — venue drop-off lanes change with each event.",
  },
  {
    title: "Ramadan",
    body: "Daytime roads are quieter; traffic peaks around iftar and late into the night. Tell us if your trip falls in Ramadan and we plan the pickup time accordingly.",
  },
  {
    title: "Long-distance trips",
    body: "Intercity drives from Riyadh are long — Dammam is the shortest major corridor. Early starts beat the city traffic out; the driver stops for prayer, fuel and rest on request.",
  },
];

/* ─── Hub: visitor guide ─────────────────────────────────────────────── */

export const VISITOR_GUIDE = [
  {
    q: "How do I get from Riyadh airport to my hotel?",
    a: `Pre-book a private transfer from King Khalid International Airport (RUH): send your flight number and hotel, agree the fare, and your driver's contact details arrive on WhatsApp before pickup. It is about ${RUH_CITY.km} km to central Riyadh. If you travel light, the Riyadh Metro's Yellow Line also connects the airport with KAFD.`,
  },
  {
    q: "Is a private driver better than a standard taxi or ride-hailing?",
    a: "For one short hop in the city, any car works. A pre-booked private driver makes the difference when the fare must be fixed in advance, when you carry luggage, when a car must wait, or when a company needs a receipt or invoice.",
  },
  {
    q: "Can I travel from Riyadh to other cities by car?",
    a: "Yes — door to door. Dammam is the shortest major corridor; Makkah, Madinah and Jeddah are full-day drives where a flight is faster but a car carries the whole family and luggage for one fare. The route list below shows real distances for every corridor.",
  },
  {
    q: "What if I have a lot of luggage?",
    a: "Tell us the number of large cases when you book. Sedans suit one or two cases each; full-size SUVs, vans and coasters handle families, golf bags and exhibition kit.",
  },
  {
    q: "What happens after I send a request?",
    a: "We reply on WhatsApp to confirm the details, agree one fixed fare, then share your driver's details before pickup. Plans change? Cancellation is free up to 24 hours before pickup.",
  },
  {
    q: "Which language do the drivers speak?",
    a: "Drivers in our Riyadh network speak English and Arabic. Hotel names and addresses in either language are fine — a map pin on WhatsApp is the most reliable.",
  },
];

export const BOOKING_STEPS = [
  { title: "Send your trip", desc: "Use the form or WhatsApp — pickup, drop-off, date, passengers, bags." },
  { title: "Agree one fare", desc: "We confirm the vehicle and a fixed fare before anything is booked." },
  { title: "Get driver details", desc: "Your driver's contact is shared on WhatsApp before pickup." },
  { title: "Ride & pay", desc: "Cash to the driver or bank transfer. E-receipt on request." },
];

/* ─── Hub FAQ — written once for the hub; child pages carry their own ─ */

const dmm = routeFact("riyadh-to-dammam")!;
const mak = routeFact("riyadh-to-makkah")!;
const jed = routeFact("riyadh-to-jeddah")!;
const bah = routeFact("riyadh-to-manama")!;

export const HUB_FAQS: { question: string; answer: string; category: string }[] = [
  { category: "Airport", question: "How do I get from King Khalid International Airport (RUH) to my hotel in Riyadh?", answer: `Book a private transfer before you fly. Send your flight number, landing time and hotel on WhatsApp, agree the fare, and your driver's contact details are shared before pickup. RUH is about ${RUH_CITY.km} km from central Riyadh — ${RUH_CITY.time} on a clear road, longer at weekday commuter peaks.` },
  { category: "Airport", question: "How long does it take from RUH to KAFD or Olaya?", answer: `RUH to the KAFD and Olaya hotel area is about ${RUH_KAFD.km} km — ${RUH_KAFD.time} with clear roads. Morning and late-afternoon commuter peaks can add significantly to that, so departure pickups are planned with a buffer.` },
  { category: "Booking", question: "Can I hire a private driver in Riyadh for several hours or a full day?", answer: "Yes. Hourly and full-day hire keeps the same car and driver with you, waiting between stops — the usual choice for a business day across KAFD, Olaya and the Diplomatic Quarter, or a shopping and sightseeing day. Send your date, start time and hours needed for a fixed quote." },
  { category: "Booking", question: "How much does a private transfer in Riyadh cost?", answer: "The fare depends on the route, vehicle, date and waiting time, so it is quoted per trip and agreed before you book — one fixed price, no meter and no surge, even if the traffic is heavy." },
  { category: "Booking", question: "What information do I need to send for a quote?", answer: "Pickup and drop-off (a hotel name or map pin is ideal), date and time, number of passengers, number of large bags, and your flight number for airport trips. For hourly hire, add the hours and a rough list of stops." },
  { category: "Intercity", question: "Can I travel from Riyadh to Dammam, Makkah or Jeddah by private car?", answer: `Yes, door to door. Riyadh to Dammam is about ${dmm.km} km (${dmm.time}), Riyadh to Makkah about ${mak.km} km (${mak.time}) and Riyadh to Jeddah about ${jed.km} km (${jed.time}). Rest and prayer stops are made on request.` },
  { category: "Intercity", question: "Can I go from Riyadh to Bahrain, Qatar, the UAE or Kuwait by car?", answer: `Yes. Pre-booked cross-border cars run from Riyadh to Manama (about ${bah.km} km via the King Fahd Causeway), Doha, Abu Dhabi, Dubai and Kuwait City. Passengers need their own valid passports and any visas required for entry.` },
  { category: "Vehicles", question: "Which vehicle should I book for a family with luggage?", answer: "A full-size SUV fits up to seven passengers with room for several large cases; a VIP van suits a family or group that wants extra luggage space. A sedan is right for one to three people with normal luggage." },
  { category: "Payment", question: "How do I pay, and can I get a receipt?", answer: "Pay the driver in cash or pay by bank transfer. An electronic receipt is available on request — useful for expense claims." },
  { category: "Payment", question: "Can companies get an invoice for Riyadh transportation?", answer: `Yes. ${CORPORATE_INVOICE_LINE} Email us your company details and trip list for a written quote before booking.` },
  { category: "Booking", question: "Can I cancel or change my booking?", answer: "Yes. Cancellation is free up to 24 hours before pickup, and you can change times or addresses by WhatsApp." },
  { category: "Booking", question: "Do the drivers speak English?", answer: "Yes. Drivers in our Riyadh partner network speak English and Arabic, and trips run 24 hours a day." },
];

/* ─── Hub: related guides ────────────────────────────────────────────── */

export const HUB_GUIDES = [
  { href: "/blog/riyadh-airport-ruh-taxi-guide", label: "RUH airport arrival guide" },
  { href: "/blog/riyadh-to-diriyah-visitor-transport-guide", label: "Visiting Diriyah: getting there and back" },
  { href: "/blog/riyadh-season-taxi-transport-guide", label: "Riyadh Season transport tips" },
  { href: "/blog/riyadh-business-events-executive-transfer-guide", label: "Business events: executive transfer planning" },
  { href: "/blog/private-driver-cost-saudi-arabia", label: "What affects private driver pricing in Saudi Arabia" },
  { href: "/fleet", label: "Vehicle categories in the partner network" },
];

/* ─── Child pages ────────────────────────────────────────────────────── */

export type Block =
  | { type: "prose"; heading: string; paragraphs: string[] }
  | { type: "cards"; heading: string; intro?: string; items: { title: string; body: string }[] }
  | { type: "checklist"; heading: string; intro?: string; items: string[] }
  | { type: "steps"; heading: string; intro?: string; items: { title: string; desc: string }[] }
  | { type: "table"; heading: string; intro?: string; columns: string[]; rows: string[][] }
  | { type: "compare"; heading: string; intro?: string; options: { title: string; when: string[]; tone: "green" | "ink" }[] }
  | { type: "timeline"; heading: string; intro?: string; items: { time: string; title: string; desc: string }[] };

export interface RiyadhPage {
  slug: string;
  kind: "district" | "service" | "attraction";
  name: string;
  nameAr: string;
  title: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroImage: string;
  heroAlt: string;
  intro: string;
  facts: { label: string; value: string }[];
  blocks: Block[];
  ctaHeading: string;
  ctaBody: string;
  ctaLabel: string;
  waPrefill: string;
  form: { pickup?: string; dropoff?: string; vehicle?: string; tripType?: "One Way" | "Round Trip" | "By the Hour" };
  pathB?: { heading: string; body: string; emailSubject: string; emailBody: string };
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string; desc: string }[];
  schema: { serviceType: string; place?: { name: string; type: "Place" | "TouristAttraction"; description: string } };
}

const corpEmail = (topic: string) =>
  `Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for ${topic}.\n\n• Company / organisation: \n• Contact name & role: \n• Dates: \n• Trips / addresses: \n• Passengers per trip: \n• Vehicle preference (Executive sedan / SUV / Van): \n• Invoice needed?: \n\nPlease confirm the fixed fare before booking.\n\nThank you.`;

export const RIYADH_PAGES: Record<string, RiyadhPage> = {
  /* KAFD — finance-district business intent */
  kafd: {
    slug: "kafd",
    kind: "district",
    name: "KAFD",
    nameAr: "مركز الملك عبدالله المالي",
    title: "KAFD Chauffeur & Executive Transfers | King Abdullah Financial District",
    metaDescription: `Executive chauffeur and RUH airport transfers for KAFD, Riyadh — about ${RUH_KAFD.km} km from the airport. Hourly drivers for meeting days, invoices for companies.`,
    h1: "KAFD Chauffeur & Executive Transfers",
    eyebrow: "King Abdullah Financial District · Riyadh",
    heroImage: "/gallery/business-transfer.webp",
    heroAlt: "Business traveller working on a laptop in the back seat of a chauffeured car",
    intro: `KAFD — the King Abdullah Financial District in north Riyadh — is where banks, funds and regional headquarters cluster, so most trips here are executive: airport arrivals, meeting-to-meeting days and office commutes. King Khalid International Airport (RUH) is about ${RUH_KAFD.km} km away, ${RUH_KAFD.time} on a clear road. Fares are agreed before booking and companies can be invoiced.`,
    facts: [
      { label: "RUH to KAFD", value: `${RUH_KAFD.km} km · ${RUH_KAFD.time} off-peak` },
      { label: "Best for", value: "Meetings, executive arrivals" },
      { label: "Vehicles", value: "Executive sedan · full-size SUV" },
      { label: "Invoicing", value: "Via our sister company" },
    ],
    blocks: [
      {
        type: "cards",
        heading: "Who books transport in KAFD",
        items: [
          { title: "Visiting executives", body: "Fly into RUH, go straight to a KAFD tower for the first meeting, then on to the hotel — one booking with the driver waiting between." },
          { title: "Meeting-day teams", body: "Two or three meetings in KAFD plus one in Olaya or the Diplomatic Quarter. Hourly hire keeps the car outside instead of re-booking." },
          { title: "Company travel desks", body: "Recurring arrivals for staff and clients, booked by email with a written quote and an invoice at the end." },
        ],
      },
      {
        type: "prose",
        heading: "Getting in and out of KAFD",
        paragraphs: [
          "KAFD is a dense, pedestrian-first district: towers sit close together, and drop-off happens at designated points rather than at every lobby door. Give us the tower or building name and the driver plans the nearest drop-off before arriving.",
          "The district has its own Riyadh Metro station (KAFD, served by the Yellow, Blue and Purple lines). The Yellow Line runs to the airport — a fair option for a solo traveller with a laptop bag. With luggage, a client to host or a fixed schedule, a car that waits at the door is simpler.",
        ],
      },
      {
        type: "compare",
        heading: "Single transfer or a driver for the day?",
        options: [
          { title: "Single transfer", tone: "ink", when: ["Airport to KAFD, nothing after", "One meeting, then a return later", "Fixed arrival time"] },
          { title: "Hourly driver", tone: "green", when: ["Three or more stops", "Meetings that may overrun", "Hosting a visitor all day"] },
        ],
      },
    ],
    ctaHeading: "Book a KAFD executive transfer",
    ctaBody: "Send the tower name, time and passengers — we confirm the vehicle and the fare before booking.",
    ctaLabel: "Request a KAFD Chauffeur Quote",
    waPrefill: "Salam! KAFD transfer / chauffeur.\n• From / to (tower or airport): \n• Date & time: \n• Passengers: \n• Single transfer or hourly?: \n• Vehicle (Executive sedan / SUV): ",
    form: { pickup: "King Khalid Airport (RUH)", dropoff: "KAFD, Riyadh", vehicle: "Sedan" },
    pathB: { heading: "Recurring KAFD travel for your company?", body: `Arrivals, roadshows and visiting delegations can run on one email thread with a written quote. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Corporate transport RFQ — KAFD, Riyadh", emailBody: corpEmail("executive transport in KAFD, Riyadh") },
    faqs: [
      { question: "How far is KAFD from King Khalid International Airport?", answer: `About ${RUH_KAFD.km} km — ${RUH_KAFD.time} with clear roads. Weekday commuter peaks can add significantly, so departure pickups from KAFD are set with a buffer.` },
      { question: "Can the driver wait during my meetings in KAFD?", answer: "Yes, if you book by the hour. The driver waits near the tower and collects you when you message. A single transfer drops you and leaves." },
      { question: "Is the metro a good way to reach KAFD from the airport?", answer: "The Riyadh Metro Yellow Line links the airport with KAFD station — fine for a solo traveller with light bags. A private car is better with luggage, guests, or a tight first meeting." },
      { question: "Can our company be invoiced for KAFD trips?", answer: `Yes. ${CORPORATE_INVOICE_LINE} Email your company details and trip list for a written quote.` },
    ],
    related: [
      { href: "/locations/riyadh/private-driver", label: "Private driver by the hour", desc: "For multi-meeting days in KAFD" },
      { href: "/routes/riyadh-airport-to-kafd-hotels", label: "RUH to KAFD & Olaya hotels", desc: "The airport corridor, route details" },
      { href: "/services/corporate", label: "Corporate transportation", desc: "Accounts, written quotes, invoicing" },
      { href: "/locations/riyadh/olaya", label: "Olaya", desc: "The neighbouring hotel and business strip" },
    ],
    schema: { serviceType: "Executive chauffeur service", place: { name: "King Abdullah Financial District (KAFD)", type: "Place", description: "Financial district in north Riyadh." } },
  },

  /* Olaya — hotels & central business (title kept: ranks ~pos 11) */
  olaya: {
    slug: "olaya",
    kind: "district",
    name: "Olaya",
    nameAr: "العليا",
    title: "Taxi & Private Transfer in Olaya, Riyadh | Taxi Saudi Arabia",
    metaDescription: "Private transfers in Olaya, Riyadh — hotel pickups near Kingdom Centre and Al Faisaliah, RUH airport runs and meeting days. Fare agreed first, 24/7.",
    h1: "Taxi Service in Olaya — Hotels, Kingdom Centre & Al Faisaliah",
    eyebrow: "Olaya · Central Riyadh",
    heroImage: "/locations/riyadh-hero.webp",
    heroAlt: "Kingdom Centre and Al Faisaliah Tower lit at dusk over the Olaya district of Riyadh",
    intro: `Olaya is Riyadh's central business and hotel strip — the district around Kingdom Centre and Al Faisaliah Tower, along Olaya Street and King Fahd Road. Most trips are hotel pickups, RUH airport runs (about ${RUH_CITY.km} km, ${RUH_CITY.time} off-peak) and shopping or meeting days. Every fare is agreed before booking, 24/7.`,
    facts: [
      { label: "RUH to Olaya", value: `${RUH_CITY.km} km · ${RUH_CITY.time} off-peak` },
      { label: "Landmarks", value: "Kingdom Centre · Al Faisaliah" },
      { label: "Best for", value: "Hotel pickups, malls, meetings" },
      { label: "Hours", value: "24/7" },
    ],
    blocks: [
      {
        type: "table",
        heading: "Common trips from Olaya",
        columns: ["Trip", "What to book", "Note"],
        rows: [
          ["Olaya hotel → RUH airport", "Single transfer", "Set pickup with a buffer at commuter peaks"],
          ["Olaya → KAFD meetings", "Single or hourly", "Short distance, slow at peak — hourly if 3+ stops"],
          ["Olaya → Diriyah dinner", "Transfer + timed return", "Agree the return time up front"],
          ["Mall day (Kingdom Centre and beyond)", "Hourly hire", "Driver holds bags and waits"],
          ["Olaya → Dammam / Bahrain", "Intercity car", "Door to door, rest stops on request"],
        ],
      },
      {
        type: "prose",
        heading: "Pickups on Olaya Street and King Fahd Road",
        paragraphs: [
          "Olaya's hotels sit on or just off two of the busiest roads in the city. The driver will come to the hotel's own entrance or porte-cochère — share the hotel name rather than a street address and we avoid the wrong side of a divided road.",
          "For mall pickups, agree a specific entrance (or share a map pin on WhatsApp) — the large malls have several doors and car-park levels, and that one detail is what keeps a pickup quick.",
        ],
      },
    ],
    ctaHeading: "Book an Olaya pickup",
    ctaBody: "Hotel name, destination, time and passengers — we confirm the car and the fare before booking.",
    ctaLabel: "Get My Olaya Transfer Quote",
    waPrefill: "Salam! Olaya, Riyadh pickup.\n• Pickup (hotel / mall): \n• Drop-off: \n• Date & time: \n• Passengers & bags: \n• Vehicle (Sedan / SUV / Van): ",
    form: { pickup: "Olaya, Riyadh", vehicle: "Sedan" },
    faqs: [
      { question: "How far is Olaya from Riyadh airport?", answer: `Central Riyadh, including Olaya, is about ${RUH_CITY.km} km from King Khalid International Airport (RUH) — ${RUH_CITY.time} with clear roads, longer at commuter peaks.` },
      { question: "Do you pick up from hotels near Kingdom Centre and Al Faisaliah Tower?", answer: "Yes. Share the hotel name and the driver comes to the hotel's own entrance, 24 hours a day." },
      { question: "Is hourly hire worth it for a shopping day in Olaya?", answer: "Usually yes once you have three or more stops — the driver waits and holds your bags, and you never wait for a new car outside a mall." },
      { question: "Can I book an Olaya to Diriyah return trip?", answer: "Yes. Book the drop-off and agree a fixed return time, or keep the car for the evening if you are not sure when you will leave." },
    ],
    related: [
      { href: "/locations/riyadh/hotel-transfer", label: "Riyadh hotel transfers", desc: "Airport to Olaya hotels and back" },
      { href: "/locations/riyadh/kafd", label: "KAFD", desc: "The financial district next door" },
      { href: "/locations/riyadh/private-driver", label: "Private driver", desc: "Hourly hire for shopping and meetings" },
      { href: "/airports/king-khalid-riyadh", label: "RUH airport transfers", desc: "Arrival details and departures" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "Olaya, Riyadh", type: "Place", description: "Central business and hotel district of Riyadh around Kingdom Centre and Al Faisaliah Tower." } },
  },

  /* Diplomatic Quarter — discreet, delegation intent */
  "diplomatic-quarter": {
    slug: "diplomatic-quarter",
    kind: "district",
    name: "Diplomatic Quarter",
    nameAr: "الحي الدبلوماسي",
    title: "Diplomatic Quarter Chauffeur | Discreet Transfers in DQ, Riyadh",
    metaDescription: "Discreet, pre-arranged chauffeur transfers in the Diplomatic Quarter, Riyadh — embassy visits, delegations and airport runs. Driver details shared first.",
    h1: "Diplomatic Quarter Chauffeur — Discreet, Pre-Arranged Transfers",
    eyebrow: "Diplomatic Quarter (DQ) · West Riyadh",
    // Not event-vip-arrival-riyadh.webp: its signage shows a venue name that
    // does not exist (CLAUDE.md §3). No DQ photo in the library yet.
    heroImage: "/locations/riyadh-hero.webp",
    heroAlt: "Riyadh skyline at dusk with Kingdom Centre and Al Faisaliah Tower",
    intro: "The Diplomatic Quarter (DQ) in west Riyadh is home to embassies, international organisations and residential compounds. Transport here is about predictability: a named driver and vehicle shared in advance, an agreed pickup point, and no improvising at the gate. Fares are agreed before booking and trips run 24/7.",
    facts: [
      { label: "Location", value: "West Riyadh" },
      { label: "Best for", value: "Embassy visits, delegations" },
      { label: "Driver details", value: "Shared before pickup" },
      { label: "Vehicles", value: "Sedan · SUV · van · luxury" },
    ],
    blocks: [
      {
        type: "checklist",
        heading: "What to tell us for a DQ pickup",
        intro: "Access to parts of the DQ is controlled. The more we know in advance, the smoother the arrival.",
        items: [
          "The exact building, embassy or compound name — not just \"DQ\"",
          "The gate or entrance you were told to use, if any",
          "Passenger names, if the host needs them in advance",
          "Whether the driver should wait outside or return at a set time",
          "Any vehicle preference your host or protocol office has asked for",
        ],
      },
      {
        type: "cards",
        heading: "Typical Diplomatic Quarter trips",
        items: [
          { title: "Embassy appointments", body: "Hotel to embassy and back, with a fixed return time or the driver waiting outside." },
          { title: "Visiting delegations", body: "Several people and several stops over one or more days — the same driver and vehicle throughout." },
          { title: "Resident airport runs", body: "Compound to RUH for early departures, booked the day before with the pickup time worked back from the flight." },
        ],
      },
    ],
    ctaHeading: "Arrange a Diplomatic Quarter transfer",
    ctaBody: "Send the building or embassy, time and passengers — we confirm the driver and vehicle before the day.",
    ctaLabel: "Request a DQ Chauffeur Quote",
    waPrefill: "Salam! Diplomatic Quarter transfer.\n• Building / embassy / compound: \n• From / to: \n• Date & time: \n• Passengers: \n• Wait or return later?: ",
    form: { dropoff: "Diplomatic Quarter, Riyadh", vehicle: "VIP SUV" },
    pathB: { heading: "Embassy or organisation bookings", body: `Protocol offices can book by email with passenger lists and a written quote. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Transport RFQ — Diplomatic Quarter, Riyadh", emailBody: corpEmail("transport in the Diplomatic Quarter, Riyadh") },
    faqs: [
      { question: "Can a driver collect me from inside the Diplomatic Quarter?", answer: "Yes, wherever vehicles are permitted. Tell us the building or compound and any gate instructions you have been given — access rules are set by the DQ and the property, not by us." },
      { question: "Will I know my driver before pickup?", answer: "Yes. The driver's name, contact number and vehicle are shared on WhatsApp before pickup, so your host or security desk can be told in advance." },
      { question: "Can one driver stay with a delegation for several days?", answer: "Yes. Multi-day hire keeps the same driver and vehicle with the group. Send the dates, daily timings and group size for a quote." },
      { question: "Is the Diplomatic Quarter far from the airport?", answer: "The DQ is on the western side of Riyadh, so the airport run is longer than from Olaya or KAFD. Departure pickups are planned with a traffic buffer." },
    ],
    related: [
      { href: "/services/vip-transportation", label: "VIP transportation", desc: "Luxury vehicles for official guests" },
      { href: "/locations/riyadh/private-driver", label: "Private driver", desc: "Multi-stop and multi-day hire" },
      { href: "/locations/riyadh/diriyah", label: "Diriyah", desc: "Heritage visits for guests" },
      { href: "/airports/king-khalid-riyadh", label: "RUH airport transfers", desc: "Arrivals and early departures" },
    ],
    schema: { serviceType: "Chauffeur service", place: { name: "Diplomatic Quarter, Riyadh", type: "Place", description: "Embassy and residential district in west Riyadh." } },
  },

  /* Al Malaz — family / parks / stadium intent */
  "al-malaz": {
    slug: "al-malaz",
    kind: "district",
    name: "Al Malaz",
    nameAr: "الملز",
    title: "Al Malaz Taxi & Private Transfers | King Abdullah Park & Riyadh Zoo",
    metaDescription: "Private transfers in Al Malaz, Riyadh — King Abdullah Park, Riyadh Zoo and Prince Faisal bin Fahd Stadium. Family cars, timed returns, fare agreed first.",
    h1: "Al Malaz Private Transfers — Parks, Zoo & Stadium Trips",
    eyebrow: "Al Malaz · East-central Riyadh",
    heroImage: "/gallery/umrah-family.webp",
    heroAlt: "Chauffeur welcoming a family with luggage beside a private car",
    // Landmarks verified 2026-10-01: King Abdullah Park (formerly Al Malaz Square,
    // adjacent to Prince Faisal bin Fahd Stadium) and Riyadh Zoo — Wikipedia / Wikiwand.
    intro: "Al Malaz is one of Riyadh's oldest planned neighbourhoods, east of the centre. It is home to King Abdullah Park, Riyadh Zoo and Prince Faisal bin Fahd Stadium, so most trips here are family outings, match days and residents' airport and intercity runs. Fares are agreed before booking, 24/7.",
    facts: [
      { label: "Landmarks", value: "King Abdullah Park · Riyadh Zoo" },
      { label: "Also", value: "Prince Faisal bin Fahd Stadium" },
      { label: "Best for", value: "Families, events, residents" },
      { label: "Hours", value: "24/7" },
    ],
    blocks: [
      {
        type: "cards",
        heading: "Why people book a car in Al Malaz",
        items: [
          { title: "Family outings", body: "King Abdullah Park and Riyadh Zoo are family trips — a pre-booked SUV or van keeps everyone together, with a fixed time for the ride home." },
          { title: "Match and event nights", body: "Stadium crowds leave at once. Agree a pickup point a short walk from the gates and a time, and skip the scramble for a car." },
          { title: "Residents' long trips", body: "Airport departures and intercity trips to Dammam, Qassim or the GCC from a home address, booked in advance." },
        ],
      },
      {
        type: "prose",
        heading: "Planning a pickup after the park or a match",
        paragraphs: [
          "Evening is the busy time at King Abdullah Park, and match nights at the stadium bring the whole neighbourhood's traffic to the same few roads. Choose a pickup point on a side street rather than the main gate, and share it as a map pin on WhatsApp.",
          "If you are not sure when you will leave, book the drop-off plus a return window, or keep the car on hourly hire for the evening.",
        ],
      },
    ],
    ctaHeading: "Book a ride from Al Malaz",
    ctaBody: "Pickup point, destination, time and how many people — we confirm the car and fare first.",
    ctaLabel: "Get My Al Malaz Quote",
    waPrefill: "Salam! Al Malaz, Riyadh trip.\n• Pickup (address / park / stadium): \n• Drop-off: \n• Date & time: \n• Passengers (children?): \n• Return trip needed?: ",
    form: { pickup: "Al Malaz, Riyadh", vehicle: "VIP SUV" },
    faqs: [
      { question: "Can I book a return trip from King Abdullah Park?", answer: "Yes. Book the drop-off and a fixed return time, or keep the car for the evening on hourly hire if your plans are open." },
      { question: "What vehicle suits a family trip to Riyadh Zoo?", answer: "A full-size SUV takes up to seven passengers; a VIP van gives a larger group more room for strollers and bags." },
      { question: "Can I get a pickup after a match at Prince Faisal bin Fahd Stadium?", answer: "Yes. Agree a pickup point a short walk from the stadium and a time in advance — that avoids the gate congestion when the crowd leaves." },
      { question: "Do you do airport runs from Al Malaz?", answer: "Yes, 24/7. Share your flight time and address and the pickup is set with a buffer for traffic to King Khalid International Airport." },
    ],
    related: [
      { href: "/locations/riyadh/al-murabba", label: "Al Murabba", desc: "Museums and historic downtown nearby" },
      { href: "/locations/riyadh/private-driver", label: "Private driver", desc: "Keep the car for the evening" },
      { href: "/routes/riyadh-to-dammam", label: "Riyadh to Dammam", desc: "The shortest major intercity corridor" },
      { href: "/airports/king-khalid-riyadh", label: "RUH airport transfers", desc: "Departures from home" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "Al Malaz, Riyadh", type: "Place", description: "Central Riyadh neighbourhood with King Abdullah Park, Riyadh Zoo and Prince Faisal bin Fahd Stadium." } },
  },

  /* Al Murabba — museums / heritage downtown intent */
  "al-murabba": {
    slug: "al-murabba",
    kind: "district",
    name: "Al Murabba",
    nameAr: "المربع",
    title: "Al Murabba Transfers | National Museum & Murabba Palace, Riyadh",
    metaDescription: "Private transfers to Al Murabba, Riyadh — the National Museum, Murabba Palace and King Abdulaziz Historical Center, with a timed return or hourly car.",
    h1: "Al Murabba Transfers — National Museum & Murabba Palace",
    eyebrow: "Al Murabba · Historic downtown Riyadh",
    heroImage: "/locations/riyadh-hero.webp",
    heroAlt: "Riyadh skyline at dusk seen across the city's older central districts",
    // Verified 2026-10-01: King Abdulaziz Historical Center (National Museum,
    // Murabba Palace, King Abdulaziz Foundation) is in al-Murabba — Saudipedia, RCRC.
    intro: "Al Murabba is historic downtown Riyadh. Its anchor is the King Abdulaziz Historical Center, which holds the National Museum, Al Murabba Palace — the first palace built for King Abdulaziz — and the King Abdulaziz Foundation. Most trips are museum visits from a hotel with a timed return, or one stop on a full sightseeing day.",
    facts: [
      { label: "Landmarks", value: "National Museum · Murabba Palace" },
      { label: "Complex", value: "King Abdulaziz Historical Center" },
      { label: "Best for", value: "Museums, history, families" },
      { label: "Book as", value: "Drop-off + timed return" },
    ],
    blocks: [
      {
        type: "timeline",
        heading: "A downtown heritage day by car",
        intro: "One way to combine Al Murabba with Riyadh's other heritage stops, with the same driver all day.",
        items: [
          { time: "Morning", title: "National Museum", desc: "Start early inside the King Abdulaziz Historical Center, before the afternoon heat." },
          { time: "Late morning", title: "Al Murabba Palace", desc: "In the same complex — a short walk, the car waits." },
          { time: "Afternoon", title: "Back to the hotel", desc: "Rest through the hottest part of the day." },
          { time: "Evening", title: "Diriyah", desc: "At-Turaif and dinner at Bujairi Terrace, with a fixed return time." },
        ],
      },
      {
        type: "compare",
        heading: "Drop-off and return, or keep the car?",
        options: [
          { title: "Drop-off + return", tone: "ink", when: ["Museum only", "You know your finish time", "Lowest total fare"] },
          { title: "Hourly hire", tone: "green", when: ["Museum plus Diriyah or a mall", "Children or elderly guests", "Open-ended plans"] },
        ],
      },
    ],
    ctaHeading: "Plan a museum visit in Al Murabba",
    ctaBody: "Hotel, date and how long you will stay — we suggest drop-off and return or hourly hire, and confirm the fare.",
    ctaLabel: "Get My Al Murabba Quote",
    waPrefill: "Salam! Al Murabba / National Museum visit.\n• Pickup hotel: \n• Date & time: \n• Return time or hourly?: \n• Passengers: \n• Other stops (e.g. Diriyah): ",
    form: { dropoff: "National Museum, Al Murabba, Riyadh", vehicle: "Sedan", tripType: "Round Trip" },
    faqs: [
      { question: "What is in Al Murabba?", answer: "The King Abdulaziz Historical Center, which includes the National Museum, Al Murabba Palace and the King Abdulaziz Foundation for Research and Archives." },
      { question: "Can the driver wait while I visit the National Museum?", answer: "Yes, on hourly hire. On a drop-off and return booking, the driver comes back at the time you agree." },
      { question: "Can I combine Al Murabba and Diriyah in one day?", answer: "Yes. Book the car by the hour or for the day — museum in the morning, Diriyah in the evening is a common plan." },
      { question: "How do I get to Al Murabba from my Olaya hotel?", answer: "Book a private transfer with the hotel name and your visit time — the fare is agreed before booking, with a timed return if you need one." },
    ],
    related: [
      { href: "/locations/riyadh/diriyah", label: "Diriyah", desc: "The evening half of a heritage day" },
      { href: "/locations/riyadh/al-malaz", label: "Al Malaz", desc: "Parks and family stops nearby" },
      { href: "/locations/riyadh/private-driver", label: "Private driver", desc: "Full-day sightseeing hire" },
      { href: "/services/heritage-tours", label: "Heritage trips by car", desc: "Sightseeing across Saudi Arabia" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "King Abdulaziz Historical Center, Al Murabba", type: "TouristAttraction", description: "Downtown Riyadh complex including the National Museum and Al Murabba Palace." } },
  },

  /* Diriyah — heritage tourism (title kept, directional) */
  diriyah: {
    slug: "diriyah",
    kind: "attraction",
    name: "Diriyah",
    nameAr: "الدرعية",
    title: "Riyadh to Diriyah Taxi — At-Turaif & Bujairi Transfer | Taxi Saudi Arabia",
    metaDescription: "Private car from Riyadh to Diriyah — At-Turaif (UNESCO) and Bujairi Terrace, with a timed return or the driver waiting. Fare agreed before booking, 24/7.",
    h1: "Riyadh to Diriyah — At-Turaif & Bujairi Terrace Transfers",
    eyebrow: "Diriyah · UNESCO World Heritage",
    heroImage: "/locations/diriyah-hero.webp",
    heroAlt: "Mud-brick buildings of At-Turaif in Diriyah lit at dusk",
    intro: "Diriyah, on the north-west edge of Riyadh above Wadi Hanifa, is home to At-Turaif — a UNESCO World Heritage Site and the seat of the first Saudi state — and Bujairi Terrace, its restaurant quarter. A private car is the simple way to go: dropped at the visitor area, collected at a time you choose, with the fare agreed before booking.",
    facts: [
      { label: "Site", value: "At-Turaif (UNESCO)" },
      { label: "Dining", value: "Bujairi Terrace" },
      { label: "Best time", value: "Late afternoon & evening" },
      { label: "Book as", value: "Return trip or evening hire" },
    ],
    blocks: [
      {
        type: "timeline",
        heading: "How a Diriyah evening usually runs",
        items: [
          { time: "Late afternoon", title: "Hotel pickup", desc: "Leave central Riyadh before sunset to see At-Turaif in daylight." },
          { time: "Sunset", title: "At-Turaif", desc: "Walk the heritage district as the lights come on." },
          { time: "Evening", title: "Dinner at Bujairi Terrace", desc: "Restaurants overlooking At-Turaif and Wadi Hanifa." },
          { time: "Late", title: "Return", desc: "The driver is waiting, or collects you at the time you agreed." },
        ],
      },
      {
        type: "compare",
        heading: "Return trip or keep the car?",
        options: [
          { title: "Return trip", tone: "ink", when: ["You know when dinner ends", "Two or three people", "Lowest total fare"] },
          { title: "Evening hire", tone: "green", when: ["Open-ended plans", "Guests or family", "Another stop after Diriyah"] },
        ],
      },
    ],
    ctaHeading: "Book your Diriyah trip",
    ctaBody: "Hotel, date, time and whether you want a return — we confirm the car and fare before booking.",
    ctaLabel: "Get My Diriyah Transfer Quote",
    waPrefill: "Salam! Riyadh to Diriyah trip.\n• Pickup hotel / address: \n• Date & time: \n• Return time or wait?: \n• Passengers: \n• Vehicle (Sedan / SUV / Van): ",
    form: { dropoff: "Diriyah (At-Turaif / Bujairi Terrace)", vehicle: "Sedan", tripType: "Round Trip" },
    faqs: [
      { question: "How do I get from Riyadh to Diriyah?", answer: "Book a private car from your hotel or address. You are dropped at the visitor area for At-Turaif and Bujairi Terrace and collected at the time you agree — or the driver waits if you book by the hour." },
      { question: "What is there to see in Diriyah?", answer: "At-Turaif, a UNESCO World Heritage Site and birthplace of the first Saudi state, and Bujairi Terrace, a dining quarter overlooking Wadi Hanifa." },
      { question: "When is the best time to visit Diriyah?", answer: "Late afternoon into the evening — cooler, and At-Turaif is lit after sunset. Dinner at Bujairi Terrace is the usual way to end the visit." },
      { question: "How much is a taxi from Riyadh to Diriyah?", answer: "It depends on your pickup point, vehicle and whether you need a return or waiting time. Send the details and we agree one fixed fare before booking." },
    ],
    related: [
      { href: "/locations/riyadh/al-murabba", label: "Al Murabba", desc: "National Museum — the morning half of a heritage day" },
      { href: "/locations/riyadh/boulevard", label: "Boulevard, Hittin", desc: "Riyadh Season nights" },
      { href: "/blog/riyadh-to-diriyah-visitor-transport-guide", label: "Diriyah visitor transport guide", desc: "Planning your trip" },
      { href: "/locations/riyadh/private-driver", label: "Private driver", desc: "Keep the car for the evening" },
    ],
    schema: { serviceType: "Private transfer service", place: { name: "At-Turaif, Diriyah", type: "TouristAttraction", description: "UNESCO World Heritage Site in Diriyah, Riyadh." } },
  },

  /* Private driver — hourly / full-day service intent */
  "private-driver": {
    slug: "private-driver",
    kind: "service",
    name: "Private Driver",
    nameAr: "سائق خاص",
    title: "Private Driver in Riyadh | Hourly & Full-Day Chauffeur",
    metaDescription: "Hire a private driver in Riyadh by the hour or full day — meetings across KAFD, Olaya and the Diplomatic Quarter, shopping or events. Fare agreed first.",
    h1: "Private Driver in Riyadh — Hourly & Full-Day Chauffeur",
    eyebrow: "Car with driver · Riyadh",
    heroImage: "/gallery/airport-meet.webp",
    heroAlt: "Chauffeur in a suit holding a sign that reads \"We'll wait for you\" beside a black car",
    intro: "A private driver in Riyadh is a car and chauffeur booked for a block of hours or a full day. The driver waits between stops — outside a KAFD tower, a mall in Olaya or an embassy in the Diplomatic Quarter — so you never re-book a ride. The fare for the whole block is agreed before booking, with no meter and no surge.",
    facts: [
      { label: "Booked by", value: "The hour or the full day" },
      { label: "Driver", value: "Waits between every stop" },
      { label: "Languages", value: "English & Arabic" },
      { label: "Cancellation", value: "Free up to 24h before" },
    ],
    blocks: [
      {
        type: "timeline",
        heading: "What a full business day looks like",
        intro: "One driver, one car, one fare — an example, not a fixed itinerary.",
        items: [
          { time: "08:30", title: "Hotel pickup in Olaya", desc: "Driver at the lobby at the agreed time." },
          { time: "09:30", title: "Meeting in KAFD", desc: "Car waits near the tower." },
          { time: "12:30", title: "Lunch and a second meeting", desc: "Message the driver when you are ready." },
          { time: "15:00", title: "Diplomatic Quarter appointment", desc: "Pickup point agreed in advance." },
          { time: "18:00", title: "Dinner in Diriyah, then hotel", desc: "The day ends where you want it to." },
        ],
      },
      {
        type: "compare",
        heading: "Hourly driver or separate transfers?",
        intro: "An honest rule of thumb: count your stops.",
        options: [
          { title: "Separate transfers", tone: "ink", when: ["One or two trips in the day", "Long gaps between them", "No waiting needed"] },
          { title: "Private driver", tone: "green", when: ["Three or more stops", "Meetings that may overrun", "Bags, guests or a group"] },
        ],
      },
      {
        type: "checklist",
        heading: "When hourly hire makes sense",
        items: [
          "A business day moving between KAFD, Olaya and the Diplomatic Quarter",
          "Several errands in one afternoon — bank, office, lunch, another meeting",
          "A shopping day with the driver holding bags and waiting",
          "Visiting family or friends across several parts of the city",
          "An event day — arrival, the event, and the return as one booking",
          "A delegation that needs the same driver and vehicle all visit",
        ],
      },
    ],
    ctaHeading: "Request a private driver quote",
    ctaBody: "Date, start time, hours needed and a rough list of stops — we confirm the vehicle and fare before booking.",
    ctaLabel: "Request a Private Driver Quote",
    waPrefill: "Salam! Private driver in Riyadh (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers: \n• Vehicle (Executive sedan / SUV / Van): ",
    form: { pickup: "Riyadh", vehicle: "Sedan", tripType: "By the Hour" },
    pathB: { heading: "Daily drivers for your company", body: `Regular staff movements or a visiting team can run on one email thread with a written quote. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Corporate driver RFQ — Riyadh", emailBody: corpEmail("a private driver / hourly hire in Riyadh") },
    faqs: [
      { question: "How much does a private driver cost in Riyadh?", answer: "It depends on the vehicle and the hours needed. The fare for the whole block is agreed on WhatsApp before you book — no meter, no surge." },
      { question: "Is there a minimum booking time?", answer: "Hourly hire is booked in blocks of hours rather than single short trips. Send your date and the hours you need and we confirm availability and the fare." },
      { question: "Can the driver wait while I'm in meetings in KAFD or Olaya?", answer: "Yes — that is the point of hourly hire. The driver waits nearby and collects you when you message." },
      { question: "Can I book just one day?", answer: "Yes. A single full day is a normal booking — one business day, one event day or one shopping day. Multi-day hire is also available." },
      { question: "Can companies be invoiced for a daily driver?", answer: `Yes. ${CORPORATE_INVOICE_LINE}` },
      { question: "Which vehicles are available for hourly hire?", answer: "Executive sedans and full-size SUVs are the usual choice; vans and luxury vehicles are available through our partner network on request." },
    ],
    related: [
      { href: "/locations/riyadh/hotel-transfer", label: "Riyadh hotel transfers", desc: "When you only need one trip" },
      { href: "/locations/riyadh/kafd", label: "KAFD", desc: "Meeting days in the financial district" },
      { href: "/services/corporate", label: "Corporate transportation", desc: "Accounts and invoicing" },
      { href: "/services/vip-transportation", label: "VIP transportation", desc: "Luxury chauffeur tier" },
    ],
    schema: { serviceType: "Hourly & full-day chauffeur hire" },
  },

  /* Hotel transfer — hotel-side logistics, not RUH arrival procedure */
  "hotel-transfer": {
    slug: "hotel-transfer",
    kind: "service",
    name: "Hotel Transfer",
    nameAr: "نقل الفنادق",
    title: "Riyadh Hotel Transfer | RUH to Olaya, KAFD & DQ Hotels",
    metaDescription: "Private Riyadh hotel transfers — RUH airport to your hotel, hotel-to-hotel and hotel-to-venue across Olaya, KAFD, the DQ and Diriyah. Fare agreed first.",
    h1: "Riyadh Hotel Transfer — Airport, Olaya, KAFD & Diplomatic Quarter",
    eyebrow: "Hotel transfers · Riyadh",
    heroImage: "/gallery/group-van.webp",
    heroAlt: "White passenger van at a hotel entrance in Riyadh as guests arrive with luggage",
    intro: `A Riyadh hotel transfer is a private car between King Khalid International Airport (RUH) and your hotel — or between two hotels, or from your hotel to a meeting or venue. Central Riyadh is about ${RUH_CITY.km} km from RUH (${RUH_CITY.time} off-peak); the KAFD and Olaya hotel area about ${RUH_KAFD.km} km. Tell us the hotel name and we plan the right entrance.`,
    facts: [
      { label: "RUH → central Riyadh", value: `${RUH_CITY.km} km · ${RUH_CITY.time}` },
      { label: "RUH → KAFD / Olaya hotels", value: `${RUH_KAFD.km} km · ${RUH_KAFD.time}` },
      { label: "Hotel-to-hotel", value: "Any two Riyadh hotels" },
      { label: "Hours", value: "24/7, late arrivals too" },
    ],
    blocks: [
      {
        type: "table",
        heading: "Riyadh hotel areas at a glance",
        intro: "Off-peak drive times come from our route data; peak hours add time.",
        columns: ["Hotel area", "Typical guest", "Drop-off note"],
        rows: [
          ["Olaya / King Fahd Road", "Business & leisure", "Give the hotel name — divided roads make the side matter"],
          ["KAFD", "Finance & corporate", "Designated drop-off points between towers"],
          ["Diplomatic Quarter", "Official visitors", "Share building and any gate instructions"],
          ["Diriyah side", "Leisure & heritage", "Longer run from RUH; plan around evening traffic"],
          ["Near RUH / Airport Road", "Short stays, exhibitions", "Shortest airport run in the city"],
        ],
      },
      {
        type: "cards",
        heading: "Three kinds of hotel transfer",
        items: [
          { title: "Airport ↔ hotel", body: "Arrival on landing, or departure with the pickup time worked back from your flight. Full arrival details live on our RUH airport page." },
          { title: "Hotel ↔ hotel", body: "Changing hotels mid-stay, or moving a group between two properties with all the luggage in one vehicle." },
          { title: "Hotel ↔ venue", body: "Your hotel to a KAFD meeting, a Diriyah dinner or an exhibition, with the return agreed in advance." },
        ],
      },
    ],
    ctaHeading: "Book your Riyadh hotel transfer",
    ctaBody: "Hotel names, date, time, passengers and bags — we confirm the vehicle and the fare before booking.",
    ctaLabel: "Book My Hotel Transfer",
    waPrefill: "Salam! Riyadh hotel transfer.\n• From (airport / hotel): \n• To (hotel / venue): \n• Date & time: \n• Flight number (if airport): \n• Passengers & bags: ",
    form: { pickup: "King Khalid Airport (RUH)", dropoff: "Riyadh hotel", vehicle: "VIP SUV" },
    faqs: [
      { question: "How do I get from Riyadh airport to my Olaya or KAFD hotel?", answer: `Book a private transfer from King Khalid International Airport (RUH) with your flight number and hotel name. The KAFD and Olaya hotel area is about ${RUH_KAFD.km} km — ${RUH_KAFD.time} off-peak — with the fare agreed before booking.` },
      { question: "Can I book a transfer between two hotels in Riyadh?", answer: "Yes. Hotel-to-hotel moves are a normal booking, including groups moving with all their luggage. Send both hotel names and the time." },
      { question: "Do you transfer guests to hotels in the Diplomatic Quarter?", answer: "Yes, wherever vehicles are permitted. Share the property name and any gate instructions you have been given." },
      { question: "What if my flight lands late at night?", answer: "Transfers run 24/7. Share your flight number when you book and we check it before pickup." },
      { question: "Can the driver wait if I have a meeting before the hotel?", answer: "For airport, then a meeting, then the hotel, book hourly hire instead of a single transfer — see our private driver page." },
    ],
    related: [
      { href: "/airports/king-khalid-riyadh", label: "RUH airport transfers", desc: "Arrival procedure and terminals" },
      { href: "/locations/riyadh/private-driver", label: "Private driver", desc: "Multi-stop days" },
      { href: "/locations/riyadh/olaya", label: "Olaya", desc: "The main business hotel strip" },
      { href: "/services/hotel-transfers", label: "Hotel transfers across Saudi Arabia", desc: "Makkah, Madinah, Jeddah and more" },
    ],
    schema: { serviceType: "Hotel transfer service" },
  },

  /* NEW — Boulevard (Hittin) / Riyadh Season zones */
  boulevard: {
    slug: "boulevard",
    kind: "attraction",
    name: "Boulevard (Hittin)",
    nameAr: "البوليفارد",
    title: "Riyadh Season Transport | Boulevard World & Boulevard City",
    metaDescription: "Private car to Boulevard City and Boulevard World in Hittin, Riyadh — Riyadh Season 2026 opens 21 Oct. Drop-off plus a pre-arranged late-night pickup.",
    h1: "Transport to Riyadh Season — Boulevard World & Boulevard City",
    eyebrow: "Hittin · North Riyadh",
    heroImage: "/blog/riyadh-season-taxi-transport-guide.webp",
    heroAlt: "Black sedan parked beside a crowded, lit-up entertainment boulevard in Riyadh at night",
    // Verified 2026-10-01: Boulevard City (Hittin, ~220 acres, opened 2019) and
    // Boulevard World (Prince Turki Al Awwal Rd, Hittin, shares parking with
    // Boulevard City) — Wikipedia. Riyadh Season 2026 starts 21 Oct 2026 per
    // venues.md (closing date not verified — do not state it).
    intro: "Boulevard City and Boulevard World are two of Riyadh Season's main zones, side by side in Hittin, north Riyadh, on Prince Turki Al Awwal Road — and they share parking. Riyadh Season 2026 opens on 21 October 2026. Evenings here end late and all at once, so a pre-arranged car with an agreed pickup point is the easy way home.",
    facts: [
      { label: "Zones", value: "Boulevard City · Boulevard World" },
      { label: "Where", value: "Hittin, Prince Turki Al Awwal Rd" },
      { label: "Riyadh Season 2026", value: "Opens 21 October 2026" },
      { label: "Book as", value: "Drop-off + late pickup" },
    ],
    blocks: [
      {
        type: "steps",
        heading: "How a Boulevard night works by car",
        items: [
          { title: "Book the return too", desc: "Tell us roughly when you plan to leave. Late-night pickups are the part worth arranging in advance." },
          { title: "Drop-off at the zone", desc: "The driver drops you at the zone's entrance area — no hunting for parking." },
          { title: "Message when ready", desc: "On WhatsApp, with a pin if you are at a different gate from your drop-off." },
          { title: "Meet at the agreed point", desc: "Event-night traffic controls change, so we confirm the pickup point on the night." },
        ],
      },
      {
        type: "cards",
        heading: "Which zone are you visiting?",
        items: [
          { title: "Boulevard City", body: "Riyadh Season's original large zone in Hittin, opened in 2019 — dining, theatres, arenas and the musical fountain." },
          { title: "Boulevard World", body: "Next door on Prince Turki Al Awwal Road — country-themed areas around a large lagoon, open during Riyadh Season." },
          { title: "Other Season zones", body: "Riyadh Season also runs zones such as Wonder Garden and VIA Riyadh. Tell us the zone name and we plan the drop-off." },
        ],
      },
      {
        type: "compare",
        heading: "Return pickup or keep the car?",
        options: [
          { title: "Drop-off + return", tone: "ink", when: ["You know your show or dinner time", "Couple or small group", "Lowest total fare"] },
          { title: "Evening hire", tone: "green", when: ["Visiting two zones in one night", "Family with children", "You don't want to wait for a car"] },
        ],
      },
    ],
    ctaHeading: "Plan your Boulevard night",
    ctaBody: "Zone, date, drop-off time and when you expect to leave — we confirm the car and the fare before booking.",
    ctaLabel: "Book My Riyadh Season Ride",
    waPrefill: "Salam! Riyadh Season / Boulevard trip.\n• Zone (Boulevard City / Boulevard World / other): \n• Pickup hotel / address: \n• Date & drop-off time: \n• Expected leaving time: \n• Passengers: ",
    form: { dropoff: "Boulevard City, Hittin, Riyadh", vehicle: "VIP SUV", tripType: "Round Trip" },
    faqs: [
      { question: "Where are Boulevard City and Boulevard World?", answer: "Both are in Hittin, north Riyadh. Boulevard World is on Prince Turki Al Awwal Road and shares parking with Boulevard City." },
      { question: "When does Riyadh Season 2026 start?", answer: "Riyadh Season 2026 opens on 21 October 2026. Check the official Riyadh Season channels for the zone opening times on your date." },
      { question: "Is it better to book a return pickup in advance?", answer: "Yes. Crowds leave the zones at the same time late in the evening — an agreed pickup point and time means you are not searching for a car at closing." },
      { question: "Can one car take us to two zones in one night?", answer: "Yes. Book hourly hire for the evening and the driver moves you between zones and back to the hotel." },
      { question: "What car suits a family evening at the Boulevard?", answer: "A full-size SUV for up to seven people; a VIP van if you want more room for strollers and bags." },
    ],
    related: [
      { href: "/locations/riyadh/diriyah", label: "Diriyah", desc: "Another evening favourite" },
      { href: "/locations/riyadh/private-driver", label: "Private driver", desc: "Keep the car for the night" },
      { href: "/blog/riyadh-season-taxi-transport-guide", label: "Riyadh Season transport guide", desc: "Tips for event nights" },
      { href: "/locations/riyadh/hotel-transfer", label: "Hotel transfers", desc: "From any Riyadh hotel" },
    ],
    schema: { serviceType: "Event and attraction transfers", place: { name: "Boulevard City, Riyadh", type: "TouristAttraction", description: "Riyadh Season entertainment zone in Hittin, north Riyadh." } },
  },

  /* NEW — Riyadh Front / RFECC (transport-to-district, not an events page) */
  "riyadh-front": {
    slug: "riyadh-front",
    kind: "district",
    name: "Riyadh Front",
    nameAr: "واجهة روشن",
    title: "Riyadh Front Transportation | RFECC & ROSHN Front Transfers",
    metaDescription: "Private transfers to Riyadh Front (ROSHN Front) and RFECC on Airport Road — exhibition days, business park trips and short RUH airport runs.",
    h1: "Transport to Riyadh Front (RFECC & ROSHN Front)",
    eyebrow: "Airport Road · Riyadh",
    // Generic photo on purpose: the exhibition gallery shots show RICEC
    // signage, which must not appear on an RFECC page (venues.md alt rule).
    heroImage: "/gallery/luggage-assist.webp",
    heroAlt: "Driver lifting a suitcase into the boot of a private car",
    // Verified 2026-10-01: RFECC (36,050 m², near King Khalid International
    // Airport, hosts conferences/exhibitions incl. the Riyadh International Book
    // Fair 2022) — rfecc.sa/about-us. ROSHN Front (formerly Riyadh Front; renamed
    // 2023 after ROSHN acquisition; Sedra, east of Princess Nourah University;
    // business park + shopping zone) — Wikipedia.
    intro: "Riyadh Front — renamed ROSHN Front in 2023 — is a business and leisure development on the airport side of Riyadh, east of Princess Nourah bint Abdulrahman University. It includes a business park, a shopping zone and the Riyadh Front Exhibition & Conference Center (RFECC), a 36,050 m² venue close to King Khalid International Airport. That makes it one of the shortest airport runs in the city.",
    facts: [
      { label: "Venue", value: "RFECC · 36,050 m²" },
      { label: "Also", value: "Business park · shopping zone" },
      { label: "Location", value: "Airport Road, near RUH" },
      { label: "Best for", value: "Exhibitions, offices, airport" },
    ],
    blocks: [
      {
        type: "cards",
        heading: "Who travels to Riyadh Front",
        items: [
          { title: "Exhibition visitors", body: "Hotel to RFECC and back on show days — single attendees or small teams, with a fixed return time." },
          { title: "Exhibitors and stand crews", body: "Early build-up arrivals, vans for kit, and late departures after breakdown." },
          { title: "Business park staff", body: "Meetings at ROSHN Front's offices, often combined with a flight from nearby RUH." },
        ],
      },
      {
        type: "table",
        heading: "Planning a Riyadh Front trip",
        columns: ["Trip", "Plan for", "Tip"],
        rows: [
          ["RUH → RFECC", "Short airport run", "Good for same-day fly-in visits"],
          ["Olaya / KAFD hotel → RFECC", "Cross-city drive", "Leave early on show days"],
          ["RFECC → RUH departure", "Exhibition close times", "Agree the pickup point before the show ends"],
          ["Multi-day exhibition", "Same driver daily", "Book the days together for one quote"],
        ],
      },
    ],
    ctaHeading: "Book a Riyadh Front transfer",
    ctaBody: "Venue or building, dates, timings and how many people — we confirm vehicles and the fare before booking.",
    ctaLabel: "Get My Riyadh Front Quote",
    waPrefill: "Salam! Riyadh Front / RFECC transfer.\n• Event or building: \n• Pickup (hotel / RUH): \n• Date(s) & times: \n• People & equipment: \n• Vehicle (Sedan / SUV / Van / Coaster): ",
    form: { dropoff: "Riyadh Front (RFECC), Airport Road", vehicle: "Van" },
    pathB: { heading: "Exhibiting or sending a team?", body: `Daily shuttles for stand crews and staff can be quoted in writing by email. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Transport RFQ — Riyadh Front / RFECC", emailBody: corpEmail("transport to Riyadh Front / RFECC") },
    faqs: [
      { question: "Where is Riyadh Front?", answer: "On the airport side of Riyadh, east of Princess Nourah bint Abdulrahman University, close to King Khalid International Airport. It was renamed ROSHN Front in 2023." },
      { question: "What is RFECC?", answer: "The Riyadh Front Exhibition & Conference Center — a 36,050 m² venue at Riyadh Front for conferences, meetings and exhibitions." },
      { question: "Can I fly into RUH and go straight to RFECC?", answer: "Yes. It is one of the shortest airport runs in Riyadh. Book the transfer with your flight number and the event name." },
      { question: "Do you provide vans for exhibitors' equipment?", answer: "Yes — vans and larger vehicles are available through our partner network. Tell us the team size and what you are carrying." },
    ],
    related: [
      { href: "/airports/king-khalid-riyadh", label: "RUH airport transfers", desc: "The airport next door" },
      { href: "/events/riyadh-event-transportation", label: "Riyadh event transportation", desc: "Exhibitions and conferences citywide" },
      { href: "/locations/riyadh/hotel-transfer", label: "Hotel transfers", desc: "Hotel to venue and back" },
      { href: "/services/group-transport", label: "Group transport", desc: "Vans and coasters for teams" },
    ],
    schema: { serviceType: "Exhibition and business transfers", place: { name: "Riyadh Front Exhibition & Conference Center (RFECC)", type: "Place", description: "Exhibition and conference venue at ROSHN Front, near King Khalid International Airport, Riyadh." } },
  },
};

/** Sibling list shown on every Riyadh child page (anchors vary per page). */
export const RIYADH_CHILD_NAV: { slug: string; label: string }[] = [
  { slug: "private-driver", label: "Private driver" },
  { slug: "hotel-transfer", label: "Hotel transfer" },
  { slug: "kafd", label: "KAFD" },
  { slug: "olaya", label: "Olaya" },
  { slug: "diplomatic-quarter", label: "Diplomatic Quarter" },
  { slug: "diriyah", label: "Diriyah" },
  { slug: "boulevard", label: "Boulevard" },
  { slug: "riyadh-front", label: "Riyadh Front" },
  { slug: "al-murabba", label: "Al Murabba" },
  { slug: "al-malaz", label: "Al Malaz" },
];
