# Event Linker

## 專案簡介

Event Linker 是一個讓使用者輕鬆建立活動、產生邀請連結並分享給朋友的活動管理平台。受邀者可透過連結接受或拒絕邀請，主辦人則可於儀表板管理所有活動。

---

## 核心功能

- 建立活動（標題、描述、時間、地點、是否公開參與者名單等）
- 產生活動邀請連結，分享給朋友
- 受邀者可透過連結接受或拒絕活動邀請，並可填寫備註
- 主辦人可於儀表板管理自己建立的活動與參與狀態
- 支援活動歸檔、參與者管理
- 使用者登入/註冊（Clerk 驗證）

---

## 專案結構

```
event-linker/
├── src/
│   ├── app/                  # Next.js app 目錄（頁面、路由、儀表板、活動詳情等）
│   ├── components/           # React 元件（活動表單、邀請卡、UI 元件等）
│   │   └── ui/               # 基礎 UI 元件（Button、Dialog、Form 等）
│   ├── lib/                  # 共用工具、Prisma 初始化
│   ├── actions/              # 伺服器端邏輯（活動、參與狀態處理）
│   └── types/                # 全域型別定義
├── prisma/                   # Prisma schema 與 migration
├── public/                   # 靜態資源
├── package.json              # 專案設定
├── README.md                 # 專案說明
└── ...
```

- **src/app/**：Next.js 路由與頁面，包含活動詳情、儀表板、登入註冊等。
- **src/components/**：活動建立表單、邀請卡、儀表板側邊欄、Header 等元件。
- **src/components/ui/**：Button、Dialog、Form、Input 等基礎 UI 元件。
- **src/lib/**：Prisma 初始化、共用工具函式。
- **src/actions/**：活動建立、參與、狀態更新等伺服器端邏輯。
- **src/types/**：全域型別定義，方便型別安全開發。
- **prisma/**：資料庫 schema 設計，支援 MongoDB。

---

## 主要技術

- Next.js 14（App Router）
- React 18
- TypeScript
- Prisma + MongoDB
- Clerk（用戶驗證）
- Tailwind CSS

---

## 啟動方式

1. 安裝依賴：

```bash
npm install
```

2. 設定環境變數（如 .env.local，需包含 MONGODB_URI、Clerk 金鑰等）

3. 啟動本地伺服器：

```bash
npm run dev
```

4. （選用）使用 ngrok 讓外部可存取本地服務：
   因為 clerk 的 webhook 需要使用 https，所以需要使用 ngrok 來轉換，但為了避免 ngrok 的 https 連結會變動，所以需要使用 ngrok 的 free plan's domain。

   ```bash
   ngrok http "CUSTOM_DOMAIN"
   ```

   替換成自己的 domain 後，記得在 clerk 的 webhook 設定中使用。

---

## 資料庫設計簡介

- **User**：使用者資料，包含 displayName、avatarUrl。
- **Event**：活動資料，包含標題、描述、時間、地點、主辦人、是否隱藏參與者等。
- **EventParticipation**：活動參與狀態，紀錄每位使用者對活動的回覆（接受/拒絕/備註）。
- **ActivityLog**：操作紀錄。

---

## 其他

- 所有錯誤訊息、日誌與註解皆以中文撰寫，預留國際化空間。
- 詳細技術與架構說明請參閱 docs/ 或原始碼註解。
