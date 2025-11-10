import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import { uploadImage } from "@/lib/cloudinary/upload";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "沒有檔案" }, { status: 400 });
    }

    // 驗證檔案類型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "只允許圖片檔案" }, { status: 400 });
    }

    // 驗證檔案大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "檔案大小不能超過 5MB" }, { status: 400 });
    }

    // 上傳到 Cloudinary
    const url = await uploadImage(file);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "上傳失敗" }, { status: 500 });
  }
}

