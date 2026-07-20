export const SUB_AREAS: Record<string, {
  city: string;
  subarea: string;
  name: string;
  nameAr: string;
  description: string;
  // Optional rich fields (populated per city — programmatic Wave 3).
  airportMin?: string;
  makkahMin?: string;
  // Optional label overrides for the Travel-Times card (defaults: JED airport + Makkah Haram).
  airportLabel?: string;
  nearLabel?: string;
  landmarks?: string[];
  popularFor?: string;
  tldr?: string;
  tldrFacts?: { label: string; value: string }[];
  faqs?: { question: string; answer: string }[];
}> = {
  // Riyadh
  "kafd": {
    city: "riyadh", subarea: "kafd", name: "KAFD (King Abdullah Financial District)", nameAr: "مركز الملك عبدالله المالي",
    description: "Premium executive chauffeur and corporate account transport for banks, funds, and companies based in KAFD.",
    airportMin: "~30 min", makkahMin: "—", airportLabel: "King Khalid Airport (RUH)", popularFor: "Corporate accounts, executive chauffeur, banks & funds",
    landmarks: ["KAFD Conference Center", "Zone A/B/C office towers", "KAFD Metro Station"],
    tldr: "A chauffeur in KAFD, Riyadh is fixed-price and available 24/7, built for corporate accounts and executive travel. It is about 30 minutes from King Khalid International Airport (RUH), with monthly billing available for companies.",
    tldrFacts: [{ label: "To RUH", value: "~30 min" }, { label: "Pricing", value: "Fixed / Corporate" }, { label: "Hours", value: "24/7" }, { label: "Fleet", value: "Executive sedan/SUV" }],
    faqs: [
      { question: "Do you offer corporate accounts for companies in KAFD?", answer: "Yes. We set up monthly-billed corporate accounts for banks, funds, and firms based in KAFD, with dedicated executive drivers and fixed-price rides." },
      { question: "How far is KAFD from Riyadh airport?", answer: "KAFD is about 30 minutes from King Khalid International Airport (RUH), with meet & greet executive transfers." },
      { question: "Can you provide a dedicated driver for daily office pickups in KAFD?", answer: "Yes, we arrange dedicated chauffeurs on daily or monthly contracts for executives commuting to and from KAFD offices." },
    ],
  },
  "olaya": {
    city: "riyadh", subarea: "olaya", name: "Olaya", nameAr: "العليا",
    description: "Reliable fixed-price taxi and executive transport in Olaya, Riyadh's central business and hotel district.",
    airportMin: "~30 min", makkahMin: "—", airportLabel: "King Khalid Airport (RUH)", popularFor: "Business hotels, offices, Kingdom Centre & Al Faisaliah towers",
    landmarks: ["Kingdom Centre Tower", "Al Faisaliah Tower", "Olaya Street business district"],
    tldr: "A taxi in Olaya, Riyadh's commercial heart, is fixed-price and available 24/7. Olaya is about 30 minutes from King Khalid International Airport (RUH), close to Kingdom Centre and Al Faisaliah Tower.",
    tldrFacts: [{ label: "To RUH", value: "~30 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }, { label: "Popular for", value: "Business hotels" }],
    faqs: [
      { question: "How far is Olaya from Riyadh airport?", answer: "Olaya is about 30 minutes from King Khalid International Airport (RUH), with fixed-price meet & greet transfers." },
      { question: "Do you pick up from Olaya business hotels?", answer: "Yes, we provide door-to-door pickups across Olaya including hotels near Kingdom Centre and Al Faisaliah Tower, 24/7." },
      { question: "Can I book an executive car for Olaya business meetings?", answer: "Yes, executive sedans and SUVs are available on fixed-price or hourly hire for business travel around Olaya." },
    ],
  },
  "diplomatic-quarter": {
    city: "riyadh", subarea: "diplomatic-quarter", name: "Diplomatic Quarter (DQ)", nameAr: "الحي الدبلوماسي",
    description: "Discreet, security-conscious luxury chauffeur services for embassies, delegations, and residents of the Diplomatic Quarter.",
    airportMin: "~35 min", makkahMin: "—", airportLabel: "King Khalid Airport (RUH)", popularFor: "Embassies, delegations, discreet executive travel",
    landmarks: ["Diplomatic Quarter embassies", "DQ Park", "King Fahd National Library (nearby)"],
    tldr: "A chauffeur in the Diplomatic Quarter (DQ), Riyadh is fixed-price, discreet, and available 24/7 — suited to embassy and delegation travel. It is about 35 minutes from King Khalid International Airport (RUH).",
    tldrFacts: [{ label: "To RUH", value: "~35 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }, { label: "Fleet", value: "Luxury sedan/SUV" }],
    faqs: [
      { question: "Do you serve embassies and delegations in the Diplomatic Quarter?", answer: "Yes, we provide discreet, professionally driven luxury vehicles for embassy staff, delegations, and DQ residents, with security-conscious drivers." },
      { question: "How far is the Diplomatic Quarter from Riyadh airport?", answer: "The Diplomatic Quarter is about 35 minutes from King Khalid International Airport (RUH), with fixed-price executive transfers." },
      { question: "Can I book a chauffeur for multi-day delegation visits?", answer: "Yes, we arrange dedicated chauffeurs on daily contracts for visiting delegations and official guests in DQ." },
    ],
  },
  "al-malaz": { city: "riyadh", subarea: "al-malaz", name: "Al Malaz", nameAr: "الملز", description: "Local and intercity taxi bookings from Al Malaz, Riyadh." },
  "al-murabba": { city: "riyadh", subarea: "al-murabba", name: "Al Murabba", nameAr: "المربع", description: "Historical Al Murabba taxi and private transport services." },
  "diriyah": { city: "riyadh", subarea: "diriyah", name: "Diriyah", nameAr: "الدرعية", description: "Heritage tours and luxury transfers to At-Turaif and Diriyah." },
  // Jeddah (Wave 3 — rich programmatic pages)
  "al-balad": {
    city: "jeddah", subarea: "al-balad", name: "Al Balad (Historical Jeddah)", nameAr: "البلد",
    description: "Book a fixed-price taxi in Al Balad, the UNESCO-listed historic heart of Jeddah, with door-to-door pickup from the old souks and coral-stone houses.",
    airportMin: "~30 min", makkahMin: "~1 hr", popularFor: "Heritage tourism, souks, museums",
    landmarks: ["Al-Balad UNESCO Old Town", "Naseef House", "Souq Al-Alawi", "Bab Makkah"],
    tldr: "A taxi in Al Balad, historic Jeddah, is fixed-price and available 24/7. It is about 30 minutes to King Abdulaziz Airport (JED) and roughly 1 hour to Makkah, with door-to-door pickup from the old town.",
    tldrFacts: [{ label: "To JED", value: "~30 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Balad from Jeddah airport?", answer: "Al Balad is about 30 minutes from King Abdulaziz International Airport (JED) by taxi, depending on traffic. We offer fixed-price meet & greet transfers both ways." },
      { question: "Can I get a taxi from Al Balad to Makkah?", answer: "Yes. Al Balad to Makkah is roughly a 1-hour drive (~85 km). The fixed fare is confirmed before booking, with an optional Miqat stop for Ihram." },
      { question: "Is taxi pickup available inside the old town?", answer: "Yes, we pick up door-to-door from hotels, souks, and landmarks across Al Balad, 24/7." },
    ],
  },
  "corniche": {
    city: "jeddah", subarea: "corniche", name: "Jeddah Corniche", nameAr: "كورنيش جدة",
    description: "Scenic rides and immediate fixed-price pickups along the Jeddah Corniche and waterfront, from King Fahd's Fountain to the Floating Mosque.",
    airportMin: "~25 min", makkahMin: "~1 hr 10 min", popularFor: "Waterfront leisure, dining, family outings",
    landmarks: ["King Fahd's Fountain", "Al-Rahma (Floating) Mosque", "Jeddah Waterfront", "Jeddah Corniche Circuit"],
    tldr: "A taxi along the Jeddah Corniche is fixed-price and available 24/7. The waterfront is about 25 minutes from King Abdulaziz Airport (JED) and roughly 1 hour 10 minutes to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~1 hr 10 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is the Jeddah Corniche from the airport?", answer: "The Corniche is about 25 minutes from King Abdulaziz International Airport (JED) by taxi, depending on traffic and which section of the waterfront you need." },
      { question: "Can you pick up along the Corniche at night?", answer: "Yes, we operate 24/7 with fixed prices and quick pickups anywhere along the Jeddah Corniche and waterfront." },
      { question: "Do you offer Corniche sightseeing rides?", answer: "Yes, we provide hourly hire and city-tour rides covering King Fahd's Fountain, the Floating Mosque, and the waterfront promenade." },
    ],
  },
  "al-hamra": {
    city: "jeddah", subarea: "al-hamra", name: "Al Hamra", nameAr: "الحمراء",
    description: "Fixed-price taxi service in Al Hamra, Jeddah — close to King Fahd's Fountain, the consulates district, and waterfront hotels.",
    airportMin: "~25 min", makkahMin: "~1 hr", popularFor: "Hotels, consulates, business",
    landmarks: ["King Fahd's Fountain", "Consulates District", "Al Hamra Corniche"],
    tldr: "A taxi in Al Hamra, Jeddah is fixed-price and available 24/7. The district is about 25 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Hamra from Jeddah airport?", answer: "Al Hamra is about 25 minutes from King Abdulaziz International Airport (JED) by taxi. We offer fixed-price transfers with meet & greet on arrival." },
      { question: "Do you serve the consulates area in Al Hamra?", answer: "Yes, we provide reliable pickups across Al Hamra including the consulates district and waterfront hotels, 24/7." },
      { question: "How much is a taxi from Al Hamra to Makkah?", answer: "Al Hamra to Makkah is about a 1-hour drive at a fixed fare confirmed before you book, with an optional Miqat stop." },
    ],
  },
  "obhur": {
    city: "jeddah", subarea: "obhur", name: "Obhur (Abhur)", nameAr: "أبحر",
    description: "Transfers to and from the beach resorts of Obhur (Abhur North & South), north Jeddah, with fixed prices and 24/7 availability.",
    airportMin: "~30–40 min", makkahMin: "~1 hr 20 min", popularFor: "Beach resorts, diving, weekend getaways",
    landmarks: ["Obhur Creek", "Silver Sands Beach", "North Obhur Resorts", "Red Sea diving sites"],
    tldr: "A taxi to or from Obhur (Abhur), north Jeddah's resort area, is fixed-price and available 24/7. It is about 30–40 minutes to King Abdulaziz Airport (JED) and roughly 1 hour 20 minutes to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~30–40 min" }, { label: "To Makkah", value: "~1 hr 20 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Obhur from Jeddah airport?", answer: "Obhur (Abhur) is about 30–40 minutes from King Abdulaziz International Airport (JED), depending on whether you need North or South Obhur. We offer fixed-price resort transfers." },
      { question: "Can you pick up from Obhur beach resorts?", answer: "Yes, we provide door-to-door pickup from resorts and compounds across North and South Obhur, 24/7." },
      { question: "Is Obhur far from Makkah by taxi?", answer: "Obhur to Makkah is about a 1 hour 20 minute drive. We provide comfortable fixed-price transfers with luggage space for families." },
    ],
  },
  "al-safaa": {
    city: "jeddah", subarea: "al-safaa", name: "Al Safaa", nameAr: "الصفا",
    description: "Fast, fixed-price 24/7 taxi dispatch in the Al Safaa district of Jeddah for local rides, airport transfers, and Makkah trips.",
    airportMin: "~20 min", makkahMin: "~1 hr", popularFor: "Residential pickups, local rides",
    landmarks: ["Al Safaa residential district", "Prince Majid Road"],
    tldr: "A taxi in Al Safaa, Jeddah is fixed-price and available 24/7. The district is about 20 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~20 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Safaa from Jeddah airport?", answer: "Al Safaa is about 20 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers both ways." },
      { question: "Is 24/7 taxi available in Al Safaa?", answer: "Yes, we dispatch around the clock in Al Safaa for local rides, airport pickups, and intercity transfers." },
      { question: "Can I book Al Safaa to Makkah in advance?", answer: "Yes. Al Safaa to Makkah is about a 1-hour drive; pre-booking guarantees a fixed price and a Miqat stop for Ihram on request." },
    ],
  },
  "al-rawdah": {
    city: "jeddah", subarea: "al-rawdah", name: "Al Rawdah", nameAr: "الروضة",
    description: "Premium fixed-price taxi pickups in the upscale Al Rawdah neighbourhood of Jeddah, near malls, clinics, and business offices.",
    airportMin: "~25 min", makkahMin: "~1 hr", popularFor: "Shopping, clinics, business",
    landmarks: ["Red Sea Mall (nearby)", "Al Rawdah business offices", "Prince Sultan Road"],
    tldr: "A taxi in Al Rawdah, Jeddah is fixed-price and available 24/7. This upscale district is about 25 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Rawdah from Jeddah airport?", answer: "Al Rawdah is about 25 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price meet & greet transfers." },
      { question: "Do you serve Red Sea Mall and Al Rawdah offices?", answer: "Yes, we provide quick pickups across Al Rawdah including malls, clinics, and business offices, 24/7." },
      { question: "How much is Al Rawdah to Makkah by taxi?", answer: "Al Rawdah to Makkah is about a 1-hour drive at a fixed fare confirmed before booking, with an optional Miqat stop for Ihram." },
    ],
  },
  "al-shati": {
    city: "jeddah", subarea: "al-shati", name: "Al Shati (Ash Shati)", nameAr: "الشاطئ",
    description: "Fixed-price taxi service in Al Shati, north Jeddah's seafront district, near the northern Corniche and waterfront hotels.",
    airportMin: "~25 min", makkahMin: "~1 hr 10 min", popularFor: "Seafront living, hotels, dining",
    landmarks: ["Northern Corniche", "Al Shati waterfront", "Jeddah Yacht Club (nearby)"],
    tldr: "A taxi in Al Shati, north Jeddah is fixed-price and available 24/7. The seafront district is about 25 minutes from King Abdulaziz Airport (JED) and roughly 1 hour 10 minutes to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~1 hr 10 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Shati from Jeddah airport?", answer: "Al Shati is about 25 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers both ways." },
      { question: "Do you pick up from Al Shati waterfront hotels?", answer: "Yes, we provide door-to-door pickup across Al Shati including the northern Corniche and seafront hotels, 24/7." },
      { question: "Can I book Al Shati to Makkah?", answer: "Yes. Al Shati to Makkah is about a 1 hour 10 minute drive at a fixed fare, with a Miqat stop available on request." },
    ],
  },
  "al-salamah": {
    city: "jeddah", subarea: "al-salamah", name: "Al Salamah", nameAr: "السلامة",
    description: "Reliable fixed-price taxi pickups in Al Salamah, a central Jeddah district near malls and the Corniche.",
    airportMin: "~20 min", makkahMin: "~1 hr", popularFor: "Shopping, residential, local rides",
    landmarks: ["Salama Mall", "Heraa Street", "Al Salamah residential district"],
    tldr: "A taxi in Al Salamah, Jeddah is fixed-price and available 24/7. The district is about 20 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~20 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Salamah from Jeddah airport?", answer: "Al Salamah is about 20 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers." },
      { question: "Is taxi available 24/7 in Al Salamah?", answer: "Yes, we dispatch around the clock in Al Salamah for local rides, airport transfers, and Makkah trips." },
      { question: "How much is Al Salamah to Makkah?", answer: "Al Salamah to Makkah is about a 1-hour drive at a fixed fare confirmed before booking, with a Miqat stop on request." },
    ],
  },
  "al-aziziyah-jeddah": {
    city: "jeddah", subarea: "al-aziziyah-jeddah", name: "Al Aziziyah", nameAr: "العزيزية",
    description: "Fixed-price taxi service in Al Aziziyah, east Jeddah — convenient access to the Makkah Expressway for fast pilgrim transfers.",
    airportMin: "~25 min", makkahMin: "~55 min", popularFor: "Residential, fast Makkah access",
    landmarks: ["Makkah Expressway access", "Al Aziziyah district"],
    tldr: "A taxi in Al Aziziyah, east Jeddah is fixed-price and available 24/7. With quick access to the Makkah Expressway, it is about 55 minutes to Makkah and 25 minutes to King Abdulaziz Airport (JED).",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~55 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Aziziyah, Jeddah from Makkah?", answer: "Al Aziziyah in east Jeddah has fast access to the Makkah Expressway, so it is about a 55-minute drive to Makkah at a fixed fare, with an optional Miqat stop." },
      { question: "How far is Al Aziziyah from Jeddah airport?", answer: "Al Aziziyah is about 25 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers." },
      { question: "Is 24/7 taxi available in Al Aziziyah?", answer: "Yes, we provide round-the-clock pickups in Al Aziziyah for local, airport, and Makkah trips." },
    ],
  },
  "al-faisaliyah": {
    city: "jeddah", subarea: "al-faisaliyah", name: "Al Faisaliyah", nameAr: "الفيصلية",
    description: "Fixed-price taxi pickups in Al Faisaliyah, central Jeddah, for local rides, airport transfers, and Makkah trips.",
    airportMin: "~25 min", makkahMin: "~1 hr", popularFor: "Residential, local rides",
    landmarks: ["Al Faisaliyah district", "Falasteen Street"],
    tldr: "A taxi in Al Faisaliyah, central Jeddah is fixed-price and available 24/7. The district is about 25 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Faisaliyah from Jeddah airport?", answer: "Al Faisaliyah is about 25 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers both ways." },
      { question: "Is taxi available 24/7 in Al Faisaliyah?", answer: "Yes, we dispatch around the clock in Al Faisaliyah for local rides, airport pickups, and Makkah transfers." },
      { question: "How much is Al Faisaliyah to Makkah?", answer: "Al Faisaliyah to Makkah is about a 1-hour drive at a fixed fare, with a Miqat stop for Ihram on request." },
    ],
  },
  "al-andalus": {
    city: "jeddah", subarea: "al-andalus", name: "Al Andalus", nameAr: "الأندلس",
    description: "Fixed-price taxi service in Al Andalus, central Jeddah, near malls and main roads for fast local and airport rides.",
    airportMin: "~20 min", makkahMin: "~1 hr", popularFor: "Shopping, residential, business",
    landmarks: ["Al Andalus Mall (nearby)", "Al Andalus district", "King Abdullah Road"],
    tldr: "A taxi in Al Andalus, central Jeddah is fixed-price and available 24/7. The district is about 20 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~20 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Andalus from Jeddah airport?", answer: "Al Andalus is about 20 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers." },
      { question: "Do you serve Al Andalus malls and offices?", answer: "Yes, we provide quick pickups across Al Andalus including malls, offices, and residential areas, 24/7." },
      { question: "How much is Al Andalus to Makkah by taxi?", answer: "Al Andalus to Makkah is about a 1-hour drive at a fixed fare confirmed before booking, with an optional Miqat stop." },
    ],
  },
  "city-tour": {
    city: "jeddah", subarea: "city-tour", name: "Jeddah City Tour", nameAr: "جولة مدينة جدة",
    description: "Private Jeddah city tour by car — visit Al-Balad UNESCO old town, the Corniche, King Fahd's Fountain, and the Floating Mosque with your own driver and flexible timing.",
    airportMin: "~20–30 min", makkahMin: "—", popularFor: "Sightseeing, tourists, half-day & full-day tours",
    landmarks: ["Al-Balad UNESCO Old Town", "King Fahd's Fountain", "Al-Rahma Floating Mosque", "Jeddah Corniche", "Souq Al-Alawi"],
    tldr: "A private Jeddah city tour by car covers Al-Balad old town, the Corniche, King Fahd's Fountain, and the Floating Mosque. Half-day and full-day options are available with a private driver, fixed price, and flexible stops.",
    tldrFacts: [{ label: "Half day", value: "~4 hours" }, { label: "Full day", value: "~8 hours" }, { label: "Vehicle", value: "Private car/SUV" }, { label: "Pricing", value: "Fixed" }],
    faqs: [
      { question: "What does a Jeddah city tour include?", answer: "A private Jeddah city tour typically covers Al-Balad (the UNESCO historic district), the Corniche and waterfront, King Fahd's Fountain, and the Al-Rahma Floating Mosque, with flexible stops and waiting time included." },
      { question: "How long is a Jeddah city tour?", answer: "We offer half-day tours (about 4 hours) and full-day tours (about 8 hours) by private car or SUV, at a fixed price agreed before you book." },
      { question: "Can the Jeddah tour start from my hotel or the airport?", answer: "Yes. The tour can start from any Jeddah hotel or directly from King Abdulaziz International Airport (JED), and we tailor the route to your interests." },
    ],
  },
  // Makkah (rich programmatic pages)
  "aziziyah": {
    city: "makkah", subarea: "aziziyah", name: "Aziziyah", nameAr: "العزيزية",
    description: "Dedicated Umrah and Hajj taxi transfers from Aziziyah hotels to Masjid al-Haram, plus return trips to Jeddah Airport — fixed-price and 24/7.",
    airportMin: "~50 min", makkahMin: "~10 min drive", popularFor: "Pilgrim hotels, Hajj/Umrah stays",
    landmarks: ["Aziziyah hotel district", "Route to Mina & Arafat", "Masjid al-Haram (nearby)"],
    tldr: "A taxi in Aziziyah, Makkah is fixed-price and available 24/7. The district is about a 10-minute drive to Masjid al-Haram and roughly 50 minutes to Jeddah Airport (JED).",
    tldrFacts: [{ label: "To Haram", value: "~10 min" }, { label: "To JED", value: "~50 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Aziziyah from the Haram?", answer: "Aziziyah is about a 10-minute drive from Masjid al-Haram. We offer fixed-price transfers to the closest permitted drop-off, with prayer-time road closures handled by the driver." },
      { question: "Can you take us from Aziziyah to Jeddah airport?", answer: "Yes. Aziziyah to King Abdulaziz International Airport (JED) is about 50 minutes; pre-book your departure with buffer time before your flight." },
      { question: "Do you serve Aziziyah for Hajj transport?", answer: "Yes, we provide permitted transfers between Aziziyah hotels, the Haram, and the routes towards Mina and Arafat during the seasons." },
    ],
  },
  "ajyad": {
    city: "makkah", subarea: "ajyad", name: "Ajyad", nameAr: "أجياد",
    description: "Immediate fixed-price taxi availability in Ajyad, directly adjacent to Masjid al-Haram — ideal for hotel transfers and airport departures.",
    airportMin: "~1 hr", makkahMin: "~5 min walk", popularFor: "Haram-adjacent hotels, easy access",
    landmarks: ["Masjid al-Haram", "Ajyad Street hotels", "Clock Tower (Abraj Al Bait)"],
    tldr: "A taxi in Ajyad, Makkah is fixed-price and available 24/7. Ajyad sits beside Masjid al-Haram (about a 5-minute walk) and is roughly 1 hour from Jeddah Airport (JED).",
    tldrFacts: [{ label: "To Haram", value: "~5 min walk" }, { label: "To JED", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "Is Ajyad close to the Haram?", answer: "Yes, Ajyad is directly adjacent to Masjid al-Haram — about a 5-minute walk. For airport departures we collect you from the nearest vehicle-permitted point." },
      { question: "How much is a taxi from Ajyad to Jeddah airport?", answer: "Ajyad to King Abdulaziz International Airport (JED) is about 1 hour, fixed-price from SAR 180. Pre-book with buffer time before your flight." },
      { question: "Can you pick up from Ajyad hotels during prayer times?", answer: "Yes. When roads near the Haram close for Salah, the driver meets you at the closest permitted checkpoint." },
    ],
  },
  "al-awali-makkah": {
    city: "makkah", subarea: "al-awali-makkah", name: "Al Awali", nameAr: "العوالي",
    description: "Comfortable fixed-price rides and Jeddah Airport transfers from Al Awali, southern Makkah, with quick access to the expressway.",
    airportMin: "~55 min", makkahMin: "~15 min drive", popularFor: "Residential, modern compounds",
    landmarks: ["Al Awali district", "Makkah expressway access", "Route to Jeddah"],
    tldr: "A taxi in Al Awali, Makkah is fixed-price and available 24/7. The district is about a 15-minute drive to Masjid al-Haram and roughly 55 minutes to Jeddah Airport (JED).",
    tldrFacts: [{ label: "To Haram", value: "~15 min" }, { label: "To JED", value: "~55 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Awali from the Haram?", answer: "Al Awali is about a 15-minute drive from Masjid al-Haram, with fixed-price transfers to the nearest permitted drop-off." },
      { question: "Can you collect from Al Awali for Jeddah airport?", answer: "Yes. Al Awali to King Abdulaziz International Airport (JED) is about 55 minutes; pre-book your departure for a fixed price." },
      { question: "Is 24/7 taxi available in Al Awali?", answer: "Yes, we dispatch around the clock in Al Awali for Haram transfers, airport returns, and intercity trips." },
    ],
  },
  "al-shubaikah": {
    city: "makkah", subarea: "al-shubaikah", name: "Al Shubaikah", nameAr: "الشبيكة",
    description: "Local Makkah taxi service for pilgrims staying in Al Shubaikah, close to Masjid al-Haram and the Jeddah road.",
    airportMin: "~1 hr", makkahMin: "~5–10 min walk", popularFor: "Haram-area hotels, pilgrims",
    landmarks: ["Masjid al-Haram (nearby)", "Jarwal / Shubaikah hotels", "Route to Jeddah"],
    tldr: "A taxi in Al Shubaikah, Makkah is fixed-price and available 24/7. The district is a short 5–10 minute walk from Masjid al-Haram and about 1 hour from Jeddah Airport (JED).",
    tldrFacts: [{ label: "To Haram", value: "~5–10 min walk" }, { label: "To JED", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "Is Al Shubaikah near the Haram?", answer: "Yes, Al Shubaikah is one of the closest districts to Masjid al-Haram — a short 5–10 minute walk. Vehicle pickup is from the nearest permitted point." },
      { question: "How much is Al Shubaikah to Jeddah airport?", answer: "Al Shubaikah to King Abdulaziz International Airport (JED) is about 1 hour, fixed-price from SAR 180, available 24/7." },
      { question: "Do you serve Al Shubaikah for hotel transfers?", answer: "Yes, we provide fixed-price pickups for pilgrims staying in Al Shubaikah and the surrounding Haram-area hotels." },
    ],
  },
  "al-mansour": {
    city: "makkah", subarea: "al-mansour", name: "Al Mansour", nameAr: "المنصور",
    description: "Reliable and affordable fixed-price taxi rides in the Al Mansour district of Makkah for Haram transfers and airport departures.",
    airportMin: "~55 min", makkahMin: "~10 min drive", popularFor: "Residential, local rides",
    landmarks: ["Al Mansour district", "Route to Haram", "Makkah ring road"],
    tldr: "A taxi in Al Mansour, Makkah is fixed-price and available 24/7. The district is about a 10-minute drive to Masjid al-Haram and roughly 55 minutes to Jeddah Airport (JED).",
    tldrFacts: [{ label: "To Haram", value: "~10 min" }, { label: "To JED", value: "~55 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Mansour from the Haram?", answer: "Al Mansour is about a 10-minute drive from Masjid al-Haram, with fixed-price transfers to the closest permitted drop-off." },
      { question: "Can you take us from Al Mansour to Jeddah airport?", answer: "Yes. Al Mansour to King Abdulaziz International Airport (JED) is about 55 minutes; pre-book for a fixed price and buffer time." },
      { question: "Is taxi available 24/7 in Al Mansour?", answer: "Yes, we dispatch around the clock in Al Mansour for Haram transfers, airport returns, and intercity trips." },
    ],
  },
  "mina": {
    city: "makkah", subarea: "mina", name: "Mina", nameAr: "منى",
    description: "Permitted Hajj transport and year-round transfers to the Valley of Mina, the tent city east of Makkah, with experienced pilgrim drivers.",
    airportMin: "~1 hr 10 min", makkahMin: "~8 km (~15 min)", popularFor: "Hajj, Mina/Arafat/Muzdalifah",
    landmarks: ["Valley of Mina (tent city)", "Jamarat", "Route to Arafat & Muzdalifah"],
    tldr: "Taxi Saudi Arabia provides permitted transport to and around Mina, about 8 km east of Masjid al-Haram. Mina is the central point of the Hajj rites, linking Arafat and Muzdalifah.",
    tldrFacts: [{ label: "To Haram", value: "~8 km" }, { label: "To JED", value: "~1 hr 10 min" }, { label: "Use", value: "Hajj transport" }, { label: "Hours", value: "Seasonal/24/7" }],
    faqs: [
      { question: "How far is Mina from Makkah?", answer: "Mina is about 8 km east of Masjid al-Haram — roughly a 15-minute drive outside peak Hajj times. During Hajj, vehicle access follows official routing and permits." },
      { question: "Do you provide Hajj transport to Mina, Arafat and Muzdalifah?", answer: "Yes, we arrange permitted transfers connecting the Hajj sites of Mina, Arafat, and Muzdalifah. Contact us in advance during the Hajj season to plan logistics." },
      { question: "Can I visit Mina outside the Hajj season?", answer: "Yes, the Mina area can be visited year-round by car as part of a Ziyarat tour, with our driver explaining the significance of each site." },
    ],
  },
  // Madinah (rich programmatic pages)
  "al-markazia": {
    city: "madinah", subarea: "al-markazia", name: "Al Markazia (Central Area)", nameAr: "المركزية",
    description: "Fixed-price taxi and Ziyarat tours starting directly from Al Markazia (Central Area) hotels beside Masjid an-Nabawi.",
    airportMin: "~25 min", makkahMin: "~5 min walk", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Haram-area hotels, pilgrims",
    landmarks: ["Masjid an-Nabawi", "Central Area (Markazia) hotels", "Quba Road"],
    tldr: "A taxi in Al Markazia, the Central Area of Madinah, is fixed-price and available 24/7. It sits beside Masjid an-Nabawi (a short walk) and is about 25 minutes from Prince Mohammad Airport (MED).",
    tldrFacts: [{ label: "To Nabawi", value: "~5 min walk" }, { label: "To MED", value: "~25 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "Is Al Markazia close to Masjid an-Nabawi?", answer: "Yes, Al Markazia (the Central Area) surrounds Masjid an-Nabawi — most hotels are a short walk away. Vehicle pickup is from the nearest permitted point." },
      { question: "How far is Al Markazia from Madinah airport?", answer: "Al Markazia is about 25 minutes from Prince Mohammad Bin Abdulaziz Airport (MED), with fixed-price meet & greet transfers." },
      { question: "Can I start a Ziyarat tour from Al Markazia?", answer: "Yes, our half-day Ziyarat car collects you from your Central Area hotel and covers Quba, Uhud, and Qiblatain with waiting time." },
    ],
  },
  "qaba": {
    city: "madinah", subarea: "qaba", name: "Quba", nameAr: "قباء",
    description: "Fixed-price transport to and from Quba Mosque and the surrounding district of Madinah — the first mosque built in Islam.",
    airportMin: "~25 min", makkahMin: "~4 km from Nabawi", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Quba Mosque visits, residential",
    landmarks: ["Quba Mosque", "Quba Road", "Date farms"],
    tldr: "A taxi in the Quba district of Madinah is fixed-price and available 24/7. Quba Mosque is about 4 km from Masjid an-Nabawi, and the airport (MED) is roughly 25 minutes away.",
    tldrFacts: [{ label: "Quba → Nabawi", value: "~4 km" }, { label: "To MED", value: "~25 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Quba Mosque from Masjid an-Nabawi?", answer: "Quba Mosque is about 4 km from Masjid an-Nabawi — a short fixed-price taxi ride, and a popular Ziyarat stop." },
      { question: "Can you take me to Quba Mosque and wait?", answer: "Yes, we provide round trips and Ziyarat tours with waiting time so you can pray at Quba and return comfortably." },
      { question: "Is taxi available 24/7 in the Quba area?", answer: "Yes, we serve the Quba district around the clock for local rides, airport transfers, and Ziyarat." },
    ],
  },
  "uhud": {
    city: "madinah", subarea: "uhud", name: "Mount Uhud District", nameAr: "أحد",
    description: "Ziyarat tours and fixed-price taxi service to the historic Mount Uhud, site of the Battle of Uhud, north of Masjid an-Nabawi.",
    airportMin: "~20 min", makkahMin: "~6 km from Nabawi", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Mount Uhud Ziyarat, history",
    landmarks: ["Mount Uhud", "Martyrs of Uhud", "Archers' Hill"],
    tldr: "A taxi to the Mount Uhud district of Madinah is fixed-price and available 24/7. Mount Uhud is about 6 km from Masjid an-Nabawi and roughly 20 minutes from the airport (MED).",
    tldrFacts: [{ label: "Uhud → Nabawi", value: "~6 km" }, { label: "To MED", value: "~20 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Mount Uhud from Masjid an-Nabawi?", answer: "Mount Uhud is about 6 km north of Masjid an-Nabawi — a short fixed-price taxi ride and a key Ziyarat site." },
      { question: "Can I visit Mount Uhud as part of a Ziyarat tour?", answer: "Yes, our half-day Ziyarat car includes Mount Uhud along with Quba and Qiblatain, with waiting time at each site." },
      { question: "Is taxi available to Mount Uhud at any time?", answer: "Yes, we provide 24/7 fixed-price transport to and from the Mount Uhud district." },
    ],
  },
  "al-awali-madinah": {
    city: "madinah", subarea: "al-awali-madinah", name: "Al Awali", nameAr: "العوالي",
    description: "Fixed-price airport transfers and local rides in Al Awali, southern Madinah, near Quba and the Makkah road.",
    airportMin: "~30 min", makkahMin: "~8 km from Nabawi", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Residential, Quba access",
    landmarks: ["Al Awali district", "Quba (nearby)", "Route to Makkah"],
    tldr: "A taxi in Al Awali, southern Madinah, is fixed-price and available 24/7. The district is about 8 km from Masjid an-Nabawi and roughly 30 minutes from the airport (MED).",
    tldrFacts: [{ label: "To Nabawi", value: "~8 km" }, { label: "To MED", value: "~30 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Awali from Masjid an-Nabawi?", answer: "Al Awali is about 8 km from Masjid an-Nabawi — a short fixed-price taxi ride, close to Quba Mosque." },
      { question: "Can you collect from Al Awali for the airport?", answer: "Yes. Al Awali to Prince Mohammad Bin Abdulaziz Airport (MED) is about 30 minutes, fixed-price with pickup from your door." },
      { question: "Is 24/7 taxi available in Al Awali?", answer: "Yes, we dispatch around the clock in Al Awali for local rides, airport transfers, and Ziyarat." },
    ],
  },
  "al-aqiq-madinah": {
    city: "madinah", subarea: "al-aqiq-madinah", name: "Al Aqiq", nameAr: "العقيق",
    description: "Fixed-price taxi service in Al Aqiq, an upscale western district of Madinah near the Knowledge Economic City and main highways.",
    airportMin: "~25 min", makkahMin: "~6 km from Nabawi", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Upscale residential, business",
    landmarks: ["Knowledge Economic City", "Al Aqiq district", "King Abdullah Road"],
    tldr: "A taxi in Al Aqiq, western Madinah, is fixed-price and available 24/7. The district is about 6 km from Masjid an-Nabawi and roughly 25 minutes from the airport (MED).",
    tldrFacts: [{ label: "To Nabawi", value: "~6 km" }, { label: "To MED", value: "~25 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Aqiq from Masjid an-Nabawi?", answer: "Al Aqiq is about 6 km from Masjid an-Nabawi — a short fixed-price taxi ride from this upscale western district." },
      { question: "Do you serve Al Aqiq for airport transfers?", answer: "Yes. Al Aqiq to Prince Mohammad Bin Abdulaziz Airport (MED) is about 25 minutes, fixed-price with door-to-door pickup." },
      { question: "Is taxi available 24/7 in Al Aqiq?", answer: "Yes, we provide round-the-clock service in Al Aqiq for local, airport, and Ziyarat trips." },
    ],
  },
  "sultanah": {
    city: "madinah", subarea: "sultanah", name: "Sultanah", nameAr: "السلطانة",
    description: "Reliable fixed-price taxi rides in the central Sultanah district of Madinah, close to Masjid an-Nabawi and main shopping streets.",
    airportMin: "~20 min", makkahMin: "~3 km from Nabawi", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Central residential, shopping",
    landmarks: ["Sultanah district", "Central markets", "Quba Road"],
    tldr: "A taxi in Sultanah, central Madinah, is fixed-price and available 24/7. The district is about 3 km from Masjid an-Nabawi and roughly 20 minutes from the airport (MED).",
    tldrFacts: [{ label: "To Nabawi", value: "~3 km" }, { label: "To MED", value: "~20 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Sultanah from Masjid an-Nabawi?", answer: "Sultanah is about 3 km from Masjid an-Nabawi — a quick fixed-price taxi ride from this central Madinah district." },
      { question: "Is taxi available 24/7 in Sultanah?", answer: "Yes, we dispatch around the clock in Sultanah for local rides, airport transfers, and Ziyarat tours." },
      { question: "How far is Sultanah from Madinah airport?", answer: "Sultanah to Prince Mohammad Bin Abdulaziz Airport (MED) is about 20 minutes, fixed-price with door-to-door pickup." },
    ],
  },
  // Dammam / Eastern Province
  // NOTE: "al-khobar" removed — it duplicated the standalone /locations/alkhobar
  // city page (same city, competing content). See next.config.ts redirect.
  "dhahran": {
    city: "dammam", subarea: "dhahran", name: "Dhahran", nameAr: "الظهران",
    description: "Executive corporate transport for Saudi Aramco facilities, KFUPM, and companies based in Dhahran.",
    airportMin: "~25 min", makkahMin: "—", airportLabel: "King Fahd Airport (DMM)", popularFor: "Aramco facilities, KFUPM, corporate accounts",
    landmarks: ["Saudi Aramco headquarters area", "KFUPM", "Dhahran Expo"],
    tldr: "A chauffeur in Dhahran is fixed-price and available 24/7, built for corporate and Aramco-related travel. It is about 25 minutes from King Fahd International Airport (DMM), with monthly billing available for companies.",
    tldrFacts: [{ label: "To DMM", value: "~25 min" }, { label: "Pricing", value: "Fixed / Corporate" }, { label: "Hours", value: "24/7" }, { label: "Popular for", value: "Aramco, KFUPM" }],
    faqs: [
      { question: "Do you provide corporate accounts for companies in Dhahran?", answer: "Yes, we set up monthly-billed corporate accounts with dedicated drivers for companies and contractors operating around Dhahran and Aramco facilities." },
      { question: "How far is Dhahran from Dammam airport?", answer: "Dhahran is about 25 minutes from King Fahd International Airport (DMM), with fixed-price meet & greet transfers." },
      { question: "Can you arrange transport for KFUPM visitors or staff?", answer: "Yes, we provide reliable fixed-price and dedicated-driver transport for KFUPM staff, visitors, and conference guests." },
    ],
  },
  "half-moon-bay": { city: "dammam", subarea: "half-moon-bay", name: "Half Moon Bay", nameAr: "شاطئ نصف القمر", description: "Resort transfers and private transport to Half Moon Bay." },
  "qatif": { city: "dammam", subarea: "qatif", name: "Qatif", nameAr: "القطيف", description: "Reliable local taxi and intercity transfers from Qatif." }
};
