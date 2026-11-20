"use client";

import { useEffect, useState } from "react";
import { BlogCard, type BlogCardData } from "./BlogCard";

// Category chips + card grid. Every card is server-rendered on first paint
// (crawlable); the chips only hide/show client-side, and the choice is kept
// in the URL hash so a filtered view can be shared without a new indexable URL.
export function BlogGrid({
  posts,
  categories,
  allLabel,
  readLabel,
  emptyLabel,
}: {
  posts: BlogCardData[];
  categories: { key: string; label: string; count: number }[];
  allLabel: string;
  readLabel: string;
  emptyLabel: string;
}) {
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    const fromHash = decodeURIComponent(window.location.hash.replace(/^#cat-/, ""));
    if (fromHash && categories.some((c) => c.key === fromHash)) setActive(fromHash);
  }, [categories]);

  const choose = (key: string) => {
    setActive(key);
    try {
      history.replaceState(null, "", key === "all" ? window.location.pathname : `#cat-${encodeURIComponent(key)}`);
    } catch {
      /* ignore */
    }
  };

  const visible = active === "all" ? posts : posts.filter((p) => p.categoryKey === active);

  return (
    <>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none]" role="toolbar" aria-label="Filter by category">
        <div className="flex w-max gap-2">
          {[{ key: "all", label: allLabel, count: posts.length }, ...categories].map((c) => {
            const on = active === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => choose(c.key)}
                aria-pressed={on}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
                  on
                    ? "border-[#15803D] bg-[#15803D] text-white"
                    : "border-[#0F172A]/10 bg-white text-[#334155] hover:border-[#16A34A]/40 hover:text-[#15803D]"
                }`}
              >
                {c.label}
                <span className={`text-xs ${on ? "text-white/80" : "text-[#94A3B8]"}`}>{c.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-[#64748B]">{emptyLabel}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <BlogCard key={p.href} post={p} readLabel={readLabel} />
          ))}
        </div>
      )}
    </>
  );
}
