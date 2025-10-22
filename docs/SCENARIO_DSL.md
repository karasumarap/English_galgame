# シナリオDSL仕様

## 概要

ビジュアルノベルのシナリオは JSON 形式で記述します。将来的に YAML 対応も予定。

## シーン構造

```typescript
interface Scene {
  id: string              // シーンID
  bgm?: string            // BGMトラック名
  background?: string     // 背景画像パス
  characters: Character[] // 登場キャラクター
  script: Command[]       // スクリプトコマンド配列
}
```

## キャラクター定義

```json
{
  "id": "emma",
  "name": {
    "en": "Emma",
    "jp": "エマ"
  },
  "sprite": "/assets/characters/emma.png"
}
```

## コマンド一覧

### 1. say - セリフ表示

キャラクターのセリフを表示します。

```json
{
  "type": "say",
  "who": "emma",
  "text": {
    "en": "Hi! How are you?",
    "jp": "やあ！元気？"
  },
  "emotion": "smile"
}
```

### 2. choice - 選択肢

プレイヤーに選択肢を提示します。

```json
{
  "type": "choice",
  "prompt": {
    "en": "How do you reply?",
    "jp": "どう返す？"
  },
  "options": [
    {
      "id": "option1",
      "text": {
        "en": "I'm fine, thanks!",
        "jp": "元気だよ、ありがとう！"
      },
      "effects": {
        "affection": 1,
        "lesson_keys": ["greeting_fine"],
        "flags": { "greeted_emma": true }
      },
      "goto": "next_scene"
    }
  ]
}
```

**effects**:
- `affection`: 好感度変動（数値）
- `lesson_keys`: 学習カードID配列
- `flags`: 任意のフラグ設定

### 3. quiz - 復習クイズ

学習内容の復習を行います。

```json
{
  "type": "quiz",
  "quizType": "recall",
  "item_key": "greeting_fine",
  "check": "exact",
  "threshold": 0.8,
  "success": { "goto": "continue" },
  "fail": { "review": "greeting_fine", "goto": "retry" }
}
```

**quizType**:
- `recall`: リコール（思い出す）
- `fill`: 穴埋め
- `order`: 並べ替え
- `shadow`: シャドーイング

**check**:
- `exact`: 完全一致
- `contains`: 部分一致
- `levenshtein`: 編集距離による類似度

### 4. label - ラベル

ジャンプ先のラベルを定義します。

```json
{
  "type": "label",
  "id": "scene_start"
}
```

### 5. goto - ジャンプ

指定したラベルにジャンプします。

```json
{
  "type": "goto",
  "target": "scene_start"
}
```

### 6. set - フラグ設定

ゲーム内フラグを設定します。

```json
{
  "type": "set",
  "flags": {
    "met_emma": true,
    "conversation_count": 1,
    "favorite_drink": "coffee"
  }
}
```

### 7. bgm - BGM変更

BGMを変更します。

```json
{
  "type": "bgm",
  "track": "cafe_evening",
  "fade": 2.0
}
```

### 8. background - 背景変更

背景画像を変更します。

```json
{
  "type": "background",
  "image": "/assets/backgrounds/park.jpg",
  "transition": "fade"
}
```

**transition**:
- `fade`: フェード
- `slide`: スライド
- `none`: 即座に切り替え

## ベストプラクティス

### 1. ラベルとgotoの管理

```json
{
  "script": [
    { "type": "choice", "options": [
      { "id": "yes", "goto": "agreed" },
      { "id": "no", "goto": "declined" }
    ]},
    { "type": "label", "id": "agreed" },
    { "type": "say", "text": "..." },
    { "type": "goto", "target": "end" },
    { "type": "label", "id": "declined" },
    { "type": "say", "text": "..." },
    { "type": "label", "id": "end" }
  ]
}
```

### 2. 学習キーとの連携

選択肢で使った表現は必ず `lesson_keys` に追加:

```json
{
  "text": { "en": "I'd love to!", "jp": "ぜひ！" },
  "effects": {
    "lesson_keys": ["enthusiastic_agreement"]
  }
}
```

### 3. 条件分岐

フラグによる条件分岐（将来実装予定）:

```json
{
  "type": "choice",
  "options": [
    {
      "id": "option_locked",
      "text": { "en": "...", "jp": "..." },
      "condition": "flags.met_emma == true"
    }
  ]
}
```

## バリデーション

シナリオは `validateScene()` 関数で検証できます：

```typescript
import { validateScene } from '@engine/loader'

const isValid = validateScene(scene)
if (!isValid) {
  console.error('Invalid scene structure')
}
```

検証内容：
- 必須フィールドの存在
- gotoターゲットのラベル存在確認
- キャラクターIDの整合性

## 例：完全なシーン

```json
{
  "id": "chapter1_intro",
  "bgm": "cafe_day",
  "background": "/assets/backgrounds/cafe.jpg",
  "characters": [
    { "id": "hero", "name": { "en": "You", "jp": "主人公" } },
    { "id": "emma", "name": { "en": "Emma", "jp": "エマ" } }
  ],
  "script": [
    {
      "type": "say",
      "who": "emma",
      "text": { "en": "Hi!", "jp": "やあ！" }
    },
    {
      "type": "choice",
      "prompt": { "en": "Reply?", "jp": "返事は？" },
      "options": [
        {
          "id": "friendly",
          "text": { "en": "Hi there!", "jp": "やあ！" },
          "effects": { "affection": 1 },
          "goto": "continue"
        }
      ]
    },
    { "type": "label", "id": "continue" },
    {
      "type": "say",
      "who": "emma",
      "text": { "en": "Nice to meet you!", "jp": "よろしくね！" }
    }
  ]
}
```
