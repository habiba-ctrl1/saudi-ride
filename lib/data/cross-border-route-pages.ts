// Bespoke cross-border route pages (rendered by components/cross-border/
// CrossBorderRoutePage.tsx instead of the generic route template).
// Started 2026-10-03 with the Saudi ↔ Jordan cluster; other corridors move
// here one at a time after approval (seo/clusters/CROSS-BORDER-ROUTE-MATRIX.md).
//
// Truth sources:
// - Distance/time: ROUTES_DATA only (OSRM-measured 2026-10-03, see routes.ts).
// - Crossings: seo/venues.md "Borders" — Al Durrah/Durra (Haql–Aqaba, ~30 km
//   from each, Wikipedia) and Halat Ammar–Al Mudawwara (Halat Ammar ~110 km
//   from Tabuk; Al Mudawwara ~322 km south of Amman — Logistics Cluster LCA).
// - Road/town sequence: OSRM turn-by-turn, 2026-10-03.
// - Service facts: seo/facts.md (fixed fare, 15–30 min free waiting on every
//   trip, border crossing fees included in the fare, English/Arabic drivers,
//   free cancellation up to 24 h, cash or bank transfer).
// - No visa rules, border times, permits or prices. H1 text stays
//   "<from> to <to>" (unchanged from the template — CLAUDE.md rule 3).

import type { CorridorSlug } from "./cross-border";

export interface RouteStage {
  /** Short label, e.g. "Saudi exit". */
  label: string;
  title: string;
  desc: string;
  /** Approximate km from pickup (measured), shown as a marker. */
  km?: number;
  kind: "origin" | "road" | "border" | "destination";
}

export interface CrossBorderRoutePageData {
  slug: string;
  /** Hero kicker, e.g. "Saudi Arabia → Jordan · Halat Ammar crossing". */
  eyebrow: string;
  lead: string;
  quickAnswer: string;
  crossing: { name: string; saudiSide: string; otherSide: string };
  bestFor: string;
  stages: RouteStage[];
  dropoffs: { heading: string; intro: string; points: { name: string; desc: string }[] };
  whoBooks: { title: string; desc: string }[];
  tips: { title: string; desc: string }[];
  tradeOff?: { heading: string; body: string[] };
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string }[];
  /** Distance by pickup point, where the origin is a large area (NEOM). Measured, OSRM. */
  pickupPoints?: { heading: string; intro: string; rows: { name: string; km: number; drive: string }[] };
  /** Hub this route belongs to. */
  corridorSlug: CorridorSlug;
}

const DURRAH = { name: "Al Durrah crossing", saudiSide: "Al Durrah, near Haql", otherSide: "Durra crossing, Aqaba" };
const AMMAR = { name: "Halat Ammar – Al Mudawwara crossing", saudiSide: "Halat Ammar", otherSide: "Al Mudawwara" };

const AQABA_DROPOFFS = {
  heading: "Where we drop off in Aqaba",
  intro: "Aqaba is about 30 km from the Al Durrah crossing, so it is the first stop in Jordan. Give us the exact address when you book.",
  points: [
    { name: "City hotels & the waterfront", desc: "Central Aqaba hotels, apartments and the seafront area." },
    { name: "South Beach & Tala Bay", desc: "Resorts and dive hotels on the coast south of the city, which is the side the border is on." },
    { name: "Ayla", desc: "The marina and residential development north of the centre." },
    { name: "King Hussein International Airport (AQJ)", desc: "For travellers flying on from Aqaba. Tell us your flight time." },
  ],
};

const SALWA = { name: "Salwa – Abu Samra crossing", saudiSide: "Salwa", otherSide: "Abu Samra" };

const DOHA_DROPOFFS = {
  heading: "Where we drop off in Doha",
  intro: "Abu Samra is about 90 km from Doha, so the last stretch is inside Qatar. Give us the exact address when you book.",
  points: [
    { name: "West Bay", desc: "Hotels, towers and offices on the Corniche." },
    { name: "The Pearl & Lusail", desc: "Residences, hotels and marinas north of the centre." },
    { name: "Msheireb & central Doha", desc: "Downtown hotels, Souq Waqif area and homes across the city." },
    { name: "Hamad International Airport (DOH)", desc: "For onward flights. Tell us your departure time." },
  ],
};

// NEOM is a large region — measured road distances by pickup point (OSRM 2026-10-03).
const NEOM_TO_AQABA_POINTS = {
  heading: "Distance by NEOM pickup point",
  intro: "NEOM covers a long stretch of coast, so the distance to Aqaba depends on where we collect you.",
  rows: [
    { name: "Magna (northern NEOM coast)", km: 165, drive: "2h 10m" },
    { name: "NEOM Bay Airport (NUM) / Sharma", km: 235, drive: "3h" },
    { name: "Oxagon (near Duba)", km: 300, drive: "3h 35m" },
  ],
};

