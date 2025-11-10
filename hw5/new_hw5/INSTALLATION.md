# 安裝指南

## 前置要求

- Node.js 18+ (建議使用 20+)
- Yarn
- MongoDB Atlas 帳號（或本地 MongoDB）
- 所有必要的 API Keys（參考 `API_KEYS_SETUP.md`）

## 安裝步驟

### 1. 安裝依賴

```bash
cd hw5
yarn install
```

### 2. 設定環境變數

建立 `.env.local` 檔案並填入所有必要的環境變數：

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

# Pusher (Client-side - 需要 NEXT_PUBLIC_ 前綴)
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=ap1

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**注意**：`NEXT_PUBLIC_PUSHER_KEY` 和 `NEXT_PUBLIC_PUSHER_CLUSTER` 是前端 Pusher 客戶端需要的環境變數，必須與伺服器端的 `PUSHER_KEY` 和 `PUSHER_CLUSTER` 相同。

### 3. 產生 NextAuth Secret

```bash
openssl rand -base64 32
```

將產生的字串填入 `NEXTAUTH_SECRET`。

### 4. 執行開發伺服器

```bash
yarn dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用程式。

## 常見問題

### 1. MongoDB 連線錯誤

確認：
- MongoDB Atlas Network Access 已允許你的 IP
- Connection String 正確
- 資料庫使用者名稱和密碼正確

### 2. OAuth 登入失敗

確認：
- OAuth Provider 的 Callback URL 已正確設定
- Client ID 和 Client Secret 正確
- 環境變數沒有拼寫錯誤

### 3. Pusher 連線失敗

確認：
- `NEXT_PUBLIC_PUSHER_KEY` 和 `NEXT_PUBLIC_PUSHER_CLUSTER` 已設定
- 這些環境變數與伺服器端的 `PUSHER_KEY` 和 `PUSHER_CLUSTER` 相同

## 下一步

1. 參考 `API_KEYS_SETUP.md` 申請所有必要的 API Keys
2. 填入 `.env.local` 檔案
3. 執行 `yarn dev` 啟動開發伺服器
4. 測試登入和基本功能

