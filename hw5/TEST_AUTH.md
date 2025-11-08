# 認證功能測試指南

## ✅ 已實作的功能

### 1. OAuth 註冊與登入
- ✅ Google OAuth
- ✅ GitHub OAuth  
- ✅ Facebook OAuth

### 2. userID 註冊與登入
- ✅ 註冊時輸入 userID（3-20 字元，只能包含字母、數字、底線）
- ✅ 下次可以用 userID 登入（會自動使用對應的 OAuth provider）

### 3. 不同 OAuth providers 創建不同 userIDs
- ✅ 同一個人用不同 OAuth providers 會創建不同的 User 記錄
- ✅ 每個 User 可以有自己獨立的 userID
- ✅ 即使 email 相同，不同的 provider = 不同的用戶帳號

### 4. Session 管理
- ✅ 登入後創建 session（使用資料庫 session）
- ✅ Session 有效期：30 天
- ✅ 如果 session 還沒過期，可以直接登入（不需要重新 OAuth）

## 🧪 測試步驟

### 測試 1: Google OAuth 註冊與登入

1. **清除瀏覽器 cookies**

2. **訪問** `http://localhost:3000`

3. **點擊「Continue with Google」**

4. **完成 Google 登入**
   - 應該會自動跳轉到註冊頁面

5. **輸入 userID**（例如：`testuser1`）
   - 點擊「Continue」
   - 應該會自動跳轉到主頁面

6. **測試 session 持久性**
   - 關閉瀏覽器
   - 重新打開並訪問 `http://localhost:3000`
   - 應該直接進入主頁面（不需要重新登入）

### 測試 2: userID 登入

1. **登出**（點擊頭像 → Logout）

2. **在登入頁面點擊「Login with UserID」**

3. **輸入之前註冊的 userID**（例如：`testuser1`）

4. **點擊「Login」**
   - 應該會自動使用對應的 OAuth provider 登入
   - 完成後應該進入主頁面

### 測試 3: 不同 OAuth providers 創建不同 userIDs

1. **使用 Google 註冊**
   - userID: `google_user1`
   - 完成註冊

2. **登出**

3. **使用 GitHub 登入**（即使使用相同的 email）
   - 應該會創建新的用戶記錄
   - 註冊時可以設置不同的 userID: `github_user1`

4. **驗證**
   - 兩個 userID 都應該可以獨立登入
   - 它們是不同的用戶帳號

## 🔍 功能確認清單

- [ ] Google OAuth 可以註冊
- [ ] Google OAuth 可以登入
- [ ] 註冊時可以輸入 userID
- [ ] 註冊後可以進入主頁面
- [ ] 可以用 userID 登入
- [ ] Session 可以持久化（30 天內不需要重新登入）
- [ ] 不同 OAuth providers 創建不同的用戶帳號
- [ ] 不同 OAuth providers 可以使用不同的 userID

## ⚠️ 如果遇到問題

1. **無法進入註冊頁面**
   - 直接訪問：`http://localhost:3000/auth/register`

2. **註冊後無法進入主頁面**
   - 手動刷新頁面（F5）
   - 或直接訪問：`http://localhost:3000`

3. **Session 無法持久化**
   - 檢查資料庫連接
   - 確認 Session 表中有記錄

4. **userID 登入失敗**
   - 確認 userID 已正確註冊
   - 檢查資料庫中是否有對應的記錄

