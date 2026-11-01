"use client";

import { useCallback, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import type { RateRow, RideRow, PaymentRow } from "@/lib/vendor/ledger";

type Data = { rides: RideRow[]; rates: RateRow[]; payments: PaymentRow[]; totals: { totalProfit: number; received: number; balance: number; missingCost: number } };
type Run = (p: Promise<string | null>) => Promise<boolean>;

const sar = (n: number | null) => (n === null ? "—" : `${n < 0 ? "-" : ""}${Math.abs(Math.round(n)).toLocaleString("en-US")}`);
const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600";
const btnCls = "min-h-[44px] px-4 rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 disabled:opacity-60";

async function call(url: string, method: string, body?: unknown): Promise<string | null> {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  if (r.ok) return null;
  return (await r.json().catch(() => ({}))).error || "Something went wrong";
}

export default function VendorClient({ role }: { role: "ADMIN" | "VENDOR" }) {
  const isAdmin = role === "ADMIN";
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const r = await fetch("/api/vendor", { cache: "no-store" });
    if (r.status === 401 || r.status === 403) { window.location.href = "/vendor/login"; return; }
    setData(await r.json());
  }, []);
  useEffect(() => { load(); }, [load]);

  const run: Run = async (p) => { const e = await p; setErr(e ?? ""); if (!e) await load(); return !e; };

  if (!data) return <div className="min-h-screen bg-gray-50 p-6 text-sm text-gray-500">Loading…</div>;
  const t = data.totals;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">Vendor Portal</h1>
            <p className="text-xs text-gray-500">{isAdmin ? "Owner view" : "Vendor view"} · amounts in SAR</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/vendor/login" })} className="min-h-[44px] px-3 text-sm text-gray-600 underline">Sign out</button>
        </header>

        {err && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{err}</div>}

        <section className="grid grid-cols-3 gap-3">
          <Card label="Total profit" value={sar(t.totalProfit)} />
          <Card label="Paid so far" value={sar(t.received)} />
          <Card label="Balance due" value={sar(t.balance)} accent />
        </section>
        {t.missingCost > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm text-yellow-900">
            {t.missingCost} ride(s) have no cost yet, so their profit is not counted. Set the cost on those rides below.
          </div>
        )}

        <Rides data={data} run={run} />
        <Payments payments={data.payments} run={run} />
        <Rates rates={data.rates} run={run} />
        {isAdmin && <AddRide run={run} />}
      </div>
    </div>
  );
}

