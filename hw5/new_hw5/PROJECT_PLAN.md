# HW5 專案規劃文檔

## 📋 技術決策總結

### 已確認的技術選項
- **資料庫**: MongoDB (使用 Mongoose ODM)
- **UserID 規則**: 寬鬆規範 (2-30 字元，英數字+底線+連字號)
- **Session 策略**: JWT (NextAuth 預設)
- **UI 框架**: shadcn/ui + Tailwind CSS
- **狀態管理**: Zustand
- **圖片上傳**: Cloudinary
- **草稿儲存**: Database (MongoDB)
- **套件管理**: Yarn

---

## 🔑 需要的 API Keys 清單

### 1. OAuth Providers (NextAuth)

#### Google OAuth
- 申請步驟：
  1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
  2. 建立新專案或選擇現有專案
  3. 啟用 Google+ API
  4. 前往「憑證」→「建立憑證」→「OAuth 用戶端 ID」
  5. 設定授權重新導向 URI：`http://localhost:3000/api/auth/callback/google` (開發) 和 `https://your-domain.vercel.app/api/auth/callback/google` (生產)
- 需要的資訊：
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

#### GitHub OAuth
- 申請步驟：
  1. 前往 GitHub Settings → Developer settings → OAuth Apps
  2. 點擊「New OAuth App」
  3. 填入應用名稱、Homepage URL、Authorization callback URL
  4. Callback URL：`http://localhost:3000/api/auth/callback/github` (開發)
- 需要的資訊：
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`

#### Facebook OAuth
- 申請步驟：
  1. 前往 [Facebook Developers](https://developers.facebook.com/)
  2. 建立新應用
  3. 新增 Facebook 登入產品
  4. 設定有效的 OAuth 重新導向 URI：`http://localhost:3000/api/auth/callback/facebook`
- 需要的資訊：
  - `FACEBOOK_CLIENT_ID`
  - `FACEBOOK_CLIENT_SECRET`

