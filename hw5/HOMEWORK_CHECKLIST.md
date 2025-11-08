# 作業功能檢查清單

根據作業要求，以下是所有功能的實現狀態：

## ✅ 註冊與登入

- [x] **OAuth 登入**：Google、GitHub、Facebook 三種 OAuth 提供者
- [x] **UserID 註冊**：註冊時輸入 userID（3-20 字元，字母、數字、底線）
- [x] **不同 OAuth providers 創建不同 userID**：同一個人使用不同 OAuth providers 會註冊成不同的 userIDs
- [x] **UserID 登入**：可以使用 userID 直接登入
- [x] **Session 管理**：登入後有 session，30 天過期，未過期可直接登入

## ✅ 主選單（側邊欄）

- [x] **Home**：回到 X 的 home
- [x] **Profile**：進入個人首頁
- [x] **Post**：發表貼文（按鈕為明亮底色）
- [x] **用戶資訊**：顯示頭貼、姓名、UserID
- [x] **Logout**：點擊用戶資訊後 pop up "logout" 選項
- [x] **Logo**：最上面有主選單 icon（My-X）
- [x] **Hover 效果**：其他功能按鈕與背景相同，mouse hover 時會微亮 highlight

## ✅ 編輯/瀏覽個人首頁

### 自己的個人首頁（可編輯）
- [x] **姓名**：從 OAuth 取得
- [x] **Number of posts**：顯示貼文數量
- [x] **回到 Home 的左箭頭**
- [x] **背景圖**：可上傳和編輯
- [x] **Edit Profile 按鈕**：在背景圖右下方，點擊後跳出視窗編輯個人資料
- [x] **大頭貼**：中間對齊背景圖底部
- [x] **姓名**：再次顯示
- [x] **@userID**：顯示註冊時的 userID
- [x] **Brief description**：Bio，可編輯
- [x] **Following/Followers 數量**
- [x] **Posts 標籤**：顯示所有 posts 和 reposts
- [x] **Likes 標籤**：顯示所有按過愛心的文章（僅自己可見）

### 其他用戶的個人首頁（只讀）
- [x] **只讀模式**：無法編輯
- [x] **Follow/Following 按鈕**：取代 "Edit Profile"
- [x] **Posts 標籤**：顯示該用戶的所有 posts 和 reposts
- [x] **沒有 Likes 標籤**：看不到別人的 likes

### 從貼文進入個人首頁
- [x] **點擊 userID**：在 PO 文中點擊 userID，會顯示該使用者之個人資料（READ only）

## ✅ 發表文章

- [x] **Post 按鈕**：在主選單按下 "Post"，會 pop up modal
- [x] **Post 按鈕**：按下右下 Post 則發表文章
- [x] **取消按鈕**：按下左上 x 則放棄 PO 文（會跳出小視窗詢問是否放棄）
  - [x] **Save**：存成 Draft
  - [x] **Discard**：真的放棄（無法 undo）
- [x] **Drafts 按鈕**：顯示之前放棄之草稿列表
- [x] **發文規範**：
  - [x] 文章長度為 280 字元限制
  - [x] 連結不管長度皆佔用 23 字元
  - [x] #HashTag 不算在字元數裡頭，且無上限
  - [x] @mention 不算在字元數裡頭，且無上限
  - [x] 文字輸入能夠辨識連結並建立 hyperlink

## ✅ 閱讀文章

### Home Feed
- [x] **All/Following 標籤**：最上面的選項
  - [x] **All**：顯示所有文章
  - [x] **Following**：顯示所 follow 的人所 post 和 repost 的文章
- [x] **排序**：從最新到最舊
- [x] **@mention 連結**：點擊後進入該 mentionSomeone 的個人 profile
- [x] **Inline 發表 post**：最上面可以 inline 發表 post，點擊輸入文字匡後展開類似 Post modal 的 layout

