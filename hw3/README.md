# 台大選課系統 (NTU Course Selector)

一個現代化的台大課程選擇系統，提供直觀的課程瀏覽、選課管理和時間表查看功能。

## 功能特色

### 課程瀏覽
- **智能搜尋**：支援課程名稱、教師姓名、課程描述搜尋
- **學系篩選**：按學系或學院篩選課程
- **詳細資訊**：顯示課程時間、教室、學分、人數限制等完整資訊

### 選課管理
- **一鍵選課**：輕鬆加入/移除課程
- **時間衝突檢測**：自動檢測課程時間衝突
- **學分限制**：最多選擇25學分
- **選課清單**：清楚顯示已選課程和統計資訊

### 時間表功能
- **視覺化時間表**：直觀的週間時間表顯示
- **時間衝突標示**：清楚標示時間衝突的課程
- **多格式支援**：支援各種時間格式

### 記錄管理
- **選課記錄**：保存所有選課提交記錄
- **歷史查看**：查看過往選課記錄和提交時間
- **統計資訊**：顯示選課數量和學分統計

## 技術架構

### 前端技術
- **React 18**：現代化前端框架
- **TypeScript**：類型安全的JavaScript
- **Material-UI (MUI) v5**：現代化UI組件庫
- **Vite**：快速建構工具

### 主要組件
- `CourseBrowser`：課程瀏覽和搜尋
- `CourseSelection`：選課管理和時間表
- `CourseCart`：選課清單顯示
- `ScheduleView`：時間表視覺化
- `AllRecords`：歷史記錄查看
- `SubmissionResult`：提交結果顯示

## 安裝與運行

### 環境需求
- Node.js 16.0 或更高版本
- npm 或 yarn 套件管理器

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone <repository-url>
   cd ntu-course-selector
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **數據轉換**
   ```bash
   node convert-ntu-data.js
   ```

4. **啟動開發服務器**
   ```bash
   npm start
   ```

5. **開啟瀏覽器**
   ```
   http://localhost:3000
   ```

## 專案結構

```
ntu-course-selector/
├── public/
│   ├── data/
│   │   ├── courses.csv          # 課程數據
│   │   └── departments.csv      # 學系數據
│   └── index.html
├── src/
│   ├── components/              # React組件
│   │   ├── CourseBrowser.tsx    # 課程瀏覽
│   │   ├── CourseSelection.tsx  # 選課管理
│   │   ├── CourseCart.tsx       # 選課清單
│   │   ├── ScheduleView.tsx     # 時間表
│   │   ├── AllRecords.tsx       # 歷史記錄
│   │   └── SubmissionResult.tsx # 提交結果
│   ├── context/
│   │   └── AppContext.tsx       # 全局狀態管理
│   ├── hooks/
│   │   └── useDataLoader.ts     # 數據載入Hook
│   ├── types/
│   │   └── index.ts             # TypeScript類型定義
│   └── App.tsx                  # 主應用組件
├── convert-ntu-data.js          # 數據轉換腳本
└── package.json
```

## 使用指南

### 1. 課程瀏覽
1. 在搜尋欄輸入課程名稱、教師或描述
2. 選擇學系或學院進行篩選
3. 點擊「開始搜尋」查看結果
4. 瀏覽課程卡片查看詳細資訊

### 2. 選課操作
1. 在課程卡片上點擊「加入選課」
2. 系統會自動檢測時間衝突
3. 查看選課清單確認選擇
4. 點擊「確認選課」提交選擇

### 3. 時間表查看
1. 在選課清單頁面切換到「時間表」標籤
2. 查看週間時間表安排
3. 時間衝突會以不同顏色標示

### 4. 記錄管理
1. 在提交結果頁面點擊「查看所有紀錄」
2. 瀏覽歷史選課記錄
3. 查看每次提交的詳細資訊

## 數據格式

### 課程數據 (courses.csv)
包含以下欄位：
- `course_id`：課程編號
- `course_name`：課程名稱
- `department`：學系
- `instructor`：教師姓名
- `credits`：學分數
- `time_slot`：上課時間
- `classroom`：教室
- `prerequisites`：先修課程
- `tno`：人數限制
- `description`：課程描述

### 學系數據 (departments.csv)
包含以下欄位：
- `code`：學系代碼
- `name`：學系名稱
- `college`：所屬學院

## 時間段說明

系統支援以下時間格式：

### 標準時間段
- **1-9節**：08:00-17:30（每節50分鐘）
- **A節**：18:30-19:20
- **B節**：19:30-20:20
- **C節**：20:30-21:20
- **D節**：21:30-22:20

## 功能限制

- **學分限制**：最多選擇25學分
- **時間衝突**：不允許選擇時間衝突的課程
- **搜尋功能**：需要點擊「開始搜尋」才會執行篩選

## 開發說明

### 數據轉換
`convert-ntu-data.js` 腳本會將原始CSV數據轉換為前端可用的格式：
- 解析時間段格式
- 格式化先修課程資訊
- 提取人數限制數據

### 狀態管理
使用React Context API管理全局狀態：
- 選課清單
- 提交記錄
- 當前步驟

### 樣式設計
- 使用Material-UI主題系統
- 響應式設計支援各種螢幕尺寸
- 現代化漸變背景和動畫效果

## 貢獻指南

歡迎提交Issue和Pull Request來改進這個專案！

---

**酷酷的台大(新)選課系統** - 讓選課變得簡單直觀！ 🎓