"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import PostDetail from "@/components/posts/PostDetail";

export default function PostDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;

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

  return <PostDetail postId={postId} />;
}
