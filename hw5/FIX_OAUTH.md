# 修復 Google OAuth redirect_uri_mismatch 錯誤

## 問題說明
錯誤 `Error 400: redirect_uri_mismatch` 表示 Google Cloud Console 中設置的重定向 URI 與應用程式實際使用的不一致。

## 解決步驟

### 1. 確認正確的回調 URL
NextAuth 使用的回調 URL 格式為：
- **本地開發**:** `http://localhost:3000/api/auth/callback/google`
- **生產環境**:** `https://your-domain.vercel.app/api/auth/callback/google`

### 2. 在 Google Cloud Console 中設置

1. 訪問 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇您的專案
3. 前往 **APIs & Services** → **Credentials**
4. 找到您的 OAuth 2.0 Client ID，點擊編輯（鉛筆圖標）
5. 在 **Authorized redirect URIs** 部分，確保添加了以下 URI：

   **本地開發環境：**
   ```
   http://localhost:3000/api/auth/callback/google
   ```

   **如果部署到 Vercel：**
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

6. 點擊 **Save** 保存

### 3. 檢查環境變數

確保 `.env.local` 文件包含：

```env
# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. 重要注意事項

- **不要**在重定向 URI 末尾添加斜線 `/`
- **確保**協議正確（`http://` 用於本地，`https://` 用於生產）
- **確保**端口號正確（本地開發通常是 `3000`）
- 修改後可能需要等待幾分鐘才能生效

### 5. 驗證步驟

1. 重新啟動開發伺服器：
   ```bash
   npm run dev
   ```

2. 清除瀏覽器快取和 cookies

3. 再次嘗試登入

### 6. 如果仍然失敗

檢查瀏覽器控制台和終端輸出，查看實際使用的 redirect_uri 是什麼，然後確保該 URI 在 Google Cloud Console 中已正確配置。

## 其他 OAuth Provider 的設置

### GitHub
- 回調 URL: `http://localhost:3000/api/auth/callback/github`

### Facebook
- 回調 URL: `http://localhost:3000/api/auth/callback/facebook`

確保所有 provider 的回調 URL 都在各自的開發者控制台中正確配置。

