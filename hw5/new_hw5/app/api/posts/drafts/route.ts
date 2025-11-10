import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import dbConnect from "@/lib/db/mongoose";
import Draft from "@/lib/db/models/Draft";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    await dbConnect();

    const drafts = await Draft.find({ userId: session.user.id })
      .sort({ savedAt: -1 })
      .lean();

    return NextResponse.json({ drafts });
  } catch (error) {
    console.error("Error fetching drafts:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "內容不能為空" }, { status: 400 });
    }

    await dbConnect();

    const draft = await Draft.create({
      userId: session.user.id,
      content: content.trim(),
    });

    return NextResponse.json({ draft }, { status: 201 });
  } catch (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

