// Distance / journey guide pages — info-intent ("how far is X from Y").
// Distinct from /routes/* (booking-intent). Distances & times mirror the real
// values in routes.ts. NO invented prices, NO fake claims — only verifiable
// road/journey facts. Rendered by <DistanceGuidePremium/>; each page links to
// its matching /routes/* for booking. Every guide has GENUINELY distinct copy,
// imagery, tips and FAQs — not a duplicated template.

export interface WhyCard { img: string; title: string; body: string }
export interface Tip { icon: "sunrise" | "fuel" | "luggage" | "clock" | "map" | "shield" | "route" | "prayer"; text: string }
export interface CompareRow { mode: "Private taxi" | "Flight" | "Train"; best?: boolean; detail: string }
export interface RelatedLink { href: string; label: string; img: string }

export interface DistanceGuide {
  slug: string;
  fromCity: string;
  toCity: string;
  /** Real approximate driving distance in km (matches routes.ts). */
  km: number;
  /** Real approximate driving time in minutes (matches routes.ts). */
  driveMinutes: number;
  /** Human driving-time label, e.g. "9–10 hours". */
  driveLabel: string;
  /** Main highway / road actually used (short name). */
  highway: string;
  /** Real towns/stops along the way. */
  stops: string[];
  /** Images (from taxidriver/public). Hero should suit THIS journey. */
  heroImage: string;
  fromImage: string;
  toImage: string;
  /** Middle image for the route strip. */
  routeStripImage: string;
  /** One-line hero value proposition. */
  valueProp: string;
  /** "Why private taxi" — 2 genuinely distinct paragraphs. */
  whoBooks: string[];
  /** 3 supporting cards with real service photos. */
  whyCards: WhyCard[];
  /** Intro paragraph for the route section. */
  routeIntro: string;
  /** Per-vehicle "who fits" line, in order [sedan, suv, van]. */
  vehicleFits: [string, string, string];
  /** Honest transport comparison (no fake prices). */
  compare: CompareRow[];
  /** Factual travel tips. */
  tips: Tip[];
  faqs: { question: string; answer: string }[];
  related: RelatedLink[];
  /** Matching /routes/* slug for the booking CTA. */
  routeSlug: string;
}

