"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { UserPlus, Hash } from "lucide-react";

interface SuggestedUser {
  _id: string;
  name: string;
  userID: string;
  avatar?: string;
  followersCount?: number;
}

interface TrendingHashtag {
  tag: string;
  count: number;
}

export default function RightSidebar() {
  const { data: session } = useSession();
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([]);
  const [followingMap, setFollowingMap] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (session?.user?.id) {
      fetchSuggestedUsers();
      fetchTrendingHashtags();
    }
  }, [session?.user?.id]);

  const fetchSuggestedUsers = async () => {
    try {
      const response = await fetch("/api/users/suggestions");
      if (response.ok) {
        const data = await response.json();
        setSuggestedUsers(data.users || []);
        // 獲取追蹤狀態（使用 userID）
        const followStatus = new Map<string, boolean>();
        for (const user of data.users || []) {
          try {
            const followResponse = await fetch(`/api/users/${user.userID}`);
            if (followResponse.ok) {
              const userData = await followResponse.json();
              followStatus.set(user._id, userData.user?.isFollowing || false);
            }
          } catch (error) {
            console.error("Error checking follow status:", error);
          }
        }
        setFollowingMap(followStatus);
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error);
    }
  };

  const fetchTrendingHashtags = async () => {
    try {
      const response = await fetch("/api/hashtags/trending");
      if (response.ok) {
        const data = await response.json();
        setTrendingHashtags(data.hashtags || []);
      }
    } catch (error) {
      console.error("Error fetching trending hashtags:", error);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const isFollowing = followingMap.get(userId);
      const method = isFollowing ? "DELETE" : "POST";
      const response = await fetch("/api/follows", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: suggestedUsers.find(u => u._id === userId)?.userID }),
      });

      if (response.ok) {
        setFollowingMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(userId, !isFollowing);
          return newMap;
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-80 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* 你可能會認識 */}
        {suggestedUsers.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-xl font-bold mb-4">你可能會認識</h2>
            <div className="space-y-4">
              {suggestedUsers.slice(0, 3).map((user) => (
                <div key={user._id} className="flex items-center justify-between">
                  <Link href={`/profile/${user.userID}`} className="flex items-center space-x-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">@{user.userID}</p>
                    </div>
                  </Link>
                  <Button
                    variant={followingMap.get(user._id) ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleFollow(user._id)}
                  >
                    {followingMap.get(user._id) ? "已追蹤" : "追蹤"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 熱門Hashtag */}
        {trendingHashtags.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-xl font-bold mb-4">有什麼新鮮事</h2>
            <div className="space-y-4">
              {trendingHashtags.slice(0, 5).map((hashtag, index) => (
                <Link
                  key={hashtag.tag}
                  href={`/hashtag/${hashtag.tag}`}
                  className="block hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">流行趨勢</p>
                      <p className="font-bold text-lg">#{hashtag.tag}</p>
                      <p className="text-sm text-gray-500">{hashtag.count.toLocaleString()} 則貼文</p>
                    </div>
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
              ))}
              <Link
                href="/explore"
                className="block text-blue-500 hover:text-blue-600 text-sm font-medium pt-2"
              >
                顯示更多
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

