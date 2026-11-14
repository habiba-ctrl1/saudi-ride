import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, AUTH_LIMIT } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit({ key: `register:${ip}`, ...AUTH_LIMIT });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many registration attempts. Try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { name, phone, email, nationality, preferredLang } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Validate E.164 format
    if (!/^\+\d{7,15}$/.test(phone)) {
      return NextResponse.json(
        { error: "Phone must be in E.164 format (e.g. +966501234567)" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ phone }, ...(email ? [{ email }] : [])] },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this phone or email already exists" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: name || null,
        phone,
        email: email || null,
        nationality: nationality || null,
        preferredLang: preferredLang ?? "EN",
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        preferredLang: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Account created. Verify your phone to log in.", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
