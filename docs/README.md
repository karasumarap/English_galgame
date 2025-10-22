# 英語学習ビジュアルノベル

恋愛シミュレーションを通じて英語を学ぶWebアプリケーション。

## 🎯 プロジェクト概要

このプロジェクトは、恋愛ドラマの没入感を活かして英語学習を楽しく継続的に行えるビジュアルノベルゲームです。

**ターゲット**: CEFR A2〜B1レベルの学習者
**プラットフォーム**: Web（将来的にElectronでデスクトップ対応予定）

## 🚀 クイックスタート

### 必要要件

- Node.js 18+
- pnpm 8+

### インストール

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# プレビュー
pnpm preview
```

## 📁 プロジェクト構造

```
apps/
  web/                  # メインアプリケーション
    src/
      engine/           # VNエンジン（実行、分岐、SRS）
      components/       # UIコンポーネント
      scenes/           # シナリオデータ（JSON）
      lessons/          # 学習カードデータ
      systems/          # システム機能（保存、音声等）
      state/            # 状態管理（Zustand）
      assets/           # 画像、音声素材
      
docs/                   # ドキュメント
  GDD/                  # ゲームデザイン
  ELT/                  # 学習設計
  PM/                   # プロジェクト管理
```

## 🎮 主な機能

- **ビジュアルノベルエンジン**: 分岐シナリオ、キャラクター会話、選択肢システム
- **学習システム**: SRS（間隔反復）による復習管理
- **二言語対応**: 日本語/英語の切り替え
- **セーブ/ロード**: IndexedDBによるローカル保存
- **音声対応**: Web Speech API（TTS/ASR）統合予定

## 🛠 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **状態管理**: Zustand
- **スタイリング**: Tailwind CSS
- **ストレージ**: IndexedDB (idb)
- **音声**: Web Speech API
- **将来**: Electron（デスクトップ版）

## 📚 ドキュメント

- [ゲームデザインドキュメント](./docs/GDD/)
- [学習設計ノート](./docs/ELT/)
- [開発ガイド](./docs/DEV_GUIDE.md)
- [シナリオDSL仕様](./docs/SCENARIO_DSL.md)

## 🎨 開発フロー

1. シナリオを `apps/web/src/scenes/` に JSON で作成
2. 学習カードを `apps/web/src/lessons/` に定義
3. 必要に応じてUIコンポーネントを追加
4. テストして動作確認

## 🤝 コントリビューション

このプロジェクトは現在個人開発中です。

## 📄 ライセンス

UNLICENSED（商用化予定）

## 🗺 ロードマップ

- [x] プロジェクト構造の構築
- [x] VNエンジンのコア実装
- [x] 基本UIコンポーネント
- [x] チャプター1サンプルシナリオ
- [ ] 音声機能（TTS/ASR）
- [ ] 復習クイズUI
- [ ] チャプター2-6の実装
- [ ] アナリティクス
- [ ] PWA対応
- [ ] Electron版

## 📞 お問い合わせ

- GitHub: [@karasumarap](https://github.com/karasumarap)
