"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar" | "ur";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && ["en", "ar", "ur"].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      // Check cookies
      const cookies = document.cookie.split(";");
      const langCookie = cookies.find((c) => c.trim().startsWith("language="));
      if (langCookie) {
        const val = langCookie.split("=")[1] as Language;
        if (["en", "ar", "ur"].includes(val)) {
          setLanguageState(val);
        }
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    // Set a cookie valid for 1 year
    document.cookie = `language=${lang};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
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
