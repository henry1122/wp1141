# Line AI Education Assistant 📚  
Next.js + Line Messaging API + MongoDB

---

## 🔗 Demo 連結（評分請優先看這裡）

- **管理後台（Vercel 部署）**：  
  `https://wp1141-kappa.vercel.app`

- **Line Chatbot（加入好友 / 掃描 QRcode）**：  
  - 加入連結：  
    `https://line.me/R/ti/p/%40111jpjkx`  
  - QRcode 圖片：  
    `![Line Chatbot QRCode](./Line%20chatbot.png)`
     檔案為 Line chatbot.png
---

## 專案簡介

這是一個整合 **Line Messaging API** 的「AI 教學與筆記助理」，使用 **Next.js + TypeScript** 開發，  
協助學生與老師在 Line 上完成：課程重點整理、學習計畫規劃、小測驗與對話紀錄管理，並提供一個網頁管理後台方便檢視所有對話與統計資料。

---

## 如何使用

### 在 Line 上與 Bot 互動

1. 使用手機掃描上方 QRcode 或點擊加入好友連結。  
2. **第一次加入時**，Bot 會自我介紹，並在訊息下方顯示 Quick Reply 按鈕：
   - `學習計畫`（傳送文字「學習計畫」）
   - `整理課程重點`（傳送「重點整理」）
   - `小測驗`（傳送「測驗」）
   - `使用說明`（傳送「幫助」）
   - `結束對話`（傳送「結束對話」）
3. 日常使用時可以：
   - 直接把 **上課內容 / 投影片文字 / 逐字稿** 貼給 Bot，請它幫忙整理成：
     - 重點摘要
     - 待辦事項 / 練習題
     - 結論與提醒  
   - 輸入關鍵字：
     - `學習計畫`：引導你輸入目標、可用時間、章節，幫你規劃讀書計畫。
     - `重點整理`：提示你把課程內容貼上，Bot 會用統一格式整理。
     - `測驗 / 小考 / quiz`：說明科目與主題後，Bot 會嘗試出幾題練習題（在 LLM 可用時）。
     - `幫助`：顯示可以怎麼使用這個教學助理。
     - `結束 / 結束對話 / end / stop`：將目前這段對話標記為已結束，下次訊息會開啟新對話。

### 管理後台（老師 / 管理者）

1. 開啟：`https://wp1141-kappa.vercel.app`  
2. 首頁功能：
   - 上方卡片顯示：
     - 總使用者數、總對話數（含進行中數量）、總訊息數
     - 今日 LLM 呼叫 / 錯誤次數與成功率
     - 今日使用者 / 今日對話 / 今日訊息
   - 下方列表：
     - 依 **使用者 ID 搜尋**
     - 依 **狀態（進行中 / 已結束）篩選**
     - 顯示訊息數、建立時間、最近一句訊息摘要
   - 點擊一筆對話可開啟「對話詳情」Modal：
     - 左右氣泡顯示「使用者 / 小智(AI)」的訊息與時間
     - 可在後台直接按「結束對話」將該 session 結束
3. 介面支援：
   - **中 / 英文 UI 切換**
   - **背景主題切換（淺色 / 深色漸層）**

---

## 主要功能整理

### 🤖 Line 教學助理（Chatbot）

- **課程筆記整理**：將長段文字整理為「重點 / 待辦 / 結論」，方便複習。
- **學習計畫協助**：根據使用者目標與可用時間，引導建立讀書計畫。
- **小測驗模式**：依科目與主題產生練習題（LLM 可用時），並提供簡短解析。
- **對話脈絡維持**：使用最近 10 則訊息作為上下文，讓回覆更連貫。
- **降級腳本**：當 OpenAI API 無法使用或額度不足時，自動改用預設教學說明與指引，不會直接壞掉。
- **結束對話指令**：使用者輸入「結束 / 結束對話 / end / stop」會將該對話標記為已結束，並提示可重新開始新對話。

### 📊 管理後台

- **對話列表與詳情**
  - 依使用者 ID 搜尋、依狀態篩選（進行中 / 已結束）。
  - 點擊可檢視完整訊息氣泡、時間戳與雙方身分。
  - 後台可直接將對話標記為已結束。
- **統計資訊**
  - 整體：總使用者數、總對話數、進行中對話數、總訊息數。
  - 今日：今日使用者數（今天有互動過的不同使用者）、今日對話數與訊息數。
  - LLM：今日呼叫次數、錯誤次數、成功率（以錯誤 / 呼叫計算）。
- **即時更新**
  - 每 5 秒自動重新抓取 `/api/conversations` 與 `/api/stats`，不用手動重整即可看到最新狀態。

### ⚙️ 技術與實作重點

- **前端**：Next.js（TypeScript）、React Hooks、Tailwind CSS。
- **後端**：Next.js API Routes（Webhook、Conversations、Stats、Health）。
- **資料庫**：MongoDB Atlas + Mongoose，儲存 `User`、`Conversation`、`Stats`。
- **LLM 服務**：OpenAI Chat Completions（具錯誤分類與降級處理）。
- **Line**：`@line/bot-sdk` 整合 Messaging API，支援 Webhook 驗證與 Quick Reply。

---

## 開發與部署（簡要）

### 本地開發

```bash
npm install
npm run dev
```

應用程式預設在 `http://localhost:3000` 執行。

### 主要環境變數（節錄）

```env
LINE_CHANNEL_ACCESS_TOKEN=...
LINE_CHANNEL_SECRET=...
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-3.5-turbo
MONGODB_URI=...
NEXT_PUBLIC_APP_URL=https://wp1141-kappa.vercel.app
NODE_ENV=production
```

> 更完整的部署步驟請見 `DEPLOYMENT.md`（若不需要可自行刪除）。

---

## 授權

本專案僅用於課程作業與教學示範用途，不建議直接用於正式商業環境。
