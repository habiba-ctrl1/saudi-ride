// Static content for airport landing pages — single source of truth for
// app/(marketing)/airports/[slug]/page.tsx AND app/sitemap.ts (AIRPORTS).
export const AIRPORT_DETAILS: Record<string, { name: string, code: string, nameAr: string, image: string, tagline: string, description: string, terminals: { name: string, desc: string }[], tips: string[], priorityRoutes: string[], tldr?: string, tldrFacts?: { label: string, value: string }[], faqs?: { question: string, answer: string }[] }> = {
  "king-abdulaziz-jeddah": {
    name: "King Abdulaziz International Airport",
    code: "JED",
    nameAr: "مطار الملك عبدالعزيز الدولي",
    image: "/airports/jed-hero.webp",
    tagline: "The Main Gateway for Umrah & Hajj",
    description: "Pre-book a fixed-price taxi from King Abdulaziz International Airport (JED) to Makkah (~1 hour), Madinah, or your Jeddah hotel. Meet & greet at arrivals with a name sign, live flight tracking, no surge pricing, and 24/7 service — including late-night and early-morning pilgrim flights. Drivers can stop at the Miqat so you enter Ihram before reaching Makkah.",
    tldr: "A taxi from Jeddah Airport (JED) to Makkah takes about 1 hour and is fixed-price from SAR 249. Drivers track your flight and meet you at arrivals with a name sign, 24/7 — including late-night flights — and can stop at the Miqat for Ihram on the way to Makkah.",
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
      { question: "How much is a taxi from Jeddah airport to Makkah?", answer: "A fixed-price taxi from King Abdulaziz International Airport (JED) to Makkah starts from around SAR 249 for a sedan, with larger SUVs and vans available. The price is confirmed before you book — no surge, tolls included." },
      { question: "Is there a taxi at Jeddah airport at night?", answer: "Yes. We operate 24/7 at JED, including late-night and early-morning arrivals. Because we track your flight, your driver is waiting with a name sign even on 2–4 AM landings." },
      { question: "Where do I meet my driver at Jeddah airport?", answer: "Your driver meets you inside the arrivals hall of your terminal (Terminal 1, North Terminal, or the Hajj Terminal) holding a sign with your name. Confirm your terminal when booking so we meet you at the right exit." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. On the Jeddah Airport to Makkah route, simply ask and the driver will stop at the Miqat so you can change into Ihram and make your intention before entering the Haram boundary." },
      { question: "What happens if my flight is delayed?", answer: "Nothing extra to pay. We monitor your flight number in real time and adjust the pickup automatically, with up to 60 minutes of free waiting after you land." },
      { question: "Is there a taxi service at the Hajj Terminal?", answer: "Yes. During Hajj and Umrah seasons we serve the dedicated Hajj Terminal. Pre-book and share your flight details so your driver meets you at the correct terminal." }
    ]
  },
  "prince-mohammad-madinah": {
    name: "Prince Mohammad Bin Abdulaziz Airport",
    code: "MED",
    nameAr: "مطار الأمير محمد بن عبدالعزيز",
    image: "/airports/med-hero.webp",
    tagline: "Gateway to the Prophet's City",
    description: "Pre-book a fixed-price taxi from Prince Mohammad Bin Abdulaziz Airport (MED) to your Madinah hotel near Masjid an-Nabawi (~20 km, ~25 min), or a long-distance transfer to Makkah. Meet & greet at arrivals, flight tracking, and 24/7 service for pilgrims.",
    tldr: "A taxi from Prince Mohammad Bin Abdulaziz Airport (MED) to central Madinah hotels takes about 25 minutes and is fixed-price from SAR 80. Drivers track your flight and meet you at arrivals with a name sign, 24/7.",
    tldrFacts: [
      { label: "MED → City", value: "~25 min · from SAR 80" },
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
      { question: "How much is a taxi from Madinah airport to the city?", answer: "A fixed-price taxi from Prince Mohammad Bin Abdulaziz Airport (MED) to central Madinah hotels starts from around SAR 80. It is about 20 km and a 25-minute drive, with meet & greet at arrivals." },
      { question: "Is there a taxi at Madinah airport at night?", answer: "Yes. We operate 24/7 at MED, including late-night and early-morning arrivals. We track your flight so your driver waits with a name sign even if the flight is delayed." },
      { question: "Where do I meet my driver at Madinah airport?", answer: "Your driver meets you in the arrivals hall of the main terminal holding a sign with your name, and helps with your luggage to the vehicle." },
      { question: "Can I travel directly from Madinah airport to Makkah?", answer: "Yes. We offer a direct MED to Makkah transfer (about 450 km, ~4.5–5 hours) with prayer and rest stops, ideal for pilgrims connecting between the Holy Cities." },
      { question: "Do you have vehicles for large families with luggage?", answer: "Yes. We provide spacious vans such as the Hyundai Staria and Mercedes Sprinter, plus SUVs, for families with extra luggage arriving at MED." }
    ]
  },
  "king-khalid-riyadh": {
    name: "King Khalid International Airport",
    code: "RUH",
    nameAr: "مطار الملك خالد الدولي",
    image: "/airports/ruh-hero.webp",
    tagline: "The Capital Hub",
    description: "Executive airport transfers from King Khalid International Airport (RUH) in Riyadh. Premium chauffeur services for business travelers heading to KAFD, Olaya, or Diplomatic Quarter.",
    terminals: [
      { name: "Terminal 5", desc: "Dedicated exclusively to domestic flights." },
      { name: "Terminals 1 & 2", desc: "International flights depending on the airline." },
      { name: "Terminal 3 & 4", desc: "Recently renovated for expanding international capacity." }
    ],
    tips: [
      "Riyadh airport is 35km north of the city center. Expect a 30-45 minute drive.",
      "Corporate invoicing and VAT receipts are provided for business travelers."
    ],
    priorityRoutes: ["riyadh-airport-to-city"]
  },
  "king-fahd-dammam": {
    name: "King Fahd International Airport",
    code: "DMM",
    nameAr: "مطار الملك فهد الدولي",
    image: "/airports/dammam-hero.webp",
    tagline: "The Eastern Gateway",
    description: "Pre-book your taxi from King Fahd International Airport (DMM) to Dammam, Al Khobar, Dhahran, or Jubail. Cross-border transfers to Bahrain also available upon request.",
    terminals: [
      { name: "Main Terminal", desc: "Six-level terminal handling all passenger traffic." }
    ],
    tips: [
      "DMM is the largest airport in the world by area, located 20km northwest of Dammam.",
      "For transfers to Bahrain, please provide passport details 24 hours in advance."
    ],
    priorityRoutes: ["dammam-to-doha", "dammam-to-manama"]
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
    priorityRoutes: ["taif-to-makkah"]
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
    priorityRoutes: ["tabuk-airport-to-neom"]
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
    priorityRoutes: ["alula-airport-to-resorts", "alula-to-medina"]
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
    priorityRoutes: ["abha-airport-to-soudah"]
  }
};
