/**
 * 資料庫種子腳本（開發環境用）
 * 使用方法: 
 *   - 開發環境: yarn tsx scripts/seed-db.ts
 *   - 或使用: node --loader ts-node/esm scripts/seed-db.ts
 */

import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import Post from "@/lib/db/models/Post";
import Like from "@/lib/db/models/Like";
import Follow from "@/lib/db/models/Follow";
import { parseHashtags, parseMentions, parseLinks } from "@/lib/utils/text-processing";

async function seedDatabase() {
  try {
    console.log("🌱 開始種子資料庫...\n");

    // 連接資料庫
    await dbConnect();
    console.log("✅ 已連接到 MongoDB\n");

    // 清空資料庫（可選，只在開發環境使用）
    const shouldClear = process.env.NODE_ENV !== "production";
    if (shouldClear && process.argv.includes("--clear")) {
      console.log("🗑️  清空資料庫...");
      await User.deleteMany({});
      await Post.deleteMany({});
      await Like.deleteMany({});
      await Follow.deleteMany({});
      console.log("✅ 資料庫已清空\n");
    }

    // 創建測試使用者
    console.log("👤 創建測試使用者...");
    const users = await User.create([
      {
        userID: "testuser1",
        provider: "google",
        providerAccountId: "test_google_123",
        name: "測試使用者 1",
        email: "test1@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=test1",
        bio: "這是第一個測試使用者",
      },
      {
        userID: "testuser2",
        provider: "github",
        providerAccountId: "test_github_456",
        name: "測試使用者 2",
        email: "test2@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=test2",
        bio: "這是第二個測試使用者",
      },
      {
        userID: "testuser3",
        provider: "facebook",
        providerAccountId: "test_facebook_789",
        name: "測試使用者 3",
        email: "test3@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=test3",
      },
    ]);
    console.log(`✅ 創建了 ${users.length} 個測試使用者\n`);

    // 創建測試文章
    console.log("📝 創建測試文章...");
    const testPosts = [
      {
        authorId: users[0]._id,
        content: "這是第一篇測試文章！ #test #hello @testuser2",
        hashtags: parseHashtags("這是第一篇測試文章！ #test #hello @testuser2"),
        mentions: parseMentions("這是第一篇測試文章！ #test #hello @testuser2"),
        links: parseLinks("這是第一篇測試文章！ #test #hello @testuser2"),
        isRepost: false,
      },
      {
        authorId: users[1]._id,
        content: "第二篇測試文章，包含連結：https://example.com",
        hashtags: parseHashtags("第二篇測試文章，包含連結：https://example.com"),
        mentions: parseMentions("第二篇測試文章，包含連結：https://example.com"),
        links: parseLinks("第二篇測試文章，包含連結：https://example.com"),
        isRepost: false,
      },
      {
        authorId: users[0]._id,
        content: "第三篇測試文章 #test",
        hashtags: parseHashtags("第三篇測試文章 #test"),
        mentions: parseMentions("第三篇測試文章 #test"),
        links: parseLinks("第三篇測試文章 #test"),
        isRepost: false,
      },
    ];

    const posts = await Post.insertMany(testPosts);
    console.log(`✅ 創建了 ${posts.length} 篇測試文章\n`);

    // 創建測試讚
    console.log("❤️  創建測試讚...");
    const likes = await Like.create([
      {
        userId: users[1]._id,
        postId: posts[0]._id,
      },
      {
        userId: users[2]._id,
        postId: posts[0]._id,
      },
      {
        userId: users[0]._id,
        postId: posts[1]._id,
      },
    ]);
    console.log(`✅ 創建了 ${likes.length} 個測試讚\n`);

    // 創建測試關注
    console.log("👥 創建測試關注...");
    const follows = await Follow.create([
      {
        followerId: users[0]._id,
        followingId: users[1]._id,
      },
      {
        followerId: users[1]._id,
        followingId: users[0]._id,
      },
    ]);
    console.log(`✅ 創建了 ${follows.length} 個測試關注關係\n`);

    console.log("🎉 種子資料庫完成！");
    console.log("\n📊 統計：");
    console.log(`   - 使用者: ${users.length}`);
    console.log(`   - 文章: ${posts.length}`);
    console.log(`   - 讚: ${likes.length}`);
    console.log(`   - 關注: ${follows.length}`);
  } catch (error: any) {
    console.error("❌ 錯誤:", error.message);
    if (error.code === 11000) {
      console.error("💡 提示: 資料可能已存在，使用 --clear 參數來清空資料庫");
    }
  } finally {
    process.exit(0);
  }
}

seedDatabase();

