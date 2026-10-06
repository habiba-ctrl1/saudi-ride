// Ops quotation creation: Client → Quotation. Clients are matched by normalised phone (never auto-merged by name).
import { prisma } from "@/lib/prisma";

export const normPhone = (p: string) => p.replace(/[^0-9+]/g, "");

export type ClientRow = { id: string; name: string; phone: string | null; email: string | null; rides: number };

export async function searchClients(q: string): Promise<ClientRow[]> {
  const like = `%${q.trim()}%`;
  return prisma.$queryRawUnsafe<ClientRow[]>(
    `SELECT c.id::text, c.name, c.phone, c.email, (SELECT count(*)::int FROM quotations x WHERE x.client_id=c.id) rides
       FROM clients c WHERE $1 = '' OR c.name ILIKE $2 OR c.phone ILIKE $2 OR c.email ILIKE $2 ORDER BY c.updated_at DESC LIMIT 15`,
    q.trim(), like,
  );
}

export type NewQuotationInput = {
  client_id?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  pickup_location: string;
  drop_location: string;
  trip_type: string;
  trip_date: string;
  trip_time?: string | null;
  return_date?: string | null;
  passengers_count?: number | null;
  luggage_notes?: string | null;
  vehicle_type_requested?: string | null;
  quoted_price?: number | null;
  est_driver_cost?: number | null;
  pricing_rule_id?: string | null;
  price_notes?: string | null;
  valid_until?: string | null;
  source?: string;
  stage: "draft" | "ready";
};

const TRIP_TYPES = ["one_way", "round_trip", "event", "multi_day", "airport_transfer", "hourly"];
const SOURCES = ["website", "whatsapp", "referral", "event_management"];
const VEHICLES = ["sedan", "suv", "van", "bus", "limousine"];

export async function createOpsQuotation(i: NewQuotationInput): Promise<{ id: string; quote_reference: string; client_id: string }> {
  if (!TRIP_TYPES.includes(i.trip_type)) throw new Error("Invalid trip type");
  if (i.source && !SOURCES.includes(i.source)) throw new Error("Invalid source");
  if (i.vehicle_type_requested && !VEHICLES.includes(i.vehicle_type_requested)) throw new Error("Invalid vehicle");
  const phone = normPhone(i.customer_phone);
  if (!phone) throw new Error("A phone / WhatsApp number is required");
  if (i.stage === "ready" && i.quoted_price == null) throw new Error("Set a price before marking the quotation Ready");

  // Reuse the client by phone (or the explicitly chosen one); otherwise create it.
  let clientId = i.client_id ?? null;
  if (!clientId) {
    const found = await prisma.$queryRawUnsafe<{ id: string }[]>(`SELECT id::text FROM clients WHERE phone=$1`, phone);
    if (found.length) clientId = found[0].id;
  }
  if (!clientId) {
    const ins = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `INSERT INTO clients (name, phone, email) VALUES ($1,$2,$3) ON CONFLICT (phone) WHERE phone IS NOT NULL DO UPDATE SET updated_at=now() RETURNING id::text`,
      i.customer_name.trim(), phone, i.customer_email?.trim() || null,
    );
    clientId = ins[0].id;
  } else if (i.customer_email?.trim()) {
    await prisma.$executeRawUnsafe(`UPDATE clients SET email=COALESCE(email,$2), updated_at=now() WHERE id=$1::uuid`, clientId, i.customer_email.trim());
  }

  const rows = await prisma.$queryRawUnsafe<{ id: string; quote_reference: string }[]>(
    `INSERT INTO quotations (client_id, customer_name, customer_phone, customer_email, pickup_location, drop_location, trip_type, trip_date, trip_time, return_date,
        passengers_count, luggage_notes, vehicle_type_requested, quoted_price, est_driver_cost, pricing_rule_id, price_notes, valid_until, source, status, quote_stage)
     VALUES ($1::uuid,$2,$3,$4,$5,$6,$7::trip_type,$8::date,$9::time,$10::date,$11::int,$12,$13::driver_vehicle_type,$14::numeric,$15::numeric,$16,$17,$18::date,$19::lead_source,
        CASE WHEN $14::numeric IS NULL THEN 'new' ELSE 'quoted' END::quotation_status,$20)
     RETURNING id::text, quote_reference`,
    clientId, i.customer_name.trim(), i.customer_phone.trim(), i.customer_email?.trim() || null, i.pickup_location.trim(), i.drop_location.trim(), i.trip_type,
    i.trip_date, i.trip_time || null, i.return_date || null, i.passengers_count ?? null, i.luggage_notes || null, i.vehicle_type_requested || null,
    i.quoted_price ?? null, i.est_driver_cost ?? null, i.pricing_rule_id ?? null, i.price_notes || null, i.valid_until || null, i.source ?? "whatsapp", i.stage,
  );
  return { ...rows[0], client_id: clientId };
}
