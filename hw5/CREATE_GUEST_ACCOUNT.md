# 創建訪客帳號指南

## 🚀 快速創建訪客帳號

我已經為您創建了一個簡單的 API 端點來創建訪客帳號。

### 步驟 1: 訪問創建 API

在瀏覽器中打開以下網址（開發伺服器必須正在運行）：

**http://localhost:3000/api/admin/create-guest**

### 步驟 2: 查看結果

如果成功，您會看到 JSON 回應，包含：
- `success: true`
- `user`: 用戶資訊
- `loginInfo`: 登入資訊

### 步驟 3: 使用訪客帳號登入

創建成功後，您可以使用以下資訊登入：

- **userID**: `guest`
- **Email**: `guest@example.com`
- **Name**: `Guest User`

在登入頁面：
1. 點擊 "Login with UserID"
2. 輸入 `guest`
3. 點擊 "Login"

---

## ✅ 成功回應範例

```json
{
  "success": true,
  "message": "訪客帳號創建成功！",
  "user": {
    "userID": "guest",
    "email": "guest@example.com",
    "name": "Guest User",
    "id": "..."
  },
  "loginInfo": {
    "userID": "guest",
    "email": "guest@example.com",
    "name": "Guest User",
    "message": "現在您可以使用 userID \"guest\" 登入系統了！"
  }
}
```

---

## 🔄 如果帳號已存在

如果您再次訪問該 API，它會告訴您帳號已存在，並返回現有用戶的資訊。

---

## ⚠️ 如果遇到錯誤

### 錯誤 1: 資料庫連接失敗

**錯誤訊息：** `Server selection timeout` 或 `No available servers`

**可能原因：**
- MongoDB Atlas 連接字串不正確
- IP 白名單未包含您的 IP
- 網路連接問題

**解決方法：**
1. 檢查 `.env.local` 中的 `DATABASE_URL`
2. 確認 MongoDB Atlas 的網路存取設定包含 `0.0.0.0/0`（允許所有 IP）
3. 確認資料庫用戶名和密碼正確

### 錯誤 2: Prisma Client 未生成

**解決方法：**
```bash
npx prisma generate
```

---

## 📝 注意事項

1. 訪客帳號的 userID 是固定的：`guest`
2. 如果已經存在，API 會返回現有帳號資訊
3. 這個 API 支援 GET 和 POST 請求，方便從瀏覽器直接訪問

---

## 🎯 快速檢查

完成後，請確認：
- [ ] 訪問 API 返回 `success: true`
- [ ] 可以使用 `guest` 作為 userID 登入
- [ ] 登入後可以正常使用應用程式

祝您使用愉快！🎉

