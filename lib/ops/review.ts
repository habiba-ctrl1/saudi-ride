// Needs Review queue. A flag means "the record does not prove its own status" — it never changes the booking.
// The operator decides each one (complete / cancel / keep active / note). A resolved flag is never re-raised (unique per booking+rule).
import { prisma } from "@/lib/prisma";
import { logEvent } from "@/lib/ops/events";

import type { ReviewItem, ReviewRule } from "@/lib/ops/review-constants";
import { REVIEW_RULES } from "@/lib/ops/review-constants";
export * from "@/lib/ops/review-constants";

const KSA_TODAY = `(now() AT TIME ZONE 'Asia/Riyadh')::date`;

export async function scanForReview(): Promise<{ raised: number }> {
  const sqls = [
    // 1) ride date has passed, booking still confirmed/assigned: we cannot tell if it happened
    `INSERT INTO review_flags (quotation_id, rule, detail)
     SELECT q.id, 'past_open', 'Trip date ' || GREATEST(q.trip_date, COALESCE(q.return_date, q.trip_date))::text || ' has passed but the booking is still "' || q.status::text || '". Nothing in the record proves it happened or was cancelled.'
       FROM quotations q WHERE NOT q.is_test AND q.status::text IN ('confirmed','assigned') AND GREATEST(q.trip_date, COALESCE(q.return_date, q.trip_date)) < ${KSA_TODAY}
     ON CONFLICT (quotation_id, rule) DO NOTHING`,
    // 2) completed, no money recorded, and not an explicit zero write-off
    `INSERT INTO review_flags (quotation_id, rule, detail)
     SELECT q.id, 'completed_no_payment', 'Marked completed but no payment is recorded and it was not settled as a zero-collection write-off.'
       FROM quotations q WHERE NOT q.is_test AND q.status::text = 'completed' AND q.actual_amount_paid IS NULL
        AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.quotation_id = q.id AND p.voided_at IS NULL)
     ON CONFLICT (quotation_id, rule) DO NOTHING`,
    // 3) a booking with no agreed fare
    `INSERT INTO review_flags (quotation_id, rule, detail)
     SELECT q.id, 'confirmed_no_price', 'Booking is "' || q.status::text || '" but no fare has been set.'
       FROM quotations q WHERE NOT q.is_test AND q.status::text IN ('confirmed','assigned') AND q.quoted_price IS NULL
     ON CONFLICT (quotation_id, rule) DO NOTHING`,
    // 4) same phone + same date + same pickup, both still active
    `INSERT INTO review_flags (quotation_id, rule, detail)
     SELECT a.id, 'possible_duplicate', 'Same phone, date and pickup as ' || b.quote_reference || ' (' || b.status::text || '). Check whether this is a duplicate.'
       FROM quotations a JOIN quotations b ON a.id <> b.id
        AND regexp_replace(COALESCE(a.customer_phone,''),'[^0-9+]','','g') = regexp_replace(COALESCE(b.customer_phone,''),'[^0-9+]','','g')
        AND COALESCE(a.customer_phone,'') <> '' AND a.trip_date = b.trip_date AND lower(trim(a.pickup_location)) = lower(trim(b.pickup_location))
      WHERE NOT a.is_test AND NOT b.is_test AND a.status::text <> 'cancelled' AND b.status::text <> 'cancelled'
     ON CONFLICT (quotation_id, rule) DO NOTHING`,
  ];
  let raised = 0;
  for (const s of sqls) raised += Number(await prisma.$executeRawUnsafe(s));
  return { raised };
}

export async function openReviewCount(): Promise<number> {
  try {
    return (await prisma.$queryRawUnsafe<{ n: number }[]>(`SELECT count(*)::int n FROM review_flags WHERE status='open'`))[0]?.n ?? 0;
  } catch { return 0; }
}

export async function listOpenReview(): Promise<ReviewItem[]> {
  return prisma.$queryRawUnsafe<ReviewItem[]>(
    `SELECT f.id::text, f.rule, f.detail, f.created_at::text, q.id::text quotation_id, q.quote_reference, q.customer_name, q.customer_phone, q.status::text status,
            q.trip_date::text, q.trip_time::text, q.pickup_location, q.drop_location, q.quoted_price::float, q.payment_status::text payment_status,
            (q.partner_id IS NOT NULL OR q.driver_name IS NOT NULL OR q.assigned_driver_id IS NOT NULL) has_driver,
            EXISTS (SELECT 1 FROM communication_log c WHERE c.quotation_id=q.id AND c.template='pickup' AND c.status='sent') pickup_details_sent,
            EXISTS (SELECT 1 FROM payments p WHERE p.quotation_id=q.id AND p.voided_at IS NULL) payment_recorded
       FROM review_flags f JOIN quotations q ON q.id = f.quotation_id
      WHERE f.status='open' ORDER BY q.trip_date, f.created_at`);
}

export async function resolveFlag(flagId: string, resolution: string, actor: string): Promise<void> {
  if (!resolution.trim()) throw new Error("Write a short note on what you decided");
  const f = (await prisma.$queryRawUnsafe<{ quotation_id: string; rule: string; status: string }[]>(`SELECT quotation_id::text, rule, status FROM review_flags WHERE id=$1::uuid`, flagId))[0];
  if (!f) throw new Error("Flag not found");
  if (f.status === "resolved") throw new Error("Already resolved");
  await prisma.$executeRawUnsafe(`UPDATE review_flags SET status='resolved', resolution=$2, resolved_by=$3, resolved_at=now() WHERE id=$1::uuid`, flagId, resolution.trim(), actor);
  await logEvent(f.quotation_id, "review_resolved", `${REVIEW_RULES[f.rule as ReviewRule] ?? f.rule}: ${resolution.trim()}`);
}
