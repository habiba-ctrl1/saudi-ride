// Madinah cluster — single content source for the Madinah hub
// (/locations/madinah), its child page (/locations/madinah/private-driver),
// the Ziyarat planner and the related-routes module. Built 2026-10-09 from
// seo/madinah-keyword-map.md (owner-approved).
//
// Truth rules (CLAUDE.md §2, §14, §16, §17):
// - Distances/times to other cities come only from routeFact() (ROUTES_DATA).
// - Business facts from seo/facts.md: EN/AR drivers, 24/7, fare agreed before
//   booking, free cancellation up to 24h, cash or bank transfer, e-receipt on
//   request, corporate invoicing via sister company, flight tracking and meet &
//   greet (owner-confirmed), 15–30 min free waiting (never longer).
// - No guide / religious-guidance service is claimed: Ziyarat = transport only.
// - Local Ziyarat distances are ROAD distances from Al-Masjid an-Nabawi measured
//   with OSRM (OpenStreetMap routing) on 2026-10-09; the Dhul Hulayfah figure
//   agrees with the Saudi Press Agency (~14 km, 12 Mar 2026). They are labelled
//   approximate wherever shown.
// - No train / bus timetable figures: only qualitative differences are published
//   (operational times change and are not in facts.md).
// - No hotel partnership claims; no fares anywhere.
import { routeFact, corpEmail, CORPORATE_INVOICE_LINE, type ClusterPage, type ClusterCity, type TripType } from "@/lib/data/cluster";

export const MD_MED_CITY = routeFact("madinah-airport-to-city")!; // 20 km
export const MD_MED_MARKAZIYAH = routeFact("madinah-airport-to-madinah-markaziyah")!;
export const MD_MED_MAKKAH = routeFact("madinah-airport-to-makkah")!;
export const MD_MAKKAH = routeFact("madinah-to-makkah")!; // 430 km
export const MD_JEDDAH = routeFact("madinah-to-jeddah")!;
export const MD_JED_AIRPORT = routeFact("madinah-to-jeddah-airport")!;
export const JED_AIRPORT_MD = routeFact("jeddah-airport-to-madinah")!;
export const MD_ALULA = routeFact("madinah-to-alula")!; // 330 km
export const MD_RIYADH = routeFact("madinah-to-riyadh")!; // 840 km
export const MD_YANBU = routeFact("madinah-to-yanbu")!;
export const MD_TABUK = routeFact("madinah-to-tabuk")!;
export const MD_TAIF = routeFact("madinah-to-taif")!;

export const FREE_WAIT = "15–30 minutes";

export const MADINAH_FACTS: { label: string; value: string }[] = [
  { label: "MED Airport → city", value: `${MD_MED_CITY.km} km · ${MD_MED_CITY.time}` },
  { label: "Madinah → Makkah", value: `${MD_MAKKAH.km} km · ${MD_MAKKAH.time}` },
  { label: "Madinah → AlUla", value: `${MD_ALULA.km} km · ${MD_ALULA.time}` },
  { label: "Flights", value: "We track your flight" },
  { label: "Drivers", value: "English- & Arabic-speaking" },
  { label: "Cancellation", value: "Free up to 24 hours before" },
  { label: "Payment", value: "Cash to the driver or bank transfer" },
  { label: "Companies", value: "Invoicing via our sister company" },
];

/* ─── Hub: trip-type selector (feeds the shared TripTypeSelector) ───── */

