import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { validateUserID } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { userID } = await request.json();

    // 驗證 UserID
    const validation = validateUserID(userID);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await dbConnect();

    // 檢查 UserID 是否已被使用（同一 provider，排除臨時 ID）
    const existingUser = await User.findOne({
      provider: session.user.provider,
      userID,
    });

    if (existingUser && !existingUser.userID.startsWith("temp_")) {
      return NextResponse.json({ error: "此 UserID 已被使用" }, { status: 400 });
    }

    // 找到當前使用者（根據 MongoDB _id，因為 session.user.id 是 _id）
    const currentUser = await User.findById(session.user.id);

    if (!currentUser) {
      return NextResponse.json({ error: "使用者不存在" }, { status: 404 });
    }

    // 更新使用者的 UserID
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { userID },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "更新失敗" }, { status: 500 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

