"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserWithStats } from "@/types";
import { useSession } from "next-auth/react";
import { MessageSquare } from "lucide-react";
import ProfileEditModal from "./ProfileEditModal";
import FollowersDialog from "./FollowersDialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileHeaderProps {
  userID: string;
  isOwnProfile: boolean;
}

export default function ProfileHeader({ userID, isOwnProfile }: ProfileHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<UserWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${userID}`);
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsFollowing(data.user.isFollowing || false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }, [userID]);

  const handleProfileUpdated = useCallback(
    (patch: { bio?: string; avatar?: string; backgroundImage?: string }) => {
      setUser((prev) => (prev ? { ...prev, ...patch } : prev));
    },
    []
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleFollow = async () => {
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const response = await fetch("/api/follows", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID }),
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        // 更新追蹤數
        if (user) {
          setUser({
            ...(user as any),
            followersCount: (user.followersCount || 0) + (isFollowing ? -1 : 1),
          } as UserWithStats);
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (loading) {
    return <div className="p-8">{t("loading")}</div>;
  }

  if (!user) {
    return <div className="p-8">{t("userNotFound")}</div>;
  }

  return (
    <div>
      {/* 背景圖 */}
      <div className="relative h-48 bg-gray-200">
        {user.backgroundImage && (
          <Image
            src={user.backgroundImage}
            alt="Background"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* 使用者資訊 */}
      <div className="relative px-4 pb-4">
        {/* 頭像 */}
        <div className="absolute -top-16">
          <Avatar className="h-32 w-32 border-4 border-white">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        {/* 按鈕 */}
        <div className="flex justify-end gap-2 pt-4">
          {isOwnProfile ? (
            <Button onClick={() => setEditModalOpen(true)}>{t("editProfile")}</Button>
          ) : (
            <>
              <Button
                onClick={() => router.push(`/messages?userId=${(user as any)?._id}`)}
                variant="outline"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("message")}
              </Button>
              <Button onClick={handleFollow} variant={isFollowing ? "outline" : "default"}>
                {isFollowing ? t("following") : t("follow")}
              </Button>
            </>
          )}
        </div>

        {/* 使用者資訊 */}
        <div className="mt-16">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">@{user.userID}</p>
          {user.bio && <p className="mt-2">{user.bio}</p>}

          <div className="mt-4 flex space-x-4 text-sm">
            <span>
              <span className="font-semibold">{user.postsCount || 0}</span> {t("posts")}
            </span>
            <button
              onClick={() => setFollowingDialogOpen(true)}
              className="hover:underline"
            >
              <span className="font-semibold">{user.followingCount || 0}</span> {t("following")}
            </button>
            <button
              onClick={() => setFollowersDialogOpen(true)}
              className="hover:underline"
            >
              <span className="font-semibold">{user.followersCount || 0}</span> {t("followers")}
            </button>
          </div>
        </div>
      </div>
      
      {isOwnProfile && user && (
        <ProfileEditModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          user={user}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
      <FollowersDialog
        open={followersDialogOpen}
        onOpenChange={setFollowersDialogOpen}
        userID={userID}
        type="followers"
      />
      <FollowersDialog
        open={followingDialogOpen}
        onOpenChange={setFollowingDialogOpen}
        userID={userID}
        type="following"
      />
    </div>
  );
}

