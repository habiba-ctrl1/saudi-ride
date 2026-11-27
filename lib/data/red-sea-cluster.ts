// Red Sea International Airport (RSI) cluster — single source of truth for the
// /airports/red-sea hub and the four /routes/red-sea-airport-to-* pages
// (Turtle Bay, Shura Island, Nujuma, Shebara). Rates, logistics wording, FAQs
// and link graph live here ONLY — components never restate them.
//
// Sources (2026-10-08):
//  - SAR rates: supplied by the owner in chat (2026-10-08). They are
//    INDICATIVE private LAND-transfer rates; final fare is confirmed on
//    WhatsApp. Never emit them in structured data (no schema Offer).
//  - Shura Island is car-free; guests use mainland parking / causeway access
//    and the property's electric transfer — Fairmont The Red Sea, location page.
//  - Shebara: road + boat from the Turtle Bay Arrival Lounge, or seaplane —
//    shebara.sa/en/location. Nujuma & St. Regis Red Sea are on Ummahat Island
//    (boat or seaplane) — Red Sea Global water-aerodrome announcements.
//  - Six Senses Southern Dunes "approximately 45–60 minutes" — resort's own
//    getting-there pages. Shura area "approximately 25 minutes" — seo/venues.md.
//  - NO Turtle Bay / Nujuma / Shebara drive times, boat times, seaplane times
//    or boat/seaplane prices are published anywhere (not verified).
import { contactConfig } from "@/lib/config/contact";

export const RSI_NAME = "Red Sea International Airport";
export const RSI_FROM_LABEL = "Red Sea International Airport (RSI)";
export const RSI_HUB_HREF = "/airports/red-sea";

export type RsiRateKey = "turtleBay" | "shuraIsland" | "nujuma" | "shebara";

export const RSI_TRANSFER_RATES: Record<RsiRateKey, { sedan: number; suv: number }> = {
  turtleBay: { sedan: 400, suv: 550 },
  shuraIsland: { sedan: 450, suv: 600 },
  nujuma: { sedan: 400, suv: 550 },
  shebara: { sedan: 400, suv: 550 },
};

export const RSI_RATE_LABEL = "Indicative Private Transfer Rate";
export const RSI_RATE_DISCLAIMER =
  "Final fare confirmed on WhatsApp based on destination, vehicle, booking details and availability.";
export const RSI_FORM_MICROCOPY =
  "Private land transportation. Final fare confirmed on WhatsApp based on destination, vehicle, date and availability.";
export const RSI_ISLAND_MICROCOPY = "Boat or seaplane transfers are not included unless specifically confirmed.";
export const RSI_IMPORTANT_NOTICE =
  "The listed TSA rates cover private land transportation. Some Red Sea island resorts require a separate boat or seaplane connection. Please confirm the onward transfer directly with the resort or relevant Red Sea transfer service unless TSA has specifically confirmed it as part of your booking.";

export const sar = (n: number) => `SAR ${n.toLocaleString("en-US")}`;

export type TransferBadge = "land" | "land-boat" | "land-seaplane" | "quote";
export const BADGE_LABEL: Record<TransferBadge, string> = {
  land: "Land transfer",
  "land-boat": "Land + boat",
  "land-seaplane": "Land + seaplane",
  quote: "Quote on WhatsApp",
};

