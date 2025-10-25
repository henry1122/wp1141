# 健行路線記錄應用 - 架構說明

## 整體架構

```
健行路線記錄應用
├── 前端 (React + TypeScript + Vite)
│   ├── 使用者介面
│   ├── 地圖顯示與互動
│   ├── 路線管理
│   └── 認證系統
└── 後端 (Node.js + Express + TypeScript)
    ├── RESTful API
    ├── 資料庫 (SQLite)
    ├── JWT 認證
    └── Google Maps 整合
```

## 技術棧

### 前端
- **React 18** - 使用者介面框架
- **TypeScript** - 型別安全
- **Vite** - 建置工具
- **Material-UI** - UI 元件庫
- **React Router** - 路由管理
- **React Query** - 資料獲取與快取
- **React Hook Form** - 表單處理
- **Yup** - 表單驗證
- **Google Maps JavaScript API** - 地圖功能

### 後端
- **Node.js** - 執行環境
- **Express** - Web 框架
- **TypeScript** - 型別安全
- **SQLite** - 資料庫
- **JWT** - 身份驗證
- **bcryptjs** - 密碼雜湊
- **express-validator** - 輸入驗證
- **Google Maps Geocoding API** - 地址轉座標

## 資料庫設計

### Users 表
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Trails 表
```sql
CREATE TABLE trails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard', 'expert')) NOT NULL,
  distance REAL NOT NULL,
  duration INTEGER NOT NULL,
  elevation_gain REAL DEFAULT 0,
  coordinates TEXT NOT NULL, -- JSON 格式的座標陣列
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  tags TEXT DEFAULT '[]', -- JSON 格式的標籤陣列
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

## API 設計

### 認證端點
- `POST /api/auth/register` - 使用者註冊
- `POST /api/auth/login` - 使用者登入
- `GET /api/auth/profile` - 取得使用者資料

### 路線端點
- `GET /api/trails` - 取得路線列表 (支援分頁、篩選、搜尋)
- `GET /api/trails/:id` - 取得特定路線
- `POST /api/trails` - 建立新路線 (需要認證)
- `PUT /api/trails/:id` - 更新路線 (需要認證，僅限作者)
- `DELETE /api/trails/:id` - 刪除路線 (需要認證，僅限作者)

## 安全機制

### 身份驗證
- JWT Token 認證
- Token 過期時間：24 小時
- 自動登出機制

### 密碼安全
- bcrypt 雜湊演算法
- 鹽值輪數：10
- 密碼強度要求

### 輸入驗證
- 前後端雙重驗證
- 使用 express-validator 和 Yup
- SQL 注入防護

### CORS 設定
- 僅允許指定網域
- 支援憑證傳遞

## 前端架構

### 元件結構
```
src/
├── components/          # 可重用元件
│   └── Navbar.tsx      # 導航列
├── pages/              # 頁面元件
│   ├── Home.tsx        # 首頁
│   ├── Login.tsx       # 登入頁
│   ├── Register.tsx    # 註冊頁
│   ├── Trails.tsx      # 路線列表
│   ├── TrailDetail.tsx # 路線詳情
│   ├── CreateTrail.tsx # 建立路線
│   ├── EditTrail.tsx   # 編輯路線
│   └── Profile.tsx     # 個人資料
├── contexts/           # React Context
│   └── AuthContext.tsx # 認證狀態管理
├── services/           # API 服務
│   └── api.ts          # API 客戶端
├── types/              # TypeScript 型別定義
│   └── index.ts        # 共用型別
└── utils/              # 工具函數
```

### 狀態管理
- React Context 用於全域狀態 (認證)
- React Query 用於伺服器狀態管理
- React Hook Form 用於表單狀態

## 後端架構

### 目錄結構
```
backend/src/
├── controllers/        # 控制器
│   ├── authController.ts
│   └── trailController.ts
├── middleware/         # 中介軟體
│   ├── auth.ts         # 認證中介軟體
│   └── errorHandler.ts # 錯誤處理
├── routes/             # 路由定義
│   ├── auth.ts
│   └── trails.ts
├── types/              # TypeScript 型別定義
│   └── index.ts
├── utils/              # 工具函數
│   ├── initDatabase.ts # 資料庫初始化
│   └── seedDatabase.ts # 種子資料
└── index.ts            # 應用程式入口
```

### 中介軟體流程
1. **Helmet** - 安全標頭
2. **CORS** - 跨域請求處理
3. **Body Parser** - 請求體解析
4. **Authentication** - JWT 認證 (受保護路由)
5. **Validation** - 輸入驗證
6. **Controller** - 業務邏輯處理
7. **Error Handler** - 錯誤處理

## Google Maps 整合

### 前端整合
- Google Maps JavaScript API
- 地圖顯示與基本操作
- 路線繪製功能 (規劃中)
- 地點搜尋功能 (規劃中)

### 後端整合
- Google Maps Geocoding API
- 地址轉座標功能
- 地點驗證功能 (規劃中)

## 部署考量

### 開發環境
- 前端：Vite 開發伺服器 (port 5173)
- 後端：Express 開發伺服器 (port 3001)
- 資料庫：SQLite 檔案

### 生產環境建議
- 前端：靜態檔案託管 (Vercel, Netlify)
- 後端：Node.js 託管 (Heroku, Railway, AWS)
- 資料庫：PostgreSQL 或 MySQL
- 反向代理：Nginx
- CDN：靜態資源加速

## 效能優化

### 前端優化
- 程式碼分割 (Code Splitting)
- 圖片懶載入
- API 請求快取 (React Query)
- 元件記憶化 (React.memo)

### 後端優化
- 資料庫索引
- API 回應快取
- 請求限制 (Rate Limiting)
- 資料庫連線池

## 監控與日誌

### 錯誤監控
- 前端：錯誤邊界 (Error Boundary)
- 後端：統一錯誤處理中介軟體

### 日誌記錄
- 請求日誌
- 錯誤日誌
- 效能監控

## 未來擴展

### 功能擴展
- 路線評分與評論系統
- 社群功能 (追蹤、分享)
- 路線推薦演算法
- 離線地圖支援
- 路線匯入/匯出功能

### 技術擴展
- 即時通知 (WebSocket)
- 檔案上傳 (圖片、GPX)
- 搜尋優化 (Elasticsearch)
- 微服務架構
- Docker 容器化


