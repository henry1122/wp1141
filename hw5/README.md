# My-X - Twitter/X Clone

一個功能完整的 Twitter/X 風格社交媒體應用程式，使用 Next.js、MongoDB、Prisma、NextAuth、Pusher 和 Cloudinary 建構。

## 🌐 線上部署網址

**👉 [立即體驗](https://wp1141-kappa.vercel.app/)**

**部署網址：** https://wp1141-kappa.vercel.app/

> 💡 **提示：** 點擊上方連結或複製網址到瀏覽器即可訪問應用程式。

## 技術棧

- **Next.js 14** (TypeScript) - 全棧框架
- **NextAuth** - OAuth 認證
- **MongoDB Atlas** - 資料庫
- **Prisma** - ORM
- **Pusher** - 即時更新
- **Cloudinary** - 圖片上傳
- **Tailwind CSS** - 樣式
- **Vercel** - 部署平台

## ✨ 功能特色

### 🔐 認證系統
- **OAuth 登入**：支援 Google、GitHub 第三方登入
- **自訂帳號註冊**：可自訂 userID 進行註冊
- **安全會話管理**：使用 NextAuth 進行安全的身份驗證

### 📝 貼文功能
- **發布貼文**：支援文字、圖片上傳
- **Hashtag 支援**：自動識別並連結 hashtag（如 #example）
- **Mention 功能**：支援 @username 提及其他用戶
- **連結自動識別**：自動將網址轉換為可點擊連結
- **草稿功能**：可儲存未完成的貼文

### 💬 互動功能
- **按讚**：對貼文按讚/取消讚
- **留言**：對貼文進行留言和回覆
- **轉發**：轉發其他用戶的貼文
- **追蹤系統**：追蹤/取消追蹤其他用戶

### 🔔 即時功能
- **即時更新**：使用 Pusher 實現即時通知和動態更新
- **通知系統**：接收新貼文、留言、按讚等通知

### 👤 個人化
- **個人資料頁**：查看個人貼文、追蹤者、追蹤中
- **個人資料編輯**：可編輯頭像、名稱、簡介等資訊
- **探索頁面**：發現熱門貼文和 hashtag

## 🚀 快速開始

### 📋 前置需求

在開始之前，請確保您已安裝以下工具並擁有相關帳號：

- **Node.js** 18 或更高版本 ([下載](https://nodejs.org/))
- **npm** 或 **yarn** 套件管理器
- **MongoDB Atlas** 帳號 ([註冊](https://www.mongodb.com/cloud/atlas))
- **Pusher** 帳號 ([註冊](https://pusher.com/))
- **Cloudinary** 帳號 ([註冊](https://cloudinary.com/))
- **OAuth 憑證**：Google、GitHub（至少一個）

### 📦 安裝步驟

#### 步驟 1：複製專案到本地

```bash
git clone <repository-url>
cd hw5
```

#### 步驟 2：安裝依賴套件

```bash
npm install
```

這將會安裝所有必要的套件，包括 Next.js、Prisma、NextAuth 等。

#### 步驟 3：設定環境變數

在專案根目錄創建 `.env.local` 檔案（如果不存在），並填入以下環境變數：

> ⚠️ **重要：** `.env.local` 檔案不會被提交到 Git，請妥善保管您的環境變數。

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# 產生 NEXTAUTH_SECRET 的方式：
# openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret

# MongoDB
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Pusher
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=your-pusher-cluster

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### 步驟 4：設定 Prisma 資料庫

```bash
# 產生 Prisma Client（必須先執行）
npx prisma generate

# 推送資料庫結構到 MongoDB
npx prisma db push
```

> 💡 **提示：** 如果資料庫連接失敗，請檢查 `DATABASE_URL` 環境變數是否正確設定。

#### 步驟 5：啟動開發伺服器

```bash
npm run dev
```

#### 步驟 6：開啟瀏覽器

在瀏覽器中訪問 [http://localhost:3000](http://localhost:3000)

您應該會看到應用程式的首頁。如果遇到錯誤，請檢查：
- 環境變數是否正確設定
- MongoDB 連接是否正常
- 所有依賴套件是否已正確安裝

## ⚙️ 環境變數詳細說明

### 🔑 NextAuth 設定

| 變數名稱 | 說明 | 範例值 |
|---------|------|--------|
| `NEXTAUTH_URL` | 應用程式網址 | 本地：`http://localhost:3000`<br>生產：`https://wp1141-kappa.vercel.app` |
| `NEXTAUTH_SECRET` | 用於加密 session 的密鑰 | 使用 `openssl rand -base64 32` 產生 |

> 💡 **產生 NEXTAUTH_SECRET：**
> ```bash
> openssl rand -base64 32
> ```

### OAuth 設定

#### Google OAuth

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案
3. 啟用 Google+ API
4. 建立 OAuth 2.0 憑證
5. 設定授權重新導向 URI（**必須同時添加本地和生產環境**）：
   - 本地開發: `http://localhost:3000/api/auth/callback/google`
   - 生產環境: `https://wp1141-kappa.vercel.app/api/auth/callback/google`
   - ⚠️ **重要：** 兩個都要添加，不能只添加一個
6. 設定授權的 JavaScript 來源（**必須同時添加本地和生產環境**）：
   - 本地開發: `http://localhost:3000`
   - 生產環境: `https://wp1141-kappa.vercel.app`
   - ⚠️ **重要：** 兩個都要添加，不能只添加一個

#### GitHub OAuth

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers)
2. 點擊 "New OAuth App"
3. 填寫應用程式資訊：
   - **Application name**: My-X (或自訂名稱)
   - **Homepage URL**: `https://wp1141-kappa.vercel.app` (生產環境)
   - **Authorization callback URL**（**必須同時添加本地和生產環境**）：
     - 本地開發: `http://localhost:3000/api/auth/callback/github`
     - 生產環境: `https://wp1141-kappa.vercel.app/api/auth/callback/github`
4. 記錄 **Client ID** 和 **Client Secret**

### MongoDB Atlas

1. 前往 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 建立免費叢集
3. 建立資料庫使用者
4. 設定 IP 白名單 (使用 `0.0.0.0/0` 允許所有 IP，或僅允許 Vercel IP)
5. 取得連接字串，格式如下：
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

### Pusher

1. 前往 [Pusher Dashboard](https://dashboard.pusher.com/)
2. 建立新應用程式
3. 記錄 App ID、Key、Secret 和 Cluster

### Cloudinary

1. 前往 [Cloudinary](https://cloudinary.com/)
2. 註冊免費帳號
3. 記錄 Cloud Name、API Key 和 API Secret

## 📜 可用指令

### 開發相關

```bash
# 啟動開發伺服器（熱重載）
npm run dev

# 建置生產版本
npm run build

# 啟動生產伺服器（需先執行 build）
npm start

# 程式碼檢查
npm run lint
```

### 資料庫相關

```bash
# 產生 Prisma Client（修改 schema 後必須執行）
npx prisma generate

# 推送資料庫結構到 MongoDB
npx prisma db push

# 開啟 Prisma Studio（視覺化資料庫管理工具）
npx prisma studio
```

### 其他指令

```bash
# 建立測試用戶
npm run create-test-user
```

## 專案結構

```
hw5/
├── components/          # React 元件
│   ├── HomeFeed.tsx    # 首頁動態牆
│   ├── PostCard.tsx    # 貼文卡片
│   ├── PostList.tsx    # 貼文列表
│   ├── PostModal.tsx   # 發布貼文模態框
│   └── Sidebar.tsx     # 側邊欄
├── lib/                 # 工具函數
│   ├── auth.ts         # NextAuth 設定
│   ├── prisma.ts       # Prisma Client
│   ├── pusher.ts       # Pusher 設定
│   └── utils.ts        # 工具函數
├── pages/               # Next.js 頁面
│   ├── api/            # API 路由
│   ├── auth/           # 認證頁面
│   ├── index.tsx       # 首頁
│   ├── post/           # 貼文詳情頁
│   └── profile/        # 個人資料頁
├── prisma/              # Prisma 設定
│   └── schema.prisma   # 資料庫結構定義
├── public/              # 靜態資源
└── styles/              # 樣式檔案
```

## 🚀 部署到 Vercel

### 部署步驟

1. **將程式碼推送到 GitHub**
   - 確保所有程式碼已提交並推送到 GitHub 儲存庫

2. **前往 Vercel Dashboard**
   - 訪問 [Vercel Dashboard](https://vercel.com/dashboard)
   - 使用 GitHub 帳號登入

3. **建立新專案**
   - 點擊 "New Project" 或 "Add New..." → "Project"
   - 選擇您的 GitHub 儲存庫

4. **設定專案**
   - **Framework Preset**: Next.js（通常會自動偵測）
   - **Root Directory**: `./`（如果專案在根目錄）
   - **Build Command**: `prisma generate && next build`（已在 `vercel.json` 中設定）
   - **Output Directory**: `.next`（Next.js 預設）

5. **設定環境變數**
   - 在 "Environment Variables" 區塊中，新增所有必要的環境變數
   - **重要：** 必須包含所有在 `.env.local` 中的變數
   - 對於 `NEXTAUTH_URL`，請使用生產環境網址：`https://wp1141-kappa.vercel.app`

6. **部署**
   - 點擊 "Deploy" 按鈕
   - 等待建置完成（通常需要 2-5 分鐘）

7. **驗證部署**
   - 部署完成後，訪問提供的網址
   - 確認應用程式正常運作
   - 檢查 OAuth 登入功能是否正常

### ⚠️ 部署後注意事項

- **OAuth 重新導向 URI**：確保所有 OAuth 提供者（Google、GitHub）都已添加生產環境的回調 URL
- **資料庫連接**：確認 MongoDB Atlas IP 白名單包含 Vercel 的 IP 範圍
- **環境變數**：如果部署後出現錯誤，檢查 Vercel 專案設定中的環境變數是否正確

## ❓ 常見問題 (FAQ)

### 🔐 OAuth 登入失敗

**問題：** 點擊 OAuth 登入按鈕後出現錯誤或無法登入

**解決方法：**
- ✅ 確認 OAuth 提供者（Google/GitHub）中的重新導向 URI 設定正確
- ✅ 檢查環境變數（`GOOGLE_CLIENT_ID`、`GITHUB_ID` 等）是否正確設定
- ✅ 確認 `NEXTAUTH_URL` 環境變數與實際網址一致
- ✅ 查看 Vercel 日誌中的錯誤訊息（Vercel Dashboard → 專案 → Deployments → 點擊部署 → Logs）

### 💾 資料庫連接失敗

**問題：** 應用程式無法連接到 MongoDB

**解決方法：**
- ✅ 確認 MongoDB Atlas IP 白名單包含 `0.0.0.0/0`（允許所有 IP）或 Vercel 的 IP 範圍
- ✅ 檢查 `DATABASE_URL` 連接字串格式是否正確
- ✅ 確認資料庫使用者名稱和密碼正確
- ✅ 檢查資料庫使用者是否有讀寫權限

### 🔔 即時更新不工作

**問題：** Pusher 即時更新功能無法正常運作

**解決方法：**
- ✅ 確認 `NEXT_PUBLIC_PUSHER_KEY` 和 `NEXT_PUBLIC_PUSHER_CLUSTER` 環境變數已設定
- ✅ 檢查 Pusher 儀表板中的應用程式狀態是否正常
- ✅ 確認伺服器端（`PUSHER_CLUSTER`）和客戶端（`NEXT_PUBLIC_PUSHER_CLUSTER`）的 cluster 設定一致
- ✅ 檢查瀏覽器控制台是否有 Pusher 相關錯誤

### 🖼️ 圖片上傳失敗

**問題：** 無法上傳圖片到 Cloudinary

**解決方法：**
- ✅ 確認 Cloudinary 憑證（`CLOUDINARY_CLOUD_NAME`、`CLOUDINARY_API_KEY`、`CLOUDINARY_API_SECRET`）正確
- ✅ 檢查檔案大小是否超過限制（建議小於 10MB）
- ✅ 確認 Cloudinary 帳號中的 API 金鑰權限設定正確
- ✅ 檢查上傳的圖片格式是否支援（JPG、PNG、GIF 等）

### 🏗️ 建置失敗

**問題：** Vercel 部署時建置失敗

**解決方法：**
- ✅ 確認 `package.json` 中的依賴套件版本相容
- ✅ 檢查是否有 TypeScript 或 ESLint 錯誤
- ✅ 確認 `vercel.json` 設定正確
- ✅ 查看 Vercel 建置日誌中的詳細錯誤訊息

## 📄 授權

此專案僅供學習和教育用途。

## 📞 聯絡資訊

如有問題或建議，請透過以下方式聯繫：

- **GitHub Issues**: [提交問題](https://github.com/your-username/hw5/issues)
- **部署網址**: [https://wp1141-kappa.vercel.app/](https://wp1141-kappa.vercel.app/)

---

**最後更新：** 2024

**專案狀態：** ✅ 已部署並正常運作
