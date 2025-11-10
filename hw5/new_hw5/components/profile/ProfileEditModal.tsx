"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    bio?: string;
    avatar?: string;
    backgroundImage?: string;
  };
  onProfileUpdated?: (patch: {
    bio?: string;
    avatar?: string;
    backgroundImage?: string;
  }) => void;
}

export default function ProfileEditModal({
  open,
  onOpenChange,
  user,
  onProfileUpdated,
}: ProfileEditModalProps) {
  const { data: session, update } = useSession();
  const { t } = useLanguage();
  const [bio, setBio] = useState(user.bio || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");
  const [backgroundPreview, setBackgroundPreview] = useState(user.backgroundImage || "");
  const [loading, setLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setBio(user.bio || "");
      setAvatarPreview(user.avatar || "");
      setBackgroundPreview(user.backgroundImage || "");
      setAvatarFile(null);
      setBackgroundFile(null);
    }
  }, [open, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = user.avatar;
      let backgroundUrl = user.backgroundImage;

      // 上傳頭像
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("type", "avatar");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          avatarUrl = uploadData.url;
        }
      }

      // 上傳背景圖
      if (backgroundFile) {
        const formData = new FormData();
        formData.append("file", backgroundFile);
        formData.append("type", "background");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          backgroundUrl = uploadData.url;
        }
      }

      // 更新使用者資料
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: bio.substring(0, 160),
          avatar: avatarUrl,
          backgroundImage: backgroundUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await update();
        onProfileUpdated?.({
          bio: data.user?.bio,
          avatar: data.user?.avatar,
          backgroundImage: data.user?.backgroundImage,
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("profile.editTitle")}</DialogTitle>
          <DialogDescription>{t("profile.editDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 背景圖 */}
          <div>
            <label className="block text-sm font-medium mb-2">{t("profile.backgroundLabel")}</label>
            <div className="relative h-32 w-full bg-gray-200 rounded-lg overflow-hidden">
              {backgroundPreview && (
                <Image
                  src={backgroundPreview}
                  alt="Background preview"
                  width={600}
                  height={200}
                  className="w-full h-full object-cover"
                />
              )}
              <input
                ref={backgroundInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <span className="text-white text-sm">{t("profile.uploadBackground")}</span>
              </div>
            </div>
          </div>

          {/* 頭像 */}
          <div>
            <label className="block text-sm font-medium mb-2">{t("profile.avatarLabel")}</label>
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                {avatarPreview && (
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                )}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => avatarInputRef.current?.click()}
              >
                {t("profile.chooseImage")}
              </Button>
            </div>
          </div>

          {/* 簡介 */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-2">
              {t("profile.bioLabel")}
            </label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              className="min-h-[100px]"
              placeholder={t("profile.bioPlaceholder")}
            />
            <p className="mt-1 text-xs text-gray-500">{bio.length}/160</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("profile.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("profile.saving") : t("profile.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
