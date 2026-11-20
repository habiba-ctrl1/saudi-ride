// Al Khobar, Dhahran and Jubail hubs — content for components/location/cluster/
// RegionalHub.tsx. Built 2026-11-21 from seo/eastern-province-keyword-map.md.
//
// Truth rules (CLAUDE.md §2, §14, §16, §17) — same as lib/data/dammam-cluster.ts:
// - Distances only via routeFact(). The old copy's "Dhahran–Khobar 15 km",
//   "Dhahran–Jubail 85 km", "DMM–Khobar 30 km", "Al-Fanateer 8 km" had no
//   source and are not used.
// - Facts only from seo/facts.md. Saudi Aramco, KFUPM, SABIC, the Royal
//   Commission and Ithra appear as destinations only — never as clients,
//   partners or relationships. Site access is arranged by the visitor's host.
// - No monthly accounts / dedicated drivers / "drivers know the gates".
// - Titles and H1s of all three pages are unchanged (rule 3; they rank).
import { routeFact, CORPORATE_INVOICE_LINE, type TripType } from "@/lib/data/cluster";

export interface RegionalHubConfig {
  slug: string;
  name: string;
  nameAr: string;
  geo: { lat: number; lng: number };
  eyebrow: string;
  hero?: { src: string; alt: string };
  lede: string;
  heroBullets: string[];
  ctaLabel: string;
  hubWa: string;
  shortAnswer: string;
  facts: { label: string; value: string }[];
  tripHeading: string;
  tripIntro: string;
  trips: TripType[];
  local: { eyebrow: string; heading: string; intro: string; items: { title: string; body: string; href?: string; linkLabel?: string }[] };
  routesHeading: string;
  corridors: { slug: string; label: string; note: string }[];
  routesFootnote?: string;
  compare: { heading: string; intro: string; options: { title: string; when: string[] }[] };
  hourly: { heading: string; body: string; linkLabel: string; waPrefill: string };
  vehicleHeading: string;
  vehicleIntro: string;
  vehicleFit: { id: string; label: string; fleetSlug: string; forWho: string }[];
  timingHeading: string;
  timing: { title: string; body: string }[];
  corporate: { heading: string; body: string; emailSubject: string; emailBody: string };
  rfqCity: "Al Khobar" | "Dhahran" | "Jubail";
  quote: { heading: string; body: string };
  faqHeading: string;
  faqs: { question: string; answer: string }[];
  relatedHeading: string;
  related: { href: string; label: string }[];
  finalLine: string;
  schemaName: string;
  schemaDescription: string;
}

const FREE_WAIT = "15–30 minutes";
const KH_MANAMA = routeFact("alkhobar-to-manama")!;
const KH_DOHA = routeFact("alkhobar-to-doha")!;
const KH_RIYADH = routeFact("alkhobar-to-riyadh")!;
const DMM_DHAHRAN = routeFact("dammam-airport-to-dhahran")!;
const DMM_JUBAIL = routeFact("dammam-airport-to-jubail")!;
const DMM_BAHRAIN = routeFact("dammam-airport-to-bahrain")!;
const D_MANAMA = routeFact("dammam-to-manama")!;
const D_RIYADH = routeFact("dammam-to-riyadh")!;
const JB_KUWAIT = routeFact("jubail-to-kuwait")!;

const rfqBody = (city: string, trips: string) =>
  `Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transportation in ${city}.\n\n• Company: \n• Contact name & role: \n• Dates: \n• Trips (${trips}): \n• Passengers per trip: \n• Vehicle (Executive sedan / SUV / Van / Coaster): \n• Invoice needed?: \n\nPlease confirm the fixed fare before booking.\n\nThank you.`;

/* ═══ AL KHOBAR ═══════════════════════════════════════════════════════ */

const KH_REF = "\n(ref: alkhobar-hub)";

