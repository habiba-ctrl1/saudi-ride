import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { bookingRef } = await request.json();

    if (!bookingRef) {
      return NextResponse.json(
        { error: "Booking reference (bookingRef) is required" },
        { status: 400 }
      );
    }

    // Retrieve booking details to prevent price tampering
    const booking = await prisma.booking.findUnique({
      where: { bookingRef },
      include: { vehicle: true }
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const moyasarApiKey = process.env.MOYASAR_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://saudi-ride.vercel.app";

    // If Moyasar is not configured, trigger premium checkout simulation
    if (!moyasarApiKey || moyasarApiKey.startsWith("sk_test_placeholder")) {
      console.warn("⚠️ Moyasar API key is unconfigured. Returning simulated payment checkout URL.");
      return NextResponse.json({
        success: true,
        simulated: true,
        invoiceId: `inv_simulated_${Math.random().toString(36).substring(2, 10)}`,
        url: `${siteUrl}/booking/confirmation/${booking.bookingRef}?simulated=true`
      });
    }

    // Convert price to Halalas (smallest currency unit, e.g. 100 Halalas = 1 SAR)
    const amountInHalalas = Math.round(Number(booking.totalPrice) * 100);

    // Call Moyasar API to create secure payment invoice
    const authHeader = "Basic " + Buffer.from(moyasarApiKey + ":").toString("base64");

    const moyasarResponse = await fetch("https://api.moyasar.com/v1/invoices", {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amountInHalalas,
        currency: "SAR",
        description: `Taxi Saudi Arabia Booking Ref: ${booking.bookingRef}`,
        success_url: `${siteUrl}/booking/confirmation/${booking.bookingRef}`,
        back_url: `${siteUrl}/track-booking?ref=${booking.bookingRef}`,
        callback_url: `${siteUrl}/api/webhooks/moyasar`,
        metadata: {
          bookingRef: booking.bookingRef
        }
      })
    });

    if (!moyasarResponse.ok) {
      const errorText = await moyasarResponse.text();
      console.error("❌ Moyasar invoice creation failed:", errorText);
      return NextResponse.json(
        { error: "Failed to initialize payment gateway", details: errorText },
        { status: 502 }
      );
    }

    const invoiceData = await moyasarResponse.json();

    return NextResponse.json({
      success: true,
      invoiceId: invoiceData.id,
      url: invoiceData.url // Moyasar checkout portal redirect URL
    });

  } catch (error) {
    console.error("Payment session initialization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
