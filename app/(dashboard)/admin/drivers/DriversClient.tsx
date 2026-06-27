"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Phone, Star, Car, Pencil, X, Loader2, Ban } from "lucide-react";

type DriverRow = {
  id: string;
  licenseNumber: string;
  licenseExpiry: string;
  rating: number;
  totalTrips: number;
  status: "AVAILABLE" | "ON_TRIP" | "OFFLINE" | "SUSPENDED";
  tgaCertified: boolean;
  ihramStatus: boolean;
  languages: string[];
  user: { name: string | null; email: string | null; phone: string | null } | null;
};

const STATUSES = ["AVAILABLE", "ON_TRIP", "OFFLINE", "SUSPENDED"] as const;
const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On trip",
  OFFLINE: "Offline",
  SUSPENDED: "Suspended",
};
const STATUS_COLOR: Record<string, string> = {
  AVAILABLE: "bg-green-500/10 text-green-500 border-green-500/20",
  ON_TRIP: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  OFFLINE: "bg-[#333] text-[#A1A1A6] border-[#444]",
  SUSPENDED: "bg-red-500/10 text-red-500 border-red-500/20",
};

const FILTERS = ["ALL", "AVAILABLE", "ON_TRIP", "OFFLINE", "SUSPENDED"] as const;

type FormState = {
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  languages: string;
  tgaCertified: boolean;
  ihramStatus: boolean;
};

const emptyForm: FormState = {
  name: "", phone: "", email: "", licenseNumber: "",
  licenseExpiry: "", languages: "en", tgaCertified: false, ihramStatus: false,
};

