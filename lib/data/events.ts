// Event & exhibition transport pages. Two kinds:
//  - "pillar": evergreen category pages (Riyadh event/exhibition/conference,
//    corporate events KSA, VIP event chauffeur) — always relevant.
//  - "event": specific recurring Saudi events with a known current edition.
//    Framed as ANNUAL so the page stays useful after each edition (dates are
//    updated once a year, not a throwaway single-year page).
// Every page routes leads to WhatsApp with event context. No fabricated
// affiliation — we provide transport TO the event, we are not an organiser.

export interface EventService {
  title: string;
  desc: string;
}

export interface EventFaq {
  question: string;
  answer: string;
}

export interface EventPageData {
  slug: string;
  kind: "pillar" | "event";
  /** Badge pill text in the hero. */
  badge: string;
  /** Short name used in nav/cards/related links. */
  shortName: string;
  h1: string;
  title: string; // <title>
  description: string; // meta description
  /** Hero intro paragraph. */
  intro: string;
  city: string;
  /** Named events only: current edition dates + venue (annual). */
  edition?: { dates: string; venue: string; note?: string };
  /** Nearest airport for the transfer cross-link. */
  airport: { slug: string; label: string };
  tldrAnswer: string;
  tldrFacts: { label: string; value: string }[];
  services: EventService[];
  faqs: EventFaq[];
  /** Prefilled WhatsApp message (event context). */
  waContext: string;
}

// Reusable service blocks — most event pages offer the same four.
const STD_SERVICES = (label: string): EventService[] => [
  { title: "Airport ⇄ Venue Transfers", desc: `Private pickups from Riyadh Airport (RUH) straight to ${label}, with flight tracking and meet & greet for arriving delegates and speakers.` },
  { title: "Daily Standby & Hourly Chauffeur", desc: "A dedicated car and driver on standby for the duration of the event — move between sessions, meetings, and your hotel on your own schedule." },
  { title: "Group & Delegation Transport", desc: "SUVs, vans, and coasters for teams, exhibitors, and delegations travelling together, coordinated under one point of contact." },
  { title: "VIP & Executive Chauffeur", desc: "Discreet executive cars (S-Class, Escalade class) for VIPs, sponsors, and C-level guests — professional, bilingual chauffeurs." },
];

const STD_FAQS = (label: string, city: string): EventFaq[] => [
  { question: `Do you provide transport to and from ${label}?`, answer: `Yes. We arrange private transfers between ${city} airport, hotels, and the venue throughout the event — one-way, return, or full-day standby. Message us on WhatsApp with your dates and group size for a quote.` },
  { question: "Can you handle a group or company delegation?", answer: "Yes. We coordinate multiple vehicles — sedans, SUVs, vans, and coasters — for teams, exhibitors, and delegations under a single contact, with schedules aligned to your agenda." },
  { question: "Is a dedicated car available for the whole day?", answer: "Yes. Book an hourly or full-day chauffeur so a car and driver stay on standby between sessions and meetings — you are not waiting for a ride each time." },
  { question: "How do I confirm the price?", answer: "Send your dates, pickup points, vehicle type, and passenger count on WhatsApp. We confirm a fixed fare before you book — no surge, no hidden fees." },
];

const RUH = { slug: "king-khalid-riyadh", label: "Riyadh Airport (RUH)" };