### 2. Pusher (即時互動)
- 申請步驟：
  1. 前往 [Pusher](https://pusher.com/)
  2. 註冊帳號並建立新 Channels App
  3. 選擇 Cluster (建議選擇離你最近的，如 ap1, ap2, us2, eu 等)
  4. 取得 App credentials
- 需要的資訊：
  - `PUSHER_APP_ID`
  - `PUSHER_KEY`
  - `PUSHER_SECRET`
  - `PUSHER_CLUSTER`

### 3. Cloudinary (圖片上傳)
- 申請步驟：
  1. 前往 [Cloudinary](https://cloudinary.com/)
  2. 註冊免費帳號
  3. 在 Dashboard 取得 Cloud credentials
- 需要的資訊：
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

### 4. MongoDB Atlas
- 申請步驟：
  1. 前往 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. 註冊免費帳號
  3. 建立免費 Cluster (M0)
  4. 建立 Database User (username/password)
  5. 設定 Network Access (允許從任何 IP 或指定 IP)
  6. 取得 Connection String
- 需要的資訊：
  - `MONGODB_URI` (格式：`mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)

### 5. NextAuth Secret
- 產生方式：
  ```bash
  openssl rand -base64 32
  ```
- 需要的資訊：
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` (開發：`http://localhost:3000`，生產：你的 Vercel URL)

---

## 📁 專案結構設計

```
hw5/
├── app/
│   ├── (auth)/                    # 認證相關頁面組
│   │   ├── login/
│   │   │   └── page.tsx          # 登入頁面
│   │   └── register/
│   │       └── page.tsx          # 註冊頁面（OAuth 後設定 UserID）
│   │
│   ├── (main)/                    # 主要功能頁面組（需要認證）
│   │   ├── layout.tsx            # 主 Layout（包含側邊欄）
│   │   ├── page.tsx              # Home 頁面（文章列表）
│   │   │
│   │   ├── profile/
│   │   │   ├── [userID]/
│   │   │   │   └── page.tsx      # 個人資料頁面（可編輯/只讀）
│   │   │   └── edit/
│   │   │       └── page.tsx      # 編輯個人資料
│   │   │
│   │   ├── post/
│   │   │   ├── [postId]/
│   │   │   │   └── page.tsx      # 單篇文章詳情（含遞迴評論）
│   │   │   └── drafts/
│   │   │       └── page.tsx      # 草稿列表
│   │   │
│   │   ├── hashtag/
│   │   │   └── [tag]/
│   │   │       └── page.tsx      # Hashtag 文章列表（進階）
│   │   │
│   │   ├── explore/
│   │   │   └── page.tsx          # 探索頁面（進階）
│   │   │
│   │   └── notifications/
│   │       └── page.tsx          # 通知頁面（進階）
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # NextAuth 處理
│   │   │
│   │   ├── users/
│   │   │   ├── route.ts          # GET: 取得使用者 / POST: 更新使用者
│   │   │   ├── [userID]/
│   │   │   │   └── route.ts      # GET: 取得特定使用者
│   │   │   └── register/
│   │   │       └── route.ts      # POST: 註冊 UserID
│   │   │
│   │   ├── posts/
│   │   │   ├── route.ts          # GET: 取得文章列表 / POST: 建立文章
│   │   │   ├── [postId]/
│   │   │   │   ├── route.ts      # GET: 取得單篇文章 / DELETE: 刪除文章
│   │   │   │   └── comments/
│   │   │   │       └── route.ts  # GET: 取得評論 / POST: 新增評論
│   │   │   └── drafts/
│   │   │       └── route.ts      # GET: 取得草稿 / POST: 儲存草稿
│   │   │
│   │   ├── likes/
│   │   │   └── route.ts          # POST: 切換按讚 / DELETE: 取消按讚
│   │   │
│   │   ├── reposts/
│   │   │   └── route.ts          # POST: 轉發文章
│   │   │
│   │   ├── follows/
│   │   │   └── route.ts          # POST: 追蹤 / DELETE: 取消追蹤
│   │   │
│   │   ├── notifications/
│   │   │   └── route.ts          # GET: 取得通知 / PUT: 標記已讀（進階）
│   │   │
│   │   └── pusher/
│   │       └── auth/
│   │           └── route.ts      # Pusher 認證端點
│   │
│   ├── layout.tsx                 # Root Layout
│   ├── page.tsx                   # 根頁面（重導向到登入或 Home）
│   └── globals.css                # 全域樣式
│
├── components/
│   ├── ui/                        # shadcn/ui 組件
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── avatar.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx           # 主選單側邊欄
│   │   ├── Header.tsx            # 頂部導航（可選）
│   │   └── MainLayout.tsx        # 主要佈局容器
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx         # 登入表單
│   │   ├── RegisterForm.tsx      # UserID 註冊表單
│   │   └── OAuthButtons.tsx      # OAuth 登入按鈕組
│   │
│   ├── posts/
│   │   ├── PostCard.tsx          # 文章卡片
│   │   ├── PostForm.tsx          # 發文表單（Modal）
│   │   ├── PostInlineForm.tsx    # Inline 發文表單
│   │   ├── PostList.tsx          # 文章列表
│   │   ├── PostDetail.tsx        # 文章詳情（含遞迴評論）
│   │   ├── PostActions.tsx       # 文章操作（讚/轉發/留言）
│   │   ├── CommentList.tsx       # 評論列表
│   │   └── CommentCard.tsx       # 評論卡片
│   │
│   ├── profile/
│   │   ├── ProfileHeader.tsx     # 個人資料頭部（頭像/背景/資訊）
│   │   ├── ProfileEditModal.tsx  # 編輯個人資料 Modal
│   │   ├── ProfileStats.tsx      # 統計資訊（文章數/追蹤數）
│   │   ├── ProfileTabs.tsx       # Posts/Likes 切換
│   │   └── FollowButton.tsx      # 追蹤按鈕
│   │
│   ├── notifications/
│   │   ├── NotificationList.tsx  # 通知列表（進階）
│   │   └── NotificationItem.tsx  # 通知項目（進階）
│   │
│   └── shared/
│       ├── Avatar.tsx            # 頭像組件
│       ├── UserLink.tsx          # 使用者連結（可點擊進入 profile）
│       ├── HashtagLink.tsx       # Hashtag 連結
│       ├── MentionLink.tsx       # Mention 連結
│       ├── TimeAgo.tsx           # 相對時間顯示
│       ├── CharacterCounter.tsx  # 字元計數器
│       ├── LinkParser.tsx        # 連結解析與顯示
│       └── NewPostNotice.tsx     # 新文章通知（進階）
│
├── lib/
│   ├── db/
│   │   ├── mongoose.ts           # Mongoose 連線設定
│   │   └── models/
│   │       ├── User.ts           # User Model
│   │       ├── Post.ts           # Post Model
│   │       ├── Like.ts           # Like Model
│   │       ├── Repost.ts         # Repost Model
│   │       ├── Follow.ts         # Follow Model
│   │       ├── Draft.ts          # Draft Model
│   │       ├── Notification.ts   # Notification Model（進階）
│   │       └── Session.ts        # Session Model（如果需要）
│   │
│   ├── auth/
│   │   └── config.ts             # NextAuth 配置
│   │
│   ├── pusher/
│   │   ├── server.ts             # Pusher 伺服器端實例
│   │   └── client.ts             # Pusher 客戶端實例
│   │
│   ├── cloudinary/
│   │   └── upload.ts             # Cloudinary 上傳工具
│   │
│   ├── utils/
│   │   ├── text-processing.ts    # 文字處理（hashtag/mention/link 解析）
│   │   ├── character-count.ts    # 字元計算邏輯
│   │   ├── validation.ts         # 驗證工具（UserID 規則等）
│   │   └── format.ts             # 格式化工具（時間、數字等）
│   │
│   └── hooks/
│       ├── usePusher.ts          # Pusher Hook
│       ├── usePosts.ts           # 文章相關 Hook
│       ├── useUser.ts            # 使用者相關 Hook
│       └── useAuth.ts            # 認證相關 Hook
│
├── store/                         # Zustand Stores
│   ├── authStore.ts              # 認證狀態
│   ├── postStore.ts              # 文章狀態
│   ├── notificationStore.ts      # 通知狀態（進階）
│   └── uiStore.ts                # UI 狀態（Modal、Sidebar 等）
│
├── types/
│   ├── index.ts                  # 共用型別定義
│   ├── user.ts                   # User 相關型別
│   ├── post.ts                   # Post 相關型別
│   └── api.ts                    # API 回應型別
│
├── public/
│   ├── icons/                    # 自訂圖示
│   └── images/                   # 靜態圖片
│
├── .env.local                    # 本地環境變數（不提交到 Git）
├── .env.example                  # 環境變數範例
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── yarn.lock
└── README.md
```

---

## 🗄️ MongoDB Schema 設計

### User Model
```typescript
{
  _id: ObjectId,
  userID: string (unique, required, index),        // 2-30 字元，英數字+底線+連字號
  provider: string (required),                     // 'google' | 'github' | 'facebook'
  providerAccountId: string (required),            // OAuth provider 的帳號 ID
  name: string (required),                         // 從 OAuth 取得
  email: string (optional),                        // 從 OAuth 取得
  avatar: string (optional),                       // 頭像 URL
  bio: string (optional, max: 160),                // 個人簡介
  backgroundImage: string (optional),              // 背景圖 URL
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```typescript
{
  _id: ObjectId,
  authorId: ObjectId (ref: 'User', required, index),
  content: string (required, max: 280),            // 文章內容
  hashtags: [string] (index),                      // Hashtag 陣列
  mentions: [string] (index),                      // 被 mention 的 userIDs
  links: [{                                        // 連結陣列
    url: string,
    displayLength: number (default: 23)            // 顯示長度（固定 23）
  }],
  parentPostId: ObjectId (ref: 'Post', optional),  // 父文章（用於評論）
  isRepost: boolean (default: false),              // 是否為轉發
  originalPostId: ObjectId (ref: 'Post', optional), // 原始文章（轉發時使用）
  createdAt: Date (index, default: Date.now),
  updatedAt: Date
}
```

### Like Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, index),
  postId: ObjectId (ref: 'Post', required, index),
  createdAt: Date (default: Date.now),
  // 複合索引: { userId: 1, postId: 1 } (unique)
}
```

### Repost Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, index),
  postId: ObjectId (ref: 'Post', required, index),
  createdAt: Date (default: Date.now),
  // 複合索引: { userId: 1, postId: 1 } (unique)
}
```

### Follow Model
```typescript
{
  _id: ObjectId,
  followerId: ObjectId (ref: 'User', required, index),  // 追蹤者
  followingId: ObjectId (ref: 'User', required, index), // 被追蹤者
  createdAt: Date (default: Date.now),
  // 複合索引: { followerId: 1, followingId: 1 } (unique)
}
```

### Draft Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, index),
  content: string (required),
  savedAt: Date (default: Date.now, index)
}
```

### Notification Model (進階功能)
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, index), // 接收通知的使用者
  type: string (required),                         // 'like' | 'repost' | 'reply' | 'follow'
  actorId: ObjectId (ref: 'User', required),       // 發起動作的使用者
  postId: ObjectId (ref: 'Post', optional),        // 相關文章（如果是 like/repost/reply）
  read: boolean (default: false, index),
  createdAt: Date (default: Date.now, index)
}
```

---

## 🔄 核心功能流程設計

### 1. 註冊與登入流程

#### 初次註冊流程
1. 使用者點擊 OAuth 按鈕（Google/GitHub/Facebook）
2. 導向 OAuth Provider 授權頁面
3. 授權後回調到 `/api/auth/callback/[provider]`
4. NextAuth 處理 OAuth 回應，建立或找到帳號
5. 檢查是否已有 `userID`
   - 如果沒有 → 導向 `/register` 頁面，要求設定 `userID`
   - 如果有 → 導向 `/` (Home)
6. 在 `/register` 頁面輸入 `userID`（驗證格式：2-30 字元，英數字+底線+連字號）
7. 檢查 `userID` 是否已被使用（同一 provider）
8. 建立 User 記錄，設定 `userID`
9. 建立 Session，導向 Home

#### 再次登入流程
1. 使用者點擊 OAuth 按鈕
2. NextAuth 檢查 Session 是否有效
   - 如果有效 → 直接登入
   - 如果無效 → 執行 OAuth 流程
3. OAuth 後檢查是否有對應的 User 記錄
4. 建立 Session，導向 Home

#### UserID 規則驗證
- **格式**: 2-30 字元
- **允許字元**: 英文字母（大小寫）、數字、底線（_）、連字號（-）
- **不允許**: 空格、特殊符號、純數字
- **唯一性**: 同一 provider 下必須唯一（不同 provider 可以相同）

### 2. 發文流程

#### 發文表單功能
1. 點擊「Post」按鈕開啟 Modal
2. 輸入文字內容（即時字元計數）
3. 自動解析：
   - Hashtag (#hashtag) → 不計入字元數
   - Mention (@userID) → 不計入字元數
   - 連結 (URL) → 固定計算 23 字元
4. 字元限制：280 字元（不含 hashtag/mention）
5. 點擊「Post」按鈕：
   - 驗證字元數
   - 解析並儲存 hashtags、mentions、links
   - 建立 Post 記錄
   - 透過 Pusher 推送新文章事件
   - 關閉 Modal，更新文章列表
6. 點擊「x」按鈕：
   - 如果有內容 → 詢問：Save Draft / Discard
   - Save Draft → 儲存到 Drafts
   - Discard → 清除內容，關閉 Modal

#### 字元計算邏輯
```typescript
// 範例
const text = "Hello @user1 check this #hashtag and https://example.com/long-url";
// 計算方式：
// - "Hello " = 6 字元
// - "@user1 " = 0 字元（mention）
// - "check this " = 11 字元
// - "#hashtag " = 0 字元（hashtag）
// - "and " = 4 字元
// - "https://example.com/long-url" = 23 字元（連結固定）
// 總計：6 + 0 + 11 + 0 + 4 + 23 = 44 字元
```

### 3. 文章列表流程

#### Home 頁面
1. 顯示兩個切換選項：「All」和「Following」
2. 「All」：顯示所有文章（不含自己已刪除的）
3. 「Following」：顯示追蹤者的文章和轉發
4. 排序：最新到最舊（按 createdAt DESC）
5. 每篇文章顯示：
   - 作者頭像、姓名、userID
   - 發文時間（相對時間：幾秒/分鐘/小時/天前，或絕對日期）
   - 文章內容（含連結、hashtag、mention 的渲染）
   - 操作按鈕：留言數、轉發數、按讚數
   - 如果是自己的文章 → 顯示「…」選單，可刪除

#### 文章互動
1. **點讚**：
   - 點擊愛心 → 切換按讚狀態
   - 透過 Pusher 即時更新讚數
   - 更新 UI（愛心顏色變化）

2. **轉發**：
   - 點擊轉發按鈕 → 建立 Repost 記錄
   - 文章會出現在轉發者的時間軸
   - 透過 Pusher 即時更新轉發數

3. **留言**：
   - 點擊留言數 → 展開留言區或導向文章詳情頁
   - 在文章詳情頁可以輸入留言
   - 留言也是 Post（parentPostId 指向原文章）

4. **點擊 userID**：
   - 導向 `/profile/[userID]` 頁面（只讀模式）

5. **點擊 hashtag**：
   - 導向 `/hashtag/[tag]` 頁面（進階功能）

### 4. 個人資料頁面流程

#### 編輯模式（自己的資料）
1. 在主選單點擊「Profile」→ 進入 `/profile/[自己的userID]`
2. 顯示：
   - 背景圖（可編輯）
   - 頭像（可編輯）
   - 姓名（從 OAuth 取得，不可編輯）
   - userID（不可編輯）
   - 簡介（可編輯）
   - 追蹤數/被追蹤數
   - 兩個 Tab：「Posts」和「Likes」
3. 點擊「Edit Profile」按鈕 → 開啟編輯 Modal
4. 可編輯欄位：
   - 背景圖（上傳到 Cloudinary）
   - 頭像（上傳到 Cloudinary）
   - 簡介（最多 160 字元）

#### 只讀模式（他人的資料）
1. 點擊文章中的 userID → 進入 `/profile/[userID]`
2. 顯示相同資訊，但：
   - 「Edit Profile」按鈕改為「Follow」/「Following」
   - 只顯示「Posts」Tab（不顯示「Likes」）
   - 所有欄位不可編輯

### 5. 遞迴評論流程

#### 文章詳情頁
1. 點擊文章 → 進入 `/post/[postId]`
2. 顯示：
   - 頂部：左箭頭 + 「Post」按鈕（回到上一層）
   - 文章內容（與列表中的相同）
   - 所有留言（第一層）
3. 點擊留言 → 進入 `/post/[commentId]`
4. 顯示：
   - 頂部：左箭頭 + 「Post」按鈕（回到上一層）
   - 該留言內容（像文章一樣顯示）
   - 該留言的所有回覆（下一層）
5. 可以繼續點擊回覆，進入更深層級

### 6. Pusher 即時更新流程

#### 設定
1. 伺服器端：在 API Route 中推送事件
2. 客戶端：使用 Pusher Hook 訂閱頻道

#### 事件類型
1. **新文章** (`new-post`):
   - 頻道：`posts`
   - 事件：當有人發文時推送
   - 資料：{ postId, authorId, content }

2. **按讚** (`like-updated`):
   - 頻道：`post-${postId}`
   - 事件：當有人按讚/取消按讚時推送
   - 資料：{ postId, likesCount, isLiked }

3. **轉發** (`repost-updated`):
   - 頻道：`post-${postId}`
   - 事件：當有人轉發時推送
   - 資料：{ postId, repostsCount }

4. **留言** (`comment-added`):
   - 頻道：`post-${postId}`
   - 事件：當有人留言時推送
   - 資料：{ postId, commentId, commentsCount }

#### UI 更新策略
- 使用 Zustand Store 管理即時狀態
- 當收到 Pusher 事件時，更新 Store
- 組件自動重新渲染

---

## 🎨 UI/UX 設計規範

### 側邊欄設計
- **位置**: 左側固定
- **寬度**: 約 250px
- **內容**:
  - 頂部：應用 Logo/Icon（可點擊回到 Home）
  - Home（圖示 + 文字）
  - Profile（圖示 + 文字）
  - Post（明亮底色按鈕，圖示 + 文字）
  - Explore（進階，圖示 + 文字）
  - Notifications（進階，圖示 + 文字 + 未讀數徽章）
  - 底部：使用者資訊區塊
    - 頭像（圓形）
    - 姓名
    - userID
    - 點擊後顯示 Dropdown：Logout 選項

### 顏色與樣式
- **Post 按鈕**: 明亮底色（如藍色）
- **其他按鈕**: 與背景相同，hover 時微亮 highlight
- **愛心**: 未按讚（灰色），已按讚（紅色）
- **連結**: 藍色，hover 時底線

### 響應式設計
- 桌面版：側邊欄 + 中間內容區
- 手機版（進階）：側邊欄改為底部導航欄或抽屜式選單

---

## 📝 API 端點設計

### RESTful API 規範

#### 使用者相關
- `GET /api/users` - 取得當前使用者資訊
- `GET /api/users/[userID]` - 取得特定使用者資訊
- `PUT /api/users` - 更新當前使用者資訊
- `POST /api/users/register` - 註冊 UserID

#### 文章相關
- `GET /api/posts` - 取得文章列表
  - Query params: `type` (all/following), `skip`, `limit`
- `GET /api/posts/[postId]` - 取得單篇文章
- `POST /api/posts` - 建立文章
- `DELETE /api/posts/[postId]` - 刪除文章（僅限自己的）
- `GET /api/posts/[postId]/comments` - 取得評論列表
- `POST /api/posts/[postId]/comments` - 新增評論

#### 互動相關
- `POST /api/likes` - 切換按讚
  - Body: `{ postId }`
- `DELETE /api/likes` - 取消按讚
  - Body: `{ postId }`
- `POST /api/reposts` - 轉發文章
  - Body: `{ postId }`
- `DELETE /api/reposts` - 取消轉發
  - Body: `{ postId }`

#### 追蹤相關
- `POST /api/follows` - 追蹤使用者
  - Body: `{ userID }`
- `DELETE /api/follows` - 取消追蹤
  - Body: `{ userID }`
- `GET /api/follows/[userID]/followers` - 取得追蹤者列表
- `GET /api/follows/[userID]/following` - 取得追蹤中列表

#### 草稿相關
- `GET /api/posts/drafts` - 取得草稿列表
- `POST /api/posts/drafts` - 儲存草稿
  - Body: `{ content }`
- `DELETE /api/posts/drafts/[draftId]` - 刪除草稿

#### 通知相關（進階）
- `GET /api/notifications` - 取得通知列表
- `PUT /api/notifications/[notificationId]/read` - 標記為已讀
- `PUT /api/notifications/read-all` - 標記全部為已讀

---

## 🔐 安全性考量

### 1. 認證與授權
- 所有 API Route 都需要驗證 Session
- 使用 NextAuth 的 `getServerSession` 檢查認證狀態
- 刪除/編輯操作需要驗證所有權

### 2. 輸入驗證
- UserID: 正則表達式驗證（2-30 字元，英數字+底線+連字號）
- 文章內容: 長度限制、XSS 防護（使用 DOMPurify 或類似工具）
- 圖片上傳: 驗證檔案類型、大小限制

### 3. 資料庫安全
- 使用 Mongoose 的 Schema 驗證
- 防止 NoSQL Injection（使用參數化查詢）
- 敏感資訊不直接儲存（如密碼）

### 4. API 安全
- Rate Limiting（使用 `@upstash/ratelimit` 或類似工具）
- CORS 設定
- 環境變數保護（`.env.local` 不提交到 Git）

---

## 🚀 部署流程

### Vercel 部署步驟（極致簡化的 deployment）

**高層級概述**：
- 讓一個 GitHub repo 綁定一個 Vercel 專案
- Local 安裝 Vercel CLI，或者使用雲端 Vercel Dashboard

#### 步驟 1: 安裝 Vercel CLI（建議）

```bash
yarn global add vercel
```

#### 步驟 2: Vercel 登入/註冊

```bash
vercel login
```

執行後會顯示：
```
Vercel CLI 48.8.0
Visit vercel.com/device and enter WQSP-KCTG
Press [ENTER] to open the browser
Waiting for authentication...
```

**操作**：
- 按 Enter，瀏覽器會自動開啟
- 選擇 OAuth 登入（Google/GitHub/GitLab）

#### 步驟 3: 初始化和部署專案

在專案根目錄執行：

```bash
vercel
```

**按照提示操作**：
1. 選擇「Set up and deploy」（設定並部署）
2. 選擇專案名稱（或使用預設）
3. 選擇目錄（使用當前目錄 `.`）

> **提示**：原則上就選 default 就對了

#### 步驟 4: 設定環境變數

可以在 **Vercel Dashboard 設定**，或使用 **CLI**：

**方法 A：使用 Vercel Dashboard（推薦）**
1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇你的專案
3. 進入 Settings → Environment Variables
4. 添加以下環境變數：

**需要設定的環境變數**：
- **MongoDB**
  - `MONGODB_URI`

- **NextAuth**
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`（生產環境 URL，例如：`https://your-app.vercel.app`）

