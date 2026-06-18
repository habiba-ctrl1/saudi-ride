"use client";

import Link from "next/link";
import { MoveLeft, HelpCircle, MapPin, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* ─── Radial Backdrop Glows ─── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#C9A84C]/3 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A84C_1px,transparent_1px),linear-gradient(to_bottom,#C9A84C_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.02] pointer-events-none" />

      <div className="text-center max-w-xl relative z-10 space-y-8">
        {/* Glowing compass icon */}
        <div className="flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#111] shadow-[0_0_30px_rgba(201,168,76,0.15)] animate-pulse">
            <Compass className="h-10 w-10 text-[#C9A84C]" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">
            Error 404 · Page Not Found
          </p>
          <h1 className="font-heading text-4xl font-bold md:text-5xl tracking-tight text-[#F5F0E8]">
            Lost in Transit
          </h1>
          <p className="text-sm text-[#A1A1A6] leading-relaxed max-w-md mx-auto">
            The page you are looking for has been moved, renamed, or is temporarily unavailable. Let us guide you back to your destination.
          </p>
        </div>

        {/* Bilingual Quick Help Links */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4">
          <Link
            href="/book"
            className="flex flex-col items-center justify-center rounded-2xl border border-[#C9A84C]/15 bg-black/40 p-4 hover:border-[#C9A84C]/45 hover:bg-[#1A1813]/20 transition-all group"
          >
            <MapPin className="h-5 w-5 text-[#C9A84C] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#F5F0E8]">Book Transfer</span>
            <span className="text-[0.55rem] text-[#7C8088] mt-0.5">احجز رحلة</span>
          </Link>

          <Link
            href="/contact"
            className="flex flex-col items-center justify-center rounded-2xl border border-[#C9A84C]/15 bg-black/40 p-4 hover:border-[#C9A84C]/45 hover:bg-[#1A1813]/20 transition-all group"
          >
            <HelpCircle className="h-5 w-5 text-[#C9A84C] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#F5F0E8]">Get Help</span>
            <span className="text-[0.55rem] text-[#7C8088] mt-0.5">الدعم الفني</span>
          </Link>
        </div>

        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
          >
            <MoveLeft className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
