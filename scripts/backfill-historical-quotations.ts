// One-off: backfill historical WhatsApp-only quotations that were never
// entered into the real Supabase `quotations` table (they only ever existed
// as manually-built HTML/PDF files under client-quotations/). Explicit
// quote_reference values are used to preserve the original file naming —
// safe because the year-2026 counter is already at 12 (from earlier test
// runs) and neither 0011 nor 0012 exist as real rows.
// Run: npx dotenv-cli -e .env.local -- node_modules/.bin/tsx scripts/backfill-historical-quotations.ts
import { getSupabaseServerClient } from "@/lib/supabase/server";

async function main() {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured");

  // 1. Mohammed Almobid — TSA-2026-0011-LEAP-Riyadh. Round trip to LEAP,
  //    1 Sep 2026 (already past). Cash-on-arrival, never actually collected —
  //    recorded as completed + unpaid so it shows as a real outstanding receivable.
  const { data: r1, error: e1 } = await supabase
    .from("quotations")
    .insert({
      quote_reference: "TSA-2026-0011",
      customer_name: "Mohammed Almobid",
      customer_phone: "+966 59 207 7747",
      pickup_location: "Customer's location, Riyadh (shared pin)",
      drop_location: "LEAP Exhibition — Riyadh Exhibition & Convention Center, Malham",
      trip_type: "round_trip",
      trip_date: "2026-09-01",
      trip_time: "14:30",
      return_date: "2026-09-01",
      passengers_count: 2,
      vehicle_type_requested: "sedan",
      quoted_price: 450,
      currency: "SAR",
      status: "completed",
      payment_status: "unpaid",
      source: "whatsapp",
      admin_notes: "Backfilled from manual quotation file TSA-2026-0011-LEAP-Riyadh. Round trip to LEAP completed 1 Sep 2026 — cash payment was agreed on arrival but was never collected. Outstanding balance: SAR 450.",
    })
    .select("id, quote_reference")
    .single();
  if (e1) console.error("❌ Mohammed Almobid insert failed:", e1.message);
  else console.log(`✔ Inserted ${r1.quote_reference} — Mohammed Almobid (completed, unpaid, SAR 450 owed)`);

  // 2. Oleg Pronin — TSA-2026-0012. Completed + paid (confirmed via WhatsApp:
  //    cash on arrival, driver Amir/8775 SSA — an ad-hoc partner driver not in
  //    the `drivers` table, so noted in admin_notes rather than assigned_driver_id).
  const { data: r2, error: e2 } = await supabase
    .from("quotations")
    .insert({
      quote_reference: "TSA-2026-0012",
      customer_name: "Mr. Oleg Pronin & Mrs. Anna Zolotarenko",
      customer_phone: "+7 918 139-02-22",
      customer_email: "oleg.v.pronin@gmail.com",
      pickup_location: "Desert Rock Resort, Umluj",
      drop_location: "Six Senses Southern Dunes, Umluj",
      trip_type: "one_way",
      trip_date: "2026-09-11",
      trip_time: "12:00",
      passengers_count: 2,
      vehicle_type_requested: "sedan",
      quoted_price: 350,
      currency: "SAR",
      status: "completed",
      payment_status: "paid",
      actual_amount_paid: 350,
      payment_method_used: "Cash",
      source: "whatsapp",
      admin_notes: "Backfilled from manual quotation/receipt files TSA-2026-0012-Oleg-Pronin. Driver: Amir, vehicle Hyundai plate 8775 SSA — an ad-hoc partner driver, not in the drivers roster, so not linked via assigned_driver_id.",
    })
    .select("id, quote_reference")
    .single();
  if (e2) console.error("❌ Oleg Pronin insert failed:", e2.message);
  else console.log(`✔ Inserted ${r2.quote_reference} — Oleg Pronin (completed, paid SAR 350)`);

  // 3. Advance the counter past the highest historical number we just used,
  //    so the NEXT real customer's auto-generated ref doesn't collide.
  const { error: e3 } = await supabase
    .from("quote_ref_counters")
    .update({ counter: 12 })
    .eq("year", 2026);
  if (e3) console.error("❌ Counter bump failed:", e3.message);
  else console.log("✔ quote_ref_counters confirmed at 12 (next auto-ref will be TSA-2026-0013)");

  // 4. Sheriff Adigun (TSA-2026-0006) already exists in the DB as 'cancelled'
  //    — just add the scam note, don't touch anything else.
  const { data: r4, error: e4 } = await supabase
    .from("quotations")
    .update({
      admin_notes: "Customer confirmed booking then did not show / did not pay — treated as a scam attempt, not a genuine cancellation. No refund owed (nothing was collected).",
    })
    .eq("quote_reference", "TSA-2026-0006")
    .select("id, quote_reference, customer_name")
    .single();
  if (e4) console.error("❌ Sheriff Adigun note failed:", e4.message);
  else console.log(`✔ Added scam note to ${r4.quote_reference} — ${r4.customer_name}`);
}

main().catch((err) => {
  console.error("❌ Backfill failed:", err);
  process.exit(1);
});
