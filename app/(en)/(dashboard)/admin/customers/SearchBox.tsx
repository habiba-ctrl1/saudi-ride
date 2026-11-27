"use client";

import { useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function SearchBox({ initial }: { initial: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <input
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        setValue(v);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          const params = new URLSearchParams(searchParams.toString());
          if (v) params.set("search", v);
          else params.delete("search");
          params.delete("page");
          router.push(`${pathname}?${params.toString()}`);
        }, 400);
      }}
      placeholder="Search name / phone / email…"
      className="w-full rounded-lg border border-[#333] bg-black/40 py-2.5 pl-9 pr-3 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
    />
  );
}
