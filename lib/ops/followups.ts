// Follow-up tracker: customers who were given a price but have not confirmed. Also emails the owner a digest
// when a still-open follow-up is within `remind_days_before` (default 3) days of its travel date.
// "Today" is Riyadh time (UTC+3). Dedupe via reminder_sent_at, so the daily cron can re-run safely.
import { prisma } from "@/lib/prisma";
import { sendEmailStrict } from "@/lib/notifications";
import { waLink } from "@/lib/ops/wa-text";
import { followUpMessage, FU_STATUSES, type FollowUp, type FuStatus } from "@/lib/ops/followup-constants";
export * from "@/lib/ops/followup-constants";

const ksaToday = () => new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10);
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

const COLS = `id::text, customer_name, customer_phone, customer_email, pickup, dropoff, trip_date::text, trip_time, trip_type, vehicle, passengers, luggage,
  quoted_price::float, currency, price_sent_at::text, status, last_followup_at::text, followup_count, remind_days_before, reminder_sent_at::text, notes, created_at::text,
  CASE WHEN trip_date IS NULL THEN NULL ELSE (trip_date - $1::date)::int END AS days_left`;

export async function listFollowUps(): Promise<FollowUp[]> {
  return prisma.$queryRawUnsafe<FollowUp[]>(
    `SELECT ${COLS} FROM quote_followups
      ORDER BY (status IN ('confirmed','lost')), trip_date NULLS LAST, created_at DESC`, ksaToday());
}

export type NewFollowUp = Partial<Omit<FollowUp, "id" | "days_left">> & { customer_name: string; source_lead_id?: string | null };

export async function createFollowUp(i: NewFollowUp): Promise<string> {
  if (!i.customer_name?.trim()) throw new Error("Customer name is required");
  const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `INSERT INTO quote_followups (customer_name, customer_phone, customer_email, pickup, dropoff, trip_date, trip_time, trip_type, vehicle, passengers, luggage,
        quoted_price, price_sent_at, notes, source_lead_id, remind_days_before)
     VALUES ($1,$2,$3,$4,$5,$6::date,$7,$8,$9,$10,$11,$12::numeric,COALESCE($13::timestamptz, now()),$14,$15,COALESCE($16::int,3))
     ON CONFLICT (source_lead_id) DO NOTHING RETURNING id::text`,
    i.customer_name.trim(), i.customer_phone || null, i.customer_email || null, i.pickup || null, i.dropoff || null, i.trip_date || null, i.trip_time || null,
    i.trip_type || null, i.vehicle || null, i.passengers || null, i.luggage || null, i.quoted_price ?? null, i.price_sent_at || null, i.notes || null,
    i.source_lead_id || null, i.remind_days_before ?? null,
  );
  return rows[0]?.id ?? "";
}

const EDITABLE = ["customer_name", "customer_phone", "customer_email", "pickup", "dropoff", "trip_date", "trip_time", "vehicle", "passengers", "luggage", "quoted_price", "notes", "remind_days_before"] as const;

export async function updateFollowUp(id: string, b: Record<string, unknown>) {
  const sets: string[] = ["updated_at = now()"];
  const args: unknown[] = [id];
  const add = (sql: string, v: unknown) => { args.push(v); sets.push(sql.replace("?", `$${args.length}`)); };
  if (typeof b.status === "string") {
    if (!(FU_STATUSES as readonly string[]).includes(b.status)) throw new Error("Invalid status");
    add("status = ?", b.status as FuStatus);
  }
  if (b.mark_followed_up === true) {
    sets.push("last_followup_at = now()", "followup_count = followup_count + 1", "status = CASE WHEN status = 'quoted' THEN 'followed_up' ELSE status END");
  }
  for (const k of EDITABLE) {
    if (!(k in b)) continue;
    const v = b[k] === "" ? null : b[k];
    if (k === "trip_date") { add("trip_date = ?::date", v); sets.push("reminder_sent_at = NULL"); }
    else if (k === "quoted_price") add("quoted_price = ?::numeric", v);
    else if (k === "remind_days_before") add("remind_days_before = ?::int", v ?? 3);
    else add(`${k} = ?`, v);
  }
  if (sets.length === 1) throw new Error("Nothing to update");
  await prisma.$executeRawUnsafe(`UPDATE quote_followups SET ${sets.join(", ")} WHERE id = $1::uuid`, ...args);
}

export async function deleteFollowUp(id: string) {
  await prisma.$executeRawUnsafe(`DELETE FROM quote_followups WHERE id = $1::uuid`, id);
}

