#!/usr/bin/env node
/**
 * AI画像生成スクリプト
 * 使用方法: node scripts/generate-character.js "キャラクター名" "プロンプト"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 設定
const CONFIG = {
  // Stable Diffusion APIのエンドポイント（例）
  apiEndpoint: process.env.SD_API_ENDPOINT || 'http://localhost:7860',
  
  // OpenAI DALL-E APIキー（例）
  openaiKey: process.env.OPENAI_API_KEY || '',
  
  // 出力ディレクトリ
  outputDir: path.join(__dirname, '../apps/web/public/assets/characters')
};

/**
 * Stable Diffusion Web UIで画像生成（ローカル）
 */
async function generateWithStableDiffusion(prompt, characterName, emotion = 'normal') {
  const payload = {
    prompt: `${prompt}, high quality, detailed, anime style, visual novel character`,
    negative_prompt: 'low quality, blurry, distorted, ugly, bad anatomy',
    steps: 30,
    width: 512,
    height: 768,
    sampler_name: 'DPM++ 2M Karras',
    cfg_scale: 7,
    seed: -1
  };

  console.log('🎨 画像生成中...');
  console.log('プロンプト:', payload.prompt);

  // APIリクエスト（実際の実装例）
  // const response = await fetch(`${CONFIG.apiEndpoint}/sdapi/v1/txt2img`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // });
  
  // const result = await response.json();
  // const imageBase64 = result.images[0];
  
  console.log('⚠️  注意: 実際のAPI接続が必要です');
  console.log('💡 セットアップ手順:');
  console.log('   1. Stable Diffusion Web UIをインストール');
  console.log('   2. --api フラグで起動');
  console.log('   3. このスクリプトを再実行');
  
  return null;
}

/**
 * OpenAI DALL-E 3で画像生成
 */
async function generateWithDALLE(prompt, characterName) {
  if (!CONFIG.openaiKey) {
    console.log('⚠️  OPENAI_API_KEY環境変数が設定されていません');
    return null;
  }

  console.log('🎨 DALL-E 3で画像生成中...');
  
  // 実際の実装例
  // const response = await fetch('https://api.openai.com/v1/images/generations', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${CONFIG.openaiKey}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     model: 'dall-e-3',
  //     prompt: prompt,
  //     n: 1,
  //     size: '1024x1792',
  //     quality: 'hd'
  //   })
  // });
  
  return null;
}

/**
 * 生成された画像をファイルに保存
 */
function saveImage(imageData, characterName, emotion, format = 'png') {
  const dirPath = path.join(CONFIG.outputDir, characterName);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const filename = `${emotion}.${format}`;
  const filepath = path.join(dirPath, filename);
  
  // Base64からバッファに変換
  const buffer = Buffer.from(imageData, 'base64');
  fs.writeFileSync(filepath, buffer);
  
  console.log('✅ 画像を保存しました:', filepath);
  return filepath;
}

/**
 * プレビュー画像（SVG）を生成（フォールバック）
 */
function generatePreviewSVG(characterName, emotion, description) {
  console.log('📝 プレビューSVG画像を生成します...');
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="#f0f0f0"/>
  <text x="200" y="280" font-family="Arial" font-size="24" fill="#666" text-anchor="middle">
    ${characterName}
  </text>
  <text x="200" y="320" font-family="Arial" font-size="18" fill="#999" text-anchor="middle">
    ${emotion}
  </text>
  <text x="200" y="360" font-family="Arial" font-size="14" fill="#aaa" text-anchor="middle">
    ${description}
  </text>
  <text x="200" y="400" font-family="Arial" font-size="12" fill="#ccc" text-anchor="middle">
    [AI Generated Placeholder]
  </text>
</svg>`;

  const dirPath = path.join(CONFIG.outputDir, characterName);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const filepath = path.join(dirPath, `${emotion}_preview.svg`);
  fs.writeFileSync(filepath, svg);
  
  console.log('✅ プレビュー画像を保存しました:', filepath);
  return filepath;
}

// メイン処理
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('使用方法:');
    console.log('  node scripts/generate-character.js <キャラクター名> <プロンプト> [表情]');
    console.log('');
    console.log('例:');
    console.log('  node scripts/generate-character.js emma "pink hair anime girl in school uniform" smile');
    process.exit(1);
  }
  
  const [characterName, prompt, emotion = 'normal'] = args;
  
  console.log('🎯 キャラクター:', characterName);
  console.log('📝 プロンプト:', prompt);
  console.log('😊 表情:', emotion);
  console.log('');
  
  // 環境に応じた生成方法を選択
  let result = null;
  
  if (CONFIG.openaiKey) {
    result = await generateWithDALLE(prompt, characterName);
  } else if (CONFIG.apiEndpoint) {
    result = await generateWithStableDiffusion(prompt, characterName, emotion);
  }
  
  // フォールバック: プレビューSVGを生成
  if (!result) {
    console.log('');
    console.log('💡 代わりにプレビュー画像を生成します');
    generatePreviewSVG(characterName, emotion, prompt);
  }
  
  console.log('');
  console.log('✨ 完了！');
}

main().catch(console.error);
