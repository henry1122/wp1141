"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calculateCharacterCount, validatePostContent } from "@/lib/utils/text-processing";
import { useRouter } from "next/navigation";
import PostCard from "./PostCard";
import { PostWithStats } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface RepostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostWithStats;
  onSuccess?: () => void;
}

export default function RepostDialog({
  open,
  onOpenChange,
  post,
  onSuccess,
}: RepostDialogProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setContent("");
      setCharCount(0);
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [open]);

  useEffect(() => {
    setCharCount(calculateCharacterCount(content));
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = e.target.value;
    const validation = validatePostContent(nextValue);
    if (validation.valid || nextValue.length <= content.length) {
      setContent(nextValue);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 10) {
      alert(t("maxImagesWarning"));
      return;
    }
    const newFiles = [...imageFiles, ...files].slice(0, 10);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      const validation = validatePostContent(content);
      if (!validation.valid) {
        return;
      }
    }

    setLoading(true);
    try {
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

      const response = await fetch("/api/reposts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post._id,
          content: content.trim() || undefined,
          imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        }),
      });

      if (response.ok) {
        await response.json();
        setContent("");
        setImageFiles([]);
        setImagePreviews([]);
        onOpenChange(false);
        onSuccess?.();
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating repost:", error);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !content.trim() || charCount <= 280;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-0">
        <div className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle>{t("repost")}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder={t("addThoughts")}
                value={content}
                onChange={handleContentChange}
                className="min-h-[120px] resize-none"
                maxLength={280 + 1000}
              />

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" />
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
                <Button
                  type="button"
                  variant="ghost"
                  className="flex items-center space-x-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>{t("addImages")}</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
                <span className={charCount > 280 ? "text-red-500" : "text-gray-500"}>
                  {charCount}/280
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="mb-2 text-sm text-gray-500">{t("originalPostPreview")}</p>
              <div className="pointer-events-none">
                <PostCard post={post} hideCommentsButton={true} />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={!canSubmit || loading}>
                {loading ? t("reposting") : t("confirmRepost")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