export const CROSS_BORDER_ROUTE_PAGES: Record<string, CrossBorderRoutePageData> = {
  "tabuk-to-aqaba": {
    slug: "tabuk-to-aqaba",
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Saudi Arabia → Jordan · Al Durrah crossing",
    lead: "From your door in Tabuk west to Haql on the Gulf of Aqaba, across the Al Durrah crossing and into Aqaba: one private car and the same driver for the whole trip.",
    quickAnswer:
      "A private transfer from Tabuk to Aqaba is about 270 km and roughly 3 hours 50 minutes of driving. The car heads west to Haql on the Gulf of Aqaba coast, crosses at Al Durrah and reaches Aqaba about 30 km after the border, with border time on top. The fare is fixed in writing before you book and includes border crossing fees. Each passenger carries their own valid documents.",
    crossing: DURRAH,
    bestFor: "Weekend breaks, Red Sea divers, families",
    stages: [
      { label: "Pickup", title: "Tabuk", desc: "Home, hotel, office or Tabuk Regional Airport (TUU).", km: 0, kind: "origin" },
      { label: "West to the coast", title: "Tabuk–Haql road", desc: "Across the mountains to Haql, the last Saudi town on the Gulf of Aqaba.", km: 230, kind: "road" },
      { label: "Saudi exit", title: "Al Durrah", desc: "Saudi exit checks just north of Haql. Every passenger goes through in person.", kind: "border" },
      { label: "Jordan entry", title: "Durra crossing", desc: "Jordan entry checks on the other side, about 30 km from Aqaba.", kind: "border" },
      { label: "Drop-off", title: "Aqaba", desc: "Your hotel, resort, apartment or the airport.", km: 270, kind: "destination" },
    ],
    dropoffs: AQABA_DROPOFFS,
    whoBooks: [
      { title: "Tabuk residents on a short break", desc: "Aqaba on the Red Sea is the closest city across the border. Book a return and the driver brings you back on your chosen date." },
      { title: "Divers and Red Sea visitors", desc: "SUV or van with room for dive bags, dropped at your South Beach or Tala Bay hotel." },
      { title: "Visiting family", desc: "Families with children and luggage, door to door without changing cars at the border." },
    ],
    tips: [
      { title: "Leave in daylight", desc: "The Tabuk–Haql road crosses mountains. A morning start puts the drive and the border in daylight." },
      { title: "Returning the same week?", desc: "Book both legs together. The return (Aqaba to Tabuk) is confirmed in the same quote." },
      { title: "Flying from Aqaba?", desc: "If you are connecting to a flight at King Hussein International Airport, tell us the time so we add border margin." },
    ],
    faqs: [
      { question: "How far is Tabuk from Aqaba by car?", answer: "About 270 km — roughly 3 hours 50 minutes of driving west to Haql, across the Al Durrah crossing and on to Aqaba, plus time at the border, which varies." },
      { question: "Which border crossing is used from Tabuk to Aqaba?", answer: "Al Durrah (Durra), on the Gulf of Aqaba coast about 30 km from both Haql in Saudi Arabia and Aqaba in Jordan. It is the coastal crossing and the direct one for Aqaba." },
      { question: "Are border crossing fees included in the fare?", answer: "Yes. Border crossing fees for the vehicle are included in your fixed fare. Personal visa or entry fees, where they apply, are paid by each passenger." },
      { question: "What documents do I need to enter Jordan from Tabuk?", answer: "A valid passport and the right to enter Jordan for every passenger; Saudi residents generally also need a valid exit and re-entry visa. Entry rules depend on nationality and change, so check official sources before travel. We do not arrange visas." },
      { question: "Is this a local Aqaba taxi?", answer: "No. It is a pre-booked private car with a professional driver from your door in Tabuk to your address in Aqaba. We are not a Jordanian taxi service." },
    ],
    related: [
      { href: "/routes/aqaba-to-tabuk", label: "Return trip: Aqaba to Tabuk" },
      { href: "/routes/tabuk-to-petra", label: "Tabuk to Petra via Halat Ammar" },
      { href: "/routes/tabuk-to-wadi-rum", label: "Tabuk to Wadi Rum desert camps" },
      { href: "/locations/tabuk", label: "Tabuk chauffeur & airport transfers" },
    ],
  },

  "aqaba-to-tabuk": {
    slug: "aqaba-to-tabuk",
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Jordan → Saudi Arabia · Al Durrah crossing",
    lead: "Pickup at your Aqaba hotel or home, south to the Al Durrah crossing, through Haql and over the mountains to Tabuk. One car and one fixed fare.",
    quickAnswer:
      "A private transfer from Aqaba to Tabuk is about 270 km and roughly 3 hours 50 minutes of driving, plus time at the Al Durrah crossing. You are collected in Aqaba, cross into Saudi Arabia near Haql and drive inland to your address in Tabuk. The fixed fare is confirmed in writing and includes border crossing fees.",
    crossing: DURRAH,
    bestFor: "Return legs, arrivals into Saudi via Jordan, Tabuk-bound workers",
    stages: [
      { label: "Pickup", title: "Aqaba", desc: "Hotel, resort, apartment or King Hussein International Airport (AQJ).", km: 0, kind: "origin" },
      { label: "Jordan exit", title: "Durra crossing", desc: "About 30 km south of Aqaba. Each passenger completes the Jordan exit in person.", kind: "border" },
      { label: "Saudi entry", title: "Al Durrah", desc: "Saudi entry checks, then into Haql.", kind: "border" },
      { label: "Inland", title: "Haql–Tabuk road", desc: "East through the mountains towards Tabuk.", km: 40, kind: "road" },
      { label: "Drop-off", title: "Tabuk", desc: "Home, hotel, office or Tabuk Regional Airport (TUU).", km: 270, kind: "destination" },
    ],
    dropoffs: {
      heading: "Where we drop off in Tabuk",
      intro: "Anywhere in Tabuk city, or onward to your flight.",
      points: [
        { name: "Tabuk city", desc: "Homes, hotels, offices and compounds across the city." },
        { name: "Tabuk Regional Airport (TUU)", desc: "Tell us your flight time — pickup in Aqaba is planned back from it with border margin." },
        { name: "Onward to NEOM", desc: "Going to NEOM instead? See our Aqaba to NEOM route." },
      ],
    },
    whoBooks: [
      { title: "Returning residents", desc: "The return leg of a Tabuk–Aqaba trip, or Tabuk residents coming back from a break in Jordan." },
      { title: "Visitors entering Saudi via Jordan", desc: "Travellers who flew into Aqaba and continue to Tabuk or a domestic flight from TUU." },
      { title: "Teams heading to north-west Saudi", desc: "Executive sedan or SUV for staff — written quote for companies." },
    ],
    tips: [
      { title: "Catching a flight at TUU?", desc: "Share the flight time. We count back the drive, a border margin and check-in, and suggest a pickup time." },
      { title: "Have your Saudi entry ready", desc: "Make sure every passenger can enter Saudi Arabia before the trip. We cannot help at the border with visas." },
    ],
    faqs: [
      { question: "How long does Aqaba to Tabuk take by car?", answer: "About 3 hours 50 minutes of driving for roughly 270 km, plus time at the Al Durrah crossing. Allow extra margin if you have a flight from Tabuk." },
      { question: "Can you pick me up at Aqaba airport?", answer: "Yes. Pickup at King Hussein International Airport (AQJ) or any address in Aqaba can be booked. Share your flight number when you book." },
      { question: "Are the border crossing fees extra?", answer: "No. Border crossing fees for the vehicle are included in the fixed fare. Personal visa or entry fees, where they apply, are the passenger's." },
      { question: "What do I need to enter Saudi Arabia at Al Durrah?", answer: "A valid passport and the right to enter Saudi Arabia for every passenger. Requirements depend on nationality and change, so check official sources before travel. We do not arrange visas." },
      { question: "Does the driver wait if I'm late?", answer: "Yes. 15–30 minutes of free waiting is included on every trip. Tell us early if your plans change." },
    ],
    related: [
      { href: "/routes/tabuk-to-aqaba", label: "Outbound: Tabuk to Aqaba" },
      { href: "/routes/aqaba-to-neom", label: "Aqaba to NEOM by the coast road" },
      { href: "/locations/tabuk", label: "Getting around Tabuk" },
    ],
  },

  "neom-to-aqaba": {
    slug: "neom-to-aqaba",
    pickupPoints: NEOM_TO_AQABA_POINTS,
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Saudi Arabia → Jordan · Gulf of Aqaba coast",
    lead: "Up the Gulf of Aqaba coast from NEOM through Haql, across the Al Durrah crossing and into Aqaba, with the sea alongside most of the way.",
    quickAnswer:
      "A private transfer from NEOM to Aqaba runs north along the Gulf of Aqaba coast to Haql, crosses at Al Durrah and ends in Aqaba. Measured from the NEOM Bay Airport (Sharma) area it is about 235 km and roughly 3 hours of driving; pickups further north in NEOM, such as Magna, are shorter. Border time is extra. Border crossing fees are included in the fixed fare.",
    crossing: DURRAH,
    bestFor: "NEOM staff weekends, contractors, visitors",
    stages: [
      { label: "Pickup", title: "NEOM", desc: "Project sites, staff housing, hotels or NEOM Bay Airport (NUM). Distance depends on where in NEOM you start.", km: 0, kind: "origin" },
      { label: "Coast road", title: "North along the Gulf of Aqaba", desc: "The coastal highway north through the NEOM region to Haql.", km: 200, kind: "road" },
      { label: "Saudi exit", title: "Al Durrah", desc: "Saudi exit checks just north of Haql.", kind: "border" },
      { label: "Jordan entry", title: "Durra crossing", desc: "Jordan entry, then about 30 km to Aqaba.", kind: "border" },
      { label: "Drop-off", title: "Aqaba", desc: "Hotel, resort, apartment or King Hussein International Airport (AQJ).", km: 235, kind: "destination" },
    ],
    dropoffs: AQABA_DROPOFFS,
    whoBooks: [
      { title: "NEOM employees on days off", desc: "Aqaba is the closest city across the border from NEOM. Book a return for the weekend." },
      { title: "Contractors and consultants", desc: "Executive sedan or SUV between site and Aqaba — written quote and corporate invoicing on request." },
      { title: "Visitors flying via Aqaba", desc: "Use AQJ as a gateway and continue to NEOM, or the reverse." },
    ],
    tips: [
      { title: "Tell us your exact NEOM pickup", desc: "NEOM is a large region. Magna, Sharma and Oxagon are very different distances from the border, and the fare follows the actual pickup point." },
      { title: "Site access", desc: "Some NEOM sites need access clearance. Arrange your gate pass in advance so the driver can collect you at the gate you are cleared for." },
    ],
    faqs: [
      { question: "How far is NEOM from Aqaba?", answer: "It depends on where in NEOM you start. From the NEOM Bay Airport (Sharma) area it is about 235 km by road; from Magna in the north it is about 165 km. Both cross at Al Durrah near Haql." },
      { question: "Which border do you use between NEOM and Aqaba?", answer: "Al Durrah on the Gulf of Aqaba coast, just north of Haql. Aqaba is about 30 km beyond it." },
      { question: "Are border crossing fees included?", answer: "Yes — border crossing fees for the vehicle are included in the fixed fare. Personal visa or entry fees, where they apply, are the passenger's." },
      { question: "What documents do I need?", answer: "A valid passport and the right to enter Jordan; Saudi residents generally also need a valid exit and re-entry visa. Check official sources before travel — we do not arrange visas." },
      { question: "Can my company book regular NEOM–Aqaba trips?", answer: "Yes. Email an RFQ with dates, passengers and pickup points and we reply with a written quote. Corporate invoicing can be arranged through our sister company." },
    ],
    related: [
      { href: "/routes/aqaba-to-neom", label: "Return trip: Aqaba to NEOM" },
      { href: "/routes/neom-to-amman", label: "NEOM to Amman via Aqaba" },
      { href: "/locations/neom", label: "NEOM private transfers" },
    ],
  },

  "aqaba-to-neom": {
    slug: "aqaba-to-neom",
    pickupPoints: { ...NEOM_TO_AQABA_POINTS, heading: "Distance by NEOM drop-off point", intro: "NEOM covers a long stretch of coast, so the distance from Aqaba depends on where we drop you." },
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Jordan → Saudi Arabia · Gulf of Aqaba coast",
    lead: "From Aqaba south to the Al Durrah crossing, through Haql and down the Saudi coast road to your site, housing or hotel in NEOM.",
    quickAnswer:
      "A private transfer from Aqaba to NEOM crosses at Al Durrah near Haql and follows the Saudi coast road south. To the NEOM Bay Airport (Sharma) area it is about 235 km and roughly 3 hours of driving, plus border time; northern NEOM is closer. The fixed fare includes border crossing fees, and 15–30 minutes of free waiting is included.",
    crossing: DURRAH,
    bestFor: "Staff returning to site, arrivals via Aqaba airport",
    stages: [
      { label: "Pickup", title: "Aqaba", desc: "Hotel, apartment or King Hussein International Airport (AQJ).", km: 0, kind: "origin" },
      { label: "Jordan exit", title: "Durra crossing", desc: "About 30 km south of Aqaba.", kind: "border" },
      { label: "Saudi entry", title: "Al Durrah", desc: "Saudi entry checks, then Haql.", kind: "border" },
      { label: "Coast road", title: "South through NEOM", desc: "The coastal highway along the Gulf of Aqaba.", km: 40, kind: "road" },
      { label: "Drop-off", title: "NEOM", desc: "Your gate, housing, hotel or NEOM Bay Airport (NUM).", km: 235, kind: "destination" },
    ],
    dropoffs: {
      heading: "Where we drop off in NEOM",
      intro: "Give us the exact gate or address — distances inside NEOM vary a lot.",
      points: [
        { name: "Project gates & staff housing", desc: "Drop at the gate you are cleared for." },
        { name: "Hotels and the Sharma area", desc: "Including NEOM Bay Airport (NUM)." },
        { name: "Northern NEOM", desc: "Magna and the coast closer to Haql are shorter trips." },
      ],
    },
    whoBooks: [
      { title: "Staff returning from leave", desc: "Fly into Aqaba and drive to site without a domestic connection." },
      { title: "Weekend return legs", desc: "The return half of a NEOM–Aqaba weekend." },
    ],
    tips: [
      { title: "Arriving at AQJ?", desc: "Share the flight number when you book. Pickup is planned around your landing time." },
      { title: "Gate clearance", desc: "Make sure your site access is arranged before the trip." },
    ],
    faqs: [
      { question: "How long is the drive from Aqaba to NEOM?", answer: "To the NEOM Bay Airport (Sharma) area about 235 km — roughly 3 hours of driving plus the Al Durrah crossing. Northern NEOM is closer." },
      { question: "Can you collect me from Aqaba airport and drive me to NEOM?", answer: "Yes. Pickup at King Hussein International Airport (AQJ) is available. Share your flight number when you book." },
      { question: "Are border fees included?", answer: "Yes, border crossing fees for the vehicle are included in the fixed fare." },
      { question: "What do I need to enter Saudi Arabia?", answer: "A valid passport and the right to enter Saudi Arabia for every passenger. Check official sources before travel — we do not arrange visas." },
    ],
    related: [
      { href: "/routes/neom-to-aqaba", label: "Outbound: NEOM to Aqaba" },
      { href: "/routes/aqaba-to-tabuk", label: "Aqaba to Tabuk" },
      { href: "/locations/neom", label: "NEOM transportation" },
    ],
  },

  "tabuk-to-amman": {
    slug: "tabuk-to-amman",
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Saudi Arabia → Jordan · Halat Ammar crossing",
    lead: "North from Tabuk to the Halat Ammar crossing, into Jordan at Al Mudawwara, past Ma'an and up the Desert Highway to Amman: the shortest road between the two cities.",
    quickAnswer:
      "A private transfer from Tabuk to Amman is about 455 km and roughly 5 hours 35 minutes of driving, plus border time. The shortest road goes north to the Halat Ammar crossing (about 110 km from Tabuk), enters Jordan at Al Mudawwara and follows the Desert Highway past Ma'an and Queen Alia International Airport to Amman. The fixed fare includes border crossing fees.",
    crossing: AMMAR,
    bestFor: "Family visits, business in Amman, AMM flights",
    stages: [
      { label: "Pickup", title: "Tabuk", desc: "Home, hotel, office or Tabuk Regional Airport (TUU).", km: 0, kind: "origin" },
      { label: "Saudi exit", title: "Halat Ammar", desc: "About 110 km north of Tabuk. Every passenger completes the Saudi exit in person.", km: 110, kind: "border" },
      { label: "Jordan entry", title: "Al Mudawwara", desc: "Jordan's southern inland crossing.", kind: "border" },
      { label: "Ma'an", title: "Onto the Desert Highway", desc: "The route joins Jordan's main north–south highway at Ma'an.", km: 240, kind: "road" },
      { label: "Past AMM", title: "Queen Alia International Airport", desc: "The airport is on the way, south of the city.", km: 435, kind: "road" },
      { label: "Drop-off", title: "Amman", desc: "Your hotel, home or office anywhere in the city.", km: 455, kind: "destination" },
    ],
    dropoffs: {
      heading: "Where we drop off in Amman",
      intro: "Anywhere in Greater Amman, or at the airport on the way in.",
      points: [
        { name: "Hotels & business districts", desc: "Abdali, Shmeisani, Jabal Amman and the hotels along the city's main roads." },
        { name: "Homes across Amman", desc: "Give us the address or a pin." },
        { name: "Queen Alia International Airport (AMM)", desc: "Passed on the way in, for onward flights." },
      ],
    },
    whoBooks: [
      { title: "Families visiting relatives", desc: "Door to door with luggage. Often a better fit than two flights for a group." },
      { title: "Business travel to Amman", desc: "Executive sedan or SUV with a written quote for the company." },
      { title: "Travellers flying out of AMM", desc: "Drop at Queen Alia International Airport, timed with border margin." },
    ],
    tips: [
      { title: "Why Halat Ammar and not Al Durrah?", desc: "Going via Al Durrah and Aqaba adds about 130 km. Halat Ammar is the direct inland crossing for Amman, Petra and Wadi Rum." },
      { title: "Plan it as a day", desc: "With the border and a rest stop it fills most of a day. Start in the morning." },
      { title: "Break the trip at Petra", desc: "Petra is near Ma'an, just off the way. Ask for a multi-day quote with an overnight stop." },
    ],
    faqs: [
      { question: "How far is Tabuk from Amman by car?", answer: "About 455 km by the shortest road — roughly 5 hours 35 minutes of driving via the Halat Ammar–Al Mudawwara crossing and the Desert Highway, plus border time." },
      { question: "Which border crossing is used from Tabuk to Amman?", answer: "Halat Ammar on the Saudi side and Al Mudawwara on the Jordanian side. It is the direct inland crossing; going via Al Durrah and Aqaba is about 130 km longer." },
      { question: "Can you stop at Petra on the way?", answer: "Yes, as a multi-day or extended booking. Petra (Wadi Musa) is close to Ma'an on this route. Tell us how long you want there and we quote it." },
      { question: "Are border crossing fees included?", answer: "Yes. Border crossing fees for the vehicle are included in the fixed fare. Personal visa or entry fees are the passenger's." },
      { question: "What documents do I need for Jordan?", answer: "A valid passport and the right to enter Jordan for every passenger; Saudi residents generally also need a valid exit and re-entry visa. Check official sources before travel — we do not arrange visas." },
      { question: "Is it better to fly from Tabuk to Amman?", answer: "For one person with light luggage a flight can be quicker overall, if one suits your dates. For families, groups or heavy luggage the car is simpler: door to door with one fare and no airport transfers." },
    ],
    related: [
      { href: "/routes/tabuk-to-petra", label: "Tabuk to Petra on the same road" },
      { href: "/routes/tabuk-to-wadi-rum", label: "Tabuk to Wadi Rum" },
      { href: "/routes/tabuk-to-aqaba", label: "Tabuk to Aqaba by the coast" },
      { href: "/locations/tabuk", label: "Tabuk chauffeur service" },
    ],
  },

  "tabuk-to-petra": {
    slug: "tabuk-to-petra",
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Saudi Arabia → Jordan · Halat Ammar crossing",
    lead: "From Tabuk through the Halat Ammar crossing and Ma'an to Wadi Musa, the town at the gate of Petra. You can be at your hotel by the Rose City the same day.",
    quickAnswer:
      "A private transfer from Tabuk to Petra is about 275 km and roughly 3 hours 40 minutes of driving, plus border time. The car crosses at Halat Ammar–Al Mudawwara, passes Ma'an and drops you in Wadi Musa, the town at the Petra entrance. The fare is fixed in writing, includes border crossing fees and 15–30 minutes of free waiting.",
    crossing: AMMAR,
    bestFor: "Heritage trips, AlUla-to-Petra itineraries, families",
    stages: [
      { label: "Pickup", title: "Tabuk", desc: "Home, hotel or Tabuk Regional Airport (TUU).", km: 0, kind: "origin" },
      { label: "Saudi exit", title: "Halat Ammar", desc: "About 110 km north of Tabuk.", km: 110, kind: "border" },
      { label: "Jordan entry", title: "Al Mudawwara", desc: "Jordan entry checks, in person.", kind: "border" },
      { label: "Ma'an", title: "Through Ma'an", desc: "The last city before the turn west to Petra.", km: 240, kind: "road" },
      { label: "Drop-off", title: "Wadi Musa (Petra)", desc: "Your hotel in Wadi Musa or the Petra Visitor Centre.", km: 275, kind: "destination" },
    ],
    dropoffs: {
      heading: "Where we drop off at Petra",
      intro: "Petra is entered from the town of Wadi Musa. Most visitors stay there.",
      points: [
        { name: "Wadi Musa hotels", desc: "Hotels from the town centre down to the site entrance." },
        { name: "Petra Visitor Centre", desc: "The main entrance to the archaeological site." },
        { name: "Little Petra & Bedouin camps", desc: "Camps outside town — share the camp's location pin." },
      ],
    },
    whoBooks: [
      { title: "Heritage travellers", desc: "Combine AlUla and Hegra in Saudi Arabia with Petra in Jordan, two Nabataean cities on one trip." },
      { title: "Families and small groups", desc: "SUV or van, with luggage, straight to the hotel." },
      { title: "Short breaks from Tabuk", desc: "Book a return and the driver collects you after your stay." },
    ],
    tips: [
      { title: "Arrive the day before your visit", desc: "Petra is best explored early in the day. Arriving in Wadi Musa the afternoon before makes that easy." },
      { title: "Add Wadi Rum", desc: "Wadi Rum is about 110 km (under 2 hours) from Petra. A multi-day quote can cover Tabuk → Petra → Wadi Rum → back." },
      { title: "Coming from AlUla?", desc: "Ask for AlUla → Petra as one booking via Tabuk. We quote it on request." },
    ],
    faqs: [
      { question: "How far is Petra from Tabuk?", answer: "About 275 km by road — roughly 3 hours 40 minutes of driving via the Halat Ammar–Al Mudawwara crossing and Ma'an, plus border time." },
      { question: "Which border do you cross to get from Tabuk to Petra?", answer: "Halat Ammar on the Saudi side and Al Mudawwara on the Jordanian side. It is shorter than going via Al Durrah and Aqaba." },
      { question: "Can the driver wait while I visit Petra and take me back?", answer: "Yes, as a return or multi-day booking. A full visit usually takes most of a day, so many guests stay overnight in Wadi Musa and return the next day." },
      { question: "Are border crossing fees included?", answer: "Yes. Border crossing fees for the vehicle are included in the fixed fare. Petra entry tickets and personal visa fees are not." },
      { question: "What documents do I need?", answer: "A valid passport and the right to enter Jordan for every passenger; Saudi residents generally also need a valid exit and re-entry visa. Check official sources before travel." },
    ],
    related: [
      { href: "/routes/tabuk-to-wadi-rum", label: "Tabuk to Wadi Rum" },
      { href: "/routes/tabuk-to-amman", label: "Continue north: Tabuk to Amman" },
      { href: "/locations/alula", label: "AlUla private driver" },
      { href: "/services/heritage-tours", label: "Heritage tours & day charters" },
    ],
  },

  "tabuk-to-wadi-rum": {
    slug: "tabuk-to-wadi-rum",
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Saudi Arabia → Jordan · Halat Ammar crossing",
    lead: "From Tabuk across the Halat Ammar crossing and through the southern Jordanian desert to Wadi Rum. We drop you at the village or your camp's meeting point.",
    quickAnswer:
      "A private transfer from Tabuk to Wadi Rum is about 230 km and roughly 3 hours 50 minutes of driving, plus border time. The car crosses at Halat Ammar–Al Mudawwara and drives through southern Jordan to the Wadi Rum protected area, ending at the visitor centre, the village or your camp's meeting point. Border crossing fees are included in the fixed fare.",
    crossing: AMMAR,
    bestFor: "Desert camps, photographers, adventure trips",
    stages: [
      { label: "Pickup", title: "Tabuk", desc: "Home, hotel or Tabuk Regional Airport (TUU).", km: 0, kind: "origin" },
      { label: "Saudi exit", title: "Halat Ammar", desc: "About 110 km north of Tabuk.", km: 110, kind: "border" },
      { label: "Jordan entry", title: "Al Mudawwara", desc: "Jordan entry checks, in person.", kind: "border" },
      { label: "Desert roads", title: "Across southern Jordan", desc: "Slower desert roads, which is why the last stretch takes longer than its distance suggests.", kind: "road" },
      { label: "Drop-off", title: "Wadi Rum", desc: "Visitor centre, Wadi Rum Village or your camp's meeting point.", km: 230, kind: "destination" },
    ],
    dropoffs: {
      heading: "Where we drop off at Wadi Rum",
      intro: "Most camps inside the protected area are reached by the camp's own 4×4. We take you to the agreed meeting point.",
      points: [
        { name: "Wadi Rum Visitor Centre", desc: "At the entrance to the protected area." },
        { name: "Wadi Rum Village", desc: "Where many camps collect their guests." },
        { name: "Camp meeting points", desc: "Share the camp's instructions or pin when you book." },
      ],
    },
    whoBooks: [
      { title: "Desert-camp guests", desc: "A night or two under the stars, with a return booked for after checkout." },
      { title: "Photographers and hikers", desc: "SUV with room for gear, early start to arrive in good light." },
      { title: "Petra + Wadi Rum trips", desc: "Combine both in one multi-day booking from Tabuk." },
    ],
    tips: [
      { title: "Check your camp's pickup point", desc: "Ask the camp where it collects guests. Inside the protected area, camps usually use their own 4×4s." },
      { title: "Allow for the desert stretch", desc: "The Jordan-side roads are slower, so the drive takes longer than the 230 km suggests." },
    ],
    faqs: [
      { question: "How far is Wadi Rum from Tabuk?", answer: "About 230 km by road — roughly 3 hours 50 minutes of driving via the Halat Ammar–Al Mudawwara crossing, plus border time." },
      { question: "Can you drive me all the way to my Wadi Rum camp?", answer: "We drive to the visitor centre, the village or the meeting point your camp gives you. Inside the protected area most camps transfer guests in their own 4×4 vehicles." },
      { question: "Can I combine Wadi Rum and Petra?", answer: "Yes. A multi-day booking can cover Tabuk → Wadi Rum → Petra and back. Tell us your nights and we quote the whole trip." },
      { question: "Are border fees included?", answer: "Yes, border crossing fees for the vehicle are included in the fixed fare. Protected-area entry and personal visa fees are not." },
      { question: "What documents do I need?", answer: "A valid passport and the right to enter Jordan; Saudi residents generally also need a valid exit and re-entry visa. Check official sources before travel." },
    ],
    related: [
      { href: "/routes/tabuk-to-petra", label: "Tabuk to Petra" },
      { href: "/routes/tabuk-to-aqaba", label: "Tabuk to Aqaba" },
      { href: "/locations/tabuk", label: "Tabuk private car service" },
    ],
  },

  "neom-to-amman": {
    slug: "neom-to-amman",
    pickupPoints: {
      heading: "Distance by NEOM pickup point",
      intro: "All three run via Haql, Al Durrah, Aqaba and the Desert Highway; only the Saudi leg changes.",
      rows: [
        { name: "Magna (northern NEOM coast)", km: 480, drive: "5h 55m" },
        { name: "NEOM Bay Airport (NUM) / Sharma", km: 550, drive: "6h 40m" },
        { name: "Oxagon (near Duba)", km: 620, drive: "7h 20m" },
      ],
    },
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Saudi Arabia → Jordan · Al Durrah crossing",
    lead: "From NEOM up the Gulf of Aqaba coast, across the Al Durrah crossing to Aqaba, then the whole length of Jordan's Desert Highway to Amman.",
    quickAnswer:
      "A private transfer from NEOM to Amman runs north along the coast to Haql, crosses at Al Durrah into Aqaba and follows the Desert Highway to Amman. From the NEOM Bay Airport (Sharma) area it is about 550 km and roughly 6 hours 40 minutes of driving, plus border time; northern NEOM pickups are shorter. Border crossing fees are included in the fixed fare.",
    crossing: DURRAH,
    bestFor: "Staff leave trips, Amman business, AMM flights",
    stages: [
      { label: "Pickup", title: "NEOM", desc: "Gate, housing, hotel or NEOM Bay Airport (NUM).", km: 0, kind: "origin" },
      { label: "Saudi exit", title: "Al Durrah", desc: "After the coast road through Haql.", km: 200, kind: "border" },
      { label: "Jordan entry", title: "Durra crossing → Aqaba", desc: "Into Jordan and through Aqaba.", kind: "border" },
      { label: "Desert Highway", title: "North past Ma'an", desc: "Jordan's main highway from Aqaba to the capital.", kind: "road" },
      { label: "Drop-off", title: "Amman", desc: "Hotel, home or Queen Alia International Airport (AMM).", km: 550, kind: "destination" },
    ],
    dropoffs: {
      heading: "Where we drop off in Amman",
      intro: "Hotels, homes and offices across Amman, or the airport on the way in.",
      points: [
        { name: "Abdali, Shmeisani & Jabal Amman", desc: "Business districts and city hotels." },
        { name: "Queen Alia International Airport (AMM)", desc: "South of the city, on the Desert Highway." },
      ],
    },
    whoBooks: [
      { title: "NEOM staff heading home on leave", desc: "Door to door to Amman or the airport, with luggage." },
      { title: "Business between NEOM and Amman", desc: "Executive sedan or SUV, written quote for companies." },
    ],
    tips: [
      { title: "Your pickup point changes the distance", desc: "Magna in the north is much closer to the border than Sharma or Oxagon. Give us your exact pickup." },
      { title: "Long day — start early", desc: "With the border, this is most of a day on the road." },
    ],
    faqs: [
      { question: "How far is NEOM from Amman by road?", answer: "From the NEOM Bay Airport (Sharma) area it is about 550 km — roughly 6 hours 40 minutes of driving via Al Durrah, Aqaba and the Desert Highway, plus border time. Northern NEOM is shorter." },
      { question: "Which border is used from NEOM to Amman?", answer: "Al Durrah near Haql. From the NEOM coast it is the closest crossing, and the route continues through Aqaba up the Desert Highway." },
      { question: "Are border crossing fees included?", answer: "Yes. Border crossing fees for the vehicle are included in the fixed fare." },
      { question: "What documents do I need?", answer: "A valid passport and the right to enter Jordan; Saudi residents generally also need a valid exit and re-entry visa. Check official sources before travel — we do not arrange visas." },
      { question: "Should I fly instead?", answer: "If a convenient flight exists and you travel light, flying can be faster. The car makes sense for families, heavy luggage, or a door-to-door trip from a NEOM site without airport connections." },
    ],
    related: [
      { href: "/routes/neom-to-aqaba", label: "Shorter trip: NEOM to Aqaba" },
      { href: "/routes/tabuk-to-amman", label: "Tabuk to Amman via Halat Ammar" },
      { href: "/locations/neom", label: "NEOM transportation" },
    ],
  },

  "alula-to-aqaba": {
    slug: "alula-to-aqaba",
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Saudi Arabia → Jordan · Red Sea coast & Al Durrah",
    lead: "From AlUla west to the Red Sea, north along the coast road through the NEOM region to Haql, then across Al Durrah to Aqaba. It is the shortest road between the two.",
    quickAnswer:
      "A private transfer from AlUla to Aqaba is about 620 km and roughly 9 hours of driving, plus border time. The shortest road runs west to the Red Sea coast near Duba, north along the coast through Haql and across the Al Durrah crossing to Aqaba. Going via Tabuk is about 85 km longer. Border crossing fees are included in the fixed fare.",
    crossing: DURRAH,
    bestFor: "AlUla → Red Sea → Jordan itineraries",
    stages: [
      { label: "Pickup", title: "AlUla", desc: "Hotel, resort or AlUla International Airport (ULH).", km: 0, kind: "origin" },
      { label: "To the coast", title: "West to the Red Sea near Duba", desc: "Across the desert to the coastal highway.", km: 300, kind: "road" },
      { label: "Coast road", title: "North through the NEOM region", desc: "Along the Red Sea and Gulf of Aqaba to Haql.", km: 580, kind: "road" },
      { label: "Border", title: "Al Durrah → Durra crossing", desc: "Saudi exit and Jordan entry, each in person.", kind: "border" },
      { label: "Drop-off", title: "Aqaba", desc: "Hotel, resort or King Hussein International Airport (AQJ).", km: 620, kind: "destination" },
    ],
    dropoffs: AQABA_DROPOFFS,
    whoBooks: [
      { title: "Heritage-to-beach itineraries", desc: "End an AlUla trip on the Red Sea in Aqaba, in one car." },
      { title: "Groups with luggage", desc: "Van or SUV with room for everyone's bags on a long day." },
    ],
    tips: [
      { title: "It is a full day", desc: "About 9 hours of driving plus the border. Start early, or ask for an overnight stop on the coast." },
      { title: "Going to Petra rather than Aqaba?", desc: "Petra is reached via Tabuk and the Halat Ammar crossing — ask and we quote AlUla → Petra." },
    ],
    tradeOff: {
      heading: "Drive the whole way, or fly part of it?",
      body: [
        "This is a long day. If you are travelling light, a flight plus a private car on each end may suit you better.",
        "The car wins for groups, heavy luggage and travellers who want to see the Red Sea coast without connections.",
      ],
    },
    faqs: [
      { question: "How far is AlUla from Aqaba?", answer: "About 620 km by the shortest road — roughly 9 hours of driving via the Red Sea coast and the Al Durrah crossing, plus border time." },
      { question: "Does the route go through Tabuk?", answer: "Not by default. The shortest road goes west to the Red Sea coast near Duba and north along the coast to Haql. Via Tabuk is about 85 km longer, and can be booked if you prefer." },
      { question: "Can we stop overnight on the way?", answer: "Yes. Ask for a two-day quote with an overnight stop and the driver's stay is included in the fare." },
      { question: "Are border crossing fees included?", answer: "Yes, border crossing fees for the vehicle are included in the fixed fare." },
      { question: "What documents do I need?", answer: "A valid passport and the right to enter Jordan; Saudi residents generally also need a valid exit and re-entry visa. Check official sources before travel." },
    ],
    related: [
      { href: "/routes/alula-to-amman", label: "AlUla to Amman via Tabuk" },
      { href: "/routes/tabuk-to-petra", label: "Tabuk to Petra" },
      { href: "/locations/alula", label: "AlUla private driver" },
    ],
  },

  "alula-to-amman": {
    slug: "alula-to-amman",
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Saudi Arabia → Jordan · Halat Ammar crossing",
    lead: "From AlUla north to Tabuk, through the Halat Ammar crossing and up the Desert Highway to Amman, across two countries in one private car.",
    quickAnswer:
      "A private transfer from AlUla to Amman is about 895 km and roughly 11 hours of driving, plus border time. The shortest road goes north to Tabuk, crosses at Halat Ammar–Al Mudawwara and follows the Desert Highway past Ma'an to Amman. Most travellers split it with a night in Tabuk or Petra, which we can quote as one trip.",
    crossing: AMMAR,
    bestFor: "Multi-day heritage journeys, families relocating",
    stages: [
      { label: "Pickup", title: "AlUla", desc: "Hotel, resort or AlUla International Airport (ULH).", km: 0, kind: "origin" },
      { label: "North", title: "To Tabuk", desc: "The natural overnight point if you split the trip.", kind: "road" },
      { label: "Saudi exit", title: "Halat Ammar", desc: "About 110 km beyond Tabuk.", kind: "border" },
      { label: "Jordan", title: "Al Mudawwara → Ma'an", desc: "Join the Desert Highway at Ma'an; Petra is nearby.", kind: "road" },
      { label: "Drop-off", title: "Amman", desc: "Hotel, home or Queen Alia International Airport (AMM).", km: 895, kind: "destination" },
    ],
    dropoffs: {
      heading: "Where we drop off in Amman",
      intro: "Anywhere in Amman, or the airport on the way in.",
      points: [
        { name: "City hotels & homes", desc: "Abdali, Shmeisani, Jabal Amman and beyond." },
        { name: "Queen Alia International Airport (AMM)", desc: "South of the city, on the route in." },
      ],
    },
    whoBooks: [
      { title: "Heritage travellers", desc: "AlUla and Hegra, then Petra, then Amman, as a multi-day trip with one driver." },
      { title: "Families moving with luggage", desc: "Van or SUV and one fare for the whole move." },
    ],
    tips: [
      { title: "Split it in two", desc: "An overnight in Tabuk or Wadi Musa (Petra) turns 11 hours of driving into two comfortable days." },
      { title: "Consider flying if you are solo", desc: "For one traveller with light luggage, a flight is usually faster." },
    ],
    tradeOff: {
      heading: "One long day, two days, or fly?",
      body: [
        "One day is possible but long. Two days with a night in Tabuk or Petra is the comfortable option, and the driver's overnight is included in a multi-day quote.",
        "Flying is faster if you travel light. The car suits groups, families and anyone who wants Petra on the way.",
      ],
    },
    faqs: [
      { question: "How far is AlUla from Amman by road?", answer: "About 895 km — roughly 11 hours of driving via Tabuk and the Halat Ammar–Al Mudawwara crossing, plus border time." },
      { question: "Which border is used from AlUla to Amman?", answer: "Halat Ammar (Saudi) – Al Mudawwara (Jordan), north of Tabuk. It is the direct inland crossing for Amman." },
      { question: "Can we stop at Petra on the way?", answer: "Yes. Petra is close to Ma'an on this route. Ask for a multi-day quote with a night in Wadi Musa." },
      { question: "Are border crossing fees included?", answer: "Yes, border crossing fees for the vehicle are included in the fixed fare." },
      { question: "What documents do I need?", answer: "A valid passport and the right to enter Jordan; Saudi residents generally also need a valid exit and re-entry visa. Check official sources before travel — we do not arrange visas." },
    ],
    related: [
      { href: "/routes/alula-to-aqaba", label: "AlUla to Aqaba by the coast" },
      { href: "/routes/tabuk-to-petra", label: "Tabuk to Petra" },
      { href: "/routes/tabuk-to-amman", label: "Tabuk to Amman" },
      { href: "/locations/alula", label: "AlUla private driver" },
    ],
  },

  "medinah-to-amman": {
    slug: "medinah-to-amman",
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Saudi Arabia → Jordan · Halat Ammar crossing",
    lead: "From Madinah up the Madinah–Tabuk road, through the Halat Ammar crossing and up the Desert Highway to Amman. It is a two-day journey for most families.",
    quickAnswer:
      "A private transfer from Madinah to Amman is about 1,135 km and roughly 13 hours 25 minutes of driving, plus border time. The road runs north to Tabuk, crosses at Halat Ammar–Al Mudawwara and follows the Desert Highway past Ma'an to Amman. We recommend two days with a night in Tabuk, or flying if you travel light.",
    crossing: AMMAR,
    bestFor: "Families after Umrah, relocation with luggage",
    stages: [
      { label: "Pickup", title: "Madinah", desc: "Your hotel near Al-Masjid an-Nabawi, home, or Madinah airport (MED).", km: 0, kind: "origin" },
      { label: "North", title: "Madinah–Tabuk road", desc: "The long Saudi leg, with a night in Tabuk recommended.", kind: "road" },
      { label: "Saudi exit", title: "Halat Ammar", desc: "About 110 km beyond Tabuk.", kind: "border" },
      { label: "Jordan", title: "Al Mudawwara → Ma'an → Desert Highway", desc: "Jordan's main highway north to the capital.", kind: "road" },
      { label: "Drop-off", title: "Amman", desc: "Hotel, home or Queen Alia International Airport (AMM).", km: 1135, kind: "destination" },
    ],
    dropoffs: {
      heading: "Where we drop off in Amman",
      intro: "Anywhere in Amman or at the airport.",
      points: [
        { name: "Homes & hotels across Amman", desc: "Give us the address or a pin." },
        { name: "Queen Alia International Airport (AMM)", desc: "On the way into the city." },
      ],
    },
    whoBooks: [
      { title: "Families returning to Jordan after Umrah", desc: "Large luggage, elderly relatives and children in one vehicle, with a rest night on the way." },
      { title: "Relocation", desc: "Van with room for many bags, priced as one fare." },
    ],
    tips: [
      { title: "Plan two days", desc: "About 13.5 hours of driving plus the border is too much for one day with family. A night in Tabuk splits it in two." },
      { title: "Fly + private car", desc: "Travelling light? A flight plus a private car on each end is faster. We can arrange the car legs." },
    ],
    tradeOff: {
      heading: "Drive or fly from Madinah to Amman?",
      body: [
        "Flying is clearly faster for one or two people with normal luggage.",
        "The car is worth it for families with a lot of luggage, Zamzam water and elderly relatives, or anyone who wants door-to-door travel without airports. Book it as a two-day trip.",
      ],
    },
    faqs: [
      { question: "How far is Madinah from Amman by road?", answer: "About 1,135 km — roughly 13 hours 25 minutes of driving via Tabuk and the Halat Ammar–Al Mudawwara crossing, plus border time." },
      { question: "Can we do it in one day?", answer: "It is possible but very long. We recommend two days with a night in Tabuk, and the driver's overnight is included in a multi-day quote." },
      { question: "Which border is used?", answer: "Halat Ammar (Saudi) – Al Mudawwara (Jordan), north of Tabuk — the direct inland crossing for Amman." },
      { question: "Are border crossing fees included?", answer: "Yes. Border crossing fees for the vehicle are included in the fixed fare." },
      { question: "What documents do we need?", answer: "A valid passport and the right to enter Jordan for every passenger; residents of Saudi Arabia generally also need a valid exit and re-entry visa. Check official sources before travel." },
    ],
    related: [
      { href: "/routes/tabuk-to-amman", label: "Shorter: Tabuk to Amman" },
      { href: "/routes/madinah-to-tabuk", label: "Madinah to Tabuk" },
      { href: "/locations/madinah", label: "Madinah chauffeur service" },
    ],
  },
  // ─────────────────────────── Jordan: Haql (added 2026-10-03) ───────────────────────────
  "haql-to-aqaba": {
    slug: "haql-to-aqaba",
    corridorSlug: "saudi-to-jordan",
    eyebrow: "Saudi Arabia → Jordan · Al Durrah crossing",
    lead: "The shortest way from Saudi Arabia into Jordan: from Haql on the Gulf of Aqaba, across the Al Durrah crossing to your address in Aqaba, about 40 km door to door.",
    quickAnswer:
      "A private transfer from Haql to Aqaba is about 40 km and roughly 35 minutes of driving, plus time at the Al Durrah crossing between the two towns. It is the shortest road link between Saudi Arabia and Jordan. Your driver collects you in Haql and drops you at your hotel or address in Aqaba; border crossing fees for the vehicle are included in the fixed fare.",
    crossing: DURRAH,
    bestFor: "Short hops, day trips, onward flights from Aqaba",
    stages: [
      { label: "Pickup", title: "Haql", desc: "Your hotel, home or chalet in Haql, or a pickup point along the Haql coast.", km: 0, kind: "origin" },
      { label: "Saudi exit", title: "Al Durrah", desc: "Saudi exit checks just north of Haql, completed by each passenger in person.", kind: "border" },
      { label: "Jordan entry", title: "Durra crossing", desc: "Jordan entry checks on the coast road.", kind: "border" },
      { label: "Drop-off", title: "Aqaba", desc: "City hotel, South Beach or Tala Bay resort, Ayla, or King Hussein International Airport (AQJ).", km: 40, kind: "destination" },
    ],
    dropoffs: {
      heading: "Haql to Aqaba: where you can go",
      intro: "From Haql the border is close, so most of the trip is the crossing itself. These are the usual destinations.",
      points: [
        { name: "South coast resorts", desc: "The dive and beach hotels south of Aqaba are the first stops after the crossing." },
        { name: "Aqaba city", desc: "Central hotels, apartments and the waterfront." },
        { name: "Flights from AQJ", desc: "King Hussein International Airport — tell us your departure time." },
        { name: "Further into Jordan", desc: "Going on to Wadi Rum or Petra? Ask and we quote the longer trip." },
      ],
    },
    whoBooks: [
      { title: "Visitors staying on the Haql coast", desc: "A day or two in Aqaba with a return booked, without driving yourself across." },
      { title: "Travellers flying out of Aqaba", desc: "Haql to King Hussein International Airport, timed with a margin for the border." },
      { title: "Northern NEOM residents", desc: "If you are already near Haql, this is the quickest way into Jordan." },
    ],
    tips: [
      { title: "Most of the time is the border", desc: "The drive is short. Time at Al Durrah is the part that varies, so leave margin for flights." },
      { title: "Book the return together", desc: "Coming back the same day or later? Book both legs in one quote." },
    ],
    faqs: [
      { question: "How far is Haql from Aqaba?", answer: "About 40 km by road — roughly 35 minutes of driving, plus time at the Al Durrah crossing between Haql and Aqaba." },
      { question: "Can you take me from Haql all the way into Aqaba?", answer: "Yes. It is a door-to-door transfer: the driver collects you in Haql and drops you at your address in Aqaba, crossing at Al Durrah." },
      { question: "Is there a cheaper option?", answer: "Yes — border drop-off. We take you to the Saudi side of Al Durrah at a lower fare and you arrange your own onward transport in Jordan." },
      { question: "Are border fees included?", answer: "Yes. Border crossing fees for the vehicle are included in the fixed fare. Personal visa or entry fees are the passenger's own." },
      { question: "What documents do I need?", answer: "A valid passport and the right to enter Jordan for every passenger; Saudi residents generally also need a valid exit and re-entry visa. Check official sources before travel — we do not arrange visas." },
    ],
    related: [
      { href: "/routes/tabuk-to-aqaba", label: "Tabuk to Aqaba" },
      { href: "/routes/neom-to-aqaba", label: "NEOM to Aqaba" },
      { href: "/locations/neom", label: "NEOM private transfers" },
    ],
  },

  // ─────────────────────────── Qatar (bespoke, 2026-10-03) ───────────────────────────
  // Distances from ROUTES_DATA (Dammam → Doha 400 km via Al Ahsa/Hofuf; OSRM
  // Dammam → Hofuf → Doha 413 km). Abu Samra ~90 km from Doha (venues.md).
  "dammam-to-doha": {
    slug: "dammam-to-doha",
    corridorSlug: "saudi-to-qatar",
    eyebrow: "Saudi Arabia → Qatar · Salwa – Abu Samra crossing",
    lead: "From your door in Dammam south through Al Ahsa to the Salwa border, into Qatar at Abu Samra and on to your address in Doha. One private car, no change of vehicle.",
    quickAnswer:
      "A private transfer from Dammam to Doha is about 400 km and roughly 4 hours of driving, plus time at the border. The car runs south through the Al Ahsa (Hofuf) area to Salwa, the only land crossing into Qatar, then from Abu Samra about 90 km into Doha. Border crossing fees for the vehicle are included in the fixed fare, and each passenger carries their own valid documents.",
    crossing: SALWA,
    bestFor: "Business trips, family visits, weekend in Doha",
    stages: [
      { label: "Pickup", title: "Dammam", desc: "Home, hotel, compound or office anywhere in Dammam.", km: 0, kind: "origin" },
      { label: "South", title: "Al Ahsa (Hofuf) area", desc: "The road south through the Eastern Province towards Al Ahsa.", km: 150, kind: "road" },
      { label: "Saudi exit", title: "Salwa", desc: "Saudi exit checks, completed by each passenger in person.", km: 300, kind: "border" },
      { label: "Qatar entry", title: "Abu Samra", desc: "Qatar entry checks, about 90 km from Doha.", kind: "border" },
      { label: "Drop-off", title: "Doha", desc: "Hotel, home, office or Hamad International Airport (DOH).", km: 400, kind: "destination" },
    ],
    dropoffs: DOHA_DROPOFFS,
    whoBooks: [
      { title: "Engineers and business travellers", desc: "Executive sedan between Dammam offices and Doha meetings, with a written quote for the company." },
      { title: "Families visiting relatives", desc: "SUV or van with luggage, door to door, with rest stops when you want them." },
      { title: "Weekend in Doha", desc: "Book a return and the driver brings you back on the day you choose." },
    ],
    tips: [
      { title: "Travelling with family and bags?", desc: "Pick an SUV or van. The extra space matters on a 4-hour drive plus the border." },
      { title: "Weekend traffic", desc: "Border traffic is usually heavier around weekends and holidays. Leave early if you have plans in Doha." },
      { title: "Flying out of Doha?", desc: "Give us your Hamad International Airport flight time and we set the pickup with border margin." },
    ],
    faqs: [
      { question: "How far is Dammam from Doha by car?", answer: "About 400 km — roughly 4 hours of driving via Al Ahsa and the Salwa–Abu Samra crossing, plus time at the border, which varies." },
      { question: "Which border is used from Dammam to Qatar?", answer: "Salwa on the Saudi side and Abu Samra on the Qatari side. It is the only land crossing between Saudi Arabia and Qatar." },
      { question: "Is there a bus from Dammam to Qatar?", answer: "We don't run buses. If you're comparing options, a private car takes you from your door in Dammam to your address in Doha with no transfers, and the fare covers the whole group, not each seat." },
      { question: "Can you pick up in Al Khobar or from Dammam airport?", answer: "Yes. Al Khobar and King Fahd International Airport (DMM) each have their own Doha route page, and pickups anywhere in the Dammam metro area can be booked." },
      { question: "Are the border crossing fees included in the fare?", answer: "Yes. Vehicle border crossing fees are included in the fixed fare. Personal visa or entry fees, where they apply, are paid by each passenger." },
      { question: "What documents do I need to enter Qatar by road?", answer: "A valid passport or accepted ID and the right to enter Qatar for every passenger; Saudi residents generally also need a valid exit and re-entry visa. Rules change, so check official sources before travel. We do not arrange visas." },
    ],
    related: [
      { href: "/routes/doha-to-dammam", label: "Return trip: Doha to Dammam" },
      { href: "/routes/alkhobar-to-doha", label: "Al Khobar to Doha" },
      { href: "/routes/dammam-airport-to-doha", label: "Dammam Airport (DMM) to Doha" },
      { href: "/locations/dammam", label: "Dammam private car service" },
    ],
  },

  "alkhobar-to-doha": {
    slug: "alkhobar-to-doha",
    corridorSlug: "saudi-to-qatar",
    eyebrow: "Saudi Arabia → Qatar · Salwa – Abu Samra crossing",
    lead: "Collected from your Al Khobar or Dhahran home, compound or Corniche hotel, and driven to Doha via Al Ahsa and the Salwa border.",
    quickAnswer:
      "A private transfer from Al Khobar to Doha is about 400 km and roughly 4 hours of driving, plus border time. The driver collects you anywhere in Al Khobar or Dhahran, heads south through Al Ahsa to the Salwa crossing and continues from Abu Samra into Doha. One fixed fare covers the car with border crossing fees included.",
    crossing: SALWA,
    bestFor: "Dhahran and Khobar professionals, compound residents",
    stages: [
      { label: "Pickup", title: "Al Khobar / Dhahran", desc: "Homes, residential compounds, the Corniche hotels and Dhahran offices.", km: 0, kind: "origin" },
      { label: "South", title: "Al Ahsa (Hofuf) area", desc: "Inland towards Al Ahsa.", km: 150, kind: "road" },
      { label: "Saudi exit", title: "Salwa", desc: "Saudi exit checks, in person.", km: 300, kind: "border" },
      { label: "Qatar entry", title: "Abu Samra", desc: "About 90 km from Doha.", kind: "border" },
      { label: "Drop-off", title: "Doha", desc: "West Bay, The Pearl, Lusail, Msheireb or Hamad International Airport (DOH).", km: 400, kind: "destination" },
    ],
    dropoffs: DOHA_DROPOFFS,
    whoBooks: [
      { title: "Dhahran-based professionals", desc: "Business trips to Doha in an executive sedan, with a written quote and corporate invoicing on request." },
      { title: "Compound families", desc: "Pickup at the compound gate, SUV or van, luggage and children's seats on request." },
      { title: "Corniche hotel guests", desc: "Visitors staying in Al Khobar who continue to Qatar." },
    ],
    tips: [
      { title: "Compound gate pickups", desc: "Tell us the gate and any access rules so the driver is waiting at the right entrance." },
      { title: "Round trip from Khobar", desc: "Book both legs together and the return is confirmed in the same quote." },
    ],
    faqs: [
      { question: "How long does it take from Al Khobar to Doha by car?", answer: "About 4 hours of driving for roughly 400 km via Al Ahsa and the Salwa–Abu Samra crossing, plus border time." },
      { question: "Do you pick up from Dhahran and residential compounds?", answer: "Yes. Pickups anywhere in Al Khobar and Dhahran, including compound gates and the Corniche hotels." },
      { question: "Is Al Khobar to Doha the same as Dammam to Doha?", answer: "It is the same road south via Al Ahsa and Salwa, and a similar distance. The difference is where you are collected." },
      { question: "Can a company book and get an invoice?", answer: "Yes. Email an RFQ for a written quote. Corporate invoicing can be arranged through our sister company." },
      { question: "Are border crossing fees included?", answer: "Yes, vehicle border crossing fees are included in the fixed fare." },
    ],
    related: [
      { href: "/routes/dammam-to-doha", label: "Dammam to Doha" },
      { href: "/routes/alkhobar-to-manama", label: "Al Khobar to Bahrain instead?" },
      { href: "/locations/alkhobar", label: "Al Khobar chauffeur service" },
      { href: "/locations/dhahran", label: "Dhahran private car service" },
    ],
  },

  "dammam-airport-to-doha": {
    slug: "dammam-airport-to-doha",
    corridorSlug: "saudi-to-qatar",
    eyebrow: "Airport → Qatar · Salwa – Abu Samra crossing",
    lead: "Land at King Fahd International Airport (DMM), meet your driver and go straight to Doha, with no night in Dammam and no second transfer.",
    quickAnswer:
      "A private transfer from Dammam Airport (DMM) to Doha is about 420 km and roughly 4 hours 10 minutes of driving, plus border time. Your driver meets you at King Fahd International Airport, drives south via Al Ahsa to the Salwa crossing and on from Abu Samra into Doha. Share your flight number when you book; border crossing fees are included in the fixed fare.",
    crossing: SALWA,
    bestFor: "Travellers connecting from a DMM flight to Qatar",
    stages: [
      { label: "Pickup", title: "King Fahd International Airport (DMM)", desc: "Pickup timed to your arrival. Share your flight number when you book.", km: 0, kind: "origin" },
      { label: "South", title: "Al Ahsa (Hofuf) area", desc: "From the airport south towards Al Ahsa.", km: 170, kind: "road" },
      { label: "Saudi exit", title: "Salwa", desc: "Saudi exit checks, in person.", km: 320, kind: "border" },
      { label: "Qatar entry", title: "Abu Samra", desc: "About 90 km from Doha.", kind: "border" },
      { label: "Drop-off", title: "Doha", desc: "Your hotel, home or Hamad International Airport (DOH).", km: 420, kind: "destination" },
    ],
    dropoffs: DOHA_DROPOFFS,
    whoBooks: [
      { title: "Flying in via Dammam for Qatar", desc: "When the DMM fare or schedule suits better than a direct flight to Doha." },
      { title: "Business arrivals", desc: "Executive sedan straight from arrivals to a Doha meeting or hotel." },
      { title: "Families with luggage", desc: "SUV or van so everyone and every bag goes in one car." },
    ],
    tips: [
      { title: "Long day after a flight", desc: "With a 4-hour drive plus the border, rest stops are planned with you. Tell us if you'd rather overnight in Dammam." },
      { title: "Check your Qatar entry before you fly", desc: "Make sure every passenger can enter Qatar by road before the trip." },
    ],
    faqs: [
      { question: "Can I go straight from Dammam airport to Doha by car?", answer: "Yes. The driver meets you at King Fahd International Airport (DMM) and drives you to your address in Doha — about 420 km via Al Ahsa and the Salwa–Abu Samra crossing." },
      { question: "What if my flight into DMM is delayed?", answer: "Share your flight number when you book and we check it before pickup, so the pickup is planned around your actual arrival. 15–30 minutes of free waiting is included." },
      { question: "How long is the drive from DMM to Doha?", answer: "Roughly 4 hours 10 minutes of driving plus border time." },
      { question: "Are border fees included?", answer: "Yes, vehicle border crossing fees are included in the fixed fare." },
      { question: "What documents do I need?", answer: "A valid passport or accepted ID and the right to enter Qatar for every passenger. Check official sources before travel — we do not arrange visas." },
    ],
    related: [
      { href: "/routes/dammam-airport-to-bahrain", label: "Dammam Airport to Bahrain" },
      { href: "/routes/dammam-to-doha", label: "Dammam city to Doha" },
      { href: "/airports/king-fahd-dammam", label: "Dammam Airport (DMM) transfers" },
    ],
  },

  "alahsa-to-doha": {
    slug: "alahsa-to-doha",
    corridorSlug: "saudi-to-qatar",
    eyebrow: "Saudi Arabia → Qatar · Salwa – Abu Samra crossing",
    lead: "The shortest Saudi road into Qatar: from Hofuf and Al Ahsa straight to the Salwa border and on to Doha.",
    quickAnswer:
      "A private transfer from Al Ahsa (Hofuf) to Doha is about 265 km and roughly 3 hours of driving, plus border time. It is the shortest road route from a major Saudi city into Qatar. The driver heads east from Hofuf to the Salwa crossing, enters Qatar at Abu Samra and continues about 90 km to Doha. Border crossing fees are included in the fixed fare.",
    crossing: SALWA,
    bestFor: "Shortest Saudi–Qatar trip, families, Al Ahsa residents",
    stages: [
      { label: "Pickup", title: "Al Ahsa (Hofuf)", desc: "Home, hotel or Al-Ahsa International Airport (HOF).", km: 0, kind: "origin" },
      { label: "Saudi exit", title: "Salwa", desc: "Saudi exit checks, in person.", km: 160, kind: "border" },
      { label: "Qatar entry", title: "Abu Samra", desc: "Qatar entry checks.", kind: "border" },
      { label: "Drop-off", title: "Doha", desc: "Your hotel, home or Hamad International Airport (DOH).", km: 265, kind: "destination" },
    ],
    dropoffs: DOHA_DROPOFFS,
    whoBooks: [
      { title: "Al Ahsa families", desc: "The shortest trip into Qatar for visiting relatives. SUV or van with luggage." },
      { title: "Short business visits", desc: "Out in the morning, meetings in Doha, back the same evening with the driver waiting." },
    ],
    tips: [
      { title: "Same-day return is realistic", desc: "At about 3 hours each way, a day trip with the driver waiting is possible. Book it as a return." },
      { title: "Heading to Doha airport?", desc: "Tell us your flight time at Hamad International Airport so we add border margin." },
    ],
    faqs: [
      { question: "How far is Al Ahsa from Doha?", answer: "About 265 km — roughly 3 hours of driving via the Salwa–Abu Samra crossing, plus time at the border." },
      { question: "Is Al Ahsa the closest Saudi city to Qatar?", answer: "Of the major cities, yes. Hofuf is the closest large city to the Salwa border, so this is the shortest of our Saudi–Qatar routes." },
      { question: "Can the driver wait in Doha and bring me back the same day?", answer: "Yes. Book a return with waiting; the waiting time is included in the written fixed fare." },
      { question: "Are border fees included?", answer: "Yes, vehicle border crossing fees are included in the fixed fare." },
      { question: "What documents do I need?", answer: "A valid passport or accepted ID and the right to enter Qatar; Saudi residents generally also need a valid exit and re-entry visa. Check official sources before travel." },
    ],
    related: [
      { href: "/routes/doha-to-alahsa", label: "Return trip: Doha to Al Ahsa" },
      { href: "/routes/dammam-to-doha", label: "Dammam to Doha" },
      { href: "/routes/riyadh-to-doha", label: "Riyadh to Doha" },
    ],
  },

  "riyadh-to-doha": {
    slug: "riyadh-to-doha",
    corridorSlug: "saudi-to-qatar",
    eyebrow: "Saudi Arabia → Qatar · Salwa – Abu Samra crossing",
    lead: "From Riyadh east across the desert to Al Ahsa, through the Salwa border and into Doha: a full private day on the road instead of two airports.",
    quickAnswer:
      "A private transfer from Riyadh to Doha is about 580 km and roughly 5 hours 30 minutes of driving, plus border time. The road runs east to the Al Ahsa (Hofuf) area, then to the Salwa crossing and from Abu Samra into Doha. One car and driver take you from your Riyadh address to your Doha address; border crossing fees are included in the fixed fare.",
    crossing: SALWA,
    bestFor: "Executives, families with luggage, group travel",
    stages: [
      { label: "Pickup", title: "Riyadh", desc: "Home, hotel or office — KAFD, Olaya, Diplomatic Quarter, anywhere in the city.", km: 0, kind: "origin" },
      { label: "East", title: "Across to Al Ahsa (Hofuf)", desc: "The long desert stretch east from Riyadh.", km: 330, kind: "road" },
      { label: "Saudi exit", title: "Salwa", desc: "Saudi exit checks, in person.", km: 480, kind: "border" },
      { label: "Qatar entry", title: "Abu Samra", desc: "About 90 km from Doha.", kind: "border" },
      { label: "Drop-off", title: "Doha", desc: "Hotel, home, office or Hamad International Airport (DOH).", km: 580, kind: "destination" },
    ],
    dropoffs: DOHA_DROPOFFS,
    whoBooks: [
      { title: "Executives between the two capitals", desc: "Work on the road in an executive sedan instead of airport queues, with a written quote for the company." },
      { title: "Families and groups", desc: "One SUV or van for everyone and their luggage, door to door." },
    ],
    tips: [
      { title: "Fly or drive?", desc: "One person with a small bag is usually quicker by air. Families, groups and heavy luggage tend to be simpler by car." },
      { title: "Start early", desc: "A morning departure gets you into Doha in daylight even with a border queue." },
    ],
    tradeOff: {
      heading: "Riyadh to Doha: fly or drive?",
      body: [
        "Flying is faster for a solo traveller with light luggage, once you count airport time on both ends.",
        "A private car makes more sense for three or more people, heavy luggage, or travellers who want to leave from their door and arrive at their door without check-in and baggage limits.",
      ],
    },
    faqs: [
      { question: "How far is Riyadh from Doha by road?", answer: "About 580 km — roughly 5 hours 30 minutes of driving via Al Ahsa and the Salwa–Abu Samra crossing, plus border time." },
      { question: "Do you stop on the way from Riyadh to Doha?", answer: "Yes. On a 5.5-hour drive the driver plans rest, meal and prayer stops with you — usually in the Al Ahsa area before the border." },
      { question: "Is driving better than flying from Riyadh to Doha?", answer: "Flying is quicker for one person travelling light. For families, groups or lots of luggage, a door-to-door private car is often simpler." },
      { question: "Are border crossing fees included?", answer: "Yes. Vehicle border crossing fees are included in the fixed fare." },
      { question: "Who handles the passports at Salwa?", answer: "Each passenger presents their own passport and Qatar entry approval at the crossing; we do not arrange visas or immigration. Residents of Saudi Arabia usually also need an exit and re-entry visa — check the current rules before you travel." },
    ],
    related: [
      { href: "/routes/doha-to-riyadh", label: "Return trip: Doha to Riyadh" },
      { href: "/routes/riyadh-to-manama", label: "Riyadh to Bahrain" },
      { href: "/locations/riyadh", label: "Riyadh chauffeur service" },
    ],
  },

  "doha-to-dammam": {
    slug: "doha-to-dammam",
    corridorSlug: "saudi-to-qatar",
    eyebrow: "Qatar → Saudi Arabia · Abu Samra – Salwa crossing",
    lead: "Pickup at your Doha hotel or home, out through Abu Samra and Salwa, north via Al Ahsa to Dammam or a flight at King Fahd International Airport.",
    quickAnswer:
      "A private transfer from Doha to Dammam is about 400 km and roughly 4 hours of driving, plus border time. The driver collects you in Doha, crosses at Abu Samra and Salwa and drives north through Al Ahsa to your address in Dammam or to King Fahd International Airport (DMM). Border crossing fees are included in the fixed fare.",
    crossing: { name: "Abu Samra – Salwa crossing", saudiSide: "Salwa", otherSide: "Abu Samra" },
    bestFor: "Return trips, DMM flights, Eastern Province residents",
    stages: [
      { label: "Pickup", title: "Doha", desc: "Hotel, home or office anywhere in Doha.", km: 0, kind: "origin" },
      { label: "Qatar exit", title: "Abu Samra", desc: "About 90 km from Doha. Each passenger completes the exit in person.", km: 90, kind: "border" },
      { label: "Saudi entry", title: "Salwa", desc: "Saudi entry checks.", kind: "border" },
      { label: "North", title: "Al Ahsa (Hofuf) area", desc: "Up through Al Ahsa towards the coast.", km: 250, kind: "road" },
      { label: "Drop-off", title: "Dammam", desc: "Home, hotel, compound or King Fahd International Airport (DMM).", km: 400, kind: "destination" },
    ],
    dropoffs: {
      heading: "Where we drop off in the Eastern Province",
      intro: "Dammam, Al Khobar, Dhahran or the airport — give us the exact address.",
      points: [
        { name: "Dammam city", desc: "Homes, hotels and offices." },
        { name: "Al Khobar & Dhahran", desc: "Compounds, the Corniche and Dhahran offices." },
        { name: "King Fahd International Airport (DMM)", desc: "For an onward flight — tell us the departure time." },
      ],
    },
    whoBooks: [
      { title: "Eastern Province residents returning home", desc: "The return half of a Doha trip." },
      { title: "Qatar residents catching DMM flights", desc: "Door to departures with margin for the border and check-in." },
    ],
    tips: [
      { title: "Catching a flight at DMM?", desc: "Share the departure time. We work back the drive, a border margin and check-in." },
      { title: "Have your Saudi entry ready", desc: "Every passenger needs the right to enter Saudi Arabia." },
    ],
    faqs: [
      { question: "How long is the drive from Doha to Dammam?", answer: "About 4 hours of driving for roughly 400 km via the Abu Samra–Salwa crossing and Al Ahsa, plus border time." },
      { question: "Can you take me from Doha to Dammam airport?", answer: "Yes. Drop-off at King Fahd International Airport (DMM) can be booked; tell us the flight time so pickup in Doha includes border margin." },
      { question: "Are border crossing fees included?", answer: "Yes, vehicle border crossing fees are included in the fixed fare." },
      { question: "What do I need to enter Saudi Arabia by road?", answer: "A valid passport or accepted ID and the right to enter Saudi Arabia for every passenger. Check official sources before travel — we do not arrange visas." },
      { question: "Does the driver wait if I'm running late?", answer: "Yes — 15–30 minutes of free waiting is included on every trip." },
    ],
    related: [
      { href: "/routes/dammam-to-doha", label: "Outbound: Dammam to Doha" },
      { href: "/routes/doha-to-alahsa", label: "Doha to Al Ahsa" },
      { href: "/airports/king-fahd-dammam", label: "Dammam Airport (DMM)" },
    ],
  },

  "doha-to-alahsa": {
    slug: "doha-to-alahsa",
    corridorSlug: "saudi-to-qatar",
    eyebrow: "Qatar → Saudi Arabia · Abu Samra – Salwa crossing",
    lead: "The shortest drive from Qatar into Saudi Arabia: from Doha through Abu Samra and Salwa to Hofuf and the Al Ahsa oasis.",
    quickAnswer:
      "A private transfer from Doha to Al Ahsa is about 265 km and roughly 3 hours of driving, plus border time — the shortest road trip from Qatar to a major Saudi city. The driver collects you in Doha, crosses at Abu Samra and Salwa and drops you in Hofuf or anywhere in Al Ahsa. Border crossing fees are included in the fixed fare.",
    crossing: { name: "Abu Samra – Salwa crossing", saudiSide: "Salwa", otherSide: "Abu Samra" },
    bestFor: "Family visits, Al Ahsa Oasis trips, HOF flights",
    stages: [
      { label: "Pickup", title: "Doha", desc: "Hotel, home or office.", km: 0, kind: "origin" },
      { label: "Qatar exit", title: "Abu Samra", desc: "About 90 km from Doha.", km: 90, kind: "border" },
      { label: "Saudi entry", title: "Salwa", desc: "Saudi entry checks, in person.", kind: "border" },
      { label: "Drop-off", title: "Al Ahsa (Hofuf)", desc: "Home, hotel, the oasis area or Al-Ahsa International Airport (HOF).", km: 265, kind: "destination" },
    ],
    dropoffs: {
      heading: "Where we drop off in Al Ahsa",
      intro: "Anywhere in Hofuf, Mubarraz and the Al Ahsa oasis area.",
      points: [
        { name: "Hofuf & Mubarraz", desc: "Homes, hotels and offices." },
        { name: "Al Ahsa Oasis sights", desc: "Drop at your hotel or the site you are visiting." },
        { name: "Al-Ahsa International Airport (HOF)", desc: "For onward domestic flights." },
      ],
    },
    whoBooks: [
      { title: "Families from Qatar visiting Al Ahsa", desc: "The shortest cross-border family trip, in an SUV or van." },
      { title: "Visitors to the Al Ahsa Oasis", desc: "A UNESCO-listed oasis about three hours from Doha by road." },
    ],
    tips: [
      { title: "Make it a return", desc: "Short enough for a weekend; book the return leg in the same quote." },
    ],
    faqs: [
      { question: "How far is Doha from Al Ahsa?", answer: "About 265 km — roughly 3 hours of driving via the Abu Samra–Salwa crossing, plus border time." },
      { question: "Is this the shortest road trip from Qatar to Saudi Arabia?", answer: "To a major Saudi city, yes. Hofuf is the closest large city to the Salwa border." },
      { question: "Are border fees included?", answer: "Yes, vehicle border crossing fees are included in the fixed fare." },
      { question: "What do I need to enter Saudi Arabia?", answer: "A valid passport or accepted ID and the right to enter Saudi Arabia for every passenger. Check official sources before travel." },
    ],
    related: [
      { href: "/routes/alahsa-to-doha", label: "Outbound: Al Ahsa to Doha" },
      { href: "/routes/doha-to-dammam", label: "Doha to Dammam" },
      { href: "/routes/doha-to-riyadh", label: "Doha to Riyadh" },
    ],
  },

  "doha-to-riyadh": {
    slug: "doha-to-riyadh",
    corridorSlug: "saudi-to-qatar",
    eyebrow: "Qatar → Saudi Arabia · Abu Samra – Salwa crossing",
    lead: "From Doha through Abu Samra and Salwa, west across Al Ahsa and the desert to your address in Riyadh.",
    quickAnswer:
      "A private transfer from Doha to Riyadh is about 580 km and roughly 5 hours 30 minutes of driving, plus border time. The car leaves your Doha address, crosses at Abu Samra and Salwa, passes the Al Ahsa (Hofuf) area and continues west to Riyadh. Border crossing fees are included in the fixed fare; 15–30 minutes of free waiting is included.",
    crossing: { name: "Abu Samra – Salwa crossing", saudiSide: "Salwa", otherSide: "Abu Samra" },
    bestFor: "Business trips to Riyadh, families relocating",
    stages: [
      { label: "Pickup", title: "Doha", desc: "Hotel, home or office.", km: 0, kind: "origin" },
      { label: "Qatar exit", title: "Abu Samra", desc: "About 90 km from Doha.", km: 90, kind: "border" },
      { label: "Saudi entry", title: "Salwa", desc: "Saudi entry checks, in person.", kind: "border" },
      { label: "West", title: "Past Al Ahsa (Hofuf)", desc: "Then the long desert stretch to the capital.", km: 250, kind: "road" },
      { label: "Drop-off", title: "Riyadh", desc: "Hotel, home, office or King Khalid International Airport (RUH).", km: 580, kind: "destination" },
    ],
    dropoffs: {
      heading: "Where we drop off in Riyadh",
      intro: "Anywhere in Riyadh, or at the airport.",
      points: [
        { name: "KAFD, Olaya & the Diplomatic Quarter", desc: "Business districts and hotels." },
        { name: "Homes across Riyadh", desc: "Give us the address or a pin." },
        { name: "King Khalid International Airport (RUH)", desc: "For onward flights." },
      ],
    },
    whoBooks: [
      { title: "Qatar-based executives with Riyadh meetings", desc: "Executive sedan with a written quote for the company." },
      { title: "Families moving with luggage", desc: "SUV or van; one fare for everyone." },
    ],
    tips: [
      { title: "Plan it as a day", desc: "With the border and stops it fills most of a day." },
      { title: "Riyadh traffic at arrival", desc: "Arriving at rush hour adds time inside the city. Tell us your plans and we time the departure." },
    ],
    faqs: [
      { question: "How long is the drive from Doha to Riyadh?", answer: "About 5 hours 30 minutes of driving for roughly 580 km via the Abu Samra–Salwa crossing and Al Ahsa, plus border time." },
      { question: "Can you drop me at Riyadh airport?", answer: "Yes. Drop-off at King Khalid International Airport (RUH) can be booked; share your flight time." },
      { question: "Are border fees included?", answer: "Yes, vehicle border crossing fees are included in the fixed fare." },
      { question: "What do I need to enter Saudi Arabia by road?", answer: "A valid passport or accepted ID and the right to enter Saudi Arabia for every passenger. Check official sources before travel — we do not arrange visas." },
    ],
    related: [
      { href: "/routes/riyadh-to-doha", label: "Outbound: Riyadh to Doha" },
      { href: "/routes/doha-to-dammam", label: "Doha to Dammam" },
      { href: "/locations/riyadh", label: "Riyadh chauffeur service" },
    ],
  },
};
