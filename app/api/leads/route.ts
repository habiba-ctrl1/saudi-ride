import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification, recordNotificationFailure } from "@/lib/notifications";
import { rateLimit, BOOKING_LIMIT } from "@/lib/rate-limit";

// Public: captures a quote/enquiry BEFORE the WhatsApp hand-off so a visitor is
// never lost just because they didn't finish the chat. The quote form awaits the
// 2xx response before showing success / counting a lead, so keep this fast.
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit({ key: `leads:${ip}`, ...BOOKING_LIMIT });
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const b = await request.json();
    const origin = String(b.origin ?? b.pickup ?? "").trim().slice(0, 300);
    const destination = String(b.destination ?? b.dropoff ?? "").trim().slice(0, 300);

    if (!origin || !destination) {
      return NextResponse.json({ error: "origin and destination are required" }, { status: 400 });
    }

    const customerEmail = b.customerEmail ? String(b.customerEmail).trim().slice(0, 160) : "";
    const customerPhone = b.customerPhone ? String(b.customerPhone).trim().slice(0, 40) : "";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail);
    const phoneOk = /^\+?[0-9\s-]{8,20}$/.test(customerPhone);
    if (customerEmail && !emailOk) {
      return NextResponse.json({ error: "customerEmail is not a valid email address" }, { status: 400 });
    }
    // Email is optional (WhatsApp-first buyers) — but we need *some* way to reach the customer.
    if (!phoneOk && !emailOk) {
      return NextResponse.json({ error: "A valid customerPhone or customerEmail is required" }, { status: 400 });
    }

    // Honeypot: real users never fill this hidden field. Pretend success so bots don't retry.
    if (b.website) return NextResponse.json({ success: true, id: "ok", notified: false }, { status: 201 });

    const short = (v: unknown, n: number) => (v ? String(v).trim().slice(0, n) || null : null);

    const utm = (b.utm ?? {}) as Record<string, string | undefined>;

    const base = {
      origin,
      destination,
      tripDate: short(b.tripDate, 40),
      vehicleType: short(b.vehicleType, 40),
      quotedPrice: Number.isFinite(Number(b.quotedPrice)) ? Number(b.quotedPrice) : null,
      currency: b.currency ? String(b.currency).slice(0, 8) : "SAR",
      locale: short(b.locale, 8),
      pageUrl: short(b.pageUrl, 500),
      utmSource: utm.utm_source ?? null,
      utmMedium: utm.utm_medium ?? null,
      utmCampaign: utm.utm_campaign ?? null,
      utmTerm: utm.utm_term ?? null,
      utmContent: utm.utm_content ?? null,
      source: b.source ? String(b.source).slice(0, 40) : "price_calculator",
      customerName: short(b.customerName, 120),
      customerPhone: customerPhone || null,
      customerEmail: customerEmail || null,
    };
    // Trip details added by migration 0030. If that migration hasn't been applied yet the insert
    // below throws; fall back to the minimal insert so a lead is never lost (details still reach
    // ops via the WhatsApp message).
    const extras = {
      tripType: short(b.tripType, 40),
      passengers: short(b.passengers, 20),
      luggage: short(b.luggage, 20),
      flightNumber: short(b.flightNumber, 40),
      returnDateTime: short(b.returnDateTime, 40),
      hoursNeeded: short(b.hoursNeeded, 20),
      notes: short(b.notes, 1000),
    };
    let lead;
    try {
      lead = await prisma.lead.create({ data: { ...base, ...extras } });
    } catch (e) {
      console.error("Lead insert with trip details failed — retrying minimal (is migration 0030 applied?):", e);
      lead = await prisma.lead.create({ data: base });
    }

    // Lead is already saved — a notification failure below must never lose it
    // or turn this response into an error. Same best-effort pattern as
    // notifyNewBooking(): attempt the alert, log (don't throw) on failure.
    let notified = false;
    try {
      const r = await sendLeadNotification({ ...lead, ...extras });
      notified = !!r.email;
      // Email failure is already recorded with the real error by sendEmail() itself.
    } catch (err) {
      await recordNotificationFailure({
        channel: "lead_admin_email",
        bookingRef: lead.id,
        error: String(err),
      });
    }

    return NextResponse.json({ success: true, id: lead.id, notified }, { status: 201 });
  } catch (err) {
    console.error("Create lead error:", err);
    return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
  }
}