export function DriversClient({ drivers }: { drivers: DriverRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const shown = filter === "ALL" ? drivers : drivers.filter((d) => d.status === filter);

  function openAdd() {
    setMode("add"); setEditId(null); setForm(emptyForm); setError(""); setPanelOpen(true);
  }
  function openEdit(d: DriverRow) {
    setMode("edit"); setEditId(d.id); setError("");
    setForm({
      name: d.user?.name ?? "",
      phone: d.user?.phone ?? "",
      email: d.user?.email ?? "",
      licenseNumber: d.licenseNumber,
      licenseExpiry: d.licenseExpiry ? d.licenseExpiry.slice(0, 10) : "",
      languages: d.languages.join(", "),
      tgaCertified: d.tgaCertified,
      ihramStatus: d.ihramStatus,
    });
    setPanelOpen(true);
  }

  async function save() {
    setError("");
    if (!form.name.trim()) return setError("Driver name is required.");
    if (!form.licenseNumber.trim()) return setError("License number is required.");
    if (!form.licenseExpiry) return setError("License expiry date is required.");

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      licenseNumber: form.licenseNumber.trim(),
      licenseExpiry: form.licenseExpiry,
      languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
      tgaCertified: form.tgaCertified,
      ihramStatus: form.ihramStatus,
    };
    const url = mode === "add" ? "/api/admin/drivers" : `/api/admin/drivers/${editId}`;
    const method = mode === "add" ? "POST" : "PATCH";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); setSaving(false); return; }
      setPanelOpen(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(id: string, status: string) {
    setBusyId(id);
    try {
      await fetch(`/api/admin/drivers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function suspend(id: string) {
    if (!confirm("Suspend this driver? They will be marked SUSPENDED.")) return;
    setBusyId(id);
    try {
      await fetch(`/api/admin/drivers/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Driver Management</h1>
          <p className="text-[#A1A1A6] mt-1 text-sm">{drivers.length} drivers registered in the system.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-[#B8963B] transition-colors w-fit">
          <Plus className="h-4 w-4" /> Add Driver
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === f ? "bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C]" : "bg-[#111] text-[#A1A1A6] border-[#C9A84C]/15 hover:border-[#C9A84C]/40"
            }`}>
            {f === "ALL" ? "All" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {/* Cards */}
      {shown.length === 0 ? (
        <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-12 text-center">
          <Users className="h-12 w-12 text-[#7C8088] mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-[#F5F0E8] mb-2">No Drivers Found</h3>
          <p className="text-sm text-[#A1A1A6]">{filter === "ALL" ? "Add your first driver to start managing your fleet team." : "No drivers with this status."}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((d) => (
            <div key={d.id} className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6 hover:border-[#C9A84C]/30 transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] font-bold text-lg shrink-0">
                    {d.user?.name?.charAt(0).toUpperCase() || "D"}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#F5F0E8]">{d.user?.name || "Unknown"}</h3>
                    <p className="text-xs text-[#A1A1A6]">{d.licenseNumber}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded text-[0.55rem] font-bold uppercase tracking-wider border ${STATUS_COLOR[d.status]}`}>
                  {STATUS_LABEL[d.status]}
                </span>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-[#C9A84C]/10">
                <div className="flex items-center gap-3 text-sm text-[#A1A1A6]">
                  <Phone className="h-4 w-4 text-[#7C8088]" /> {d.user?.phone || "No phone"}
                </div>
                <div className="flex items-center gap-3 text-sm text-[#A1A1A6]">
                  <Star className="h-4 w-4 text-[#C9A84C]" /> {d.rating.toFixed(1)} / 5.0 Rating
                </div>
                <div className="flex items-center gap-3 text-sm text-[#A1A1A6]">
                  <Car className="h-4 w-4 text-[#7C8088]" /> {d.totalTrips} total trips
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button onClick={() => openEdit(d)} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A84C] uppercase tracking-wider hover:text-[#B8963B] transition-colors">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <div className="flex items-center gap-2">
                  <select value={d.status} disabled={busyId === d.id}
                    onChange={(e) => changeStatus(d.id, e.target.value)}
                    className="bg-[#0A0A0A] border border-[#C9A84C]/30 text-[#F5F0E8] text-xs rounded-md px-2 py-1.5 focus:outline-none focus:border-[#C9A84C]">
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                  </select>
                  <button onClick={() => suspend(d.id)} disabled={busyId === d.id} title="Suspend"
                    className="text-[#7C8088] hover:text-red-500 transition-colors disabled:opacity-40">
                    {busyId === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over panel */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setPanelOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0D0D0D] border-l border-[#C9A84C]/20 z-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-[#F5F0E8]">{mode === "add" ? "Add Driver" : "Edit Driver"}</h2>
              <button onClick={() => setPanelOpen(false)} className="text-[#7C8088] hover:text-[#F5F0E8]"><X className="h-5 w-5" /></button>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

            <div className="space-y-4">
              <Field label="Full name *"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mohammed Khalid" className={inputCls} /></Field>
              <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+966 5X XXX XXXX" className={inputCls} /></Field>
              <Field label="Email"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="driver@email.com" className={inputCls} /></Field>
              <Field label="License number *"><input value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} placeholder="e.g. KSA-123456" className={inputCls} /></Field>
              <Field label="License expiry *"><input type="date" value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} className={inputCls} /></Field>
              <Field label="Languages (comma separated)"><input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} placeholder="en, ar, ur" className={inputCls} /></Field>
              <label className="flex items-center gap-2 text-sm text-[#A1A1A6]">
                <input type="checkbox" checked={form.tgaCertified} onChange={(e) => setForm({ ...form, tgaCertified: e.target.checked })} className="accent-[#C9A84C]" /> TGA certified (tourism)
              </label>
              <label className="flex items-center gap-2 text-sm text-[#A1A1A6]">
                <input type="checkbox" checked={form.ihramStatus} onChange={(e) => setForm({ ...form, ihramStatus: e.target.checked })} className="accent-[#C9A84C]" /> Ihram-ready (Umrah)
              </label>

              <button onClick={save} disabled={saving} className="w-full inline-flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold text-sm py-3 rounded-lg hover:bg-[#B8963B] transition-colors disabled:opacity-60">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : mode === "add" ? "Add Driver" : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const inputCls = "w-full bg-[#0A0A0A] border border-[#C9A84C]/30 text-[#F5F0E8] text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] placeholder:text-[#555]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#A1A1A6] uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}
