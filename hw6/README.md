# Line AI Chatbot - 智慧聊天機器人系統

這是一個整合 Line Messaging API 的智慧聊天機器人系統，使用 Next.js + TypeScript 開發，支援 OpenAI GPT 模型，並提供完整的管理後台。

## 功能特色

### 🤖 Line Bot 功能
- **AI 個人小幫手**：協助使用者整理資訊、回答問題、提供日常建議
- **對話脈絡維持**：自動維持對話上下文，讓回應更連貫
- **優雅降級**：當 LLM 服務不可用時，自動切換到預設回應腳本
- **錯誤處理**：完善的錯誤處理機制，包括配額限制、速率限制等

### 📊 管理後台
- **對話監控**：即時查看所有對話記錄
- **統計資訊**：顯示使用者數、對話數、訊息數等統計
- **對話詳情**：點擊查看完整對話內容
- **篩選功能**：依狀態、使用者 ID 篩選對話
- **即時更新**：每 5 秒自動更新最新對話

## 技術架構

### 前端
- **Next.js 14** (TypeScript)
- **Tailwind CSS** - 現代化 UI 設計
- **React Hooks** - 狀態管理

### 後端
- **Next.js API Routes** - RESTful API
- **Mongoose** - MongoDB ODM
- **Zod** - 資料驗證

### 第三方服務
- **Line Messaging API** - 訊息接收與回覆
- **OpenAI API** - LLM 服務
- **MongoDB Atlas** - 資料庫儲存

## 專案結構

```
.
├── pages/
│   ├── api/
│   │   ├── webhook/
│   │   │   └── line.ts          # Line webhook 端點
│   │   ├── conversations/       # 對話管理 API
│   │   ├── stats/               # 統計資料 API
│   │   └── health.ts            # 健康檢查端點
│   ├── index.tsx                # 管理後台首頁
│   └── _app.tsx                 # Next.js App 設定
├── lib/
│   ├── db.ts                    # MongoDB 連線
│   ├── services/
│   │   ├── llmService.ts        # LLM 服務
│   │   ├── lineService.ts       # Line API 服務
│   │   └── conversationService.ts # 對話管理服務
│   └── prompts/
│       └── systemPrompt.ts      # AI 系統提示詞
├── models/
│   ├── User.ts                  # 使用者模型
│   ├── Conversation.ts          # 對話模型
│   └── Stats.ts                 # 統計模型
└── styles/
    └── globals.css              # 全域樣式
```

## 環境設定

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境變數設定

複製 `.env.example` 並建立 `.env` 檔案：

```bash
cp .env.example .env
```

填入以下環境變數：

```env
# Line Bot Configuration
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
LINE_CHANNEL_SECRET=your_line_channel_secret

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linebot?retryWrites=true&w=majority

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Line Bot 設定

1. 前往 [Line Developers](https://developers.line.biz/)
2. 建立新的 Provider 和 Channel
3. 取得 Channel Access Token 和 Channel Secret
4. 設定 Webhook URL：`https://your-domain.com/api/webhook/line`
5. 啟用 Webhook

### 4. MongoDB Atlas 設定

1. 前往 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 建立免費叢集
3. 建立資料庫使用者
4. 設定 IP 白名單（或允許所有 IP）
5. 取得連線字串

### 5. OpenAI API 設定

1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 建立 API Key
3. 確保帳戶有足夠的配額

## 本地開發

```bash
# 開發模式
npm run dev

# 建置
npm run build

# 生產模式
npm start

# Lint 檢查
npm run lint

# 格式化程式碼
npm run format
```

應用程式將在 `http://localhost:3000` 啟動。

## 部署至 Vercel

### 1. 準備專案

確保所有檔案都已提交到 Git：

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. 部署到 Vercel

1. 前往 [Vercel](https://vercel.com/)
2. 匯入你的 Git 專案
3. 設定環境變數（在 Vercel 專案設定中）
4. 部署

### 3. 設定 Line Webhook

部署完成後，在 Line Developers Console 中設定 Webhook URL：

```
https://your-project.vercel.app/api/webhook/line
```

### 4. 驗證部署

- 訪問 `https://your-project.vercel.app` 查看管理後台
- 訪問 `https://your-project.vercel.app/api/health` 檢查服務狀態
- 在 Line 中發送訊息測試 Bot

## API 端點

### Webhook
- `POST /api/webhook/line` - Line webhook 接收端點

### 對話管理
- `GET /api/conversations` - 取得對話列表
  - Query parameters: `lineUserId`, `status`, `startDate`, `endDate`, `limit`, `skip`
- `GET /api/conversations/[id]` - 取得單一對話詳情
- `DELETE /api/conversations/[id]` - 結束對話

### 統計資料
- `GET /api/stats` - 取得統計資訊

### 健康檢查
- `GET /api/health` - 服務健康狀態檢查

## 功能說明

### 對話流程

1. 使用者發送訊息到 Line Bot
2. Webhook 接收訊息並驗證簽章
3. 系統取得或建立使用者與對話
4. 將使用者訊息儲存到資料庫
5. 取得最近 10 則訊息作為上下文
6. 呼叫 LLM 產生回應（或使用降級回應）
7. 儲存 AI 回應並回覆使用者

### 錯誤處理

系統具備完善的錯誤處理機制：

- **LLM 配額不足**：顯示友善訊息，使用預設回應
- **速率限制**：提示使用者稍後再試
- **網路錯誤**：自動重試或使用降級回應
- **資料庫錯誤**：記錄錯誤並回覆預設訊息

### 降級機制

當 LLM 服務不可用時，系統會：

1. 偵測關鍵字（你好、幫助等）
2. 提供預設回應腳本
3. 記錄錯誤到統計資料
4. 繼續提供基本服務

## 開發建議

### 擴展功能

1. **多平台支援**：可擴展至 Messenger、Discord 等平台
2. **進階篩選**：後台可加入更多篩選條件
3. **使用者分析**：顯示使用者行為分析圖表
4. **回應客製化**：後台可調整 AI 人設與回覆規則
5. **批次作業**：支援批次刪除對話

### 效能優化

1. **快取機制**：對常用查詢加入快取
2. **分頁優化**：實作游標分頁
3. **訊息壓縮**：對長訊息進行壓縮儲存

## 授權

MIT License

## 聯絡方式

如有問題或建議，歡迎提出 Issue 或 Pull Request。