export const MADINAH_TRIPS: TripType[] = [
  {
    id: "airport",
    icon: "plane",
    label: "Madinah Airport (MED)",
    short: `${MD_MED_CITY.km} km to the city`,
    answer: `A private car from Prince Mohammad bin Abdulaziz International Airport (MED) to your Madinah hotel is about ${MD_MED_CITY.km} km and ${MD_MED_CITY.time}. We track your flight, the driver meets you at arrivals (meet & greet), and the fare is agreed before you travel. The first ${FREE_WAIT} of waiting is free.`,
    send: ["Flight number", "Hotel name", "Passengers and large bags", "Return flight, if booking both ways"],
    href: "/airports/prince-mohammad-madinah",
    linkLabel: "Madinah Airport (MED) transfers",
    waPrefill: "Salam! Madinah Airport (MED) transfer.\n• From: Madinah Airport (MED)\n• To (hotel): \n• Date & time: \n• Flight number: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "hotel",
    icon: "hotel",
    label: "Hotel & Central Area",
    short: "Hotels near Masjid an-Nabawi",
    answer: "Give us your hotel name and the leg you need — airport, station, another hotel or a city. Around Al-Masjid an-Nabawi the Central Area (Markaziyah) has restricted vehicle access, so the driver uses the nearest permitted drop-off point to your hotel and tells you where to meet on the way back.",
    send: ["Hotel name", "Where you are going", "Date and time", "Passengers and large bags"],
    href: "#hotels",
    linkLabel: "Madinah hotel transfers",
    waPrefill: "Salam! Madinah hotel transfer.\n• Hotel (pickup): \n• To (airport / station / hotel / city): \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "ziyarat",
    icon: "landmark",
    label: "Ziyarat by car",
    short: "Quba, Uhud, Qiblatayn & more",
    answer: "A private car takes you between the Madinah sites you choose — for example Quba Mosque, Masjid al-Qiblatayn, the Seven Mosques area and Mount Uhud — and waits at each stop. We provide the transport only; we do not provide religious guidance or a guide.",
    send: ["Date and start time", "Sites you want to visit", "Passengers (elders or children?)", "Pickup hotel"],
    href: "/services/madinah-ziyarat",
    linkLabel: "Madinah Ziyarat by private car",
    waPrefill: "Salam! Madinah Ziyarat by private car.\n• Date & start time: \n• Sites to visit: \n• Pickup hotel: \n• Passengers: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "private-driver",
    icon: "clock",
    label: "Private driver by the hour",
    short: "Half-day or full day",
    answer: "One car and driver for a block of hours — the car waits outside each stop. Useful for several Ziyarat stops, shopping, family visits or a day that runs around prayer times, without re-booking a ride each time.",
    send: ["Date and start time", "Hours needed", "Rough list of stops", "Passengers"],
    href: "/locations/madinah/private-driver",
    linkLabel: "Private driver in Madinah",
    waPrefill: "Salam! Private driver in Madinah (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "makkah",
    icon: "route",
    label: "Madinah ↔ Makkah",
    short: `${MD_MAKKAH.km} km, hotel to hotel`,
    answer: `Madinah to Makkah is about ${MD_MAKKAH.km} km — roughly ${MD_MAKKAH.time} of driving, plus the prayer and rest stops you ask for. A private car goes hotel to hotel with all your luggage in one vehicle. If you want to stop at Dhul Hulayfah (Abyar Ali) on the way, tell us when you book.`,
    send: ["Madinah pickup hotel", "Makkah hotel", "Date and time", "Passengers and large bags", "Any stop you want on the way"],
    href: "/routes/madinah-to-makkah",
    linkLabel: "Madinah to Makkah private transfer",
    waPrefill: "Salam! Madinah → Makkah transfer.\n• From (hotel): \n• To (hotel): \n• Date & time: \n• Passengers & luggage: \n• Stop on the way (if any): \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "jeddah",
    icon: "route",
    label: "Jeddah & JED Airport",
    short: `${MD_JED_AIRPORT.km} km to JED`,
    answer: `Madinah to Jeddah city is about ${MD_JEDDAH.km} km (${MD_JEDDAH.time}); to King Abdulaziz International Airport (JED) it is about ${MD_JED_AIRPORT.km} km (${MD_JED_AIRPORT.time}). For a flight, we work the pickup back from your departure time. The same trips run in reverse from JED.`,
    send: ["Pickup address", "Jeddah or JED destination", "Flight time if flying", "Passengers and bags"],
    href: "/routes/madinah-to-jeddah-airport",
    linkLabel: "Madinah to Jeddah Airport",
    waPrefill: "Salam! Madinah ↔ Jeddah transfer.\n• From: \n• To (Jeddah / JED Airport): \n• Date & time: \n• Flight number (if airport): \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "alula",
    icon: "route",
    label: "AlUla & the north",
    short: `${MD_ALULA.km} km to AlUla`,
    answer: `Madinah to AlUla is about ${MD_ALULA.km} km — roughly ${MD_ALULA.time} north through open desert. Many travellers add AlUla after Ziyarat. A private car goes door to door, and the return AlUla → Madinah is booked the same way.`,
    send: ["Madinah pickup", "AlUla hotel or airport", "Date and time", "Passengers and bags"],
    href: "/routes/madinah-to-alula",
    linkLabel: "Madinah to AlUla private car",
    waPrefill: "Salam! Madinah ↔ AlUla transfer.\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): ",
  },
  {
    id: "corporate",
    icon: "briefcase",
    label: "Corporate & groups",
    short: "Umrah groups, teams, delegations",
    answer: `Umrah group organisers, companies and delegations get one point of contact and a written quote by email, with vehicles from executive sedans to coasters through our partner network. Larger coaches are arranged on request. ${CORPORATE_INVOICE_LINE}`,
    send: ["Company or group name", "Dates and trip list", "Passengers per trip", "Whether you need an invoice"],
    href: "/services/group-transport",
    linkLabel: "Group and corporate transportation",
    waPrefill: "Salam! Corporate / group transport in Madinah.\n• Company / group: \n• Dates & trips: \n• Passengers per trip: \n• Vehicle (Sedan / SUV / Van / Coaster): \n• Invoice needed?: ",
  },
];

