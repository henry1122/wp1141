import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { bio, avatar, backgroundImage } = await request.json();

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        ...(bio !== undefined && { bio: bio.substring(0, 160) }),
        ...(avatar !== undefined && { avatar }),
        ...(backgroundImage !== undefined && { backgroundImage }),
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "使用者不存在" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

