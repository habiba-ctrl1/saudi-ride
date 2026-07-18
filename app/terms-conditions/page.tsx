"use client";

import { motion } from "framer-motion";
import { Calendar, Scale } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function TermsConditionsPage() {
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
            <Scale className="h-3 w-3" /> Regulatory Framework
          </span>
          <h1 className="mt-4 font-heading text-3xl md:text-4.5xl font-bold text-[#1C1C1C]">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-xs text-[#6B7280] font-medium flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-[#C9A84C]" />
            <span>Effective Date: January 1, {currentYear}</span>
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
              <span>1. Agreement & Operational Rules</span>
            </h2>
            <p>
              By accessing the Taxi Saudi Arabia reservation portal or placing booking requests with our private dispatch desk, you agree to comply with and be bound by these Terms and Conditions. These terms operate under the regulatory guidelines established by the Saudi Transport General Authority (TGA).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#1C1C1C] flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              <span>2. Placing Reservations & Travel Fares</span>
            </h2>
            <p>
              Reservations placed through our website or direct API channels represent booking requests. Taxi Saudi Arabia reserves the right to accept or re-allocate drivers based on active fleet capacity.
            </p>
            <ul className="list-disc pl-5 space-y-2 border-l border-[#16A34A]/12 ml-2.5">
              <li><strong>Flat Rates:</strong> All quoted pricing is strictly fixed and includes VAT, toll gates, fuel, and municipal fees.</li>
              <li><strong>Tolerances & Flight Delays:</strong> We track flight landing codes. Airport pickups include a complimentary 90-minute waiting time. Non-airport pickups include 15 minutes of complimentary wait time. Additional wait time will be billed at standard hourly rates.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#1C1C1C] flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              <span>3. Modifying & Cancelling Orders</span>
            </h2>
            <p>
              To maintain the integrity of our dispatch logistics, cancellations and modifications follow a strict timeline:
            </p>
            <ul className="list-disc pl-5 space-y-2 border-l border-[#16A34A]/12 ml-2.5">
              <li>Cancellations made <strong>more than 24 hours prior</strong> to the scheduled pick-up will receive a 100% full refund with zero processing fees.</li>
              <li>Cancellations made <strong>within 24 hours</strong> of the pick-up may incur a partial or full booking cancellation fee depending on vehicle class pre-dispatches.</li>
              <li>No-shows at designated pickup coordinates after the complimentary wait time will be billed at full fare.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#1C1C1C] flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              <span>4. Passenger Conduct & Fleet Rules</span>
            </h2>
            <p>
              Taxi Saudi Arabia promotes a strictly safe, professional environment. To safeguard passengers and our pristine fleet, smoking, vaping, or consumption of illegal substances is strictly prohibited inside all vehicles. Any passenger causing direct structural or aesthetic damage to a vehicle will be held liable for complete detailing and maintenance costs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#1C1C1C] flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              <span>5. Governing Law & Jurisdictions</span>
            </h2>
            <p>
              These Terms and Conditions shall be governed by, interpreted, and enforced in accordance with the laws of the Kingdom of Saudi Arabia. Any dispute arising out of or in connection with these services shall be subject to the exclusive jurisdiction of the competent courts in Riyadh.
            </p>
          </section>

        </motion.div>
      </section>
    </div>
  );
}
