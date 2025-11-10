"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations, Language } from "@/lib/i18n/translations";

const languageOptions: { code: Language; flag: string }[] = [
  { code: "zh", flag: "🇨🇳" },
  { code: "en", flag: "🇺🇸" },
  { code: "wenyan", flag: "📜" },
  { code: "zhuyin", flag: "🔤" },
  { code: "hunter", flag: "🎯" },
  { code: "jin", flag: "🥟" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const currentLang = languageOptions.find((l) => l.code === language) || languageOptions[0];
  const currentName = translations[currentLang.code].languageName;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Languages className="mr-2 h-4 w-4" />
          <span className="mr-2">{currentLang.flag}</span>
          <span>{currentName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-gray-100" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {translations[lang.code].languageName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