/** Website quote-form leads (last 30 days) that are not yet tracked, so they can be added with one click. */
export type Candidate = { id: string; customer_name: string; customer_phone: string | null; customer_email: string | null; pickup: string | null; dropoff: string | null; trip_date: string | null; vehicle: string | null; passengers: string | null; luggage: string | null; created_at: string };
export async function listCandidates(): Promise<Candidate[]> {
  return prisma.$queryRawUnsafe<Candidate[]>(
    `SELECT l.id::text, COALESCE(NULLIF(l.customer_name,''),'No name') customer_name, NULLIF(l.customer_phone,'') customer_phone, NULLIF(l.customer_email,'') customer_email,
            l.origin pickup, l.destination dropoff, l.trip_date, l.vehicle_type vehicle, l.passengers, l.luggage, l.created_at::text
       FROM leads l
      WHERE l.source = 'whatsapp_quote_form' AND l.created_at > now() - interval '30 days'
        AND NOT EXISTS (SELECT 1 FROM quote_followups f WHERE f.source_lead_id = 'leads:' || l.id
                           OR (f.customer_phone IS NOT NULL AND right(regexp_replace(f.customer_phone,'\\D','','g'),8) = right(regexp_replace(COALESCE(l.customer_phone,''),'\\D','','g'),8)))
      ORDER BY l.created_at DESC LIMIT 60`);
}

/** Open follow-ups whose trip is within remind_days_before days (and not yet emailed). */
export async function findDueFollowUps(): Promise<FollowUp[]> {
  return prisma.$queryRawUnsafe<FollowUp[]>(
    `SELECT ${COLS} FROM quote_followups
      WHERE status IN ('quoted','followed_up') AND trip_date IS NOT NULL AND reminder_sent_at IS NULL
        AND trip_date BETWEEN $1::date AND $1::date + remind_days_before
      ORDER BY trip_date, trip_time NULLS LAST`, ksaToday());
}

export async function sendDueFollowUpReminders(): Promise<{ checked: number; sent: string[]; error?: string }> {
  const due = await findDueFollowUps();
  if (!due.length) return { checked: 0, sent: [] };
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taxisaudiarabia.com";
  const to = process.env.ADMIN_EMAIL || "infotaxisaudiarabia@gmail.com";
  const block = (r: FollowUp) => {
    const label = r.days_left === 0 ? "TODAY" : r.days_left === 1 ? "TOMORROW" : `IN ${r.days_left} DAYS`;
    const wa = r.customer_phone ? `<a href="${waLink(r.customer_phone, followUpMessage(r))}" style="color:#0F7A37;font-weight:700">WhatsApp follow-up</a>` : "<i>no phone</i>";
    return `<div style="border:1px solid #E5E7EB;border-radius:10px;padding:14px 16px;margin:0 0 14px;background:#fff">
      <div style="font-size:12px;font-weight:700;color:#B45309">${label} · NOT CONFIRMED YET</div>
      <div style="font-size:16px;font-weight:700;margin:4px 0">${esc(r.customer_name)} — ${esc(r.trip_date)}${r.trip_time ? ` ${esc(r.trip_time.slice(0, 5))}` : ""}</div>
      <div style="font-size:13px;color:#111">${esc(r.pickup)} → ${esc(r.dropoff)}<br>${esc(r.vehicle ?? "-")}${r.passengers ? ` · ${esc(r.passengers)} pax` : ""} · Price sent: ${r.quoted_price != null ? `SAR ${r.quoted_price}` : "-"}<br>${esc(r.customer_phone ?? "")} · Follow-ups so far: ${r.followup_count}</div>
      <div style="margin-top:10px;font-size:13px">${wa} &nbsp;·&nbsp; <a href="${site}/admin/follow-ups" style="color:#0F7A37;font-weight:700">Open follow-ups</a></div></div>`;
  };
  const html = `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:620px;margin:auto;background:#F9FAFB;padding:18px">
    <div style="background:#16A34A;color:#FACC15;font-weight:800;font-size:18px;padding:12px 16px;border-radius:10px 10px 0 0">TSA — Follow up before the trip</div>
    <div style="padding:16px 0 0"><p style="margin:0 0 12px;font-size:13px">These customers got a price but have not confirmed, and their trip is close.</p>${due.map(block).join("")}</div></div>`;
  const res = await sendEmailStrict(to, `Follow-up needed: ${due.map((r) => r.customer_name).join(", ")}`, html);
  if (!res.ok) return { checked: due.length, sent: [], error: res.error };
  await prisma.$executeRawUnsafe(`UPDATE quote_followups SET reminder_sent_at = now() WHERE id = ANY($1::uuid[])`, due.map((r) => r.id));
  return { checked: due.length, sent: due.map((r) => r.customer_name) };
}
