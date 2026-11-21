// Dammam / Eastern Province cluster — content for the Dammam hub
// (/locations/dammam) and its private-driver child page. Built 2026-11-21 from
// seo/eastern-province-keyword-map.md.
//
// Truth rules (CLAUDE.md §2, §14, §16, §17):
// - Distances/times only via routeFact() (ROUTES_DATA). DMM → Dammam city and
//   DMM → Al Khobar are NOT in routes.ts, so no number is given for them
//   (the old "~35 km / ~30 km" copy had no source and was dropped).
// - Business facts from seo/facts.md only: EN/AR drivers, 24/7, flight
//   tracking, meet & greet (generic), 15–30 min free waiting, fare agreed
//   before booking, free cancellation up to 24h, cash or bank transfer,
//   e-receipts on request, quote usually within 1–2 hours, corporate invoicing
//   via sister company (verbatim line), border/causeway vehicle fees included.
// - Saudi Aramco, KFUPM, SABIC, Ithra etc. appear ONLY as destinations — never
//   as clients or partners. No monthly accounts / dedicated drivers (facts.md
//   TODO). No claim that drivers "know" gate procedures.
// - No border drop-off option on the Bahrain causeway (facts.md).
import { routeFact, corpEmail, CORPORATE_INVOICE_LINE, type ClusterPage, type ClusterCity, type TripType } from "@/lib/data/cluster";

export const FREE_WAIT = "15–30 minutes";

export const DMM_DHAHRAN = routeFact("dammam-airport-to-dhahran")!;
export const DMM_JUBAIL = routeFact("dammam-airport-to-jubail")!;
export const DMM_BAHRAIN = routeFact("dammam-airport-to-bahrain")!;
export const D_MANAMA = routeFact("dammam-to-manama")!;
export const KH_MANAMA = routeFact("alkhobar-to-manama")!;
export const D_DOHA = routeFact("dammam-to-doha")!;
export const D_RIYADH = routeFact("dammam-to-riyadh")!;
export const D_KUWAIT = routeFact("dammam-to-kuwait")!;

const REF = "\n(ref: dammam-hub)";

export const DAMMAM_FACTS: { label: string; value: string }[] = [
  { label: "DMM Airport → Dhahran", value: `${DMM_DHAHRAN.km} km · ${DMM_DHAHRAN.time}` },
  { label: "DMM Airport → Jubail", value: `${DMM_JUBAIL.km} km · ${DMM_JUBAIL.time}` },
  { label: "Dammam → Manama", value: `${D_MANAMA.km} km · ${D_MANAMA.time}` },
  { label: "Dammam → Riyadh", value: `${D_RIYADH.km} km · ${D_RIYADH.time}` },
  { label: "Flights", value: "We track your flight" },
  { label: "Drivers", value: "English- & Arabic-speaking" },
  { label: "Cancellation", value: "Free up to 24 hours before" },
  { label: "Companies", value: "Invoicing via our sister company" },
];

/* ─── Hub: trip-type selector ───────────────────────────────────────── */

