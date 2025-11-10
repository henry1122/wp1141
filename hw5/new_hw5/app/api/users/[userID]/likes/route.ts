import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import Like from "@/lib/db/models/Like";
import Post from "@/lib/db/models/Post";

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

    // 檢查是否為自己的 Likes（只能看自己的）
    if ((user._id as any).toString() !== session.user.id) {
      return NextResponse.json({ error: "無權限" }, { status: 403 });
    }

    // 取得使用者按過讚的文章
    const likes = await Like.find({ userId: user._id as any }).sort({ createdAt: -1 });
    const postIds = likes.map((l) => l.postId);

    const posts = await Post.find({ _id: { $in: postIds } })
      .populate("authorId", "name userID avatar")
      .sort({ createdAt: -1 })
      .lean();

    // 取得統計資訊
    const [likesCounts, repostsCounts, commentsCounts, userLikes, userReposts] = await Promise.all([
      Like.find({ postId: { $in: postIds } }),
      Post.find({ isRepost: true, originalPostId: { $in: postIds } }),
      Post.find({ parentPostId: { $in: postIds } }),
      Like.find({ userId: session.user.id, postId: { $in: postIds } }),
      Post.find({ isRepost: true, authorId: session.user.id, originalPostId: { $in: postIds } }),
    ]);

    const likesCountMap = new Map<string, number>();
    const repostsCountMap = new Map<string, number>();
    const commentsCountMap = new Map<string, number>();
    const isLikedMap = new Map(userLikes.map((l) => [l.postId.toString(), true]));
    const isRepostedMap = new Map(userReposts.map((r) => [r.originalPostId?.toString() || "", true]));

    likesCounts.forEach((l) => {
      const count = likesCountMap.get(l.postId.toString()) || 0;
      likesCountMap.set(l.postId.toString(), count + 1);
    });

    repostsCounts.forEach((r) => {
      const count = repostsCountMap.get(r.originalPostId?.toString() || "") || 0;
      repostsCountMap.set(r.originalPostId?.toString() || "", count + 1);
    });

    commentsCounts.forEach((c) => {
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

        return {
          ...post,
          author: author, // 將 authorId 轉換為 author
          authorId: author._id, // 保留 authorId 作為 ObjectId
          likesCount: likesCountMap.get(post._id.toString()) || 0,
          repostsCount: repostsCountMap.get(post._id.toString()) || 0,
          commentsCount: commentsCountMap.get(post._id.toString()) || 0,
          isLiked: isLikedMap.has(post._id.toString()),
          isReposted: isRepostedMap.has(post._id.toString()),
        };
      })
      .filter(Boolean); // 過濾掉 null 值

    return NextResponse.json({ posts: postsWithStats });
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

