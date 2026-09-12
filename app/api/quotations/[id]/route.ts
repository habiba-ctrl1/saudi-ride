import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  updateQuotationStatus,
  updateQuotationDetails,
  setQuotationTestFlag,
  setQuotationProfit,
  setQuotationReviewInvited,
  deleteQuotation,
  getQuotationById,
  getQuotationWithDriver,
  type QuotationStatus,
  type QuotationDetailsInput,
} from "@/lib/supabase/quotations";
import { sendEmail } from "@/lib/notifications";
import { statusUpdateEmail, type StatusUpdateEmailData } from "@/lib/email/templates";

const EMAILED_STATUSES = new Set<QuotationStatus>(["quoted", "confirmed", "assigned"]);

/** Best-effort — a failed status-update email should never fail the status
 *  change itself (the admin action already succeeded in the DB). */
async function notifyStatusChange(id: string, status: QuotationStatus) {
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
    await sendEmail(row.customer_email, subject, html);
  } catch (err) {
    console.error("❌ status-update email failed:", err);
  }
}

const STATUSES: QuotationStatus[] = ["new", "quoted", "confirmed", "assigned", "completed", "cancelled"];

// Admin: change quotation status / set price / assign driver / edit
// customer+trip details (audit-logged RPCs, 0008 + 0010) / toggle is_test
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; email?: string } | undefined;
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (body.is_test !== undefined) {
    const { row, error } = await setQuotationTestFlag(id, Boolean(body.is_test));
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true, row });
  }

  if (body.profit !== undefined) {
    const profit = body.profit === null || body.profit === "" ? null : Number(body.profit);
    if (profit !== null && !Number.isFinite(profit)) {
      return NextResponse.json({ error: "Invalid profit amount" }, { status: 400 });
    }
    const { row, error } = await setQuotationProfit(id, profit);
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true, row });
  }

  if (body.reviewInvited !== undefined) {
    const { row, error } = await setQuotationReviewInvited(id);
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true, row });
  }

  if (body.details) {
    const details = body.details as QuotationDetailsInput;
    if (details.customer_name !== undefined && !details.customer_name.trim()) {
      return NextResponse.json({ error: "Customer name cannot be empty" }, { status: 400 });
    }
    if (details.customer_phone !== undefined && !details.customer_phone.trim()) {
      return NextResponse.json({ error: "Customer phone cannot be empty" }, { status: 400 });
    }
    if (details.pickup_location !== undefined && !details.pickup_location.trim()) {
      return NextResponse.json({ error: "Pickup location cannot be empty" }, { status: 400 });
    }
    if (details.drop_location !== undefined && !details.drop_location.trim()) {
      return NextResponse.json({ error: "Drop location cannot be empty" }, { status: 400 });
    }

    const { row, error } = await updateQuotationDetails(id, user.email ?? "admin", details);
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true, row });
  }

  const status = body.status as QuotationStatus;
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const quotedPrice = body.quotedPrice !== undefined && body.quotedPrice !== null && body.quotedPrice !== ""
    ? Number(body.quotedPrice)
    : undefined;
  if (quotedPrice !== undefined && (!Number.isFinite(quotedPrice) || quotedPrice < 0)) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const { row, error } = await updateQuotationStatus(id, status, user.email ?? "admin", {
    driverId: body.driverId || undefined,
    quotedPrice,
  });

  if (error) return NextResponse.json({ error }, { status: 400 });
  await notifyStatusChange(id, status);
  return NextResponse.json({ success: true, row });
}

// DELETE /api/quotations/[id] — only ever allowed for quotations explicitly
// marked is_test=true. Enforced here server-side regardless of what the
// calling UI shows. No bulk/"delete all" variant exists.
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string } | undefined;
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { row, error: fetchError } = await getQuotationById(id);
  if (fetchError || !row) {
    return NextResponse.json({ error: fetchError ?? "Quotation not found" }, { status: 404 });
  }
  if (!row.is_test) {
    return NextResponse.json({ error: "Only quotations marked as TEST can be deleted here." }, { status: 403 });
  }

  const { error } = await deleteQuotation(id);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