export const DAMMAM_TRIPS: TripType[] = [
  {
    id: "airport",
    icon: "plane",
    label: "DMM Airport ↔ your hotel",
    short: "Dammam, Khobar, Dhahran, Jubail",
    answer: `King Fahd International Airport (DMM) sits north-west of the cities, so every arrival is a proper drive: Dhahran is about ${DMM_DHAHRAN.km} km (${DMM_DHAHRAN.time}), Jubail about ${DMM_JUBAIL.km} km, and Dammam and Al Khobar further than Dhahran. We track your flight, meet you at arrivals, and the fare is agreed before you land.`,
    send: ["Flight number", "Hotel or address (city and district)", "Passengers and large bags", "Return flight, if booking both ways"],
    href: "/airports/king-fahd-dammam",
    linkLabel: "King Fahd Airport (DMM) transfers",
    waPrefill: "Salam! DMM Airport transfer.\n• From: \n• To (Dammam / Khobar / Dhahran / Jubail): \n• Date & time: \n• Flight number: \n• Passengers & luggage: " + REF,
  },
  {
    id: "metro",
    icon: "hotel",
    label: "Across Dammam, Khobar & Dhahran",
    short: "Hotel, office, mall, Corniche",
    answer: "One pre-booked car for a single trip inside the metro — hotel to office, Dammam to a meeting in Al Khobar, an evening on the Corniche or a visit to Ithra in Dhahran. Give us both addresses and the time, and you get one fixed fare for the whole car.",
    send: ["Pickup address", "Drop-off address", "Date and time", "Passengers"],
    href: "#metro",
    linkLabel: "Dammam, Khobar and Dhahran areas",
    waPrefill: "Salam! Ride in the Dammam–Khobar–Dhahran area.\n• From: \n• To: \n• Date & time: \n• Passengers: \n• One-way or return: " + REF,
  },
  {
    id: "private-driver",
    icon: "clock",
    label: "Private driver by the hour",
    short: "Site visits, meetings, family days",
    answer: "A car and driver for a block of hours or a whole day — the driver waits while you are inside a meeting, a site visit or a mall. Useful when the day moves between Dammam, Al Khobar and Dhahran, or when you cannot predict when a meeting ends.",
    send: ["Date and start time", "Hours needed", "Rough list of stops", "Passengers"],
    href: "/locations/dammam/private-driver",
    linkLabel: "Private driver in Dammam & Al Khobar",
    waPrefill: "Salam! Private driver in the Eastern Province (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers: \n(ref: dammam-private-driver)",
  },
  {
    id: "bahrain",
    icon: "route",
    label: "Bahrain via the Causeway",
    short: `${D_MANAMA.km} km to Manama`,
    answer: `Dammam to Manama is about ${D_MANAMA.km} km over the King Fahd Causeway (${D_MANAMA.time}); from Al Khobar about ${KH_MANAMA.km} km. The causeway crossing fee for the vehicle is included in the fare. Each passenger carries their own passport and entry documents.`,
    send: ["Pickup address", "Bahrain destination", "Date and time", "Passengers and nationalities"],
    href: "/cross-border/saudi-to-bahrain",
    linkLabel: "Saudi Arabia to Bahrain by car",
    waPrefill: "Salam! Eastern Province → Bahrain transfer.\n• From: \n• To (Bahrain address): \n• Date & time: \n• Passengers & luggage: " + REF,
  },
  {
    id: "qatar",
    icon: "route",
    label: "Doha, Qatar by road",
    short: `${D_DOHA.km} km via Salwa`,
    answer: `Dammam to Doha is about ${D_DOHA.km} km by road through the Salwa border (${D_DOHA.time}). The vehicle's border fees are included in the quoted fare; visas and entry are each passenger's own.`,
    send: ["Pickup address", "Doha address", "Date and time", "Passengers and luggage"],
    href: "/routes/dammam-to-doha",
    linkLabel: "Dammam to Doha private car",
    waPrefill: "Salam! Dammam → Doha transfer.\n• From: \n• To (Doha address): \n• Date & time: \n• Passengers & luggage: " + REF,
  },
  {
    id: "riyadh",
    icon: "route",
    label: "Riyadh & other cities",
    short: `${D_RIYADH.km} km to Riyadh`,
    answer: `Dammam to Riyadh is about ${D_RIYADH.km} km (${D_RIYADH.time}) — door to door, one fare for the whole car. Jeddah, Makkah, Kuwait and the UAE are booked the same way.`,
    send: ["Pickup address", "Destination", "Date and time", "Passengers and bags"],
    href: "/routes/dammam-to-riyadh",
    linkLabel: "Dammam to Riyadh private transfer",
    waPrefill: "Salam! Intercity trip from Dammam.\n• To (Riyadh / Jeddah / other): \n• Date & time: \n• Passengers & luggage: " + REF,
  },
  {
    id: "jubail",
    icon: "briefcase",
    label: "Jubail & industrial sites",
    short: `${DMM_JUBAIL.km} km from DMM`,
    answer: `Jubail Industrial City is about ${DMM_JUBAIL.km} km from DMM (${DMM_JUBAIL.time}). Visitors to plants or offices there share the company and site name when booking, so the pickup and drop-off point is agreed in advance.`,
    send: ["Company and site name", "Pickup point", "Date and time", "Passengers"],
    href: "/locations/jubail",
    linkLabel: "Jubail private transfers",
    waPrefill: "Salam! Jubail transfer.\n• From: \n• To (company / site): \n• Date & time: \n• Passengers: " + REF,
  },
  {
    id: "corporate",
    icon: "briefcase",
    label: "Corporate & visiting teams",
    short: "Written quote by email",
    answer: `Visiting teams, contractors and event groups get one written quote by email for all the trips and dates, with vehicles from executive sedans to coasters through our partner network. ${CORPORATE_INVOICE_LINE}`,
    send: ["Company name", "Dates and trip list", "Passengers per trip", "Whether you need an invoice"],
    href: "/services/corporate",
    linkLabel: "Corporate transportation",
    waPrefill: "Salam! Corporate transport in the Eastern Province.\n• Company: \n• Dates & trips: \n• Passengers per trip: \n• Invoice needed?: " + REF,
  },
];

/* ─── Hub: the metro (areas we serve) ───────────────────────────────── */

export const DAMMAM_AREAS: { href: string; name: string; nameAr: string; what: string }[] = [
  { href: "/locations/alkhobar", name: "Al Khobar", nameAr: "الخبر", what: "Corniche, Water Tower, hotels and the road to the Bahrain causeway" },
  { href: "/locations/dhahran", name: "Dhahran", nameAr: "الظهران", what: "Saudi Aramco HQ area, KFUPM, Dhahran Techno Valley and Ithra" },
  { href: "/locations/jubail", name: "Jubail", nameAr: "الجبيل", what: `Industrial City I & II, about ${DMM_JUBAIL.km} km from DMM` },
  { href: "/locations/dammam/qatif", name: "Qatif", nameAr: "القطيف", what: "The coastal city north of Dammam" },
  { href: "/locations/dammam/half-moon-bay", name: "Half Moon Bay", nameAr: "شاطئ نصف القمر", what: "Beach resorts south of Al Khobar — a day trip with a timed return" },
  { href: "/locations/dammam/dhahran", name: "Dhahran visitor pickups", nameAr: "الظهران", what: "Gate and building pickups for visitors" },
];

