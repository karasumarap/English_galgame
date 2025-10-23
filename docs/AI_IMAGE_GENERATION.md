# AI画像生成ガイド

このプロジェクトでGitHub Copilotと生成AIを組み合わせて画像を生成・格納する方法を説明します。

## 📋 目次

1. [対応している方法](#対応している方法)
2. [セットアップ](#セットアップ)
3. [使用方法](#使用方法)
4. [VS Code拡張機能](#vs-code拡張機能)

---

## 🎨 対応している方法

### 方法1: Stable Diffusion Web UI（推奨）

**メリット:**
- ローカルで完全に動作
- 無料
- 高品質
- カスタマイズ可能

**必要なもの:**
- NVIDIA GPU（推奨: VRAM 8GB以上）
- Python 3.10+
- Stable Diffusion Web UI

### 方法2: OpenAI DALL-E 3

**メリット:**
- セットアップ不要
- 高品質
- 簡単

**必要なもの:**
- OpenAI APIキー（有料）

### 方法3: Leonardo.ai / Midjourney

**メリット:**
- Web UIで簡単
- 高品質

**必要なもの:**
- アカウント登録（一部有料）

---

## 🔧 セットアップ

### Option A: Stable Diffusion Web UI（ローカル）

#### 1. Stable Diffusion Web UIのインストール

```bash
# リポジトリをクローン
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# 起動（初回は自動でインストール）
./webui.sh --api
```

Windows の場合:
```bash
webui-user.bat --api
```

#### 2. モデルのダウンロード

推奨モデル（ギャルゲー・アニメ風）:
- **Anything V5**: https://huggingface.co/stablediffusionapi/anything-v5
- **Counterfeit V3**: https://huggingface.co/gsdf/Counterfeit-V3.0
- **AbyssOrangeMix3**: https://huggingface.co/WarriorMama777/OrangeMixs

ダウンロード先: `stable-diffusion-webui/models/Stable-diffusion/`

#### 3. 環境変数の設定

```bash
# .envファイルを作成
echo "SD_API_ENDPOINT=http://localhost:7860" > .env
```

### Option B: OpenAI DALL-E 3

```bash
# APIキーを設定
echo "OPENAI_API_KEY=sk-your-key-here" > .env
```

---

## 🚀 使用方法

### 基本的な使い方

```bash
# キャラクター画像を生成
pnpm generate:character emma "anime girl, pink hair, blue eyes, school uniform, smile" smile

# 別の表情を生成
pnpm generate:character emma "anime girl, pink hair, blue eyes, school uniform, angry" angry
```

### Node.jsスクリプトから直接実行

```bash
node scripts/generate-character.js <キャラクター名> "<プロンプト>" [表情]
```

### プロンプトの例

#### エマ（ピンク髪の少女）
```bash
pnpm generate:character emma "masterpiece, best quality, 1girl, anime style, pink hair, twin tails, blue eyes, school uniform, sailor uniform, standing, full body, white background, visual novel character, smile, cute" smile
```

#### 怒った表情
```bash
pnpm generate:character emma "masterpiece, best quality, 1girl, anime style, pink hair, twin tails, blue eyes, school uniform, angry expression, furrowed brows, pout, crossed arms" angry
```

#### 制服バージョン
```bash
pnpm generate:character emma "masterpiece, best quality, 1girl, anime style, pink hair, twin tails, blue eyes, school uniform, blazer, pleated skirt, smile, standing" uniform_smile
```

---

## 🔌 VS Code拡張機能

### 推奨拡張機能

#### 1. Stable Diffusion Image Generator
- **拡張機能ID**: `takedakouki.stable-diffusion`
- VS Code内で画像生成可能

#### 2. AI Image Generator
- **拡張機能ID**: 検索: "AI Image Generator"
- 複数のAIサービスに対応

### 拡張機能のインストール方法

```bash
# VS Codeで
# 1. Ctrl+Shift+X (拡張機能)
# 2. "Stable Diffusion" で検索
# 3. インストール
```

または、コマンドパレットから:
```
1. Ctrl+Shift+P
2. "Extensions: Install Extensions"
3. "stable diffusion" で検索
```

---

## 📝 高度な使用例

### カスタムスクリプト

プロジェクト内で独自のスクリプトを作成:

```javascript
// scripts/batch-generate.js
const characters = [
  { name: 'emma', prompt: 'pink hair girl', emotions: ['smile', 'angry', 'sad'] },
  { name: 'lisa', prompt: 'blonde hair girl', emotions: ['smile', 'surprised'] }
];

for (const char of characters) {
  for (const emotion of char.emotions) {
    // 生成処理
  }
}
```

### APIを直接呼び出す例

```javascript
// Stable Diffusion API
const response = await fetch('http://localhost:7860/sdapi/v1/txt2img', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'anime girl, school uniform',
    negative_prompt: 'low quality, blurry',
    steps: 30,
    width: 512,
    height: 768,
    cfg_scale: 7
  })
});

const result = await response.json();
const imageBase64 = result.images[0];
```

---

## 🎯 ベストプラクティス

### プロンプトのコツ

1. **具体的に記述**
   ```
   ❌ "cute girl"
   ✅ "anime girl, pink hair, blue eyes, school uniform, smile, high quality"
   ```

2. **ネガティブプロンプトを使用**
   ```
   negative_prompt: "low quality, blurry, distorted, ugly, bad anatomy, extra limbs"
   ```

3. **品質キーワードを追加**
   ```
   "masterpiece, best quality, high resolution, detailed"
   ```

### ファイル管理

```
public/assets/characters/
  emma/
    default_smile.png     # デフォルト服・笑顔
    default_angry.png     # デフォルト服・怒り
    uniform_smile.png     # 制服・笑顔
    casual_normal.png     # カジュアル服・通常
```

---

## 🆘 トラブルシューティング

### Stable Diffusion Web UIが起動しない

```bash
# Pythonのバージョン確認
python --version  # 3.10.x が推奨

# 依存関係を再インストール
cd stable-diffusion-webui
./webui.sh --reinstall-torch
```

### APIに接続できない

```bash
# Web UIが--apiフラグで起動されているか確認
ps aux | grep webui

# 再起動
./webui.sh --api --listen
```

### メモリ不足エラー

```bash
# 低VRAMモード
./webui.sh --api --lowvram --xformers
```

---

## 📚 参考リンク

- [Stable Diffusion Web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
- [プロンプトガイド](https://stable-diffusion-art.com/prompt-guide/)
- [Civitai (モデルダウンロード)](https://civitai.com/)
- [OpenAI DALL-E API](https://platform.openai.com/docs/guides/images)

---

## ⚡ クイックスタート

```bash
# 1. Stable Diffusion Web UIをインストール・起動
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
./webui.sh --api

# 2. 画像生成
cd /path/to/English_galgame
pnpm generate:character emma "anime girl, pink hair, school uniform, smile" smile

# 3. 生成された画像を確認
open apps/web/public/assets/characters/emma/
```

---

生成された画像は自動的に `apps/web/public/assets/characters/` に保存され、ゲーム内で使用できます！🎨✨
