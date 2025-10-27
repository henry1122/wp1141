# 健行路線記錄應用

一個專為台灣健行愛好者設計的全端應用程式，提供路線探索、個人記錄追蹤、成就系統等功能。

## 功能特色

### 主要功能
- 路線探索：發現台灣各地精彩健行路線
- 個人記錄：記錄您的健行歷程與心得
- 成就系統：挑戰不同難度的健行目標
- 天氣資訊：即時天氣預報確保安全健行
- 百岳介紹：完整的台灣百岳列表與分級分類
- 無障礙設定：支援字體大小、高對比度、語言切換等

### 台灣百岳與著名山峰
- 完整100座山峰列表，從最高到最低排序
- 分級分類：入門級、中級、高級、專家級
- 詳細資訊：海拔、難度、地區等
- 包含玉山、雪山、中央尖山等著名山峰

## 技術架構

### 前端技術
- React 18 with TypeScript
- Material-UI for UI components
- React Router for navigation
- React Hook Form with Yup validation
- Axios for API calls
- Vite for build tooling

### 後端技術
- Node.js with Express
- TypeScript for type safety
- SQLite database
- JWT authentication
- bcrypt for password hashing
- Express Validator for input validation

### 開發工具
- Concurrently for running multiple processes
- Nodemon for backend development
- Hot Module Replacement for frontend

## 專案結構

```
wp1141/hw4/
├── backend/                 # 後端應用程式
│   ├── src/
│   │   ├── controllers/    # API 控制器
│   │   ├── middleware/     # 中間件
│   │   ├── routes/         # 路由定義
│   │   ├── types/          # TypeScript 類型定義
│   │   └── utils/          # 工具函數
│   ├── database.sqlite     # SQLite 資料庫
│   └── package.json
├── frontend/               # 前端應用程式
│   ├── src/
│   │   ├── components/     # React 組件
│   │   ├── contexts/       # React Context
│   │   ├── pages/          # 頁面組件
│   │   ├── services/       # API 服務
│   │   └── types/          # TypeScript 類型定義
│   └── package.json
└── package.json             # 根目錄配置
```

## 安裝與設定

### 系統需求
- Node.js 16.0 或更高版本
- npm 或 yarn 套件管理器

### 快速開始

1. 克隆專案
```bash
git clone <repository-url>
cd wp1141/hw4
```

2. 安裝所有依賴
```bash
npm run install:all
```

3. 初始化資料庫
```bash
cd backend
npm run db:init
```

4. 種子資料庫
```bash
cd backend
npm run db:seed
```

5. 啟動開發伺服器
```bash
npm run dev
```

### 手動安裝

如果需要分別安裝前端和後端：

1. 安裝後端依賴
```bash
cd backend
npm install
```

2. 安裝前端依賴
```bash
cd frontend
npm install
```

3. 回到根目錄
```bash
cd ..
```

## 開發指令

### 根目錄指令
- `npm run dev` - 同時啟動前端和後端開發伺服器
- `npm run install:all` - 安裝所有依賴
- `npm run server:dev` - 只啟動後端開發伺服器
- `npm run client:dev` - 只啟動前端開發伺服器

### 後端指令（需要在 backend 目錄執行）
- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建置生產版本
- `npm run start` - 啟動生產伺服器
- `npm run db:init` - 初始化資料庫
- `npm run db:seed` - 種子資料庫

### 前端指令（需要在 frontend 目錄執行）
- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建置生產版本
- `npm run preview` - 預覽生產版本
- `npm run lint` - 程式碼檢查

## 環境變數設定

### 後端環境變數
在 `backend/.env` 檔案中設定：
```
PORT=3001
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
DATABASE_PATH=./database.sqlite
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
FRONTEND_URL=http://localhost:5173
```

### 前端環境變數
在 `frontend/.env` 檔案中設定：
```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_APP_NAME=健行路線記錄應用
VITE_APP_VERSION=1.0.0
```

