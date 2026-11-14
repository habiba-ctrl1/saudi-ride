/**
 * Phase A2 (owner facts 2026-10-06): vendors Sheraz/Bilal/Naimat, per-ride vendor+driver,
 * Habib/Andrea/Fer/Hayley financials, Sheraz settlement, PKR rate, Naimat rate card deactivated.
 * Idempotent. Run: npx tsx --env-file=.env.local scripts/ops-phaseA2-vendors.ts
 */
import { prisma } from "../lib/prisma";
const q = (sql: string, ...p: unknown[]) => prisma.$executeRawUnsafe(sql, ...p);
const r = <T = any>(sql: string, ...p: unknown[]) => prisma.$queryRawUnsafe<T[]>(sql, ...p);

async function main() {
  await q(`INSERT INTO partners (name, default_share_pct, notes) VALUES
    ('Sheraz', 25, 'Vendor. Share 25% stated on Habib ride; Fer/Andrea share = 0 (owner kept full margin)'),
    ('Bilal', 0, 'Vendor/driver. Share on Hayley = 0 (owner kept full margin). Tip goes to driver, not revenue')
    ON CONFLICT (name) DO NOTHING`);
  const id = async (n: string) => (await r<{ id: string }>(`SELECT id FROM partners WHERE name=$1`, n))[0].id;
  const [naimat, sheraz, bilal] = [await id("Naimat"), await id("Sheraz"), await id("Bilal")];

  await q(`INSERT INTO app_settings (key, value) VALUES ('sar_to_pkr_rate','73') ON CONFLICT (key) DO UPDATE SET value='73', updated_at=now()`);

  // Naimat rides: vendor/driver = Naimat
  await q(`UPDATE quotations SET driver_name='Naimat' WHERE quote_reference IN ('TSA-2026-0003','TSA-2026-0008','TSA-2026-0011','TSA-2026-0012','TSA-2026-0013')`);
  await q(`UPDATE quotations SET vehicle_detail='Hyundai sedan (driver shown on issued receipt: Amir, +966 53 972 8663)', driver_phone=NULL, vehicle_plate='8775 SSA' WHERE quote_reference='TSA-2026-0012'`);

  type F = { ref: string; vendor: string; drv: string; share: number; paid: number; cost: number; extra?: number; note: string; status?: string };
  const fin: F[] = [
    { ref: "TSA-2026-0018", vendor: sheraz, drv: "Sheraz", share: 25, paid: 600, cost: 500, note: "Owner 2026-10-06: margin 100 = 75 owner / 25 Sheraz. Assigned to Sheraz." },
    { ref: "TSA-2026-0014", vendor: sheraz, drv: "Sheraz", share: 0, paid: 250, cost: 200, status: "completed",
      note: "Owner 2026-10-06: ride done, owner margin 50. Customer paid by card incl 15% VAT (287.50); VAT excluded from revenue here." },
    { ref: "TSA-2026-0017", vendor: sheraz, drv: "Faisal (via Sheraz)", share: 0, paid: 300, cost: 150, status: "completed",
      note: "Owner 2026-10-06: ride done, owner margin 150. Assigned to Faisal (AlUla); Faisal paid Sheraz, Sheraz transferred to owner (200 = 150 Fer + 50 Andrea)." },
    { ref: "TSA-2026-0015", vendor: bilal, drv: "Bilal", share: 0, paid: 600, cost: 500, status: "completed",
      note: "Owner 2026-10-06: ride done, owner margin 100. Assigned to Bilal. Excellent customer feedback; customer tipped Bilal SAR 100 (tip belongs to driver, not revenue)." },
  ];
  for (const f of fin) {
    await q(
      `UPDATE quotations SET partner_id=$2::uuid, partner_share_pct=$3::numeric, driver_name=$4, actual_amount_paid=$5::numeric, driver_cost=$6::numeric, extra_cost=0,
         payment_status='paid', payment_method_used=COALESCE(payment_method_used, CASE WHEN quote_reference='TSA-2026-0014' THEN 'Card' ELSE 'Cash' END),
         status=COALESCE($7::quotation_status, status), financial_status='confirmed', financial_note=$8, profit=$5::numeric-$6::numeric
       WHERE quote_reference=$1`, f.ref, f.vendor, f.share, f.drv, f.paid, f.cost, f.status ?? null, f.note);
  }

  // Sheraz transferred SAR 200 to owner (Fer 150 + Andrea 50)
  const done = await r(`SELECT 1 FROM partner_settlements WHERE partner_id=$1::uuid AND amount=200 AND note LIKE 'Sheraz transfer%'`, sheraz);
  if (!done.length) {
    await q(`INSERT INTO partner_settlements (partner_id, direction, amount, settled_on, note) VALUES ($1::uuid,'received_from_partner',200,'2026-10-06','Sheraz transfer: Fer Palacios 150 + Andrea 50 (date approximate - recorded 2026-10-06)')`, sheraz);
  }

  // Remove Naimat rate card from pricing: soft-deactivate (reversible; backup in exports/)
  const n = await q(`UPDATE price_book_entries SET is_active=false, updated_at=now() WHERE source='vendor_rate_card_naimatullah' AND is_active`);
  console.log("deactivated Naimat rate-card price entries:", n);

  console.table(await r(`SELECT q.quote_reference ref, q.customer_name, q.status, p.name vendor, q.driver_name driver, q.partner_share_pct share, q.actual_amount_paid::float paid, q.driver_cost::float cost,
     (q.actual_amount_paid-q.driver_cost-q.extra_cost)::float margin, ((q.actual_amount_paid-q.driver_cost-q.extra_cost)*(100-COALESCE(q.partner_share_pct,0))/100)::float owner_share
     FROM quotations q LEFT JOIN partners p ON p.id=q.partner_id WHERE q.financial_status='confirmed' ORDER BY 1`));
  console.table(await r(`SELECT p.name,
     COALESCE(SUM((q.actual_amount_paid-q.driver_cost-q.extra_cost)*(100-COALESCE(q.partner_share_pct,0))/100),0)::float owner_share_total,
     COALESCE((SELECT SUM(amount) FROM partner_settlements s WHERE s.partner_id=p.id AND direction='received_from_partner'),0)::float received
     FROM partners p LEFT JOIN quotations q ON q.partner_id=p.id AND q.financial_status='confirmed' GROUP BY p.id,p.name`));
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
