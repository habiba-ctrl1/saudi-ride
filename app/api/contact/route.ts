import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const adminEmail = process.env.ADMIN_EMAIL || "info@riyadhtaxi.com";

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

    const finalService = service || serviceType || "General Inquiry";
    console.log("📥 New Contact Request Received:", { name, email, phone, message, service: finalService });

    if (resend) {
      const { data, error } = await resend.emails.send({
        from: "Riyadh Taxi Concierge <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🔔 New Contact: ${name} (${finalService})`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #111; max-width: 600px; border: 1px solid #C9A84C; border-radius: 12px;">
            <h2 style="color: #C9A84C; border-bottom: 1px solid #eee; padding-bottom: 10px;">Riyadh Taxi Chauffeur Desk</h2>
            <p>You have received a new contact inquiry through the public website.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 120px;">Name:</td>
                <td>${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Email:</td>
                <td><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Phone:</td>
                <td><a href="tel:${phone}">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Service Type:</td>
                <td><span style="background: #fdf6e2; border: 1px solid #C9A84C; color: #C9A84C; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">${finalService}</span></td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 12px; background: #fafafa; border-left: 4px solid #C9A84C; border-radius: 4px;">
              <p style="margin: 0; font-style: italic;">"${message}"</p>
            </div>
            <p style="font-size: 11px; color: #888; margin-top: 25px; border-top: 1px solid #eee; padding-top: 10px;">
              This notification was generated automatically by the Riyadh Taxi portal.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("❌ Resend Email dispatch failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Message sent. We reply within 15 minutes.",
        messageId: data?.id
      }, { status: 200 });
    } else {
      console.warn("⚠️ Resend is unconfigured. Simulating success response.");
      return NextResponse.json({
        success: true,
        message: "Message sent. We reply within 15 minutes.",
        simulated: true
      }, { status: 200 });
    }
  } catch (error: unknown) {
    console.error("❌ API Contact handler exception:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
