// One-off: branded PDF quotation for Mohamed Alkhawaja (Riyadh Expo → Holiday Inn Olaya).
// Run: node_modules/.bin/tsx scripts/gen-quote-mohamed.tsx quotation-mohamed.pdf
import * as React from "react";
// invoice.tsx relies on Next.js's automatic JSX runtime and never imports React;
// tsx compiles JSX to classic React.createElement, so expose React globally.
(globalThis as unknown as { React: typeof React }).React = React;
import { renderInvoicePdf } from "@/lib/pdf/invoice";
import type { QuotationRow } from "@/lib/supabase/quotations";
import { writeFileSync } from "fs";

const now = new Date().toISOString();

const q: QuotationRow = {
  id: "manual-draft",
  quote_reference: "TSA-0901-118",
  customer_name: "Mohamed Alkhawaja",
  customer_phone: "+966 55 858 9557",
  customer_email: null,
  pickup_location: "Riyadh Exhibitions and Conventions Center (Malham)",
  drop_location: "Holiday Inn — Al Olaya, Riyadh",
  trip_type: "one_way",
  trip_date: "2026-09-01",
  trip_time: "21:00",
  return_date: null,
  passengers_count: 1,
  luggage_notes: [
    "VEHICLE: Ford Taurus — 2025 / 2026 model",
    "INCLUDED:",
    "- Private door-to-door transfer (exclusively for you)",
    "- Professional driver, fuel and parking fees",
    "- Comfortable modern full-size sedan",
    "VALID UNTIL: 2026-09-02",
  ].join("\n"),
  vehicle_type_requested: "sedan",
  quoted_price: 200,
  currency: "SAR",
  price_notes: null,
  status: "quoted",
  assigned_driver_id: null,
  payment_status: "unpaid",
  source: "whatsapp",
  followup_flagged: false,
  admin_notes: null,
  created_at: now,
  updated_at: now,
  confirmed_at: null,
  is_test: false,
  profit: null,
  receipt_sent_at: null,
  review_invited_at: null,
  actual_amount_paid: null,
  payment_method_used: null,
};

const out = process.argv[2] || "quotation-mohamed.pdf";
renderInvoicePdf(q).then((buf) => {
  writeFileSync(out, buf);
  console.log("PDF written:", out, `(${buf.length} bytes)`);
});
