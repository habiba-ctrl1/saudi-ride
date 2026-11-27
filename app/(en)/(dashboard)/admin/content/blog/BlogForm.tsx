"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type BlogFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published: boolean;
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function BlogForm({ initial }: { initial?: BlogFormValues }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [values, setValues] = useState<BlogFormValues>(
    initial ?? { title: "", slug: "", excerpt: "", content: "", category: "", author: "Taxi Saudi Arabia Team", published: false }
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(isEdit ? `/api/admin/blog/${initial!.id}` : "/api/admin/blog", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      router.push("/admin/content/blog");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-1 w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2.5 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <label className="block text-xs text-[#A1A1A6]">
        Title
        <input
          required
          value={values.title}
          onChange={(e) => {
            set("title", e.target.value);
            if (!slugTouched) set("slug", slugify(e.target.value));
          }}
          className={inputClass}
        />
      </label>
      <label className="block text-xs text-[#A1A1A6]">
        Slug
        <input
          required
          value={values.slug}
          onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }}
          className={`${inputClass} font-mono`}
        />
      </label>
      <label className="block text-xs text-[#A1A1A6]">
        Category
        <input required value={values.category} onChange={(e) => set("category", e.target.value)} className={inputClass} />
      </label>
      <label className="block text-xs text-[#A1A1A6]">
        Author
        <input required value={values.author} onChange={(e) => set("author", e.target.value)} className={inputClass} />
      </label>
      <label className="block text-xs text-[#A1A1A6]">
        Excerpt
        <textarea required rows={2} value={values.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inputClass} />
      </label>
      <label className="block text-xs text-[#A1A1A6]">
        Content
        <textarea required rows={14} value={values.content} onChange={(e) => set("content", e.target.value)} className={`${inputClass} font-mono text-xs`} />
      </label>
      <label className="flex items-center gap-2 text-xs text-[#A1A1A6]">
        <input type="checkbox" checked={values.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 accent-[#C9A84C]" />
        Published (visible on the public site)
      </label>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          disabled={saving}
          type="submit"
          className="rounded-lg bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-5 py-2.5 hover:bg-[#B8963B] disabled:opacity-40"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/content/blog")}
          className="rounded-lg border border-[#333] text-[#A1A1A6] text-xs uppercase tracking-wider px-5 py-2.5 hover:border-[#C9A84C]/40"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
