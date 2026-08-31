// Distance / journey guide pages — info-intent ("how far is X from Y").
// Distinct from /routes/* (booking-intent). Distances & times mirror the real
// values in routes.ts. NO invented prices, NO fake claims — only verifiable
// road/journey facts. Each page links to its matching /routes/* for booking.

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
  /** Main highway / road actually used. */
  highway: string;
  /** Real towns/stops along the way. */
  stops: string[];
  /** One-paragraph, factual journey overview. */
  overview: string;
  /** Honest transport comparison rows. Keep factual; no fake prices. */
  compare: { mode: string; detail: string }[];
  /** Matching /routes/* slug for the booking CTA. */
  routeSlug: string;
  faqs: { question: string; answer: string }[];
}

export const DISTANCE_GUIDES: DistanceGuide[] = [
  {
    slug: "riyadh-to-jeddah",
    fromCity: "Riyadh",
    toCity: "Jeddah",
    km: 950,
    driveMinutes: 540,
    driveLabel: "about 9–10 hours",
    highway: "Highway 40 (the main Riyadh–Makkah road)",
    stops: ["Dawadmi", "Afif", "Al Quway'iyah"],
    overview:
      "Riyadh to Jeddah is roughly 950 km across central Saudi Arabia, a long full-day drive of about 9–10 hours on Highway 40. The road is a well-maintained multi-lane highway through open desert, with fuel stations and rest areas near the main towns. Most travellers break the journey once or twice for fuel, food, and prayer.",
    compare: [
      { mode: "By car / private taxi", detail: "Door-to-door, about 9–10 hours, fully flexible with rest and prayer stops. Best for luggage, families, and multiple stops." },
      { mode: "By flight", detail: "Domestic flights between Riyadh (RUH) and Jeddah (JED) take roughly 1 hour 20 minutes in the air, plus airport check-in and transfer time on both ends." },
      { mode: "By train", detail: "There is no direct passenger railway between Riyadh and Jeddah; the Haramain high-speed line only serves Makkah–Madinah–Jeddah in the west." },
    ],
    routeSlug: "riyadh-to-jeddah",
    faqs: [
      { question: "How far is Riyadh from Jeddah?", answer: "Riyadh to Jeddah is about 950 km by road on Highway 40." },
      { question: "How long does it take to drive from Riyadh to Jeddah?", answer: "The drive takes roughly 9 to 10 hours depending on stops, traffic, and speed. Most people stop once or twice for fuel and prayers." },
      { question: "Is it better to fly or drive from Riyadh to Jeddah?", answer: "Flying is far quicker (about 1 hour 20 minutes in the air), while driving is door-to-door and flexible for families with luggage who want to stop along the way. A private car with a driver lets you rest without the airport process." },
      { question: "Can I book a private taxi from Riyadh to Jeddah?", answer: "Yes. A private car with a professional driver can be arranged door-to-door, with the fare confirmed on WhatsApp before you book." },
    ],
  },
  {
    slug: "makkah-to-madinah",
    fromCity: "Makkah",
    toCity: "Madinah",
    km: 430,
    driveMinutes: 240,
    driveLabel: "about 4 hours",
    highway: "Highway 15 / 40 (the Makkah–Madinah expressway)",
    stops: ["Rabigh", "Badr junction", "Rest areas near the Miqat"],
    overview:
      "Makkah to Madinah is about 430 km on a modern expressway, a drive of roughly 4 hours. The road is used heavily by pilgrims and has frequent fuel stations, restaurants, and rest areas. Note that the direct road passes through areas that non-Muslims may not enter around Makkah.",
    compare: [
      { mode: "By car / private taxi", detail: "Door-to-door, about 4 hours, with prayer and rest stops on request — the most common choice for Umrah travellers with luggage." },
      { mode: "By train", detail: "The Haramain High-Speed Railway connects Makkah and Madinah in about 2 hours, but you still need transfers to and from the stations." },
      { mode: "By flight", detail: "There is no practical direct flight for this short domestic sector; road or the Haramain train are the usual options." },
    ],
    routeSlug: "makkah-to-madinah",
    faqs: [
      { question: "How far is Makkah from Madinah?", answer: "Makkah to Madinah is about 430 km by road on the Makkah–Madinah expressway." },
      { question: "How long is the drive from Makkah to Madinah?", answer: "The drive takes roughly 4 hours, with fuel and prayer stops available along the way." },
      { question: "Is there a train from Makkah to Madinah?", answer: "Yes — the Haramain High-Speed Railway links Makkah and Madinah in about 2 hours, though you need to reach and leave the stations. A private taxi is door-to-door with luggage help." },
      { question: "Can I book a private taxi from Makkah to Madinah?", answer: "Yes. A private car or van with a driver can be arranged, with prayer stops on request and the fare confirmed on WhatsApp before booking." },
    ],
  },
  {
    slug: "riyadh-to-dammam",
    fromCity: "Riyadh",
    toCity: "Dammam",
    km: 390,
    driveMinutes: 210,
    driveLabel: "about 3.5 hours",
    highway: "Highway 40 (the Riyadh–Dammam expressway)",
    stops: ["Al Kharj junction", "Al Ghat rest areas", "Al Hofuf turn-off"],
    overview:
      "Riyadh to Dammam is about 390 km on a fast, well-maintained expressway, a drive of roughly 3.5 hours. It is one of the busiest intercity corridors in the Kingdom, linking the capital with the Eastern Province, and has plenty of fuel stations and rest stops.",
    compare: [
      { mode: "By car / private taxi", detail: "Door-to-door, about 3.5 hours, flexible and comfortable for business travellers and families with luggage." },
      { mode: "By train", detail: "The Saudi Railway (SAR) operates a passenger train between Riyadh and Dammam, taking roughly 4 hours station to station, plus transfers." },
      { mode: "By flight", detail: "Short domestic flights between Riyadh (RUH) and Dammam (DMM) take under an hour in the air, plus airport time on both ends." },
    ],
    routeSlug: "riyadh-to-dammam",
    faqs: [
      { question: "How far is Riyadh from Dammam?", answer: "Riyadh to Dammam is about 390 km by road on Highway 40." },
      { question: "How long does it take to drive from Riyadh to Dammam?", answer: "The drive takes roughly 3.5 hours on the expressway, depending on traffic and stops." },
      { question: "Is there a train between Riyadh and Dammam?", answer: "Yes — the Saudi Railway (SAR) runs a passenger service that takes about 4 hours station to station. A private car is door-to-door and often more convenient with luggage." },
      { question: "Can I book a private taxi from Riyadh to Dammam?", answer: "Yes. A private car with a professional driver can be arranged one-way or return, with the fare confirmed on WhatsApp before booking." },
    ],
  },
  {
    slug: "jeddah-to-makkah",
    fromCity: "Jeddah",
    toCity: "Makkah",
    km: 85,
    driveMinutes: 70,
    driveLabel: "about 1 hour 10 minutes",
    highway: "Highway 40 (the Jeddah–Makkah expressway)",
    stops: ["Miqat at Al-Juhfah / Qarn al-Manazil (for Ihram)", "Haramain checkpoint"],
    overview:
      "Jeddah to Makkah is about 85 km on a short, fast expressway, a drive of roughly 1 hour 10 minutes. It is the most travelled pilgrim corridor in Saudi Arabia, connecting King Abdulaziz International Airport and Jeddah city with the Holy Mosque. Non-Muslims may not enter the city limits of Makkah.",
    compare: [
      { mode: "By car / private taxi", detail: "Door-to-door, about 1 hour 10 minutes, with a Miqat stop for Ihram on request — the most common choice for pilgrims arriving at Jeddah." },
      { mode: "By train", detail: "The Haramain High-Speed Railway connects Jeddah and Makkah in about 30 minutes, though you still need to reach and leave the stations with luggage." },
      { mode: "By flight", detail: "There is no flight for this short sector; road or the Haramain train are the options." },
    ],
    routeSlug: "jeddah-to-makkah",
    faqs: [
      { question: "How far is Jeddah from Makkah?", answer: "Jeddah city to Makkah is about 85 km by road; from Jeddah Airport it is roughly 80 km." },
      { question: "How long is the drive from Jeddah to Makkah?", answer: "The drive takes about 1 hour 10 minutes on the expressway, a little more from the airport in peak Umrah traffic." },
      { question: "Is there a train from Jeddah to Makkah?", answer: "Yes — the Haramain High-Speed Railway links Jeddah and Makkah in about 30 minutes. A private taxi is door-to-door with a Miqat stop for Ihram and luggage help." },
      { question: "Can I book a private taxi from Jeddah to Makkah?", answer: "Yes. A private car, SUV, or van with a driver can be arranged from the airport or city, with a Miqat stop on request and the fare confirmed on WhatsApp." },
    ],
  },
];

export function getDistanceGuide(slug: string) {
  return DISTANCE_GUIDES.find((d) => d.slug === slug);
}
