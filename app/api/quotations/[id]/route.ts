import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateQuotationStatus, type QuotationStatus } from "@/lib/supabase/quotations";

const STATUSES: QuotationStatus[] = ["new", "quoted", "confirmed", "assigned", "completed", "cancelled"];

// Admin: change quotation status / set price / assign driver (audit-logged RPC)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; email?: string } | undefined;
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
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