/* ─── Hub: corridor board (every slug is a real route page) ─────────── */

export const DAMMAM_CORRIDORS: { slug: string; label: string; note: string }[] = [
  { slug: "dammam-airport-to-dhahran", label: "DMM Airport → Dhahran", note: "The shortest airport run in the Eastern Province." },
  { slug: "dammam-airport-to-jubail", label: "DMM Airport → Jubail", note: "Arrivals heading straight to Jubail Industrial City." },
  { slug: "jubail-to-dammam-airport", label: "Jubail → DMM Airport", note: "Departure leg, worked back from your flight time." },
  { slug: "dammam-to-manama", label: "Dammam → Manama, Bahrain", note: "Over the King Fahd Causeway; vehicle crossing fee included." },
  { slug: "manama-to-dammam", label: "Manama → Dammam", note: "The return across the causeway." },
  { slug: "dammam-to-doha", label: "Dammam → Doha, Qatar", note: "By road through the Salwa border." },
  { slug: "doha-to-dammam", label: "Doha → Dammam", note: "From Doha back to the Eastern Province." },
  { slug: "dammam-to-riyadh", label: "Dammam → Riyadh", note: "Door to door to the capital." },
  { slug: "riyadh-to-dammam", label: "Riyadh → Dammam", note: "From any Riyadh address to the Eastern Province." },
  { slug: "dammam-to-kuwait", label: "Dammam → Kuwait City", note: "North along the coast to the Kuwait border." },
  { slug: "dammam-to-dubai", label: "Dammam → Dubai", note: "A long GCC drive with stops planned in advance." },
  { slug: "dammam-to-abudhabi", label: "Dammam → Abu Dhabi", note: "Cross-border to the UAE capital." },
  { slug: "dammam-to-jeddah", label: "Dammam → Jeddah", note: "Coast to coast across the Kingdom." },
  { slug: "jeddah-to-dammam", label: "Jeddah → Dammam", note: "The reverse cross-Kingdom drive." },
  { slug: "dammam-to-makkah", label: "Dammam → Makkah", note: "For Umrah travellers starting in the east." },
];

/* ─── Hub: vehicle fit ──────────────────────────────────────────────── */

export const DAMMAM_VEHICLE_FIT = [
  { id: "sedan", label: "Sedan", fleetSlug: "toyota-camry", forWho: "One to three people with normal luggage", href: "/fleet/toyota-camry" },
  { id: "suv", label: "GMC / full-size SUV", fleetSlug: "gmc-yukon-xl", forWho: "Families, or a team with laptop bags and suitcases", href: "/fleet/gmc-yukon-xl" },
  { id: "staria", label: "Hyundai Staria", fleetSlug: "hyundai-staria", forWho: "Small groups travelling together", href: "/fleet/hyundai-staria" },
  { id: "hiace", label: "Toyota Hiace", fleetSlug: "toyota-hiace", forWho: "Crews and larger groups with equipment or luggage", href: "/fleet/toyota-hiace" },
  { id: "coaster", label: "Toyota Coaster", fleetSlug: "toyota-coaster", forWho: "Delegations and event groups", href: "/fleet/toyota-coaster" },
  { id: "luxury", label: "Mercedes S-Class", fleetSlug: "mercedes-s-class", forWho: "VIP guests and senior visitors", href: "/fleet/mercedes-s-class" },
];

/* ─── Hub: timing ───────────────────────────────────────────────────── */

export const DAMMAM_TIMING = [
  { title: "The airport is outside the cities", body: `DMM is north-west of the metro: about ${DMM_DHAHRAN.km} km to Dhahran, further to Dammam and Al Khobar. For departures, plan the pickup from your flight time, not from a city-centre habit.` },
  { title: "Causeway at weekends and holidays", body: "The King Fahd Causeway can be slow at weekends and on public holidays. Allow extra time for Bahrain trips and for flights booked straight after a crossing." },
  { title: "Site and campus gates", body: "Saudi Aramco, KFUPM and Jubail industrial sites control entry. Send the host company, gate or building when you book, so the meeting point is agreed in advance." },
  { title: "Corniche evenings", body: "The Dammam and Al Khobar corniches fill up on weekend evenings. A timed return or a driver who waits saves looking for a ride at closing time." },
  { title: "Summer heat and humidity", body: "From late spring to early autumn the Gulf coast is hot and humid. Plan beach and outdoor stops for the morning or after sunset, with the car close by." },
  { title: "Ramadan hours", body: "In Ramadan, traffic shifts towards the evening after iftar. Book evening trips in advance and allow more time on main roads." },
];

/* ─── Hub: honest comparison — private car vs train ─────────────────── */

export const CAR_VS_TRAIN = [
  { point: "Door to door", car: "Yes — hotel, office or home at both ends", train: "Station to station; a ride is needed at each end" },
  { point: "Luggage", car: "All bags in one vehicle, loaded with the driver's help", train: "Carried through the stations" },
  { point: "Family or team", car: "One fare for the whole car", train: "A ticket per person" },
  { point: "Timetable", car: "Leave when you are ready, 24/7", train: "Fixed departures" },
  { point: "Where it goes", car: "Anywhere — including Bahrain, Qatar and Kuwait", train: "Its own stations only" },
];

