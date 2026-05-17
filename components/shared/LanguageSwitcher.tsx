"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage, type Language } from "@/lib/context/LanguageContext";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "ur", name: "اردو", flag: "🇵🇰" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div ref={dropdownRef} className={cn("relative z-50", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-border/80 bg-black/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#F5F0E8] transition-all duration-300 hover:border-[#C9A84C] hover:text-[#C9A84C] focus:outline-none"
      >
        <Globe className="h-3.5 w-3.5 text-[#C9A84C]" />
        <span>
          {currentLang.flag} {currentLang.code}
        </span>
        <ChevronDown
          className={cn("h-3 w-3 transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-border/80 bg-[#121212] shadow-2xl backdrop-blur-md"
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-medium transition-colors hover:bg-black/50 hover:text-[#C9A84C]",
                    language === lang.code ? "text-[#C9A84C] bg-black/20" : "text-[#F5F0E8]"
                  )}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="font-sans">{lang.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
