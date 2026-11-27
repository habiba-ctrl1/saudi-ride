// Universal Lead Inbox: one row per incoming enquiry, any source. Mirrors website `leads` + `contact_submissions`
// idempotently (external_key). Status is never advanced by sending a quotation without an explicit action.
import { prisma } from "@/lib/prisma";
import { normPhone } from "@/lib/ops/quotations";

import type { LeadRow, LeadSource, LeadStatus } from "@/lib/ops/lead-constants";
import { LEAD_SOURCES, LEAD_STATUSES, LEAD_STATUS_LABEL } from "@/lib/ops/lead-constants";
export * from "@/lib/ops/lead-constants";

const SELECT = `l.id::text, l.reference, l.source, l.status, l.customer_name, l.customer_phone, l.customer_email, l.language, l.pickup, l.dropoff,
  l.trip_date::text, l.trip_time, l.trip_type, l.passengers, l.luggage, l.vehicle, l.budget_text, l.prior_quote_text, l.preferences, l.notes, l.raw_text,
  l.missing, l.group_key, l.client_id::text, l.quotation_id::text, q.quote_reference, q.status::text AS quote_status, l.assigned_to,
  l.next_followup::text, l.processing_status, l.processing_error, l.received_at::text, l.updated_at::text,
  CASE WHEN l.status NOT IN ('lost') AND q.status::text IN ('confirmed','assigned','completed') THEN 'converted' ELSE l.status END AS effective_status`;
const FROM = `FROM lead_inbox l LEFT JOIN quotations q ON q.id = l.quotation_id`;

export async function logLeadActivity(leadId: string, kind: string, detail: string | null, actor: string | null) {
  try {
    await prisma.$executeRawUnsafe(`INSERT INTO lead_activity (lead_id, kind, detail, actor) VALUES ($1::uuid,$2,$3,$4)`, leadId, kind, detail, actor);
  } catch (e) {
    console.error("lead activity log failed (non-fatal):", e);
  }
}

