# 繪俄史 Paint Starve — 官方網站

學校虛構世界觀的官方網站。前台展示學生、師資、社團等資訊，資料來自 Linode 上的同步伺服器（原始來源為 Google Spreadsheet）。

## 技術棧

| 層級 | 技術 |
|------|------|
| 前台框架 | Vite + React 19 SPA |
| 路由 | react-router-dom v7 |
| UI 元件庫 | Mantine UI v9（dark theme） |
| HTTP 客戶端 | axios |
| 樣式 | SASS + Mantine CSS |
| 語言 | TypeScript |
| 套件管理 | pnpm |

## 架構說明

前後端完全分離：

- **前台**（本 repo）：純 SPA，打包後部署為靜態檔案
- **資料伺服器**（Linode）：從 Google Spreadsheet 同步資料，提供 REST API
- 前台透過 `VITE_API_URL` 呼叫資料伺服器取得最新資料，無資料庫依賴

## 專案結構

```
src/
├── api/
│   ├── index.ts          # axios client（呼叫 Linode 伺服器）
│   └── types.ts          # API 回傳型別（Students 等）
├── components/
│   ├── FrontendShell.tsx  # AppShell 外殼（含 header/navbar 佈局）
│   ├── NavTabs.tsx        # 頂部導覽列
│   ├── Drawer.tsx         # 手機側選單
│   └── MantineClientProvider.tsx  # Mantine Provider 包裝
├── hooks/
│   └── useData.ts         # 通用資料 hook（useData(Sheet.STUDENTS)）
├── lib/
│   └── routes.tsx         # 路由定義（key / name / path / component）
├── pages/
│   └── Students.tsx       # 學生頁
├── styles/
│   └── main.sass          # 全域樣式（字體、reset）
├── App.tsx                # 根元件（MantineProvider + AppRouter + FrontendShell）
├── AppRouter.tsx          # react-router-dom 路由器（createBrowserRouter）
├── main.tsx               # Vite 入口
└── vite-env.d.ts          # Vite 型別宣告（*.module.sass 等）

index.html                 # Vite HTML 入口
vite.config.ts             # Vite 設定（@ alias，build outDir: ../docs）
```

## 環境設定

複製 `.env.example` 為 `.env` 並填入：

```env
VITE_API_URL=https://your-linode-server.example.com
VITE_SPREADSHEET_ID=your-google-spreadsheet-id
```

## 啟動開發

```bash
pnpm install
pnpm dev
```

前台：http://localhost:5173

## 常用指令

```bash
pnpm dev      # 開發伺服器（Vite HMR）
pnpm build    # 正式建置（輸出至 ../docs）
pnpm preview  # 預覽建置結果
pnpm lint     # ESLint 檢查
```

## 新增頁面

1. 在 `src/pages/` 建立頁面元件
2. 在 `src/api/types.ts` 新增對應型別與 `Sheet` enum 值
3. 在 `src/lib/routes.tsx` 加入路由設定

## 網頁架構計畫
- 首頁
- 導航 (給不認識企劃的人看的)
  - 關於企劃
  - 世界觀與簡介、介紹
- 公告 (網站不代表官方 僅作為轉載官方消息)
  - 校規、創作規範
  - 最新公告與消息
  - 角卡與官方素材
  - 二創精選
  - 校歌
- 師生 (所有參與角色) 
  - 為一個索引系統，分為學生、教職與社團三種篩選，其下有更細節的分類路徑。
- 社團 (因社團過多、還沒想到更好的網站呈現方式，但先留做未來使用的頁籤)
- 活動 (記錄官方與非官方舉辦之面向全體師生的活動、僅記錄時間線、主視覺與簡介 不做過多贅述)
- 網站資訊
  - 更新紀錄
  - 製作人員
  - 免責聲明
