"use client";

import { useEffect, useState, useCallback } from "react";
import PostCard from "@/components/posts/PostCard";
import { PostWithStats } from "@/types";

interface LikedPostsListProps {
  userID: string;
}

export default function LikedPostsList({ userID }: LikedPostsListProps) {
  const [posts, setPosts] = useState<PostWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${userID}/likes`);
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    } finally {
      setLoading(false);
    }
  }, [userID]);

  useEffect(() => {
    fetchLikedPosts();
  }, [fetchLikedPosts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>載入中...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">尚無按讚的文章</div>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={(post._id as any).toString()} post={post} />
      ))}
    </div>
  );
}

