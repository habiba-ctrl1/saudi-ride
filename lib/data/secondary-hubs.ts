// NEOM, Tabuk and Yanbu hubs (Sprint 3, built 2026-11-21 from
// seo/sprint3-secondary-cities-plan.md). Rendered by RegionalHub.tsx.
//
// Truth rules (CLAUDE.md §2, §14, §16, §17):
// - Distances only via routeFact() (routes.ts). The old pages' "TUU ~7 km",
//   "Wadi Disah ~85 km", "Tayma ~90 km", "Halat Ammar ~110 km", "YNB ~12 km",
//   "Industrial City 15 km" had no source and are not used.
// - NEOM: only NEOM Bay / Sharma, Magna and Oxagon are confirmed reference
//   points (facts.md 2026-10-03). Other NEOM sites (The Line, Trojena,
//   Sindalah) are NOT claimed — "send the location, we confirm first".
// - Jordan (facts.md): shortest crossing — Halat Ammar–Al Mudawwara for Amman,
//   Petra, Wadi Rum; Al Durrah (Haql) for Aqaba and the NEOM coast. Vehicle
//   border fees included; Jordan partner covers all of Jordan; a cheaper
//   drop at the Saudi side of the border is available (not on Bahrain).
// - Car-rental searches land on these pages (GSC): we say plainly that we
//   arrange a car WITH a driver, not self-drive rental.
// - Titles/H1s unchanged (rule 3): NEOM pos 8.5, Tabuk 13.9, Yanbu 26.4.
import { routeFact, CORPORATE_INVOICE_LINE } from "@/lib/data/cluster";
import type { RegionalHubConfig } from "@/lib/data/eastern-hubs";

const FREE_WAIT = "15–30 minutes";
const TUU_NEOM = routeFact("tabuk-airport-to-neom")!;
const TB_AQABA = routeFact("tabuk-to-aqaba")!;
const TB_AMMAN = routeFact("tabuk-to-amman")!;
const TB_PETRA = routeFact("tabuk-to-petra")!;
const TB_RUM = routeFact("tabuk-to-wadi-rum")!;
const TB_RSI = routeFact("tabuk-to-red-sea-airport")!;
const MD_TABUK = routeFact("madinah-to-tabuk")!;
const NM_AQABA = routeFact("neom-to-aqaba")!;
const NM_AMMAN = routeFact("neom-to-amman")!;
const NM_ALULA = routeFact("neom-to-alula")!;
const RSI_NEOM = routeFact("red-sea-airport-to-neom")!;
const HQ_AQABA = routeFact("haql-to-aqaba")!;
const MD_YANBU = routeFact("madinah-to-yanbu")!;
const JD_YANBU = routeFact("jeddah-to-yanbu")!;
const MK_YANBU = routeFact("makkah-to-yanbu")!;

const NO_RENTAL = "We do not rent self-drive cars — every booking is a car with a professional driver.";
const rfq = (city: string, trips: string) =>
  `Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transportation in ${city}.\n\n• Company: \n• Contact name & role: \n• Dates: \n• Trips (${trips}): \n• Passengers per trip: \n• Vehicle (Executive sedan / SUV / Van / Coaster): \n• Invoice needed?: \n\nPlease confirm the fixed fare before booking.\n\nThank you.`;
const NW_PARENT = { name: "Tabuk & the north-west", href: "/locations/tabuk" };

/* ═══ NEOM ════════════════════════════════════════════════════════════ */

const NM = "\n(ref: neom-hub)";

