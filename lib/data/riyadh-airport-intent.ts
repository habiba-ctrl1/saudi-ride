// Airport-intent sections for the four existing Riyadh → airport route pages
// (added 2026-10-09, owner-approved "Option A": strengthen the existing URLs,
// no new airport URLs — see seo/page-log.md).
//
// Truth sources:
// - Distance / drive time: ROUTES_DATA only (read at render time, never typed here).
// - Crossings and causeway: the existing bespoke pages (cross-border-route-pages.ts).
// - No terminal, curbside, drop-off procedure, border waiting time, airport
//   status, price or quote turnaround is claimed. Customers are asked to give
//   their terminal / preferred drop-off point.
// - Entry rules: always "check official sources — we do not arrange visas".

import { ROUTES_DATA } from "./routes";

export interface AirportIntentFaq {
  question: string;
  answer: string;
}

export interface AirportIntent {
  /** Route page slug this section lives on (existing URL, unchanged). */
  slug: string;
  /** Analytics route identifier — no personal data. */
  routeId: string;
  airportName: string;
  code: string;
  /** Short destination label used in the WhatsApp "Route:" line. */
  destinationLabel: string;
  /** True for international routes (adds the border sentence to the prefill). */
  international: boolean;
  heading: string;
  /** Self-contained, quotable answer. `{km}` / `{drive}` are filled from ROUTES_DATA. */
  answer: string;
  /** City vs airport destination distinctions. */
  distinctions: { name: string; desc: string }[];
  /** What to include when requesting the quote. */
  askFor: string[];
  tradeOff: { heading: string; body: string[] };
  /** Official-source reminder (international routes only). */
  entryNote?: string;
  cta: string;
  faqs: AirportIntentFaq[];
}

function fill(text: string, slug: string): string {
  const r = ROUTES_DATA.find((x) => x.slug === slug);
  if (!r) return text;
  const h = Math.floor(r.duration / 60);
  const m = r.duration % 60;
  const drive = m ? `${h} hours ${m} minutes` : `${h} hours`;
  return text.replace(/\{km\}/g, String(r.distance)).replace(/\{drive\}/g, drive);
}

