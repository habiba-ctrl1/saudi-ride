import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getQuotationWithDriver, setQuotationReceiptSent, setQuotationReviewInvited } from "@/lib/supabase/quotations";
import { renderInvoicePdf } from "@/lib/pdf/invoice";
import { sendEmail, recordNotificationFailure } from "@/lib/notifications";
import { receiptEmail } from "@/lib/email/templates";
import { reviewUrlFor } from "@/lib/reviews";
import { buildReceiptInfo, latestPaymentId, recordPayment, listPayments } from "@/lib/ops/payments";

export const runtime = "nodejs";

// Admin: download a branded PDF receipt for the latest recorded payment (PAID stamp only if the fare is settled).
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const { row, error } = await getQuotationWithDriver(id);
  if (error || !row) return NextResponse.json({ error: error ?? "Quotation not found" }, { status: 404 });
  const pid = await latestPaymentId(id);
  if (!pid) return NextResponse.json({ error: "No payment has been recorded for this booking" }, { status: 400 });
  const info = await buildReceiptInfo(pid);
  const pdfBuffer = await renderInvoicePdf(row, "receipt", info);
  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="receipt-${row.quote_reference}.pdf"` },
  });
}

// Admin: "Collect payment & send receipt" — records the payment actually collected (default: the remaining balance) in the
// payments ledger, then emails the receipt for THAT payment when the customer has an email. Payment status is derived from the
// ledger (partial stays partial). A missing email or failed send never blocks recording real money; the response says honestly
// whether the email went out.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const { row, error } = await getQuotationWithDriver(id);
  if (error || !row) return NextResponse.json({ error: error ?? "Quotation not found" }, { status: 404 });
  if (row.status !== "completed") return NextResponse.json({ error: "Mark this quotation as 'completed' before generating a receipt" }, { status: 400 });

  const body = await request.json().catch(() => ({}));
  const already = (await listPayments(id)).filter((p) => !p.voided_at).reduce((a, p) => a + p.amount, 0);
  const amount = typeof body.actualAmountPaid === "number" ? body.actualAmountPaid : Math.max((row.quoted_price ?? 0) - already, 0);
  const paymentMethod = typeof body.paymentMethod === "string" && body.paymentMethod.trim() ? body.paymentMethod.trim() : "Cash";

  let paymentId: string;
  try {
    paymentId = (await recordPayment(id, { amount, method: paymentMethod }, auth.email)).id;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not record payment" }, { status: 400 });
  }
  const info = await buildReceiptInfo(paymentId);

  let emailSent = false;
  if (row.customer_email) {
    try {
      const pdfBuffer = await renderInvoicePdf(row, "receipt", info);
      const driver = row.drivers;
      const { subject, html } = receiptEmail({
        quoteReference: row.quote_reference, customerName: row.customer_name, pickup: row.pickup_location, dropoff: row.drop_location,
        tripDate: row.trip_date, tripTime: row.trip_time, amountPaid: info.amount, currency: row.currency, paymentMethod: info.method,
        partial: info.fullyPaid ? null : { balance: info.balance },
        driverName: driver?.full_name ?? null, driverPhone: driver?.phone ?? null,
        vehicleLabel: driver ? [driver.vehicle_model, driver.vehicle_type.toUpperCase()].filter(Boolean).join(" — ") : null,
        vehiclePlate: driver?.vehicle_plate_number ?? null, reviewUrl: reviewUrlFor(row.quote_reference),
      });
      const messageId = await sendEmail(row.customer_email, subject, html, {
        bcc: process.env.TRUSTPILOT_INVITE_EMAIL,
        attachments: [{ filename: `receipt-${row.quote_reference}.pdf`, content: pdfBuffer }],
      });
      emailSent = !!messageId;
      if (!emailSent) await recordNotificationFailure({ channel: "receipt_email", target: row.customer_email, bookingRef: row.quote_reference, error: "sendEmail returned null" });
    } catch (err) {
      await recordNotificationFailure({ channel: "receipt_email", target: row.customer_email, bookingRef: row.quote_reference, error: String(err) });
    }
  }

  // Only the receipt-sent timestamp is touched here; amount/method/status already come from the ledger.
  const { row: updated, error: updateError } = await setQuotationReceiptSent(id);
  if (updateError) return NextResponse.json({ error: updateError }, { status: 400 });
  if (emailSent && info.fullyPaid) await setQuotationReviewInvited(id);
  return NextResponse.json({ success: true, row: updated, emailSent, fullyPaid: info.fullyPaid, balance: info.balance });
}
