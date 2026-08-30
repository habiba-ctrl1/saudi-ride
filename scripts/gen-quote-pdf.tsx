// One-off: generate a branded PDF quotation using the real invoice template.
// Run: node_modules/.bin/tsx scripts/gen-quote-pdf.tsx
import { renderInvoicePdf } from "@/lib/pdf/invoice";
import type { QuotationRow } from "@/lib/supabase/quotations";
import { writeFileSync } from "fs";

const now = new Date().toISOString();

const q: QuotationRow = {
  id: "manual-draft",
  quote_reference: "TSA-2026-1014",
  customer_name: "Mahmoud Naboulsy",
  customer_phone: "+961 70 074 322",
  customer_email: null,
  pickup_location: "King Abdulaziz Airport (Jeddah)",
  drop_location: "Makkah / Madinah / Airport — multi-city (see itinerary)",
  trip_type: "multi_day",
  trip_date: "2026-10-14",
  trip_time: null,
  return_date: "2026-10-19",
  passengers_count: 2,
  luggage_notes: [
    "ITINERARY:",
    "- 14 Oct — King Abdulaziz Airport (Jeddah) to Makkah hotel  (approx. 1 hr 10 min)  —  SAR 250",
    "- Makkah hotel to Madinah hotel  (approx. 4 hr)  —  SAR 400",
    "- Madinah hotel to King Abdulaziz Airport (Jeddah)  (approx. 3 hr 45 min)  —  SAR 400",
    "ITINERARY_NOTE: Travel window 14-19 October 2026. Exact pickup times and hotel names to be confirmed by the guest.",
    "VALID UNTIL: 2026-10-20",
    "INCLUDED:",
    "- Private door-to-door transfers (exclusively for you and your companion)",
    "- Professional driver, fuel and airport parking fees",
    "- Comfortable full-size sedan",
    "- Driver details shared 1-2 days before travel",
  ].join("\n"),
  vehicle_type_requested: "sedan",
  quoted_price: 1050,
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
};

const out = process.argv[2] || "quotation.pdf";
renderInvoicePdf(q).then((buf) => {
  writeFileSync(out, buf);
  console.log("PDF written:", out, `(${buf.length} bytes)`);
});