/* ─── Hub: route map nodes (only real route pages) ──────────────────── */

export interface MapNode {
  id: string;
  label: string;
  labelAr: string;
  /** SVG coordinates in a 640×380 viewBox. Schematic, not to scale. */
  x: number;
  y: number;
  slug: string;
  reverseSlug?: string;
}

export const MADINAH_MAP_NODES: MapNode[] = [
  { id: "makkah", label: "Makkah", labelAr: "مكة المكرمة", x: 250, y: 350, slug: "madinah-to-makkah", reverseSlug: "makkah-to-madinah" },
  { id: "jeddah", label: "Jeddah", labelAr: "جدة", x: 110, y: 335, slug: "madinah-to-jeddah", reverseSlug: "jeddah-to-madinah" },
  { id: "jed", label: "Jeddah Airport", labelAr: "مطار جدة", x: 70, y: 265, slug: "madinah-to-jeddah-airport", reverseSlug: "jeddah-airport-to-madinah" },
  { id: "yanbu", label: "Yanbu", labelAr: "ينبع", x: 80, y: 185, slug: "madinah-to-yanbu" },
  { id: "tabuk", label: "Tabuk", labelAr: "تبوك", x: 110, y: 95, slug: "madinah-to-tabuk" },
  { id: "alula", label: "AlUla", labelAr: "العلا", x: 400, y: 85, slug: "madinah-to-alula", reverseSlug: "alula-to-madinah" },
  { id: "riyadh", label: "Riyadh", labelAr: "الرياض", x: 560, y: 215, slug: "madinah-to-riyadh", reverseSlug: "riyadh-to-madinah" },
];

/* ─── Hub: corridor board ───────────────────────────────────────────── */

export const MADINAH_CORRIDORS: { slug: string; label: string; note: string }[] = [
  { slug: "madinah-to-makkah", label: "Madinah → Makkah", note: "Hotel to hotel, with prayer and rest stops on request — and Dhul Hulayfah (Abyar Ali) on the way if you want it." },
  { slug: "makkah-to-madinah", label: "Makkah → Madinah", note: "The other direction: pickup near the Haram, drop-off near Masjid an-Nabawi." },
  { slug: "jeddah-airport-to-madinah", label: "Jeddah Airport → Madinah", note: "Straight from the JED terminal to your Madinah hotel, with your flight tracked." },
  { slug: "madinah-to-jeddah-airport", label: "Madinah → Jeddah Airport", note: "The departure leg, with pickup worked back from your flight time." },
  { slug: "jeddah-to-madinah", label: "Jeddah city → Madinah", note: "From a Jeddah hotel or home, at any hour." },
  { slug: "madinah-to-jeddah", label: "Madinah → Jeddah city", note: "To a Jeddah hotel, the Corniche or Al-Balad rather than the airport." },
  { slug: "madinah-to-alula", label: "Madinah → AlUla", note: "North through the desert to Hegra and the Old Town, often added after Ziyarat." },
  { slug: "alula-to-madinah", label: "AlUla → Madinah", note: "Back from AlUla to a Madinah hotel or MED for your flight." },
  { slug: "madinah-to-riyadh", label: "Madinah → Riyadh", note: "The long cross-Kingdom drive, planned with rest stops." },
  { slug: "riyadh-to-madinah", label: "Riyadh → Madinah", note: "From Riyadh to your Madinah hotel in one vehicle." },
  { slug: "madinah-to-yanbu", label: "Madinah → Yanbu", note: "West to the Red Sea coast, for onward travel or the beach and diving." },
  { slug: "madinah-to-tabuk", label: "Madinah → Tabuk", note: "North-west towards Tabuk and, beyond it, NEOM." },
];

/* ─── Hub: areas (existing sub-area pages) ──────────────────────────── */

