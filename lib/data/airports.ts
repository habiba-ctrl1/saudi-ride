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
    description: "Pre-book a private taxi from King Abdulaziz International Airport (JED) to Makkah (~1 hour), Madinah, or your Jeddah hotel. Meet & greet at arrivals with a name sign, live flight tracking, no surge pricing, and 24/7 service — including late-night and early-morning pilgrim flights. Drivers can stop at the Miqat so you enter Ihram before reaching Makkah.",
    tldr: "A taxi from Jeddah Airport (JED) to Makkah takes about 1 hour and starts from around SAR 249, confirmed on WhatsApp. Drivers track your flight and meet you at arrivals with a name sign, 24/7 — including late-night flights — and can stop at the Miqat for Ihram on the way to Makkah.",
    tldrFacts: [
      { label: "JED → Makkah", value: "~1 hr · from SAR 249" },
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
      "Our drivers track your flight and wait up to 60 minutes free of charge — no extra cost if your flight is delayed.",
      "For Umrah, tell us if you need a Miqat stop so you can enter Ihram before reaching Makkah.",
      "Meet & greet is included — your driver waits in the arrivals hall holding a sign with your name.",
      "Confirm your terminal (Terminal 1, North, or Hajj) when booking so your driver meets you at the right arrivals exit."
    ],
    priorityRoutes: ["jeddah-airport-to-makkah", "jeddah-airport-to-madinah", "jeddah-airport-to-taif"],
    faqs: [
      { question: "How much is a taxi from Jeddah airport to Makkah?", answer: "A taxi from King Abdulaziz International Airport (JED) to Makkah starts from around SAR 249 for a sedan, with larger SUVs and vans available. The price is confirmed before you book — no surge, tolls included." },
      { question: "Is there a taxi at Jeddah airport at night?", answer: "Yes. We operate 24/7 at JED, including late-night and early-morning arrivals. Because we track your flight, your driver is waiting with a name sign even on 2–4 AM landings." },
      { question: "Where do I meet my driver at Jeddah airport?", answer: "Your driver meets you inside the arrivals hall of your terminal (Terminal 1, North Terminal, or the Hajj Terminal) holding a sign with your name. Confirm your terminal when booking so we meet you at the right exit." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. On the Jeddah Airport to Makkah route, simply ask and the driver will stop at the Miqat so you can change into Ihram and make your intention before entering the Haram boundary." },
      { question: "What happens if my flight is delayed?", answer: "Nothing extra to pay. We monitor your flight number in real time and adjust the pickup automatically, with up to 60 minutes of free waiting after you land." },
      { question: "Is there a taxi service at the Hajj Terminal?", answer: "Yes. During Hajj and Umrah seasons we serve the dedicated Hajj Terminal. Pre-book and share your flight details so your driver meets you at the correct terminal." }
    ],
    relatedLinks: [
      { href: "/routes/jeddah-airport-to-makkah", label: "Jeddah Airport to Makkah taxi" },
      { href: "/routes/jeddah-airport-to-madinah", label: "Jeddah Airport to Madinah transfer" },
      { href: "/routes/jeddah-airport-to-jeddah-city", label: "JED Airport to Jeddah City" },
      { href: "/routes/jeddah-airport-to-taif", label: "JED Airport to Taif" },
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
    description: "Pre-book a private taxi or private car with chauffeur from Prince Mohammad Bin Abdulaziz Airport (MED) — Madinah (Medina) — to your hotel near Masjid an-Nabawi (~20 km, ~25 min), or a long-distance transfer to Makkah. This is a pre-booked private airport transfer in your own vehicle: meet & greet at arrivals with a name sign, flight tracking, spacious family vans, and 24/7 service for pilgrims and families.",
    tldr: "A taxi or private car from Prince Mohammad Bin Abdulaziz Airport (MED) to central Madinah hotels takes about 25 minutes — get the current fare on WhatsApp. Every booking is a pre-booked private transfer in your own vehicle, with meet & greet and flight tracking, 24/7.",
    tldrFacts: [
      { label: "MED → City", value: "~25 min · fare on WhatsApp" },
      { label: "MED → Makkah", value: "~4.5–5 hr" },
      { label: "Meet & greet", value: "Included" },
      { label: "Hours", value: "24/7" }
    ],
    terminals: [
      { name: "Main Terminal", desc: "Award-winning terminal handling all international and domestic passenger flights. Pre-booked drivers meet you in the arrivals hall." },
      { name: "Hajj Pavilion", desc: "Dedicated facility opened for Hajj and peak Umrah charter flights." }
    ],
    tips: [
      "The airport is about 20–25 minutes from the Central Area (Markazia) hotels near Masjid an-Nabawi.",
      "We track your flight and include meet & greet — your driver waits with a name sign, even for delayed or late-night arrivals.",
      "We provide spacious vans (Hyundai Staria, Mercedes Sprinter) for large families with luggage.",
      "Travelling onward to Makkah? Book a direct MED to Makkah transfer (~450 km) with prayer and rest stops."
    ],
    priorityRoutes: ["madinah-airport-to-makkah", "madinah-airport-to-city"],
    faqs: [
      { question: "How much is a taxi from Madinah airport to the city?", answer: "A private taxi from Prince Mohammad Bin Abdulaziz Airport (MED) — Madinah (Medina) — to central Madinah hotels is about 20 km and a 25-minute drive. It is a pre-booked private transfer in your own vehicle with meet & greet at arrivals; get the current fare on WhatsApp before you book." },
      { question: "Do you offer a private car service from Madinah Airport (MED)?", answer: "Yes. Beyond a standard taxi, we offer a pre-booked private car service from Madinah Airport (MED) — an executive sedan, SUV or VIP van with a professional chauffeur and meet & greet at arrivals. Every booking is your own vehicle, quoted on WhatsApp before you travel." },
      { question: "Is there a taxi at Madinah airport at night?", answer: "Yes. We operate 24/7 at MED, including late-night and early-morning arrivals. We track your flight so your driver waits with a name sign even if the flight is delayed." },
      { question: "Where do I meet my driver at Madinah airport?", answer: "Your driver meets you in the arrivals hall of the main terminal holding a sign with your name, and helps with your luggage to the vehicle." },
      { question: "Can I travel directly from Madinah airport to Makkah?", answer: "Yes. We offer a direct MED to Makkah transfer (about 450 km, ~4.5–5 hours) with prayer and rest stops, ideal for pilgrims connecting between the Holy Cities." },
      { question: "Do you have vehicles for large families with luggage?", answer: "Yes. We provide spacious vans such as the Hyundai Staria and Mercedes Sprinter, plus SUVs, for families with extra luggage arriving at MED." },
      { question: "Do you offer a Madinah airport hotel transfer with meet and greet?", answer: "Yes. We provide a pre-booked private hotel transfer from Madinah Airport (MED) to your accommodation in the Central Area (Markaziyah) near Masjid an-Nabawi. Your chauffeur meets you in the arrivals hall with a name sign, helps with your luggage, and takes you door-to-door in your own private vehicle." }
    ],
    relatedLinks: [
      { href: "/routes/madinah-airport-to-city", label: "MED Airport to Madinah City" },
      { href: "/routes/madinah-airport-to-makkah", label: "MED Airport to Makkah direct" },
      { href: "/routes/madinah-airport-to-madinah-markaziyah", label: "MED to Markaziyah Hotels" },
      { href: "/fleet/toyota-camry", label: "Toyota Camry — executive sedan" },
      { href: "/fleet/hyundai-staria", label: "Hyundai Staria — VIP Van" },
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — Premium SUV" },
      { href: "/services/airport-transfers", label: "Private airport transfers across Saudi Arabia" },
      { href: "/locations/madinah", label: "Madinah private transport & chauffeur service" },
      { href: "/routes/jeddah-to-madinah", label: "Jeddah to Madinah taxi" },
      { href: "/routes/makkah-to-madinah", label: "Makkah to Madinah taxi" },
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
    tldr: "A taxi from King Khalid International Airport (RUH) to central Riyadh takes about 30–45 minutes and starts from around SAR 100, confirmed on WhatsApp. Drivers track your flight and meet you at arrivals with a name sign, 24/7.",
    tldrFacts: [
      { label: "RUH → City", value: "~30–45 min · from SAR 100" },
      { label: "RUH → KAFD Hotels", value: "~35 min · from SAR 150" },
      { label: "Meet & greet", value: "Included" },
      { label: "Hours", value: "24/7" }
    ],
    terminals: [
      { name: "Terminal 5", desc: "Dedicated exclusively to domestic flights." },
      { name: "Terminals 1 & 2", desc: "International flights depending on the airline." },
      { name: "Terminal 3 & 4", desc: "Recently renovated for expanding international capacity." }
    ],
    tips: [
      "Riyadh airport is 35km north of the city center. Expect a 30-45 minute drive.",
      "Corporate invoicing is available for business travelers on request.",
      "We track your flight and include 60 minutes of free waiting time after landing.",
      "Meet & greet is included — your driver waits in the arrivals hall with a name sign."
    ],
    priorityRoutes: ["riyadh-airport-to-city"],
    faqs: [
      { question: "How much is a taxi from Riyadh airport to the city center?", answer: "A private taxi from King Khalid International Airport (RUH) to central Riyadh starts from SAR 100. The price is confirmed before you book — no surge or hidden fees." },
      { question: "How long does it take from Riyadh airport to KAFD?", answer: "The drive from RUH to KAFD is about 35–40 minutes (approximately 40 km), depending on traffic." },
      { question: "Do you offer car service at every Riyadh Airport terminal?", answer: "Yes. We provide private car service and meet & greet at all King Khalid International Airport (RUH) terminals — Terminals 1, 2, 3 and 4 for international flights and Terminal 5 for domestic. Share your terminal when booking and your chauffeur waits in that arrivals hall with a name sign." },
      { question: "Where do I meet my driver at Riyadh airport?", answer: "Your driver meets you in the arrivals hall of your terminal holding a name sign. Confirm your terminal number when booking so we meet you at the right exit." },
      { question: "What happens if my flight is delayed?", answer: "We monitor your flight number and adjust the pickup automatically. Up to 60 minutes of free waiting after landing is included." },
      { question: "Do you provide invoices for business travelers?", answer: "Yes. Corporate invoices are available for business travelers on request — just let us know when you book." }
    ],
    relatedLinks: [
      { href: "/routes/riyadh-airport-to-city", label: "RUH Airport to Riyadh City" },
      { href: "/routes/riyadh-airport-to-kafd-hotels", label: "RUH to KAFD & Olaya Hotels" },
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
      "We track your flight and include 60 minutes of free waiting time after landing.",
      "Meet & greet is included — your driver waits in the arrivals hall with a name sign."
    ],
    priorityRoutes: ["dammam-to-doha", "dammam-to-manama"],
    faqs: [
      { question: "How much is a taxi from Dammam airport to Al Khobar?", answer: "A taxi from King Fahd International Airport (DMM) to Al Khobar is a 30–40 minute drive. The exact fare is confirmed before you book — no surge or hidden fees." },
      { question: "Can I get a taxi from DMM airport to Bahrain?", answer: "Yes. We offer cross-border transfers from DMM to Bahrain via the King Fahd Causeway. Please provide your passport details 24 hours in advance so we can prepare the border crossing documentation." },
      { question: "Where do I meet my driver at Dammam airport?", answer: "Your driver meets you in the arrivals hall holding a sign with your name. Meet & greet is included with every booking." },
      { question: "What happens if my flight is delayed?", answer: "We monitor your flight in real time and adjust the pickup automatically. Up to 60 minutes of free waiting time after landing is included." }
    ],
    relatedLinks: [
      { href: "/routes/dammam-to-doha", label: "DMM to Doha, Qatar — cross-border" },
      { href: "/routes/dammam-to-manama", label: "DMM to Manama, Bahrain" },
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
      { question: "What happens if my flight is delayed?", answer: "We track your flight and adjust the pickup automatically. Up to 60 minutes of free waiting after landing is included." }
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
      { question: "What happens if my flight is delayed?", answer: "We track your flight and adjust the pickup automatically. Up to 60 minutes of free waiting after landing is included." }
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
    image: "/airports/alula-airport.webp",
    tagline: "Arrival at the Ancient Oasis",
    description: "Exclusive airport transfers from AlUla Airport (ULH) to your desert resort or Hegra. Luxury vehicles tailored for a premium tourist experience.",
    terminals: [
      { name: "Main Terminal", desc: "Boutique airport terminal serving the heritage site." }
    ],
    tips: [
      "Ensure you book your transfer in advance as on-demand taxis are extremely limited at ULH.",
      "Our luxury fleet (Cadillac Escalade, Mercedes S-Class) perfectly matches AlUla's premium resorts."
    ],
    priorityRoutes: ["alula-airport-to-resorts", "alula-to-medina"],
    faqs: [
      { question: "Are taxis available at AlUla airport?", answer: "On-demand taxis are extremely limited at AlUla Airport (ULH). Pre-booking your transfer in advance is strongly recommended." },
      { question: "How far is AlUla airport from Hegra?", answer: "AlUla Airport is about 30 km from Hegra and the main resort area. The transfer takes roughly 30 minutes." },
      { question: "What vehicles are available at AlUla?", answer: "We provide luxury vehicles suited to AlUla's premium tourism experience, including the Cadillac Escalade and Mercedes S-Class." }
    ],
    relatedLinks: [
      { href: "/routes/alula-airport-to-resorts", label: "AlUla Airport to desert resorts" },
      { href: "/routes/madinah-to-alula", label: "Madinah to AlUla transfer" },
      { href: "/fleet/cadillac-escalade", label: "Cadillac Escalade — elite SUV" },
      { href: "/fleet/mercedes-s-class", label: "Mercedes S-Class — luxury sedan" },
    ]
  },
  "red-sea": {
    name: "Red Sea International Airport",
    code: "RSI",
    nameAr: "مطار البحر الأحمر الدولي",
    image: "/locations/neom-hero.webp",
    tagline: "Gateway to AMAALA & the Red Sea Resorts",
    description: "Book a private VIP airport transfer from Red Sea International Airport (RSI) to AMAALA, Sindalah, or your luxury Red Sea resort. A boutique gateway serving the Red Sea Global destinations, with executive vehicles suited to a premium, remote-resort arrival — clear pricing on WhatsApp, no surge, professional English-speaking chauffeurs.",
    tldr: "A private transfer from Red Sea International Airport (RSI) to AMAALA is about 35 km (~30 min) from SAR 180, and to NEOM about 300 km (~3.5 hr) from SAR 450. Both are VIP transfers with an executive vehicle and English-speaking chauffeur — pre-booking is strongly recommended as on-demand taxis are extremely limited this far from any city.",
    tldrFacts: [
      { label: "RSI → AMAALA", value: "~30 min · from SAR 180" },
      { label: "RSI → NEOM", value: "~3.5 hr · from SAR 450" },
      { label: "Vehicle", value: "Executive SUV/Sedan" },
      { label: "Booking", value: "Pre-book required" }
    ],
    terminals: [
      { name: "Main Terminal", desc: "Boutique terminal built for Red Sea Global's resort guests, serving domestic flights plus select international routes to the Red Sea coast." }
    ],
    tips: [
      "This is a remote-resort airport — there are no on-demand taxis waiting outside, so pre-book your transfer before you fly.",
      "Our executive fleet (Mercedes S-Class, GMC Yukon, Cadillac Escalade) matches the standard expected by AMAALA and Red Sea Global resort guests.",
      "Share your resort name (e.g. AMAALA, Sindalah, St. Regis Red Sea Resort, Six Senses Southern Dunes, Shebara) when booking so your driver knows the exact drop-off point.",
      "Flight tracking and meet & greet are included, with free waiting time if your flight is delayed."
    ],
    priorityRoutes: ["red-sea-airport-to-amaala", "red-sea-airport-to-neom"],
    faqs: [
      { question: "How do I get from Red Sea International Airport to AMAALA?", answer: "A private VIP transfer from Red Sea International Airport (RSI) to AMAALA is about 35 km, roughly a 30-minute drive, from around SAR 180 in an executive vehicle." },
      { question: "Is there a taxi rank at Red Sea International Airport?", answer: "No — this is a boutique airport built for the Red Sea Global resorts, with no walk-up taxi rank. Pre-booking your transfer in advance is strongly recommended." },
      { question: "Can I get a transfer from Red Sea International Airport to NEOM?", answer: "Yes. It's approximately 300 km, about a 3.5-hour drive, from around SAR 450 in an executive vehicle — ideal for investors, contractors, and visitors connecting between the two giga-projects." },
      { question: "What kind of vehicles are available at RSI?", answer: "Executive sedans and SUVs (Mercedes S-Class, GMC Yukon, Cadillac Escalade) suited to the premium standard of AMAALA and the Red Sea resorts, all with professional, English-speaking chauffeurs." },
      { question: "Which resorts do you serve from Red Sea International Airport?", answer: "We provide transfers to AMAALA, Sindalah Island, and the Red Sea Global resorts including St. Regis Red Sea Resort, Six Senses Southern Dunes, Desert Rock Resort, and Shebara — tell us your resort name when booking." }
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
      { question: "What happens if my flight is delayed?", answer: "We track your flight and adjust the pickup automatically. Up to 60 minutes of free waiting after landing is included." }
    ],
    relatedLinks: [
      { href: "/routes/abha-airport-to-soudah", label: "Abha Airport to Soudah Peak" },
      { href: "/routes/jeddah-to-abha", label: "Jeddah to Abha transfer" },
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — SUV for mountain roads" },
    ]
  }
};
