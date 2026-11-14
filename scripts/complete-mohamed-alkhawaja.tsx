// One-off: mark TSA-2026-0008 (Mohamed Alkhawaja) completed + paid using the
// real receipt.html data (SAR 200 cash, GMC full-size SUV actually provided),
// then generate the canonical receipt PDF via the same app pipeline the
// admin "Send Receipt" button uses — not the old standalone HTML template.
// Run: npx dotenv-cli -e .env.local -- node_modules/.bin/tsx scripts/complete-mohamed-alkhawaja.tsx
import * as React from "react";
(globalThis as unknown as { React: typeof React }).React = React;
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { renderInvoicePdf } from "@/lib/pdf/invoice";
import { writeFileSync } from "fs";
import type { QuotationRow } from "@/lib/supabase/quotations";

async function main() {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data: row, error } = await supabase
    .from("quotations")
    .update({
      status: "completed",
      payment_status: "paid",
      actual_amount_paid: 200,
      payment_method_used: "Cash",
      trip_time: "19:00",
      luggage_notes: "VEHICLE: GMC — full-size SUV",
      admin_notes: "Quoted for a Ford Taurus sedan; a GMC full-size SUV was actually provided on the day. Receipt backfilled from client-quotations/Quoted/TSA-2026-0008-Mohamed-Alkhawaja/receipt.html.",
    })
    .eq("quote_reference", "TSA-2026-0008")
    .select("*")
    .single();
  if (error || !row) throw new Error(`Update failed: ${error?.message}`);
  console.log(`✔ ${row.quote_reference} marked completed + paid (SAR 200 cash)`);

  const pdfBuffer = await renderInvoicePdf(row as QuotationRow, "receipt");
  const out = "client-quotations/Quoted/TSA-2026-0008-Mohamed-Alkhawaja/receipt-canonical.pdf";
  writeFileSync(out, pdfBuffer);
  console.log(`✔ Canonical receipt PDF written: ${out} (${pdfBuffer.length} bytes)`);
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
