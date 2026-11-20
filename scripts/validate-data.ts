// Build-time guardrail against the exact bug classes found in the Aug 2026
// audit: duplicate route slugs, physically-impossible durations (e.g. 20km in
// 90min), and unexplained A->B vs B->A distance/duration/price mismatches.
// Run automatically via `prebuild`; also runnable standalone: `npm run validate:data`.
import { ROUTES_DATA } from "../lib/data/routes";

const MIN_KMH = 20;
const MAX_KMH = 120;

const errors: string[] = [];

// 1. Duplicate slugs
const slugCounts = new Map<string, number>();
for (const r of ROUTES_DATA) {
  slugCounts.set(r.slug, (slugCounts.get(r.slug) ?? 0) + 1);
}
for (const [slug, count] of slugCounts) {
  if (count > 1) errors.push(`Duplicate slug "${slug}" appears ${count} times`);
}

// 2. Duration must imply a realistic average speed
for (const r of ROUTES_DATA) {
  const kmh = r.distance / (r.duration / 60);
  if (kmh < MIN_KMH || kmh > MAX_KMH) {
    errors.push(
      `Route "${r.slug}" implies ${kmh.toFixed(1)} km/h (${r.distance}km in ${r.duration}min) — outside sane band ${MIN_KMH}-${MAX_KMH} km/h`
    );
  }
}

// 3. Reverse-direction pairs must agree on distance/duration; price may only
//    differ if at least one side is explicitly flagged priceOnRequest.
const byPair = new Map<string, typeof ROUTES_DATA>();
for (const r of ROUTES_DATA) {
  const key = [r.fromCity.toLowerCase(), r.toCity.toLowerCase()].sort().join("|");
  const bucket = byPair.get(key) ?? [];
  bucket.push(r);
  byPair.set(key, bucket);
}
for (const routes of byPair.values()) {
  for (let i = 0; i < routes.length; i++) {
    for (let j = i + 1; j < routes.length; j++) {
      const a = routes[i];
      const b = routes[j];
      const isReverse =
        a.fromCity.toLowerCase() === b.toCity.toLowerCase() &&
        a.toCity.toLowerCase() === b.fromCity.toLowerCase();
      if (!isReverse) continue;

      if (a.distance !== b.distance) {
        errors.push(`Distance mismatch: "${a.slug}" (${a.distance}km) vs reverse "${b.slug}" (${b.distance}km)`);
      }
      if (a.duration !== b.duration) {
        errors.push(`Duration mismatch: "${a.slug}" (${a.duration}min) vs reverse "${b.slug}" (${b.duration}min)`);
      }
      const aFlagged = "priceOnRequest" in a && a.priceOnRequest;
      const bFlagged = "priceOnRequest" in b && b.priceOnRequest;
      if (a.basePrice !== b.basePrice && !aFlagged && !bFlagged) {
        errors.push(
          `Unexplained price mismatch: "${a.slug}" (SAR ${a.basePrice}) vs reverse "${b.slug}" (SAR ${b.basePrice}) — set priceOnRequest on one side if this is intentional`
        );
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Data validation failed (${errors.length} issue${errors.length > 1 ? "s" : ""}):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("");
  process.exit(1);
}

console.log(`✅ Data validation passed (${ROUTES_DATA.length} routes checked).`);
