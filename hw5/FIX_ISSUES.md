# 修復三個問題的指南

## 問題 1: 沒有進入到註冊畫面

### 解決方案
已添加 `redirect` callback 到 NextAuth 配置中，登入成功後會自動重定向到註冊頁面。

### 手動測試
如果自動重定向還是不工作，請：
1. 清除瀏覽器 cookies
2. 訪問 `http://localhost:3000/auth/register` 直接進入註冊頁面

## 問題 2: GitHub 和 Facebook 憑證沒辦法用

### GitHub OAuth 設置

1. **檢查 GitHub Developer Settings**
   - 訪問：https://github.com/settings/developers
   - 找到您的 OAuth App
   - 確認 **Authorization callback URL** 設置為：
     ```
     http://localhost:3000/api/auth/callback/github
     ```

2. **檢查環境變數**
   您的 `.env.local` 應該包含：
   ```env
   GITHUB_ID=Ov23li5FSncnEeL7QcHK
   GITHUB_SECRET=58e568152027e6f915ed0be970e28cfe16192363
   ```

### Facebook OAuth 設置

1. **檢查 Facebook Developer Console**
   - 訪問：https://developers.facebook.com/
   - 找到您的應用程式
   - 在 **Facebook Login** → **Settings** 中
   - 確認 **Valid OAuth Redirect URIs** 包含：
     ```
     http://localhost:3000/api/auth/callback/facebook
     ```

2. **檢查環境變數**
   您的 `.env.local` 應該包含：
   ```env
   FACEBOOK_CLIENT_ID=your-facebook-app-id
   FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
   ```

### 常見錯誤

- **GitHub**: `redirect_uri_mismatch` - 檢查 callback URL 是否完全匹配
- **Facebook**: 應用程式可能需要在開發模式下，或需要審核

## 問題 3: 頁面一直在主頁面

### 原因
這通常是因為：
1. 已經有 session 但沒有 userID
2. 重定向邏輯有問題

### 解決方案

1. **清除 session**
   - 在瀏覽器控制台執行：
     ```javascript
     fetch('/api/auth/signout', { method: 'POST' })
     ```
   - 或清除所有 cookies

2. **直接訪問註冊頁面**
   ```
   http://localhost:3000/auth/register
   ```

3. **檢查資料庫**
   - 如果用戶已經存在但沒有 userID，可能需要手動設置

## 快速修復步驟

1. **停止開發伺服器**（Ctrl+C）

2. **清除瀏覽器 cookies**

3. **重新啟動伺服器**
   ```bash
   npm run dev
   ```

4. **訪問註冊頁面**
   ```
   http://localhost:3000/auth/register
   ```

5. **如果還是看到登入頁面**
   - 檢查瀏覽器控制台的錯誤
   - 檢查終端輸出的錯誤
   - 確認所有環境變數都已正確設置

