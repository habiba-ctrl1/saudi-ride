// City data for the driver / chauffeur recruitment pages (/driver-jobs/[city]).
// One template + this array generates one SEO landing page per city, each with
// JobPosting schema. Salary ranges are indicative monthly earnings in SAR.

export interface DriverJobCity {
  slug: string;
  name: string;
  nameAr: string;
  region: string;
  /** Indicative monthly earnings range in SAR. */
  salary: [number, number];
  demand: "Very High" | "High" | "Steady";
  /** One-line why-drive-here hook. */
  hook: string;
  /** Where most trips come from in this city. */
  hubs: string[];
}

export const DRIVER_JOB_CITIES: DriverJobCity[] = [
  { slug: "riyadh", name: "Riyadh", nameAr: "الرياض", region: "Riyadh Province", salary: [4500, 11000], demand: "Very High", hook: "The capital's business, airport and corporate demand keeps premium drivers busy all week.", hubs: ["King Khalid International Airport (RUH)", "KAFD & Olaya business district", "Diriyah & Boulevard tourism zones"] },
  { slug: "jeddah", name: "Jeddah", nameAr: "جدة", region: "Makkah Province", salary: [4500, 12000], demand: "Very High", hook: "Saudi Arabia's pilgrim gateway — non-stop airport-to-Makkah transfers and Corniche tourism.", hubs: ["King Abdulaziz International Airport (JED)", "Jeddah Islamic Port (cruise pilgrims)", "Al-Balad & Corniche tourism"] },
  { slug: "makkah", name: "Makkah", nameAr: "مكة المكرمة", region: "Makkah Province", salary: [5000, 13000], demand: "Very High", hook: "Year-round Umrah and seasonal Hajj demand — the highest-volume city for pilgrim transport.", hubs: ["Masjid Al-Haram drop zones", "Aziziyah & Kudai hotel districts", "Makkah–Madinah & Makkah–Jeddah routes"] },
  { slug: "madinah", name: "Madinah", nameAr: "المدينة المنورة", region: "Madinah Province", salary: [4500, 11000], demand: "Very High", hook: "Prophet's Mosque visitors, Ziyarat tours and airport transfers run all year.", hubs: ["Prince Mohammad Bin Abdulaziz Airport (MED)", "Masjid An-Nabawi central area", "Quba & Uhud Ziyarat circuit"] },
  { slug: "dammam", name: "Dammam", nameAr: "الدمام", region: "Eastern Province", salary: [4000, 9500], demand: "High", hook: "Eastern Province energy-sector and Bahrain-causeway cross-border demand.", hubs: ["King Fahd International Airport (DMM)", "King Fahd Causeway to Bahrain", "Corniche & business areas"] },
  { slug: "khobar", name: "Al Khobar", nameAr: "الخبر", region: "Eastern Province", salary: [4000, 9500], demand: "High", hook: "Corporate Aramco-belt travel plus weekend Bahrain crossings.", hubs: ["Half Moon Bay & Corniche", "Bahrain Causeway", "Dhahran corporate offices"] },
  { slug: "taif", name: "Taif", nameAr: "الطائف", region: "Makkah Province", salary: [3800, 9000], demand: "High", hook: "Summer mountain tourism and the Makkah Miqat route keep drivers in demand.", hubs: ["Taif Regional Airport (TIF)", "Al-Hada & Al-Shafa cable car", "Miqat Qarn Al-Manazil"] },
  { slug: "tabuk", name: "Tabuk", nameAr: "تبوك", region: "Tabuk Province", salary: [4000, 10000], demand: "High", hook: "Gateway to NEOM, AlUla and Red Sea tourism — long high-value transfers.", hubs: ["Tabuk Airport (TUU)", "NEOM & Sharma corridor", "AlUla & Red Sea beaches"] },
  { slug: "abha", name: "Abha", nameAr: "أبها", region: "Asir Province", salary: [3500, 8500], demand: "Steady", hook: "Asir highland tourism peaks in summer with strong domestic-tourist demand.", hubs: ["Abha International Airport (AHB)", "Al-Soudah mountains", "Khamis Mushait corridor"] },
  { slug: "buraidah", name: "Buraidah", nameAr: "بريدة", region: "Al-Qassim Province", salary: [3500, 8000], demand: "Steady", hook: "Al-Qassim agricultural and festival traffic plus intercity Riyadh links.", hubs: ["Prince Naif Airport (ELQ)", "Unaizah & Al-Rass towns", "Date festival season"] },
  { slug: "al-ahsa", name: "Al-Ahsa", nameAr: "الأحساء", region: "Eastern Province", salary: [3800, 8800], demand: "High", hook: "UNESCO oasis tourism and Eastern Province intercity routes.", hubs: ["Al-Ahsa Airport (HOF)", "Hofuf & Al-Mubarraz", "Oasis heritage sites"] },
  { slug: "hail", name: "Hail", nameAr: "حائل", region: "Hail Province", salary: [3500, 8000], demand: "Steady", hook: "Northern hub for desert tourism and the rally season.", hubs: ["Hail Regional Airport (HAS)", "A'arif Fort & old town", "Desert rally events"] },
  { slug: "najran", name: "Najran", nameAr: "نجران", region: "Najran Province", salary: [3500, 8000], demand: "Steady", hook: "Southern border city with heritage tourism and cross-region travel.", hubs: ["Najran Domestic Airport (EAM)", "Al-Ukhdood heritage site", "Border-region transfers"] },
  { slug: "jubail", name: "Jubail", nameAr: "الجبيل", region: "Eastern Province", salary: [4000, 9500], demand: "High", hook: "Major industrial city — steady corporate and contractor transport.", hubs: ["Jubail Industrial City", "Corporate housing compounds", "Dammam/Khobar corridor"] },
  { slug: "dhahran", name: "Dhahran", nameAr: "الظهران", region: "Eastern Province", salary: [4000, 9500], demand: "High", hook: "Aramco headquarters and Ithra cultural traffic drive premium corporate rides.", hubs: ["Aramco HQ & compounds", "Ithra (King Abdulaziz Center)", "KFUPM & business district"] },
  { slug: "khamis-mushait", name: "Khamis Mushait", nameAr: "خميس مشيط", region: "Asir Province", salary: [3500, 8000], demand: "Steady", hook: "Twin city to Abha with strong summer highland-tourism overflow.", hubs: ["Abha Airport corridor", "Highland resorts", "Asir intercity routes"] },
  { slug: "yanbu", name: "Yanbu", nameAr: "ينبع", region: "Madinah Province", salary: [3800, 8800], demand: "High", hook: "Red Sea industrial port and diving tourism with Madinah-route demand.", hubs: ["Yanbu Industrial City", "Red Sea diving beaches", "Madinah & Jeddah routes"] },
  { slug: "al-qassim", name: "Al-Qassim", nameAr: "القصيم", region: "Al-Qassim Province", salary: [3500, 8000], demand: "Steady", hook: "Regional agricultural hub with festival-season and intercity traffic.", hubs: ["Prince Naif Airport (ELQ)", "Buraidah & Unaizah", "Riyadh & Hail corridors"] },
];

