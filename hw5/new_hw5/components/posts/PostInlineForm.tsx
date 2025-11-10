"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { calculateCharacterCount, validatePostContent } from "@/lib/utils/text-processing";
import { useRouter } from "next/navigation";
import { ImageIcon, X, FileText } from "lucide-react";

export default function PostInlineForm({ onSuccess }: { onSuccess?: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (imageFiles.length + files.length > 10) {
        alert("最多只能上傳 10 張圖片");
        return;
      }
      const newFiles = [...imageFiles, ...files].slice(0, 10);
      setImageFiles(newFiles);
      setImagePreviews(newFiles.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSaveDraft = async () => {
    try {
      await fetch("/api/posts/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      setContent("");
      setImageFiles([]);
      setImagePreviews([]);
      setExpanded(false);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handlePost = async () => {
    const validation = validatePostContent(content);
    if (!validation.valid && !imageFiles.length) {
      return;
    }

    setLoading(true);
    try {
      // 上傳圖片
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "post");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrls.push(uploadData.url);
        }
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, imageUrls }),
      });

      if (response.ok) {
        const data = await response.json();
        setContent("");
        setImageFiles([]);
        setImagePreviews([]);
        setExpanded(false);
        onSuccess?.();
        // 觸發 Pusher 事件以立即更新列表
        if (typeof window !== "undefined") {
          try {
            const { getPusherClient } = require("@/lib/pusher/client");
            const pusher = getPusherClient();
            if (pusher) {
              await pusher.trigger("posts", "new-post", {
                postId: data.post._id,
                authorId: data.post.author?._id || data.post.authorId,
                content: data.post.content,
              });
            }
          } catch (error) {
            console.error("Pusher trigger error:", error);
          }
        }
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <div className="border-b p-4">
        <div
          onClick={() => setExpanded(true)}
          className="cursor-text p-3 text-gray-500"
        >
          有什麼新鮮事？
        </div>
      </div>
    );
  }

  return (
    <div className="border-b p-4 bg-white">
      <div className="flex space-x-3">
        <Avatar>
          <AvatarImage src={session?.user?.image || undefined} />
          <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="有什麼新鮮事？"
            value={content}
            onChange={handleContentChange}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-lg min-h-[120px] p-0"
            autoFocus
          />

          {/* 圖片預覽 */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
                id="inline-post-image-input"
              />
              <label
                htmlFor="inline-post-image-input"
                className="cursor-pointer text-blue-500 hover:text-blue-600"
              >
                <ImageIcon className="h-5 w-5" />
              </label>
              <button
                onClick={handleSaveDraft}
                className="text-blue-500 hover:text-blue-600"
                type="button"
              >
                <FileText className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${charCount > 280 ? "text-red-500" : "text-gray-500"}`}>
                {charCount}/280
              </span>
              <Button variant="outline" onClick={() => setExpanded(false)} disabled={loading}>
                取消
              </Button>
              <Button
                onClick={handlePost}
                disabled={(charCount > 280 && !imageFiles.length) || (!content.trim() && !imageFiles.length) || loading}
              >
                {loading ? "發表中..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

