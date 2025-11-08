# 創建測試用戶指南

## 🚀 快速創建測試用戶

我已經為您創建了一個 API 端點來創建測試用戶。請按照以下步驟操作：

### 步驟 1: 確保開發伺服器正在運行

如果還沒有運行，請在終端執行：
```bash
npm run dev
```

### 步驟 2: 訪問創建用戶 API

在瀏覽器中打開以下網址：

**http://localhost:3000/api/admin/create-test-user**

或者使用 curl 命令：
```bash
curl -X POST http://localhost:3000/api/admin/create-test-user
```

### 步驟 3: 查看結果

如果成功，您會看到 JSON 回應，包含：
- `success: true`
- `user`: 用戶資訊
- `loginInfo`: 登入資訊

### 步驟 4: 使用測試帳號登入

創建成功後，您可以使用以下資訊登入：

- **userID**: `testuser`
- **Email**: `test@example.com`
- **Name**: `Test User`

在登入頁面，輸入 userID: `testuser` 即可登入。

---

## 🔄 如果用戶已存在

如果您再次訪問該 API，它會告訴您用戶已存在，並返回現有用戶的資訊。

---

## ⚠️ 注意事項

1. 這個 API 端點應該只在開發環境使用
2. 測試用戶的 userID 是 `testuser`，這是固定的
3. 如果遇到資料庫連接錯誤，請先檢查：
   - `.env.local` 中的 `DATABASE_URL` 是否正確
   - MongoDB Atlas 的 IP 白名單是否包含您的 IP

---

## 🐛 如果遇到錯誤

### 錯誤 1: 資料庫連接失敗

**解決方法：**
1. 檢查 `.env.local` 中的 `DATABASE_URL`
2. 確認 MongoDB Atlas 的網路存取設定
3. 確認資料庫用戶名和密碼正確

### 錯誤 2: Prisma Client 未生成

**解決方法：**
```bash
npx prisma generate
```

---

## ✅ 成功後

創建成功後，您就可以：
1. 使用 userID `testuser` 登入系統
2. 開始測試和修改應用程式功能
3. 不再需要依賴 OAuth callback

祝您使用愉快！🎉

