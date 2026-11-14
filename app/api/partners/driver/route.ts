import { NextResponse } from "next/server";
import { registerDriver, type DriverVehicleType } from "@/lib/supabase/drivers";
import { sendEmail } from "@/lib/notifications";
import { adminDriverEmail } from "@/lib/email/templates";

const adminEmail = process.env.ADMIN_EMAIL || "infotaxisaudiarabia@gmail.com";

const VEHICLE_TYPES: DriverVehicleType[] = ["sedan", "suv", "van", "bus", "limousine"];

// "1-2" | "3-5" | "5+" → representative number for years_experience
function parseExperience(exp: unknown): number | null {
  const s = String(exp ?? "");
  if (s === "1-2") return 2;
  if (s === "3-5") return 4;
  if (s === "5+") return 6;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, licenseNumber, vehicleDetails, experience, city, iqamaNumber, vehicleType, termsAccepted } = body;

    if (!name || !phone || !licenseNumber || !city || !iqamaNumber || !vehicleType) {
      return NextResponse.json(
        { error: "Missing required fields (name, phone, licenseNumber, city, iqamaNumber, vehicleType)." },
        { status: 400 }
      );
    }
    if (termsAccepted !== true) {
      return NextResponse.json({ error: "You must accept the terms to apply." }, { status: 400 });
    }
    if (!VEHICLE_TYPES.includes(vehicleType)) {
      return NextResponse.json({ error: "Invalid vehicle type." }, { status: 400 });
    }

    // 1) Save to database — this is the source of truth
    const { row, error } = await registerDriver({
      full_name: String(name).trim(),
      phone: String(phone).trim(),
      whatsapp_number: String(phone).trim(),
      city: String(city).trim(),
      vehicle_type: vehicleType,
      vehicle_model: vehicleDetails ? String(vehicleDetails).trim() : null,
      license_number: String(licenseNumber).trim(),
      iqama_number: String(iqamaNumber).trim(),
      years_experience: parseExperience(experience),
    });

    if (error || !row) {
      console.error("registerDriver failed:", error);
      const isDuplicate = /duplicate|unique/i.test(error ?? "");
      return NextResponse.json(
        { error: isDuplicate ? "An application with this phone, license or iqama number already exists." : "Could not save your application. Please try again." },
        { status: isDuplicate ? 409 : 500 }
      );
    }

    // 2) Notify admin by email — best-effort, never fails the request
    const mail = adminDriverEmail({
      name: String(name),
      phone: String(phone),
      city: String(city),
      vehicleType: String(vehicleType),
      vehicleDetails: vehicleDetails ? String(vehicleDetails) : null,
      licenseNumber: String(licenseNumber),
      iqamaNumber: String(iqamaNumber),
      experience: experience ? String(experience) : null,
    });
    await sendEmail(adminEmail, mail.subject, mail.html);

    return NextResponse.json({ success: true, applicationId: row.id });
  } catch (error: unknown) {
    console.error("API Driver handler exception:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
