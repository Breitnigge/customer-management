# SDD: 顧客管理システム 技術設計

## 1. アーキテクチャ概要

```
ブラウザ (React/Next.js)
    ↓ fetch
Next.js API Routes (/app/api/*)
    ↓
better-sqlite3
    ↓
data/customers.db (SQLiteファイル)
```

## 2. データモデル

### customers テーブル
| カラム | 型 | 制約 |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| name | TEXT | NOT NULL |
| phone | TEXT | |
| email | TEXT | |
| memo | TEXT | |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TEXT | DEFAULT CURRENT_TIMESTAMP |

### purchase_histories テーブル
| カラム | 型 | 制約 |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| customer_id | INTEGER | NOT NULL, FOREIGN KEY → customers.id |
| purchase_date | TEXT | NOT NULL |
| product_name | TEXT | NOT NULL |
| amount | INTEGER | DEFAULT 0 |
| memo | TEXT | |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP |

## 3. API設計

| メソッド | パス | 機能 |
|---|---|---|
| GET | /api/customers | 顧客一覧（?q=検索キーワード） |
| POST | /api/customers | 顧客登録 |
| GET | /api/customers/[id] | 顧客詳細 |
| PUT | /api/customers/[id] | 顧客更新 |
| DELETE | /api/customers/[id] | 顧客削除 |
| GET | /api/customers/[id]/histories | 購入履歴一覧 |
| POST | /api/customers/[id]/histories | 購入履歴登録 |
| GET | /api/backup | DBファイルダウンロード |

## 4. 画面構成

```
/ (ルート)          → 顧客一覧 + 検索ボックス + 登録ボタン
/customers/new      → 顧客登録フォーム
/customers/[id]     → 顧客詳細 + 購入履歴一覧 + 編集フォーム
```

## 5. ディレクトリ構成

```
src/
  app/
    page.tsx                     # 顧客一覧
    customers/
      new/page.tsx               # 顧客登録
      [id]/page.tsx              # 顧客詳細
    api/
      customers/
        route.ts                 # GET一覧 / POST登録
        [id]/
          route.ts               # GET詳細 / PUT更新 / DELETE削除
          histories/route.ts     # GET履歴一覧 / POST履歴登録
      backup/route.ts            # GETバックアップ
  lib/
    db.ts                        # DB接続・初期化
data/
  customers.db                   # SQLiteデータファイル（.gitignore推奨）
```

## 6. データ消失防止設計（RISK-001対応）

- SQLiteファイル（`data/customers.db`）はサーバーローカルに常駐
- `DRY_RUN` 不要（外部送信なし）
- バックアップ: `/api/backup` でファイルをダウンロード
- 削除操作: 確認ダイアログ必須（FR-CUST-005）
