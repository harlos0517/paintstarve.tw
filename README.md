# 繪俄史 Paint Starve — 官方網站

學校虛構世界觀的官方網站。前台展示學生、師資等角色資訊，並提供帳號認證、角色認領、角色資料管理等功能。採 pnpm monorepo，前後端皆在本 repo 內。

## 技術棧

| 層級 | 技術 |
|------|------|
| 前台框架 | Vite + React 19 SPA |
| 路由 | react-router-dom v7（HashRouter） |
| UI 元件庫 | Mantine UI v9（dark theme） |
| 前台 HTTP 客戶端 | axios |
| 後端框架 | Express + express-zod-api（型別安全的路由／輸入輸出驗證） |
| 資料庫 | PostgreSQL（Neon 代管）＋ Prisma ORM |
| 身份驗證 | better-auth（Google OAuth，session cookie） |
| 圖片儲存 | Cloudflare R2（S3 相容 API，前端直傳，後端僅簽發 presigned URL） |
| 語言 | TypeScript（全 repo） |
| 套件管理 | pnpm workspace |

## 架構說明

前後端分離，但同屬一個 pnpm workspace（`frontend`、`backend` 兩個 package）：

- **`frontend/`**：Vite SPA，打包後部署為靜態檔案，透過 `VITE_API_URL` 呼叫後端 API
- **`backend/`**：Express + express-zod-api 伺服器，Prisma 存取 Postgres，better-auth 處理 Google OAuth 登入
- 前端不再依賴 Google Spreadsheet／Linode 同步伺服器（舊架構），所有角色/使用者資料改由 `backend` 的資料庫直接提供

### 使用者角色與審核流程

- 使用者以 Google 帳號登入（better-auth），預設 `role: USER`、`verifyStatus: PENDING`
- `verifyStatus` 為 `PENDING` 的使用者仍可瀏覽公開頁面、提出角色認領申請，但無法使用需要 `VERIFIED` 才能操作的功能（例如編輯自己的角色）
- 管理員（`role: ADMIN`）於後臺審核使用者帳號、批准/拒絕角色認領申請
- `role`/`verifyStatus` 皆為 better-auth 的 `additionalFields`，且設定 `input: false`，使用者無法透過前端 API 自行竄改（伺服器端強制限制，非僅前端隱藏）

### 角色認領（Character Claim）機制

- `Character.userId` 可為 `null`，代表「尚未被認領」的權威狀態（並非某個預設擁有者）
- 使用者從公開角色列表挑選角色提出認領申請（`CharacterClaimRequest`，狀態 `PENDING/APPROVED/REJECTED`）
- 認領申請可在兩種情境下被處理，皆共用同一份 `resolveClaim`/`rejectClaim` 邏輯（`characterClaims/services/resolveClaim.ts`），避免衝突處理邏輯重複：
  1. 管理員在角色認領申請頁面逐筆審核
  2. 管理員核准「使用者帳號」時，會自動批次處理該使用者所有待審的角色認領申請
- 同一組 `(userId, characterId)` 若曾被拒絕，允許重新提出申請（沿用同一筆資料庫紀錄，改回 `PENDING`），但 `PENDING`/`APPROVED` 狀態不可重複申請
- 角色的 `verified` 欄位僅在「使用者帳號審核通過」這個情境下被設為 `true`，管理員單獨核准某一筆認領申請並不會連帶讓角色變成已認證（因為申請人的帳號當下可能還沒審核過）

### 角色資料匯入／匯出（CSV）

- 管理員可透過 CSV 匯入/匯出角色資料（`admin/characters/import`、`export`）
- 匯入比對邏輯：優先以 `id`（本站自己匯出的 CSV 才會有）比對既有角色，若無 `id` 則 fallback 以 `(season, seatId)`（一個座位在一個梯次內天然唯一）比對——這是為了讓「原始舊試算表匯出的 CSV（沒有 `id` 欄位）」重複匯入時能正確更新既有角色，而不是每次都新增重複角色列
  - `Character` 有 `@@unique([season, seatId])` 資料庫約束把關，避免萬一應用層邏輯出錯又產生重複資料
- CSV 的 `fileId` 欄位不是 `Character` 的欄位，而是舊試算表對應到學生證/教職證掃描圖的檔名代號（`id_card/{fileId}.jpg`，已存在 R2 桶內）。匯入時會據此建立/更新對應的 `Image` 紀錄（`idCardForCharacterId`），讓角色頁能顯示證件照
- 匯入時單一列資料若寫入失敗（例如 `userId` 對應到不存在的使用者），只會記錄在該次匯入結果的 `errors` 陣列中，不會讓整批匯入中斷；CSV 檔案本身若無法解析（如引號未閉合），會回傳明確的 400 錯誤，而不是整個請求 500

### 圖片（Image）

- `Image` 是通用的圖片資料表，透過 `uploadedByUserId`（誰上傳的）與可選的 `idCardForCharacterId`（若為某角色的證件照）關聯
- 上傳流程為 presigned URL：前端呼叫 `POST /me/images/presign-upload` 取得一組 R2 簽名 PUT URL，直接把檔案傳到 R2（後端完全不經手檔案內容），成功後前端再用回傳的 `publicUrl` 顯示
- R2 桶為公開讀取（`R2_PUBLIC_URL`），圖片內容本身（含證件照）視為虛構角色的創作素材，非真實個資，因此在公開 API（`public/characters`）也會回傳 `idCardImageUrls`；但角色關聯的「真實使用者帳號」（`user: {name, email}`）僅在 `me`/`admin` 的角色詳細資料端點回傳，不對外公開
- 刪除圖片會同時刪除資料庫紀錄與 R2 物件；若該圖片網址曾被 CDN 快取，刪除後短時間內舊網址仍可能命中快取（目前接受此為 eventual consistency，未做主動 cache purge）

