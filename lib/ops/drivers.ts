// Driver directory + partner ledger. Two categories:
//   main  — the drivers/vendors rides are actually given to (Naimat, Sheraz, ...), with profit-share ledger
//   local — local drivers not worked with yet + website form applicants (shown together in the UI)
import { prisma } from "@/lib/prisma";

export type MainDriver = {
  id: string;
  name: string;
  phone: string | null;
  vehicle_info: string | null;
  routes: string | null;
  city: string | null;
  default_share_pct: number;
  notes: string | null;
  rides: number;
  margin: number; // total gross margin on confirmed rides
  owner_share: number; // owner's part of that margin
  received: number; // paid by driver to owner
  paid_out: number; // paid by owner to driver
  outstanding: number; // owner_share - received + paid_out (positive = driver owes owner)
  unconfirmed_rides: number; // completed rides with no cost entered yet
};

export async function listMainDrivers(): Promise<MainDriver[]> {
  return prisma.$queryRawUnsafe<MainDriver[]>(`
    SELECT p.id::text, p.name, p.phone, p.vehicle_info, p.routes, p.city, p.default_share_pct::float, p.notes,
      COALESCE(r.rides,0)::int rides, COALESCE(r.margin,0)::float margin, COALESCE(r.owner_share,0)::float owner_share,
      COALESCE(s.received,0)::float received, COALESCE(s.paid_out,0)::float paid_out,
      (COALESCE(r.owner_share,0) - COALESCE(s.received,0) + COALESCE(s.paid_out,0))::float outstanding,
      COALESCE(r.unconfirmed,0)::int unconfirmed_rides
    FROM partners p
    LEFT JOIN (
      SELECT partner_id, count(*) FILTER (WHERE status='completed') rides,
        SUM(COALESCE(actual_amount_paid,0)-driver_cost-extra_cost) FILTER (WHERE financial_status='confirmed' AND status='completed') margin,
        SUM((COALESCE(actual_amount_paid,0)-driver_cost-extra_cost)*(100-COALESCE(partner_share_pct,0))/100) FILTER (WHERE financial_status='confirmed' AND status='completed') owner_share,
        count(*) FILTER (WHERE status='completed' AND financial_status<>'confirmed') unconfirmed
      FROM quotations WHERE partner_id IS NOT NULL AND NOT is_test GROUP BY partner_id) r ON r.partner_id=p.id
    LEFT JOIN (
      SELECT partner_id, SUM(amount) FILTER (WHERE direction='received_from_partner') received, SUM(amount) FILTER (WHERE direction='paid_to_partner') paid_out
      FROM partner_settlements GROUP BY partner_id) s ON s.partner_id=p.id
    WHERE p.kind='main' AND p.is_active ORDER BY p.name`);
}

export type LocalDriver = {
  key: string;
  source: "owner_list" | "website_form";
  name: string;
  phone: string | null;
  vehicle: string | null;
  city: string | null;
  nationality: string | null;
  status: string | null; // application status for website form
  note: string | null;
};

export async function listLocalDrivers(): Promise<LocalDriver[]> {
  const owner = await prisma.$queryRawUnsafe<LocalDriver[]>(`
    SELECT 'p-'||id::text key, 'owner_list' source, name, phone, vehicle_info vehicle, city, nationality, NULL status,
      concat_ws(' · ', licence_note, notes) note FROM partners WHERE kind='local' AND is_active ORDER BY name`);
  const form = await prisma.$queryRawUnsafe<LocalDriver[]>(`
    SELECT 'd-'||id::text key, 'website_form' source, full_name name, phone, concat_ws(' ', vehicle_model, '('||vehicle_type::text||')') vehicle, city, NULL nationality,
      status::text status, admin_notes note FROM drivers ORDER BY created_at DESC`);
  return [...owner, ...form];
}

/** Drivers the operator can assign a ride to (main first, then local). */
export async function listAssignable(): Promise<{ id: string; name: string; phone: string | null; kind: "main" | "local"; default_share_pct: number }[]> {
  return prisma.$queryRawUnsafe(`SELECT id::text, name, phone, kind, default_share_pct::float FROM partners WHERE is_active ORDER BY kind, name`);
}
