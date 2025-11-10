import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import dbConnect from "@/lib/db/mongoose";
import Message from "@/lib/db/models/Message";
import User from "@/lib/db/models/User";

// 取得與特定用戶的對話
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    await dbConnect();

    // 取得與該用戶的所有訊息
    const messages = await Message.find({
      $or: [
        { senderId: session.user.id, receiverId: userId },
        { senderId: userId, receiverId: session.user.id },
      ],
    })
      .populate("senderId", "name userID avatar")
      .populate("receiverId", "name userID avatar")
      .sort({ createdAt: 1 })
      .lean();

    // 標記為已讀
    await Message.updateMany(
      {
        senderId: userId,
        receiverId: session.user.id,
        read: false,
      },
      { read: true }
    );

    // 透過 Pusher 推送訊息已讀更新（觸發 Sidebar 更新未讀數量）
    try {
      const { pusherServer } = await import("@/lib/pusher/server");
      await pusherServer.trigger(`user-${session.user.id}`, "new-message", {
        senderId: userId,
      });
    } catch (error) {
      console.error("Pusher error:", error);
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

