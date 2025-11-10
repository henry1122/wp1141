/**
 * 清理資料庫腳本（開發環境用）
 * 使用方法: yarn clear-db
 * 或: yarn tsx scripts/clear-db.ts
 * 
 * ⚠️ 警告：此腳本會刪除所有資料！
 */

// 載入環境變數
import dotenv from "dotenv";
import { resolve } from "path";

// 載入 .env.local 文件
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import Post from "@/lib/db/models/Post";
import Like from "@/lib/db/models/Like";
import Repost from "@/lib/db/models/Repost";
import Follow from "@/lib/db/models/Follow";
import Draft from "@/lib/db/models/Draft";
import Notification from "@/lib/db/models/Notification";
import mongoose from "mongoose";

async function clearDatabase() {
  try {
    console.log("🗑️  開始清理資料庫...\n");

    // 連接資料庫
    await dbConnect();
    console.log("✅ 已連接到 MongoDB\n");

    // 刪除所有資料
    console.log("正在刪除資料...");
    
    const [usersCount, postsCount, likesCount, repostsCount, followsCount, draftsCount, notificationsCount] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Like.countDocuments(),
      Repost.countDocuments(),
      Follow.countDocuments(),
      Draft.countDocuments(),
      Notification.countDocuments(),
    ]);

    console.log(`📊 當前資料統計：`);
    console.log(`   - Users: ${usersCount}`);
    console.log(`   - Posts: ${postsCount}`);
    console.log(`   - Likes: ${likesCount}`);
    console.log(`   - Reposts: ${repostsCount}`);
    console.log(`   - Follows: ${followsCount}`);
    console.log(`   - Drafts: ${draftsCount}`);
    console.log(`   - Notifications: ${notificationsCount}\n`);

    // 刪除所有資料
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Like.deleteMany({}),
      Repost.deleteMany({}),
      Follow.deleteMany({}),
      Draft.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log("✅ 資料庫已清空！\n");
    console.log("🎉 現在可以重新註冊了！");

  } catch (error) {
    console.error("❌ 清理資料庫失敗:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("✅ 已斷開 MongoDB 連接");
  }
}

clearDatabase();

