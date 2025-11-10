import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import dbConnect from "@/lib/db/mongoose";
import Post from "@/lib/db/models/Post";
import Like from "@/lib/db/models/Like";
import Repost from "@/lib/db/models/Repost";
import Follow from "@/lib/db/models/Follow";
import User from "@/lib/db/models/User";
import { parseHashtags, parseMentions, parseLinks, validatePostContent } from "@/lib/utils/text-processing";
import { pusherServer } from "@/lib/pusher/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "all";
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query: any = {};

    if (type === "following") {
      // 取得追蹤的使用者 ID
      const follows = await Follow.find({ followerId: session.user.id }).select("followingId");
      const followingIds = follows.map((f) => f.followingId);

      // 只顯示追蹤者的文章和轉發
      query = {
        $or: [
          { authorId: { $in: followingIds } },
          { isRepost: true, authorId: { $in: followingIds } },
        ],
      };
    }

    // 取得文章（只顯示主 Post，不顯示留言）
    const posts = await Post.find({
      ...query,
      parentPostId: null, // 只顯示主 Post，不顯示留言
    })
      .populate("authorId", "name userID avatar")
      .populate({
        path: "originalPostId",
        select: "content hashtags mentions links authorId imageUrls createdAt",
        populate: {
          path: "authorId",
          select: "name userID avatar",
        },
      }) // 轉發時需要原始文章及其作者
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 取得統計資訊
    const postIds = posts.map((p) => p._id);
    const [likes, reposts, comments] = await Promise.all([
      Like.find({ postId: { $in: postIds } }),
      Repost.find({ postId: { $in: postIds } }),
      Post.find({ parentPostId: { $in: postIds } }),
    ]);

    // 取得當前使用者的按讚和轉發狀態
    const userLikes = await Like.find({ userId: session.user.id, postId: { $in: postIds } });
    const userReposts = await Repost.find({ userId: session.user.id, postId: { $in: postIds } });

    const likeMap = new Map(userLikes.map((l) => [l.postId.toString(), true]));
    const repostMap = new Map(userReposts.map((r) => [r.postId.toString(), true]));
    const likesCountMap = new Map<string, number>();
    const repostsCountMap = new Map<string, number>();
    const commentsCountMap = new Map<string, number>();

    likes.forEach((l) => {
      const count = likesCountMap.get(l.postId.toString()) || 0;
      likesCountMap.set(l.postId.toString(), count + 1);
    });

    reposts.forEach((r) => {
      const count = repostsCountMap.get(r.postId.toString()) || 0;
      repostsCountMap.set(r.postId.toString(), count + 1);
    });

    comments.forEach((c) => {
      const count = commentsCountMap.get(c.parentPostId?.toString() || "") || 0;
      commentsCountMap.set(c.parentPostId?.toString() || "", count + 1);
    });

    const postsWithStats = posts
      .map((post: any) => {
        // 將 authorId 轉換為 author
        const authorId = post.authorId;
        const author = authorId && typeof authorId === 'object' ? authorId : null;
        
        // 如果 author 不存在或 userID 是臨時的，過濾掉這篇文章
        if (!author || !author.userID || author.userID.startsWith("temp_")) {
          return null;
        }

        // 處理 originalPostId（如果是轉發）
        let originalPost = null;
        if (post.isRepost && post.originalPostId) {
          const originalPostId = post.originalPostId;
          if (originalPostId && typeof originalPostId === 'object') {
            // 如果 originalPostId 已經被 populate，需要 populate authorId
            if (originalPostId.authorId && typeof originalPostId.authorId === 'object') {
              originalPost = {
                ...originalPostId,
                author: originalPostId.authorId,
                authorId: originalPostId.authorId._id,
                imageUrls: originalPostId.imageUrls || [],
              };
            } else {
              originalPost = originalPostId;
            }
          }
        }

        return {
          ...post,
          author: author, // 將 authorId 轉換為 author
          authorId: author._id, // 保留 authorId 作為 ObjectId
          originalPost: originalPost, // 轉發的原始文章
          likesCount: likesCountMap.get(post._id.toString()) || 0,
          repostsCount: repostsCountMap.get(post._id.toString()) || 0,
          commentsCount: commentsCountMap.get(post._id.toString()) || 0,
          isLiked: likeMap.has(post._id.toString()),
          isReposted: repostMap.has(post._id.toString()),
        };
      })
      .filter(Boolean); // 過濾掉 null 值（臨時 userID 的文章）

    return NextResponse.json({ posts: postsWithStats });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { content, parentPostId, imageUrls } = await request.json();

    // 驗證：必須有內容或圖片
    if ((!content || !content.trim()) && (!imageUrls || imageUrls.length === 0)) {
      return NextResponse.json({ error: "必須提供內容或圖片" }, { status: 400 });
    }

    // 驗證內容（如果有內容才驗證）
    if (content && content.trim()) {
      const validation = validatePostContent(content);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    await dbConnect();

    // 解析 hashtags, mentions, links（如果有內容）
    const hashtags = content && content.trim() ? parseHashtags(content) : [];
    const mentions = content && content.trim() ? parseMentions(content) : [];
    const links = content && content.trim() ? parseLinks(content) : [];

    // 建立文章
    const post = await Post.create({
      authorId: session.user.id,
      content: (content && content.trim()) || "",
      hashtags,
      mentions,
      links,
      parentPostId: parentPostId || undefined,
      imageUrls: imageUrls || [],
    });

    await post.populate("authorId", "name userID avatar");

    // 將 authorId 轉換為 author
    const authorId = (post.authorId as any);
    const author = authorId && typeof authorId === 'object' ? authorId : null;

    // 透過 Pusher 推送新文章事件
    try {
      await pusherServer.trigger("posts", "new-post", {
        postId: (post._id as any).toString(),
        authorId: author?._id?.toString() || (post.authorId as any).toString(),
        content: post.content,
      });
    } catch (pusherError) {
      console.error("Pusher error:", pusherError);
    }

    return NextResponse.json({ 
      post: {
        ...post.toObject(),
        author: author || null,
        authorId: author?._id || post.authorId,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

