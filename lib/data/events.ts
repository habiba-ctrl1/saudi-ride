// Event & exhibition transport pages. Two kinds:
//  - "pillar": evergreen category pages (Riyadh/Jeddah event, exhibition,
//    conference, corporate events KSA, VIP event chauffeur) — always relevant.
//  - "event": specific recurring Saudi events with a known current edition.
//    Framed as ANNUAL so the page stays useful after each edition (dates are
//    updated once a year, not a throwaway single-year page).
// Every page routes leads to WhatsApp with event context. No fabricated
// affiliation — we provide transport TO the event, we are not an organiser.
//
// CONTENT RULE: named-event `services` and `faqs` are authored PER EVENT with
// venue/city/audience-specific detail — NOT a shared template with the name
// swapped. Only pillar (category) pages share the generic STD_SERVICES block.

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
  /** Optional per-event WhatsApp CTA label (falls back to a generic label). */
  waCtaLabel?: string;
  /** Optional structured (raw, un-encoded) WhatsApp prefill; falls back to a generic line. */
  waPrefill?: string;
  /** Optional commercial "options" section rendered before the FAQ (named events). */
  optionsSection?: {
    heading: string;
    intro: string;
    items: EventService[];
    links?: { href: string; label: string }[];
  };
  /** Optional time-limited departure/return callout (auto-hides after `untilISO`). */
  departureCallout?: {
    heading: string;
    body: string;
    /** Raw (un-encoded) WhatsApp prefill for the departure button. */
    waPrefill: string;
    /** ISO instant after which the callout stops rendering. */
    untilISO: string;
  };
  /** Optional venue-timings table (named events with published hours). */
  timings?: {
    heading: string;
    intro?: string;
    rows: { who: string; hours: string; meaning: string }[];
    closingLine?: string;
    sourceHref?: string;
    sourceLabel?: string;
  };
  /** Optional booking/trust strip — confirmed policy items + internal links only. */
  trustStrip?: {
    heading: string;
    items: string[];
    links: { href: string; label: string }[];
  };
  /** Optional "delegation / organiser desk" module (Path B — B2B, multi-vehicle). */
  organiserDesk?: {
    heading: string;
    body: string;
    /** Raw (un-encoded) WhatsApp prefill for the delegation-quote button. */
    waPrefill: string;
    /** mailto subject + body (raw, un-encoded) for the organiser-desk email button. */
    emailSubject: string;
    emailBody: string;
  };
  /** Optional venue-coverage table (pillar asset). */
  venueTable?: {
    heading: string;
    intro?: string;
    rows: { venue: string; district: string; access: string; setup: string }[];
    closing?: string;
    image?: { src: string; alt: string };
  };
  /** Optional image rendered under the services grid (e.g. fleet line-up). */
  servicesImage?: { src: string; alt: string };
  /** Optional hierarchical related-links block (overrides the auto sibling list). */
  relatedOverride?: {
    heading: string;
    groups: { label: string; links: { href: string; label: string }[] }[];
  };
  /**
   * Optional real-world event this page is ABOUT (for WebPage.about → Event schema).
   * We are the transport provider, NOT the organiser — Event is never the root type.
   */
  about?: {
    eventName: string;
    startDate: string;
    endDate: string;
    venueName: string;
    organizer?: string;
    sameAs?: string[];
  };
  /** Hero image (assigned below by slug group). */
  heroImage?: string;
  heroAlt?: string;
}

// Reusable service blocks for PILLAR (category) pages only.
const STD_SERVICES = (label: string): EventService[] => [
  { title: "Airport ⇄ Venue Transfers", desc: `Private pickups from the airport straight to ${label}, with flight tracking and meet & greet for arriving delegates and speakers.` },
  { title: "Daily Standby & Hourly Chauffeur", desc: "A dedicated car and driver on standby for the duration of the event — move between sessions, meetings, and your hotel on your own schedule." },
  { title: "Group & Delegation Transport", desc: "SUVs, vans, and coasters for teams, exhibitors, and delegations travelling together, coordinated under one point of contact." },
  { title: "VIP & Executive Chauffeur", desc: "Discreet executive cars (S-Class, Escalade class) for VIPs, sponsors, and C-level guests — professional, bilingual chauffeurs." },
];

