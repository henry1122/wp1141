import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import dbConnect from "@/lib/db/mongoose";
import Post from "@/lib/db/models/Post";
import Like from "@/lib/db/models/Like";
import Repost from "@/lib/db/models/Repost";

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    await dbConnect();

    const post = await Post.findById(params.postId)
      .populate("authorId", "name userID avatar")
      .populate({
        path: "originalPostId",
        select: "content hashtags mentions links authorId imageUrls createdAt",
        populate: {
          path: "authorId",
          select: "name userID avatar",
        },
      })
      .lean();

    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 取得統計資訊
    const [likesCount, repostsCount, commentsCount, isLiked, isReposted] = await Promise.all([
      Like.countDocuments({ postId: params.postId }),
      Repost.countDocuments({ postId: params.postId }),
      Post.countDocuments({ parentPostId: params.postId }),
      Like.findOne({ userId: session.user.id, postId: params.postId }),
      Repost.findOne({ userId: session.user.id, postId: params.postId }),
    ]);

    // 將 authorId 轉換為 author
    const authorId = (post as any).authorId;
    const author = authorId && typeof authorId === 'object' ? authorId : null;

    let originalPost = null;

    if ((post as any).isRepost && (post as any).originalPostId) {
      const rawOriginal = (post as any).originalPostId;
      if (rawOriginal && typeof rawOriginal === "object") {
        if (rawOriginal.authorId && typeof rawOriginal.authorId === "object") {
          originalPost = {
            ...rawOriginal,
            author: rawOriginal.authorId,
            authorId: rawOriginal.authorId._id,
            imageUrls: rawOriginal.imageUrls || [],
          };
        } else {
          originalPost = rawOriginal;
        }
      }
    }

    return NextResponse.json({
      post: {
        ...post,
        author: author || null, // 將 authorId 轉換為 author
        authorId: author?._id || (post as any).authorId, // 保留 authorId 作為 ObjectId
        originalPost,
        likesCount,
        repostsCount,
        commentsCount,
        isLiked: !!isLiked,
        isReposted: !!isReposted,
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    await dbConnect();

    const post = await Post.findById(params.postId);

    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 檢查是否為作者
    if ((post.authorId as any).toString() !== session.user.id) {
      return NextResponse.json({ error: "無權限刪除此文章" }, { status: 403 });
    }

    // 檢查是否為轉發（轉發不能刪除）
    if (post.isRepost) {
      return NextResponse.json({ error: "轉發的文章不能刪除" }, { status: 400 });
    }

    // 刪除文章
    await Post.deleteOne({ _id: params.postId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

