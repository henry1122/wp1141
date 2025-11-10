# 修復 Vercel 部署的 Google OAuth 錯誤

## 問題
在 Vercel 部署時出現 `Error 400: redirect_uri_mismatch`，但 localhost 可以正常運作。

## 解決步驟

### 1. 確認 Vercel 環境變數

在 Vercel Dashboard 中確認以下環境變數已正確設置：

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的專案 `wp1141`
3. 進入 **Settings** → **Environment Variables**
4. 確認以下變數：

```
NEXTAUTH_URL=https://wp1141-kappa.vercel.app
NEXTAUTH_SECRET=你的-secret
GOOGLE_CLIENT_ID=你的-google-client-id
GOOGLE_CLIENT_SECRET=你的-google-client-secret
DATABASE_URL=你的-mongodb-url
```

**重要：** `NEXTAUTH_URL` 必須是完整的 Vercel 網址，**不能**包含尾隨斜線 `/`

### 2. 更新 Google Cloud Console 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇您的專案
3. 進入 **APIs & Services** → **Credentials**
4. 找到您的 OAuth 2.0 Client ID，點擊編輯
5. 在 **Authorized redirect URIs** 中添加：

```
https://wp1141-kappa.vercel.app/api/auth/callback/google
```

6. 在 **Authorized JavaScript origins** 中添加：

```
https://wp1141-kappa.vercel.app
```

**完整的 Authorized redirect URIs 列表應該包含：**
```
http://localhost:3000/api/auth/callback/google
https://wp1141-kappa.vercel.app/api/auth/callback/google
```

**完整的 Authorized JavaScript origins 列表應該包含：**
```
http://localhost:3000
https://wp1141-kappa.vercel.app
```

### 3. 重新部署 Vercel

1. 在 Vercel Dashboard 中，進入 **Deployments**
2. 點擊最新部署右側的 **⋯** 選單
3. 選擇 **Redeploy**
4. 或者推送新的 commit 觸發自動部署

### 4. 驗證修復

1. 訪問 `https://wp1141-kappa.vercel.app`
2. 嘗試使用 Google 登入
3. 應該可以正常跳轉並登入

## 常見問題

### Q: 修改 Google Cloud Console 後還是無法登入？
A: 等待幾分鐘讓 Google 的設定生效，然後清除瀏覽器快取再試。

### Q: 如何確認 NEXTAUTH_URL 是否正確？
A: 在 Vercel 的環境變數中，`NEXTAUTH_URL` 必須完全匹配您的 Vercel 網址：
- ✅ 正確：`https://wp1141-kappa.vercel.app`
- ❌ 錯誤：`https://wp1141-kappa.vercel.app/` (有尾隨斜線)
- ❌ 錯誤：`http://wp1141-kappa.vercel.app` (使用 http 而非 https)

### Q: 如果有多個 Vercel 部署（預覽部署）怎麼辦？
A: 您需要為每個預覽部署添加對應的 redirect URI，或者使用通配符（如果 Google 支援）。

## 檢查清單

- [ ] Vercel 環境變數 `NEXTAUTH_URL` 設置為 `https://wp1141-kappa.vercel.app`
- [ ] Google Cloud Console 中添加了 `https://wp1141-kappa.vercel.app/api/auth/callback/google`
- [ ] Google Cloud Console 中添加了 `https://wp1141-kappa.vercel.app` 作為 JavaScript origin
- [ ] 已重新部署 Vercel
- [ ] 等待幾分鐘讓 Google 設定生效
- [ ] 清除瀏覽器快取後測試