const RAW: AirportIntent[] = [
  {
    slug: "riyadh-to-doha",
    routeId: "riyadh_qatar_airport",
    airportName: "Hamad International Airport",
    code: "DOH",
    destinationLabel: "Hamad International Airport (DOH), Doha, Qatar",
    international: true,
    heading: "Riyadh to Hamad International Airport (DOH)",
    answer:
      "You can request a private car from your Riyadh address to Hamad International Airport (DOH) in Doha, Qatar. It is the same road journey as Riyadh to Doha — about {km} km and roughly {drive} of driving, plus border time, via Al Ahsa and the Salwa–Abu Samra crossing — with the drop-off at the airport instead of a city address. Send us your flight time and we work the pickup back from it; the fare is confirmed before you book.",
    distinctions: [
      { name: "Doha city", desc: "A hotel, home or office in West Bay, The Pearl, Lusail or central Doha. Choose this if you are staying in Qatar." },
      { name: "Hamad International Airport (DOH)", desc: "A drop-off for a flight. The pickup time in Riyadh is planned from your departure time and the border, not from a hotel check-in." },
      { name: "A road transfer, not a flight", desc: "This is a ground journey by car. It does not replace, rebook or guarantee a flight connection." },
    ],
    askFor: [
      "Your pickup address in Riyadh and your travel date",
      "Your flight time at Hamad International Airport, if you are flying onward",
      "Your terminal or preferred drop-off point at the airport (we do not assume one)",
      "Passengers, luggage count and size, and one-way or return",
    ],
    tradeOff: {
      heading: "Drive to Doha for a flight, or fly from Riyadh?",
      body: [
        "Driving to DOH only makes sense when you can leave Riyadh early enough: the road leg is a full day's journey plus border time, which we cannot predict to the minute. Leave generous margin before your airline's check-in deadline.",
        "If your flight is from King Khalid International Airport (RUH), you do not need this route — a Riyadh airport transfer is the right service. A ground transfer to DOH suits travellers whose Doha plans start on the ground, groups with heavy luggage, or anyone who prefers door-to-door over two airports.",
      ],
    },
    entryNote:
      "Every passenger needs the right to enter Qatar. Check current entry requirements with official Qatar sources and your airline before you travel — Taxi Saudi Arabia does not arrange visas or immigration.",
    cta: "Request a Private Transfer to Doha Airport",
    faqs: [
      {
        question: "Can you take me from Riyadh to Hamad International Airport (DOH)?",
        answer:
          "Yes, on request. A private car collects you in Riyadh and drives to Hamad International Airport via Al Ahsa and the Salwa–Abu Samra crossing. Availability, border procedures and the fare are confirmed with you before you book.",
      },
      {
        question: "Is Riyadh to Doha airport a different trip from Riyadh to Doha?",
        answer:
          "The road and the crossing are the same. The difference is the drop-off: DOH instead of a Doha address, so the pickup time is planned backwards from your flight. Tell us the departure time and your terminal or preferred drop-off point when you ask for the quote.",
      },
      {
        question: "Can this replace a cancelled flight?",
        answer:
          "We cannot promise that. A ground transfer depends on vehicle availability, the route and border conditions and your right to enter Qatar. Check your flight status with your airline and official airport notices first, then ask us whether a road transfer is feasible for your dates.",
      },
    ],
  },
  {
    slug: "riyadh-to-kuwait",
    routeId: "riyadh_kuwait_airport",
    airportName: "Kuwait International Airport",
    code: "KWI",
    destinationLabel: "Kuwait International Airport (KWI), Kuwait",
    international: true,
    heading: "Riyadh to Kuwait International Airport (KWI)",
    answer:
      "You can request a private car from your Riyadh address to Kuwait International Airport (KWI). The journey follows the Riyadh to Kuwait City route — about {km} km and roughly {drive} of driving, plus border time, to the Gulf coast at Al Khafji and across at Nuwaiseeb — and ends at the airport instead of a city address. Vehicle permissions, border procedures and the final drop-off point are confirmed before the booking is accepted.",
    distinctions: [
      { name: "Kuwait City", desc: "Hotels, offices and homes in the city centre, Salmiya or Hawalli. Choose this if you are staying in Kuwait." },
      { name: "Kuwait International Airport (KWI)", desc: "A drop-off for a flight. The Riyadh pickup is planned from your departure time plus the border, not from a hotel address." },
      { name: "Fahaheel & Ahmadi", desc: "Towns south of the city on the way in, if your destination is there and not the airport." },
    ],
    askFor: [
      "Your pickup address in Riyadh and your travel date",
      "Your flight time at Kuwait International Airport, if you are flying onward",
      "Your terminal or preferred drop-off point at the airport (we do not assume one)",
      "Passengers, luggage count and size, and one-way or return",
    ],
    tradeOff: {
      heading: "Private car to KWI, or a flight from Riyadh?",
      body: [
        "The road to Kuwait is a long day, and border time varies. If you must be at a specific flight at KWI, build in a wide margin and tell us the deadline so we can say honestly whether the timing works.",
        "A car makes more sense for families, groups and travellers with heavy luggage, or when your plans in Kuwait begin at an address rather than at the airport. For one traveller with a small bag and a fixed flight time, check the airline options first.",
      ],
    },
    entryNote:
      "Every passenger needs the right to enter Kuwait; Saudi residents generally need a valid exit and re-entry visa. Check current requirements with official sources before you travel — Taxi Saudi Arabia does not arrange visas or immigration.",
    cta: "Request a Private Transfer to Kuwait Airport",
    faqs: [
      {
        question: "Can you take me from Riyadh to Kuwait International Airport (KWI)?",
        answer:
          "Yes, on request. A private car drives you from Riyadh to the airport via the Al Khafji–Nuwaiseeb crossing. We confirm vehicle permissions, border procedures, availability and the fare with you before you book.",
      },
      {
        question: "What is the difference between Riyadh to Kuwait City and Riyadh to KWI?",
        answer:
          "The road and the border crossing are the same. Kuwait City means a hotel, office or home address; KWI means a drop-off for a flight, so the Riyadh pickup is timed backwards from your departure. Give us the terminal or preferred drop-off point when you request the quote.",
      },
      {
        question: "Can this replace a cancelled flight?",
        answer:
          "We cannot promise that. A road transfer depends on availability, the route, safety and border conditions and your right to enter Kuwait. Check your flight status with your airline and official airport notices, then ask whether a ground transfer is feasible.",
      },
    ],
  },
  {
    slug: "riyadh-to-manama",
    routeId: "riyadh_bahrain_airport",
    airportName: "Bahrain International Airport",
    code: "BAH",
    destinationLabel: "Bahrain International Airport (BAH), Muharraq, Bahrain",
    international: true,
    heading: "Riyadh to Bahrain International Airport (BAH)",
    answer:
      "You can request a private car from your Riyadh address to Bahrain International Airport (BAH). The journey follows the Riyadh to Manama route — about {km} km and roughly {drive} of driving, plus border time, across the King Fahd Causeway — and continues to the airport on Muharraq instead of stopping in Manama. The causeway toll for the vehicle is included in the quoted fare, which is confirmed before you book.",
    distinctions: [
      { name: "Manama", desc: "Hotels, homes and offices in Seef, Juffair, the Diplomatic Area and Bahrain Financial Harbour. Choose this if you are staying on the island." },
      { name: "Bahrain International Airport (BAH)", desc: "A drop-off for a flight on Muharraq. The Riyadh pickup is planned from your departure time and the causeway, not from a hotel address." },
      { name: "Dammam or Al Khobar to Bahrain", desc: "A much shorter causeway trip from the Eastern Province — see the Dammam to Bahrain and Dammam airport (DMM) to Bahrain pages if you are starting there." },
    ],
    askFor: [
      "Your pickup address in Riyadh and your travel date",
      "Your flight time at Bahrain International Airport, if you are flying onward",
      "Your terminal or preferred drop-off point at the airport (we do not assume one)",
      "Passengers, luggage count and size, and one-way or return",
    ],
    tradeOff: {
      heading: "Drive to BAH, or fly from Riyadh?",
      body: [
        "The King Fahd Causeway is the only road link, and checks at both ends vary with traffic, so we cannot promise a crossing time. If you have a flight from BAH, share the departure time and we say honestly whether the timing is realistic.",
        "A private car suits groups, families and travellers with luggage who want one vehicle from their door. For one person with a small bag and a fixed flight, compare the airline options first. If your flight leaves from King Khalid International Airport (RUH), a Riyadh airport transfer is the right service instead.",
      ],
    },
    entryNote:
      "Every passenger needs the right to enter Bahrain, and Saudi residents generally need a valid exit and re-entry visa. Check current requirements with official sources before you travel — Taxi Saudi Arabia does not arrange visas or immigration.",
    cta: "Get a Riyadh to Bahrain Airport Transfer Quote",
    faqs: [
      {
        question: "Can you take me from Riyadh to Bahrain International Airport (BAH)?",
        answer:
          "Yes, on request. A private car drives from Riyadh across the King Fahd Causeway to the airport on Muharraq. Availability, border procedures and the fare are confirmed with you before you book.",
      },
      {
        question: "Is Riyadh to Bahrain airport the same as Riyadh to Manama?",
        answer:
          "They share the road and the causeway, but the destination differs. Manama is a city address; BAH is a drop-off for a flight on Muharraq, so the pickup is timed from your departure. Say which one you need and add your terminal or preferred drop-off point when you request the quote.",
      },
      {
        question: "Can this replace a cancelled flight?",
        answer:
          "We cannot promise that. A road transfer depends on availability, the route, safety and border conditions and your right to enter Bahrain. Check your flight status with your airline and official airport notices, then ask whether a ground transfer is feasible.",
      },
    ],
  },
  {
    slug: "riyadh-to-dammam",
    routeId: "riyadh_dammam_airport",
    airportName: "King Fahd International Airport",
    code: "DMM",
    destinationLabel: "King Fahd International Airport (DMM), Dammam",
    international: false,
    heading: "Riyadh to Dammam Airport (King Fahd International Airport, DMM)",
    answer:
      "You can book a private car from your Riyadh address straight to King Fahd International Airport (DMM) near Dammam. It is the Riyadh to Dammam corridor on Highway 40 — about {km} km and around {drive} of driving to Dammam — with the drop-off at the airport. Send your flight time and we plan the pickup backwards from it; the fare is confirmed on WhatsApp before you book.",
    distinctions: [
      { name: "Dammam city", desc: "Hotels, homes and offices in Dammam itself." },
      { name: "King Fahd International Airport (DMM)", desc: "The airport serving Dammam, Al Khobar and Dhahran. Choose this as the drop-off when you are catching a flight." },
      { name: "Al Khobar", desc: "The Corniche, hotels and compounds, with its own Riyadh to Al Khobar page; the Eastern Province drop-off if your final stop is Khobar and not the airport." },
      { name: "Dhahran", desc: "Aramco, KFUPM and Techno Valley. Dhahran is about 25 km from the airport on our Dhahran airport route, so a Dhahran hotel stay and a DMM flight are not the same drop-off." },
    ],
    askFor: [
      "Your pickup address in Riyadh and your travel date",
      "Your flight time at King Fahd International Airport",
      "Your terminal or preferred drop-off point at the airport (we do not assume one)",
      "Passengers, luggage count and size, and one-way or return",
    ],
    tradeOff: {
      heading: "Drive to DMM, or fly Riyadh to Dammam?",
      body: [
        "For a single traveller on a short domestic hop, a flight can be faster in the air but adds airport time at both ends. A private car runs from your door to the departure hall in one vehicle, with no baggage limits — useful for groups, families and equipment.",
        "If your onward flight leaves at a fixed time, tell us the deadline and we plan the pickup with margin; we cannot promise road conditions on the day.",
      ],
    },
    cta: "Book a Private Car to Dammam Airport",
    faqs: [
      {
        question: "Can I book a private car from Riyadh to Dammam Airport (DMM)?",
        answer:
          "Yes. A private sedan, SUV or van collects you at your Riyadh address and drives to King Fahd International Airport. Send your flight time, passengers and luggage on WhatsApp and the fare is confirmed before you book.",
      },
      {
        question: "What is the difference between Riyadh to Dammam and Riyadh to Dammam Airport?",
        answer:
          "The corridor is the same; the drop-off is different. Dammam means a city address, while DMM is a drop-off for a flight, so the pickup in Riyadh is timed from your departure. Add your terminal or preferred drop-off point when you request the quote.",
      },
      {
        question: "Does the airport serve Al Khobar and Dhahran too?",
        answer:
          "King Fahd International Airport serves the Dammam, Al Khobar and Dhahran area. If your final stop is a Khobar or Dhahran address and not the airport, say so when you request the quote so the drop-off is right.",
      },
    ],
  },
];

