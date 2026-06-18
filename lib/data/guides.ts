import {
  Smartphone,
  Heart,
  CreditCard,
  Plane,
  Sun,
  MapPin,
  LucideIcon
} from "lucide-react";

export interface Guide {
  slug: string;
  category: string;
  icon: LucideIcon;
  title: string;
  titleAr: string;
  summary: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: "jeddah-airport-sim-card",
    category: "arrival",
    icon: Smartphone,
    title: "SIM Card Guide at Jeddah Airport",
    titleAr: "دليل الشريحة في مطار جدة",
    summary: "Exactly where to buy local 5G eSIMs from stc, Mobily, or Zain at Terminal 1 and the North Terminal upon landing.",
    date: "May 12, 2026",
    readTime: "4 min",
    tags: ["Jeddah", "SIM Card", "Airport Tips"],
    content: [
      "stc (STC) booths are located immediately after baggage claim on the right — best 5G coverage nationwide.",
      "Mobily kiosks are available in the arrivals hall — cheaper data plans, good for short stays.",
      "Zain counters open 24/7 near exit gates — ask for the 'Hajj & Umrah' tourist SIM for pilgrim bundles.",
      "eSIM: Use the stc or Zain app to activate a digital SIM before landing for seamless arrival connectivity.",
      "Price range: SAR 60–150 depending on data bundle (10GB to Unlimited monthly).",
    ],
  },
  {
    slug: "meeqat-locations",
    category: "umrah",
    icon: Heart,
    title: "Complete Meeqat Locations Guide for Umrah",
    titleAr: "دليل مواقيت العمرة الكامل",
    summary: "Step-by-step guidance on all 5 Meeqat points for international pilgrims arriving by air or road — including Dhul Hulaifah and Yalamlam.",
    date: "May 8, 2026",
    readTime: "7 min",
    tags: ["Umrah", "Meeqat", "Pilgrim Guide"],
    content: [
      "Dhul Hulaifah (Abyar Ali): For pilgrims from Madinah — enter ihram before departing to Makkah.",
      "Al-Juhfah (Rabigh): For pilgrims from Syria, Jordan, and Egypt — most international flights connect via Jeddah and the Meeqat is near Rabigh.",
      "Yalamlam: For pilgrims from Yemen and those arriving by sea on the western side.",
      "Qarn Al-Manazil (As-Sayl): For pilgrims from Najd and those flying into Taif airport.",
      "Dhat Irq: For pilgrims from Iraq — eastern approach to Makkah.",
      "Pro Tip: If you're flying into Jeddah, you must enter ihram on the aircraft before crossing the Meeqat boundary — the crew will announce it.",
    ],
  },
  {
    slug: "saudi-riyal-pilgrim-guide",
    category: "money",
    icon: CreditCard,
    title: "Saudi Riyal Cash & Card Tips for Pilgrims",
    titleAr: "نصائح العملة للحجاج والزوار",
    summary: "Everything about card acceptance, the local Mada network, currency exchange outlets, and ATM fee limits in KSA.",
    date: "April 29, 2026",
    readTime: "5 min",
    tags: ["Money", "Currency", "Finance"],
    content: [
      "ATMs: Use Al-Rajhi, Al-Ahli (ANB), or Riyad Bank ATMs — lowest international withdrawal fees (typically SAR 15–20 per transaction).",
      "Mada network: All local debit transactions. Most shops accept international Visa/MC contactless.",
      "Apple Pay & Google Pay are widely accepted in Riyadh, Jeddah, and major malls — even for small purchases.",
      "Currency exchange: Best rates at airport exchange desks (not the first booth you see). Travelex rates are 5–8% worse than local exchangers.",
      "Cash is still king in Makkah/Madinah small shops, taxis, and street vendors. Carry at least SAR 500–1000 in small notes.",
      "Emergency: Western Union and MoneyGram are available at most Saudi Post branches.",
    ],
  },
  {
    slug: "jeddah-airport-guide",
    category: "arrival",
    icon: Plane,
    title: "Jeddah Airport Arrivals — Full Walk-Through",
    titleAr: "دليل وصول مطار جدة الشامل",
    summary: "Terminal layout, immigration queues, baggage claim zones, VIP arrival halls, and how to find your Taxi Saudi Arabia driver.",
    date: "April 21, 2026",
    readTime: "6 min",
    tags: ["Jeddah", "Airport", "Arrival"],
    content: [
      "Terminal 1 (International): Arrivals on Level 0 — immigration first, baggage claim in Halls A, B, C, D depending on your flight.",
      "North Terminal (Domestic): Smaller, faster processing — used for KSA internal flights.",
      "Hajj Terminal: Seasonal — used exclusively during Hajj season for pilgrims. Completely separate facility.",
      "VIP arrivals hall (Level 1): Available for business/first class passengers — ask your airline at check-in.",
      "Finding your driver: Your Taxi Saudi Arabia driver will be standing in the Arrivals Meet Zone with your name on a digital sign.",
      "WhatsApp your driver directly from the booking confirmation SMS — no waiting, no confusion.",
    ],
  },
  {
    slug: "umrah-packing-checklist",
    category: "umrah",
    icon: Heart,
    title: "The Ultimate Umrah Packing List",
    titleAr: "قائمة تجهيزات العمرة الشاملة",
    summary: "From ihram garments to medication and digital essentials — a complete packing checklist for pilgrims performing Umrah.",
    date: "April 15, 2026",
    readTime: "8 min",
    tags: ["Umrah", "Packing", "Preparation"],
    content: [
      "Ihram: 2 sets minimum (one to wear, one clean backup). Seamless white cotton — available at Jeddah airport too.",
      "Footwear: Rubber sandals with no back-strap for men. Comfortable closed shoes for women.",
      "Medications: Paracetamol, electrolyte sachets, blister pads, anti-diarrheal tablets, and any prescription drugs (with Arabic prescription copies).",
      "Digital: Saudi eVisa saved on your phone (offline), booking confirmations, emergency contacts.",
      "Cash: Carry SAR 500–1000 in notes of 50 and 100 denomination.",
      "Zamzam: You're allowed 5 liters in checked luggage on departure — available free from dispensers throughout the Haram.",
    ],
  },
  {
    slug: "saudi-customs-pilgrims",
    category: "culture",
    icon: Sun,
    title: "Saudi Arabia — Customs, Etiquette & Laws for Visitors",
    titleAr: "العادات والقوانين للزوار في المملكة",
    summary: "Essential cultural norms, dress codes, photography rules, and things to know before entering the Kingdom as a tourist or pilgrim.",
    date: "April 8, 2026",
    readTime: "6 min",
    tags: ["Culture", "Laws", "Saudi Arabia"],
    content: [
      "Dress code: Modest clothing required in holy areas. Women are no longer required to wear abaya in public but modest dress is encouraged.",
      "Photography: NEVER photograph government buildings, military sites, or people without permission. The Haram interior photography is restricted.",
      "Alcohol: Strictly prohibited. Zero tolerance — criminal penalties apply.",
      "Prayer times: Many shops close briefly during Salah. Build 15–20 minute buffers into schedules.",
      "Ramadan: Business hours shift significantly. Eating/drinking in public during daylight hours is illegal for all.",
      "Respect: Stand when national anthem plays, remove shoes before entering mosques, greet with 'As-salamu alaykum'.",
    ],
  },
  {
    slug: "riyadh-business-travel",
    category: "business",
    icon: MapPin,
    title: "Riyadh Business District Navigator",
    titleAr: "دليل الأحياء التجارية في الرياض",
    summary: "KAFD, Olaya, Diplomatic Quarter, and King Abdullah Financial District — your executive's guide to navigating Riyadh's business zones.",
    date: "March 30, 2026",
    readTime: "5 min",
    tags: ["Riyadh", "Business", "Corporate"],
    content: [
      "KAFD (King Abdullah Financial District): Ultra-modern skyscraper district in north Riyadh — home to major banks, PIF, and global firms.",
      "Olaya Street: The traditional business heart — major hotels (Four Seasons, Ritz-Carlton), restaurants, and corporate towers.",
      "Diplomatic Quarter (DQ): Embassies, international schools, and secure residential compounds. Strict access controls.",
      "Al Faisaliah Tower: Iconic landmark — conference facilities, restaurants, and executive suites.",
      "Traffic: Riyadh rush hours are 7–9am and 4–8pm. Allow 45-min buffers for cross-city transfers during peak.",
      "driver tip: Pre-book your Taxi Saudi Arabia driver for the full meeting day — hourly charter saves time and avoids Uber surge pricing.",
    ],
  },
  {
    slug: "alula-transport-guide",
    category: "tourism",
    icon: MapPin,
    title: "AlUla Visitor Guide — Hegra, Dadan & the Rose City",
    titleAr: "دليل زيارة العلا — الحجر ودادان",
    summary: "Everything you need to know about visiting AlUla's UNESCO world heritage sites, rock formations, and luxury resort experiences.",
    date: "March 20, 2026",
    readTime: "9 min",
    tags: ["AlUla", "Tourism", "Heritage"],
    content: [
      "Hegra (Mada'in Salih): Saudi Arabia's first UNESCO World Heritage Site — 111 Nabataean tombs carved from rose sandstone.",
      "Dadan: The ancient capital of the Dadanite kingdom — predates Hegra. Guided access only via AlUla Experience tours.",
      "Jabal Ikmah: Open-air library of ancient inscriptions — largest in the Arabian Peninsula.",
      "Elephant Rock (Jabal Al-Fil): A natural rock formation resembling an elephant — free access, stunning at sunset.",
      "Best time to visit: October to March — temperatures between 15–25°C. Avoid summers (40°C+).",
      "Getting there: Direct flights from Riyadh/Jeddah to ULH Airport, or a premium road transfer (~10 hours from Riyadh).",
    ],
  },
];