export const EVENTS: EventPageData[] = [
  // ─── PILLAR (evergreen) ───────────────────────────────────────────────
  {
    slug: "riyadh-event-transportation",
    kind: "pillar",
    badge: "Event Transport · Riyadh",
    shortName: "Riyadh Event Transport",
    h1: "Event Transportation in Riyadh",
    title: "Event Transportation in Riyadh | Delegate & VIP Transfers",
    description: "Private event transportation in Riyadh — airport transfers, daily chauffeur standby, group & VIP transport for conferences, exhibitions, and corporate events. Fare confirmed on WhatsApp.",
    intro: "Reliable private transport for any event in Riyadh — from a single delegate arriving at the airport to a full company delegation. Airport transfers, daily standby, group vehicles, and VIP chauffeurs, all coordinated under one contact.",
    city: "Riyadh",
    airport: RUH,
    tldrAnswer: "Event transportation in Riyadh covers private airport transfers, hourly and full-day chauffeur standby, group and delegation vehicles, and VIP executive cars for conferences, exhibitions, and corporate events — with your fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Coverage", value: "Riyadh · all venues" },
      { label: "Vehicles", value: "Sedan · SUV · Van · Coaster" },
      { label: "Booking", value: "Hourly / daily / delegation" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("your Riyadh venue"),
    faqs: STD_FAQS("your Riyadh venue", "Riyadh"),
    waContext: "event transportation in Riyadh",
  },
  {
    slug: "riyadh-exhibition-transportation",
    kind: "pillar",
    badge: "Exhibition Transport · Riyadh",
    shortName: "Riyadh Exhibition Transport",
    h1: "Exhibition Transportation in Riyadh",
    title: "Exhibition Transport in Riyadh | Exhibitor & Visitor Transfers",
    description: "Private exhibition transport in Riyadh — transfers to Riyadh Exhibition & Convention Centre and other venues for exhibitors, visitors, and delegations. Group vehicles, daily standby, fare on WhatsApp.",
    intro: "Transport built around exhibition schedules in Riyadh — get exhibitors, stand teams, and visitors between the airport, hotels, and the exhibition halls on time, with vehicles sized for people and equipment.",
    city: "Riyadh",
    airport: RUH,
    tldrAnswer: "Exhibition transport in Riyadh moves exhibitors, teams, and visitors between the airport, hotels, and venues such as the Riyadh Exhibition & Convention Centre — with group vehicles, daily standby, and a fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Coverage", value: "RECC · all Riyadh venues" },
      { label: "Vehicles", value: "SUV · Van · Coaster" },
      { label: "For", value: "Exhibitors · visitors" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("the exhibition halls"),
    faqs: STD_FAQS("the exhibition venue", "Riyadh"),
    waContext: "exhibition transport in Riyadh",
  },
  {
    slug: "riyadh-conference-transportation",
    kind: "pillar",
    badge: "Conference Transport · Riyadh",
    shortName: "Riyadh Conference Transport",
    h1: "Conference Transportation in Riyadh",
    title: "Conference Transport in Riyadh | Speaker & Delegate Cars",
    description: "Private conference transportation in Riyadh — speaker, delegate, and sponsor transfers with airport meet & greet, daily chauffeur standby, and VIP cars. Fare confirmed on WhatsApp, 24/7.",
    intro: "Punctual private transport for conferences in Riyadh — speakers met at arrivals, delegates moved on schedule, and sponsors driven in executive comfort, with cars on standby for the length of the programme.",
    city: "Riyadh",
    airport: RUH,
    tldrAnswer: "Conference transport in Riyadh provides speaker and delegate transfers, airport meet & greet, daily chauffeur standby, and VIP executive cars for sponsors — with your fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Coverage", value: "Riyadh · all venues" },
      { label: "For", value: "Speakers · delegates · sponsors" },
      { label: "Booking", value: "Standby / transfer" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("the conference venue"),
    faqs: STD_FAQS("the conference venue", "Riyadh"),
    waContext: "conference transportation in Riyadh",
  },
  {
    slug: "corporate-event-transportation-saudi-arabia",
    kind: "pillar",
    badge: "Corporate Events · Saudi Arabia",
    shortName: "Corporate Event Transport",
    h1: "Corporate Event Transportation in Saudi Arabia",
    title: "Corporate Event Transportation Saudi Arabia | Delegation Cars",
    description: "Corporate event transportation across Saudi Arabia — Riyadh, Jeddah & Dammam. Delegation transfers, executive chauffeurs, group vehicles, and single-contact coordination. Fare confirmed on WhatsApp.",
    intro: "One coordinated transport partner for corporate events across Saudi Arabia — product launches, roadshows, incentive trips, and board visits in Riyadh, Jeddah, and Dammam, with executive cars and group vehicles under a single point of contact.",
    city: "Saudi Arabia",
    airport: RUH,
    tldrAnswer: "Corporate event transportation in Saudi Arabia covers Riyadh, Jeddah, and Dammam with delegation transfers, executive chauffeurs, group vehicles, and single-contact coordination — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Coverage", value: "Riyadh · Jeddah · Dammam" },
      { label: "For", value: "Launches · roadshows · delegations" },
      { label: "Support", value: "Single point of contact" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("your event venue"),
    faqs: STD_FAQS("your corporate event", "Saudi Arabia"),
    waContext: "corporate event transportation in Saudi Arabia",
  },
  {
    slug: "vip-event-chauffeur-riyadh",
    kind: "pillar",
    badge: "VIP Event Chauffeur · Riyadh",
    shortName: "VIP Event Chauffeur",
    h1: "VIP Event Chauffeur in Riyadh",
    title: "VIP Event Chauffeur Riyadh | Executive Cars for Guests & Sponsors",
    description: "VIP event chauffeur service in Riyadh — discreet S-Class and Escalade-class cars with professional chauffeurs for guests, sponsors, and executives at conferences and events. Fare confirmed on WhatsApp.",
    intro: "Discreet, executive-class chauffeur service for VIP guests, sponsors, and C-level attendees at Riyadh events — professional bilingual drivers, immaculate vehicles, and priority timing for high-profile schedules.",
    city: "Riyadh",
    airport: RUH,
    tldrAnswer: "VIP event chauffeur service in Riyadh provides discreet S-Class and Escalade-class cars with professional bilingual chauffeurs for guests, sponsors, and executives at conferences and events — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Fleet", value: "S-Class / Escalade class" },
      { label: "For", value: "VIP guests · sponsors" },
      { label: "Booking", value: "Hourly / full-day" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("your Riyadh venue"),
    faqs: STD_FAQS("your Riyadh event", "Riyadh"),
    waContext: "VIP event chauffeur in Riyadh",
  },

  // ─── NAMED EVENTS (annual; edition dates updated yearly) ───────────────
  {
    slug: "leap-riyadh-transportation",
    kind: "event",
    badge: "LEAP · Riyadh",
    shortName: "LEAP Transport",
    h1: "LEAP Riyadh — Event Transportation",
    title: "LEAP Riyadh Transportation | Airport & Venue Transfers",
    description: "Private transport for LEAP in Riyadh — airport transfers to the Riyadh Exhibition & Convention Centre (Malham), daily chauffeur standby, group and VIP cars for delegates and exhibitors. Fare on WhatsApp.",
    intro: "LEAP brings hundreds of thousands of visitors to Riyadh's Exhibition & Convention Centre in Malham — outside the city centre, where pre-booked transport matters. We handle airport transfers, daily standby, and group vehicles for delegates and exhibitors.",
    city: "Riyadh",
    edition: { dates: "31 August – 3 September 2026", venue: "Riyadh Exhibition & Convention Centre, Malham", note: "Held annually in Riyadh." },
    airport: RUH,
    tldrAnswer: "For LEAP in Riyadh we provide private airport transfers to the Riyadh Exhibition & Convention Centre in Malham, daily chauffeur standby, and group vehicles for delegates and exhibitors — with your fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "RECC, Malham" },
      { label: "Edition", value: "31 Aug – 3 Sep 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("the Riyadh Exhibition & Convention Centre"),
    faqs: STD_FAQS("LEAP", "Riyadh"),
    waContext: "LEAP Riyadh event transportation",
  },
  {
    slug: "black-hat-mea-transportation",
    kind: "event",
    badge: "Black Hat MEA · Riyadh",
    shortName: "Black Hat MEA Transport",
    h1: "Black Hat MEA — Event Transportation in Riyadh",
    title: "Black Hat MEA Transportation Riyadh | Delegate & Venue Transfers",
    description: "Private transport for Black Hat MEA in Riyadh — airport transfers to the Riyadh Exhibition & Convention Centre (Malham), daily standby, group and VIP chauffeur for delegates and exhibitors. Fare on WhatsApp.",
    intro: "Black Hat MEA draws tens of thousands of security professionals to Riyadh's Exhibition & Convention Centre in Malham. We keep delegates, speakers, and exhibitor teams moving between the airport, hotels, and the venue.",
    city: "Riyadh",
    edition: { dates: "1 – 3 December 2026", venue: "Riyadh Exhibition & Convention Centre, Malham", note: "Held annually in Riyadh." },
    airport: RUH,
    tldrAnswer: "For Black Hat MEA in Riyadh we provide private airport transfers to the Riyadh Exhibition & Convention Centre in Malham, daily chauffeur standby, and group vehicles for delegates and exhibitors — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "RECC, Malham" },
      { label: "Edition", value: "1 – 3 Dec 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("the Riyadh Exhibition & Convention Centre"),
    faqs: STD_FAQS("Black Hat MEA", "Riyadh"),
    waContext: "Black Hat MEA Riyadh event transportation",
  },
  {
    slug: "money20-20-riyadh-transportation",
    kind: "event",
    badge: "Money20/20 · Riyadh",
    shortName: "Money20/20 Transport",
    h1: "Money20/20 Middle East — Riyadh Transportation",
    title: "Money20/20 Riyadh Transportation | Fintech Delegate Transfers",
    description: "Private transport for Money20/20 Middle East in Riyadh — airport transfers to the Riyadh Exhibition & Convention Centre (Malham), executive chauffeurs, and group cars for fintech delegates. Fare on WhatsApp.",
    intro: "Money20/20 Middle East gathers the region's fintech leaders in Riyadh. We provide executive airport transfers, daily standby, and group transport for delegates, sponsors, and investors around the Exhibition & Convention Centre in Malham.",
    city: "Riyadh",
    edition: { dates: "14 – 16 September 2026", venue: "Riyadh Exhibition & Convention Centre, Malham", note: "Held annually in Riyadh." },
    airport: RUH,
    tldrAnswer: "For Money20/20 Middle East in Riyadh we provide executive airport transfers to the Riyadh Exhibition & Convention Centre in Malham, daily chauffeur standby, and group vehicles for delegates and sponsors — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "RECC, Malham" },
      { label: "Edition", value: "14 – 16 Sep 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("the Riyadh Exhibition & Convention Centre"),
    faqs: STD_FAQS("Money20/20", "Riyadh"),
    waContext: "Money20/20 Riyadh event transportation",
  },
  {
    slug: "global-ai-summit-riyadh-transportation",
    kind: "event",
    badge: "Global AI Summit · Riyadh",
    shortName: "Global AI Summit Transport",
    h1: "Global AI Summit (GAIN) — Riyadh Transportation",
    title: "Global AI Summit Riyadh Transportation | Delegate & VIP Cars",
    description: "Private transport for the Global AI Summit (GAIN) in Riyadh — airport transfers to King Abdulaziz International Conference Centre, executive chauffeurs, and group cars for delegates. Fare on WhatsApp.",
    intro: "The Global AI Summit (GAIN) hosts policymakers and technology leaders at Riyadh's King Abdulaziz International Conference Centre. We provide executive airport transfers, VIP chauffeurs, and delegation transport for the summit.",
    city: "Riyadh",
    edition: { dates: "15 – 17 September 2026", venue: "King Abdulaziz International Conference Centre (KAICC), Riyadh", note: "Held annually in Riyadh." },
    airport: RUH,
    tldrAnswer: "For the Global AI Summit (GAIN) in Riyadh we provide executive airport transfers to the King Abdulaziz International Conference Centre, VIP chauffeurs, and delegation transport — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "KAICC, Riyadh" },
      { label: "Edition", value: "15 – 17 Sep 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("the King Abdulaziz International Conference Centre"),
    faqs: STD_FAQS("the Global AI Summit", "Riyadh"),
    waContext: "Global AI Summit Riyadh event transportation",
  },
  {
    slug: "future-minerals-forum-transportation",
    kind: "event",
    badge: "Future Minerals Forum · Riyadh",
    shortName: "Future Minerals Forum Transport",
    h1: "Future Minerals Forum — Riyadh Transportation",
    title: "Future Minerals Forum Transportation Riyadh | Delegate Transfers",
    description: "Private transport for the Future Minerals Forum in Riyadh — airport transfers to King Abdulaziz International Conference Centre, executive chauffeurs, and group cars for delegates. Fare on WhatsApp.",
    intro: "The Future Minerals Forum brings mining and government leaders to Riyadh's King Abdulaziz International Conference Centre each January. We provide executive airport transfers, VIP chauffeurs, and delegation transport for the forum.",
    city: "Riyadh",
    edition: { dates: "January (next edition January 2027)", venue: "King Abdulaziz International Conference Centre (KAICC), Riyadh", note: "Held annually each January in Riyadh." },
    airport: RUH,
    tldrAnswer: "For the Future Minerals Forum in Riyadh we provide executive airport transfers to the King Abdulaziz International Conference Centre, VIP chauffeurs, and delegation transport — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "KAICC, Riyadh" },
      { label: "Edition", value: "Annually in January" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("the King Abdulaziz International Conference Centre"),
    faqs: STD_FAQS("the Future Minerals Forum", "Riyadh"),
    waContext: "Future Minerals Forum Riyadh event transportation",
  },
];

export const EVENT_SLUGS = EVENTS.map((e) => e.slug);
export const getEvent = (slug: string) => EVENTS.find((e) => e.slug === slug);
