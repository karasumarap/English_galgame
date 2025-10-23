# English Learning Visual Novel 🎮📚

恋愛シミュレーションを通じて英語を楽しく学べるビジュアルノベルゲーム

## 🎯 プロジェクト概要

このプロジェクトは、恋愛ドラマの没入感を活かして、英語学習を継続的に楽しく行えるWebアプリケーションです。

**主な特徴:**
- 📖 分岐型ビジュアルノベル
- 🗣️ 実用的な英会話表現の習得
- 🔄 SRS（間隔反復システム）による復習
- 🌐 日本語/英語の切り替え対応
- 💾 ローカルセーブ機能

**ターゲット:** CEFR A2〜B1レベルの英語学習者（18-30歳）

## 🚀 クイックスタート

### 必要要件
- Node.js 18以上
- pnpm 8以上

### インストールと起動

```bash
# リポジトリをクローン
git clone https://github.com/karasumarap/English_galgame.git
cd English_galgame

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

ブラウザで `http://localhost:3000` を開きます。

## 📁 プロジェクト構造

```
English_galgame/
├── apps/
│   └── web/              # メインアプリケーション
│       ├── src/
│       │   ├── engine/   # VNエンジン（実行、分岐、SRS）
│       │   ├── components/ # UIコンポーネント
│       │   ├── scenes/   # シナリオデータ（JSON）
│       │   ├── lessons/  # 学習カードデータ
│       │   ├── systems/  # システム機能（保存等）
│       │   └── state/    # 状態管理
│       └── public/       # 静的アセット
├── docs/                 # ドキュメント
│   ├── GDD/             # ゲームデザイン
│   ├── ELT/             # 学習設計
│   ├── DEV_GUIDE.md     # 開発ガイド
│   └── SCENARIO_DSL.md  # シナリオ仕様
└── README.md
```

## 🎮 機能

### 実装済み
- ✅ ビジュアルノベルエンジン（分岐、ジャンプ、フラグ管理）
- ✅ 選択肢システム
- ✅ 好感度システム
- ✅ SRS（間隔反復）エンジン
- ✅ セーブ/ロード機能（IndexedDB）
- ✅ 日本語/英語切り替え
- ✅ チャプター1サンプルシナリオ

### 開発予定
- 🔲 音声機能（TTS/ASR）
- 🔲 復習クイズUI
- 🔲 チャプター2-6
- 🔲 アナリティクス
- 🔲 PWA対応

## 🛠 技術スタック

- **フロントエンド:** React + TypeScript + Vite
- **状態管理:** Zustand
- **スタイリング:** Tailwind CSS
- **ストレージ:** IndexedDB (idb)
- **将来:** Web Speech API, Electron

## 📚 ドキュメント

- [開発ガイド](./docs/DEV_GUIDE.md) - セットアップ、開発方法
- [シナリオDSL仕様](./docs/SCENARIO_DSL.md) - シナリオの書き方
- [ゲームデザイン](./docs/GDD/game_design.md) - ゲーム設計
- [学習設計](./docs/ELT/learning_design.md) - 教育設計

## 🎨 開発

### 基本コマンド

```bash
# 開発サーバー起動
pnpm dev

# Lint
pnpm lint

# 型チェック
pnpm type-check

# ビルド
pnpm build

# プレビュー
pnpm preview
```

## 🧪 テスト

### 包括的テスト（推奨）

```bash
# 全ての品質チェックを一度に実行
# - 型チェック (tsc --noEmit)
# - Lint (eslint)
# - ユニットテスト + カバレッジ
# - 型カバレッジ (99.64%)
pnpm test
```

**出力例:**
```
✓ Test Files: 6 passed (6)
✓ Tests: 87 passed (87)

Coverage Report:
Statements: 98.93% | Branches: 91.58% | Functions: 100% | Lines: 100%

Type Coverage: 99.64% (5014/5032)
```

### 個別テストコマンド

```bash
# ユニットテストのみ（ウォッチモード）
pnpm test:watch

# カバレッジレポート生成
pnpm test:coverage

# E2Eテスト（Playwright）
pnpm test:e2e

# ミューテーションテスト（Stryker）- ユニット層のみ
pnpm test:mutation

# 型カバレッジチェック（≥90%）
pnpm type-coverage

# CI用完全テストスイート（E2E + ミューテーション含む）
pnpm test:ci
```

### テストカバレッジ目標

| メトリクス | 目標 | 現在 |
|-----------|------|------|
| Statements | ≥90% | 98.93% ✅ |
| Branches | ≥90% | 91.58% ✅ |
| Functions | ≥90% | 100% ✅ |
| Lines | ≥90% | 100% ✅ |
| Type Coverage | ≥90% | 99.64% ✅ |
| Mutation Score | ≥70% | - (ユニット層のみ) |

### テストファイル構成

```
apps/web/src/
├── components/__tests__/
│   ├── ChoiceList.test.tsx
│   └── DialogueBox.test.tsx
├── engine/__tests__/
│   ├── cardLoader.test.ts
│   ├── loader.test.ts
│   ├── runtime.test.ts
│   └── srs.test.ts
└── test/
    └── setup.ts          # テスト環境設定

apps/web/e2e/
└── chapter1.spec.ts      # E2Eテスト
```

## 🤝 コントリビューション

現在は個人開発中です。Issue や Pull Request は歓迎します。

## 📄 ライセンス

UNLICENSED（商用化予定のため非公開）

## 👤 作者

[@karasumarap](https://github.com/karasumarap)

---

**🎯 目標:** 英語学習の挫折をなくし、楽しく継続できる学習体験を提供する
ギャルゲー