export function getDriverJobCity(slug: string) {
  return DRIVER_JOB_CITIES.find((c) => c.slug === slug);
}

// Requirements + benefits are the same network-wide, so they live here once.
export const DRIVER_REQUIREMENTS = [
  "Valid Saudi driving license (clean record, no active violations)",
  "Vehicle model year 2020 or newer in spotless condition (or join with our fleet)",
  "Conversational Arabic & English (extra languages a plus for pilgrim trips)",
  "Smartphone for dispatch, navigation and customer contact",
  "Professional appearance and strong customer-service attitude",
];

export const DRIVER_BENEFITS = [
  "Steady pre-booked trips — no waiting around for street hails",
  "Fixed, transparent fares — you know the earnings before you accept",
  "Weekly payouts with no hidden platform deductions",
  "Flexible dispatch hours — drive full-time or around your schedule",
  "Priority on high-value airport, Umrah and corporate jobs",
];

// Three keyword-variant landing pages share the same city data but use a
// different angle so each ranks for its own search phrase WITHOUT being a
// duplicate of the others (each is its own canonical URL).
export type JobVariant = "driver-jobs" | "chauffeur-jobs" | "taxi-driver-jobs";

export interface JobVariantConfig {
  /** URL base, e.g. "/chauffeur-jobs". City is appended: /chauffeur-jobs/riyadh */
  urlBase: string;
  /** Breadcrumb + nav label. */
  label: string;
  /** Role title used in <h1> and JobPosting schema. */
  role: string;
  /** Search keyword this page targets. */
  keyword: string;
  /** Angle-specific intro fragment (after "Become a … in {city}"). */
  angle: string;
  /** Salary multiplier vs base city range (chauffeur skews premium). */
  salaryFactor: number;
  /** Extra requirement lines unique to this angle. */
  extraRequirements: string[];
  /** Which trip type to highlight first in the earnings table. */
  focusTrip: string;
}

export const JOB_VARIANTS: Record<JobVariant, JobVariantConfig> = {
  "driver-jobs": {
    urlBase: "/driver-jobs",
    label: "Driver Jobs",
    role: "Taxi & Chauffeur Driver",
    keyword: "driver jobs",
    angle: "Drive a mix of airport, city and intercity trips — full-time or alongside your schedule.",
    salaryFactor: 1,
    extraRequirements: [],
    focusTrip: "Airport transfers",
  },
  "chauffeur-jobs": {
    urlBase: "/chauffeur-jobs",
    label: "Chauffeur Jobs",
    role: "Professional Chauffeur",
    keyword: "chauffeur jobs",
    angle: "Serve VIP, corporate and luxury-fleet clients who book premium, repeat rides — the highest-earning tier.",
    salaryFactor: 1.25,
    extraRequirements: [
      "Formal attire (dark suit or traditional Saudi dress) for VIP clients",
      "Premium vehicle (or drive our luxury fleet — Genesis, GMC, S-Class)",
      "Discreet, concierge-level etiquette and route knowledge",
    ],
    focusTrip: "Corporate / VIP travel",
  },
  "taxi-driver-jobs": {
    urlBase: "/taxi-driver-jobs",
    label: "Taxi Driver Jobs",
    role: "Taxi Driver",
    keyword: "taxi driver jobs",
    angle: "Handle everyday airport pickups, city rides and intercity runs with flexible hours and fast payouts.",
    salaryFactor: 0.95,
    extraRequirements: [],
    focusTrip: "City & airport rides",
  },
};

export function getJobVariant(v: string): JobVariantConfig | undefined {
  return JOB_VARIANTS[v as JobVariant];
}

/** Apply a variant's salary skew to a city's base range. */
export function variantSalary(base: [number, number], factor: number): [number, number] {
  const round = (n: number) => Math.round((n * factor) / 100) * 100;
  return [round(base[0]), round(base[1])];
}
