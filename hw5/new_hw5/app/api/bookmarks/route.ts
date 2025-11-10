import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import dbConnect from "@/lib/db/mongoose";
import Bookmark from "@/lib/db/models/Bookmark";
import Post from "@/lib/db/models/Post";
import Like from "@/lib/db/models/Like";
import Repost from "@/lib/db/models/Repost";

const DEFAULT_FOLDER_KEY = "default";

const normalizeFolderKey = (name?: string | null): string => {
  if (!name || !name.trim()) {
    return DEFAULT_FOLDER_KEY;
  }
  const trimmed = name.trim();
  const lowered = trimmed.toLowerCase();
  if (trimmed === DEFAULT_FOLDER_KEY || lowered === DEFAULT_FOLDER_KEY || trimmed === "已收藏的文章") {
    return DEFAULT_FOLDER_KEY;
  }
  return trimmed;
};

// 取得登入使用者的所有書籤，或是檢查指定貼文是否已被收藏
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get("postId");
    const folderName = searchParams.get("folderName");
    const includePosts = searchParams.get("includePosts") === "1";

    // 檢查單一貼文的所有收藏資料夾，供前端顯示目前勾選狀態
    if (postId) {
      const bookmarksForPost = await Bookmark.find({
        userId: session.user.id,
        postId,
      })
        .lean()
        .exec();

      const folderNames = bookmarksForPost.map((bookmark) => normalizeFolderKey(bookmark.folderName));

      return NextResponse.json({
        isBookmarked: bookmarksForPost.length > 0,
        bookmarks: bookmarksForPost,
        folderNames,
      });
    }

    const filter: Record<string, unknown> = { userId: session.user.id };

    if (folderName) {
      filter.folderName = folderName;
    }

    // 先取得書籤清單，再視需要載入貼文細節與互動統計
    const bookmarks = await Bookmark.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!includePosts || bookmarks.length === 0) {
      const normalized = bookmarks.map((bookmark) => ({
        ...bookmark,
        folderName: normalizeFolderKey(bookmark.folderName),
      }));
      return NextResponse.json({ bookmarks: normalized });
    }

    const postIds = bookmarks.map((bookmark) => bookmark.postId);

    // 取得貼文本體與作者資訊，讓收藏頁面可以直接渲染 PostCard
    const posts = await Post.find({ _id: { $in: postIds } })
      .populate("authorId", "name userID avatar")
      .populate({
        path: "originalPostId",
        select: "content hashtags mentions links authorId imageUrls createdAt",
        populate: {
          path: "authorId",
          select: "name userID avatar",
        },
      })
      .lean()
      .exec();

    const likes = await Like.find({ postId: { $in: postIds } }).lean().exec();
    const reposts = await Repost.find({ postId: { $in: postIds } }).lean().exec();
    const comments = await Post.find({ parentPostId: { $in: postIds } })
      .select("parentPostId")
      .lean()
      .exec();

    const userLikes = await Like.find({
      userId: session.user.id,
      postId: { $in: postIds },
    })
      .select("postId")
      .lean()
      .exec();

    const userReposts = await Repost.find({
      userId: session.user.id,
      postId: { $in: postIds },
    })
      .select("postId")
      .lean()
      .exec();

    const likesCountMap = new Map<string, number>();
    const repostsCountMap = new Map<string, number>();
    const commentsCountMap = new Map<string, number>();
    const likedMap = new Map<string, boolean>();
    const repostedMap = new Map<string, boolean>();

    likes.forEach((like) => {
      const key = like.postId.toString();
      likesCountMap.set(key, (likesCountMap.get(key) || 0) + 1);
    });

    reposts.forEach((repost) => {
      const key = repost.postId.toString();
      repostsCountMap.set(key, (repostsCountMap.get(key) || 0) + 1);
    });

    comments.forEach((comment) => {
      const key = comment.parentPostId?.toString();
      if (!key) return;
      commentsCountMap.set(key, (commentsCountMap.get(key) || 0) + 1);
    });

    userLikes.forEach((like) => {
      likedMap.set(like.postId.toString(), true);
    });

    userReposts.forEach((repost) => {
      repostedMap.set(repost.postId.toString(), true);
    });

    const postsMap = new Map<string, any>();

    posts.forEach((post) => {
      const author =
        post.authorId && typeof post.authorId === "object" ? post.authorId : null;

      // 如果作者不存在或 userID 尚未設定，直接略過這篇貼文
      if (!author || !author.userID || author.userID.startsWith("temp_")) {
        return;
      }

      let originalPost = null;

      if (post.isRepost && post.originalPostId) {
        const original = post.originalPostId as any;
        if (original && typeof original === "object") {
          if (original.authorId && typeof original.authorId === "object") {
            originalPost = {
              ...original,
              author: original.authorId,
              authorId: original.authorId._id,
            };
          } else {
            originalPost = original;
          }
        }
      }

      const key = post._id.toString();

      postsMap.set(key, {
        ...post,
        author,
        authorId: author._id,
        originalPost,
        likesCount: likesCountMap.get(key) || 0,
        repostsCount: repostsCountMap.get(key) || 0,
        commentsCount: commentsCountMap.get(key) || 0,
        isLiked: likedMap.get(key) || false,
        isReposted: repostedMap.get(key) || false,
      });
    });

    const bookmarksWithPosts = bookmarks
      .map((bookmark) => {
        const key = bookmark.postId.toString();
        const post = postsMap.get(key);

        if (!post) {
          return null;
        }

        return {
          ...bookmark,
          folderName: normalizeFolderKey(bookmark.folderName),
          post,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ bookmarks: bookmarksWithPosts });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

// 將貼文加入多個資料夾，或同步移除未勾選的資料夾
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { postId, folderName, folderNames } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "缺少 postId" }, { status: 400 });
    }

    await dbConnect();

    const targetPost = await Post.findById(postId).select("parentPostId").lean();
    if (!targetPost) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    if (targetPost.parentPostId) {
      return NextResponse.json({ error: "留言無法收藏" }, { status: 400 });
    }

    // 將資料夾名稱統一整理成不為空的集合，未提供時預設放入「已收藏的文章」
    const providedFolders = Array.isArray(folderNames) ? folderNames : folderName ? [folderName] : [];
    const normalizedFolders = Array.from(new Set(providedFolders.map((name: string) => normalizeFolderKey(name)))).filter(
      (name) => !!name
    );

    if (normalizedFolders.length === 0) {
      // 沒有選擇任何資料夾，代表使用者想取消收藏，直接刪除這篇貼文所有書籤
      await Bookmark.deleteMany({ userId: session.user.id, postId }).exec();
      return NextResponse.json({ success: true, folderNames: [], isBookmarked: false });
    }

    const foldersToApply = normalizedFolders.length > 0 ? normalizedFolders : [DEFAULT_FOLDER_KEY];

    // 先移除不在清單中的收藏資料夾，保持前端選擇與資料庫同步
    await Bookmark.deleteMany({
      userId: session.user.id,
      postId,
      folderName: { $nin: foldersToApply },
    }).exec();

    // 逐一 upsert，確保每個資料夾都有對應收藏紀錄
    const upserted = [] as any[];
    for (const folder of foldersToApply) {
      const normalizedName = normalizeFolderKey(folder);

      const bookmark = await Bookmark.findOneAndUpdate(
        {
          userId: session.user.id,
          postId,
          folderName: normalizedName,
        },
        {
          userId: session.user.id,
          postId,
          folderName: normalizedName,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )
        .lean()
        .exec();

      if (bookmark) {
        upserted.push(bookmark);
      }
    }

    return NextResponse.json({
      success: true,
      bookmarks: upserted,
      folderNames: foldersToApply,
      isBookmarked: foldersToApply.length > 0,
    });
  } catch (error: any) {
    console.error("Error saving bookmark:", error);

    if (error.code === 11000) {
      return NextResponse.json({ error: "此貼文已在資料夾中" }, { status: 409 });
    }

    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

// 從書籤中移除貼文
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { postId, folderName } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "缺少 postId" }, { status: 400 });
    }

    await dbConnect();

    const deleteFilter: Record<string, unknown> = {
      userId: session.user.id,
      postId,
    };

    // 如果指定資料夾，就只移除該資料夾內的收藏
    if (folderName) {
      deleteFilter.folderName = normalizeFolderKey(folderName);
    }

    await Bookmark.deleteOne(deleteFilter).exec();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

