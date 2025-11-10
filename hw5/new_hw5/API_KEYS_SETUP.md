# API Keys 申請指南

## 📋 環境變數清單

請在專案根目錄建立 `.env.local` 檔案，並填入以下環境變數：

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OAuth - Facebook
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Pusher
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=ap1

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

---

## 1. NextAuth Secret

### 產生方式
在終端機執行：
```bash
openssl rand -base64 32
```

### 說明
- `NEXTAUTH_SECRET`: 用於加密 JWT token 的密鑰
- `NEXTAUTH_URL`: 
  - 開發環境：`http://localhost:3000`
  - 生產環境：你的 Vercel 部署 URL（例如：`https://your-app.vercel.app`）

---

## 2. MongoDB Atlas

### 申請步驟
1. 前往 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 註冊免費帳號
3. 建立新的 Organization（或使用預設）
4. 建立新的 Project（或使用預設）
5. 建立免費 Cluster（選擇 M0 Free Tier）
   - 選擇 Cloud Provider（AWS, Google Cloud, Azure）
   - 選擇 Region（建議選擇離你最近的）
   - Cluster Name 可以自訂
6. 等待 Cluster 建立完成（約 3-5 分鐘）

### 設定 Database User
1. 在左側選單點擊 "Database Access"
2. 點擊 "Add New Database User"
3. 選擇 "Password" 認證方式
4. 輸入 Username 和 Password（記下來！）
5. 設定 User Privileges 為 "Atlas admin" 或 "Read and write to any database"
6. 點擊 "Add User"

### 設定 Network Access
1. 在左側選單點擊 "Network Access"
2. 點擊 "Add IP Address"
3. 開發階段：選擇 "Allow Access from Anywhere"（0.0.0.0/0）
4. 生產環境：可以只允許 Vercel 的 IP（但開發階段建議先允許所有 IP）

### 取得 Connection String
1. 在左側選單點擊 "Database"
2. 點擊你的 Cluster 名稱
3. 點擊 "Connect" 按鈕
4. 選擇 "Connect your application"
5. 選擇 Driver 為 "Node.js" 和 Version 為最新的
6. 複製 Connection String，格式如下：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. 將 `<username>` 和 `<password>` 替換為你建立的 Database User 的帳號密碼
8. 在最後加上資料庫名稱，例如：
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hw5?retryWrites=true&w=majority
   ```

### 填入環境變數
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hw5?retryWrites=true&w=majority
```

---

## 3. Google OAuth

### 申請步驟
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google+ API：
   - 在左側選單點擊 "APIs & Services" → "Library"
   - 搜尋 "Google+ API" 或 "Google Identity"
   - 點擊 "Enable"
4. 建立 OAuth 憑證：
   - 在左側選單點擊 "APIs & Services" → "Credentials"
   - 點擊 "Create Credentials" → "OAuth client ID"
   - 如果第一次使用，需要先設定 OAuth consent screen：
     - User Type: External（開發階段）或 Internal（如果是 G Suite）
     - App name: 你的應用名稱
     - User support email: 你的 email
     - Developer contact information: 你的 email
     - 點擊 "Save and Continue"
     - Scopes 可以跳過，點擊 "Save and Continue"
     - Test users 可以跳過，點擊 "Save and Continue"
     - 點擊 "Back to Dashboard"
   - 回到 "Credentials" 頁面，點擊 "Create Credentials" → "OAuth client ID"
   - Application type: Web application
   - Name: 你的應用名稱
   - Authorized JavaScript origins:
     - `http://localhost:3000`（開發環境）
     - `https://your-app.vercel.app`（生產環境，部署後再新增）
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`（開發環境）
     - `https://your-app.vercel.app/api/auth/callback/google`（生產環境，部署後再新增）
   - 點擊 "Create"
   - 複製 Client ID 和 Client Secret

### 填入環境變數
```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 4. GitHub OAuth

### 申請步驟
1. 前往 GitHub Settings → Developer settings
   - 點擊右上角頭像 → Settings
   - 在左側選單最下方點擊 "Developer settings"
2. 點擊 "OAuth Apps" → "New OAuth App"
3. 填寫表單：
   - Application name: 你的應用名稱
   - Homepage URL: `http://localhost:3000`（開發環境）
   - Application description: 可選
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - 點擊 "Register application"
4. 複製 Client ID
5. 點擊 "Generate a new client secret" 生成 Client Secret（只會顯示一次，請記下來！）

