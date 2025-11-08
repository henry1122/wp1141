# 快速修復指南

## 問題 1: 沒有進入註冊畫面

### 立即解決方法
**直接訪問註冊頁面：**
```
http://localhost:3000/auth/register
```

### 如果還是被重定向回登入頁面
1. **清除瀏覽器 cookies**
   - 按 F12 打開開發者工具
   - Application → Cookies → 刪除所有 cookies
   - 或使用無痕模式

2. **重新登入**
   - 訪問 `http://localhost:3000`
   - 點擊「Continue with Google」
   - 完成 Google 登入後，應該會跳轉到註冊頁面

## 問題 2: GitHub 和 Facebook 憑證無法使用

### GitHub 設置檢查

1. **確認 GitHub OAuth App 設置**
   - 訪問：https://github.com/settings/developers
   - 找到您的 OAuth App
   - **Authorization callback URL** 必須是：
     ```
     http://localhost:3000/api/auth/callback/github
     ```

2. **環境變數已設置** ✅
   - `GITHUB_ID=Ov23li5FSncnEeL7QcHK`
   - `GITHUB_SECRET=58e568152027e6f915ed0be970e28cfe16192363`

### Facebook 設置

1. **檢查環境變數**
   - 您的 `.env.local` 中**沒有** Facebook 憑證
   - 如果不需要 Facebook 登入，可以忽略
   - 如果需要，請添加：
     ```env
     FACEBOOK_CLIENT_ID=your-facebook-app-id
     FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
     ```

## 問題 3: 頁面一直在主頁面

### 原因
您已經有 session 但沒有 userID，導致循環重定向。

### 解決方法

**方法 1: 清除 session 並重新開始**
1. 打開瀏覽器控制台（F12）
2. 執行：
   ```javascript
   fetch('/api/auth/signout', { method: 'POST' }).then(() => window.location.href = '/auth/signin')
   ```

**方法 2: 直接訪問註冊頁面**
```
http://localhost:3000/auth/register
```

**方法 3: 清除所有 cookies**
- 清除瀏覽器的所有 cookies
- 重新訪問 `http://localhost:3000`

## 推薦步驟

1. **停止開發伺服器**（如果正在運行，按 Ctrl+C）

2. **清除瀏覽器 cookies**（或使用無痕模式）

3. **重新啟動伺服器**
   ```bash
   npm run dev
   ```

4. **訪問註冊頁面**
   ```
   http://localhost:3000/auth/register
   ```

5. **如果看到「Unauthorized」或重定向到登入頁面**
   - 先訪問 `http://localhost:3000`
   - 點擊「Continue with Google」登入
   - 登入成功後應該會自動跳轉到註冊頁面
   - 如果沒有，手動訪問 `http://localhost:3000/auth/register`

## 測試 GitHub 登入

1. 確認 GitHub OAuth App 的 callback URL 正確
2. 清除 cookies
3. 訪問 `http://localhost:3000`
4. 點擊「Continue with GitHub」
5. 完成 GitHub 授權後應該會跳轉到註冊頁面

