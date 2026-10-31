// Receipts centre data. Everything is read from real records: documents (issued receipts), quotations and communication_log.
// "Sent" is only claimed when communication_log holds a successful send, or the operator recorded a WhatsApp send.
import { prisma } from "@/lib/prisma";

export type ReceiptRow = {
  doc_id: string | null; // null = ride is paid but no receipt issued yet
  number: string | null;
  quotation_id: string;
  quote_reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  pickup_location: string;
  drop_location: string;
  trip_date: string;
  amount: number | null;
  currency: string;
  review_invited_at: string | null; // when a Trustpilot request was sent / recorded
  issued_at: string | null;
  payment_method: string | null;
  email_status: "sent" | "failed" | null; // latest receipt email attempt
  email_manual: boolean; // sent status is operator-attested ("already sent"), not provider-confirmed
  email_at: string | null;
  wa_sent_at: string | null; // operator recorded a WhatsApp send
};

export async function getReceiptCenter(): Promise<{ ready: ReceiptRow[]; issued: ReceiptRow[] }> {
  const comm = `
    (SELECT status FROM communication_log c WHERE c.quotation_id=q.id AND c.template='receipt' AND c.channel IN ('email','email_manual') ORDER BY c.created_at DESC LIMIT 1) email_status,
    EXISTS (SELECT 1 FROM communication_log c WHERE c.quotation_id=q.id AND c.template='receipt' AND c.channel='email_manual' AND c.status='sent'
            AND NOT EXISTS (SELECT 1 FROM communication_log c2 WHERE c2.quotation_id=q.id AND c2.template='receipt' AND c2.channel='email' AND c2.status='sent')) email_manual,
    (SELECT created_at::text FROM communication_log c WHERE c.quotation_id=q.id AND c.template='receipt' AND c.channel IN ('email','email_manual') AND c.status='sent' ORDER BY c.created_at DESC LIMIT 1) email_at,
    (SELECT created_at::text FROM communication_log c WHERE c.quotation_id=q.id AND c.template='receipt' AND c.channel='whatsapp' AND c.status='sent' ORDER BY c.created_at DESC LIMIT 1) wa_sent_at`;
  const base = `q.id::text quotation_id, q.quote_reference, q.customer_name, q.customer_phone, q.customer_email, q.pickup_location, q.drop_location,
    q.trip_date::text, q.payment_method_used payment_method, COALESCE(q.currency,'SAR') currency, q.review_invited_at::text review_invited_at, ${comm}`;

  const [issued, ready] = await Promise.all([
    prisma.$queryRawUnsafe<ReceiptRow[]>(
      `SELECT d.id::text doc_id, d.number, d.amount::float, d.created_at::text issued_at, ${base}
         FROM documents d JOIN quotations q ON q.id=d.quotation_id
        WHERE d.kind='receipt' AND NOT q.is_test ORDER BY d.created_at DESC LIMIT 300`),
    prisma.$queryRawUnsafe<ReceiptRow[]>(
      `SELECT NULL::text doc_id, NULL::text number, q.actual_amount_paid::float amount, NULL::text issued_at, ${base}
         FROM quotations q
        WHERE NOT q.is_test AND q.status='completed' AND q.payment_status='paid' AND COALESCE(q.actual_amount_paid,0) > 0
          AND NOT EXISTS (SELECT 1 FROM documents d WHERE d.quotation_id=q.id AND d.kind='receipt')
        ORDER BY q.trip_date DESC`),
  ]);
  return { ready, issued };
}