/* ─── Hub: visitor guide, booking, FAQ ──────────────────────────────── */

export const DAMMAM_VISITOR_GUIDE = [
  { q: "Are Dammam, Al Khobar and Dhahran one area?", a: "They form one connected metro on the Gulf coast, with Dhahran between Dammam and Al Khobar. Give us the city and the district of both addresses — a hotel on the Khobar Corniche and an office in Dammam are a real drive apart." },
  { q: "How do I get from DMM Airport to my hotel?", a: `Book a private car before you fly. We track the flight, meet you at arrivals and drive you to the hotel; Dhahran is about ${DMM_DHAHRAN.km} km from the airport, and Dammam and Al Khobar are further.` },
  { q: "Can I go to Bahrain for the day?", a: `Yes. Dammam to Manama is about ${D_MANAMA.km} km over the causeway. Book it as a return trip; the vehicle crossing fee is included, and each passenger carries their own documents.` },
  { q: "I am visiting Saudi Aramco or KFUPM — what do I send?", a: "The host company or department, the gate or building name and your meeting time. We do not arrange site access — your host does — but the driver plans the pickup and drop-off point from those details." },
  { q: "Is a private car better than an app ride here?", a: "For one short hop, an app ride is fine. A pre-booked car is the better fit for airport arrivals, early starts, Bahrain or Qatar trips, a family with luggage, or a day with several stops — the fare is agreed before you travel." },
  { q: "How do I pay?", a: "Cash to the driver or bank transfer. An electronic receipt is available on request." },
];

export const DAMMAM_BOOKING_STEPS = [
  { title: "Send your trip", desc: "Form or WhatsApp: both addresses, date, passengers, luggage, and your flight number for airport trips." },
  { title: "Agree one fare", desc: "We reply with the vehicle and one fixed fare, usually within 1–2 hours — no meter, no surge." },
  { title: "Driver details", desc: "Name and vehicle details arrive before pickup. We track your flight." },
  { title: "Ride & pay", desc: `${FREE_WAIT} free waiting. Pay cash or by bank transfer.` },
];

export const DAMMAM_HUB_FAQS: { question: string; answer: string; category: string }[] = [
  { category: "Booking", question: "How do I book a private taxi in Dammam?", answer: "Send the pickup, drop-off, date, passengers and luggage by the form or on WhatsApp. We reply with the vehicle and one fixed fare, usually within 1–2 hours, before anything is booked — no meter and no surge." },
  { category: "In the city", question: "Can I book a single ride inside Dammam or to Al Khobar?", answer: "Yes. A one-way or return trip between any two addresses in Dammam, Al Khobar or Dhahran — hotel, office, mall, the Corniche or Ithra — is booked the same way, with one fare for the whole car." },
  { category: "Airport", question: "Do you do King Fahd Airport (DMM) pickups?", answer: `Yes, 24/7. We track your flight, meet you at arrivals and the first ${FREE_WAIT} of waiting are free. Dhahran is about ${DMM_DHAHRAN.km} km from DMM and Jubail about ${DMM_JUBAIL.km} km.` },
  { category: "Hourly", question: "Can I hire a driver by the hour in Dammam or Al Khobar?", answer: "Yes. Book a car and driver for a block of hours or a full day — the driver waits between stops. Send the date, start time, hours and rough stops, and the fare is agreed before booking." },
  { category: "Bahrain", question: "Can you take us from Dammam or Al Khobar to Bahrain?", answer: `Yes. Dammam to Manama is about ${D_MANAMA.km} km and Al Khobar to Manama about ${KH_MANAMA.km} km over the King Fahd Causeway. The vehicle's crossing fee is included; passengers bring their own passports and entry documents.` },
  { category: "Qatar", question: "Can I go from Dammam to Doha by car?", answer: `Yes. It is about ${D_DOHA.km} km through the Salwa border. The vehicle's border fees are included in the fare; visas and entry are each passenger's own.` },
  { category: "Business", question: "Can you pick up visitors for Aramco, KFUPM or Jubail sites?", answer: "Yes — send the host company, gate or building and the meeting time. Site access is arranged by your host; the driver uses those details to plan the pickup point. We are not affiliated with any of these organisations." },
  { category: "Corporate", question: "Can my company get a written quote and invoice?", answer: `Yes. Email the trips, dates and passengers for a written quote. ${CORPORATE_INVOICE_LINE}` },
  { category: "Vehicles", question: "Which cars are available in the Eastern Province?", answer: "Sedans, full-size SUVs such as the GMC Yukon XL, vans, coasters and luxury cars including the Mercedes S-Class are available through our partner network. The exact vehicle is confirmed for your date and group size when we quote." },
  { category: "Booking", question: "Can I cancel or change a booking?", answer: "Yes. Cancellation is free up to 24 hours before pickup, and changes to the time or address can be made on WhatsApp." },
  { category: "Booking", question: "Do the drivers speak English?", answer: "Yes. Drivers in our partner network speak English and Arabic, and trips run 24 hours a day." },
  { category: "Payment", question: "How do I pay?", answer: "Cash to the driver or bank transfer. An electronic receipt is available on request." },
];

