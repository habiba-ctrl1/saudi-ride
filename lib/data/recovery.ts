// Car recovery / towing (سطحة) service data — hub page + city pages.
// Add a new city here and it automatically gets a page, sitemap entry, and internal links.

export interface RecoveryCity {
  slug: string;
  name: string;
  nameAr: string;      // Arabic city name, e.g. الرياض
  sathaAr: string;     // the exact Arabic search phrase, e.g. سطحة الرياض
  tagline: string;
  intro: string;       // unique per-city paragraph (no duplicate content)
  image: string;
  startingPrice: number; // SAR, within-city flatbed tow
  areas: string[];       // districts / nearby towns covered
  highways: string[];    // major roads where breakdowns happen
  faqs: { question: string; answer: string }[];
}

export const RECOVERY_WHATSAPP_TEXT =
  "Salam, I need car recovery (satha). My location: ";

export const RECOVERY_SERVICES = [
  {
    key: "flatbed",
    name: "Flatbed Tow Truck (Satha سطحة)",
    desc: "Hydraulic flatbed recovery for sedans, SUVs, and luxury cars. Your vehicle is carried fully off the ground — zero wear on the transmission, ideal for AWD and low-clearance cars.",
  },
  {
    key: "breakdown",
    name: "Breakdown & Accident Recovery",
    desc: "Engine failure, overheating, or an accident on the highway — we recover your car from anywhere and deliver it to the workshop, dealership, or your home.",
  },
  {
    key: "battery",
    name: "Battery Jump Start",
    desc: "Dead battery in a parking lot or at home? A recovery unit reaches you with jump-start equipment. If the battery is finished, we tow you to the nearest battery shop.",
  },
  {
    key: "tire",
    name: "Flat Tire Assistance",
    desc: "Tire burst on the road? We help you switch to the spare on the spot, or flatbed the car to the nearest tire shop if there is no spare.",
  },
  {
    key: "intercity",
    name: "Intercity Car Transport",
    desc: "Moving a car between cities — Riyadh to Jeddah, Dammam to Riyadh, or any route in the Kingdom. Enclosed and open flatbed transport, priced on WhatsApp.",
  },
  {
    key: "heavy",
    name: "Heavy & Commercial Recovery",
    desc: "Buses, vans, pickups, and light commercial trucks. Our network includes heavy-duty loaders and winch trucks (ونش) for bigger vehicles and equipment.",
  },
] as const;

// Indicative pricing — final quote always confirmed on WhatsApp before dispatch.
export const RECOVERY_PRICING = [
  { service: "Within-city flatbed tow (up to 10 km)", price: "SAR 200 – 300" },
  { service: "Within-city flatbed tow (10 – 30 km)", price: "SAR 250 – 450" },
  { service: "Battery jump start", price: "SAR 120 – 200" },
  { service: "Flat tire change (your spare)", price: "SAR 120 – 200" },
  { service: "Riyadh ⇄ Dammam car transport (~410 km)", price: "SAR 1,100 – 1,600" },
  { service: "Jeddah ⇄ Riyadh car transport (~950 km)", price: "SAR 1,800 – 2,600" },
  { service: "Jeddah ⇄ Makkah tow (~80 km)", price: "SAR 350 – 500" },
  { service: "Heavy vehicle / bus recovery", price: "Quoted on WhatsApp" },
];

export const RECOVERY_GLOBAL_FAQS = [
  {
    question: "How fast can a recovery truck (satha) reach me?",
    answer:
      "Inside major cities like Riyadh, Jeddah, and Dammam, a flatbed usually reaches you in 20–45 minutes depending on traffic and your district. On intercity highways it depends on the nearest available unit — share your live location on WhatsApp and we confirm the exact ETA before dispatch.",
  },
  {
    question: "How much does car towing cost in Saudi Arabia?",
    answer:
      "A within-city flatbed tow typically starts from SAR 200. Longer distances are priced per kilometre, and intercity transport (for example Riyadh to Dammam) ranges from roughly SAR 1,100–1,600. You always get a clear price on WhatsApp before the truck moves — no surprises on arrival.",
  },
  {
    question: "What is the difference between a satha (سطحة) and a normal tow truck?",
    answer:
      "A satha is a flatbed: your car is winched fully onto the truck bed, so no wheels touch the road during transport. This is the safest method for automatic, AWD, and luxury vehicles. Traditional hook-and-chain tow trucks drag two wheels on the road and can damage modern cars — we always recommend flatbed.",
  },
  {
    question: "Do you work at night and on Fridays?",
    answer:
      "Yes — recovery is 24/7, including late nights, Fridays, and public holidays. Breakdowns don't keep office hours, and neither do we.",
  },
  {
    question: "Can you recover my car if I'm not with it?",
    answer:
      "Yes. Share the car's location, a photo, and the drop-off address on WhatsApp. Many customers send us their key with a guard or family member and track the delivery by phone.",
  },
  {
    question: "Do you transport cars between cities?",
    answer:
      "Yes — intercity car transport is one of our main services. Riyadh, Jeddah, Dammam, Makkah, Madinah, and everywhere in between. If you are travelling too, you can book a taxi for yourself on the same route and we move the car in parallel.",
  },
  {
    question: "What information do you need when I call?",
    answer:
      "Three things: your location (share live location on WhatsApp), your car make/model, and what happened (breakdown, accident, flat battery, etc.). We reply with a clear price and ETA within minutes.",
  },
];