export const MADINAH_AREAS: { slug: string; name: string; nameAr: string; what: string }[] = [
  { slug: "al-markazia", name: "Al Markazia (Central Area)", nameAr: "المركزية", what: "The hotels around Al-Masjid an-Nabawi" },
  { slug: "qaba", name: "Quba", nameAr: "قباء", what: "Around Quba Mosque, south of the centre" },
  { slug: "uhud", name: "Uhud", nameAr: "أحد", what: "Mount Uhud area, north of the centre" },
  { slug: "al-awali-madinah", name: "Al Awali", nameAr: "العوالي", what: "Southern Madinah, towards the Makkah road" },
  { slug: "al-aqiq-madinah", name: "Al Aqiq", nameAr: "العقيق", what: "Western Madinah" },
  { slug: "sultanah", name: "Sultanah", nameAr: "السلطانة", what: "Central residential and shopping streets" },
];

/* ─── Ziyarat stops (planner + hub + AR) ────────────────────────────── */

export interface ZiyaratStop {
  id: string;
  name: string;
  nameAr: string;
  /** Road distance from Al-Masjid an-Nabawi, km (OSRM, 2026-10-09). */
  km: number;
  /** Free-flow drive time from Al-Masjid an-Nabawi, minutes (OSRM, rounded). */
  min: number;
  /** What the place is — historical context only, no rulings. */
  about: string;
  aboutAr: string;
  /** Transport note for the driver/passenger. */
  transport: string;
  /** Position on the illustrative map (640×400 viewBox). */
  x: number;
  y: number;
  /** Which end of the half-day loop the stop sits on (for ordering). */
  order: number;
}

export const ZIYARAT_STOPS: ZiyaratStop[] = [
  {
    id: "quba",
    name: "Quba Mosque",
    nameAr: "مسجد قباء",
    km: 9,
    min: 10,
    about: "Traditionally regarded as the first mosque built in Islam, on the southern side of Madinah.",
    aboutAr: "يُعدّ تقليديًا أول مسجد بُني في الإسلام، ويقع جنوب المدينة المنورة.",
    transport: "The car waits nearby while you visit. Quba is the usual first stop heading south from the Central Area.",
    x: 395,
    y: 322,
    order: 1,
  },
  {
    id: "seven-mosques",
    name: "Seven Mosques (Al-Khandaq area)",
    nameAr: "المساجد السبعة (منطقة الخندق)",
    km: 5,
    min: 7,
    about: "A group of small mosques on the site associated with the Battle of the Trench (Al-Khandaq), west of the centre.",
    aboutAr: "مجموعة مساجد صغيرة في الموضع المرتبط بغزوة الخندق، غرب وسط المدينة.",
    transport: "A short stop, usually combined with Masjid al-Qiblatayn because they are close together.",
    x: 205,
    y: 245,
    order: 2,
  },
  {
    id: "qiblatayn",
    name: "Masjid al-Qiblatayn",
    nameAr: "مسجد القبلتين",
    km: 7,
    min: 9,
    about: "The mosque associated with the change of the direction of prayer (the qibla), north-west of the centre.",
    aboutAr: "المسجد المرتبط بتحويل القبلة، شمال غرب وسط المدينة.",
    transport: "Parking is limited at busy times, so the driver may wait a short distance away and you message when you are ready.",
    x: 150,
    y: 150,
    order: 3,
  },
  {
    id: "uhud",
    name: "Mount Uhud & the Uhud martyrs' cemetery",
    nameAr: "جبل أحد ومقبرة شهداء أحد",
    km: 6,
    min: 9,
    about: "The mountain and cemetery associated with the Battle of Uhud, on the northern side of Madinah.",
    aboutAr: "الجبل والمقبرة المرتبطان بغزوة أحد، في الجهة الشمالية من المدينة المنورة.",
    transport: "The usual last stop before heading back to the Central Area, so the return leg is short.",
    x: 345,
    y: 55,
    order: 4,
  },
  {
    id: "dhul-hulayfah",
    name: "Dhul Hulayfah (Abyar Ali)",
    nameAr: "ذو الحليفة (آبار علي)",
    km: 14,
    min: 14,
    about: "The Miqat for people travelling from Madinah towards Makkah. It sits on the road south-west of the city, so it is a transport stop on the way to Makkah rather than a Ziyarat loop stop.",
    aboutAr: "ميقات المتجهين من المدينة المنورة إلى مكة المكرمة، ويقع على الطريق جنوب غرب المدينة، فهو محطة في طريق السفر إلى مكة أكثر من كونه ضمن جولة الزيارات.",
    transport: "If you want a stop here on a Madinah → Makkah trip, say so when you book. Whether and how to enter ihram is a personal religious matter we cannot advise on.",
    x: 90,
    y: 345,
    order: 5,
  },
];

