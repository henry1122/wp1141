import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import dbConnect from "@/lib/db/mongoose";
import Notification from "@/lib/db/models/Notification";
import User from "@/lib/db/models/User";
import { pusherServer } from "@/lib/pusher/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");

    // 取得通知
    const notifications = await Notification.find({
      userId: session.user.id,
    })
      .populate("actorId", "name userID avatar")
      .populate("postId", "content")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 取得未讀數量
    const unreadCount = await Notification.countDocuments({
      userId: session.user.id,
      read: false,
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { notificationIds } = await request.json();

    await dbConnect();

    // 標記為已讀
    if (notificationIds && Array.isArray(notificationIds)) {
      await Notification.updateMany(
        {
          _id: { $in: notificationIds },
          userId: session.user.id,
        },
        { read: true }
      );
    } else {
      // 標記所有為已讀
      await Notification.updateMany(
        { userId: session.user.id },
        { read: true }
      );
    }

    // 獲取更新後的未讀數量
    const unreadCount = await Notification.countDocuments({
      userId: session.user.id,
      read: false,
    });

    // 透過 Pusher 推送通知更新
    try {
      await pusherServer.trigger(`user-${session.user.id}`, "notification", {
        unreadCount,
      });
    } catch (error) {
      console.error("Pusher error:", error);
    }

    return NextResponse.json({ success: true, unreadCount });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}


