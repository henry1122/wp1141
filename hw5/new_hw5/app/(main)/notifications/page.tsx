"use client";

import NotificationList from "@/components/notifications/NotificationList";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotificationsPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl border-x">
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm px-4 py-4">
        <h1 className="text-xl font-bold">{t("notificationsPage.title")}</h1>
      </div>
      <NotificationList />
    </div>
  );
}

