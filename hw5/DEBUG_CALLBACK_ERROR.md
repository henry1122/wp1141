# 診斷 Callback 錯誤

## 🔍 問題分析

`error=Callback` 錯誤通常是由以下原因造成的：

### 1. ❌ 缺少 DATABASE_URL（最常見）

**症狀：**
- 完成 Google 登入後出現 `error=Callback`
- 終端中沒有看到 `[NextAuth SignIn]` 或 `[NextAuth Redirect]` 日誌
- 或者看到資料庫連接錯誤

**解決方法：**
1. 檢查 `.env.local` 文件是否包含 `DATABASE_URL`
2. 如果沒有，需要設置 MongoDB Atlas 連接字串

### 2. ❌ 資料庫連接失敗

**症狀：**
- 終端中看到 `PrismaClientInitializationError` 或 `MongoServerError`
- 連接字串格式錯誤

**解決方法：**
1. 確認 `DATABASE_URL` 格式正確
2. 確認 MongoDB Atlas IP 白名單包含您的 IP（或使用 `0.0.0.0/0`）
3. 確認資料庫用戶名和密碼正確

### 3. ❌ Prisma Schema 未同步

**症狀：**
- 資料庫連接正常，但表結構不匹配

**解決方法：**
```bash
npx prisma generate
npx prisma db push
```

## 🔧 檢查步驟

### 步驟 1: 檢查 .env.local

打開 `.env.local` 文件，確認包含：

```env
# 必須有
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/my-x?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=你的密鑰
GOOGLE_CLIENT_ID=你的Google客戶端ID
GOOGLE_CLIENT_SECRET=你的Google客戶端密鑰
```

### 步驟 2: 檢查終端日誌

完成 Google 登入後，終端應該顯示：

```
[NextAuth SignIn] User: your-email@gmail.com Provider: google
[NextAuth SignIn] Allowing sign in
[NextAuth Redirect] url: /auth/register baseUrl: http://localhost:3000
[NextAuth Redirect] Redirecting to /auth/register
```

**如果沒有看到這些日誌：**
- 可能是資料庫連接失敗
- 檢查終端是否有錯誤訊息

### 步驟 3: 檢查資料庫連接

在終端中運行：

```bash
npx prisma db push
```

如果出現錯誤，說明資料庫連接有問題。

## 🚀 快速修復

### 如果缺少 DATABASE_URL

1. **設置 MongoDB Atlas**（如果還沒有）：
   - 訪問 https://www.mongodb.com/cloud/atlas
   - 註冊免費帳號
   - 建立免費叢集（M0）
   - 建立資料庫使用者
   - 設定網路存取：`0.0.0.0/0`
   - 取得連線字串

2. **添加到 .env.local**：
   ```env
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/my-x?retryWrites=true&w=majority
   ```

3. **重新啟動開發伺服器**：
   ```bash
   # 停止伺服器（Ctrl+C）
   npm run dev
   ```

4. **同步資料庫結構**：
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **清除瀏覽器 cookies 並重新測試**

## 📋 需要提供的資訊

當您測試後，請提供：

1. **.env.local 中是否有 DATABASE_URL？**
   - 如果有，值是什麼（可以隱藏密碼部分）

2. **終端中顯示的日誌**：
   - 是否有 `[NextAuth SignIn]` 日誌？
   - 是否有 `[NextAuth Redirect]` 日誌？
   - 是否有任何錯誤訊息？

3. **運行 `npx prisma db push` 的結果**：
   - 是否成功？
   - 如果有錯誤，錯誤訊息是什麼？

## 💡 常見錯誤訊息

### `PrismaClientInitializationError`
- **原因**：資料庫連接失敗
- **解決**：檢查 `DATABASE_URL` 是否正確，MongoDB Atlas 是否可訪問

### `MongoServerError: Authentication failed`
- **原因**：資料庫用戶名或密碼錯誤
- **解決**：檢查 MongoDB Atlas 中的用戶憑證

### `MongoServerError: IP not whitelisted`
- **原因**：您的 IP 不在 MongoDB Atlas 白名單中
- **解決**：在 MongoDB Atlas 中添加 `0.0.0.0/0` 或您的 IP

### 沒有錯誤，但看不到日誌
- **原因**：可能是 NextAuth 在更早的階段失敗
- **解決**：檢查瀏覽器控制台（F12）是否有錯誤

