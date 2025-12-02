## 補習班管理系統 – 開發 / 啟動說明

這個專案是一個簡單的「補習班網站＋管理系統」，包含：

- **前端**：React + TypeScript + Vite + Material UI  
- **後端**：Node.js + Express + TypeScript + SQLite  
- **身分驗證**：Email + 密碼登入、bcrypt 雜湊、JWT 存在 HttpOnly Cookie  
- **資源 API**：`/students`（學生資料）、`/classes`（課表／班級資料），皆有權限控管  

> 目前專案已具備：本地登入、RESTful API、學生與課表 CRUD、基本錯誤處理。  
> 後續可在前端加入 Google Maps 與更多 UI 優化（課表排版、多語系文案等）。

---

## 1. 專案結構

- `backend/`：Node.js + Express + TypeScript 後端 API
  - `src/index.ts`：後端入口
  - `src/db.ts`：SQLite 資料庫連線與資料表建立
  - `src/routes/auth.ts`：註冊 / 登入 / 登出 / 取得目前使用者
  - `src/routes/students.ts`：學生資料 CRUD（需登入）
  - `src/routes/classes.ts`：課表 / 班級 CRUD（需登入）
- `frontend/`：React + Vite + TypeScript 前端
  - `src/main.tsx`：前端入口
  - `src/theme.ts`：MUI 主題設定
  - `src/providers/LanguageProvider.tsx`：中 / 英語系 Context
  - （你可以在 `src/` 底下新增頁面與元件，串接上述 API）

---

## 2. 環境需求

- **Node.js**：建議 v18 以上
- **npm**：隨 Node 一起安裝
- 作業系統：Windows / macOS / Linux 皆可（你目前是 Windows 10）

---

## 3. 後端設定與啟動（backend）

1. 在終端機 / PowerShell 切到專案根目錄：

   ```bash
   cd C:\Users\User\Desktop\wp_final
   ```

2. 進入 `backend` 資料夾並安裝套件：

   ```bash
   cd backend
   npm install
   ```

3. 在 `backend` 資料夾底下建立一個 `.env` 檔案，內容如下（可直接複製）：  

   ```env
   PORT=4000
   JWT_SECRET=please_change_me_to_a_secure_random_string
   DB_PATH=database.sqlite
   CLIENT_ORIGIN=http://localhost:5173
   ```

   - **PORT**：後端啟動的 Port（預設 4000）
   - **JWT_SECRET**：JWT 用的密鑰，正式環境請改成長且難猜的字串
   - **DB_PATH**：SQLite 檔案名稱
   - **CLIENT_ORIGIN**：前端網站位址（本機開發時為 Vite 的 `http://localhost:5173`）

4. 以開發模式啟動後端：

   ```bash
   npm run dev
   ```

5. 確認後端是否啟動成功：在瀏覽器開啟  
   `http://localhost:4000/health`  
   應該會看到類似：

   ```json
   { "status": "ok" }
   ```

---

## 4. 前端設定與啟動（frontend）

1. 開新的終端機視窗（不要關掉剛剛的 backend），切回專案根目錄：

   ```bash
   cd C:\Users\User\Desktop\wp_final
   ```

2. 進入 `frontend` 資料夾並安裝套件：

   ```bash
   cd frontend
   npm install
   ```

3. 啟動前端開發伺服器：

   ```bash
   npm run dev
   ```

4. 瀏覽器開啟 Vite 顯示的網址（預設）：  
   `http://localhost:5173`

   之後你可以在 `frontend/src/` 新增頁面（例如登入頁、學生列表、課表頁、Google Maps 頁面），透過 Axios 呼叫後端 API。

---

## 5. 驗證機制與資料流程說明

- **註冊 / 登入** 路由：`/auth/register`、`/auth/login`
- 帳號欄位：`email`（必填）、`password`（必填，至少 6 碼）、`name`（選填）
- **密碼儲存**：使用 `bcryptjs` 雜湊，不會以明碼存入資料庫
- **登入之後**：
  - 後端會產生一組 JWT，並存在 HttpOnly Cookie（名稱為 `token`）
  - 後端的受保護路由（如 `/students`、`/classes`）會檢查這個 JWT  
- **權限控管**：
  - 未登入：無法存取 `/students` 與 `/classes` API，會回傳 `401 Unauthorized`
  - 已登入：只能操作「自己的」學生與課表資料（以 `user_id` 關聯）