export const ALKHOBAR_HUB: RegionalHubConfig = {
  slug: "alkhobar",
  name: "Al Khobar",
  nameAr: "الخبر",
  geo: { lat: 26.2794, lng: 50.2083 },
  eyebrow: "Al Khobar · Gulf coast · Bahrain side",
  hero: { src: "/locations/alkhobar-hero.webp", alt: "Aerial view of the Al Khobar Water Tower on its island and the Khobar Corniche at sunset" },
  lede: "Pre-booked private cars from Al Khobar — the Corniche hotels, the King Fahd Causeway to Bahrain, DMM airport, meetings next door in Dhahran, and long drives to Doha and Riyadh.",
  heroBullets: ["Causeway crossing fee included", "We track your flight", "English & Arabic drivers", "24/7"],
  ctaLabel: "Request an Al Khobar Quote",
  hubWa: "Salam! Al Khobar transport enquiry.\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Flight number (if airport): " + KH_REF,
  shortAnswer: `Taxi Saudi Arabia arranges pre-booked private cars in Al Khobar through a vetted partner network. The most-booked trips are Bahrain over the King Fahd Causeway (Al Khobar to Manama is about ${KH_MANAMA.km} km — the shortest crossing of the three Eastern Province cities in our route data), King Fahd Airport (DMM) pickups, rides across Khobar, Dhahran and Dammam, Doha by road (${KH_DOHA.km} km) and Riyadh (${KH_RIYADH.km} km). The fare is agreed before you book.`,
  facts: [
    { label: "Al Khobar → Manama", value: `${KH_MANAMA.km} km · ${KH_MANAMA.time}` },
    { label: "Al Khobar → Doha", value: `${KH_DOHA.km} km · ${KH_DOHA.time}` },
    { label: "Al Khobar → Riyadh", value: `${KH_RIYADH.km} km · ${KH_RIYADH.time}` },
    { label: "Causeway fee", value: "Included for the vehicle" },
    { label: "Flights", value: "We track your flight" },
    { label: "Cancellation", value: "Free up to 24 hours before" },
  ],
  tripHeading: "Where are you going from Al Khobar?",
  tripIntro: "Choose the trip; each card lists what to send and links to its own page.",
  trips: [
    { id: "bahrain", icon: "route", label: "Bahrain over the causeway", short: `${KH_MANAMA.km} km to Manama`, answer: `Al Khobar sits closest to the King Fahd Causeway, so Manama is about ${KH_MANAMA.km} km (${KH_MANAMA.time}) door to door. The vehicle's crossing fee is in the fare; every passenger brings their own passport and entry documents. There is no "drop at the border" option on the causeway — the car goes through.`, send: ["Pickup address in Al Khobar", "Bahrain address", "Date and time", "Passengers and nationalities"], href: "/routes/alkhobar-to-manama", linkLabel: "Al Khobar to Manama private car", waPrefill: "Salam! Al Khobar → Bahrain.\n• From: \n• To (Bahrain address): \n• Date & time: \n• Passengers & luggage: " + KH_REF },
    { id: "airport", icon: "plane", label: "DMM Airport ↔ Al Khobar", short: "Flight tracked, meet & greet", answer: `King Fahd International Airport is north-west of the metro; Al Khobar is further from it than Dhahran (${DMM_DHAHRAN.km} km), so allow for a proper drive on departure days. We track the flight and the first ${FREE_WAIT} of waiting are free.`, send: ["Flight number", "Hotel or address in Al Khobar", "Passengers and large bags"], href: "/airports/king-fahd-dammam", linkLabel: "DMM airport transfers", waPrefill: "Salam! DMM Airport ↔ Al Khobar.\n• Flight number: \n• Hotel / address: \n• Date & time: \n• Passengers & luggage: " + KH_REF },
    { id: "metro", icon: "hotel", label: "Rides in Khobar, Dhahran & Dammam", short: "Corniche, malls, offices", answer: "One pre-booked car between two addresses — a Corniche hotel to an office in Dhahran, dinner in Dammam, or back from a mall at closing time. One fixed fare for the whole car.", send: ["Pickup", "Drop-off", "Date and time", "Passengers"], href: "/locations/dammam", linkLabel: "Rides across the Dammam metro", waPrefill: "Salam! Ride from Al Khobar.\n• From: \n• To: \n• Date & time: \n• Passengers: \n• One-way or return: " + KH_REF },
    { id: "private-driver", icon: "clock", label: "Driver by the hour", short: "Half day or full day", answer: "Keep one car and driver for the day — meetings on the Khobar side, a site visit in Dhahran, the airport at the end. The driver waits at each stop.", send: ["Date and start time", "Hours", "Stops", "Passengers"], href: "/locations/dammam/private-driver", linkLabel: "Private driver in Dammam & Al Khobar", waPrefill: "Salam! Private driver from Al Khobar (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops: \n• Passengers: \n(ref: dammam-private-driver)" },
    { id: "beach", icon: "landmark", label: "Half Moon Bay day", short: "Timed return", answer: "Half Moon Bay is south of Al Khobar along the coast. Book the drive there and a timed return, or keep the car for the day if you are visiting more than one place.", send: ["Pickup", "Beach or resort name", "Date, start and return time", "Passengers"], href: "/locations/dammam/half-moon-bay", linkLabel: "Half Moon Bay transfers", waPrefill: "Salam! Al Khobar → Half Moon Bay.\n• Pickup: \n• Beach / resort: \n• Date & times (there / back): \n• Passengers: " + KH_REF },
    { id: "qatar", icon: "route", label: "Doha via Salwa", short: `${KH_DOHA.km} km`, answer: `Al Khobar to Doha is about ${KH_DOHA.km} km through the Salwa border (${KH_DOHA.time}). The vehicle's border fees are included; visas are each passenger's own.`, send: ["Pickup", "Doha address", "Date and time", "Passengers"], href: "/routes/alkhobar-to-doha", linkLabel: "Al Khobar to Doha private transfer", waPrefill: "Salam! Al Khobar → Doha.\n• From: \n• To (Doha address): \n• Date & time: \n• Passengers & luggage: " + KH_REF },
    { id: "riyadh", icon: "route", label: "Riyadh by road", short: `${KH_RIYADH.km} km`, answer: `Al Khobar to Riyadh is about ${KH_RIYADH.km} km (${KH_RIYADH.time}), door to door with stops when you ask.`, send: ["Pickup", "Riyadh address", "Date and time", "Passengers"], href: "/routes/alkhobar-to-riyadh", linkLabel: "Al Khobar to Riyadh", waPrefill: "Salam! Al Khobar → Riyadh.\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: " + KH_REF },
    { id: "corporate", icon: "briefcase", label: "Companies & visiting teams", short: "Written quote", answer: `Email the trips and dates and the cars come back on one written quote. ${CORPORATE_INVOICE_LINE}`, send: ["Company", "Dates and trips", "Passengers per trip", "Invoice needed?"], href: "/services/corporate", linkLabel: "Corporate transportation", waPrefill: "Salam! Corporate transport in Al Khobar.\n• Company: \n• Dates & trips: \n• Passengers: " + KH_REF },
  ],
  local: {
    eyebrow: "Al Khobar, practically",
    heading: "What to know before booking a car in Al Khobar",
    intro: "Al Khobar is the southern, waterfront end of the Dammam–Dhahran–Khobar metro and the side closest to Bahrain.",
    items: [
      { title: "The Corniche and the Water Tower", body: "Most visitors stay along the Khobar Corniche. Weekend evenings there are busy — a timed pickup or a driver who waits saves a search for a ride when you want to leave." },
      { title: "Bahrain is the short trip here", body: `From Al Khobar the causeway is close, which is why Manama is about ${KH_MANAMA.km} km from here against ${D_MANAMA.km} km from Dammam in our route data.`, href: "/cross-border/saudi-to-bahrain", linkLabel: "Al Khobar to Bahrain over the King Fahd Causeway" },
      { title: "Dhahran is next door", body: "Offices, KFUPM and Ithra in Dhahran are a short drive from Khobar hotels, so many visitors stay in Khobar and work in Dhahran. Give the building or gate name for the Dhahran end.", href: "/locations/dhahran", linkLabel: "Dhahran transfers" },
    ],
  },
  routesHeading: "Routes from and to Al Khobar",
  corridors: [
    { slug: "alkhobar-to-manama", label: "Al Khobar → Manama", note: "The shortest causeway run in the Eastern Province." },
    { slug: "manama-to-alkhobar", label: "Manama → Al Khobar", note: "Back across the causeway to your Khobar hotel." },
    { slug: "alkhobar-to-doha", label: "Al Khobar → Doha", note: "South-east to Qatar through Salwa." },
    { slug: "alkhobar-to-riyadh", label: "Al Khobar → Riyadh", note: "To the capital, door to door." },
    { slug: "riyadh-to-alkhobar", label: "Riyadh → Al Khobar", note: "From any Riyadh address to the Khobar side." },
    { slug: "dammam-airport-to-bahrain", label: "DMM Airport → Bahrain", note: "Land at DMM and go straight across the causeway." },
  ],
  compare: {
    heading: "Al Khobar to Bahrain: pre-booked car or a ride you find on the day?",
    intro: "Both get you across. The difference shows up at the border and on the way back.",
    options: [
      { title: "A ride on the day", when: ["Only if the driver is permitted to cross with passengers", "Fare and crossing fee to be agreed on the spot", "Return trip found separately in Bahrain"] },
      { title: "A pre-booked car", when: ["Crossing fee already in the agreed fare", "Return booked at the same time if you want it", "Luggage and the whole family in one vehicle"] },
    ],
  },
  hourly: { heading: "A driver for a Khobar working day", body: "Hotel on the Corniche, a meeting in Dhahran, lunch back in Khobar, an evening flight from DMM — one car and driver for the hours you need, with the fare for the whole block agreed first.", linkLabel: "Private Driver in Al Khobar", waPrefill: "Salam! Private driver from Al Khobar (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops: \n• Passengers: \n(ref: dammam-private-driver)" },
  vehicleHeading: "Which car for your Al Khobar trip?",
  vehicleIntro: "Set the passengers and bags. Families crossing to Bahrain usually need the SUV or van; the luxury option is for occasions. The car available on your date is confirmed with the quote.",
  vehicleFit: [
    { id: "sedan", label: "Sedan", fleetSlug: "toyota-camry", forWho: "Two or three people, Corniche or office trips" },
    { id: "suv", label: "GMC Yukon XL", fleetSlug: "gmc-yukon-xl", forWho: "A family crossing to Bahrain with luggage" },
    { id: "van", label: "Mercedes V-Class", fleetSlug: "mercedes-v-class", forWho: "Small groups who want to travel together" },
    { id: "hiace", label: "Toyota Hiace", fleetSlug: "toyota-hiace", forWho: "Larger groups" },
    { id: "luxury", label: "Mercedes S-Class", fleetSlug: "mercedes-s-class", forWho: "VIP guests" },
  ],
  timingHeading: "What changes journey times from Al Khobar",
  timing: [
    { title: "Causeway queues", body: "Weekends and public holidays can slow the King Fahd Causeway. Allow extra time when a Bahrain trip is followed by a flight or a meeting." },
    { title: "Corniche weekend evenings", body: "The waterfront road fills up after sunset at weekends. Book the return time in advance." },
    { title: "Airport departures", body: "DMM is on the far side of the metro from Khobar. Work the pickup back from your flight time." },
    { title: "Summer humidity", body: "The coast is hot and humid in summer — plan beach days and outdoor stops for early or late in the day." },
  ],
  corporate: { heading: "Al Khobar business travel, quoted in writing", body: "Visitors staying in Khobar and working in Dhahran or Dammam can have every airport run, office trip and Bahrain crossing on one written quote.", emailSubject: "Corporate transportation RFQ — Al Khobar", emailBody: rfqBody("Al Khobar", "DMM / Khobar / Dhahran / Bahrain") },
  rfqCity: "Al Khobar",
  quote: { heading: "Get your Al Khobar transfer quote", body: "Send both addresses, the date, passengers and luggage — and the flight number for airport trips. We reply on WhatsApp with the car and one fixed fare, usually within 1–2 hours." },
  faqHeading: "Al Khobar transport questions",
  faqs: [
    { question: "Can I take a private car from Al Khobar to Bahrain?", answer: `Yes. Al Khobar to Manama is about ${KH_MANAMA.km} km over the King Fahd Causeway. The vehicle's crossing fee is included in the fare; each passenger carries their own passport and entry documents and goes through the border checks in person.` },
    { question: "Is there a drop-off at the border instead of crossing?", answer: "Not on the Bahrain causeway — there is no way to continue on foot, so the car takes you through to your Bahrain address." },
    { question: "How do I get from DMM Airport to my Al Khobar hotel?", answer: "Pre-book a private car with your flight number. We track the flight, meet you at arrivals and drive you to the hotel; the fare is agreed before you land." },
    { question: "Can I book a short ride inside Al Khobar?", answer: "Yes — any two addresses in Khobar, Dhahran or Dammam, one-way or return, with one fixed fare for the car. For three or more stops in a day, an hourly driver is usually better." },
    { question: "Can I go from Al Khobar to Doha by car?", answer: `Yes, about ${KH_DOHA.km} km through Salwa. Border fees for the vehicle are included; visas are your own.` },
    { question: "Can my company get an invoice?", answer: `Yes. Email the trips for a written quote. ${CORPORATE_INVOICE_LINE}` },
    { question: "Can I cancel?", answer: "Yes, free of charge up to 24 hours before pickup. Changes can be made on WhatsApp." },
    { question: "How do I pay?", answer: "Cash to the driver or bank transfer; an electronic receipt is available on request." },
  ],
  relatedHeading: "More from Al Khobar",
  related: [
    { href: "/locations/dammam", label: "Dammam taxi & King Fahd Airport transfers" },
    { href: "/routes/alkhobar-to-manama", label: "Al Khobar to Manama private car" },
    { href: "/routes/alkhobar-to-doha", label: "Al Khobar to Doha via Salwa" },
    { href: "/blog/eastern-province-corporate-visitor-transport-guide", label: "Eastern Province business visitor guide" },
    { href: "/routes", label: "All routes" },
    { href: "/book", label: "Book online" },
  ],
  finalLine: "Crossing to Bahrain or landing at DMM?",
  schemaName: "Private taxi, transfers & chauffeur service in Al Khobar",
  schemaDescription: "Pre-booked private transport from Al Khobar: Bahrain over the King Fahd Causeway, DMM airport transfers, rides across Khobar, Dhahran and Dammam, hourly drivers, and Doha and Riyadh by road, through a vetted partner network. Fare agreed before booking.",
};

