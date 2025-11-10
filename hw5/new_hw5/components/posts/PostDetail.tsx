"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostWithStats } from "@/types";
import PostCard from "./PostCard";
import CommentForm from "./CommentForm";
import { usePusher } from "@/hooks/usePusher";
import { useLanguage } from "@/contexts/LanguageContext";

interface PostDetailProps {
  postId: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<PostWithStats | null>(null);
  const [comments, setComments] = useState<PostWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [parentPost, setParentPost] = useState<PostWithStats | null>(null);
  const { t } = useLanguage();

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [postId]);

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();

      if (response.ok) {
        setPost(data.post);

        // 如果有 parentPostId，取得父文章
        if (data.post.parentPostId) {
          const parentResponse = await fetch(`/api/posts/${data.post.parentPostId}`);
          const parentData = await parentResponse.json();
          if (parentResponse.ok) {
            setParentPost(parentData.post);
          }
        }

        // 取得評論
        fetchComments();
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }, [postId, fetchComments]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // Pusher 即時更新評論數
  usePusher(postId, (data: any) => {
    if (data.commentsCount !== undefined && post) {
      setPost({
        ...(post as any),
        commentsCount: data.commentsCount,
      } as PostWithStats);
    }
    if (data.commentId) {
      fetchComments();
    }
  });

  const handleCommentSuccess = useCallback(
    (newComment?: PostWithStats) => {
      if (newComment) {
        setComments((prev) => {
          const exists = prev.some(
            (comment) => ((comment._id as any).toString() === (newComment._id as any).toString())
          );
          if (exists) {
            return prev;
          }
          return [newComment, ...prev];
        });
      }

      fetchComments();

      setPost((current) => {
        if (!current) return current;
        return {
          ...(current as any),
          commentsCount: (current.commentsCount || 0) + 1,
        } as PostWithStats;
      });
    },
    [fetchComments]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl border-x p-8">
        <div>{t("loading")}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl border-x p-8">
        <div>{t("postNotFound")}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl border-x">
      {/* 返回按鈕 */}
      <div className="sticky top-0 z-10 flex items-center border-b bg-white/80 backdrop-blur-sm px-4 py-3">
        <Link href="/home">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* 父文章（如果是評論） */}
      {parentPost && (
        <div className="border-b border-gray-200 bg-gray-50">
          <PostCard post={parentPost} />
        </div>
      )}

      {/* 主文章 */}
      <div className="border-b bg-white">
        <PostCard post={post} />
      </div>

      {/* 評論表單 */}
      <div className="border-b p-4 bg-gray-50">
        <CommentForm postId={postId} onSuccess={handleCommentSuccess} />
      </div>

      {/* 評論列表 */}
      <div>
        {comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t("noComments")}</div>
        ) : (
          comments.map((comment) => (
            <div key={(comment._id as any).toString()} className="border-b pl-8">
              <PostCard post={comment} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
