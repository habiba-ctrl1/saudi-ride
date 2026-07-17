import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/notifications";
import { adminContactEmail, clientContactAutoReply } from "@/lib/email/templates";

const adminEmail = process.env.ADMIN_EMAIL || "infotaxisaudiarabia@gmail.com";

export async function POST(request: Request) {
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
      name: String(name),
      email: String(email),
      phone: String(phone),
      service: String(service || serviceType || "General Inquiry"),
      message: String(message),
    };

    const adminMail = adminContactEmail(data);
    const replyMail = clientContactAutoReply(data);

    const [adminResult] = await Promise.allSettled([
      sendEmail(adminEmail, adminMail.subject, adminMail.html),
      sendEmail(data.email, replyMail.subject, replyMail.html),
    ]);

    if (adminResult.status === "rejected" || adminResult.value === null) {
      console.error("Contact admin email failed");
      return NextResponse.json(
        { error: "Could not send your message right now. Please contact us on WhatsApp." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent. We reply within 15 minutes." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API Contact handler exception:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
