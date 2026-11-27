// One-off analysis: for every route, simulate RouteRelatedLinks.tsx's exact
// matching logic (reverse route + same-city substring match, sliced to 6) to
// compute how many OTHER route pages actually link to it. Flags routes with
// zero or near-zero real inbound links from this mechanism -- the same
// crowding-out risk already documented for the original 6 hotel routes.
import { ROUTES_DATA } from "../lib/data/routes";

const sharesCity = (a: string, b: string) => a.includes(b) || b.includes(a);

function relatedLinksFor(route: (typeof ROUTES_DATA)[number]) {
  const from = route.fromCity.toLowerCase();
  const to = route.toCity.toLowerCase();

  const reverse = ROUTES_DATA.find(
    (r) => r.slug !== route.slug && r.fromCity.toLowerCase() === to && r.toCity.toLowerCase() === from,
  );

  const related = ROUTES_DATA.filter(
    (r) =>
      r.slug !== route.slug &&
      r.slug !== reverse?.slug &&
      (sharesCity(r.fromCity.toLowerCase(), from) ||
        sharesCity(r.toCity.toLowerCase(), to) ||
        sharesCity(r.fromCity.toLowerCase(), to) ||
        sharesCity(r.toCity.toLowerCase(), from)),
  ).slice(0, 5);

  return [...(reverse ? [reverse] : []), ...related].slice(0, 6);
}

const inboundCount: Record<string, number> = {};
for (const r of ROUTES_DATA) inboundCount[r.slug] = 0;

for (const source of ROUTES_DATA) {
  for (const target of relatedLinksFor(source)) {
    inboundCount[target.slug] = (inboundCount[target.slug] ?? 0) + 1;
  }
}

const TARGETS = [
  "jeddah-airport-to-makkah-clock-tower",
  "madinah-airport-to-madinah-markaziyah",
  "makkah-clock-tower-to-madinah-markaziyah",
  "makkah-hotels-to-taif-resorts",
  "riyadh-airport-to-kafd-hotels",
  "jeddah-airport-to-jeddah-city",
  "jeddah-to-haramain-station",
];

console.log("Target route -> inbound links from RouteRelatedLinks (0 = orphan risk):");
for (const slug of TARGETS) {
  console.log(`  ${slug}: ${inboundCount[slug]}`);
}

console.log("\nFull distribution (all routes, sorted lowest first):");
const sorted = Object.entries(inboundCount).sort((a, b) => a[1] - b[1]);
for (const [slug, count] of sorted.slice(0, 15)) {
  console.log(`  ${count}  ${slug}`);
}
