# API Keys 取得指南 - 逐步教學

本專案需要以下 API keys，以下將逐步說明如何取得：

---

## 📋 需要的 API Keys 清單

1. ✅ **NEXTAUTH_SECRET** - 已生成（自行產生）
2. 🔑 **Google OAuth** - Client ID & Secret
3. 🔑 **GitHub OAuth** - Client ID & Secret  
4. 🔑 **Facebook OAuth** - App ID & Secret（選填）
5. 🔑 **MongoDB Atlas** - 資料庫連線字串
6. 🔑 **Pusher** - App ID, Key, Secret, Cluster
7. 🔑 **Cloudinary** - Cloud Name, API Key, Secret

---

## 1️⃣ NEXTAUTH_SECRET（已完成 ✅）

已為你生成：
```
D2RHmhINY53O18ILccmzQGt0g4kwF1GzprYUWZ8H++Q=
```

直接複製到 `.env.local` 檔案的 `NEXTAUTH_SECRET` 即可。

---

## 2️⃣ Google OAuth（約 5-10 分鐘）

### 步驟：

1. **前往 Google Cloud Console**
   - 網址：https://console.cloud.google.com/
   - 使用 Google 帳號登入

2. **建立專案**
   - 點擊左上角的專案選擇器
   - 點擊「新增專案」
   - 專案名稱輸入：`my-x-app`（或任何名稱）
   - 點擊「建立」

3. **啟用 API**
   - 左側選單 → 「API 和服務」→ 「程式庫」
   - 搜尋「Google+ API」並啟用（如果有的話）
   - 或直接跳到下一步（現代版本不需要）

4. **建立 OAuth 憑證**
   - 左側選單 → 「API 和服務」→ 「憑證」
   - 點擊「建立憑證」→ 「OAuth 用戶端 ID」
   
   - 如果第一次使用，需要先設定「同意畫面」：
     - 使用者類型：選擇「外部」
     - 應用程式名稱：`My-X`
     - 使用者支援電子郵件：你的 Gmail
     - 開發人員聯絡資訊：你的 Gmail
     - 點擊「儲存並繼續」→ 「儲存並繼續」→ 「回到主控台」

5. **建立 OAuth 用戶端**
   - 應用程式類型：選擇「網頁應用程式」
   - 名稱：`My-X Local`
   - 已授權的 JavaScript 來源：`http://localhost:3000`
   - 已授權的重新導向 URI：`http://localhost:3000/api/auth/callback/google`
   - 點擊「建立」

6. **複製憑證**
   - 會跳出視窗顯示：
     - **用戶端 ID**：類似 `123456789-abc.apps.googleusercontent.com`
     - **用戶端密鑰**：類似 `GOCSPX-xxxxxxxxxxxxx`
   - **⚠️ 重要：立即複製這兩個值，密鑰只會顯示一次！**

7. **填入 `.env.local`**
   ```
   GOOGLE_CLIENT_ID=你的用戶端ID
   GOOGLE_CLIENT_SECRET=你的用戶端密鑰
   ```

---

## 3️⃣ GitHub OAuth（最簡單，約 2 分鐘）

### 步驟：

1. **前往 GitHub 開發者設定**
   - 網址：https://github.com/settings/developers
   - 使用 GitHub 帳號登入

2. **建立 OAuth App**
   - 點擊「New OAuth App」或「新增 OAuth App」

3. **填寫資料**
   - **Application name**：`My-X`
   - **Homepage URL**：`http://localhost:3000`
   - **Authorization callback URL**：`http://localhost:3000/api/auth/callback/github`
   - 點擊「Register application」

4. **複製憑證**
   - 頁面會顯示：
     - **Client ID**：一串數字和字母
     - **Client Secret**：點擊「Generate a new client secret」
     - 複製顯示的 **Client secret**（只顯示一次！）

5. **填入 `.env.local`**
   ```
   GITHUB_ID=你的Client_ID
   GITHUB_SECRET=你的Client_Secret
   ```

---

## 4️⃣ MongoDB Atlas（約 5 分鐘，免費）

### 步驟：

1. **註冊帳號**
   - 網址：https://www.mongodb.com/cloud/atlas
   - 點擊「Try Free」
   - 使用 Google 帳號或 Email 註冊（免費）

2. **建立組織和專案**
   - 組織名稱：隨便填（例如：`Personal`）
   - 專案名稱：`My-X Project`
   - 點擊「Next」

3. **選擇方案**
   - 選擇「**M0 FREE**」（完全免費）
   - Cloud Provider：選 `AWS` 或任何
   - Region：選擇離你最近的（例如：`N. Virginia (us-east-1)`）
   - Cluster Name：`Cluster0`（預設即可）
   - 點擊「Create」

4. **建立資料庫使用者**
   - 等待叢集建立完成（約 1-3 分鐘）
   - 點擊「Create Database User」
   - Authentication Method：選擇「Password」
   - Username：自己設定（例如：`myxuser`）
   - Password：設定密碼並**記住它**
   - 點擊「Create User」

5. **設定網路存取**
   - 點擊「Add IP Address」
   - 點擊「Allow Access from Anywhere」（會自動填入 `0.0.0.0/0`）
   - 點擊「Confirm」
   - ⚠️ 注意：這是為了開發方便，生產環境應該限制 IP

6. **取得連線字串**
   - 點擊「Connect」按鈕
   - 選擇「Connect your application」
   - 選擇 Driver：`Node.js`，Version：`5.5 or later`
   - 複製連線字串，看起來像：
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

