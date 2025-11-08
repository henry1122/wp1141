# Vercel 環境變數檢查清單

## 📋 如何在 Vercel Dashboard 中檢查和設定環境變數

### 步驟 1: 登入 Vercel Dashboard

1. 訪問 https://vercel.com/dashboard
2. 登入您的帳號
3. 找到您的專案（例如：`wp1141`）

### 步驟 2: 前往環境變數設定頁面

1. 點擊您的專案
2. 點擊頂部選單的 **Settings**
3. 在左側選單中點擊 **Environment Variables**

### 步驟 3: 檢查並設定以下環境變數

---

## ✅ 必須設定的環境變數

### 1. NEXTAUTH_URL ⚠️ 最重要

**變數名稱：** `NEXTAUTH_URL`

**值：** `https://wp1141-kappa.vercel.app`

**說明：** 
- 必須是您的實際 Vercel 網址
- 必須以 `https://` 開頭
- 不要包含尾隨斜線 `/`
- 如果有多個網域，使用主要網域

**如何確認您的網址：**
- 在 Vercel Dashboard 的專案頁面查看
- 或在部署詳情頁面查看 Domains 區塊

---

### 2. NEXTAUTH_SECRET

**變數名稱：** `NEXTAUTH_SECRET`

**值：** `D2RHmhINY53O18ILccmzQGt0g4kwF1GzprYUWZ8H++Q=`

**說明：** 
- 用於加密 session 和 tokens
- 必須與本地開發環境一致（如果有的話）

---

### 3. DATABASE_URL ⚠️ 非常重要

**變數名稱：** `DATABASE_URL`

**值：** `mongodb+srv://hocashi:P%40qq3849@cluster0.suswhjg.mongodb.net/my-x?retryWrites=true&w=majority`

**說明：**
- MongoDB Atlas 連接字串
- 注意：密碼中的 `@` 符號必須編碼為 `%40`
- 格式：`mongodb+srv://username:password@cluster.mongodb.net/database?options`

**如何確認連接字串正確：**
- 從 MongoDB Atlas Dashboard 取得
- 確認密碼已正確 URL 編碼

---

## 🔐 OAuth 憑證（根據您使用的 Provider）

### 4. GOOGLE_CLIENT_ID

**變數名稱：** `GOOGLE_CLIENT_ID`

**值：** `215257223815-uo4cl5tfim41o3fonv557li0mv9245a0.apps.googleusercontent.com`

**說明：** Google OAuth Client ID

---

### 5. GOOGLE_CLIENT_SECRET

**變數名稱：** `GOOGLE_CLIENT_SECRET`

**值：** `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`

**說明：** Google OAuth Client Secret

---

### 6. GITHUB_ID（如果使用 GitHub OAuth）

**變數名稱：** `GITHUB_ID`

**值：** 您的 GitHub OAuth App Client ID

---

### 7. GITHUB_SECRET（如果使用 GitHub OAuth）

**變數名稱：** `GITHUB_SECRET`

**值：** 您的 GitHub OAuth App Client Secret

---

### 8. FACEBOOK_CLIENT_ID（如果使用 Facebook OAuth）

**變數名稱：** `FACEBOOK_CLIENT_ID`

**值：** 您的 Facebook App ID

---

### 9. FACEBOOK_CLIENT_SECRET（如果使用 Facebook OAuth）

**變數名稱：** `FACEBOOK_CLIENT_SECRET`

**值：** 您的 Facebook App Secret

---

## 🔔 Pusher（如果需要即時功能）

### 10. PUSHER_APP_ID

**變數名稱：** `PUSHER_APP_ID`

**值：** 您的 Pusher App ID

---

### 11. PUSHER_KEY

**變數名稱：** `PUSHER_KEY`

**值：** 您的 Pusher Key

---

### 12. PUSHER_SECRET

**變數名稱：** `PUSHER_SECRET`

**值：** 您的 Pusher Secret

---

### 13. PUSHER_CLUSTER

**變數名稱：** `PUSHER_CLUSTER`

**值：** 您的 Pusher Cluster（例如：`ap1`, `us2`）

---

### 14. NEXT_PUBLIC_PUSHER_KEY

**變數名稱：** `NEXT_PUBLIC_PUSHER_KEY`

**值：** 與 `PUSHER_KEY` 相同

**說明：** `NEXT_PUBLIC_` 前綴表示這是客戶端可訪問的變數

---

### 15. NEXT_PUBLIC_PUSHER_CLUSTER

**變數名稱：** `NEXT_PUBLIC_PUSHER_CLUSTER`

**值：** 與 `PUSHER_CLUSTER` 相同

---

## 🖼️ Cloudinary（如果需要圖片上傳）

### 16. CLOUDINARY_CLOUD_NAME

