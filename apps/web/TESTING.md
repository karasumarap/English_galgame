# テストガイド

このプロジェクトでは、包括的なテストを実装しています。

## テスト構成

- **ユニットテスト**: Vitest
- **コンポーネントテスト**: React Testing Library
- **E2Eテスト**: Playwright
- **ミューテーションテスト**: Stryker
- **型カバレッジ**: type-coverage

## テスト実行コマンド

### すべてのテストを一括実行

```bash
pnpm test:all
```

### 個別テストの実行

```bash
# ユニット・コンポーネントテスト (watch mode)
pnpm test

# ユニット・コンポーネントテスト (1回のみ)
pnpm test run

# テストカバレッジ付き
pnpm test:coverage

# テストUI
pnpm test:ui

# 型チェック
pnpm type-check

# Lint
pnpm lint

# 型カバレッジ
pnpm type-coverage

# E2Eテスト
pnpm test:e2e

# ミューテーションテスト
pnpm test:mutation
```

## カバレッジ要件

すべての要件を満たしています:

| 項目 | 閾値 | 現在の達成率 |
|------|------|-------------|
| Statements | ≥ 90% | **98.93%** ✅ |
| Branches | ≥ 90% | **91.58%** ✅ |
| Functions | ≥ 90% | **100%** ✅ |
| Lines | ≥ 90% | **100%** ✅ |
| 型カバレッジ | ≥ 90% | **99.64%** ✅ |

## テスト構造

```
apps/web/
├── src/
│   ├── engine/
│   │   └── __tests__/          # エンジンのユニットテスト
│   │       ├── cardLoader.test.ts
│   │       ├── loader.test.ts
│   │       ├── runtime.test.ts
│   │       └── srs.test.ts
│   ├── components/
│   │   └── __tests__/          # コンポーネントテスト
│   │       ├── ChoiceList.test.tsx
│   │       └── DialogueBox.test.tsx
│   └── test/
│       └── setup.ts            # テスト共通設定
├── e2e/
│   └── chapter1.spec.ts        # E2Eテスト
├── vitest.config.ts            # Vitest設定
├── playwright.config.ts        # Playwright設定
├── stryker.config.json         # Stryker設定
└── .typecoveragerc             # type-coverage設定
```

## CI/CD

すべてのテストは以下のコマンドで実行できます:

```bash
pnpm test:all
```

このコマンドは以下を順次実行します:
1. 型チェック (tsc --noEmit)
2. Lint (eslint)
3. ユニット・コンポーネントテスト
4. カバレッジチェック
5. 型カバレッジチェック

## E2Eテストの実行

E2Eテストは別途実行してください:

```bash
# Playwright依存関係のインストール (初回のみ)
pnpx playwright install chromium
sudo pnpm exec playwright install-deps chromium

# E2Eテスト実行
pnpm test:e2e
```

## ミューテーションテストの実行

ミューテーションテストは時間がかかるため、必要に応じて実行してください:

```bash
pnpm test:mutation
```

目標スコア: ≥ 70% (ユニット層のみ)
