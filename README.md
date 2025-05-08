# Event Linker

## 專案結構說明

```
event-linker/
├── app/                  # Next.js app 目錄（頁面、路由）
├── src/
│   ├── components/       # React 元件（如 event-detail.tsx）
│   ├── lib/              # 共用函式、工具
│   └── ...               # 其他原始碼
├── public/               # 靜態資源
├── prisma/               # Prisma schema 與 migration
├── node_modules/
├── package.json
├── README.md
└── ...
```

- 主要頁面與路由在 `app/` 目錄。
- 可重用的 UI 元件放在 `src/components/`。
- 共用工具、函式放在 `src/lib/`。
- Prisma 相關檔案在 `prisma/`。

---

## 本地開發與 ngrok 外部存取

### 1. 啟動本地 Next.js 伺服器

```bash
npm run dev
# 或
yarn dev
```

預設會在 http://localhost:3000

### 2. 使用 ngrok 代理本地 3000 port

先安裝 ngrok（如未安裝）：

```bash
npm install -g ngrok
# 或依官方文件安裝
```

啟動 ngrok：

```bash
ngrok http 3000
```

你會看到一個 https://xxxx.ngrok.io 的網址，這個網址可讓外部（或手機、第三方服務）直接存取你的本地 Next.js 服務。

#### 自訂 ngrok 子網域

如果你想要指定 ngrok 提供的子網域，可以這樣執行：

```bash
ngrok http --domain=starfish-pleasing-actively.ngrok-free.app 3000
```

這樣外部就能直接用 `https://starfish-pleasing-actively.ngrok-free.app` 存取你的本地 Next.js 服務。

---

如需更詳細的結構說明或 ngrok 進階用法，歡迎再詢問！