**變數名稱：** `CLOUDINARY_CLOUD_NAME`

**值：** 您的 Cloudinary Cloud Name

---

### 17. CLOUDINARY_API_KEY

**變數名稱：** `CLOUDINARY_API_KEY`

**值：** 您的 Cloudinary API Key

---

### 18. CLOUDINARY_API_SECRET

**變數名稱：** `CLOUDINARY_API_SECRET`

**值：** 您的 Cloudinary API Secret

---

## 📝 設定環境變數的步驟

### 在 Vercel Dashboard 中：

1. **添加新變數**
   - 在 Environment Variables 頁面
   - 點擊 **Add New** 或 **Add** 按鈕
   - 輸入變數名稱（Key）
   - 輸入變數值（Value）

2. **選擇環境**
   - **Production**：生產環境（主要部署）
   - **Preview**：預覽部署（Pull Request 等）
   - **Development**：開發環境
   - 建議：至少選擇 **Production**

3. **儲存**
   - 點擊 **Save** 或 **Add** 按鈕

4. **重新部署**
   - 添加或修改環境變數後，需要重新部署
   - 可以點擊 **Redeploy** 或推送新的 commit

---

## ✅ 檢查清單

請確認以下項目：

### 基本設定
- [ ] `NEXTAUTH_URL` 已設定，且是正確的 Vercel 網址（`https://` 開頭）
- [ ] `NEXTAUTH_SECRET` 已設定
- [ ] `DATABASE_URL` 已設定，且格式正確

### OAuth 憑證
- [ ] `GOOGLE_CLIENT_ID` 已設定
- [ ] `GOOGLE_CLIENT_SECRET` 已設定
- [ ] 如果使用 GitHub：`GITHUB_ID` 和 `GITHUB_SECRET` 已設定
- [ ] 如果使用 Facebook：`FACEBOOK_CLIENT_ID` 和 `FACEBOOK_CLIENT_SECRET` 已設定

### 其他服務（如果使用）
- [ ] Pusher 相關變數已設定（如果使用即時功能）
- [ ] Cloudinary 相關變數已設定（如果使用圖片上傳）

### 部署設定
- [ ] 所有變數都已選擇正確的環境（至少 Production）
- [ ] 已重新部署應用程式

---

## 🔍 如何驗證環境變數已正確設定

### 方法 1: 檢查構建日誌

1. 在 Vercel Dashboard 中查看最新的部署
2. 點擊部署，查看 **Build Logs**
3. 確認沒有以下錯誤：
   - `DATABASE_URL is not set`
   - `NEXTAUTH_URL is not set`
   - `Environment variable X is missing`

### 方法 2: 檢查運行時日誌

1. 在 Vercel Dashboard 中查看 **Functions** 標籤
2. 訪問您的應用程式
3. 查看日誌中是否有環境變數相關的錯誤

### 方法 3: 使用 Vercel CLI

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 登入
vercel login

# 拉取環境變數到本地
vercel env pull .env.local

# 檢查 .env.local 文件
cat .env.local
```

---

## ⚠️ 常見錯誤

### 錯誤 1: 環境變數未生效

**原因：** 添加環境變數後未重新部署

**解決方法：** 在 Vercel Dashboard 中點擊 **Redeploy**

### 錯誤 2: NEXTAUTH_URL 設定錯誤

**錯誤範例：**
- `http://wp1141-kappa.vercel.app`（應該是 `https://`）
- `https://wp1141-kappa.vercel.app/`（不應該有尾隨斜線）

**正確範例：**
- `https://wp1141-kappa.vercel.app`

### 錯誤 3: DATABASE_URL 中的特殊字元未編碼

**錯誤範例：**
```
mongodb+srv://user:pass@word@cluster.mongodb.net/db
```

**正確範例：**
```
mongodb+srv://user:pass%40word@cluster.mongodb.net/db
```

### 錯誤 4: 環境變數設定在錯誤的環境

**問題：** 變數只設定在 Preview，但訪問的是 Production

**解決方法：** 確保所有必要的變數都設定在 **Production** 環境

---

## 🚀 快速設定腳本

如果您想快速檢查，可以在本地創建一個腳本來驗證：

```bash
# 檢查必要的環境變數
echo "檢查環境變數..."
echo "NEXTAUTH_URL: ${NEXTAUTH_URL:-未設定}"
echo "DATABASE_URL: ${DATABASE_URL:-未設定}"
echo "GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:-未設定}"
```

---

## 📞 需要幫助？

如果設定環境變數後仍然有問題：

1. **檢查構建日誌**：查看是否有錯誤訊息
2. **檢查運行時日誌**：查看應用程式運行時的錯誤
3. **確認網址**：確認 `NEXTAUTH_URL` 是正確的 Vercel 網址
4. **重新部署**：確保在設定環境變數後重新部署

