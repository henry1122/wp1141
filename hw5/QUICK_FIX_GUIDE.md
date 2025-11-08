# 🚨 快速修復指南 - 根據截圖發現的問題

## ⚠️ 發現的 3 個關鍵問題

### 🔴 問題 1: Google Cloud Console - JavaScript Origins 是空的（最嚴重！）

**截圖顯示：** 「已授權的 JavaScript 來源」區塊是空的！

**影響：** 這會導致所有 Google OAuth 登入失敗。

**立即修復：**

1. 訪問：https://console.cloud.google.com/
2. 選擇專案：`My Project 39074`
3. 前往：**APIs & Services** → **Credentials**
4. 找到 OAuth Client ID：`215257223815-uo4cl5tfim41o3fonv557li0mv9245a0`
5. 點擊編輯（鉛筆圖標）
6. 在「**已授權的 JavaScript 來源**」區塊：
   - 點擊「**新增 URI**」或「**+ 新增項目**」
   - 添加第一個：`http://localhost:3000`
   - 點擊「**新增 URI**」 again
   - 添加第二個：`https://wp1141-kappa.vercel.app`
7. 點擊「**儲存**」

**重要：**
- ✅ 只包含網域，不要路徑
- ✅ 不要尾隨斜線 `/`
- ✅ 本地用 `http://`，Vercel 用 `https://`

---

### 🟡 問題 2: Vercel 構建警告

**截圖顯示：** Build Logs 旁邊有 1 個黃色警告。

**修復步驟：**

1. 在 Vercel Dashboard 中，點擊該部署
2. 點擊 **Build Logs** 標籤
3. 找到黃色警告，查看警告內容
4. 常見警告及修復：
   - **Prisma Client 警告**：確認 `package.json` 中有 `postinstall: "prisma generate"`
   - **環境變數警告**：確認所有環境變數都已設定
   - **TypeScript 警告**：修復類型錯誤

---

### 🔴 問題 3: 登入 Internal Server Error

**截圖顯示：** 使用 `guest` 登入時出現 "Internal server error"。

**可能原因：**
1. 資料庫連接失敗
2. `guest` 用戶尚未創建
3. Prisma Client 未生成

**修復步驟：**

#### 步驟 1: 先創建訪客帳號

在瀏覽器中訪問：
```
http://localhost:3000/api/admin/create-guest
```

#### 步驟 2: 檢查終端錯誤

查看開發伺服器的終端，尋找：
- `DATABASE_URL is not set`
- `Server selection timeout`
- `PrismaClientInitializationError`

#### 步驟 3: 檢查資料庫連接

在終端執行：
```bash
npx prisma db push
```

如果失敗，檢查：
- `.env.local` 中的 `DATABASE_URL` 是否正確
- MongoDB Atlas IP 白名單是否包含您的 IP（或使用 `0.0.0.0/0`）

---

## 📋 修復優先順序

### 1️⃣ 立即修復（5 分鐘）

**Google Cloud Console - 添加 JavaScript Origins**

這是最重要的！修復後 Google OAuth 應該可以正常工作。

### 2️⃣ 其次修復（10 分鐘）

**檢查 Vercel 構建警告**

查看構建日誌，根據警告內容修復。

### 3️⃣ 最後修復（15 分鐘）

**修復本地登入問題**

1. 創建訪客帳號
2. 檢查資料庫連接
3. 測試登入

---

## ✅ 修復後檢查清單

完成修復後，請確認：

- [ ] Google Cloud Console 中已添加 2 個 JavaScript origins
- [ ] Vercel 構建警告已解決
- [ ] 可以訪問 `http://localhost:3000/api/admin/create-guest` 並成功創建帳號
- [ ] 可以使用 `guest` 登入（不再出現 Internal server error）
- [ ] Google OAuth 登入可以正常工作
- [ ] Vercel 部署不再出現 404

---

## 🆘 如果還有問題

請提供：
1. **Vercel 構建日誌中的警告內容**（複製完整的警告訊息）
2. **本地終端的錯誤訊息**（當嘗試登入時）
3. **訪問 `http://localhost:3000/api/admin/create-guest` 的回應**

這樣我可以提供更具體的解決方案！

