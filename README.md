# 繪俄史 Paint Starve — 官方網站

學校虛構世界觀的官方網站。前台展示學生、師資、社團等資訊，後台由 Payload CMS 管理內容。

## 技術棧

| 層級 | 技術 |
|------|------|
| 前台框架 | Next.js 16 (App Router) |
| UI 元件庫 | Mantine UI v9（dark theme） |
| CMS 後台 | Payload CMS 3.x |
| 資料庫 | PostgreSQL（未來：NeonDB） |
| 樣式 | SASS + Mantine CSS |
| 語言 | TypeScript |
| 套件管理 | pnpm |

## 專案結構

```
src/
├── app/
│   ├── (frontend)/           # 前台路由（共用 html/body + Mantine）
│   │   ├── layout.tsx        # 前台 root layout（含 AppShell 外殼）
│   │   └── page.tsx          # 首頁 /
│   └── (payload)/            # CMS 路由（共用 Payload RootLayout）
│       ├── layout.tsx        # Payload root layout（含認證/i18n context）
│       ├── admin/
│       │   ├── layout.tsx    # （由 (payload)/layout.tsx 覆蓋）
│       │   ├── importMap.js  # Payload 自動產生的元件對應表
│       │   └── [[...segments]]/page.tsx  # Payload admin UI
│       └── api/
│           └── [...slug]/route.ts        # Payload REST API
├── components/
│   ├── FrontendShell.tsx     # AppShell 外殼（'use client'，含 useDisclosure）
│   ├── NavTabs.tsx           # 頂部導覽列（'use client'）
│   ├── Drawer.tsx            # 手機側選單（'use client'）
│   └── MantineClientProvider.tsx  # Mantine Provider 包裝（'use client'）
├── lib/
│   └── routes.ts             # 前台路由定義（key / name / path）
└── styles/
    └── main.sass             # 全域樣式（字體、reset）

payload.config.ts             # Payload 設定（collections、DB、secret）
next.config.ts                # Next.js 設定（含 withPayload wrapper）
```

## 環境設定

複製 `.env.example` 為 `.env` 並填入：

```env
PAYLOAD_SECRET = 至少 32 字元的隨機字串
DATABASE_URL   = postgresql://username:password@hostname:port/database_name
```

## 啟動開發

```bash
pnpm install
pnpm dev
```

- 前台：http://localhost:3000
- Payload admin：http://localhost:3000/admin（首次進入需建立帳號）

## 常用指令

```bash
pnpm dev                  # 開發伺服器
pnpm build                # 正式建置
pnpm start                # 啟動正式伺服器
pnpm generate:types       # 從 Payload collections 產生 TypeScript 型別
pnpm generate:importmap   # 更新 Payload admin 的元件對應表
```

## Layout 架構說明

此專案使用 **兩個獨立 root layout** 的 Next.js 模式：

- `(frontend)/layout.tsx`：管理前台的 `<html>/<body>`，載入 Mantine CSS，提供 AppShell
- `(payload)/layout.tsx`：管理 admin 的 `<html>/<body>`，由 Payload `RootLayout` 處理（含主題、語言、認證 context）

兩者互不干擾，共享 `app/` 目錄但沒有共同的根 layout。

## 目前進度

### ✅ 已完成

- [x] Vite → Next.js App Router 遷移
- [x] Mantine UI 保留（dark theme，AppShell 導覽列）
- [x] Payload CMS 3.x 設定完成
- [x] Payload admin 後台可進入（`/admin`）
- [x] Users collection（認證用）
- [x] 前台 AppShell 導覽（NavTabs、Drawer）使用 `next/navigation`
- [x] `'use client'` 邊界正確設定
- [x] 前台 / admin 使用獨立 root layout，解決 `<html>` 嵌套問題

### 🔜 待完成（依優先順序）

1. **建立 Collections**
   - `Students`（name, slug, avatar, class, clubs, description）
   - `Teachers`（name, slug, avatar, subject, description）
   - `Classes`（name, slug, grade, description）
   - `Clubs`（name, slug, members, description）

2. **Data Access Layer**
   - 建立 `src/lib/data/` 目錄
   - `getStudents()`, `getStudentBySlug(slug)` 等函式
   - 初期從 Payload Local API 取資料

3. **前台頁面實作**
   - `/students`、`/students/[slug]`
   - `/teachers`、`/teachers/[slug]`
   - `/clubs`、`/clubs/[slug]`
   - 其餘靜態頁面（`/intro`、`/anthem`、`/rules` 等）

4. **靜態部署規劃**
   - 評估 Next.js `output: 'export'` 可行性
   - 設定 `generateStaticParams` for 動態路由

5. **Docker / 部署**
   - 建立 `Dockerfile` 與 `.env.production` 範例
   - Payload 後台部署至 Linode

## 已知問題 / 注意事項

- `react-router-dom` 仍留在 `dependencies`，可移除（已不再使用）
- `@vitejs/plugin-react` 仍在 `devDependencies`，可移除
- 舊的 Vite 入口檔（`src/App.tsx`, `src/main.tsx`, `src/AppRouter.tsx`, `src/routes.tsx`）仍存在，可清理
- `DATABASE_URL` 必須是有效的 PostgreSQL 連線字串，admin 才能正常啟動
