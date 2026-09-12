// One-off verification script for the new receipt/review feature — creates a
// TEST quotation (is_test=true), exercises the exact same lib functions the
// admin "Send Receipt" button calls (join, PDF render, email send, DB update),
// sends a real email to the business's own inbox as proof, then deletes the
// test row. Run: node_modules/.bin/tsx scripts/verify-receipt-flow.tsx
import * as React from "react";
// invoice.tsx relies on Next.js's automatic JSX runtime and never imports React;
// tsx compiles JSX to classic React.createElement, so expose React globally.
(globalThis as unknown as { React: typeof React }).React = React;
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getQuotationWithDriver, setQuotationReceiptSent, deleteQuotation } from "@/lib/supabase/quotations";
import { renderInvoicePdf } from "@/lib/pdf/invoice";
import { receiptEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/notifications";

async function main() {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured");

  const adminEmail = process.env.ADMIN_EMAIL || "infotaxisaudiarabia@gmail.com";

  // 1. Look up a real driver row to exercise the embedded join.
  const { data: driverRow, error: driverErr } = await supabase
    .from("drivers")
    .select("id")
    .limit(1)
    .single();
  if (driverErr || !driverRow) throw new Error(`No driver row found to test with: ${driverErr?.message}`);

  // 2. Insert a TEST quotation, completed + paid, assigned to that driver.
  const { data: inserted, error: insertErr } = await supabase
    .from("quotations")
    .insert({
      customer_name: "Verification Test",
      customer_phone: "+966500000000",
      customer_email: adminEmail,
      pickup_location: "Test Pickup",
      drop_location: "Test Dropoff",
      trip_type: "one_way",
      trip_date: new Date().toISOString().slice(0, 10),
      trip_time: "12:00",
      passengers_count: 2,
      quoted_price: 350,
      currency: "SAR",
      status: "completed",
      payment_status: "paid",
      assigned_driver_id: driverRow.id,
      source: "website",
      is_test: true,
    })
    .select("id, quote_reference")
    .single();
  if (insertErr || !inserted) throw new Error(`Insert failed: ${insertErr?.message}`);
  console.log(`✔ Created test quotation ${inserted.quote_reference} (${inserted.id})`);

  try {
    // 3. Same fetch the receipt route uses — confirms the drivers join works.
    const { row, error } = await getQuotationWithDriver(inserted.id);
    if (error || !row) throw new Error(`getQuotationWithDriver failed: ${error}`);
    console.log(`✔ getQuotationWithDriver joined driver: ${row.drivers?.full_name ?? "MISSING"}`);

    // 4. Same PDF render the route calls.
    const rowForDocs = { ...row, actual_amount_paid: 350, payment_method_used: "Cash" };
    const pdfBuffer = await renderInvoicePdf(rowForDocs, "receipt");
    console.log(`✔ Receipt PDF rendered: ${pdfBuffer.length} bytes`);

    // 5. Same email template + send call, with TRUSTPILOT_BCC_EMAIL left as
    //    whatever is (or isn't) in .env.local — proves the unset case doesn't crash.
    const driver = row.drivers;
    const { subject, html } = receiptEmail({
      quoteReference: row.quote_reference,
      customerName: row.customer_name,
      pickup: row.pickup_location,
      dropoff: row.drop_location,
      tripDate: row.trip_date,
      tripTime: row.trip_time,
      amountPaid: 350,
      currency: row.currency,
      paymentMethod: "Cash",
      driverName: driver?.full_name ?? null,
      driverPhone: driver?.phone ?? null,
      vehicleLabel: driver ? [driver.vehicle_model, driver.vehicle_type.toUpperCase()].filter(Boolean).join(" — ") : null,
      vehiclePlate: driver?.vehicle_plate_number ?? null,
    });
    const messageId = await sendEmail(row.customer_email!, `[TEST] ${subject}`, html, {
      bcc: process.env.TRUSTPILOT_BCC_EMAIL,
      attachments: [{ filename: `receipt-${row.quote_reference}.pdf`, content: pdfBuffer }],
    });
    console.log(`✔ sendEmail returned messageId: ${messageId ?? "NULL (send failed)"}`);
    if (!messageId) throw new Error("Email send failed — check GMAIL_USER/GMAIL_APP_PASSWORD");

    // 6. Same DB update the route makes.
    const { error: updateErr } = await setQuotationReceiptSent(inserted.id, { amountPaid: 350, paymentMethod: "Cash" });
    if (updateErr) throw new Error(`setQuotationReceiptSent failed: ${updateErr}`);
    console.log("✔ receipt_sent_at / actual_amount_paid / payment_method_used persisted");

    console.log(`\nAll checks passed. Check ${adminEmail} for the test receipt email.`);
  } finally {
    const { error: delErr } = await deleteQuotation(inserted.id);
    console.log(delErr ? `⚠ Cleanup failed: ${delErr}` : "✔ Test quotation deleted");
  }
}

main().catch((err) => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
