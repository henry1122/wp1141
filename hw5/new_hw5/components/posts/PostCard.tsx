"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Repeat2, MessageCircle, MoreHorizontal, Trash2, ArrowLeft, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ImageModal from "@/components/shared/ImageModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTimeAgo } from "@/lib/utils/format";
import { useSession } from "next-auth/react";
import { PostWithStats } from "@/types";
import PostContent from "@/components/shared/PostContent";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { usePusher } from "@/hooks/usePusher";
import CommentsDialog from "./CommentsDialog";
import RepostDialog from "./RepostDialog";
import BookmarkDialog from "@/components/bookmarks/BookmarkDialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface PostCardProps {
  post: PostWithStats;
  hideCommentsButton?: boolean; // 在 CommentsDialog 中隱藏留言按鈕
  onCommentClick?: () => void; // 點擊留言 icon 時的回調（用於在 CommentsDialog 中顯示回覆表單）
  className?: string; // 自訂外觀樣式，方便在不同列表中調整邊框/陰影
}

export default function PostCard({ post, hideCommentsButton = false, onCommentClick, className }: PostCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const authorIdStr = typeof post.authorId === 'string' ? post.authorId : post.authorId.toString();
  const isOwnPost = session?.user?.id === authorIdStr;
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [loading, setLoading] = useState(false);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [repostDialogOpen, setRepostDialogOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const isComment = useMemo(() => Boolean((post as any).parentPostId), [post]);
  const postId = useMemo(() => ((post._id as any) || post._id).toString(), [post._id]);
  const topComment = useMemo(() => {
    if (isComment) return null;
    return (post as any).topComment || null;
  }, [post, isComment]);

  // 檢查是否已收藏
  useEffect(() => {
    if (isComment) {
      setIsBookmarked(false);
      return;
    }
    const checkBookmark = async () => {
      try {
        const response = await fetch(`/api/bookmarks?postId=${(post._id as any).toString()}`);
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(data.isBookmarked || false);
        }
      } catch (error) {
        console.error("Error checking bookmark:", error);
      }
    };
    checkBookmark();
  }, [post._id, isComment]);

  // Pusher 即時更新
  usePusher((post._id as any).toString(), (data: any) => {
    if (data.likesCount !== undefined) {
      setLikesCount(data.likesCount);
      if (data.isLiked !== undefined) {
        setIsLiked(data.isLiked);
      }
    }
    if (data.repostsCount !== undefined) {
      setRepostsCount(data.repostsCount);
    }
    if (data.commentsCount !== undefined) {
      setCommentsCount(data.commentsCount);
    }
  });

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRepost = () => {
    setRepostDialogOpen(true);
  };

  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);

  const handleBookmark = () => {
    setBookmarkDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!confirm(t("postCard.confirmDelete"))) return;

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // 檢查 author 是否存在且有效
  const author = post.author;
  const hasValidAuthor = author && author.userID && !author.userID.startsWith("temp_");
  
  // 如果沒有有效的 author，不顯示這篇文章
  if (!hasValidAuthor) {
    return null;
  }

  // 如果是轉發，使用 API 返回的 originalPost 或從 post 中取得
  const originalPost = (post as any).originalPost || null;
  const originalPostId = useMemo(() => {
    if (!post.isRepost) return null;
    if (originalPost?._id) {
      return (originalPost._id as any).toString();
    }
    const raw = (post as any).originalPostId;
    if (typeof raw === "string") return raw;
    if (raw?._id) return (raw._id as any).toString();
    return null;
  }, [post, originalPost]);

  const navigateToPost = () => {
    router.push(`/post/${postId}`);
  };

  const handleArticleClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-prevent-post-navigation="true"]')) {
      return;
    }
    navigateToPost();
  };

  const handleArticleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      if (!(event.target as HTMLElement).closest('[data-prevent-post-navigation="true"]')) {
        event.preventDefault();
        navigateToPost();
      }
    }
  };

  const handleOriginalPostClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!originalPostId) return;
    router.push(`/post/${originalPostId}`);
  };

  const handleTopCommentClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!topComment?._id) return;
    const commentId = ((topComment._id as any) || topComment._id).toString();
    router.push(`/post/${commentId}`);
  };

  const handleTopCommentKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!topComment?._id) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const commentId = ((topComment._id as any) || topComment._id).toString();
      router.push(`/post/${commentId}`);
    }
  };

  return (
    <>
      <article
        className={cn("border-b p-4 hover:bg-gray-50 cursor-pointer", className)}
        onClick={handleArticleClick}
        onKeyDown={handleArticleKeyDown}
        role="button"
        tabIndex={0}
      >
        {/* 轉發標記 */}
        {post.isRepost && (
          <div className="mb-2 flex items-center text-gray-500 text-sm">
            <Repeat2 className="mr-1 h-4 w-4" />
            <span>{t("postCard.repostedBy", { name: author.name })}</span>
          </div>
        )}

        <div className="flex space-x-3">
          {/* 頭貼與名字對齊 */}
          <Link
            href={`/profile/${author.userID}`}
            data-prevent-post-navigation="true"
            onClick={(event) => event.stopPropagation()}
          >
            <Avatar>
              <AvatarImage src={author.avatar || undefined} />
              <AvatarFallback>{author.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link
                  href={`/profile/${author.userID}`}
                  className="font-semibold hover:underline"
                  data-prevent-post-navigation="true"
                  onClick={(event) => event.stopPropagation()}
                >
                  {author.name || "Unknown User"}
                </Link>
                <Link
                  href={`/profile/${author.userID}`}
                  className="text-gray-500 hover:underline"
                  data-prevent-post-navigation="true"
                  onClick={(event) => event.stopPropagation()}
                >
                  @{author.userID}
                </Link>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{formatTimeAgo(post.createdAt)}</span>
              </div>

              {isOwnPost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-prevent-post-navigation="true"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete();
                      }}
                      className="text-red-600"
                      data-prevent-post-navigation="true"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("common.delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* 轉發時的額外內容 */}
            {post.isRepost && (post.content || (post as any).imageUrls?.length > 0) && (
              <div className="mt-2">
                <PostContent
                  content={post.content}
                  hashtags={post.hashtags}
                  mentions={post.mentions}
                  links={post.links}
                />
                {(post as any).imageUrls && (post as any).imageUrls.length > 0 && (
                  <div className={`mt-2 grid gap-2 ${
                    (post as any).imageUrls.length === 1 
                      ? 'grid-cols-1' 
                      : (post as any).imageUrls.length === 2 
                        ? 'grid-cols-2' 
                        : (post as any).imageUrls.length === 3
                          ? 'grid-cols-3'
                          : 'grid-cols-2'
                  }`}>
                    {(post as any).imageUrls.map((url: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="relative rounded-lg overflow-hidden aspect-square cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedImageUrl(url);
                          setSelectedImageIndex(idx);
                          setImageModalOpen(true);
                        }}
                      >
                        <Image
                          src={url}
                          alt={`Repost image ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 被轉發的內容 */}
            {post.isRepost && originalPost && (
              <div
                className="mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50 transition hover:border-gray-300"
                role="button"
                tabIndex={0}
                onClick={handleOriginalPostClick}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleOriginalPostClick(event as any);
                  }
                }}
                data-prevent-post-navigation="true"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Link
                    href={`/profile/${originalPost.author?.userID}`}
                    data-prevent-post-navigation="true"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={originalPost.author?.avatar || undefined} />
                      <AvatarFallback>
                        {originalPost.author?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link
                      href={`/profile/${originalPost.author?.userID}`}
                      className="font-semibold hover:underline text-sm"
                      data-prevent-post-navigation="true"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {originalPost.author?.name}
                    </Link>
                    <Link
                      href={`/profile/${originalPost.author?.userID}`}
                      className="text-gray-500 hover:underline text-sm ml-1"
                      data-prevent-post-navigation="true"
                      onClick={(event) => event.stopPropagation()}
                    >
                      @{originalPost.author?.userID}
                    </Link>
                  </div>
                </div>
                <PostContent
                  content={originalPost.content}
                  hashtags={originalPost.hashtags}
                  mentions={originalPost.mentions}
                  links={originalPost.links}
                />
                {Array.isArray(originalPost.imageUrls) && originalPost.imageUrls.length > 0 && (
                  <div
                    className={`mt-2 grid gap-2 ${
                      originalPost.imageUrls.length === 1
                        ? "grid-cols-1"
                        : originalPost.imageUrls.length === 2
                          ? "grid-cols-2"
                          : originalPost.imageUrls.length === 3
                            ? "grid-cols-3"
                            : "grid-cols-2"
                    }`}
                  >
                    {originalPost.imageUrls.map((url: string, idx: number) => (
                      <div
                        key={`original-${idx}`}
                        className="relative rounded-lg overflow-hidden aspect-square cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedImageUrl(url);
                          setSelectedImageIndex(idx);
                          setImageModalOpen(true);
                        }}
                      >
                        <Image
                          src={url}
                          alt={`Original image ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 一般文章的內容 */}
            {!post.isRepost && (
              <div className="mt-2">
                <PostContent
                  content={post.content}
                  hashtags={post.hashtags}
                  mentions={post.mentions}
                  links={post.links}
                />
                {(post as any).imageUrls && (post as any).imageUrls.length > 0 && (
                  <div
                    className={`mt-2 grid gap-2 ${
                      (post as any).imageUrls.length === 1
                        ? "grid-cols-1"
                        : (post as any).imageUrls.length === 2
                          ? "grid-cols-2"
                          : (post as any).imageUrls.length === 3
                            ? "grid-cols-3"
                            : "grid-cols-2"
                    }`}
                  >
                    {(post as any).imageUrls.map((url: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative rounded-lg overflow-hidden aspect-square cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedImageUrl(url);
                          setSelectedImageIndex(idx);
                          setImageModalOpen(true);
                        }}
                      >
                        <Image
                          src={url}
                          alt={`Post image ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {topComment && (
              <div
                className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-sm shadow-sm transition hover:border-blue-200"
                role="button"
                tabIndex={0}
                onClick={handleTopCommentClick}
                onKeyDown={handleTopCommentKeyDown}
                data-prevent-post-navigation="true"
              >
                <div className="flex items-center justify-between text-blue-900">
                  <span className="font-semibold">
                    {topComment.author?.name || t("postCard.deletedUser")}
                  </span>
                  <span className="text-xs text-blue-700">
                    {t("postCard.likes", { count: topComment.likesCount || 0 })}
                  </span>
                </div>
                <div className="mt-2 flex items-start gap-2 text-blue-900">
                  <MessageCircle className="mt-0.5 h-4 w-4 text-blue-500" />
                  <p className="line-clamp-2 text-sm">
                    {topComment.content || t("postCard.noCommentContent")}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center space-x-6">
              {!hideCommentsButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  data-prevent-post-navigation="true"
                  onClick={(event) => {
                    event.stopPropagation();
                    setCommentsDialogOpen(true);
                  }}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {commentsCount}
                </Button>
              )}
              {hideCommentsButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-500 hover:text-gray-700"
                  data-prevent-post-navigation="true"
                  onClick={(event) => {
                    event.stopPropagation();
                    onCommentClick?.();
                  }}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {commentsCount}
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                data-prevent-post-navigation="true"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRepost();
                }}
              >
                <Repeat2 className="mr-2 h-4 w-4" />
                {repostsCount}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`h-8 ${isLiked ? "text-red-500" : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  handleLike();
                }}
                disabled={loading}
                data-prevent-post-navigation="true"
              >
                <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {likesCount}
              </Button>
              {!isComment && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 ${isBookmarked ? "text-blue-500" : ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleBookmark();
                  }}
                  disabled={loading}
                  data-prevent-post-navigation="true"
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </article>

      {!hideCommentsButton && (
        <CommentsDialog
          open={commentsDialogOpen}
          onOpenChange={setCommentsDialogOpen}
          postId={postId}
          post={post}
        />
      )}

      <RepostDialog
        open={repostDialogOpen}
        onOpenChange={setRepostDialogOpen}
        post={post}
        onSuccess={() => router.refresh()}
      />
      <ImageModal
        open={imageModalOpen}
        onOpenChange={setImageModalOpen}
        imageUrl={selectedImageUrl}
        imageUrls={(post as any).imageUrls}
        currentIndex={selectedImageIndex}
      />
      {!isComment && (
        <BookmarkDialog
          open={bookmarkDialogOpen}
          onOpenChange={setBookmarkDialogOpen}
        postId={postId}
          onSuccess={(selectedFolders) => {
            setIsBookmarked(selectedFolders.length > 0);
          }}
        />
      )}
    </>
  );
}

