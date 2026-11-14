// Quotation version history. A version is an immutable record of what the customer-facing quotation said at a point in time
// (price, validity, trip details, template version). New edits ADD a version; nothing is ever overwritten or deleted.
import { prisma } from "@/lib/prisma";
import { getQuotationWithDriver, type QuotationRow } from "@/lib/supabase/quotations";
import { QUOTATION_TEMPLATE_VERSION } from "@/lib/pdf/template-version";

export type VersionSend = { channel: string; template: string; status: "sent" | "failed"; recipient: string | null; error: string | null; at: string };
export type VersionRow = {
  id: string; version_no: number; reason: string; price: number | null; currency: string; valid_until: string | null; template_version: string;
  created_by: string | null; created_at: string; snapshot: Pick<QuotationRow, "pickup_location" | "drop_location" | "trip_date" | "trip_time" | "vehicle_type_requested" | "passengers_count">;
  sends: VersionSend[];
};

const fingerprintOf = (r: QuotationRow) =>
  JSON.stringify([r.quoted_price, r.currency, r.valid_until ?? null, r.customer_name, r.pickup_location, r.drop_location, r.trip_date, r.trip_time, r.return_date ?? null,
    r.trip_type, r.vehicle_type_requested ?? null, r.passengers_count ?? null, r.luggage_notes ?? null, r.price_notes ?? null]);

/**
 * Add a version if (and only if) the customer-facing content differs from the latest version.
 * Returns null when there is nothing to version yet (no price has ever been set).
 */
export async function captureVersion(quotationId: string, reason: string, actor: string): Promise<{ id: string; version_no: number; created: boolean } | null> {
  const { row } = await getQuotationWithDriver(quotationId);
  if (!row) return null;
  const latest = (await prisma.$queryRawUnsafe<{ id: string; version_no: number; fingerprint: string }[]>(
    `SELECT id::text, version_no, fingerprint FROM quotation_versions WHERE quotation_id=$1::uuid ORDER BY version_no DESC LIMIT 1`, quotationId))[0];
  if (!latest && row.quoted_price == null) return null;
  const fp = fingerprintOf(row);
  if (latest && latest.fingerprint === fp) return { id: latest.id, version_no: latest.version_no, created: false };
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const ins = await prisma.$queryRawUnsafe<{ id: string; version_no: number }[]>(
        `INSERT INTO quotation_versions (quotation_id, version_no, reason, price, currency, valid_until, template_version, fingerprint, snapshot, created_by)
         VALUES ($1::uuid, COALESCE((SELECT MAX(version_no) FROM quotation_versions WHERE quotation_id=$1::uuid),0)+1, $2, $3::numeric, $4, $5::date, $6, $7, $8::jsonb, $9)
         RETURNING id::text, version_no`,
        quotationId, latest ? reason : `${reason === "sent" ? "sent" : "created"}`, row.quoted_price, row.currency || "SAR", row.valid_until ?? null,
        QUOTATION_TEMPLATE_VERSION, fp, JSON.stringify(row), actor);
      return { ...ins[0], created: true };
    } catch (e) {
      if (attempt === 1) throw e; // unique(quotation_id, version_no) race: retry once
    }
  }
  return null;
}

/** Never throws — versioning must not break the action that triggered it. */
export async function captureVersionSafe(quotationId: string, reason: string, actor: string) {
  try { return await captureVersion(quotationId, reason, actor); } catch (e) { console.error("captureVersion failed (non-fatal):", e); return null; }
}

export async function listVersions(quotationId: string): Promise<VersionRow[]> {
  const v = await prisma.$queryRawUnsafe<(Omit<VersionRow, "sends">)[]>(
    `SELECT id::text, version_no, reason, price::float, currency, valid_until::text, template_version, created_by, created_at::text,
            jsonb_build_object('pickup_location', snapshot->>'pickup_location', 'drop_location', snapshot->>'drop_location', 'trip_date', snapshot->>'trip_date',
              'trip_time', snapshot->>'trip_time', 'vehicle_type_requested', snapshot->>'vehicle_type_requested', 'passengers_count', snapshot->'passengers_count') snapshot
       FROM quotation_versions WHERE quotation_id=$1::uuid ORDER BY version_no DESC`, quotationId);
  const sends = await prisma.$queryRawUnsafe<(VersionSend & { quotation_version_id: string })[]>(
    `SELECT quotation_version_id::text, channel, template, status, recipient, error, created_at::text "at"
       FROM communication_log WHERE quotation_id=$1::uuid AND quotation_version_id IS NOT NULL AND template IN ('quotation','followup') ORDER BY created_at`, quotationId);
  return v.map((x) => ({ ...x, sends: sends.filter((s) => s.quotation_version_id === x.id) }));
}
