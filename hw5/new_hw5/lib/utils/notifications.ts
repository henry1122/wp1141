import dbConnect from "@/lib/db/mongoose";
import Notification from "@/lib/db/models/Notification";
import { Types } from "mongoose";
import { pusherServer } from "@/lib/pusher/server";

/**
 * 創建通知
 */
export async function createNotification(
  userId: string | Types.ObjectId,
  type: "like" | "repost" | "reply" | "follow" | "message",
  actorId: string | Types.ObjectId,
  postId?: string | Types.ObjectId
) {
  try {
    await dbConnect();

    // 不通知自己
    if (userId.toString() === actorId.toString()) {
      return;
    }

    const notification = await Notification.create({
      userId,
      type,
      actorId,
      postId,
    });

    // 透過 Pusher 推送通知更新
    try {
      await pusherServer.trigger(`user-${userId}`, "notification", {
        type: "new",
        notificationId: (notification._id as any).toString(),
      });
    } catch (pusherError) {
      console.error("Pusher notification error:", pusherError);
    }
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

