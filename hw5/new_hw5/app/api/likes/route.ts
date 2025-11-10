import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import dbConnect from "@/lib/db/mongoose";
import Like from "@/lib/db/models/Like";
import Post from "@/lib/db/models/Post";
import { pusherServer } from "@/lib/pusher/server";
import { createNotification } from "@/lib/utils/notifications";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "缺少 postId" }, { status: 400 });
    }

    await dbConnect();

    // 檢查是否已按讚
    const existingLike = await Like.findOne({
      userId: session.user.id,
      postId,
    });

    if (existingLike) {
      // 取消按讚
      await Like.deleteOne({ _id: existingLike._id });
      const likesCount = await Like.countDocuments({ postId });

      // 透過 Pusher 推送更新
      try {
        await pusherServer.trigger(`post-${postId}`, "like-updated", {
          postId,
          likesCount,
          isLiked: false,
        });
      } catch (pusherError) {
        console.error("Pusher error:", pusherError);
      }

      return NextResponse.json({ isLiked: false, likesCount });
    } else {
      // 按讚
      await Like.create({
        userId: session.user.id,
        postId,
      });

      const likesCount = await Like.countDocuments({ postId });

      // 取得文章作者，創建通知
      const post = await Post.findById(postId);
      if (post) {
        await createNotification(
          (post.authorId as any).toString(),
          "like",
          session.user.id,
          postId
        );
      }

      // 透過 Pusher 推送更新
      try {
        await pusherServer.trigger(`post-${postId}`, "like-updated", {
          postId,
          likesCount,
          isLiked: true,
        });
      } catch (pusherError) {
        console.error("Pusher error:", pusherError);
      }

      return NextResponse.json({ isLiked: true, likesCount });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