7. **修改連線字串**
   - 將 `<username>` 替換為你剛才建立的資料庫使用者名稱
   - 將 `<password>` 替換為你設定的密碼
   - 在最後加上資料庫名稱，例如：
     ```
     mongodb+srv://myxuser:mypassword@cluster0.xxxxx.mongodb.net/my-x?retryWrites=true&w=majority
     ```

8. **填入 `.env.local`**
   ```
   DATABASE_URL=你的完整連線字串
   ```

---

## 5️⃣ Pusher（約 3 分鐘，免費）

### 步驟：

1. **註冊帳號**
   - 網址：https://dashboard.pusher.com/
   - 點擊「Sign Up」或「Create Account」
   - 使用 Email 註冊（免費方案即可）

2. **建立應用程式**
   - 登入後，點擊「Create app」
   - App name：`My-X`
   - Cluster：選擇離你最近的（例如：`ap3` 或 `us2`）
   - Front-end tech：`Vanilla JS`
   - Back-end tech：`Node.js`
   - 點擊「Create app」

3. **取得憑證**
   - 進入應用程式後，點擊「App Keys」標籤
   - 你會看到：
     - **App ID**：一串數字
     - **Key**：長字串
     - **Secret**：長字串
     - **Cluster**：例如 `ap3` 或 `us2`

4. **填入 `.env.local`**
   ```
   PUSHER_APP_ID=你的App_ID
   PUSHER_KEY=你的Key
   PUSHER_SECRET=你的Secret
   PUSHER_CLUSTER=你的Cluster（例如：ap3）
   NEXT_PUBLIC_PUSHER_KEY=你的Key（同樣的值）
   NEXT_PUBLIC_PUSHER_CLUSTER=你的Cluster（同樣的值）
   ```

---

## 6️⃣ Cloudinary（約 2 分鐘，免費）

### 步驟：

1. **註冊帳號**
   - 網址：https://cloudinary.com/
   - 點擊「Sign Up for Free」
   - 使用 Email 註冊（免費方案）

2. **取得憑證**
   - 註冊完成後，會自動進入 Dashboard
   - 或前往：https://console.cloudinary.com/
   - 在 Dashboard 頁面，你會看到：
     - **Cloud name**：例如 `dxxxxx`
     - **API Key**：例如 `123456789012345`
     - **API Secret**：點擊「Reveal」顯示

3. **填入 `.env.local`**
   ```
   CLOUDINARY_CLOUD_NAME=你的Cloud_name
   CLOUDINARY_API_KEY=你的API_Key
   CLOUDINARY_API_SECRET=你的API_Secret
   ```

---

## 7️⃣ Facebook OAuth（選填，約 5 分鐘）

如果你不需要 Facebook 登入，可以跳過這步。

### 步驟：

1. **前往 Facebook 開發者**
   - 網址：https://developers.facebook.com/
   - 使用 Facebook 帳號登入

2. **建立應用程式**
   - 點擊右上角「我的應用程式」→「建立應用程式」
   - 應用程式類型：選擇「消費者」或「無」
   - 應用程式名稱：`My-X`
   - 應用程式電子郵件：你的 Email
   - 點擊「建立應用程式」

3. **新增 Facebook Login**
   - 在應用程式設定中，找到「新增產品」
   - 點擊「Facebook Login」的「設定」

4. **設定 OAuth 重新導向 URI**
   - 左側選單 → 「Facebook Login」→ 「設定」
   - 在「有效的 OAuth 重新導向 URI」中新增：
     ```
     http://localhost:3000/api/auth/callback/facebook
     ```
   - 點擊「儲存變更」

5. **取得憑證**
   - 左側選單 → 「設定」→ 「基本資料」
   - 你會看到：
     - **應用程式編號（App ID）**：一串數字
     - **應用程式密鑰（App Secret）**：點擊「顯示」按鈕

6. **填入 `.env.local`**
   ```
   FACEBOOK_CLIENT_ID=你的App_ID
   FACEBOOK_CLIENT_SECRET=你的App_Secret
   ```

---

## ✅ 完成後檢查清單

確認 `.env.local` 檔案包含所有必要的變數：

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=D2RHmhINY53O18ILccmzQGt0g4kwF1GzprYUWZ8H++Q=

# OAuth
GOOGLE_CLIENT_ID=你的值
GOOGLE_CLIENT_SECRET=你的值
GITHUB_ID=你的值
GITHUB_SECRET=你的值
FACEBOOK_CLIENT_ID=你的值（選填）
FACEBOOK_CLIENT_SECRET=你的值（選填）

# Database
DATABASE_URL=你的值

# Pusher
PUSHER_APP_ID=你的值
PUSHER_KEY=你的值
PUSHER_SECRET=你的值
PUSHER_CLUSTER=你的值
NEXT_PUBLIC_PUSHER_KEY=你的值
NEXT_PUBLIC_PUSHER_CLUSTER=你的值

# Cloudinary
CLOUDINARY_CLOUD_NAME=你的值
CLOUDINARY_API_KEY=你的值
CLOUDINARY_API_SECRET=你的值
```

---

## 🚀 最小必要設定（快速測試）

如果只想快速測試，最少需要：
1. ✅ NEXTAUTH_SECRET（已有）
2. ✅ GITHUB_ID + GITHUB_SECRET（最快）
3. ✅ DATABASE_URL（MongoDB Atlas）

這樣就可以開始測試基本功能了！

---

## 💡 小提示

- **保存好所有密鑰**：建議使用密碼管理器
- **不要分享給別人**：這些是私人憑證
- **免費方案足夠**：所有服務都有免費方案，夠開發使用
- **有問題？**：查看各服務的官方文件或客服

---

需要我幫你逐步取得這些 keys 嗎？

