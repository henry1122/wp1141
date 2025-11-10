"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import PostCard from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { PostWithStats } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface BookmarkEntry {
  _id: string;
  postId: string;
  folderName: string;
  createdAt: string;
  post: PostWithStats;
}

interface BookmarkGroup {
  postId: string;
  post: PostWithStats;
  folders: string[];
  entries: BookmarkEntry[];
  latestCreatedAt: string;
}

export default function BookmarkList() {
  const [entries, setEntries] = useState<BookmarkEntry[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { t } = useLanguage();

  // 從伺服器端載入書籤與貼文內容，讓收藏頁面可以直接使用 PostCard 呈現
  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/bookmarks?includePosts=1");
      if (!response.ok) {
        throw new Error("Failed to load bookmarks");
      }

      const data = await response.json();
      const parsedEntries: BookmarkEntry[] = (data.bookmarks || []).map((bookmark: any) => ({
        ...bookmark,
        postId: bookmark.postId.toString(),
        _id: bookmark._id.toString(),
        createdAt: bookmark.createdAt,
        folderName: bookmark.folderName || "default",
        post: {
          ...bookmark.post,
          _id: bookmark.post._id,
          isBookmarked: true,
        },
      }));

      setEntries(parsedEntries);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const groups = useMemo(() => {
    const map = new Map<string, BookmarkGroup>();

    entries.forEach((entry) => {
      const key = entry.postId;
      const existing = map.get(key);
      if (existing) {
        existing.folders = Array.from(new Set([...existing.folders, entry.folderName]));
        existing.entries.push(entry);
        if (new Date(entry.createdAt).getTime() > new Date(existing.latestCreatedAt).getTime()) {
          existing.latestCreatedAt = entry.createdAt;
        }
      } else {
        map.set(key, {
          postId: entry.postId,
          post: entry.post,
          folders: [entry.folderName],
          entries: [entry],
          latestCreatedAt: entry.createdAt,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.latestCreatedAt).getTime() - new Date(a.latestCreatedAt).getTime()
    );
  }, [entries]);

  // 彙整所有資料夾名稱，供使用者快速切換分類
  const folders = useMemo(() => {
    const uniqueFolders = new Set<string>();
    entries.forEach((entry) => {
      if (entry.folderName) {
        uniqueFolders.add(entry.folderName);
      }
    });
    return ["all", ...Array.from(uniqueFolders)];
  }, [entries]);

  const filteredGroups = useMemo(() => {
    if (activeFolder === "all") {
      return groups;
    }

    return groups.filter((group) => group.folders.includes(activeFolder));
  }, [activeFolder, groups]);

  const handleRemove = useCallback(
    async (group: BookmarkGroup) => {
      setRemovingId(group.postId);
      try {
        const response = await fetch("/api/bookmarks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body:
            activeFolder !== "all"
              ? JSON.stringify({ postId: group.postId, folderName: activeFolder })
              : JSON.stringify({ postId: group.postId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete bookmark");
        }

        setEntries((prev) =>
          prev.filter((entry) => {
            if (activeFolder === "all") {
              // 全部收藏頁面：移除該貼文的所有收藏紀錄
              return entry.postId !== group.postId;
            }
            // 特定資料夾：移除該資料夾中的收藏即可
            return !(entry.postId === group.postId && entry.folderName === activeFolder);
          })
        );
      } catch (error) {
        console.error("Error removing bookmark:", error);
      } finally {
        setRemovingId(null);
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>{t("bookmarks.loading")}</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center text-gray-500">
        <p className="mb-2 text-lg">{t("bookmarks.emptyTitle")}</p>
        <p className="text-sm">{t("bookmarks.emptySubtitle")}</p>
      </div>
    );
  }

  return (
    <div>
      {/* 資料夾切換區塊，使用按鈕讓使用者明確知道目前分類 */}
      <div className="sticky top-0 z-10 flex flex-wrap gap-2 border-b bg-white/80 p-4 backdrop-blur">
        {folders.map((folder) => (
          <Button
            key={folder}
            variant={folder === activeFolder ? "default" : "outline"}
            onClick={() => setActiveFolder(folder)}
          >
            {folder === "all"
              ? t("bookmarks.all")
              : folder === "default"
                ? t("bookmarks.defaultFolder")
                : folder}
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredGroups.map((group) => (
          <div key={group.postId} className="relative">
            {/* 收藏的貼文本體 */}
            <div className="rounded-xl border shadow-sm bg-white">
              <div className="absolute right-4 top-4 z-10 flex flex-wrap gap-2">
                {group.folders.map((folder) => (
                  <span
                    key={folder}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                  >
                    {folder === "default" ? t("bookmarks.defaultFolder") : folder}
                  </span>
                ))}
              </div>
              <PostCard post={group.post} className="border-none" />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-6 right-6"
              disabled={removingId === group.postId}
              onClick={() => handleRemove(group)}
            >
              {removingId === group.postId
                ? t("bookmarks.removing")
                : activeFolder === "all"
                  ? t("bookmarks.cancelBookmark")
                  : t("bookmarks.removeFromFolder", {
                      folder:
                        activeFolder === "default"
                          ? t("bookmarks.defaultFolder")
                          : activeFolder,
                    })}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

