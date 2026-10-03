// Cross-border corridor data — single source for /cross-border/[corridor]
// hubs, the cross-border block on /routes/[slug], and route-specific
// WhatsApp prefills. Added 2026-10-03.
//
// Truth rules (CLAUDE.md §2, §16, §17):
// - Distances/times are NEVER written here — they are read from ROUTES_DATA.
// - Border entity names were verified 2026-10-03 (see seo/venues.md "Borders"):
//   King Fahd Causeway; Salwa (SA) – Abu Samra (QA), the only Saudi–Qatar land
//   crossing (Wikipedia / QIC); Al Khafji (SA) – Al Nuwaiseeb (KW), the main
//   direct Saudi–Kuwait crossing (Wikipedia "Al-Nuwaiseeb", Wego);
//   Al Batha (SA) – Ghuwaifat (AE); Al Durrah / Durra crossing between Haql
//   (SA) and Aqaba (JO), ~30 km from each (Wikipedia "Durra Border Crossing").
// - No wait times, fees, visa rules, permits, fast-track or vehicle-permit
//   claims. Documents are always the passenger's responsibility; vehicle
//   eligibility for a crossing is confirmed per booking.
// - Oman is deliberately NOT a corridor: no route, no confirmed operation
//   (facts.md). Listed in seo/clusters/CROSS-BORDER-ROUTE-MATRIX.md instead.
import { ROUTES_DATA } from "./routes";

export type CorridorSlug =
  | "saudi-to-bahrain"
  | "saudi-to-qatar"
  | "saudi-to-kuwait"
  | "saudi-to-uae"
  | "saudi-to-jordan";

export interface Corridor {
  slug: CorridorSlug;
  /** Destination country, e.g. "Bahrain". */
  country: string;
  /** Short label for cards/breadcrumbs, e.g. "Saudi Arabia ↔ Bahrain". */
  pairLabel: string;
  title: string;
  description: string;
  h1: string;
  primaryKeyword: string;
  /** Border entity used in copy, e.g. "the King Fahd Causeway". */
  crossingName: string;
  saudiSide: string;
  otherSide: string;
  /** One-line note about the crossing (no times, no fees). */
  crossingNote: string;
  quickAnswer: string;
  overview: string[];
  /** Ordered journey stages for the visual. */
  journey: { label: string; title: string; desc: string; kind: "origin" | "border" | "destination" }[];
  outbound: string[];
  inbound: string[];
  practical: { title: string; desc: string }[];
  useCases: { title: string; desc: string }[];
  /** Border drop-off (lower fare) offered on this corridor — owner-confirmed
   *  2026-10-03. Off for Bahrain: the causeway has no way to continue on foot. */
  borderDrop: boolean;
  /** Honest trade-off section (§15 AIO). */
  tradeOff?: { heading: string; body: string[] };
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string }[];
}

