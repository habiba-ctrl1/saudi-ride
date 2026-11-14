/**
 * Part 3 — margin analysis. For every route: engine "From" (sedan, inc VAT) vs
 * estimated cost floor vs the OLD advertised basePrice, with margin. Flags sedan
 * margin < 25%. Pure (no DB/env). Run: npx tsx scripts/pricing-margin.ts
 */
import { PRICING_ROUTES } from "../lib/pricing/data/routes";
import { quote } from "../lib/pricing/quote";
import { costFloorFor } from "../lib/pricing/costFloor";
import { getFromPrice } from "../lib/pricing/display";
import { ROUTES_DATA } from "../lib/data/routes";

const oldBaseBySlug = new Map(
  ROUTES_DATA.map((r) => [r.slug, (r as unknown as { basePrice?: number }).basePrice]),
);

const pct = (n: number) => `${Math.round(n * 100)}%`;

const rows: string[] = [];
const flagged: string[] = [];

for (const r of PRICING_ROUTES) {
  const from = getFromPrice(r.slug);
  const q = quote({ routeSlug: r.slug, vehicleSlug: "sedan", baseOnly: true });
  const floor = costFloorFor(r.slug, "sedan").total;
  const preVat = q.subtotal;
  const margin = preVat > 0 ? (preVat - floor) / preVat : 0;
  const oldFrom = oldBaseBySlug.get(r.slug);
  const flag = margin < 0.25 ? "FLAG" : "";
  if (flag) flagged.push(r.slug);
  rows.push(
    `| ${r.slug} | ${r.distanceKm} | ${r.deadheadFactor} | ${floor} | ${preVat} | ${from?.total ?? "-"} | ${oldFrom ?? "-"} | ${pct(margin)} ${flag} |`,
  );
}

console.log("| route | km | deadhead | costFloor | enginePreVAT | engineFrom(incVAT) | OLDbase | margin |");
console.log("|---|---|---|---|---|---|---|---|");
console.log(rows.join("\n"));
console.log(`\nFlagged (<25%): ${flagged.length} -> ${flagged.join(", ") || "none"}`);
