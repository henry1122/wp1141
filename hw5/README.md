# My-X - Twitter/X Clone

A full-featured Twitter/X-like social media application built with Next.js, MongoDB, Prisma, NextAuth, Pusher, and Cloudinary.

## 部署網址

https://wp1141-kappa.vercel.app/

## 技術棧

- **Next.js 14** (TypeScript) - 全棧框架
- **NextAuth** - OAuth 認證
- **MongoDB Atlas** - 資料庫
- **Prisma** - ORM
- **Pusher** - 即時更新
- **Cloudinary** - 圖片上傳
- **Tailwind CSS** - 樣式
- **Vercel** - 部署平台

## 功能特色

- OAuth 登入 (Google, GitHub, Facebook)
- 自訂 userID 註冊
- 貼文發布 (支援 hashtag、mention、連結)
- 按讚、留言、轉發
- 追蹤/取消追蹤用戶
- 即時更新 (Pusher)
- 個人資料編輯
- 留言系統
- 草稿功能

## 開始使用

### 前置需求

- Node.js 18 或更高版本
- npm 或 yarn
- MongoDB Atlas 帳號
- Pusher 帳號
- Cloudinary 帳號
- OAuth 憑證 (Google, GitHub, Facebook)

### 安裝步驟

1. 複製專案到本地

```bash
git clone <repository-url>
cd hw5
```

2. 安裝依賴套件

```bash
npm install
```

3. 設定環境變數

在專案根目錄創建 `.env.local` 檔案，並填入以下環境變數：

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

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

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

4. 設定 Prisma

```bash
# 產生 Prisma Client
npx prisma generate

# 推送資料庫結構到 MongoDB
npx prisma db push
```

5. 啟動開發伺服器

```bash
npm run dev
```

6. 開啟瀏覽器

在瀏覽器中訪問 [http://localhost:3000](http://localhost:3000)

## 環境變數說明

### NextAuth

- `NEXTAUTH_URL`: 應用程式網址 (本地開發使用 http://localhost:3000，生產環境使用實際網址)
- `NEXTAUTH_SECRET`: 用於加密 session 的密鑰，可使用 `openssl rand -base64 32` 產生

### OAuth 設定

#### Google OAuth

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案
3. 啟用 Google+ API
4. 建立 OAuth 2.0 憑證
5. 設定授權重新導向 URI：
   - 本地開發: `http://localhost:3000/api/auth/callback/google`
   - 生產環境: `https://your-domain.vercel.app/api/auth/callback/google`
6. 設定授權的 JavaScript 來源：
   - 本地開發: `http://localhost:3000`
   - 生產環境: `https://your-domain.vercel.app`

#### GitHub OAuth

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers)
2. 建立新的 OAuth App
3. 設定授權回調 URL：
   - 本地開發: `http://localhost:3000/api/auth/callback/github`
   - 生產環境: `https://your-domain.vercel.app/api/auth/callback/github`

#### Facebook OAuth

1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 建立新應用程式
3. 新增 Facebook Login 產品
4. 設定有效的 OAuth 重新導向 URI：
   - 本地開發: `http://localhost:3000/api/auth/callback/facebook`
   - 生產環境: `https://your-domain.vercel.app/api/auth/callback/facebook`

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

## 可用指令

```bash
# 開發模式
npm run dev

# 建置生產版本
npm run build

# 啟動生產伺服器
npm start

# 程式碼檢查
npm run lint

# Prisma 相關指令
npx prisma generate    # 產生 Prisma Client
npx prisma db push     # 推送資料庫結構
npx prisma studio      # 開啟 Prisma Studio (資料庫管理工具)
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

## 部署到 Vercel

1. 將程式碼推送到 GitHub

2. 前往 [Vercel Dashboard](https://vercel.com/dashboard)

3. 點擊 "New Project"

4. 匯入 GitHub 儲存庫

5. 在環境變數設定中新增所有必要的環境變數 (參考上方環境變數說明)

6. 點擊 "Deploy"

7. 部署完成後，在 Vercel 專案設定中執行資料庫遷移：
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## 常見問題

### OAuth 登入失敗

- 確認重新導向 URI 設定正確
- 檢查環境變數是否正確設定
- 查看 Vercel 日誌中的錯誤訊息

### 資料庫連接失敗

- 確認 MongoDB Atlas IP 白名單包含 Vercel IP (或使用 0.0.0.0/0)
- 檢查連接字串格式是否正確
- 確認資料庫使用者權限設定正確

### 即時更新不工作

- 確認 NEXT_PUBLIC_PUSHER_KEY 和 NEXT_PUBLIC_PUSHER_CLUSTER 已設定
- 檢查 Pusher 儀表板中的應用程式狀態
- 確認伺服器和客戶端的 cluster 設定一致

### 圖片上傳失敗

- 確認 Cloudinary 憑證正確
- 檢查檔案大小限制 (應小於 10MB)
- 確認 Cloudinary 中的 API 金鑰權限

## 授權

此專案僅供學習使用。

## 聯絡資訊

如有問題或建議，請透過 GitHub Issues 聯繫。
