// Static content for city location pages — single source of truth for
// app/(marketing)/locations/[city]/page.tsx AND app/sitemap.ts (LOCATIONS).
export const CITY_DETAILS: Record<string, { name: string, nameAr: string, image: string, tagline: string, description: string, attractions: { name: string, dist: string }[], tips: string[], tldr?: string, tldrFacts?: { label: string, value: string }[], faqs?: { question: string, answer: string }[], testimonials?: { quote: string, author: string, location: string, trip: string }[], relatedLinks?: { href: string, label: string }[] }> = {
  makkah: {
    name: "Makkah",
    nameAr: "مكة المكرمة",
    image: "/locations/makkah-hero.webp",
    tagline: "The Holiest City on Earth",
    description: "Book a private taxi in Makkah for Umrah, Hajj, Ziyarat, or onward travel. Our professional drivers provide Masjid Al-Haram drop-offs, return transfers to Jeddah Airport (~80 km, ~1 hour), and Makkah to Madinah journeys (~430 km, ~4–5 hours). Prayer-time and rest stops are always included, and drivers know the road-closure points around the Haram during Salah.",
    tldr: "Taxi Saudi Arabia arranges 24/7 private taxi service in Makkah — Masjid al-Haram hotel drop-offs, return transfers to Jeddah Airport (~80 km, ~1 hour), and Makkah to Madinah journeys (~430 km, ~4–5 hours). Prayer stops and luggage help included.",
    tldrFacts: [
      { label: "To Jeddah Airport", value: "~80 km · ~1 hr" },
      { label: "To Madinah", value: "~430 km · ~4–5 hr" },
      { label: "To Taif", value: "~90 km · ~1 hr 10" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "Al-Masjid Al-Haram (Kaaba)", dist: "0 km" },
      { name: "Jabal Al-Nour (Cave of Hira)", dist: "5 km" },
      { name: "Jabal Thawr", dist: "4 km" },
      { name: "Mina & Arafat", dist: "8–15 km" },
      { name: "Jeddah Airport (JED)", dist: "~80 km" },
      { name: "Madinah (Masjid an-Nabawi)", dist: "~430 km" }
    ],
    tips: [
      "Vehicle access near Masjid Al-Haram may be restricted during peak prayer times — your driver will know the closest permitted drop-off point.",
      "Only Muslims are permitted to enter the city limits of Makkah.",
      "Pre-book your return taxi to Jeddah Airport in advance during Umrah and Hajj seasons to avoid delays — allow extra time before your flight.",
      "For Ziyarat, a half-day car covers Jabal Al-Nour, Mina, Arafat, and Jabal Thawr with waiting time included."
    ],
    faqs: [
      { question: "How much is a taxi from Makkah to Jeddah airport?", answer: "A private taxi from Makkah to King Abdulaziz International Airport (JED) starts from around SAR 249 for a sedan. It is about 80 km and roughly 1 hour — pre-book and allow buffer time before your flight." },
      { question: "How far is Makkah from Madinah by taxi?", answer: "Makkah to Madinah is about 430 km — roughly a 4 to 5 hour drive via the Haramain highway. The fare starts from around SAR 499, confirmed on WhatsApp, with prayer and rest stops included." },
      { question: "Can the taxi drop me at my Makkah hotel near the Haram?", answer: "Yes. We drop you as close to your hotel and Masjid al-Haram as vehicles are permitted. During prayer times some roads close, so the driver uses the nearest allowed checkpoint." },
      { question: "Do you provide Makkah Ziyarat tours by car?", answer: "Yes. A half-day Ziyarat car visits Jabal Al-Nour (Cave of Hira), Jabal Thawr, Mina, and Arafat with a knowledgeable driver and flexible waiting time." },
      { question: "Is taxi available in Makkah 24/7?", answer: "Yes, we operate around the clock in Makkah for hotel transfers, airport returns, intercity trips, and Ziyarat — with your fare confirmed before you book, no surge." }
    ],
    testimonials: [
      { quote: "Booked our Makkah to Madinah transfer in a big SUV. Driver was on time at the hotel, stopped for prayers, and the price was exactly as quoted. Very comfortable for the elderly in our group.", author: "Yusuf A.", location: "Manchester, UK", trip: "Makkah → Madinah" },
      { quote: "Return trip from our hotel near the Haram to Jeddah airport. He knew exactly where the roads were closed and got us out smoothly with plenty of time for the flight.", author: "Nadia H.", location: "Sydney, Australia", trip: "Makkah → JED Airport" },
      { quote: "Did the Ziyarat tour — Cave of Hira, Mina, Arafat. The driver explained each site and never rushed us. Fair price as agreed. Highly recommended.", author: "Bilal K.", location: "Makkah", trip: "Makkah Ziyarat" }
    ]
  },
  madinah: {
    name: "Madinah",
    nameAr: "المدينة المنورة",
    image: "/locations/madinah-hero.webp",
    tagline: "City of the Prophet ﷺ",
    description: "Book a private taxi in Madinah for airport transfers from Prince Mohammad Bin Abdulaziz Airport (MED) (~20 km, ~25 min), Masjid an-Nabawi hotel drop-offs, Ziyarat tours, and onward journeys to Makkah (~430 km, ~4–5 hours). Our drivers serve pilgrims arriving at MED and travellers heading to or from Makkah and Jeddah, with prayer stops and luggage help included.",
    tldr: "Taxi Saudi Arabia arranges 24/7 private taxi service in Madinah — Prince Mohammad Bin Abdulaziz Airport (MED) transfers (~20 km, ~25 min), Masjid an-Nabawi hotel drop-offs, Ziyarat tours, and Madinah to Makkah journeys (~430 km, ~4–5 hours).",
    tldrFacts: [
      { label: "Airport (MED)", value: "~20 km · ~25 min" },
      { label: "To Makkah", value: "~430 km · ~4–5 hr" },
      { label: "To Jeddah Airport", value: "~410 km" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "Al-Masjid an-Nabawi", dist: "0 km" },
      { name: "Quba Mosque", dist: "4 km" },
      { name: "Mount Uhud", dist: "6 km" },
      { name: "Qiblatain Mosque", dist: "7 km" },
      { name: "Prince Mohammad Airport (MED)", dist: "~20 km" },
      { name: "Makkah (Masjid al-Haram)", dist: "~430 km" }
    ],
    tips: [
      "Prince Mohammad Bin Abdulaziz Airport (MED) is about 20–25 minutes from the Central Area (Markazia) hotels — pre-book your arrival transfer with meet & greet.",
      "Ziyarat tours of the holy sites usually take 3–4 hours — book a half-day or full-day car for the best value.",
      "Traffic around Masjid an-Nabawi is heavy after Friday prayers — allow extra time.",
      "For Madinah to Makkah, a private taxi is door-to-door with prayer stops; spacious SUVs suit families and luggage."
    ],
    faqs: [
      { question: "How much is a taxi from Madinah airport to the city?", answer: "A private taxi from Prince Mohammad Bin Abdulaziz Airport (MED) to central Madinah hotels starts from around SAR 80. It is about 20 km and a 25-minute drive, with meet & greet at arrivals." },
      { question: "How far is Madinah from Makkah by taxi?", answer: "Madinah to Makkah is about 430 km — roughly a 4 to 5 hour drive via the Haramain highway. The fare starts from around SAR 499, confirmed on WhatsApp, with prayer and rest stops included." },
      { question: "Can the taxi drop me at my hotel near Masjid an-Nabawi?", answer: "Yes. We drop you as close to your Central Area (Markazia) hotel and Masjid an-Nabawi as vehicles are permitted, handling any prayer-time road restrictions." },
      { question: "Do you offer Madinah Ziyarat tours by car?", answer: "Yes. A half-day Ziyarat car visits Quba Mosque, Mount Uhud, Qiblatain Mosque, and other sites with a knowledgeable driver and waiting time included." },
      { question: "Is taxi available in Madinah 24/7?", answer: "Yes, we operate around the clock in Madinah for airport transfers, hotel pickups, Ziyarat, and intercity trips — with your fare confirmed before you book, no surge." }
    ],
    testimonials: [
      { quote: "Arrived at Madinah airport late evening and the driver was waiting at arrivals. Quick, calm ride to our hotel by the Haram. Exactly the price quoted.", author: "Omar F.", location: "Leicester, UK", trip: "MED Airport → City" },
      { quote: "Took the Ziyarat tour — Quba, Uhud, Qiblatain. Our driver was knowledgeable and patient with the elderly in our family. Felt very well looked after.", author: "Sumaya I.", location: "Cape Town, South Africa", trip: "Madinah Ziyarat" },
      { quote: "Madinah to Makkah in a comfortable SUV with prayer stops along the way. Smooth, safe driving and a fair for the whole family.", author: "Abdullah R.", location: "Madinah", trip: "Madinah → Makkah" }
    ]
  },
  riyadh: {
    name: "Riyadh",
    nameAr: "الرياض",
    image: "/locations/riyadh-hero.webp",
    tagline: "The Saudi Capital",
    description: "Book a private taxi in Riyadh for airport transfers from King Khalid International Airport (RUH) (~35 km, ~45 min), business travel across KAFD, Olaya, and the Diplomatic Quarter, shopping trips, and intercity rides to Dammam (~400 km), Makkah, Jeddah, or Al Ahsa. Our professional drivers cover every Riyadh district 24/7, with hourly chauffeur charters for executives and meet & greet for arrivals. Whether you need a quick city ride, a full business day on hire, or a long-distance transfer, your fare is confirmed on WhatsApp before booking, with no surge pricing.",
    tldr: "Taxi Saudi Arabia arranges 24/7 private taxi and chauffeur service in Riyadh — King Khalid International Airport (RUH) transfers (~35 km, ~45 min), business travel across KAFD and Olaya, and intercity rides to Dammam (~400 km), Makkah, and Jeddah. Hourly charters and meet & greet available, quoted on WhatsApp.",
    tldrFacts: [
      { label: "Airport (RUH)", value: "~35 km · ~45 min" },
      { label: "To Dammam", value: "~400 km · ~4 hr" },
      { label: "Rush hours", value: "7–9am, 4–8pm" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "Kingdom Centre Tower", dist: "City Center" },
      { name: "King Abdullah Financial District (KAFD)", dist: "15 km" },
      { name: "Diriyah (At-Turaif District, UNESCO)", dist: "20 km" },
      { name: "Diplomatic Quarter (DQ)", dist: "12 km" },
      { name: "King Khalid Airport (RUH)", dist: "~35 km" },
      { name: "Boulevard City / Riyadh Season", dist: "18 km" }
    ],
    tips: [
      "Riyadh has heavy traffic between 7–9 AM and 4–8 PM. Book your taxi 30–45 minutes earlier than usual during these hours.",
      "Distances between Riyadh districts are large — always confirm the exact address and district with your driver.",
      "For a full day of meetings, an hourly chauffeur charter is more efficient than separate rides and avoids surge pricing.",
      "King Khalid International Airport (RUH) is about 35 km north of the centre — allow 45–60 minutes during peak hours."
    ],
    faqs: [
      { question: "How much is a taxi from Riyadh airport to the city?", answer: "A private taxi from King Khalid International Airport (RUH) to central Riyadh districts like Olaya or KAFD starts from around SAR 100 — message us on WhatsApp with your flight time for a clear quote. It is about 35 km and a 45-minute drive, with meet & greet at arrivals." },
      { question: "Can I hire a car with driver in Riyadh for a full day?", answer: "Yes. We arrange hourly and full-day chauffeur charters across Riyadh — ideal for business meetings, where the driver waits between stops and knows the fastest routes, avoiding ride-hailing surge pricing." },
      { question: "How far is Riyadh from Dammam by taxi?", answer: "Riyadh to Dammam is about 400 km — roughly a 4-hour drive on Highway 40. We arrange intercity transfers in sedans, SUVs, and vans with rest stops included, quoted on WhatsApp before booking." },
      { question: "Do you cover all Riyadh business districts?", answer: "Yes — KAFD, Olaya, the Diplomatic Quarter, Granada, and Diriyah are all covered 24/7. Share your exact district when booking so the driver plans the best route." },
      { question: "Is taxi available in Riyadh 24/7?", answer: "Yes, we operate around the clock in Riyadh for airport transfers, business travel, shopping, and intercity trips — with your fare confirmed before you book." }
    ],
    relatedLinks: [
      { href: "/services/car-recovery/riyadh", label: "Riyadh car recovery & tow truck (satha)" },
      { href: "/locations/riyadh/diriyah", label: "Riyadh to Diriyah taxi & heritage transfer" }
    ]
  },
  jeddah: {
    name: "Jeddah",
    nameAr: "جدة",
    image: "/locations/jeddah-hero.webp",
    tagline: "The Red Sea Gateway to Makkah & Madinah",
    description: "Book a private taxi in Jeddah for airport pickups from King Abdulaziz International Airport (JED), transfers to Makkah (~80 km, ~1 hour) and Madinah (~420 km, ~4–5 hours), and local rides around the Corniche, Al-Balad, and the city centre. Most Umrah and Hajj pilgrims arrive at Jeddah, making it the Kingdom's main gateway — our drivers handle 24/7 night arrivals, meet & greet, flight tracking, and Miqat stops for Ihram.",
    tldr: "Taxi Saudi Arabia provides 24/7 taxi and private-car service in Jeddah, including King Abdulaziz International Airport (JED) pickups and transfers to Makkah (~80 km, ~1 hour) and Madinah (~420 km, ~4–5 hours). Meet & greet, flight tracking, and English/Urdu-speaking drivers included.",
    tldrFacts: [
      { label: "To Makkah", value: "~80 km · ~1 hr" },
      { label: "To Madinah", value: "~420 km · ~4–5 hr" },
      { label: "Airport", value: "JED (24/7)" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "King Abdulaziz Airport (JED)", dist: "Gateway" },
      { name: "Jeddah Corniche & Waterfront", dist: "Coastal" },
      { name: "Historic Al-Balad (UNESCO Site)", dist: "City Center" },
      { name: "King Fahd's Fountain", dist: "Coastal" },
      { name: "Makkah (Masjid al-Haram)", dist: "~80 km" },
      { name: "Madinah (Masjid an-Nabawi)", dist: "~420 km" }
    ],
    tips: [
      "Jeddah Airport (JED) has Terminal 1 (the main terminal for Saudia and most international flights), the older North Terminal, and a dedicated Hajj Terminal. Tell us your terminal when booking.",
      "For Umrah, ask the driver to stop at the Miqat on the Jeddah–Makkah road so you can enter Ihram before reaching Makkah.",
      "Late-night flights are common at JED — pre-book so a driver with a name sign is waiting at arrivals, even at 2–4 AM.",
      "Traffic near the Corniche is heavy on Thursday and Friday evenings. Plan ahead."
    ],
    faqs: [
      { question: "How much is a taxi in Jeddah?", answer: "Jeddah city rides and airport pickups are with no surge. A Jeddah Airport (JED) to Makkah taxi starts from around SAR 249, and Jeddah to Madinah from around SAR 549. You see the exact fare before you book — tolls and taxes included." },
      { question: "Is there a taxi at Jeddah airport 24/7?", answer: "Yes. We operate at King Abdulaziz International Airport (JED) around the clock, including late-night and early-morning flights. We track your flight number, so your driver waits with a name sign even if the flight is delayed." },
      { question: "How far is Jeddah from Makkah by taxi?", answer: "Jeddah is about 80 km from Makkah — roughly a 1-hour drive on the Makkah Expressway. From Jeddah Airport (JED) it is a direct transfer, and the driver can stop at the Miqat for Ihram on request." },
      { question: "Can I book a Jeddah taxi in advance?", answer: "Yes, and for airport and Umrah transfers we recommend it. Pre-booking guarantees a vehicle and a clear price confirmed on WhatsApp, with meet & greet at arrivals — especially important during Umrah, Hajj, and Ramadan seasons." },
      { question: "Do the drivers speak English or Urdu?", answer: "Most of our Jeddah drivers speak English and Arabic, and many also speak Urdu — helpful for pilgrims from South Asia. You can request an Urdu-speaking driver when booking." }
    ],
    testimonials: [
      { quote: "Landed at Jeddah at 2 AM and the driver was waiting with my name sign. Stopped at the Miqat so we could enter Ihram, then straight to our Makkah hotel. Stress-free start to Umrah.", author: "Imran S.", location: "Birmingham, UK", trip: "JED → Makkah" },
      { quote: "Booked an SUV from the airport to Madinah for my parents and all the luggage. Comfortable, exactly the price we agreed on WhatsApp, and the driver took rest stops for prayer without us asking. Highly recommend.", author: "Aisha R.", location: "Toronto, Canada", trip: "JED → Madinah" },
      { quote: "Used them for a Corniche and Al-Balad day tour. The driver knew every spot and waited while we explored. Fair price as agreed, very polite. Will use again next visit.", author: "Khalid M.", location: "Jeddah", trip: "Jeddah City Tour" },
    ]
  },
  dammam: {
    name: "Dammam",
    nameAr: "الدمام",
    image: "/locations/dammam-hero.webp",
    tagline: "Eastern Province Capital",
    description: "Book a private taxi in Dammam for airport transfers from King Fahd International Airport (DMM) (~35 km, ~40 min), rides across the Dammam–Khobar–Dhahran metro area, corporate trips to Aramco and the industrial zones, hotel transfers, and cross-border journeys to Bahrain via the King Fahd Causeway (~1 hour). Our drivers know the Eastern Province well and provide 24/7 service for business travellers, families, and tourists heading to Half Moon Bay or Ithra. Every fare is confirmed on WhatsApp before you book, with tolls included and no surge pricing.",
    tldr: "Taxi Saudi Arabia arranges 24/7 private taxi service in Dammam — King Fahd International Airport (DMM) transfers (~35 km, ~40 min), rides across the Dammam–Khobar–Dhahran metro, hotel transfers, and cross-border trips to Bahrain via the King Fahd Causeway (~1 hour). Corporate and family vehicles available, quoted on WhatsApp.",
    tldrFacts: [
      { label: "Airport (DMM)", value: "~35 km · ~40 min" },
      { label: "To Bahrain", value: "~1 hr (Causeway)" },
      { label: "To Riyadh", value: "~400 km · ~4 hr" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "Half Moon Bay Beach", dist: "30 km" },
      { name: "King Abdulaziz Center for World Culture (Ithra)", dist: "20 km" },
      { name: "Dammam Corniche", dist: "City Center" },
      { name: "King Fahd Airport (DMM)", dist: "~35 km" },
      { name: "King Fahd Causeway (to Bahrain)", dist: "~50 km" },
      { name: "Dhahran / Aramco", dist: "15 km" }
    ],
    tips: [
      "Cross-border taxi to Bahrain via the King Fahd Causeway — contact us in advance so we can prepare the required travel documents.",
      "King Fahd International Airport (DMM) is about 40 minutes from Dammam city centre.",
      "Dammam, Khobar, and Dhahran form one metro area — confirm the exact district when booking.",
      "For Aramco and industrial-zone visits, pre-book a corporate sedan or SUV with a professional driver."
    ],
    faqs: [
      { question: "How much is a taxi from Dammam airport to the city?", answer: "A private taxi from King Fahd International Airport (DMM) to Dammam or Al Khobar starts from around SAR 100 — message us on WhatsApp with your flight time for a clear quote. It is about 35 km and a 40-minute drive, with meet & greet at arrivals." },
      { question: "Can I take a taxi from Dammam to Bahrain?", answer: "Yes. We arrange cross-border transfers to Bahrain via the King Fahd Causeway, roughly a 1-hour drive. Share your passport and visa details in advance so we can prepare the border paperwork." },
      { question: "How far is Dammam from Riyadh by taxi?", answer: "Dammam to Riyadh is about 400 km — roughly a 4-hour drive on Highway 40. We arrange intercity transfers in sedans, SUVs, and vans with rest stops included, quoted on WhatsApp before booking." },
      { question: "Do you serve the whole Dammam–Khobar–Dhahran area?", answer: "Yes — the three cities form one metropolitan area and we cover all of it 24/7, including Aramco, the corniche, business hotels, malls, and the industrial zones. Confirm your exact district when booking." },
      { question: "Is taxi available in Dammam 24/7?", answer: "Yes, we operate around the clock in the Eastern Province for airport transfers, corporate travel, hotel transfers, cross-border trips, and intercity journeys — with your fare confirmed before you book." },
      { question: "Can you arrange a hotel transfer within Dammam?", answer: "Yes. We arrange transfers between Dammam hotels, business districts, the airport, and the corniche — useful for conference attendees and business travellers moving between meetings." }
    ],
    relatedLinks: [
      { href: "/locations/dhahran", label: "Dhahran — Saudi Aramco & KFUPM taxi" },
      { href: "/locations/jubail", label: "Jubail — Industrial City taxi & corporate accounts" },
      { href: "/locations/alkhobar", label: "Al Khobar taxi & Bahrain causeway transfers" },
      { href: "/routes/dammam-to-manama", label: "Dammam to Manama, Bahrain taxi" },
      { href: "/routes/dammam-to-doha", label: "Dammam to Doha, Qatar taxi" },
      { href: "/services/car-recovery/dammam", label: "Dammam car recovery & tow truck (satha)" }
    ]
  },
  dhahran: {
    name: "Dhahran",
    nameAr: "الظهران",
    image: "/locations/dammam-hero.webp",
    tagline: "Home of Saudi Aramco & KFUPM",
    description: "Book a private taxi in Dhahran for transfers to and from King Fahd International Airport (DMM) (~25 km, ~25 min), corporate travel to Saudi Aramco headquarters, Dhahran Techno Valley, and King Fahd University of Petroleum & Minerals (KFUPM), plus connections to Dammam, Al Khobar, and Jubail. Our drivers know Aramco gate procedures, visitor-badge waiting areas, and shift-change traffic, and we offer monthly corporate accounts for contractors and companies who need consolidated billing instead of per-ride payment. Fares are fixed in advance with no surge pricing.",
    tldr: "Taxi Saudi Arabia arranges 24/7 private taxi service in Dhahran — King Fahd International Airport (DMM) transfers (~25 km, ~25 min), corporate transport to Saudi Aramco HQ and KFUPM, and connections to Dammam, Al Khobar, and Jubail. Monthly corporate billing available for contractor accounts.",
    tldrFacts: [
      { label: "Airport (DMM)", value: "~25 km · ~25 min" },
      { label: "To Al Khobar", value: "~15 km · ~15 min" },
      { label: "To Jubail", value: "~85 km · ~60 min" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "Saudi Aramco Headquarters", dist: "City Area" },
      { name: "KFUPM (King Fahd University)", dist: "3 km" },
      { name: "Dhahran Techno Valley", dist: "4 km" },
      { name: "Ithra (King Abdulaziz Center)", dist: "6 km" },
      { name: "King Fahd Airport (DMM)", dist: "~25 km" },
      { name: "Al Khobar / Dammam", dist: "~15–25 km" }
    ],
    tips: [
      "Aramco and KFUPM sites require visitor badges or gate clearance — share your host company and gate name when booking so the driver can plan the correct entry point and waiting area.",
      "King Fahd International Airport (DMM) is about 25 minutes from Dhahran — one of the shortest airport transfers in the Eastern Province.",
      "Contractors and companies can set up a monthly corporate account instead of paying per trip — ask about invoicing.",
      "Dhahran, Al Khobar, Dammam, and Jubail are all served by the same Eastern Province driver network for same-day bookings."
    ],
    faqs: [
      { question: "How much is a taxi from Dhahran to Dammam airport?", answer: "A taxi from Dhahran to King Fahd International Airport (DMM) starts from around SAR 100 for a sedan, with SUVs and vans available. It's about 25 km — roughly a 25-minute drive." },
      { question: "Do you offer corporate accounts for Saudi Aramco contractors?", answer: "Yes. We offer monthly corporate billing for contractors, consultants, and companies working with Saudi Aramco, KFUPM, or based in Dhahran Techno Valley — a dedicated account manager and consolidated invoicing instead of per-trip payment. Contact us via WhatsApp to set one up." },
      { question: "Can you pick up visitors from inside Aramco or KFUPM gates?", answer: "Share your host company, badge type, and gate name when booking so the driver can plan the correct visitor entry point and waiting area — some Aramco facilities have restricted access requiring advance notice." },
      { question: "How far is Dhahran from Al Khobar and Jubail?", answer: "Dhahran is about 15 km from Al Khobar (roughly 15 minutes) and 85 km from Jubail (roughly an hour). We serve all three cities with the same Eastern Province driver network." },
      { question: "Is taxi available in Dhahran 24/7?", answer: "Yes, we run 24/7 in Dhahran, including early-morning and late-night pickups for shift workers, contractors, and airport connections." }
    ]
  },
  jubail: {
    name: "Jubail",
    nameAr: "الجبيل",
    image: "/locations/dammam-hero.webp",
    tagline: "Saudi Arabia's Industrial Powerhouse",
    description: "Book a private taxi in Jubail for transfers to and from King Fahd International Airport (DMM) (~90 km, ~65 min), corporate travel across Jubail Industrial City I & II, contractor and camp transport for SABIC, Aramco, and Royal Commission (RCJY) sites, and connections to Dammam, Al Khobar, and Dhahran. Our drivers know the industrial zones, gate access points, and shift-change traffic patterns well, and we offer monthly corporate accounts for contractors who need daily, not per-ride, billing. Fares are fixed in advance with no surge pricing.",
    tldr: "Taxi Saudi Arabia arranges 24/7 private taxi service in Jubail — King Fahd International Airport (DMM) transfers (~90 km, ~65 min), corporate and contractor transport across Jubail Industrial City, and connections to Dammam, Al Khobar, and Dhahran. Monthly corporate billing available for contractor accounts.",
    tldrFacts: [
      { label: "Airport (DMM)", value: "~90 km · ~65 min" },
      { label: "To Dammam", value: "~90 km · ~65 min" },
      { label: "To Al Khobar", value: "~75 km · ~55 min" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "Jubail Industrial City I & II", dist: "City Area" },
      { name: "SABIC Headquarters", dist: "5 km" },
      { name: "Jubail Corniche", dist: "City Center" },
      { name: "Al-Fanateer Beach", dist: "8 km" },
      { name: "King Fahd Airport (DMM)", dist: "~90 km" },
      { name: "Dammam / Al Khobar", dist: "~90 km" }
    ],
    tips: [
      "Jubail Industrial City has restricted gate access at several plants — share your company/site name when booking so the driver can plan the correct entry point.",
      "King Fahd International Airport (DMM) is about 65 minutes from Jubail — allow extra buffer time around shift-change hours.",
      "Contractors and companies can set up a monthly corporate account instead of paying per trip — ask about invoicing.",
      "Jubail, Dammam, Al Khobar, and Dhahran are all served by the same Eastern Province driver network for same-day bookings."
    ],
    faqs: [
      { question: "How much is a taxi from Jubail to Dammam airport?", answer: "A taxi from Jubail to King Fahd International Airport (DMM) starts from around SAR 250 for a sedan, with SUVs and vans available for groups. It's about 90 km — roughly a 65-minute drive." },
      { question: "Do you offer corporate accounts for Jubail Industrial City companies?", answer: "Yes. We offer monthly corporate billing for contractors and companies operating in Jubail Industrial City I & II — a dedicated account manager and consolidated invoicing instead of per-trip payment. Contact us via WhatsApp to set one up." },
      { question: "Is taxi available in Jubail 24/7, including night shifts?", answer: "Yes, we run 24/7 in Jubail, including early-morning and night shift-change hours for plant workers and contractors." },
      { question: "How far is Jubail from Al Khobar and Dammam?", answer: "Jubail is about 75 km from Al Khobar and 90 km from Dammam — both roughly an hour's drive. We serve all three cities with the same Eastern Province driver network." },
      { question: "Can you pick up from inside Jubail Industrial City plants?", answer: "Yes. Share your company name and gate/site location when booking so the driver can plan the correct access route — some plants have restricted entry points." }
    ],
    relatedLinks: [
      { href: "/locations/dhahran", label: "Dhahran — Saudi Aramco & KFUPM taxi" },
      { href: "/locations/dammam", label: "Dammam taxi & King Fahd Airport transfers" },
      { href: "/routes/dammam-airport-to-jubail", label: "Dammam Airport to Jubail transfer" },
      { href: "/services/car-recovery/jubail", label: "Jubail car recovery & tow truck (satha)" }
    ]
  },
  alula: {
    name: "AlUla",
    nameAr: "العلا",
    image: "/locations/alula-hero.webp",
    tagline: "Saudi Arabia's Archaeological Wonder",
    description: "Book a taxi or full-day car hire in AlUla to visit Hegra (Mada'in Salih), Elephant Rock, Maraya, Dadan, and the Old Town. Our drivers provide comfortable transport between AlUla International Airport (ULH), luxury resorts, and all the heritage sites, which are spread across the valley. AlUla is best visited between October and March, and a private SUV with a driver is the easiest way to link the widely spaced attractions at your own pace, with waiting time included. We also offer road transfers to and from Madinah (~330 km, ~3.5 hours) for pilgrims combining Ziyarat with a heritage trip.",
    tldr: "Taxi Saudi Arabia provides taxi and full-day car hire in AlUla — airport (ULH) transfers, resort pickups, and guided sightseeing across Hegra, Dadan, Elephant Rock, and Maraya. An SUV with driver is the most comfortable way to link the spread-out sites; road transfers to Madinah (~330 km) also available.",
    tldrFacts: [
      { label: "UNESCO site", value: "Hegra (22 km)" },
      { label: "Airport", value: "ULH" },
      { label: "Best season", value: "Oct–Mar" },
      { label: "To Madinah", value: "~330 km · ~3.5 hr" }
    ],
    attractions: [
      { name: "Hegra — Mada'in Salih (UNESCO)", dist: "22 km" },
      { name: "Elephant Rock (Jabal Al-Fil)", dist: "10 km" },
      { name: "Maraya Concert Hall", dist: "15 km" },
      { name: "AlUla Old Town", dist: "5 km" },
      { name: "Dadan & Jabal Ikmah", dist: "18 km" },
      { name: "AlUla Airport (ULH)", dist: "35 km" }
    ],
    tips: [
      "Book your AlUla taxi in advance — the area is popular and vehicles fill up fast during festivals and the cooler season.",
      "Many resorts and sites are spread across desert terrain. An SUV is the most comfortable option.",
      "Visit between October and March; summer temperatures regularly exceed 40°C.",
      "A full-day car with waiting time is the easiest way to combine Hegra, Dadan, and Elephant Rock in one trip."
    ],
    faqs: [
      { question: "How do I get around AlUla's attractions?", answer: "The sites are spread across the valley, so a private car or SUV with a driver is the most comfortable option. A full-day hire links Hegra, Dadan, Elephant Rock, and the Old Town with waiting time at each stop." },
      { question: "How far is Hegra from AlUla town?", answer: "Hegra (Mada'in Salih), Saudi Arabia's first UNESCO World Heritage Site, is about 22 km from the centre of AlUla — an easy drive with your booked car." },
      { question: "Can I get a taxi from AlUla airport to my resort?", answer: "Yes. We provide transfers from AlUla International Airport (ULH) to the resorts and hotels, and onward sightseeing trips. Pre-booking is recommended during festival season." },
      { question: "What is the best time to visit AlUla?", answer: "October to March, when daytime temperatures are a comfortable 15–25°C. Summers are very hot, so the cooler months are best for outdoor heritage sites." },
      { question: "Can I travel between AlUla and Madinah by car?", answer: "Yes. We offer road transfers between AlUla and Madinah, about 330 km and roughly a 3.5-hour drive — popular with pilgrims adding a heritage trip to their Ziyarat." }
    ],
    relatedLinks: [
      { href: "/routes/alula-airport-to-banyan-tree", label: "AlUla Airport to Banyan Tree AlUla — private VIP transfer" },
      { href: "/routes/alula-airport-to-resorts", label: "AlUla Airport to Resorts" },
      { href: "/routes/madinah-to-alula", label: "Madinah to AlUla taxi" },
      { href: "/fleet/mercedes-s-class", label: "Mercedes S-Class — VIP Executive Sedan" }
    ]
  },
  taif: {
    name: "Taif",
    nameAr: "الطائف",
    image: "/locations/taif-hero.webp",
    tagline: "The City of Roses",
    description: "Book a private taxi in Taif for day trips from Makkah (~90 km, ~1 hour 10) and Jeddah (~170 km), mountain tours along the scenic Al Hada road, and visits to the famous rose farms. Taif's cool climate makes it a favourite summer escape, and our drivers know the steep, winding Sarawat mountain routes well. We provide airport transfers from Taif Regional Airport (TIF), pilgrim transfers, and full-day car hire for families touring Al Hada, Al Shafa, and the cable car — all with your fare confirmed before you book, no surge.",
    tldr: "Taxi Saudi Arabia arranges private taxi service in Taif — day trips from Makkah (~90 km, ~1 hr 10) and Jeddah (~170 km), Taif Regional Airport (TIF) transfers, and mountain tours along the Al Hada and Al Shafa roads. Experienced drivers for the winding Sarawat routes.",
    tldrFacts: [
      { label: "To Makkah", value: "~90 km · ~1 hr 10" },
      { label: "To Jeddah", value: "~170 km · ~2 hr" },
      { label: "Airport", value: "TIF" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "Al Hada Mountain & Cable Car", dist: "10 km" },
      { name: "Shubra Palace", dist: "City Center" },
      { name: "Al Rudaf Park", dist: "5 km" },
      { name: "Al Shafa Highlands", dist: "25 km" },
      { name: "Taif Rose Farms", dist: "20 km" },
      { name: "Taif Regional Airport (TIF)", dist: "~25 km" }
    ],
    tips: [
      "Taif is a popular summer escape — book early during the Taif Season festival.",
      "The Makkah–Taif mountain road (Al Hada) is steep and winding; an experienced driver is recommended.",
      "Spring (March–April) is the rose-harvest season — ideal for visiting the rose farms and distilleries.",
      "Combine a Makkah Ziyarat trip with a cool day out in Taif using a full-day car hire."
    ],
    faqs: [
      { question: "How much is a taxi from Makkah to Taif?", answer: "A taxi from Makkah to Taif starts from around SAR 180. It is about 90 km — roughly a 1 hour 10 minute drive on the Al Hada mountain road, with an experienced driver for the winding route." },
      { question: "How far is Taif from Jeddah by taxi?", answer: "Taif is about 170 km from Jeddah — roughly a 2-hour drive. We offer transfers and full-day car hire for sightseeing in the Taif highlands." },
      { question: "Can I do a day trip to Taif from Makkah?", answer: "Yes. A full-day car with a driver lets you visit Al Hada, the cable car, Al Shafa, and the rose farms, then return — a cool, scenic break from the Makkah heat." },
      { question: "Does Taif have an airport?", answer: "Yes, Taif Regional Airport (TIF) is about 25 km from the city. We provide meet & greet transfers from the airport to the city and the mountain resorts." },
      { question: "Is taxi available in Taif 24/7?", answer: "Yes, we operate around the clock in Taif for airport transfers, day trips, and mountain tours — with your fare confirmed on WhatsApp before you book." }
    ]
  },
  alkhobar: {
    name: "Al Khobar",
    nameAr: "الخبر",
    image: "/locations/alkhobar-hero.webp",
    tagline: "Eastern Province Waterfront",
    description: "Book a private taxi in Al Khobar for corporate trips, Corniche outings, airport transfers from King Fahd International Airport (DMM) (~30 km), and cross-border journeys to Bahrain via the King Fahd Causeway (~1 hour). Al Khobar sits within the Dammam–Khobar–Dhahran metro area and is a hub for Aramco and business travellers. Our professional drivers provide reliable 24/7 service across the Eastern Province, with corporate sedans, family SUVs, and Causeway border assistance — all with your fare confirmed before you book, no surge.",
    tldr: "Taxi Saudi Arabia arranges 24/7 private taxi service in Al Khobar — King Fahd International Airport (DMM) transfers (~30 km), corporate and Corniche rides, and cross-border trips to Bahrain via the King Fahd Causeway (~1 hour). Part of the Dammam–Khobar–Dhahran metro coverage.",
    tldrFacts: [
      { label: "Airport (DMM)", value: "~30 km · ~35 min" },
      { label: "To Bahrain", value: "~1 hr (Causeway)" },
      { label: "Causeway", value: "~25 km" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "Khobar Corniche", dist: "Coastal" },
      { name: "King Fahd Causeway (to Bahrain)", dist: "25 km" },
      { name: "Al Rashid Mall", dist: "City Center" },
      { name: "Half Moon Bay", dist: "20 km" },
      { name: "Dhahran / Aramco", dist: "12 km" },
      { name: "King Fahd Airport (DMM)", dist: "~30 km" }
    ],
    tips: [
      "Cross-border trips to Bahrain via the Causeway — share your travel documents in advance.",
      "Khobar, Dammam, and Dhahran form one metro area; confirm the exact district when booking.",
      "For Aramco and corporate visits, pre-book a sedan or SUV with a professional driver.",
      "The Khobar Corniche is busy on Thursday and Friday evenings — allow extra time."
    ],
    faqs: [
      { question: "Can I take a taxi from Al Khobar to Bahrain?", answer: "Yes. We run cross-border transfers from Al Khobar to Bahrain via the King Fahd Causeway, roughly a 1-hour drive. Share your passport and visa details in advance so we can prepare the border paperwork." },
      { question: "How much is a taxi from Al Khobar to Dammam airport?", answer: "A taxi from Al Khobar to King Fahd International Airport (DMM) starts from around SAR 100. It is about 30 km and a 35-minute drive, with meet & greet at arrivals." },
      { question: "Do you provide corporate taxi service in Al Khobar?", answer: "Yes. We offer corporate sedans and SUVs with professional drivers for Aramco, Dhahran, and business travel across the Eastern Province, with hourly and full-day options." },
      { question: "Is Al Khobar part of the same area as Dammam?", answer: "Yes — Al Khobar, Dammam, and Dhahran form one connected metro area. We cover all of it 24/7; just confirm your exact district when booking." },
      { question: "Is taxi available in Al Khobar 24/7?", answer: "Yes, we operate around the clock in Al Khobar for airport transfers, corporate travel, Corniche outings, and cross-border trips — with your fare confirmed before you book, no surge." }
    ]
  },
  yanbu: {
    name: "Yanbu",
    nameAr: "ينبع",
    image: "/locations/yanbu-hero.webp",
    tagline: "Red Sea Diving & Industrial Hub",
    description: "Book a private taxi in Yanbu for airport transfers, Red Sea diving and beach trips, and intercity rides to Madinah (~240 km, ~2.5 hours) and Jeddah (~330 km). Yanbu is both a popular pilgrim gateway and a major industrial hub, so our professional drivers serve Yanbu Al-Bahr (the city), Yanbu Industrial City, and the resorts along the coast. Whether you are a pilgrim heading to Madinah, a diver visiting Sharm Yanbu, or a contractor working in the industrial zone, fares are fixed in advance with no surge pricing.",
    tldr: "Taxi Saudi Arabia arranges private taxi service in Yanbu — airport transfers, Red Sea diving and beach trips, and intercity rides to Madinah (~240 km, ~2.5 hours) and Jeddah (~330 km). Drivers cover both Yanbu Al-Bahr and the Industrial City.",
    tldrFacts: [
      { label: "To Madinah", value: "~240 km · ~2.5 hr" },
      { label: "To Jeddah", value: "~330 km · ~3.5 hr" },
      { label: "Airport", value: "YNB" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "Yanbu Corniche", dist: "Coastal" },
      { name: "Yanbu Industrial City", dist: "15 km" },
      { name: "Sharm Yanbu Diving Sites", dist: "Coastal" },
      { name: "Yanbu Al-Bahr Old Town", dist: "City Center" },
      { name: "Prince Abdul Mohsin Airport (YNB)", dist: "~12 km" },
      { name: "Madinah (Masjid an-Nabawi)", dist: "~240 km" }
    ],
    tips: [
      "Yanbu to Madinah is a popular pilgrim route (about 240 km, ~2.5 hours).",
      "Confirm whether you need Yanbu Al-Bahr (city) or the Industrial City — they are far apart.",
      "For diving trips, book a vehicle with luggage room for equipment.",
      "Pre-book your Madinah transfer in advance during Umrah and Hajj seasons."
    ],
    faqs: [
      { question: "How far is Yanbu from Madinah by taxi?", answer: "Yanbu to Madinah is about 240 km — roughly a 2.5-hour drive. It is a popular pilgrim route, and we offer transfers in sedans, SUVs, and vans with prayer and rest stops." },
      { question: "Can I get a taxi from Yanbu to Jeddah?", answer: "Yes. Yanbu to Jeddah is about 330 km, roughly a 3.5-hour drive along the Red Sea coast. We provide intercity transfers with comfortable vehicles for the journey." },
      { question: "Do you serve both Yanbu city and the Industrial City?", answer: "Yes — we cover Yanbu Al-Bahr (the city), Yanbu Industrial City, and the coastal resorts. The two areas are far apart, so confirm your exact location when booking." },
      { question: "Is there a taxi for Yanbu diving and beach trips?", answer: "Yes. We provide day trips to Sharm Yanbu and the coastal diving and beach spots, with vehicles that have room for diving equipment and luggage." },
      { question: "Is taxi available in Yanbu 24/7?", answer: "Yes, we operate around the clock in Yanbu for airport transfers, pilgrim routes to Madinah, and intercity travel — with your fare confirmed on WhatsApp before you book." }
    ]
  },
  neom: {
    name: "NEOM",
    nameAr: "نيوم",
    image: "/locations/neom-hero.webp",
    tagline: "Saudi Arabia's Giga-Project & Future Region",
    description: "Book a private taxi or executive chauffeur in NEOM and the surrounding Tabuk region. We provide reliable private transport for corporate visits, contractor site travel, and airport transfers connecting Tabuk Regional Airport (TUU), NEOM Bay Airport (NUM), and Red Sea International Airport (RSI) to key destination zones including The Line, Oxagon, Trojena, Sindalah Island, and Sharma. Whether traveling for business or tourism, our professional drivers offer executive sedans and spacious SUVs at fixed, transparent fares with no surge pricing.",
    tldr: "Taxi Saudi Arabia provides private taxi and executive chauffeur services across NEOM and the Tabuk region — serving Tabuk Airport (TUU), NEOM Bay Airport (NUM), and Red Sea International (RSI) transfers to The Line, Oxagon, Trojena, Sindalah, and Sharma.",
    tldrFacts: [
      { label: "Main airports", value: "Tabuk (TUU) & RSI" },
      { label: "Key destinations", value: "The Line, Oxagon, Trojena" },
      { label: "Coast & islands", value: "Sindalah & Gulf of Aqaba" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "The Line", dist: "Project Zone" },
      { name: "Oxagon", dist: "Industrial Zone" },
      { name: "Trojena", dist: "Mountain Zone" },
      { name: "Sindalah Island", dist: "Luxury Island" },
      { name: "NEOM Bay & Sharma", dist: "Coastal Hub" },
      { name: "Tabuk Airport (TUU)", dist: "Regional Hub (~120 km)" }
    ],
    tips: [
      "NEOM covers a vast area — provide your specific destination or gate access point when requesting a transfer.",
      "Tabuk Airport (TUU) is the primary regional air gateway (~120 km), while NEOM Bay (NUM) and Red Sea International (RSI) also serve the region.",
      "Given the long highway distances across the region, executive SUVs (e.g. GMC Yukon XL) provide optimal comfort.",
      "Corporate invoicing is available for business accounts on request.",
      "Confirm any required site entry clearance with your host before travel."
    ],
    faqs: [
      { question: "How can I book a private taxi or executive car in NEOM?", answer: "You can book directly online via our booking page or request a customized quote on WhatsApp for executive chauffeured vehicles, airport pickups, or multi-day business transportation." },
      { question: "Do you provide airport transfers from Tabuk Airport to NEOM?", answer: "Yes, we operate private airport transfers from Tabuk Regional Airport (TUU) directly to NEOM project sites and coastal hubs (~120 km). A clear quote is provided on WhatsApp prior to booking." },
      { question: "Can I book a private car for business travel in NEOM?", answer: "Yes. We offer executive sedans and spacious SUVs with professional drivers for contractor site visits, corporate delegations, and regional business travel across NEOM and Tabuk." },
      { question: "Which NEOM destinations do your private transfers cover?", answer: "Our private transport services cover the entire NEOM corridor, including connections toward The Line, Oxagon, Trojena, Sindalah Island, Sharma, and Tabuk City." },
      { question: "Is private transport available in NEOM 24/7?", answer: "Yes, we provide round-the-clock private transfer and executive car services across NEOM and the Tabuk region at pre-confirmed fixed fares." }
    ],
    relatedLinks: [
      { href: "/routes/tabuk-airport-to-neom", label: "Tabuk Airport to NEOM transfer" },
      { href: "/routes/red-sea-airport-to-neom", label: "Red Sea Airport to NEOM transfer" },
      { href: "/routes/riyadh-to-neom", label: "Riyadh to NEOM long-distance taxi" },
      { href: "/routes/jeddah-to-neom", label: "Jeddah to NEOM long-distance taxi" },
      { href: "/airports/tabuk-regional", label: "Tabuk Regional Airport (TUU)" },
      { href: "/airports/red-sea", label: "Red Sea International Airport (RSI)" },
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL — Family & Group SUV" },
      { href: "/fleet/mercedes-s-class", label: "Mercedes S-Class — VIP Executive Sedan" }
    ]
  },
  abha: {
    name: "Abha",
    nameAr: "أبها",
    image: "/locations/abha-hero.webp",
    tagline: "The Misty Mountain City of Asir",
    description: "Book a private taxi in Abha for mountain tours, Soudah Peak trips, airport transfers from Abha International Airport (AHB), and rides across the Asir region including Khamis Mushait. Abha sits high in the Sarawat mountains and stays cool and misty year-round, making it Saudi Arabia's most popular summer escape. Our drivers are experienced on the steep, winding high-altitude roads and provide comfortable SUVs for families touring Soudah, the cable cars, and the heritage villages — all with your fare confirmed before you book, no surge.",
    tldr: "Taxi Saudi Arabia arranges private taxi service in Abha — Abha International Airport (AHB) transfers, Soudah Peak and cable-car trips, and rides across the Asir region including Khamis Mushait. Experienced drivers for the cool, misty high-altitude mountain roads.",
    tldrFacts: [
      { label: "Airport", value: "AHB" },
      { label: "Soudah Peak", value: "~25 km" },
      { label: "To Khamis Mushait", value: "~25 km" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "Soudah Peak & Cable Car", dist: "25 km" },
      { name: "Abha Dam Lake", dist: "City Center" },
      { name: "Green Mountain (Al Jabal Al Akhdar)", dist: "5 km" },
      { name: "Habala Heritage Village", dist: "50 km" },
      { name: "Abha International Airport (AHB)", dist: "~25 km" },
      { name: "Khamis Mushait", dist: "~25 km" }
    ],
    tips: [
      "Abha is cool and misty year-round — very popular in summer, so book ahead during the Asir season.",
      "Mountain roads to Soudah are steep; an SUV is the most comfortable choice.",
      "Abha International Airport (AHB) is about 25 km from the city — pre-book your meet & greet transfer.",
      "Combine Soudah, the cable car, and Habala village in a full-day car hire for the best value."
    ],
    faqs: [
      { question: "How much is a taxi from Abha airport to the city?", answer: "A taxi from Abha International Airport (AHB) to the city centre starts from around SAR 80. It is about 25 km, with meet & greet at arrivals and experienced mountain drivers." },
      { question: "Can I do a Soudah Peak day trip from Abha?", answer: "Yes. A full-day car with a driver takes you to Soudah Peak, the cable car, and the viewpoints, then back — the easiest way to enjoy the highlands without driving the steep roads yourself." },
      { question: "Is an SUV better for Abha's mountain roads?", answer: "Yes. The roads to Soudah and the Asir highlands are steep and winding, so a comfortable SUV with an experienced local driver is recommended, especially for families." },
      { question: "Does the taxi cover Khamis Mushait too?", answer: "Yes — Abha and Khamis Mushait are about 25 km apart and we cover both, along with the Asir heritage villages and viewpoints, 24/7 with your fare confirmed on WhatsApp." },
      { question: "Is taxi available in Abha 24/7?", answer: "Yes, we operate around the clock in Abha for airport transfers, mountain tours, and rides across the Asir region — with your fare confirmed on WhatsApp before you book." }
    ]
  },
  tabuk: {
    name: "Tabuk",
    nameAr: "تبوك",
    image: "/locations/tabuk-hero.webp",
    tagline: "Gateway to NEOM, the Red Sea & the Jordan Border",
    description: "Book a taxi or executive car in Tabuk for airport transfers, business trips to NEOM, and cross-border journeys to Jordan via the Al Durrah crossing near Haql. Tabuk is the main air and road gateway to the NEOM giga-project, the Red Sea coast, and AlUla, making it a key hub for contractors, investors, and tourists heading north. Our drivers cover Tabuk Regional Airport (TUU), the historic Old Town and Tabuk Castle, Wadi Disah, Tayma, and the coastal towns of Haql and Duba — all with your fare confirmed before you book, no surge, day or night.",
    tldr: "Taxi Saudi Arabia arranges private taxi and executive-car service in Tabuk — Tabuk Regional Airport (TUU) transfers, business trips to NEOM (~120 km), Red Sea coast runs to Duba and Haql, and cross-border transfers to the Jordan (Aqaba) border.",
    tldrFacts: [
      { label: "Airport", value: "TUU" },
      { label: "To NEOM", value: "~120 km" },
      { label: "To Jordan border", value: "~130 km" },
      { label: "Pricing", value: "Quoted on WhatsApp" }
    ],
    attractions: [
      { name: "Tabuk Castle & Old Town", dist: "City Center" },
      { name: "Wadi Disah (Disah Valley)", dist: "~85 km" },
      { name: "Tayma Oasis", dist: "~90 km" },
      { name: "Haql & Gulf of Aqaba Coast", dist: "~130 km" },
      { name: "Tabuk Regional Airport (TUU)", dist: "~7 km" },
      { name: "NEOM Bay", dist: "~120 km" }
    ],
    tips: [
      "Tabuk Regional Airport (TUU) is the main air gateway for NEOM and the northern Red Sea coast — pre-book your meet & greet transfer.",
      "Cross-border trips to Jordan via the Al Durrah/Haql crossing need valid travel documents — confirm details when booking.",
      "Wadi Disah and Tayma are full-day trips — an executive SUV is the most comfortable option for the desert roads.",
      "Business and NEOM site visits are common — share your exact site or gate access details in advance."
    ],
    faqs: [
      { question: "How do I get from Tabuk Airport to NEOM?", answer: "We run transfers from Tabuk Regional Airport (TUU) directly to NEOM and NEOM Bay, about 120 km away — the main route used by contractors, investors, and visitors reaching the project." },
      { question: "Can I cross the border to Jordan from Tabuk?", answer: "Yes, we offer cross-border transfers from Tabuk to the Jordan border near Haql (Al Durrah crossing) and onward toward Aqaba, about 130 km from Tabuk city. Valid travel documents are required." },
      { question: "Is Tabuk a good base for visiting the Red Sea and AlUla?", answer: "Yes — Tabuk is the closest major airport hub to the Red Sea coast (Duba, Haql) and within reach of AlUla, making it a common stop for premium tourism and NEOM-related travel." },
      { question: "How much is a taxi from Tabuk Airport to the city?", answer: "A taxi from Tabuk Regional Airport (TUU) to the city centre is about 7 km, with meet & greet at arrivals and no surge pricing." },
      { question: "Is executive transport available in Tabuk 24/7?", answer: "Yes, we provide round-the-clock taxi and executive car service in Tabuk for airport transfers, NEOM business trips, and cross-border journeys — with your fare confirmed on WhatsApp before you book." }
    ],
    relatedLinks: [
      { href: "/locations/neom", label: "NEOM transportation guide" },
      { href: "/routes/tabuk-airport-to-neom", label: "Tabuk Airport to NEOM transfer" },
      { href: "/routes/tabuk-to-aqaba", label: "Tabuk to Aqaba border transfer" }
    ]
  }
};
