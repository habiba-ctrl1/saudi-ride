"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+966500123456";
  
  // Format phone number for deep link: remove spaces, symbols, keep only digits and +
  const formattedNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent("Hello, I would like to book a VIP transfer with Riyadh Luxe Taxi.");
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedText}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
      {/* Premium Custom Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="mr-3 hidden rounded-lg border border-[#C9A84C]/30 bg-[#121212] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#C9A84C] shadow-2xl backdrop-blur-md md:block"
          >
            Book via WhatsApp
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pulse Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgb(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgb(37,211,102,0.6)]"
        aria-label="Book via WhatsApp"
      >
        {/* Pulse Ring 1 */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30"></span>
        
        {/* Pulse Ring 2 (Luxury slow pulsing gold ring) */}
        <span className="absolute inline-flex h-full w-full animate-pulse rounded-full border-2 border-[#C9A84C] opacity-40"></span>

        {/* WhatsApp Icon SVG */}
        <svg
          className="h-7 w-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.008 14.056.979 11.44.979c-5.437 0-9.863 4.374-9.869 9.803-.002 1.718.455 3.393 1.324 4.882l-.99 3.619 3.71-.973c1.45.79 3.09 1.205 4.673 1.205l.004-.002zm11.238-7.798c-.3-.15-1.772-.875-2.046-.975-.276-.1-.476-.15-.677.15-.202.3-.777.975-.952 1.175-.177.2-.352.225-.652.075-.3-.15-1.265-.467-2.41-1.485-.89-.794-1.49-1.775-1.665-2.075-.175-.3-.019-.463.13-.612.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.927-2.235-.245-.589-.49-.509-.677-.509-.175-.001-.375-.001-.575-.001-.2 0-.525.075-.8.375-.276.3-1.052 1.025-1.052 2.5s1.077 2.9 1.227 3.1c.15.2 2.12 3.235 5.136 4.536.717.31 1.277.495 1.711.633.721.23 1.377.198 1.896.121.578-.088 1.773-.725 2.022-1.425.249-.7 2.49-3.5 2.49-3.5-.175-.075-.35-.15-.65-.3zm0 0" />
        </svg>
      </a>
    </div>
  );
}