### 文章顯示
- [x] **作者頭像**
- [x] **發文時間**：幾秒以前、幾分鐘以前、幾小時以前、幾天前、幾月幾日、或幾年幾月幾日
- [x] **內容完整呈現**
- [x] **互動數**：留言數、轉發數、按愛心數（從左至右）
- [x] **互動功能**：
  - [x] 點擊留言數可以留言
  - [x] 點擊轉發數可以轉發（只支援 repost，不支援 quote）
  - [x] 點擊按愛心數可以給愛心（toggling on/off，愛心為 on 時應要有顏色上的區別）
- [x] **刪除貼文**：如果是自己的發文，在右上方的 "…" 打開選項，可以有 "Delete" 刪除文章的選項（Note: re-post 的文章不能刪除）

### Recursive Comments
- [x] **點擊文章**：中間欄會 "route" 到該篇文章，顯示該篇文章以及他所有的留言
- [x] **點擊留言**：中間欄會 route 到該則留言，該留言會像是一篇文章一樣顯示在最上面，底下則為留給該留言的留言
- [x] **繼續點選**：點選下方留言則會在 route 進入下一層畫面
- [x] **回到上一層**：最上方會有一個左箭頭 + Post，讓你可以點擊後回到上一層文章列表/文章/留言

## ✅ 即時互動

- [x] **Pusher 整合**：使用 Pusher 技術來達成互動的即時通知
- [x] **按讚即時更新**：使用兩個不同帳號分別登入時，其中一邊按讚了某一則貼文，另外一個帳號會即時看到該貼文的讚數增加了
- [x] **留言即時更新**：留言也會即時更新

## ✅ UI/UX 設計

- [x] **右邊欄省略**：右邊欄可以整個省略

## ✅ Deploy 到 Vercel

- [x] **Vercel 配置**：已準備好部署到 Vercel
- [x] **環境變數**：需要設置環境變數（見 SETUP.md）

## 📝 技術要求

- [x] **Next.js**：全端框架
- [x] **NextAuth**：OAuth in Next.js
- [x] **MongoDB**：資料庫（使用 Prisma ORM）
- [x] **RESTful APIs**：所有 API 都是 RESTful
- [x] **Pusher**：互動套件
- [x] **Vercel**：部署平台

## 🐛 已知問題與修復

### OAuth 登入後重定向
- **問題**：OAuth 登入後沒有自動跳轉到註冊頁面
- **修復**：
  1. 改進了 `lib/auth.ts` 中的 `redirect` callback，正確處理 `callbackUrl` 參數
  2. 改進了 `pages/auth/signin.tsx` 中的 session 檢查邏輯
  3. 確保 `callbackUrl: '/auth/register'` 正確傳遞

### 字符計數
- **問題**：字符計數邏輯需要確保 URL、hashtag、mention 正確處理
- **修復**：改進了 `lib/utils.ts` 中的 `calculatePostLength` 函數，確保：
  - URL 先被移除，然後每個 URL 算 23 字元
  - Hashtag 和 mention 被移除，不算在字元數裡

## 🧪 測試建議

1. **OAuth 登入測試**：
   - 清除瀏覽器 cookies
   - 使用 Google 登入
   - 確認自動跳轉到註冊頁面
   - 輸入 userID 並註冊
   - 確認自動跳轉到主頁面

2. **不同 OAuth providers 測試**：
   - 使用同一個 email 但不同的 OAuth providers（例如：Google 和 GitHub）
   - 確認創建了不同的 userID

3. **字符計數測試**：
   - 輸入包含 URL、hashtag、mention 的貼文
   - 確認字符計數正確（URL 算 23 字元，hashtag 和 mention 不算）

4. **即時更新測試**：
   - 使用兩個不同的帳號登入
   - 其中一個按讚或留言
   - 確認另一個帳號即時看到更新

5. **Recursive Comments 測試**：
   - 點擊一篇文章
   - 確認顯示所有留言
   - 點擊一則留言
   - 確認進入下一層，顯示該留言和其子留言
   - 使用左箭頭回到上一層

## 📚 相關文檔

- `SETUP.md`：設置指南
- `DEPLOYMENT.md`：部署指南
- `FEATURES.md`：功能清單
- `FIX_REGISTRATION.md`：註冊問題修復指南
- `FIX_OAUTH.md`：OAuth 問題修復指南

