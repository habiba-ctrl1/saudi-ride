import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import twilio from "twilio";

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // OTP expires in 5 minutes
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // Upsert user based on phone number (if they don't exist, create a generic CUSTOMER profile)
    await prisma.user.upsert({
      where: { phone },
      update: {
        otpCode,
        otpExpires,
      },
      create: {
        phone,
        otpCode,
        otpExpires,
        role: "CUSTOMER",
      },
    });

    // Send OTP via Twilio if configured
    if (client && twilioPhoneNumber) {
      await client.messages.create({
        body: `Your Riyadh Luxe Taxi login code is: ${otpCode}. It expires in 5 minutes.`,
        from: twilioPhoneNumber,
        to: phone,
      });
      console.log(`Sent OTP ${otpCode} to ${phone} via Twilio.`);
    } else {
      // For local development when Twilio is not configured
      console.log(`[LOCAL DEV] Simulated sending OTP ${otpCode} to ${phone}`);
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
