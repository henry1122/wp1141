# 部署檢查清單

## 部署前準備

### 1. Line Bot 設定 ✅

- [ ] 在 [Line Developers](https://developers.line.biz/) 建立 Provider
- [ ] 建立 Messaging API Channel
- [ ] 取得 Channel Access Token
- [ ] 取得 Channel Secret
- [ ] 記錄 Webhook URL（部署後設定）

### 2. MongoDB Atlas 設定 ✅

- [ ] 建立 MongoDB Atlas 帳號
- [ ] 建立免費叢集（M0）
- [ ] 建立資料庫使用者（記住帳號密碼）
- [ ] 設定 IP 白名單（允許所有 IP：0.0.0.0/0）
- [ ] 取得連線字串（Connection String）
- [ ] 測試連線

### 3. OpenAI API 設定 ✅

- [ ] 建立 OpenAI 帳號
- [ ] 前往 [API Keys](https://platform.openai.com/api-keys) 建立 API Key
- [ ] 確認帳戶有足夠配額（免費帳戶有 $5 額度）
- [ ] 記錄 API Key

### 4. 本地測試 ✅

- [ ] 複製 `.env.example` 為 `.env`
- [ ] 填入所有環境變數
- [ ] 執行 `npm install`
- [ ] 執行 `npm run dev`
- [ ] 訪問 `http://localhost:3000` 確認後台正常
- [ ] 訪問 `http://localhost:3000/api/health` 確認服務狀態
- [ ] 使用 [ngrok](https://ngrok.com/) 或類似工具建立本地隧道
- [ ] 在 Line Developers Console 設定 Webhook URL（ngrok URL + /api/webhook/line）
- [ ] 在 Line 中測試 Bot 回應

## Vercel 部署步驟

### 1. 準備 Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. 部署到 Vercel

1. 前往 [Vercel](https://vercel.com/)
2. 使用 GitHub/GitLab/Bitbucket 登入
3. 點擊 "New Project"
4. 匯入你的 Git Repository
5. 設定專案名稱和框架（自動偵測 Next.js）

### 3. 設定環境變數

在 Vercel 專案設定中，加入以下環境變數：

```
LINE_CHANNEL_ACCESS_TOKEN=your_token_here
LINE_CHANNEL_SECRET=your_secret_here
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-3.5-turbo
MONGODB_URI=your_mongodb_uri_here
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NODE_ENV=production
```

### 4. 部署

- [ ] 點擊 "Deploy"
- [ ] 等待部署完成
- [ ] 記錄部署後的 URL

### 5. 設定 Line Webhook

- [ ] 前往 Line Developers Console
- [ ] 進入你的 Channel 設定
- [ ] 找到 Webhook URL 設定
- [ ] 輸入：`https://your-project.vercel.app/api/webhook/line`
- [ ] 啟用 Webhook
- [ ] 點擊 "Verify" 確認連線成功

### 6. 驗證部署

- [ ] 訪問 `https://your-project.vercel.app` 確認後台正常
- [ ] 訪問 `https://your-project.vercel.app/api/health` 確認服務狀態
- [ ] 在 Line 中發送訊息測試 Bot
- [ ] 檢查後台是否有對話記錄

## 常見問題

### Webhook 驗證失敗

- 確認 Channel Secret 正確
- 確認 Webhook URL 正確（包含 https://）
- 確認 Vercel 部署成功且可訪問

### LLM 無回應

- 確認 OpenAI API Key 正確
- 確認帳戶有足夠配額
- 檢查 Vercel 日誌查看錯誤訊息
- 系統會自動降級到預設回應

### 資料庫連線失敗

- 確認 MongoDB URI 正確
- 確認 IP 白名單設定（允許所有 IP）
- 確認資料庫使用者帳號密碼正確
- 檢查 Vercel 日誌查看連線錯誤

### 後台無法顯示對話

- 確認 MongoDB 連線正常
- 檢查 API 端點是否正常運作
- 查看瀏覽器 Console 是否有錯誤
- 確認 CORS 設定正確

## 監控與維護

### 定期檢查

- [ ] 檢查 Vercel 部署狀態
- [ ] 檢查 MongoDB Atlas 使用量
- [ ] 檢查 OpenAI API 使用量與配額
- [ ] 查看錯誤日誌

### 效能優化

- 監控 API 回應時間
- 檢查資料庫查詢效能
- 考慮加入快取機制
- 監控 LLM 呼叫次數與成本

## 支援資源

- [Line Developers Documentation](https://developers.line.biz/en/docs/)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

