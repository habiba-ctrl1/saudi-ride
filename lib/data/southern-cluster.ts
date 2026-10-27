// Southern corridor route pages (Abha ↔ Jizan, Najran → Abha). Rendered by
// components/location/cluster/SouthernRoutePage.tsx from /routes/[slug].
//
// Truth sources:
// - Distance/time: ROUTES_DATA only (OSRM road distance, measured 2026-10-27).
//   Abha–Jizan 200 km, Najran–Abha 247 km. Pages never repeat these numbers
//   by hand except inside quickAnswer/faq copy, which must match routes.ts.
// - Service facts: seo/facts.md (fixed fare, 15–30 min free waiting, flight
//   tracking, EN/AR drivers, free cancellation to 24 h, cash/bank transfer).
// - Coverage of Jizan and Najran confirmed by the owner 2026-10-27.
// - No hotel, ferry-time, permit, road-condition or price claims: none verified.

export interface SouthernStage {
  label: string;
  title: string;
  desc: string;
  kind: "origin" | "road" | "destination";
}

export interface SouthernRoutePageData {
  slug: string;
  h1: string;
  eyebrow: string;
  lead: string;
  quickAnswer: string;
  metaTitle: string;
  metaDescription: string;
  fromPlace: string;
  toPlace: string;
  stages: SouthernStage[];
  /** Even-handed comparison section (private car vs other ways to do the trip). */
  tradeOff: { heading: string; body: string[] };
  endPoints: { heading: string; intro: string; points: { name: string; desc: string }[] };
  whoBooks: { title: string; desc: string }[];
  tips: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string }[];
  bestFor: string;
}

