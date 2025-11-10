"use client";

import { useState } from "react";
import PostList from "@/components/posts/PostList";
import PostInlineForm from "@/components/posts/PostInlineForm";

// 強制動態渲染以支持即時更新
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [type, setType] = useState<"all" | "following">("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto max-w-4xl border-x">
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex">
          <button
            onClick={() => setType("all")}
            className={`flex-1 px-4 py-4 text-center font-semibold hover:bg-gray-50 ${
              type === "all" ? "border-b-2 border-blue-500" : ""
            }`}
          >
            All
          </button>
          <button
            onClick={() => setType("following")}
            className={`flex-1 px-4 py-4 text-center font-semibold hover:bg-gray-50 ${
              type === "following" ? "border-b-2 border-blue-500" : ""
            }`}
          >
            Following
          </button>
        </div>
      </div>
      <PostInlineForm onSuccess={handlePostSuccess} />
      <PostList key={refreshKey} type={type} />
    </div>
  );
}

