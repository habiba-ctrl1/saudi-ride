// Same class of bug as scripts/insert_missing_routes.js (2026-08-04): these 2
// routes exist in lib/data/routes.ts (added in the 2026-08-05 GCC/NEOM Phase 1
// commit) but were never written to the live Route table, so
// /routes/red-sea-airport-to-amaala and /routes/red-sea-airport-to-neom were
// 404ing in production. Found while building the new /airports/red-sea page
// (2026-08-06) -- its "Popular Routes" section queries this table directly.
// Pooler/direct DB local se flaky hai, isliye Supabase REST API (HTTPS) use karta hai.
// Run: node scripts/insert_red_sea_routes.js  (env .env.local se khud load hota hai)
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
    fromCity: "Red Sea International Airport",
    toCity: "AMAALA",
    fromCityAr: "مطار البحر الأحمر الدولي",
    toCityAr: "أمالا",
    distance: 35,
    duration: 30,
    basePrice: 180,
    popular: true,
    description: "VIP airport transfer from Red Sea International Airport to the AMAALA luxury coastal destination.",
    descriptionAr: "نقل كبار الشخصيات من مطار البحر الأحمر الدولي إلى وجهة أمالا الساحلية الفاخرة.",
    slug: "red-sea-airport-to-amaala",
  },
  {
    id: crypto.randomUUID(),
    fromCity: "Red Sea International Airport",
    toCity: "NEOM",
    fromCityAr: "مطار البحر الأحمر الدولي",
    toCityAr: "نيوم",
    distance: 300,
    duration: 210,
    basePrice: 450,
    popular: true,
    description: "Executive coastal transfer from Red Sea International Airport to NEOM and NEOM Bay.",
    descriptionAr: "نقل تنفيذي ساحلي من مطار البحر الأحمر الدولي إلى نيوم وخليج نيوم.",
    slug: "red-sea-airport-to-neom",
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
