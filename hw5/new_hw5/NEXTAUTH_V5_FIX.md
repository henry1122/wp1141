# NextAuth v5 修復說明

## 問題
NextAuth v5 (Auth.js) 的 API 已經改變，不再支援 `getServerSession`。

## 修復內容

### 1. 更新 `lib/auth/config.ts`
- 使用 `NextAuth(authOptions)` 創建 `auth` 函數
- 導出 `handlers`, `auth`, `signIn`, `signOut`
- 保留 `authOptions` 導出以供向後兼容

### 2. 更新所有 API Routes
- 將 `import { getServerSession } from "next-auth"` 改為 `import { auth } from "@/lib/auth/config"`
- 將 `await getServerSession(authOptions)` 改為 `await auth()`

### 3. 更新 Server Components
- `app/page.tsx`: 使用 `auth()` 替代 `getServerSession(authOptions)`
- `app/(main)/layout.tsx`: 使用 `auth()` 替代 `getServerSession(authOptions)`

### 4. 更新 Auth Route
- `app/api/auth/[...nextauth]/route.ts`: 使用導出的 `handlers` 替代 `NextAuth(authOptions)`

## 已更新的檔案

- ✅ `lib/auth/config.ts`
- ✅ `app/api/auth/[...nextauth]/route.ts`
- ✅ `app/page.tsx`
- ✅ `app/(main)/layout.tsx`
- ✅ `app/api/posts/route.ts`
- ✅ `app/api/users/register/route.ts`
- ✅ 所有其他 API routes（透過批量替換）

## 測試結果

- ✅ 編譯成功
- ✅ 開發伺服器啟動成功
- ✅ 無 Linter 錯誤

## 注意事項

1. NextAuth v5 的 session 返回格式可能略有不同
2. 確保所有環境變數都已正確設置
3. 如果遇到 session 相關問題，檢查 `auth()` 返回的物件結構