export const DAMMAM_GUIDES = [
  { href: "/blog/eastern-province-corporate-visitor-transport-guide", label: "Eastern Province business visitor transport" },
  { href: "/blog/riyadh-to-dammam-taxi-price-train-or-flight", label: "Riyadh to Dammam: taxi, train or flight" },
  { href: "/blog/saudi-arabia-business-travel-transportation-guide", label: "Business travel transport in Saudi Arabia" },
  { href: "/distance/riyadh-to-dammam", label: "Riyadh to Dammam distance & drive time" },
  { href: "/cross-border/saudi-to-qatar", label: "Eastern Province to Qatar by car" },
  { href: "/services/vip-transportation", label: "VIP transportation" },
  { href: "/services/car-recovery/dammam", label: "Dammam car recovery & tow truck (satha)" },
];

/* ─── Child page: private driver ────────────────────────────────────── */

export const DAMMAM_PAGES: Record<string, ClusterPage> = {
  "private-driver": {
    slug: "private-driver",
    kind: "service",
    name: "Private Driver",
    nameAr: "سائق خاص",
    title: "Private Driver in Dammam & Al Khobar | Hourly & Full-Day Chauffeur",
    metaDescription: "Hire a private driver in Dammam, Al Khobar or Dhahran by the hour or full day — site visits, meetings, family days and DMM airport legs. Fare agreed first.",
    h1: "Private Driver & Chauffeur Service in Dammam, Al Khobar and Dhahran",
    eyebrow: "Car with driver · Eastern Province",
    intro: `A private driver in the Eastern Province is one car and chauffeur for the hours you book, moving with you between Dammam, Al Khobar and Dhahran — a site visit in the morning, a meeting on the Khobar side after lunch, dinner on the Corniche. The driver waits while you are inside, so you never re-book a ride. The ${FREE_WAIT} free-waiting rule is for one-way transfers; on hourly hire, waiting is what the hours are for.`,
    facts: [
      { label: "Covers", value: "Dammam · Al Khobar · Dhahran" },
      { label: "Typical day", value: "Site visit, meetings, airport leg" },
      { label: "DMM → Dhahran", value: `${DMM_DHAHRAN.km} km · ${DMM_DHAHRAN.time}` },
      { label: "Booked as", value: "Hours or a full day" },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Who books a driver here",
        heading: "Three kinds of Eastern Province day",
        items: [
          { title: "The site-visit day", body: "A morning at a Dhahran office or campus, lunch in Al Khobar, a second appointment in Dammam — the car is outside each time you come out, with your laptop bag still in the boot." },
          { title: "The visiting-team day", body: "Two or three colleagues moving between the hotel, client offices and an evening flight from DMM, in one SUV with one driver." },
          { title: "The family weekend day", body: "Ithra in the morning, a mall in Al Khobar, then the Corniche at sunset — children, grandparents and shopping in one car." },
        ],
      },
      {
        type: "timeline",
        eyebrow: "Sample day",
        heading: "A business day across the metro with one driver",
        intro: "An example only — the stops and times are yours.",
        items: [
          { time: "07:30", title: "Hotel pickup in Al Khobar", desc: "Early start to beat the morning traffic." },
          { time: "08:30", title: "Appointment in Dhahran", desc: "You give the gate or building; the car waits nearby." },
          { time: "12:30", title: "Lunch on the Khobar side", desc: "Message the driver when you are ready." },
          { time: "14:30", title: "Meeting in Dammam", desc: "Pickup point agreed in advance." },
          { time: "18:00", title: "DMM Airport", desc: "Your bags have been in the car all day." },
        ],
      },
      {
        type: "compare",
        heading: "One driver for the day, or a ride for each leg?",
        intro: "The three cities are close on the map but spread out in practice, and the airport is outside all of them. The more legs and the less predictable the finish times, the more a driver makes sense.",
        options: [
          { title: "A ride for each leg", tone: "ink", when: ["One meeting and straight back to the hotel", "All stops in one city", "Finish times you know in advance"] },
          { title: "One driver for the day", tone: "green", when: ["Stops in two or three of the cities", "A gate or campus where finding a pickup is awkward", "An airport run at the end of the day"] },
        ],
      },
      {
        type: "vehicles",
        heading: "Which car for an Eastern Province day",
        intro: "Business visitors mostly book an executive sedan or an SUV; families take the vans. All models come through our partner network, and the car available on your date is confirmed with the quote.",
        items: [
          { tier: "Executive sedan", models: ["genesis-g80", "toyota-camry"], bestFor: "One or two people with meetings between Dhahran, Al Khobar and Dammam.", waPrefill: "Salam! Private driver in Dammam / Khobar — executive sedan (Genesis G80 / Toyota Camry).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers: \n(ref: dammam-private-driver)" },
          { tier: "Full-size SUV", models: ["gmc-yukon-xl", "cadillac-escalade"], bestFor: "A visiting team of up to seven, or a day that ends at DMM with luggage.", waPrefill: "Salam! Private driver in Dammam / Khobar — full-size SUV (GMC Yukon XL / Cadillac Escalade).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers & bags: \n(ref: dammam-private-driver)" },
          { tier: "Luxury sedan", models: ["mercedes-s-class", "bmw-7-series"], bestFor: "A senior visitor or VIP guest you are hosting for the day.", waPrefill: "Salam! Private driver in Dammam / Khobar — luxury sedan (Mercedes S-Class / BMW 7 Series).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers: \n(ref: dammam-private-driver)" },
          { tier: "Family or group van", models: ["mercedes-v-class", "hyundai-staria"], bestFor: "A family weekend between Ithra, the malls and the Corniche.", waPrefill: "Salam! Private driver in Dammam / Khobar — van (Mercedes V-Class / Hyundai Staria).\n• Date & start time: \n• Hours needed: \n• Stops planned: \n• Passengers (adults / children): \n(ref: dammam-private-driver)" },
        ],
      },
      {
        type: "table",
        heading: "Hourly hire in the Eastern Province: what you can book",
        columns: ["Use", "How it is booked"],
        rows: [
          ["Dhahran site or campus visit", "Hours plus the gate or building name; your host arranges access"],
          ["Meetings across the metro", "Start time, hours and the addresses you know"],
          ["Jubail day", `Full-day hire — Jubail is about ${DMM_JUBAIL.km} km from DMM`],
          ["Team or delegation", "Written quote by email; corporate invoicing on request"],
        ],
      },
    ],
    ctaHeading: "Request a private driver in the Eastern Province",
    ctaBody: "Send the first pickup, the cities and buildings you need to reach, any gate names, and how many hours. We reply with the car and one fare for the whole block.",
    ctaLabel: "Request a Private Driver",
    waPrefill: "Salam! Private driver in the Eastern Province (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops (Dammam / Khobar / Dhahran): \n• Passengers: \n• Vehicle (Executive sedan / SUV / Luxury / Van): \n(ref: dammam-private-driver)",
    form: { pickup: "Dammam", vehicle: "Sedan", tripType: "By the Hour" },
    pathB: { heading: "Drivers for a visiting team or contractors?", body: `Send the dates, people and sites by email and the cars come back on one written quote. ${CORPORATE_INVOICE_LINE}`, emailSubject: "Private driver RFQ — Dammam / Al Khobar", emailBody: corpEmail("a private driver / hourly hire in Dammam, Al Khobar and Dhahran") },
    faqs: [
      { question: "How much is a private driver in Dammam or Al Khobar?", answer: "The fare depends on the vehicle, the hours and how far the day travels — a day inside Al Khobar is different from one that ends in Jubail. Send your plan on WhatsApp and we reply with one fixed fare for the whole block, usually within 1–2 hours." },
      { question: "Can one driver cover Dammam, Al Khobar and Dhahran in the same day?", answer: "Yes — that is the usual reason to book one. The driver moves with you between the three cities and waits at each stop. Give us the addresses you already know so the order of stops can be planned." },
      { question: "Can the driver wait outside an Aramco or KFUPM gate?", answer: "The driver waits as near as is permitted. Site access is arranged by your host, not by us, so send the host company and the gate or building name, and the meeting point is agreed before the day." },
      { question: "Can the day end at DMM Airport?", answer: `Yes. Keep your bags in the car and finish at King Fahd International Airport. Dhahran is about ${DMM_DHAHRAN.km} km from DMM; tell us your flight time and we plan the last leg back from it.` },
      { question: "Can we add a Bahrain trip to the day?", answer: `A Bahrain crossing is booked as its own cross-border transfer rather than as hourly hire. Dammam to Manama is about ${D_MANAMA.km} km; ask for both in one message and we quote them together.` },
      { question: "Which cars can I book with a driver here?", answer: "Executive sedans such as the Genesis G80, full-size SUVs like the GMC Yukon XL, luxury sedans including the Mercedes S-Class and BMW 7 Series, and vans such as the Mercedes V-Class — through our partner network, confirmed for your date when we quote." },
    ],
    related: [
      { href: "/locations/dammam", label: "Private transport in Dammam", desc: "Airport, metro, Bahrain and intercity" },
      { href: "/locations/alkhobar", label: "Al Khobar", desc: "Corniche and causeway side" },
      { href: "/locations/dhahran", label: "Dhahran", desc: "Aramco HQ area, KFUPM and Ithra" },
      { href: "/airports/king-fahd-dammam", label: "DMM airport transfers", desc: "A single trip to or from King Fahd Airport" },
      { href: "/services/corporate", label: "Corporate transportation", desc: "Written quotes for companies" },
    ],
    schema: { serviceType: "Hourly & full-day chauffeur hire" },
  },
};

