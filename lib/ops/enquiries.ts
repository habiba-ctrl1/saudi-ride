import { prisma } from "@/lib/prisma";
import { normPhone } from "@/lib/ops/quotations";

export type WaEnquiry = {
  id: string; seq_no: string | null; client_name: string | null; contact: string | null; route_from: string | null; route_to: string | null;
  sedan_text: string | null; staria_text: string | null; gmc_text: string | null; trip_type_text: string | null; status_text: string | null; reason: string | null; notes: string | null; outcome: string;
};
export type WebLead = { id: string; customer_name: string | null; customer_phone: string | null; customer_email: string | null; origin: string | null; destination: string | null; trip_date: string | null; vehicle_type: string | null; created_at: string; quoted: boolean };

export async function listWhatsAppEnquiries(q: string, outcome: string): Promise<WaEnquiry[]> {
  const like = `%${q.trim()}%`;
  return prisma.$queryRawUnsafe<WaEnquiry[]>(
    `SELECT id::text, seq_no, client_name, contact, route_from, route_to, sedan_text, staria_text, gmc_text, trip_type_text, status_text, reason, notes, outcome FROM enquiries
      WHERE ($1='' OR client_name ILIKE $2 OR contact ILIKE $2 OR route_from ILIKE $2 OR route_to ILIKE $2 OR notes ILIKE $2 OR reason ILIKE $2)
        AND ($3='' OR outcome=$3) ORDER BY NULLIF(regexp_replace(seq_no,'[^0-9]','','g'),'')::int NULLS LAST LIMIT 300`,
    q.trim(), like, outcome);
}

export async function listWebLeads(q: string): Promise<WebLead[]> {
  const like = `%${q.trim()}%`;
  const rows = await prisma.$queryRawUnsafe<Omit<WebLead, "quoted">[]>(
    `SELECT id::text, customer_name, customer_phone, customer_email, origin, destination, trip_date, vehicle_type, created_at::text FROM leads
      WHERE $1='' OR customer_name ILIKE $2 OR customer_phone ILIKE $2 OR origin ILIKE $2 OR destination ILIKE $2 ORDER BY created_at DESC LIMIT 200`, q.trim(), like);
  const phones = new Set((await prisma.$queryRawUnsafe<{ p: string }[]>(`SELECT regexp_replace(customer_phone,'[^0-9+]','','g') p FROM quotations`)).map((x) => x.p));
  return rows.map((r) => ({ ...r, quoted: !!r.customer_phone && phones.has(normPhone(r.customer_phone)) }));
}
