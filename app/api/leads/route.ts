import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public: captures a quote/enquiry BEFORE the WhatsApp hand-off so a visitor is
// never lost just because they didn't finish the chat. Fire-and-forget from the
// client (keepalive) — this must be fast and must never block the WhatsApp open.
export async function POST(request: Request) {
  try {
    const b = await request.json();
    const origin = String(b.origin ?? b.pickup ?? "").trim().slice(0, 300);
    const destination = String(b.destination ?? b.dropoff ?? "").trim().slice(0, 300);

    if (!origin || !destination) {
      return NextResponse.json({ error: "origin and destination are required" }, { status: 400 });
    }

    const utm = (b.utm ?? {}) as Record<string, string | undefined>;

    const lead = await prisma.lead.create({
      data: {
        origin,
        destination,
        tripDate: b.tripDate ? String(b.tripDate).slice(0, 40) : null,
        vehicleType: b.vehicleType ? String(b.vehicleType).slice(0, 40) : null,
        quotedPrice: Number.isFinite(Number(b.quotedPrice)) ? Number(b.quotedPrice) : null,
        currency: b.currency ? String(b.currency).slice(0, 8) : "SAR",
        locale: b.locale ? String(b.locale).slice(0, 8) : null,
        pageUrl: b.pageUrl ? String(b.pageUrl).slice(0, 500) : null,
        utmSource: utm.utm_source ?? null,
        utmMedium: utm.utm_medium ?? null,
        utmCampaign: utm.utm_campaign ?? null,
        utmTerm: utm.utm_term ?? null,
        utmContent: utm.utm_content ?? null,
        source: b.source ? String(b.source).slice(0, 40) : "price_calculator",
        customerName: b.customerName ? String(b.customerName).slice(0, 120) : null,
        customerPhone: b.customerPhone ? String(b.customerPhone).slice(0, 40) : null,
        customerEmail: b.customerEmail ? String(b.customerEmail).slice(0, 160) : null,
      },
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (err) {
    console.error("Create lead error:", err);
    return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
  }
}
