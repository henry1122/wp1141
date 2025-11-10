# Vercel 和 MongoDB 問題排查指南

## 🔍 常見問題

### 問題 1: Callback 循環或每次都會 callback

**症狀：**
- OAuth 登入後不斷重定向
- 出現 `error=Callback` 錯誤
- 無法完成登入流程

**可能原因：**

#### 1.1 Vercel 環境變數未正確設定

**檢查步驟：**
1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的專案
3. 前往 **Settings** → **Environment Variables**
4. 確認以下變數都已設定（至少 Production 環境）：
   - `NEXTAUTH_URL` - **必須是完整的 Vercel URL**（例如：`https://your-app.vercel.app`）
   - `NEXTAUTH_SECRET` - 必須設定
   - `DATABASE_URL` - MongoDB 連接字串
   - `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`
   - `GITHUB_ID` 和 `GITHUB_SECRET`（如果使用）

**重要：**
- `NEXTAUTH_URL` 必須以 `https://` 開頭
- 不要包含尾隨斜線 `/`
- 必須是實際的 Vercel 部署網址

#### 1.2 MongoDB Atlas IP 白名單問題

**問題：** Vercel 的 IP 地址不在 MongoDB Atlas 的白名單中

**解決方法：**
1. 登入 [MongoDB Atlas](https://cloud.mongodb.com/)
2. 前往 **Network Access**（網路存取）
3. 點擊 **Add IP Address**
4. 選擇 **Allow Access from Anywhere**（這會添加 `0.0.0.0/0`）
5. 點擊 **Confirm**

**注意：**
- 允許所有 IP（`0.0.0.0/0`）適合開發和測試環境
- 生產環境建議只添加特定 IP，但 Vercel 使用動態 IP，所以通常需要 `0.0.0.0/0`

#### 1.3 DATABASE_URL 格式錯誤

**檢查：**
- 密碼中的特殊字元必須 URL 編碼（`@` → `%40`）
- 連接字串格式：`mongodb+srv://username:password@cluster.mongodb.net/database?options`

**範例：**
```
✅ 正確：mongodb+srv://user:P%40ssword@cluster.mongodb.net/my-x?retryWrites=true&w=majority
❌ 錯誤：mongodb+srv://user:P@ssword@cluster.mongodb.net/my-x
```

#### 1.4 NextAuth 配置問題

**已修復：** 已添加 `jwt` 回調函數，即使使用資料庫會話策略也需要它來避免 callback 循環。

---

### 問題 2: MongoDB 連接超時

**症狀：**
- 錯誤訊息：`Server selection timeout: No available servers`
- 錯誤訊息：`I/O error: received fatal alert: InternalError`

**解決步驟：**

1. **檢查 MongoDB Atlas 叢集狀態**
   - 確認叢集是 **Running** 狀態
   - 如果暫停，點擊 **Resume** 恢復

2. **檢查 IP 白名單**
   - 確認包含 `0.0.0.0/0` 或 Vercel IP 範圍
   - 更改可能需要 1-2 分鐘生效

3. **檢查 DATABASE_URL**
   - 在 Vercel Dashboard 中確認 `DATABASE_URL` 正確設定
   - 確認密碼已正確編碼

4. **測試連接**
   - 在本地運行 `npx prisma db push` 測試連接
   - 如果本地可以連接，問題可能在 Vercel 環境變數

---

### 問題 3: Vercel 部署後無法登入

**檢查清單：**

#### 3.1 環境變數檢查
- [ ] `NEXTAUTH_URL` 設定為正確的 Vercel URL
- [ ] `NEXTAUTH_SECRET` 已設定
- [ ] `DATABASE_URL` 已設定且格式正確
- [ ] OAuth 憑證（Google/GitHub）已設定
- [ ] 所有變數都選擇了 **Production** 環境

#### 3.2 OAuth Provider 設定
- [ ] Google Cloud Console 中已添加 Vercel URL 到 **Authorized JavaScript origins**
- [ ] Google Cloud Console 中已添加 `https://your-app.vercel.app/api/auth/callback/google` 到 **Authorized redirect URIs**
- [ ] GitHub OAuth App 中已設定正確的 **Authorization callback URL**

#### 3.3 重新部署
- [ ] 設定環境變數後已重新部署
- [ ] 檢查構建日誌確認沒有錯誤
- [ ] 檢查函數日誌確認運行時沒有錯誤

---

## 🔧 快速修復步驟

### 步驟 1: 檢查 Vercel 環境變數（5 分鐘）

1. 訪問 Vercel Dashboard → 您的專案 → Settings → Environment Variables
2. 確認所有必要的變數都已設定
3. 特別確認 `NEXTAUTH_URL` 是正確的 Vercel URL

### 步驟 2: 檢查 MongoDB Atlas（5 分鐘）

1. 訪問 MongoDB Atlas → Network Access
2. 確認 IP 白名單包含 `0.0.0.0/0`
3. 如果沒有，添加並等待 1-2 分鐘

### 步驟 3: 檢查 OAuth Provider 設定（10 分鐘）

1. **Google Cloud Console：**
   - 添加 `https://your-app.vercel.app` 到 JavaScript origins
   - 添加 `https://your-app.vercel.app/api/auth/callback/google` 到 redirect URIs

2. **GitHub：**
   - 確認 Authorization callback URL 是 `https://your-app.vercel.app/api/auth/callback/github`

### 步驟 4: 重新部署（2 分鐘）

1. 在 Vercel Dashboard 中點擊 **Redeploy**
2. 等待部署完成
3. 測試登入功能

---

## 📊 診斷工具

### 檢查 Vercel 日誌

1. 在 Vercel Dashboard 中查看 **Functions** 標籤
2. 訪問您的應用程式觸發錯誤
3. 查看實時日誌，尋找：
   - `DATABASE_URL is not set`
   - `Prisma connection error`
   - `NextAuth` 相關錯誤

### 檢查 MongoDB Atlas 日誌

1. 在 MongoDB Atlas Dashboard 中查看 **Metrics** 標籤
2. 查看連接嘗試和錯誤
3. 確認是否有被拒絕的連接

---

## ✅ 成功指標

修復後，您應該能夠：

- ✅ 在 Vercel 上成功完成 OAuth 登入
- ✅ 不會出現 callback 循環
- ✅ 能夠創建帳號並設定 userID
- ✅ 能夠正常使用應用程式功能

---

## 🆘 如果仍然有問題

### 檢查 1: 查看 Vercel 函數日誌
- 在 Vercel Dashboard 中查看實時日誌
- 尋找錯誤訊息和堆疊追蹤

### 檢查 2: 驗證環境變數
- 使用 Vercel CLI：`vercel env pull .env.local`
- 檢查本地 `.env.local` 文件，確認所有變數都正確

### 檢查 3: 測試本地環境
- 如果本地可以正常工作，問題可能在 Vercel 配置
- 如果本地也有問題，先修復本地環境

---

## 📝 常見錯誤訊息對照表

| 錯誤訊息 | 可能原因 | 解決方法 |
|---------|---------|---------|
| `error=Callback` | NextAuth 配置問題或環境變數缺失 | 檢查 `NEXTAUTH_URL` 和 `NEXTAUTH_SECRET` |
| `Server selection timeout` | MongoDB IP 白名單問題 | 在 MongoDB Atlas 中添加 `0.0.0.0/0` |
| `redirect_uri_mismatch` | OAuth Provider 設定錯誤 | 檢查 Google/GitHub OAuth 設定 |
| `DATABASE_URL is not set` | 環境變數未設定 | 在 Vercel Dashboard 中設定 `DATABASE_URL` |
| `PrismaClientInitializationError` | 資料庫連接失敗 | 檢查 `DATABASE_URL` 格式和 MongoDB 連接 |

