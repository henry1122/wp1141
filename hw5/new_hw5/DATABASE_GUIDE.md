# 資料庫使用指南

## 📚 資料庫互動方式

### 當前使用的技術：Mongoose（不是 Prisma）

這個專案使用 **Mongoose** 作為 ODM（Object Document Mapper）來與 MongoDB 互動。

**為什麼不用 Prisma？**
- Prisma 主要支援關聯式資料庫（PostgreSQL, MySQL, SQLite）
- MongoDB 是 NoSQL 文檔資料庫
- Mongoose 是 MongoDB 的官方推薦 ODM，專為 MongoDB 設計

### 資料庫模型（Models）

專案中的資料庫模型位於 `lib/db/models/`：

- `User.ts` - 使用者模型
- `Post.ts` - 文章模型
- `Like.ts` - 讚模型
- `Repost.ts` - 轉發模型
- `Follow.ts` - 關注模型
- `Draft.ts` - 草稿模型
- `Notification.ts` - 通知模型

### 如何使用 Models

在 API Routes 中使用：

```typescript
import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import Post from "@/lib/db/models/Post";

export async function GET() {
  // 1. 連接資料庫
  await dbConnect();
  
  // 2. 查詢資料
  const users = await User.find({});
  const posts = await Post.find({}).populate('authorId');
  
  // 3. 返回資料
  return Response.json({ users, posts });
}
```

## 👀 如何查看資料庫內容

### 方法 1：使用 MongoDB Atlas 網頁界面（推薦）

1. 登入 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 選擇你的 Cluster
3. 點擊 "Browse Collections"
4. 選擇資料庫 `hw5`
5. 查看所有 Collections（users, posts, likes 等）

### 方法 2：使用 MongoDB Compass（桌面應用）

1. 下載 [MongoDB Compass](https://www.mongodb.com/products/compass)
2. 使用你的 MongoDB URI 連接：
   ```
   mongodb+srv://redtigerttczyczy_db_user:qhIz4yU15H3gJVD5@cluster0.qyaeelp.mongodb.net/hw5
   ```
3. 瀏覽所有 Collections 和 Documents

### 方法 3：使用提供的腳本

```bash
# 查看資料庫內容
yarn view-db
```

這個腳本會顯示：
- 所有使用者
- 所有文章（前 5 篇）
- 所有讚
- 所有關注關係
- 統計資訊

### 方法 4：使用 MongoDB Shell（mongosh）

```bash
# 連接資料庫
mongosh "mongodb+srv://redtigerttczyczy_db_user:qhIz4yU15H3gJVD5@cluster0.qyaeelp.mongodb.net/hw5"

# 查看所有資料庫
show dbs

# 使用資料庫
use hw5

# 查看所有 Collections
show collections

# 查看 Users
db.users.find().pretty()

# 查看 Posts
db.posts.find().pretty()
```

## 🔄 資料持久性

### MongoDB Atlas（雲端服務）

**✅ 資料不會消失！**

- MongoDB Atlas 是雲端託管服務
- 資料永久儲存在 MongoDB Atlas 的伺服器上
- 重新部署、重啟伺服器、甚至刪除本地專案，資料都不會消失
- 除非你手動刪除 Cluster 或資料庫

### 本地開發環境

如果你使用本地 MongoDB（不是 Atlas）：
- 資料會儲存在本地檔案系統
- 只要不刪除 MongoDB 的資料目錄，資料就不會消失
- Docker MongoDB 容器停止時，資料會保留（如果使用 volume）

## 🌱 種子資料（預設資料）

### 使用種子腳本

專案提供了種子腳本來添加測試資料：

```bash
# 添加測試資料（不刪除現有資料）
yarn seed

# 清空資料庫並添加測試資料
yarn seed:clear
```

### 種子資料包含：

- 3 個測試使用者
- 3 篇測試文章
- 3 個測試讚
- 2 個測試關注關係

### 在開發環境自動執行種子

可以在 `package.json` 的 `dev` 腳本中添加：

```json
{
  "scripts": {
    "dev:seed": "yarn seed:clear && yarn dev"
  }
}
```

### 手動創建種子資料

你也可以直接使用 MongoDB Compass 或 Atlas 界面手動添加資料。

## 🛠️ 常用的資料庫操作

### 查詢所有使用者
```typescript
const users = await User.find({});
```

### 查詢特定使用者
```typescript
const user = await User.findOne({ userID: "testuser1" });
```

### 創建新使用者
```typescript
const user = await User.create({
  userID: "newuser",
  provider: "google",
  providerAccountId: "123",
  name: "New User",
});
```

### 更新使用者
```typescript
await User.findByIdAndUpdate(userId, { name: "Updated Name" });
```

### 刪除使用者
```typescript
await User.findByIdAndDelete(userId);
```

### 查詢並關聯（Populate）
```typescript
const posts = await Post.find({})
  .populate('authorId', 'name userID avatar')
  .sort({ createdAt: -1 });
```

## 📝 注意事項

1. **環境變數**：確保 `.env.local` 中的 `MONGODB_URI` 正確
2. **連接池**：Mongoose 會自動管理連接池，不需要手動關閉
3. **錯誤處理**：始終使用 try-catch 處理資料庫操作
4. **資料驗證**：Models 中定義了驗證規則，會自動驗證資料

## 🚀 下一步

1. 使用 `yarn seed:clear` 添加測試資料
2. 使用 `yarn view-db` 查看資料
3. 開始開發和測試功能！