/** Mirror website leads / contact submissions into the inbox. Idempotent; failures are recorded, never thrown. */
export async function syncWebsiteLeads(): Promise<{ added: number; error?: string }> {
  try {
    const a = await prisma.$executeRawUnsafe(
      `INSERT INTO lead_inbox (source, external_key, status, customer_name, customer_phone, customer_email, pickup, dropoff, trip_date, vehicle, language, prior_quote_text, notes, received_at, missing)
       SELECT CASE WHEN l.quoted_price IS NOT NULL THEN 'website_quote' ELSE 'website_form' END, 'leads:' || l.id, CASE WHEN l.created_at > now() - interval '14 days' THEN 'new' ELSE 'unreviewed' END,
              NULLIF(l.customer_name,''), NULLIF(l.customer_phone,''), NULLIF(l.customer_email,''), NULLIF(l.origin,''), NULLIF(l.destination,''),
              CASE WHEN l.trip_date ~ '^\\d{4}-\\d{2}-\\d{2}' THEN left(l.trip_date,10)::date END, NULLIF(l.vehicle_type,''), l.locale,
              CASE WHEN l.quoted_price IS NOT NULL THEN 'Website calculator showed ' || l.currency || ' ' || l.quoted_price::text END,
              'Page: ' || COALESCE(l.page_url,'-') || ' | utm: ' || COALESCE(l.utm_source,'-'), l.created_at,
              ARRAY_REMOVE(ARRAY[CASE WHEN COALESCE(l.customer_name,'')='' THEN 'name' END, CASE WHEN COALESCE(l.customer_phone,'')='' THEN 'phone / WhatsApp' END], NULL)
       FROM leads l ON CONFLICT (external_key) DO NOTHING`);
    const b = await prisma.$executeRawUnsafe(
      `INSERT INTO lead_inbox (source, external_key, status, customer_name, customer_phone, customer_email, notes, raw_text, received_at, missing)
       SELECT 'contact_form', 'contact:' || c.id, CASE WHEN c.created_at > now() - interval '14 days' THEN 'new' ELSE 'unreviewed' END, c.name, NULLIF(c.phone,''), c.email, 'Service: ' || COALESCE(c.service,'-'), c.message, c.created_at,
              ARRAY['pickup','drop-off','date']
       FROM contact_submissions c ON CONFLICT (external_key) DO NOTHING`);
    return { added: Number(a) + Number(b) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("syncWebsiteLeads failed:", msg);
    return { added: 0, error: msg };
  }
}

export type LeadFilter = { status?: string; source?: string; q?: string; page?: number; pageSize?: number; quotedOnly?: boolean };

export async function listLeads(f: LeadFilter): Promise<{ rows: LeadRow[]; total: number; counts: Record<string, number> }> {
  const where: string[] = [];
  const args: unknown[] = [];
  const add = (sql: string, v: unknown) => { args.push(v); where.push(sql.replace("?", `$${args.length}`)); };
  if (f.source && (LEAD_SOURCES as readonly string[]).includes(f.source)) add("l.source = ?", f.source);
  if (f.q?.trim()) {
    args.push(`%${f.q.trim()}%`);
    const p = `$${args.length}`;
    where.push(`(l.customer_name ILIKE ${p} OR l.customer_phone ILIKE ${p} OR l.customer_email ILIKE ${p} OR l.reference ILIKE ${p} OR l.pickup ILIKE ${p} OR l.dropoff ILIKE ${p} OR q.quote_reference ILIKE ${p})`);
  }
  const base = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const countsRaw = await prisma.$queryRawUnsafe<{ s: string; n: number }[]>(
    `SELECT CASE WHEN l.status <> 'lost' AND q.status::text IN ('confirmed','assigned','completed') THEN 'converted' ELSE l.status END s, count(*)::int n ${FROM} ${base} GROUP BY 1`, ...args);
  const counts: Record<string, number> = {};
  for (const r of countsRaw) counts[r.s] = r.n;

  const w2 = [...where];
  const a2 = [...args];
  if (f.status && (LEAD_STATUSES as readonly string[]).includes(f.status)) {
    a2.push(f.status);
    w2.push(`(CASE WHEN l.status <> 'lost' AND q.status::text IN ('confirmed','assigned','completed') THEN 'converted' ELSE l.status END) = $${a2.length}`);
  }
  const where2 = w2.length ? `WHERE ${w2.join(" AND ")}` : "";
  const pageSize = Math.min(Math.max(f.pageSize ?? 25, 1), 100);
  const offset = (Math.max(f.page ?? 1, 1) - 1) * pageSize;
  const total = (await prisma.$queryRawUnsafe<{ n: number }[]>(`SELECT count(*)::int n ${FROM} ${where2}`, ...a2))[0]?.n ?? 0;
  const rows = await prisma.$queryRawUnsafe<LeadRow[]>(
    `SELECT ${SELECT} ${FROM} ${where2} ORDER BY l.received_at DESC LIMIT ${pageSize} OFFSET ${offset}`, ...a2);
  return { rows, total, counts };
}

export async function getLead(id: string): Promise<LeadRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await prisma.$queryRawUnsafe<LeadRow[]>(`SELECT ${SELECT} ${FROM} WHERE l.id = $1::uuid`, id);
  return r[0] ?? null;
}

export async function getLeadActivity(id: string) {
  return prisma.$queryRawUnsafe<{ kind: string; detail: string | null; actor: string | null; created_at: string }[]>(
    `SELECT kind, detail, actor, created_at::text FROM lead_activity WHERE lead_id = $1::uuid ORDER BY created_at DESC`, id);
}

export type DuplicateMatch = { type: "lead" | "client" | "quotation"; id: string; label: string; detail: string; href: string };

/** Possible duplicates by normalised phone or e-mail. Never merges — the owner decides. */
export async function findDuplicates(phone?: string | null, email?: string | null, excludeLeadId?: string): Promise<DuplicateMatch[]> {
  const p = phone ? normPhone(phone) : "";
  const e = email?.trim().toLowerCase() ?? "";
  if (!p && !e) return [];
  const out: DuplicateMatch[] = [];
  const leads = await prisma.$queryRawUnsafe<{ id: string; reference: string; customer_name: string | null; status: string; pickup: string | null; dropoff: string | null }[]>(
    `SELECT id::text, reference, customer_name, status, pickup, dropoff FROM lead_inbox
      WHERE (($1 <> '' AND regexp_replace(COALESCE(customer_phone,''),'[^0-9+]','','g') = $1) OR ($2 <> '' AND lower(COALESCE(customer_email,'')) = $2))
        AND ($3::text IS NULL OR id::text <> $3) ORDER BY received_at DESC LIMIT 5`, p, e, excludeLeadId ?? null);
  for (const l of leads) out.push({ type: "lead", id: l.id, label: `${l.reference} · ${l.customer_name ?? "No name"}`, detail: `${l.status}${l.pickup ? ` · ${l.pickup} → ${l.dropoff ?? "?"}` : ""}`, href: `/admin/leads/${l.id}` });
  const clients = await prisma.$queryRawUnsafe<{ id: string; name: string; phone: string | null }[]>(
    `SELECT id::text, name, phone FROM clients WHERE ($1 <> '' AND phone = $1) OR ($2 <> '' AND lower(COALESCE(email,'')) = $2) LIMIT 3`, p, e);
  for (const c of clients) out.push({ type: "client", id: c.id, label: `Existing client · ${c.name}`, detail: c.phone ?? "", href: `/admin/clients/${c.id}` });
  const quotes = await prisma.$queryRawUnsafe<{ id: string; quote_reference: string; customer_name: string; status: string; trip_date: string }[]>(
    `SELECT id::text, quote_reference, customer_name, status::text, trip_date::text FROM quotations
      WHERE ($1 <> '' AND regexp_replace(COALESCE(customer_phone,''),'[^0-9+]','','g') = $1) OR ($2 <> '' AND lower(COALESCE(customer_email,'')) = $2)
      ORDER BY created_at DESC LIMIT 5`, p, e);
  for (const x of quotes) out.push({ type: "quotation", id: x.id, label: `${x.quote_reference} · ${x.customer_name}`, detail: `${x.status} · ${x.trip_date}`, href: `/admin/quotations/${x.id}` });
  return out;
}

