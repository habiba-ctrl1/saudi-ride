// ZATCA e-invoicing helper — Saudi VAT compliance (15%)
// Generates QR code payload and submits to ZATCA API.

import crypto from "crypto";

export interface ZATCALineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

export interface ZATCAInvoice {
  invoiceNumber: string;
  sellerName: string;
  sellerVATNumber: string;
  buyerName: string;
  invoiceDate: string;
  lineItems: ZATCALineItem[];
  totalExcludingVAT: number;
  totalVAT: number;
  totalIncludingVAT: number;
}

interface BookingForInvoice {
  id: string;
  bookingRef: string;
  customerName: string;
  pickupLocation: string;
  dropoffLocation: string;
  serviceType?: string | null;
  baseFare?: number | null;
  discountAmount?: number | null;
  vatAmount?: number | null;
  totalPrice: number;
}

interface PaymentForInvoice {
  id: string;
}

/**
 * Build a ZATCA-compliant invoice object for a completed booking.
 */
export function buildZATCAInvoice(
  booking: BookingForInvoice,
  payment: PaymentForInvoice
): ZATCAInvoice {
  const baseFare = booking.baseFare ?? booking.totalPrice / 1.15;
  const discount = booking.discountAmount ?? 0;
  const subtotal = baseFare - discount;
  const vatAmount = booking.vatAmount ?? Math.round(subtotal * 0.15 * 100) / 100;
  const total = subtotal + vatAmount;

  const serviceLabel = booking.serviceType
    ? booking.serviceType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    : "Transfer";

  return {
    invoiceNumber: `RLT-INV-${payment.id}`,
    sellerName: "Riyadh Luxe Transportation Co.",
    sellerVATNumber: process.env.ZATCA_VAT_NUMBER ?? "300000000000003",
    buyerName: booking.customerName,
    invoiceDate: new Date().toISOString(),
    lineItems: [
      {
        description: `${serviceLabel} — ${booking.pickupLocation} to ${booking.dropoffLocation}`,
        quantity: 1,
        unitPrice: subtotal,
        vatRate: 0.15,
        vatAmount,
        total,
      },
    ],
    totalExcludingVAT: subtotal,
    totalVAT: vatAmount,
    totalIncludingVAT: total,
  };
}

/**
 * Generate the TLV QR code payload required by ZATCA Phase 1.
 * Returns a Base64-encoded string.
 */
export function generateZATCAQR(invoice: ZATCAInvoice): string {
  function tlv(tag: number, value: string): Buffer {
    const valueBytes = Buffer.from(value, "utf8");
    return Buffer.concat([
      Buffer.from([tag]),
      Buffer.from([valueBytes.length]),
      valueBytes,
    ]);
  }

  const payload = Buffer.concat([
    tlv(1, invoice.sellerName),
    tlv(2, invoice.sellerVATNumber),
    tlv(3, invoice.invoiceDate),
    tlv(4, invoice.totalIncludingVAT.toFixed(2)),
    tlv(5, invoice.totalVAT.toFixed(2)),
  ]);

  return payload.toString("base64");
}

/**
 * Submit the invoice to the ZATCA reporting API.
 * In production, replace with the real ZATCA API call.
 * Returns the ZATCA invoice ID on success.
 */
export async function submitToZATCA(invoice: ZATCAInvoice): Promise<string | null> {
  const zatcaApiUrl = process.env.ZATCA_API_URL;
  const zatcaCert = process.env.ZATCA_CERTIFICATE;

  if (!zatcaApiUrl || !zatcaCert) {
    // Not configured — log and return a simulated ID
    console.log(`[ZATCA SIMULATION] Invoice ${invoice.invoiceNumber} would be submitted.`);
    return `ZATCA-SIM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }

  try {
    const res = await fetch(zatcaApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${zatcaCert}`,
      },
      body: JSON.stringify(invoice),
    });

    if (!res.ok) {
      console.error(`[ZATCA] Submission failed: ${res.status} ${await res.text()}`);
      return null;
    }

    const data = await res.json();
    return data.invoiceId ?? invoice.invoiceNumber;
  } catch (err) {
    console.error("[ZATCA] Network error:", err);
    return null;
  }
}

/**
 * One-shot helper: build invoice, generate QR, submit.
 */
export async function generateAndSubmitInvoice(
  booking: BookingForInvoice,
  payment: PaymentForInvoice
): Promise<{ invoice: ZATCAInvoice; qrCode: string; zatcaId: string | null }> {
  const invoice = buildZATCAInvoice(booking, payment);
  const qrCode = generateZATCAQR(invoice);
  const zatcaId = await submitToZATCA(invoice);
  return { invoice, qrCode, zatcaId };
}
