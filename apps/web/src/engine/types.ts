/**
 * VNエンジン - 型定義
 * ビジュアルノベルのシナリオ、キャラクター、選択肢などの型定義
 */

export interface LocalizedText {
  en: string
  jp: string
}

export interface Character {
  id: string
  name: LocalizedText
  sprite?: string
  voice?: string
}

export interface SayCommand {
  type: 'say'
  who: string
  text: LocalizedText
  emotion?: string
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
