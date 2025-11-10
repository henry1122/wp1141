# Vercel 環境變數設定指南

## 📍 找到你的部署 URL

根據你的 Dashboard URL: `https://vercel.com/redtigerttczyczy-7875s-projects/hw5`

你的部署 URL 可能是：
- `https://hw5-3jucjrfyf-redtigerttczyczy-7875s-projects.vercel.app`（預覽）
- `https://hw5.vercel.app`（如果已設定自訂域名）

## 🚀 部署順序建議

### 方法 1：先部署獲得 URL（推薦）

**步驟：**
1. **第一次部署（獲得 URL）**
   ```bash
   cd /home/redti/wp1141/hw5/hw5
   vercel
   ```
   - 部署完成後，Vercel 會顯示部署 URL
   - 例如：`✅ Production: https://hw5-xxx.vercel.app`

2. **設置環境變數**
   - 前往 Vercel Dashboard → Settings → Environment Variables
   - 添加所有環境變數（包括 `NEXTAUTH_URL`，使用剛才獲得的 URL）

3. **設置 OAuth Redirect URLs**
   - 在 Google/GitHub/Facebook OAuth 設定中添加 Redirect URI
   - 使用剛才獲得的 URL

4. **重新部署（讓環境變數生效）**
   ```bash
   vercel --prod
   ```
   或
   - 在 Vercel Dashboard 點擊「Redeploy」

### 方法 2：先設置部分環境變數

**步驟：**
1. **先設置不需要 URL 的環境變數**
   - 在 Vercel Dashboard 設置所有環境變數
   - 對於 `NEXTAUTH_URL`，先暫時填一個（例如：`https://hw5.vercel.app`）

2. **第一次部署**
   ```bash
   vercel
   ```
   - 獲得實際的部署 URL

3. **更新環境變數**
   - 更新 `NEXTAUTH_URL` 為實際的部署 URL
   - 設置 OAuth Redirect URLs

4. **重新部署**

**建議使用方法 1**，因為更簡單直接！

