"use client";

import BookmarkList from "@/components/bookmarks/BookmarkList";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BookmarksPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl border-x">
      <div className="sticky top-0 z-10 border-b bg-white/80 px-4 py-4 backdrop-blur">
        <h1 className="text-xl font-bold">{t("bookmarkPage.title")}</h1>
        <p className="text-sm text-gray-500">{t("bookmarkPage.subtitle")}</p>
      </div>
      <BookmarkList />
    </div>
  );
}