/* ═══ DHAHRAN ═════════════════════════════════════════════════════════ */

const DH_REF = "\n(ref: dhahran-hub)";

export const DHAHRAN_HUB: RegionalHubConfig = {
  slug: "dhahran",
  name: "Dhahran",
  nameAr: "الظهران",
  geo: { lat: 26.2886, lng: 50.114 },
  eyebrow: "Dhahran · Between Dammam and Al Khobar",
  lede: `Pre-booked private cars in Dhahran — ${DMM_DHAHRAN.km} km from King Fahd Airport, for visitors to offices and campuses such as the Saudi Aramco headquarters area, KFUPM and Dhahran Techno Valley, for Ithra, and for trips on to Al Khobar, Dammam and Bahrain.`,
  heroBullets: [`DMM ${DMM_DHAHRAN.km} km`, "Gate & building pickups", "English & Arabic drivers", "24/7"],
  ctaLabel: "Request a Dhahran Quote",
  hubWa: "Salam! Dhahran transport enquiry.\n• From: \n• To (building / gate if known): \n• Date & time: \n• Passengers: \n• Flight number (if airport): " + DH_REF,
  shortAnswer: `Taxi Saudi Arabia arranges pre-booked private cars in Dhahran through a vetted partner network. Dhahran is the closest of the three Eastern Province cities to King Fahd International Airport (DMM) — about ${DMM_DHAHRAN.km} km, ${DMM_DHAHRAN.time}. Visitors send the host company and the gate or building, and the pickup point is agreed in advance; access itself is arranged by the host. The fare is agreed before booking.`,
  facts: [
    { label: "DMM Airport → Dhahran", value: `${DMM_DHAHRAN.km} km · ${DMM_DHAHRAN.time}` },
    { label: "Site access", value: "Arranged by your host" },
    { label: "Pickup point", value: "Agreed from gate / building" },
    { label: "Flights", value: "We track your flight" },
    { label: "Drivers", value: "English- & Arabic-speaking" },
    { label: "Companies", value: "Invoicing via our sister company" },
  ],
  tripHeading: "What do you need in Dhahran?",
  tripIntro: "Most Dhahran bookings are airport legs and visitor pickups. Pick the closest match.",
  trips: [
    { id: "airport", icon: "plane", label: "DMM Airport ↔ Dhahran", short: `${DMM_DHAHRAN.km} km`, answer: `The shortest airport run in the Eastern Province: about ${DMM_DHAHRAN.km} km (${DMM_DHAHRAN.time}). We track the flight, meet you at arrivals, and drive you to your hotel or the building you name.`, send: ["Flight number", "Hotel or building", "Passengers and bags"], href: "/routes/dammam-airport-to-dhahran", linkLabel: "DMM Airport to Dhahran", waPrefill: "Salam! DMM Airport → Dhahran.\n• Flight number: \n• Hotel / building: \n• Date & time: \n• Passengers: " + DH_REF },
    { id: "departure", icon: "plane", label: "Dhahran → DMM Airport", short: "Worked back from your flight", answer: "Tell us the flight time and the pickup building; we plan the pickup so you are not rushing from a meeting to check-in.", send: ["Pickup building / hotel", "Flight time", "Passengers and bags"], href: "/routes/dhahran-to-dammam-airport", linkLabel: "Dhahran to DMM Airport", waPrefill: "Salam! Dhahran → DMM Airport.\n• Pickup: \n• Flight time: \n• Passengers & bags: " + DH_REF },
    { id: "visitor", icon: "briefcase", label: "Visitor pickups at a gate or building", short: "Host arranges access", answer: "Send the host company or department, the gate or building name and your meeting time. We do not arrange entry — your host does — but the driver uses those details to meet you at the right place.", send: ["Host company / department", "Gate or building", "Meeting time", "Where you go next"], href: "#local", linkLabel: "How visitor pickups work", waPrefill: "Salam! Visitor pickup in Dhahran.\n• Host company: \n• Gate / building: \n• Date & time: \n• Going to: " + DH_REF },
    { id: "private-driver", icon: "clock", label: "Driver for a site-visit day", short: "Hourly or full day", answer: "Several buildings, lunch in Al Khobar and a flight at the end — keep one car and driver for the day.", send: ["Date and start time", "Hours", "Buildings / stops", "Passengers"], href: "/locations/dammam/private-driver", linkLabel: "Private driver in Dammam, Khobar & Dhahran", waPrefill: "Salam! Private driver in Dhahran (hourly / full day).\n• Date & start time: \n• Hours needed: \n• Stops: \n• Passengers: \n(ref: dammam-private-driver)" },
    { id: "ithra", icon: "landmark", label: "Ithra visit", short: "With a timed return", answer: "Ithra (King Abdulaziz Center for World Culture) is in Dhahran. Book the drive there and a timed return, or let the car wait if you are going on elsewhere.", send: ["Pickup", "Date and time", "Return time", "Passengers"], href: "#local", linkLabel: "Ithra and visitor tips", waPrefill: "Salam! Trip to Ithra, Dhahran.\n• Pickup: \n• Date & time: \n• Return time: \n• Passengers: " + DH_REF },
    { id: "metro", icon: "hotel", label: "To Al Khobar or Dammam", short: "Hotel, dinner, meetings", answer: "Single rides from Dhahran to a Khobar hotel, the Corniche or a Dammam office — one fixed fare for the car.", send: ["Pickup", "Drop-off", "Date and time"], href: "/locations/alkhobar", linkLabel: "Al Khobar transfers", waPrefill: "Salam! Ride from Dhahran.\n• From: \n• To: \n• Date & time: \n• Passengers: " + DH_REF },
    { id: "bahrain", icon: "route", label: "Bahrain", short: "Over the causeway", answer: `Bahrain is reached over the King Fahd Causeway; from DMM Airport it is about ${DMM_BAHRAIN.km} km. The vehicle crossing fee is included; passengers bring their own documents.`, send: ["Pickup", "Bahrain address", "Date and time", "Passengers"], href: "/cross-border/saudi-to-bahrain", linkLabel: "Saudi Arabia to Bahrain by car", waPrefill: "Salam! Dhahran → Bahrain.\n• From: \n• To: \n• Date & time: \n• Passengers: " + DH_REF },
    { id: "corporate", icon: "briefcase", label: "Visiting teams & contractors", short: "Written quote", answer: `Teams flying in for a week of meetings or audits can have every leg on one written quote. ${CORPORATE_INVOICE_LINE}`, send: ["Company", "Dates", "People", "Buildings / sites"], href: "/services/corporate", linkLabel: "Corporate transportation", waPrefill: "Salam! Corporate transport in Dhahran.\n• Company: \n• Dates & trips: \n• Passengers: " + DH_REF },
  ],
  local: {
    eyebrow: "Visiting Dhahran",
    heading: "How visitor pickups work in Dhahran",
    intro: "Much of Dhahran is offices and campuses with controlled entry. We are not affiliated with any of them; the steps below are about getting the car to the right place.",
    items: [
      { title: "Your host arranges access", body: "Visitor badges and gate clearance come from the company or department you are visiting. Ask them which gate or building to use and pass it on when you book." },
      { title: "Give the gate or building, not just the company", body: "Large sites have more than one entrance. A gate number or building name lets the driver plan the drop-off and the waiting point before the day." },
      { title: "Ithra", body: "The King Abdulaziz Center for World Culture (Ithra) is in Dhahran. Book a timed return, or keep the car if you are going on to Al Khobar for dinner." },
    ],
  },
  routesHeading: "Routes from Dhahran",
  corridors: [
    { slug: "dammam-airport-to-dhahran", label: "DMM Airport → Dhahran", note: "The arrival leg for most Dhahran visitors." },
    { slug: "dhahran-to-dammam-airport", label: "Dhahran → DMM Airport", note: "Departure, worked back from your flight." },
    { slug: "dammam-to-manama", label: "Dammam → Manama", note: "Bahrain over the causeway from the metro." },
    { slug: "dammam-to-riyadh", label: "Dammam → Riyadh", note: `About ${D_RIYADH.km} km to the capital.` },
  ],
  compare: {
    heading: "Visiting Dhahran for a day: separate rides or one driver?",
    intro: "Campus and office sites are spread out, and pickups at a gate can be slow to arrange on the spot.",
    options: [
      { title: "Separate rides", when: ["One building, one meeting", "Back to the hotel straight after", "Plenty of time before your flight"] },
      { title: "One driver for the day", when: ["Several buildings or gates", "Meetings that may run late", "Airport at the end with bags in the car"] },
    ],
  },
  hourly: { heading: "A driver for your Dhahran visit", body: "Morning at one building, afternoon at another, dinner in Al Khobar and the airport after — the driver waits at each stop and the fare for the hours is agreed before you book.", linkLabel: "Private Driver in Dhahran", waPrefill: "Salam! Private driver for a Dhahran visit.\n• Date & start time: \n• Hours needed: \n• Buildings / stops: \n• Passengers: \n(ref: dammam-private-driver)" },
  vehicleHeading: "Which car for a Dhahran visit?",
  vehicleIntro: "One or two visitors usually take an executive sedan; teams take an SUV or van. Availability is confirmed for your date with the quote.",
  vehicleFit: [
    { id: "sedan", label: "Genesis G80", fleetSlug: "genesis-g80", forWho: "One or two visitors" },
    { id: "suv", label: "GMC Yukon XL", fleetSlug: "gmc-yukon-xl", forWho: "A team with laptop bags" },
    { id: "van", label: "Hyundai Staria", fleetSlug: "hyundai-staria", forWho: "Small delegations" },
    { id: "coaster", label: "Toyota Coaster", fleetSlug: "toyota-coaster", forWho: "Larger visiting groups" },
    { id: "luxury", label: "BMW 7 Series", fleetSlug: "bmw-7-series", forWho: "Senior visitors" },
  ],
  timingHeading: "What changes timing in Dhahran",
  timing: [
    { title: "Start and finish of the working day", body: "Roads around large office and campus sites are busiest when shifts and office hours start and end. Leave a margin for morning meetings." },
    { title: "Gate time", body: "Visitor entry can take a while even with clearance. Do not book a tight onward leg straight after arrival at a site." },
    { title: "Airport is close — but plan it", body: `DMM is about ${DMM_DHAHRAN.km} km away. It is the shortest airport run in the region, but it still needs to be worked back from the flight.` },
  ],
  corporate: { heading: "Dhahran visitor transport, quoted in writing", body: "Visiting engineers, auditors and delegations get one written quote for all their airport legs and site days.", emailSubject: "Corporate transportation RFQ — Dhahran", emailBody: rfqBody("Dhahran", "DMM / buildings / Khobar hotel / Bahrain") },
  rfqCity: "Dhahran",
  quote: { heading: "Get your Dhahran transfer quote", body: "Send the pickup, the building or gate, the date, passengers and your flight number if it is an airport leg. We reply with the car and one fixed fare before anything is booked." },
  faqHeading: "Dhahran transport questions",
  faqs: [
    { question: "How far is Dhahran from Dammam airport?", answer: `About ${DMM_DHAHRAN.km} km — roughly ${DMM_DHAHRAN.time} — the shortest airport transfer in the Eastern Province. We track your flight and meet you at arrivals.` },
    { question: "Can you pick up visitors from Aramco, KFUPM or Dhahran Techno Valley?", answer: "Yes, at the gate or building your host gives you. Site access and badges are arranged by your host, not by us, and we are not affiliated with any of these organisations." },
    { question: "What should I send when booking a Dhahran pickup?", answer: "The host company or department, the gate or building name, your meeting time and where you are going next." },
    { question: "Can I keep a driver for the whole day?", answer: "Yes. Book hourly or full-day hire and the driver waits between buildings, then takes you on to Al Khobar or the airport." },
    { question: "Can my company get a written quote and invoice?", answer: `Yes. Email the people, dates and sites. ${CORPORATE_INVOICE_LINE}` },
    { question: "Do drivers speak English?", answer: "Yes. Drivers in our partner network speak English and Arabic, and bookings run 24/7." },
    { question: "Can I cancel?", answer: "Yes, free of charge up to 24 hours before pickup." },
  ],
  relatedHeading: "More from Dhahran",
  related: [
    { href: "/routes/dammam-airport-to-dhahran", label: "DMM Airport to Dhahran" },
    { href: "/routes/dhahran-to-dammam-airport", label: "Dhahran to DMM Airport" },
    { href: "/locations/dammam", label: "Dammam & Eastern Province" },
    { href: "/blog/eastern-province-corporate-visitor-transport-guide", label: "Eastern Province business visitor guide" },
    { href: "/routes", label: "All routes" },
    { href: "/book", label: "Book online" },
  ],
  finalLine: "Visiting Dhahran soon?",
  schemaName: "Private taxi, transfers & chauffeur service in Dhahran",
  schemaDescription: "Pre-booked private transport in Dhahran: DMM airport transfers, visitor pickups at offices and campuses (access arranged by the host), Ithra, hourly drivers and trips to Al Khobar, Dammam and Bahrain, through a vetted partner network.",
};

