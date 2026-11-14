"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Phone, X } from "lucide-react";
import type { LocalDriver, MainDriver } from "@/lib/ops/drivers";

const sar = (n: number) => `SAR ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const input = "rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]";

export function DriversClient({ main, local, pkrRate }: { main: MainDriver[]; local: LocalDriver[]; pkrRate: number | null }) {
  const router = useRouter();
  const [tab, setTab] = useState<"main" | "local">("main");
  const [pay, setPay] = useState<MainDriver | null>(null);
  const [dir, setDir] = useState("received_from_partner");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pkr = (n: number) => (pkrRate ? ` · PKR ${Math.round(n * pkrRate).toLocaleString("en-US")}` : "");

  async function submit() {
    if (!pay) return;
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/partners/${pay.id}/settlements`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction: dir, amount: Number(amount), note }),
    });
    setBusy(false);
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error || "Failed");
    setPay(null); setAmount(""); setNote("");
    router.refresh();
  }

  const totalOutstanding = main.reduce((a, d) => a + d.outstanding, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#F5F0E8]">Drivers</h1>
          <p className="text-xs text-[#7C8088]">Main drivers get your rides and carry the profit-share ledger. Local drivers &amp; website applicants are one separate list.</p>
        </div>
        <div className="text-right text-xs text-[#A1A1A6]">
          Owed to you by main drivers: <span className={`font-bold ${totalOutstanding > 0 ? "text-yellow-500" : "text-green-500"}`}>{sar(totalOutstanding)}{pkr(totalOutstanding)}</span>
          {!pkrRate && <div className="text-yellow-500">PKR rate not set</div>}
        </div>
      </div>

      <div className="flex gap-2">
        {([["main", `Main drivers (${main.length})`], ["local", `Local & applicants (${local.length})`]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-lg text-xs font-bold border ${tab === k ? "bg-[#C9A84C]/20 border-[#C9A84C]/40 text-[#C9A84C]" : "border-[#333] text-[#A1A1A6] hover:text-[#F5F0E8]"}`}>{l}</button>
        ))}
      </div>

      {tab === "main" && (
        <div className="rounded-2xl border border-[#333] bg-[#111] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A1A] text-[0.6rem] uppercase tracking-widest text-[#7C8088]">
              <tr><th className="p-3">Driver</th><th className="p-3">Vehicle &amp; routes</th><th className="p-3">Rides</th><th className="p-3">Margin</th><th className="p-3">Your share</th><th className="p-3">Received</th><th className="p-3">Outstanding</th><th className="p-3" /></tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
              {main.map((d) => (
                <tr key={d.id} className="align-top">
                  <td className="p-3">
                    <div className="font-bold text-[#F5F0E8] text-sm">{d.name}</div>
                    {d.phone && <a href={`tel:${d.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 text-[#C9A84C]"><Phone className="h-3 w-3" />{d.phone}</a>}
                    <div className="text-[#7C8088]">default share to driver {d.default_share_pct}%</div>
                  </td>
                  <td className="p-3 max-w-xs"><div className="text-[#F5F0E8]">{d.vehicle_info}</div><div>{d.routes}</div></td>
                  <td className="p-3">{d.rides}{d.unconfirmed_rides > 0 && <div className="text-yellow-500">{d.unconfirmed_rides} need cost</div>}</td>
                  <td className="p-3 font-mono">{sar(d.margin)}{pkr(d.margin)}</td>
                  <td className="p-3 font-mono">{sar(d.owner_share)}{pkr(d.owner_share)}</td>
                  <td className="p-3 font-mono">{sar(d.received)}</td>
                  <td className={`p-3 font-mono font-bold ${d.outstanding > 0 ? "text-yellow-500" : d.outstanding < 0 ? "text-blue-400" : "text-green-500"}`}>
                    {sar(d.outstanding)}{pkr(d.outstanding)}
                    <div className="font-normal text-[0.65rem] text-[#7C8088]">{d.outstanding > 0 ? "driver owes you" : d.outstanding < 0 ? "you owe driver" : "settled"}</div>
                  </td>
                  <td className="p-3 text-right"><button className="rounded-lg border border-[#C9A84C]/40 px-3 py-1.5 font-bold text-[#C9A84C] hover:bg-[#C9A84C]/10" onClick={() => { setPay(d); setError(""); }}>Record payment</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "local" && (
        <div className="space-y-3">
          <div className="flex justify-end"><Link href="/admin/driver-applications" className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:underline">Review / approve website applications →</Link></div>
          <div className="rounded-2xl border border-[#333] bg-[#111] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1A1A1A] text-[0.6rem] uppercase tracking-widest text-[#7C8088]">
                <tr><th className="p-3">Driver</th><th className="p-3">Vehicle</th><th className="p-3">City</th><th className="p-3">Source</th><th className="p-3">Notes</th></tr>
              </thead>
              <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
                {local.map((d) => (
                  <tr key={d.key} className="align-top">
                    <td className="p-3"><div className="font-bold text-[#F5F0E8] text-sm">{d.name}</div>
                      {d.phone && <a href={`tel:${d.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 text-[#C9A84C]"><Phone className="h-3 w-3" />{d.phone}</a>}
                      {d.nationality && <div className="text-[#7C8088]">{d.nationality}</div>}</td>
                    <td className="p-3">{d.vehicle ?? "—"}</td>
                    <td className="p-3">{d.city ?? "—"}</td>
                    <td className="p-3">
                      <span className={`rounded border px-1.5 py-0.5 text-[0.6rem] font-bold uppercase ${d.source === "website_form" ? "border-blue-500/30 text-blue-400" : "border-yellow-500/30 text-yellow-500"}`}>
                        {d.source === "website_form" ? "Website form" : "Owner list"}</span>
                      {d.status && <div className="mt-1 text-[#7C8088]">{d.status}</div>}
                    </td>
                    <td className="p-3 max-w-sm">{d.note ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPay(null)}>
          <div className="w-full max-w-md rounded-2xl border border-[#333] bg-[#111] p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center"><h2 className="text-lg font-bold text-[#F5F0E8]">Record payment — {pay.name}</h2><button onClick={() => setPay(null)}><X className="h-4 w-4 text-[#A1A1A6]" /></button></div>
            <select className={`${input} w-full`} value={dir} onChange={(e) => setDir(e.target.value)}>
              <option value="received_from_partner">{pay.name} paid me</option>
              <option value="paid_to_partner">I paid {pay.name}</option>
            </select>
            <input className={`${input} w-full`} type="number" min={1} placeholder="Amount (SAR)" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input className={`${input} w-full`} placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button disabled={busy || !amount} onClick={submit} className="rounded-lg bg-[#C9A84C] px-4 py-2 text-xs font-bold text-black disabled:opacity-40">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