export const RIYADH_AIRPORT_INTENT: Record<string, AirportIntent> = Object.fromEntries(
  RAW.map((a) => [a.slug, { ...a, answer: fill(a.answer, a.slug) }]),
);

/** Structured prefill — route, airport, date, time, pax, luggage, vehicle, trip type. */
export function airportWhatsAppText(a: AirportIntent): string {
  return (
    `Hello Taxi Saudi Arabia, I would like a private airport transfer quote.\n\n` +
    `• Route: Riyadh to ${a.destinationLabel}\n` +
    `• Pickup address: \n• Travel date: \n• Pickup time: \n• Passengers: \n` +
    `• Luggage (number and approximate size): \n• Vehicle preference (Sedan / SUV / Van): \n` +
    `• Trip type (one-way / return): \n• Flight time and terminal / preferred drop-off point: \n• Additional requirements: \n\n` +
    `Please confirm vehicle availability, total fare, journey feasibility` +
    (a.international ? ` and any applicable border requirements` : ``) +
    ` before I book.`
  );
}

/** The four existing URLs, for the "Private Transfers from Riyadh to Major Airports" blocks. */
export const RIYADH_AIRPORT_LINKS = [
  { slug: "riyadh-to-manama", code: "BAH", hub: "Riyadh to Bahrain International Airport", alt: "Bahrain airport (BAH) by car from Riyadh", note: "King Fahd Causeway to Muharraq" },
  { slug: "riyadh-to-kuwait", code: "KWI", hub: "Riyadh to Kuwait International Airport", alt: "Kuwait airport (KWI) private transfer", note: "Al Khafji–Nuwaiseeb crossing" },
  { slug: "riyadh-to-dammam", code: "DMM", hub: "Riyadh to King Fahd International Airport, Dammam", alt: "Dammam airport (DMM) private car", note: "Highway 40 to the Eastern Province" },
  { slug: "riyadh-to-doha", code: "DOH", hub: "Riyadh to Hamad International Airport, Doha", alt: "Doha airport (DOH) transfer from Riyadh", note: "Salwa–Abu Samra crossing" },
] as const;
