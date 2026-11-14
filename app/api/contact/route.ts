import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, recordNotificationFailure } from "@/lib/notifications";
import { adminContactEmail, clientContactAutoReply } from "@/lib/email/templates";
import { rateLimit, BOOKING_LIMIT } from "@/lib/rate-limit";

const adminEmail = process.env.ADMIN_EMAIL || "infotaxisaudiarabia@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s-]{8,20}$/;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit({ key: `contact:${ip}`, ...BOOKING_LIMIT });
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, message, service, serviceType } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, phone, message)." },
        { status: 400 }
      );
    }

    const data = {
      name: String(name).trim().slice(0, 200),
      email: String(email).trim().slice(0, 200),
      phone: String(phone).trim().slice(0, 40),
      service: String(service || serviceType || "General Inquiry").trim().slice(0, 100),
      message: String(message).trim().slice(0, 5000),
    };

    if (!data.name || !EMAIL_RE.test(data.email) || !PHONE_RE.test(data.phone) || !data.message) {
      return NextResponse.json(
        { error: "Please provide a valid name, email, phone number, and message." },
        { status: 400 }
      );
    }

    // Persist FIRST — durable and independent of whether email delivery
    // succeeds, so a Resend outage can never lose the enquiry (Batch 2 fix;
    // previously this route had no database write at all).
    let submissionId: string;
    try {
      const submission = await prisma.contactSubmission.create({ data });
      submissionId = submission.id;
    } catch (dbErr) {
      console.error("Contact submission DB write failed:", dbErr);
      return NextResponse.json(
        { error: "Could not save your message right now. Please try again or contact us on WhatsApp." },
        { status: 500 }
      );
    }

    // Notification is best-effort from here on — a failure here must not
    // pretend the enquiry was lost; it's already safely stored.
    const adminMail = adminContactEmail(data);
    const replyMail = clientContactAutoReply(data);

    const [adminResult, replyResult] = await Promise.allSettled([
      sendEmail(adminEmail, adminMail.subject, adminMail.html),
      sendEmail(data.email, replyMail.subject, replyMail.html),
    ]);

    const adminEmailOk = adminResult.status === "fulfilled" && adminResult.value !== null;
    if (!adminEmailOk) {
      await recordNotificationFailure({
        channel: "contact_admin_email",
        bookingRef: submissionId,
        subject: adminMail.subject,
        error: adminResult.status === "rejected" ? String(adminResult.reason) : "sendEmail returned null",
      });
    }
    const replyEmailOk = replyResult.status === "fulfilled" && replyResult.value !== null;
    if (!replyEmailOk) {
      await recordNotificationFailure({
        channel: "contact_customer_reply",
        target: data.email,
        bookingRef: submissionId,
        subject: replyMail.subject,
        error: replyResult.status === "rejected" ? String(replyResult.reason) : "sendEmail returned null",
      });
    }

    return NextResponse.json(
      {
        success: true,
        id: submissionId,
        notified: adminEmailOk,
        message: adminEmailOk
          ? "Message received. We reply within 15 minutes."
          : "Message received and saved. Our notification email is delayed, but your enquiry is safe — we'll follow up.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API Contact handler exception:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
