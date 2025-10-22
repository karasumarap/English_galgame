/**
 * ゲーム状態管理 (Zustand)
 */

import { create } from 'zustand'
import type { GameState, Language } from '@engine/types'

interface GameStore extends GameState {
  language: Language
  textSpeed: number
  volume: {
    bgm: number
    voice: number
    se: number
  }
  
  // アクション
  setLanguage: (lang: Language) => void
  setTextSpeed: (speed: number) => void
  setVolume: (type: 'bgm' | 'voice' | 'se', value: number) => void
  updateState: (state: Partial<GameState>) => void
  reset: () => void
}

const initialState: GameState = {
  currentScene: '',
  currentLine: 0,
  flags: {},
  affection: {},
  completedLessons: [],
  history: [],
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  language: 'jp',
  textSpeed: 50,
  volume: {
    bgm: 0.7,
    voice: 1.0,
    se: 0.8,
  },

  setLanguage: (lang) => set({ language: lang }),
  setTextSpeed: (speed) => set({ textSpeed: speed }),
  setVolume: (type, value) =>
    set((state) => ({
      volume: { ...state.volume, [type]: value },
    })),
  updateState: (newState) => set((state) => ({ ...state, ...newState })),
  reset: () => set(initialState),
}))
