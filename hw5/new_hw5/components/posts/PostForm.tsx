"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { calculateCharacterCount, validatePostContent } from "@/lib/utils/text-processing";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface PostFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialContent?: string;
  initialImageUrls?: string[];
}

export default function PostForm({ open, onOpenChange, onSuccess, initialContent, initialImageUrls }: PostFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setContent(initialContent || "");
      setCharCount(0);
      setImageFiles([]);
      setImagePreviews(initialImageUrls || []);
    }
  }, [open, initialContent, initialImageUrls]);

  useEffect(() => {
    const count = calculateCharacterCount(content);
    setCharCount(count);
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const validation = validatePostContent(newContent);

    if (validation.valid || newContent.length <= content.length) {
      // 允許刪除或有效內容
      setContent(newContent);
    }
    // 如果超過限制且是新增內容，則不更新
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (imageFiles.length + files.length > 10) {
        alert(t("common.maxImagesWarning"));
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
        onOpenChange(false);
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

  const handleClose = () => {
    if (content.trim()) {
      setShowDiscardDialog(true);
    } else {
      onOpenChange(false);
    }
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
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleDiscard = () => {
    setContent("");
    setShowDiscardDialog(false);
    onOpenChange(false);
  };

  const canPost = (charCount <= 280 || imageFiles.length > 0) && (content.trim().length > 0 || imageFiles.length > 0);

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <div className="p-6 space-y-4">
            <DialogHeader className="pb-0">
              <DialogTitle>{t("postForm.title")}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Textarea
                placeholder={t("postForm.placeholder")}
                value={content}
                onChange={handleContentChange}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-lg min-h-[200px] p-0 bg-transparent"
                maxLength={280 + 1000} // 允許輸入超過限制（但會阻止提交）
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

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                  id="post-image-input"
                />
                <label
                  htmlFor="post-image-input"
                  className="cursor-pointer text-blue-500 hover:text-blue-600"
                  title={t("postForm.addImages")}
                >
                  <ImageIcon className="h-5 w-5" />
                </label>
                <button
                  onClick={async () => {
                    await handleSaveDraft();
                    router.push("/post/drafts");
                  }}
                  className="text-blue-500 hover:text-blue-600"
                  type="button"
                  title={t("postForm.viewDrafts")}
                >
                  <FileText className="h-5 w-5" />
                </button>
              </div>
              <span className={charCount > 280 ? "text-red-500" : "text-gray-500"}>
                {charCount}/280
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handlePost} disabled={!canPost || loading}>
              {loading ? t("postForm.posting") : t("postForm.postButton")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("postForm.discardTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("postForm.discardMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDiscardDialog(false)}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscard} className="bg-red-500 hover:bg-red-600">
              {t("postForm.discard")}
            </AlertDialogAction>
            <AlertDialogAction onClick={handleSaveDraft}>{t("postForm.saveDraft")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