錯誤回傳示例：

- 400/422：輸入格式錯誤（例如 email 不是正確格式、password 太短）
- 401：未登入或 token 無效
- 403：保留給未來 finer-grained 權限（目前主要用 401）
- 404：資源不存在
- 500：伺服器內部錯誤

---

## 6. 主要 API 一覽（後端）

### 6.1 Auth

- `POST /auth/register`

  Request JSON：

  ```json
  {
    "email": "test@example.com",
    "password": "123456",
    "name": "王小明"
  }
  ```

  Response（201）：

  ```json
  {
    "id": 1,
    "email": "test@example.com",
    "name": "王小明"
  }
  ```

- `POST /auth/login`

  Request JSON：

  ```json
  {
    "email": "test@example.com",
    "password": "123456"
  }
  ```

  成功會在 HttpOnly Cookie 中設定 `token`，回傳使用者資訊。

- `POST /auth/logout`

  清除 Cookie，回傳 204。

- `GET /auth/me`

  需登入，回傳目前使用者資訊。

---

### 6.2 學生資料 `/students`（需登入）

- `GET /students`  
  取得目前登入使用者的所有學生列表。

- `POST /students`

  ```json
  {
    "name": "王大明",
    "grade": "國三",
    "phone": "0912-345-678",
    "note": "數學加強班"
  }
  ```

- `PUT /students/:id`  
  更新指定學生。

- `DELETE /students/:id`  
  刪除指定學生。

---

### 6.3 課表 / 班級 `/classes`（需登入）

- `GET /classes`  
  按照 `weekday`、`start_time` 排序的課表列表。

- `POST /classes`

  ```json
  {
    "title": "國三數學班",
    "teacher": "林老師",
    "room": "305",
    "weekday": 1,
    "start_time": "18:30",
    "end_time": "20:30"
  }
  ```

  - `weekday`: 1 = 週一, ..., 7 = 週日
  - `start_time` / `end_time`: `HH:MM` 格式

- `PUT /classes/:id`：更新班級
- `DELETE /classes/:id`：刪除班級

---

## 7. 前端串接建議（範例流程）

> 這部分是你在 `frontend/src/` 裡可以實作的方向，以下只是建議流程。

- **登入頁**：
  - 使用 MUI 的 `TextField` 和 `Button`，收集 email / password
  - 使用 Axios `POST http://localhost:4000/auth/login`（注意要帶上 `withCredentials: true` 讓 Cookie 帶入）
- **學生列表頁**：
  - 進入頁面時呼叫 `GET /students` 顯示表格
  - 提供新增 / 編輯 / 刪除按鈕，分別呼叫 `POST`、`PUT`、`DELETE`
- **課表頁**：
  - 呼叫 `GET /classes`，依 `weekday` 排版成一週課表
  - 可以用 MUI 的 `Grid` 或 `Table` 做出較好看的 timetable UI
- **語言切換**：
  - 使用 `LanguageProvider` 中的 `lang` / `toggleLang`，依 `lang` 顯示中文或英文標題與文案

---

## 8. Google Maps API（方向說明）

目前後端與前端骨架已完成，你可以在前端新增一個「校區位置」頁面，例如：

- 安裝 Google Maps React 套件（例如 `@react-google-maps/api`）
- 在 `frontend` 建一個 `.env` 檔放 `VITE_GOOGLE_MAPS_API_KEY=你的Key`
- 建立一個地圖元件，顯示補習班地址的標記

等你需要時，我可以再幫你把 Google Maps 的元件和程式碼補齊。

---

## 9. 本機完整測試流程（快速版）

1. **啟動後端**
   - `cd backend`
   - 建立 `.env`
   - `npm install`
   - `npm run dev`
2. **啟動前端**
   - 另開一個終端機
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. **測試 API（可用 Postman / Thunder Client / curl）**
   - `POST http://localhost:4000/auth/register`
   - `POST http://localhost:4000/auth/login`
   - `GET  http://localhost:4000/students`（需已登入）
   - `GET  http://localhost:4000/classes`（需已登入）
4. **前端頁面**
   - 在瀏覽器開 `http://localhost:5173`
   - 實作你想要的畫面（登入、學生管理、課表、美化 UI、Google Maps 等）

如果你在任何步驟遇到錯誤（指令、Port 佔用、套件安裝問題等等），把錯誤訊息貼出來，我可以再幫你 debug。  


