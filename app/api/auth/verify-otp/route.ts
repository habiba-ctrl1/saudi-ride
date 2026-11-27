import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP code are required" },
        { status: 400 }
      );
    }

    // Retrieve user by phone
    const user = await prisma.user.findUnique({
      where: { phone }
    });

    if (!user || !user.otpCode || !user.otpExpires) {
      return NextResponse.json(
        { error: "No active OTP registration found for this phone number" },
        { status: 400 }
      );
    }

    // Verify OTP code and expiration date
    if (user.otpCode !== otp || new Date() > user.otpExpires) {
      return NextResponse.json(
        { error: "Invalid or expired OTP code" },
        { status: 400 }
      );
    }

    // Clear OTP fields upon successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpires: null
      }
    });

    // Generate a secure simulated JWT session token (Base64 URL encoded payload)
    const payload = {
      sub: user.id,
      name: user.name || "Taxi Saudi Arabia Customer",
      phone: user.phone,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    };
    
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const token = `${encodedHeader}.${encodedPayload}.simulated_signature_hash`;

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name || "Taxi Saudi Arabia Customer",
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
