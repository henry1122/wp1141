import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

import dbConnect from "@/lib/db/mongoose";
import Post from "@/lib/db/models/Post";
import Like from "@/lib/db/models/Like";
import Repost from "@/lib/db/models/Repost";
import { parseHashtags, parseMentions, parseLinks, validatePostContent } from "@/lib/utils/text-processing";
import { pusherServer } from "@/lib/pusher/server";
import { createNotification } from "@/lib/utils/notifications";

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    await dbConnect();

    // 取得所有相關的評論（包括第2層和第3層）
    // 第2層：parentPostId 為主 Post
    // 第3層：parentPostId 為第2層的留言
    const level2Comments = await Post.find({
      parentPostId: params.postId,
    })
      .populate("authorId", "name userID avatar")
      .sort({ createdAt: -1 })
      .lean();

    // 取得第3層留言（回覆第2層留言的留言）
    // 第3層留言要越早的越上面（升序）
    const level2CommentIds = level2Comments.map((c) => c._id);
    const level3Comments = await Post.find({
      parentPostId: { $in: level2CommentIds },
    })
      .populate("authorId", "name userID avatar")
      .sort({ createdAt: 1 }) // 升序：越早的越上面
      .lean();

    // 合併所有評論
    const comments = [...level2Comments, ...level3Comments];

    // 取得統計資訊
    const commentIds = comments.map((c) => c._id);
    const [likes, reposts, userLikes] = await Promise.all([
      Like.find({ postId: { $in: commentIds } }),
      Repost.find({ postId: { $in: commentIds } }),
      Like.find({ userId: session.user.id, postId: { $in: commentIds } }),
    ]);

    const likeMap = new Map(userLikes.map((l) => [l.postId.toString(), true]));
    const likesCountMap = new Map<string, number>();
    const repostsCountMap = new Map<string, number>();

    likes.forEach((l) => {
      const count = likesCountMap.get(l.postId.toString()) || 0;
      likesCountMap.set(l.postId.toString(), count + 1);
    });

    reposts.forEach((r) => {
      const count = repostsCountMap.get(r.postId.toString()) || 0;
      repostsCountMap.set(r.postId.toString(), count + 1);
    });

    const commentsWithStats = comments
      .map((comment: any) => {
        // 將 authorId 轉換為 author
        const authorId = comment.authorId;
        const author = authorId && typeof authorId === 'object' ? authorId : null;
        
        // 如果 author 不存在或 userID 是臨時的，過濾掉這則評論
        if (!author || !author.userID || author.userID.startsWith("temp_")) {
          return null;
        }

        return {
          ...comment,
          author: author, // 將 authorId 轉換為 author
          authorId: author._id, // 保留 authorId 作為 ObjectId
          likesCount: likesCountMap.get(comment._id.toString()) || 0,
          repostsCount: repostsCountMap.get(comment._id.toString()) || 0,
          commentsCount: 0,
          isLiked: likeMap.has(comment._id.toString()),
          isReposted: false,
        };
      })
      .filter(Boolean); // 過濾掉 null 值

    return NextResponse.json({ comments: commentsWithStats });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { content, replyToUserId } = await request.json();

    // 驗證內容
    const validation = validatePostContent(content);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await dbConnect();

    // 檢查父文章是否存在
    const parentPost = await Post.findById(params.postId);
    if (!parentPost) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 決定 parentPostId
    let finalParentPostId = params.postId; // 預設為主 Post

    if (replyToUserId) {
      // 這是回覆某個留言的留言
      const replyToComment = await Post.findById(replyToUserId);
      if (replyToComment) {
        // 檢查被回覆的留言是第幾層
        const replyToParentId = replyToComment.parentPostId?.toString();
        
        if (replyToParentId === params.postId) {
          // 被回覆的是第2層（主 Post 的直接留言），新留言成為第3層（回覆該留言）
          finalParentPostId = replyToUserId;
        } else {
          // 被回覆的是第3層（回覆留言的留言）
          // 第3層留言的 parentPostId 應該是第2層留言的 ID
          // 所以新留言應該回覆被回覆的留言（第3層），但實際上應該回覆第2層留言
          // 為了保持結構，我們讓新留言也回覆同一個第2層留言
          // 找到第2層留言的 ID
          if (replyToParentId) {
            const level2Comment = await Post.findById(replyToParentId);
            if (level2Comment && level2Comment.parentPostId?.toString() === params.postId) {
              // 確認這是第2層留言，新留言回覆第2層留言
              finalParentPostId = replyToParentId;
            } else {
              // 如果找不到第2層，就回覆被回覆的留言本身
              finalParentPostId = replyToUserId;
            }
          } else {
            // 如果沒有 parentId，就回覆被回覆的留言本身
            finalParentPostId = replyToUserId;
          }
        }
      }
    }

    // 解析 hashtags, mentions, links
    const hashtags = parseHashtags(content);
    const mentions = parseMentions(content);
    const links = parseLinks(content);

    // 建立評論
    const comment = await Post.create({
      authorId: session.user.id,
      content,
      hashtags,
      mentions,
      links,
      parentPostId: finalParentPostId,
    });

    await comment.populate("authorId", "name userID avatar");

    // 將 authorId 轉換為 author
    const authorId = (comment.authorId as any);
    const author = authorId && typeof authorId === 'object' ? authorId : null;

    // 創建通知（通知主 Post 的作者）
    await createNotification(
      (parentPost.authorId as any).toString(),
      "reply",
      session.user.id,
      params.postId
    );

    // 透過 Pusher 推送新評論事件
    try {
      const commentsCount = await Post.countDocuments({ parentPostId: params.postId });
      await pusherServer.trigger(`post-${params.postId}`, "comment-added", {
        postId: params.postId,
        commentId: (comment._id as any).toString(),
        commentsCount,
      });
    } catch (pusherError) {
      console.error("Pusher error:", pusherError);
    }

    return NextResponse.json({ 
      comment: {
        ...comment.toObject(),
        author: author || null,
        authorId: author?._id || comment.authorId,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

