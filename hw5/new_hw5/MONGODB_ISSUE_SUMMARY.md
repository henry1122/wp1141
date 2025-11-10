# MongoDB 連接問題總結

## 問題描述

錯誤訊息：`querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net`

## 根本原因

`.env.local` 中的 `MONGODB_URI` 還是模板值，不是實際的 MongoDB URI。

**錯誤的 URI（模板值）：**
```
mongodb+srv://username:password@cluster.mongodb.net/hw5
```

**正確的 URI（你的實際 URI）：**
```
mongodb+srv://redtigerttczyczy_db_user:qhIz4yU15H3gJVD5@cluster0.qyaeelp.mongodb.net/hw5?retryWrites=true&w=majority&appName=Cluster0
```

## 已修復的內容

1. ✅ 更新了 `.env.local` 中的 MongoDB URI
2. ✅ 改進了 MongoDB 連接錯誤處理
3. ✅ 添加了詳細的錯誤訊息
4. ✅ 添加了連接超時設定

## 下一步

1. **重啟開發伺服器**（重要！）
   ```bash
   # 停止目前的伺服器 (Ctrl+C)
   yarn dev
   ```

2. **確認 MongoDB Atlas 設定**：
   - 登入 MongoDB Atlas
   - 檢查 **Network Access** → 確認 IP 白名單
   - 檢查 **Database Access** → 確認使用者權限

3. **測試連接**：
   - 嘗試再次登入
   - 查看終端機是否有 "✅ MongoDB connected successfully" 訊息

## 如果仍然無法連接

1. **檢查網路連線**：
   - 確認可以訪問網際網路
   - 確認沒有防火牆阻擋

2. **檢查 MongoDB Atlas**：
   - 確認 Cluster 狀態是 "Running"
   - 確認 IP 白名單包含你的 IP（或使用 `0.0.0.0/0` 允許所有 IP）

3. **測試 MongoDB 連接**：
   ```bash
   # 使用 mongosh 測試（如果已安裝）
   mongosh "mongodb+srv://redtigerttczyczy_db_user:qhIz4yU15H3gJVD5@cluster0.qyaeelp.mongodb.net/hw5"
   ```

## 注意事項

- 修改 `.env.local` 後必須重啟開發伺服器
- MongoDB URI 中的特殊字元（如密碼中的特殊符號）需要 URL 編碼
- 確保 MongoDB Atlas 的 IP 白名單設定正確

