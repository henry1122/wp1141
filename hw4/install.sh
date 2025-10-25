#!/bin/bash

echo "🚀 安裝健行路線記錄應用..."

# 檢查 Node.js 是否已安裝
if ! command -v node &> /dev/null; then
    echo "❌ 請先安裝 Node.js (v18 或以上版本)"
    exit 1
fi

# 檢查 npm 是否已安裝
if ! command -v npm &> /dev/null; then
    echo "❌ 請先安裝 npm"
    exit 1
fi

echo "✅ Node.js 和 npm 已安裝"

# 安裝根目錄依賴
echo "📦 安裝根目錄依賴..."
npm install

# 安裝後端依賴
echo "📦 安裝後端依賴..."
cd backend
npm install

# 安裝前端依賴
echo "📦 安裝前端依賴..."
cd ../frontend
npm install

# 回到根目錄
cd ..

# 建立環境變數檔案
echo "⚙️  建立環境變數檔案..."

# 後端環境變數
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ 已建立 backend/.env 檔案"
    echo "⚠️  請編輯 backend/.env 並填入您的 Google Maps API 金鑰"
else
    echo "✅ backend/.env 檔案已存在"
fi

# 前端環境變數
if [ ! -f "frontend/.env" ]; then
    cp frontend/env.example frontend/.env
    echo "✅ 已建立 frontend/.env 檔案"
    echo "⚠️  請編輯 frontend/.env 並填入您的 Google Maps API 金鑰"
else
    echo "✅ frontend/.env 檔案已存在"
fi

# 初始化資料庫
echo "🗄️  初始化資料庫..."
cd backend
npm run db:init
npm run db:seed

cd ..

echo ""
echo "🎉 安裝完成！"
echo ""
echo "📋 接下來的步驟："
echo "1. 編輯 backend/.env 和 frontend/.env 檔案"
echo "2. 在 Google Cloud Console 建立 API 金鑰"
echo "3. 將 API 金鑰填入環境變數檔案"
echo "4. 執行 'npm run dev' 啟動應用程式"
echo ""
echo "🌐 應用程式將在以下網址運行："
echo "   前端: http://localhost:5173"
echo "   後端: http://localhost:3001"
echo ""
echo "🧪 測試帳號："
echo "   電子郵件: john@example.com"
echo "   密碼: password123"


