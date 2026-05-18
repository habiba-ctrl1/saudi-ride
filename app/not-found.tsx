"use client";

import { motion } from "framer-motion";
import { Compass, Car, Home, Phone, HelpCircle } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Luxurious radial backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#C9A84C08,transparent_55%)] pointer-events-none" />
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

      <div className="max-w-xl text-center space-y-8 relative z-10">
        
        {/* Large 404 with gold border circle */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="relative inline-flex h-28 w-28 items-center justify-center rounded-full border border-[#C9A84C]/35 bg-[#111111] text-[#C9A84C]"
        >
          <Compass className="h-12 w-12 animate-pulse" />
          <span className="absolute -bottom-2.5 rounded-full bg-[#C9A84C] px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#0A0A0A]">
            Lost Route
          </span>
        </motion.div>

        {/* Dynamic taxi pun header & text */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[#F5F0E8] leading-tight">
            Looks like this <span className="text-[#C9A84C]">route</span> doesn&apos;t exist.
          </h1>
          <p className="text-xs md:text-sm text-[#A1A1A6] max-w-md mx-auto leading-relaxed">
            Our luxury GPS navigator couldn&apos;t find this destination. Let&apos;s recalculate your journey and get you back on the right road.
          </p>
        </motion.div>

        {/* Primary and secondary redirection triggers */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-[#C9A84C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/book"
            className="flex items-center gap-2 rounded-xl border border-[#C9A84C]/30 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
          >
            <Car className="h-4 w-4" />
            <span>Book VIP Ride</span>
          </Link>
        </motion.div>

        {/* Suggestion list links */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-[#C9A84C]/15 pt-8 space-y-4"
        >
          <h3 className="text-[10px] uppercase tracking-widest text-[#7C8088] font-bold">Suggested Destinations</h3>
          <div className="flex flex-wrap justify-center gap-5 text-xs font-bold text-[#A1A1A6]">
            <Link href="/fleet" className="hover:text-[#C9A84C] transition-colors flex items-center gap-1">
              <Car className="h-3.5 w-3.5" />
              <span>Our Fleet</span>
            </Link>
            <Link href="/pricing" className="hover:text-[#C9A84C] transition-colors flex items-center gap-1">
              <span className="text-[#C9A84C] font-semibold">$</span>
              <span>Pricing</span>
            </Link>
            <Link href="/contact" className="hover:text-[#C9A84C] transition-colors flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              <span>Contact Concierge</span>
            </Link>
            <Link href="/faq" className="hover:text-[#C9A84C] transition-colors flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>FAQs Desk</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
