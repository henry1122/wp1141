# 修復所有發現的問題

## 🔴 發現的問題

根據您提供的截圖，我發現了以下問題：

### 問題 1: Google Cloud Console - 缺少 JavaScript Origins ⚠️ 最重要

**問題：** 在 Google Cloud Console 的 OAuth 設定中，**「已授權的 JavaScript 來源」是空的**！

**影響：** 這會導致所有 Google OAuth 登入請求失敗，因為 Google 不信任您的應用程式來源。

**解決方法：**

1. 在 Google Cloud Console 中，找到「已授權的 JavaScript 來源」區塊
2. 點擊「新增 URI」或「+ 新增項目」
3. 添加以下兩個網址（每行一個）：
   ```
   http://localhost:3000
   https://wp1141-kappa.vercel.app
   ```
4. 點擊「儲存」

**重要：**
- 只包含網域，不要包含路徑（不要加 `/api/auth` 等）
- 不要包含尾隨斜線 `/`
- 本地用 `http://`，Vercel 用 `https://`

---

### 問題 2: Vercel 構建警告

**問題：** Vercel 部署頁面顯示有 1 個構建警告。

**解決方法：**

1. 在 Vercel Dashboard 中，點擊部署詳情
2. 查看 **Build Logs** 標籤
3. 找到黃色警告圖示，查看警告內容
4. 根據警告訊息修復問題

**常見警告：**
- Prisma Client 未生成
- 環境變數缺失
- TypeScript 類型錯誤

---

### 問題 3: 登入時 Internal Server Error

**問題：** 使用 `guest` 登入時出現 "Internal server error"。

**可能原因：**
1. 資料庫連接失敗
2. 測試用戶 `guest` 尚未創建
3. 登入 API 邏輯錯誤

**解決步驟：**

#### 步驟 1: 先創建訪客帳號

在瀏覽器中訪問：
```
http://localhost:3000/api/admin/create-guest
```

如果看到資料庫連接錯誤，請檢查：
- `.env.local` 中的 `DATABASE_URL` 是否正確
- MongoDB Atlas 的 IP 白名單是否包含您的 IP

#### 步驟 2: 檢查終端日誌

查看開發伺服器的終端輸出，尋找錯誤訊息：
- `DATABASE_URL is not set`
- `PrismaClientInitializationError`
- `Server selection timeout`

#### 步驟 3: 測試資料庫連接

在終端執行：
```bash
npx prisma db push
```

如果失敗，說明資料庫連接有問題。

---

### 問題 4: Vercel 404 錯誤

**問題：** Vercel 部署顯示 Ready，但訪問時出現 404。

**可能原因：**
1. 環境變數未正確設定
2. 構建時出錯但未顯示
3. Next.js 路由配置問題

**解決方法：**

1. **檢查環境變數**
   - 確認 Vercel Dashboard 中所有環境變數都已設定
   - 特別確認 `NEXTAUTH_URL` 是 `https://wp1141-kappa.vercel.app`

2. **查看構建日誌**
   - 在 Vercel Dashboard 中查看完整的構建日誌
   - 確認沒有錯誤訊息

3. **檢查函數日誌**
   - 在 Vercel Dashboard 中查看 **Functions** 標籤
   - 查看運行時錯誤

---

## ✅ 修復優先順序

### 立即修復（最重要）

1. **Google Cloud Console - 添加 JavaScript Origins**
   - 這是導致 OAuth 失敗的主要原因
   - 修復後，Google OAuth 登入應該可以正常工作

### 其次修復

2. **檢查並修復 Vercel 構建警告**
   - 查看構建日誌中的警告
   - 根據警告內容修復

3. **修復本地登入問題**
   - 先創建訪客帳號
   - 檢查資料庫連接
   - 修復登入 API 錯誤

### 最後檢查

4. **驗證 Vercel 部署**
   - 修復上述問題後，重新部署
   - 確認 404 錯誤是否解決

---

## 🔧 快速修復步驟

### 步驟 1: 修復 Google Cloud Console（5 分鐘）

1. 訪問：https://console.cloud.google.com/
2. 選擇專案：`My Project 39074`
3. 前往：**APIs & Services** → **Credentials**
4. 找到 OAuth 2.0 Client ID：`215257223815-uo4cl5tfim41o3fonv557li0mv9245a0`
5. 點擊編輯（鉛筆圖標）
6. 在「已授權的 JavaScript 來源」中，點擊「新增 URI」
7. 添加：
   - `http://localhost:3000`
   - `https://wp1141-kappa.vercel.app`
8. 點擊「儲存」

### 步驟 2: 檢查 Vercel 構建日誌（5 分鐘）

1. 在 Vercel Dashboard 中，點擊部署
2. 查看 **Build Logs**
3. 找到警告，記錄警告內容
4. 根據警告修復問題

### 步驟 3: 修復本地登入（10 分鐘）

1. 訪問：`http://localhost:3000/api/admin/create-guest`
2. 如果成功，使用 `guest` 登入
3. 如果失敗，檢查資料庫連接

---

## 📋 檢查清單

完成修復後，請確認：

- [ ] Google Cloud Console 中已添加 JavaScript origins
- [ ] Vercel 構建警告已解決
- [ ] 本地可以創建訪客帳號
- [ ] 本地可以使用 `guest` 登入
- [ ] Vercel 部署不再出現 404
- [ ] Google OAuth 登入可以正常工作

---

## 🆘 如果仍然有問題

請提供：
1. Vercel 構建日誌中的警告內容
2. 本地終端的錯誤訊息（當嘗試登入時）
3. 訪問 `http://localhost:3000/api/admin/create-guest` 時的回應

這樣我可以提供更具體的解決方案。

