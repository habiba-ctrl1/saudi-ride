import { contactConfig } from "@/lib/config/contact";

/**
 * Structured WhatsApp prefill builder — single source of truth for the
 * From/To/Date & time/Passengers & luggage/Vehicle bulleted format that the
 * site standardised on (CLAUDE.md G4). Pass a context-aware intro line plus any
 * fields already known from the page (e.g. a route's origin/destination) so the
 * message arrives partly filled and never reads as a generic "I want a taxi".
 *
 * Never changes the number or encoding — just composes the body text.
 */
export interface WhatsAppPrefill {
  /** One-line, page-specific opener, e.g. "I'd like a quote for a private
   *  transfer from Riyadh to Jeddah." */
  intro: string;
  /** Pre-known fields are shown filled; the rest render as blank prompts the
   *  customer completes. Omit a key entirely to drop that line. */
  from?: string;
  to?: string;
  dateTime?: string;
  passengers?: string;
  vehicle?: string;
  /** Replace the default field set with a bespoke ordered list when the
   *  standard five don't fit (e.g. event pages). */
  fields?: { label: string; value?: string }[];
}

const DEFAULT_LABELS: { key: keyof WhatsAppPrefill; label: string }[] = [
  { key: "from", label: "From" },
  { key: "to", label: "To" },
  { key: "dateTime", label: "Date & time" },
  { key: "passengers", label: "Passengers & luggage" },
  { key: "vehicle", label: "Vehicle (Sedan / SUV / Van)" },
];

export function buildWhatsAppMessage(prefill: WhatsAppPrefill): string {
  const lines: string[] = [prefill.intro, ""];

  if (prefill.fields) {
    for (const f of prefill.fields) lines.push(`• ${f.label}: ${f.value ?? ""}`);
  } else {
    for (const { key, label } of DEFAULT_LABELS) {
      const value = prefill[key] as string | undefined;
      lines.push(`• ${label}: ${value ?? ""}`);
    }
  }

  return lines.join("\n");
}

/** Full wa.me URL with a structured, encoded prefill. */
export function buildWhatsAppUrl(
  prefill: WhatsAppPrefill,
  number: string = contactConfig.whatsappNumber,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsAppMessage(prefill))}`;
}
