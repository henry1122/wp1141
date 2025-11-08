# Vercel 部署後檢查清單

## ✅ 環境變數已設定完成

恭喜！您已經完成了環境變數的設定。現在讓我們確認一切是否正常運作。

---

## 🔍 步驟 1: 確認已重新部署

**重要：** 設定環境變數後，必須重新部署才能生效！

### 檢查方法：

1. 前往 Vercel Dashboard → 您的專案 → **Deployments** 標籤
2. 查看最新的部署：
   - 狀態應該是 **Ready**（綠色）
   - 部署時間應該是剛才（設定環境變數之後）

### 如果還沒有重新部署：

1. 點擊最新部署右側的 **⋯**（三個點）
2. 選擇 **Redeploy**
3. 等待部署完成（通常需要 1-3 分鐘）

---

## 🔍 步驟 2: 檢查構建日誌

1. 點擊最新的部署
2. 查看 **Build Logs** 標籤
3. 確認沒有以下錯誤：
   - ❌ `DATABASE_URL is not set`
   - ❌ `NEXTAUTH_URL is not set`
   - ❌ `Prisma Client` 相關錯誤

### 應該看到的成功訊息：

- ✅ `Prisma Client generated successfully`
- ✅ `Compiled successfully`
- ✅ `Build completed`

---

## 🔍 步驟 3: 測試應用程式

### 訪問您的網站：

1. 打開瀏覽器
2. 訪問：`https://wp1141-kappa.vercel.app`
3. **應該不再出現 404 錯誤**

### 預期行為：

- ✅ 如果未登入：應該看到登入頁面或自動跳轉到 `/auth/signin`
- ✅ 如果已登入：應該看到主頁面或跳轉到相應頁面

---

## 🔍 步驟 4: 測試 Google OAuth 登入

### 重要：更新 Google Cloud Console 設定

如果您還沒有設定，現在需要更新 Google OAuth 的 redirect URI：

1. **訪問 Google Cloud Console**
   - https://console.cloud.google.com/
   - 選擇您的專案

2. **前往 OAuth 憑證設定**
   - **APIs & Services** → **Credentials**
   - 找到您的 OAuth 2.0 Client ID，點擊編輯

3. **添加 Authorized JavaScript origins**
   ```
   https://wp1141-kappa.vercel.app
   ```

4. **添加 Authorized redirect URIs**
   ```
   https://wp1141-kappa.vercel.app/api/auth/callback/google
   ```

5. **儲存設定**

### 測試登入：

1. 訪問您的 Vercel 網址
2. 點擊「Continue with Google」或「使用 Google 登入」
3. 應該能正常完成 OAuth 流程
4. 登入後應該跳轉到註冊頁面或主頁面

---

## ✅ 完整檢查清單

請確認以下項目：

### 環境變數設定
- [ ] `NEXTAUTH_URL` 已設定為 `https://wp1141-kappa.vercel.app`
- [ ] `NEXTAUTH_SECRET` 已設定
- [ ] `DATABASE_URL` 已設定
- [ ] `GOOGLE_CLIENT_ID` 已設定
- [ ] `GOOGLE_CLIENT_SECRET` 已設定

### 部署狀態
- [ ] 已重新部署應用程式
- [ ] 部署狀態為 **Ready**
- [ ] 構建日誌中沒有錯誤

### 應用程式功能
- [ ] 訪問網站不再出現 404 錯誤
- [ ] 網站可以正常載入
- [ ] Google OAuth 登入可以正常運作（如果已更新 Google Cloud Console）

### Google OAuth 設定（如果使用）
- [ ] Google Cloud Console 中已添加 JavaScript origins
- [ ] Google Cloud Console 中已添加 redirect URI

---

## 🐛 如果還有問題

### 問題 1: 仍然出現 404 錯誤

**可能原因：**
- 環境變數未正確設定
- 未重新部署

**解決方法：**
1. 再次檢查環境變數是否都已設定
2. 確認 `NEXTAUTH_URL` 是正確的 Vercel 網址
3. 重新部署應用程式

### 問題 2: 構建失敗

**解決方法：**
1. 查看構建日誌中的錯誤訊息
2. 確認所有環境變數都已正確設定
3. 檢查是否有 TypeScript 或 ESLint 錯誤

### 問題 3: OAuth 登入失敗

**可能原因：**
- Google Cloud Console 中未設定 redirect URI
- `NEXTAUTH_URL` 設定錯誤

**解決方法：**
1. 確認 Google Cloud Console 中已添加正確的 redirect URI
2. 確認 `NEXTAUTH_URL` 是正確的 Vercel 網址
3. 等待 1-2 分鐘讓 Google 設定生效

---

## 🎉 成功指標

如果以下都正常，表示設定成功：

- ✅ 訪問 Vercel 網址不再出現 404
- ✅ 網站可以正常載入
- ✅ 可以完成 Google OAuth 登入
- ✅ 登入後可以正常使用應用程式功能

---

## 📞 需要更多幫助？

如果還有問題，請檢查：

1. **Vercel 構建日誌**：查看是否有錯誤訊息
2. **Vercel 函數日誌**：在 Functions 標籤中查看運行時錯誤
3. **瀏覽器控制台**：按 F12 查看是否有前端錯誤

祝您部署順利！🚀

