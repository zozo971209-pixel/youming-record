# 幽明錄 (Youming Record)

一個探索超常意識與人類潛能的主題式知識庫網站。

## 功能特性

- **主題式內容結構**：清醒夢、靈體投射、瀕死體驗、冥想意識、前世記憶、直覺預知
- **完整引用系統**：所有內容均附帶學術引用（作者、年份、頁碼）
- **後台管理系統**：支持主題、區塊、引用的增刪改查
- **投稿功能**：用戶可以提交內容
- **討論區**：主題討論和回覆
- **響應式設計**：支持桌面和移動設備

## 技術棧

- **前端**：React + TypeScript + Vite
- **樣式**：Tailwind CSS + shadcn/ui
- **數據庫**：Supabase (PostgreSQL)
- **部署**：支持 Vercel / Netlify

## 快速開始

### 1. 克隆倉庫

```bash
git clone https://github.com/zozo971209-pixel/youming-record.git
cd youming-record/app
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 配置環境變數

```bash
cp .env.example .env
```

編輯 `.env` 文件，填入你的 Supabase 憑證：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 運行開發服務器

```bash
npm run dev
```

訪問 http://localhost:5173

### 5. 後台管理登入

- 網址：http://localhost:5173/admin
- 密碼：`@Zozo88888888`

## 部署

詳見 [部署指南.md](./部署指南.md)

### 快速部署步驟

1. **推送代碼到 GitHub**
   ```bash
   git push origin main
   ```

2. **設置 Supabase**
   - 創建項目：https://app.supabase.com
   - 執行 `supabase-schema.sql`
   - 獲取 API 憑證

3. **配置環境變數**
   - 設置 `VITE_SUPABASE_URL`
   - 設置 `VITE_SUPABASE_ANON_KEY`

4. **遷移數據**
   ```bash
   npx tsx scripts/migrate-to-supabase.ts
   ```

5. **部署到 Vercel**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

## 項目結構

```
app/
├── src/
│   ├── components/     # UI 組件
│   ├── data/          # 默認數據（主題內容）
│   ├── lib/           # 工具函數和 Supabase 客戶端
│   ├── sections/      # 頁面組件
│   ├── types/         # TypeScript 類型定義
│   └── ...
├── scripts/           # 遷移腳本
├── .env.example       # 環境變數示例
└── package.json
```

## 數據模型

### 主題 (themes)
- `id`: 主題唯一標識
- `title`: 標題
- `subtitle`: 副標題
- `description`: 描述
- `icon`: 圖標
- `color`: 漸變色

### 區塊 (sections)
- `id`: 區塊唯一標識
- `theme_id`: 所屬主題
- `type`: 類型 (intro/methods/theory/evidence/cases/sources)
- `title`: 標題
- `content`: 內容

### 引用 (citations)
- `id`: 引用唯一標識
- `theme_id`: 所屬主題
- `section_id`: 所屬區塊
- `number`: 編號
- `title`: 文獻標題
- `author`: 作者
- `year`: 年份
- `source`: 出版物
- `page`: 頁碼

## 開發計劃

- [x] 主題式內容結構
- [x] 引用標註系統
- [x] 後台管理
- [x] 投稿功能
- [x] 討論區
- [x] Supabase 集成
- [ ] 用戶認證系統
- [ ] 內容搜索
- [ ] 多語言支持

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 許可證

MIT License
