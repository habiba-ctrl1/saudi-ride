"use client";

// Shared editable lead form body (used by Paste review, Add manually and the lead detail page).
export type LeadDraft = {
  customer_name: string; customer_phone: string; customer_email: string; language: string;
  pickup: string; dropoff: string; trip_date: string; trip_time: string; trip_type: string;
  passengers: string; luggage: string; vehicle: string; budget_text: string; prior_quote_text: string; preferences: string; notes: string;
};

export const emptyDraft: LeadDraft = {
  customer_name: "", customer_phone: "", customer_email: "", language: "", pickup: "", dropoff: "", trip_date: "", trip_time: "", trip_type: "",
  passengers: "", luggage: "", vehicle: "", budget_text: "", prior_quote_text: "", preferences: "", notes: "",
};

const input = "w-full rounded-lg border bg-black/40 px-3 py-2 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]";
const label = "mb-1 block text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]";

type Spec = { k: keyof LeadDraft; label: string; type?: string; options?: [string, string][]; wide?: boolean; required?: boolean; area?: boolean };

const SPECS: Spec[] = [
  { k: "customer_name", label: "Name", required: true },
  { k: "customer_phone", label: "Phone / WhatsApp", required: true },
  { k: "customer_email", label: "Email", type: "email" },
  { k: "language", label: "Language", options: [["", "—"], ["en", "English"], ["ar", "Arabic"]] },
  { k: "pickup", label: "Pickup", required: true },
  { k: "dropoff", label: "Drop-off", required: true },
  { k: "trip_date", label: "Date", type: "date", required: true },
  { k: "trip_time", label: "Time", type: "time", required: true },
  { k: "trip_type", label: "Trip type", options: [["", "—"], ["one_way", "One way"], ["round_trip", "Round trip"], ["airport_transfer", "Airport transfer"], ["hourly", "Hourly"], ["multi_day", "Multi-day"], ["event", "Event"]] },
  { k: "passengers", label: "Passengers", type: "number", required: true },
  { k: "luggage", label: "Luggage" },
  { k: "vehicle", label: "Vehicle", options: [["", "—"], ["sedan", "Sedan"], ["suv", "SUV"], ["van", "Van"], ["bus", "Bus / coaster"], ["limousine", "Limousine"]], required: true },
  { k: "budget_text", label: "Budget (as stated)" },
  { k: "prior_quote_text", label: "Prices already quoted" },
  { k: "preferences", label: "Preferences", wide: true },
  { k: "notes", label: "Notes", wide: true, area: true },
];

export function LeadFields({ value, onChange }: { value: LeadDraft; onChange: (v: LeadDraft) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {SPECS.map((s) => {
        const empty = !value[s.k].trim();
        const flag = s.required && empty;
        const cls = `${input} ${flag ? "border-orange-500/60" : "border-[#333]"}`;
        const set = (v: string) => onChange({ ...value, [s.k]: v });
        return (
          <label key={s.k} className={s.wide ? "sm:col-span-2 lg:col-span-3" : ""}>
            <span className={label}>{s.label}{flag && <span className="ml-2 normal-case tracking-normal text-orange-400">missing</span>}</span>
            {s.options ? (
              <select className={cls} value={value[s.k]} onChange={(e) => set(e.target.value)}>{s.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            ) : s.area ? (
              <textarea className={cls} rows={3} value={value[s.k]} onChange={(e) => set(e.target.value)} />
            ) : (
              <input className={cls} type={s.type ?? "text"} min={s.type === "number" ? 1 : undefined} value={value[s.k]} onChange={(e) => set(e.target.value)} />
            )}
          </label>
        );
      })}
    </div>
  );
}

/** Draft → API payload (blank strings become null; passengers number). */
export function draftToPayload(d: LeadDraft) {
  const o: Record<string, string | number | null> = {};
  for (const [k, v] of Object.entries(d)) o[k] = v.trim() === "" ? null : v.trim();
  o.passengers = d.passengers.trim() === "" ? null : Number(d.passengers);
  return o;
}
