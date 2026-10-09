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
    description: "Pre-book a private transfer from King Abdulaziz International Airport (JED) to Makkah (~1 hour), Madinah, or your Jeddah hotel. Meet & greet at arrivals with a name sign, no surge pricing, and 24/7 service — including late-night and early-morning pilgrim flights. Jeddah lies inside the Miqat boundary, so pilgrims arriving by air usually enter Ihram on the plane before landing.",
    tldr: "A taxi from Jeddah Airport (JED) to Makkah takes about 1 hour, with the fare confirmed on WhatsApp. Share your flight number when you book and your driver meets you at arrivals with a name sign, 24/7 — including late-night flights — and we track your flight, so a delay simply moves the pickup.",
    tldrFacts: [
      { label: "JED → Makkah", value: "~1 hr · fare on WhatsApp" },
      { label: "JED → Madinah", value: "~4–5 hr" },
      { label: "Meet & greet", value: "Included" },
      { label: "Hours", value: "24/7" }
    ],
    terminals: [
      { name: "Terminal 1", desc: "The main modern terminal — Saudia plus most international and domestic flights. Largest arrivals hall; pre-booked drivers meet you here." },
      { name: "North Terminal", desc: "Older terminal used by some international carriers (e.g. flynas and others). Confirm your terminal from your boarding pass." },
      { name: "Hajj Terminal", desc: "Dedicated terminal for Hajj and Umrah charter flights during the pilgrimage seasons." }
    ],
    tips: [
      "Share your flight number when you book so we check it before pickup and plan around any delay.",
      "Jeddah is inside the Miqat boundary — most Umrah pilgrims enter Ihram on the plane before landing. If you need to travel to the Al-Juhfah Miqat near Rabigh first, tell us when you book and we quote it as a separate trip.",
      "Meet & greet is included — your driver waits in the arrivals hall holding a sign with your name.",
      "Confirm your terminal (Terminal 1, North, or Hajj) when booking so your driver meets you at the right arrivals exit."
    ],
    priorityRoutes: ["jeddah-airport-to-makkah", "jeddah-airport-to-madinah", "jeddah-airport-to-taif"],
    faqs: [
      { question: "How much is a taxi from Jeddah airport to Makkah?", answer: "The fare from King Abdulaziz International Airport (JED) to Makkah is confirmed on WhatsApp for a sedan, with larger SUVs and vans available — confirmed before you book, no surge, tolls included." },
      { question: "Is there a taxi at Jeddah airport at night?", answer: "Yes. We operate 24/7 at JED, including late-night and early-morning arrivals. Share your flight number when you book so your driver is waiting with a name sign even on 2–4 AM landings." },
      { question: "Where do I meet my driver at Jeddah airport?", answer: "Your driver meets you inside the arrivals hall of your terminal (Terminal 1, North Terminal, or the Hajj Terminal) holding a sign with your name. Confirm your terminal when booking so we meet you at the right exit." },
      { question: "Is there a Miqat on the way from Jeddah Airport to Makkah?", answer: "No. Jeddah lies inside the Miqat boundary, so pilgrims arriving by air usually enter Ihram on the plane before landing. If you need to go to the Al-Juhfah Miqat near Rabigh first, tell us when booking and we quote that trip separately — see our Miqat guide for the details." },
      { question: "What happens if my flight is delayed?", answer: "Share your flight number when you book — we track your flight, so a delay simply moves the pickup to your actual landing time, and 15–30 minutes of waiting after landing is free." },
      { question: "Is there a taxi service at the Hajj Terminal?", answer: "Yes. During Hajj and Umrah seasons we serve the dedicated Hajj Terminal. Pre-book and share your flight details so your driver meets you at the correct terminal." }
    ],
    relatedLinks: [
      { href: "/routes/jeddah-airport-to-makkah", label: "Jeddah Airport to Makkah taxi" },
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
    tldr: "A taxi or private car service from King Khalid International Airport (RUH) to central Riyadh takes about 30–45 minutes, with the fare confirmed on WhatsApp. Share your flight number when you book and your driver meets you at arrivals with a name sign at any terminal (1, 2, 3, 4 or 5), 24/7.",
    tldrFacts: [
      { label: "RUH → City", value: "~30–45 min · fare on WhatsApp" },
      { label: "RUH → KAFD Hotels", value: "~35 min · fare on WhatsApp" },
      { label: "Meet & greet", value: "Included" },
      { label: "Hours", value: "24/7" }
    ],
    terminals: [
      { name: "Terminal 5 car service", desc: "Dedicated to domestic flights — private car service and meet & greet at the Terminal 5 arrivals hall." },
      { name: "Terminal 1 & 2 car service", desc: "International flights depending on the airline — car service and name-sign pickup at the Terminal 1 and Terminal 2 arrivals halls." },
      { name: "Terminal 3 & 4 car service", desc: "Recently renovated international terminals — private car service and pickup at the Terminal 3 and Terminal 4 arrivals halls." }
    ],
    tips: [
      "Riyadh airport is 35km north of the city center. Expect a 30-45 minute drive.",
      "Corporate invoicing is available for business travelers on request.",
      "Share your flight number when you book so we check it before pickup.",
      "Meet & greet is included — your driver waits in the arrivals hall with a name sign."
    ],
    priorityRoutes: ["riyadh-airport-to-city"],
    faqs: [
      { question: "How much is a taxi from Riyadh airport to the city center?", answer: "The fare from King Khalid International Airport (RUH) to central Riyadh is confirmed on WhatsApp before you book — no meter, no surge, no hidden fees." },
      { question: "How long does it take from Riyadh airport to KAFD?", answer: "The drive from RUH to KAFD is about 35–40 minutes (approximately 40 km), depending on traffic." },
      { question: "Is there a taxi or car service at RUH Terminal 2, 3, 4 or 5?", answer: "Yes — we provide a private taxi and car service and meet & greet at every King Khalid International Airport (RUH) terminal: Terminal 1 and Terminal 2, Terminal 3 and Terminal 4 for international flights, and Terminal 5 for domestic. Share your terminal number when booking and your chauffeur waits in that arrivals hall with a name sign." },
      { question: "Do you offer a King Khalid International Airport car service for business travellers?", answer: "Yes. We run an executive car service from RUH for business travellers heading to KAFD, Olaya and the Diplomatic Quarter — executive sedans and SUVs, bilingual chauffeurs, and corporate invoicing on request." },
      { question: "Where do I meet my driver at Riyadh airport?", answer: "Your driver meets you in the arrivals hall of your terminal holding a name sign. Confirm your terminal number when booking so we meet you at the right exit." },
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
      { href: "/fleet/mercedes-s-class", label: "Mercedes S-Class — executive sedan" },
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — Premium SUV" },
      { href: "/fleet/toyota-camry", label: "Toyota Camry — Executive Sedan" },
    ]
  },
  "king-fahd-dammam": {
    name: "King Fahd International Airport",
    code: "DMM",
    h1Name: "Dammam Airport (DMM)",
    nameAr: "مطار الملك فهد الدولي",
    image: "/airports/dammam-hero.webp",
    tagline: "The Eastern Gateway",
    description: "Pre-book your taxi from King Fahd International Airport (DMM) to Dammam, Al Khobar, Dhahran, or Jubail. Cross-border transfers to Bahrain also available upon request.",
    tldr: "A taxi from King Fahd International Airport (DMM) to Dammam takes about 25–30 minutes. Transfers quoted on WhatsApp also available to Al Khobar, Dhahran, and cross-border to Bahrain via King Fahd Causeway.",
    tldrFacts: [
      { label: "DMM → Dammam", value: "~25–30 min" },
      { label: "DMM → Al Khobar", value: "~30–40 min" },
      { label: "Meet & greet", value: "Included" },
      { label: "Hours", value: "24/7" }
    ],
    terminals: [
      { name: "Main Terminal", desc: "Six-level terminal handling all passenger traffic." }
    ],
    tips: [
      "DMM is the largest airport in the world by area, located 20km northwest of Dammam.",
      "For transfers to Bahrain, please provide passport details 24 hours in advance.",
      "Share your flight number when you book so we check it before pickup.",
      "Meet & greet is included — your driver waits in the arrivals hall with a name sign."
    ],
    priorityRoutes: ["dammam-to-doha", "dammam-to-manama"],
    faqs: [
      { question: "How much is a taxi from Dammam airport to Al Khobar?", answer: "A taxi from King Fahd International Airport (DMM) to Al Khobar is a 30–40 minute drive. The exact fare is confirmed before you book — no surge or hidden fees." },
      { question: "Can I get a taxi from DMM airport to Bahrain?", answer: "Yes. We offer cross-border transfers from DMM to Bahrain via the King Fahd Causeway. Each passenger completes their own border checks on the causeway and carries their own valid documents. Our Dammam Airport to Bahrain route page has the full details." },
      { question: "Where do I meet my driver at Dammam airport?", answer: "Your driver meets you in the arrivals hall holding a sign with your name. Meet & greet is included with every booking." },
      { question: "What happens if my flight is delayed?", answer: "Share your flight number when you book and we check it before pickup, so the pickup time is planned around your actual arrival." }
    ],
    relatedLinks: [
      { href: "/routes/dammam-airport-to-doha", label: "DMM straight to Doha, Qatar" },
      { href: "/routes/dammam-to-doha", label: "Dammam city to Doha" },
      { href: "/routes/dammam-to-manama", label: "DMM to Manama, Bahrain" },
      { href: "/routes/dammam-airport-to-bahrain", label: "Dammam Airport to Bahrain — direct private transfer" },
      { href: "/routes/bahrain-to-dammam-airport", label: "Bahrain to Dammam Airport for your flight" },
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
      { question: "Where do I meet my driver at Tabuk airport?", answer: "Your driver meets you at the arrivals exit of the main terminal with a name sign." },
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
      "Mountain roads require experienced drivers, which our team guarantees.",
      "The airport is just 18km from the center of Abha."
    ],
    priorityRoutes: ["abha-airport-to-soudah"],
    faqs: [
      { question: "How far is Abha airport from the city center?", answer: "Abha International Airport (AHB) is about 18 km from the center of Abha, approximately a 20–25 minute drive." },
      { question: "Can I get a taxi from Abha airport to Soudah?", answer: "Yes. We provide transfers from AHB to Soudah Peak and the surrounding Aseer mountain attractions. The drive takes about 50 minutes." },
      { question: "What happens if my flight is delayed?", answer: "Share your flight number when you book and we check it before pickup, so the pickup time is planned around your actual arrival." }
    ],
    relatedLinks: [
      { href: "/routes/abha-airport-to-soudah", label: "Abha Airport to Soudah Peak" },
      { href: "/routes/jeddah-to-abha", label: "Jeddah to Abha transfer" },
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — SUV for mountain roads" },
    ]
  }
};