/* ─── Child pages: Qatif + Half Moon Bay (added 2026-11-21) ──────────────
 * Both were thin old-template pages (273 / 296 words, "Discovered – not
 * indexed", 0 impressions), so title/H1 could be improved (rule 3 applies to
 * ranking pages only). No distances: neither trip is in routes.ts. Place
 * facts kept to well-established geography (Tarout Island and its castle,
 * Saihat and Safwa in Qatif governorate; Half Moon Bay on the coast south of
 * Al Khobar). */
DAMMAM_PAGES["qatif"] = {
  slug: "qatif",
  kind: "district",
  name: "Qatif",
  nameAr: "القطيف",
  title: "Qatif Taxi & Private Transfers | Tarout, Dammam & DMM Airport",
  metaDescription: "Pre-booked private car in Qatif — Tarout Island, Saihat and Safwa, rides to Dammam and Al Khobar, DMM airport pickups and Bahrain trips. Fare agreed before booking.",
  h1: "Private Taxi & Transfers in Qatif",
  eyebrow: "Qatif · North of Dammam · Gulf coast",
  intro: "Qatif is the coastal governorate just north of Dammam, taking in Tarout Island, Saihat and Safwa. A pre-booked private car covers the trips people actually make from here: into Dammam or Al Khobar for work and shopping, to King Fahd Airport (DMM) for a flight, over to Bahrain, or a visit to Tarout Castle — with one fare agreed before you travel.",
  facts: [
    { label: "Covers", value: "Qatif city, Tarout, Saihat, Safwa" },
    { label: "Common trips", value: "Dammam, Khobar, DMM, Bahrain" },
    { label: "Drivers", value: "English & Arabic, 24/7" },
    { label: "Cancellation", value: "Free up to 24h before" },
  ],
  blocks: [
    {
      type: "cards",
      eyebrow: "Trips from Qatif",
      heading: "Where people go from Qatif",
      items: [
        { title: "Into Dammam and Al Khobar", body: "Offices, hospitals, malls and the Khobar Corniche are a drive south. Give both addresses with the district and you get one fare for the car." },
        { title: "DMM Airport", body: "Pickups for departures and arrivals at King Fahd International Airport, with flight tracking on the arrival leg and meet & greet." },
        { title: "Tarout Island", body: "Tarout is joined to Qatif by road. Book a drive to Tarout Castle and the old quarter with a timed return, or keep the car if you are combining stops." },
      ],
    },
    {
      type: "compare",
      heading: "From Qatif: a single trip or a driver for the day?",
      intro: "Qatif to the Khobar side is a real drive, so a return trip often needs waiting time.",
      options: [
        { title: "Single trip", tone: "ink", when: ["Airport run or a one-way move", "You are staying at the destination", "No waiting needed"] },
        { title: "Driver by the hour", tone: "green", when: ["Appointments in Dammam and back the same day", "Several stops across the metro", "Family visits with elders or children"] },
      ],
    },
    {
      type: "checklist",
      heading: "What to send for a Qatif quote",
      items: [
        "Pickup area — Qatif city, Tarout, Saihat, Safwa or elsewhere",
        "Drop-off address with the city and district",
        "Date and time, and whether you need the return",
        "Passengers and large bags",
        "Flight number for airport trips",
      ],
    },
  ],
  ctaHeading: "Request a car from Qatif",
  ctaBody: "Send the pickup area in Qatif, where you are going and when. We reply with the vehicle and one fixed fare, usually within 1–2 hours.",
  ctaLabel: "Request a Qatif Quote",
  waPrefill: "Salam! Private car from Qatif.\n• Pickup (Qatif / Tarout / Saihat / Safwa): \n• To: \n• Date & time: \n• Passengers & luggage: \n• Return needed?: \n(ref: dammam-qatif)",
  form: { pickup: "Qatif", vehicle: "Sedan", tripType: "One Way" },
  faqs: [
    { question: "Can I book a private car from Qatif to Dammam or Al Khobar?", answer: "Yes. Send both addresses with the district and the time; you get one fixed fare for the car, agreed before booking, and the return can be added." },
    { question: "Do you pick up from Tarout, Saihat and Safwa?", answer: "Yes — anywhere in the Qatif area. Give the district or a nearby landmark so the driver plans the pickup point." },
    { question: "Can I get a car from Qatif to King Fahd Airport?", answer: "Yes, for departures and arrivals. On arrivals we track your flight, meet you at arrivals and the first 15–30 minutes of waiting are free." },
    { question: "Can I go from Qatif to Bahrain?", answer: "Yes, over the King Fahd Causeway. The vehicle's crossing fee is included in the fare; each passenger carries their own passport and entry documents." },
    { question: "How do I pay?", answer: "Cash to the driver or bank transfer, with an electronic receipt on request." },
  ],
  related: [
    { href: "/locations/dammam", label: "Dammam & Eastern Province", desc: "The hub for the whole metro" },
    { href: "/locations/alkhobar", label: "Al Khobar", desc: "Corniche and the causeway side" },
    { href: "/locations/dammam/private-driver", label: "Private driver", desc: "Hourly hire across the metro" },
    { href: "/airports/king-fahd-dammam", label: "DMM Airport", desc: "Arrivals and departures" },
    { href: "/cross-border/saudi-to-bahrain", label: "Bahrain by car", desc: "Over the King Fahd Causeway" },
    { href: "/book", label: "Book online", desc: "The full booking form" },
  ],
  schema: { serviceType: "Private transfer service", place: { name: "Qatif", type: "Place", description: "Coastal governorate north of Dammam in Saudi Arabia's Eastern Province, including Tarout Island, Saihat and Safwa." } },
};

