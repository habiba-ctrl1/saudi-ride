// Route table basePrice update — Tier-1 corridor market estimates (routes.ts se sync)
// Pooler/direct DB local se flaky hai, isliye Supabase REST API (HTTPS) use karta hai.
// Run: node scripts/update_route_prices.js  (env .env.local se khud load hota hai)
const fs = require("fs");
const path = require("path");

// .env.local parse (dotenv ke bina — sirf needed keys)
const env = {};
for (const line of fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
}
const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_BASE || !KEY) { console.error("Supabase URL/key missing in .env.local"); process.exit(1); }

const PRICES = {
  "jeddah-airport-to-makkah": 249,
  "jeddah-to-makkah": 199,
  "makkah-to-jeddah-airport": 249,
  "makkah-to-madinah": 499,
  "madinah-to-makkah": 499,
  "jeddah-to-madinah": 549,
  "jeddah-airport-to-madinah": 549,
  "riyadh-to-dammam": 699,
};

(async () => {
  let fail = 0;
  for (const [slug, basePrice] of Object.entries(PRICES)) {
    const res = await fetch(`${URL_BASE}/rest/v1/Route?slug=eq.${slug}`, {
      method: "PATCH",
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ basePrice }),
    });
    const body = await res.text();
    if (!res.ok) { fail++; console.log(slug, "HTTP", res.status, body.slice(0, 120)); }
    else {
      const rows = JSON.parse(body);
      console.log(slug, rows.length ? `-> ${basePrice}` : "NOT IN DB (0 rows)");
    }
  }
  process.exit(fail ? 1 : 0);
})();
