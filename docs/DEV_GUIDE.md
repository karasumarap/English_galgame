# 開発ガイド

## セットアップ

### 開発環境

```bash
# モノレポのルートで依存関係をインストール
pnpm install

# 開発サーバー起動
cd apps/web
pnpm dev
```

### 推奨VSCode拡張機能

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

## アーキテクチャ

### VNエンジン

`src/engine/` に実装されたビジュアルノベルエンジン：

- **types.ts**: 型定義
- **runtime.ts**: シナリオ実行エンジン
- **loader.ts**: シナリオローダー
- **srs.ts**: 間隔反復システム

### コンポーネント構成

```
GameScreen (メイン)
├── Background
├── DialogueBox
├── ChoiceList
└── HUD
```

### 状態管理

Zustandを使用:

```typescript
import { useGameStore } from '@state/gameStore'

const { language, setLanguage, updateState } = useGameStore()
```

## シナリオの作成

### シナリオファイル (`scenes/*.json`)

```json
{
  "id": "scene_id",
  "bgm": "track_name",
  "background": "/path/to/bg.jpg",
  "characters": [...],
  "script": [
    {
      "type": "say",
      "who": "character_id",
      "text": { "en": "...", "jp": "..." }
    },
    {
      "type": "choice",
      "prompt": { "en": "...", "jp": "..." },
      "options": [...]
    }
  ]
}
```

### サポートされるコマンド

- `say`: セリフ表示
- `choice`: 選択肢
- `quiz`: 復習クイズ
- `label`: ジャンプ先ラベル
- `goto`: 指定ラベルへジャンプ
- `set`: フラグ設定
- `bgm`: BGM変更
- `background`: 背景変更

## 学習カードの作成

`lessons/*.json`:

```json
[
  {
    "id": "card_id",
    "en": "English phrase",
    "jp": "日本語訳",
    "tags": ["tag1", "tag2"],
    "context": "使用場面の説明",
    "intervals": {
      "ease": 2.5,
      "streak": 0
    }
  }
]
```

## テスト

```bash
# Lint
pnpm lint

# 型チェック
pnpm type-check

# ビルド確認
pnpm build
```

## デバッグ

### React DevTools

ブラウザ拡張をインストールしてコンポーネントツリーを確認。

### 状態のデバッグ

```typescript
// コンソールで確認
useGameStore.getState()
```

### シナリオのバリデーション

```typescript
import { validateScene } from '@engine/loader'
validateScene(scene) // true/false
```

## ビルドとデプロイ

```bash
# プロダクションビルド
pnpm build

# 出力先: apps/web/dist/
```

静的ホスティング（Vercel, Netlify等）にデプロイ可能。

## トラブルシューティング

### モジュールが見つからない

```bash
pnpm install
```

### 型エラー

```bash
pnpm type-check
```

### ホットリロードが動かない

```bash
# 開発サーバーを再起動
pnpm dev
```
