/**
 * VNエンジン - ランタイム
 * シナリオの実行、分岐処理、セーブ/ロード機能
 */

import type {
  Scene,
  ScriptCommand,
  GameState,
  ChoiceCommand,
  QuizCommand,
  Language,
  Character,
  SayCommand,
} from './types'

/**
 * 現在表示中のキャラクタースプライト情報
 */
export interface ActiveCharacterSprite {
  character: Character
  emotion: string
  outfit?: string
  position: 'left' | 'center' | 'right'
  visible: boolean
}

export class VNEngine {
  private scene: Scene | null = null
  private state: GameState
  private commandIndex = 0
  private labels: Map<string, number> = new Map()
  private language: Language = 'jp'
  private activeSprites: Map<string, ActiveCharacterSprite> = new Map()  // キャラクターID -> スプライト情報

  constructor(initialState?: Partial<GameState>) {
    this.state = {
      currentScene: '',
      currentLine: 0,
      flags: {},
      affection: {},
      completedLessons: [],
      history: [],
      ...initialState,
    }
  }

  loadScene(scene: Scene): void {
    this.scene = scene
    this.commandIndex = 0
    this.labels.clear()
    this.activeSprites.clear()  // スプライトもクリア
    this.state.currentScene = scene.id

    // ラベルのインデックスを構築
    scene.script.forEach((cmd, index) => {
      if (cmd.type === 'label') {
        this.labels.set(cmd.id, index)
      }
    })

    // シーン開始時に全キャラクターを表示（最初のキャラクター以外は非表示）
    scene.characters.forEach((character) => {
      if (character.id !== 'hero') {
        // 主人公以外は自動表示（デフォルトはセンター）
        this.activeSprites.set(character.id, {
          character,
          emotion: 'normal',
          outfit: undefined,
          position: 'center',  // デフォルトは常にセンター
          visible: true,
        })
      }
    })
  }

  setLanguage(lang: Language): void {
    this.language = lang
  }

  getLanguage(): Language {
    return this.language
  }

  getCurrentCommand(): ScriptCommand | null {
    if (!this.scene || this.commandIndex >= this.scene.script.length) {
      return null
    }
    return this.scene.script[this.commandIndex]
  }

  next(): ScriptCommand | null {
    if (!this.scene) return null

    this.commandIndex++
    this.state.currentLine = this.commandIndex

    const cmd = this.getCurrentCommand()
    if (cmd) {
      this.executeCommand(cmd)
    }

    return cmd
  }

  jump(target: string): boolean {
    const index = this.labels.get(target)
    if (index !== undefined) {
      this.commandIndex = index
      this.state.currentLine = this.commandIndex
      return true
    }
    console.warn(`Label not found: ${target}`)
    return false
  }

  executeChoice(optionId: string, choice: ChoiceCommand): void {
    const option = choice.options.find((opt) => opt.id === optionId)
    if (!option) {
      console.warn(`Option not found: ${optionId}`)
      return
    }

    console.log('✅ 選択肢実行:', optionId, option.effects)

    // エフェクトを適用
    if (option.effects) {
      if (option.effects.affection !== undefined) {
        const currentAffection = this.state.affection['heroine'] || 0
        this.state.affection['heroine'] = currentAffection + option.effects.affection
      }

      if (option.effects.lesson_keys) {
        option.effects.lesson_keys.forEach((key) => {
          if (!this.state.completedLessons.includes(key)) {
            this.state.completedLessons.push(key)
            console.log('📝 レッスンキー追加:', key)
          }
        })
        console.log('📚 現在のcompletedLessons:', this.state.completedLessons)
      }

      if (option.effects.flags) {
        Object.assign(this.state.flags, option.effects.flags)
      }
    }

    // 分岐先へジャンプ
    if (option.goto) {
      this.jump(option.goto)
    } else {
      this.next()
    }

    // 履歴に追加
    this.state.history.push(`choice:${optionId}`)
  }

  executeQuiz(success: boolean, quiz: QuizCommand): void {
    if (success && quiz.success?.goto) {
      this.jump(quiz.success.goto)
    } else if (!success && quiz.fail?.goto) {
      this.jump(quiz.fail.goto)
    } else {
      this.next()
    }

    this.state.history.push(`quiz:${quiz.item_key}:${success ? 'success' : 'fail'}`)
  }

  private executeCommand(cmd: ScriptCommand): void {
    switch (cmd.type) {
      case 'say':
        this.updateCharacterSprite(cmd)
        break
      case 'goto':
        this.jump(cmd.target)
        break
      case 'set':
        Object.assign(this.state.flags, cmd.flags)
        break
      // その他のコマンドは UI 側で処理
      default:
        break
    }
  }

  /**
   * sayコマンドに基づいてキャラクタースプライトを更新
   */
  private updateCharacterSprite(cmd: SayCommand): void {
    if (!this.scene) return

    // キャラクターを探す
    const character = this.scene.characters.find((c) => c.id === cmd.who)
    if (!character) return

    // スプライト情報を更新（既存のスプライトがあればそれを更新）
    const existingSprite = this.activeSprites.get(character.id)
    const position = cmd.position || existingSprite?.position || 'center'
    const emotion = cmd.emotion || 'normal'
    const outfit = cmd.outfit

    console.log('🎭 スプライト更新:', {
      who: cmd.who,
      emotion,
      position,
      outfit,
      visible: true,
      activeSpritesCount: this.activeSprites.size
    })

    this.activeSprites.set(character.id, {
      character,
      emotion,
      outfit,
      position,
      visible: true,  // 常に表示
    })
  }

  /**
   * 現在表示中のキャラクタースプライトを取得
   */
  getActiveSprites(): Map<string, ActiveCharacterSprite> {
    return new Map(this.activeSprites)
  }

  /**
   * 特定のキャラクターのスプライトを非表示にする
   */
  hideCharacter(characterId: string): void {
    const sprite = this.activeSprites.get(characterId)
    if (sprite) {
      sprite.visible = false
    }
  }

  /**
   * すべてのキャラクタースプライトをクリア
   */
  clearAllSprites(): void {
    this.activeSprites.clear()
  }

  getState(): GameState {
    return { ...this.state }
  }

  setState(state: Partial<GameState>): void {
    this.state = { ...this.state, ...state }
    if (state.currentLine !== undefined) {
      this.commandIndex = state.currentLine
    }
  }

  setAffection(character: string, value: number): void {
    this.state.affection[character] = value
  }

  saveGame(): string {
    const saveData = {
      ...this.state,
      saveDate: new Date(),
    }
    return JSON.stringify(saveData)
  }

  loadGame(saveDataJson: string): boolean {
    try {
      const saveData = JSON.parse(saveDataJson)
      this.setState(saveData)
      this.commandIndex = saveData.currentLine || 0
      return true
    } catch (error) {
      console.error('Failed to load save data:', error)
      return false
    }
  }

  reset(): void {
    this.state = {
      currentScene: '',
      currentLine: 0,
      flags: {},
      affection: {},
      completedLessons: [],
      history: [],
    }
    this.commandIndex = 0
  }
}