/* ─── Hub: vehicle fit (same verified categories as the other hubs) ── */

export { MAKKAH_VEHICLE_FIT as MADINAH_VEHICLE_FIT } from "@/lib/data/makkah-cluster";

/* ─── Hub: timing ───────────────────────────────────────────────────── */

export const MADINAH_TIMING = [
  { title: "Around Masjid an-Nabawi", body: "Vehicle access in the Central Area (Markaziyah) next to Al-Masjid an-Nabawi is restricted and busy around prayer times. Your driver uses the nearest permitted drop-off point to your hotel and tells you where to meet on the way back." },
  { title: "Fridays and peak prayers", body: "Roads around the mosque are slowest around Friday prayers and the main congregational prayers. Allow extra time for a flight or an intercity departure that day." },
  { title: "Umrah peaks and Ramadan", body: "Hotel-area traffic and the roads to Makkah are heavier in Ramadan and peak Umrah weeks. Book vans and SUVs early and leave more margin for airport departures." },
  { title: "Night and early-morning arrivals", body: "Many international flights land at night or before dawn. Transfers run 24/7 — pre-book so the car is waiting rather than searched for after a long flight." },
  { title: "Luggage and gifts", body: "Umrah and Ziyarat travellers often carry more than planned, including dates and gifts on the way home. Tell us the number of large cases so the vehicle is sized to match." },
  { title: "Summer heat", body: "In the hottest months plan outdoor Ziyarat stops for early morning or after sunset, with the car close by between stops." },
];

/* ─── Hub: honest comparison — private car vs train vs bus (qualitative) ─ */

export const CAR_TRAIN_BUS = [
  { point: "Door to door", car: "Yes — hotel to hotel or airport to hotel", train: "Station to station; onward transport needed at each end", bus: "Station to station; onward transport needed at each end" },
  { point: "Luggage", car: "All bags in one vehicle, loaded by the driver", train: "Carried through the stations", bus: "Carried to and from the bus station" },
  { point: "Family or group", car: "One fare for the whole car", train: "A ticket per person", bus: "A ticket per person" },
  { point: "Timetable", car: "You choose the departure, 24/7", train: "Fixed departures", bus: "Fixed departures" },
  { point: "Stops on the way", car: "Prayer, meal or luggage stops on request", train: "None", bus: "Set stops only" },
];

export const CAR_TRAIN_BUS_NOTE =
  "The Haramain high-speed railway runs between Madinah and Makkah and is often a good choice for a solo traveller on a fixed schedule. Check current timetables and fares with the operator — we do not publish train times because they change. Choose a private car when you travel as a family or group, carry luggage or need stops that a timetable does not give you.";

/* ─── Hub: visitor guide, booking, FAQ ──────────────────────────────── */

export const MADINAH_VISITOR_GUIDE = [
  { q: "How do I get from Madinah Airport to my hotel?", a: `The simplest way is a pre-booked private car from MED to your hotel — about ${MD_MED_CITY.km} km and ${MD_MED_CITY.time}, with your luggage in the same vehicle. We track your flight, so a delay moves the pickup.` },
  { q: "What is the Central Area (Markaziyah)?", a: "It is the district around Al-Masjid an-Nabawi where most pilgrim hotels stand. Vehicle access there is restricted, so drivers use the nearest permitted drop-off point to your hotel." },
  { q: "What is Ziyarat?", a: "Ziyarat means visiting historic and religious sites. In Madinah that usually means Quba Mosque, Masjid al-Qiblatayn, the Seven Mosques area and Mount Uhud. We provide the car; we do not provide a guide." },
  { q: "What is a Miqat?", a: "A Miqat is the boundary where people travelling for Umrah or Hajj enter the state of ihram. For travellers leaving Madinah it is Dhul Hulayfah (Abyar Ali). What you should do there is a religious question for a qualified scholar; we only handle the transport." },
  { q: "Can the car wait while we visit a site?", a: "Yes. On a Ziyarat or private-driver booking the car waits at each stop, so you do not search for a ride afterwards. Tell us the stops and who is travelling when you book." },
  { q: "How do I pay?", a: "Cash to the driver or bank transfer. An electronic receipt is available on request." },
];

