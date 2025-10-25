#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 測試專案設定...\n');

// 檢查必要檔案
const requiredFiles = [
  'package.json',
  'backend/package.json',
  'frontend/package.json',
  'backend/env.example',
  'frontend/env.example',
  'backend/src/index.ts',
  'frontend/src/main.tsx',
  'README.md',
  '.gitignore'
];

let allFilesExist = true;

console.log('📁 檢查必要檔案:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// 檢查目錄結構
const requiredDirs = [
  'backend/src',
  'backend/src/controllers',
  'backend/src/middleware',
  'backend/src/routes',
  'backend/src/types',
  'backend/src/utils',
  'frontend/src',
  'frontend/src/components',
  'frontend/src/pages',
  'frontend/src/contexts',
  'frontend/src/services',
  'frontend/src/types'
];

console.log('\n📂 檢查目錄結構:');
requiredDirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`   ${exists ? '✅' : '❌'} ${dir}`);
  if (!exists) allFilesExist = false;
});

// 檢查 package.json 內容
console.log('\n📦 檢查 package.json 設定:');

try {
  const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasConcurrently = rootPackage.devDependencies && rootPackage.devDependencies.concurrently;
  console.log(`   ${hasConcurrently ? '✅' : '❌'} concurrently 依賴`);
  
  const hasDevScript = rootPackage.scripts && rootPackage.scripts.dev;
  console.log(`   ${hasDevScript ? '✅' : '❌'} dev 腳本`);
} catch (error) {
  console.log('   ❌ 無法讀取根目錄 package.json');
  allFilesExist = false;
}

try {
  const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  const hasExpress = backendPackage.dependencies && backendPackage.dependencies.express;
  console.log(`   ${hasExpress ? '✅' : '❌'} Express 依賴 (後端)`);
  
  const hasTypeScript = backendPackage.devDependencies && backendPackage.devDependencies.typescript;
  console.log(`   ${hasTypeScript ? '✅' : '❌'} TypeScript 依賴 (後端)`);
} catch (error) {
  console.log('   ❌ 無法讀取後端 package.json');
  allFilesExist = false;
}

try {
  const frontendPackage = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  const hasReact = frontendPackage.dependencies && frontendPackage.dependencies.react;
  console.log(`   ${hasReact ? '✅' : '❌'} React 依賴 (前端)`);
  
  const hasVite = frontendPackage.devDependencies && frontendPackage.devDependencies.vite;
  console.log(`   ${hasVite ? '✅' : '❌'} Vite 依賴 (前端)`);
} catch (error) {
  console.log('   ❌ 無法讀取前端 package.json');
  allFilesExist = false;
}

// 總結
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 專案設定檢查通過！');
  console.log('\n📋 接下來的步驟:');
  console.log('1. 執行 npm run install:all 安裝依賴');
  console.log('2. 複製 env.example 到 .env 並填入 API 金鑰');
  console.log('3. 執行 npm run dev 啟動應用程式');
} else {
  console.log('❌ 專案設定檢查失敗，請檢查上述錯誤');
  process.exit(1);
}


