"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, Loader2 } from "lucide-react";

const VEHICLE_TYPES = ["SEDAN", "SUV", "VAN", "LUXURY", "BUS"];
const inputClass = "rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]";

export function AddVehicleForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", nameAr: "", type: "SEDAN", capacity: "", luggage: "", pricePerKm: "", basePrice: "",
  });

  function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile) {
      setError("Please choose a photo for this vehicle");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const uploadBody = new FormData();
      uploadBody.append("file", imageFile);
      const uploadRes = await fetch("/api/admin/vehicles/upload-image", { method: "POST", body: uploadBody });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        setError(uploadData.error || "Image upload failed");
        return;
      }

      const res = await fetch("/api/admin/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          nameAr: form.nameAr || form.name,
          type: form.type,
          capacity: Number(form.capacity),
          luggage: form.luggage ? Number(form.luggage) : 3,
          pricePerKm: Number(form.pricePerKm),
          basePrice: Number(form.basePrice),
          image: uploadData.url,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create vehicle");
        return;
      }

      setForm({ name: "", nameAr: "", type: "SEDAN", capacity: "", luggage: "", pricePerKm: "", basePrice: "" });
      setImageFile(null);
      setImagePreview(null);
      setOpen(false);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-[#B8963B] transition-colors w-fit"
      >
        <Plus className="h-4 w-4" /> {open ? "Cancel" : "Add Vehicle"}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-5 grid gap-3 sm:grid-cols-3">
          <input required placeholder="Name (e.g. Toyota Camry)" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} />
          <input placeholder="Name (Arabic) — optional" value={form.nameAr} onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))} className={inputClass} />
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className={inputClass}>
            {VEHICLE_TYPES.map((t) => <option key={t} value={t} className="bg-[#121212]">{t}</option>)}
          </select>
          <input required type="number" min={1} placeholder="Capacity (pax)" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} className={inputClass} />
          <input type="number" min={0} placeholder="Luggage" value={form.luggage} onChange={(e) => setForm((f) => ({ ...f, luggage: e.target.value }))} className={inputClass} />
          <input required type="number" min={0} placeholder="Price/km (SAR)" value={form.pricePerKm} onChange={(e) => setForm((f) => ({ ...f, pricePerKm: e.target.value }))} className={inputClass} />
          <input required type="number" min={0} placeholder="Base price (SAR)" value={form.basePrice} onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))} className={inputClass} />

          <label className="sm:col-span-3 flex items-center gap-3 text-xs text-[#A1A1A6]">
            <span className="flex items-center gap-1.5 rounded-lg border border-dashed border-[#333] px-3 py-2 cursor-pointer hover:border-[#C9A84C]/40">
              <Upload className="h-3.5 w-3.5" /> {imageFile ? imageFile.name : "Choose photo (JPEG/PNG/WebP, max 8MB)"}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickImage} className="hidden" />
            </span>
            {imagePreview && <img src={imagePreview} alt="Preview" className="h-14 w-20 rounded object-cover border border-[#333]" />}
          </label>

          {error && <p className="sm:col-span-3 text-xs text-red-400">{error}</p>}

          <div className="sm:col-span-3">
            <button disabled={saving} type="submit" className="rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-4 py-2.5 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40 inline-flex items-center gap-2">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} {saving ? "Uploading & creating…" : "Create Vehicle"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
