// Operator-triggered communications. Every attempt (sent OR failed) is written to communication_log,
// so the UI can show "Sent ✓" or "Email failed — Retry" and nothing fails silently.
import { prisma } from "@/lib/prisma";
import { getQuotationWithDriver } from "@/lib/supabase/quotations";
import { sendEmailStrict } from "@/lib/notifications";
import { renderInvoicePdf } from "@/lib/pdf/invoice";
import { opsEmail, type OpsTemplate } from "@/lib/email/ops-templates";
import { issueReceipt, latestPaymentId, type ReceiptInfo } from "@/lib/ops/payments";
import { captureVersionSafe } from "@/lib/ops/versions";

/** Internal record copy of every client email. */
export const INTERNAL_BCC = process.env.QUOTE_BCC_EMAIL || "info@taxisaudiarabia.com";

export type CommRow = {
  id: string;
  channel: string;
  template: string;
  recipient: string | null;
  bcc: string | null;
  subject: string | null;
  status: "sent" | "failed";
  error: string | null;
  created_at: string;
};

export async function listComms(quotationId: string): Promise<CommRow[]> {
  return prisma.$queryRawUnsafe<CommRow[]>(
    `SELECT id::text, channel, template, recipient, bcc, subject, status, error, created_at::text
       FROM communication_log WHERE quotation_id=$1::uuid ORDER BY created_at DESC LIMIT 50`,
    quotationId,
  );
}

async function log(quotationId: string, e: { versionId?: string | null; channel: string; template: string; recipient: string | null; bcc?: string | null; subject?: string | null; status: "sent" | "failed"; error?: string | null }) {
  await prisma.$executeRawUnsafe(
    `INSERT INTO communication_log (quotation_id, channel, template, recipient, bcc, subject, status, error, quotation_version_id) VALUES ($1::uuid,$2,$3,$4,$5,$6,$7,$8,$9::uuid)`,
    quotationId, e.channel, e.template, e.recipient, e.bcc ?? null, e.subject ?? null, e.status, e.error ?? null, e.versionId ?? null,
  );
}

/** Stage side-effects of a successful quotation/follow-up send (never downgrade an accepted/rejected quote). */
async function markSent(quotationId: string, template: OpsTemplate, via: "email" | "whatsapp") {
  if (template === "quotation") {
    await prisma.$executeRawUnsafe(
      `UPDATE quotations SET sent_at=COALESCE(sent_at, now()), sent_via=$2,
         quote_stage = CASE WHEN quote_stage IN ('draft','ready','expired') THEN 'sent' ELSE quote_stage END
       WHERE id=$1::uuid`, quotationId, via);
  } else if (template === "receipt") {
    await prisma.$executeRawUnsafe(`UPDATE quotations SET receipt_sent_at=now(), review_invited_at=COALESCE(review_invited_at, CASE WHEN $2='email' THEN now() END) WHERE id=$1::uuid`, quotationId, via);
  } else if (template === "followup") {
    await prisma.$executeRawUnsafe(
      `UPDATE quotations SET followup_at=now(), followup_flagged=false,
         quote_stage = CASE WHEN quote_stage IN ('sent','expired') THEN 'follow_up' ELSE quote_stage END
       WHERE id=$1::uuid`, quotationId);
  }
}

export type SendResult = { ok: true; recipient: string; bcc: string } | { ok: false; error: string };

export async function sendOpsEmail(quotationId: string, template: OpsTemplate): Promise<SendResult> {
  const { row, error } = await getQuotationWithDriver(quotationId);
  if (error || !row) return { ok: false, error: error ?? "Quotation not found" };
  if (!row.customer_email) return { ok: false, error: "This client has no email address — add one first" };
  if ((template === "quotation" || template === "followup") && row.quoted_price == null) {
    return { ok: false, error: "Set a price before sending a quotation" };
  }

  let receiptInfo: ReceiptInfo | null = null;
  let receiptSnap: Awaited<ReturnType<typeof issueReceipt>>["snapshot"] | null = null;
  if (template === "receipt") {
    if (!(await latestPaymentId(quotationId))) return { ok: false, error: "Record a payment first — a receipt can only be sent for a payment that was actually received" };
    try {
      // Reuse the issued (frozen) receipt for the latest payment; otherwise issue it now so what is emailed is what is saved.
      const issued = await issueReceipt(quotationId, null, { reuse: true });
      receiptInfo = issued.info;
      receiptSnap = issued.snapshot;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Could not prepare the receipt" };
    }
  }
  // The quotation the customer is about to receive is frozen as a version first, so this send can be traced to it.
  const versionId = template === "quotation" || template === "followup" ? (await captureVersionSafe(quotationId, "sent", "operator"))?.id ?? null : null;
  const { subject, html, attachQuotationPdf } = opsEmail(template, row, receiptInfo);
  let attachments: { filename: string; content: Buffer }[] | undefined;
  try {
    if (attachQuotationPdf) attachments = [{ filename: `quotation-${row.quote_reference}.pdf`, content: await renderInvoicePdf(row, "quotation") }];
    if (template === "receipt" && receiptSnap) {
      attachments = [{ filename: `receipt-${row.quote_reference}.pdf`, content: await renderInvoicePdf(receiptSnap, "receipt", receiptInfo) }];
    }
  } catch (e) {
    const msg = `PDF generation failed: ${e instanceof Error ? e.message : String(e)}`;
    await log(quotationId, { versionId, channel: "email", template, recipient: row.customer_email, bcc: INTERNAL_BCC, subject, status: "failed", error: msg });
    return { ok: false, error: msg };
  }

  const bccList = template === "receipt" && process.env.TRUSTPILOT_INVITE_EMAIL ? [INTERNAL_BCC, process.env.TRUSTPILOT_INVITE_EMAIL] : [INTERNAL_BCC];
  const res = await sendEmailStrict(row.customer_email, subject, html, { bcc: bccList, attachments });
  if (!res.ok) {
    await log(quotationId, { versionId, channel: "email", template, recipient: row.customer_email, bcc: INTERNAL_BCC, subject, status: "failed", error: res.error });
    return { ok: false, error: res.error };
  }
  await log(quotationId, { versionId, channel: "email", template, recipient: row.customer_email, bcc: bccList.join(", "), subject, status: "sent" });
  await markSent(quotationId, template, "email");
  return { ok: true, recipient: row.customer_email, bcc: INTERNAL_BCC };
}

/** Operator sent it themselves through WhatsApp — record it (we cannot see WhatsApp, so this is operator-attested). */
export async function recordWhatsAppSent(quotationId: string, template: OpsTemplate): Promise<{ ok: boolean; error?: string }> {
  const { row, error } = await getQuotationWithDriver(quotationId);
  if (error || !row) return { ok: false, error: error ?? "Quotation not found" };
  const versionId = template === "quotation" || template === "followup" ? (await captureVersionSafe(quotationId, "sent", "operator"))?.id ?? null : null;
  await log(quotationId, { versionId, channel: "whatsapp", template, recipient: row.customer_phone, status: "sent", subject: "Marked as sent manually on WhatsApp" });
  await markSent(quotationId, template, "whatsapp");
  return { ok: true };
}
