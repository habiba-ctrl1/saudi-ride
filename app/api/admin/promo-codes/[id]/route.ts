import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/promo-codes/[id] — update or deactivate a promo code
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const promo = await prisma.promoCode.findUnique({ where: { id } });
    if (!promo) {
      return NextResponse.json({ error: "Promo code not found" }, { status: 404 });
    }

    const { is_active, max_uses, valid_until, discount_value } = body as {
      is_active?: boolean;
      max_uses?: number;
      valid_until?: string;
      discount_value?: number;
    };

    const updated = await prisma.promoCode.update({
      where: { id },
      data: {
        ...(is_active !== undefined ? { isActive: is_active } : {}),
        ...(max_uses !== undefined ? { maxUses: max_uses } : {}),
        ...(valid_until !== undefined ? { validUntil: new Date(valid_until) } : {}),
        ...(discount_value !== undefined ? { discountValue: discount_value } : {}),
      },
    });

    return NextResponse.json({ success: true, promo_code: updated });
  } catch (error) {
    console.error("PATCH /api/admin/promo-codes/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/promo-codes/[id] — permanently delete a promo code
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const promo = await prisma.promoCode.findUnique({ where: { id } });
    if (!promo) {
      return NextResponse.json({ error: "Promo code not found" }, { status: 404 });
    }

    await prisma.promoCode.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Promo code deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/promo-codes/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
