import { getQuotationWithDriver, type QuotationStatus } from "@/lib/supabase/quotations";
import { sendEmail } from "@/lib/notifications";
import { statusUpdateEmail, type StatusUpdateEmailData } from "@/lib/email/templates";
import { renderInvoicePdf } from "@/lib/pdf/invoice";

const EMAILED_STATUSES = new Set<QuotationStatus>(["quoted", "confirmed", "assigned"]);

/** Best-effort — a failed status-update email should never fail the status
 *  change itself (the caller's DB write already succeeded). Shared by the
 *  PATCH /api/quotations/[id] status-change route and the manual-quotation
 *  creation route (a price typed in at creation time also lands on 'quoted'). */
export async function notifyQuotationStatusChange(id: string, status: QuotationStatus) {
  if (!EMAILED_STATUSES.has(status)) return;
  try {
    const { row } = await getQuotationWithDriver(id);
    if (!row?.customer_email) return;
    const driver = row.drivers;
    const { subject, html } = statusUpdateEmail({
      quoteReference: row.quote_reference,
      customerName: row.customer_name,
      pickup: row.pickup_location,
      dropoff: row.drop_location,
      tripDate: row.trip_date,
      tripTime: row.trip_time,
      status: status as StatusUpdateEmailData["status"],
      quotedPrice: row.quoted_price,
      currency: row.currency,
      driverName: driver?.full_name ?? null,
      driverPhone: driver?.phone ?? null,
      vehicleLabel: driver ? [driver.vehicle_model, driver.vehicle_type.toUpperCase()].filter(Boolean).join(" — ") : null,
    });
    // For 'quoted', attach the actual branded quotation PDF — the customer
    // should receive the same document the admin can download, not just an
    // HTML summary.
    const attachments = status === "quoted"
      ? [{ filename: `quotation-${row.quote_reference}.pdf`, content: await renderInvoicePdf(row, "quotation") }]
      : undefined;
    await sendEmail(row.customer_email, subject, html, attachments ? { attachments } : undefined);
  } catch (err) {
    console.error("❌ status-update email failed:", err);
  }
}
