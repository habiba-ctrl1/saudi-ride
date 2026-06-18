import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// One-time admin setup route.
// Visit GET /api/setup-admin to create the admin user from env credentials.
// This route auto-disables once an admin already exists.
export async function GET() {
  const email = process.env.ADMIN_EMAIL;
  const name = "Admin";

  if (!email) {
    return NextResponse.json({ error: "ADMIN_EMAIL is not set in .env" }, { status: 500 });
  }

  const existing = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (existing) {
    return NextResponse.json({
      message: "Admin account already exists.",
      email: existing.email,
    });
  }

  const admin = await prisma.user.create({
    data: {
      name,
      email,
      role: "ADMIN",
    },
  });

  return NextResponse.json({
    success: true,
    message: "Admin account created successfully.",
    email: admin.email,
  });
}
