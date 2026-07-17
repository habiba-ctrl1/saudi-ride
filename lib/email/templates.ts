// Branded HTML email templates — Taxi Saudi Arabia (gold #C9A84C on dark).
// Admin templates go to ADMIN_EMAIL; client templates go to the customer.
// All senders go through sendEmail() in lib/notifications.ts.

import { contactConfig } from "@/lib/config/contact";

const GOLD = "#C9A84C";
const DARK = "#0A0A0A";

function wrapper(title: string, body: string, footerNote: string) {
  return `
  <div style="background:#f4f1ea;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5ddc9;">
      <div style="background:${DARK};padding:22px 28px;">
        <span style="color:${GOLD};font-size:18px;font-weight:bold;letter-spacing:2px;">TAXI SAUDI ARABIA</span>
        <div style="color:#A1A1A6;font-size:11px;margin-top:4px;letter-spacing:1px;">PREMIUM CHAUFFEUR NETWORK — KSA</div>
      </div>
      <div style="padding:28px;">
        <h2 style="margin:0 0 14px;color:#121417;font-size:19px;">${title}</h2>
        ${body}
      </div>
      <div style="background:#faf7f0;border-top:1px solid #eee5d0;padding:16px 28px;font-size:11px;color:#8a8577;line-height:1.6;">
        ${footerNote}<br/>
        WhatsApp: <a href="${contactConfig.whatsappLink}" style="color:${GOLD};">${contactConfig.primaryPhoneDisplay}</a>
        &nbsp;|&nbsp; Email: <a href="${contactConfig.emailLink}" style="color:${GOLD};">${contactConfig.email}</a>
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
  return `<table style="width:100%;border-collapse:collapse;background:#faf7f0;border-radius:10px;padding:6px;">${rows}</table>`;
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
    <div style="background:${DARK};border-radius:10px;padding:16px 20px;margin:18px 0;text-align:center;">
      <div style="color:#A1A1A6;font-size:11px;letter-spacing:1px;">YOUR QUOTE REFERENCE</div>
      <div style="color:${GOLD};font-size:24px;font-weight:bold;letter-spacing:2px;margin-top:4px;">${esc(d.quoteReference)}</div>
    </div>
    ${table(
      row("Pick-up", esc(d.pickup)) +
      row("Drop-off", esc(d.dropoff)) +
      row("Date", esc(d.tripDate) + (d.tripTime ? ` at ${esc(d.tripTime)}` : "")) +
      (d.passengers ? row("Passengers", esc(d.passengers)) : "")
    )}
    <p style="color:#49505a;font-size:13px;line-height:1.7;margin-top:18px;">
      Need it faster? Message us on
      <a href="${contactConfig.whatsappLink}" style="color:${GOLD};font-weight:bold;">WhatsApp</a>
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
      row("Reference", `<strong style="color:${GOLD};">${esc(d.quoteReference)}</strong>`) +
      row("Customer", esc(d.customerName)) +
      row("Phone / WhatsApp", `<a href="https://wa.me/${esc(d.customerPhone).replace(/[^0-9]/g, "")}" style="color:${GOLD};">${esc(d.customerPhone)}</a>`) +
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
      row("Phone / WhatsApp", `<a href="https://wa.me/${esc(d.phone).replace(/[^0-9]/g, "")}" style="color:${GOLD};">${esc(d.phone)}</a>`) +
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
      row("Email", `<a href="mailto:${esc(d.email)}" style="color:${GOLD};">${esc(d.email)}</a>`) +
      (d.phone ? row("Phone", esc(d.phone)) : "") +
      (d.service ? row("Service", esc(d.service)) : "")
    )}
    <div style="background:#faf7f0;border-left:3px solid ${GOLD};border-radius:6px;padding:14px 18px;margin-top:16px;color:#121417;font-size:13px;line-height:1.7;">
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
      <a href="${contactConfig.whatsappLink}" style="color:${GOLD};font-weight:bold;">WhatsApp ${contactConfig.primaryPhoneDisplay}</a>.
    </p>`;
  return {
    subject: "We received your message — Taxi Saudi Arabia",
    html: wrapper("Thank you for reaching out ✔", body, "You are receiving this email because you contacted taxisaudiarabia.com."),
  };
}