- **Pusher**
  - `PUSHER_APP_ID`
  - `PUSHER_KEY`
  - `PUSHER_SECRET`
  - `PUSHER_CLUSTER`
  - `NEXT_PUBLIC_PUSHER_KEY`（必須與 `PUSHER_KEY` 相同）
  - `NEXT_PUBLIC_PUSHER_CLUSTER`（必須與 `PUSHER_CLUSTER` 相同）

- **Facebook/GitHub/Google OAuth**
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `FACEBOOK_CLIENT_ID`
  - `FACEBOOK_CLIENT_SECRET`

- **Cloudinary**
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

**方法 B：使用 CLI**
```bash
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
# ... 依此類推
```

#### 步驟 5: 推送程式碼到 GitHub（好習慣）

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### 步驟 6: 將 Vercel 專案綁定 GitHub Repo

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊「Add New Project」
3. 選擇「Import Git Repository」
4. 授權 Vercel 存取您的 GitHub repo
5. 選擇你的 repository
6. 點擊「Import」

**或** 如果已經透過 `vercel` CLI 建立專案：
1. 前往專案設定頁面
2. 進入 Settings → Git
3. 連接 GitHub repository

#### 步驟 7: 部署到生產環境

```bash
vercel --prod
```

或直接推送程式碼到 GitHub，Vercel 會自動部署：
```bash
git push
```

