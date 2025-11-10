import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import dbConnect from "@/lib/db/mongoose";
import Message from "@/lib/db/models/Message";
import User from "@/lib/db/models/User";
import mongoose from "mongoose";

// 取得對話列表（與所有用戶的對話）
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    await dbConnect();

    // 將 session.user.id 轉換為 ObjectId 以確保類型匹配
    const userId = new mongoose.Types.ObjectId(session.user.id);

    // 取得所有與當前用戶相關的對話（作為發送者或接收者）
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiverId", userId] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        // 過濾掉臨時用戶（userID 以 temp_ 開頭）
        $match: {
          "user.userID": { $not: { $regex: "^temp_" } },
        },
      },
      {
        $project: {
          userId: { $toString: "$_id" },
          user: {
            _id: { $toString: "$user._id" },
            name: "$user.name",
            userID: "$user.userID",
            avatar: "$user.avatar",
          },
          lastMessage: {
            content: "$lastMessage.content",
            createdAt: "$lastMessage.createdAt",
            senderId: "$lastMessage.senderId",
          },
          unreadCount: 1,
        },
      },
      {
        $addFields: {
          "lastMessage.senderId": { $toString: "$lastMessage.senderId" },
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

// 發送訊息
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { receiverId, content } = await request.json();

    if (!receiverId || !content || !content.trim()) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    await dbConnect();

    // 檢查接收者是否存在
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json({ error: "接收者不存在" }, { status: 404 });
    }

    // 創建訊息
    const message = await Message.create({
      senderId: session.user.id,
      receiverId,
      content: content.trim(),
    });

    await message.populate("senderId", "name userID avatar");
    await message.populate("receiverId", "name userID avatar");

    // 不創建訊息通知（訊息通知應該顯示在訊息按鈕上，而不是通知按鈕上）

    // 透過 Pusher 推送新訊息通知
    try {
      const { pusherServer } = await import("@/lib/pusher/server");
      await pusherServer.trigger(`user-${receiverId}`, "new-message", {
        senderId: session.user.id,
        messageId: (message._id as any).toString(),
      });
    } catch (error) {
      console.error("Pusher error:", error);
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

