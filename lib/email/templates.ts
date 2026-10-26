// Branded HTML email templates — Taxi Saudi Arabia (green #16A34A / yellow #FACC15).
// Same look as the customer PDFs (logo header band, grey cards, green total box, yellow payment card).
// Admin templates go to ADMIN_EMAIL; client templates go to the customer.
// All senders go through sendEmail() / sendEmailStrict() in lib/notifications.ts, which attach the logo
// inline (cid:tsa-logo) whenever the HTML references it — mail clients block remote/data-URI logos.

import { contactConfig } from "@/lib/config/contact";

const GREEN = "#16A34A";
const YELLOW = "#FACC15";
const INK = "#111827";
const MUTED = "#6B7280";
const LINE = "#E5E7EB";
const SOFT = "#F9FAFB";
const FONT = "'Segoe UI',Tahoma,Arial,Helvetica,sans-serif";

export const LOGO_CID = "tsa-logo";

export type WrapperOptions = {
  /** Big label in the header, e.g. "QUOTATION" / "RECEIPT". */
  docTitle?: string;
  /** Arabic line under the doc title. */
  docTitleAr?: string;
  /** Small yellow pill under the doc title, e.g. "Payment Received". */
  badge?: string;
};

export function wrapper(title: string, body: string, footerNote: string, opts: WrapperOptions = {}) {
  const right = opts.docTitle
    ? `<td align="right" valign="middle" style="padding:18px 24px 18px 0;">
         <div style="font-size:20px;font-weight:800;letter-spacing:2px;color:#ffffff;">${opts.docTitle}</div>
         ${opts.docTitleAr ? `<div dir="rtl" style="font-size:12px;color:#EAFBE9;margin-top:2px;">${opts.docTitleAr}</div>` : ""}
         ${opts.badge ? `<div style="margin-top:8px;"><span style="display:inline-block;background:${YELLOW};color:#111111;font-size:11px;font-weight:700;padding:4px 10px;border-radius:5px;">${opts.badge}</span></div>` : ""}
       </td>`
    : "";
  return `
  <div style="background:#eef2ef;padding:24px 10px;font-family:${FONT};color:${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${LINE};">
      <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${GREEN};">
          <tr>
            <td valign="middle" style="padding:16px 12px 16px 24px;" width="1">
              <img src="cid:${LOGO_CID}" alt="TSA" width="78" height="53" style="display:block;border:0;height:auto;" />
            </td>
            <td valign="middle" style="padding:16px 12px 16px 0;">
              <div style="font-size:20px;font-weight:800;color:${YELLOW};letter-spacing:0.3px;line-height:1.15;">Taxi Saudi Arabia</div>
              <div style="font-size:10px;color:#EAFBE9;letter-spacing:1.4px;text-transform:uppercase;margin-top:4px;">Premium Chauffeur &amp; Transportation</div>
              <div style="font-size:11px;color:#D9F5D7;margin-top:4px;">www.taxisaudiarabia.com &nbsp;|&nbsp; Booking via WhatsApp</div>
            </td>
            ${right}
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding:26px 24px 8px;">
        <h2 style="margin:0 0 14px;color:${INK};font-size:20px;font-weight:700;">${title}</h2>
        ${body}
      </td></tr>
      <tr><td style="padding:8px 24px 22px;">
        <div style="border-top:1px solid ${LINE};padding-top:12px;font-size:11px;color:${MUTED};line-height:1.7;">
          ${footerNote}<br/>
          WhatsApp: <a href="${contactConfig.whatsappLink}" style="color:${GREEN};text-decoration:none;font-weight:600;">${contactConfig.primaryPhoneDisplay}</a>
          &nbsp;|&nbsp; Email: <a href="${contactConfig.emailLink}" style="color:${GREEN};text-decoration:none;">${contactConfig.email}</a><br/>
          <span dir="rtl" style="color:${MUTED};">تاكسي السعودية — إدارة وتنظيم النقل الخاص</span>
        </div>
      </td></tr>
    </table>
  </div>`;
}

/** One label/value line inside a card. */
export function row(label: string, value: string) {
  return `<tr>
    <td style="padding:4px 0;color:${MUTED};width:130px;vertical-align:top;font-size:13px;">${label}</td>
    <td style="padding:4px 0;color:${INK};font-size:13px;">${value}</td>
  </tr>`;
}

/** Grey rounded card holding label/value rows. */
export function table(rows: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};border:1px solid ${LINE};border-radius:10px;"><tr><td style="padding:12px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr></table>`;
}

/** Card with a small green heading (e.g. SERVICE PROVIDER / CLIENT). */
export function card(heading: string, rows: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};border:1px solid ${LINE};border-radius:10px;margin-bottom:12px;"><tr><td style="padding:12px 16px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:${GREEN};margin-bottom:6px;">${heading}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr></table>`;
}

/** Service / Dates / Route strip, like the PDF. Stacks gracefully because each cell is a block-level table cell. */
export function strip(service: string, dates: string, route: string) {
  const cell = (k: string, v: string, left: boolean) => `<td valign="top" style="padding:10px 14px;${left ? `border-left:1px solid ${LINE};` : ""}">
      <div style="font-size:10px;color:${MUTED};text-transform:uppercase;letter-spacing:0.4px;">${k}</div>
      <div style="font-size:13px;font-weight:600;color:${INK};margin-top:3px;">${v}</div></td>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:10px;margin-bottom:12px;"><tr>
    ${cell("Service", service, false)}${cell("Dates", dates, true)}${cell("Route", route, true)}</tr></table>`;
}

