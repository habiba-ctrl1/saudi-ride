import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const VALID_STATUSES = ["SINGLE_SOURCE", "MULTIPLE_SOURCES", "CONFLICTING", "NEEDS_CONFIRMATION", "APPROVED"];

// PATCH /api/admin/route-price-approvals/[id] — set the company's final approved price/status/notes
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.routePriceApproval.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Route price approval row not found" }, { status: 404 });
    }

    const { final_approved_price, approval_notes, pricing_status } = body as {
      final_approved_price?: number | null;
      approval_notes?: string | null;
      pricing_status?: string;
    };

    if (pricing_status !== undefined && !VALID_STATUSES.includes(pricing_status)) {
      return NextResponse.json({ error: `pricing_status must be one of ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }

    const updated = await prisma.routePriceApproval.update({
      where: { id },
      data: {
        ...(final_approved_price !== undefined ? { finalApprovedPrice: final_approved_price } : {}),
        ...(approval_notes !== undefined ? { approvalNotes: approval_notes } : {}),
        ...(pricing_status !== undefined ? { pricingStatus: pricing_status } : {}),
      },
    });

    return NextResponse.json({ success: true, row: updated });
  } catch (error) {
    console.error("PATCH /api/admin/route-price-approvals/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