export type NewLeadInput = {
  source?: LeadSource; customer_name?: string | null; customer_phone?: string | null; customer_email?: string | null; language?: string | null;
  pickup?: string | null; dropoff?: string | null; trip_date?: string | null; trip_time?: string | null; trip_type?: string | null;
  passengers?: number | null; luggage?: string | null; vehicle?: string | null; budget_text?: string | null; prior_quote_text?: string | null;
  preferences?: string | null; notes?: string | null; raw_text?: string | null; group_key?: string | null;
};

const REQUIRED: [keyof NewLeadInput, string][] = [["customer_name", "name"], ["customer_phone", "phone / WhatsApp"], ["pickup", "pickup"], ["dropoff", "drop-off"], ["trip_date", "date"], ["trip_time", "time"], ["passengers", "passengers"], ["vehicle", "vehicle"]];
const emptyToNull = (v: unknown) => (typeof v === "string" ? v.trim() || null : v ?? null);

export async function createLead(input: NewLeadInput, actor: string): Promise<{ id: string; reference: string }> {
  const i: NewLeadInput = Object.fromEntries(Object.entries(input).map(([k, v]) => [k, emptyToNull(v)]));
  const source = i.source && (LEAD_SOURCES as readonly string[]).includes(i.source) ? i.source : "manual";
  if (!i.customer_name && !i.customer_phone && !i.customer_email && !i.raw_text) throw new Error("Enter at least a name, a contact detail or the message text");
  if (i.trip_date && !/^\d{4}-\d{2}-\d{2}$/.test(i.trip_date)) throw new Error("Date must be YYYY-MM-DD");
  if (i.passengers != null && (!Number.isInteger(Number(i.passengers)) || Number(i.passengers) < 1 || Number(i.passengers) > 100)) throw new Error("Passengers must be a whole number");
  const missing = REQUIRED.filter(([k]) => i[k] == null).map(([, l]) => l);
  const phone = i.customer_phone ? normPhone(i.customer_phone) : null;
  const rows = await prisma.$queryRawUnsafe<{ id: string; reference: string }[]>(
    `INSERT INTO lead_inbox (source, status, customer_name, customer_phone, customer_email, language, pickup, dropoff, trip_date, trip_time, trip_type, passengers, luggage,
        vehicle, budget_text, prior_quote_text, preferences, notes, raw_text, missing, group_key, client_id)
     VALUES ($1,'new',$2,$3,$4,$5,$6,$7,$8::date,$9,$10,$11::int,$12,$13,$14,$15,$16,$17,$18,$19::text[],$20,
        (SELECT id FROM clients WHERE phone = $3 LIMIT 1))
     RETURNING id::text, reference`,
    source, i.customer_name, phone, i.customer_email, i.language, i.pickup, i.dropoff, i.trip_date, i.trip_time, i.trip_type,
    i.passengers == null ? null : Number(i.passengers), i.luggage, i.vehicle, i.budget_text, i.prior_quote_text, i.preferences, i.notes, i.raw_text, missing, i.group_key,
  );
  await logLeadActivity(rows[0].id, "created", `Source: ${source}${missing.length ? ` · missing: ${missing.join(", ")}` : ""}`, actor);
  return rows[0];
}

const EDITABLE = ["customer_name", "customer_phone", "customer_email", "language", "pickup", "dropoff", "trip_date", "trip_time", "trip_type", "passengers", "luggage", "vehicle",
  "budget_text", "prior_quote_text", "preferences", "notes", "assigned_to", "next_followup"] as const;

