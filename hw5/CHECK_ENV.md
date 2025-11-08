# 環境變數檢查清單

## ✅ 快速檢查

請確認您的 `.env.local` 文件包含以下必要的環境變數：

### 🔴 必須設置（否則應用無法運行）

1. **NextAuth 配置**
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=你的密鑰
   ```

2. **Google OAuth**（您提到已有 Client Secret）
   ```env
   GOOGLE_CLIENT_ID=你的Google客戶端ID
   GOOGLE_CLIENT_SECRET=你的Google客戶端密鑰
   ```

3. **資料庫連接**
   ```env
   DATABASE_URL=你的MongoDB連接字串
   ```

### 🟡 建議設置（部分功能需要）

4. **GitHub OAuth**（如果要用 GitHub 登入）
   ```env
   GITHUB_ID=你的GitHub客戶端ID
   GITHUB_SECRET=你的GitHub客戶端密鑰
   ```

5. **Pusher**（即時更新功能）
   ```env
   PUSHER_APP_ID=你的Pusher應用ID
   PUSHER_KEY=你的Pusher密鑰
   PUSHER_SECRET=你的Pusher密鑰
   PUSHER_CLUSTER=你的Pusher集群（如：us2）
   NEXT_PUBLIC_PUSHER_KEY=你的Pusher密鑰（與上面相同）
   NEXT_PUBLIC_PUSHER_CLUSTER=你的Pusher集群（與上面相同）
   ```

6. **Cloudinary**（圖片上傳功能）
   ```env
   CLOUDINARY_CLOUD_NAME=你的Cloudinary雲名稱
   CLOUDINARY_API_KEY=你的Cloudinary API密鑰
   CLOUDINARY_API_SECRET=你的Cloudinary API密鑰
   ```

### 🟢 可選設置

7. **Facebook OAuth**（如果要用 Facebook 登入）
   ```env
   FACEBOOK_CLIENT_ID=你的Facebook應用ID
   FACEBOOK_CLIENT_SECRET=你的Facebook應用密鑰
   ```

## 📝 設置步驟

1. **複製範例文件**（如果還沒有 `.env.local`）
   ```bash
   cp .env.local.example .env.local
   ```

2. **編輯 `.env.local` 文件**
   - 用您的實際值替換所有 `your-xxx-here` 的部分
   - 確保沒有多餘的空格或引號

3. **生成 NEXTAUTH_SECRET**（如果還沒有）
   ```bash
   openssl rand -base64 32
   ```
   將輸出複製到 `NEXTAUTH_SECRET`

4. **驗證設置**
   - 確保所有必要的變數都已設置
   - 檢查值是否正確（沒有多餘的空格）

## ⚠️ 常見錯誤

1. **缺少引號**：環境變數值通常不需要引號，除非值中包含空格
2. **多餘空格**：確保 `=` 前後沒有空格
3. **錯誤的 URI**：確保 `NEXTAUTH_URL` 是 `http://localhost:3000`（本地開發）
4. **未設置 NEXTAUTH_URL**：這會導致 OAuth 重定向失敗

## 🔍 驗證方法

設置完成後，重新啟動開發伺服器：
```bash
npm run dev
```

如果看到錯誤訊息，檢查：
- 終端輸出中的錯誤
- 瀏覽器控制台的錯誤
- 確認所有必要的環境變數都已設置

