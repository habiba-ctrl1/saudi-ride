import { routeFact } from "@/lib/data/cluster";

const DMM_DHAHRAN = routeFact("dammam-airport-to-dhahran")!;
const DMM_JUBAIL = routeFact("dammam-airport-to-jubail")!;
const DMM_BAHRAIN = routeFact("dammam-airport-to-bahrain")!;

// Static content for airport landing pages — single source of truth for
// app/(marketing)/airports/[slug]/page.tsx AND app/sitemap.ts (AIRPORTS).
export const AIRPORT_DETAILS: Record<string, { name: string, code: string, nameAr: string, h1Name?: string, image: string, tagline: string, description: string, terminals: { name: string, desc: string }[], tips: string[], priorityRoutes: string[], tldr?: string, tldrFacts?: { label: string, value: string }[], faqs?: { question: string, answer: string }[], relatedLinks?: { href: string, label: string }[] }> = {
  "king-abdulaziz-jeddah": {
    name: "King Abdulaziz International Airport",
    code: "JED",
    nameAr: "مطار الملك عبدالعزيز الدولي",
    h1Name: "Jeddah Airport (JED)",
    image: "/airports/jed-hero.webp",
    tagline: "The Main Gateway for Umrah & Hajj",
    description: "Pre-book a private transfer from King Abdulaziz International Airport (JED) to Makkah (~1 hour), Madinah, or your Jeddah hotel. Meet & greet at arrivals, no surge pricing, and 24/7 service — including late-night and early-morning pilgrim flights. Jeddah lies inside the Miqat boundary, so pilgrims arriving by air usually enter Ihram on the plane before landing.",
    tldr: "A taxi from Jeddah Airport (JED) to Makkah takes about 1 hour, with the fare confirmed on WhatsApp. Share your flight number when you book and your driver meets you at arrivals, 24/7 — including late-night flights — and we track your flight, so a delay simply moves the pickup.",
    tldrFacts: [
      { label: "JED → Makkah", value: "~1 hr · fare on WhatsApp" },
      { label: "JED → Madinah", value: "~4–5 hr" },
      { label: "Meet & greet", value: "Included" },
      { label: "Hours", value: "24/7" }
    ],
    // Updated 2026-11-16 (sources: Khaleej Times 17 Oct 2026, Gulf News 27 Sep 2026, Wego 1 Oct 2026;
    // see seo/venues.md). Terminal 4 opened in phases from 27 Sep 2026 and North Terminal flights are
    // being moved to it and to the Hajj and Umrah Terminals. Assignments still change — keep the
    // "confirm with your airline" wording and do not name per-airline terminals here.
    terminals: [
      { name: "Terminal 1", desc: "The main hub for international and domestic flights, including Saudia. Opened in 2019 and connected to the Haramain high-speed rail station. Confirm your terminal with your airline before you travel." },
      { name: "Terminal 4", desc: "The newest terminal (about 97,000 m², phased opening from 27 September 2026). Foreign airlines have been moving here from the North Terminal, and it has a dedicated group check-in area for Hajj and Umrah pilgrims." },
      { name: "North Terminal", desc: "Handled most foreign airlines. Reports say its flights move to Terminal 4 and the Hajj and Umrah Terminals from 17 October 2026, though some tickets may still show it — confirm with your airline." },
      { name: "Hajj and Umrah Terminal", desc: "A separate terminal for pilgrim flights, distinct from Terminal 4. Several airlines moved here from the North Terminal in autumn 2026." }
    ],
    tips: [
      "Share your flight number when you book so we check it before pickup and plan around any delay.",
      "Jeddah is inside the Miqat boundary — most Umrah pilgrims enter Ihram on the plane before landing. If you need to travel to the Al-Juhfah Miqat near Rabigh first, tell us when you book and we quote it as a separate trip.",
      "Meet & greet is included — we confirm the meeting point with you before you land.",
      "Confirm the terminal your airline shows (Terminal 1, Terminal 4, or the Hajj and Umrah Terminal) when booking, and message us if it changes before you fly, so we can confirm the meeting point with you. See our Jeddah airport terminals guide for the current layout."
    ],
    priorityRoutes: ["jeddah-airport-to-makkah", "jeddah-airport-to-madinah", "jeddah-airport-to-taif"],
    faqs: [
      { question: "How much is a taxi from Jeddah airport to Makkah?", answer: "The fare from King Abdulaziz International Airport (JED) to Makkah is confirmed on WhatsApp for a sedan, with larger SUVs and vans available — confirmed before you book, no surge, tolls included." },
      { question: "Is there a taxi at Jeddah airport at night?", answer: "Yes. We operate 24/7 at JED, including late-night and early-morning arrivals. Share your flight number when you book so your driver is waiting even on 2–4 AM landings." },
      { question: "Where do I meet my driver at Jeddah airport?", answer: "Your driver provides meet & greet at arrivals. Terminal assignments at Jeddah airport have been changing since Terminal 4 opened in September 2026, so confirm the terminal your airline shows when you book and tell us if it changes before you fly." },
      { question: "Is there a Miqat on the way from Jeddah Airport to Makkah?", answer: "No. Jeddah lies inside the Miqat boundary, so pilgrims arriving by air usually enter Ihram on the plane before landing. If you need to go to the Al-Juhfah Miqat near Rabigh first, tell us when booking and we quote that trip separately — see our Miqat guide for the details." },
      { question: "What happens if my flight is delayed?", answer: "Share your flight number when you book — we track your flight, so a delay simply moves the pickup to your actual landing time, and 15–30 minutes of waiting after landing is free." },
      { question: "Is there a taxi service at the Hajj and Umrah Terminal and Terminal 4?", answer: "Yes. We arrange meet & greet and a private car for arrivals, including flights using the Hajj and Umrah Terminal and Terminal 4. Pre-book and share your flight number and the terminal your airline shows so we can confirm the meeting point with you." }
    ],
    relatedLinks: [
      { href: "/routes/jeddah-airport-to-makkah", label: "Jeddah Airport to Makkah taxi" },
      // Added 2026-11-16: both guides were un-indexed in GSC and the airport page did not link to them.
      { href: "/guides/jeddah-airport-guide", label: "Jeddah Airport guide: terminals and arrivals" },
      { href: "/guides/jeddah-airport-to-makkah-guide", label: "How to get from Jeddah Airport to Makkah" },
      { href: "/locations/jeddah", label: "Private transfers across Jeddah" },
      { href: "/locations/jeddah/private-driver", label: "Private driver in Jeddah by the hour" },
      { href: "/locations/jeddah/obhur", label: "Obhur resort transfers (near the airport)" },
      { href: "/locations/jeddah/al-hamra", label: "Al Hamra Corniche hotel transfers" },
      { href: "/routes/jeddah-airport-to-madinah", label: "Jeddah Airport to Madinah transfer" },
      { href: "/routes/jeddah-airport-to-jeddah-city", label: "JED Airport to Jeddah City" },
      { href: "/routes/jeddah-airport-to-taif", label: "JED Airport to Taif" },
      { href: "/routes/jeddah-to-kaec", label: "Jeddah to KAEC (King Abdullah Economic City)" },
      { href: "/routes/jeddah-airport-to-fairmont-makkah", label: "JED to Fairmont Makkah Clock Tower" },
      { href: "/routes/jeddah-airport-to-swissotel-makkah", label: "JED to Swissotel Al Maqam Makkah" },
      { href: "/routes/jeddah-airport-to-pullman-zamzam-makkah", label: "JED to Pullman Zamzam Makkah" },
      { href: "/routes/jeddah-airport-to-conrad-makkah", label: "JED to Conrad Makkah" },
      { href: "/routes/jeddah-airport-to-hilton-suites-makkah", label: "JED to Hilton Suites Makkah" },
      { href: "/routes/jeddah-airport-to-movenpick-makkah", label: "JED to Movenpick Makkah" },
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — Premium SUV" },
      { href: "/fleet/hyundai-staria", label: "Hyundai Staria — VIP Van" },
      { href: "/fleet/toyota-camry", label: "Toyota Camry — Executive Sedan" },
    ]
  },
  "prince-mohammad-madinah": {
    name: "Prince Mohammad Bin Abdulaziz Airport",
    code: "MED",
    nameAr: "مطار الأمير محمد بن عبدالعزيز",
    h1Name: "Madinah Airport (MED)",
    image: "/airports/med-hero.webp",
    tagline: "Gateway to the Prophet's City",
    // Rewritten 2026-10-09: removed "award-winning terminal", the Hajj-pavilion claim and
    // the "name sign" procedure (not in seo/facts.md). Meet & greet (generic), flight
    // tracking and 15-30 min free waiting are owner-confirmed (facts.md).
    description: "Pre-book a private transfer or private car with chauffeur from Prince Mohammad Bin Abdulaziz Airport (MED) — Madinah (Medina) — to your hotel near Masjid an-Nabawi (~20 km, ~25 min), or a long-distance transfer to Makkah. This is a pre-booked private airport transfer in your own vehicle: meet & greet at arrivals, flight tracking, spacious family vans, and 24/7 service for pilgrims and families.",
    tldr: "A taxi or private car from Prince Mohammad Bin Abdulaziz Airport (MED) to central Madinah hotels takes about 25 minutes — get the current fare on WhatsApp. Every booking is a pre-booked private transfer in your own vehicle, with meet & greet at arrivals, 24/7. Share your flight number when you book and we track your flight.",
    tldrFacts: [
      { label: "MED → City", value: "~20 km · ~25 min" },
      { label: "MED → Makkah", value: "~450 km · ~4 hr 20 min" },
      { label: "Meet & greet", value: "At arrivals" },
      { label: "Hours", value: "24/7" }
    ],
    terminals: [
      { name: "Arrivals", desc: "Pre-booked drivers meet you at arrivals (meet & greet). Send your flight number when you book so we can track it and move the pickup if your flight is delayed." }
    ],
    tips: [
      "The airport is about 20–25 minutes from the Central Area (Markaziyah) hotels near Masjid an-Nabawi; prayer-time and Friday traffic near the mosque can add to that.",
      "Share your flight number when you book — we track your flight, meet & greet is provided at arrivals, and the first 15–30 minutes of waiting are free, even for delayed or late-night arrivals.",
      "For large families with luggage we can arrange a van (such as the Hyundai Staria) through our partner network; tell us your passengers and large bags.",
      "Near Masjid an-Nabawi vehicle access is restricted: the driver takes you to the nearest permitted drop-off point to your hotel, so give us the exact hotel name.",
      "Travelling onward to Makkah? Book a direct MED to Makkah transfer (~450 km) with prayer and rest stops on request."
    ],
    priorityRoutes: ["madinah-airport-to-makkah", "madinah-airport-to-city"],
    faqs: [
      { question: "How much is a taxi from Madinah airport to the city?", answer: "A private transfer from Prince Mohammad Bin Abdulaziz Airport (MED) to central Madinah hotels is about 20 km and a 25-minute drive. It is a pre-booked private transfer in your own vehicle with meet & greet at arrivals. We do not publish a fixed price list; the fare is confirmed on WhatsApp before you book, with no meter and no surge." },
      { question: "Do you offer a private car service from Madinah Airport (MED)?", answer: "Yes. Beyond a standard taxi, we offer a pre-booked private car service from Madinah Airport (MED) — an executive sedan, SUV or van through our partner network, with a professional driver and meet & greet at arrivals. Every booking is your own vehicle, quoted on WhatsApp before you travel." },
      { question: "Is there a taxi at Madinah airport at night?", answer: "Yes. Transfers run 24/7 at MED, including late-night and early-morning arrivals. Share your flight number when you book; we track your flight, so the pickup moves with a delay, and the first 15–30 minutes of waiting after landing are free." },
      { question: "Where do I meet my driver at Madinah airport?", answer: "Your driver meets you at arrivals and helps with your luggage to the vehicle. Driver details reach you on WhatsApp before you land; if anything about the meeting point changes we message you there." },
      { question: "Can I travel directly from Madinah airport to Makkah?", answer: "Yes. We offer a direct MED to Makkah transfer — about 450 km, roughly 4 hours 20 minutes of driving — with prayer and rest stops on request. It suits pilgrims connecting between the Holy Cities, and Makkah to MED is available for the flight home." },
      { question: "Do you have vehicles for large families with luggage?", answer: "Yes. Vans such as the Hyundai Staria, plus SUVs, are available through our partner network for families with extra luggage arriving at MED. Tell us the number of passengers and large bags and we confirm the right vehicle when we quote." },
      { question: "Can the driver take me to the door of my hotel near Masjid an-Nabawi?", answer: "The driver takes you to the nearest permitted drop-off point to your hotel. Vehicle access around Al-Masjid an-Nabawi and the Central Area (Markaziyah) is restricted and changes around prayer times, so please give us the exact hotel name and tell us about heavy bags or mobility needs." },
      { question: "Is a private transfer better than the airport bus or a regular taxi?", answer: "It depends on who is travelling. A private transfer suits families, elderly passengers, heavy luggage and late arrivals because it is one vehicle, hotel-bound, with your flight tracked. A solo traveller with light bags may prefer public transport or a regular taxi. We only offer pre-booked private transfers." }
    ],
    relatedLinks: [
      { href: "/routes/madinah-airport-to-city", label: "MED Airport to Madinah City" },
      { href: "/routes/madinah-airport-to-makkah", label: "MED Airport to Makkah direct" },
      { href: "/routes/madinah-airport-to-madinah-markaziyah", label: "MED to Markaziyah Hotels" },
      { href: "/services/madinah-ziyarat", label: "Madinah Ziyarat by private car" },
      { href: "/locations/madinah/private-driver", label: "Private driver in Madinah by the hour" },
      { href: "/fleet/toyota-camry", label: "Toyota Camry — executive sedan" },
      { href: "/fleet/hyundai-staria", label: "Hyundai Staria — VIP Van" },
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — Premium SUV" },
      { href: "/services/airport-transfers", label: "Private airport transfers across Saudi Arabia" },
      { href: "/locations/madinah", label: "Madinah private transport & chauffeur service" },
      { href: "/routes/jeddah-airport-to-madinah", label: "Jeddah Airport to Madinah taxi" },
      { href: "/routes/makkah-to-madinah", label: "Makkah to Madinah taxi" },
      { href: "/routes/madinah-to-alula", label: "Madinah to AlUla heritage transfer" },
    ]
  },
  "king-khalid-riyadh": {
    name: "King Khalid International Airport",
    code: "RUH",
    nameAr: "مطار الملك خالد الدولي",
    h1Name: "Riyadh Airport (RUH)",
    image: "/airports/ruh-hero.webp",
    tagline: "The Capital Hub",
    description: "Executive airport transfers from King Khalid International Airport (RUH) in Riyadh. Premium chauffeur services for business travelers heading to KAFD, Olaya, or Diplomatic Quarter.",
    tldr: "A taxi or private car service from King Khalid International Airport (RUH) to central Riyadh takes about 30–45 minutes, with the fare confirmed on WhatsApp. Share your flight number when you book and your driver meets you at arrivals, 24/7.",
    tldrFacts: [
      { label: "RUH → City", value: "~30–45 min · fare on WhatsApp" },
      { label: "RUH → KAFD Hotels", value: "~35 min · fare on WhatsApp" },
      { label: "Meet & greet", value: "Included" },
      { label: "Hours", value: "24/7" }
    ],
    terminals: [
      { name: "Arrivals", desc: "Pickups are arranged in advance. Share your flight number and terminal and we confirm the meeting point with you before you land." }
    ],
    tips: [
      "Riyadh airport is 35km north of the city center. Expect a 30-45 minute drive.",
      "Corporate invoicing is available for business travelers on request.",
      "Share your flight number when you book so we check it before pickup.",
      "Meet & greet is included — we confirm the meeting point with you before you land."
    ],
    priorityRoutes: ["riyadh-airport-to-city"],
    faqs: [
      { question: "How much is a taxi from Riyadh airport to the city center?", answer: "The fare from King Khalid International Airport (RUH) to central Riyadh is confirmed on WhatsApp before you book — no meter, no surge, no hidden fees." },
      { question: "How long does it take from Riyadh airport to KAFD?", answer: "The drive from RUH to KAFD is about 35–40 minutes (approximately 40 km), depending on traffic." },
      { question: "Is there a taxi or car service at King Khalid International Airport (RUH)?", answer: "Yes — we provide a private taxi and car service with meet & greet for arrivals at King Khalid International Airport (RUH). Share your flight number and terminal when booking and we confirm the meeting point with you before you land." },
      { question: "Do you offer a King Khalid International Airport car service for business travellers?", answer: "Yes. We run an executive car service from RUH for business travellers heading to KAFD, Olaya and the Diplomatic Quarter — executive sedans and SUVs, bilingual chauffeurs, and corporate invoicing on request." },
      { question: "Where do I meet my driver at Riyadh airport?", answer: "Your driver meets you at arrivals. Share your flight number and terminal when booking and we confirm the meeting point with you before you land." },
      { question: "What happens if my flight is delayed?", answer: "Share your flight number when you book and we check it before pickup, so the pickup time is planned around your actual arrival." },
      { question: "Do you provide invoices for business travelers?", answer: "Yes. Corporate invoices are available for business travelers on request — just let us know when you book." }
    ],
    relatedLinks: [
      { href: "/routes/riyadh-airport-to-city", label: "RUH Airport to Riyadh City" },
      { href: "/routes/riyadh-airport-to-kafd-hotels", label: "RUH to KAFD & Olaya Hotels" },
      { href: "/locations/riyadh/hotel-transfer", label: "Riyadh hotel transfer guide — Olaya, KAFD & DQ" },
      { href: "/locations/riyadh/private-driver", label: "Hire a private driver for your Riyadh day" },
      { href: "/routes/riyadh-to-dammam", label: "Riyadh to Dammam taxi" },
      { href: "/routes/riyadh-to-dubai", label: "Riyadh to Dubai — car with driver" },
      { href: "/riyadh-alternative-airports", label: "Other airports reachable by road from Riyadh — DMM, Bahrain, Doha, Dubai, Jeddah" },
      { href: "/fleet/mercedes-s-class", label: "Mercedes S-Class — executive sedan" },
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — Premium SUV" },
      { href: "/fleet/toyota-camry", label: "Toyota Camry — Executive Sedan" },
    ]
  },
  // DMM — reworked 2026-11-21 (seo/eastern-province-keyword-map.md). Distances
  // only via routeFact(); the old "DMM → Dammam 25–30 min", "Khobar 30–40 min",
  // "20 km northwest" and "passport details 24 hours in advance" lines had no
  // source / were not a confirmed policy and were removed.
  "king-fahd-dammam": {
    name: "King Fahd International Airport",
    code: "DMM",
    h1Name: "Dammam Airport (DMM)",
    nameAr: "مطار الملك فهد الدولي",
    image: "/airports/dammam-hero.webp",
    tagline: "The Eastern Gateway",
    description: `Pre-book a private car from King Fahd International Airport (DMM) to Dammam, Al Khobar, Dhahran (about ${DMM_DHAHRAN.km} km), Jubail (about ${DMM_JUBAIL.km} km), Qatif or Half Moon Bay — or straight across the causeway to Bahrain (about ${DMM_BAHRAIN.km} km). We track your flight and the fare is agreed before you land.`,
    tldr: `A pre-booked private car from Dammam airport (DMM) meets you at arrivals and drives you to Dammam, Al Khobar, Dhahran or Jubail. Dhahran is about ${DMM_DHAHRAN.km} km (${DMM_DHAHRAN.time}), Jubail about ${DMM_JUBAIL.km} km and Bahrain about ${DMM_BAHRAIN.km} km from the terminal. We track the flight, the first 15–30 minutes of waiting are free, and the fare is agreed before you land.`,
    tldrFacts: [
      { label: "DMM → Dhahran", value: `${DMM_DHAHRAN.km} km · ${DMM_DHAHRAN.time}` },
      { label: "DMM → Jubail", value: `${DMM_JUBAIL.km} km · ${DMM_JUBAIL.time}` },
      { label: "DMM → Bahrain", value: `${DMM_BAHRAIN.km} km · ${DMM_BAHRAIN.time}` },
      { label: "Meet & greet", value: "Included" },
    ],
    terminals: [
      { name: "Passenger terminal", desc: "Arrivals and departures. We confirm the meeting point with you before you land." }
    ],
    tips: [
      "The airport sits north-west of the Dammam–Khobar–Dhahran metro, so every transfer is a proper drive — plan departures from your flight time.",
      "Send your flight number when you book; we track the flight and move the pickup if it is delayed.",
      "For Bahrain, each passenger carries their own passport and entry documents; the vehicle's causeway fee is included in the fare.",
      "Heading to Jubail Industrial City or a Dhahran office? Send the site or building name so the drop-off point is planned in advance.",
      "Meet & greet is included — we confirm the meeting point with you before you land."
    ],
    priorityRoutes: ["dammam-airport-to-dhahran", "dammam-airport-to-jubail", "dammam-airport-to-bahrain", "dammam-to-doha", "dammam-to-manama"],
    faqs: [
      { question: "How do I get from Dammam airport to my hotel?", answer: "Pre-book a private car with your flight number. We track the flight, meet you at arrivals and drive you to your hotel in Dammam, Al Khobar or Dhahran. The fare is agreed before you land — no meter and no surge." },
      { question: "How far is Dammam airport from Dhahran and Jubail?", answer: `Dhahran is about ${DMM_DHAHRAN.km} km (${DMM_DHAHRAN.time}) and Jubail about ${DMM_JUBAIL.km} km (${DMM_JUBAIL.time}). Dammam and Al Khobar are further from the airport than Dhahran.` },
      { question: "Can I get a taxi from DMM airport to Bahrain?", answer: `Yes — about ${DMM_BAHRAIN.km} km straight from the terminal over the King Fahd Causeway. The vehicle's crossing fee is included; each passenger carries their own valid documents and completes the border checks in person.` },
      { question: "Can I go from DMM straight to Doha?", answer: "Yes, by road through the Salwa border. The vehicle's border fees are included in the quoted fare; visas and entry are each passenger's own." },
      { question: "Where do I meet my driver at Dammam airport?", answer: "Your driver meets you at arrivals. Meet & greet is included with every booking, and we confirm the meeting point with you before you land." },
      { question: "What happens if my flight is delayed?", answer: "We track your flight, so the pickup moves with your actual arrival. The first 15–30 minutes of waiting after you land are free." },
      { question: "Can a company book airport transfers for visiting staff?", answer: "Yes. Email the names, flights and destinations for a written quote. Corporate invoicing can be arranged through our sister company." },
      { question: "Which car should I book from DMM?", answer: "A sedan for one to three people with normal bags; a GMC Yukon XL or a van for families and teams with luggage; a Hiace or Coaster for groups. The car is confirmed for your flight date when we quote." }
    ],
    relatedLinks: [
      { href: "/locations/dammam", label: "Private transport across Dammam, Khobar and Dhahran" },
      { href: "/routes/dammam-airport-to-dhahran", label: "DMM Airport to Dhahran" },
      { href: "/routes/dammam-airport-to-jubail", label: "DMM Airport to Jubail" },
      { href: "/locations/alkhobar", label: "Al Khobar hotels and the Corniche" },
      { href: "/locations/dammam/private-driver", label: "Keep a driver for the day after you land" },
      { href: "/routes/dammam-airport-to-doha", label: "DMM straight to Doha, Qatar" },
      { href: "/routes/dammam-to-doha", label: "Dammam city to Doha" },
      { href: "/routes/dammam-to-manama", label: "DMM to Manama, Bahrain" },
      { href: "/routes/dammam-airport-to-bahrain", label: "Dammam Airport to Bahrain — direct private transfer" },
      { href: "/routes/bahrain-to-dammam-airport", label: "Bahrain to Dammam Airport for your flight" },
      { href: "/routes/dammam-to-jeddah", label: "Long-distance: Dammam to Jeddah with a private driver" },
      { href: "/cross-border/saudi-to-bahrain", label: "All Saudi–Bahrain causeway transfers" },
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — spacious SUV" },
      { href: "/fleet/toyota-camry", label: "Toyota Camry — Executive Sedan" },
    ]
  },
  "taif-regional": {
    name: "Taif Regional Airport",
    code: "TIF",
    nameAr: "مطار الطائف الإقليمي",
    image: "/airports/taif-airport-hero.webp",
    tagline: "The Summer Capital Airport",
    description: "Taxi transfers from Taif Regional Airport to Taif city, Makkah, and Jeddah. Ideal for locals and tourists enjoying the pleasant mountain climate of Taif.",
    terminals: [
      { name: "Main Terminal", desc: "Single terminal building for all flights." }
    ],
    tips: [
      "Many pilgrims land in Taif to put on Ihram at Miqat Qarn al-Manazil (Al-Sail Al-Kabeer).",
      "The drive from Taif Airport to Makkah takes approximately 1.5 to 2 hours."
    ],
    priorityRoutes: ["taif-to-makkah"],
    faqs: [
      { question: "How much is a taxi from Taif airport to Makkah?", answer: "The drive from Taif Regional Airport (TIF) to Makkah takes approximately 1.5 to 2 hours. The fare is and confirmed before you book." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Many pilgrims land in Taif to enter Ihram at Miqat Qarn al-Manazil (Al-Sail Al-Kabeer). Just tell us in advance and the driver will stop there." },
      { question: "What happens if my flight is delayed?", answer: "Share your flight number when you book and we check it before pickup, so the pickup time is planned around your actual arrival." }
    ],
    relatedLinks: [
      { href: "/routes/makkah-to-taif", label: "Makkah to Taif taxi" },
      { href: "/routes/jeddah-to-taif", label: "Jeddah to Taif taxi" },
      { href: "/fleet/toyota-camry", label: "Toyota Camry — Executive Sedan" },
    ]
  },
  "tabuk-regional": {
    name: "Tabuk Regional Airport",
    code: "TUU",
    nameAr: "مطار تبوك الإقليمي",
    image: "/airports/tabuk-airport.webp",
    tagline: "Gateway to the North",
    description: "Book a taxi from Tabuk Regional Airport for seamless transfers to NEOM, Amaala, and surrounding northern destinations. Comfortable SUVs available.",
    terminals: [
      { name: "Main Terminal", desc: "Single terminal serving domestic and limited regional flights." }
    ],
    tips: [
      "The drive to NEOM basecamps is roughly 2.5 hours. Pre-booking an SUV is highly recommended.",
      "Bottled water and Wi-Fi are provided on all long-distance transfers."
    ],
    priorityRoutes: ["tabuk-airport-to-neom"],
    faqs: [
      { question: "How long is the drive from Tabuk airport to NEOM?", answer: "The drive from Tabuk Regional Airport (TUU) to NEOM is roughly 2.5 hours (about 120 km). Pre-booking an SUV is recommended for comfort on this route." },
      { question: "Where do I meet my driver at Tabuk airport?", answer: "Your driver meets you at arrivals. Share your flight number when you book and we confirm the meeting point with you before you land." },
      { question: "What happens if my flight is delayed?", answer: "Share your flight number when you book and we check it before pickup, so the pickup time is planned around your actual arrival." }
    ],
    relatedLinks: [
      { href: "/routes/tabuk-airport-to-neom", label: "Tabuk Airport to NEOM" },
      { href: "/routes/tabuk-to-aqaba", label: "Tabuk to Aqaba, Jordan" },
      { href: "/routes/tabuk-to-red-sea-airport", label: "Tabuk to Red Sea International Airport" },
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — SUV for long routes" },
    ]
  },
  "alula": {
    name: "AlUla International Airport",
    code: "ULH",
    nameAr: "مطار العلا الدولي",
    image: "/locations/alula/alula-airport-terminal-aerial.webp",
    tagline: "Arrival at the Ancient Oasis",
    description: "Private airport transfers from AlUla International Airport (ULH) to your desert resort, hotel or onward sights such as Hegra. Pre-booked, fare agreed before you travel; we track your flight.",
    terminals: [
      { name: "Main Terminal", desc: "Boutique airport terminal serving the heritage site." }
    ],
    tips: [
      "Ensure you book your transfer in advance as on-demand taxis are extremely limited at ULH.",
      "Executive sedans, full-size SUVs and vans are available through our partner network — share your passenger and luggage count and we choose the right one."
    ],
    priorityRoutes: ["alula-airport-to-resorts", "madinah-to-alula"],
    faqs: [
      { question: "Are taxis available at AlUla airport?", answer: "On-demand taxis are extremely limited at AlUla Airport (ULH). Pre-booking your transfer in advance is strongly recommended." },
      { question: "How far is AlUla airport from the resorts?", answer: "About 30 km to the main resort area, roughly 30 minutes. Hegra is a further drive out of AlUla town; the driver confirms timing for your plan." },
      { question: "What vehicles are available at AlUla?", answer: "Executive sedans, full-size SUVs and vans through our partner network. Tell us your passengers and luggage and the vehicle is confirmed with the fare before you book." },
      { question: "Do you track my flight into ULH?", answer: "Yes. Share your flight number and a delay moves your pickup; 15–30 minutes of waiting after landing is free." },
      { question: "Is meet & greet included at AlUla airport?", answer: "Yes. Meet & greet is provided at arrivals, and driver details are sent on WhatsApp before pickup." }
    ],
    relatedLinks: [
      { href: "/routes/alula-airport-to-resorts", label: "AlUla Airport to desert resorts" },
      { href: "/routes/madinah-to-alula", label: "Madinah to AlUla transfer" },
      { href: "/locations/alula", label: "All AlUla private transport" },
      { href: "/locations/alula/private-driver", label: "Private driver for an AlUla day" },
      { href: "/locations/alula/hegra", label: "Transport to Hegra" },
      { href: "/routes/alula-to-red-sea-airport", label: "AlUla to Red Sea Airport (RSI)" },
    ]
  },
  "red-sea": {
    name: "Red Sea International Airport",
    code: "RSI",
    nameAr: "مطار البحر الأحمر الدولي",
    // 2026-10-08: the live page is rendered by components/location/cluster/RedSeaHub.tsx
    // from lib/data/red-sea-cluster.ts; the NEOM hero was removed (wrong destination).
    // This entry still feeds the sitemap and the generic fallbacks.
    image: "/red-sea/rsi-og.png",
    tagline: "Private transfers to Shura Island, Turtle Bay & the Red Sea resorts",
    description: "Book a private transfer from Red Sea International Airport (RSI) to Shura Island, Turtle Bay, Nujuma, Shebara, AMAALA or your Red Sea resort. Sedan and SUV options, meet & greet at arrivals, fare confirmed on WhatsApp.",
    tldr: "A private transfer from Red Sea International Airport (RSI) to AMAALA is about 35 km (~30 min), and to NEOM about 300 km (~3.5 hr) — both with the fare confirmed on WhatsApp. These are VIP transfers with an executive vehicle and English-speaking chauffeur — pre-booking is strongly recommended as on-demand taxis are extremely limited this far from any city.",
    tldrFacts: [
      { label: "RSI → AMAALA", value: "~30 min · fare on WhatsApp" },
      { label: "RSI → NEOM", value: "~3.5 hr · fare on WhatsApp" },
      { label: "Vehicle", value: "Executive SUV/Sedan" },
      { label: "Booking", value: "Pre-book required" }
    ],
    terminals: [
      { name: "Main Terminal", desc: "Boutique terminal built for Red Sea Global's resort guests, serving domestic flights plus select international routes to the Red Sea coast." }
    ],
    tips: [
      "This is a remote-resort airport — there are no on-demand taxis waiting outside, so pre-book your transfer before you fly.",
      "Executive sedans and full-size SUVs are available through our partner network, suited to AMAALA and Red Sea Global resort guests — tell us your passengers and luggage and we confirm the vehicle with the fare.",
      "Share your resort name (e.g. AMAALA, St. Regis Red Sea Resort, Six Senses Southern Dunes, Shebara) when booking so your driver knows the exact drop-off point.",
      "Meet & greet is included — share your flight number when you book so we check it before pickup."
    ],
    priorityRoutes: ["red-sea-airport-to-amaala", "red-sea-airport-to-neom", "red-sea-airport-to-alula"],
    faqs: [
      { question: "How do I get from Red Sea International Airport to AMAALA?", answer: "A private VIP transfer from Red Sea International Airport (RSI) to AMAALA is about 35 km, roughly a 30-minute drive, in an executive vehicle — the fare is confirmed on WhatsApp before booking." },
      { question: "Is there a taxi rank at Red Sea International Airport?", answer: "No — this is a boutique airport built for the Red Sea Global resorts, with no walk-up taxi rank. Pre-booking your transfer in advance is strongly recommended." },
      { question: "Can I get a transfer from Red Sea International Airport to NEOM?", answer: "Yes. It's approximately 300 km, about a 3.5-hour drive, in an executive vehicle with the fare confirmed on WhatsApp — ideal for investors, contractors, and visitors connecting between the two giga-projects." },
      { question: "What kind of vehicles are available at RSI?", answer: "Executive sedans and full-size SUVs through our partner network, suited to AMAALA and the Red Sea resorts, with English- and Arabic-speaking drivers. The vehicle is confirmed with the fare before you book." },
      { question: "Can I travel from Red Sea International Airport to AlUla?", answer: "Yes. AlUla is a separate destination about 260 km away by road (roughly 4 hours 25 minutes). We arrange a private inter-destination transfer from RSI or your Red Sea resort to your AlUla hotel, with the fare agreed before booking." },
      { question: "Which resorts do you serve from Red Sea International Airport?", answer: "We provide private land transfers to AMAALA, Shura Island, Turtle Bay and the Red Sea Global resorts, including Six Senses Southern Dunes and Desert Rock. Island resorts such as Shebara, Nujuma and St. Regis Red Sea need a boat or seaplane after the land leg, which is arranged separately — tell us your resort name when booking." }
    ]
  },
  "abha-regional": {
    name: "Abha International Airport",
    code: "AHB",
    nameAr: "مطار أبها الدولي",
    image: "/airports/abha-airport.webp",
    tagline: "The Aseer Mountains Hub",
    description: "Taxi transfers from Abha Airport to the city center, Soudah Peak, and surrounding Aseer region. Comfortable rides through the mountain roads.",
    terminals: [
      { name: "Main Terminal", desc: "Serves domestic and regional flights across the GCC." }
    ],
    tips: [
      "The roads into the Aseer highlands are steep and winding — tell us your group size and luggage so the right vehicle is quoted.",
      "The airport is about 20 km from the centre of Abha (road distance measured with OSRM, 2026-10-27)."
    ],
    priorityRoutes: ["abha-airport-to-soudah"],
    faqs: [
      { question: "How far is Abha airport from the city center?", answer: "Abha International Airport (AHB) is about 20 km from the centre of Abha by road, roughly a 20–25 minute drive depending on traffic." },
      { question: "Can I get a taxi from Abha airport to Soudah?", answer: "Yes. We provide transfers from AHB to Soudah Peak and the surrounding Aseer mountain attractions. The drive takes about 50 minutes." },
      { question: "What happens if my flight is delayed?", answer: "Share your flight number when you book and we check it before pickup, so the pickup time is planned around your actual arrival." }
    ],
    relatedLinks: [
      { href: "/routes/abha-airport-to-soudah", label: "Abha Airport to Soudah Peak" },
      { href: "/routes/jeddah-to-abha", label: "Jeddah to Abha transfer" },
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — SUV for mountain roads" },
      { href: "/routes/abha-to-jizan", label: "Abha to Jizan private transfer" },
      { href: "/routes/abha-to-jeddah", label: "Abha to Jeddah private transfer by road" },
      { href: "/routes/najran-to-abha", label: "Najran to Abha private transfer" },
      { href: "/locations/jizan", label: "Private transfers in Jizan" },
    ]
  },
  // Added 2026-10-27. Jizan coverage confirmed by the owner. Airport name per
  // Saudipedia/GACA wording (sources vary: "Jizan Regional Airport" on
  // Wikipedia) — re-confirm before adding Arabic pages. Distances are OSRM road
  // distances measured 2026-10-27. Hero is the shared generic airport
  // illustration; replace with a real GIZ photo when one exists.
  "jizan-regional": {
    name: "King Abdullah bin Abdulaziz Airport",
    code: "GIZ",
    nameAr: "مطار الملك عبدالله بن عبدالعزيز (جازان)",
    h1Name: "Jizan Airport (GIZ)",
    image: "/airports/med-hero.webp",
    tagline: "Gateway to Jizan and the Red Sea South",
    description: "Pre-book a private transfer from Jizan Airport (GIZ) to your hotel in Jizan city, or onward up to Abha and the Asir highlands. Meet & greet at arrivals, a driver who tracks your flight, and one fixed fare agreed before you fly. GIZ is Jizan's airport — not Jeddah's JED, which is about 700 km away.",
    tldr: "A taxi from Jizan Airport (GIZ) to central Jizan is about 5 km, a short drive. For Abha it is about 200 km by road, roughly 2.5 hours. The fare is fixed and confirmed on WhatsApp before you book, with meet & greet at arrivals, and we track your flight, so a delay simply moves the pickup.",
    tldrFacts: [
      { label: "GIZ → Jizan city", value: "~5 km · short drive" },
      { label: "GIZ → Abha", value: "~200 km · ~2.5 hr" },
      { label: "Meet & greet", value: "Included" },
      { label: "Hours", value: "24/7" }
    ],
    terminals: [
      { name: "Arrivals", desc: "Share your flight number when you book and we confirm exactly where your driver meets you." }
    ],
    tips: [
      "GIZ is Jizan's airport. Do not confuse it with JED (Jeddah), which is a very long drive away — check the code on your ticket.",
      "Going on to Abha? The road climbs the mountain escarpment, so tell us your group size and luggage and we quote the right vehicle.",
      "Share your flight number when you book: we track your flight, and 15–30 minutes of free waiting after landing is included.",
      "Jizan is hot, especially in summer. A pre-booked car means you are not waiting outside for a ride."
    ],
    priorityRoutes: ["abha-to-jizan"],
    faqs: [
      { question: "How far is Jizan airport from the city?", answer: "Jizan Airport (GIZ) is about 5 km from central Jizan by road — a short drive. The fare is fixed and confirmed on WhatsApp before you book." },
      { question: "Is GIZ the same as Jeddah airport?", answer: "No. GIZ is Jizan's airport in the south-west. Jeddah's airport is JED, roughly 700 km away. Check the three-letter code on your booking and tell us which one you are flying into." },
      { question: "Can I get a transfer from Jizan airport to Abha?", answer: "Yes. It is about 200 km by road, roughly 2.5 hours, climbing from the coast into the Asir highlands. We confirm one fixed fare and recommend an SUV for families with luggage." },
      { question: "What happens if my flight to Jizan is delayed?", answer: "Share your flight number when you book. We track your flight, so a delay moves the pickup to your actual landing time, and 15–30 minutes of waiting after landing is free." },
      { question: "Is a Jizan airport transfer available at night?", answer: "Yes. Transfers can be booked 24/7, including late-night and early-morning arrivals. Include your flight number so your driver is planned around your landing." }
    ],
    relatedLinks: [
      { href: "/routes/abha-to-jizan", label: "Abha to Jizan private transfer" },
      { href: "/routes/jazan-to-jeddah", label: "Jazan to Jeddah airport (JED) by road" },
      { href: "/locations/jizan", label: "Private driver and transfers in Jizan" },
      { href: "/airports/abha-regional", label: "Abha airport (AHB) pickups" },
      { href: "/fleet", label: "Vehicle categories" },
    ]
  },
  // Added 2026-10-31 (Qassim airport page). Official name: Prince Naif bin
  // Abdulaziz International Airport, IATA ELQ / ICAO OEGS, serves Buraydah and
  // Al Qassim. Road figure Riyadh centre -> ELQ is OSRM 2026-10-31 (~375 km,
  // ~3 h 36 min; varies by pickup point). Hero = shared generic airport
  // illustration; replace with a real ELQ/Qassim photo when one exists.
  "prince-naif-qassim": {
    name: "Prince Naif bin Abdulaziz International Airport",
    code: "ELQ",
    nameAr: "مطار الأمير نايف بن عبدالعزيز الدولي (القصيم)",
    h1Name: "Al Qassim Airport (ELQ)",
    image: "/airports/med-hero.webp",
    tagline: "Private transfers to and from Buraydah and Al Qassim",
    description: "Arrange a private transfer between Prince Naif bin Abdulaziz International Airport (ELQ) in Al Qassim and Riyadh, Buraydah or Unaizah. Request a sedan, SUV or GMC full-size SUV, share your flight number, and we confirm availability and one fare before you travel. Pickups are arranged in advance through our partner network.",
    tldr: "Al Qassim Airport, officially Prince Naif bin Abdulaziz International Airport, uses the code ELQ and serves Buraydah and the wider Al Qassim Province. Riyadh to ELQ is roughly 375 km by road, around 3.5 hours depending on pickup point and traffic. Private transfers are arranged in advance on WhatsApp, with the fare confirmed before you book.",
    tldrFacts: [
      { label: "Airport code", value: "ELQ (ICAO OEGS)" },
      { label: "Riyadh → ELQ", value: "~375 km · ~3.5 hr" },
      { label: "Booking", value: "Arranged in advance" },
      { label: "Fare", value: "Agreed before booking" }
    ],
    terminals: [
      { name: "Arrivals", desc: "Pickups are arranged in advance. Share your flight number and we confirm the meeting point with you before you travel." }
    ],
    tips: [
      "The airport's code is ELQ. Search sites sometimes list it as Gassim, Qassim or Buraidah airport — they are the same airport.",
      "Pickups are not automatic: book in advance and send your flight number so the driver is planned around your landing. We track your flight.",
      "Travelling from Riyadh? It is a road journey of roughly 375 km, so tell us your pickup district, passengers and luggage to get the right vehicle.",
      "Heading to Unaizah or another Qassim town rather than Buraydah? Say so when you book so the quote reflects the actual drop-off."
    ],
    priorityRoutes: ["riyadh-to-al-qassim-airport", "riyadh-to-buraydah"],
    faqs: [
      { question: "What is the official name of Al Qassim Airport?", answer: "It is Prince Naif bin Abdulaziz International Airport. Its IATA code is ELQ and its ICAO code is OEGS. It serves Buraydah and Al Qassim Province." },
      { question: "Can I book a private transfer from Riyadh to ELQ?", answer: "Yes. Send your pickup address, date, passengers and luggage on WhatsApp and we check partner availability and confirm one fare before you book." },
      { question: "Can I get a private transfer from ELQ to Riyadh or Buraydah?", answer: "Yes, if you arrange it in advance. Share your flight number and destination; pickup details are confirmed with you before travel rather than assumed." },
      { question: "Is this a shared taxi?", answer: "No. The vehicle is arranged for your own party, not shared with other passengers." }
    ],
    relatedLinks: [
      { href: "/routes/riyadh-to-al-qassim-airport", label: "Riyadh to Al Qassim Airport private transfer" },
      { href: "/routes/riyadh-to-buraydah", label: "Riyadh to Buraydah taxi" },
      { href: "/airports/king-khalid-riyadh", label: "Riyadh airport (RUH) transfers" },
      { href: "/fleet", label: "Vehicle categories" },
    ]
  }
};
