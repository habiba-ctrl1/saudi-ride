import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getQuotationWithDriver, setQuotationReceiptSent } from "@/lib/supabase/quotations";
import { renderInvoicePdf } from "@/lib/pdf/invoice";
import { sendEmail } from "@/lib/notifications";
import { receiptEmail } from "@/lib/email/templates";

export const runtime = "nodejs";

async function loadReceiptRow(id: string) {
  const { row, error } = await getQuotationWithDriver(id);
  if (error || !row) return { row: null, error: error ?? "Quotation not found", status: 404 as const };
  if (row.payment_status !== "paid") {
    return { row: null, error: "Mark this quotation's payment as 'paid' before generating a receipt", status: 400 as const };
  }
  return { row, error: null, status: 200 as const };
}

// Admin: download a branded PDF receipt for a completed, paid trip
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { row, error, status } = await loadReceiptRow(id);
  if (!row) return NextResponse.json({ error }, { status });

  const pdfBuffer = await renderInvoicePdf(row, "receipt");

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${row.quote_reference}.pdf"`,
    },
  });
}

// Admin: "Send Receipt" action — emails the branded PDF receipt to the
// customer, BCC'ing Trustpilot's Automatic Feedback Service (if configured)
// so a review invite goes out automatically a few days later, then records
// what was actually collected + marks receipt_sent_at.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { row, error, status } = await loadReceiptRow(id);
  if (!row) return NextResponse.json({ error }, { status });
  if (!row.customer_email) {
    return NextResponse.json({ error: "This customer has no email on file — cannot send a receipt" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const amountPaid = typeof body.actualAmountPaid === "number" ? body.actualAmountPaid : (row.quoted_price ?? 0);
  const paymentMethod = typeof body.paymentMethod === "string" && body.paymentMethod.trim() ? body.paymentMethod.trim() : "Cash";

  // Persist the actual paid amount/method on the row before rendering, so the
  // PDF and email both reflect what was really collected, not just the quote.
  const rowForDocs = { ...row, actual_amount_paid: amountPaid, payment_method_used: paymentMethod };
  const pdfBuffer = await renderInvoicePdf(rowForDocs, "receipt");

  const driver = row.drivers;
  const { subject, html } = receiptEmail({
    quoteReference: row.quote_reference,
    customerName: row.customer_name,
    pickup: row.pickup_location,
    dropoff: row.drop_location,
    tripDate: row.trip_date,
    tripTime: row.trip_time,
    amountPaid,
    currency: row.currency,
    paymentMethod,
    driverName: driver?.full_name ?? null,
    driverPhone: driver?.phone ?? null,
    vehicleLabel: driver ? [driver.vehicle_model, driver.vehicle_type.toUpperCase()].filter(Boolean).join(" — ") : null,
    vehiclePlate: driver?.vehicle_plate_number ?? null,
  });

  const messageId = await sendEmail(row.customer_email, subject, html, {
    bcc: process.env.TRUSTPILOT_INVITE_EMAIL,
    attachments: [{ filename: `receipt-${row.quote_reference}.pdf`, content: pdfBuffer }],
  });

  if (!messageId) {
    return NextResponse.json({ error: "Email failed to send — check server logs" }, { status: 502 });
  }

  const { row: updated, error: updateError } = await setQuotationReceiptSent(id, { amountPaid, paymentMethod });
  if (updateError) return NextResponse.json({ error: updateError }, { status: 400 });

  return NextResponse.json({ success: true, row: updated });
}
