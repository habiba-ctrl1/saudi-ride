// Data for /riyadh-alternative-airports — the comparison hub that sits above the
// per-airport sections on the existing Riyadh route pages (owner Option A,
// 2026-10-09: no new per-airport URLs; this page links DOWN to those sections).
//
// Truth sources:
// - Distance / drive time: ROUTES_DATA only (read at render time, never typed here).
//   These are the figures for the destination CITY on each existing route page;
//   an airport drop-off shifts them slightly and no airport-specific figure is published.
// - Crossings: existing bespoke pages (lib/data/cross-border*.ts) — King Fahd Causeway,
//   Salwa–Abu Samra, Al Batha. No border wait time, terminal, price or quote turnaround is claimed.
// - Entry rules: always "check official sources — we do not arrange visas".
// - Vehicle categories only (seo/facts.md): executive sedan, full-size SUV, VIP van, coaster. No models.

import { ROUTES_DATA } from "./routes";

export interface AltAirport {
  /** Outbound route page slug under /routes (existing URL). */
  slug: string;
  /** Reverse route page slug, only where it exists. */
  reverseSlug?: string;
  /** Anchor of the airport section already on the route page, where one exists. */
  anchor?: string;
  city: string;
  airportName: string;
  code: string;
  country: string;
  international: boolean;
  border: string;
  /** Vehicle categories that suit this route. */
  vehicles: string;
  suits: string;
  /** Short card copy. */
  blurb: string;
  image: { src: string; alt: string };
  /** Analytics route identifier — no personal data. */
  routeId: string;
}

export const ALT_AIRPORTS: AltAirport[] = [
  {
    slug: "riyadh-to-dammam",
    anchor: "airport-dmm",
    city: "Dammam",
    airportName: "King Fahd International Airport",
    code: "DMM",
    country: "Saudi Arabia",
    international: false,
    border: "Domestic — no border",
    vehicles: "Sedan, SUV or van",
    suits: "Eastern Province business trips, family travel and connections that are cheaper or easier to book from DMM.",
    blurb: "The shortest of the five. It is a straight run east on Highway 40 with no border, so the plan is mostly pickup timing and luggage space.",
    image: { src: "/airports/dammam-hero.webp", alt: "King Fahd International Airport terminal area, Dammam" },
    routeId: "riyadh_dammam_airport",
  },
  {
    slug: "riyadh-to-manama",
    reverseSlug: "manama-to-riyadh",
    anchor: "airport-bah",
    city: "Bahrain",
    airportName: "Bahrain International Airport",
    code: "BAH",
    country: "Bahrain",
    international: true,
    border: "International — King Fahd Causeway",
    vehicles: "Sedan or SUV (cross-border eligibility confirmed per trip)",
    suits: "Travellers whose onward flight leaves from Muharraq, and those combining a Bahrain stay with a flight.",
    blurb: "Drive east to the Eastern Province, cross the King Fahd Causeway, and finish at Muharraq. Border time is the variable to plan around.",
    image: { src: "/cross-border/king-fahd-causeway-bahrain.webp", alt: "The King Fahd Causeway linking Saudi Arabia and Bahrain" },
    routeId: "riyadh_bahrain_airport",
  },
  {
    slug: "riyadh-to-doha",
    reverseSlug: "doha-to-riyadh",
    anchor: "airport-doh",
    city: "Doha",
    airportName: "Hamad International Airport",
    code: "DOH",
    country: "Qatar",
    international: true,
    border: "International — Salwa–Abu Samra crossing",
    vehicles: "Sedan, SUV or van (cross-border eligibility confirmed per trip)",
    suits: "Onward international connections through Hamad, and groups who want door-to-door instead of two airports.",
    blurb: "A full day's road leg via Al Ahsa to the Salwa crossing. Leave early and keep a wide margin before check-in closes.",
    image: { src: "/cross-border/doha-west-bay-skyline.webp", alt: "Doha West Bay skyline, Qatar" },
    routeId: "riyadh_qatar_airport",
  },
  {
    slug: "riyadh-to-jeddah",
    reverseSlug: "jeddah-to-riyadh",
    city: "Jeddah",
    airportName: "King Abdulaziz International Airport",
    code: "JED",
    country: "Saudi Arabia",
    international: false,
    border: "Domestic — no border",
    vehicles: "Sedan, SUV or van",
    suits: "Umrah and Hajj departures, Red Sea connections, and travellers who prefer to drive rather than fly the domestic sector.",
    blurb: "The longest domestic run: a full day on the road, so consider travelling the day before rather than the same morning.",
    image: { src: "/airports/jed-hero.webp", alt: "King Abdulaziz International Airport, Jeddah" },
    routeId: "riyadh_jeddah_airport",
  },
  {
    slug: "riyadh-to-dubai",
    reverseSlug: "dubai-to-riyadh",
    city: "Dubai",
    airportName: "Dubai International Airport",
    code: "DXB",
    country: "United Arab Emirates",
    international: true,
    border: "International — Saudi–UAE land border",
    vehicles: "Sedan, SUV or van (cross-border eligibility confirmed per trip)",
    suits: "Long-haul connections through DXB for travellers who accept a full day (or an overnight) on the road.",
    blurb: "The longest international option. Plan it as a full day on the road, not a same-day connection.",
    image: { src: "/cross-border/dubai-skyline-sheikh-zayed-road.webp", alt: "Dubai skyline along Sheikh Zayed Road" },
    routeId: "riyadh_dubai_airport",
  },
];

export function altFacts(slug: string) {
  const r = ROUTES_DATA.find((x) => x.slug === slug);
  if (!r) return { km: 0, drive: "" };
  const h = Math.floor(r.duration / 60);
  const m = r.duration % 60;
  return { km: r.distance, drive: m ? `${h} h ${m} min` : `${h} h` };
}

/** Structured, bulleted WhatsApp prefill (CLAUDE.md G4). */
export function altWaText(a?: AltAirport): string {
  const dest = a ? `${a.airportName} (${a.code}), ${a.city}` : "";
  const lines = [
    a ? `Salam! I'd like a private transfer from Riyadh to ${dest}.` : "Salam! I'm comparing airports and would like a private transfer quote from Riyadh.",
    `• From (Riyadh pickup address / hotel):`,
    `• To (airport${a ? ": " + a.code : ""}):${a ? "" : " "}`,
    `• Date & time of pickup:`,
    `• Flight number & departure time:`,
    `• Passengers & luggage:`,
    `• Vehicle (sedan / SUV / van):`,
    `• One-way or return:`,
  ];
  if (a?.international) lines.push(`• Passport nationality / entry requirements checked: `);
  return lines.join("\n");
}
