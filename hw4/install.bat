@echo off
echo 🚀 安裝健行路線記錄應用...

REM 檢查 Node.js 是否已安裝
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 請先安裝 Node.js (v18 或以上版本)
    pause
    exit /b 1
)

REM 檢查 npm 是否已安裝
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 請先安裝 npm
    pause
    exit /b 1
)

echo ✅ Node.js 和 npm 已安裝

REM 安裝根目錄依賴
echo 📦 安裝根目錄依賴...
npm install

REM 安裝後端依賴
echo 📦 安裝後端依賴...
cd backend
npm install

REM 安裝前端依賴
echo 📦 安裝前端依賴...
cd ..\frontend
npm install

REM 回到根目錄
cd ..

REM 建立環境變數檔案
echo ⚙️  建立環境變數檔案...

REM 後端環境變數
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env"
    echo ✅ 已建立 backend\.env 檔案
    echo ⚠️  請編輯 backend\.env 並填入您的 Google Maps API 金鑰
) else (
    echo ✅ backend\.env 檔案已存在
)

REM 前端環境變數
if not exist "frontend\.env" (
    copy "frontend\env.example" "frontend\.env"
    echo ✅ 已建立 frontend\.env 檔案
    echo ⚠️  請編輯 frontend\.env 並填入您的 Google Maps API 金鑰
) else (
    echo ✅ frontend\.env 檔案已存在
)

REM 初始化資料庫
echo 🗄️  初始化資料庫...
cd backend
npm run db:init
npm run db:seed

cd ..

echo.
echo 🎉 安裝完成！
echo.
echo 📋 接下來的步驟：
echo 1. 編輯 backend\.env 和 frontend\.env 檔案
echo 2. 在 Google Cloud Console 建立 API 金鑰
echo 3. 將 API 金鑰填入環境變數檔案
echo 4. 執行 'npm run dev' 啟動應用程式
echo.
echo 🌐 應用程式將在以下網址運行：
echo    前端: http://localhost:5173
echo    後端: http://localhost:3001
echo.
echo 🧪 測試帳號：
echo    電子郵件: john@example.com
echo    密碼: password123

pause


