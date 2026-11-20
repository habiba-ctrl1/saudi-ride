// Upcoming-ride reminders for the owner. A confirmed/assigned ride gets one email 2 days before pickup
// (kind "reminder_2d") and a second one the day before (kind "reminder_1d"). Dedupe lives in
// booking_events, so the cron can run daily (or be re-run) without sending twice, and a ride that is
// confirmed late (e.g. 1 day out) still gets its reminder on the next run.
// "Today" is Riyadh time (UTC+3) regardless of where the server runs.
import { prisma } from "@/lib/prisma";
import { sendEmailStrict } from "@/lib/notifications";
import { waLink } from "@/lib/ops/wa-text";

const KSA_OFFSET_MS = 3 * 60 * 60 * 1000;
const ksaToday = () => new Date(Date.now() + KSA_OFFSET_MS).toISOString().slice(0, 10);
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

type Ride = {
  id: string;
  quote_reference: string;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  drop_location: string;
  trip_date: string;
  trip_time: string | null;
  vehicle: string | null;
  passengers_count: number | null;
  luggage_notes: string | null;
  quoted_price: number | null;
  payment_status: string;
  driver: string | null;
  days_left: number;
  has_2d: boolean;
  has_1d: boolean;
};

type Due = Ride & { kind: "reminder_2d" | "reminder_1d" };

export async function findDueReminders(today = ksaToday()): Promise<Due[]> {
  const rows = await prisma.$queryRawUnsafe<Ride[]>(
    `SELECT q.id::text, q.quote_reference, q.customer_name, q.customer_phone, q.pickup_location, q.drop_location, q.trip_date::text,
            q.trip_time::text, q.vehicle_type_requested::text vehicle, q.passengers_count, q.luggage_notes, q.quoted_price::float, q.payment_status::text,
            COALESCE(q.driver_name, (SELECT full_name FROM drivers d WHERE d.id=q.assigned_driver_id)) driver,
            (q.trip_date - $1::date)::int days_left,
            EXISTS (SELECT 1 FROM booking_events e WHERE e.quotation_id=q.id AND e.kind='reminder_2d') has_2d,
            EXISTS (SELECT 1 FROM booking_events e WHERE e.quotation_id=q.id AND e.kind='reminder_1d') has_1d
       FROM quotations q
      WHERE q.status IN ('confirmed','assigned')
        AND COALESCE(q.is_test,false) = false
        AND q.trip_date BETWEEN $1::date AND $1::date + 2
      ORDER BY q.trip_date, q.trip_time NULLS LAST`,
    today,
  );
  const due: Due[] = [];
  for (const r of rows) {
    if (r.days_left <= 1) { if (!r.has_1d) due.push({ ...r, kind: "reminder_1d" }); }
    else if (!r.has_2d) due.push({ ...r, kind: "reminder_2d" });
  }
  return due;
}

function rideBlock(r: Due, site: string) {
  const when = `${r.trip_date}${r.trip_time ? ` · ${r.trip_time.slice(0, 5)}` : ""}`;
  const label = r.days_left <= 0 ? "TODAY" : r.days_left === 1 ? "TOMORROW" : "IN 2 DAYS";
  const wa = waLink(r.customer_phone, `Hello ${r.customer_name}, this is Taxi Saudi Arabia confirming your pickup on ${when}. Pickup: ${r.pickup_location}. Please reply to confirm.`);
  const driver = r.driver
    ? esc(r.driver)
    : `<b style="color:#B91C1C">NO DRIVER ASSIGNED YET</b>`;
  return `
  <div style="border:1px solid #E5E7EB;border-radius:10px;padding:14px 16px;margin:0 0 14px;background:#fff">
    <div style="font-size:12px;font-weight:700;color:#0F7A37;letter-spacing:.5px">${label} · ${esc(r.quote_reference)}</div>
    <div style="font-size:16px;font-weight:700;margin:4px 0">${esc(r.customer_name)} — ${esc(when)}</div>
    <table style="font-size:13px;color:#111;border-collapse:collapse">
      <tr><td style="padding:2px 12px 2px 0;color:#6B7280">Route</td><td>${esc(r.pickup_location)} → ${esc(r.drop_location)}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#6B7280">Vehicle</td><td>${esc(r.vehicle ?? "—")}${r.passengers_count ? ` · ${r.passengers_count} pax` : ""}${r.luggage_notes ? ` · ${esc(r.luggage_notes)}` : ""}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#6B7280">Driver</td><td>${driver}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#6B7280">Fare</td><td>${r.quoted_price != null ? `SAR ${r.quoted_price}` : "—"} (${esc(r.payment_status)})</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#6B7280">Client</td><td>${esc(r.customer_phone)}</td></tr>
    </table>
    <div style="margin-top:10px;font-size:13px">
      <a href="${wa}" style="color:#0F7A37;font-weight:700">WhatsApp client</a> &nbsp;·&nbsp;
      <a href="${site}/admin/quotations/${r.id}" style="color:#0F7A37;font-weight:700">Open booking</a>
    </div>
  </div>`;
}

export async function sendDueReminders(): Promise<{ checked: number; sent: string[]; error?: string }> {
  const due = await findDueReminders();
  if (!due.length) return { checked: 0, sent: [] };

  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taxisaudiarabia.com";
  const to = process.env.ADMIN_EMAIL || "infotaxisaudiarabia@gmail.com";
  const noDriver = due.filter((r) => !r.driver).length;
  const subject = `${noDriver ? "⚠ " : ""}Upcoming rides: ${due.map((r) => r.quote_reference).join(", ")}`;
  const html = `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:620px;margin:auto;background:#F9FAFB;padding:18px">
    <div style="background:#16A34A;color:#FACC15;font-weight:800;font-size:18px;padding:12px 16px;border-radius:10px 10px 0 0">TSA — Ride reminder</div>
    <div style="padding:16px 0 0">${noDriver ? `<p style="color:#B91C1C;font-weight:700;margin:0 0 12px">${noDriver} ride(s) below still have no driver assigned.</p>` : ""}${due.map((r) => rideBlock(r, site)).join("")}</div>
  </div>`;

  const res = await sendEmailStrict(to, subject, html);
  if (!res.ok) return { checked: due.length, sent: [], error: res.error };

  for (const r of due) {
    await prisma.$executeRawUnsafe(`INSERT INTO booking_events (quotation_id, kind, detail) VALUES ($1::uuid,$2,$3)`, r.id, r.kind, `Owner reminder emailed to ${to}`);
  }
  return { checked: due.length, sent: due.map((r) => `${r.quote_reference}:${r.kind}`) };
}
