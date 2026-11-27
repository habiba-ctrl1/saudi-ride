import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      bookingId,
      bookingRef,
      payment_method = "card",
      gateway = "moyasar",
    } = body as {
      bookingId?: string;
      bookingRef?: string;
      payment_method?: string;
      gateway?: string;
    };

    if (!bookingId && !bookingRef) {
      return NextResponse.json(
        { error: "bookingId or bookingRef is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findFirst({
      where: bookingId ? { id: bookingId } : { bookingRef },
      include: { vehicle: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Booking is already paid" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saudi-ride.vercel.app";

    // HyperPay integration
    if (gateway === "hyperpay") {
      const accessToken = process.env.HYPERPAY_ACCESS_TOKEN;
      const entityId = process.env.HYPERPAY_ENTITY_ID;
      const mode = process.env.HYPERPAY_MODE ?? "test";

      if (!accessToken || !entityId) {
        return NextResponse.json(
          { error: "HyperPay is not configured", simulated: true },
          { status: 502 }
        );
      }

      const baseUrl =
        mode === "live"
          ? "https://oppwa.com"
          : "https://eu-test.oppwa.com";

      const params = new URLSearchParams({
        "authentication.userId": "",
        "authentication.password": accessToken,
        "authentication.entityId": entityId,
        amount: booking.totalPrice.toFixed(2),
        currency: "SAR",
        paymentType: "DB",
        "merchantTransactionId": booking.bookingRef,
        "customer.email": booking.customerEmail ?? "",
        "customParameters[bookingRef]": booking.bookingRef,
      });

      const res = await fetch(`${baseUrl}/v1/checkouts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("HyperPay checkout error:", err);
        return NextResponse.json({ error: "HyperPay error", details: err }, { status: 502 });
      }

      const data = await res.json();

      await prisma.payment.upsert({
        where: { bookingId: booking.id },
        create: {
          bookingId: booking.id,
          customerId: booking.userId ?? undefined,
          amount: booking.totalPrice,
          currency: "SAR",
          paymentMethod: "CARD",
          gateway: "HYPERPAY",
          gatewayTransactionId: data.id,
          gatewayResponse: data,
          status: "PENDING",
        },
        update: {
          gateway: "HYPERPAY",
          gatewayTransactionId: data.id,
          gatewayResponse: data,
          status: "PENDING",
        },
      });

      return NextResponse.json({
        success: true,
        gateway: "hyperpay",
        checkoutId: data.id,
        checkoutUrl: `${baseUrl}/v1/paymentWidgets.js?checkoutId=${data.id}`,
      });
    }

    // Moyasar integration (default)
    const moyasarApiKey = process.env.MOYASAR_API_KEY;
    if (!moyasarApiKey || moyasarApiKey.startsWith("sk_test_placeholder")) {
      const simId = `inv_sim_${Math.random().toString(36).slice(2, 10)}`;
      return NextResponse.json({
        success: true,
        simulated: true,
        invoiceId: simId,
        url: `${siteUrl}/booking/confirmation/${booking.bookingRef}?simulated=true`,
      });
    }

    const amountHalalas = Math.round(booking.totalPrice * 100);
    const authHeader = `Basic ${Buffer.from(`${moyasarApiKey}:`).toString("base64")}`;

    const moyRes = await fetch("https://api.moyasar.com/v1/invoices", {
      method: "POST",
      headers: { Authorization: authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountHalalas,
        currency: "SAR",
        description: `Taxi Saudi Arabia — ${booking.bookingRef}`,
        success_url: `${siteUrl}/booking/confirmation/${booking.bookingRef}`,
        back_url: `${siteUrl}/track-booking?ref=${booking.bookingRef}`,
        callback_url: `${siteUrl}/api/payments/webhook/moyasar`,
        metadata: { bookingRef: booking.bookingRef, bookingId: booking.id },
      }),
    });

    if (!moyRes.ok) {
      const err = await moyRes.text();
      return NextResponse.json({ error: "Moyasar error", details: err }, { status: 502 });
    }

    const invoice = await moyRes.json();

    const methodMap: Record<string, "CARD" | "MADA" | "APPLE_PAY" | "CASH" | "CORPORATE_ACCOUNT"> = {
      card: "CARD",
      mada: "MADA",
      apple_pay: "APPLE_PAY",
      cash: "CASH",
      corporate: "CORPORATE_ACCOUNT",
    };

    await prisma.payment.upsert({
      where: { bookingId: booking.id },
      create: {
        bookingId: booking.id,
        customerId: booking.userId ?? undefined,
        amount: booking.totalPrice,
        currency: "SAR",
        paymentMethod: methodMap[payment_method] ?? "CARD",
        gateway: "MOYASAR",
        gatewayTransactionId: invoice.id,
        gatewayResponse: invoice,
        status: "PENDING",
      },
      update: {
        gateway: "MOYASAR",
        gatewayTransactionId: invoice.id,
        gatewayResponse: invoice,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      gateway: "moyasar",
      invoiceId: invoice.id,
      url: invoice.url,
    });
  } catch (error) {
    console.error("POST /api/payments/initiate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
