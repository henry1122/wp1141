import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import dbConnect from "@/lib/db/mongoose";
import Draft from "@/lib/db/models/Draft";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { draftId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    await dbConnect();

    const draft = await Draft.findById(params.draftId);

    if (!draft) {
      return NextResponse.json({ error: "草稿不存在" }, { status: 404 });
    }

    if (draft.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "無權限" }, { status: 403 });
    }

    await Draft.deleteOne({ _id: params.draftId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting draft:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