export const CORRIDORS: Record<CorridorSlug, Corridor> = {
  "saudi-to-bahrain": {
    slug: "saudi-to-bahrain",
    borderDrop: false,
    country: "Bahrain",
    pairLabel: "Saudi Arabia ↔ Bahrain",
    title: "Saudi to Bahrain Taxi & Private Car | King Fahd Causeway",
    description:
      "Saudi to Bahrain taxi and private car with driver — Dammam, Al Khobar, Riyadh and Dammam Airport to Manama and back over the King Fahd Causeway. Fixed fare on WhatsApp.",
    h1: "Saudi to Bahrain taxi & private car over the King Fahd Causeway",
    primaryKeyword: "saudi to bahrain taxi",
    crossingName: "the King Fahd Causeway",
    saudiSide: "Al Khobar end of the causeway",
    otherSide: "Bahrain end of the causeway",
    crossingNote:
      "The King Fahd Causeway is the only road link between Saudi Arabia and Bahrain. Saudi exit and Bahrain entry checks both take place on the causeway itself.",
    quickAnswer:
      "A Saudi to Bahrain taxi with Taxi Saudi Arabia is a pre-booked private car with a professional driver that collects you at your door in the Eastern Province or Riyadh and drives you over the King Fahd Causeway to your address in Bahrain. Al Khobar to Manama is about 50 km and Dammam to Manama about 70 km; border time is extra and varies. Each passenger carries their own valid travel documents.",
    overview: [
      "Most Saudi–Bahrain trips start in the Eastern Province: Al Khobar and Dhahran sit closest to the causeway, Dammam a little further north, and King Fahd International Airport (DMM) about 100 km from Manama by road. Riyadh is the long-haul origin at roughly 450 km.",
      "On the Bahrain side we drop at hotels and homes in Manama, Seef, Juffair and elsewhere on the island, or at Bahrain International Airport (BAH) in Muharraq. The same corridor runs in reverse for Bahrain residents heading into Saudi Arabia.",
    ],
    journey: [
      { label: "Pickup", title: "Your door in Saudi Arabia", desc: "Hotel, home, office or DMM arrivals in Dammam, Al Khobar, Dhahran or Riyadh.", kind: "origin" },
      { label: "Saudi exit", title: "Causeway — Saudi checks", desc: "Every passenger completes their own Saudi exit check on the causeway.", kind: "border" },
      { label: "Bahrain entry", title: "Causeway — Bahrain checks", desc: "Bahrain immigration and customs, also on the causeway.", kind: "border" },
      { label: "Drop-off", title: "Your address in Bahrain", desc: "Manama, Seef, Juffair, Muharraq / BAH airport or any address on the island.", kind: "destination" },
    ],
    outbound: ["alkhobar-to-manama", "dammam-to-manama", "dammam-airport-to-bahrain", "riyadh-to-manama"],
    inbound: ["manama-to-alkhobar", "manama-to-dammam", "bahrain-to-dammam-airport", "manama-to-riyadh"],
    practical: [
      { title: "Plan around causeway traffic", desc: "Causeway traffic is usually heaviest around weekends and public holidays. If you have a flight or a meeting, tell us and we set the pickup time with extra margin." },
      { title: "Flights on either side", desc: "Flying out of DMM or BAH? Say so when you book — the airport routes below are planned with check-in time, not just drive time." },
      { title: "Same-day return", desc: "A business day in Manama and back the same evening can be booked as a return trip with the driver waiting, or as two one-way legs." },
      { title: "Causeway toll included", desc: "The King Fahd Causeway toll for the vehicle is included in your fixed fare. Not every car can cross, so the vehicle and driver are confirmed as eligible before we quote." },
    ],
    useCases: [
      { title: "Weekend & family trips", desc: "Eastern Province families crossing to Bahrain with children and luggage — SUV or van, one car door to door." },
      { title: "Business between Al Khobar and Manama", desc: "Executive sedan for meetings, recurring commuter trips and visiting staff — written quote on request." },
      { title: "Airport connections", desc: "DMM arrivals continuing to Bahrain, and Bahrain residents catching flights from DMM." },
    ],
    tradeOff: {
      heading: "Private car or self-drive across the causeway?",
      body: [
        "Driving yourself is cheapest if you already own a car that is cleared to cross and you are comfortable with causeway queues. A private car with a driver makes more sense when you are arriving by air, travelling with family and luggage, need to work on the way, or do not want to handle a rental car's cross-border conditions.",
        "From Riyadh the choice is different: the train to Dammam plus a short car leg can suit solo travellers, while a direct car is simpler for groups and door-to-door trips — see our Riyadh to Bahrain taxi vs train guide.",
      ],
    },
    faqs: [
      { question: "How long is the drive from Dammam to Bahrain?", answer: "Dammam to Manama is about 70 km, roughly an hour of driving across the King Fahd Causeway. From Al Khobar it is about 50 km. Time at the border is extra and varies with traffic and checks, so allow a margin if you have a flight." },
      { question: "Which border crossing is used between Saudi Arabia and Bahrain?", answer: "The King Fahd Causeway — it is the only road link between the two countries. Saudi exit and Bahrain entry checks both happen on the causeway, and every passenger completes them in person." },
      { question: "Can I book a taxi from Dammam Airport straight to Bahrain?", answer: "Yes. A driver meets you at King Fahd International Airport (DMM) and drives you to your address in Bahrain, about 105 km by road. Share your flight number when you book and we check it before pickup." },
      { question: "What documents do I need to travel from Saudi Arabia to Bahrain by car?", answer: "Each passenger needs a valid passport or accepted ID and the right to enter Bahrain, and Saudi residents generally need a valid exit and re-entry visa. Requirements change, so confirm current rules with official sources before travel — we do not arrange visas." },
      { question: "Can the driver wait in Bahrain and bring me back?", answer: "Yes. Book a return trip and the driver can wait for a few hours, or collect you on a later date. Waiting time is included in the written quote so the total is clear before you confirm." },
      { question: "Can a company get a written quote and invoice for Bahrain trips?", answer: "Yes. Email an RFQ with your dates, passengers and vehicles and we reply with a written quote. Corporate invoicing can be arranged through our sister company." },
    ],
    related: [
      { href: "/services/corporate-bahrain-transport", label: "Corporate transport between Saudi Arabia and Bahrain" },
      { href: "/airports/king-fahd-dammam", label: "Dammam Airport (DMM) transfers" },
      { href: "/locations/alkhobar", label: "Al Khobar chauffeur service" },
      { href: "/locations/dammam", label: "Dammam private car service" },
      { href: "/guides/riyadh-to-bahrain-taxi-vs-train", label: "Riyadh to Bahrain: taxi vs train" },
    ],
  },

  "saudi-to-qatar": {
    slug: "saudi-to-qatar",
    borderDrop: true,
    country: "Qatar",
    pairLabel: "Saudi Arabia ↔ Qatar",
    title: "Saudi to Qatar Private Transfer by Car | Salwa Border",
    description:
      "Private transfer from Saudi Arabia to Qatar by car — Dammam, Al Ahsa and Riyadh to Doha and back via the Salwa–Abu Samra border. Professional driver, fixed fare on WhatsApp.",
    h1: "Saudi to Qatar private transfer by car via the Salwa border",
    primaryKeyword: "saudi to qatar private transfer",
    crossingName: "the Salwa border",
    saudiSide: "Salwa (Saudi Arabia)",
    otherSide: "Abu Samra (Qatar)",
    crossingNote:
      "Salwa on the Saudi side and Abu Samra on the Qatari side form the only land crossing between Saudi Arabia and Qatar. Abu Samra is roughly 90 km from Doha.",
    quickAnswer:
      "A Saudi to Qatar private transfer is a pre-booked car with a professional driver from your door in Saudi Arabia to your address in Doha, crossing at Salwa (Saudi side) and Abu Samra (Qatar side) — the only land border between the two countries. Al Ahsa is the closest major Saudi city (about 265 km to Doha), Dammam and Al Khobar about 400 km, Riyadh about 580 km. Border crossing fees are included in the fixed fare; each passenger carries their own documents.",
    overview: [
      "Three Saudi cities feed this corridor. Al Ahsa (Hofuf) is the shortest gateway; Dammam, Al Khobar and Dhahran are the busiest origins; Riyadh suits business travellers who want to skip a flight connection and work on the way.",
      "In Qatar we drop at hotels, homes and offices across Doha — West Bay, The Pearl, Msheireb, Lusail — or at Hamad International Airport (DOH). Return trips from Doha to the Eastern Province and Riyadh run the same way in reverse.",
    ],
    journey: [
      { label: "Pickup", title: "Your door in Saudi Arabia", desc: "Dammam, Al Khobar, Al Ahsa or Riyadh — home, hotel or office.", kind: "origin" },
      { label: "Saudi exit", title: "Salwa border post", desc: "Saudi exit checks at Salwa, completed by each passenger in person.", kind: "border" },
      { label: "Qatar entry", title: "Abu Samra border post", desc: "Qatar entry checks at Abu Samra, about 90 km from Doha.", kind: "border" },
      { label: "Drop-off", title: "Your address in Doha", desc: "West Bay, The Pearl, Lusail, Msheireb, Hamad International Airport or any address.", kind: "destination" },
    ],
    outbound: ["dammam-to-doha", "alkhobar-to-doha", "dammam-airport-to-doha", "alahsa-to-doha", "riyadh-to-doha"],
    inbound: ["doha-to-dammam", "doha-to-alahsa", "doha-to-riyadh"],
    practical: [
      { title: "Landing at Dammam airport?", desc: "Go straight from King Fahd International Airport (DMM) to Doha — no night in Dammam needed. Share your flight number when you book." },
      { title: "Qatar-side vehicle requirements", desc: "Qatar applies its own rules to vehicles entering at Abu Samra. Whether the car for your date meets them is confirmed before we send your fare." },
      { title: "Long stretch without towns", desc: "The road between Al Ahsa and Salwa is long and open. Rest and prayer stops are planned with you — mention children, elderly passengers or medical needs." },
      { title: "Flying out of Doha?", desc: "Tell us your flight time at Hamad International Airport and we plan the pickup with border time and check-in in mind." },
    ],
    useCases: [
      { title: "Business between Dammam and Doha", desc: "Executive sedan or SUV for contractors, engineers and visiting staff — written quotes for companies." },
      { title: "Family visits", desc: "Saudi- and Qatar-based families travelling with luggage in an SUV or van, door to door." },
      { title: "Events and stopovers in Doha", desc: "One car for the round trip with the driver waiting, or two one-way legs on separate dates." },
    ],
    faqs: [
      { question: "Which border do you use to drive from Saudi Arabia to Qatar?", answer: "Salwa on the Saudi side and Abu Samra on the Qatari side. It is the only land crossing between the two countries, so every Saudi–Qatar road transfer uses it." },
      { question: "How far is Dammam from Doha by car?", answer: "Our Dammam to Doha route is listed at about 400 km, roughly 4 hours of driving plus time at the Salwa–Abu Samra border, which varies with traffic and checks." },
      { question: "What is the closest Saudi city to Qatar?", answer: "Of the major cities, Al Ahsa (Hofuf) is the closest to the Salwa border, which makes Al Ahsa to Doha the shortest of our Saudi–Qatar routes." },
      { question: "What documents do I need to enter Qatar by road?", answer: "Each passenger needs a valid passport or accepted ID and the right to enter Qatar; Saudi residents generally also need a valid exit and re-entry visa. Rules change, so confirm current requirements with official sources before travel. We do not arrange visas." },
      { question: "Can I book a return trip from Doha to Saudi Arabia?", answer: "Yes. Doha to Dammam and Doha to Riyadh run as their own routes, or the same driver can wait in Doha and bring you back as a return booking." },
      { question: "Can my company get a written quote for Qatar transfers?", answer: "Yes. Send an email RFQ with routes, dates, passengers and vehicles and we reply in writing. Corporate invoicing can be arranged through our sister company." },
    ],
    related: [
      { href: "/locations/dammam", label: "Dammam private car service" },
      { href: "/locations/alkhobar", label: "Al Khobar chauffeur service" },
      { href: "/airports/king-fahd-dammam", label: "Dammam Airport (DMM) transfers" },
      { href: "/services/corporate", label: "Corporate & delegation transport" },
    ],
  },

  "saudi-to-kuwait": {
    slug: "saudi-to-kuwait",
    borderDrop: true,
    country: "Kuwait",
    pairLabel: "Saudi Arabia ↔ Kuwait",
    title: "Saudi to Kuwait Private Transfer by Car | Khafji Border",
    description:
      "Private car with driver between Saudi Arabia and Kuwait — Dammam, Al Khobar, Jubail and Riyadh to Kuwait City and back via the Al Khafji–Nuwaiseeb border. Fixed fare on WhatsApp.",
    h1: "Saudi to Kuwait private transfer via the Al Khafji border",
    primaryKeyword: "saudi to kuwait by car",
    crossingName: "the Al Khafji–Nuwaiseeb border",
    saudiSide: "Al Khafji (Saudi Arabia)",
    otherSide: "Al Nuwaiseeb (Kuwait)",
    crossingNote:
      "Al Khafji on the Saudi side and Al Nuwaiseeb on the Kuwaiti side form the main, most direct road crossing between the two countries, on the Gulf coast.",
    quickAnswer:
      "A Saudi to Kuwait private transfer is a pre-booked car with a professional driver from your door in Saudi Arabia to Kuwait City, normally crossing at Al Khafji (Saudi side) and Al Nuwaiseeb (Kuwait side) on the Gulf coast. Dammam to Kuwait City is about 436 km and Riyadh about 650 km. Border time is extra and varies; each passenger carries their own valid documents.",
    overview: [
      "The coastal road north from Dammam passes Jubail before reaching Al Khafji, so pickups in Al Khobar, Dhahran and Jubail are quoted on the same corridor as Dammam. Riyadh trips are longer and suit business travellers and families who prefer one car over a flight plus transfers.",
      "In Kuwait we drop at hotels, homes and offices across Kuwait City and its suburbs, and the corridor runs in reverse for Kuwait residents travelling to the Eastern Province or Riyadh.",
    ],
    journey: [
      { label: "Pickup", title: "Your door in Saudi Arabia", desc: "Dammam, Al Khobar, Jubail or Riyadh — home, hotel or office.", kind: "origin" },
      { label: "Saudi exit", title: "Al Khafji border post", desc: "Saudi exit checks, completed by each passenger in person.", kind: "border" },
      { label: "Kuwait entry", title: "Al Nuwaiseeb border post", desc: "Kuwait entry checks on the Kuwaiti side of the crossing.", kind: "border" },
      { label: "Drop-off", title: "Your address in Kuwait", desc: "Kuwait City hotels, homes, offices or the airport area.", kind: "destination" },
    ],
    outbound: ["dammam-to-kuwait", "riyadh-to-kuwait"],
    inbound: ["kuwait-to-dammam", "kuwait-to-riyadh"],
    practical: [
      { title: "Pickups along the coast", desc: "Jubail and Al Khobar pickups use the same coastal road as Dammam — ask for a quote on the Dammam route with your exact address." },
      { title: "Busy evenings at the crossing", desc: "The crossing can be slow on weekend evenings and holiday eves. Morning departures are usually easier to plan around." },
      { title: "Routing from Riyadh", desc: "From Riyadh the routing to the border is confirmed with you when we quote, based on your pickup point and timing." },
      { title: "Vehicle confirmed per booking", desc: "The car and driver for your trip are confirmed as eligible to cross before we send the fare." },
    ],
    useCases: [
      { title: "Industrial and oil-sector travel", desc: "Engineers and contractors between Jubail, Dammam and Kuwait — written quotes and recurring bookings for companies." },
      { title: "Family visits", desc: "Families travelling with luggage in an SUV or van, one car door to door." },
      { title: "Kuwait residents heading south", desc: "Kuwait City to the Eastern Province or Riyadh for business, family or onward flights." },
    ],
    faqs: [
      { question: "Which border is used to drive from Saudi Arabia to Kuwait?", answer: "Our Kuwait routes normally cross at Al Khafji on the Saudi side and Al Nuwaiseeb on the Kuwaiti side — the main, most direct crossing between the two countries." },
      { question: "How far is Dammam from Kuwait City by car?", answer: "Dammam to Kuwait City is about 436 km, roughly 4 hours of driving plus time at the Al Khafji–Nuwaiseeb border, which varies with traffic and checks." },
      { question: "Can you pick me up in Jubail or Al Khobar for Kuwait?", answer: "Yes. Both sit on the same coastal corridor as Dammam. Give us your exact address and we quote it on the Dammam to Kuwait route." },
      { question: "What documents do I need to travel to Kuwait by road?", answer: "Each passenger needs a valid passport or accepted ID and the right to enter Kuwait; Saudi residents generally also need a valid exit and re-entry visa. Confirm current rules with official sources before travel — we do not arrange visas." },
      { question: "Can I book a car from Kuwait to Saudi Arabia?", answer: "Yes. Kuwait to Dammam and Kuwait to Riyadh are bookable routes with pickup from your address in Kuwait." },
    ],
    related: [
      { href: "/locations/dammam", label: "Dammam private car service" },
      { href: "/locations/alkhobar", label: "Al Khobar chauffeur service" },
      { href: "/services/corporate", label: "Corporate & delegation transport" },
    ],
  },

  "saudi-to-uae": {
    slug: "saudi-to-uae",
    borderDrop: true,
    country: "UAE",
    pairLabel: "Saudi Arabia ↔ UAE",
    title: "Saudi to UAE by Car — Private Transfer to Dubai & Abu Dhabi",
    description:
      "Private car with driver from Saudi Arabia to Dubai and Abu Dhabi — Riyadh, Dammam and Jeddah routes via the Al Batha–Ghuwaifat border. Long-haul chauffeur, fixed fare on WhatsApp.",
    h1: "Saudi to UAE by car: private transfer to Dubai & Abu Dhabi",
    primaryKeyword: "saudi to uae by car",
    crossingName: "the Al Batha–Ghuwaifat border",
    saudiSide: "Al Batha (Saudi Arabia)",
    otherSide: "Ghuwaifat (UAE)",
    crossingNote:
      "Road trips between Saudi Arabia and the UAE cross at Al Batha on the Saudi side and Ghuwaifat on the UAE side, at the western end of Abu Dhabi emirate.",
    quickAnswer:
      "Travelling from Saudi Arabia to the UAE by car with Taxi Saudi Arabia means one pre-booked private car with a professional driver, crossing at Al Batha (Saudi side) and Ghuwaifat (UAE side). Riyadh to Dubai is about 990 km and Riyadh to Abu Dhabi about 850 km, so these are full-day drives plus border time. Each passenger carries their own valid documents.",
    overview: [
      "This is the longest of our GCC corridors. From Riyadh or the Eastern Province the road runs south-east to the Al Batha crossing, then along the coast through Abu Dhabi emirate. Abu Dhabi comes first; Dubai is further on.",
      "People choose the car over a flight when they are moving with a lot of luggage, travelling as a family or group, relocating, or want door-to-door travel without two airport transfers. For a single traveller with a small bag, flying is usually faster — we say so honestly below.",
    ],
    journey: [
      { label: "Pickup", title: "Your door in Saudi Arabia", desc: "Riyadh, Dammam, Al Khobar or Jeddah — home, hotel or office.", kind: "origin" },
      { label: "Saudi exit", title: "Al Batha border post", desc: "Saudi exit checks, completed by each passenger in person.", kind: "border" },
      { label: "UAE entry", title: "Ghuwaifat border post", desc: "UAE entry checks at the western edge of Abu Dhabi emirate.", kind: "border" },
      { label: "Drop-off", title: "Abu Dhabi or Dubai", desc: "Hotel, home, office or airport — Abu Dhabi first, Dubai further along the coast.", kind: "destination" },
    ],
    outbound: ["riyadh-to-dubai", "riyadh-to-abudhabi", "dammam-to-dubai", "dammam-to-abudhabi", "jeddah-to-abudhabi"],
    inbound: ["dubai-to-riyadh"],
    practical: [
      { title: "It is a full day", desc: "Expect a full day on the road plus the border. Rest, meal and prayer stops are planned with you; overnight stops can be quoted for families." },
      { title: "Early starts help", desc: "An early departure means more of the drive is done in daylight and you arrive in the UAE at a sensible hour." },
      { title: "Sharjah and the northern emirates", desc: "Drop-offs beyond Dubai are quoted on request — tell us the exact address." },
      { title: "Vehicle confirmed per booking", desc: "The car and driver for your date are confirmed as eligible to cross before we send the fare." },
    ],
    useCases: [
      { title: "Relocation with luggage", desc: "Moving between Riyadh and Dubai with suitcases and boxes — SUV or van, one fare." },
      { title: "Families and groups", desc: "Several passengers in one car is often simpler than flights plus two airport transfers each side." },
      { title: "Business travel", desc: "Executive sedan or SUV for staff who prefer to work on the road — written quote for companies." },
    ],
    tradeOff: {
      heading: "Fly or drive from Riyadh to Dubai?",
      body: [
        "Flying is faster for a solo traveller with light luggage: the flight itself is short, even after airport time on both ends. Driving takes a full day plus the border.",
        "A private car wins when you are three or more people, carrying a lot of luggage, travelling with children or elderly relatives, or want to leave from your door and arrive at your door with no check-in, baggage limits or transfers. From Jeddah the drive is very long — we usually suggest flying and booking a private car on each end.",
      ],
    },
    faqs: [
      { question: "Can I travel from Saudi Arabia to the UAE by car?", answer: "Yes. Road trips cross at Al Batha on the Saudi side and Ghuwaifat on the UAE side. We arrange a private car with a professional driver from your address in Saudi Arabia to your address in Abu Dhabi or Dubai." },
      { question: "How long is the drive from Riyadh to Dubai?", answer: "Riyadh to Dubai is about 990 km, roughly 9 hours of driving plus time at the Al Batha–Ghuwaifat border and rest stops. Plan it as a full day." },
      { question: "Is it better to fly or drive from Riyadh to Dubai?", answer: "Flying is faster for one person with little luggage. A private car makes more sense for families, groups, heavy luggage or relocation, because it runs door to door with no airport transfers or baggage limits." },
      { question: "What documents do I need to drive into the UAE?", answer: "Each passenger needs a valid passport or accepted ID and the right to enter the UAE; Saudi residents generally also need a valid exit and re-entry visa. Requirements change, so confirm with official sources before travel. We do not arrange visas." },
      { question: "Can I book a car from Dubai to Riyadh?", answer: "Yes. Dubai to Riyadh is a bookable route with pickup from your address in Dubai. Other UAE origins are quoted on request." },
    ],
    related: [
      { href: "/locations/abudhabi", label: "Abu Dhabi cross-border car service" },
      { href: "/blog/riyadh-to-dubai-taxi-gcc-road-trip", label: "Riyadh to Dubai by road — trip guide" },
      { href: "/locations/riyadh", label: "Riyadh chauffeur service" },
      { href: "/services/long-distance", label: "Long-distance private transfers" },
    ],
  },

  "saudi-to-jordan": {
    slug: "saudi-to-jordan",
    borderDrop: true,
    country: "Jordan",
    pairLabel: "Saudi Arabia ↔ Jordan",
    title: "Saudi to Jordan Private Transfer | Tabuk, NEOM to Aqaba & Amman",
    description:
      "Private transfer from Saudi Arabia to Jordan — Tabuk, NEOM, AlUla and Madinah to Aqaba, Petra, Wadi Rum and Amman via the Halat Ammar or Al Durrah crossing. Fixed fare, border fees included.",
    h1: "Saudi to Jordan private transfer: Aqaba, Petra, Wadi Rum & Amman",
    primaryKeyword: "saudi to jordan private transfer",
    crossingName: "the Halat Ammar and Al Durrah crossings",
    saudiSide: "Halat Ammar or Al Durrah (Saudi Arabia)",
    otherSide: "Al Mudawwara or Durra (Jordan)",
    crossingNote:
      "Two crossings serve our Jordan routes, and we always use the shorter road. Halat Ammar–Al Mudawwara, about 110 km north of Tabuk, is the inland crossing for Amman, Petra and Wadi Rum. Al Durrah–Durra, on the Gulf of Aqaba coast about 30 km from both Haql and Aqaba, is the crossing for Aqaba and for trips starting on the NEOM coast.",
    quickAnswer:
      "A Saudi to Jordan private transfer is a pre-booked car with a professional driver from north-west Saudi Arabia — Tabuk, NEOM, AlUla or Madinah — into Jordan by the shortest road. Trips to Amman, Petra and Wadi Rum cross inland at Halat Ammar–Al Mudawwara; trips to Aqaba, and from the NEOM coast, cross at Al Durrah near Haql. Border crossing fees are included in the fixed fare; border time varies, and each passenger carries their own valid documents.",
    overview: [
      "Every Jordan trip has four parts: your Saudi pickup (Tabuk, NEOM, AlUla or Madinah), the Saudi exit, Jordan entry, and the onward drive. Which crossing you use depends on where you are going. For Aqaba, the coast road leads to Al Durrah near Haql. For Petra, Wadi Rum and Amman, the inland road from Tabuk leads to Halat Ammar and Al Mudawwara, then Ma'an and the Desert Highway.",
      "Short trips to Aqaba suit NEOM staff, Tabuk residents and Red Sea visitors. The longer Amman legs suit travellers who want one car from a Saudi city to the Jordanian capital; for the longest origins we will tell you honestly when flying is the better option.",
    ],
    journey: [
      { label: "Saudi pickup", title: "Tabuk, NEOM, AlUla or Madinah", desc: "Home, hotel, project site or airport pickup in north-west Saudi Arabia.", kind: "origin" },
      { label: "Saudi exit", title: "Halat Ammar or Al Durrah", desc: "Halat Ammar for Amman, Petra and Wadi Rum; Al Durrah near Haql for Aqaba. Each passenger completes the checks in person.", kind: "border" },
      { label: "Jordan entry", title: "Al Mudawwara or Durra", desc: "Al Mudawwara leads on to Ma'an and the Desert Highway; Durra is about 30 km from Aqaba.", kind: "border" },
      { label: "Onward in Jordan", title: "Aqaba, Wadi Rum, Petra, Amman", desc: "Drop-off at your hotel, camp or address.", kind: "destination" },
    ],
    outbound: ["haql-to-aqaba", "tabuk-to-aqaba", "neom-to-aqaba", "alula-to-aqaba", "tabuk-to-wadi-rum", "tabuk-to-petra", "tabuk-to-amman", "neom-to-amman", "alula-to-amman", "medinah-to-amman"],
    inbound: ["aqaba-to-tabuk", "aqaba-to-neom"],
    practical: [
      { title: "Shortest road, every time", desc: "From Tabuk, Amman is about 130 km shorter through Halat Ammar than via Aqaba. We use whichever crossing is shorter for your trip." },
      { title: "Border fees included", desc: "Border crossing fees for the vehicle are included in your fixed fare. Personal visa or entry fees are the passenger's own." },
      { title: "Camps and remote stays", desc: "For Wadi Rum camps, share the camp's meeting point — some camps collect guests from a village meeting point rather than the camp itself." },
      { title: "Long origins", desc: "From AlUla or Madinah to Amman the drive is very long. We will quote it, and also tell you if a flight plus a private car is the better plan." },
    ],
    useCases: [
      { title: "NEOM and Tabuk professionals", desc: "Weekend and leave trips to Aqaba and Amman — executive sedan or SUV, return bookings." },
      { title: "Heritage travellers", desc: "AlUla and Hegra visitors continuing to Petra and Wadi Rum in one private car." },
      { title: "Families visiting Jordan", desc: "Door-to-door with luggage instead of connecting flights." },
    ],
    faqs: [
      { question: "Which border crossing do you use between Saudi Arabia and Jordan?", answer: "Whichever is shorter for your trip. Halat Ammar–Al Mudawwara, about 110 km north of Tabuk, for Amman, Petra and Wadi Rum. Al Durrah–Durra on the Gulf of Aqaba coast, near Haql, for Aqaba and for trips starting on the NEOM coast." },
      { question: "Can I take a private car from Tabuk to Aqaba?", answer: "Yes. A driver collects you in Tabuk and drives about 270 km west through Haql and across the Al Durrah crossing to your address in Aqaba. Each passenger completes their own exit and entry checks at the border." },
      { question: "Can you take me from Saudi Arabia to Petra or Wadi Rum?", answer: "Yes. Tabuk to Petra (about 275 km) and Tabuk to Wadi Rum (about 230 km) both cross at Halat Ammar–Al Mudawwara. AlUla to Petra or Wadi Rum can be quoted on request." },
      { question: "What documents do I need to enter Jordan by road from Saudi Arabia?", answer: "Each passenger needs a valid passport and the right to enter Jordan; Saudi residents generally also need a valid exit and re-entry visa. Entry rules depend on nationality and change, so confirm with official sources before travel. We do not arrange visas." },
      { question: "Do you operate taxis inside Jordan?", answer: "No. We arrange private cross-border transfers that start or end in Saudi Arabia. We are not a local Jordanian taxi service." },
    ],
    related: [
      { href: "/locations/tabuk", label: "Tabuk chauffeur & airport transfers" },
      { href: "/locations/neom", label: "NEOM private transfers" },
      { href: "/locations/alula", label: "AlUla private driver" },
      { href: "/services/heritage-tours", label: "Heritage tours & private day charters" },
    ],
  },
};

