import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const VALID_STATUSES = ["SINGLE_SOURCE", "MULTIPLE_SOURCES", "CONFLICTING", "NEEDS_CONFIRMATION", "APPROVED"];

type Body = {
  final_approved_price?: number | null; // = recommended selling price
  approval_notes?: string | null;
  pricing_status?: string;
  range_low?: number | null;
  range_high?: number | null;
  price_min?: number | null;
  est_cost?: number | null;
  border_fee?: number | null;
};

const NUMERIC_FIELDS = ["final_approved_price", "range_low", "range_high", "price_min", "est_cost", "border_fee"] as const;

// PATCH /api/admin/route-price-approvals/[id] — owner sets pricing rule values
// (recommended price, min price, range, estimated cost, border fee), status and notes.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const body = (await request.json()) as Body;

    const existing = await prisma.routePriceApproval.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Route price approval row not found" }, { status: 404 });

    if (body.pricing_status !== undefined && !VALID_STATUSES.includes(body.pricing_status)) {
      return NextResponse.json({ error: `pricing_status must be one of ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }
    for (const f of NUMERIC_FIELDS) {
      const v = body[f];
      if (v !== undefined && v !== null && (typeof v !== "number" || !Number.isFinite(v) || v < 0)) {
        return NextResponse.json({ error: `${f} must be a non-negative number or null` }, { status: 400 });
      }
    }
    const rl = body.range_low ?? existing.rangeLow;
    const rh = body.range_high ?? existing.rangeHigh;
    if (rl != null && rh != null && rl > rh) {
      return NextResponse.json({ error: "range_low cannot be greater than range_high" }, { status: 400 });
    }

    const updated = await prisma.routePriceApproval.update({
      where: { id },
      data: {
        ...(body.final_approved_price !== undefined ? { finalApprovedPrice: body.final_approved_price } : {}),
        ...(body.approval_notes !== undefined ? { approvalNotes: body.approval_notes } : {}),
        ...(body.pricing_status !== undefined ? { pricingStatus: body.pricing_status } : {}),
        ...(body.range_low !== undefined ? { rangeLow: body.range_low } : {}),
        ...(body.range_high !== undefined ? { rangeHigh: body.range_high } : {}),
        ...(body.price_min !== undefined ? { priceMin: body.price_min } : {}),
        ...(body.est_cost !== undefined ? { estCost: body.est_cost } : {}),
        ...(body.border_fee !== undefined ? { borderFee: body.border_fee } : {}),
      },
    });

    return NextResponse.json({ success: true, row: updated });
  } catch (error) {
    console.error("PATCH /api/admin/route-price-approvals/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
