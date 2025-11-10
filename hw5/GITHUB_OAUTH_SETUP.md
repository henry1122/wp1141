# GitHub OAuth 設定完整指南

## 📋 步驟 1: 確認 2FA (Two-Factor Authentication)

**⚠️ 重要：** GitHub 現在要求 OAuth 應用程式必須啟用 2FA。

### 檢查 2FA 狀態：
1. 訪問：https://github.com/settings/security
2. 查看 "Two-factor authentication" 區塊
3. 如果顯示 "Disable two-factor authentication"，表示已啟用 ✅
4. 如果顯示 "Enable two-factor authentication"，請點擊啟用

### 啟用 2FA（如果尚未啟用）：
1. 點擊 "Enable two-factor authentication"
2. 選擇驗證方式（簡訊或驗證器應用程式）
3. 按照指示完成設置

---

## 📋 步驟 2: 確認 GitHub OAuth App 設定

### 檢查 Authorization callback URL：

1. 訪問：https://github.com/settings/developers
2. 找到您的 OAuth App "My-X"
3. 點擊進入應用程式設定
4. 確認 **Authorization callback URL** 設置為：
   ```
   http://localhost:3000/api/auth/callback/github
   ```
   ⚠️ **必須完全匹配，包括協議、端口和路徑**

5. 如果部署到 Vercel，也需要添加生產環境的 URL：
   ```
   https://wp1141-kappa.vercel.app/api/auth/callback/github
   ```

---

## 📋 步驟 3: 複製 Client ID

從 GitHub 設定頁面：
- **Client ID**: `Ov231i5FSncnEeL7QcHK`
  （從圖片中看到的 ID，請確認是否正確）

---

## 📋 步驟 4: 生成 Client Secret

1. 在 GitHub OAuth App 設定頁面
2. 找到 "Client secrets" 區塊
3. 點擊 **"Generate a new client secret"** 按鈕
4. **⚠️ 重要：** Client Secret 只會顯示一次！
5. 立即複製並保存到安全的地方

---

## 📋 步驟 5: 更新 `.env.local` 文件

在專案根目錄創建或編輯 `.env.local` 文件：

```env
# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=你的NEXTAUTH_SECRET（使用 openssl rand -base64 32 生成）

# GitHub OAuth
GITHUB_ID=Ov231i5FSncnEeL7QcHK
GITHUB_SECRET=你剛才生成的Client_Secret
```

### 注意事項：
- ⚠️ **不要**在 `.env.local` 中添加引號
- ⚠️ **不要**在值前後添加空格
- ⚠️ **確保** Client Secret 是完整且正確的

---

## 📋 步驟 6: 驗證設定

### 檢查清單：
- [ ] 2FA 已啟用
- [ ] Authorization callback URL 正確設置
- [ ] Client ID 已複製
- [ ] Client Secret 已生成並複製
- [ ] `.env.local` 文件已更新
- [ ] 環境變數格式正確（無引號、無空格）

### 測試登入：
1. 重新啟動開發伺服器：
   ```bash
   npm run dev
   ```

2. 訪問：http://localhost:3000/auth/signin

3. 點擊 "Continue with GitHub"

4. 完成 GitHub 授權

5. 應該會重定向到註冊頁面

---

## 🔧 常見問題

### 問題 1: "redirect_uri_mismatch" 錯誤
**解決方法：**
- 確認 Authorization callback URL 完全匹配
- 檢查是否有尾隨斜線 `/`
- 確認協議是 `http://`（本地）或 `https://`（生產）

### 問題 2: "Invalid client secret"
**解決方法：**
- 確認 Client Secret 已正確複製（無多餘空格）
- 如果舊的 Secret 已刪除，需要生成新的
- 確認 `.env.local` 中的值沒有引號

### 問題 3: 需要 2FA 但未啟用
**解決方法：**
- 訪問 https://github.com/settings/security
- 啟用 Two-Factor Authentication
- 重新生成 Client Secret（啟用 2FA 後可能需要）

---

## 📝 範例 `.env.local` 文件

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Database
DATABASE_URL=your-mongodb-connection-string

# GitHub OAuth
GITHUB_ID=Ov231i5FSncnEeL7QcHK
GITHUB_SECRET=your-github-client-secret-here

# Google OAuth (如果使用)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## ✅ 完成後

設定完成後，GitHub 登入應該可以正常工作。如果遇到問題，請檢查：
1. 終端日誌中的錯誤訊息
2. 瀏覽器控制台（F12）的錯誤
3. GitHub OAuth App 設定是否正確

