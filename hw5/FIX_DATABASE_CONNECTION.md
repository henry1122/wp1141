# 修復資料庫連接問題

## 🔴 錯誤訊息分析

您遇到的錯誤：
```
Server selection timeout: No available servers
I/O error: received fatal alert: InternalError
```

這表示應用程式無法連接到 MongoDB Atlas。

## 🔍 可能的原因

### 1. IP 白名單未包含您的 IP（最常見）

MongoDB Atlas 預設只允許特定 IP 訪問。如果您的 IP 不在白名單中，連接會失敗。

### 2. DATABASE_URL 格式錯誤

連接字串可能包含錯誤的格式或特殊字元未正確編碼。

### 3. MongoDB Atlas 叢集問題

叢集可能暫時無法訪問或配置有問題。

### 4. 網路連接問題

防火牆或網路設定可能阻止連接。

---

## ✅ 解決步驟

### 步驟 1: 檢查並更新 MongoDB Atlas IP 白名單

1. **登入 MongoDB Atlas**
   - 訪問：https://cloud.mongodb.com/
   - 登入您的帳號

2. **前往 Network Access（網路存取）**
   - 在左側選單中，點擊 **Network Access**
   - 或直接訪問：https://cloud.mongodb.com/v2#/security/network/list

3. **添加 IP 地址**
   - 點擊 **Add IP Address** 或 **Add IP Entry**
   - 選擇 **Allow Access from Anywhere**
   - 這會自動填入 `0.0.0.0/0`（允許所有 IP）
   - 點擊 **Confirm**

   ⚠️ **注意：** 
   - 這允許所有 IP 訪問，適合開發環境
   - 生產環境建議只添加特定 IP

4. **等待生效**
   - 更改可能需要 1-2 分鐘才能生效

### 步驟 2: 檢查 DATABASE_URL 格式

確認 `.env.local` 中的 `DATABASE_URL` 格式正確：

```env
DATABASE_URL=mongodb+srv://hocashi:P%40qq3849@cluster0.suswhjg.mongodb.net/my-x?retryWrites=true&w=majority
```

**重要檢查點：**
- ✅ 用戶名：`hocashi`
- ✅ 密碼中的 `@` 已編碼為 `%40`
- ✅ 叢集地址：`cluster0.suswhjg.mongodb.net`
- ✅ 資料庫名稱：`my-x`
- ✅ 參數：`retryWrites=true&w=majority`

### 步驟 3: 驗證 MongoDB Atlas 叢集狀態

1. **檢查叢集狀態**
   - 在 MongoDB Atlas Dashboard 中，前往 **Database**
   - 確認叢集狀態是 **Running**（運行中）
   - 如果顯示其他狀態，等待它恢復正常

2. **測試連接**
   - 在 MongoDB Atlas Dashboard 中，點擊 **Connect**
   - 選擇 **Connect your application**
   - 複製連接字串，與您的 `.env.local` 中的 `DATABASE_URL` 比較

### 步驟 4: 重新測試連接

1. **重新啟動開發伺服器**
   ```bash
   # 停止伺服器（Ctrl+C）
   npm run dev
   ```

2. **測試資料庫連接**
   ```bash
   npx prisma db push
   ```

3. **如果成功，再次嘗試創建訪客帳號**
   - 訪問：`http://localhost:3000/api/admin/create-guest`

---

## 🔧 進階故障排除

### 如果 IP 白名單已設定但仍無法連接

#### 方法 1: 檢查當前 IP

1. **獲取您的當前 IP**
   - 訪問：https://whatismyipaddress.com/
   - 複製您的 IP 地址

2. **手動添加 IP**
   - 在 MongoDB Atlas Network Access 中
   - 點擊 **Add IP Address**
   - 選擇 **Add Current IP Address** 或手動輸入您的 IP
   - 點擊 **Confirm**

#### 方法 2: 檢查 DATABASE_URL 中的特殊字元

確認密碼中的特殊字元已正確編碼：

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- 空格 → `%20`

#### 方法 3: 嘗試不同的連接字串格式

如果 `mongodb+srv://` 不工作，可以嘗試標準格式（但需要指定端口）：

```env
DATABASE_URL=mongodb://hocashi:P%40qq3849@cluster0-shard-00-00.suswhjg.mongodb.net:27017,cluster0-shard-00-01.suswhjg.mongodb.net:27017,cluster0-shard-00-02.suswhjg.mongodb.net:27017/my-x?ssl=true&replicaSet=atlas-oncz29-shard-0&authSource=admin&retryWrites=true&w=majority
```

但通常 `mongodb+srv://` 格式更好。

---

## 📋 快速檢查清單

請確認以下項目：

- [ ] MongoDB Atlas IP 白名單包含 `0.0.0.0/0` 或您的當前 IP
- [ ] `.env.local` 中的 `DATABASE_URL` 格式正確
- [ ] 密碼中的特殊字元已正確編碼（`@` → `%40`）
- [ ] MongoDB Atlas 叢集狀態是 **Running**
- [ ] 已重新啟動開發伺服器
- [ ] 已運行 `npx prisma db push` 測試連接

---

## 🆘 如果仍然無法連接

### 檢查 1: 查看詳細錯誤

在終端中運行：
```bash
npx prisma db push
```

查看完整的錯誤訊息。

### 檢查 2: 驗證 MongoDB Atlas 連接字串

1. 在 MongoDB Atlas Dashboard 中
2. 點擊 **Connect** → **Connect your application**
3. 選擇 **Node.js** 和版本 **5.5 or later**
4. 複製連接字串
5. 與您的 `.env.local` 中的 `DATABASE_URL` 比較

### 檢查 3: 測試從 MongoDB Atlas 連接

在 MongoDB Atlas Dashboard 中：
1. 點擊 **Connect** → **Connect using MongoDB Compass**
2. 如果 Compass 可以連接，說明叢集正常
3. 問題可能在應用程式的連接配置

---

## 💡 常見解決方案

### 解決方案 1: 使用 0.0.0.0/0（開發環境）

最簡單的方法是在 MongoDB Atlas 中允許所有 IP：

1. Network Access → Add IP Address
2. 選擇 **Allow Access from Anywhere**
3. 確認

### 解決方案 2: 重新生成連接字串

1. 在 MongoDB Atlas 中，重新生成連接字串
2. 更新 `.env.local` 中的 `DATABASE_URL`
3. 確保密碼正確編碼

### 解決方案 3: 檢查防火牆

如果您的網路有防火牆：
- 確認允許連接到 MongoDB Atlas（端口 27017 或 27017-27019）
- 或使用 VPN/代理

---

## ✅ 成功指標

修復後，您應該能夠：

- ✅ 運行 `npx prisma db push` 成功
- ✅ 訪問 `http://localhost:3000/api/admin/create-guest` 成功創建帳號
- ✅ 使用 `guest` 登入系統
- ✅ 不再看到 "Server selection timeout" 錯誤

---

## 📞 需要更多幫助？

如果完成上述步驟後仍然無法連接，請提供：

1. MongoDB Atlas Network Access 的截圖（確認 IP 白名單）
2. `.env.local` 中的 `DATABASE_URL`（隱藏密碼，只顯示格式）
3. 運行 `npx prisma db push` 的完整錯誤訊息

這樣我可以提供更具體的解決方案！

