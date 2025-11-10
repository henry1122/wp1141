"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PostCard from "./PostCard";
import CommentForm from "./CommentForm";
import { PostWithStats } from "@/types";
import { usePusher } from "@/hooks/usePusher";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  post: PostWithStats;
}

interface CommentNode {
  comment: PostWithStats;
  replies: CommentNode[];
}

export default function CommentsDialog({
  open,
  onOpenChange,
  postId,
  post,
}: CommentsDialogProps) {
  const [comments, setComments] = useState<PostWithStats[]>([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, fetchComments]);

  // Pusher 即時更新評論
  usePusher(postId, (data: any) => {
    if (data.commentId) {
      fetchComments();
    }
  });

  // 構建層級結構
  const buildCommentTree = (comments: PostWithStats[]): CommentNode[] => {
    const commentMap = new Map<string, CommentNode>();
    const rootComments: CommentNode[] = [];

    // 第一遍：創建所有節點
    comments.forEach((comment) => {
      commentMap.set((comment._id as any).toString(), {
        comment,
        replies: [],
      });
    });

    // 第二遍：建立父子關係
    comments.forEach((comment) => {
      const node = commentMap.get((comment._id as any).toString())!;
      const parentId = comment.parentPostId
        ? (comment.parentPostId as any).toString()
        : null;

      if (parentId && commentMap.has(parentId)) {
        // 這是回覆某個留言的留言
        const parentNode = commentMap.get(parentId)!;
        // 檢查父節點是否是主 Post 的直接留言
        if (parentNode.comment.parentPostId?.toString() === postId) {
          // 父節點是第2層（主 Post 的直接留言），這個是第3層
          parentNode.replies.push(node);
        } else {
          // 父節點是第3層，需要找到第2層父節點
          // 找到父節點的父節點（應該是第2層）
          const grandParentId = parentNode.comment.parentPostId
            ? (parentNode.comment.parentPostId as any).toString()
            : null;
          if (grandParentId && commentMap.has(grandParentId)) {
            // 確認祖父節點是第2層（主 Post 的直接留言）
            const grandParentNode = commentMap.get(grandParentId)!;
            if (grandParentNode.comment.parentPostId?.toString() === postId) {
              // 祖父節點是第2層，這個新留言也應該成為第2層的回覆（第3層）
              // 但實際上應該回覆父節點（第3層），所以我們讓它成為第2層的新回覆
              // 為了保持結構，我們讓它回覆第2層留言
              grandParentNode.replies.push(node);
            } else {
              // 如果祖父節點不是第2層，就當作第2層處理
              rootComments.push(node);
            }
          } else {
            // 如果找不到祖父節點，就當作第2層處理
            rootComments.push(node);
          }
        }
      } else {
        // 這是主 Post 的直接留言（第2層）
        rootComments.push(node);
      }
    });

    return rootComments;
  };

  const commentTree = buildCommentTree(comments);
  const [showReplyForms, setShowReplyForms] = useState<Map<string, boolean>>(
    new Map()
  );

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
    },
    [fetchComments]
  );

  const toggleReplyForm = (commentId: string) => {
    setShowReplyForms((prev) => {
      const newMap = new Map(prev);
      newMap.set(commentId, !newMap.get(commentId));
      return newMap;
    });
  };

  const renderComment = (node: CommentNode, level: number = 0) => {
    const isLevel2 = level === 0;
    const isLevel3 = level === 1;
    const commentId = (node.comment._id as any).toString();
    const showReplyForm = showReplyForms.get(commentId) || false;

    return (
      <div key={(node.comment._id as any).toString()} className={isLevel3 ? "ml-8" : isLevel2 ? "ml-6" : ""}>
        <div className="relative">
          {/* 簡化的視覺線條 */}
          {isLevel3 && (
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 -ml-8" />
          )}

          {/* 留言內容 */}
          <div className="pb-2">
            <PostCard
              post={node.comment}
              hideCommentsButton={true}
              onCommentClick={() => toggleReplyForm(commentId)}
            />

            {/* 回覆表單 */}
            {showReplyForm && (
              <div className="pl-12 pb-4 mt-2">
                <CommentForm
                  postId={postId}
                  onSuccess={(newComment) => {
                    toggleReplyForm(commentId);
                    handleCommentSuccess(newComment);
                  }}
                  replyToUserId={commentId}
                  replyToUserID={node.comment.author?.userID}
                />
              </div>
            )}
          </div>

          {/* 遞迴渲染回覆 */}
          {/* 第3層留言要越早的越上面，所以反轉順序 */}
          {node.replies.length > 0 && (
            <div className="mt-2">
              {(isLevel2 ? [...node.replies].reverse() : node.replies).map((reply) => renderComment(reply, level + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("commentsTitle")}</DialogTitle>
        </DialogHeader>

        {/* 主 Post */}
        <div className="border-b pb-4">
          <PostCard post={post} hideCommentsButton={true} />
        </div>

        {/* 回覆主 Post 的表單 */}
        <div className="border-b pb-4">
          <CommentForm postId={postId} onSuccess={handleCommentSuccess} />
        </div>

        {/* 留言列表 */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">{t("loading")}</div>
          ) : commentTree.length === 0 ? (
            <div className="text-center py-8 text-gray-500">{t("noComments")}</div>
          ) : (
            commentTree.map((node) => renderComment(node))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