### 前台 vs. 後臺（Dashboard）

- `/dashboard` 是任何已登入且審核通過的使用者都能進入的區域（管理自己的資料、提出角色認領），並非管理員專屬
- 其中特定頁面（使用者管理、角色管理、CSV 匯入匯出、角色認領審核）才透過 `AdminOnly` 元件限制僅 `role: ADMIN` 可見
- 命名慣例：泛指「這個區塊/整個後臺殼層」用 `Dashboard*`；泛指「真的需要 ADMIN 權限才能呼叫」用 `Admin*`（例如 `adminAuthMiddleware`、`/api/v1/admin/*`、`useAdminCharacter`、`AdminOnly`）

## 專案結構

```
backend/
├── src/
│   ├── characters/           # 角色 CRUD（public/me/admin 三種權限範圍）＋ CSV 匯入匯出
│   ├── characterClaims/       # 角色認領申請（提交／撤回／審核）
│   ├── images/                 # 圖片上傳（presigned URL）／列表／刪除
│   ├── users/                  # 使用者列表／審核／角色調整（皆為 admin-only）
│   ├── middlewares/auth.ts    # authenticatedMiddleware / userAuthMiddleware / adminAuthMiddleware
│   ├── utils/authControllers.ts  # better-auth 設定（Google OAuth、additionalFields）
│   ├── db.ts                   # Prisma client 與各 model 的具名匯出
│   ├── config.ts               # express-zod-api 設定（CORS、上傳限制、better-auth 掛載）
│   ├── routing.ts              # 所有路由定義
│   └── index.ts                # 進入點
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── generated/prisma/          # `pnpm generate` 產生，不進版控

frontend/
├── src/
│   ├── api/                    # axios 呼叫封裝＋型別（characters/users/characterClaims）
│   ├── hooks/                  # useQuery/useMutation 包裝（useApi.ts）＋各資源的 hook
│   ├── components/
│   │   └── dashboard/          # 後臺共用元件（DashboardLayout、AdminOnly、CharacterEditor…）
│   ├── pages/
│   │   └── dashboard/          # 後臺頁面（Me、Characters、Users、CharacterClaims…）
│   ├── lib/                    # auth-client（better-auth 前端 SDK）、navlinks、classes 對照表
│   ├── AppRouter.tsx            # 路由定義（前台 + /dashboard）
│   └── main.tsx
└── vite.config.ts
```

## 環境設定

### Backend（`backend/.env`，參考 `backend/.env.example`）

```env
DATABASE_URL=              # Postgres 連線字串
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:8088
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudflare R2（圖片上傳）
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=              # 桶的公開網域（r2.dev 或自訂網域）
```

### Frontend（`frontend/.env`，參考 `frontend/.env.example`）

```env
VITE_API_URL=http://localhost:8088
```

## 啟動開發

```bash
pnpm install

# 首次啟動或 schema 變動後
pnpm --filter backend migrate    # 套用 migration
pnpm --filter backend generate   # 產生 Prisma client

pnpm dev   # 同時啟動 frontend（Vite）與 backend（tsx watch）
```

前台：http://localhost:5173　後端 API：http://localhost:8088

## 常用指令

```bash
pnpm dev      # 前後端一起啟動（workspace 平行執行）
pnpm build    # 前後端一起 build
pnpm lint     # 前後端一起 lint

# 針對單一 package
pnpm --filter backend <script>
pnpm --filter frontend <script>
```

## 給未來實作的重要提醒

- **`Character.userId` 是 nullable**，`null` 才是「尚未認領」的正確狀態，不要用「某個預設使用者」當佔位符（曾經這樣做過，後來特地改掉）
- **CSV 匯入的比對鍵是 `(season, seatId)` 而非 `id`**——如果要新增其他批次匯入/同步功能，記得沿用這個比對邏輯，不要只靠 `id`
- **新增任何批次處理（CSV、批次 API）時，每一筆都要各自 try/catch**，不要讓單一筆的錯誤中斷整批處理
- **改動 `Character` 或其他已有資料的欄位限制前，先確認現有資料是否已違反新限制**（例如加 `@@unique` 前，先查有沒有重複資料）
- **調整使用者角色（`adminAdjustUserRoles`）時要考慮「唯一管理員」情境**：目前規則是管理員不能自我降權，避免不小心把自己踢出後臺
- **`.env.example` 要跟著新增的環境變數一起更新**，否則之後重新 clone/部署會漏設定
- 角色認領與使用者審核共用 `resolveClaim`/`rejectClaim`，未來如果要再加一個新的觸發點（例如批次核准多個角色），記得繼續共用這份邏輯，不要各自複製一份
- **Work（作品／二創）功能尚未實作**，`routing.ts` 底部留有規劃中的 API 清單（`public/me/admin` 的 works／images 端點）可參考

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
