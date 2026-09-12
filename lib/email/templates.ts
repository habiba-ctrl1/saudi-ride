// Branded HTML email templates — Taxi Saudi Arabia (green #16A34A / yellow #FACC15).
// Admin templates go to ADMIN_EMAIL; client templates go to the customer.
// All senders go through sendEmail() in lib/notifications.ts.

import { contactConfig } from "@/lib/config/contact";

const GREEN = "#16A34A";
const YELLOW = "#FACC15";

function wrapper(title: string, body: string, footerNote: string) {
  return `
  <div style="background:#f1f6f2;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e4ede7;">
      <div style="background:${GREEN};padding:22px 28px;">
        <span style="color:${YELLOW};font-size:18px;font-weight:bold;letter-spacing:2px;">TAXI SAUDI ARABIA</span>
        <div style="color:#d9f5d7;font-size:11px;margin-top:4px;letter-spacing:1px;">PREMIUM CHAUFFEUR NETWORK — KSA</div>
      </div>
      <div style="padding:28px;">
        <h2 style="margin:0 0 14px;color:#121417;font-size:19px;">${title}</h2>
        ${body}
      </div>
      <div style="background:#eaf6ee;border-top:1px solid #e4ede7;padding:16px 28px;font-size:11px;color:#5B6B60;line-height:1.6;">
        ${footerNote}<br/>
        WhatsApp: <a href="${contactConfig.whatsappLink}" style="color:${GREEN};">${contactConfig.primaryPhoneDisplay}</a>
        &nbsp;|&nbsp; Email: <a href="${contactConfig.emailLink}" style="color:${GREEN};">${contactConfig.email}</a>
      </div>
    </div>
  </div>`;
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:7px 0;font-weight:bold;color:#49505a;width:150px;vertical-align:top;font-size:13px;">${label}</td>
    <td style="padding:7px 0;color:#121417;font-size:13px;">${value}</td>
  </tr>`;
}

function table(rows: string) {
  return `<table style="width:100%;border-collapse:collapse;background:#eaf6ee;border-radius:10px;padding:6px;">${rows}</table>`;
}

function esc(s: unknown): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Quotation ─────────────────────────────────────────────────────────────────

export type QuotationEmailData = {
  quoteReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  pickup: string;
  dropoff: string;
  tripDate: string;
  tripTime?: string | null;
  passengers?: number | null;
};

/** To the CUSTOMER right after they request a quote. */
export function clientQuotationEmail(d: QuotationEmailData) {
  const body = `
    <p style="color:#49505a;font-size:14px;line-height:1.7;">
      Dear <strong>${esc(d.customerName)}</strong>,<br/><br/>
      Thank you for choosing Taxi Saudi Arabia. We have received your ride request and our team
      is preparing your personalised price. We will contact you shortly on WhatsApp with your quote.
    </p>
    <div style="background:${GREEN};border-radius:10px;padding:16px 20px;margin:18px 0;text-align:center;">
      <div style="color:#d9f5d7;font-size:11px;letter-spacing:1px;">YOUR QUOTE REFERENCE</div>
      <div style="color:${YELLOW};font-size:24px;font-weight:bold;letter-spacing:2px;margin-top:4px;">${esc(d.quoteReference)}</div>
    </div>
    ${table(
      row("Pick-up", esc(d.pickup)) +
      row("Drop-off", esc(d.dropoff)) +
      row("Date", esc(d.tripDate) + (d.tripTime ? ` at ${esc(d.tripTime)}` : "")) +
      (d.passengers ? row("Passengers", esc(d.passengers)) : "")
    )}
    <p style="color:#49505a;font-size:13px;line-height:1.7;margin-top:18px;">
      Need it faster? Message us on
      <a href="${contactConfig.whatsappLink}" style="color:${GREEN};font-weight:bold;">WhatsApp</a>
      and mention your reference <strong>${esc(d.quoteReference)}</strong>.
    </p>`;
  return {
    subject: `Your Quote Request ${d.quoteReference} — Taxi Saudi Arabia`,
    html: wrapper("We received your request ✔", body, "You are receiving this email because you requested a quote at taxisaudiarabia.com."),
  };
}

/** To the ADMIN when a new quotation arrives. */
export function adminQuotationEmail(d: QuotationEmailData) {
  const body = `
    <p style="color:#49505a;font-size:14px;">A new quotation request needs pricing:</p>
    ${table(
      row("Reference", `<strong style="color:${GREEN};">${esc(d.quoteReference)}</strong>`) +
      row("Customer", esc(d.customerName)) +
      row("Phone / WhatsApp", `<a href="https://wa.me/${esc(d.customerPhone).replace(/[^0-9]/g, "")}" style="color:${GREEN};">${esc(d.customerPhone)}</a>`) +
      (d.customerEmail ? row("Email", esc(d.customerEmail)) : "") +
      row("Pick-up", esc(d.pickup)) +
      row("Drop-off", esc(d.dropoff)) +
      row("Date", esc(d.tripDate) + (d.tripTime ? ` at ${esc(d.tripTime)}` : "")) +
      (d.passengers ? row("Passengers", esc(d.passengers)) : "")
    )}
    <p style="color:#8a8577;font-size:12px;margin-top:16px;">Action: send the price on WhatsApp, then mark it <strong>quoted</strong> in the admin panel.</p>`;
  return {
    subject: `💰 New Quote Request ${d.quoteReference} — ${d.pickup} → ${d.dropoff}`,
    html: wrapper("New Quotation Request", body, "Internal notification — Taxi Saudi Arabia operations."),
  };
}

// ── Driver application ────────────────────────────────────────────────────────

export type DriverEmailData = {
  name: string;
  phone: string;
  city: string;
  vehicleType: string;
  vehicleDetails?: string | null;
  licenseNumber: string;
  iqamaNumber: string;
  experience?: string | null;
};

/** To the ADMIN when a driver applies. */
export function adminDriverEmail(d: DriverEmailData) {
  const body = `
    <p style="color:#49505a;font-size:14px;">A new chauffeur applied on the partner portal (status: <strong>pending</strong>):</p>
    ${table(
      row("Name", esc(d.name)) +
      row("Phone / WhatsApp", `<a href="https://wa.me/${esc(d.phone).replace(/[^0-9]/g, "")}" style="color:${GREEN};">${esc(d.phone)}</a>`) +
      row("City", esc(d.city)) +
      row("Vehicle", `${esc(d.vehicleType)}${d.vehicleDetails ? " — " + esc(d.vehicleDetails) : ""}`) +
      row("License #", `<code>${esc(d.licenseNumber)}</code>`) +
      row("Iqama #", `<code>${esc(d.iqamaNumber)}</code>`) +
      (d.experience ? row("Experience", esc(d.experience)) : "")
    )}
    <p style="color:#8a8577;font-size:12px;margin-top:16px;">Action: verify documents, then approve or reject in the admin panel.</p>`;
  return {
    subject: `🚕 New Driver Applicant: ${d.name} (${d.city})`,
    html: wrapper("New Driver Application", body, "Internal notification — Taxi Saudi Arabia operations."),
  };
}

// ── Receipt ───────────────────────────────────────────────────────────────────

export type ReceiptEmailData = {
  quoteReference: string;
  customerName: string;
  pickup: string;
  dropoff: string;
  tripDate: string;
  tripTime?: string | null;
  amountPaid: number;
  currency: string;
  paymentMethod: string;
  driverName?: string | null;
  driverPhone?: string | null;
  vehicleLabel?: string | null;
  vehiclePlate?: string | null;
};

/** To the CUSTOMER once a completed ride's receipt PDF is generated. */
export function receiptEmail(d: ReceiptEmailData) {
  const body = `
    <p style="color:#49505a;font-size:14px;line-height:1.7;">
      Dear <strong>${esc(d.customerName)}</strong>,<br/><br/>
      Thank you for traveling with Taxi Saudi Arabia. Please find your receipt attached,
      confirming payment received for your completed trip.
    </p>
    <div style="background:${GREEN};border-radius:10px;padding:16px 20px;margin:18px 0;text-align:center;">
      <div style="color:#d9f5d7;font-size:11px;letter-spacing:1px;">AMOUNT PAID</div>
      <div style="color:${YELLOW};font-size:24px;font-weight:bold;letter-spacing:1px;margin-top:4px;">
        ${d.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${esc(d.currency)}
      </div>
    </div>
    ${table(
      row("Reference", `<strong style="color:${GREEN};">${esc(d.quoteReference)}</strong>`) +
      row("Pick-up", esc(d.pickup)) +
      row("Drop-off", esc(d.dropoff)) +
      row("Date", esc(d.tripDate) + (d.tripTime ? ` at ${esc(d.tripTime)}` : "")) +
      row("Payment Method", esc(d.paymentMethod)) +
      (d.driverName ? row("Driver", esc(d.driverName) + (d.driverPhone ? ` — ${esc(d.driverPhone)}` : "")) : "") +
      (d.vehicleLabel ? row("Vehicle", esc(d.vehicleLabel) + (d.vehiclePlate ? ` — ${esc(d.vehiclePlate)}` : "")) : "")
    )}
    <p style="color:#49505a;font-size:13px;line-height:1.7;margin-top:18px;">
      We hope to welcome you again soon. Questions about this trip? Reach us on
      <a href="${contactConfig.whatsappLink}" style="color:${GREEN};font-weight:bold;">WhatsApp</a>.
    </p>`;
  return {
    subject: `Your Receipt ${d.quoteReference} — Taxi Saudi Arabia`,
    html: wrapper("Thank you for riding with us ✔", body, "You are receiving this email because you completed a trip booked at taxisaudiarabia.com."),
  };
}

// ── Status update ────────────────────────────────────────────────────────────

export type StatusUpdateEmailData = {
  quoteReference: string;
  customerName: string;
  pickup: string;
  dropoff: string;
  tripDate: string;
  tripTime?: string | null;
  status: "quoted" | "confirmed" | "assigned";
  quotedPrice?: number | null;
  currency?: string;
  driverName?: string | null;
  driverPhone?: string | null;
  vehicleLabel?: string | null;
};

const STATUS_COPY: Record<StatusUpdateEmailData["status"], { heading: string; intro: string }> = {
  quoted: {
    heading: "Your Quote is Ready 💰",
    intro: "Here's your price for the trip below. Reply on WhatsApp to confirm your booking.",
  },
  confirmed: {
    heading: "Your Booking is Confirmed ✔",
    intro: "Your trip is confirmed. We'll assign your driver and share their details shortly before pickup.",
  },
  assigned: {
    heading: "Your Driver is Assigned 🚗",
    intro: "Your driver has been assigned for this trip. Details below.",
  },
};

/** To the CUSTOMER every time an admin moves a quotation to quoted / confirmed
 *  / assigned — so there's an email trail even if a WhatsApp follow-up gets
 *  forgotten. Not sent for 'new' (nothing to tell them yet) or 'completed'
 *  (handled separately by receiptEmail) or 'cancelled'. */
export function statusUpdateEmail(d: StatusUpdateEmailData) {
  const copy = STATUS_COPY[d.status];
  const body = `
    <p style="color:#49505a;font-size:14px;line-height:1.7;">
      Dear <strong>${esc(d.customerName)}</strong>,<br/><br/>
      ${copy.intro}
    </p>
    ${table(
      row("Reference", `<strong style="color:${GREEN};">${esc(d.quoteReference)}</strong>`) +
      row("Pick-up", esc(d.pickup)) +
      row("Drop-off", esc(d.dropoff)) +
      row("Date", esc(d.tripDate) + (d.tripTime ? ` at ${esc(d.tripTime)}` : "")) +
      (d.quotedPrice != null ? row("Price", `<strong>${d.quotedPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${esc(d.currency ?? "SAR")}</strong> — payable in cash to the driver`) : "") +
      (d.driverName ? row("Driver", esc(d.driverName) + (d.driverPhone ? ` — ${esc(d.driverPhone)}` : "")) : "") +
      (d.vehicleLabel ? row("Vehicle", esc(d.vehicleLabel)) : "")
    )}
    <p style="color:#49505a;font-size:13px;line-height:1.7;margin-top:18px;">
      Questions? Reach us on <a href="${contactConfig.whatsappLink}" style="color:${GREEN};font-weight:bold;">WhatsApp</a>.
    </p>`;
  return {
    subject: `${copy.heading.replace(/[✔🚗💰]/g, "").trim()} — ${d.quoteReference} — Taxi Saudi Arabia`,
    html: wrapper(copy.heading, body, "You are receiving this email because you have a trip booked at taxisaudiarabia.com."),
  };
}

// ── Contact form ──────────────────────────────────────────────────────────────

export type ContactEmailData = {
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
};

/** To the ADMIN when the contact form is submitted. */
export function adminContactEmail(d: ContactEmailData) {
  const body = `
    ${table(
      row("Name", esc(d.name)) +
      row("Email", `<a href="mailto:${esc(d.email)}" style="color:${GREEN};">${esc(d.email)}</a>`) +
      (d.phone ? row("Phone", esc(d.phone)) : "") +
      (d.service ? row("Service", esc(d.service)) : "")
    )}
    <div style="background:#faf7f0;border-left:3px solid ${GREEN};border-radius:6px;padding:14px 18px;margin-top:16px;color:#121417;font-size:13px;line-height:1.7;">
      ${esc(d.message).replace(/\n/g, "<br/>")}
    </div>`;
  return {
    subject: `📥 Contact: ${d.name}${d.service ? ` — ${d.service}` : ""}`,
    html: wrapper("New Contact Message", body, "Internal notification — Taxi Saudi Arabia operations."),
  };
}

/** Auto-reply to the CUSTOMER after the contact form. */
export function clientContactAutoReply(d: ContactEmailData) {
  const body = `
    <p style="color:#49505a;font-size:14px;line-height:1.7;">
      Dear <strong>${esc(d.name)}</strong>,<br/><br/>
      Thank you for contacting Taxi Saudi Arabia. Your message has been received and a member of
      our team will reply shortly — usually within 15 minutes during business hours.
    </p>
    <p style="color:#49505a;font-size:13px;line-height:1.7;">
      For urgent bookings, message us directly on
      <a href="${contactConfig.whatsappLink}" style="color:${GREEN};font-weight:bold;">WhatsApp ${contactConfig.primaryPhoneDisplay}</a>.
    </p>`;
  return {
    subject: "We received your message — Taxi Saudi Arabia",
    html: wrapper("Thank you for reaching out ✔", body, "You are receiving this email because you contacted taxisaudiarabia.com."),
  };
}
