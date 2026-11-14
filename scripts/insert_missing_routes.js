// Insert routes that exist in lib/data/routes.ts (sitemap, pricing, internal
// links) but were never actually written to the live Route table -- these
// pages were 404ing in production despite being indexed/linked. Found while
// verifying the routes AIO/GEO pass (2026-08-04).
// Pooler/direct DB local se flaky hai, isliye Supabase REST API (HTTPS) use karta hai.
// Run: node scripts/insert_missing_routes.js  (env .env.local se khud load hota hai)
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const env = {};
for (const line of fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
}
const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_BASE || !KEY) { console.error("Supabase URL/key missing in .env.local"); process.exit(1); }

const ROUTES = [
  {
    id: crypto.randomUUID(),
    fromCity: "Jeddah Airport (JED)",
    toCity: "Makkah Clock Tower Hotels",
    fromCityAr: "مطار جدة",
    toCityAr: "فنادق برج الساعة بمكة",
    distance: 85,
    duration: 65,
    basePrice: 249,
    popular: true,
    description: "Direct door-to-door transfer from King Abdulaziz Airport Terminal 1 to Fairmont Makkah Clock Royal Tower, Pullman Zamzam, and Abraj Al Bait hotels with luggage help.",
    descriptionAr: "نقل مباشر من مطار جدة إلى فنادق أبراج الساعة وزمزم وفيرمونت مكة مع خدمة الأمتعة.",
    slug: "jeddah-airport-to-makkah-clock-tower",
  },
  {
    id: crypto.randomUUID(),
    fromCity: "Madinah Airport (MED)",
    toCity: "Madinah Markaziyah Hotels",
    fromCityAr: "مطار المدينة المنورة",
    toCityAr: "فنادق المنطقة المركزية بالمدينة",
    distance: 22,
    duration: 25,
    basePrice: 120,
    popular: true,
    description: "Express pickup from Prince Mohammad bin Abdulaziz Airport to Dar Al Taqwa, Oberoi, and all Central Markaziyah hotels steps from Al-Masjid an-Nabawi.",
    descriptionAr: "توصيل سريع من مطار الأمير محمد بن عبدالعزيز إلى جميع فنادق المنطقة المركزية المحيطة بالمسجد النبوي الشريف.",
    slug: "madinah-airport-to-madinah-markaziyah",
  },
  {
    id: crypto.randomUUID(),
    fromCity: "Makkah Clock Tower",
    toCity: "Madinah Markaziyah Hotels",
    fromCityAr: "فنادق برج الساعة بمكة",
    toCityAr: "فنادق المركزية بالمدينة",
    distance: 430,
    duration: 250,
    basePrice: 499,
    popular: true,
    description: "Inter-hotel pilgrim transfer from Makkah Clock Tower complex to Madinah Central Markaziyah hotels near Prophet's Mosque with Meeqat stop included.",
    descriptionAr: "نقل المعتمرين بين الفنادق من أبراج الساعة بمكة إلى المنطقة المركزية بالمدينة المنورة مع التوقف بميقات ذو الحليفة.",
    slug: "makkah-clock-tower-to-madinah-markaziyah",
  },
  {
    id: crypto.randomUUID(),
    fromCity: "Makkah Hotels",
    toCity: "Taif Al-Hada & Shafa Resorts",
    fromCityAr: "فنادق مكة",
    toCityAr: "منتجعات الهدا والشفا بالطائف",
    distance: 85,
    duration: 75,
    basePrice: 220,
    popular: true,
    description: "Day trip and hotel transfer from Makkah Haram area to mountain resort hotels and rose distilleries in Al-Hada and Shafa Taif.",
    descriptionAr: "رحلة يومية وتوصيل من فنادق مكة إلى منتجعات ومزارع الورد بمنطقتي الهدا والشفا بالطائف.",
    slug: "makkah-hotels-to-taif-resorts",
  },
  {
    id: crypto.randomUUID(),
    fromCity: "Riyadh Airport (RUH)",
    toCity: "KAFD & Olaya Business Hotels",
    fromCityAr: "مطار الرياض",
    toCityAr: "فنادق مركز الملك عبدالله المالي والأوليا",
    distance: 40,
    duration: 35,
    basePrice: 150,
    popular: true,
    description: "Executive hotel transfer from King Khalid International Airport to KAFD corporate hotels, Ritz-Carlton, and Olaya business district.",
    descriptionAr: "توصيل رجال الأعمال والتنفيذيين من مطار الملك خالد إلى فنادق مركز الملك عبدالله المالي والأوليا.",
    slug: "riyadh-airport-to-kafd-hotels",
  },
  {
    id: crypto.randomUUID(),
    fromCity: "Jeddah Airport",
    toCity: "Jeddah City",
    fromCityAr: "مطار جدة",
    toCityAr: "مدينة جدة",
    distance: 20,
    duration: 30,
    basePrice: 80,
    popular: true,
    description: "Fixed-price transfer from King Abdulaziz International Airport (JED) to your Jeddah hotel, the Corniche, Al-Balad, or the city centre — meet & greet included, 24/7.",
    descriptionAr: "نقل بسعر ثابت من مطار الملك عبدالعزيز الدولي إلى فندقك في جدة أو الكورنيش أو البلد أو وسط المدينة.",
    slug: "jeddah-airport-to-jeddah-city",
  },
  {
    id: crypto.randomUUID(),
    fromCity: "Jeddah",
    toCity: "Haramain Station",
    fromCityAr: "جدة",
    toCityAr: "محطة قطار الحرمين",
    distance: 15,
    duration: 25,
    basePrice: 70,
    popular: false,
    description: "Fixed-price taxi from anywhere in Jeddah to the Haramain High-Speed Railway station for onward travel to Makkah or Madinah — door-to-door with luggage help.",
    descriptionAr: "تاكسي بسعر ثابت من أي مكان في جدة إلى محطة قطار الحرمين السريع للسفر إلى مكة أو المدينة.",
    slug: "jeddah-to-haramain-station",
  },
];

(async () => {
  let fail = 0;
  for (const route of ROUTES) {
    const res = await fetch(`${URL_BASE}/rest/v1/Route`, {
      method: "POST",
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation,resolution=merge-duplicates",
      },
      body: JSON.stringify(route),
    });
    const body = await res.text();
    if (!res.ok) { fail++; console.log(route.slug, "HTTP", res.status, body.slice(0, 200)); }
    else { console.log(route.slug, "-> inserted"); }
  }
  process.exit(fail ? 1 : 0);
})();
