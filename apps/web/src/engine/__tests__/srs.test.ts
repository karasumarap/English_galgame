import { describe, it, expect, beforeEach } from 'vitest'
import { SRSEngine } from '../srs'
import type { LessonCard } from '../types'

describe('SRSEngine', () => {
  let srs: SRSEngine
  let sampleCards: LessonCard[]

  beforeEach(() => {
    srs = new SRSEngine()
    sampleCards = [
      {
        id: 'card1',
        en: 'Hello',
        jp: 'こんにちは',
        tags: ['greeting'],
        intervals: {
          ease: 2.5,
          streak: 0,
          lastReview: new Date('2024-01-01'),
          nextReview: new Date('2024-01-01'),
        },
      },
      {
        id: 'card2',
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
  })

  describe('loadCards', () => {
    it('カードを正しくロードできる', () => {
      srs.loadCards(sampleCards)
      
      const card1 = srs.getCard('card1')
      expect(card1).toBeDefined()
      expect(card1?.en).toBe('Hello')
    })

    it('複数のカードをロードできる', () => {
      srs.loadCards(sampleCards)
      
      expect(srs.getCard('card1')).toBeDefined()
      expect(srs.getCard('card2')).toBeDefined()
    })
  })

  describe('getCard', () => {
    it('存在するカードを取得できる', () => {
      srs.loadCards(sampleCards)
      
      const card = srs.getCard('card1')
      expect(card).toBeDefined()
      expect(card?.id).toBe('card1')
    })

    it('存在しないカードはundefinedを返す', () => {
      srs.loadCards(sampleCards)
      
      const card = srs.getCard('nonexistent')
      expect(card).toBeUndefined()
    })
  })

  describe('getDueCards', () => {
    it('復習期限が来たカードを取得できる', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      
      const dueCards: LessonCard[] = [
        {
          id: 'due1',
          en: 'Past due',
          jp: '期限切れ',
          tags: ['test'],
          intervals: {
            ease: 2.5,
            streak: 1,
            lastReview: new Date('2024-01-01'),
            nextReview: pastDate,
          },
        },
      ]
      
      srs.loadCards(dueCards)
      
      const due = srs.getDueCards()
      expect(due).toHaveLength(1)
      expect(due[0].id).toBe('due1')
    })

    it('nextReviewがnullのカードは復習対象に含まれる', () => {
      srs.loadCards(sampleCards)
      
      const due = srs.getDueCards()
      expect(due.length).toBeGreaterThan(0)
    })

    it('復習期限が未来のカードは取得されない', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 10)
      
      const futureCards: LessonCard[] = [
        {
          id: 'future1',
          en: 'Future',
          jp: '未来',
          tags: ['test'],
          intervals: {
            ease: 2.5,
            streak: 2,
            lastReview: new Date(),
            nextReview: futureDate,
          },
        },
      ]
      
      srs.loadCards(futureCards)
      
      const due = srs.getDueCards()
      expect(due).toHaveLength(0)
    })
  })

  describe('reviewCard', () => {
    beforeEach(() => {
      srs.loadCards(sampleCards)
    })

    it('quality >= 3で成功として記録される', () => {
      const cardBefore = srs.getCard('card1')
      const initialStreak = cardBefore!.intervals.streak
      
      srs.reviewCard('card1', 4)
      
      const cardAfter = srs.getCard('card1')
      expect(cardAfter!.intervals.streak).toBe(initialStreak + 1)
      expect(cardAfter!.intervals.lastReview).toBeDefined()
      expect(cardAfter!.intervals.nextReview).toBeDefined()
    })

    it('quality < 3で失敗として記録される', () => {
      srs.reviewCard('card1', 2)
      
      const card = srs.getCard('card1')
      expect(card!.intervals.streak).toBe(0)
    })

    it('失敗するとeaseが減少する', () => {
      const cardBefore = srs.getCard('card1')
      const initialEase = cardBefore!.intervals.ease
      
      srs.reviewCard('card1', 1)
      
      const cardAfter = srs.getCard('card1')
      expect(cardAfter!.intervals.ease).toBeLessThan(initialEase)
    })

    it('成功するとeaseが増加する可能性がある', () => {
      const cardBefore = srs.getCard('card1')
      const initialEase = cardBefore!.intervals.ease
      
      srs.reviewCard('card1', 5)
      
      const cardAfter = srs.getCard('card1')
      expect(cardAfter!.intervals.ease).toBeGreaterThanOrEqual(initialEase)
    })

    it('easeは1.3以上2.5以下に制限される', () => {
      // 何度も失敗させる
      for (let i = 0; i < 10; i++) {
        srs.reviewCard('card1', 0)
      }
      
      const cardAfterFailures = srs.getCard('card1')
      expect(cardAfterFailures!.intervals.ease).toBeGreaterThanOrEqual(1.3)
      
      // 新しいカードで何度も成功させる
      const highEaseCard: LessonCard = {
        id: 'highease',
        en: 'High ease',
        jp: '高ease',
        tags: ['test'],
        intervals: {
          ease: 2.4,
          streak: 0,
          lastReview: undefined,
          nextReview: undefined,
        },
      }
      srs.loadCards([highEaseCard])
      
      for (let i = 0; i < 10; i++) {
        srs.reviewCard('highease', 5)
      }
      
      const cardAfterSuccesses = srs.getCard('highease')
      expect(cardAfterSuccesses!.intervals.ease).toBeLessThanOrEqual(2.5)
    })

    it('存在しないカードのreviewは何もしない', () => {
      expect(() => {
        srs.reviewCard('nonexistent', 5)
      }).not.toThrow()
    })
  })

  describe('getStats', () => {
    it('統計情報を正しく取得できる', () => {
      srs.loadCards(sampleCards)
      
      const stats = srs.getStats()
      
      expect(stats.total).toBe(2)
      expect(stats.new).toBeGreaterThan(0)
      expect(typeof stats.due).toBe('number')
      expect(typeof stats.learning).toBe('number')
    })

    it('空の状態で統計を取得できる', () => {
      const stats = srs.getStats()
      
      expect(stats.total).toBe(0)
      expect(stats.due).toBe(0)
      expect(stats.new).toBe(0)
      expect(stats.learning).toBe(0)
    })

    it('learning状態のカードを正しくカウントする', () => {
      const learningCards: LessonCard[] = [
        {
          id: 'learning1',
          en: 'Learning',
          jp: '学習中',
          tags: ['test'],
          intervals: {
            ease: 2.5,
            streak: 1,
            lastReview: new Date(),
            nextReview: new Date(),
          },
        },
        {
          id: 'learning2',
          en: 'Learning 2',
          jp: '学習中2',
          tags: ['test'],
          intervals: {
            ease: 2.5,
            streak: 2,
            lastReview: new Date(),
            nextReview: new Date(),
          },
        },
        {
          id: 'mastered',
          en: 'Mastered',
          jp: 'マスター済み',
          tags: ['test'],
          intervals: {
            ease: 2.5,
            streak: 5,
            lastReview: new Date(),
            nextReview: new Date(),
          },
        },
      ]
      
      srs.loadCards(learningCards)
      
      const stats = srs.getStats()
      expect(stats.learning).toBe(2)
    })
  })
})
