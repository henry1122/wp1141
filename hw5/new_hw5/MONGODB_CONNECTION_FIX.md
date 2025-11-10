# MongoDB 連接問題修復

## 問題分析

錯誤訊息：`querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net`

這表示系統無法解析 MongoDB 的 hostname。可能的原因：

1. **MongoDB URI 格式錯誤**
   - 檢查 `.env.local` 中的 `MONGODB_URI` 是否正確
   - 確認格式：`mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

2. **網路連線問題**
   - 確認可以連接到網際網路
   - 確認沒有防火牆阻擋 MongoDB 連接

3. **MongoDB Atlas 設定問題**
   - 確認 MongoDB Atlas 的 IP 白名單設定
   - 確認資料庫使用者權限

4. **環境變數未正確載入**
   - 確認 `.env.local` 檔案存在
   - 確認 Next.js 已重新啟動（修改 .env.local 後需要重啟）

## 解決步驟

### 1. 檢查 MongoDB URI

確認 `.env.local` 中的 URI 格式正確：

```env
MONGODB_URI=mongodb+srv://redtigerttczyczy_db_user:qhIz4yU15H3gJVD5@cluster0.qyaeelp.mongodb.net/hw5?retryWrites=true&w=majority&appName=Cluster0
```

### 2. 檢查 MongoDB Atlas 設定

1. 登入 MongoDB Atlas
2. 檢查 **Network Access**：
   - 確認你的 IP 地址在白名單中
   - 或者暫時允許所有 IP（`0.0.0.0/0`）用於測試

3. 檢查 **Database Access**：
   - 確認使用者 `redtigerttczyczy_db_user` 有讀寫權限

### 3. 測試連接

在終端機中測試 MongoDB 連接：

```bash
# 使用 mongo shell 或 mongosh 測試
mongosh "mongodb+srv://redtigerttczyczy_db_user:qhIz4yU15H3gJVD5@cluster0.qyaeelp.mongodb.net/hw5"
```

### 4. 重啟開發伺服器

修改 `.env.local` 後，必須重啟開發伺服器：

```bash
# 停止目前的伺服器 (Ctrl+C)
# 然後重新啟動
yarn dev
```

## 已修復的程式碼

1. ✅ 添加了更詳細的錯誤訊息
2. ✅ 添加了連接超時設定
3. ✅ 改進了錯誤處理邏輯

## 下一步

1. 確認 MongoDB URI 正確
2. 確認 MongoDB Atlas 設定正確
3. 重啟開發伺服器
4. 再次嘗試登入

