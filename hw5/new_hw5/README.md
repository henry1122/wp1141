# HW5 - Social Media Application

一個類似 Twitter/X 的社交媒體應用程式，使用 Next.js 14、NextAuth、MongoDB、Pusher 和 Cloudinary 建立。

## 功能特色

- 🔐 OAuth 登入（Google、GitHub、Facebook）
- 📝 發文功能（280 字元限制，支援 Hashtag、Mention、連結）
- ❤️ 按讚、轉發、留言功能
- 👤 個人資料編輯與瀏覽
- 🔔 即時通知（Pusher）
- 📸 圖片上傳（Cloudinary）

## 技術棧

- **框架**: Next.js 14 (App Router)
- **認證**: NextAuth.js v5
- **資料庫**: MongoDB (Mongoose)
- **即時**: Pusher
- **圖片**: Cloudinary
- **UI**: Tailwind CSS + shadcn/ui
- **狀態管理**: Zustand
- **表單**: React Hook Form + Zod

## 開始使用

### 1. 安裝依賴

```bash
yarn install
```

### 2. 設定環境變數

複製 `.env.example` 並建立 `.env.local`，填入所有必要的 API Keys。

詳細說明請參考 `API_KEYS_SETUP.md`。

### 3. 執行開發伺服器

```bash
yarn dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用程式。

## 專案結構

```
hw5/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認證相關頁面
│   ├── (main)/            # 主要功能頁面
│   └── api/               # API Routes
├── components/            # React 組件
│   ├── ui/               # shadcn/ui 組件
│   ├── layout/           # 佈局組件
│   ├── posts/            # 文章相關組件
│   └── profile/          # 個人資料組件
├── lib/                  # 工具函式庫
│   ├── auth/            # NextAuth 配置
│   ├── db/              # 資料庫 Models
│   ├── pusher/          # Pusher 設定
│   └── utils/           # 工具函式
├── types/               # TypeScript 型別定義
└── store/               # Zustand Stores
```

## 開發檢查清單

- [x] 專案初始化
- [x] 資料庫 Models
- [x] NextAuth 配置
- [x] 基礎 UI 組件
- [x] 認證頁面
- [x] 側邊欄
- [ ] 發文功能
- [ ] 文章列表
- [ ] 個人資料頁面
- [ ] Pusher 即時更新
- [ ] 圖片上傳
- [ ] 進階功能

## 部署

專案設計為部署到 Vercel。請參考 `PROJECT_PLAN.md` 中的部署說明。

## 授權

MIT License

