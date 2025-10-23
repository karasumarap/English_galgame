# エマの画像追加ガイド

## 📁 画像の配置場所

すべてのエマの画像は以下のディレクトリに配置してください：

```
/workspaces/English_galgame/apps/web/public/assets/characters/emma/
```

## 🎨 画像のファイル命名規則

### 基本形式
```
{outfit}_{emotion}.jpg
```

### 例
```
default_smile.jpg       # デフォルト服・笑顔
default_angry.jpg       # デフォルト服・怒り
default_normal.jpg      # デフォルト服・通常
uniform_smile.jpg       # 制服・笑顔
casual_happy.jpg        # カジュアル服・嬉しい
```

### 現在の画像
```
ema.jpg                 # すべての表情・衣装で共通（一時的）
```

## 🔧 新しい画像を追加する手順

### ステップ1: 画像ファイルを配置

```bash
# 例: 笑顔の画像を追加
cp /path/to/emma_smile.jpg /workspaces/English_galgame/apps/web/public/assets/characters/emma/default_smile.jpg
```

### ステップ2: シナリオJSONを更新

`/workspaces/English_galgame/apps/web/src/scenes/chap1_intro.json`を編集：

```json
{
  "id": "emma",
  "name": {
    "en": "Emma",
    "jp": "エマ"
  },
  "sprites": {
    "default": "/assets/characters/emma/ema.jpg",
    "emotions": {
      "normal": "/assets/characters/emma/ema.jpg",
      "smile": "/assets/characters/emma/default_smile.jpg",  // ← 新しい画像
      "happy": "/assets/characters/emma/ema.jpg",
      "kind": "/assets/characters/emma/ema.jpg",
      "angry": "/assets/characters/emma/ema.jpg",
      "sad": "/assets/characters/emma/ema.jpg",
      "surprised": "/assets/characters/emma/ema.jpg"
    }
  }
}
```

### ステップ3: ブラウザで確認

開発サーバーが自動でリロードします（ホットリロード）。

## 📝 表情の種類

現在サポートしている表情：
- `normal` - 通常
- `smile` - 笑顔
- `happy` - 嬉しい
- `kind` - 優しい
- `angry` - 怒り
- `sad` - 悲しい
- `surprised` - 驚き

## 👗 衣装の種類

現在サポートしている衣装：
- `default` - デフォルト
- `uniform` - 制服
- `casual` - カジュアル

## 🚀 クイックコマンド

### すべてのエマの画像を確認
```bash
ls -lh /workspaces/English_galgame/apps/web/public/assets/characters/emma/
```

### 新しい画像をコピー
```bash
# ローカルから
cp ~/Downloads/emma_smile.jpg /workspaces/English_galgame/apps/web/public/assets/characters/emma/default_smile.jpg

# または直接配置
mv new_image.jpg /workspaces/English_galgame/apps/web/public/assets/characters/emma/uniform_angry.jpg
```

### 画像のサイズ確認
```bash
file /workspaces/English_galgame/apps/web/public/assets/characters/emma/ema.jpg
```

## 💡 ベストプラクティス

### 推奨画像サイズ
- **幅**: 400-800px
- **高さ**: 600-1200px
- **アスペクト比**: 約 2:3 (縦長)
- **ファイル形式**: JPG, PNG, WebP
- **ファイルサイズ**: 100KB-500KB（最適化推奨）

### 画像の最適化
```bash
# ImageMagickを使用（インストール済みの場合）
convert ema.jpg -resize 600x900 -quality 85 ema_optimized.jpg

# または online-image-compressor.com などのオンラインツールを使用
```

## 🎯 複数画像の一括追加

すべての表情を一度に追加する場合：

```bash
# 例: 7つの表情画像を一度に配置
cp smile.jpg /workspaces/English_galgame/apps/web/public/assets/characters/emma/default_smile.jpg
cp angry.jpg /workspaces/English_galgame/apps/web/public/assets/characters/emma/default_angry.jpg
cp sad.jpg /workspaces/English_galgame/apps/web/public/assets/characters/emma/default_sad.jpg
cp happy.jpg /workspaces/English_galgame/apps/web/public/assets/characters/emma/default_happy.jpg
cp surprised.jpg /workspaces/English_galgame/apps/web/public/assets/characters/emma/default_surprised.jpg
cp kind.jpg /workspaces/English_galgame/apps/web/public/assets/characters/emma/default_kind.jpg
cp normal.jpg /workspaces/English_galgame/apps/web/public/assets/characters/emma/default_normal.jpg
```

その後、JSONを一括更新：

```json
"emotions": {
  "normal": "/assets/characters/emma/default_normal.jpg",
  "smile": "/assets/characters/emma/default_smile.jpg",
  "happy": "/assets/characters/emma/default_happy.jpg",
  "kind": "/assets/characters/emma/default_kind.jpg",
  "angry": "/assets/characters/emma/default_angry.jpg",
  "sad": "/assets/characters/emma/default_sad.jpg",
  "surprised": "/assets/characters/emma/default_surprised.jpg"
}
```

## 🔍 トラブルシューティング

### 画像が表示されない
1. ファイルパスが正しいか確認
2. ファイル名のスペルミスがないか確認
3. ブラウザのコンソールでエラーを確認
4. 開発サーバーを再起動

### 画像が大きすぎる/小さすぎる
- CharacterSpriteコンポーネントが自動調整します
- それでも問題がある場合は画像サイズを調整

---

これで、今後エマの画像を簡単に追加・更新できます！🎨✨