const RUH = { slug: "king-khalid-riyadh", label: "Riyadh Airport (RUH)" };
const JED = { slug: "king-abdulaziz-jeddah", label: "Jeddah Airport (JED)" };

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
    intro: "Reliable private transport for any event in Riyadh — from a single delegate arriving at the airport to a full company delegation. Airport transfers, daily standby, group vehicles, and a premium chauffeur for VIP guests, all coordinated under one point of contact.",
    city: "Riyadh",
    airport: RUH,
    tldrAnswer: "Event transportation in Riyadh covers private airport transfers, hourly and full-day chauffeur standby, group and delegation vehicles, and an executive limousine service for conferences, exhibitions, and corporate events — with your fare confirmed on WhatsApp and, for companies, a written quote and invoicing on request.",
    tldrFacts: [
      { label: "Coverage", value: "Riyadh · all venues" },
      { label: "Vehicles", value: "Sedan · SUV · Van · Coaster · Limousine" },
      { label: "Booking", value: "Hourly / daily / delegation" },
      { label: "Response", value: "Written quote in 1–2 hrs" },
      { label: "Availability", value: "24/7" },
    ],
    // Bespoke services (this pillar): renamed VIP block to the licensed "limousine"
    // term, generic vehicle categories (no unverified S-Class/Escalade claim),
    // and organiser-relevant specificity (coaster capacity, single contact).
    services: [
      { title: "Airport ⇄ Venue Transfers", desc: "Private pickups from Riyadh Airport (RUH) straight to your venue, with flight tracking and meet & greet for arriving delegates and speakers." },
      { title: "Daily Standby & Hourly Chauffeur", desc: "A dedicated car and driver on standby for the event — move between sessions, meetings, and your hotel on your own schedule, hourly or full-day." },
      { title: "Group & Delegation Transport", desc: "Executive sedans, full-size SUVs, 7-seat vans and up-to-22-seat coasters for teams, exhibitors, and delegations travelling together, coordinated under one point of contact." },
      { title: "VIP & Executive Limousine Service", desc: "Discreet executive limousine service for VIPs, sponsors, and C-level guests — Mercedes S-Class and Cadillac Escalade-class cars with professional, bilingual (English & Arabic) chauffeurs, for VIP arrivals and hotel-to-meeting circuits." },
    ],
    faqs: [
      { question: "Which Riyadh event venues do you cover?", answer: "All of them — the Riyadh Exhibition & Convention Centre (RECC) in Malham, King Abdulaziz International Conference Centre (KAICC), Riyadh Front / ROSHN Front, The Arena, and hotel ballrooms across the DQ, Olaya, and King Fahd Road districts. Tell us your venue on WhatsApp and we plan the run." },
      { question: "Can I book one car for the whole event?", answer: "Yes. An hourly or full-day chauffeur stays on standby so you move between the venue, meetings, and your hotel without waiting for a ride each time — useful when sessions run late or your schedule shifts." },
      { question: "Do you handle arrivals across different flights and hotels?", answer: "Yes. We coordinate multiple pickups from Riyadh Airport (RUH) and several hotels under one point of contact, so a whole team lands and reaches the venue together even on different flights." },
      { question: "How is the fare confirmed?", answer: "Send your dates, venue, vehicle type, and passenger count on WhatsApp. We confirm a fixed fare before you book — no surge and no hidden fees, even during peak event weeks." },
      { question: "How much does event transportation in Riyadh cost?", answer: "The fare depends on the vehicle, the number of movements each day, and whether you need a car on daily standby. We confirm a fixed price in writing on WhatsApp before you book — no meter, no surge. Send your event, venue, dates, and passenger count for a clear quote." },
      { question: "Should I book a car per trip or a chauffeur on standby?", answer: "As a rough guide, once you have more than about three movements in a day, a chauffeur on daily standby usually costs less than booking separate trips — and the car is always waiting, so you're never delayed between sessions. For one or two transfers a day, per-trip booking is simpler. Tell us your schedule and we'll advise honestly." },
      { question: "Can you invoice our company?", answer: "Yes — corporate invoicing is available on request for delegations and company bookings, with a written quote before you commit. Share your company details on WhatsApp or by email and we'll set it up." },
      { question: "Do you provide limousine service for corporate events in Riyadh?", answer: "Yes. Our executive limousine service covers VIP arrivals, hotel-to-meeting circuits, and discreet transport for sponsors and C-level guests, with bilingual chauffeurs — booked as a single car or as part of a wider delegation arrangement." },
      { question: "How far in advance should we book for a major event week?", answer: "For major event weeks in Riyadh, vehicles and chauffeurs are in high demand, so the earlier you confirm the better — booking ahead secures both the fleet you need and your fixed fare. For quieter dates, a few days' notice is usually enough." },
    ],
    waContext: "event transportation in Riyadh",
    waPrefill:
      "Salam! I need event transportation in Riyadh.\n• Event / venue:\n• Dates:\n• Pickup (airport or hotel):\n• Passengers & bags:\n• Need: airport transfer / daily standby / group vehicle / VIP chauffeur",
    heroAlt: "Chauffeur opening the rear door of a black executive sedan at a Riyadh event venue entrance at dusk",
    organiserDesk: {
      heading: "Moving a delegation or running an event?",
      body: "Multi-vehicle, multi-day event transport with one coordinator, one schedule and one invoice. Executive sedans, SUVs, vans and coasters — arrival manifests, daily hotel-to-venue loops, and VIP limousine service under a single point of contact.",
      waPrefill:
        "Salam! I need a delegation transport quote.\n• Event name & venue:\n• Dates (from – to):\n• Total passengers:\n• Vehicles needed (sedan / SUV / van / coaster):\n• Daily schedule (airport / hotel loops / standby):\n• Invoicing & payment terms required:\n• Company & your role:",
      emailSubject: "Delegation / event transport quote — Riyadh",
      emailBody:
        "Salam,\n\nWe need a delegation transport quote for an event in Riyadh:\n\n• Event name & venue:\n• Dates (from – to):\n• Total passengers:\n• Vehicles needed (sedan / SUV / van / coaster):\n• Daily schedule (airport / hotel loops / standby):\n• Invoicing & payment terms required:\n• Company & your role:\n\nThank you.",
    },
    venueTable: {
      heading: "Riyadh event venues we cover",
      intro: "Transport needs vary sharply by venue — where it is, whether it has metro access and parking, and how far it sits from the airport and the hotel belt. Here's how we plan the run for each of the main Riyadh venues.",
      rows: [
        { venue: "Riyadh Exhibition & Convention Centre (RECC)", district: "Malham, north-west Riyadh", access: "Out of town; no metro; remote from the hotel belt.", setup: "This is where a chauffeur on daily standby earns its cost — rides get scarce at the evening close." },
        { venue: "Riyadh International Convention & Exhibition Center (RICEC)", district: "Al Murabba, King Abdullah Road", access: "Central; ~70,000 m², four halls, ~1,500 parking spaces, a direct metro stop, Radisson Blu within walking distance; roughly 30 minutes from King Khalid Airport (RUH).", setup: "Central and metro-served — often a single airport transfer is all you need." },
        { venue: "Riyadh Front Exhibition & Conference Center (RFECC)", district: "ROSHN Front, near King Khalid Airport", access: "Minutes from King Khalid Airport and from major hotels and malls.", setup: "Close to the airport but far from the Olaya belt — airport transfers plus hotel-to-venue loops." },
        { venue: "King Abdulaziz International Conference Centre (KAICC)", district: "Central Riyadh", access: "~24,500 m²; a government and institutional conference venue.", setup: "Accreditation and access timing shape the schedule — standby around session windows works best." },
        { venue: "The Arena Riyadh", district: "Riyadh", access: "Multipurpose venue for exhibitions and large gatherings.", setup: "Group vehicles and coasters for larger delegations." },
        { venue: "Diriyah", district: "North-west Riyadh (UNESCO World Heritage area)", access: "A premium destination for high-profile and cultural events.", setup: "VIP limousine service and discreet chauffeurs for cultural and sponsor guests." },
        { venue: "Hotel ballrooms", district: "Diplomatic Quarter · Olaya · King Fahd Road", access: "Central hotel clusters hosting corporate functions and gala dinners.", setup: "Short hotel-to-venue transfers and evening standby." },
      ],
      closing:
        "Transport needs vary sharply by venue. RICEC is central with metro access and its own parking, so a single airport transfer is often enough. RECC Malham is well outside the city with no metro — that's where a chauffeur on daily standby earns its cost. RFECC is minutes from the airport but far from the Olaya hotel belt. KAICC is a government venue where accreditation and access timing shape the schedule. Tell us the venue and we'll tell you which setup actually makes sense — exact drive times from the airport confirmed on request.",
      image: {
        src: "/gallery/riyadh-event-venues-map-transport.webp",
        alt: "Map of major Riyadh event venues including RECC Malham, RICEC, RFECC and KAICC with airport distances",
      },
    },
    servicesImage: {
      src: "/gallery/event-fleet-lineup-sedan-suv-van-coaster-riyadh.webp",
      alt: "Executive sedan, SUV, van and coaster lined up for event delegation transport in Riyadh",
    },
    trustStrip: {
      heading: "Booking, fares and invoicing",
      items: [
        "Written quote confirmed on WhatsApp or email, usually within 1–2 hours.",
        "Fixed fare confirmed in writing before booking — no meter, no surge.",
        "Corporate invoicing available on request for company and delegation bookings.",
        "Professional, bilingual (English & Arabic) chauffeurs.",
      ],
      links: [
        { href: "/fleet", label: "vehicles we run for event work" },
        { href: "/pricing", label: "how our fixed fares are set" },
        { href: "/services/airport-transfers", label: "airport transfers across Saudi Arabia" },
        { href: "/about", label: "about Taxi Saudi Arabia" },
        { href: "/contact", label: "contact us" },
      ],
    },
    relatedOverride: {
      heading: "Related event transport services in Riyadh",
      groups: [
        {
          label: "By event type",
          links: [
            { href: "/events/riyadh-exhibition-transportation", label: "Exhibition transportation" },
            { href: "/events/riyadh-conference-transportation", label: "Conference transportation" },
            { href: "/events/vip-event-chauffeur-riyadh", label: "VIP event chauffeur" },
          ],
        },
        {
          label: "By event",
          links: [{ href: "/events/leap-riyadh-transportation", label: "LEAP Riyadh transportation" }],
        },
        {
          label: "More",
          links: [
            { href: "/fleet", label: "Our fleet" },
            { href: "/pricing", label: "How fares work" },
            { href: "/events", label: "All Saudi event transport" },
          ],
        },
      ],
    },
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
      { label: "Coverage", value: "RECC · Riyadh Front · all venues" },
      { label: "Vehicles", value: "SUV · Van · Coaster" },
      { label: "For", value: "Exhibitors · visitors" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("the exhibition halls"),
    faqs: [
      { question: "Can you carry stand materials and sample cases?", answer: "Yes. Ask for an SUV or van and we allow for exhibitor luggage, sample cases, and boxes — not just passengers. For larger stand teams a coaster keeps everyone and their kit together." },
      { question: "Do you cover build-up and breakdown days?", answer: "Yes. Exhibition transport isn't only show days — we run early build-up mornings and late breakdown nights so your stand crew reaches the halls before doors open and gets back after teardown." },
      { question: "Can a car wait between the hotel and the halls?", answer: "Yes. Book daily standby and a car stays on call at the venue, so exhibitors can drop back to the hotel for a client meeting and return without hunting for a ride at a remote exhibition centre." },
      { question: "How do we arrange transport for a large visiting group?", answer: "Send your group size and hotels on WhatsApp. We assign vans or coasters under one contact and confirm a fixed fare before you book — no per-app surge during busy show days." },
    ],
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
    faqs: [
      { question: "Can you meet speakers arriving on separate flights?", answer: "Yes. We track each flight and meet speakers at Riyadh Airport (RUH) arrivals with a name sign, then run them straight to the conference hotel — even for red-eye or delayed arrivals." },
      { question: "Do you run a shuttle between the hotel and the venue?", answer: "Yes. For conferences where delegates stay in one hotel cluster we run repeating hotel-to-venue loops with vans or coasters, timed to the session agenda so no one misses a keynote." },
      { question: "Can sponsors and VIP guests have a dedicated car?", answer: "Yes. Book an executive S-Class or Escalade-class chauffeur on standby for sponsors and C-level guests, with a discreet, bilingual driver who keeps to a high-profile schedule." },
      { question: "How far ahead should we book?", answer: "For a multi-speaker conference, a week or more ahead lets us reserve the right vehicles and drivers. Send your programme on WhatsApp and we confirm a fixed fare for the whole run." },
    ],
    waContext: "conference transportation in Riyadh",
  },
  {
    slug: "jeddah-event-transportation",
    kind: "pillar",
    badge: "Event Transport · Jeddah",
    shortName: "Jeddah Event Transport",
    h1: "Event Transportation in Jeddah",
    title: "Event Transportation in Jeddah | Delegate & VIP Transfers",
    description: "Private event transportation in Jeddah — airport transfers, daily chauffeur standby, group & VIP cars for conferences, exhibitions, sporting events and corporate functions on the Red Sea coast. Fare on WhatsApp.",
    intro: "Private transport for events across Jeddah — from King Abdulaziz Airport arrivals to the Corniche, the Superdome, hotels, and conference venues. Airport transfers, daily standby, group vehicles, and VIP chauffeurs under one contact.",
    city: "Jeddah",
    airport: JED,
    tldrAnswer: "Event transportation in Jeddah covers private transfers from King Abdulaziz Airport (JED), daily and hourly chauffeur standby, group and delegation vehicles, and VIP executive cars for conferences, exhibitions, sporting and corporate events — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Coverage", value: "Jeddah · Corniche · all venues" },
      { label: "Vehicles", value: "Sedan · SUV · Van · Coaster" },
      { label: "Booking", value: "Hourly / daily / delegation" },
      { label: "Availability", value: "24/7" },
    ],
    services: STD_SERVICES("your Jeddah venue"),
    faqs: [
      { question: "Which Jeddah venues and areas do you cover?", answer: "The Corniche and Jeddah Corniche Circuit, the Superdome, Jeddah Centre for Forums & Events, and hotels along the waterfront and downtown. Share your venue on WhatsApp and we plan pickups and standby around it." },
      { question: "Do you handle late-night and evening events?", answer: "Yes. Many Jeddah events — sporting fixtures, concerts, and dinners — run into the night. We operate 24/7, so your return from the venue to the hotel is booked in advance rather than left to a scarce late-night ride." },
      { question: "Can you meet guests at Jeddah Airport?", answer: "Yes. We track your flight and meet you inside King Abdulaziz Airport (JED) arrivals with a name sign, then drive straight to your hotel or venue — including the busy Umrah-season and event-week peaks." },
      { question: "How is the fare set?", answer: "Send your dates, venue, vehicle type, and passenger count on WhatsApp and we confirm a fixed fare before you book — no surge and no hidden fees during event weeks." },
    ],
    waContext: "event transportation in Jeddah",
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
    faqs: [
      { question: "Can you run an event across more than one city?", answer: "Yes. For roadshows and multi-city programmes we coordinate the same standard of executive cars and drivers in Riyadh, Jeddah, and Dammam under one account and one contact, so the experience is consistent city to city." },
      { question: "Do you offer a company account with monthly billing?", answer: "Yes. Ask about a corporate account for repeat events and airport runs — one point of contact, agreed vehicles, and consolidated billing instead of settling each trip separately. Message us on WhatsApp to set it up." },
      { question: "Can you transport a delegation of senior executives together?", answer: "Yes. We assign matching executive vehicles and bilingual chauffeurs for a board or ministerial delegation, keeping the group together with aligned timing and a single lead driver coordinating the convoy." },
      { question: "How do we get a quote for a corporate programme?", answer: "Send your cities, dates, headcount, and vehicle preferences on WhatsApp. We build the plan and confirm a fixed fare before you commit — no surge pricing during peak business travel." },
    ],
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
    faqs: [
      { question: "What vehicles are available for VIP guests?", answer: "Executive sedans in the Mercedes S-Class class and full-size SUVs in the Cadillac Escalade / GMC class — immaculate, late-model, and presented for high-profile guests. Tell us the guest and occasion and we match the car." },
      { question: "Are your VIP chauffeurs discreet and bilingual?", answer: "Yes. VIP drivers are experienced, professionally dressed, and speak Arabic and English — briefed to keep a low profile, manage arrivals discreetly, and hold to a protocol schedule." },
      { question: "Can a car stay dedicated to one guest all day?", answer: "Yes. Book an hourly or full-day VIP chauffeur so a single car and driver stay assigned to your guest for the whole visit — arrivals, sessions, dinners, and the return to the airport." },
      { question: "Can you handle a last-minute VIP request?", answer: "Where a suitable car and chauffeur are free, yes. Message us on WhatsApp with the timing and we confirm availability and a fixed fare quickly — no surge even at short notice." },
    ],
    waContext: "VIP event chauffeur in Riyadh",
  },

  // ─── NAMED EVENTS (annual; edition dates updated yearly) ───────────────
  {
    slug: "leap-riyadh-transportation",
    kind: "event",
    badge: "LEAP · Riyadh",
    shortName: "LEAP Transport",
    h1: "LEAP Riyadh Event Transportation",
    title: "LEAP Riyadh Event Transportation | Airport & Venue Transfers",
    description: "Private LEAP Riyadh transportation — airport transfers to the Riyadh Exhibition & Convention Centre in Malham, daily chauffeur standby, group and VIP cars for delegates and exhibitors. Fare confirmed on WhatsApp.",
    intro: "LEAP is one of the world's largest tech events, drawing hundreds of thousands to the Riyadh Exhibition & Convention Centre in Malham — well north-west of the city, where app-based rides get scarce and pricey at peak. Pre-booked transport is the difference between leaving on time and queueing in the desert car park.",
    city: "Riyadh",
    edition: { dates: "31 August – 3 September 2026", venue: "Riyadh Exhibition & Convention Centre, Malham", note: "Held annually in Riyadh." },
    airport: RUH,
    tldrAnswer: "For LEAP in Riyadh we provide private event transportation — Riyadh Airport (RUH) transfers, hotel-to-venue runs to the Exhibition & Convention Centre in Malham, exhibitor and team vehicles, VIP chauffeur cars, and group vans and SUVs — with your fare confirmed on WhatsApp and no peak-hour surge.",
    tldrFacts: [
      { label: "Venue", value: "RECC, Malham" },
      { label: "Edition", value: "31 Aug – 3 Sep 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: [
      { title: "Airport → Malham Transfers", desc: "Direct pickups from Riyadh Airport (RUH) to the Exhibition & Convention Centre in Malham — a 30–45 minute run depending on traffic. We track your flight and meet you at arrivals, so you skip the taxi queue on a busy LEAP arrivals day." },
      { title: "Daily Standby at a Remote Venue", desc: "Malham sits outside the city and rides thin out fast when the venue empties at the end of each day. A dedicated car on daily standby means your ride is already there — no waiting in the car park while surge prices climb." },
      { title: "Exhibitor & Stand-Team Vehicles", desc: "SUVs and vans for exhibitor teams carrying demo kit and sample cases, plus early build-up and late breakdown runs so your stand is ready before doors open." },
      { title: "VIP & Investor Chauffeur", desc: "Executive S-Class and Escalade-class cars for founders, investors, and sponsors moving between LEAP, hotel meetings, and side-events with a discreet, bilingual chauffeur." },
    ],
    faqs: [
      { question: "How far is LEAP's venue from Riyadh Airport and the city?", answer: "The Riyadh Exhibition & Convention Centre is in Malham, north-west of Riyadh — roughly a 30–45 minute drive from King Khalid Airport (RUH) and from the central hotel districts, depending on event traffic. Because it's out of town, booking ahead avoids the end-of-day ride shortage." },
      { question: "Is it hard to get a ride when LEAP closes for the day?", answer: "Yes — that's the main pain point. With hundreds of thousands leaving Malham within a short window, app-based cars get scarce and expensive. A pre-booked car or daily standby means your driver is waiting, at a fixed fare agreed in advance." },
      { question: "Can you move an exhibitor team with equipment?", answer: "Yes. Ask for an SUV or van and we allow room for demo units, sample cases, and marketing materials, plus early-morning build-up and late breakdown runs so your stand crew reaches the halls on schedule." },
      { question: "Do you cover hotel-to-venue runs for a group?", answer: "Yes. Tell us your hotel and group size on WhatsApp and we run daily loops between your hotel and Malham with the right-sized vehicle, timed to the sessions you want to attend." },
      { question: "Can I book a private taxi from Riyadh Airport to LEAP in Malham?", answer: "Yes. We run private airport transfers from King Khalid Airport (RUH) straight to the Riyadh Exhibition & Convention Centre in Malham — we track your flight, meet you at arrivals, and take you directly to the venue, so you skip the taxi queue on a busy LEAP arrivals day. Fare confirmed on WhatsApp before you travel." },
      { question: "Can you provide daily transportation between my Riyadh hotel and LEAP?", answer: "Yes. Book a car on daily standby and it runs your morning drop to Malham and evening pickup for the length of LEAP — a fixed daily arrangement for individuals or small teams, so you never hunt for a ride at a remote venue. Send your hotel, dates, and passenger count on WhatsApp for a quote." },
      { question: "What time does LEAP close each day?", answer: "LEAP is open to visitors from 1:00 PM to 9:00 PM, while exhibitors have access from 9:00 AM to 9:30 PM for stand build-up and breakdown. The busiest transport moment is the 9:00 PM close, when the crowd leaves Malham at once — which is exactly why a pre-booked car or daily standby beats waiting for an app ride at a remote venue after dark." },
      { question: "Should I drive to LEAP or book a car?", answer: "Both work. The venue has large on-site parking, so self-driving is possible if you're comfortable with Malham's out-of-town location. The real constraint is the simultaneous end-of-day exit: everyone leaves within the same short window, so the car parks and access roads back up. A pre-booked chauffeur means you're collected at the hall exit at a fixed fare, with no parking hunt or exit queue to manage yourself." },
      { question: "Can you also cover DeepFest?", answer: "Yes. DeepFest is co-located within LEAP as its artificial-intelligence programme — same venue in Malham, same dates. Your airport transfers, hotel runs, and daily standby cover DeepFest exactly as they cover the main LEAP halls; just tell us which programme you're attending when you message us." },
    ],
    waContext: "LEAP Riyadh event transportation",
    waCtaLabel: "Get LEAP Riyadh Transport Quote on WhatsApp",
    waPrefill:
      "Salam! I need transport for LEAP Riyadh.\n• Arriving (flight / date / time):\n• Hotel:\n• Passengers & bags:\n• Need: airport transfer / daily standby / exhibitor van / VIP car\n• Departure flight:",
    departureCallout: {
      heading: "Leaving LEAP on the final day?",
      body: "LEAP halls close at 9:00 PM and tens of thousands of people head for the exits at the same time, from a venue outside the city. If you have a flight on 3 or 4 September, send us your flight time and hotel now and we will have a car waiting at the hall exit — fixed fare, no surge.",
      waPrefill:
        "Salam! I need a departure transfer from LEAP.\n• Pickup (venue or hotel):\n• Date & time:\n• Flight number & departure time:\n• Passengers & bags:",
      untilISO: "2026-09-05T23:59:00+03:00",
    },
    timings: {
      heading: "LEAP daily timings and what they mean for your transport",
      intro: "LEAP runs on a split schedule — exhibitors are on-site hours before visitors arrive, and everyone leaves together at the 9 PM close. Planning your car around these windows is the difference between a smooth exit and a long wait in the Malham car park.",
      rows: [
        { who: "Visitors", hours: "1:00 PM – 9:00 PM", meaning: "Midday pickup from your hotel; expect the heaviest demand at the 9 PM exit." },
        { who: "Selected / premium pass", hours: "from 12:00 PM", meaning: "An earlier arrival window — book your drop a little ahead of the general rush." },
        { who: "Exhibitors", hours: "9:00 AM – 9:30 PM", meaning: "Morning build-up and late breakdown — a 12-hour day that suits a car on daily standby." },
      ],
      closingLine: "That's a 12-hour window for exhibitor teams — the reason most stand crews book a car on daily standby rather than trip by trip.",
      sourceHref: "https://onegiantleap.com",
      sourceLabel: "official LEAP visitor information",
    },
    trustStrip: {
      heading: "Booking, fares and what to expect",
      items: [
        "Fare confirmed in writing on WhatsApp before you book — no meter, no surge.",
        "Professional, bilingual (English & Arabic) chauffeurs.",
        "Booking and support available 24/7 through the LEAP week.",
      ],
      links: [
        { href: "/fleet", label: "see the vehicles we run" },
        { href: "/pricing", label: "how our fixed fares work" },
        { href: "/services/airport-transfers", label: "airport transfers across Saudi Arabia" },
        { href: "/about", label: "about Taxi Saudi Arabia" },
        { href: "/contact", label: "contact us" },
        { href: "/events", label: "all Saudi event transport" },
      ],
    },
    about: {
      eventName: "LEAP",
      startDate: "2026-08-31",
      endDate: "2026-09-03",
      venueName: "Riyadh Exhibition & Convention Centre, Malham",
      organizer: "Tahaluf",
      sameAs: ["https://onegiantleap.com", "https://en.wikipedia.org/wiki/LEAP_(technology_conference)"],
    },
    heroAlt: "Group and executive vehicles for LEAP Riyadh event transportation at the Riyadh Exhibition & Convention Centre in Malham",
    optionsSection: {
      heading: "LEAP Riyadh Transportation Options",
      intro: "Whether you're a delegate, exhibitor, or part of a stand team, these are the LEAP Riyadh transportation options we arrange most often — private event transportation in Riyadh for the run out to Malham and back, all confirmed on WhatsApp before you travel.",
      items: [
        { title: "Airport → LEAP Malham", desc: "A private LEAP Malham transfer straight from Riyadh Airport (RUH) to the Exhibition & Convention Centre, with flight tracking and meet & greet at arrivals." },
        { title: "Hotel → LEAP Venue", desc: "Door-to-door runs from your Riyadh hotel to the LEAP venue in Malham, timed to doors-open so you arrive ahead of the morning rush." },
        { title: "Daily Event Transportation", desc: "A dedicated car and driver on daily standby for the length of LEAP, so you move between hotel, venue, and side-events on your own schedule." },
        { title: "Exhibitor & Stand-Team Transport", desc: "SUVs and vans for stand teams carrying demo kit and sample cases, including early build-up and late breakdown runs." },
        { title: "VIP & Chauffeur Transportation", desc: "Executive chauffeur cars for founders, investors, and sponsors moving between LEAP, hotel meetings, and evening functions." },
        { title: "Group Vans & SUVs", desc: "Right-sized group vehicles for delegations travelling together to LEAP, coordinated under one point of contact." },
        { title: "Return Transfers After the Event", desc: "Pre-booked return transfers for the end-of-day rush, so your car is waiting when LEAP closes instead of competing for a scarce ride out of Malham." },
      ],
      links: [
        { href: "/events/riyadh-event-transportation", label: "Riyadh event transportation hub" },
        { href: "/events/riyadh-exhibition-transportation", label: "Riyadh exhibition transport" },
        { href: "/events/riyadh-conference-transportation", label: "Riyadh conference transport" },
        { href: "/events/vip-event-chauffeur-riyadh", label: "VIP event chauffeur in Riyadh" },
      ],
    },
  },
  {
    slug: "black-hat-mea-transportation",
    kind: "event",
    badge: "Black Hat MEA · Riyadh",
    shortName: "Black Hat MEA Transport",
    h1: "Black Hat MEA — Event Transportation in Riyadh",
    title: "Black Hat MEA Transportation Riyadh | Delegate & Venue Transfers",
    description: "Private transport for Black Hat MEA in Riyadh — airport transfers to the Riyadh Exhibition & Convention Centre (Malham), daily standby, group and VIP chauffeur for delegates and exhibitors. Fare on WhatsApp.",
    intro: "Black Hat MEA gathers tens of thousands of cybersecurity professionals from around the world at the Riyadh Exhibition & Convention Centre in Malham. With a heavily international crowd and a venue outside the city, pre-arranged airport meet & greet and daily standby keep delegates and exhibitor teams moving.",
    city: "Riyadh",
    edition: { dates: "1 – 3 December 2026", venue: "Riyadh Exhibition & Convention Centre, Malham", note: "Held annually in Riyadh." },
    airport: RUH,
    tldrAnswer: "For Black Hat MEA in Riyadh we provide private airport meet & greet to the Riyadh Exhibition & Convention Centre in Malham, daily chauffeur standby, and group vehicles for international delegates and exhibitors — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "RECC, Malham" },
      { label: "Edition", value: "1 – 3 Dec 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: [
      { title: "International Arrivals Meet & Greet", desc: "Black Hat MEA draws a heavily international audience. We track inbound flights and meet delegates at Riyadh Airport (RUH) arrivals with a name sign, then drive straight to the hotel or Malham — smooth even for first-time visitors to Riyadh." },
      { title: "Daily Standby to Malham", desc: "The Exhibition & Convention Centre is out of the city, and a big crowd leaves together each evening. A car on daily standby means your ride is ready at close, at a fare fixed in advance — no scramble for an app car." },
      { title: "Delegation & Team Transport", desc: "SUVs, vans, and coasters for security teams, vendors, and company delegations travelling together, coordinated under one contact with aligned timing across the three days." },
      { title: "Executive & Speaker Chauffeur", desc: "Discreet executive cars for speakers, sponsors, and C-level guests, with bilingual chauffeurs who keep to a tight briefing and session schedule." },
    ],
    faqs: [
      { question: "I'm flying in internationally for Black Hat MEA — can you meet me at the airport?", answer: "Yes. We track your flight and meet you inside Riyadh Airport (RUH) arrivals with a name sign, 24/7 including late arrivals, then take you directly to your hotel or the venue in Malham — no taxi queue after a long flight." },
      { question: "Where is Black Hat MEA held and how far is it?", answer: "At the Riyadh Exhibition & Convention Centre in Malham, north-west of Riyadh — about a 30–45 minute drive from the airport and central hotels. Because it's outside the city, a pre-booked car is far more reliable than hailing one at the venue." },
      { question: "Can you coordinate transport for our whole team?", answer: "Yes. Send your headcount and hotels on WhatsApp and we assign vans or a coaster under a single contact, with daily runs to and from Malham timed around the agenda." },
      { question: "Will the fare change during the busy event days?", answer: "No. We confirm a fixed fare before you book and hold it for the event — no surge pricing even when everyone is heading to or from the venue at the same time." },
    ],
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
    intro: "Money20/20 Middle East brings the region's banks, fintechs, and investors together in Riyadh. It's a deal-making event — delegates run from stage sessions to hotel meetings to sponsor dinners — so an executive car on standby, not a fresh app booking each time, keeps the day moving.",
    city: "Riyadh",
    edition: { dates: "14 – 16 September 2026", venue: "Riyadh Exhibition & Convention Centre, Malham", note: "Held annually in Riyadh." },
    airport: RUH,
    tldrAnswer: "For Money20/20 Middle East in Riyadh we provide executive airport transfers to the Riyadh Exhibition & Convention Centre in Malham, daily chauffeur standby for back-to-back meetings, and group vehicles for delegates and sponsors — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "RECC, Malham" },
      { label: "Edition", value: "14 – 16 Sep 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: [
      { title: "Executive Airport Transfers", desc: "Money20/20 draws senior banking and fintech delegates. We meet them at Riyadh Airport (RUH) in an executive car and drive straight to the hotel or the Exhibition & Convention Centre in Malham, with flight tracking and meet & greet." },
      { title: "Standby for Back-to-Back Meetings", desc: "The value of Money20/20 is the meetings between sessions. A dedicated car on hourly or daily standby moves you from the venue to hotel meeting rooms and back without a new booking each time — ideal for a packed deal-making schedule." },
      { title: "Sponsor & Delegation Vehicles", desc: "Matching executive cars and vans for sponsor teams and company delegations, coordinated under one contact so a group arrives together for a keynote or a networking dinner." },
      { title: "Evening & Networking Runs", desc: "Much of the business happens at evening dinners and side-events across Riyadh. We handle late transfers between the venue, restaurants, and hotels, booked in advance at a fixed fare." },
    ],
    faqs: [
      { question: "Can a car stay with me for meetings around Money20/20?", answer: "Yes. Book an hourly or full-day chauffeur and a car stays on standby, so you can move from the venue in Malham to hotel meeting rooms and sponsor dinners across the day without rebooking or waiting for a ride." },
      { question: "Do you provide executive cars for senior delegates?", answer: "Yes. We offer Mercedes S-Class-class sedans and Escalade-class SUVs with bilingual chauffeurs for senior banking, fintech, and investor guests — presented and driven to an executive standard." },
      { question: "How far is the venue from Riyadh's hotels?", answer: "The Riyadh Exhibition & Convention Centre is in Malham, north-west of the city — roughly 30–45 minutes from the central hotel districts and the airport. We plan pickups around that so you're never late for a session or a meeting." },
      { question: "Can you handle late-evening networking transfers?", answer: "Yes. We operate 24/7, so evening dinners and side-events are covered — your return to the hotel is pre-booked at a fixed fare rather than left to a late-night app search." },
    ],
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
    intro: "The Global AI Summit (GAIN) hosts ministers, policymakers, and technology leaders at the King Abdulaziz International Conference Centre in Riyadh. It's a high-protocol event, so discreet executive chauffeurs, precise timing, and airport meet & greet matter more than raw fleet size.",
    city: "Riyadh",
    edition: { dates: "15 – 17 September 2026", venue: "King Abdulaziz International Conference Centre (KAICC), Riyadh", note: "Held annually in Riyadh." },
    airport: RUH,
    tldrAnswer: "For the Global AI Summit (GAIN) in Riyadh we provide executive airport transfers to the King Abdulaziz International Conference Centre, discreet VIP chauffeurs for high-protocol guests, and delegation transport — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "KAICC, Riyadh" },
      { label: "Edition", value: "15 – 17 Sep 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: [
      { title: "VIP Airport Meet & Greet", desc: "GAIN attracts senior officials and technology leaders. We meet them at Riyadh Airport (RUH) with a discreet executive car and name-sign greeting, then drive directly to the conference hotel or KAICC — smooth, private, and on time." },
      { title: "Protocol-Ready Executive Chauffeur", desc: "For a high-protocol summit, we assign immaculate S-Class and Escalade-class cars with experienced bilingual chauffeurs who understand precise timing, security-conscious pickups, and a low profile." },
      { title: "Delegation & Speaker Transport", desc: "Coordinated executive vehicles for speaker panels and official delegations, kept together under one contact so a group reaches KAICC together for a keynote or a bilateral session." },
      { title: "Full-Day Standby", desc: "A car and driver dedicated to a guest for the length of the summit — moving between KAICC, ministry meetings, and the hotel without a new booking each time." },
    ],
    faqs: [
      { question: "Where is the Global AI Summit held?", answer: "At the King Abdulaziz International Conference Centre (KAICC) in Riyadh, near the airport road. We plan transfers from Riyadh Airport (RUH) and the main hotels directly to KAICC, timed to the summit agenda." },
      { question: "Do you provide discreet transport for senior officials?", answer: "Yes. We assign executive cars with experienced, bilingual chauffeurs briefed for high-protocol guests — discreet arrivals, precise timing, and a professional presentation throughout the summit." },
      { question: "Can one car be dedicated to a VIP for all three days?", answer: "Yes. Book full-day standby and a single car and driver stay assigned to your guest across the summit — KAICC sessions, external meetings, and airport transfers, all under one arrangement." },
      { question: "How do we arrange this and confirm the cost?", answer: "Message us on WhatsApp with the guest, dates, and vehicle preference. We confirm availability and a fixed fare in advance — no surge pricing during the event." },
    ],
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
    intro: "The Future Minerals Forum gathers mining ministers, CEOs, and government delegations at the King Abdulaziz International Conference Centre in Riyadh each January. It's a ministerial-level event in winter — discreet executive cars, coordinated delegations, and precise airport timing are what the guest list expects.",
    city: "Riyadh",
    edition: { dates: "January (next edition January 2027)", venue: "King Abdulaziz International Conference Centre (KAICC), Riyadh", note: "Held annually each January in Riyadh." },
    airport: RUH,
    tldrAnswer: "For the Future Minerals Forum in Riyadh we provide executive airport transfers to the King Abdulaziz International Conference Centre, discreet chauffeurs for ministerial and CEO guests, and coordinated delegation transport — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "KAICC, Riyadh" },
      { label: "Edition", value: "Annually in January" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: [
      { title: "Delegation Airport Transfers", desc: "The forum draws government and mining delegations from around the world. We meet them at Riyadh Airport (RUH) with executive cars and name-sign greetings, then run them to the conference hotel or KAICC as a coordinated group." },
      { title: "Ministerial-Level Chauffeur", desc: "Immaculate S-Class and Escalade-class cars with discreet, bilingual chauffeurs experienced with high-protocol, security-conscious guests — appropriate for a ministerial and C-suite audience." },
      { title: "Convoy & Group Coordination", desc: "Matching vehicles for delegations that must travel together, managed under one contact with a lead driver keeping the convoy on a synchronised schedule between venues." },
      { title: "Full-Day Executive Standby", desc: "A dedicated car and driver for the length of the forum — KAICC sessions, bilateral meetings, and hotel returns — so senior guests never wait for a ride in the January cold." },
    ],
    faqs: [
      { question: "When and where is the Future Minerals Forum held?", answer: "It runs annually each January at the King Abdulaziz International Conference Centre (KAICC) in Riyadh. Message us for the confirmed dates of the next edition; we plan transfers from Riyadh Airport (RUH) and the main hotels to KAICC around the programme." },
      { question: "Can you handle a government or corporate delegation?", answer: "Yes. We coordinate matching executive vehicles for delegations under a single contact, with a lead driver keeping the group together and on schedule between KAICC, meetings, and hotels." },
      { question: "Are your chauffeurs suitable for ministerial guests?", answer: "Yes. We assign experienced, bilingual chauffeurs and immaculate executive cars, briefed for discreet, high-protocol service appropriate to a ministerial and CEO audience." },
      { question: "How is the fare agreed for a multi-day booking?", answer: "Send your dates, guest list size, and vehicle needs on WhatsApp. We confirm a fixed fare for the whole forum in advance — no surge pricing during the event week." },
    ],
    waContext: "Future Minerals Forum Riyadh event transportation",
  },
  {
    slug: "big-5-construct-saudi-transportation",
    kind: "event",
    badge: "Big 5 Construct Saudi · Riyadh",
    shortName: "Big 5 Construct Transport",
    h1: "Big 5 Construct Saudi — Riyadh Transportation",
    title: "Big 5 Construct Saudi Transportation | Exhibitor & Venue Transfers",
    description: "Private transport for Big 5 Construct Saudi in Riyadh — transfers to the Riyadh Front Exhibition & Conference Center (near KKIA), exhibitor vans, group cars, and daily standby for delegates. Fare on WhatsApp.",
    intro: "Big 5 Construct Saudi is the Kingdom's largest construction trade show, with 1,000+ exhibitors from over 50 countries at the Riyadh Front Exhibition & Conference Center — right beside King Khalid Airport. It's an exhibitor-heavy show, so vehicles that carry stand teams and materials, plus reliable daily standby, matter most.",
    city: "Riyadh",
    edition: { dates: "30 August – 2 September 2026", venue: "Riyadh Front Exhibition & Conference Center (ROSHN Front), Riyadh", note: "Held annually in Riyadh." },
    airport: RUH,
    tldrAnswer: "For Big 5 Construct Saudi we provide short airport transfers to the Riyadh Front Exhibition & Conference Center (next to King Khalid Airport), exhibitor vans for stand teams and materials, group vehicles, and daily standby — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "Riyadh Front (ROSHN Front)" },
      { label: "Edition", value: "30 Aug – 2 Sep 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: [
      { title: "Short Airport → Riyadh Front Transfers", desc: "Riyadh Front sits right beside King Khalid Airport (RUH), so arriving exhibitors and visitors reach the halls in minutes. We meet you at arrivals and take you straight there — handy when you're carrying stand kit off the plane." },
      { title: "Exhibitor Vans for Teams & Materials", desc: "A construction show means bulky samples and stand materials. Ask for a van or SUV with room for boxes and cases, plus early build-up and late breakdown runs so your crew and kit reach the halls on time." },
      { title: "Buyer & Delegation Group Transport", desc: "Vans and coasters for visiting contractors, buyer groups, and company delegations, coordinated under one contact from the hotel to Riyadh Front and back across the four show days." },
      { title: "Daily Standby & Site Visits", desc: "A car on daily standby for exhibitors who need to leave for client meetings or project-site visits around Riyadh and return — no waiting for an app car at a busy exhibition centre." },
    ],
    faqs: [
      { question: "How far is the Big 5 Construct venue from the airport?", answer: "Very close — the Riyadh Front Exhibition & Conference Center is right next to King Khalid International Airport (RUH), so the transfer is a short one. We meet you at arrivals and take you straight to the halls, which helps when you're carrying exhibition materials." },
      { question: "Can you carry stand materials and heavy samples?", answer: "Yes. Ask for a van or large SUV and we allow space for sample cases, stand parts, and boxes. We also run early build-up mornings and late breakdown nights so your team can set up and pack down on schedule." },
      { question: "Do you transport visiting buyer groups and delegations?", answer: "Yes. Send your group size and hotel on WhatsApp and we assign vans or a coaster under one contact, running daily between your hotel and Riyadh Front, timed around the show and any co-located events." },
      { question: "Can a car stay available for off-site meetings?", answer: "Yes. Book daily standby and a car stays on call so exhibitors can head to a client meeting or a project site elsewhere in Riyadh and come back, all at a fixed fare agreed in advance." },
    ],
    waContext: "Big 5 Construct Saudi Riyadh event transportation",
  },
  {
    slug: "cphi-middle-east-transportation",
    kind: "event",
    badge: "CPHI Middle East · Riyadh",
    shortName: "CPHI Middle East Transport",
    h1: "CPHI Middle East — Riyadh Transportation",
    title: "CPHI Middle East Transportation Riyadh | Pharma Delegate Transfers",
    description: "Private transport for CPHI Middle East in Riyadh — airport transfers to the Riyadh Exhibition & Convention Centre (Malham), executive chauffeurs, and group cars for pharma delegates and exhibitors. Fare on WhatsApp.",
    intro: "CPHI Middle East brings the region's pharmaceutical manufacturers, suppliers, and buyers to the Riyadh Exhibition & Convention Centre in Malham. It's a meeting-driven B2B show with a large international contingent — so airport meet & greet, exhibitor vehicles, and standby for supplier meetings are the priorities.",
    city: "Riyadh",
    edition: { dates: "14 – 16 December 2026", venue: "Riyadh Exhibition & Convention Centre, Malham", note: "Held annually in Riyadh. Confirm current dates on WhatsApp." },
    airport: RUH,
    tldrAnswer: "For CPHI Middle East in Riyadh we provide airport meet & greet to the Riyadh Exhibition & Convention Centre in Malham, executive chauffeurs, exhibitor vehicles, and standby for supplier meetings across the show — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "RECC, Malham" },
      { label: "Edition", value: "14 – 16 Dec 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: [
      { title: "International Arrivals Meet & Greet", desc: "CPHI draws pharma delegates from across the region and beyond. We track flights and meet them at Riyadh Airport (RUH) arrivals, then drive to the hotel or the Exhibition & Convention Centre in Malham — smooth for first-time visitors to Riyadh." },
      { title: "Standby for Supplier Meetings", desc: "CPHI runs on back-to-back supplier and buyer meetings. A car on daily standby moves you between the halls, hotel meeting rooms, and business dinners without a fresh booking each time — ideal for a deal-making agenda." },
      { title: "Exhibitor & Delegation Vehicles", desc: "SUVs and vans for exhibitor teams and company delegations, with room for sample cases and marketing materials, coordinated under one contact across the show days." },
      { title: "Executive Chauffeur", desc: "S-Class and Escalade-class cars with bilingual chauffeurs for senior pharma executives and partners, presented and driven to an executive standard." },
    ],
    faqs: [
      { question: "Where is CPHI Middle East held and how far is it?", answer: "At the Riyadh Exhibition & Convention Centre in Malham, north-west of Riyadh — roughly 30–45 minutes from the airport and central hotels. Because it's outside the city, a pre-booked car is more reliable than hailing one at the venue. Message us to confirm the current edition dates." },
      { question: "Can a car stay with me for supplier meetings?", answer: "Yes. Book hourly or daily standby and a car stays on call, so you move between the halls, hotel meeting rooms, and business dinners across the day without rebooking — well suited to CPHI's meeting-heavy format." },
      { question: "Do you meet international delegates at the airport?", answer: "Yes. We track your flight and meet you at Riyadh Airport (RUH) arrivals with a name sign, 24/7, then take you straight to your hotel or the venue — no taxi queue after a long flight." },
      { question: "How do you set the fare during the event?", answer: "Send your dates, pickup points, and vehicle type on WhatsApp and we confirm a fixed fare before you book — no surge pricing even on busy show days." },
    ],
    waContext: "CPHI Middle East Riyadh event transportation",
  },
  {
    slug: "foodex-saudi-transportation",
    kind: "event",
    badge: "Foodex Saudi · Riyadh",
    shortName: "Foodex Saudi Transport",
    h1: "Foodex Saudi — Riyadh Transportation",
    title: "Foodex Saudi Transportation Riyadh | Exhibitor & Buyer Transfers",
    description: "Private transport for Foodex Saudi in Riyadh — transfers to The Arena Riyadh, exhibitor vans, buyer group cars, and daily standby for the food & beverage trade show. Fare on WhatsApp.",
    intro: "Foodex Saudi is the Kingdom's dedicated food & beverage trade exhibition, held at The Arena in Riyadh with exhibitors from over 50 countries. It's a B2B sourcing show — importers, distributors, and buyers moving between the halls, hotels, and meetings — so exhibitor vehicles and buyer-group transport are the focus.",
    city: "Riyadh",
    edition: { dates: "16 – 18 November 2026", venue: "The Arena, Riyadh", note: "Held annually in Riyadh." },
    airport: RUH,
    tldrAnswer: "For Foodex Saudi we provide airport transfers to The Arena in Riyadh, exhibitor vans for stand teams and samples, buyer-group vehicles, and daily standby for the food & beverage trade show — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "The Arena, Riyadh" },
      { label: "Edition", value: "16 – 18 Nov 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: [
      { title: "Airport → The Arena Transfers", desc: "Private pickups from Riyadh Airport (RUH) to The Arena, with flight tracking and meet & greet for arriving exhibitors and buyers travelling in for the food & beverage show." },
      { title: "Exhibitor Vans for Samples", desc: "A food trade show means product samples and stand materials. Ask for a van or SUV with room for cases and boxes, plus build-up and breakdown runs so your stand crew reaches The Arena on time." },
      { title: "Buyer & Distributor Group Transport", desc: "Vans and coasters for visiting buyer delegations, importers, and distributor teams, coordinated under one contact between the hotel and the venue across the show." },
      { title: "Daily Standby", desc: "A car on daily standby for exhibitors and buyers who need to leave for off-site meetings and return, at a fixed fare agreed in advance — no app-car scramble at the venue." },
    ],
    faqs: [
      { question: "Where is Foodex Saudi held?", answer: "At The Arena in Riyadh. We provide private transfers from Riyadh Airport (RUH) and the city hotels straight to the venue, timed around the show hours and any co-located events." },
      { question: "Can you carry product samples and stand materials?", answer: "Yes. Ask for a van or larger SUV and we allow space for sample cases, packaging, and stand parts, with early build-up and late breakdown runs so your team sets up and packs down on schedule." },
      { question: "Do you transport visiting buyer groups?", answer: "Yes. Send your group size and hotel on WhatsApp and we assign vans or a coaster under one contact, running daily between your hotel and The Arena for the length of the show." },
      { question: "How is the fare confirmed?", answer: "Send your dates, pickup points, and vehicle type and we confirm a fixed fare before you book — no surge and no hidden fees during the event." },
    ],
    waContext: "Foodex Saudi Riyadh event transportation",
  },
  {
    slug: "formula-e-jeddah-transportation",
    kind: "event",
    badge: "Formula E · Jeddah",
    shortName: "Formula E Jeddah Transport",
    h1: "Formula E Jeddah — Transportation",
    title: "Formula E Jeddah Transportation | Corniche Circuit Transfers",
    description: "Private transport for the Formula E Jeddah E-Prix — transfers from Jeddah Airport (JED) to the Corniche Circuit, hotel-to-circuit runs, VIP hospitality cars and night-race transfers. Fare on WhatsApp.",
    intro: "The Formula E Jeddah E-Prix runs as a night race on the Jeddah Corniche Circuit, on the Red Sea waterfront. Road closures around the circuit and evening race sessions make local knowledge and a pre-booked hotel-to-Corniche transfer far easier than hailing a ride on race night.",
    city: "Jeddah",
    edition: { dates: "18 – 19 December 2026 (provisional)", venue: "Jeddah Corniche Circuit, Jeddah", note: "Held annually in Jeddah. Confirm dates on WhatsApp." },
    airport: JED,
    tldrAnswer: "For Formula E in Jeddah we provide transfers from Jeddah Airport (JED) to the Corniche Circuit, hotel-to-circuit runs around race-day road closures, VIP hospitality cars, and pre-booked night-race returns — fare confirmed on WhatsApp.",
    tldrFacts: [
      { label: "Venue", value: "Jeddah Corniche Circuit" },
      { label: "Edition", value: "18 – 19 Dec 2026" },
      { label: "From", value: "Jeddah Airport (JED)" },
      { label: "Availability", value: "24/7" },
    ],
    services: [
      { title: "Airport → Corniche Transfers", desc: "Private pickups from Jeddah Airport (JED) straight to your Corniche or downtown hotel, with flight tracking and meet & greet for fans, teams, and hospitality guests flying in for the E-Prix." },
      { title: "Hotel → Circuit Around Road Closures", desc: "Race weekend brings road closures along the Corniche. Our drivers know the access routes and drop-off points, so your run from the hotel to the circuit avoids the worst of the congestion." },
      { title: "Night-Race Return, Pre-Booked", desc: "Formula E Jeddah is a night race and everyone leaves at once. A pre-booked car with an agreed pickup point means your return to the hotel is set in advance — no scramble for a ride when the session ends." },
      { title: "VIP & Hospitality Chauffeur", desc: "Executive S-Class and Escalade-class cars for hospitality guests, sponsors, and teams moving between the circuit, hotels, and Corniche restaurants over the weekend." },
    ],
    faqs: [
      { question: "Where is Formula E held in Jeddah?", answer: "On the Jeddah Corniche Circuit, on the Red Sea waterfront — the same street circuit used for major motorsport in Jeddah. We transfer you from Jeddah Airport (JED) and city hotels to the circuit, allowing for the race-weekend road closures." },
      { question: "How do I get back after a night race?", answer: "Book your return in advance. Because it's a night race and the crowd leaves together, a pre-arranged car at an agreed pickup point is far more reliable than hailing one — your driver is waiting at a fixed fare." },
      { question: "Can you handle road closures around the circuit?", answer: "Yes. Our Jeddah drivers know the access routes and permitted drop-off points near the Corniche Circuit during race weekend, so your hotel-to-circuit run avoids the heaviest congestion." },
      { question: "Do you offer VIP cars for hospitality guests?", answer: "Yes. We provide executive sedans and SUVs with bilingual chauffeurs for hospitality and sponsor guests, moving between the circuit, hotels, and Corniche dining across the weekend — booked at a fixed fare on WhatsApp." },
    ],
    waContext: "Formula E Jeddah event transportation",
  },
  {
    slug: "soundstorm-riyadh-transportation",
    kind: "event",
    badge: "Soundstorm · Riyadh",
    shortName: "Soundstorm Transport",
    h1: "Soundstorm Riyadh — Transportation",
    title: "Soundstorm Riyadh Transportation | Festival & VIP Transfers",
    description: "Private transport for MDLBEAST Soundstorm in Riyadh — airport transfers, hotel-to-Banban runs, pre-booked late-night returns, and VIP group cars for the festival. Fare on WhatsApp.",
    intro: "MDLBEAST Soundstorm is the region's biggest music festival, held at Banban on the northern edge of Riyadh — a remote desert site where getting back to the city at 2–3 AM is the real challenge. A pre-booked car with a fixed pickup point beats waiting in the late-night crowd for a surge-priced ride.",
    city: "Riyadh",
    edition: { dates: "3 – 4 December 2026", venue: "Banban, Riyadh", note: "Held annually in Riyadh. Confirm dates on WhatsApp." },
    airport: RUH,
    tldrAnswer: "For MDLBEAST Soundstorm we provide airport transfers, hotel-to-Banban runs, and pre-booked late-night returns from the remote festival site, plus VIP group cars — with a fixed fare confirmed on WhatsApp instead of a late-night surge.",
    tldrFacts: [
      { label: "Venue", value: "Banban, Riyadh" },
      { label: "Edition", value: "3 – 4 Dec 2026" },
      { label: "From", value: "Riyadh Airport (RUH)" },
      { label: "Availability", value: "24/7" },
    ],
    services: [
      { title: "Airport & Hotel Transfers", desc: "Private pickups from Riyadh Airport (RUH) and hotel transfers for groups flying in for Soundstorm, with flight tracking and meet & greet on arrival." },
      { title: "Hotel → Banban Runs", desc: "Banban sits on the northern edge of Riyadh, well outside the city. We run groups from their hotel out to the festival site with the right-sized vehicle, timed so you arrive without a long queue." },
      { title: "Pre-Booked Late-Night Return", desc: "The hardest part of Soundstorm is getting home at 2–3 AM with tens of thousands leaving at once. A pre-booked car at an agreed pickup point means your ride is waiting — a fixed fare instead of a late-night surge or a long wait." },
      { title: "VIP & Group Cars", desc: "SUVs and vans for groups of friends and VIP-table guests travelling together, plus executive cars for a premium arrival — all under one contact and one fixed fare." },
    ],
    faqs: [
      { question: "Where is Soundstorm held and why book transport ahead?", answer: "At Banban, on the northern edge of Riyadh — a remote desert site. Because tens of thousands arrive and leave together, and app-based rides get scarce and expensive late at night, a pre-booked car with a fixed pickup point is far more reliable." },
      { question: "Can you pick us up after the festival ends late at night?", answer: "Yes — that's exactly what we plan for. We operate 24/7, so your 2–3 AM return from Banban to your hotel is arranged in advance at an agreed pickup point and a fixed fare, not left to a late-night app search." },
      { question: "Can you take a whole group together?", answer: "Yes. Tell us your group size and hotel on WhatsApp and we assign an SUV, van, or coaster so friends travel together, out to Banban and back, under one booking and one fare." },
      { question: "Do you offer a premium option for VIP guests?", answer: "Yes. We provide executive cars with bilingual chauffeurs for VIP-table and premium guests who want a smoother arrival and a guaranteed ride home — booked at a fixed fare in advance." },
    ],
    waContext: "MDLBEAST Soundstorm Riyadh event transportation",
  },
];

// ─── HERO IMAGES ──────────────────────────────────────────────────────
// Three real, purpose-shot assets reused by intent. ALT describes the
// actual photo (honest), not the event, since one photo serves many pages.
const HERO_SRC = {
  vip: "/gallery/event-vip-arrival-riyadh.webp",
  group: "/gallery/event-group-exhibition-riyadh.webp",
  jeddah: "/gallery/formula-e-jeddah-corniche.webp",
} as const;
const HERO_ALT = {
  vip: "Chauffeur opening the door of a black Mercedes S-Class outside the Riyadh Exhibition & Conference Center at dusk",
  group: "Business delegation boarding a minibus and executive SUV outside the Riyadh International Convention & Exhibition Center",
  jeddah: "Executive SUV on the floodlit Jeddah Corniche circuit at night",
} as const;

const HERO_BY_SLUG: Record<string, keyof typeof HERO_SRC> = {
  // Exhibitor / group / delegation intent → coaster + SUV shot
  "leap-riyadh-transportation": "group",
  "black-hat-mea-transportation": "group",
  "big-5-construct-saudi-transportation": "group",
  "cphi-middle-east-transportation": "group",
  "foodex-saudi-transportation": "group",
  "riyadh-exhibition-transportation": "group",
  "corporate-event-transportation-saudi-arabia": "group",
  // VIP / executive / conference intent → S-Class arrival shot
  "money20-20-riyadh-transportation": "vip",
  "global-ai-summit-riyadh-transportation": "vip",
  "future-minerals-forum-transportation": "vip",
  "vip-event-chauffeur-riyadh": "vip",
  "riyadh-event-transportation": "vip",
  "riyadh-conference-transportation": "vip",
  "soundstorm-riyadh-transportation": "vip",
  // Jeddah / motorsport intent → Corniche night circuit shot
  "formula-e-jeddah-transportation": "jeddah",
  "jeddah-event-transportation": "jeddah",
};

for (const e of EVENTS) {
  const key = HERO_BY_SLUG[e.slug];
  if (key) {
    // Respect a per-event heroImage/heroAlt override; otherwise use the group default.
    e.heroImage = e.heroImage ?? HERO_SRC[key];
    e.heroAlt = e.heroAlt ?? HERO_ALT[key];
  }
}

/** Image used on the /events hub hero. */
export const EVENTS_HUB_HERO = { src: HERO_SRC.vip, alt: HERO_ALT.vip };

export const EVENT_SLUGS = EVENTS.map((e) => e.slug);
export const getEvent = (slug: string) => EVENTS.find((e) => e.slug === slug);