export const CORRIDOR_SLUGS = Object.keys(CORRIDORS) as CorridorSlug[];

type RouteRow = (typeof ROUTES_DATA)[number];

export function corridorRoutes(c: Corridor): { outbound: RouteRow[]; inbound: RouteRow[] } {
  const pick = (slugs: string[]) =>
    slugs.map((s) => ROUTES_DATA.find((r) => r.slug === s)).filter((r): r is RouteRow => Boolean(r));
  return { outbound: pick(c.outbound), inbound: pick(c.inbound) };
}

const ROUTE_TO_CORRIDOR: Record<string, CorridorSlug> = Object.fromEntries(
  CORRIDOR_SLUGS.flatMap((k) => [...CORRIDORS[k].outbound, ...CORRIDORS[k].inbound].map((s) => [s, k])),
);

export function getCorridorForRoute(slug: string): Corridor | null {
  const k = ROUTE_TO_CORRIDOR[slug];
  return k ? CORRIDORS[k] : null;
}

/** "Doha, Qatar" stays as-is; "Kuwait City" → "Kuwait City, Kuwait";
 *  a Saudi city gets ", Saudi Arabia". Used in WhatsApp prefills. */
export function placeWithCountry(city: string, corridor: Corridor): string {
  if (city.includes(",")) return city;
  if (/^kuwait/i.test(city)) return "Kuwait City, Kuwait";
  if (/^bahrain/i.test(city)) return "Bahrain";
  if (city === corridor.country) return city;
  return `${city}, Saudi Arabia`;
}

