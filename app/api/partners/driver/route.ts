import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const adminEmail = process.env.ADMIN_EMAIL || "info@riyadhtaxi.com";

export async function POST(request: Request) {
  try {
    const { name, phone, licenseNumber, vehicleDetails, experience } = await request.json();

    if (!name || !phone || !licenseNumber || !vehicleDetails || !experience) {
      return NextResponse.json(
        { error: "Missing required fields (name, phone, licenseNumber, vehicleDetails, experience)." },
        { status: 400 }
      );
    }

    console.log("🚕 New Driver Application Capture:", { name, phone, licenseNumber, vehicleDetails, experience });

    if (resend) {
      const { data, error } = await resend.emails.send({
        from: "Riyadh Taxi Driver Network <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🚕 New Driver Applicant: ${name} (${experience} yrs)`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #111; max-width: 600px; border: 1px solid #C9A84C; border-radius: 12px;">
            <h2 style="color: #C9A84C; border-bottom: 1px solid #eee; padding-bottom: 10px;">Riyadh Taxi Chauffeur Operations</h2>
            <p>A new chauffeur applicant has submitted an operations request on the network portal.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 150px;">Applicant Name:</td>
                <td>${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Phone Number:</td>
                <td><a href="tel:${phone}">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Saudi License #:</td>
                <td><code>${licenseNumber}</code></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Vehicle Details:</td>
                <td>${vehicleDetails}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Experience Years:</td>
                <td>${experience} Years</td>
              </tr>
            </table>
            <p style="margin-top: 20px; font-size: 12px; color: #555;">
              <strong>Action required:</strong> Please perform background checks, verify credentials against the public registry, and schedule a physical vehicle inspection.
            </p>
            <p style="font-size: 11px; color: #888; margin-top: 25px; border-top: 1px solid #eee; padding-top: 10px;">
              This notification was generated automatically by the Riyadh Taxi portal.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("❌ Resend Driver Email dispatch failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, messageId: data?.id });
    } else {
      console.warn("⚠️ Resend is unconfigured. Simulating success response.");
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "No Resend key configured. Driver application successfully captured in backend logs."
      });
    }
  } catch (error: unknown) {
    console.error("❌ API Driver handler exception:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
