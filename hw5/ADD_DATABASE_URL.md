# 添加 DATABASE_URL 到 .env.local

## ⚠️ 重要：您提供的 URL 格式不正確

您提供的 URL：
```
mongodb://atlas-sql-690eea3e8f4d135ea5a03615-cd7yb4.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin
```

這是 MongoDB Atlas SQL 的連接字串，不是標準的 MongoDB 連接字串。

## ✅ 正確的連接字串格式

標準的 MongoDB 連接字串應該是：
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## 🔧 如何取得正確的連接字串

### 方法 1: 從 MongoDB Atlas 取得（推薦）

1. **訪問 MongoDB Atlas**
   - 網址：https://www.mongodb.com/cloud/atlas
   - 登入您的帳號

2. **找到您的叢集**
   - 在左側導航欄點擊 "Database"
   - 找到您的叢集（應該會顯示 "Cluster0" 或類似的名稱）

3. **取得連接字串**
   - 點擊叢集旁邊的 "Connect" 按鈕
   - 選擇 "Connect your application"
   - Driver: 選擇 `Node.js`
   - Version: 選擇 `5.5 or later`
   - 複製連接字串，格式應該是：
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

4. **修改連接字串**
   - 將 `<username>` 替換為您建立的資料庫使用者名稱
   - 將 `<password>` 替換為您設定的密碼（注意：密碼中的特殊字元需要 URL 編碼，例如 `@` 需要編碼為 `%40`）
   - 在 `@cluster0.xxxxx.mongodb.net/` 後面加上資料庫名稱，例如：`my-x`
   - 最終格式應該是：
     ```
     mongodb+srv://<username>:<encoded-password>@cluster0.xxxxx.mongodb.net/my-x?retryWrites=true&w=majority
     ```
   - ⚠️ 注意：`@` 符號在密碼中需要編碼為 `%40`

### 方法 2: 使用您提供的資訊構建（如果找不到正確的連接字串）

如果您無法找到正確的連接字串，可以嘗試：

1. **找到叢集名稱**
   - 在 MongoDB Atlas 的 "Database" 頁面
   - 查看您的叢集名稱（通常是 `Cluster0`）

2. **構建連接字串**
   ```
   mongodb+srv://<username>:<encoded-password>@cluster0.xxxxx.mongodb.net/my-x?retryWrites=true&w=majority
   ```
   - 將 `cluster0.xxxxx.mongodb.net` 替換為您實際的叢集地址
   - 將 `my-x` 替換為您想要的資料庫名稱

## 📝 添加到 .env.local

打開 `.env.local` 文件，添加或更新：

```env
DATABASE_URL=mongodb+srv://<username>:<encoded-password>@cluster0.xxxxx.mongodb.net/my-x?retryWrites=true&w=majority
```

**重要：**
- 密碼中的 `@` 必須編碼為 `%40`
- 資料庫名稱（`my-x`）可以改成您想要的任何名稱
- 確保叢集地址是正確的（從 MongoDB Atlas 複製）

## 🧪 測試連接

添加後，在終端運行：

```bash
npx prisma db push
```

如果成功，您會看到：
```
✔ Generated Prisma Client
✔ Pushed database schema
```

如果失敗，檢查：
- 連接字串格式是否正確
- 用戶名和密碼是否正確
- IP 白名單是否包含 `0.0.0.0/0`
- 叢集地址是否正確

