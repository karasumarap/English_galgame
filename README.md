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

```bash
# Lint
pnpm lint

# 型チェック
pnpm type-check

# ビルド
pnpm build

# プレビュー
pnpm preview
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