export const RECOVERY_CITIES: RecoveryCity[] = [
  {
    slug: "riyadh",
    name: "Riyadh",
    nameAr: "الرياض",
    sathaAr: "سطحة الرياض",
    tagline: "24/7 flatbed recovery across the capital",
    intro:
      "From Olaya and KAFD to Al-Malaz, Diriyah, and the industrial areas of the south, our recovery network covers every district of Riyadh. The capital's long distances and summer heat make breakdowns common on the Ring Roads — a flatbed (satha) typically reaches you within 20–40 minutes, day or night. We also handle daily car transport between Riyadh and Dammam, Qassim, and Jeddah.",
    image: "/locations/riyadh-hero.webp",
    startingPrice: 200,
    areas: ["Olaya", "KAFD", "Al-Malaz", "Al-Nasim", "Diriyah", "Exit 5–18 districts", "Second Industrial City", "Al-Kharj Road"],
    highways: ["Eastern Ring Road", "Northern Ring Road", "King Fahd Road", "Riyadh–Dammam Highway (Route 40)", "Riyadh–Qassim Highway (Route 65)", "Al-Kharj Road"],
    faqs: [
      {
        question: "How much is a satha in Riyadh?",
        answer:
          "A flatbed tow within Riyadh starts from around SAR 200 for short distances (up to ~10 km) and SAR 250–450 for longer cross-city moves like Olaya to the Second Industrial City. Send your location and destination on WhatsApp for a fixed price.",
      },
      {
        question: "My car broke down on the Riyadh–Dammam highway. Can you recover it?",
        answer:
          "Yes — Route 40 is one of our most covered highways. Share your live location and we dispatch the nearest flatbed. We can tow you back to Riyadh, onward to Dammam, or to any workshop on the way.",
      },
    ],
  },
  {
    slug: "jeddah",
    name: "Jeddah",
    nameAr: "جدة",
    sathaAr: "سطحة جدة",
    tagline: "Recovery on the coast — city, corniche & Makkah highway",
    intro:
      "Jeddah's humidity is brutal on batteries and cooling systems. Our flatbeds cover the whole city — Al-Balad, Corniche, Obhur, Al-Safaa, and the airport area — plus the busy Jeddah–Makkah highway where pilgrims' rental cars often break down. We also move cars arriving at Jeddah Islamic Port to anywhere in the Kingdom.",
    image: "/locations/jeddah-hero.webp",
    startingPrice: 200,
    areas: ["Al-Balad", "Corniche", "Al-Hamra", "Obhur", "Al-Safaa", "Al-Rawdah", "Airport district", "Jeddah Islamic Port"],
    highways: ["Jeddah–Makkah Highway (Route 40)", "Madinah Road", "King Abdulaziz Road", "Haramain Corniche Road", "Jeddah–Madinah Highway"],
    faqs: [
      {
        question: "Can you tow my car from Jeddah to Makkah?",
        answer:
          "Yes — the Jeddah–Makkah tow (~80 km) is one of our most common jobs, especially for Umrah visitors whose rental or private car broke down. It typically costs SAR 350–500 on a flatbed.",
      },
      {
        question: "Do you pick up cars from Jeddah Islamic Port?",
        answer:
          "Yes. If you imported a car or bought one arriving by ship, we collect it from the port area and deliver it to Jeddah, Riyadh, or any city — with the paperwork handled at the gate by your clearing agent.",
      },
    ],
  },
  {
    slug: "dammam",
    name: "Dammam",
    nameAr: "الدمام",
    sathaAr: "سطحة الدمام",
    tagline: "Eastern Province coverage — Dammam, Khobar, Dhahran & Jubail road",
    intro:
      "Our home ground. The recovery network is strongest in the Eastern Province — Dammam, Al-Khobar, Dhahran, Qatif, and the industrial corridors toward Jubail. Flatbeds, winch trucks, and heavy loaders are available around the clock, including recovery from Aramco and industrial-area checkpoints, King Fahd Causeway approach, and the Dammam–Riyadh highway.",
    image: "/locations/dammam-hero.webp",
    startingPrice: 200,
    areas: ["Dammam Corniche", "Al-Khobar", "Dhahran", "Qatif", "Half Moon Bay", "Dammam Industrial City", "Jubail Road", "King Fahd Causeway approach"],
    highways: ["Dammam–Riyadh Highway (Route 40)", "Dhahran–Jubail Highway", "King Fahd Causeway Expressway", "Abu Hadriyah Highway (Route 95)"],
    faqs: [
      {
        question: "Do you cover Al-Khobar and Dhahran too?",
        answer:
          "Yes — Dammam, Al-Khobar, Dhahran, and Qatif are all covered by the same network, usually within 20–35 minutes. Half Moon Bay and the beach areas are covered on weekends when breakdowns spike.",
      },
      {
        question: "My car broke down near the King Fahd Causeway. Can you help?",
        answer:
          "Yes — we recover vehicles from the causeway approach roads on the Saudi side. If you were heading to Bahrain, we can tow the car back to Khobar or Dammam and help you arrange the rest.",
      },
      {
        question: "Is there a recovery truck near me in Dammam right now?",
        answer:
          "Our flatbeds are based across Dammam, Al-Khobar, Dhahran, and the Jubail road, so there is usually a unit close to you. Share your live location on WhatsApp and we dispatch the nearest available truck.",
      },
    ],
  },
  {
    slug: "makkah",
    name: "Makkah",
    nameAr: "مكة المكرمة",
    sathaAr: "سطحة مكة",
    tagline: "Pilgrim-friendly recovery around the Holy City",
    intro:
      "Breakdowns in Makkah are stressful — Haram-area road closures, one-way systems, and Hajj/Umrah season traffic. Our drivers know the permitted routes around Aziziyah, Ajyad, and the central area, and recover cars to workshops in Makkah or back to Jeddah. During Hajj season we position extra flatbeds on the Makkah entrances and the Jeddah and Taif highways.",
    image: "/locations/makkah-hero.webp",
    startingPrice: 250,
    areas: ["Aziziyah", "Ajyad", "Al-Awali", "Al-Shubaikah", "Mina Road", "Makkah entrances (Jeddah / Taif / Madinah gates)"],
    highways: ["Jeddah–Makkah Highway (Route 40)", "Makkah–Madinah Highway (Route 15)", "Makkah–Taif Highway", "Third Ring Road"],
    faqs: [
      {
        question: "Can a tow truck reach the central Haram area?",
        answer:
          "Access near Masjid al-Haram is restricted at prayer times and during season, but our drivers know the permitted recovery points and timings. Share your exact location on WhatsApp and we coordinate the closest legal pickup point with you.",
      },
      {
        question: "My rental car broke down during Umrah. What should I do?",
        answer:
          "First inform your rental company — many will still ask you to arrange towing to their Makkah or Jeddah branch. Send us your location and the branch address; we flatbed the car there while you continue your worship. Keep the rental agreement handy for the gate.",
      },
    ],
  },
  {
    slug: "madinah",
    name: "Madinah",
    nameAr: "المدينة المنورة",
    sathaAr: "سطحة المدينة",
    tagline: "Recovery in the Prophet's City & the Hijrah highway",
    intro:
      "From the central Markazia area around Masjid an-Nabawi to Quba, Uhud, and the airport road, our flatbeds cover all of Madinah. The long Madinah–Makkah (Hijrah) and Madinah–Jeddah highways are common breakdown spots for pilgrims driving between the Holy Cities — we recover from both directions and can deliver your car onward so your Ziyarah schedule isn't ruined.",
    image: "/locations/madinah-hero.webp",
    startingPrice: 250,
    areas: ["Markazia (central area)", "Quba", "Uhud", "Sultanah", "Al-Aqiq", "Airport Road", "Knowledge Economic City"],
    highways: ["Madinah–Makkah Hijrah Highway (Route 15)", "Madinah–Jeddah Highway", "Madinah–Tabuk Highway", "King Abdullah Ring Road"],
    faqs: [
      {
        question: "I broke down between Madinah and Makkah — who covers that road?",
        answer:
          "We do, from both ends. The Hijrah highway (~430 km) is covered by units based in Madinah, Makkah, and the midpoint service areas. Share your live location and the nearest kilometre marker if you can see one — dispatch is faster that way.",
      },
      {
        question: "Can you tow my car while I stay at my hotel in Madinah?",
        answer:
          "Yes. Most pilgrims don't want to leave the Haram area — send the car's location, a photo, and your hotel name on WhatsApp. We collect the key from your hotel reception, recover the car, and send you photos of the delivery at the workshop.",
      },
      {
        question: "Is there a recovery truck near me in Madinah?",
        answer:
          "Yes — units are based across Markazia, Quba, and the airport-road area. Share your live location on WhatsApp and we send the nearest available flatbed.",
      },
    ],
  },
  {
    slug: "taif",
    name: "Taif",
    nameAr: "الطائف",
    sathaAr: "سطحة الطائف",
    tagline: "Mountain road recovery — Al-Hada & Shafa passes",
    intro:
      "The winding Al-Hada mountain road between Makkah and Taif is Saudi Arabia's most breakdown-prone highway. Overheated brakes, failed cooling systems, and fog-related accidents are daily events on the steep passes. Our Taif-based flatbeds cover the mountain routes, the Taif Ring Road, Shafa, and the eastern highway toward Riyadh — with extra units positioned at the hairpin descent during summer and Hajj.",
    image: "/locations/makkah-hero.webp",
    startingPrice: 250,
    areas: ["Downtown Taif", "Al-Hada", "Al-Shafa", "Al-Hawiyah", "Taif Ring Road", "Taif Industrial Area", "Al-Sail Al-Kabeer"],
    highways: ["Makkah–Taif Mountain Road (Al-Hada)", "Taif–Riyadh Highway", "Taif–Al Baha Road", "Taif Ring Road"],
    faqs: [
      {
        question: "My brakes overheated on the Al-Hada descent from Taif to Makkah. Can you recover me?",
        answer:
          "Yes — brake fade on the Al-Hada mountain road is extremely common. Share your live location and pull to the nearest runaway ramp if possible. We dispatch a flatbed from the nearest staging point and tow you to a Taif or Makkah workshop.",
      },
      {
        question: "How much is a satha from Taif to Makkah?",
        answer:
          "A flatbed tow from Taif to Makkah (~85 km via the mountain road) typically costs SAR 400–600 depending on your exact location on the descent. WhatsApp us for a fixed quote.",
      },
    ],
  },
  {
    slug: "al-khobar",
    name: "Al Khobar",
    nameAr: "الخبر",
    sathaAr: "سطحة الخبر",
    tagline: "Coastal recovery — Khobar, Corniche & Causeway approach",
    intro:
      "Al Khobar sits at the crossroads between Dammam, Dhahran, and the King Fahd Causeway to Bahrain. Our recovery units cover the entire Khobar waterfront, Al-Rashid Mall area, and the busy Causeway approach roads where weekend traffic jams and salt-air corrosion cause frequent breakdowns.",
    image: "/locations/dammam-hero.webp",
    startingPrice: 200,
    areas: ["Al Khobar Corniche", "Al-Rashid Mall area", "Al-Thuqbah", "Half Moon Bay", "Causeway approach", "Dhahran–Khobar Road"],
    highways: ["King Fahd Causeway Approach", "Dammam–Khobar Highway", "Dhahran–Jubail Highway", "Abu Hadriyah Highway"],
    faqs: [
      {
        question: "Can you recover my car from the King Fahd Causeway?",
        answer:
          "We recover vehicles from the Saudi side of the causeway approach roads. Share your location on WhatsApp and we dispatch a flatbed. If you are on the Bahraini side, we can arrange collection at the Saudi customs checkpoint.",
      },
      {
        question: "How fast can a satha reach Half Moon Bay?",
        answer:
          "Half Moon Bay is about 25 minutes from our nearest Khobar unit. On weekends we pre-position extra flatbeds in the area because beach-area breakdowns are very common.",
      },
    ],
  },
  {
    slug: "tabuk",
    name: "Tabuk",
    nameAr: "تبوك",
    sathaAr: "سطحة تبوك",
    tagline: "Northern gateway — NEOM, AlUla & Red Sea recovery",
    intro:
      "Tabuk is the gateway to NEOM, AlUla, and the northern Red Sea coast. The long distances between cities in the northwest make breakdown recovery critical — our Tabuk flatbeds cover the city, the airport road, and the highways to NEOM, Haql, and the AlUla heritage corridor. Winter snow and ice on the Tabuk–Haql road create unique recovery challenges.",
    image: "/locations/riyadh-hero.webp",
    startingPrice: 300,
    areas: ["Tabuk City Center", "Tabuk Airport", "Prince Fahd bin Sultan District", "Al-Faisaliyyah", "NEOM approach", "Sharma Beach"],
    highways: ["Tabuk–NEOM Highway", "Tabuk–Madinah Highway", "Tabuk–Haql Road", "Tabuk–AlUla Road"],
    faqs: [
      {
        question: "Can you tow my car from NEOM or Sharma Beach to Tabuk?",
        answer:
          "Yes — NEOM and the Sharma coast are about 150 km from Tabuk. Flatbed recovery on this route costs approximately SAR 800–1,200. Share your live location on WhatsApp for an exact quote.",
      },
      {
        question: "Is recovery available on the Tabuk–AlUla heritage road?",
        answer:
          "Yes, we cover the entire Tabuk–AlUla corridor. This remote highway has limited services, so we recommend notifying us early if your car shows warning signs on this route.",
      },
      {
        question: "Is there a recovery truck near me in Tabuk?",
        answer:
          "Yes — units are based in Tabuk City and near the airport road. Share your live location on WhatsApp and we dispatch the nearest available flatbed for city or highway breakdowns.",
      },
    ],
  },
  {
    slug: "yanbu",
    name: "Yanbu",
    nameAr: "ينبع",
    sathaAr: "سطحة ينبع",
    tagline: "Industrial coast recovery — Yanbu City & petrochemical area",
    intro:
      "Yanbu's petrochemical industrial corridor and Red Sea coast create unique recovery needs. Our units cover Yanbu City, the Royal Commission industrial area, Yanbu Airport, and the coastal highway toward Jeddah and Madinah. Many expat workers in the industrial zone rely on us for quick weekday recovery.",
    image: "/locations/jeddah-hero.webp",
    startingPrice: 250,
    areas: ["Yanbu City", "Yanbu Industrial City (Royal Commission)", "Yanbu Airport", "Yanbu Corniche", "Al-Suqoor"],
    highways: ["Yanbu–Madinah Highway", "Yanbu–Jeddah Coastal Road", "Yanbu Industrial Highway"],
    faqs: [
      {
        question: "Do you cover Yanbu Industrial City (Royal Commission area)?",
        answer:
          "Yes — we have units that are cleared for the Royal Commission industrial zone gates. Share your location, gate number, and company name for faster access coordination.",
      },
      {
        question: "How much is a satha from Yanbu to Madinah?",
        answer:
          "Yanbu to Madinah is approximately 240 km. Flatbed transport on this route typically costs SAR 700–1,000. WhatsApp us for a quote.",
      },
      {
        question: "Is there a recovery truck near me in Yanbu?",
        answer:
          "Yes — units cover Yanbu City, the industrial area, and the corniche. Share your live location on WhatsApp and we dispatch the nearest available flatbed.",
      },
    ],
  },
  {
    slug: "jubail",
    name: "Jubail",
    nameAr: "الجبيل",
    sathaAr: "سطحة الجبيل",
    tagline: "Industrial hub recovery — Jubail city & Royal Commission",
    intro:
      "Jubail is Saudi Arabia's largest industrial city. The Royal Commission industrial area, petrochemical plants, and the long Dammam–Jubail highway generate steady demand for flatbed recovery. Our network covers Jubail City, the industrial gates, and the Abu Hadriyah highway corridor connecting to Dammam and Qatif.",
    image: "/locations/dammam-hero.webp",
    startingPrice: 250,
    areas: ["Jubail City Center", "Jubail Industrial City (Royal Commission)", "Jubail Airport", "Al-Deffi", "Fanateer Beach"],
    highways: ["Dammam–Jubail Highway", "Abu Hadriyah Highway (Route 95)", "Jubail–Ras Tanura Road"],
    faqs: [
      {
        question: "Can you access the Jubail Royal Commission industrial area?",
        answer:
          "Yes — our flatbeds are registered for industrial area access. Share your gate number and company sponsor name for smoother entry. Recovery inside the industrial city is available 24/7.",
      },
      {
        question: "My car broke down on the Dammam–Jubail highway. How fast can you reach me?",
        answer:
          "The Dammam–Jubail highway is one of our busiest recovery corridors. We typically reach you within 25–45 minutes depending on your position. Share your live location and the nearest highway sign for faster dispatch.",
      },
      {
        question: "Is there a recovery truck near me in Jubail?",
        answer:
          "Yes — units cover Jubail City, the industrial gates, and the Abu Hadriyah highway corridor. Share your live location on WhatsApp and we dispatch the nearest available flatbed.",
      },
    ],
  },
];

export function getRecoveryCity(slug: string) {
  return RECOVERY_CITIES.find((c) => c.slug === slug);
}
