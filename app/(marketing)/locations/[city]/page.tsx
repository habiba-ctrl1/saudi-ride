export const revalidate = 86400; // revalidate every 24 hours

export function generateStaticParams() {
  return [
    { city: "makkah" },
    { city: "madinah" },
    { city: "riyadh" },
    { city: "jeddah" },
    { city: "dammam" },
    { city: "alula" },
    { city: "taif" },
    { city: "alkhobar" },
    { city: "yanbu" },
    { city: "neom" },
    { city: "abha" }
  ];
}

// No notFound import
import { db } from "@/lib/db";
import { Metadata } from "next";
import { MapPin, ArrowRight, Car, Building2, CheckCircle2, HelpCircle, Star, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";

// Static content for cities to complement dynamic route data
const CITY_DETAILS: Record<string, { name: string, nameAr: string, image: string, tagline: string, description: string, attractions: { name: string, dist: string }[], tips: string[], tldr?: string, tldrFacts?: { label: string, value: string }[], faqs?: { question: string, answer: string }[], testimonials?: { quote: string, author: string, location: string, trip: string }[] }> = {
  makkah: {
    name: "Makkah",
    nameAr: "مكة المكرمة",
    image: "/locations/makkah-hero.webp",
    tagline: "The Holiest City on Earth",
    description: "Book a fixed-price taxi in Makkah for Umrah, Hajj, Ziyarat, or onward travel. Our professional drivers provide Masjid Al-Haram drop-offs, return transfers to Jeddah Airport (~80 km, ~1 hour), and Makkah to Madinah journeys (~430 km, ~4–5 hours). Prayer-time and rest stops are always included, and drivers know the road-closure points around the Haram during Salah.",
    tldr: "Taxi Saudi Arabia provides 24/7 fixed-price taxi service in Makkah — Masjid al-Haram hotel drop-offs, return transfers to Jeddah Airport (~80 km, ~1 hour), and Makkah to Madinah journeys (~430 km, ~4–5 hours). Prayer stops and luggage help included.",
    tldrFacts: [
      { label: "To Jeddah Airport", value: "~80 km · ~1 hr" },
      { label: "To Madinah", value: "~430 km · ~4–5 hr" },
      { label: "To Taif", value: "~90 km · ~1 hr 10" },
      { label: "Pricing", value: "Fixed, no surge" }
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
      { question: "How much is a taxi from Makkah to Jeddah airport?", answer: "A fixed-price taxi from Makkah to King Abdulaziz International Airport (JED) starts from around SAR 180 for a sedan. It is about 80 km and roughly 1 hour — pre-book and allow buffer time before your flight." },
      { question: "How far is Makkah from Madinah by taxi?", answer: "Makkah to Madinah is about 430 km — roughly a 4 to 5 hour drive via the Haramain highway. The fixed fare starts from around SAR 350, with prayer and rest stops included." },
      { question: "Can the taxi drop me at my Makkah hotel near the Haram?", answer: "Yes. We drop you as close to your hotel and Masjid al-Haram as vehicles are permitted. During prayer times some roads close, so the driver uses the nearest allowed checkpoint." },
      { question: "Do you provide Makkah Ziyarat tours by car?", answer: "Yes. A half-day Ziyarat car visits Jabal Al-Nour (Cave of Hira), Jabal Thawr, Mina, and Arafat with a knowledgeable driver and flexible waiting time." },
      { question: "Is taxi available in Makkah 24/7?", answer: "Yes, we operate around the clock in Makkah for hotel transfers, airport returns, intercity trips, and Ziyarat — at fixed prices with no surge." }
    ],
    testimonials: [
      { quote: "Booked our Makkah to Madinah transfer in a big SUV. Driver was on time at the hotel, stopped for prayers, and the price was exactly as quoted. Very comfortable for the elderly in our group.", author: "Yusuf A.", location: "Manchester, UK", trip: "Makkah → Madinah" },
      { quote: "Return trip from our hotel near the Haram to Jeddah airport. He knew exactly where the roads were closed and got us out smoothly with plenty of time for the flight.", author: "Nadia H.", location: "Sydney, Australia", trip: "Makkah → JED Airport" },
      { quote: "Did the Ziyarat tour — Cave of Hira, Mina, Arafat. The driver explained each site and never rushed us. Fixed fair price. Highly recommended.", author: "Bilal K.", location: "Makkah", trip: "Makkah Ziyarat" }
    ]
  },
  madinah: {
    name: "Madinah",
    nameAr: "المدينة المنورة",
    image: "/locations/madinah-hero.webp",
    tagline: "City of the Prophet ﷺ",
    description: "Book a fixed-price taxi in Madinah for airport transfers from Prince Mohammad Bin Abdulaziz Airport (MED) (~20 km, ~25 min), Masjid an-Nabawi hotel drop-offs, Ziyarat tours, and onward journeys to Makkah (~430 km, ~4–5 hours). Our drivers serve pilgrims arriving at MED and travellers heading to or from Makkah and Jeddah, with prayer stops and luggage help included.",
    tldr: "Taxi Saudi Arabia provides 24/7 fixed-price taxi service in Madinah — Prince Mohammad Bin Abdulaziz Airport (MED) transfers (~20 km, ~25 min), Masjid an-Nabawi hotel drop-offs, Ziyarat tours, and Madinah to Makkah journeys (~430 km, ~4–5 hours).",
    tldrFacts: [
      { label: "Airport (MED)", value: "~20 km · ~25 min" },
      { label: "To Makkah", value: "~430 km · ~4–5 hr" },
      { label: "To Jeddah Airport", value: "~410 km" },
      { label: "Pricing", value: "Fixed, no surge" }
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
      { question: "How much is a taxi from Madinah airport to the city?", answer: "A fixed-price taxi from Prince Mohammad Bin Abdulaziz Airport (MED) to central Madinah hotels starts from around SAR 80. It is about 20 km and a 25-minute drive, with meet & greet at arrivals." },
      { question: "How far is Madinah from Makkah by taxi?", answer: "Madinah to Makkah is about 430 km — roughly a 4 to 5 hour drive via the Haramain highway. The fixed fare starts from around SAR 350, with prayer and rest stops included." },
      { question: "Can the taxi drop me at my hotel near Masjid an-Nabawi?", answer: "Yes. We drop you as close to your Central Area (Markazia) hotel and Masjid an-Nabawi as vehicles are permitted, handling any prayer-time road restrictions." },
      { question: "Do you offer Madinah Ziyarat tours by car?", answer: "Yes. A half-day Ziyarat car visits Quba Mosque, Mount Uhud, Qiblatain Mosque, and other sites with a knowledgeable driver and waiting time included." },
      { question: "Is taxi available in Madinah 24/7?", answer: "Yes, we operate around the clock in Madinah for airport transfers, hotel pickups, Ziyarat, and intercity trips — at fixed prices with no surge." }
    ],
    testimonials: [
      { quote: "Arrived at Madinah airport late evening and the driver was waiting at arrivals. Quick, calm ride to our hotel by the Haram. Exactly the price quoted.", author: "Omar F.", location: "Leicester, UK", trip: "MED Airport → City" },
      { quote: "Took the Ziyarat tour — Quba, Uhud, Qiblatain. Our driver was knowledgeable and patient with the elderly in our family. Felt very well looked after.", author: "Sumaya I.", location: "Cape Town, South Africa", trip: "Madinah Ziyarat" },
      { quote: "Madinah to Makkah in a comfortable SUV with prayer stops along the way. Smooth, safe driving and a fair fixed price for the whole family.", author: "Abdullah R.", location: "Madinah", trip: "Madinah → Makkah" }
    ]
  },
  riyadh: {
    name: "Riyadh",
    nameAr: "الرياض",
    image: "/locations/riyadh-hero.webp",
    tagline: "The Saudi Capital",
    description: "Book a fixed-price taxi in Riyadh for airport transfers from King Khalid International Airport (RUH) (~35 km, ~45 min), business travel across KAFD, Olaya, and the Diplomatic Quarter, shopping trips, and intercity rides to Dammam (~400 km), Makkah, Jeddah, or Al Ahsa. Our professional drivers cover every Riyadh district 24/7, with hourly chauffeur charters for executives and meet & greet for arrivals. Whether you need a quick city ride, a full business day on hire, or a long-distance transfer, fares are fixed in advance with no surge pricing.",
    tldr: "Taxi Saudi Arabia offers 24/7 fixed-price taxi and chauffeur service in Riyadh — King Khalid International Airport (RUH) transfers (~35 km, ~45 min), business travel across KAFD and Olaya, and intercity rides to Dammam (~400 km), Makkah, and Jeddah. Hourly charters and meet & greet available.",
    tldrFacts: [
      { label: "Airport (RUH)", value: "~35 km · ~45 min" },
      { label: "To Dammam", value: "~400 km · ~4 hr" },
      { label: "Rush hours", value: "7–9am, 4–8pm" },
      { label: "Pricing", value: "Fixed, no surge" }
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
      { question: "How much is a taxi from Riyadh airport to the city?", answer: "A fixed-price taxi from King Khalid International Airport (RUH) to central Riyadh districts like Olaya or KAFD starts from around SAR 90. It is about 35 km and a 45-minute drive, with meet & greet at arrivals." },
      { question: "Can I hire a car with driver in Riyadh for a full day?", answer: "Yes. We offer hourly and full-day chauffeur charters across Riyadh — ideal for business meetings, where the driver waits between stops and knows the fastest routes, avoiding ride-hailing surge pricing." },
      { question: "How far is Riyadh from Dammam by taxi?", answer: "Riyadh to Dammam is about 400 km — roughly a 4-hour drive on Highway 40. We offer fixed-price intercity transfers in sedans, SUVs, and vans with rest stops included." },
      { question: "Do you cover all Riyadh business districts?", answer: "Yes — KAFD, Olaya, the Diplomatic Quarter, Granada, and Diriyah are all covered 24/7. Share your exact district when booking so the driver plans the best route." },
      { question: "Is taxi available in Riyadh 24/7?", answer: "Yes, we operate around the clock in Riyadh for airport transfers, business travel, shopping, and intercity trips — at fixed prices confirmed before you book." }
    ]
  },
  jeddah: {
    name: "Jeddah",
    nameAr: "جدة",
    image: "/locations/jeddah-hero.webp",
    tagline: "The Red Sea Gateway to Makkah & Madinah",
    description: "Book a fixed-price taxi in Jeddah for airport pickups from King Abdulaziz International Airport (JED), transfers to Makkah (~80 km, ~1 hour) and Madinah (~420 km, ~4–5 hours), and local rides around the Corniche, Al-Balad, and the city centre. Most Umrah and Hajj pilgrims arrive at Jeddah, making it the Kingdom's main gateway — our drivers handle 24/7 night arrivals, meet & greet, flight tracking, and Miqat stops for Ihram.",
    tldr: "Taxi Saudi Arabia provides 24/7 fixed-price taxi and private-car service in Jeddah, including King Abdulaziz International Airport (JED) pickups and transfers to Makkah (~80 km, ~1 hour) and Madinah (~420 km, ~4–5 hours). Meet & greet, flight tracking, and English/Urdu-speaking drivers included.",
    tldrFacts: [
      { label: "To Makkah", value: "~80 km · ~1 hr" },
      { label: "To Madinah", value: "~420 km · ~4–5 hr" },
      { label: "Airport", value: "JED (24/7)" },
      { label: "Pricing", value: "Fixed, no surge" }
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
      { question: "How much is a taxi in Jeddah?", answer: "Jeddah city rides and airport pickups are fixed-price with no surge. A Jeddah Airport (JED) to Makkah taxi starts from around SAR 180, and Jeddah to Madinah from around SAR 350. You see the exact fare before you book — tolls and taxes included." },
      { question: "Is there a taxi at Jeddah airport 24/7?", answer: "Yes. We operate at King Abdulaziz International Airport (JED) around the clock, including late-night and early-morning flights. We track your flight number, so your driver waits with a name sign even if the flight is delayed." },
      { question: "How far is Jeddah from Makkah by taxi?", answer: "Jeddah is about 80 km from Makkah — roughly a 1-hour drive on the Makkah Expressway. From Jeddah Airport (JED) it is a direct transfer, and the driver can stop at the Miqat for Ihram on request." },
      { question: "Can I book a Jeddah taxi in advance?", answer: "Yes, and for airport and Umrah transfers we recommend it. Pre-booking guarantees a vehicle and a fixed price, with meet & greet at arrivals — especially important during Umrah, Hajj, and Ramadan seasons." },
      { question: "Do the drivers speak English or Urdu?", answer: "Most of our Jeddah drivers speak English and Arabic, and many also speak Urdu — helpful for pilgrims from South Asia. You can request an Urdu-speaking driver when booking." }
    ],
    testimonials: [
      { quote: "Landed at Jeddah at 2 AM and the driver was waiting with my name sign. Stopped at the Miqat so we could enter Ihram, then straight to our Makkah hotel. Stress-free start to Umrah.", author: "Imran S.", location: "Birmingham, UK", trip: "JED → Makkah" },
      { quote: "Booked an SUV from the airport to Madinah for my parents and all the luggage. Comfortable, fixed price, and the driver took rest stops for prayer without us asking. Highly recommend.", author: "Aisha R.", location: "Toronto, Canada", trip: "JED → Madinah" },
      { quote: "Used them for a Corniche and Al-Balad day tour. The driver knew every spot and waited while we explored. Fair fixed price, very polite. Will use again next visit.", author: "Khalid M.", location: "Jeddah", trip: "Jeddah City Tour" },
    ]
  },
  dammam: {
    name: "Dammam",
    nameAr: "الدمام",
    image: "/locations/dammam-hero.webp",
    tagline: "Eastern Province Capital",
    description: "Book a fixed-price taxi in Dammam for airport transfers from King Fahd International Airport (DMM) (~35 km, ~40 min), rides across the Dammam–Khobar–Dhahran metro area, corporate trips to Aramco and the industrial zones, and cross-border journeys to Bahrain via the King Fahd Causeway (~1 hour). Our drivers know the Eastern Province well and provide 24/7 service for business travellers, families, and tourists heading to Half Moon Bay or Ithra. Fares are fixed in advance with tolls included and no surge pricing.",
    tldr: "Taxi Saudi Arabia provides 24/7 fixed-price taxi service in Dammam — King Fahd International Airport (DMM) transfers (~35 km, ~40 min), rides across the Dammam–Khobar–Dhahran metro, and cross-border trips to Bahrain via the King Fahd Causeway (~1 hour). Corporate and family vehicles available.",
    tldrFacts: [
      { label: "Airport (DMM)", value: "~35 km · ~40 min" },
      { label: "To Bahrain", value: "~1 hr (Causeway)" },
      { label: "To Riyadh", value: "~400 km · ~4 hr" },
      { label: "Pricing", value: "Fixed, no surge" }
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
      { question: "How much is a taxi from Dammam airport to the city?", answer: "A fixed-price taxi from King Fahd International Airport (DMM) to Dammam or Al Khobar starts from around SAR 90. It is about 35 km and a 40-minute drive, with meet & greet at arrivals." },
      { question: "Can I take a taxi from Dammam to Bahrain?", answer: "Yes. We run cross-border transfers to Bahrain via the King Fahd Causeway, roughly a 1-hour drive. Share your passport and visa details in advance so we can prepare the border paperwork." },
      { question: "How far is Dammam from Riyadh by taxi?", answer: "Dammam to Riyadh is about 400 km — roughly a 4-hour drive on Highway 40. We offer fixed-price intercity transfers in sedans, SUVs, and vans with rest stops included." },
      { question: "Do you serve the whole Dammam–Khobar–Dhahran area?", answer: "Yes — the three cities form one metropolitan area and we cover all of it 24/7, including Aramco, the corniche, malls, and the industrial zones. Confirm your exact district when booking." },
      { question: "Is taxi available in Dammam 24/7?", answer: "Yes, we operate around the clock in the Eastern Province for airport transfers, corporate travel, cross-border trips, and intercity journeys — at fixed prices with no surge." }
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
    ]
  },
  taif: {
    name: "Taif",
    nameAr: "الطائف",
    image: "/locations/taif-hero.webp",
    tagline: "The City of Roses",
    description: "Book a fixed-price taxi in Taif for day trips from Makkah (~90 km, ~1 hour 10) and Jeddah (~170 km), mountain tours along the scenic Al Hada road, and visits to the famous rose farms. Taif's cool climate makes it a favourite summer escape, and our drivers know the steep, winding Sarawat mountain routes well. We provide airport transfers from Taif Regional Airport (TIF), pilgrim transfers, and full-day car hire for families touring Al Hada, Al Shafa, and the cable car — all at fixed prices with no surge.",
    tldr: "Taxi Saudi Arabia provides fixed-price taxi service in Taif — day trips from Makkah (~90 km, ~1 hr 10) and Jeddah (~170 km), Taif Regional Airport (TIF) transfers, and mountain tours along the Al Hada and Al Shafa roads. Experienced drivers for the winding Sarawat routes.",
    tldrFacts: [
      { label: "To Makkah", value: "~90 km · ~1 hr 10" },
      { label: "To Jeddah", value: "~170 km · ~2 hr" },
      { label: "Airport", value: "TIF" },
      { label: "Pricing", value: "Fixed, no surge" }
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
      { question: "How much is a taxi from Makkah to Taif?", answer: "A fixed-price taxi from Makkah to Taif starts from around SAR 200. It is about 90 km — roughly a 1 hour 10 minute drive on the Al Hada mountain road, with an experienced driver for the winding route." },
      { question: "How far is Taif from Jeddah by taxi?", answer: "Taif is about 170 km from Jeddah — roughly a 2-hour drive. We offer fixed-price transfers and full-day car hire for sightseeing in the Taif highlands." },
      { question: "Can I do a day trip to Taif from Makkah?", answer: "Yes. A full-day car with a driver lets you visit Al Hada, the cable car, Al Shafa, and the rose farms, then return — a cool, scenic break from the Makkah heat." },
      { question: "Does Taif have an airport?", answer: "Yes, Taif Regional Airport (TIF) is about 25 km from the city. We provide meet & greet transfers from the airport to the city and the mountain resorts." },
      { question: "Is taxi available in Taif 24/7?", answer: "Yes, we operate around the clock in Taif for airport transfers, day trips, and mountain tours — at fixed prices confirmed before you book." }
    ]
  },
  alkhobar: {
    name: "Al Khobar",
    nameAr: "الخبر",
    image: "/locations/alkhobar-hero.webp",
    tagline: "Eastern Province Waterfront",
    description: "Book a fixed-price taxi in Al Khobar for corporate trips, Corniche outings, airport transfers from King Fahd International Airport (DMM) (~30 km), and cross-border journeys to Bahrain via the King Fahd Causeway (~1 hour). Al Khobar sits within the Dammam–Khobar–Dhahran metro area and is a hub for Aramco and business travellers. Our professional drivers provide reliable 24/7 service across the Eastern Province, with corporate sedans, family SUVs, and Causeway border assistance — all at fixed prices with no surge.",
    tldr: "Taxi Saudi Arabia provides 24/7 fixed-price taxi service in Al Khobar — King Fahd International Airport (DMM) transfers (~30 km), corporate and Corniche rides, and cross-border trips to Bahrain via the King Fahd Causeway (~1 hour). Part of the Dammam–Khobar–Dhahran metro coverage.",
    tldrFacts: [
      { label: "Airport (DMM)", value: "~30 km · ~35 min" },
      { label: "To Bahrain", value: "~1 hr (Causeway)" },
      { label: "Causeway", value: "~25 km" },
      { label: "Pricing", value: "Fixed, no surge" }
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
      { question: "How much is a taxi from Al Khobar to Dammam airport?", answer: "A fixed-price taxi from Al Khobar to King Fahd International Airport (DMM) starts from around SAR 90. It is about 30 km and a 35-minute drive, with meet & greet at arrivals." },
      { question: "Do you provide corporate taxi service in Al Khobar?", answer: "Yes. We offer corporate sedans and SUVs with professional drivers for Aramco, Dhahran, and business travel across the Eastern Province, with hourly and full-day options." },
      { question: "Is Al Khobar part of the same area as Dammam?", answer: "Yes — Al Khobar, Dammam, and Dhahran form one connected metro area. We cover all of it 24/7; just confirm your exact district when booking." },
      { question: "Is taxi available in Al Khobar 24/7?", answer: "Yes, we operate around the clock in Al Khobar for airport transfers, corporate travel, Corniche outings, and cross-border trips — at fixed prices with no surge." }
    ]
  },
  yanbu: {
    name: "Yanbu",
    nameAr: "ينبع",
    image: "/locations/yanbu-hero.webp",
    tagline: "Red Sea Diving & Industrial Hub",
    description: "Book a fixed-price taxi in Yanbu for airport transfers, Red Sea diving and beach trips, and intercity rides to Madinah (~240 km, ~2.5 hours) and Jeddah (~330 km). Yanbu is both a popular pilgrim gateway and a major industrial hub, so our professional drivers serve Yanbu Al-Bahr (the city), Yanbu Industrial City, and the resorts along the coast. Whether you are a pilgrim heading to Madinah, a diver visiting Sharm Yanbu, or a contractor working in the industrial zone, fares are fixed in advance with no surge pricing.",
    tldr: "Taxi Saudi Arabia provides fixed-price taxi service in Yanbu — airport transfers, Red Sea diving and beach trips, and intercity rides to Madinah (~240 km, ~2.5 hours) and Jeddah (~330 km). Drivers cover both Yanbu Al-Bahr and the Industrial City.",
    tldrFacts: [
      { label: "To Madinah", value: "~240 km · ~2.5 hr" },
      { label: "To Jeddah", value: "~330 km · ~3.5 hr" },
      { label: "Airport", value: "YNB" },
      { label: "Pricing", value: "Fixed, no surge" }
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
      { question: "How far is Yanbu from Madinah by taxi?", answer: "Yanbu to Madinah is about 240 km — roughly a 2.5-hour drive. It is a popular pilgrim route, and we offer fixed-price transfers in sedans, SUVs, and vans with prayer and rest stops." },
      { question: "Can I get a taxi from Yanbu to Jeddah?", answer: "Yes. Yanbu to Jeddah is about 330 km, roughly a 3.5-hour drive along the Red Sea coast. We provide fixed-price intercity transfers with comfortable vehicles for the journey." },
      { question: "Do you serve both Yanbu city and the Industrial City?", answer: "Yes — we cover Yanbu Al-Bahr (the city), Yanbu Industrial City, and the coastal resorts. The two areas are far apart, so confirm your exact location when booking." },
      { question: "Is there a taxi for Yanbu diving and beach trips?", answer: "Yes. We provide day trips to Sharm Yanbu and the coastal diving and beach spots, with vehicles that have room for diving equipment and luggage." },
      { question: "Is taxi available in Yanbu 24/7?", answer: "Yes, we operate around the clock in Yanbu for airport transfers, pilgrim routes to Madinah, and intercity travel — at fixed prices confirmed before you book." }
    ]
  },
  neom: {
    name: "NEOM",
    nameAr: "نيوم",
    image: "/locations/neom-hero.webp",
    tagline: "Saudi Arabia's Giga-Project",
    description: "Book a taxi or executive car in NEOM and the wider Tabuk region for business visits, construction-site transfers, and trips to the Red Sea and Gulf of Aqaba coast. NEOM is a vast development zone, so our drivers serve Tabuk City, NEOM Bay, Magna, and the project gates, with airport transfers from Tabuk Airport (TUU) and NEOM Bay Airport (NUM). Whether you are a contractor, investor, or visitor, we provide reliable executive vehicles with professional drivers at fixed prices and no surge.",
    tldr: "Taxi Saudi Arabia provides taxi and executive-car service across NEOM and the Tabuk region — Tabuk Airport (TUU) and NEOM Bay Airport (NUM) transfers, site and gate access trips, and journeys to the Red Sea coast and Gulf of Aqaba. Reliable transport for contractors, investors, and visitors.",
    tldrFacts: [
      { label: "Main airport", value: "Tabuk (TUU)" },
      { label: "Also", value: "NEOM Bay (NUM)" },
      { label: "Coast", value: "Gulf of Aqaba" },
      { label: "Pricing", value: "Fixed, no surge" }
    ],
    attractions: [
      { name: "NEOM Bay", dist: "Coastal" },
      { name: "Tabuk City", dist: "Regional Hub" },
      { name: "Gulf of Aqaba (Magna)", dist: "Coastal" },
      { name: "Sindalah Island", dist: "Coastal" },
      { name: "Tabuk Airport (TUU)", dist: "Regional" },
      { name: "NEOM Bay Airport (NUM)", dist: "Project Zone" }
    ],
    tips: [
      "NEOM is a large development zone — share your exact site or gate access details when booking.",
      "Tabuk Airport (TUU) is the main air gateway for the NEOM region; NEOM Bay Airport (NUM) serves the project directly.",
      "Distances within the project are large — an executive SUV is the most comfortable option.",
      "Site access may require permits — confirm your clearance before your transfer."
    ],
    faqs: [
      { question: "How do I get to NEOM?", answer: "The main air gateway is Tabuk Airport (TUU), with NEOM Bay Airport (NUM) serving the project directly. We provide transfers from both airports to the project zones, Tabuk City, and the coast." },
      { question: "Can I book an executive car for a NEOM business visit?", answer: "Yes. We offer executive sedans and SUVs with professional drivers for site visits, investor trips, and inter-zone transfers across NEOM and the Tabuk region, with hourly and full-day options." },
      { question: "Do I need a permit to access NEOM sites?", answer: "Some NEOM construction sites and gates require access permits or clearance. Confirm your clearance before booking so the driver can take you to the correct gate." },
      { question: "Does the taxi cover the Tabuk region and Red Sea coast?", answer: "Yes — we cover Tabuk City, NEOM Bay, Magna, and the Gulf of Aqaba coast. Share your exact destination when booking, as distances in the region are large." },
      { question: "Is transport available in NEOM 24/7?", answer: "Yes, we provide round-the-clock executive transport across NEOM and Tabuk for business visits, airport transfers, and coastal trips — at fixed prices confirmed in advance." }
    ]
  },
  abha: {
    name: "Abha",
    nameAr: "أبها",
    image: "/locations/abha-hero.webp",
    tagline: "The Misty Mountain City of Asir",
    description: "Book a fixed-price taxi in Abha for mountain tours, Soudah Peak trips, airport transfers from Abha International Airport (AHB), and rides across the Asir region including Khamis Mushait. Abha sits high in the Sarawat mountains and stays cool and misty year-round, making it Saudi Arabia's most popular summer escape. Our drivers are experienced on the steep, winding high-altitude roads and provide comfortable SUVs for families touring Soudah, the cable cars, and the heritage villages — all at fixed prices with no surge.",
    tldr: "Taxi Saudi Arabia provides fixed-price taxi service in Abha — Abha International Airport (AHB) transfers, Soudah Peak and cable-car trips, and rides across the Asir region including Khamis Mushait. Experienced drivers for the cool, misty high-altitude mountain roads.",
    tldrFacts: [
      { label: "Airport", value: "AHB" },
      { label: "Soudah Peak", value: "~25 km" },
      { label: "To Khamis Mushait", value: "~25 km" },
      { label: "Pricing", value: "Fixed, no surge" }
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
      { question: "How much is a taxi from Abha airport to the city?", answer: "A fixed-price taxi from Abha International Airport (AHB) to the city centre starts from around SAR 80. It is about 25 km, with meet & greet at arrivals and experienced mountain drivers." },
      { question: "Can I do a Soudah Peak day trip from Abha?", answer: "Yes. A full-day car with a driver takes you to Soudah Peak, the cable car, and the viewpoints, then back — the easiest way to enjoy the highlands without driving the steep roads yourself." },
      { question: "Is an SUV better for Abha's mountain roads?", answer: "Yes. The roads to Soudah and the Asir highlands are steep and winding, so a comfortable SUV with an experienced local driver is recommended, especially for families." },
      { question: "Does the taxi cover Khamis Mushait too?", answer: "Yes — Abha and Khamis Mushait are about 25 km apart and we cover both, along with the Asir heritage villages and viewpoints, 24/7 at fixed prices." },
      { question: "Is taxi available in Abha 24/7?", answer: "Yes, we operate around the clock in Abha for airport transfers, mountain tours, and rides across the Asir region — at fixed prices confirmed before you book." }
    ]
  }
};

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const cityData = CITY_DETAILS[city.toLowerCase()];

  if (!cityData) return { title: "Location Not Found" };

  return {
    title: `Taxi in ${cityData.name} | Airport & Intercity — Taxi Saudi Arabia`,
    description: `Book a fixed-price taxi in ${cityData.name}, Saudi Arabia — airport transfers, Umrah rides, and 24/7 intercity trips with licensed drivers. No surge, instant quote.`,
    alternates: {
      canonical: `https://taxisaudiarabia.com/locations/${city}`,
    },
    openGraph: {
      title: `Taxi Service in ${cityData.name} | Taxi Saudi Arabia`,
      description: `Book a taxi in ${cityData.name} at fixed prices. Airport transfers, Umrah rides, and intercity taxi service. Available 24/7 with licensed drivers.`,
      type: "website",
      url: `https://taxisaudiarabia.com/locations/${city}`,
      images: [
        {
          url: `https://taxisaudiarabia.com/locations/${city.toLowerCase()}-og.webp`,
          width: 1200,
          height: 630,
          alt: `Taxi service in ${cityData.name}, Saudi Arabia`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Taxi Service in ${cityData.name} | Taxi Saudi Arabia`,
      description: `Fixed-price taxi in ${cityData.name} — airport transfers, Umrah rides, and 24/7 intercity trips.`,
      images: [`https://taxisaudiarabia.com/locations/${city.toLowerCase()}-og.webp`],
    },
  };
}

export default async function CityLocationPage({ params }: PageProps) {
  const { city } = await params;
  const cityKey = city.toLowerCase();
  
  // Default fallback if city not strictly defined
  const cityData = CITY_DETAILS[cityKey] || {
    name: city.charAt(0).toUpperCase() + city.slice(1),
    nameAr: "",
    image: "/locations/riyadh-hero.webp",
    tagline: "Taxi & Car Service",
    description: `Reliable taxi and car service in ${city}, Saudi Arabia. Airport transfers, intercity rides, and local pickups with licensed drivers.`,
    attractions: [],
    tips: []
  };

  // Fetch routes connected to this city
  const cityRoutes = await db.route.findMany({
    where: {
      OR: [
        { fromCity: { contains: cityData.name, mode: 'insensitive' } },
        { toCity: { contains: cityData.name, mode: 'insensitive' } }
      ]
    },
    take: 10
  });

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={serviceSchema({
          name: `Taxi Service in ${cityData.name}`,
          description: cityData.description,
          path: `/locations/${cityKey}`,
          serviceType: "Local Taxi & Car Service",
          areaServed: [cityData.name],
        })}
      />
      {cityData.faqs && cityData.faqs.length > 0 && (
        <JsonLd data={faqSchema(cityData.faqs)} />
      )}
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
          { name: cityData.name, href: `/locations/${cityKey}` },
        ]}
      />
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={cityData.image}
            alt={`Taxi service in ${cityData.name}, Saudi Arabia — airport transfers and intercity rides`}
            fill
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/20 backdrop-blur-sm px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <MapPin className="h-3 w-3" /> Location Guide
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
            Taxi Service in <br />
            <span className="text-[#16A34A]">{cityData.name}</span>
          </h1>
          <p className="text-[#C9A84C] text-sm tracking-widest uppercase font-bold mt-2 mb-6">{cityData.nameAr} - {cityData.tagline}</p>
          <p className="max-w-2xl text-sm md:text-base text-[#6B7280] leading-relaxed">
            {cityData.description}
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href={`/book?pickup=${encodeURIComponent(cityData.name)}`}
              className="flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              <Car className="h-4 w-4" />
              Book a Taxi Now
            </Link>
          </div>
        </div>
      </section>

      <div className="section-container max-w-5xl mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ─── MAIN CONTENT ───────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-16">

          {/* Quick Answer (above-the-fold AI/snippet signal) */}
          {cityData.tldr && (
            <TLDRSummary answer={cityData.tldr} facts={cityData.tldrFacts} />
          )}

          {/* Available Routes */}
          <section>
            <h2 className="font-heading text-3xl font-bold mb-8">Popular Routes from/to {cityData.name}</h2>
            {cityRoutes.length > 0 ? (
              <div className="grid gap-4">
                {cityRoutes.map((route) => (
                  <Link href={`/routes/${route.slug}`} key={route.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-white border border-[#16A34A]/12 hover:border-[#16A34A]/35 transition-colors">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="font-bold">{route.fromCity}</div>
                      <ArrowRight className="h-4 w-4 text-[#C9A84C]" />
                      <div className="font-bold">{route.toCity}</div>
                    </div>
                    <div className="flex items-center justify-between md:gap-6">
                      <div className="text-right">
                        <p className="text-[0.6rem] text-[#6B7280] uppercase font-bold">Starting from</p>
                        <p className="text-[#C9A84C] font-bold">SAR {route.basePrice}</p>
                      </div>
                      <div className="bg-[#C9A84C]/10 text-[#C9A84C] rounded-full p-2 group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[#6B7280]">Currently mapping custom routes for this city. Please contact us for a quote.</p>
            )}
            <div className="mt-6">
              <Link href="/routes" className="text-[#C9A84C] text-sm font-bold hover:underline">View all 50+ Kingdom-wide routes &rarr;</Link>
            </div>
          </section>

          {/* Local Tips */}
          {cityData.tips.length > 0 && (
            <section className="bg-white border border-[#16A34A]/12 rounded-3xl p-8">
              <h2 className="font-heading text-2xl font-bold mb-6 text-[#1C1C1C]">Local Travel Tips</h2>
              <ul className="space-y-4">
                {cityData.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-4">
                    <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#6B7280]">{tip}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs (FAQPage schema injected above) */}
          {cityData.faqs && cityData.faqs.length > 0 && (
            <section>
              <h2 className="font-heading text-3xl font-bold mb-8 flex items-center gap-3">
                <HelpCircle className="text-[#C9A84C] h-7 w-7" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {cityData.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-[#16A34A]/12 rounded-2xl p-6 bg-white">
                    <h3 className="font-bold text-base mb-2 text-[#1C1C1C]">{faq.question}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews / Testimonials (EEAT trust signals) */}
          {cityData.testimonials && cityData.testimonials.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <h2 className="font-heading text-3xl font-bold flex items-center gap-3">
                  <Star className="text-[#C9A84C] h-7 w-7 fill-[#C9A84C]" />
                  What {cityData.name} Travellers Say
                </h2>
                <div className="flex items-center gap-1 text-[#C9A84C]">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#C9A84C]" />)}
                  <span className="text-sm font-bold text-[#1C1C1C] ml-2">4.9/5</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {cityData.testimonials.map((t, idx) => (
                  <div key={idx} className="border border-[#16A34A]/12 rounded-2xl p-6 bg-white relative">
                    <Quote className="h-6 w-6 text-[#C9A84C]/30 mb-3" />
                    <p className="text-sm text-[#6B7280] leading-relaxed italic mb-4">&quot;{t.quote}&quot;</p>
                    <div className="flex items-center justify-between border-t border-[#C9A84C]/10 pt-3">
                      <div>
                        <p className="text-sm font-bold text-[#1C1C1C]">{t.author}</p>
                        <p className="text-[0.7rem] text-[#6B7280]">{t.location}</p>
                      </div>
                      <span className="text-[0.6rem] uppercase tracking-wider text-[#B8963B] bg-[#C9A84C]/10 px-2 py-1 rounded-md">{t.trip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* ─── SIDEBAR ────────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Attractions */}
          {cityData.attractions.length > 0 && (
            <div className="bg-white border border-[#16A34A]/12 rounded-3xl p-6">
              <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                <Building2 className="text-[#C9A84C] h-5 w-5" /> Key Destinations
              </h3>
              <div className="space-y-4">
                {cityData.attractions.map((attr, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-[#C9A84C]/10 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm font-bold text-[#1C1C1C]">{attr.name}</span>
                    <span className="text-[0.65rem] uppercase tracking-wider text-[#B8963B] bg-[#C9A84C]/10 px-2 py-1 rounded-md">{attr.dist}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Recommendation */}
          <div className="bg-white border border-[#16A34A]/15 shadow-lg rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 text-[#C9A84C]">
              <Car className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <span className="text-[0.6rem] uppercase tracking-widest text-[#C9A84C] font-bold">Recommended</span>
              <h3 className="font-heading text-xl font-bold mt-1 mb-2">SUV Class</h3>
              <p className="text-xs text-[#6B7280] mb-6 leading-relaxed">
                For optimal comfort and ample luggage space in {cityData.name}, our premium SUV fleet (GMC Yukon, Chevy Tahoe) is highly recommended.
              </p>
              <Link
                href={`/book?pickup=${encodeURIComponent(cityData.name)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#16A34A] py-3 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
              >
                Reserve Vehicle
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