#### 步驟 8: 設定 OAuth Callback URLs

在每個 OAuth Provider 中新增生產環境的 Callback URL：

**Google OAuth**:
- 前往 [Google Cloud Console](https://console.cloud.google.com/)
- 編輯 OAuth 用戶端
- 新增授權重新導向 URI：`https://your-app.vercel.app/api/auth/callback/google`

**GitHub OAuth**:
- 前往 GitHub Settings → Developer settings → OAuth Apps
- 編輯 OAuth App
- 新增 Authorization callback URL：`https://your-app.vercel.app/api/auth/callback/github`

**Facebook OAuth**:
- 前往 [Facebook Developers](https://developers.facebook.com/)
- 編輯應用設定
- 新增有效的 OAuth 重新導向 URI：`https://your-app.vercel.app/api/auth/callback/facebook`

#### 步驟 9: MongoDB Atlas 設定

1. 登入 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 進入 Network Access
3. 確保允許 Vercel 的 IP，或暫時設定為允許所有 IP（`0.0.0.0/0`）用於開發
4. 確認 Database Access 中的使用者有適當權限

#### 步驟 10: 驗證部署

1. 訪問你的 Vercel URL（例如：`https://your-app.vercel.app`）
2. 測試註冊/登入流程
3. 測試所有核心功能
4. 檢查 Pusher 即時更新是否正常
5. 檢查錯誤日誌（Vercel Dashboard → Functions）

### 日後部署

**自動部署**：
- 日後如有重新改 code，你只要 `git push` 就會自動重新部署！

**手動部署**：
```bash
vercel --prod
```

### 注意事項

1. **環境變數**：
   - 確保所有環境變數都已正確設定
   - `NEXTAUTH_URL` 必須設為生產環境 URL
   - `NEXT_PUBLIC_*` 變數會暴露給客戶端

2. **OAuth Callback URLs**：
   - 必須同時設定開發環境（localhost）和生產環境（Vercel URL）

3. **MongoDB Atlas**：
   - 確保 Network Access 允許從任何 IP 連接（或至少允許 Vercel 的 IP）

4. **Build 錯誤**：
   - 如果部署失敗，檢查 Vercel Dashboard 的 Build Logs
   - 確認所有依賴都已正確安裝
   - 確認 TypeScript 編譯沒有錯誤

---

## 📦 套件清單

### 核心套件
- `next` (^14.0.0) - Next.js 框架
- `react` (^18.0.0) - React
- `react-dom` (^18.0.0) - React DOM
- `typescript` - TypeScript 支援

### 認證
- `next-auth` (^5.0.0) - NextAuth.js v5

### 資料庫
- `mongoose` - MongoDB ODM

### 即時互動
- `pusher` - Pusher 客戶端
- `pusher-js` - Pusher JavaScript SDK

### 狀態管理
- `zustand` - Zustand 狀態管理

### UI 框架
- `tailwindcss` - Tailwind CSS
- `@radix-ui/react-*` - shadcn/ui 依賴
- `class-variance-authority` - 樣式變體工具
- `clsx` - className 工具
- `tailwind-merge` - Tailwind 類別合併

### 表單處理
- `react-hook-form` - 表單處理
- `zod` - Schema 驗證

### 工具函式
- `date-fns` - 日期處理
- `dompurify` - XSS 防護
- `isomorphic-dompurify` - SSR 安全的 DOMPurify

### 圖片處理
- `cloudinary` - Cloudinary SDK
- `next-cloudinary` - Next.js Cloudinary 整合（可選）

### 其他工具
- `@types/node` - Node.js 型別
- `@types/react` - React 型別
- `eslint` - 程式碼檢查
- `eslint-config-next` - Next.js ESLint 配置

---

## 🧪 測試策略（可選）

### 單元測試
- 字元計算邏輯
- UserID 驗證
- 文字解析（hashtag/mention/link）

### 整合測試
- API 端點
- 資料庫操作

### E2E 測試（可選）
- 登入流程
- 發文流程
- 互動流程

---

## 📋 開發檢查清單

### Phase 1: 基礎設置 ✅
- [ ] Next.js 專案初始化
- [ ] 安裝所有依賴套件
- [ ] 設定 Tailwind CSS
- [ ] 設定 TypeScript
- [ ] 設定 ESLint
- [ ] 建立專案結構

### Phase 2: 資料庫設置 ✅
- [ ] MongoDB Atlas 設定
- [ ] Mongoose 連線設定
- [ ] 建立所有 Model Schema
- [ ] 測試資料庫連線

### Phase 3: 認證系統 ✅
- [ ] NextAuth 配置
- [ ] Google OAuth 設定
- [ ] GitHub OAuth 設定
- [ ] Facebook OAuth 設定
- [ ] UserID 註冊流程
- [ ] Session 管理測試

### Phase 4: 核心 UI ✅
- [ ] 側邊欄組件
- [ ] 主 Layout
- [ ] 登入/註冊頁面
- [ ] 基本樣式設定

### Phase 5: 個人資料功能 ✅
- [ ] 個人資料頁面（編輯模式）
- [ ] 個人資料頁面（只讀模式）
- [ ] 編輯個人資料 Modal
- [ ] 圖片上傳（Cloudinary）
- [ ] 追蹤/取消追蹤功能

### Phase 6: 發文功能 ✅
- [ ] 發文 Modal
- [ ] Inline 發文表單
- [ ] 字元計算邏輯
- [ ] 文字解析（hashtag/mention/link）
- [ ] 草稿功能

### Phase 7: 文章列表 ✅
- [ ] Home 頁面（All/Following）
- [ ] 文章卡片組件
- [ ] 文章操作（讚/轉發/留言）
- [ ] 相對時間顯示
- [ ] 文章詳情頁（遞迴評論）

### Phase 8: 即時更新 ✅
- [ ] Pusher 設定
- [ ] 即時按讚更新
- [ ] 即時轉發更新
- [ ] 即時留言更新

### Phase 9: 進階功能 ✅
- [ ] 通知系統
- [ ] Explore 頁面
- [ ] Hashtag 頁面
- [ ] New Post Notice
- [ ] 多媒體支援（進階）

### Phase 10: 部署 ✅
- [ ] 環境變數設定
- [ ] Vercel 部署
- [ ] OAuth Callback URL 設定
- [ ] 功能測試
- [ ] 效能優化

---

## 🎯 補充說明

### 遺漏功能補充
1. **錯誤處理**: 所有 API 都需要適當的錯誤處理和回應
2. **載入狀態**: 所有非同步操作都需要載入指示
3. **空狀態**: 列表為空時顯示友善的提示
4. **分頁/無限滾動**: 文章列表需要分頁或無限滾動
5. **圖片優化**: 使用 Next.js Image 組件優化圖片
6. **SEO**: 適當的 meta tags（雖然是 SPA，但可改善）

### 可以改進的地方
1. **快取策略**: 使用 React Query 或 SWR 進行資料快取
2. **離線支援**: Service Worker（PWA）
3. **搜尋功能**: 搜尋使用者、文章、hashtag
4. **過濾功能**: 按時間、熱門度排序
5. **多語言支援**: i18n
6. **深色模式**: 主題切換

---

## 📞 下一步

當您準備好開始開發時，請確認：
1. ✅ 所有 API Keys 都已申請並準備好
2. ✅ 環境變數檔案（`.env.local`）已建立
3. ✅ MongoDB Atlas 已設定完成
4. ✅ 開發環境已準備好（Node.js, Yarn）

然後我們就可以開始建立專案了！