export const MADINAH_BOOKING_STEPS = [
  { title: "Send your trip", desc: "Form or WhatsApp: pickup, drop-off, date, passengers, luggage and flight number if it is an airport trip." },
  { title: "Agree one fare", desc: "We confirm the vehicle and one fixed fare before anything is booked — no meter, no surge." },
  { title: "Driver details", desc: "Name and number arrive on WhatsApp before pickup. We track your flight." },
  { title: "Ride & pay", desc: `${FREE_WAIT} free waiting. Pay cash or by bank transfer.` },
];

export const MADINAH_HUB_FAQS: { question: string; answer: string; category: string }[] = [
  { category: "Booking", question: "How do I book a private transfer in Madinah?", answer: "Send your pickup, drop-off, date, passengers and luggage by the form or on WhatsApp. We reply with the vehicle and one fixed fare before anything is booked — no meter and no surge. Cancellation is free up to 24 hours before pickup." },
  { category: "Airport", question: "How far is Madinah Airport (MED) from central Madinah?", answer: `Prince Mohammad bin Abdulaziz International Airport (MED) is about ${MD_MED_CITY.km} km from the Central Area, ${MD_MED_CITY.time} on a clear road. Traffic near Masjid an-Nabawi at prayer times can add to that. We track your flight and the first ${FREE_WAIT} of waiting is free.` },
  { category: "Hotels", question: "Can the driver take me to the door of my hotel near Masjid an-Nabawi?", answer: "The driver takes you as close as vehicles are permitted. Access around Al-Masjid an-Nabawi is restricted and varies with prayer times, so the driver uses the nearest permitted drop-off point to your hotel and tells you where to meet for the return." },
  { category: "Ziyarat", question: "Do you offer Madinah Ziyarat by car?", answer: "Yes. A private car takes you between the sites you choose — such as Quba Mosque, Masjid al-Qiblatayn, the Seven Mosques area and Mount Uhud — and waits at each stop. We provide transport only, not a guide or religious guidance." },
  { category: "Hourly", question: "Can I book a private driver in Madinah for several hours?", answer: "Yes. Book a car and driver for a block of hours or a full day; the car waits between stops. Send your date, start time and hours needed and we confirm the fare before booking. A single transfer is simpler when you only have one or two stops." },
  { category: "Makkah", question: "Can you take me from Madinah to Makkah?", answer: `Yes. Madinah to Makkah is about ${MD_MAKKAH.km} km and ${MD_MAKKAH.time} of driving, hotel to hotel, with prayer and rest stops on request. The return trip can be booked at the same time, and Makkah to Madinah runs the other way.` },
  { category: "Miqat", question: "Can I stop at Dhul Hulayfah (Abyar Ali) on the way to Makkah?", answer: "Ask for a stop at Dhul Hulayfah when you book a Madinah to Makkah transfer and we confirm it as part of the quote. Whether to enter ihram there is a personal religious matter we cannot advise on — please ask a qualified scholar." },
  { category: "Jeddah", question: "Can you take me from Madinah to Jeddah Airport?", answer: `Yes. Madinah to King Abdulaziz International Airport (JED) is about ${MD_JED_AIRPORT.km} km, ${MD_JED_AIRPORT.time}. We work the pickup back from your flight time. The reverse, Jeddah Airport to Madinah, is also available and we track your flight.` },
  { category: "AlUla", question: "Can you take me from Madinah to AlUla?", answer: `Yes. Madinah to AlUla is about ${MD_ALULA.km} km, roughly ${MD_ALULA.time} by road. A private car goes door to door to your AlUla hotel or the airport, and AlUla to Madinah is booked the same way.` },
  { category: "Vehicles", question: "Can families travel with luggage?", answer: "Yes. A sedan fits one to three people with normal luggage. A GMC or full-size SUV, or a Hyundai Staria, suits families with more luggage. A Hiace van or coaster suits larger groups. Tell us passengers and large bags and we confirm the vehicle when we quote." },
  { category: "Pricing", question: "How much is a private transfer in Madinah?", answer: "It depends on the route, the vehicle and the time. We do not publish fixed price lists because they would not be accurate: you send the trip and we confirm one fixed fare on WhatsApp before booking. There is no meter and no surge pricing." },
  { category: "Booking", question: "Do the drivers speak English?", answer: "Yes. Drivers in our partner network speak English and Arabic, and trips run 24 hours a day." },
];