## API 端點

### 認證端點
- POST `/api/auth/register` - 用戶註冊
- POST `/api/auth/login` - 用戶登入
- GET `/api/auth/profile` - 獲取用戶資料

### 路線端點
- GET `/api/trails` - 獲取所有路線
- GET `/api/trails/:id` - 獲取特定路線
- POST `/api/trails` - 建立新路線（需要認證）
- PUT `/api/trails/:id` - 更新路線（需要認證）
- DELETE `/api/trails/:id` - 刪除路線（需要認證）

### 統計端點
- GET `/api/stats/user` - 用戶統計
- GET `/api/stats/public` - 公開統計
- GET `/api/stats/trail/:id` - 路線統計

### 天氣端點
- GET `/api/weather/trails` - 路線天氣資訊
- GET `/api/weather/trails/:id` - 特定路線天氣
- GET `/api/weather/alerts` - 天氣警報

## 資料庫結構

### 用戶表 (users)
- id: 主鍵
- username: 用戶名
- email: 電子郵件
- password_hash: 密碼雜湊
- created_at: 建立時間
- updated_at: 更新時間

### 路線表 (trails)
- id: 主鍵
- name: 路線名稱
- description: 路線描述
- difficulty: 難度等級
- distance: 距離（公里）
- duration: 時間（分鐘）
- elevation_gain: 海拔高度（公尺）
- coordinates: 座標（JSON）
- start_location: 起點
- end_location: 終點
- tags: 標籤（JSON）
- rating: 評分
- review_count: 評論數量
- user_id: 建立者ID
- created_at: 建立時間
- updated_at: 更新時間

## 功能說明

### 首頁
- 歡迎頁面與應用程式介紹
- 主要功能展示
- 台灣百岳與著名山峰介紹
- 無障礙設定面板

### 路線探索
- 路線列表與搜尋
- 篩選功能（難度、距離、地區）
- 路線詳細資訊
- 地圖顯示

### 建立路線
- 表單驗證
- 路線資訊輸入
- 標籤系統
- 座標設定

### 個人資料
- 用戶資訊管理
- 健行記錄統計
- 成就系統

### 無障礙功能
- 字體大小調整
- 高對比度模式
- 語言切換（中文/英文）
- 背景顏色選擇
- 背景圖片設定

## 部署說明

### 生產環境建置

1. 建置前端（在 frontend 目錄執行）
```bash
cd frontend
npm run build
```

2. 建置後端（在 backend 目錄執行）
```bash
cd backend
npm run build
```

3. 啟動生產伺服器
```bash
npm run start
```

### 環境變數設定
確保在生產環境中設定正確的環境變數，特別是：
- JWT_SECRET
- DATABASE_PATH
- GOOGLE_MAPS_API_KEY
- FRONTEND_URL

## 故障排除

### 常見問題

1. 資料庫連接問題
   - 檢查 SQLite 檔案是否存在
   - 確認資料庫路徑設定正確

2. 認證問題
   - 檢查 JWT_SECRET 是否設定
   - 確認 token 是否過期

3. API 連接問題
   - 檢查前後端是否都在運行
   - 確認 API 基礎 URL 設定正確

4. 建置問題
   - 清除 node_modules 重新安裝
   - 檢查 Node.js 版本是否符合要求

### 開發工具
- 使用瀏覽器開發者工具檢查網路請求
- 查看後端控制台日誌
- 檢查資料庫內容

## 貢獻指南

1. Fork 專案
2. 建立功能分支
3. 提交變更
4. 推送到分支
5. 建立 Pull Request

## 授權

此專案採用 MIT 授權條款。

## 聯絡資訊

如有問題或建議，請聯絡開發團隊。

## 更新日誌

### 版本 1.0.0
- 初始版本發布
- 基本路線管理功能
- 用戶認證系統
- 無障礙功能
- 台灣百岳介紹
- 響應式設計