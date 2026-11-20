import { prisma } from "@/lib/prisma";

export type ClientListRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  bookings: number;
  completed: number;
  paid_total: number;
  margin_total: number;
  last_trip: string | null;
};

export async function listClients(search = ""): Promise<ClientListRow[]> {
  const like = `%${search.trim()}%`;
  return prisma.$queryRawUnsafe<ClientListRow[]>(
    `SELECT c.id::text, c.name, c.phone, c.email,
        count(q.id) FILTER (WHERE NOT q.is_test)::int bookings,
        count(q.id) FILTER (WHERE q.status='completed' AND NOT q.is_test)::int completed,
        COALESCE(SUM(q.actual_amount_paid) FILTER (WHERE q.status='completed' AND NOT q.is_test),0)::float paid_total,
        COALESCE(SUM(COALESCE(q.actual_amount_paid,0)-q.driver_cost-q.extra_cost) FILTER (WHERE q.status='completed' AND q.financial_status='confirmed' AND NOT q.is_test),0)::float margin_total,
        max(q.trip_date)::text last_trip
       FROM clients c LEFT JOIN quotations q ON q.client_id=c.id
      WHERE $1='' OR c.name ILIKE $2 OR c.phone ILIKE $2 OR c.email ILIKE $2
      GROUP BY c.id ORDER BY max(q.trip_date) DESC NULLS LAST, c.name LIMIT 300`,
    search.trim(), like,
  );
}

export type ClientBooking = {
  id: string;
  quote_reference: string;
  trip_date: string;
  pickup_location: string;
  drop_location: string;
  status: string;
  quote_stage: string;
  quoted_price: number | null;
  actual_amount_paid: number | null;
  payment_status: string;
  driver_name: string | null;
  margin: number | null;
  financial_status: string;
};

export type ClientDetail = {
  client: { id: string; name: string; phone: string | null; email: string | null; notes: string | null; created_at: string };
  bookings: ClientBooking[];
  emails_sent: number;
};

export async function getClientDetail(id: string): Promise<ClientDetail | null> {
  const c = await prisma.$queryRawUnsafe<ClientDetail["client"][]>(`SELECT id::text, name, phone, email, notes, created_at::text FROM clients WHERE id=$1::uuid`, id);
  if (!c.length) return null;
  const bookings = await prisma.$queryRawUnsafe<ClientBooking[]>(
    `SELECT id::text, quote_reference, trip_date::text, pickup_location, drop_location, status::text, quote_stage, quoted_price::float, actual_amount_paid::float,
            payment_status::text, driver_name, financial_status,
            CASE WHEN driver_cost IS NOT NULL THEN (COALESCE(actual_amount_paid,0)-driver_cost-extra_cost)::float END margin
       FROM quotations WHERE client_id=$1::uuid AND NOT is_test ORDER BY trip_date DESC, created_at DESC`, id);
  const n = await prisma.$queryRawUnsafe<{ n: number }[]>(
    `SELECT count(*)::int n FROM communication_log l JOIN quotations q ON q.id=l.quotation_id WHERE q.client_id=$1::uuid AND l.status='sent'`, id);
  return { client: c[0], bookings, emails_sent: n[0].n };
}
