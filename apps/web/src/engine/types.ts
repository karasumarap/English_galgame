/**
 * VNエンジン - 型定義
 * ビジュアルノベルのシナリオ、キャラクター、選択肢などの型定義
 */

export interface LocalizedText {
  en: string
  jp: string
}

/**
 * キャラクタースプライトセット
 * 複数の表情・服装のバリエーションを管理
 */
export interface SpriteSet {
  // デフォルトスプライト
  default: string
  // 表情バリエーション (outfit指定なしの場合に使用)
  emotions?: Record<string, string>
  // 服装バリエーション (各服装ごとに表情も持つ)
  outfits?: Record<string, {
    default: string
    emotions?: Record<string, string>
  }>
}

export interface Character {
  id: string
  name: LocalizedText
  sprite?: string  // 後方互換性のため残す
  sprites?: SpriteSet  // 新しいスプライト管理方式
  voice?: string
}

export interface SayCommand {
  type: 'say'
  who: string
  text: LocalizedText
  emotion?: string  // 表情: 'normal', 'smile', 'angry', 'sad', 'surprised', 'happy', 'kind' など
  outfit?: string   // 服装: 'default', 'uniform', 'casual' など
  pose?: string     // ポーズ（将来の拡張用）
  position?: 'left' | 'center' | 'right'  // キャラクターの画面上の位置
  voice?: string
}

export interface ChoiceOption {
  id: string
  text: LocalizedText
  effects?: {
    affection?: number
    lesson_keys?: string[]
    flags?: Record<string, boolean | number | string>
  }
  condition?: string
  goto?: string
}

export interface ChoiceCommand {
  type: 'choice'
  prompt: LocalizedText
  options: ChoiceOption[]
  timeout?: number
}

export interface QuizCommand {
  type: 'quiz'
  quizType: 'recall' | 'fill' | 'order' | 'shadow'
  item_key: string
  check: 'exact' | 'contains' | 'levenshtein'
  threshold?: number
  success?: { goto?: string; effects?: Record<string, number> }
  fail?: { review: string; goto?: string }
}

export interface LabelCommand {
  type: 'label'
  id: string
}

export interface GotoCommand {
  type: 'goto'
  target: string
}

export interface SetCommand {
  type: 'set'
  flags: Record<string, boolean | number | string>
}

export interface BgmCommand {
  type: 'bgm'
  track: string
  fade?: number
}

export interface BackgroundCommand {
  type: 'background'
  image: string
  transition?: 'fade' | 'slide' | 'none'
}

export interface EndCommand {
  type: 'end'
}

export type ScriptCommand =
  | SayCommand
  | ChoiceCommand
  | QuizCommand
  | LabelCommand
  | GotoCommand
  | SetCommand
  | BgmCommand
  | BackgroundCommand
  | EndCommand

export interface Scene {
  id: string
  bgm?: string
  background?: string
  characters: Character[]
  script: ScriptCommand[]
}

export interface GameState {
  currentScene: string
  currentLine: number
  flags: Record<string, boolean | number | string>
  affection: Record<string, number>
  completedLessons: string[]
  history: string[]
  saveDate?: Date
}

export interface LessonCard {
  id: string
  en: string
  jp: string
  tags: string[]
  audio?: string
  context?: string
  intervals: {
    ease: number
    streak: number
    lastReview?: Date
    nextReview?: Date
  }
}

export type Language = 'en' | 'jp'

export interface EngineConfig {
  defaultLanguage: Language
  autoSaveInterval: number
  textSpeed: number
  autoPlayDelay: number
}
