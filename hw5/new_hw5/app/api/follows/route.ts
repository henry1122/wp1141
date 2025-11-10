import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { Types } from "mongoose";

import dbConnect from "@/lib/db/mongoose";
import Follow from "@/lib/db/models/Follow";
import User from "@/lib/db/models/User";
import { createNotification } from "@/lib/utils/notifications";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { userID } = await request.json();

    if (!userID) {
      return NextResponse.json({ error: "缺少 userID" }, { status: 400 });
    }

    await dbConnect();

    // 找到要追蹤的使用者
    const targetUser = await User.findOne({ userID });
    if (!targetUser) {
      return NextResponse.json({ error: "使用者不存在" }, { status: 404 });
    }

    const targetUserId = (targetUser._id as Types.ObjectId).toString();
    if (targetUserId === session.user.id) {
      return NextResponse.json({ error: "不能追蹤自己" }, { status: 400 });
    }

    // 檢查是否已追蹤
    const existingFollow = await Follow.findOne({
      followerId: session.user.id,
      followingId: targetUser._id as Types.ObjectId,
    });

    if (existingFollow) {
      return NextResponse.json({ error: "已追蹤此使用者" }, { status: 400 });
    }

    // 建立追蹤記錄
    await Follow.create({
      followerId: session.user.id,
      followingId: targetUser._id as Types.ObjectId,
    });

    // 創建通知
    await createNotification(
      (targetUser._id as any).toString(),
      "follow",
      session.user.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating follow:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { userID } = await request.json();

    if (!userID) {
      return NextResponse.json({ error: "缺少 userID" }, { status: 400 });
    }

    await dbConnect();

    // 找到要取消追蹤的使用者
    const targetUser = await User.findOne({ userID });
    if (!targetUser) {
      return NextResponse.json({ error: "使用者不存在" }, { status: 404 });
    }

    // 刪除追蹤記錄
    await Follow.deleteOne({
      followerId: session.user.id,
      followingId: targetUser._id as Types.ObjectId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting follow:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

