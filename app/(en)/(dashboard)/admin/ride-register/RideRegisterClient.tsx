"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type RegisterRow = {
  id: string; quote_reference: string; customer_name: string; customer_phone: string; customer_email: string | null;
  pickup_location: string; drop_location: string; trip_date: string; trip_time: string | null; vehicle: string | null;
  status: string; quoted_price: number | null; actual_amount_paid: number | null; currency: string; payment_method_used: string | null;
  driver_name: string; receipt_sent_at: string | null; receipt_emailed: boolean;
};

async function call(url: string, method: string, body: unknown) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
  return j;
}

function Row({ r, onDone }: { r: RegisterRow; onDone: () => void }) {
  const [email, setEmail] = useState(r.customer_email ?? "");
  const [amount, setAmount] = useState(String(r.actual_amount_paid ?? r.quoted_price ?? ""));
  const [method, setMethod] = useState(r.payment_method_used ?? "Cash");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const done = r.receipt_emailed;

  async function run() {
    const amt = Number(amount);
    if (!amount.trim() || !Number.isFinite(amt) || amt <= 0) return setMsg({ ok: false, text: "Enter the amount actually paid" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setMsg({ ok: false, text: "Valid email required" });
    if (!window.confirm(`Ride completed? Send receipt + thank-you to ${r.customer_name} (${email.trim()}) for ${amt} ${r.currency}?`)) return;
    setBusy(true); setMsg(null);
    try {
      if (email.trim() !== (r.customer_email ?? "")) await call(`/api/admin/quotations/${r.id}/contact`, "PATCH", { customer_email: email.trim() });
      if (r.status !== "completed") await call(`/api/quotations/${r.id}`, "PATCH", { status: "completed" });
      await call(`/api/admin/quotations/${r.id}/finance`, "PATCH", { actual_amount_paid: amt, payment_method_used: method, payment_status: "paid" });
      await call(`/api/admin/quotations/${r.id}/send`, "POST", { template: "receipt" });
      setMsg({ ok: true, text: "Receipt sent ✓" });
      onDone();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Failed" });
    } finally { setBusy(false); }
  }

  const badge = r.status === "completed" ? "bg-green-100 text-green-800" : r.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-800";
  return (
    <tr className="border-t align-top">
      <td className="p-2 whitespace-nowrap"><div className="font-medium">{r.trip_date}</div><div className="text-xs text-gray-500">{r.trip_time ?? "—"}</div></td>
      <td className="p-2"><div className="font-medium">{r.customer_name}</div><div className="text-xs text-gray-500">{r.customer_phone}</div><div className="text-xs text-gray-400">{r.quote_reference}</div></td>
      <td className="p-2 text-sm">{r.pickup_location} <span className="text-gray-400">→</span> {r.drop_location}<div className="text-xs text-gray-500">{r.vehicle ?? ""}{r.driver_name ? ` · ${r.driver_name}` : ""}</div></td>
      <td className="p-2"><span className={`px-2 py-0.5 rounded text-xs ${badge}`}>{r.status}</span>{done && <div className="text-xs text-green-700 mt-1">Receipt emailed ✓</div>}</td>
      <td className="p-2 whitespace-nowrap text-sm">{r.quoted_price != null ? `${r.quoted_price} ${r.currency}` : <span className="text-red-600">no price</span>}</td>
      <td className="p-2"><input className="border rounded px-2 py-1 w-52 text-sm" placeholder="client@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} /></td>
      <td className="p-2 whitespace-nowrap">
        <input className="border rounded px-2 py-1 w-20 text-sm" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={busy} />
        <select className="border rounded px-1 py-1 text-sm ml-1" value={method} onChange={(e) => setMethod(e.target.value)} disabled={busy}>
          <option>Cash</option><option>Bank transfer</option>
        </select>
      </td>
      <td className="p-2">
        {r.status === "cancelled" ? <span className="text-xs text-gray-400">cancelled</span> : (
          <button onClick={run} disabled={busy} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded min-h-[36px]">
            {busy ? "Sending…" : done ? "Resend receipt" : "Completed → Send receipt"}
          </button>
        )}
        {msg && <div className={`text-xs mt-1 ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</div>}
      </td>
    </tr>
  );
}

export function RideRegisterClient({ rows, from, to }: { rows: RegisterRow[]; from: string; to: string }) {
  const router = useRouter();
  const sent = rows.filter((r) => r.receipt_emailed).length;
  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Ride Register</h1>
        <p className="text-sm text-gray-600">Rides by trip date. Check the amount, press <b>Completed → Send receipt</b>: ride is marked completed, payment recorded, receipt PDF + thank-you emailed (BCC office). Nothing is sent without your click.</p>
      </div>
      <form className="flex flex-wrap items-end gap-2" method="get">
        <label className="text-sm">From <input type="date" name="from" defaultValue={from} className="border rounded px-2 py-1" /></label>
        <label className="text-sm">To <input type="date" name="to" defaultValue={to} className="border rounded px-2 py-1" /></label>
        <button className="border rounded px-3 py-1 text-sm">Show</button>
        <span className="text-sm text-gray-600 ml-2">{rows.length} rides · {sent} receipts emailed</span>
      </form>
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>
            <th className="p-2">Date</th><th className="p-2">Client</th><th className="p-2">Route</th><th className="p-2">Status</th><th className="p-2">Quoted</th><th className="p-2">Email</th><th className="p-2">Paid / method</th><th className="p-2">Action</th>
          </tr></thead>
          <tbody>
            {rows.map((r) => <Row key={r.id} r={r} onDone={() => router.refresh()} />)}
            {!rows.length && <tr><td colSpan={8} className="p-6 text-center text-gray-500">No rides in this range.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