export function isSaudiSide(city: string, corridor: Corridor): boolean {
  return placeWithCountry(city, corridor).endsWith("Saudi Arabia");
}

/** Route-specific structured WhatsApp prefill for cross-border routes. */
export function crossBorderWhatsAppText(fromCity: string, toCity: string, corridor: Corridor): string {
  return (
    `Hello, I'd like a quote for a private cross-border transfer from ${placeWithCountry(fromCity, corridor)} to ${placeWithCountry(toCity, corridor)}.\n\n` +
    `• Pickup address: \n• Drop-off address: \n• Date & time: \n• Passengers & large bags: \n• Vehicle (Sedan / SUV / Van): \n• Trip type (one-way / return): \n` +
    (corridor.borderDrop && isSaudiSide(fromCity, corridor) ? `• Service (door-to-door / border drop-off): \n` : "") +
    `\n` +
    `Please confirm availability and the total fare.`
  );
}

export function corridorWhatsAppText(corridor: Corridor): string {
  return (
    `Hello, I'd like a quote for a private cross-border transfer between Saudi Arabia and ${corridor.country}.\n\n` +
    `• From (city / address): \n• To (city / address): \n• Date & time: \n• Passengers & large bags: \n• Vehicle (Sedan / SUV / Van): \n• Trip type (one-way / return): \n\n` +
    `Please confirm availability and the total fare.`
  );
}

