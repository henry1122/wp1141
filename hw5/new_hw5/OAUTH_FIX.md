# OAuth PKCE 錯誤修復指南

## ❌ 錯誤訊息
```
[auth][details]: { "error": "invalid_grant", "error_description": "Invalid code verifier.", "provider": "google" }
```

## 🔍 問題原因

這個錯誤是因為：
1. 從**預覽 URL**訪問（例如：`hw5-ehq7guqy9-redtigerttczyczy-7875s-projects.vercel.app`）
2. 但 `NEXTAUTH_URL` 設置為**生產 URL**（例如：`hw5-tau.vercel.app`）
3. 導致 PKCE code verifier 不匹配

## ✅ 解決方案

### 方案 1：在 Google OAuth 中添加所有 Redirect URI（推薦）

1. **前往 Google Cloud Console**
   - 打開 [Google Cloud Console](https://console.cloud.google.com/)
   - 選擇你的專案
   - 前往 **APIs & Services** → **Credentials**
   - 點擊你的 OAuth 2.0 Client ID

2. **添加 Redirect URI**
   在 **Authorized redirect URIs** 中，添加：
   ```
   https://hw5-tau.vercel.app/api/auth/callback/google
   ```
   
   **注意**：由於 Vercel 的預覽 URL 每次不同，你無法為所有預覽環境添加 Redirect URI。

3. **解決方案**：使用生產環境 URL 進行測試
   - 訪問 `https://hw5-tau.vercel.app`（生產環境）
   - 而不是訪問預覽 URL

### 方案 2：修改環境變數設置（不推薦）

如果你想支援預覽環境，需要：
1. 在 Vercel Dashboard → Settings → Environment Variables
2. 為 `NEXTAUTH_URL` 設置不同的值：
   - **Production**: `https://hw5-tau.vercel.app`
   - **Preview**: （留空，讓 NextAuth 自動檢測）
   - **Development**: `http://localhost:3000`

但這樣仍然無法解決預覽環境的問題，因為預覽 URL 每次不同。

### 方案 3：使用生產環境進行測試（最簡單）

**推薦做法**：
1. 確保 `NEXTAUTH_URL` 設置為生產環境 URL：`https://hw5-tau.vercel.app`
2. 在 Google OAuth 中添加生產環境的 Redirect URI
3. **使用生產環境 URL 進行測試和開發**：`https://hw5-tau.vercel.app`
4. 不要使用預覽 URL 測試 OAuth

## 🔧 已修復的配置

我已經在 `lib/auth/config.ts` 中添加了：
```typescript
trustHost: true,
```

這讓 NextAuth 可以自動檢測 URL，但前提是 Google OAuth 的 Redirect URI 要正確設置。

## 📝 檢查清單

- [ ] 在 Google OAuth 中添加了生產環境的 Redirect URI
- [ ] `NEXTAUTH_URL` 設置為生產環境 URL
- [ ] 使用生產環境 URL 進行測試（不要使用預覽 URL）
- [ ] 重新部署後測試 OAuth 登入

## 🚀 測試步驟

1. 訪問生產環境 URL：`https://hw5-tau.vercel.app`
2. 點擊「使用 Google 登入」
3. 完成 OAuth 授權
4. 應該能成功登入

如果仍有問題，請檢查：
- Vercel Logs 中的詳細錯誤訊息
- Google OAuth 的 Redirect URI 是否正確
- 環境變數是否已正確設置

