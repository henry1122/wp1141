"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import HashtagPostList from "@/components/posts/HashtagPostList";

export default function HashtagPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const tag = params.tag as string;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-4xl border-x p-8">
        <div>載入中...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl border-x">
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm px-4 py-4">
        <h1 className="text-xl font-bold">#{tag}</h1>
      </div>
      <HashtagPostList tag={tag} />
    </div>
  );
}

