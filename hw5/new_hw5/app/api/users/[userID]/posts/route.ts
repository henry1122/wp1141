import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import dbConnect from "@/lib/db/mongoose";
import Post from "@/lib/db/models/Post";
import User from "@/lib/db/models/User";
import Like from "@/lib/db/models/Like";
import Repost from "@/lib/db/models/Repost";

export async function GET(
  request: NextRequest,
  { params }: { params: { userID: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ userID: params.userID });

    if (!user) {
      return NextResponse.json({ error: "使用者不存在" }, { status: 404 });
    }

    // 取得使用者的所有文章和轉發（顯示在個人資料頁面）
    const posts = await Post.find({
      authorId: user._id as any,
      parentPostId: null,
    })
      .populate("authorId", "name userID avatar")
      .populate({
        path: "originalPostId",
        select: "content hashtags mentions links authorId imageUrls createdAt",
        populate: {
          path: "authorId",
          select: "name userID avatar",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    // 取得統計資訊
    const postIds = posts.map((p) => p._id);
    const [likes, reposts, comments, userLikes, userReposts] = await Promise.all([
      Like.find({ postId: { $in: postIds } }),
      Repost.find({ postId: { $in: postIds } }),
      Post.find({ parentPostId: { $in: postIds } }),
      Like.find({ userId: session.user.id, postId: { $in: postIds } }),
      Repost.find({ userId: session.user.id, postId: { $in: postIds } }),
    ]);

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

        return {
          ...post,
          author: author, // 將 authorId 轉換為 author
          authorId: author._id, // 保留 authorId 作為 ObjectId
          originalPost,
          likesCount: likesCountMap.get(post._id.toString()) || 0,
          repostsCount: repostsCountMap.get(post._id.toString()) || 0,
          commentsCount: commentsCountMap.get(post._id.toString()) || 0,
          isLiked: likeMap.has(post._id.toString()),
          isReposted: repostMap.has(post._id.toString()),
        };
      })
      .filter(Boolean); // 過濾掉 null 值

    return NextResponse.json({ posts: postsWithStats });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
