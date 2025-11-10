import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import Post from "@/lib/db/models/Post";
import Follow from "@/lib/db/models/Follow";

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

    const user = await User.findOne({ userID: params.userID }).lean();

    if (!user) {
      return NextResponse.json({ error: "使用者不存在" }, { status: 404 });
    }

    // 取得統計資訊
    const [postsCount, followersCount, followingCount, isFollowing] = await Promise.all([
      Post.countDocuments({ authorId: user._id as any, isRepost: false }),
      Follow.countDocuments({ followingId: user._id as any }),
      Follow.countDocuments({ followerId: user._id as any }),
      Follow.findOne({
        followerId: session.user.id,
        followingId: user._id as any,
      }),
    ]);

    return NextResponse.json({
      user: {
        ...user,
        postsCount,
        followersCount,
        followingCount,
        isFollowing: !!isFollowing,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