### 生產環境設定
部署到 Vercel 後，需要更新：
1. 回到 OAuth App 設定頁面
2. 更新 Homepage URL 為你的 Vercel URL
3. 更新 Authorization callback URL 為 `https://your-app.vercel.app/api/auth/callback/github`

### 填入環境變數
```
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## 5. Facebook OAuth

### 申請步驟
1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 點擊右上角 "My Apps" → "Create App"
3. 選擇 App Type: "Consumer" 或 "Business"
4. 填寫 App 資訊：
   - App Display Name: 你的應用名稱
   - App Contact Email: 你的 email
   - 點擊 "Create App"
5. 在左側選單點擊 "Add Product" → 找到 "Facebook Login" → 點擊 "Set Up"
6. 選擇平台：選擇 "Web"
7. 設定 Facebook Login：
   - Site URL: `http://localhost:3000`（開發環境）
   - 點擊 "Save"
8. 在左側選單點擊 "Settings" → "Basic"
   - 可以看到 App ID 和 App Secret
   - 點擊 "Show" 顯示 App Secret（只會顯示一次，請記下來！）

### 設定 OAuth Redirect URI
1. 在左側選單點擊 "Facebook Login" → "Settings"
2. 在 "Valid OAuth Redirect URIs" 中新增：
   - `http://localhost:3000/api/auth/callback/facebook`（開發環境）
   - `https://your-app.vercel.app/api/auth/callback/facebook`（生產環境，部署後再新增）

### 填入環境變數
```
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

---

## 6. Pusher

### 申請步驟
1. 前往 [Pusher](https://pusher.com/)
2. 註冊免費帳號
3. 登入後點擊 "Channels" → "Create app"
4. 填寫表單：
   - App name: 你的應用名稱
   - Cluster: 選擇離你最近的（例如：ap1, ap2, us2, eu）
   - 選擇 "Channels" 作為功能
   - 點擊 "Create app"
5. 在 App 頁面的 "Keys" 標籤中，可以看到：
   - App ID
   - Key
   - Secret
   - Cluster

### 填入環境變數
```
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=ap1

# 前端 Pusher 客戶端需要的環境變數（必須與上面相同）
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=ap1
```

### 注意事項
- Pusher 免費方案有頻道數和訊息數限制
- 開發階段應該足夠使用
- 生產環境如果流量大，可能需要升級方案
- **重要**：`NEXT_PUBLIC_PUSHER_KEY` 和 `NEXT_PUBLIC_PUSHER_CLUSTER` 必須與伺服器端的 `PUSHER_KEY` 和 `PUSHER_CLUSTER` 相同，因為它們是前端 Pusher 客戶端需要的環境變數

---

## 7. Cloudinary

### 申請步驟
1. 前往 [Cloudinary](https://cloudinary.com/)
2. 註冊免費帳號（可以使用 Google/GitHub 快速註冊）
3. 登入後，在 Dashboard 可以看到：
   - Cloud name
   - API Key
   - API Secret

### 填入環境變數
```
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 注意事項
- Cloudinary 免費方案有儲存空間和流量限制
- 開發階段應該足夠使用
- 圖片上傳時建議設定轉換和優化參數

---

## ✅ 檢查清單

在開始開發前，請確認：

- [ ] MongoDB Atlas 已設定並取得 Connection String
- [ ] Google OAuth 已申請並設定 Callback URL
- [ ] GitHub OAuth 已申請並設定 Callback URL
- [ ] Facebook OAuth 已申請並設定 Callback URL
- [ ] Pusher 已申請並取得所有 Keys
- [ ] Cloudinary 已申請並取得所有 Keys
- [ ] NextAuth Secret 已產生
- [ ] `.env.local` 檔案已建立並填入所有環境變數
- [ ] 所有環境變數都沒有拼寫錯誤

---

## 🔒 安全提醒

1. **永遠不要將 `.env.local` 提交到 Git**
   - 確認 `.gitignore` 包含 `.env.local`

2. **生產環境設定**
   - 部署到 Vercel 後，需要在 Vercel 專案設定中新增所有環境變數
   - 每個 OAuth Provider 都需要新增生產環境的 Callback URL

3. **定期更新 Secret**
   - 如果懷疑 Secret 洩漏，立即更換

4. **限制 Network Access**
   - MongoDB Atlas 在生產環境可以限制只允許特定 IP

---

## 📝 下一步

完成所有 API Keys 申請後，請：
1. 確認 `.env.local` 檔案已建立並填入所有環境變數
2. 測試 MongoDB 連線（可以建立測試腳本）
3. 開始專案初始化