**如何確認實際 URL：**
1. 前往 [Vercel Dashboard](https://vercel.com/redtigerttczyczy-7875s-projects/hw5)
2. 點擊「**Deployments**」標籤
3. 查看最新的部署，點擊「**Visit**」按鈕
4. 複製瀏覽器地址欄的 URL

---

## 🔧 設定環境變數步驟

### ⚠️ 重要：Vercel 環境變數 vs .env.local

**大部分變數值應該相同，但有一個重要差異：**

| 變數名稱 | `.env.local` 的值 | Vercel 的值 | 說明 |
|---------|------------------|------------|------|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://你的實際部署URL` | **必須不同** |
| `NEXTAUTH_SECRET` | 相同 | 相同 | **必須相同** |
| `MONGODB_URI` | 相同 | 相同 | **必須相同** |
| `GOOGLE_CLIENT_ID` | 相同 | 相同 | **必須相同** |
| `GOOGLE_CLIENT_SECRET` | 相同 | 相同 | **必須相同** |
| `GITHUB_CLIENT_ID` | 相同 | 相同 | **必須相同** |
| `GITHUB_CLIENT_SECRET` | 相同 | 相同 | **必須相同** |
| `FACEBOOK_CLIENT_ID` | 相同 | 相同 | **必須相同** |
| `FACEBOOK_CLIENT_SECRET` | 相同 | 相同 | **必須相同** |
| `PUSHER_*` | 相同 | 相同 | **必須相同** |
| `CLOUDINARY_*` | 相同 | 相同 | **必須相同** |

**總結：除了 `NEXTAUTH_URL` 外，其他所有變數的值都應該與 `.env.local` 完全相同！**

### 方法 1：使用 Vercel Dashboard（推薦）

1. **前往專案設定**
   - 打開 [Vercel Dashboard](https://vercel.com/redtigerttczyczy-7875s-projects/hw5)
   - 點擊頂部選單的「**Settings**」標籤

2. **進入環境變數頁面**
   - 在左側選單中點擊「**Environment Variables**」

3. **添加環境變數**
   對每個環境變數：
   - 點擊「**Add New**」按鈕
   - 輸入 **Key**（變數名稱）
   - 輸入 **Value**（變數值）
     - **提示**：可以直接從 `.env.local` 複製貼上（除了 `NEXTAUTH_URL`）
   - 選擇 **Environment**（選擇 `Production`、`Preview`、`Development`，或全部）
   - 點擊「**Save**」

### 需要設定的環境變數清單

#### 1. MongoDB
```
Key: MONGODB_URI
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development
```

#### 2. NextAuth
```
Key: NEXTAUTH_SECRET
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development

Key: NEXTAUTH_URL
Value: https://hw5-3jucjrfyf-redtigerttczyczy-7875s-projects.vercel.app
注意：⚠️ 這與 .env.local 不同！.env.local 是 http://localhost:3000，這裡要用實際的 Vercel URL
Environment: Production, Preview
```

#### 3. Pusher
```
Key: PUSHER_APP_ID
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development

Key: PUSHER_KEY
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development

Key: PUSHER_SECRET
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development

Key: PUSHER_CLUSTER
Value: [與 .env.local 中的值完全相同，例如：ap1]
Environment: Production, Preview, Development

Key: NEXT_PUBLIC_PUSHER_KEY
Value: [與 .env.local 中的值完全相同，通常與 PUSHER_KEY 相同]
Environment: Production, Preview, Development

Key: NEXT_PUBLIC_PUSHER_CLUSTER
Value: [與 .env.local 中的值完全相同，通常與 PUSHER_CLUSTER 相同]
Environment: Production, Preview, Development
```

#### 4. Google OAuth
```
Key: GOOGLE_CLIENT_ID
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development

Key: GOOGLE_CLIENT_SECRET
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development
```

#### 5. GitHub OAuth
```
Key: GITHUB_CLIENT_ID
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development

Key: GITHUB_CLIENT_SECRET
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development
```

#### 6. Facebook OAuth
```
Key: FACEBOOK_CLIENT_ID
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development

Key: FACEBOOK_CLIENT_SECRET
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development
```

#### 7. Cloudinary
```
Key: CLOUDINARY_CLOUD_NAME
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development

Key: CLOUDINARY_API_KEY
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development

Key: CLOUDINARY_API_SECRET
Value: [與 .env.local 中的值完全相同]
Environment: Production, Preview, Development
```

---

## 🔗 OAuth Redirect URL 設定

### 格式說明

你的 Redirect URL 格式應該是：
```
https://你的實際部署URL/api/auth/callback/[provider]
```

### 實際範例

假設你的實際部署 URL 是：`https://hw5-3jucjrfyf-redtigerttczyczy-7875s-projects.vercel.app`

那麼 Redirect URL 應該是：

#### Google OAuth
```
https://hw5-3jucjrfyf-redtigerttczyczy-7875s-projects.vercel.app/api/auth/callback/google
```

#### GitHub OAuth
```
https://hw5-3jucjrfyf-redtigerttczyczy-7875s-projects.vercel.app/api/auth/callback/github
```

#### Facebook OAuth
```
https://hw5-3jucjrfyf-redtigerttczyczy-7875s-projects.vercel.app/api/auth/callback/facebook
```

### 設定步驟

#### Google OAuth
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇你的專案
3. 前往「**APIs & Services**」→「**Credentials**」
4. 點擊你的 OAuth 2.0 Client ID
5. 在「**Authorized redirect URIs**」中，點擊「**Add URI**」
6. 添加：
   ```
   https://hw5-3jucjrfyf-redtigerttczyczy-7875s-projects.vercel.app/api/auth/callback/google
   ```
7. 點擊「**Save**」

#### GitHub OAuth
1. 前往 GitHub → **Settings** → **Developer settings** → **OAuth Apps**
2. 點擊你的 OAuth App
3. 在「**Authorization callback URL**」欄位中，添加：
   ```
   https://hw5-3jucjrfyf-redtigerttczyczy-7875s-projects.vercel.app/api/auth/callback/github
   ```
4. 點擊「**Update application**」

#### Facebook OAuth
1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 選擇你的 App
3. 前往「**Settings**」→「**Basic**」
4. 在「**Valid OAuth Redirect URIs**」中，添加：
   ```
   https://hw5-3jucjrfyf-redtigerttczyczy-7875s-projects.vercel.app/api/auth/callback/facebook
   ```
5. 點擊「**Save Changes**」

---

## ⚠️ 重要提醒

1. **快速設定方法：直接複製貼上**
   - 打開你的 `.env.local` 檔案
   - 複製所有變數的值（除了 `NEXTAUTH_URL`）
   - 在 Vercel Dashboard 中逐一添加
   - 對於 `NEXTAUTH_URL`，使用你的實際 Vercel 部署 URL

2. **環境變數設定後需要重新部署**
   - 設定完環境變數後，Vercel 會自動觸發重新部署
   - 或手動點擊「**Deployments**」→「**Redeploy**」

3. **NEXTAUTH_URL 必須正確**
   - `.env.local`：`http://localhost:3000`（開發環境）
   - Vercel：`https://你的實際部署URL`（生產環境）
   - ⚠️ **這是唯一一個需要不同的變數！**

4. **NEXT_PUBLIC_* 變數**
   - 這些變數會暴露給前端，請確保不要包含敏感資訊
   - `NEXT_PUBLIC_PUSHER_KEY` 和 `NEXT_PUBLIC_PUSHER_CLUSTER` 是安全的（因為 Pusher 本身就是公開的）

5. **OAuth Redirect URLs**
   - 必須同時設定開發環境（localhost）和生產環境（Vercel URL）
   - 格式必須完全正確，包括 `https://` 和結尾不要有多餘的斜線

6. **驗證設定**
   - 設定完成後，建議檢查一次確保所有變數值都正確
   - 特別是 `NEXTAUTH_SECRET`、`MONGODB_URI` 等長字串，確保完全複製

---

## 🔍 驗證設定

設定完成後，可以：

1. **檢查環境變數**
   - 在 Vercel Dashboard → Settings → Environment Variables
   - 確認所有變數都已正確添加

2. **測試部署**
   - 訪問你的部署 URL
   - 嘗試登入功能
   - 檢查瀏覽器 Console 和 Vercel Logs 是否有錯誤

3. **查看 Logs**
   - 在 Vercel Dashboard → Deployments → 選擇部署 → 「**Functions**」或「**Logs**」
   - 檢查是否有環境變數相關的錯誤

---

## 📝 完整部署流程檢查清單

### 階段 1：第一次部署（獲得 URL）
- [ ] 執行 `vercel` 命令進行第一次部署
- [ ] 記下部署完成後顯示的 URL（例如：`https://hw5-xxx.vercel.app`）
- [ ] 或前往 Vercel Dashboard → Deployments → 查看最新部署的 URL

### 階段 2：設置環境變數
- [ ] 前往 Vercel Dashboard → Settings → Environment Variables
- [ ] 打開 `.env.local` 檔案
- [ ] 複製所有變數值到 Vercel（除了 `NEXTAUTH_URL`）
- [ ] 設定 `NEXTAUTH_URL` 為剛才獲得的實際 Vercel URL（⚠️ 唯一不同的變數）
- [ ] 確認所有變數都已正確添加

### 階段 3：設置 OAuth Redirect URLs
- [ ] 在 Google OAuth 中添加 Redirect URI：`https://你的實際URL/api/auth/callback/google`
- [ ] 在 GitHub OAuth 中添加 Redirect URI：`https://你的實際URL/api/auth/callback/github`
- [ ] 在 Facebook OAuth 中添加 Redirect URI：`https://你的實際URL/api/auth/callback/facebook`

### 階段 4：重新部署（讓環境變數生效）
- [ ] 執行 `vercel --prod` 或在 Dashboard 點擊「Redeploy」
- [ ] 等待部署完成

### 階段 5：測試
- [ ] 訪問部署的 URL
- [ ] 測試登入功能（Google/GitHub/Facebook）
- [ ] 檢查 Vercel Logs 確認沒有錯誤
- [ ] 測試其他功能（發文、按讚等）

