"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DraftList from "@/components/posts/DraftList";

export default function DraftsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-2xl border-x p-8">
        <div>載入中...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl border-x p-8">
      <h1 className="text-2xl font-bold mb-4">草稿</h1>
      <DraftList />
    </div>
  );
}
