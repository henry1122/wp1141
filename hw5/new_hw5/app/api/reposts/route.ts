import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import dbConnect from "@/lib/db/mongoose";
import Repost from "@/lib/db/models/Repost";
import Post from "@/lib/db/models/Post";
import { pusherServer } from "@/lib/pusher/server";
import { createNotification } from "@/lib/utils/notifications";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { postId, content, imageUrls } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "缺少 postId" }, { status: 400 });
    }

    await dbConnect();

    // 檢查是否已轉發（如果沒有添加內容，則檢查是否已轉發過）
    if (!content && (!imageUrls || imageUrls.length === 0)) {
      const existingRepost = await Repost.findOne({
        userId: session.user.id,
        postId,
      });

      if (existingRepost) {
        return NextResponse.json({ error: "已轉發過此文章" }, { status: 400 });
      }
    }

    // 檢查文章是否存在
    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 如果有內容，需要解析 hashtags, mentions, links
    let hashtags: string[] = [];
    let mentions: string[] = [];
    let links: any[] = [];

    if (content && content.trim()) {
      const { parseHashtags, parseMentions, parseLinks, validatePostContent } = await import("@/lib/utils/text-processing");
      // 驗證內容
      const validation = validatePostContent(content);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      hashtags = parseHashtags(content);
      mentions = parseMentions(content);
      links = parseLinks(content);
    }

    // 建立轉發記錄（如果沒有添加內容）
    if (!content && (!imageUrls || imageUrls.length === 0)) {
      await Repost.create({
        userId: session.user.id,
        postId,
      });
    }

    // 建立轉發文章（新的 Post，包含被轉發的內容）
    // 如果沒有內容和圖片，使用原始文章的內容（一般轉發）
    const hasImages = imageUrls && imageUrls.length > 0;
    const repostContent = content && content.trim() 
      ? content.trim() 
      : (hasImages ? "" : originalPost.content); // 如果有圖片但沒內容，內容為空
    const repostHashtags = content && content.trim() ? hashtags : originalPost.hashtags;
    const repostMentions = content && content.trim() ? mentions : originalPost.mentions;
    const repostLinks = content && content.trim() ? links : originalPost.links;

    const repostPost = await Post.create({
      authorId: session.user.id,
      content: repostContent,
      hashtags: repostHashtags,
      mentions: repostMentions,
      links: repostLinks,
      isRepost: true,
      originalPostId: postId,
      imageUrls: imageUrls || [], // 支持多張圖片
    });

    await repostPost.populate("authorId", "name userID avatar");
    await repostPost.populate({
      path: "originalPostId",
      select: "content hashtags mentions links authorId imageUrls createdAt",
      populate: {
        path: "authorId",
        select: "name userID avatar",
      },
    });

    // 創建通知（postId 應該是轉發的 post，而不是原始 post）
    await createNotification(
      (originalPost.authorId as any).toString(),
      "repost",
      session.user.id,
      (repostPost._id as any).toString() // 使用轉發的 post ID
    );

    const repostsCount = await Repost.countDocuments({ postId });

    // 透過 Pusher 推送更新
    try {
      await pusherServer.trigger(`post-${postId}`, "repost-updated", {
        postId,
        repostsCount,
      });
      await pusherServer.trigger("posts", "new-post", {
        postId: (repostPost._id as any).toString(),
        authorId: session.user.id,
        content: repostPost.content,
      });
    } catch (pusherError) {
      console.error("Pusher error:", pusherError);
    }

    const repostObject = repostPost.toObject();
    const rawAuthor = repostObject.authorId;
    const author = rawAuthor && typeof rawAuthor === "object" ? rawAuthor : null;
    let original = null;

    if ((repostPost as any).originalPostId) {
      const rawOriginal = (repostPost as any).originalPostId;
      if (rawOriginal && typeof rawOriginal === "object") {
        if (rawOriginal.authorId && typeof rawOriginal.authorId === "object") {
          original = {
            ...rawOriginal.toObject?.() ?? rawOriginal,
            author: rawOriginal.authorId,
            authorId: rawOriginal.authorId._id,
            imageUrls: rawOriginal.imageUrls || [],
          };
        } else {
          original = rawOriginal;
        }
      }
    }

    return NextResponse.json({
      success: true,
      repostsCount,
      post: {
        ...repostObject,
        author,
        authorId: author?._id || repostObject.authorId,
        originalPost: original,
        likesCount: 0,
        repostsCount: 0,
        commentsCount: 0,
        isLiked: false,
        isReposted: true,
      },
    });
  } catch (error) {
    console.error("Error creating repost:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

