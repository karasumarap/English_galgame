import { describe, it, expect, beforeEach } from 'vitest'
import { VNEngine } from '../runtime'
import type { Scene, ChoiceCommand, QuizCommand } from '../types'

describe('VNEngine', () => {
  let engine: VNEngine
  let sampleScene: Scene

  beforeEach(() => {
    engine = new VNEngine()
    sampleScene = {
      id: 'test_scene',
      background: 'classroom',
      characters: [
        {
          id: 'emma',
          name: { en: 'Emma', jp: 'エマ' },
          sprites: {
            default: '/assets/characters/emma/default.png',
            emotions: {
              smile: '/assets/characters/emma/smile.png',
              happy: '/assets/characters/emma/happy.png',
            },
          },
        },
      ],
      script: [
        {
          type: 'say',
          who: 'emma',
          text: { en: 'Hello!', jp: 'こんにちは!' },
          emotion: 'smile',
        },
        {
          type: 'label',
          id: 'checkpoint1',
        },
        {
          type: 'say',
          who: 'emma',
          text: { en: 'How are you?', jp: '元気ですか?' },
        },
        {
          type: 'goto',
          target: 'end_label',
        },
        {
          type: 'say',
          who: 'emma',
          text: { en: 'This should be skipped', jp: 'スキップされるべき' },
        },
        {
          type: 'label',
          id: 'end_label',
        },
        {
          type: 'end',
        },
      ],
    }
  })

  describe('loadScene', () => {
    it('シーンを正しくロードできる', () => {
      engine.loadScene(sampleScene)

      expect(engine.getState().currentScene).toBe('test_scene')
      expect(engine.getCurrentCommand()?.type).toBe('say')
    })

    it('ラベルのインデックスを正しく構築する', () => {
      engine.loadScene(sampleScene)

      const jumped = engine.jump('checkpoint1')
      expect(jumped).toBe(true)
      expect(engine.getCurrentCommand()?.type).toBe('label')
    })

    it('キャラクタースプライトを初期化する', () => {
      engine.loadScene(sampleScene)

      const sprites = engine.getActiveSprites()
      expect(sprites.has('emma')).toBe(true)
      expect(sprites.get('emma')?.visible).toBe(true)
    })
  })

  describe('language', () => {
    it('デフォルト言語はjp', () => {
      expect(engine.getLanguage()).toBe('jp')
    })

    it('言語を変更できる', () => {
      engine.setLanguage('en')
      expect(engine.getLanguage()).toBe('en')
    })
  })

  describe('getCurrentCommand', () => {
    it('現在のコマンドを取得できる', () => {
      engine.loadScene(sampleScene)

      const cmd = engine.getCurrentCommand()
      expect(cmd).toBeDefined()
      expect(cmd?.type).toBe('say')
    })

    it('シーンがロードされていない場合はnullを返す', () => {
      const cmd = engine.getCurrentCommand()
      expect(cmd).toBeNull()
    })

    it('スクリプトの最後ではnullを返す', () => {
      engine.loadScene(sampleScene)

      // 最後まで進める
      while (engine.getCurrentCommand()) {
        engine.next()
      }

      expect(engine.getCurrentCommand()).toBeNull()
    })
  })

  describe('next', () => {
    it('次のコマンドに進める', () => {
      engine.loadScene(sampleScene)

      const firstCmd = engine.getCurrentCommand()
      engine.next()
      const secondCmd = engine.getCurrentCommand()

      expect(secondCmd).not.toEqual(firstCmd)
    })

    it('currentLineが更新される', () => {
      engine.loadScene(sampleScene)

      expect(engine.getState().currentLine).toBe(0)
      engine.next()
      expect(engine.getState().currentLine).toBe(1)
    })

    it('gotoコマンドを自動実行する', () => {
      engine.loadScene(sampleScene)

      // checkpoint1までジャンプ
      engine.jump('checkpoint1')
      engine.next() // "How are you?" の say
      engine.next() // goto コマンド

      const currentCmd = engine.getCurrentCommand()
      expect(currentCmd?.type).toBe('label')
      if (currentCmd?.type === 'label') {
        expect(currentCmd.id).toBe('end_label')
      }
    })
  })

  describe('jump', () => {
    beforeEach(() => {
      engine.loadScene(sampleScene)
    })

    it('存在するラベルにジャンプできる', () => {
      const result = engine.jump('checkpoint1')

      expect(result).toBe(true)
      const cmd = engine.getCurrentCommand()
      expect(cmd?.type).toBe('label')
    })

    it('存在しないラベルへのジャンプは失敗する', () => {
      const result = engine.jump('nonexistent')

      expect(result).toBe(false)
    })
  })

  describe('executeChoice', () => {
    let choiceCmd: ChoiceCommand

    beforeEach(() => {
      choiceCmd = {
        type: 'choice',
        prompt: { en: 'What do you say?', jp: '何と言いますか?' },
        options: [
          {
            id: 'option1',
            text: { en: 'Hello', jp: 'こんにちは' },
            effects: {
              affection: 5,
              lesson_keys: ['greeting_hello'],
            },
            goto: 'checkpoint1',
          },
          {
            id: 'option2',
            text: { en: 'Hi', jp: 'やあ' },
            effects: {
              affection: 3,
              flags: { casual_greeting: true },
            },
          },
        ],
      }

      engine.loadScene(sampleScene)
    })

    it('選択肢を実行して好感度が変わる', () => {
      engine.executeChoice('option1', choiceCmd)

      const state = engine.getState()
      expect(state.affection['heroine']).toBe(5)
    })

    it('レッスンキーが追加される', () => {
      engine.executeChoice('option1', choiceCmd)

      const state = engine.getState()
      expect(state.completedLessons).toContain('greeting_hello')
    })

    it('フラグが設定される', () => {
      engine.executeChoice('option2', choiceCmd)

      const state = engine.getState()
      expect(state.flags.casual_greeting).toBe(true)
    })

    it('gotoが指定されていればジャンプする', () => {
      engine.executeChoice('option1', choiceCmd)

      const cmd = engine.getCurrentCommand()
      expect(cmd?.type).toBe('label')
    })

    it('gotoがなければnextが呼ばれる', () => {
      const initialLine = engine.getState().currentLine
      engine.executeChoice('option2', choiceCmd)

      expect(engine.getState().currentLine).toBe(initialLine + 1)
    })

    it('存在しない選択肢IDは警告して何もしない', () => {
      const stateBefore = engine.getState()
      engine.executeChoice('nonexistent', choiceCmd)
      const stateAfter = engine.getState()

      expect(stateAfter).toEqual(stateBefore)
    })
  })

  describe('executeQuiz', () => {
    let quizCmd: QuizCommand

    beforeEach(() => {
      quizCmd = {
        type: 'quiz',
        quizType: 'recall',
        item_key: 'test_word',
        check: 'exact',
        success: {
          goto: 'checkpoint1',
          effects: { score: 10 },
        },
        fail: {
          review: 'Try again!',
          goto: 'end_label',
        },
      }

      engine.loadScene(sampleScene)
    })

    it('成功時に指定されたラベルにジャンプする', () => {
      engine.executeQuiz(true, quizCmd)

      const cmd = engine.getCurrentCommand()
      expect(cmd?.type).toBe('label')
      if (cmd?.type === 'label') {
        expect(cmd.id).toBe('checkpoint1')
      }
    })

    it('失敗時に指定されたラベルにジャンプする', () => {
      engine.executeQuiz(false, quizCmd)

      const cmd = engine.getCurrentCommand()
      expect(cmd?.type).toBe('label')
      if (cmd?.type === 'label') {
        expect(cmd.id).toBe('end_label')
      }
    })

    it('履歴に記録される', () => {
      engine.executeQuiz(true, quizCmd)

      const history = engine.getState().history
      expect(history).toContain('quiz:test_word:success')
    })

    it('goto先がない場合はnextが呼ばれる', () => {
      const quizWithoutGoto: QuizCommand = {
        type: 'quiz',
        quizType: 'recall',
        item_key: 'test_word2',
        check: 'exact',
      }

      const initialLine = engine.getState().currentLine
      engine.executeQuiz(true, quizWithoutGoto)

      expect(engine.getState().currentLine).toBe(initialLine + 1)
    })

    it('失敗時もgoto先がなければnextが呼ばれる', () => {
      const quizWithoutGoto: QuizCommand = {
        type: 'quiz',
        quizType: 'recall',
        item_key: 'test_word3',
        check: 'exact',
      }

      const initialLine = engine.getState().currentLine
      engine.executeQuiz(false, quizWithoutGoto)

      expect(engine.getState().currentLine).toBe(initialLine + 1)
    })
  })

  describe('executeCommand (set)', () => {
    it('setコマンドでフラグを設定できる', () => {
      const sceneWithSet: Scene = {
        id: 'test_scene_with_set',
        characters: [],
        script: [
          {
            type: 'say',
            who: 'narrator',
            text: { en: 'First', jp: '最初' },
          },
          {
            type: 'set',
            flags: { test_flag: true, counter: 42 },
          },
          {
            type: 'say',
            who: 'narrator',
            text: { en: 'After set', jp: 'セット後' },
          },
        ],
      }
      engine.loadScene(sceneWithSet)

      // 最初のsayコマンドをスキップ
      engine.next()

      // 次がsetコマンド
      expect(engine.getCurrentCommand()?.type).toBe('set')

      // setを実行
      engine.next()

      const state = engine.getState()
      expect(state.flags.test_flag).toBe(true)
      expect(state.flags.counter).toBe(42)
    })
  })

  describe('sprite management', () => {
    beforeEach(() => {
      engine.loadScene(sampleScene)
    })

    it('getActiveSpriteで現在のスプライトを取得できる', () => {
      const sprites = engine.getActiveSprites()

      expect(sprites.size).toBeGreaterThan(0)
      expect(sprites.has('emma')).toBe(true)
    })

    it('hideCharacterでキャラクターを非表示にできる', () => {
      engine.hideCharacter('emma')

      const sprites = engine.getActiveSprites()
      expect(sprites.get('emma')?.visible).toBe(false)
    })

    it('clearAllSpritesで全スプライトをクリアできる', () => {
      engine.clearAllSprites()

      const sprites = engine.getActiveSprites()
      expect(sprites.size).toBe(0)
    })
  })

  describe('state management', () => {
    it('getStateで状態を取得できる', () => {
      const state = engine.getState()

      expect(state).toHaveProperty('currentScene')
      expect(state).toHaveProperty('flags')
      expect(state).toHaveProperty('affection')
    })

    it('setStateで状態を更新できる', () => {
      engine.setState({
        flags: { test_flag: true },
        affection: { emma: 10 },
      })

      const state = engine.getState()
      expect(state.flags.test_flag).toBe(true)
      expect(state.affection.emma).toBe(10)
    })

    it('setStateでcurrentLineを更新するとcommandIndexも更新される', () => {
      engine.loadScene(sampleScene)
      engine.setState({ currentLine: 2 })

      expect(engine.getState().currentLine).toBe(2)
    })
  })

  describe('save/load', () => {
    it('saveGameでJSONにシリアライズできる', () => {
      engine.loadScene(sampleScene)
      engine.setState({
        flags: { saved: true },
        affection: { emma: 15 },
      })

      const saveData = engine.saveGame()

      expect(typeof saveData).toBe('string')
      expect(() => JSON.parse(saveData)).not.toThrow()

      const parsed = JSON.parse(saveData)
      expect(parsed.flags.saved).toBe(true)
      expect(parsed.affection.emma).toBe(15)
    })

    it('loadGameでセーブデータから復元できる', () => {
      const saveData = JSON.stringify({
        currentScene: 'loaded_scene',
        currentLine: 5,
        flags: { loaded: true },
        affection: { emma: 20 },
        completedLessons: ['lesson1'],
        history: ['test'],
      })

      const result = engine.loadGame(saveData)

      expect(result).toBe(true)
      const state = engine.getState()
      expect(state.currentScene).toBe('loaded_scene')
      expect(state.flags.loaded).toBe(true)
    })

    it('不正なJSONの場合はfalseを返す', () => {
      const result = engine.loadGame('invalid json')

      expect(result).toBe(false)
    })
  })

  describe('reset', () => {
    it('状態を初期化する', () => {
      engine.loadScene(sampleScene)
      engine.setState({
        flags: { test: true },
        affection: { emma: 100 },
      })

      engine.reset()

      const state = engine.getState()
      expect(state.flags).toEqual({})
      expect(state.affection).toEqual({})
      expect(state.currentScene).toBe('')
      expect(state.currentLine).toBe(0)
    })
  })
})