function Card({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 sm:p-4 ${accent ? "bg-yellow-50 border-yellow-300" : "bg-white border-gray-200"}`}>
      <div className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-lg sm:text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

function Rides({ data, run }: { data: Data; run: Run }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <h2 className="px-4 py-3 font-semibold border-b border-gray-100">Rides ({data.rides.length})</h2>
      <p className="px-4 py-2 text-xs text-gray-500">Enter the actual driver/vendor cost for each ride. Leave it empty to use the route cost below. Profit = quoted amount − cost. VAT is charged on top and is not part of profit.</p>
      <div className="divide-y divide-gray-100">
        {data.rides.map((r) => <RideItem key={r.id} r={r} run={run} />)}
      </div>
    </section>
  );
}

function RideItem({ r, run }: { r: RideRow; run: Run }) {
  const initial = r.vendor_cost === null ? "" : String(r.vendor_cost);
  const [cost, setCost] = useState(initial);
  const dirty = cost !== initial;
  const save = () => run(call(`/api/vendor/rides/${r.id}`, "PATCH", { vendor_cost: cost.trim() === "" ? null : Number(cost) }));
  const hint = r.cost_source === "rate" ? `Route cost ${sar(r.rate_cost)}` : r.cost_source === "missing" ? "No route cost — enter cost" : "";
  return (
    <div className="px-4 py-3 grid gap-2 sm:grid-cols-[2.5rem_1fr_9rem_6rem] sm:items-center">
      <div className="text-xs font-semibold text-gray-400">#{r.ride_no}</div>
      <div className="min-w-0">
        <div className="font-medium text-sm">{r.route}</div>
        <div className="text-xs text-gray-500 break-words">
          {r.date_label || "—"} · {r.client_phone || "no number"} · Quoted {sar(r.quoted_amount)}{r.vat ? " + VAT" : ""}
        </div>
        {r.note && <div className="text-xs text-yellow-800 mt-0.5">{r.note}</div>}
      </div>
      <div>
        <div className="flex gap-1">
          <input inputMode="decimal" className={inputCls} placeholder={r.rate_cost !== null ? String(r.rate_cost) : "Cost"} value={cost}
            onChange={(e) => setCost(e.target.value)} onKeyDown={(e) => e.key === "Enter" && dirty && save()} aria-label={`Cost for ride ${r.ride_no}`} />
          {dirty && <button onClick={save} className="px-3 rounded-lg bg-green-600 text-white text-sm font-semibold">Save</button>}
        </div>
        {hint && <div className="text-[11px] text-gray-500 mt-1">{hint}</div>}
      </div>
      <div className="sm:text-right">
        <div className="text-[11px] text-gray-500 uppercase sm:hidden">Profit</div>
        <div className={`font-bold ${r.profit === null ? "text-gray-400" : r.profit < 0 ? "text-red-600" : "text-green-700"}`}>{sar(r.profit)}</div>
      </div>
    </div>
  );
}

function Payments({ payments, run }: { payments: PaymentRow[]; run: Run }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const add = async () => {
    if (await run(call("/api/vendor/payments", "POST", { amount: Number(amount), paid_at: date, note }))) { setAmount(""); setDate(""); setNote(""); }
  };
  return (
    <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <h2 className="px-4 py-3 font-semibold border-b border-gray-100">Payments made</h2>
      <div className="p-4 grid gap-2 sm:grid-cols-[8rem_9rem_1fr_auto] border-b border-gray-100">
        <input inputMode="decimal" className={inputCls} placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        <input className={inputCls} placeholder="Note (e.g. rides 9-15)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className={btnCls} disabled={!amount} onClick={add}>Add payment</button>
      </div>
      <div className="divide-y divide-gray-100">
        {payments.length === 0 && <p className="px-4 py-3 text-sm text-gray-500">No payments yet.</p>}
        {payments.map((p) => (
          <div key={p.id} className="px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
            <div className="min-w-0"><span className="font-semibold">{sar(p.amount)}</span> <span className="text-gray-500">· {p.paid_at || "no date"}{p.note ? ` · ${p.note}` : ""}</span></div>
            <button className="text-xs text-red-600 underline min-h-[44px]" onClick={() => confirm("Remove this payment?") && run(call(`/api/vendor/payments/${p.id}`, "DELETE"))}>Remove</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Rates({ rates, run }: { rates: RateRow[]; run: Run }) {
  const [label, setLabel] = useState("");
  const [cost, setCost] = useState("");
  const add = async () => {
    if (await run(call("/api/vendor/rates", "PUT", { label, cost: Number(cost) }))) { setLabel(""); setCost(""); }
  };
  return (
    <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <h2 className="px-4 py-3 font-semibold border-b border-gray-100">Route costs</h2>
      <p className="px-4 py-2 text-xs text-gray-500">Same cost both directions. Changing a route cost affects rides that have no cost of their own; rides where a cost was entered stay as they are.</p>
      <div className="divide-y divide-gray-100">{rates.map((r) => <RateItem key={r.route_key} r={r} run={run} />)}</div>
      <div className="p-4 grid gap-2 sm:grid-cols-[1fr_8rem_auto] border-t border-gray-100">
        <input className={inputCls} placeholder="New route, e.g. Riyadh ↔ Jeddah" value={label} onChange={(e) => setLabel(e.target.value)} />
        <input inputMode="decimal" className={inputCls} placeholder="Cost" value={cost} onChange={(e) => setCost(e.target.value)} />
        <button className={btnCls} disabled={!label || !cost} onClick={add}>Add route</button>
      </div>
    </section>
  );
}

function RateItem({ r, run }: { r: RateRow; run: Run }) {
  const [cost, setCost] = useState(String(r.cost));
  const dirty = cost !== String(r.cost);
  return (
    <div className="px-4 py-2.5 flex items-center justify-between gap-3">
      <span className="text-sm">{r.label}</span>
      <div className="flex gap-1 w-44">
        <input inputMode="decimal" className={inputCls} value={cost} onChange={(e) => setCost(e.target.value)} aria-label={`Cost for ${r.label}`} />
        {dirty && <button className="px-3 rounded-lg bg-green-600 text-white text-sm font-semibold" onClick={() => run(call("/api/vendor/rates", "PUT", { route_key: r.route_key, label: r.label, cost: Number(cost) }))}>Save</button>}
      </div>
    </div>
  );
}

function AddRide({ run }: { run: Run }) {
  const empty = { route: "", client_phone: "", quoted_amount: "", date_label: "", vat: false };
  const [f, setF] = useState(empty);
  const add = async () => {
    if (await run(call("/api/vendor/rides", "POST", { ...f, quoted_amount: Number(f.quoted_amount) }))) setF(empty);
  };
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <h2 className="font-semibold">Add a ride (owner only)</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        <input className={inputCls} placeholder="Route, e.g. Riyadh → Doha" value={f.route} onChange={(e) => setF({ ...f, route: e.target.value })} />
        <input className={inputCls} placeholder="Client number" value={f.client_phone} onChange={(e) => setF({ ...f, client_phone: e.target.value })} />
        <input inputMode="decimal" className={inputCls} placeholder="Amount quoted" value={f.quoted_amount} onChange={(e) => setF({ ...f, quoted_amount: e.target.value })} />
        <input className={inputCls} placeholder="Date (e.g. 3 Nov)" value={f.date_label} onChange={(e) => setF({ ...f, date_label: e.target.value })} />
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.vat} onChange={(e) => setF({ ...f, vat: e.target.checked })} /> VAT charged on top</label>
      <button className={btnCls} disabled={!f.route || !f.quoted_amount} onClick={add}>Add ride</button>
    </section>
  );
}