/** Green total box — the "Total (cash)" / "Amount Paid" bar of the PDFs. */
export function totalBox(label: string, value: string, sub?: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0;"><tr><td style="background:${GREEN};border-radius:10px;padding:14px 18px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:15px;font-weight:700;color:#ffffff;">${label}</td>
      <td align="right" style="font-size:17px;font-weight:800;color:${YELLOW};">${value}</td></tr></table>
    ${sub ? `<div style="font-size:11px;color:#D9F5D7;margin-top:4px;">${sub}</div>` : ""}
  </td></tr></table>`;
}

/** Yellow payment card. */
export function payCard(rows: string, after?: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFDF3;border:1px solid ${YELLOW};border-radius:10px;margin:12px 0;"><tr><td style="padding:12px 16px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#B45309;margin-bottom:6px;">Payment</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    ${after ? `<div style="font-size:12px;color:#B45309;margin-top:8px;">${after}</div>` : ""}</td></tr></table>`;
}

export function termsList(items: string[]) {
  return `<div style="margin-top:14px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:${GREEN};margin-bottom:6px;">Terms</div>
    <ul style="margin:0;padding-left:18px;font-size:12px;color:${MUTED};line-height:1.8;">${items.map((t) => `<li>${t}</li>`).join("")}</ul></div>`;
}

/** Call-to-action button (bulletproof-ish: a padded link). */
export function cta(label: string, href: string, kind: "green" | "yellow" = "green") {
  const bg = kind === "green" ? GREEN : YELLOW;
  const fg = kind === "green" ? "#ffffff" : "#111111";
  return `<a href="${href}" style="display:inline-block;background:${bg};color:${fg};text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;">${label}</a>`;
}

export function para(html: string) {
  return `<p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 12px;">${html}</p>`;
}

export function esc(s: unknown): string {
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
  /** Set for receipts that are one of several payments: shows the trip total and what has been received to date. */
  running?: { total: number | null; paidToDate: number; paymentNo: number } | null;
  /** Set when the payment does not settle the fare: shows "amount received" and the remaining balance instead of "paid". */
  partial?: { balance: number | null } | null;
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
  /** When set, adds a "Leave us a review" button — sent in the same email so
   *  the review ask is automatic and doesn't need a separate follow-up. */
  reviewUrl?: string | null;
};

/** To the CUSTOMER once a completed ride's receipt PDF is generated. */
export function receiptEmail(d: ReceiptEmailData) {
  const amt = `${esc(d.currency)} ${Number.isInteger(d.amountPaid) ? d.amountPaid.toLocaleString("en-US") : d.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const bal = d.partial?.balance;
  const balTxt = bal != null ? `${esc(d.currency)} ${bal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null;
  const when = esc(d.tripDate) + (d.tripTime ? ` — ${esc(d.tripTime.slice(0, 5))}` : "");
  const body =
    para(`Dear <strong>${esc(d.customerName)}</strong>,`) +
    para(`Thank you for travelling with Taxi Saudi Arabia. Please find your receipt attached, ${d.partial ? "confirming the part payment we received for your booking." : "confirming payment received for your completed trip."}`) +
    strip("Private transfer", when, `${esc(d.pickup)}<br/><span style="color:${GREEN};">→</span> ${esc(d.dropoff)}`) +
    table(
      row("Reference", `<strong style="color:${GREEN};">${esc(d.quoteReference)}</strong>`) +
      (d.driverName ? row("Driver", esc(d.driverName) + (d.driverPhone ? ` — ${esc(d.driverPhone)}` : "")) : "") +
      (d.vehicleLabel ? row("Vehicle", esc(d.vehicleLabel) + (d.vehiclePlate ? ` — ${esc(d.vehiclePlate)}` : "")) : ""),
    ) +
    totalBox(d.partial || (d.running && d.running.paymentNo > 1) ? "Amount Received" : "Amount Paid", amt) +
    payCard(
      row("Method", esc(d.paymentMethod)) + row("Status", d.partial ? "Part payment" : "Received in full") +
      (d.running && (d.partial || d.running.paymentNo > 1) ? (d.running.total != null ? row("Trip total", `${esc(d.currency)} ${d.running.total.toLocaleString("en-US")}`) : "") + row("Received to date", `${esc(d.currency)} ${d.running.paidToDate.toLocaleString("en-US")}`) : "") +
      (balTxt ? row("Balance remaining", `<strong>${balTxt}</strong>`) : ""),
      d.partial ? (balTxt ? `Part payment received — a balance of ${balTxt} remains payable.` : "Part payment received.") : "Payment for this transfer has been received in full. No balance is due.",
    ) +
    para("We hope to welcome you again soon. Questions about this trip? Reach us on WhatsApp.") +
    `<p style="margin:14px 0 4px;">${cta("Message us on WhatsApp", contactConfig.whatsappLink, "yellow")}</p>` +
    (d.reviewUrl ? `<div style="margin:22px 0 4px;padding:16px;border:1px solid ${LINE};border-radius:10px;background:${SOFT};text-align:center;">
      <div style="color:#374151;font-size:13px;margin-bottom:10px;">Enjoyed the ride? A quick review helps us a lot:</div>${cta("Leave us a review", d.reviewUrl)}</div>` : "");
  return {
    subject: `Your Receipt ${d.quoteReference} — Taxi Saudi Arabia`,
    html: wrapper(d.partial ? "Part payment received" : "Thank you for riding with us", body, "You are receiving this email because you completed a trip booked at taxisaudiarabia.com.", {
      docTitle: "RECEIPT", docTitleAr: "إيصال دفع", badge: d.partial ? "Part Payment Received" : "Payment Received",
    }),
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
