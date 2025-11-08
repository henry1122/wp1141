# 修復 Vercel Git Submodule 警告

## 🔍 問題說明

Vercel 構建日誌顯示：
```
Warning: Failed to fetch one or more git submodules
```

這個警告表示 Vercel 在構建時嘗試獲取 Git submodule，但失敗了。

## ⚠️ 影響

- **通常不會導致構建失敗**：這只是一個警告，不是錯誤
- **可能影響某些功能**：如果您的專案依賴 submodule 中的代碼，可能會導致問題
- **不會直接導致 404 錯誤**：404 錯誤更可能是環境變數或路由配置問題

## 🔧 解決方法

### 方法 1: 移除 Submodule 引用（如果不需要）

如果您的專案不需要 submodule，可以移除它：

1. **檢查是否有 submodule**
   ```bash
   git submodule status
   ```

2. **如果顯示錯誤或沒有 submodule，但 Git 仍嘗試獲取**
   - 檢查 `.gitmodules` 文件是否存在
   - 如果存在但不需要，可以刪除它

3. **清理 Git 配置**
   ```bash
   git config --remove-section submodule.wp-1141-todo-app 2>$null
   ```

### 方法 2: 在 Vercel 中禁用 Submodule 獲取

在 Vercel Dashboard 中：

1. 前往專案 **Settings**
2. 找到 **Git** 設定
3. 找到 **Submodules** 選項
4. 如果有的話，可以禁用 submodule 獲取

### 方法 3: 更新 vercel.json（推薦）

在 `vercel.json` 中添加配置來忽略 submodule：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  }
}
```

### 方法 4: 確保 Submodule 正確配置（如果需要）

如果您的專案確實需要 submodule：

1. **創建或更新 `.gitmodules` 文件**
   ```ini
   [submodule "wp-1141-todo-app"]
       path = wp-1141-todo-app
       url = https://github.com/your-username/wp-1141-todo-app.git
   ```

2. **初始化 submodule**
   ```bash
   git submodule init
   git submodule update
   ```

3. **提交更改**
   ```bash
   git add .gitmodules
   git commit -m "Add submodule configuration"
   git push
   ```

## ✅ 快速修復（如果不需要 submodule）

如果您的專案不需要 submodule，最簡單的方法是：

1. **檢查並刪除 `.gitmodules` 文件**（如果存在）
2. **清理 Git 配置**
   ```bash
   git config --remove-section submodule.wp-1141-todo-app 2>$null
   ```
3. **提交更改並推送**
   ```bash
   git add .
   git commit -m "Remove submodule configuration"
   git push
   ```
4. **在 Vercel 中重新部署**

## 📋 檢查清單

修復後，請確認：

- [ ] `.gitmodules` 文件已處理（刪除或正確配置）
- [ ] Git 配置已清理
- [ ] 更改已提交並推送到 GitHub
- [ ] Vercel 重新部署後警告消失

## 🎯 重要提醒

**這個警告通常不會導致 404 錯誤。**

如果您的 Vercel 部署仍然出現 404 錯誤，更可能的原因是：

1. **環境變數未設定**：檢查 `NEXTAUTH_URL`、`DATABASE_URL` 等
2. **構建時出錯**：查看完整的構建日誌
3. **路由配置問題**：檢查 Next.js 路由配置

建議先修復環境變數和構建問題，submodule 警告可以稍後處理。

