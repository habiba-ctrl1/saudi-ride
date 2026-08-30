import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PromoCodesClient } from "./PromoCodesClient";

export const metadata: Metadata = { title: "Promo Codes | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminPromoCodesPage() {
  const promoCodes = await prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Promo Codes</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">{promoCodes.length} codes total.</p>
      </div>
      <PromoCodesClient
        promoCodes={promoCodes.map((p) => ({
          id: p.id,
          code: p.code,
          discountType: p.discountType,
          discountValue: p.discountValue,
          minOrderValue: p.minOrderValue,
          maxUses: p.maxUses,
          usedCount: p.usedCount,
          validUntil: p.validUntil ? p.validUntil.toISOString() : null,
          isActive: p.isActive,
          createdAt: p.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
