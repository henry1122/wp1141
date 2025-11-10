"use client";

import { useEffect, useState, useCallback } from "react";
import PostCard from "./PostCard";
import { PostWithStats } from "@/types";
import { getPusherClient } from "@/lib/pusher/client";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PostListProps {
  type: "all" | "following";
  userID?: string;
}

export default function PostList({ type, userID }: PostListProps) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const fetchPosts = useCallback(async () => {
    try {
      let url = `/api/posts?type=${type}`;
      if (userID) {
        url = `/api/users/${userID}/posts`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [type, userID]);

  useEffect(() => {
    fetchPosts();
    
    // 監聽新文章事件（僅在首頁且 type 為 all 時）
    if (!userID && type === "all" && typeof window !== "undefined") {
      try {
        const pusher = getPusherClient();
        if (pusher) {
          const channel = pusher.subscribe("posts");
          channel.bind("new-post", async (data: any) => {
            // 重新獲取文章列表
            await fetchPosts();
          });

          return () => {
            pusher.unsubscribe("posts");
          };
        }
      } catch (error) {
        console.error("Pusher subscription error:", error);
      }
    }
  }, [fetchPosts, type, userID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>{t("loading")}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">{t("noPosts")}</div>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={(post._id as any).toString()}
          post={post}
          hideCommentsButton={Boolean(userID)}
        />
      ))}
    </div>
  );
}