export const SOUTHERN_ROUTE_PAGES: Record<string, SouthernRoutePageData> = {
  "abha-to-jizan": {
    slug: "abha-to-jizan",
    h1: "Abha to Jizan Private Transfer",
    eyebrow: "Asir highlands → Red Sea coast",
    fromPlace: "Abha",
    toPlace: "Jizan",
    bestFor: "Families, visitors continuing to the coast, business trips",
    lead: "One private car and one driver from the cool Sarawat highlands down the escarpment to the hot Red Sea plain of Jizan, door to door with the fare agreed before you book.",
    quickAnswer:
      "A private transfer from Abha to Jizan is about 200 km by road and roughly 2.5 hours of driving. The route leaves the Asir highlands, drops down the mountain escarpment and runs across the Tihama coastal plain to Jizan. The fare is fixed and confirmed on WhatsApp before you book, and the driver can collect you from your Abha hotel, home or Abha International Airport (AHB).",
    metaTitle: "Abha to Jizan Private Transfer | ~200 km by Road",
    metaDescription:
      "Private car with driver from Abha or Abha Airport (AHB) to Jizan — about 200 km, 2.5 hours, door to door. One fixed fare agreed on WhatsApp before booking.",
    stages: [
      { label: "Pickup", title: "Abha", desc: "Your hotel, home, office or Abha International Airport (AHB). Share your flight number if you are arriving by air and the driver is planned around your landing.", kind: "origin" },
      { label: "Down the escarpment", title: "Mountain descent", desc: "The road leaves the Asir highlands and drops steeply towards the coast. Bends and changing weather are normal here, which is why the driver and vehicle matter more than speed.", kind: "road" },
      { label: "Coastal plain", title: "Tihama lowlands", desc: "The final stretch is flat and much hotter than Abha. Expect a very different climate from where you started.", kind: "road" },
      { label: "Drop-off", title: "Jizan", desc: "Your hotel, home, office or Jizan airport (GIZ) for onward flights.", kind: "destination" },
    ],
    tradeOff: {
      heading: "Private car, flight or shared transport from Abha to Jizan?",
      body: [
        "A private car suits you if you are carrying luggage, travelling as a family, arriving at Abha airport with a connection to the coast, or want to leave at your own time and be dropped at an exact address. You pay for the whole vehicle, so it is best value with two or more passengers.",
        "A flight between the two cities is shorter in the air, but you add airport check-in, transfers at both ends and the risk of timetable changes. Shared minibuses and intercity buses cost less per person, but they run to their own schedule and stop at their own stations, so a final taxi leg is still needed.",
        "Tell us what you are comparing when you message us and we will say honestly which fits your trip.",
      ],
    },
    endPoints: {
      heading: "Where we pick up and drop off",
      intro: "Give us the exact address at both ends when you book. These are the common pickup and drop-off points.",
      points: [
        { name: "Abha city", desc: "Hotels and homes in Abha, including the highland hotels around the city." },
        { name: "Abha International Airport (AHB)", desc: "Arrivals pickup with meet & greet. Tell us your flight number; we track your flight." },
        { name: "Jizan city", desc: "Hotels, offices and homes across Jizan." },
        { name: "Jizan airport (GIZ)", desc: "For onward flights; share the departure time and we plan the pickup back from it." },
      ],
    },
    whoBooks: [
      { title: "Visitors coming down from the highlands", desc: "Travellers ending an Abha or Soudah stay and continuing to Jizan and the Red Sea coast." },
      { title: "Families with luggage", desc: "A full-size SUV keeps passengers and bags together without changing vehicles on the mountain road." },
      { title: "Business and project travel", desc: "Executive sedan for staff moving between the two regions, with a written quote for companies." },
    ],
    tips: [
      { title: "Start earlier in summer", desc: "The coastal plain is far hotter than Abha. A morning departure puts the descent and the hottest stretch in the cooler part of the day." },
      { title: "Tell us your luggage", desc: "Group size and bags decide whether a sedan, SUV or van is right for the mountain section." },
      { title: "Travelling both ways?", desc: "Book the return in the same quote so both legs are agreed up front." },
    ],
    faqs: [
      { question: "How far is Abha from Jizan by road?", answer: "About 200 km by road, which is roughly 2.5 hours of driving. Mountain bends and weather can add time, so we plan your pickup with margin." },
      { question: "How much is a taxi from Abha to Jizan?", answer: "The fare is fixed and confirmed on WhatsApp before you book. It depends on the vehicle, your exact pickup and drop-off addresses and whether you want a return, so send those and we reply with one fare." },
      { question: "Can you pick me up from Abha airport and take me to Jizan?", answer: "Yes. Send your flight number and we plan the pickup around your landing. We track your flight, and 15–30 minutes of free waiting is included on every trip." },
      { question: "Is the road from Abha to Jizan safe for a long trip?", answer: "It is a mountain descent followed by a coastal plain, a normal intercity route driven daily. We recommend leaving in daylight and choosing an SUV if you have family and luggage." },
      { question: "Can I book a return trip from Jizan to Abha?", answer: "Yes. Ask for both legs in one request and the fare for each is agreed before you travel." },
      { question: "Can a company book this route and get an invoice?", answer: "Yes. Email an RFQ for a written quote. Corporate invoicing can be arranged through our sister company." },
    ],
    related: [
      { href: "/airports/jizan-regional", label: "Jizan airport (GIZ) transfers" },
      { href: "/locations/jizan", label: "Private driver and transfers in Jizan" },
      { href: "/airports/abha-regional", label: "Abha airport (AHB) pickups" },
      { href: "/locations/abha", label: "Abha city transfers and mountain tours" },
      { href: "/routes/najran-to-abha", label: "Najran to Abha private transfer" },
    ],
  },

  "najran-to-abha": {
    slug: "najran-to-abha",
    h1: "Najran to Abha Private Transfer",
    eyebrow: "Najran valley → Asir highlands",
    fromPlace: "Najran",
    toPlace: "Abha",
    bestFor: "Visitors, families, government and business travel",
    lead: "A private car from your address in Najran west to Abha and the Asir highlands, with one driver, one fixed fare and no changing vehicles along the way.",
    quickAnswer:
      "A private transfer from Najran to Abha is about 247 km by road and roughly 3 hours 15 minutes of driving. The car leaves Najran, crosses the southern interior and climbs into the Asir highlands to Abha. The fare is fixed and confirmed on WhatsApp before you book, with pickup from your Najran hotel, home or office and drop-off at your Abha address or Abha International Airport (AHB).",
    metaTitle: "Najran to Abha Private Transfer | ~247 km by Road",
    metaDescription:
      "Private car with driver from Najran to Abha or Abha Airport (AHB) — about 247 km, 3 hours 15 minutes. One fixed fare agreed on WhatsApp before booking.",
    stages: [
      { label: "Pickup", title: "Najran", desc: "Your hotel, home, office or any address in Najran. Give us the exact location when you book.", kind: "origin" },
      { label: "Cross-country", title: "Najran to the highlands", desc: "A long intercity road across the south. Tell the driver if you want a prayer or rest stop.", kind: "road" },
      { label: "The climb", title: "Into the Asir highlands", desc: "The last section climbs into the mountains, so the weather and temperature change noticeably between Najran and Abha.", kind: "road" },
      { label: "Drop-off", title: "Abha", desc: "Your hotel, home or office in Abha, or Abha International Airport (AHB) for a flight.", kind: "destination" },
    ],
    tradeOff: {
      heading: "Private car or flying between Najran and Abha?",
      body: [
        "Driving takes about three hours door to door with no check-in time, and the car goes exactly where you are staying. That suits groups, families with bags, and anyone whose start and end points are outside the airports.",
        "A flight can be faster if both airports suit your schedule, but you add transfers at both ends and a timetable you do not control. If you are catching a flight at Abha, the private car works as the connecting leg: we plan the pickup back from your departure time.",
      ],
    },
    endPoints: {
      heading: "Pickup and drop-off points",
      intro: "Give us exact addresses when you book. Common points:",
      points: [
        { name: "Najran city", desc: "Hotels, homes, offices and compounds across Najran." },
        { name: "Abha city", desc: "Hotels and homes in Abha and the highland area around it." },
        { name: "Abha International Airport (AHB)", desc: "For flights. Share your departure time and we plan back from it with margin." },
        { name: "Khamis Mushait", desc: "Drop-off in Khamis Mushait on the way can be arranged; tell us when you book." },
      ],
    },
    whoBooks: [
      { title: "Visitors combining Najran and Aseer", desc: "Travellers seeing Najran's archaeological and rock-art sites who then continue to Abha and the highlands." },
      { title: "Families and groups", desc: "SUV or van so everyone and their luggage travel together for the whole leg." },
      { title: "Business and institutional travel", desc: "Executive sedan for staff or guests, with a written quote and invoicing for companies." },
    ],
    tips: [
      { title: "Plan for the distance", desc: "This is a long drive. Tell us your preferred departure time and any stops and we confirm the plan with the fare." },
      { title: "Carry your ID", desc: "Bring your national ID, iqama or passport as you would for any intercity journey." },
      { title: "Flying out of Abha?", desc: "Share the flight time and we plan the pickup in Najran back from it with plenty of margin." },
    ],
    faqs: [
      { question: "How far is Najran from Abha by road?", answer: "About 247 km by road, roughly 3 hours 15 minutes of driving. We plan the pickup with margin for stops and mountain sections." },
      { question: "How much is a taxi from Najran to Abha?", answer: "The fare is fixed and confirmed on WhatsApp before you book. Send your pickup and drop-off addresses, date and passengers and we reply with one fare for the vehicle you choose." },
      { question: "Can you take me from Najran to Abha airport?", answer: "Yes. Tell us your flight time and we work back from it so you arrive with check-in margin. Meet-and-greet at arrivals applies for pickups at the airport." },
      { question: "Can I book Najran to Abha and back?", answer: "Yes. Ask for both legs in one request and each fare is agreed before you travel." },
      { question: "Can I add a stop on the way?", answer: "Prayer and rest stops are normal on a trip this long. Longer stops or detours are quoted with the fare, so tell us when you book." },
      { question: "Can a company book Najran to Abha with an invoice?", answer: "Yes. Email an RFQ for a written quote. Corporate invoicing can be arranged through our sister company." },
    ],
    related: [
      { href: "/locations/abha", label: "Abha city transfers and mountain tours" },
      { href: "/airports/abha-regional", label: "Abha airport (AHB) pickups" },
      { href: "/routes/abha-to-jizan", label: "Abha to Jizan private transfer" },
      { href: "/routes/abha-airport-to-soudah", label: "Abha Airport to Soudah Peak" },
    ],
  },
};

export const SOUTHERN_ROUTE_SLUGS = Object.keys(SOUTHERN_ROUTE_PAGES);
