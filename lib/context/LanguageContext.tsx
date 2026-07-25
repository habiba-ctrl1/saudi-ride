"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AR_AVAILABLE_ROUTES } from "@/lib/config/i18n";

export type Language = "en" | "ar";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function isArabicPath(pathname: string | null) {
  return !!pathname && (pathname === "/ar" || pathname.startsWith("/ar/"));
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Lazy initializer runs on the very first render (server AND client), so a
  // request for /ar/x renders Arabic in the server HTML immediately instead
  // of flashing English until a post-hydration effect corrects it.
  const [language, setLanguageState] = useState<Language>(() =>
    isArabicPath(pathname) ? "ar" : "en"
  );
  const router = useRouter();

  // Detect language prefix from path (covers client-side navigations between
  // pages, where the lazy initializer above doesn't re-run).
  useEffect(() => {
    if (pathname) {
      if (isArabicPath(pathname)) {
        setLanguageState("ar");
      } else {
        // Fall back to saved / cookie language
        const savedLang = localStorage.getItem("language") as Language;
        if (savedLang && ["en", "ar"].includes(savedLang)) {
          setLanguageState(savedLang);
        } else {
          // Check cookies
          const cookies = document.cookie.split(";");
          const langCookie = cookies.find((c) => c.trim().startsWith("language="));
          if (langCookie) {
            const val = langCookie.split("=")[1] as Language;
            if (["en", "ar"].includes(val)) {
              setLanguageState(val);
            }
          }
        }
      }
    }
  }, [pathname]);

  const setLanguage = (lang: Language) => {
    // 1. Remove any existing locale prefix
    let cleanPath = pathname || "/";
    if (isArabicPath(cleanPath)) {
      cleanPath = cleanPath.substring(3) || "/";
    }

    if (lang === "ar" && !AR_AVAILABLE_ROUTES.includes(cleanPath)) {
      // No Arabic version of the current page — nothing to switch to.
      return;
    }

    setLanguageState(lang);
    localStorage.setItem("language", lang);
    // Set a cookie valid for 1 year
    document.cookie = `language=${lang};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;

    // 2. Build the new path with the selected locale
    let newPath = cleanPath;
    if (lang === "ar") {
      newPath = `/ar${cleanPath === "/" ? "" : cleanPath}`;
    }

    // 3. Perform push
    if (newPath !== pathname) {
      router.push(newPath);
    }
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  // Synchronize document dir and lang attributes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
