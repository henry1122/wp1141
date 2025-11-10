# Vercel 環境變數檢查清單

## ❌ 如果看到 "Configuration" 錯誤

這表示 NextAuth 環境變數未正確設置。請按照以下步驟檢查：

## 🔍 檢查步驟

### 1. 前往 Vercel Dashboard
- 打開 [Vercel Dashboard](https://vercel.com/dashboard)
- 選擇你的專案 `hw5`
- 點擊 **Settings** → **Environment Variables**

### 2. 檢查以下環境變數是否都已設置

#### ✅ NextAuth（必須）
- [ ] `NEXTAUTH_SECRET` - 必須設置！
- [ ] `NEXTAUTH_URL` - 必須是你的實際 Vercel URL（例如：`https://hw5-xxx.vercel.app`）

#### ✅ MongoDB（必須）
- [ ] `MONGODB_URI` - MongoDB 連接字串

#### ✅ OAuth Providers（至少需要一個）
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GITHUB_CLIENT_ID`
- [ ] `GITHUB_CLIENT_SECRET`
- [ ] `FACEBOOK_CLIENT_ID`
- [ ] `FACEBOOK_CLIENT_SECRET`

#### ✅ Pusher（可選，但建議設置）
- [ ] `PUSHER_APP_ID`
- [ ] `PUSHER_KEY`
- [ ] `PUSHER_SECRET`
- [ ] `PUSHER_CLUSTER`
- [ ] `NEXT_PUBLIC_PUSHER_KEY`（與 `PUSHER_KEY` 相同）
- [ ] `NEXT_PUBLIC_PUSHER_CLUSTER`（與 `PUSHER_CLUSTER` 相同）

#### ✅ Cloudinary（可選）
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`

### 3. 環境變數設置規則

1. **Environment 選擇**：選擇 `Production`、`Preview`、`Development`（或全部）
2. **值必須正確**：確保沒有多餘的空格或換行
3. **NEXTAUTH_URL**：必須是完整的 URL（例如：`https://hw5-xxx.vercel.app`），不要加斜線

### 4. 重新部署

設置完成後，**必須重新部署**才能生效：
- 在 Vercel Dashboard 點擊 **Deployments**
- 找到最新的部署
- 點擊 **⋯** → **Redeploy**

## 🔑 如何獲取 NEXTAUTH_SECRET

如果還沒有 `NEXTAUTH_SECRET`，在本地執行：

```bash
openssl rand -base64 32
```

將產生的字串複製到 Vercel 環境變數中。

## 🔗 如何確認 NEXTAUTH_URL

1. 前往 Vercel Dashboard → Deployments
2. 點擊最新的部署
3. 點擊 **Visit** 按鈕
4. 複製瀏覽器地址欄的 URL（例如：`https://hw5-xxx.vercel.app`）
5. 將這個 URL 設置為 `NEXTAUTH_URL`

## ⚠️ 常見錯誤

1. **NEXTAUTH_SECRET 未設置**
   - 錯誤：`Configuration`
   - 解決：設置 `NEXTAUTH_SECRET` 環境變數

2. **NEXTAUTH_URL 錯誤**
   - 錯誤：`Configuration`
   - 解決：確保 `NEXTAUTH_URL` 是完整的 URL，且與實際部署 URL 一致

3. **OAuth Client ID/Secret 未設置**
   - 錯誤：`OAuthSignin` 或 `Configuration`
   - 解決：設置對應的 OAuth 環境變數

4. **環境變數設置後未重新部署**
   - 錯誤：環境變數已設置但仍出現錯誤
   - 解決：重新部署專案

## 📝 快速檢查命令

在本地檢查 `.env.local` 是否包含所有必要的變數：

```bash
cd /home/redti/wp1141/hw5/hw5
grep -E "NEXTAUTH_SECRET|NEXTAUTH_URL|GOOGLE_CLIENT|GITHUB_CLIENT|FACEBOOK_CLIENT|MONGODB_URI" .env.local
```

然後確保 Vercel Dashboard 中的環境變數與 `.env.local` 中的值相同（除了 `NEXTAUTH_URL`）。

