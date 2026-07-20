import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  updateQuotationStatus,
  updateQuotationDetails,
  type QuotationStatus,
  type QuotationDetailsInput,
} from "@/lib/supabase/quotations";

const STATUSES: QuotationStatus[] = ["new", "quoted", "confirmed", "assigned", "completed", "cancelled"];

// Admin: change quotation status / set price / assign driver / edit
// customer+trip details (audit-logged RPCs, 0008 + 0010)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; email?: string } | undefined;
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

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
  return NextResponse.json({ success: true, row });
}