/* ═══ JUBAIL ══════════════════════════════════════════════════════════ */

const JB_REF = "\n(ref: jubail-hub)";

export const JUBAIL_HUB: RegionalHubConfig = {
  slug: "jubail",
  name: "Jubail",
  nameAr: "الجبيل",
  geo: { lat: 27.0046, lng: 49.6460 },
  eyebrow: "Jubail · Industrial City I & II",
  lede: `Pre-booked private cars for Jubail — about ${DMM_JUBAIL.km} km up the coast from King Fahd Airport — for engineers, contractors and visitors to Jubail Industrial City, crews with equipment, and trips to Dammam, Al Khobar and Kuwait.`,
  heroBullets: [`DMM ${DMM_JUBAIL.km} km`, "Crew vans & coasters", "English & Arabic drivers", "24/7"],
  ctaLabel: "Request a Jubail Quote",
  hubWa: "Salam! Jubail transport enquiry.\n• From: \n• To (company / site if known): \n• Date & time: \n• Passengers & equipment: \n• Flight number (if airport): " + JB_REF,
  shortAnswer: `Taxi Saudi Arabia arranges pre-booked private cars to, from and around Jubail through a vetted partner network. King Fahd International Airport (DMM) is about ${DMM_JUBAIL.km} km away (${DMM_JUBAIL.time}), Kuwait City about ${JB_KUWAIT.km} km. Visitors to plants and offices send the company and site name so the gate and meeting point are agreed in advance; access is arranged by the host. The fare is agreed before booking.`,
  facts: [
    { label: "DMM Airport → Jubail", value: `${DMM_JUBAIL.km} km · ${DMM_JUBAIL.time}` },
    { label: "Jubail → Kuwait City", value: `${JB_KUWAIT.km} km · ${JB_KUWAIT.time}` },
    { label: "Site access", value: "Arranged by your host" },
    { label: "Groups", value: "Vans and coasters on request" },
    { label: "Flights", value: "We track your flight" },
    { label: "Companies", value: "Invoicing via our sister company" },
  ],
  tripHeading: "What kind of Jubail trip is it?",
  tripIntro: "Most Jubail bookings are airport legs and site visits. Pick one — each lists what we need.",
  trips: [
    { id: "airport", icon: "plane", label: "DMM Airport → Jubail", short: `${DMM_JUBAIL.km} km`, answer: `About ${DMM_JUBAIL.km} km (${DMM_JUBAIL.time}) from the terminal to your hotel, camp or site gate. We track the flight; the first ${FREE_WAIT} of waiting are free.`, send: ["Flight number", "Hotel, camp or site", "Passengers and equipment"], href: "/routes/dammam-airport-to-jubail", linkLabel: "DMM Airport to Jubail transfer", waPrefill: "Salam! DMM Airport → Jubail.\n• Flight number: \n• Hotel / camp / site: \n• Date & time: \n• Passengers & equipment: " + JB_REF },
    { id: "departure", icon: "plane", label: "Jubail → DMM Airport", short: "Worked back from the flight", answer: "Pickup time is planned from your flight, with a margin for the drive down the coast.", send: ["Pickup", "Flight time", "Passengers and bags"], href: "/routes/jubail-to-dammam-airport", linkLabel: "Jubail to DMM Airport", waPrefill: "Salam! Jubail → DMM Airport.\n• Pickup: \n• Flight time: \n• Passengers & bags: " + JB_REF },
    { id: "site", icon: "briefcase", label: "Site and plant visits", short: "Company + gate name", answer: "Send the company, the site and the gate you were given. Entry is arranged by your host; the driver meets you at the agreed point and waits if you book by the hour.", send: ["Company and site", "Gate", "Date and time", "Passengers"], href: "#local", linkLabel: "How site pickups work", waPrefill: "Salam! Jubail site visit.\n• Company / site: \n• Gate: \n• Date & time: \n• Passengers: " + JB_REF },
    { id: "crew", icon: "route", label: "Crews with equipment", short: "Hiace, coaster", answer: "Teams travelling with tools or cases need the right vehicle. Tell us the headcount and what you are carrying and we size the van or coaster.", send: ["Headcount", "Equipment / luggage", "Pickup and site", "Dates"], href: "/services/group-transport", linkLabel: "Group transportation", waPrefill: "Salam! Crew transport in Jubail.\n• Headcount: \n• Equipment / luggage: \n• Pickup & site: \n• Dates: " + JB_REF },
    { id: "private-driver", icon: "clock", label: "Driver for the day", short: "Jubail and back", answer: "A day of site meetings in Jubail from a Dammam or Khobar hotel — keep one car and driver, and the return is already in the booking.", send: ["Date and start time", "Hours", "Sites", "Passengers"], href: "/locations/dammam/private-driver", linkLabel: "Private driver in the Eastern Province", waPrefill: "Salam! Private driver for a Jubail day.\n• Date & start time: \n• Hours needed: \n• Sites: \n• Passengers: \n(ref: dammam-private-driver)" },
    { id: "metro", icon: "hotel", label: "To Dammam, Khobar or Dhahran", short: "Hotels and offices", answer: "Single transfers down the coast to a hotel, office or meeting in the Dammam metro.", send: ["Pickup", "Drop-off", "Date and time"], href: "/locations/dammam", linkLabel: "Dammam & Eastern Province", waPrefill: "Salam! Jubail → Dammam / Khobar.\n• From: \n• To: \n• Date & time: \n• Passengers: " + JB_REF },
    { id: "kuwait", icon: "route", label: "Kuwait by road", short: `${JB_KUWAIT.km} km`, answer: `Jubail to Kuwait City is about ${JB_KUWAIT.km} km (${JB_KUWAIT.time}). The vehicle's border fees are included; entry documents are each passenger's own.`, send: ["Pickup", "Kuwait address", "Date and time", "Passengers"], href: "/routes/jubail-to-kuwait", linkLabel: "Jubail to Kuwait City private transfer", waPrefill: "Salam! Jubail → Kuwait.\n• From: \n• To: \n• Date & time: \n• Passengers: " + JB_REF },
    { id: "corporate", icon: "briefcase", label: "Contractor & company bookings", short: "Written quote", answer: `Rotations, site weeks and visiting teams can be quoted in writing for all the trips and dates. ${CORPORATE_INVOICE_LINE}`, send: ["Company", "Dates", "Headcount", "Sites"], href: "/services/corporate", linkLabel: "Corporate transportation", waPrefill: "Salam! Corporate transport in Jubail.\n• Company: \n• Dates & trips: \n• Headcount: " + JB_REF },
  ],
  local: {
    eyebrow: "Jubail, practically",
    heading: "Getting around Jubail Industrial City",
    intro: "Jubail is a long way from the airport and much of the industrial city is behind controlled gates. These are the details that make a booking go smoothly.",
    items: [
      { title: "Site and gate name, every time", body: "Plants and offices in Industrial City I and II have their own entrances. The company name alone is not enough — send the site and the gate your host gave you." },
      { title: "The airport is over an hour away", body: `DMM is about ${DMM_JUBAIL.km} km from Jubail. Book the airport legs in advance, especially for early flights.`, href: "/routes/jubail-to-dammam-airport", linkLabel: "Jubail to DMM Airport" },
      { title: "Off-shift time", body: "Jubail Corniche and the beaches are where visitors go after work. A timed return saves looking for a ride back to the hotel or camp." },
    ],
  },
  routesHeading: "Routes from and to Jubail",
  corridors: [
    { slug: "dammam-airport-to-jubail", label: "DMM Airport → Jubail", note: "Arrivals heading north to Jubail." },
    { slug: "jubail-to-dammam-airport", label: "Jubail → DMM Airport", note: "Departures, planned back from the flight." },
    { slug: "jubail-to-kuwait", label: "Jubail → Kuwait City", note: "North along the coast through the Kuwait border." },
  ],
  routesFootnote: "For Dammam, Al Khobar and Dhahran, use the hub: Dammam & Eastern Province.",
  compare: {
    heading: "Jubail for a site week: hourly driver or separate transfers?",
    intro: "It depends on how fixed your days are.",
    options: [
      { title: "Separate transfers", when: ["Same hotel-to-site trip every day", "Fixed start and finish times", "Airport legs only at the start and end"] },
      { title: "Driver by the hour or day", when: ["Several sites in one day", "Finish times that change", "Meetings in Dammam or Al Khobar as well"] },
    ],
  },
  hourly: { heading: "A driver for a Jubail site day", body: "From a hotel in Dammam or Al Khobar up to Jubail and back, with stops at more than one site — one car and driver, waiting while you are inside, with the fare for the whole day agreed first.", linkLabel: "Private Driver for Jubail", waPrefill: "Salam! Private driver for a Jubail site day.\n• Date & start time: \n• Hours needed: \n• Sites: \n• Passengers: \n(ref: dammam-private-driver)" },
  vehicleHeading: "Which vehicle for Jubail?",
  vehicleIntro: "Crews with tools usually need a Hiace or Coaster; visiting managers a sedan or SUV. Confirmed for your date with the quote.",
  vehicleFit: [
    { id: "sedan", label: "Toyota Camry", fleetSlug: "toyota-camry", forWho: "One to three visitors" },
    { id: "suv", label: "GMC Yukon XL", fleetSlug: "gmc-yukon-xl", forWho: "Managers with luggage" },
    { id: "starex", label: "Hyundai Starex", fleetSlug: "hyundai-starex", forWho: "Small crews with lots of bags" },
    { id: "hiace", label: "Toyota Hiace", fleetSlug: "toyota-hiace", forWho: "Crews with equipment" },
    { id: "coaster", label: "Toyota Coaster", fleetSlug: "toyota-coaster", forWho: "Large teams" },
  ],
  timingHeading: "What changes timing in Jubail",
  timing: [
    { title: "Shift changes", body: "Roads into the industrial city are busiest at shift-change times. Leave a margin for morning arrivals at a site." },
    { title: "The coast road to DMM", body: `About ${DMM_JUBAIL.km} km — plan airport pickups from the flight time, not from habit.` },
    { title: "Summer heat", body: "Site visits in summer are best early in the day; the car waits close by between buildings if you book by the hour." },
  ],
  corporate: { heading: "Jubail contractor transport, quoted in writing", body: "Site weeks, rotations and visiting teams can run on one written quote for every airport leg and daily trip.", emailSubject: "Corporate transportation RFQ — Jubail", emailBody: rfqBody("Jubail", "DMM / sites / hotel / Dammam") },
  rfqCity: "Jubail",
  quote: { heading: "Get your Jubail transfer quote", body: "Send the pickup, the company and site, the date, headcount and any equipment — and the flight number for airport trips. We reply with the vehicle and one fixed fare." },
  faqHeading: "Jubail transport questions",
  faqs: [
    { question: "How far is Jubail from Dammam airport?", answer: `About ${DMM_JUBAIL.km} km — roughly ${DMM_JUBAIL.time}. We track your flight and meet you at arrivals, and the fare is agreed before you travel.` },
    { question: "Can you pick up from inside Jubail Industrial City?", answer: "At the gate or point your host gives you. Send the company, site and gate when you book. Entry is arranged by your host, not by us." },
    { question: "Can you move a crew with tools or equipment?", answer: "Yes, in vans such as the Toyota Hiace or a Coaster through our partner network. Tell us the headcount and what you are carrying so the vehicle fits." },
    { question: "Can I book a car from Jubail to Kuwait?", answer: `Yes, about ${JB_KUWAIT.km} km. The vehicle's border fees are included; passengers bring their own entry documents.` },
    { question: "Can my company get a written quote and invoice?", answer: `Yes — email the dates, headcount and sites. ${CORPORATE_INVOICE_LINE}` },
    { question: "Is transport available for night or early shifts?", answer: "Yes, bookings run 24/7. Pre-book early pickups so the car is planned the evening before." },
    { question: "Can I cancel?", answer: "Yes, free of charge up to 24 hours before pickup." },
  ],
  relatedHeading: "More from Jubail",
  related: [
    { href: "/routes/dammam-airport-to-jubail", label: "Dammam Airport to Jubail transfer" },
    { href: "/routes/jubail-to-kuwait", label: "Jubail to Kuwait City private transfer" },
    { href: "/cross-border/saudi-to-kuwait", label: "Jubail and Eastern Province to Kuwait by car" },
    { href: "/locations/dammam", label: "Dammam & Eastern Province" },
    { href: "/locations/dhahran", label: "Dhahran visitor transport" },
    { href: "/blog/eastern-province-corporate-visitor-transport-guide", label: "Eastern Province business visitor guide" },
    { href: "/services/car-recovery/jubail", label: "Jubail car recovery & tow truck (satha)" },
    { href: "/routes", label: "All routes" },
    { href: "/book", label: "Book online" },
  ],
  finalLine: "Heading to Jubail for work?",
  schemaName: "Private taxi, transfers & chauffeur service in Jubail",
  schemaDescription: "Pre-booked private transport for Jubail: DMM airport transfers, site and plant visitor pickups (access arranged by the host), crew vans and coasters, hourly drivers and trips to Dammam, Al Khobar and Kuwait, through a vetted partner network.",
};

export const EASTERN_HUBS: Record<string, RegionalHubConfig> = {
  alkhobar: ALKHOBAR_HUB,
  dhahran: DHAHRAN_HUB,
  jubail: JUBAIL_HUB,
};
