"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, RefreshCw, Home, MessageSquare } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error securely for server-side trace analyses
    console.error("🚨 [Global App Error Boundary Captured]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative luxury radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-8 md:p-10 shadow-2xl text-center space-y-6 relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] shadow-lg">
          <AlertOctagon className="h-6 w-6" />
        </div>

        <div className="space-y-2 pt-4">
          <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold">
            Unexpected Interruption
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-[#F5F0E8] leading-tight">
            System Route Recalibrating
          </h1>
          <p className="text-xs text-[#A1A1A6] leading-relaxed max-w-sm mx-auto">
            We encountered a temporary signal discrepancy while navigating this route. Our digital dispatch operations are fully aware and correcting the course.
          </p>
        </div>

        {/* Action controls */}
        <div className="grid gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full rounded-xl bg-[#C9A84C] py-3.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(201,168,76,0.15)]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Re-Route System (Try Again)</span>
          </button>

          <Link
            href="/"
            className="w-full rounded-xl border border-white/5 bg-black/40 py-3.5 text-xs font-bold uppercase tracking-wider text-[#A1A1A6] hover:text-[#F5F0E8] hover:bg-black/60 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Return to Fleet Hub</span>
          </Link>
        </div>

        <div className="border-t border-[#C9A84C]/10 pt-6">
          <p className="text-[10px] text-[#7C8088] leading-relaxed">
            Need urgent assistance booking or managing a dispatch? Reach out to our 24/7 VIP Concierge Desk immediately:
          </p>
          <a
            href="https://wa.me/966539388072"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 inline-flex items-center gap-2 text-xs font-bold text-[#C9A84C] hover:underline"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Contact Chauffeur Support</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
