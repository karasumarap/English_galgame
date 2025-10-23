import { describe, it, expect } from 'vitest'
import { loadLessonCards, filterLearnedCards } from '../cardLoader'
import type { LessonCard } from '../types'

describe('cardLoader', () => {
  describe('loadLessonCards', () => {
    it('chap1_introのカードを読み込める', async () => {
      const cards = await loadLessonCards('chap1_intro')
      
      expect(cards).toBeDefined()
      expect(Array.isArray(cards)).toBe(true)
      expect(cards.length).toBeGreaterThan(0)
    })

    it('各カードが正しい構造を持つ', async () => {
      const cards = await loadLessonCards('chap1_intro')
      
      cards.forEach((card) => {
        expect(card).toHaveProperty('id')
        expect(card).toHaveProperty('en')
        expect(card).toHaveProperty('jp')
        expect(card).toHaveProperty('tags')
        expect(card).toHaveProperty('intervals')
      })
    })

    it('存在しないチャプターは空配列を返す', async () => {
      const cards = await loadLessonCards('nonexistent_chapter')
      
      expect(cards).toEqual([])
    })

    it('カードのIDが一意である', async () => {
      const cards = await loadLessonCards('chap1_intro')
      
      const ids = cards.map((card) => card.id)
      const uniqueIds = new Set(ids)
      
      expect(ids.length).toBe(uniqueIds.size)
    })
  })

  describe('filterLearnedCards', () => {
    const mockCards: LessonCard[] = [
      {
        id: 'lesson1',
        en: 'Hello',
        jp: 'こんにちは',
        tags: ['greeting'],
        intervals: {
          ease: 2.5,
          streak: 0,
          lastReview: undefined,
          nextReview: undefined,
        },
      },
      {
        id: 'lesson2',
        en: 'Goodbye',
        jp: 'さようなら',
        tags: ['greeting'],
        intervals: {
          ease: 2.5,
          streak: 0,
          lastReview: undefined,
          nextReview: undefined,
        },
      },
      {
        id: 'lesson3',
        en: 'Thank you',
        jp: 'ありがとう',
        tags: ['courtesy'],
        intervals: {
          ease: 2.5,
          streak: 0,
          lastReview: undefined,
          nextReview: undefined,
        },
      },
    ]

    it('完了したレッスンのカードのみをフィルタする', () => {
      const completedIds = ['lesson1', 'lesson3']
      
      const filtered = filterLearnedCards(mockCards, completedIds)
      
      expect(filtered).toHaveLength(2)
      expect(filtered.map((c) => c.id)).toEqual(['lesson1', 'lesson3'])
    })

    it('完了レッスンが空の場合は空配列を返す', () => {
      const filtered = filterLearnedCards(mockCards, [])
      
      expect(filtered).toEqual([])
    })

    it('全てのカードが完了している場合は全てを返す', () => {
      const completedIds = ['lesson1', 'lesson2', 'lesson3']
      
      const filtered = filterLearnedCards(mockCards, completedIds)
      
      expect(filtered).toHaveLength(3)
    })

    it('存在しないIDは無視される', () => {
      const completedIds = ['lesson1', 'nonexistent']
      
      const filtered = filterLearnedCards(mockCards, completedIds)
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe('lesson1')
    })

    it('空のカード配列に対しても動作する', () => {
      const filtered = filterLearnedCards([], ['lesson1'])
      
      expect(filtered).toEqual([])
    })
  })
})