export async function updateLead(id: string, patch: Record<string, unknown>, actor: string): Promise<void> {
  const cur = await getLead(id);
  if (!cur) throw new Error("Lead not found");
  const sets: string[] = [];
  const args: unknown[] = [id];
  const changes: string[] = [];
  if (patch.status !== undefined) {
    if (!(LEAD_STATUSES as readonly string[]).includes(String(patch.status))) throw new Error("Invalid status");
    if (patch.status !== cur.status) {
      args.push(patch.status); sets.push(`status = $${args.length}`);
      changes.push(`status ${LEAD_STATUS_LABEL[cur.status]} → ${LEAD_STATUS_LABEL[patch.status as LeadStatus]}`);
    }
  }
  for (const k of EDITABLE) {
    if (patch[k] === undefined) continue;
    let v = emptyToNull(patch[k]);
    if (k === "customer_phone" && typeof v === "string") v = normPhone(v) || null;
    if (k === "passengers" && v != null) { v = Number(v); if (!Number.isInteger(v) || (v as number) < 1) throw new Error("Passengers must be a whole number"); }
    if (k === "trip_date" && v && !/^\d{4}-\d{2}-\d{2}$/.test(String(v))) throw new Error("Date must be YYYY-MM-DD");
    if (k === "next_followup" && v && !/^\d{4}-\d{2}-\d{2}$/.test(String(v))) throw new Error("Follow-up must be YYYY-MM-DD");
    if (String(cur[k] ?? "") === String(v ?? "")) continue;
    args.push(v);
    const cast = k === "trip_date" || k === "next_followup" ? "::date" : k === "passengers" ? "::int" : "";
    sets.push(`${k} = $${args.length}${cast}`);
    changes.push(`${k}: ${cur[k] ?? "—"} → ${v ?? "—"}`);
  }
  if (!sets.length) return;
  await prisma.$executeRawUnsafe(`UPDATE lead_inbox SET ${sets.join(", ")}, updated_at = now() WHERE id = $1::uuid`, ...args);
  // keep `missing` honest after edits
  const fresh = await getLead(id);
  if (fresh) {
    const miss = REQUIRED.filter(([k]) => fresh[k as keyof LeadRow] == null || fresh[k as keyof LeadRow] === "").map(([, l]) => l);
    await prisma.$executeRawUnsafe(`UPDATE lead_inbox SET missing = $2::text[] WHERE id = $1::uuid`, id, miss);
  }
  await logLeadActivity(id, patch.status !== undefined && changes[0]?.startsWith("status") ? "status_changed" : "edited", changes.join("; "), actor);
}

/** Called when an ops quotation is created from a lead. Moves to "quotation in preparation" only — never to sent/confirmed. */
export async function linkLeadToQuotation(leadId: string, quotationId: string, clientId: string, actor: string) {
  const cur = await getLead(leadId);
  if (!cur) return;
  const advance = ["new", "unreviewed", "contacted", "awaiting_info", "follow_up"].includes(cur.status);
  await prisma.$executeRawUnsafe(
    `UPDATE lead_inbox SET quotation_id = $2::uuid, client_id = $3::uuid, status = CASE WHEN $4 THEN 'quotation_in_prep' ELSE status END, updated_at = now() WHERE id = $1::uuid`,
    leadId, quotationId, clientId, advance);
  await logLeadActivity(leadId, "quotation_linked", `Quotation record created${advance ? " (status → Quotation in preparation)" : ""}`, actor);
}

/** Prefill for /admin/quotations/new. Only passes through what the lead actually holds. */
export function quotationPrefillQuery(l: Pick<LeadRow, "id" | "source" | "customer_name" | "customer_phone" | "customer_email" | "pickup" | "dropoff" | "trip_date" | "trip_time" | "vehicle" | "passengers" | "luggage" | "trip_type">): string {
  const p = new URLSearchParams();
  const set = (k: string, v: unknown) => { if (v != null && v !== "") p.set(k, String(v)); };
  set("lead", l.id); set("src", l.source.startsWith("website") || l.source === "contact_form" ? "website" : "whatsapp"); set("name", l.customer_name); set("phone", l.customer_phone); set("email", l.customer_email); set("pickup", l.pickup); set("drop", l.dropoff);
  set("date", l.trip_date?.slice(0, 10)); set("time", l.trip_time); set("vehicle", l.vehicle); set("pax", l.passengers); set("luggage", l.luggage); set("tripType", l.trip_type);
  return p.toString();
}
