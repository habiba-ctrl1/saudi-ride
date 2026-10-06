/**
 * Phase G: apply 0024 and import the owner's WhatsApp pricing log (table 0 of Saudi rides.docx, pre-extracted to
 * exports/saudi-rides-tables.json). Raw text kept as-is. Outcome: won = completed/proceeded, lost = cancelled/expensive/blocked, else unknown.
 * Idempotent (unique on source+seq_no). Run: npx tsx --env-file=.env.local scripts/ops-phaseG-enquiries.ts
 */
import { prisma } from "../lib/prisma";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const clean = (s: string | undefined) => (s ?? "").replace(/\s+\n/g, "\n").trim() || null;

async function main() {
  const sql = readFileSync(join(process.cwd(), "supabase/migrations/0024_enquiries.sql"), "utf8");
  for (const s of sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").split(";").map((x) => x.trim()).filter(Boolean)) await prisma.$executeRawUnsafe(s);

  const tables: string[][][] = JSON.parse(readFileSync(join(process.cwd(), "exports/saudi-rides-tables.json"), "utf8"));
  const rows = tables[0].slice(1); // skip header
  let inserted = 0, skipped = 0, auto = 0;
  for (const c of rows) {
    if (c.every((x) => !x.trim())) { skipped++; continue; }
    const [seq, name, from, to, sedan, staria, gmc, trip, status, reason, contact, notes] = c;
    const seqNo = clean(seq)?.replace(/\s+/g, "") || `row${++auto}-${(clean(name) ?? clean(notes) ?? "").slice(0, 12)}`;
    const blob = `${status} ${reason} ${notes}`.toLowerCase();
    const outcome = /complet|proceeded success/.test(`${status} ${notes}`.toLowerCase()) && !/not completed/.test(blob) ? "won"
      : /cancel|expensive|block|no thanks|no need/.test(blob) ? "lost" : "unknown";
    const n = await prisma.$executeRawUnsafe(
      `INSERT INTO enquiries (source, seq_no, client_name, contact, route_from, route_to, sedan_text, staria_text, gmc_text, trip_type_text, status_text, reason, notes, outcome)
       VALUES ('whatsapp_log',$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT DO NOTHING`,
      seqNo, clean(name), clean(contact), clean(from), clean(to), clean(sedan), clean(staria), clean(gmc), clean(trip), clean(status), clean(reason), clean(notes), outcome,
    );
    inserted += n;
  }
  console.log({ inserted, skippedEmpty: skipped });
  console.table(await prisma.$queryRawUnsafe(`SELECT outcome, count(*)::int n FROM enquiries GROUP BY 1 ORDER BY 1`));
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
