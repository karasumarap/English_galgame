import { describe, it, expect, vi } from 'vitest'
import { loadScene, validateScene } from '../loader'
import type { Scene } from '../types'

// loadScene関数のためのモジュールモック
vi.mock('@scenes/chap1_intro.json', () => ({
  default: {
    id: 'chap1_intro',
    characters: [],
    script: [],
  },
}))

describe('loader', () => {
  describe('loadScene', () => {
    it('存在するシーンをロードできる', async () => {
      const scene = await loadScene('chap1_intro')

      expect(scene).toBeDefined()
      expect(scene.id).toBe('chap1_intro')
      expect(Array.isArray(scene.script)).toBe(true)
      expect(Array.isArray(scene.characters)).toBe(true)
    })

    it('存在しないシーンはエラーをスローする', async () => {
      await expect(loadScene('nonexistent_scene')).rejects.toThrow(
        'Scene not found: nonexistent_scene'
      )
    })
  })

  describe('validateScene', () => {
    it('正しいシーンはvalidationをパスする', () => {
      const validScene: Scene = {
        id: 'test_scene',
        characters: [],
        script: [
          {
            type: 'label',
            id: 'start',
          },
          {
            type: 'say',
            who: 'narrator',
            text: { en: 'Test', jp: 'テスト' },
          },
          {
            type: 'goto',
            target: 'start',
          },
        ],
      }

      expect(validateScene(validScene)).toBe(true)
    })

    it('idがない場合はfalseを返す', () => {
      const invalidScene = {
        characters: [],
        script: [],
      } as unknown as Scene

      expect(validateScene(invalidScene)).toBe(false)
    })

    it('scriptが配列でない場合はfalseを返す', () => {
      const invalidScene = {
        id: 'test',
        characters: [],
        script: 'not an array',
      } as unknown as Scene

      expect(validateScene(invalidScene)).toBe(false)
    })

    it('存在しないlabelへのgotoは失敗する', () => {
      const invalidScene: Scene = {
        id: 'test_scene',
        characters: [],
        script: [
          {
            type: 'goto',
            target: 'nonexistent_label',
          },
        ],
      }

      expect(validateScene(invalidScene)).toBe(false)
    })

    it('choice内のgotoも検証される', () => {
      const scene: Scene = {
        id: 'test_scene',
        characters: [],
        script: [
          {
            type: 'label',
            id: 'valid_target',
          },
          {
            type: 'choice',
            prompt: { en: 'Choose', jp: '選択' },
            options: [
              {
                id: 'opt1',
                text: { en: 'Option 1', jp: '選択肢1' },
                goto: 'valid_target',
              },
            ],
          },
        ],
      }

      expect(validateScene(scene)).toBe(true)
    })

    it('choice内の無効なgotoは失敗する', () => {
      const scene: Scene = {
        id: 'test_scene',
        characters: [],
        script: [
          {
            type: 'choice',
            prompt: { en: 'Choose', jp: '選択' },
            options: [
              {
                id: 'opt1',
                text: { en: 'Option 1', jp: '選択肢1' },
                goto: 'invalid_target',
              },
            ],
          },
        ],
      }

      expect(validateScene(scene)).toBe(false)
    })

    it('gotoがないchoiceも有効', () => {
      const scene: Scene = {
        id: 'test_scene',
        characters: [],
        script: [
          {
            type: 'choice',
            prompt: { en: 'Choose', jp: '選択' },
            options: [
              {
                id: 'opt1',
                text: { en: 'Option 1', jp: '選択肢1' },
              },
            ],
          },
        ],
      }

      expect(validateScene(scene)).toBe(true)
    })

    it('複数のlabelとgotoの整合性を確認できる', () => {
      const scene: Scene = {
        id: 'test_scene',
        characters: [],
        script: [
          {
            type: 'label',
            id: 'label1',
          },
          {
            type: 'label',
            id: 'label2',
          },
          {
            type: 'goto',
            target: 'label1',
          },
          {
            type: 'goto',
            target: 'label2',
          },
        ],
      }

      expect(validateScene(scene)).toBe(true)
    })
  })
})