export const DISTANCE_GUIDES: DistanceGuide[] = [
  {
    slug: "riyadh-to-jeddah",
    fromCity: "Riyadh",
    toCity: "Jeddah",
    km: 950,
    driveMinutes: 540,
    driveLabel: "9–10 hours",
    highway: "Highway 40",
    stops: ["Dawadmi", "Afif", "Al Quway'iyah"],
    heroImage: "/gallery/highway-travel.webp",
    fromImage: "/locations/riyadh-hero.webp",
    toImage: "/locations/jeddah-hero.webp",
    routeStripImage: "/gallery/highway-travel.webp",
    valueProp:
      "A private, door-to-door car with a professional driver for the full 950 km between the capital and the Red Sea coast — travel on your own schedule, with your family and luggage, for one fixed fare confirmed on WhatsApp.",
    whoBooks: [
      "The Riyadh–Jeddah corridor is one of the Kingdom's longest, crossing open desert from the inland capital to the Red Sea coast. The travellers who choose a private car over a flight are usually families relocating or visiting relatives, pilgrims continuing on to Makkah, business travellers who want to work or rest along the way, and groups for whom four or five plane tickets cost more than a single car.",
      "A private taxi is not a shared shuttle — it is one vehicle and one driver, exclusively for your party, from your Riyadh doorstep to your Jeddah destination.",
    ],
    whyCards: [
      { img: "/gallery/luggage-assist.webp", title: "Travel with luggage & family", body: "No baggage limits or extra-bag fees. Load what you need, keep everyone together, and let the driver handle the bags." },
      { img: "/gallery/business-transfer.webp", title: "Work or rest on the way", body: "A quiet, private cabin means you can answer emails, take calls, or sleep across the long desert stretch — not queue at an airport." },
      { img: "/gallery/chauffeur-portrait.webp", title: "One driver, door to door", body: "Pickup from your Riyadh address and drop-off at your Jeddah destination, with a professional driver who knows the road." },
    ],
    routeIntro:
      "The drive follows Highway 40, the main multi-lane road between Riyadh and the west. It runs through open desert with fuel stations and rest areas near the main towns — most travellers stop once or twice for fuel, food, and prayer.",
    vehicleFits: ["1–3 passengers · 2 bags", "4–6 passengers · 4–5 bags", "up to 7 · extra luggage"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door, ~9–10 hrs, one fixed fare for the whole party, stops when you want. Best for families, groups, and luggage." },
      { mode: "Flight", detail: "~1 hr 20 min in the air, but add airport time both ends, baggage limits, and per-person tickets." },
      { mode: "Train", detail: "No direct Riyadh–Jeddah passenger rail. The Haramain line only serves the west (Makkah–Madinah–Jeddah)." },
    ],
    tips: [
      { icon: "sunrise", text: "Start early so you finish the last stretch in daylight and reach Jeddah by evening." },
      { icon: "fuel", text: "Fuel up in Riyadh and top up at Dawadmi or Afif — station gaps grow in the middle of the route." },
      { icon: "luggage", text: "For families, an SUV or van is far more comfortable than a sedan on a full-day drive." },
      { icon: "clock", text: "Pre-book, especially for early departures — your driver and vehicle are confirmed in advance." },
    ],
    faqs: [
      { question: "How far is Riyadh from Jeddah by road?", answer: "Riyadh to Jeddah is about 950 km on Highway 40, the main road linking the capital to the Red Sea coast." },
      { question: "How long is the drive from Riyadh to Jeddah?", answer: "The drive takes roughly 9 to 10 hours, depending on stops, traffic, and speed. Most travellers break the journey once or twice for fuel, food, and prayer." },
      { question: "Is it better to fly or take a private taxi from Riyadh to Jeddah?", answer: "A flight is faster in the air (about 1 hour 20 minutes), but you add airport check-in, security, and baggage time on both ends, and pay per person. A private taxi is one fixed fare for the whole party, door-to-door, with luggage and stops on your schedule — which often wins for families and groups." },
      { question: "How much does a Riyadh to Jeddah taxi cost?", answer: "The fare depends on your vehicle (sedan, SUV, or van), pickup time, and passenger count. We confirm one fixed price on WhatsApp before you book — no surge and no hidden fees." },
      { question: "Can the taxi pick me up from home and drop me at my Jeddah hotel?", answer: "Yes. It is a fully door-to-door service — pickup from any Riyadh address, home, or hotel, and drop-off at any Jeddah address, hotel, or the airport." },
      { question: "Is there a train from Riyadh to Jeddah?", answer: "No — there is currently no direct passenger railway between Riyadh and Jeddah. The Haramain high-speed line only runs in the west between Makkah, Madinah, and Jeddah. A private car is the most comfortable door-to-door option." },
      { question: "What vehicle should I choose for the Riyadh to Jeddah journey?", answer: "A sedan suits 1–3 passengers with light luggage, a GMC Yukon SUV suits 4–6 with more bags, and a Hyundai Staria van suits up to 7. For larger groups we arrange a Hiace or Coaster on request." },
    ],
    related: [
      { href: "/routes/riyadh-to-jeddah", label: "Riyadh to Jeddah taxi (book this route)", img: "/locations/jeddah-hero.webp" },
      { href: "/routes/riyadh-to-makkah", label: "Riyadh to Makkah taxi", img: "/locations/makkah-hero.webp" },
      { href: "/routes/riyadh-to-dammam", label: "Riyadh to Dammam taxi", img: "/locations/dammam-hero.webp" },
      { href: "/distance/jeddah-to-makkah", label: "Jeddah to Makkah distance guide", img: "/locations/makkah-hero.webp" },
    ],
    routeSlug: "riyadh-to-jeddah",
  },

  {
    slug: "makkah-to-madinah",
    fromCity: "Makkah",
    toCity: "Madinah",
    km: 430,
    driveMinutes: 240,
    driveLabel: "about 4 hours",
    highway: "Makkah–Madinah Expressway",
    stops: ["Rabigh", "Badr junction", "Rest area near the Miqat"],
    heroImage: "/gallery/madinah-drive.webp",
    fromImage: "/locations/makkah-hero.webp",
    toImage: "/locations/madinah-hero.webp",
    routeStripImage: "/gallery/ziyarat-tour.webp",
    valueProp:
      "A private car or van between the two Holy Cities — about 430 km with prayer and rest stops on request, dropping you right at your Madinah hotel near Masjid an-Nabawi. One fixed fare, confirmed on WhatsApp.",
    whoBooks: [
      "Makkah to Madinah is the classic pilgrim corridor, travelled by millions during Umrah and Hajj. Most who book a private car are families and groups with luggage who want a door-to-door trip on their own timing, without dragging bags through train stations — often after completing Umrah and heading to the Prophet's Mosque.",
      "Because the whole party shares one vehicle and one driver, it suits elderly travellers and families with children who need flexible prayer and rest stops along the way.",
    ],
    whyCards: [
      { img: "/gallery/umrah-family.webp", title: "Comfortable for families & elderly", body: "A private cabin with room to rest, flexible prayer stops, and help with luggage — ideal after the exertion of Umrah." },
      { img: "/gallery/ziyarat-tour.webp", title: "Add a Ziyarat stop", body: "Ask your driver to include a stop at the Badr battlefield on the way — a meaningful detour many pilgrims add." },
      { img: "/gallery/luggage-assist.webp", title: "Door to your Madinah hotel", body: "Straight from your Makkah hotel to your accommodation near Masjid an-Nabawi, with bags handled for you." },
    ],
    routeIntro:
      "The drive uses the modern Makkah–Madinah expressway, heavily travelled by pilgrims, with frequent fuel stations, restaurants, and rest areas. The direct road passes areas that non-Muslims may not enter around Makkah.",
    vehicleFits: ["1–3 pilgrims · light bags", "4–6 with luggage", "up to 7 · group + luggage"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door, ~4 hrs, with prayer and rest stops on request — the usual choice for pilgrims with luggage and family." },
      { mode: "Train", detail: "The Haramain High-Speed Railway links the two cities in about 2 hours, but you still need transfers to and from the stations with your bags." },
      { mode: "Flight", detail: "No practical direct flight for this short domestic sector; road or the Haramain train are the options." },
    ],
    tips: [
      { icon: "prayer", text: "Ask for a prayer stop — the route has well-kept mosques and rest areas." },
      { icon: "sunrise", text: "Travel after Fajr or in the evening to avoid the midday heat on the open stretches." },
      { icon: "clock", text: "During Hajj and peak Umrah dates, pre-book in advance as demand is very high." },
      { icon: "route", text: "A Ziyarat detour to Badr adds history to the journey — mention it when you book." },
    ],
    faqs: [
      { question: "How far is Makkah from Madinah?", answer: "Makkah to Madinah is about 430 km by road on the Makkah–Madinah expressway." },
      { question: "How long is the drive from Makkah to Madinah?", answer: "The drive takes roughly 4 hours, with fuel and prayer stops available along the way." },
      { question: "Is there a train from Makkah to Madinah?", answer: "Yes — the Haramain High-Speed Railway links Makkah and Madinah in about 2 hours, though you need to reach and leave the stations with your luggage. A private taxi is door-to-door with luggage help." },
      { question: "Can the taxi drop me at my hotel near Masjid an-Nabawi?", answer: "Yes. We drop you as close to your Madinah hotel and the Prophet's Mosque as vehicle access allows, with help for your luggage." },
      { question: "Can you include a Ziyarat stop at Badr on the way?", answer: "Yes. Many pilgrims add a stop at the Badr battlefield between Makkah and Madinah — tell us when you book and the driver will include it." },
      { question: "How much is a taxi from Makkah to Madinah?", answer: "The fare depends on your vehicle and group size. We confirm one fixed price on WhatsApp before booking — no surge, prayer and rest stops included." },
      { question: "Do you have vans for Umrah groups on this route?", answer: "Yes — alongside sedans we arrange SUVs, Hyundai Staria vans, and larger Hiace/Coaster vehicles for groups travelling together with luggage." },
    ],
    related: [
      { href: "/routes/makkah-to-madinah", label: "Makkah to Madinah taxi (book this route)", img: "/locations/madinah-hero.webp" },
      { href: "/distance/jeddah-to-makkah", label: "Jeddah to Makkah distance guide", img: "/locations/makkah-hero.webp" },
      { href: "/services/umrah-transport", label: "Umrah transport service", img: "/gallery/umrah-family.webp" },
      { href: "/services/madinah-ziyarat", label: "Madinah Ziyarat tours", img: "/gallery/ziyarat-tour.webp" },
    ],
    routeSlug: "makkah-to-madinah",
  },

  {
    slug: "riyadh-to-dammam",
    fromCity: "Riyadh",
    toCity: "Dammam",
    km: 390,
    driveMinutes: 210,
    driveLabel: "about 3.5 hours",
    highway: "Highway 40",
    stops: ["Al Kharj junction", "Midway rest areas", "Al Hofuf turn-off"],
    heroImage: "/gallery/business-transfer.webp",
    fromImage: "/locations/riyadh-hero.webp",
    toImage: "/locations/dammam-hero.webp",
    routeStripImage: "/gallery/highway-travel.webp",
    valueProp:
      "A private, door-to-door car for the 390 km between the capital and the Eastern Province — about 3.5 hours on a fast expressway, ideal for business and family travel, with one fixed fare confirmed on WhatsApp.",
    whoBooks: [
      "Riyadh to Dammam is one of the busiest business corridors in the Kingdom, linking the capital with the Dammam–Khobar–Dhahran metro area and the Aramco heartland. Executives and companies book private cars for reliable, on-time door-to-door travel, while families use it for weekend and holiday trips to the Eastern Province coast.",
      "Because the route continues naturally to Al Khobar, Dhahran, and even across the King Fahd Causeway to Bahrain, many travellers book it as the first leg of a longer journey.",
    ],
    whyCards: [
      { img: "/gallery/business-transfer.webp", title: "Reliable for business", body: "On-time pickups, a professional driver, and a quiet cabin to work or take calls between the capital and the Eastern Province." },
      { img: "/gallery/airport-meet.webp", title: "Airport & meeting transfers", body: "Connect to King Fahd Airport (DMM) or straight to a meeting in Khobar or Dhahran, with waiting time on request." },
      { img: "/gallery/luggage-assist.webp", title: "Onward to Bahrain", body: "The same trip extends across the King Fahd Causeway — book a through journey from Riyadh all the way to Manama." },
    ],
    routeIntro:
      "The drive follows Highway 40, a fast, well-maintained expressway across the desert to the Eastern Province, with plenty of fuel stations and rest stops. Traffic is busiest near Riyadh and around the Dammam/Khobar exits.",
    vehicleFits: ["1–3 passengers · 2 bags", "4–6 · business or family", "up to 7 · group + luggage"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door, ~3.5 hrs, flexible and comfortable for business travellers and families — and it can continue to Khobar, Dhahran, or Bahrain." },
      { mode: "Train", detail: "The Saudi Railway (SAR) runs a Riyadh–Dammam passenger service in about 4 hours station to station, plus transfers." },
      { mode: "Flight", detail: "Short flights between Riyadh (RUH) and Dammam (DMM) take under an hour in the air, plus airport time on both ends." },
    ],
    tips: [
      { icon: "clock", text: "For same-day meetings, book a return with waiting time so your car is ready when you are." },
      { icon: "route", text: "Heading to Bahrain? Ask for a through booking across the King Fahd Causeway." },
      { icon: "fuel", text: "Rest stops around Al Kharj and midway make good points for fuel, food, and prayer." },
      { icon: "map", text: "Expect busier traffic near Riyadh and around the Dammam and Khobar exits." },
    ],
    faqs: [
      { question: "How far is Riyadh from Dammam?", answer: "Riyadh to Dammam is about 390 km by road on Highway 40." },
      { question: "How long does it take to drive from Riyadh to Dammam?", answer: "The drive takes roughly 3.5 hours on the expressway, depending on traffic and stops." },
      { question: "Is there a train between Riyadh and Dammam?", answer: "Yes — the Saudi Railway (SAR) runs a passenger service that takes about 4 hours station to station. A private car is door-to-door and often more convenient with luggage." },
      { question: "Can the taxi continue from Dammam to Al Khobar or Bahrain?", answer: "Yes. The route continues naturally to Al Khobar and Dhahran, and across the King Fahd Causeway to Bahrain — ask for a through booking when you message us." },
      { question: "Do you offer return trips with waiting time for business?", answer: "Yes. Executives often book a same-day return with the driver waiting during meetings in the Eastern Province — tell us your schedule for a quote." },
      { question: "How much is a taxi from Riyadh to Dammam?", answer: "The fare depends on your vehicle and timing. We confirm one fixed price on WhatsApp before booking — no surge, tolls included." },
      { question: "What vehicle is best for Riyadh to Dammam?", answer: "A sedan suits 1–3 business travellers, a GMC Yukon SUV suits families or teams of 4–6, and a Staria van suits up to 7 with luggage." },
    ],
    related: [
      { href: "/routes/riyadh-to-dammam", label: "Riyadh to Dammam taxi (book this route)", img: "/locations/dammam-hero.webp" },
      { href: "/routes/alkhobar-to-manama", label: "Khobar to Bahrain (causeway) taxi", img: "/locations/alkhobar-hero.webp" },
      { href: "/services/corporate-bahrain-transport", label: "Corporate Bahrain transport", img: "/gallery/business-transfer.webp" },
      { href: "/distance/riyadh-to-jeddah", label: "Riyadh to Jeddah distance guide", img: "/locations/jeddah-hero.webp" },
    ],
    routeSlug: "riyadh-to-dammam",
  },

  {
    slug: "jeddah-to-makkah",
    fromCity: "Jeddah",
    toCity: "Makkah",
    km: 85,
    driveMinutes: 70,
    driveLabel: "about 1 hr 10 min",
    highway: "Highway 40",
    stops: ["Miqat (Ihram)", "Haramain checkpoint"],
    heroImage: "/gallery/makkah-drive.webp",
    fromImage: "/locations/jeddah-hero.webp",
    toImage: "/locations/makkah-hero.webp",
    routeStripImage: "/gallery/umrah-family.webp",
    valueProp:
      "The first leg of Umrah for most pilgrims — a private car straight from Jeddah airport or city to your Makkah hotel near the Haram, about 85 km, with a Miqat stop for Ihram. One fixed fare, confirmed on WhatsApp.",
    whoBooks: [
      "Jeddah to Makkah is the most travelled pilgrim corridor in Saudi Arabia. Most who book a private taxi are pilgrims arriving at King Abdulaziz International Airport (JED) who want to go straight to Makkah after a long flight — the driver meets them at arrivals, helps with luggage, and stops at the Miqat so they can enter Ihram.",
      "Families and groups prefer a private car because it is door-to-door with room for luggage, avoiding the transfers and waiting that come with the train or shared transport. Only Muslims may enter the city limits of Makkah.",
    ],
    whyCards: [
      { img: "/gallery/airport-meet.webp", title: "Meet & greet at JED", body: "Your driver waits at arrivals with a name sign — even for late-night or delayed flights — and helps with your luggage." },
      { img: "/gallery/umrah-family.webp", title: "Miqat stop for Ihram", body: "A stop at the Miqat so you can change into Ihram and make your intention before entering Makkah." },
      { img: "/gallery/luggage-assist.webp", title: "Straight to your hotel", body: "Drop-off as close to your Makkah hotel and Masjid al-Haram as vehicle access allows, with luggage help." },
    ],
    routeIntro:
      "The drive is a short, fast run on Highway 40 connecting Jeddah and the airport with the Holy Mosque. Keep passports and documents ready at the Haramain checkpoint; non-Muslims may not enter Makkah's city limits.",
    vehicleFits: ["1–3 pilgrims · light bags", "4–6 with luggage", "up to 7 · family + luggage"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door from the airport, ~1 hr 10 min, with a Miqat stop and luggage help — the usual choice for pilgrims arriving at Jeddah." },
      { mode: "Train", detail: "The Haramain High-Speed Railway links Jeddah and Makkah in about 30 minutes, though you still reach and leave the stations with your bags." },
      { mode: "Flight", detail: "No flight for this short sector; road or the Haramain train are the options." },
    ],
    tips: [
      { icon: "prayer", text: "Ask for a Miqat stop so you can enter Ihram and make your intention before Makkah." },
      { icon: "clock", text: "Landing late at night? Pre-book — a confirmed driver waits even for delayed flights." },
      { icon: "shield", text: "Keep passports handy at the Haramain checkpoint; only Muslims may enter Makkah." },
      { icon: "luggage", text: "For families with luggage, a Staria van or GMC SUV is more comfortable than a sedan." },
    ],
    faqs: [
      { question: "How far is Jeddah from Makkah?", answer: "Jeddah city to Makkah is about 85 km by road; from Jeddah Airport it is roughly 80 km." },
      { question: "How long is the drive from Jeddah to Makkah?", answer: "The drive takes about 1 hour 10 minutes on the expressway, a little more from the airport in peak Umrah traffic." },
      { question: "Is there a train from Jeddah to Makkah?", answer: "Yes — the Haramain High-Speed Railway links Jeddah and Makkah in about 30 minutes. A private taxi is door-to-door with a Miqat stop for Ihram and luggage help." },
      { question: "Will the driver stop at the Miqat for Ihram?", answer: "Yes. On request the driver stops at the Miqat so you can change into Ihram and make your intention before entering Makkah." },
      { question: "Do you meet pilgrims at Jeddah Airport (JED)?", answer: "Yes. We track your flight and the driver waits at arrivals with a name sign, even for late or delayed flights, and helps with luggage." },
      { question: "How much is a taxi from Jeddah to Makkah?", answer: "The fare depends on your vehicle and pickup point. We confirm one fixed price on WhatsApp before booking — no surge, tolls included." },
      { question: "Can non-Muslims travel to Makkah?", answer: "No — only Muslims may enter the city limits of Makkah. Keep passports and documents ready at the Haramain checkpoint." },
    ],
    related: [
      { href: "/routes/jeddah-to-makkah", label: "Jeddah to Makkah taxi (book this route)", img: "/locations/makkah-hero.webp" },
      { href: "/routes/jeddah-airport-to-makkah", label: "Jeddah Airport to Makkah taxi", img: "/gallery/airport-meet.webp" },
      { href: "/distance/makkah-to-madinah", label: "Makkah to Madinah distance guide", img: "/locations/madinah-hero.webp" },
      { href: "/services/umrah-transport", label: "Umrah transport service", img: "/gallery/umrah-family.webp" },
    ],
    routeSlug: "jeddah-to-makkah",
  },

  {
    slug: "jeddah-to-madinah",
    fromCity: "Jeddah",
    toCity: "Madinah",
    km: 420,
    driveMinutes: 240,
    driveLabel: "about 4 hours",
    highway: "Highway 5 / 15",
    stops: ["Rabigh", "Mastura rest area", "Badr junction"],
    heroImage: "/gallery/madinah-drive.webp",
    fromImage: "/locations/jeddah-hero.webp",
    toImage: "/locations/madinah-hero.webp",
    routeStripImage: "/gallery/highway-travel.webp",
    valueProp:
      "A private car from Jeddah or its airport straight to your Madinah hotel near Masjid an-Nabawi — about 420 km with luggage and prayer stops handled for you. One fixed fare, confirmed on WhatsApp.",
    whoBooks: [
      "Many pilgrims fly into King Abdulaziz International Airport (JED) and travel on to Madinah first, or head there after completing Umrah in Makkah. A private car suits families and groups who land with luggage and want a direct, door-to-door trip rather than transfers through train stations.",
      "It is also popular with travellers on flexible schedules — an early-morning or late-night departure is no problem when you have your own vehicle and driver.",
    ],
    whyCards: [
      { img: "/gallery/airport-meet.webp", title: "Meet & greet at JED", body: "Your driver waits at arrivals with a name sign, tracks your flight, and helps with luggage — even for late arrivals." },
      { img: "/gallery/umrah-family.webp", title: "Comfortable for families", body: "A private cabin with room to rest on the four-hour drive, with prayer and refreshment stops on request." },
      { img: "/gallery/luggage-assist.webp", title: "Door to your Madinah hotel", body: "Straight to your accommodation near the Prophet's Mosque, as close as vehicle access allows." },
    ],
    routeIntro:
      "The drive runs north up the Red Sea coast on Highway 5 before turning inland to Madinah, with fuel stations, restaurants, and rest areas along the way. Most travellers make one stop for fuel and prayer.",
    vehicleFits: ["1–3 pilgrims · light bags", "4–6 with luggage", "up to 7 · group + luggage"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door from the airport or city, ~4 hrs, with luggage help and prayer stops — the usual choice for arriving pilgrims." },
      { mode: "Train", detail: "The Haramain High-Speed Railway links Jeddah and Madinah in about 2 hours, but you reach and leave the stations with your bags." },
      { mode: "Flight", detail: "No practical direct flight for this sector; road or the Haramain train are the options." },
    ],
    tips: [
      { icon: "clock", text: "Landing late? Pre-book so a confirmed driver waits at arrivals for you." },
      { icon: "prayer", text: "Ask for a prayer and refreshment stop on the four-hour drive." },
      { icon: "luggage", text: "For families with heavy luggage, choose an SUV or Staria van over a sedan." },
      { icon: "route", text: "Coming from Makkah instead? We also run Makkah–Madinah — just tell us your start point." },
    ],
    faqs: [
      { question: "How far is Jeddah from Madinah?", answer: "Jeddah to Madinah is about 420 km by road via Highway 5/15." },
      { question: "How long is the drive from Jeddah to Madinah?", answer: "The drive takes roughly 4 hours, with fuel and prayer stops along the way." },
      { question: "Is there a train from Jeddah to Madinah?", answer: "Yes — the Haramain High-Speed Railway connects Jeddah and Madinah in about 2 hours, though you still transfer to and from the stations with luggage. A private taxi is door-to-door." },
      { question: "Do you pick up from Jeddah Airport (JED)?", answer: "Yes. We track your flight and the driver meets you at arrivals with a name sign and helps with luggage before the drive to Madinah." },
      { question: "Can the taxi drop me near Masjid an-Nabawi?", answer: "Yes — we drop you as close to your Madinah hotel and the Prophet's Mosque as vehicle access allows." },
      { question: "How much is a taxi from Jeddah to Madinah?", answer: "The fare depends on your vehicle and group size. We confirm one fixed price on WhatsApp before booking — no surge, tolls included." },
    ],
    related: [
      { href: "/routes/jeddah-to-madinah", label: "Jeddah to Madinah taxi (book this route)", img: "/locations/madinah-hero.webp" },
      { href: "/distance/makkah-to-madinah", label: "Makkah to Madinah distance guide", img: "/locations/madinah-hero.webp" },
      { href: "/routes/madinah-to-jeddah-airport", label: "Madinah to Jeddah Airport taxi", img: "/gallery/airport-meet.webp" },
      { href: "/services/umrah-transport", label: "Umrah transport service", img: "/gallery/umrah-family.webp" },
    ],
    routeSlug: "jeddah-to-madinah",
  },

  {
    slug: "riyadh-to-makkah",
    fromCity: "Riyadh",
    toCity: "Makkah",
    km: 870,
    driveMinutes: 480,
    driveLabel: "8–9 hours",
    highway: "Highway 40",
    stops: ["Al Quway'iyah", "Afif", "Miqat (Ihram)"],
    heroImage: "/gallery/makkah-drive.webp",
    fromImage: "/locations/riyadh-hero.webp",
    toImage: "/locations/makkah-hero.webp",
    routeStripImage: "/gallery/highway-travel.webp",
    valueProp:
      "A private car for Umrah from the capital — the full 870 km from Riyadh to Makkah with a Miqat stop for Ihram and drop-off at your hotel near the Haram. One fixed fare for the whole party, confirmed on WhatsApp.",
    whoBooks: [
      "Families and groups from Riyadh often prefer to drive to Makkah for Umrah rather than fly — a single car carries the whole party and the luggage for one fixed price, and the driver stops at the Miqat so everyone can enter Ihram together on the way.",
      "It is an eight-to-nine-hour desert drive on Highway 40, so many travellers set off in the evening or early morning and share the journey comfortably in an SUV or van.",
    ],
    whyCards: [
      { img: "/gallery/umrah-family.webp", title: "One fixed fare for the group", body: "For four or five people, one car often costs less than separate plane tickets — and keeps the family together with the luggage." },
      { img: "/gallery/chauffeur-portrait.webp", title: "Miqat stop for Ihram", body: "The driver stops at the Miqat so everyone can change into Ihram and make their intention before Makkah." },
      { img: "/gallery/luggage-assist.webp", title: "Door to your Makkah hotel", body: "Straight from your Riyadh home to your hotel near Masjid al-Haram, as close as vehicles are allowed." },
    ],
    routeIntro:
      "The drive heads west on Highway 40 across open desert, through Al Quway'iyah and Afif, before approaching Makkah. Non-Muslims may not enter Makkah's city limits; keep documents ready at the Haramain checkpoint.",
    vehicleFits: ["1–3 pilgrims · light bags", "4–6 with luggage", "up to 7 · group + luggage"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door, ~8–9 hrs, one fixed fare for the whole party with a Miqat stop — the usual choice for families driving to Umrah." },
      { mode: "Flight", detail: "Fly Riyadh (RUH) to Jeddah (JED) in ~1 hr 20 min, then transfer onward to Makkah — faster, but per-person tickets and two transfers." },
      { mode: "Train", detail: "No direct Riyadh–Makkah passenger rail. The Haramain line only runs in the west (Jeddah–Makkah–Madinah)." },
    ],
    tips: [
      { icon: "sunrise", text: "Depart in the evening or early morning to avoid driving the long stretch in peak heat." },
      { icon: "prayer", text: "Confirm the Miqat stop when you book so the whole group enters Ihram together." },
      { icon: "luggage", text: "For a full family, an SUV or van makes the long drive far more comfortable." },
      { icon: "shield", text: "Only Muslims may enter Makkah; keep passports handy at the Haramain checkpoint." },
    ],
    faqs: [
      { question: "How far is Riyadh from Makkah by road?", answer: "Riyadh to Makkah is about 870 km on Highway 40, heading west across the desert." },
      { question: "How long is the drive from Riyadh to Makkah?", answer: "The drive takes roughly 8 to 9 hours, depending on stops and traffic. Many families depart in the evening or early morning." },
      { question: "Will the driver stop at the Miqat for Ihram?", answer: "Yes — on request the driver stops at the Miqat so everyone can change into Ihram and make their intention before entering Makkah." },
      { question: "Is it cheaper to drive or fly from Riyadh to Makkah?", answer: "For a family or group, one private car is often better value than separate flight tickets, and it is door-to-door with your luggage. A flight is faster but adds airport time, transfers to Makkah, and per-person cost." },
      { question: "Can non-Muslims travel to Makkah?", answer: "No — only Muslims may enter the city limits of Makkah. Keep documents ready at the Haramain checkpoint." },
      { question: "How much is a taxi from Riyadh to Makkah?", answer: "The fare depends on your vehicle and group size. We confirm one fixed price on WhatsApp before booking — no surge." },
    ],
    related: [
      { href: "/routes/riyadh-to-makkah", label: "Riyadh to Makkah taxi (book this route)", img: "/locations/makkah-hero.webp" },
      { href: "/distance/riyadh-to-madinah", label: "Riyadh to Madinah distance guide", img: "/locations/madinah-hero.webp" },
      { href: "/distance/jeddah-to-makkah", label: "Jeddah to Makkah distance guide", img: "/locations/makkah-hero.webp" },
      { href: "/services/umrah-transport", label: "Umrah transport service", img: "/gallery/umrah-family.webp" },
    ],
    routeSlug: "riyadh-to-makkah",
  },

  {
    slug: "riyadh-to-madinah",
    fromCity: "Riyadh",
    toCity: "Madinah",
    km: 840,
    driveMinutes: 450,
    driveLabel: "about 7.5 hours",
    highway: "Highway 65 via Al Qassim",
    stops: ["Shaqra", "Buraydah (Al Qassim)", "Al Hanakiyah"],
    heroImage: "/gallery/umrah-family1.webp",
    fromImage: "/locations/riyadh-hero.webp",
    toImage: "/locations/madinah-hero.webp",
    routeStripImage: "/gallery/highway-travel.webp",
    valueProp:
      "A private car from Riyadh to Madinah for Ziyarat and Umrah travel — about 840 km via Al Qassim, door-to-door to your hotel near Masjid an-Nabawi. One fixed fare for the whole party, confirmed on WhatsApp.",
    whoBooks: [
      "Travellers from the capital heading to Madinah for Ziyarat — visiting the Prophet's Mosque and the historic sites — often choose a private car so the family can travel together with luggage and stop for prayers along the way.",
      "The route runs through Al Qassim, so it also suits those visiting Buraydah or breaking the journey in the central region before continuing to Madinah.",
    ],
    whyCards: [
      { img: "/gallery/umrah-family.webp", title: "Family Ziyarat travel", body: "Room for the whole family and luggage, with flexible prayer and rest stops on the seven-hour drive." },
      { img: "/gallery/ziyarat-tour.webp", title: "Straight to the Haram", body: "Drop-off close to Masjid an-Nabawi and your Madinah hotel, as vehicle access allows." },
      { img: "/gallery/chauffeur-portrait.webp", title: "One driver, the whole way", body: "A professional driver who knows the Qassim corridor, from your Riyadh doorstep to Madinah." },
    ],
    routeIntro:
      "The drive heads north-west on Highway 65 through Al Qassim (Buraydah) before turning toward Madinah, crossing open farmland and desert with fuel stations and rest areas in the main towns.",
    vehicleFits: ["1–3 travellers · light bags", "4–6 with luggage", "up to 7 · group + luggage"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door, ~7.5 hrs, one fixed fare for the family with prayer stops — comfortable for Ziyarat travel with luggage." },
      { mode: "Flight", detail: "Fly Riyadh (RUH) to Madinah (MED) in about 1 hr 40 min, plus airport time both ends and per-person tickets." },
      { mode: "Train", detail: "No direct Riyadh–Madinah passenger rail. The Haramain line only serves the west (Jeddah–Makkah–Madinah)." },
    ],
    tips: [
      { icon: "sunrise", text: "Set off early to reach Madinah in good time and avoid the hottest hours on the road." },
      { icon: "map", text: "The route passes Buraydah in Al Qassim — a natural point to stop for fuel and food." },
      { icon: "prayer", text: "Ask for prayer stops; the corridor has well-kept mosques and rest areas." },
      { icon: "luggage", text: "For families, an SUV or van is more comfortable than a sedan on this long drive." },
    ],
    faqs: [
      { question: "How far is Riyadh from Madinah by road?", answer: "Riyadh to Madinah is about 840 km, driving north-west via Al Qassim on Highway 65." },
      { question: "How long is the drive from Riyadh to Madinah?", answer: "The drive takes roughly 7.5 hours, depending on stops and traffic." },
      { question: "Does the route go through Al Qassim?", answer: "Yes — the main road passes through the Al Qassim region and Buraydah, a good point to stop for fuel and food before continuing to Madinah." },
      { question: "Is it better to fly or drive from Riyadh to Madinah?", answer: "A flight is faster (about 1 hr 40 min in the air), but a private car is door-to-door with your luggage and one fixed fare for the whole family — often the better choice for Ziyarat travel with children or elders." },
      { question: "Can the taxi drop me near Masjid an-Nabawi?", answer: "Yes — we drop you as close to your Madinah hotel and the Prophet's Mosque as vehicle access allows." },
      { question: "How much is a taxi from Riyadh to Madinah?", answer: "The fare depends on your vehicle and group size. We confirm one fixed price on WhatsApp before booking — no surge." },
    ],
    related: [
      { href: "/routes/riyadh-to-madinah", label: "Riyadh to Madinah taxi (book this route)", img: "/locations/madinah-hero.webp" },
      { href: "/distance/riyadh-to-makkah", label: "Riyadh to Makkah distance guide", img: "/locations/makkah-hero.webp" },
      { href: "/distance/makkah-to-madinah", label: "Makkah to Madinah distance guide", img: "/locations/madinah-hero.webp" },
      { href: "/services/madinah-ziyarat", label: "Madinah Ziyarat tours", img: "/gallery/ziyarat-tour.webp" },
    ],
    routeSlug: "riyadh-to-madinah",
  },

  {
    slug: "makkah-to-taif",
    fromCity: "Makkah",
    toCity: "Taif",
    km: 90,
    driveMinutes: 70,
    driveLabel: "about 1 hr 10 min",
    highway: "Al Hada mountain road",
    stops: ["Al Hada", "Al Shafa viewpoints"],
    heroImage: "/locations/taif-hero.webp",
    fromImage: "/locations/makkah-hero.webp",
    toImage: "/locations/taif-hero.webp",
    routeStripImage: "/gallery/highway-travel.webp",
    valueProp:
      "A private car up the mountains from Makkah to Taif — about 90 km on the scenic Al Hada road to Saudi Arabia's cool summer city. Great for day trips and families escaping the heat. Fare confirmed on WhatsApp.",
    whoBooks: [
      "Pilgrims and residents in Makkah head to Taif for its cooler mountain air, gardens, and rose farms — especially in summer. A private car is the easy way to make the climb up the Al Hada road, stop for the views, and return the same day.",
      "Families with children and elderly travellers prefer a private car over shared transport for the winding mountain ascent, with the flexibility to stop at viewpoints along the way.",
    ],
    whyCards: [
      { img: "/gallery/umrah-family.webp", title: "Easy day trip", body: "Go up in the morning, enjoy the cooler weather and gardens, and come back the same day — the driver waits for you." },
      { img: "/gallery/highway-travel.webp", title: "Scenic Al Hada climb", body: "The mountain road offers dramatic views; a private car lets you stop at the viewpoints safely." },
      { img: "/gallery/luggage-assist.webp", title: "Comfortable for families", body: "Air-conditioned comfort for children and elders on the winding ascent, at your own pace." },
    ],
    routeIntro:
      "The drive climbs the Al Hada mountain road, one of the most scenic routes in the Hijaz, rising quickly from Makkah to Taif's cooler plateau. There are viewpoints and rest spots on the ascent.",
    vehicleFits: ["1–3 passengers · day trip", "4–6 · family outing", "up to 7 · group day trip"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door, ~1 hr 10 min up the mountain, with viewpoint stops and the option to wait and return — ideal for day trips." },
      { mode: "Flight", detail: "No flight for this short mountain sector — the road is the only practical option." },
      { mode: "Train", detail: "No rail line between Makkah and Taif; a private car on the Al Hada road is the way to travel." },
    ],
    tips: [
      { icon: "sunrise", text: "Go early to enjoy the cooler morning air and the clearest mountain views." },
      { icon: "route", text: "Ask the driver to pause at the Al Hada viewpoints on the ascent." },
      { icon: "clock", text: "For a day trip, book a return with waiting time so your car is ready for the way back." },
      { icon: "luggage", text: "Bring a light jacket — Taif is noticeably cooler than Makkah, especially in the evening." },
    ],
    faqs: [
      { question: "How far is Makkah from Taif?", answer: "Makkah to Taif is about 90 km via the Al Hada mountain road." },
      { question: "How long is the drive from Makkah to Taif?", answer: "The drive takes about 1 hour 10 minutes up the mountain, a little longer if you stop at the viewpoints." },
      { question: "Is the Al Hada road difficult to drive?", answer: "It is a winding mountain road with dramatic views. A professional driver makes the ascent comfortable and can stop safely at the viewpoints." },
      { question: "Can I do a Makkah to Taif day trip?", answer: "Yes — most travellers go up in the morning and return the same day. Book a return with waiting time and the driver stays with you." },
      { question: "Why is Taif popular in summer?", answer: "Taif sits on a cool mountain plateau with gardens and rose farms, so it is a popular escape from the summer heat of Makkah and Jeddah." },
      { question: "How much is a taxi from Makkah to Taif?", answer: "The fare depends on your vehicle and whether you want waiting time for a day trip. We confirm one fixed price on WhatsApp before booking." },
    ],
    related: [
      { href: "/routes/makkah-to-taif", label: "Makkah to Taif taxi (book this route)", img: "/locations/taif-hero.webp" },
      { href: "/distance/jeddah-to-taif", label: "Jeddah to Taif distance guide", img: "/locations/taif-hero.webp" },
      { href: "/services/taif-ziyarat", label: "Taif Ziyarat & day trips", img: "/locations/taif-hero.webp" },
      { href: "/distance/jeddah-to-makkah", label: "Jeddah to Makkah distance guide", img: "/locations/makkah-hero.webp" },
    ],
    routeSlug: "makkah-to-taif",
  },

  {
    slug: "jeddah-to-taif",
    fromCity: "Jeddah",
    toCity: "Taif",
    km: 170,
    driveMinutes: 120,
    driveLabel: "about 2 hours",
    highway: "Highway 15 via Al Hada",
    stops: ["Makkah bypass", "Al Hada ascent"],
    heroImage: "/locations/taif-hero.webp",
    fromImage: "/locations/jeddah-hero.webp",
    toImage: "/locations/taif-hero.webp",
    routeStripImage: "/gallery/highway-travel.webp",
    valueProp:
      "A private car from the Red Sea coast up to the mountains — about 170 km from Jeddah to Taif in around 2 hours. A favourite summer escape for families. Fare confirmed on WhatsApp.",
    whoBooks: [
      "Jeddah residents and visitors head to Taif to escape the coastal heat and humidity, especially in summer, for its gardens, cooler air, and mountain views. A private car makes the two-hour trip easy, with room for the family and weekend bags.",
      "It is a popular weekend and holiday route, so families often book a private car for the flexibility to leave when they want and stop along the Al Hada ascent.",
    ],
    whyCards: [
      { img: "/gallery/luggage-assist.webp", title: "Weekend getaway", body: "Pack the family and bags, leave on your schedule, and reach Taif's cool mountain air in about two hours." },
      { img: "/gallery/highway-travel.webp", title: "Scenic mountain ascent", body: "The route climbs the Al Hada road with sweeping views — a private car lets you stop and enjoy them." },
      { img: "/gallery/umrah-family.webp", title: "Comfortable for families", body: "Air-conditioned comfort for children and elders, with rest stops on the way up." },
    ],
    routeIntro:
      "The drive heads inland from Jeddah on Highway 15, skirting Makkah (via the non-Muslim bypass), then climbs the Al Hada mountain road to Taif's cooler plateau.",
    vehicleFits: ["1–3 passengers · weekend bags", "4–6 · family trip", "up to 7 · group getaway"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door, ~2 hrs, with room for weekend luggage and the family — leave when you want and stop on the ascent." },
      { mode: "Flight", detail: "No practical flight for this short sector; the mountain road is the way to travel." },
      { mode: "Train", detail: "No rail line to Taif; a private car via the Al Hada road is the option." },
    ],
    tips: [
      { icon: "luggage", text: "Bring a light jacket — Taif is much cooler than Jeddah, especially at night." },
      { icon: "route", text: "Ask the driver to stop at the Al Hada viewpoints on the climb." },
      { icon: "clock", text: "Weekends are busy — pre-book your car to leave exactly when you want." },
      { icon: "shield", text: "Non-Muslims are routed via the Makkah bypass — mention it when you book if relevant." },
    ],
    faqs: [
      { question: "How far is Jeddah from Taif?", answer: "Jeddah to Taif is about 170 km via Highway 15 and the Al Hada mountain road." },
      { question: "How long is the drive from Jeddah to Taif?", answer: "The drive takes about 2 hours, a little longer with viewpoint stops on the Al Hada ascent." },
      { question: "Why do people travel from Jeddah to Taif?", answer: "Taif's cool mountain climate, gardens, and rose farms make it a favourite summer escape from Jeddah's coastal heat and humidity." },
      { question: "Does the route pass through Makkah?", answer: "The road skirts Makkah; non-Muslim travellers are routed via the Makkah bypass before climbing the Al Hada road to Taif." },
      { question: "Can I book a day trip or weekend return?", answer: "Yes — book a return with waiting time for a day trip, or a one-way for a weekend stay. Tell us your plan for a quote." },
      { question: "How much is a taxi from Jeddah to Taif?", answer: "The fare depends on your vehicle and whether you need waiting time. We confirm one fixed price on WhatsApp before booking." },
    ],
    related: [
      { href: "/routes/jeddah-to-taif", label: "Jeddah to Taif taxi (book this route)", img: "/locations/taif-hero.webp" },
      { href: "/distance/makkah-to-taif", label: "Makkah to Taif distance guide", img: "/locations/taif-hero.webp" },
      { href: "/distance/jeddah-to-makkah", label: "Jeddah to Makkah distance guide", img: "/locations/makkah-hero.webp" },
      { href: "/services/taif-ziyarat", label: "Taif Ziyarat & day trips", img: "/locations/taif-hero.webp" },
    ],
    routeSlug: "jeddah-to-taif",
  },

  {
    slug: "riyadh-to-alkhobar",
    fromCity: "Riyadh",
    toCity: "Al Khobar",
    km: 400,
    driveMinutes: 220,
    driveLabel: "about 3.5–4 hours",
    highway: "Highway 40",
    stops: ["Al Kharj junction", "Midway rest areas"],
    heroImage: "/locations/alkhobar-hero.webp",
    fromImage: "/locations/riyadh-hero.webp",
    toImage: "/locations/alkhobar-hero.webp",
    routeStripImage: "/gallery/highway-travel.webp",
    valueProp:
      "A private, door-to-door car from the capital to the Eastern Province coast — about 400 km to Al Khobar in roughly 3.5–4 hours, ideal for business and weekend trips. One fixed fare, confirmed on WhatsApp.",
    whoBooks: [
      "Al Khobar, on the Gulf coast beside Dammam and Dhahran, draws business travellers heading to the Aramco area and families going for the corniche, malls, and seafront weekends. A private car offers reliable, on-time door-to-door travel from Riyadh.",
      "Because Al Khobar is the gateway to the King Fahd Causeway, many travellers book the trip as the first leg of a journey continuing on to Bahrain.",
    ],
    whyCards: [
      { img: "/gallery/business-transfer.webp", title: "Reliable for business", body: "On-time pickups and a quiet cabin to work between the capital and the Aramco heartland around Khobar and Dhahran." },
      { img: "/gallery/luggage-assist.webp", title: "Weekend on the coast", body: "Room for the family and bags for a corniche and seafront weekend in the Eastern Province." },
      { img: "/gallery/airport-meet.webp", title: "Onward to Bahrain", body: "Khobar is the gateway to the King Fahd Causeway — book a through journey to Manama." },
    ],
    routeIntro:
      "The drive follows Highway 40, the same fast expressway as the Riyadh–Dammam corridor, across the desert to the Eastern Province coast, with fuel and rest stops around Al Kharj and midway.",
    vehicleFits: ["1–3 passengers · business trip", "4–6 · family or team", "up to 7 · group + luggage"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door, ~3.5–4 hrs, flexible for business and families — and it continues to Dhahran or across the causeway to Bahrain." },
      { mode: "Train", detail: "The Saudi Railway (SAR) serves nearby Dammam from Riyadh in about 4 hours station to station, plus a transfer to Khobar." },
      { mode: "Flight", detail: "Fly Riyadh (RUH) to Dammam (DMM) in under an hour, then transfer ~20 km to Khobar, plus airport time." },
    ],
    tips: [
      { icon: "route", text: "Continuing to Bahrain? Ask for a through booking across the King Fahd Causeway." },
      { icon: "clock", text: "For meetings, book a return with waiting time so the car is ready when you finish." },
      { icon: "fuel", text: "Al Kharj and the midway rest areas are good points for fuel, food, and prayer." },
      { icon: "map", text: "Al Khobar, Dammam, and Dhahran form one metro area — tell us your exact district." },
    ],
    faqs: [
      { question: "How far is Riyadh from Al Khobar?", answer: "Riyadh to Al Khobar is about 400 km by road on Highway 40, on the Gulf coast beside Dammam." },
      { question: "How long is the drive from Riyadh to Al Khobar?", answer: "The drive takes roughly 3.5 to 4 hours on the expressway, depending on traffic and stops." },
      { question: "Can the taxi continue from Al Khobar to Bahrain?", answer: "Yes — Al Khobar is the gateway to the King Fahd Causeway. Ask for a through booking and we take you across to Manama." },
      { question: "Do you serve the whole Khobar–Dammam–Dhahran area?", answer: "Yes — the three cities form one metropolitan area and we cover all of it, including Aramco, the corniche, and business hotels. Confirm your district when booking." },
      { question: "Do you offer business return trips with waiting time?", answer: "Yes. Book a same-day return and the driver waits during your meetings in the Eastern Province." },
      { question: "How much is a taxi from Riyadh to Al Khobar?", answer: "The fare depends on your vehicle and timing. We confirm one fixed price on WhatsApp before booking — no surge, tolls included." },
    ],
    related: [
      { href: "/routes/riyadh-to-alkhobar", label: "Riyadh to Al Khobar taxi (book this route)", img: "/locations/alkhobar-hero.webp" },
      { href: "/distance/riyadh-to-dammam", label: "Riyadh to Dammam distance guide", img: "/locations/dammam-hero.webp" },
      { href: "/routes/alkhobar-to-manama", label: "Khobar to Bahrain (causeway) taxi", img: "/locations/alkhobar-hero.webp" },
      { href: "/services/corporate-bahrain-transport", label: "Corporate Bahrain transport", img: "/gallery/business-transfer.webp" },
    ],
    routeSlug: "riyadh-to-alkhobar",
  },

  {
    slug: "riyadh-to-alula",
    fromCity: "Riyadh",
    toCity: "AlUla",
    km: 1050,
    driveMinutes: 600,
    driveLabel: "about 10 hours",
    highway: "Highway 65 via Al Qassim & Hail",
    stops: ["Buraydah (Al Qassim)", "Hail", "Rest areas near AlUla"],
    heroImage: "/locations/alula-hero.webp",
    fromImage: "/locations/riyadh-hero.webp",
    toImage: "/locations/alula-hero.webp",
    routeStripImage: "/gallery/highway-travel.webp",
    valueProp:
      "A private car to Saudi Arabia's heritage jewel — about 1,050 km from Riyadh to AlUla, home of Hegra and the Winter at Tantora season. A long, comfortable journey with a driver who knows the road. Fare confirmed on WhatsApp.",
    whoBooks: [
      "AlUla — with the UNESCO-listed Hegra, dramatic rock formations, and the Winter at Tantora festival — has become one of the Kingdom's top destinations. Travellers from Riyadh who prefer the freedom of the road, or who want to explore the central region on the way, book a private car for the long drive north-west.",
      "It is a full-day journey of around ten hours through Al Qassim and Hail, so families and groups often travel in a spacious SUV or van and break the trip with stops.",
    ],
    whyCards: [
      { img: "/gallery/luggage-assist.webp", title: "Freedom of the road", body: "Carry your bags and set your own pace on the way to AlUla, stopping in Qassim or Hail as you like." },
      { img: "/gallery/highway-travel.webp", title: "Comfort for a long drive", body: "A spacious SUV or van and a professional driver make the ten-hour journey far easier than it sounds." },
      { img: "/gallery/chauffeur-portrait.webp", title: "A driver who knows the way", body: "The route runs through Al Qassim and Hail before AlUla — your driver handles the navigation and stops." },
    ],
    routeIntro:
      "The drive heads north-west on Highway 65 through Al Qassim (Buraydah) and Hail before reaching AlUla, crossing farmland, desert, and the striking landscapes of the north.",
    vehicleFits: ["1–3 travellers · light bags", "4–6 with luggage", "up to 7 · group + luggage"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door, ~10 hrs, with the freedom to stop in Qassim or Hail — ideal for travellers who want to see the country on the way." },
      { mode: "Flight", detail: "Fly Riyadh (RUH) to AlUla (ULH) in about 2 hours, plus airport time — faster, but you miss the road and need transport at both ends." },
      { mode: "Train", detail: "No direct passenger rail to AlUla; the journey is by road or air." },
    ],
    tips: [
      { icon: "sunrise", text: "Start at dawn for the long drive so you arrive in AlUla with daylight to spare." },
      { icon: "map", text: "Buraydah (Qassim) and Hail are natural stops for fuel, food, and prayer." },
      { icon: "luggage", text: "For comfort on a ten-hour drive, choose a spacious SUV or van over a sedan." },
      { icon: "clock", text: "During the Winter at Tantora season, pre-book well ahead as demand is high." },
    ],
    faqs: [
      { question: "How far is Riyadh from AlUla by road?", answer: "Riyadh to AlUla is about 1,050 km, driving north-west via Al Qassim and Hail on Highway 65." },
      { question: "How long is the drive from Riyadh to AlUla?", answer: "The drive takes roughly 10 hours, so most travellers set off early and break the journey in Qassim or Hail." },
      { question: "Is it better to fly or drive from Riyadh to AlUla?", answer: "A flight to AlUla (ULH) takes about 2 hours and is faster, but you still need transport at both ends. A private car is door-to-door, carries your luggage, and lets you explore the central region on the way." },
      { question: "What is AlUla known for?", answer: "AlUla is home to the UNESCO-listed Hegra (Madain Salih), dramatic rock formations like Elephant Rock, and the Winter at Tantora festival — one of Saudi Arabia's leading heritage and tourism destinations." },
      { question: "What vehicle is best for the Riyadh to AlUla drive?", answer: "For a ten-hour journey, a spacious GMC Yukon SUV or Hyundai Staria van is far more comfortable than a sedan, especially for families and groups with luggage." },
      { question: "How much is a taxi from Riyadh to AlUla?", answer: "The fare depends on your vehicle and group size for this long-distance route. We confirm one fixed price on WhatsApp before booking — no surge." },
    ],
    related: [
      { href: "/routes/riyadh-to-alula", label: "Riyadh to AlUla taxi (book this route)", img: "/locations/alula-hero.webp" },
      { href: "/routes/madinah-to-alula", label: "Madinah to AlUla taxi", img: "/locations/alula-hero.webp" },
      { href: "/distance/riyadh-to-madinah", label: "Riyadh to Madinah distance guide", img: "/locations/madinah-hero.webp" },
      { href: "/services/tourism", label: "Tourism & private tours", img: "/locations/alula-hero.webp" },
    ],
    routeSlug: "riyadh-to-alula",
  },
  {
    slug: "madinah-to-alula",
    fromCity: "Madinah",
    toCity: "AlUla",
    km: 330,
    driveMinutes: 180,
    driveLabel: "about 3 hours",
    highway: "the main Madinah–AlUla desert highway",
    stops: ["Desert highway rest stops", "Fuel before AlUla"],
    heroImage: "/locations/alula-hero.webp",
    fromImage: "/locations/madinah-hero.webp",
    toImage: "/locations/alula-hero.webp",
    routeStripImage: "/gallery/highway-travel.webp",
    valueProp:
      "A private car from Madinah to AlUla — about 330 km, roughly a 3-hour drive north to Saudi Arabia's heritage jewel, home of Hegra. The natural next step after Ziyarah, door-to-door with a professional chauffeur and a fare confirmed on WhatsApp.",
    whoBooks: [
      "Most travellers on this route are pilgrims who have finished their Ziyarah in Madinah and want to add a heritage trip to AlUla — the UNESCO-listed Hegra (Mada'in Salih), Dadan, AlUla Old Town and Elephant Rock. At only about 3 hours by road, it is an easy extension rather than a separate journey, and a private car keeps a family or small group together for the day.",
      "A private transfer here is not a shared shuttle — it is one vehicle and one chauffeur exclusively for your party, from your Madinah hotel to your AlUla destination, with the option to keep the car for the day and tour the sites.",
    ],
    whyCards: [
      { img: "/gallery/luggage-assist.webp", title: "Straight after Ziyarah", body: "Pickup from your Madinah hotel with your luggage and family, no airport transfers — just a comfortable drive north to AlUla." },
      { img: "/gallery/highway-travel.webp", title: "Comfortable 3-hour drive", body: "An air-conditioned sedan, SUV or van and a professional chauffeur make the desert drive to AlUla easy and relaxed." },
      { img: "/gallery/chauffeur-portrait.webp", title: "Keep the car for the day", body: "Add waiting time and tour Hegra, Dadan and the Old Town with your chauffeur, then return to Madinah or your AlUla hotel." },
    ],
    routeIntro:
      "The drive heads north from Madinah across open desert to AlUla in roughly three hours. It is a straightforward run with fuel and rest stops along the way — most travellers make one short stop for refreshments and prayer.",
    vehicleFits: ["1–3 travellers · light bags", "4–6 with luggage", "up to 7 · group + luggage"],
    compare: [
      { mode: "Private taxi", best: true, detail: "Door-to-door in about 3 hours, one fixed fare for the whole party, and the option to keep the car for a full AlUla day. Best for pilgrims extending their trip and for families." },
      { mode: "Flight", detail: "AlUla has an airport (ULH), but for a ~3-hour drive from Madinah a private car is usually simpler door-to-door — with no airport transfers at either end." },
      { mode: "Train", detail: "There is no passenger railway to AlUla; the journey is by road or air." },
    ],
    tips: [
      { icon: "prayer", text: "Book straight after your Ziyarah in Madinah so your chauffeur collects you and your luggage from the hotel." },
      { icon: "clock", text: "Start in the morning to have a full day at Hegra, Dadan and the Old Town before returning." },
      { icon: "luggage", text: "For families, a spacious SUV or van is more comfortable than a sedan on the desert drive." },
      { icon: "map", text: "During the Winter at Tantora season, pre-book well ahead as AlUla demand is high." },
    ],
    faqs: [
      { question: "How far is Madinah from AlUla by road?", answer: "Madinah to AlUla is about 330 km by road, heading north through open desert — roughly a 3-hour drive." },
      { question: "How long is the drive from Madinah to AlUla?", answer: "The drive takes around 3 hours, making AlUla an easy heritage trip to add after visiting Madinah. Most travellers make one short stop for fuel, food, and prayer." },
      { question: "Can I combine my Madinah Ziyarah with an AlUla heritage trip?", answer: "Yes. Many pilgrims travel from Madinah to AlUla after their Ziyarah to visit Hegra, Dadan, and the Old Town. We collect you from your Madinah hotel and can keep the car for the day so you tour the sites with your chauffeur." },
      { question: "What is AlUla known for?", answer: "AlUla is home to the UNESCO-listed Hegra (Mada'in Salih), Dadan, AlUla Old Town, dramatic rock formations like Elephant Rock, and the Winter at Tantora festival — one of Saudi Arabia's leading heritage destinations." },
      { question: "What vehicle is best for the Madinah to AlUla drive?", answer: "A sedan suits 1–3 travellers with light luggage, while a GMC Yukon SUV or Hyundai Staria van is more comfortable for families and groups with bags on the desert drive." },
      { question: "How much is a taxi from Madinah to AlUla?", answer: "The fare depends on your vehicle and group size, and whether you keep the car for the day. We confirm one fixed price on WhatsApp before booking — no surge, no hidden fees." },
    ],
    related: [
      { href: "/routes/madinah-to-alula", label: "Madinah to AlUla taxi (book this route)", img: "/locations/alula-hero.webp" },
      { href: "/routes/riyadh-to-alula", label: "Riyadh to AlUla taxi", img: "/locations/alula-hero.webp" },
      { href: "/distance/riyadh-to-alula", label: "Riyadh to AlUla distance guide", img: "/locations/alula-hero.webp" },
      { href: "/services/heritage-tours", label: "Heritage & private tours", img: "/locations/alula-hero.webp" },
    ],
    routeSlug: "madinah-to-alula",
  },
];

export function getDistanceGuide(slug: string) {
  return DISTANCE_GUIDES.find((d) => d.slug === slug);
}
