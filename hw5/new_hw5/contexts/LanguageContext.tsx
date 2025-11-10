"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language, TranslationKey } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");

  // 從 localStorage 讀取語言設置
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && translations[savedLanguage]) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  // 設置語言並保存到 localStorage
  const setLanguage = (lang: Language) => {
    if (!translations[lang]) return;
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const format = (template: string, params?: Record<string, string | number>) => {
    if (!params) return template;
    return template.replace(/\{([^}]+)\}/g, (match, token) => {
      const trimmed = token.trim();
      const value = params[trimmed];
      return value !== undefined ? String(value) : match;
    });
  };

  const resolveKey = (lang: Language, key: string) => {
    const segments = key.split(".");
    let current: any = translations[lang];
    for (const segment of segments) {
      if (current && typeof current === "object" && segment in current) {
        current = current[segment];
      } else {
        return undefined;
      }
    }
    return current;
  };

  // 翻譯函數
  const t = (key: TranslationKey | string, params?: Record<string, string | number>): string => {
    const value = resolveKey(language, key) ?? resolveKey("zh", key);
    if (typeof value === "string") {
      return format(value, params);
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}


