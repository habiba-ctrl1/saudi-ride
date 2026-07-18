"use client";

import { motion } from "framer-motion";
import { Calendar, Lock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function PrivacyPolicyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pt-28 pb-16">
      <section className="section-container max-w-4xl">
        
        {/* Header Hero */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="border-b border-[#16A34A]/12 pb-8 mb-10"
        >
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B8963B] font-semibold">
            <Lock className="h-3 w-3" /> Legal & Privacy
          </span>
          <h1 className="mt-4 font-heading text-3xl md:text-4.5xl font-bold text-[#1C1C1C]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xs text-[#6B7280] font-medium flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-[#C9A84C]" />
            <span>Last Updated: January 1, {currentYear}</span>
          </p>
        </motion.div>

        {/* Content body */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8 text-xs md:text-sm leading-relaxed text-[#6B7280] font-sans"
        >
          
          <section className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#1C1C1C] flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              <span>1. Overview & Scope</span>
            </h2>
            <p>
              At Taxi Saudi Arabia, we respect and safeguard the privacy of our distinguished corporate clients, executive passengers, and pilgrims. This Privacy Policy details how we collect, process, and protect your personal information when you use our online reservation consoles, mobile portals, and private chauffeur dispatch channels across the Kingdom of Saudi Arabia.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#1C1C1C] flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              <span>2. Personal Information We Collect</span>
            </h2>
            <p>
              To ensure an absolute standard of executive mobility, we collect specific details when you book a transfer:
            </p>
            <ul className="list-disc pl-5 space-y-2 border-l border-[#16A34A]/12 ml-2.5">
              <li><strong>Contact Information:</strong> Full name, official corporate email address, and verified phone/WhatsApp number.</li>
              <li><strong>Travel Details:</strong> Pick-up coordinates, destination addresses, flight schedules, flight numbers, and specific luggage counts.</li>
              <li><strong>Payment Profiles:</strong> Credit card hashes, transactional references, and VAT invoice parameters securely routed through certified payment aggregators.</li>
              <li><strong>User Preferences:</strong> Selected language (English, Arabic, Urdu), favorite vehicle classes, and private concierge notes.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#1C1C1C] flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              <span>3. How We Process Personal Data</span>
            </h2>
            <p>
              Your data is processed in strict compliance with the Saudi Arabian Personal Data Protection Law (PDPL):
            </p>
            <ul className="list-disc pl-5 space-y-2 border-l border-[#16A34A]/12 ml-2.5">
              <li>To schedule dispatch operations and ensure chauffeurs arrive punctually.</li>
              <li>To compile digital invoices in accordance with ZATCA electronic billing directives.</li>
              <li>To communicate real-time travel logistics, SMS arrival alerts, and driver profiles.</li>
              <li>To credit loyalty tier bonuses and program referrals.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#1C1C1C] flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              <span>4. Data Security & Storage</span>
            </h2>
            <p>
              We implement industry-grade technical and organizational protection layers to safeguard your information against unauthorized access, loss, or leakage. Transactional operations are processed over secure SSL connections. We never sell, lease, or distribute private client records to third-party marketing companies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#1C1C1C] flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              <span>5. Passenger Rights</span>
            </h2>
            <p>
              Under Saudi Arabian privacy legislation, you maintain full right to access your stored profiles, request data corrections, demand erasure, or opt-out of notifications at any point. To execute your privacy rights, please reach out to our concierge legal desk at <a href="mailto:infotaxisaudiarabia@gmail.com" className="text-[#C9A84C] font-semibold underline">infotaxisaudiarabia@gmail.com</a>.
            </p>
          </section>

        </motion.div>
      </section>
    </div>
  );
}
