# PROGRESS.md

## RYGステータス: 🟢 GREEN

## DoD チェックリスト

| # | 項目 | 結果 |
|---|---|---|
| 1 | ビルド成功（next build） | ✅ PASS |
| 2 | FR-CUST-001: 顧客登録 | ✅ PASS |
| 3 | FR-CUST-002: 顧客一覧（0件メッセージ） | ✅ PASS |
| 4 | FR-CUST-003: 検索（ヒットあり/なし） | ✅ PASS |
| 5 | FR-HIST-001: 購入履歴登録・合計表示 | ✅ PASS |
| 6 | FR-BACKUP-001: /api/backup エンドポイント実装 | ✅ PASS |
| 7 | Must要件全件にAC・TCが接続 | ✅ PASS |
| 8 | 破壊的操作（削除）に確認ダイアログ | ✅ PASS |
| 9 | データ消失防止（SQLite WAL + バックアップDL） | ✅ PASS |

## 起動方法

```bash
cd 顧客管理システム
npm run dev
# → http://localhost:3000
```

## 残作業（DEFER）
- CSV エクスポート
- グラフ・ダッシュボード
- 本番デプロイ設定
