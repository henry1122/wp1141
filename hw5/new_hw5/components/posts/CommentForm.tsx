"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { calculateCharacterCount, validatePostContent } from "@/lib/utils/text-processing";
import { PostWithStats } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface CommentFormProps {
  postId: string;
  onSuccess?: (newComment?: PostWithStats) => void;
  replyToUserId?: string; // 要回覆的用戶 ID
  replyToUserID?: string; // 要回覆的用戶 userID（用於 @）
}

export default function CommentForm({
  postId,
  onSuccess,
  replyToUserId,
  replyToUserID,
}: CommentFormProps) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [content, setContent] = useState(
    replyToUserID ? `@${replyToUserID} ` : ""
  );
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const count = calculateCharacterCount(content);
    setCharCount(count);
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const validation = validatePostContent(newContent);

    if (validation.valid || newContent.length <= content.length) {
      setContent(newContent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePostContent(content);
    if (!validation.valid || !content.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          replyToUserId, // 如果提供，表示這是回覆某個留言的留言
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setContent(replyToUserID ? `@${replyToUserID} ` : "");
        onSuccess?.(data.comment);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-3">
      <Avatar>
        <AvatarImage src={session?.user?.image || undefined} />
        <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <Textarea
          placeholder={t("replyPlaceholder")}
          value={content}
          onChange={handleContentChange}
          className="min-h-[80px] resize-none"
        />
        <div className="flex items-center justify-between">
          <span className={`text-sm ${charCount > 280 ? "text-red-500" : "text-gray-500"}`}>
            {charCount}/280
          </span>
          <Button type="submit" disabled={charCount > 280 || !content.trim() || loading}>
            {loading ? t("postingReply") : t("reply")}
          </Button>
        </div>
      </div>
    </form>
  );
}

