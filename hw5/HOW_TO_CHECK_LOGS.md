# 如何查看 NextAuth 日誌訊息

## 📍 查看日誌的位置

NextAuth 的日誌訊息會顯示在**運行開發伺服器的終端**中。

### 步驟 1: 找到運行 `npm run dev` 的終端

1. 在 VS Code 或您的編輯器中，找到**終端（Terminal）**面板
   - 通常在編輯器底部
   - 或按快捷鍵：`` Ctrl + ` ``（反引號）

2. 如果沒有看到終端，可以：
   - 在 VS Code 中：`Terminal` → `New Terminal`
   - 或按 `Ctrl + Shift + `` `（反引號）

### 步驟 2: 確認開發伺服器正在運行

終端應該顯示類似這樣的訊息：
```
> my-x@0.1.0 dev
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
```

### 步驟 3: 執行 Google 登入測試

1. 在瀏覽器中訪問 `http://localhost:3000`
2. 點擊「Continue with Google」
3. 完成 Google 登入
4. **立即查看終端**，您應該會看到類似這樣的日誌：

```
[NextAuth Redirect] url: /auth/register baseUrl: http://localhost:3000
[NextAuth Redirect] Redirecting to /auth/register
```

或者如果有錯誤：
```
Error in signIn callback: [錯誤訊息]
Error in redirect callback: [錯誤訊息]
```

## 🔍 需要檢查的訊息

### 1. NextAuth Redirect 日誌

當您完成 Google 登入後，終端應該會顯示：
```
[NextAuth Redirect] url: [這裡會顯示 URL] baseUrl: [這裡會顯示 baseUrl]
```

**預期的輸出：**
- `url: /auth/register` 或 `url: http://localhost:3000/auth/register`
- `baseUrl: http://localhost:3000`

### 2. 錯誤訊息

檢查是否有以下錯誤：
- `Error in signIn callback:` - signIn callback 出錯
- `Error in redirect callback:` - redirect callback 出錯
- `Error in session callback:` - session callback 出錯
- `PrismaClientInitializationError` - 資料庫連接錯誤
- `MongoServerError` - MongoDB 連接錯誤

### 3. 資料庫連接錯誤

如果看到資料庫連接錯誤，檢查：
- `.env.local` 中的 `DATABASE_URL
- MongoDB Atlas 是否正常運行
- 網路連接是否正常

## 📸 如何截圖或複製日誌

### 方法 1: 複製終端文字
1. 在終端中選中要複製的文字
2. 右鍵點擊 → `Copy`
3. 或使用快捷鍵：`Ctrl + C`（選中文字後）

### 方法 2: 截圖
- 使用 Windows 截圖工具：`Win + Shift + S`
- 或使用截圖軟體

## 🧪 測試步驟

1. **打開終端**（確保可以看到 `npm run dev` 的輸出）

2. **清除瀏覽器 cookies**（或使用無痕模式）

3. **訪問** `http://localhost:3000`

4. **點擊「Continue with Google」**

5. **完成 Google 登入**

6. **立即查看終端**，尋找：
   - `[NextAuth Redirect]` 開頭的日誌
   - 任何錯誤訊息

7. **複製或截圖終端的輸出**，特別是：
   - `[NextAuth Redirect] url:` 這一行
   - 任何錯誤訊息

## 💡 如果看不到日誌

如果終端沒有顯示任何日誌：

1. **確認開發伺服器正在運行**
   - 終端應該顯示 `Ready in X.Xs`
   - 如果沒有，重新運行 `npm run dev`

2. **確認瀏覽器可以訪問應用**
   - 訪問 `http://localhost:3000` 應該能正常顯示

3. **檢查終端是否滾動到底部**
   - 日誌可能在上方，需要向上滾動查看

4. **重新啟動開發伺服器**
   ```bash
   # 停止伺服器（按 Ctrl+C）
   # 然後重新啟動
   npm run dev
   ```

## 📋 需要提供的資訊

當您測試後，請提供：

1. **終端中顯示的 `[NextAuth Redirect]` 日誌**
   - 特別是 `url:` 和 `baseUrl:` 的值

2. **任何錯誤訊息**
   - 完整的錯誤訊息（包括堆疊追蹤）

3. **瀏覽器控制台的錯誤**（如果有）
   - 按 F12 打開開發者工具
   - 查看 Console 標籤

4. **瀏覽器 Network 標籤的資訊**（可選）
   - 按 F12 → Network 標籤
   - 查看 `/api/auth/callback/google` 的請求