export const NEOM_HUB: RegionalHubConfig = {
  slug: "neom",
  name: "NEOM",
  nameAr: "نيوم",
  geo: { lat: 27.9, lng: 35.3 },
  parent: NW_PARENT,
  eyebrow: "NEOM · Gulf of Aqaba coast",
  hero: { src: "/locations/neom-hero.webp", alt: "Architectural rendering of Oxagon, NEOM's planned port city on the Red Sea coast" },
  lede: `Pre-booked private cars and executive transfers for NEOM — from Tabuk Airport (about ${TUU_NEOM.km} km), Red Sea International or NEOM Bay, to Sharma, Magna and Oxagon, and on to Aqaba in Jordan.`,
  heroBullets: ["We track your flight", "Jordan border fees included", "English & Arabic drivers", "24/7"],
  ctaLabel: "Request a NEOM Transfer Quote",
  hubWa: "Salam! NEOM transfer enquiry.\n• From (TUU / RSI / NUM / other): \n• To (Sharma / Magna / Oxagon / other site): \n• Date & time: \n• Passengers & luggage: \n• Flight number: " + NM,
  shortAnswer: `Taxi Saudi Arabia arranges pre-booked private transfers for NEOM through a vetted partner network. Most visitors land at Tabuk Regional Airport (TUU), about ${TUU_NEOM.km} km (${TUU_NEOM.time}) from NEOM, or at Red Sea International (about ${RSI_NEOM.km} km). Confirmed points are NEOM Bay / Sharma, Magna and Oxagon; for other NEOM sites, send the location and we confirm first — site access is arranged by your host. Aqaba in Jordan is about ${NM_AQABA.km} km via the Al Durrah crossing.`,
  facts: [
    { label: "Tabuk Airport → NEOM", value: `${TUU_NEOM.km} km · ${TUU_NEOM.time}` },
    { label: "Red Sea Airport → NEOM", value: `${RSI_NEOM.km} km · ${RSI_NEOM.time}` },
    { label: "NEOM → Aqaba", value: `${NM_AQABA.km} km · ${NM_AQABA.time}` },
    { label: "Confirmed points", value: "Sharma, Magna, Oxagon" },
    { label: "Site access", value: "Arranged by your host" },
    { label: "Companies", value: "Invoicing via our sister company" },
  ],
  tripHeading: "What do you need around NEOM?",
  tripIntro: "Most NEOM trips start at an airport and end at a site or hotel — or go on to Jordan.",
  trips: [
    { id: "tuu", icon: "plane", label: "Tabuk Airport → NEOM", short: `${TUU_NEOM.km} km`, answer: `The main arrival route: about ${TUU_NEOM.km} km (${TUU_NEOM.time}) from TUU. We track the flight, meet you at arrivals, and the first ${FREE_WAIT} of waiting are free.`, send: ["Flight number", "NEOM destination (Sharma / Magna / Oxagon / other)", "Passengers and luggage"], href: "/routes/tabuk-airport-to-neom", linkLabel: "Tabuk Airport to NEOM transfer", waPrefill: "Salam! Tabuk Airport → NEOM.\n• Flight number: \n• NEOM destination: \n• Date & time: \n• Passengers & luggage: " + NM },
    { id: "rsi", icon: "plane", label: "Red Sea Airport → NEOM", short: `${RSI_NEOM.km} km`, answer: `From Red Sea International (RSI) the drive is about ${RSI_NEOM.km} km (${RSI_NEOM.time}) up the coast.`, send: ["Flight number", "NEOM destination", "Passengers"], href: "/routes/red-sea-airport-to-neom", linkLabel: "Red Sea Airport to NEOM", waPrefill: "Salam! Red Sea Airport → NEOM.\n• Flight number: \n• NEOM destination: \n• Date & time: \n• Passengers: " + NM },
    { id: "aqaba", icon: "route", label: "NEOM ↔ Aqaba, Jordan", short: `${NM_AQABA.km} km via Al Durrah`, answer: `NEOM to Aqaba is about ${NM_AQABA.km} km through the Al Durrah crossing near Haql. The vehicle's border fees are included; passengers bring their own passports and visas. Our Jordan partner can take you on door to door.`, send: ["NEOM pickup", "Aqaba address or airport", "Date and time", "Passengers and nationalities"], href: "/routes/neom-to-aqaba", linkLabel: "NEOM to Aqaba private car", waPrefill: "Salam! NEOM → Aqaba.\n• Pickup: \n• Aqaba address / airport: \n• Date & time: \n• Passengers: " + NM },
    { id: "amman", icon: "route", label: "NEOM → Amman", short: `${NM_AMMAN.km} km`, answer: `A long cross-border day, about ${NM_AMMAN.km} km (${NM_AMMAN.time}). Stops planned in advance; border fees for the vehicle included.`, send: ["Pickup", "Amman address", "Date", "Passengers"], href: "/routes/neom-to-amman", linkLabel: "NEOM to Amman", waPrefill: "Salam! NEOM → Amman.\n• Pickup: \n• Amman address: \n• Date & time: \n• Passengers: " + NM },
    { id: "site", icon: "briefcase", label: "Site visits & business days", short: "Host arranges access", answer: "Contractors, consultants and visiting teams send the site and the access details their host gave them. We plan the car around the gate and the meeting time; access itself is arranged by the host.", send: ["Company and site", "Access details from your host", "Date and time", "Passengers"], href: "/services/business-executive", linkLabel: "Executive transport", waPrefill: "Salam! NEOM site visit.\n• Company / site: \n• Access details: \n• Date & time: \n• Passengers: " + NM },
    { id: "alula", icon: "route", label: "NEOM ↔ AlUla", short: `${NM_ALULA.km} km`, answer: `Combining NEOM with AlUla is a long drive, about ${NM_ALULA.km} km (${NM_ALULA.time}). Booked door to door with stops.`, send: ["Pickup", "AlUla hotel", "Date", "Passengers"], href: "/routes/neom-to-alula", linkLabel: "NEOM to AlUla", waPrefill: "Salam! NEOM → AlUla.\n• Pickup: \n• AlUla hotel: \n• Date & time: \n• Passengers: " + NM },
    { id: "long", icon: "route", label: "Riyadh or Jeddah ↔ NEOM", short: "Long-distance", answer: "For travellers who prefer the road to a flight, NEOM can be reached by car from Riyadh or Jeddah — a very long day, planned with stops.", send: ["Pickup city", "NEOM destination", "Date", "Passengers"], href: "/routes/jeddah-to-neom", linkLabel: "Jeddah to NEOM", waPrefill: "Salam! Long-distance trip to NEOM.\n• From (Riyadh / Jeddah): \n• NEOM destination: \n• Date: \n• Passengers: " + NM },
    { id: "corporate", icon: "briefcase", label: "Delegations & contractors", short: "Written quote", answer: `Teams flying into TUU or RSI can have every airport leg and site day on one written quote. ${CORPORATE_INVOICE_LINE}`, send: ["Company", "Dates and flights", "Headcount", "Sites"], href: "/services/corporate", linkLabel: "Corporate transportation", waPrefill: "Salam! Corporate transport for NEOM.\n• Company: \n• Dates & flights: \n• Headcount: " + NM },
  ],
  local: {
    eyebrow: "Before you book",
    heading: "Getting to NEOM: what to know first",
    intro: "NEOM is a very large region still under development, so the details matter more than in a city.",
    items: [
      { title: "Name the exact place", body: "\"NEOM\" is not one address. Sharma (NEOM Bay), Magna and Oxagon are our confirmed points; for anywhere else, send the location first and we confirm whether a transfer is possible." },
      { title: "Your host arranges access", body: "Many NEOM sites have controlled entry. Ask your host for the gate or meeting point and pass it on — we plan around it but cannot arrange access ourselves." },
      { title: "Jordan is close on the coast", body: `From the NEOM coast the shortest way into Jordan is the Al Durrah crossing near Haql — Haql to Aqaba is about ${HQ_AQABA.km} km.`, href: "/cross-border/saudi-to-jordan", linkLabel: "NEOM to Aqaba & Amman cross-border transfers" },
    ],
  },
  routesHeading: "Routes to and from NEOM",
  corridors: [
    { slug: "tabuk-airport-to-neom", label: "Tabuk Airport → NEOM", note: "The main arrival route for NEOM visitors." },
    { slug: "red-sea-airport-to-neom", label: "Red Sea Airport → NEOM", note: "Up the coast from RSI." },
    { slug: "neom-to-aqaba", label: "NEOM → Aqaba", note: "Via the Al Durrah crossing." },
    { slug: "aqaba-to-neom", label: "Aqaba → NEOM", note: "From Aqaba city or airport into NEOM." },
    { slug: "neom-to-amman", label: "NEOM → Amman", note: "A full cross-border day." },
    { slug: "neom-to-alula", label: "NEOM → AlUla", note: "Two destinations in one trip." },
    { slug: "haql-to-aqaba", label: "Haql → Aqaba", note: "The shortest way into Jordan." },
    { slug: "riyadh-to-neom", label: "Riyadh → NEOM", note: "Long-distance by road." },
    { slug: "jeddah-to-neom", label: "Jeddah → NEOM", note: "Up the Red Sea coast." },
  ],
  routesFootnote: NO_RENTAL,
  compare: {
    heading: "NEOM: fly into Tabuk or Red Sea Airport?",
    intro: "Both work. It depends on where in NEOM you are going and which flight suits you.",
    options: [
      { title: "Red Sea International (RSI)", when: [`About ${RSI_NEOM.km} km to NEOM`, "Useful if your flight times suit RSI", "Also serves the Red Sea resorts"] },
      { title: "Tabuk Airport (TUU)", when: [`About ${TUU_NEOM.km} km — the shorter drive`, "The usual choice for site visitors", "Tabuk city nearby for hotels"] },
    ],
  },
  hourly: { heading: "A car and driver for NEOM days", body: "Distances in the region are long, so a car that stays with you for the day — site, meeting, hotel, airport — often works better than separate transfers. The fare for the whole day is agreed before booking.", linkLabel: "Executive transport", href: "/services/business-executive", waPrefill: "Salam! Car with driver for a NEOM day.\n• Date & start time: \n• Hours / full day: \n• Stops: \n• Passengers: " + NM },
  vehicleHeading: "Which car for NEOM?",
  vehicleIntro: "Long highway legs make a full-size SUV the usual choice; executives often book a luxury sedan. Confirmed for your date with the quote.",
  vehicleFit: [
    { id: "sedan", label: "Genesis G80", fleetSlug: "genesis-g80", forWho: "One or two business travellers" },
    { id: "suv", label: "GMC Yukon XL", fleetSlug: "gmc-yukon-xl", forWho: "Teams and luggage on long legs" },
    { id: "van", label: "Hyundai Staria", fleetSlug: "hyundai-staria", forWho: "Small groups" },
    { id: "coaster", label: "Toyota Coaster", fleetSlug: "toyota-coaster", forWho: "Delegations" },
    { id: "luxury", label: "Mercedes S-Class", fleetSlug: "mercedes-s-class", forWho: "Senior executives" },
  ],
  timingHeading: "What changes timing for NEOM trips",
  timing: [
    { title: "Long empty roads", body: "Legs of 100 km or more are normal here. Plan arrivals from the flight time and allow for a rest stop." },
    { title: "Border crossings", body: "Jordan crossings add queue time that varies by day. Do not book a tight connection on the Jordan side." },
    { title: "Site entry", body: "Gate checks take time even with clearance. Leave a margin before the first meeting." },
  ],
  corporate: { heading: "NEOM business travel, quoted in writing", body: "Contractors, consultants and delegations get one written quote for airport legs, site days and Jordan crossings.", emailSubject: "Corporate transportation RFQ — NEOM", emailBody: rfq("NEOM", "TUU / RSI / sites / Aqaba") },
  quote: { heading: "Get your NEOM transfer quote", body: "Send the airport or pickup, the exact NEOM destination, the date, passengers and flight number. We reply with the vehicle and one fixed fare, usually within 1–2 hours." },
  faqHeading: "NEOM transport questions",
  faqs: [
    { question: "How do I get from Tabuk Airport to NEOM?", answer: `By pre-booked private car: about ${TUU_NEOM.km} km (${TUU_NEOM.time}). We track your flight, meet you at arrivals and drive you to the NEOM destination you give us.` },
    { question: "Which places in NEOM can you drive to?", answer: "Our confirmed points are NEOM Bay / Sharma, Magna and Oxagon. For any other NEOM site, send the location and we confirm whether a transfer is possible before quoting; site access is arranged by your host." },
    { question: "Can I go from NEOM to Aqaba in Jordan?", answer: `Yes, about ${NM_AQABA.km} km via the Al Durrah crossing. The vehicle's border fees are included; passengers bring their own passports and visas. A cheaper option drops you at the Saudi side of the border.` },
    { question: "Is NEOM car rental the same as this?", answer: `${NO_RENTAL} The fare for the car and driver is agreed before you travel.` },
    { question: "Can my company get a written quote?", answer: `Yes — email the dates, people and sites. ${CORPORATE_INVOICE_LINE}` },
    { question: "Is transport available 24/7?", answer: "Yes. Pre-book night and early-morning airport legs so the car is planned in advance." },
  ],
  relatedHeading: "More for NEOM",
  related: [
    { href: "/routes/tabuk-airport-to-neom", label: "Tabuk Airport to NEOM transfer" },
    { href: "/routes/red-sea-airport-to-neom", label: "Red Sea Airport to NEOM transfer" },
    { href: "/routes/haql-to-aqaba", label: "Haql to Aqaba — the shortest way into Jordan" },
    { href: "/cross-border/saudi-to-jordan", label: "NEOM to Aqaba & Amman cross-border transfers" },
    { href: "/routes/riyadh-to-neom", label: "Riyadh to NEOM long-distance taxi" },
    { href: "/routes/jeddah-to-neom", label: "Jeddah to NEOM long-distance taxi" },
    { href: "/routes/neom-to-aqaba", label: "NEOM to Aqaba, Jordan — private car with driver" },
    { href: "/routes/neom-to-amman", label: "NEOM to Amman, Jordan — private car with driver" },
    { href: "/airports/tabuk-regional", label: "Tabuk Regional Airport (TUU)" },
    { href: "/airports/red-sea", label: "Red Sea International Airport (RSI)" },
    { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — Family & Group SUV" },
    { href: "/fleet/mercedes-s-class", label: "Mercedes S-Class — VIP Executive Sedan" },
    { href: "/locations/tabuk", label: "Tabuk private transfers" },
    { href: "/routes/alula-to-neom", label: "AlUla to NEOM" },
    { href: "/routes/amman-to-neom", label: "Amman to NEOM" },
    { href: "/services/airport-transfers", label: "Airport transfer service" },
    { href: "/services/intercity", label: "Intercity transfers" },
    { href: "/routes", label: "All routes" },
    { href: "/book", label: "Book online" },
  ],
  finalLine: "Flying in for NEOM?",
  schemaName: "Private transfers & executive car service for NEOM",
  schemaDescription: "Pre-booked private transfers for NEOM: Tabuk Airport and Red Sea Airport arrivals, NEOM Bay / Sharma, Magna and Oxagon, site visits (access arranged by the host) and Aqaba or Amman in Jordan, through a vetted partner network.",
};

/* ═══ TABUK ═══════════════════════════════════════════════════════════ */

const TB = "\n(ref: tabuk-hub)";

export const TABUK_HUB: RegionalHubConfig = {
  slug: "tabuk",
  name: "Tabuk",
  nameAr: "تبوك",
  geo: { lat: 28.3835, lng: 36.5662 },
  eyebrow: "Tabuk · Gateway to NEOM and Jordan",
  hero: { src: "/locations/tabuk-hero.webp", alt: "Illuminated 'I love Tabuk' letters at night in front of a modern building in Tabuk" },
  lede: `Pre-booked private cars from Tabuk — airport pickups at TUU, NEOM (about ${TUU_NEOM.km} km from the airport), and Jordan: Aqaba, Petra, Wadi Rum and Amman by the shortest crossing.`,
  heroBullets: ["Jordan border fees included", "We track your flight", "English & Arabic drivers", "24/7"],
  ctaLabel: "Request a Tabuk Quote",
  hubWa: "Salam! Tabuk transport enquiry.\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Flight number (if airport): " + TB,
  shortAnswer: `Taxi Saudi Arabia arranges pre-booked private cars in Tabuk through a vetted partner network. The main trips are Tabuk Airport (TUU) pickups, NEOM (about ${TUU_NEOM.km} km from TUU), and Jordan — Aqaba (${TB_AQABA.km} km), Petra (${TB_PETRA.km} km), Wadi Rum (${TB_RUM.km} km) and Amman (${TB_AMMAN.km} km) — using the shortest crossing for each. The vehicle's border fees are included and the fare is agreed before booking.`,
  facts: [
    { label: "Tabuk → Aqaba", value: `${TB_AQABA.km} km · ${TB_AQABA.time}` },
    { label: "Tabuk → Petra", value: `${TB_PETRA.km} km · ${TB_PETRA.time}` },
    { label: "Tabuk → Amman", value: `${TB_AMMAN.km} km · ${TB_AMMAN.time}` },
    { label: "TUU Airport → NEOM", value: `${TUU_NEOM.km} km · ${TUU_NEOM.time}` },
    { label: "Border fees", value: "Included for the vehicle" },
    { label: "Cancellation", value: "Free up to 24 hours before" },
  ],
  tripHeading: "Where are you going from Tabuk?",
  tripIntro: "Most Tabuk bookings are Jordan crossings and NEOM arrivals. Each card says what to send.",
  trips: [
    { id: "aqaba", icon: "route", label: "Tabuk → Aqaba", short: `${TB_AQABA.km} km`, answer: `About ${TB_AQABA.km} km (${TB_AQABA.time}). Aqaba is reached via the Al Durrah crossing near Haql. The vehicle's border fees are included; each passenger brings a passport and visa. Our Jordan partner covers the Jordan side door to door.`, send: ["Pickup in Tabuk", "Aqaba address or airport", "Date and time", "Passengers and nationalities"], href: "/routes/tabuk-to-aqaba", linkLabel: "Tabuk to Aqaba border transfer", waPrefill: "Salam! Tabuk → Aqaba.\n• Pickup: \n• Aqaba address / airport: \n• Date & time: \n• Passengers: " + TB },
    { id: "petra", icon: "landmark", label: "Tabuk → Petra or Wadi Rum", short: `${TB_PETRA.km} km / ${TB_RUM.km} km`, answer: `Petra is about ${TB_PETRA.km} km and Wadi Rum about ${TB_RUM.km} km, both via the Halat Ammar–Al Mudawwara crossing — the shortest road from Tabuk. Transport only; tickets and guides are your own.`, send: ["Pickup", "Petra or Wadi Rum hotel / camp", "Date", "Passengers"], href: "/routes/tabuk-to-petra", linkLabel: "Tabuk to Petra transfer", waPrefill: "Salam! Tabuk → Petra / Wadi Rum.\n• Pickup: \n• Hotel / camp: \n• Date: \n• Passengers: " + TB },
    { id: "amman", icon: "route", label: "Tabuk → Amman", short: `${TB_AMMAN.km} km`, answer: `About ${TB_AMMAN.km} km (${TB_AMMAN.time}) via Halat Ammar. A long day — stops planned in advance.`, send: ["Pickup", "Amman address or airport", "Date", "Passengers"], href: "/routes/tabuk-to-amman", linkLabel: "Tabuk to Amman transfer", waPrefill: "Salam! Tabuk → Amman.\n• Pickup: \n• Amman address: \n• Date: \n• Passengers: " + TB },
    { id: "neom", icon: "plane", label: "TUU Airport → NEOM", short: `${TUU_NEOM.km} km`, answer: `Straight from the terminal to NEOM: about ${TUU_NEOM.km} km. Confirmed points are Sharma, Magna and Oxagon; send other sites first.`, send: ["Flight number", "NEOM destination", "Passengers"], href: "/routes/tabuk-airport-to-neom", linkLabel: "Tabuk Airport to NEOM transfer", waPrefill: "Salam! Tabuk Airport → NEOM.\n• Flight: \n• NEOM destination: \n• Passengers: " + TB },
    { id: "airport", icon: "plane", label: "TUU Airport ↔ Tabuk city", short: "Meet & greet", answer: `Arrivals and departures between Tabuk Regional Airport and your hotel. We track the flight; ${FREE_WAIT} free waiting.`, send: ["Flight number", "Hotel", "Passengers"], href: "/airports/tabuk-regional", linkLabel: "Tabuk Airport (TUU) transfers", waPrefill: "Salam! Tabuk Airport transfer.\n• Flight: \n• Hotel: \n• Date & time: \n• Passengers: " + TB },
    { id: "rsi", icon: "route", label: "Red Sea Airport", short: `${TB_RSI.km} km`, answer: `Tabuk to Red Sea International is about ${TB_RSI.km} km — for resort guests and flights from RSI.`, send: ["Pickup", "Flight or resort", "Date", "Passengers"], href: "/routes/tabuk-to-red-sea-airport", linkLabel: "Tabuk to Red Sea Airport", waPrefill: "Salam! Tabuk → Red Sea Airport.\n• Pickup: \n• Flight / resort: \n• Date: \n• Passengers: " + TB },
    { id: "madinah", icon: "route", label: "Madinah & further south", short: `${MD_TABUK.km} km to Madinah`, answer: `Madinah is about ${MD_TABUK.km} km away — door to door with prayer and rest stops.`, send: ["Pickup", "Madinah hotel", "Date", "Passengers"], href: "/routes/madinah-to-tabuk", linkLabel: "Madinah ↔ Tabuk", waPrefill: "Salam! Tabuk ↔ Madinah.\n• From: \n• To: \n• Date: \n• Passengers: " + TB },
    { id: "corporate", icon: "briefcase", label: "Business & delegations", short: "Written quote", answer: `Visiting teams and NEOM contractors staying in Tabuk can have every leg on one written quote. ${CORPORATE_INVOICE_LINE}`, send: ["Company", "Dates", "Headcount", "Trips"], href: "/services/business-executive", linkLabel: "Private chauffeur & executive transport", waPrefill: "Salam! Corporate transport in Tabuk.\n• Company: \n• Dates & trips: \n• Headcount: " + TB },
  ],
  local: {
    eyebrow: "Tabuk to Jordan",
    heading: "Which border crossing from Tabuk?",
    intro: "We always use the shortest road for your destination in Jordan.",
    items: [
      { title: "Amman, Petra, Wadi Rum", body: "These go through the Halat Ammar–Al Mudawwara crossing north of Tabuk — the shortest way to inland Jordan." },
      { title: "Aqaba", body: "Aqaba goes through Al Durrah near Haql on the Gulf of Aqaba coast. From Haql the crossing to Aqaba is short.", href: "/cross-border/saudi-to-jordan", linkLabel: "Tabuk to Jordan — Al Durrah border transfers" },
      { title: "Drop at the border — cheaper", body: "If you have your own onward transport in Jordan, we can drop you at the Saudi side of the crossing instead. Ask when you book; how you continue across is your arrangement." },
    ],
  },
  routesHeading: "Routes from and to Tabuk",
  corridors: [
    { slug: "tabuk-to-aqaba", label: "Tabuk → Aqaba", note: "Via Al Durrah near Haql." },
    { slug: "aqaba-to-tabuk", label: "Aqaba → Tabuk", note: "Back from Aqaba city or airport." },
    { slug: "tabuk-to-petra", label: "Tabuk → Petra", note: "Via Halat Ammar." },
    { slug: "tabuk-to-wadi-rum", label: "Tabuk → Wadi Rum", note: "Desert camps in southern Jordan." },
    { slug: "tabuk-to-amman", label: "Tabuk → Amman", note: "A full cross-border day." },
    { slug: "amman-to-tabuk", label: "Amman → Tabuk", note: "The return from the Jordanian capital." },
    { slug: "tabuk-airport-to-neom", label: "Tabuk Airport → NEOM", note: "Arrivals heading to NEOM." },
    { slug: "tabuk-to-red-sea-airport", label: "Tabuk → Red Sea Airport", note: "For RSI flights and resorts." },
    { slug: "madinah-to-tabuk", label: "Madinah → Tabuk", note: "From the Prophet's city north to Tabuk." },
  ],
  routesFootnote: NO_RENTAL,
  compare: {
    heading: "Tabuk to Jordan: door to door or drop at the border?",
    intro: "Both are available for Jordan — they suit different travellers.",
    options: [
      { title: "Drop at the Saudi side", when: ["You already have transport arranged in Jordan", "Travelling light", "Lowest fare"] },
      { title: "Door to door", when: ["Family, luggage or elderly passengers", "Hotel or airport in Jordan as the end point", "One booking for the whole trip"] },
    ],
  },
  hourly: { heading: "A car and driver for a Tabuk day", body: "Business appointments in the city, a site visit and the airport in one day — or a long day out — with one car that waits. The fare for the day is agreed first.", linkLabel: "Executive transport", href: "/services/business-executive", waPrefill: "Salam! Car with driver for a Tabuk day.\n• Date & start time: \n• Hours / full day: \n• Stops: \n• Passengers: " + TB },
  vehicleHeading: "Which car from Tabuk?",
  vehicleIntro: "Families crossing to Jordan usually take the SUV or a van; couples a sedan. Confirmed for your date with the quote.",
  vehicleFit: [
    { id: "sedan", label: "Toyota Camry", fleetSlug: "toyota-camry", forWho: "One to three people" },
    { id: "suv", label: "GMC Yukon XL", fleetSlug: "gmc-yukon-xl", forWho: "Families crossing to Jordan" },
    { id: "van", label: "Hyundai Staria", fleetSlug: "hyundai-staria", forWho: "Small groups" },
    { id: "hiace", label: "Toyota Hiace", fleetSlug: "toyota-hiace", forWho: "Larger groups" },
    { id: "luxury", label: "Mercedes S-Class", fleetSlug: "mercedes-s-class", forWho: "VIP guests" },
  ],
  timingHeading: "What changes timing from Tabuk",
  timing: [
    { title: "Border queues", body: "Waiting time at Halat Ammar and Al Durrah varies by day and season. Never plan a tight connection on the Jordan side." },
    { title: "Long desert legs", body: "Petra, Wadi Rum and Amman are full-day drives. Start early and plan rest stops." },
    { title: "Winter mornings", body: "Tabuk is inland and higher than the coast; winter mornings can be cold — dress for it on early departures." },
  ],
  corporate: { heading: "Tabuk business transport, quoted in writing", body: "Delegations, NEOM contractors and visiting teams get one written quote for airport legs, site days and Jordan crossings.", emailSubject: "Corporate transportation RFQ — Tabuk", emailBody: rfq("Tabuk", "TUU / NEOM / Jordan / city") },
  quote: { heading: "Get your Tabuk transfer quote", body: "Send the pickup, destination (including the Jordan city), date, passengers and nationalities for border trips. We reply with the vehicle and one fixed fare." },
  faqHeading: "Tabuk transport questions",
  faqs: [
    { question: "Can I go from Tabuk to Aqaba by private car?", answer: `Yes, about ${TB_AQABA.km} km via Al Durrah near Haql. The vehicle's border fees are included; each passenger brings a passport and visa. Our Jordan partner covers the Jordan side door to door.` },
    { question: "Which crossing do you use for Petra and Amman?", answer: "Halat Ammar–Al Mudawwara, the shortest road from Tabuk to inland Jordan." },
    { question: "Can you drop us at the border instead?", answer: "Yes, for Jordan — a cheaper option where we drop you at the Saudi side. How you continue across the crossing is your own arrangement." },
    { question: "How do I get from Tabuk Airport to NEOM?", answer: `Pre-book a private car: about ${TUU_NEOM.km} km. We track the flight and meet you at arrivals.` },
    { question: "Is this car rental?", answer: `${NO_RENTAL}` },
    { question: "Can my company be invoiced?", answer: `Yes. ${CORPORATE_INVOICE_LINE}` },
  ],
  relatedHeading: "More from Tabuk",
  related: [
    { href: "/locations/neom", label: "NEOM transportation guide" },
    { href: "/routes/tabuk-airport-to-neom", label: "Tabuk Airport to NEOM transfer" },
    { href: "/cross-border/saudi-to-jordan", label: "Tabuk to Jordan — Al Durrah border transfers" },
    { href: "/routes/tabuk-to-aqaba", label: "Tabuk to Aqaba border transfer" },
    { href: "/routes/tabuk-to-amman", label: "Tabuk to Amman, Jordan transfer" },
    { href: "/routes/tabuk-to-petra", label: "Tabuk to Petra, Jordan transfer" },
    { href: "/routes/tabuk-to-wadi-rum", label: "Tabuk to Wadi Rum, Jordan transfer" },
    { href: "/services/business-executive", label: "Private chauffeur & executive transport" },
    { href: "/airports/tabuk-regional", label: "Tabuk Airport (TUU) transfers" },
    { href: "/services/airport-transfers", label: "Airport transfer service" },
    { href: "/services/intercity", label: "Intercity transfers" },
    { href: "/routes", label: "All routes" },
    { href: "/book", label: "Book online" },
  ],
  finalLine: "Crossing to Jordan or landing at TUU?",
  schemaName: "Private transfers & chauffeur service in Tabuk",
  schemaDescription: "Pre-booked private transport from Tabuk: TUU airport pickups, NEOM transfers, and Jordan crossings to Aqaba, Petra, Wadi Rum and Amman by the shortest border, through a vetted partner network.",
};

/* ═══ YANBU ═══════════════════════════════════════════════════════════ */

const YB = "\n(ref: yanbu-hub)";

export const YANBU_HUB: RegionalHubConfig = {
  slug: "yanbu",
  name: "Yanbu",
  nameAr: "ينبع",
  geo: { lat: 24.0895, lng: 38.0618 },
  parent: { name: "Madinah region", href: "/locations/madinah" },
  eyebrow: "Yanbu · Red Sea coast · Madinah region",
  lede: `Pre-booked private cars in Yanbu — Yanbu Al-Bahr and the Industrial City, the airport, and the long drives to Madinah (about ${MD_YANBU.km} km), Jeddah (${JD_YANBU.km} km) and Makkah (${MK_YANBU.km} km).`,
  heroBullets: ["Madinah & Jeddah by road", "We track your flight", "English & Arabic drivers", "24/7"],
  ctaLabel: "Request a Yanbu Quote",
  hubWa: "Salam! Yanbu transport enquiry.\n• From (Yanbu Al-Bahr / Industrial City / airport): \n• To: \n• Date & time: \n• Passengers & luggage: " + YB,
  shortAnswer: `Taxi Saudi Arabia arranges pre-booked private cars in Yanbu through a vetted partner network: airport pickups, trips between Yanbu Al-Bahr and the Industrial City, and intercity transfers to Madinah (about ${MD_YANBU.km} km), Jeddah (${JD_YANBU.km} km) and Makkah (${MK_YANBU.km} km). Every booking is a car with a driver, with the fare agreed before you travel.`,
  facts: [
    { label: "Madinah ↔ Yanbu", value: `${MD_YANBU.km} km · ${MD_YANBU.time}` },
    { label: "Jeddah ↔ Yanbu", value: `${JD_YANBU.km} km · ${JD_YANBU.time}` },
    { label: "Makkah ↔ Yanbu", value: `${MK_YANBU.km} km · ${MK_YANBU.time}` },
    { label: "Covers", value: "Yanbu Al-Bahr & Industrial City" },
    { label: "Drivers", value: "English & Arabic, 24/7" },
    { label: "Not offered", value: "Self-drive car rental" },
  ],
  tripHeading: "Which Yanbu trip is yours?",
  tripIntro: "Yanbu bookings are mostly the Madinah road, the airport and the Industrial City. Pick one.",
  trips: [
    { id: "madinah", icon: "route", label: "Yanbu ↔ Madinah", short: `${MD_YANBU.km} km`, answer: `About ${MD_YANBU.km} km (${MD_YANBU.time}) — a common road for pilgrims and families. Door to door with prayer and rest stops.`, send: ["Pickup in Yanbu", "Madinah hotel", "Date and time", "Passengers and bags"], href: "/routes/madinah-to-yanbu", linkLabel: "Madinah ↔ Yanbu private transfer", waPrefill: "Salam! Yanbu ↔ Madinah.\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: " + YB },
    { id: "jeddah", icon: "route", label: "Yanbu ↔ Jeddah", short: `${JD_YANBU.km} km`, answer: `About ${JD_YANBU.km} km (${JD_YANBU.time}) down the Red Sea coast — to a Jeddah hotel or King Abdulaziz Airport.`, send: ["Pickup", "Jeddah address or airport", "Date and time", "Passengers"], href: "/routes/jeddah-to-yanbu", linkLabel: "Jeddah ↔ Yanbu", waPrefill: "Salam! Yanbu ↔ Jeddah.\n• From: \n• To: \n• Date & time: \n• Passengers: " + YB },
    { id: "makkah", icon: "route", label: "Yanbu ↔ Makkah", short: `${MK_YANBU.km} km`, answer: `About ${MK_YANBU.km} km (${MK_YANBU.time}) for Umrah travellers. Tell us if you want a stop on the way.`, send: ["Pickup", "Makkah hotel", "Date", "Passengers"], href: "/routes/makkah-to-yanbu", linkLabel: "Makkah ↔ Yanbu", waPrefill: "Salam! Yanbu ↔ Makkah.\n• From: \n• To: \n• Date: \n• Passengers: " + YB },
    { id: "airport", icon: "plane", label: "Yanbu Airport pickups", short: "Flight tracked", answer: `Arrivals and departures at Yanbu airport (YNB) to Yanbu Al-Bahr or the Industrial City. We track the flight; ${FREE_WAIT} free waiting.`, send: ["Flight number", "Hotel or site", "Passengers"], href: "#quote", linkLabel: "Request an airport pickup", waPrefill: "Salam! Yanbu Airport pickup.\n• Flight: \n• Hotel / site: \n• Date & time: \n• Passengers: " + YB },
    { id: "industrial", icon: "briefcase", label: "Industrial City visits", short: "Site and gate name", answer: "Yanbu Al-Bahr and the Industrial City are separate areas — send which one, plus the company and gate for site visits. Access is arranged by your host.", send: ["Company and site", "Gate", "Date and time", "Passengers"], href: "#local", linkLabel: "Yanbu areas explained", waPrefill: "Salam! Yanbu Industrial City visit.\n• Company / site: \n• Gate: \n• Date & time: \n• Passengers: " + YB },
    { id: "coast", icon: "landmark", label: "Beach & diving days", short: "Timed return", answer: "Drop at the beach or dive centre with a timed return — tell us about equipment so the car has room.", send: ["Pickup", "Beach / dive centre", "Times there and back", "Equipment"], href: "#quote", linkLabel: "Request a beach day", waPrefill: "Salam! Yanbu beach / diving day.\n• Pickup: \n• Beach / dive centre: \n• Times: \n• Equipment: " + YB },
    { id: "hourly", icon: "clock", label: "Driver for the day", short: "Hours or full day", answer: "One car that waits between meetings, shopping and family visits in Yanbu, with the fare for the day agreed first.", send: ["Date", "Hours", "Stops", "Passengers"], href: "#quote", linkLabel: "Request a driver", waPrefill: "Salam! Driver for the day in Yanbu.\n• Date & start time: \n• Hours: \n• Stops: \n• Passengers: " + YB },
    { id: "corporate", icon: "briefcase", label: "Companies & crews", short: "Written quote", answer: `Rotations, site weeks and visiting teams can be quoted in writing. ${CORPORATE_INVOICE_LINE}`, send: ["Company", "Dates", "Headcount", "Sites"], href: "/services/corporate", linkLabel: "Corporate transportation", waPrefill: "Salam! Corporate transport in Yanbu.\n• Company: \n• Dates & trips: \n• Headcount: " + YB },
  ],
  local: {
    eyebrow: "Yanbu, practically",
    heading: "Yanbu Al-Bahr or the Industrial City?",
    intro: "Most booking mix-ups in Yanbu come from the two areas sharing one name.",
    items: [
      { title: "Two places, one name", body: "Yanbu Al-Bahr is the old coastal city with the corniche; Yanbu Industrial City is a separate industrial and residential area. Always tell us which one — they are not next door." },
      { title: "The Madinah road", body: `Many Yanbu bookings are pilgrims and families heading to or from Madinah, about ${MD_YANBU.km} km inland.`, href: "/routes/madinah-to-yanbu", linkLabel: "Madinah ↔ Yanbu transfer" },
      { title: "Looking for car rental?", body: `${NO_RENTAL} If you would rather not drive the long coastal and Madinah roads yourself, a pre-booked car with a driver is the alternative.` },
    ],
  },
  routesHeading: "Routes to and from Yanbu",
  corridors: [
    { slug: "madinah-to-yanbu", label: "Madinah → Yanbu", note: "The pilgrim road to the coast." },
    { slug: "jeddah-to-yanbu", label: "Jeddah → Yanbu", note: "Up the Red Sea coast." },
    { slug: "makkah-to-yanbu", label: "Makkah → Yanbu", note: "For Umrah travellers heading north." },
  ],
  compare: {
    heading: "Rent a car and drive, or book a car with a driver?",
    intro: "Many people searching for Yanbu car hire are deciding exactly this. An honest comparison:",
    options: [
      { title: "Rent and drive yourself", when: ["You hold a licence valid in Saudi Arabia", "You want the car for several days", "You are happy driving long coastal and desert roads"] },
      { title: "Car with a driver", when: ["No driving, no parking, no fuel stops to plan", "One fixed fare for the trip, agreed first", "Families, luggage, or a long Madinah or Jeddah leg"] },
    ],
  },
  hourly: { heading: "A driver for a Yanbu day", body: "Meetings in the Industrial City, lunch in Yanbu Al-Bahr and the airport at the end — or a family day on the coast — with one car and one fare agreed first.", linkLabel: "Request a driver", waPrefill: "Salam! Driver for a Yanbu day.\n• Date & start time: \n• Hours: \n• Stops: \n• Passengers: " + YB },
  vehicleHeading: "Which car for Yanbu?",
  vehicleIntro: "Families on the Madinah road usually take an SUV or van; crews take a Hiace. Confirmed for your date with the quote.",
  vehicleFit: [
    { id: "sedan", label: "Toyota Camry", fleetSlug: "toyota-camry", forWho: "One to three people" },
    { id: "suv", label: "GMC Yukon XL", fleetSlug: "gmc-yukon-xl", forWho: "Families with luggage" },
    { id: "van", label: "Hyundai Staria", fleetSlug: "hyundai-staria", forWho: "Small groups" },
    { id: "hiace", label: "Toyota Hiace", fleetSlug: "toyota-hiace", forWho: "Crews and larger groups" },
    { id: "luxury", label: "Mercedes S-Class", fleetSlug: "mercedes-s-class", forWho: "VIP guests" },
  ],
  timingHeading: "What changes timing in Yanbu",
  timing: [
    { title: "Umrah and holiday seasons", body: "The Madinah road is busier in peak Umrah weeks and holidays. Book early and allow extra time." },
    { title: "Long coastal legs", body: `Jeddah is about ${JD_YANBU.km} km — plan airport departures from the flight time.` },
    { title: "Summer heat", body: "The coast is hot and humid in summer; beach and diving days are easiest early or late." },
  ],
  corporate: { heading: "Yanbu business transport, quoted in writing", body: "Visiting engineers, crews and teams get one written quote for airport legs, site days and Madinah or Jeddah trips.", emailSubject: "Corporate transportation RFQ — Yanbu", emailBody: rfq("Yanbu", "airport / Industrial City / Madinah / Jeddah") },
  quote: { heading: "Get your Yanbu transfer quote", body: "Send the pickup (Yanbu Al-Bahr or Industrial City), destination, date, passengers and luggage. We reply with the car and one fixed fare." },
  faqHeading: "Yanbu transport questions",
  faqs: [
    { question: "How far is Yanbu from Madinah by private car?", answer: `About ${MD_YANBU.km} km — roughly ${MD_YANBU.time}. A private car goes hotel to hotel with prayer and rest stops on request.` },
    { question: "Can I get a car from Yanbu to Jeddah?", answer: `Yes, about ${JD_YANBU.km} km along the Red Sea coast, to a Jeddah address or the airport.` },
    { question: "Do you cover both Yanbu city and the Industrial City?", answer: "Yes. They are separate areas, so tell us which one when you book; for site visits add the company and gate." },
    { question: "Is this car rental at Yanbu airport?", answer: `${NO_RENTAL} We meet you at arrivals and drive you where you need to go.` },
    { question: "Can my company be invoiced?", answer: `Yes. ${CORPORATE_INVOICE_LINE}` },
    { question: "Is transport available 24/7?", answer: "Yes. Pre-book early and late trips so the car is planned in advance." },
  ],
  relatedHeading: "More from Yanbu",
  related: [
    { href: "/routes/madinah-to-yanbu", label: "Madinah to Yanbu private transfer" },
    { href: "/routes/jeddah-to-yanbu", label: "Jeddah to Yanbu private transfer" },
    { href: "/routes/makkah-to-yanbu", label: "Makkah to Yanbu private transfer" },
    { href: "/locations/madinah", label: "Private transfers in Madinah" },
    { href: "/locations/jeddah", label: "Private transfers in Jeddah" },
    { href: "/services/car-recovery/yanbu", label: "Yanbu car recovery & tow truck (satha)" },
    { href: "/services/airport-transfers", label: "Airport transfer service" },
    { href: "/services/intercity", label: "Intercity transfers" },
    { href: "/routes", label: "All routes" },
    { href: "/book", label: "Book online" },
  ],
  finalLine: "Heading to or from Yanbu?",
  schemaName: "Private taxi, transfers & chauffeur service in Yanbu",
  schemaDescription: "Pre-booked private cars with drivers in Yanbu: airport pickups, Yanbu Al-Bahr and Industrial City trips, and transfers to Madinah, Jeddah and Makkah, through a vetted partner network.",
};

export const SECONDARY_HUBS: Record<string, RegionalHubConfig> = {
  neom: NEOM_HUB,
  tabuk: TABUK_HUB,
  yanbu: YANBU_HUB,
};
