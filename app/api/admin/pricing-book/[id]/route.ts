import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

// PATCH /api/admin/pricing-book/[id] — update or deactivate a price book entry
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.priceBookEntry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Price book entry not found" }, { status: 404 });
    }

    const { price, notes, is_active, trip_type } = body as {
      price?: number;
      notes?: string;
      is_active?: boolean;
      trip_type?: string;
    };

    const updated = await prisma.priceBookEntry.update({
      where: { id },
      data: {
        ...(price !== undefined ? { price } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(is_active !== undefined ? { isActive: is_active } : {}),
        ...(trip_type !== undefined ? { tripType: trip_type } : {}),
      },
    });

    return NextResponse.json({ success: true, entry: updated });
  } catch (error) {
    console.error("PATCH /api/admin/pricing-book/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/pricing-book/[id] — permanently remove a price book entry
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;

    const existing = await prisma.priceBookEntry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Price book entry not found" }, { status: 404 });
    }

    await prisma.priceBookEntry.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Price book entry deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/pricing-book/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