export const MADINAH_GUIDES = [
  { href: "/guides/madinah-ziyarat-sites-guide", label: "Madinah Ziyarat: the main sites and how to visit by car" },
  { href: "/guides/dhul-hulaifah-miqat-madinah", label: "Dhul Hulaifah (Abyar Ali): the Miqat for Madinah pilgrims" },
  { href: "/guides/makkah-to-madinah-transport-guide", label: "Makkah to Madinah: taxi, train or bus" },
  { href: "/blog/madinah-to-makkah-taxi-price-distance-time", label: "Madinah to Makkah by car: distance and time" },
  { href: "/blog/madinah-taxi-fares-cost-guide", label: "How taxi fares in Madinah are worked out" },
  { href: "/blog/jeddah-to-madinah-taxi-guide-fares", label: "Jeddah Airport to Madinah: train or car" },
  { href: "/services/badr-ziyarat", label: "Badr Ziyarat from Madinah" },
  { href: "/services/umrah-transport", label: "Umrah transport service" },
];

/* ─── Child page: private driver ────────────────────────────────────── */

export const MADINAH_PAGES: Record<string, ClusterPage> = {
  "private-driver": {
    slug: "private-driver",
    kind: "service",
    name: "Private Driver",
    nameAr: "سيارة مع سائق",
    title: "Private Driver in Madinah | Car with Driver by the Hour or Full Day",
    metaDescription: "Hire a private driver in Madinah by the hour or for a full day — Ziyarat stops, family visits, shopping and meetings. Fare agreed before booking, 24/7.",
    h1: "Private Driver & Car with Driver in Madinah",
    eyebrow: "Car with driver · Madinah",
    heroImage: "/locations/madinah-og.webp",
    heroAlt: "Sunlit umbrella canopies in the courtyard of Al-Masjid an-Nabawi in Madinah",
    intro: `A private driver in Madinah is a car and professional driver booked for a block of hours or a whole day. The car waits outside every stop — Quba, Masjid al-Qiblatayn, Mount Uhud, a family visit, shopping or a meeting — so you never re-book a ride or look for a taxi near Masjid an-Nabawi after prayers. ${FREE_WAIT} of free waiting applies to single transfers; on hourly hire the waiting is part of the booked time.`,
    facts: [
      { label: "Booked by", value: "The hour or the full day" },
      { label: "Driver", value: "Waits at every stop" },
      { label: "Languages", value: "English & Arabic" },
      { label: "Cancellation", value: "Free up to 24h before" },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Who books a driver in Madinah",
        heading: "Four kinds of Madinah day",
        items: [
          { title: "The Ziyarat day", body: "Quba, the Seven Mosques area, Masjid al-Qiblatayn and Mount Uhud in one half-day, with waiting time at each stop. Transport only — no guide and no religious guidance." },
          { title: "The family day", body: "Elderly parents, children and shopping bags in one vehicle, with pickups timed around prayer times rather than the other way round." },
          { title: "The Madinah-and-onward day", body: `A morning of Ziyarat, then on to Makkah (about ${MD_MAKKAH.km} km), Jeddah Airport (about ${MD_JED_AIRPORT.km} km) or AlUla (about ${MD_ALULA.km} km). Book it as one full-day hire or as a Ziyarat block followed by a transfer.` },
          { title: "The business day", body: "Hotel, two or three meetings across the city and an evening flight from Madinah Airport — one car all day while the bags stay in the boot." },
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
        heading: "Hourly hire in Madinah: what you can book",
        columns: ["Use", "How it is booked"],
        rows: [
          ["Half-day Ziyarat", "A block of hours with waiting at each stop (use the Ziyarat planner)"],
          ["Full-day city driver", "Start time, hours and a rough list of stops"],
          ["Madinah plus Badr", "Full-day hire — see the Badr Ziyarat page for the route"],
          ["Corporate meetings", "Written quote by email; invoicing via our sister company"],
        ],
      },
    ],
    ctaHeading: "Request a private driver in Madinah",
    ctaBody: "Date, start time, hours needed and the stops you have in mind — we confirm the vehicle and fare before booking.",
    ctaLabel: "Request a Private Driver",
    waPrefill: "Salam! Private driver in Madinah (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers: \n• Vehicle (Sedan / SUV / Van): ",
    form: { pickup: "Madinah", vehicle: "Sedan", tripType: "By the Hour" },
    pathB: { heading: "Drivers for a visiting team or Umrah group?", body: `Daily drivers for staff, a delegation or a group can be quoted in writing by email. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Private driver RFQ — Madinah", emailBody: corpEmail("a private driver / hourly hire in Madinah") },
    faqs: [
      { question: "How much is a private driver in Madinah?", answer: "It depends on the vehicle and the number of hours. The fare for the whole block is agreed on WhatsApp before booking — no meter and no surge. We do not publish a price list because it would not match every trip." },
      { question: "Can I book a driver for just a few hours?", answer: "Yes. Hourly hire is booked in blocks of hours. Send your date, start time and how long you need the car, and we confirm availability and the fare." },
      { question: "Can the driver wait while we pray or visit a site?", answer: "Yes. The car waits at, or as near as allowed to, each stop and you message when you are ready. Allow extra time around prayer times, when roads near Masjid an-Nabawi are busy." },
      { question: "Is the driver a guide?", answer: "No. The driver provides the transport and knows the roads between the sites, but we do not provide a guide or religious guidance. Use the Ziyarat guide on our site or a qualified guide for history and rulings." },
      { question: "Can we go to Makkah or AlUla from Madinah in one day?", answer: `Makkah is about ${MD_MAKKAH.km} km and AlUla about ${MD_ALULA.km} km one way, so a same-day return is a very long day. Most travellers book a one-way intercity transfer instead; tell us the plan and we suggest the better option.` },
      { question: "Which cars are available with a driver?", answer: "Sedans and full-size SUVs are the usual choice; a Hyundai Staria, vans and coasters are available through our partner network on request. Availability is confirmed for your date and passenger count when we quote." },
    ],
    related: [
      { href: "/services/madinah-ziyarat", label: "Madinah Ziyarat by private car", desc: "A set route between the sites" },
      { href: "/airports/prince-mohammad-madinah", label: "Madinah Airport (MED)", desc: "When you only need the airport leg" },
      { href: "/routes/madinah-to-makkah", label: "Madinah to Makkah", desc: "A single transfer to Makkah" },
      { href: "/services/badr-ziyarat", label: "Badr Ziyarat from Madinah", desc: "A half-day trip to the Badr sites" },
    ],
    schema: { serviceType: "Hourly & full-day chauffeur hire" },
  },
};

export const MADINAH_CHILD_NAV: { slug: string; label: string }[] = [
  { slug: "private-driver", label: "Private driver" },
];

export const MADINAH_CITY: ClusterCity = { slug: "madinah", name: "Madinah", nav: MADINAH_CHILD_NAV };

/** Route slugs that get the Madinah related-routes module. */
export const MADINAH_CLUSTER_ROUTE_SLUGS = [
  "madinah-to-makkah", "makkah-to-madinah", "madinah-airport-to-makkah", "makkah-to-madinah-airport",
  "madinah-airport-to-city", "madinah-airport-to-madinah-markaziyah", "makkah-clock-tower-to-madinah-markaziyah",
  "jeddah-to-madinah", "jeddah-airport-to-madinah", "madinah-to-jeddah", "madinah-to-jeddah-airport",
  "madinah-to-alula", "alula-to-madinah", "madinah-to-riyadh", "riyadh-to-madinah",
  "madinah-to-yanbu", "madinah-to-tabuk", "madinah-to-taif", "medinah-to-amman",
];

/* ─── MED airport journey (feeds the shared AirportFlow) ────────────── */

export const MED_ARRIVAL_STEPS = [
  { title: "Book with your flight", desc: "Send the flight number and your hotel. The fare is agreed before you travel." },
  { title: "We track your flight", desc: `A delay moves the pickup, and the first ${FREE_WAIT} of waiting after landing is free.` },
  { title: "Meet & greet", desc: "Your driver meets you at arrivals. Driver details reach you on WhatsApp before you land." },
  { title: "Luggage loaded", desc: "All bags go in one vehicle, sized to your passengers and large cases." },
  { title: "Private vehicle", desc: `About ${MD_MED_CITY.km} km to the Central Area, ${MD_MED_CITY.time} on a clear road.` },
  { title: "Hotel drop-off", desc: "To the nearest permitted drop-off point to your hotel near Al-Masjid an-Nabawi." },
];

export const MED_DEPARTURE_STEPS = [
  { title: "Book with your flight", desc: "Send the departure time and your hotel; pickup is worked back from the flight." },
  { title: "Hotel pickup", desc: "The driver collects you at the nearest permitted point and messages where to meet." },
  { title: "Prayer-time traffic", desc: "Roads near Masjid an-Nabawi slow at prayer times and on Fridays — the pickup time allows for it." },
  { title: "Drop-off at MED", desc: "To the departures area of Prince Mohammad bin Abdulaziz International Airport." },
];