DAMMAM_PAGES["half-moon-bay"] = {
  slug: "half-moon-bay",
  kind: "attraction",
  name: "Half Moon Bay",
  nameAr: "شاطئ نصف القمر",
  title: "Half Moon Bay Transfers | Private Car from Al Khobar & Dammam",
  metaDescription: "Private car to Half Moon Bay beach and resorts — from Al Khobar, Dammam, Dhahran or DMM Airport, with a timed return or a driver who waits. Fare agreed first.",
  h1: "Private Car to Half Moon Bay",
  eyebrow: "Half Moon Bay · Gulf coast south of Al Khobar",
  intro: "Half Moon Bay is the stretch of beaches, chalets and resorts on the Gulf coast south of Al Khobar. A pre-booked private car takes you there from a hotel in Khobar, Dammam or Dhahran — or straight from DMM Airport to a resort — and brings you back at the time you choose, so nobody is left looking for a ride from the beach at sunset.",
  facts: [
    { label: "Where", value: "Coast south of Al Khobar" },
    { label: "Booked as", value: "Timed return or hourly" },
    { label: "From", value: "Khobar, Dammam, Dhahran, DMM" },
    { label: "Free waiting", value: "15–30 min on transfers" },
  ],
  blocks: [
    {
      type: "steps",
      heading: "How a Half Moon Bay day works",
      items: [
        { title: "Pick the times", desc: "Tell us when you want to leave the hotel and when you want to be collected." },
        { title: "Name the beach or resort", desc: "Half Moon Bay has many chalets and resorts — the exact name sets the drop-off point." },
        { title: "Agree one fare", desc: "There and back, or the car for the whole day — one fixed fare before booking." },
        { title: "Collected on time", desc: "The driver returns at the agreed time; message on WhatsApp if your plans move." },
      ],
    },
    {
      type: "compare",
      heading: "Timed return or keep the car for the day?",
      intro: "Most families book a timed return. Keep the car if the day has more than one stop.",
      options: [
        { title: "There and back", tone: "ink", when: ["One beach or resort all day", "You know your return time", "Lowest total for a simple day"] },
        { title: "Car for the day", tone: "green", when: ["Beach, then lunch elsewhere, then the Corniche", "Return time that depends on the weather or the children", "Bags and beach gear stay in the car"] },
      ],
    },
    {
      type: "checklist",
      heading: "Before you go",
      items: [
        "From late spring to early autumn the coast is hot and humid — morning or late afternoon is easier",
        "Weekends are busiest; book the return time in advance",
        "Resort and chalet entry is your own booking — we provide the transport",
        "Families with beach gear or a cool box: ask for an SUV or van",
      ],
    },
  ],
  ctaHeading: "Book a car to Half Moon Bay",
  ctaBody: "Send the pickup, the beach or resort name, and your times there and back. We reply with the car and one fixed fare.",
  ctaLabel: "Request a Half Moon Bay Quote",
  waPrefill: "Salam! Private car to Half Moon Bay.\n• Pickup (hotel / area): \n• Beach / resort: \n• Date & time there: \n• Return time: \n• Passengers: \n(ref: dammam-half-moon-bay)",
  form: { pickup: "Al Khobar", dropoff: "Half Moon Bay", vehicle: "VIP SUV", tripType: "Round Trip" },
  faqs: [
    { question: "Can you take us from Al Khobar to Half Moon Bay and back?", answer: "Yes. Book it as a round trip with a pickup time for the return, or keep the car for the day if you have more than one stop. The fare is agreed before booking." },
    { question: "Can we go straight from DMM Airport to a Half Moon Bay resort?", answer: "Yes. Give us the flight number and the resort name; we track the flight, meet you at arrivals and drive you to the resort." },
    { question: "Do you arrange the resort or chalet booking?", answer: "No — that is booked directly with the resort. We provide the private transport there and back." },
    { question: "Which car for a family beach day?", answer: "A GMC Yukon XL or a van such as the Hyundai Staria gives room for beach gear and children; the car is confirmed for your date when we quote." },
  ],
  related: [
    { href: "/locations/alkhobar", label: "Al Khobar", desc: "The closest city to Half Moon Bay" },
    { href: "/locations/dammam", label: "Dammam & Eastern Province", desc: "All trips across the metro" },
    { href: "/locations/dammam/private-driver", label: "Private driver", desc: "Keep the car for the day" },
    { href: "/airports/king-fahd-dammam", label: "DMM Airport", desc: "Arrive and go straight to the beach" },
    { href: "/book", label: "Book online", desc: "The full booking form" },
  ],
  schema: { serviceType: "Private transfer service", place: { name: "Half Moon Bay", type: "TouristAttraction", description: "Beaches, chalets and resorts on the Gulf coast south of Al Khobar, Eastern Province, Saudi Arabia." } },
};

export const DAMMAM_CHILD_NAV: { slug: string; label: string }[] = [
  { slug: "private-driver", label: "Private driver" },
  { slug: "qatif", label: "Qatif" },
  { slug: "half-moon-bay", label: "Half Moon Bay" },
  { slug: "dhahran", label: "Dhahran visitors" },
];

export const DAMMAM_CITY: ClusterCity = { slug: "dammam", name: "Dammam", nav: DAMMAM_CHILD_NAV };
