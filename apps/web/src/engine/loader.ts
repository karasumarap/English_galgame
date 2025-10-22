/**
 * シナリオローダー
 * YAML形式のシナリオファイルを読み込み、Scene オブジェクトに変換
 */

import type { Scene } from './types'

export async function loadScene(sceneId: string): Promise<Scene> {
  // 開発初期は JSON で直接インポート
  // 将来的に YAML パーサーを追加
  try {
    const module = await import(`@scenes/${sceneId}.json`)
    return module.default as Scene
  } catch (error) {
    console.error(`Failed to load scene: ${sceneId}`, error)
    throw new Error(`Scene not found: ${sceneId}`)
  }
}

export function validateScene(scene: Scene): boolean {
  if (!scene.id || !Array.isArray(scene.script)) {
    return false
  }

  // ラベルとgotoの整合性チェック
  const labels = new Set<string>()
  const gotos = new Set<string>()

  scene.script.forEach((cmd) => {
    if (cmd.type === 'label') {
      labels.add(cmd.id)
    } else if (cmd.type === 'goto') {
      gotos.add(cmd.target)
    } else if (cmd.type === 'choice') {
      cmd.options.forEach((opt) => {
        if (opt.goto) {
          gotos.add(opt.goto)
        }
      })
    }
  })

  // 存在しない goto 先を検出
  for (const target of gotos) {
    if (!labels.has(target)) {
      console.warn(`Invalid goto target: ${target} in scene ${scene.id}`)
      return false
    }
  }

  return true
}
