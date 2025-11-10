"use client";

import { useEffect, useState, useCallback } from "react";
import PostCard from "./PostCard";
import { PostWithStats } from "@/types";

interface HashtagPostListProps {
  tag: string;
}

export default function HashtagPostList({ tag }: HashtagPostListProps) {
  const [posts, setPosts] = useState<PostWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/hashtag/${tag}`);
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Error fetching hashtag posts:", error);
    } finally {
      setLoading(false);
    }
  }, [tag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
        <div className="text-gray-500">尚無文章</div>
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