// ── WhatsApp (structured prefill — CLAUDE.md G4/G13) ─────────────────────────
export function rsiWhatsApp(destination: string, intro?: string, vehicle?: string): string {
  const lines = [
    intro ?? `Hello, I'd like a private transfer from ${RSI_FROM_LABEL} to ${destination}.`,
    "",
    `• From: ${RSI_FROM_LABEL}`,
    `• To: ${destination}`,
    "• Date & time: ",
    "• Flight number: ",
    "• Passengers & luggage: ",
    `• Vehicle: ${vehicle ?? "Sedan / SUV"}`,
  ];
  return `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// ── Destinations (hub cards, map, selector, form dropdown) ──────────────────
export interface RsiDestination {
  key: string;
  name: string;
  /** Compact label for the schematic map. */
  short?: string;
  /** Standalone page, if one exists. Never create URLs for map markers. */
  href?: string;
  /** Section on another page for destinations without their own URL. */
  anchorHref?: string;
  rateKey?: RsiRateKey;
  badges: TransferBadge[];
  group: "mainland" | "shura" | "island" | "desert";
  summary: string;
  /** Verified-only timing text. Omitted when unverified. */
  time?: string;
  /** Schematic map position (0–100 viewBox units). Not geographic. */
  map: { x: number; y: number };
}

export const RSI_DESTINATIONS: RsiDestination[] = [
  {
    key: "turtle-bay", name: "Turtle Bay", href: "/routes/red-sea-airport-to-turtle-bay", rateKey: "turtleBay",
    badges: ["land"], group: "mainland",
    summary: "Private land transfer to the Turtle Bay arrival point, where guests continue by boat to island resorts.",
    map: { x: 66, y: 34 },
  },
  {
    key: "shura-island", name: "Shura Island", href: "/routes/red-sea-airport-to-shura-island", rateKey: "shuraIsland",
    badges: ["land"], group: "shura",
    summary: "Private transfer to the Shura Island access and parking point; the final leg is the property's electric transfer.",
    time: "Approximately 25 minutes, depending on destination and conditions.",
    map: { x: 60, y: 62 },
  },
  {
    key: "nujuma", name: "Nujuma", href: "/routes/red-sea-airport-to-nujuma", rateKey: "nujuma",
    badges: ["land-boat", "land-seaplane"], group: "island",
    summary: "Land transfer to the Turtle Bay transfer point; Nujuma, a Ritz-Carlton Reserve, is reached onward by boat or seaplane.",
    map: { x: 80, y: 14 },
  },
  {
    key: "shebara", name: "Shebara", href: "/routes/red-sea-airport-to-shebara", rateKey: "shebara",
    badges: ["land-boat", "land-seaplane"], group: "island",
    summary: "Land transfer to Turtle Bay; Shebara is reached onward by boat or seaplane.",
    map: { x: 84, y: 46 },
  },
  {
    key: "amaala", name: "AMAALA", href: "/routes/red-sea-airport-to-amaala",
    badges: ["quote"], group: "mainland",
    summary: "Private transfer to AMAALA on the Red Sea coast. Fare confirmed on WhatsApp.",
    map: { x: 34, y: 12 },
  },
  {
    key: "six-senses", name: "Six Senses Southern Dunes", short: "Six Senses", anchorHref: "#resort-transfers",
    badges: ["quote"], group: "desert",
    summary: "A desert resort reached by road from RSI, with no boat leg. Quote on WhatsApp.",
    time: "Approximately 45–60 minutes, depending on conditions and exact destination.",
    map: { x: 18, y: 40 },
  },
  {
    key: "desert-rock", name: "Desert Rock", short: "Desert Rock", anchorHref: "#resort-transfers",
    badges: ["quote"], group: "desert",
    summary: "A desert resort reached by road from RSI. Quote on WhatsApp.",
    map: { x: 28, y: 68 },
  },
  {
    key: "miraval", name: "Miraval The Red Sea", short: "Miraval", href: "/routes/red-sea-airport-to-shura-island#shura-hotels",
    badges: ["land"], group: "shura", summary: "A Shura Island property. Follows the Shura Island access arrangement.",
    map: { x: 70, y: 78 },
  },
  {
    key: "sls", name: "SLS The Red Sea", short: "SLS", href: "/routes/red-sea-airport-to-shura-island#shura-hotels",
    badges: ["land"], group: "shura", summary: "A Shura Island property. Follows the Shura Island access arrangement.",
    map: { x: 62, y: 90 },
  },
  {
    key: "edition", name: "The Red Sea EDITION", short: "EDITION", href: "/routes/red-sea-airport-to-shura-island#shura-hotels",
    badges: ["land"], group: "shura", summary: "A Shura Island property. Follows the Shura Island access arrangement.",
    map: { x: 86, y: 88 },
  },
  {
    key: "intercontinental", name: "InterContinental The Red Sea", short: "InterContinental", href: "/routes/red-sea-airport-to-shura-island#shura-hotels",
    badges: ["land"], group: "shura", summary: "A Shura Island property. Follows the Shura Island access arrangement.",
    map: { x: 82, y: 68 },
  },
  {
    key: "st-regis", name: "St. Regis Red Sea", short: "St. Regis", href: "/routes/red-sea-airport-to-nujuma#island-resorts",
    badges: ["land-boat", "land-seaplane", "quote"], group: "island",
    summary: "An island resort reached by boat or seaplane after the land leg. Land transfer quoted on WhatsApp.",
    map: { x: 86, y: 28 },
  },
];

/** Dropdown values for the hub quote form. */
export const RSI_FORM_DESTINATIONS = [
  "Turtle Bay", "Shura Island", "Nujuma", "Shebara", "AMAALA", "Six Senses Southern Dunes", "Desert Rock",
  "Miraval The Red Sea", "SLS The Red Sea", "The Red Sea EDITION", "InterContinental The Red Sea",
  "St. Regis Red Sea", "Other Red Sea destination",
];

const rateHint = (k: RsiRateKey) => `Indicative: Sedan ${sar(RSI_TRANSFER_RATES[k].sedan)} · SUV ${sar(RSI_TRANSFER_RATES[k].suv)}`;
const ISLAND = " " + RSI_ISLAND_MICROCOPY;
const SHURA_HINT = `${rateHint("shuraIsland")} · Private cars do not go onto Shura Island; the property's electric transfer covers the final leg.`;

/** Per-destination helper text shown under the dropdown (form microcopy). */
export const RSI_FORM_HINTS: Record<string, string> = {
  "Turtle Bay": rateHint("turtleBay"),
  "Shura Island": SHURA_HINT,
  Nujuma: rateHint("nujuma") + " (to the Turtle Bay transfer point)." + ISLAND,
  Shebara: rateHint("shebara") + " (to Turtle Bay)." + ISLAND,
  AMAALA: "Quote on WhatsApp",
  "Six Senses Southern Dunes": "Quote on WhatsApp",
  "Desert Rock": "Quote on WhatsApp",
  "Miraval The Red Sea": SHURA_HINT,
  "SLS The Red Sea": SHURA_HINT,
  "The Red Sea EDITION": SHURA_HINT,
  "InterContinental The Red Sea": SHURA_HINT,
  "St. Regis Red Sea": "Quote on WhatsApp." + ISLAND,
  "Other Red Sea destination": "Quote on WhatsApp. Tell us the resort name in the notes.",
};

// ── Related-route descriptions (contextual, not generic) ─────────────────────
export const RSI_ROUTE_LINKS: Record<string, { href: string; label: string; blurb: string }> = {
  "turtle-bay": { href: "/routes/red-sea-airport-to-turtle-bay", label: "RSI to Turtle Bay", blurb: "The land leg that most island-resort journeys start with." },
  "shura-island": { href: "/routes/red-sea-airport-to-shura-island", label: "RSI to Shura Island", blurb: "Car-free island with access and parking at the causeway." },
  nujuma: { href: "/routes/red-sea-airport-to-nujuma", label: "RSI to Nujuma", blurb: "Luxury island resort reached by boat or seaplane after the road." },
  shebara: { href: "/routes/red-sea-airport-to-shebara", label: "RSI to Shebara", blurb: "Island resort reached from Turtle Bay by boat or seaplane." },
  amaala: { href: "/routes/red-sea-airport-to-amaala", label: "RSI to AMAALA", blurb: "A separate coastal destination with its own private transfer." },
};

// ── Hub content ──────────────────────────────────────────────────────────────
export const RSI_HUB = {
  title: "Red Sea International Airport (RSI) Taxi & Private Transfers | Shura, Turtle Bay, AMAALA",
  description:
    "Private transfers from Red Sea International Airport (RSI) to Shura Island, Turtle Bay, AMAALA and Red Sea resorts. Sedan & SUV, fare confirmed on WhatsApp.",
  ogTitle: "Red Sea International Airport (RSI) Private Transfers",
  ogDescription: "Pre-booked private land transfers from RSI to Shura Island, Turtle Bay, Nujuma, Shebara and AMAALA.",
  quickAnswer:
    "Taxi Saudi Arabia provides pre-booked private transfers from Red Sea International Airport to Shura Island, Turtle Bay, Nujuma, Shebara, AMAALA and selected Red Sea destinations. Sedan and SUV options are available, with final fare confirmed on WhatsApp.",
  faqs: [
    {
      question: "What is Red Sea International Airport (RSI)?",
      answer: "Red Sea International Airport (RSI) is the airport serving Red Sea Global's destinations on Saudi Arabia's Red Sea coast, including Shura Island and the Turtle Bay gateway used for island resorts such as Shebara and Nujuma. It is not in Umluj, NEOM or AlUla.",
    },
    {
      question: "Can I book a private transfer from RSI?",
      answer: "Yes. Send your destination, date, flight number, passengers and vehicle on WhatsApp or through the form, and we confirm the fare before your trip is scheduled. Transfers are private, pre-booked land transport with meet & greet at arrivals.",
    },
    {
      question: "How much is a private transfer from RSI?",
      answer: "Indicative private land-transfer rates are SAR 400 by sedan or SAR 550 by SUV to Turtle Bay, Nujuma's transfer point and Shebara's Turtle Bay land leg, and SAR 450 by sedan or SAR 600 by SUV to Shura Island hotels. Final fare is confirmed on WhatsApp.",
    },
    {
      question: "How much is RSI to Shura Island?",
      answer: "The current indicative private land-transfer rate is SAR 450 by sedan or SAR 600 by SUV. Final fare is confirmed on WhatsApp based on your hotel, vehicle, date and availability.",
    },
    {
      question: "How much is RSI to Turtle Bay?",
      answer: "The current indicative private land-transfer rate is SAR 400 by sedan or SAR 550 by SUV. Final fare is confirmed on WhatsApp.",
    },
    {
      question: "How do I get from RSI to Shebara?",
      answer: "Shebara is an island resort. The journey is a private land transfer from RSI to Turtle Bay, then a boat or seaplane onward to the resort, arranged with Shebara or the relevant Red Sea transfer service. TSA's listed rate covers the land leg.",
    },
    {
      question: "Does the Shebara transfer include the boat?",
      answer: "No. The listed TSA rate covers the private land-transfer component. Boat or seaplane transportation to Shebara is separate unless specifically confirmed.",
    },
    {
      question: "How do I get from RSI to Nujuma?",
      answer: "Nujuma is an island resort, so the car does not drive directly there. TSA provides the private land transfer from RSI to the Turtle Bay transfer point; the onward boat or seaplane to Nujuma is arranged separately with the resort or relevant transfer service.",
    },
    {
      question: "Does the Nujuma transfer include the boat or seaplane?",
      answer: "No. The listed rate covers private land transportation only. Boat or seaplane transfers to Nujuma are not included unless TSA has specifically confirmed them as part of your booking.",
    },
    {
      question: "Can I book an SUV from RSI?",
      answer: "Yes. Sedan and SUV are both available for every RSI transfer. The SUV suits families, more luggage and extra comfort. Tell us your passengers and luggage and we confirm the vehicle with the fare.",
    },
    {
      question: "Does the transfer include airport meet and greet?",
      answer: "Yes. Meet & greet at arrivals is included, together with luggage assistance at pickup. Share your flight number when you book so pickup can be coordinated.",
    },
    {
      question: "Can I book an RSI transfer on WhatsApp?",
      answer: "Yes. WhatsApp is the main booking channel. Send your trip details and we reply with the fare for your destination and vehicle; once you confirm, the trip is scheduled.",
    },
  ],
};

// ── Route pages ──────────────────────────────────────────────────────────────
export type RsiJourneyKind = "turtle-bay" | "shura" | "nujuma" | "shebara";

export interface RsiRoutePageData {
  slug: string;
  destKey: string;
  rateKey: RsiRateKey;
  destination: string;
  h1: string;
  eyebrow: string;
  lead: string;
  quickAnswer: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  journeyKind: RsiJourneyKind;
  badges: TransferBadge[];
  /** RSI→X rate label under the price block. */
  rateScope: string;
  /** Show the land-vs-marine notice. */
  island: boolean;
  /** Quick-facts rows (only verified values). */
  facts: { label: string; value: string }[];
  sections: { id?: string; heading: string; paragraphs: string[]; points?: { title: string; desc: string }[] }[];
  whoFor: { title: string; desc: string }[];
  whyPrebook: string[];
  hotels?: { name: string; note: string }[];
  faqs: { question: string; answer: string }[];
  related: RsiDestinationKey[];
  waIntro: string;
  ctaLabel: string;
  heroAlt: string;
}
type RsiDestinationKey = keyof typeof RSI_ROUTE_LINKS;

const R = RSI_TRANSFER_RATES;

export const RSI_ROUTE_PAGES: Record<string, RsiRoutePageData> = {
  "red-sea-airport-to-turtle-bay": {
    slug: "red-sea-airport-to-turtle-bay",
    destKey: "turtle-bay",
    rateKey: "turtleBay",
    destination: "Turtle Bay",
    h1: "RSI Airport to Turtle Bay Private Transfer",
    eyebrow: "Red Sea International Airport → Turtle Bay",
    lead: "Pre-book a private transfer from Red Sea International Airport to Turtle Bay with sedan and SUV options.",
    quickAnswer: `A private transfer from Red Sea International Airport (RSI) to Turtle Bay is an indicative ${sar(R.turtleBay.sedan)} by sedan or ${sar(R.turtleBay.suv)} by SUV. It is a private land transfer with meet & greet and luggage assistance. Turtle Bay is also where guests continue by boat to island resorts, and that onward leg is not included. Final fare is confirmed on WhatsApp.`,
    metaTitle: "RSI Airport to Turtle Bay Transfer | Private Car & SUV",
    metaDescription: "Pre-book a private car or SUV from Red Sea International Airport to Turtle Bay. Meet & greet, luggage assistance, indicative rates and fare confirmed on WhatsApp.",
    ogTitle: "RSI Airport to Turtle Bay Private Transfer",
    ogDescription: "Private land transfer from Red Sea International Airport to Turtle Bay. Sedan or SUV, fare confirmed on WhatsApp.",
    journeyKind: "turtle-bay",
    badges: ["land"],
    rateScope: "Private land transfer, RSI → Turtle Bay",
    island: false,
    facts: [
      { label: "From", value: "Red Sea International Airport (RSI)" },
      { label: "To", value: "Turtle Bay" },
      { label: "Transfer type", value: "Private land transfer" },
      { label: "Vehicles", value: "Sedan · SUV" },
    ],
    sections: [
      {
        heading: "What happens at Turtle Bay",
        paragraphs: [
          "Turtle Bay is the mainland arrival point used for several Red Sea island resorts. Guests heading to an island property typically come here first, then continue by boat. Shebara describes a boat connection from the Turtle Bay Arrival Lounge, and its seaplane option flies direct from RSI.",
          "This page covers the private road leg only: your driver meets you at RSI arrivals, helps with your luggage, and drives you to the Turtle Bay arrival point agreed with your booking.",
        ],
      },
      {
        heading: "Is Turtle Bay your final stop?",
        paragraphs: [
          "Book this transfer if Turtle Bay is where you are going, or if it is the start of your onward boat journey. If you are staying at Shebara or Nujuma, the same land leg applies, but those resorts have their own pages because the boat or seaplane arrangement differs.",
          "Exact onward transfer arrangements depend on the resort and your booking, so confirm the boat or seaplane time with your resort before you fly.",
        ],
        points: [
          { title: "Staying at Shebara", desc: "Use the Shebara page: land leg to Turtle Bay, then boat or seaplane." },
          { title: "Staying at Nujuma", desc: "Use the Nujuma page: land leg to the transfer point, then boat or seaplane." },
          { title: "Heading to Shura Island", desc: "Shura Island has a separate road and causeway access point; see the Shura Island page." },
        ],
      },
      {
        heading: "Booking your pickup",
        paragraphs: [
          "Send your flight number, arrival date, number of passengers, bags and preferred vehicle. Allow time between landing and your boat or seaplane slot, and tell us the slot if you have one so we can coordinate the pickup around it.",
        ],
      },
    ],
    whoFor: [
      { title: "Island-resort guests", desc: "Arriving at RSI and continuing by boat from Turtle Bay." },
      { title: "Couples and families", desc: "A private SUV keeps luggage and children together." },
      { title: "Executive and event travellers", desc: "A pre-booked car avoids waiting for a ride after landing." },
    ],
    whyPrebook: [
      "The fare is confirmed before you fly, so you land with the car already arranged.",
      "Your driver coordinates around your arrival so you can make your onward boat connection.",
      "A private vehicle keeps your luggage with you from the terminal to Turtle Bay.",
    ],
    faqs: [
      { question: "Where does the RSI to Turtle Bay transfer end?", answer: "The private land transfer ends at the Turtle Bay arrival point agreed with your booking. From there guests continue by boat to island resorts. Exact arrangements depend on your resort and booking." },
      { question: "How much is RSI to Turtle Bay?", answer: `The current indicative private land-transfer rate is ${sar(R.turtleBay.sedan)} by sedan or ${sar(R.turtleBay.suv)} by SUV. Final fare is confirmed on WhatsApp.` },
      { question: "Can I book an SUV for the Turtle Bay transfer?", answer: "Yes. SUV and sedan are both available. The SUV suits families and extra luggage, and we confirm the vehicle with your fare." },
      { question: "Is onward boat transportation included?", answer: "No. TSA's listed rate covers the private land transfer only. Boat or seaplane transfers are arranged separately with the resort or relevant Red Sea transfer service unless TSA has specifically confirmed them." },
      { question: "How do I arrange my pickup?", answer: "Message us on WhatsApp or use the quote form with your flight number, arrival date, passengers and vehicle. We confirm the fare, and once you accept, the trip is scheduled." },
      { question: "Is meet and greet included?", answer: "Yes. Meet & greet at arrivals and luggage assistance at pickup are part of the transfer." },
    ],
    related: ["shura-island", "nujuma", "shebara", "amaala"],
    waIntro: "Hello, I'd like a private transfer from Red Sea International Airport (RSI) to Turtle Bay.",
    ctaLabel: "Get Turtle Bay Transfer Quote",
    heroAlt: "Illustration of a private SUV driving from Red Sea International Airport to Turtle Bay",
  },

  "red-sea-airport-to-shura-island": {
    slug: "red-sea-airport-to-shura-island",
    destKey: "shura-island",
    rateKey: "shuraIsland",
    destination: "Shura Island",
    h1: "RSI Airport to Shura Island Private Transfer",
    eyebrow: "Red Sea International Airport → Shura Island",
    lead: "Pre-book a private transfer from Red Sea International Airport to Shura Island, with a clear picture of where the car stops and how the last leg works.",
    quickAnswer: `A private transfer from Red Sea International Airport (RSI) to Shura Island is an indicative ${sar(R.shuraIsland.sedan)} by sedan or ${sar(R.shuraIsland.suv)} by SUV. Shura Island is car-free, so the vehicle takes you to the mainland access, parking or causeway point and the property's electric transfer covers the final leg. Final fare is confirmed on WhatsApp.`,
    metaTitle: "RSI Airport to Shura Island Transfer | Private Car & SUV",
    metaDescription: "Private car or SUV from Red Sea International Airport to Shura Island hotels. See where the car stops, how the electric transfer works, and indicative rates.",
    ogTitle: "RSI Airport to Shura Island Private Transfer",
    ogDescription: "Private transfer from Red Sea International Airport to Shura Island's causeway and hotels. Sedan or SUV, fare confirmed on WhatsApp.",
    journeyKind: "shura",
    badges: ["land"],
    rateScope: "Private land transfer, RSI → Shura Island access point",
    island: false,
    facts: [
      { label: "From", value: "Red Sea International Airport (RSI)" },
      { label: "To", value: "Shura Island access / parking / causeway point" },
      { label: "Journey time", value: "Approximately 25 minutes, depending on destination and conditions" },
      { label: "Vehicles", value: "Sedan · SUV" },
    ],
    sections: [
      {
        id: "shura-access",
        heading: "Can private cars drive onto Shura Island?",
        paragraphs: [
          "Not in the usual door-to-door way. Shura Island is a car-free island: guests leave the vehicle at the mainland parking or causeway access point and cross to the island by electric transfer. Your journey is RSI Airport → Shura Island access / parking / causeway point → property transfer.",
          "Exact access and drop-off depend on the property, and each resort runs its own electric transfer arrangement. Tell us your hotel when you book and we confirm what applies to it.",
        ],
        points: [
          { title: "Our leg", desc: "A private vehicle from RSI arrivals to the Shura Island access point." },
          { title: "The property's leg", desc: "The resort's electric transfer carries you and your luggage across to the island." },
          { title: "Why it matters", desc: "A driver will not be waiting at your hotel door, and your luggage moves to the resort's transfer at the access point." },
        ],
      },
      {
        heading: "Luggage and the electric transfer",
        paragraphs: [
          "At the access point, your driver helps move your luggage to the property's electric transfer. How luggage is handled from there is the resort's own process, so ask your hotel if you have oversized or unusual items.",
        ],
      },
      {
        heading: "Who this transfer suits",
        paragraphs: [
          "The airport sits close to Shura Island, with an approximate journey of 25 minutes depending on destination and conditions, so most guests simply want a calm, pre-arranged ride rather than working out access on arrival.",
        ],
      },
    ],
    hotels: [
      { name: "SLS The Red Sea", note: "Shura Island property" },
      { name: "The Red Sea EDITION", note: "Shura Island property" },
      { name: "InterContinental The Red Sea", note: "Shura Island property" },
      { name: "Miraval The Red Sea", note: "Shura Island property" },
    ],
    whoFor: [
      { title: "Couples and honeymooners", desc: "A private sedan from the terminal to the island access point." },
      { title: "Families with luggage", desc: "An SUV leaves room for bags and children before the electric transfer." },
      { title: "Guests who want an independent car", desc: "A private option alongside whatever transfer your hotel offers. Confirm any hotel-arranged or complimentary transfer first." },
    ],
    whyPrebook: [
      "You know the pickup point and the access point before you land.",
      "Your driver explains where the car stops, so the electric-transfer handover is not a surprise.",
      "The rate is indicated up front and confirmed before the trip is scheduled.",
    ],
    faqs: [
      { question: "Can private cars drive onto Shura Island?", answer: "No. Shura Island is car-free. The vehicle goes to the mainland access, parking or causeway point and the property's electric transfer covers the final leg. Exact access depends on the property." },
      { question: "Where does the vehicle drop off?", answer: "At the Shura Island access, parking or causeway point applicable to your property. Tell us your hotel when booking and we confirm the drop-off with your fare." },
      { question: "How does the hotel transfer work?", answer: "After the drive from RSI, the property's electric transfer takes you and your luggage across to the island. Each resort sets its own arrangement, so confirm timing with your hotel." },
      { question: "Can luggage be transferred to the property?", answer: "Your driver helps with luggage from the terminal to the vehicle and at the access point. From there the property's transfer handles it; ask your hotel about oversized items." },
      { question: "How much is RSI to Shura Island?", answer: `The current indicative private land-transfer rate is ${sar(R.shuraIsland.sedan)} by sedan or ${sar(R.shuraIsland.suv)} by SUV. Final fare is confirmed on WhatsApp.` },
      { question: "Is my hotel's own transfer a better option?", answer: "It can be. Some properties offer their own airport transfer, and you should check what yours includes. TSA is an independent private option if you prefer your own car, a specific vehicle, or timing outside what the hotel arranges." },
      { question: "How long is the drive from RSI to Shura Island?", answer: "Approximately 25 minutes, depending on destination and conditions. This is a guide, not a guaranteed time." },
    ],
    related: ["turtle-bay", "nujuma", "shebara", "amaala"],
    waIntro: "Hello, I'd like a private transfer from Red Sea International Airport (RSI) to Shura Island.",
    ctaLabel: "Get Shura Island Transfer Quote",
    heroAlt: "Illustration of the route from Red Sea International Airport to the Shura Island causeway",
  },

  "red-sea-airport-to-nujuma": {
    slug: "red-sea-airport-to-nujuma",
    destKey: "nujuma",
    rateKey: "nujuma",
    destination: "Nujuma",
    h1: "RSI Airport to Nujuma Private Transfer",
    eyebrow: "Red Sea International Airport → Nujuma, a Ritz-Carlton Reserve",
    lead: "Nujuma is an island resort. TSA arranges the private land leg from Red Sea International Airport to the Turtle Bay transfer point; the boat or seaplane onward is arranged separately.",
    quickAnswer: `A private transfer from Red Sea International Airport (RSI) to the Nujuma transfer point at Turtle Bay is an indicative ${sar(R.nujuma.sedan)} by sedan or ${sar(R.nujuma.suv)} by SUV. The car does not drive onto Nujuma: guests continue by boat or seaplane, which is not included in the listed land rate. Final fare is confirmed on WhatsApp.`,
    metaTitle: "RSI Airport to Nujuma Transfer | Private Red Sea Airport Ride",
    metaDescription: "Private land transfer from Red Sea International Airport to the Nujuma transfer point at Turtle Bay. Boat or seaplane onward is separate. Sedan or SUV.",
    ogTitle: "RSI Airport to Nujuma Private Transfer",
    ogDescription: "Private land transfer from Red Sea International Airport to the Nujuma transfer point at Turtle Bay. Boat or seaplane onward is separate.",
    journeyKind: "nujuma",
    badges: ["land-boat", "land-seaplane"],
    rateScope: "RSI → Nujuma transfer-point / Turtle Bay land component",
    island: true,
    facts: [
      { label: "From", value: "Red Sea International Airport (RSI)" },
      { label: "Land leg ends at", value: "Turtle Bay / Nujuma transfer point" },
      { label: "Onward to Nujuma", value: "Boat or seaplane, arranged separately" },
      { label: "Vehicles", value: "Sedan · SUV" },
    ],
    sections: [
      {
        heading: "The Nujuma journey, leg by leg",
        paragraphs: [
          "Nujuma, a Ritz-Carlton Reserve, sits on an island, and guests reach it by boat or seaplane, not by road. The usual shape of the trip is RSI Airport, a private land transfer, the Turtle Bay or relevant transfer point, then a boat or seaplane to Nujuma.",
          "TSA's rate covers the private land transportation component only. Because the resort controls the onward boat or seaplane, confirm that booking directly with Nujuma or the relevant Red Sea transfer service.",
        ],
      },
      {
        id: "island-resorts",
        heading: "St. Regis Red Sea and other island resorts",
        paragraphs: [
          "Nujuma shares its island setting with other Red Sea Global island properties, including St. Regis Red Sea. They follow the same pattern: a land leg to the relevant transfer point, then a marine or air connection. We quote the land leg for these properties on WhatsApp; tell us the resort and your landing time and we confirm what applies.",
        ],
      },
      {
        heading: "Timing your arrival",
        paragraphs: [
          "Your boat or seaplane slot, not the car, usually sets the schedule. Share the slot with us when you book. We publish no driving time to Turtle Bay, so we coordinate the pickup around your confirmed onward departure.",
        ],
      },
    ],
    whoFor: [
      { title: "Luxury island guests", desc: "Arriving at RSI with an onward boat or seaplane to Nujuma." },
      { title: "Couples and small groups", desc: "A private sedan or SUV for the land leg, separate from the resort's own marine transfer." },
      { title: "Executive travellers", desc: "A pre-booked car that lines up with a confirmed onward connection." },
    ],
    whyPrebook: [
      "The land leg is arranged before you fly, so there is no scramble for a ride at the airport.",
      "You get a clear split between what TSA covers and what the resort covers.",
      "Your pickup can be coordinated around your boat or seaplane slot.",
    ],
    faqs: [
      { question: "Does the car go directly to Nujuma?", answer: "No. Nujuma is an island resort. The car goes from RSI to the Turtle Bay transfer point, and guests continue by boat or seaplane arranged separately." },
      { question: "Where does the land transfer end?", answer: "At the Turtle Bay or relevant transfer point for your onward connection. Exact arrangements depend on the resort and your booking." },
      { question: "Is the boat included?", answer: "No. The listed rate covers private land transportation only. Boat or seaplane transfers to Nujuma are not included unless TSA has specifically confirmed them as part of your booking." },
      { question: "Is a seaplane available through the resort?", answer: "The resort offers a seaplane option alongside the boat. Availability and booking are handled by the resort or relevant Red Sea transfer service, not by TSA." },
      { question: "How much is RSI to the Nujuma transfer point?", answer: `The current indicative private land-transfer rate is ${sar(R.nujuma.sedan)} by sedan or ${sar(R.nujuma.suv)} by SUV. Final fare is confirmed on WhatsApp.` },
      { question: "Can I book an SUV?", answer: "Yes. Sedan and SUV are both available for the land leg, and we confirm the vehicle with the fare." },
    ],
    related: ["turtle-bay", "shebara", "shura-island", "amaala"],
    waIntro: "Hello, I'd like a private transfer from RSI to Nujuma / Turtle Bay transfer point.",
    ctaLabel: "Get Nujuma Transfer Quote",
    heroAlt: "Illustration of the journey from Red Sea International Airport to Nujuma by road, then boat or seaplane",
  },

  "red-sea-airport-to-shebara": {
    slug: "red-sea-airport-to-shebara",
    destKey: "shebara",
    rateKey: "shebara",
    destination: "Shebara",
    h1: "RSI Airport to Shebara Private Transfer",
    eyebrow: "Red Sea International Airport → Shebara",
    lead: "Shebara is an island resort reached from Turtle Bay. TSA arranges the private land transfer from RSI; the boat or seaplane is separate.",
    quickAnswer: `A private land transfer from Red Sea International Airport (RSI) to Turtle Bay for Shebara is an indicative ${sar(R.shebara.sedan)} by sedan or ${sar(R.shebara.suv)} by SUV. This is the land leg only: the boat or seaplane to Shebara is not included in the rate. Final fare is confirmed on WhatsApp.`,
    metaTitle: "RSI Airport to Shebara Transfer | Private Red Sea Airport Ride",
    metaDescription: "Private land transfer from Red Sea International Airport to Turtle Bay for Shebara. Boat or seaplane onward is separate. Sedan or SUV, fare on WhatsApp.",
    ogTitle: "RSI Airport to Shebara Private Transfer",
    ogDescription: "Private land transfer from Red Sea International Airport to Turtle Bay for Shebara. Boat or seaplane onward is separate.",
    journeyKind: "shebara",
    badges: ["land-boat", "land-seaplane"],
    rateScope: "RSI → Turtle Bay / Shebara land-transfer component",
    island: true,
    facts: [
      { label: "From", value: "Red Sea International Airport (RSI)" },
      { label: "Land leg ends at", value: "Turtle Bay" },
      { label: "Onward to Shebara", value: "Boat or seaplane, arranged separately" },
      { label: "Vehicles", value: "Sedan · SUV" },
    ],
    sections: [
      {
        heading: "How guests reach Shebara",
        paragraphs: [
          "Shebara describes two ways to arrive: a boat from the Turtle Bay Arrival Lounge, or a seaplane from RSI. TSA does not operate either. What we provide is the private road leg from the airport to Turtle Bay for guests taking the boat route.",
        ],
        points: [
          { title: "Road leg: TSA", desc: "Private vehicle from RSI arrivals to Turtle Bay." },
          { title: "Marine leg: resort", desc: "Boat from Turtle Bay to Shebara, arranged with the resort." },
          { title: "Air alternative: resort", desc: "Seaplane option arranged with the resort or relevant operator." },
        ],
      },
      {
        heading: "Land versus marine: what the rate covers",
        paragraphs: [
          "The listed TSA rate covers the private land transportation component. Boat or seaplane arrangements to Shebara are separate and should be arranged with the resort or relevant Red Sea transfer service unless TSA has specifically confirmed them. We do not publish boat or seaplane prices.",
          "If you take the seaplane from RSI, you do not need a land transfer to Turtle Bay for the outbound trip, but you may still want a car for your return or for other Red Sea stops.",
        ],
      },
      {
        heading: "Planning around your resort transfer",
        paragraphs: [
          "Ask Shebara for your boat or seaplane time first, then send it to us with your flight number. We then coordinate the car around that slot rather than guessing a drive time.",
        ],
      },
    ],
    whoFor: [
      { title: "Shebara guests", desc: "Taking the boat from Turtle Bay after landing at RSI." },
      { title: "Couples seeking privacy", desc: "A private car for the land leg rather than shared transport." },
      { title: "Small groups", desc: "An SUV keeps your group and luggage together to Turtle Bay." },
    ],
    whyPrebook: [
      "You land with the road leg already arranged and the fare confirmed.",
      "You understand up front that the boat or seaplane is a separate booking.",
      "Your pickup is coordinated with your confirmed resort transfer time.",
    ],
    faqs: [
      { question: "Does the car go directly to Shebara?", answer: "No. Shebara is an island resort. The car goes from RSI to Turtle Bay, and guests continue by boat or seaplane arranged separately." },
      { question: "Where does the road transfer end?", answer: "At Turtle Bay, the arrival point for the boat connection. Exact arrangements depend on the resort and your booking." },
      { question: "Is the boat included?", answer: "No. The listed TSA rate covers the private land-transfer component. Boat or seaplane transportation to Shebara is separate unless specifically confirmed." },
      { question: "Can I arrange only the land portion?", answer: "Yes. That is exactly what the listed rate covers. Arrange the boat or seaplane with Shebara or the relevant Red Sea transfer service." },
      { question: "How much is the RSI to Shebara land transfer?", answer: `The current indicative private land-transfer rate is ${sar(R.shebara.sedan)} by sedan or ${sar(R.shebara.suv)} by SUV. Final fare is confirmed on WhatsApp.` },
      { question: "Do I need the car if I take the seaplane?", answer: "Not for the outbound journey, since the seaplane flies from RSI. A private car can still be useful for other Red Sea stops; message us and we quote it." },
    ],
    related: ["turtle-bay", "nujuma", "shura-island", "amaala"],
    waIntro: "Hello, I'd like a private land transfer from RSI to the Shebara transfer point.",
    ctaLabel: "Get Shebara Transfer Quote",
    heroAlt: "Illustration of the journey from Red Sea International Airport to Shebara by road, then boat or seaplane",
  },
};

export const RSI_ROUTE_SLUGS = Object.keys(RSI_ROUTE_PAGES);
