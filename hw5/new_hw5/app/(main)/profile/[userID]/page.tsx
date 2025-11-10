"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PostList from "@/components/posts/PostList";
import LikedPostsList from "@/components/profile/LikedPostsList";

export default function ProfilePage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const userID = params.userID as string;
  const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");
  const isOwnProfile = session?.user?.userID === userID;

  // 檢查是否為臨時 userID（不應該訪問 Profile）
  useEffect(() => {
    if (userID?.startsWith("temp_")) {
      // 如果是臨時 userID，重定向到註冊頁面
      router.push("/register");
    }
  }, [userID, router]);

  // 如果是臨時 userID，顯示載入中（會自動重定向）
  if (userID?.startsWith("temp_")) {
    return (
      <div className="mx-auto max-w-4xl border-x p-8">
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl border-x">
      <ProfileHeader userID={userID} isOwnProfile={isOwnProfile} />
      <div className="border-t">
        <div className="flex">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 px-4 py-4 text-center font-semibold hover:bg-gray-50 ${
              activeTab === "posts" ? "border-b-2 border-blue-500" : ""
            }`}
          >
            Posts
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab("likes")}
              className={`flex-1 px-4 py-4 text-center font-semibold hover:bg-gray-50 ${
                activeTab === "likes" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              Likes
            </button>
          )}
        </div>
      </div>
      {activeTab === "posts" ? (
        <PostList type="all" userID={userID} />
      ) : (
        <LikedPostsList userID={userID} />
      )}
    </div>
  );
}
