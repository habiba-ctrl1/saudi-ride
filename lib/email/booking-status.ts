import { sendEmailStrict, type StrictEmailResult } from "@/lib/notifications";

/** Statuses that trigger a customer email. PENDING / IN_PROGRESS / REFUNDED stay silent. */
export const EMAILED_BOOKING_STATUSES = ["CONFIRMED", "DRIVER_ASSIGNED", "COMPLETED", "CANCELLED"] as const;
export type EmailedBookingStatus = (typeof EMAILED_BOOKING_STATUSES)[number];

export function isEmailedBookingStatus(s: string): s is EmailedBookingStatus {
  return (EMAILED_BOOKING_STATUSES as readonly string[]).includes(s);
}

export type BookingStatusEmailInput = {
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: Date | string;
  passengers: number;
  vehicleName?: string | null;
  totalPrice: number;
  currency: string;
  paymentMethod?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  status: EmailedBookingStatus;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taxisaudiarabia.com";
const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+966539388072").replace(/[^0-9]/g, "");
const adminEmail = process.env.ADMIN_EMAIL || "infotaxisaudiarabia@gmail.com";

function esc(v: unknown): string {
  return String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

const COPY: Record<EmailedBookingStatus, { subject: string; badge: string; badgeColor: string; intro: string }> = {
  CONFIRMED: {
    subject: "Your booking is confirmed",
    badge: "BOOKING CONFIRMED",
    badgeColor: "#16A34A",
    intro: "Your transfer is confirmed. Please check the details below and reply to this email or message us on WhatsApp if anything needs to change.",
  },
  DRIVER_ASSIGNED: {
    subject: "Your chauffeur has been assigned",
    badge: "CHAUFFEUR ASSIGNED",
    badgeColor: "#16A34A",
    intro: "A chauffeur has been assigned to your transfer. He will contact you before pickup.",
  },
  COMPLETED: {
    subject: "Trip completed - thank you",
    badge: "TRIP COMPLETED",
    badgeColor: "#16A34A",
    intro: "Thank you for travelling with Taxi Saudi Arabia. We hope the journey went smoothly. For a receipt or an invoice, just reply to this email.",
  },
  CANCELLED: {
    subject: "Your booking has been cancelled",
    badge: "BOOKING CANCELLED",
    badgeColor: "#DC2626",
    intro: "Your booking has been cancelled. If this is unexpected, please reply to this email or message us on WhatsApp and we will help straight away.",
  },
};

function paymentLine(method: string | null | undefined): string {
  if (!method || method === "arrival" || method === "cash") return "Cash on pickup, paid directly to the driver";
  return esc(method);
}

export function bookingStatusEmail(d: BookingStatusEmailInput): { subject: string; html: string } {
  const c = COPY[d.status];
  // pickupDateTime is stored as the wall-clock time the customer entered (written as UTC),
  // so format it back as UTC to show the same time they picked.
  const when = new Date(d.pickupDateTime).toLocaleString("en-GB", {
    timeZone: "UTC", weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const track = `${siteUrl}/track-booking?ref=${encodeURIComponent(d.bookingRef)}&phone=${encodeURIComponent(d.customerPhone)}`;
  const wa = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I have a question about booking ${d.bookingRef}`)}`;

  const rows: Array<[string, string]> = [
    ["Reference", esc(d.bookingRef)],
    ["Pickup", esc(d.pickupLocation)],
    ["Drop-off", esc(d.dropoffLocation)],
    ["Date & time", esc(when)],
    ["Passengers", String(d.passengers)],
  ];
  if (d.vehicleName) rows.push(["Vehicle", esc(d.vehicleName)]);
  if (d.status !== "CANCELLED" && d.totalPrice > 0) {
    rows.push(["Fare", `<strong>${esc(d.currency)} ${d.totalPrice.toLocaleString("en-US")}</strong>`]);
    rows.push(["Payment", paymentLine(d.paymentMethod)]);
  }
  if (d.status === "DRIVER_ASSIGNED" && d.driverName) {
    rows.push(["Chauffeur", esc(d.driverName) + (d.driverPhone ? ` &middot; ${esc(d.driverPhone)}` : "")]);
  }

  const table = rows
    .map(([k, v]) => `<tr><td style="padding:8px 0;color:#6B7280;width:110px;vertical-align:top;font-size:13px">${k}</td><td style="padding:8px 0;color:#111827;font-size:14px">${v}</td></tr>`)
    .join("");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111827;border:1px solid #E5E7EB;border-radius:14px">
    <div style="text-align:center;margin-bottom:18px">
      <div style="font-size:22px;font-weight:bold;color:#16A34A;letter-spacing:1px">TAXI SAUDI ARABIA</div>
      <div style="font-size:11px;color:#6B7280;letter-spacing:2px;text-transform:uppercase;margin-top:4px">Private chauffeur transfers</div>
    </div>
    <div style="text-align:center;margin-bottom:18px">
      <span style="display:inline-block;background:${c.badgeColor};color:#fff;font-size:12px;font-weight:bold;letter-spacing:1px;padding:6px 14px;border-radius:999px">${c.badge}</span>
    </div>
    <p style="font-size:15px;margin:0 0 6px">Dear ${esc(d.customerName)},</p>
    <p style="font-size:14px;line-height:1.6;color:#374151;margin:0 0 18px">${c.intro}</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #E5E7EB;border-bottom:1px solid #E5E7EB;margin-bottom:22px">${table}</table>
    <div style="text-align:center;margin-bottom:22px">
      <a href="${track}" style="display:inline-block;background:#16A34A;color:#fff;padding:12px 26px;text-decoration:none;font-weight:bold;border-radius:8px;font-size:14px;margin:0 6px 8px">Track booking</a>
      <a href="${wa}" style="display:inline-block;background:#25D366;color:#fff;padding:12px 26px;text-decoration:none;font-weight:bold;border-radius:8px;font-size:14px;margin:0 6px 8px">WhatsApp us</a>
    </div>
    <p style="font-size:12px;color:#6B7280;line-height:1.5;margin:0">Free cancellation up to 24 hours before pickup. Questions? Reply to this email or message +${whatsappNumber.replace(/^(\d{3})(\d{2})(\d{3})(\d{4})$/, "$1 $2 $3 $4")}.</p>
  </div>`;

  return { subject: `${c.subject} - Ref: ${d.bookingRef}`, html };
}

/** Sends the status email. Honest result; never throws. Admin gets a BCC copy. */
export async function sendBookingStatusEmail(d: BookingStatusEmailInput): Promise<StrictEmailResult> {
  try {
    const { subject, html } = bookingStatusEmail(d);
    return await sendEmailStrict(d.customerEmail, subject, html, { bcc: adminEmail });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