export function corridorRfqMailto(email: string, corridor: Corridor, routeLabel?: string): string {
  const subject = `Corporate cross-border RFQ — ${routeLabel ?? corridor.pairLabel.replace("↔", "–")}`;
  const body =
    `Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for private cross-border transfers${routeLabel ? ` (${routeLabel})` : ` between Saudi Arabia and ${corridor.country}`}.\n\n` +
    `• Company name: \n• Contact name & role: \n• Route(s): \n• Dates & times: \n• Passengers per trip: \n• Vehicles (Executive sedan / SUV / Van / Coaster): \n• One-way or return / waiting: \n• Invoicing needed (VAT / PO)?: \n\n` +
    `Our travellers carry their own valid travel documents. Please confirm vehicle availability and a fixed fare before booking.\n\nThank you.`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Shared, deliberately hedged — applies to every corridor. */
export const CROSS_BORDER_DOCUMENTS = [
  "A valid passport (or the ID your nationality may use for this crossing) for every passenger, including children.",
  "The right to enter the destination country — visa, eVisa or exemption, depending on nationality.",
  "Saudi residents: a valid exit and re-entry visa where it applies.",
  "Requirements change. Confirm current entry rules with official sources before you travel — we do not arrange visas or immigration.",
];

export const CROSS_BORDER_STEPS = [
  { title: "Send your trip", desc: "Route, date, passengers, luggage and vehicle — by form, WhatsApp or email." },
  { title: "Written fixed fare", desc: "We confirm a vehicle and driver eligible for your crossing and send one fixed fare, with border crossing fees included. No meter, no surge." },
  { title: "Door-to-door pickup", desc: "Your driver collects you at the agreed address and time." },
  { title: "Border checks", desc: "Each passenger completes their own exit and entry checks. Border time varies and is never guaranteed." },
  { title: "Drop-off", desc: "Straight to your hotel, home, office or airport on the other side." },
];

export const CROSS_BORDER_FARE_FACTORS = [
  "Exact pickup and drop-off addresses",
  "Border crossing and total distance",
  "Vehicle class — executive sedan, full-size SUV, van",
  "Passengers and large bags",
  "Date and time of travel",
  "One-way, return or driver waiting (15–30 min free waiting included)",
];
