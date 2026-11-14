"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard load failed:", error);
  }, [error]);

  const isDbError =
    error.message?.includes("reach database") ||
    error.message?.includes("P1001") ||
    error.message?.toLowerCase().includes("connect");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-amber-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">
        {isDbError ? "Database abhi connect nahi ho payi" : "Kuch ghalat ho gaya"}
      </h2>
      <p className="text-sm text-gray-500 mt-2 max-w-md">
        {isDbError
          ? "Server thori der ke liye database tak nahi pahunch paya (aksar Supabase ke 'wake up' hone ka intezaar). Neeche button dabayein, dobara try ho jayegi."
          : "Page load karte waqt error aaya. Dobara koshish karein."}
      </p>
      <button
        onClick={reset}
        className="mt-5 inline-flex items-center gap-2 bg-[#C9A84C] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#b8963b] transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Dobara try karein
      </button>
    </div>
  );
}
