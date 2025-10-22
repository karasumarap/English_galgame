/**
 * SRS (Spaced Repetition System)
 * 簡易SM-2アルゴリズムによる学習カードの復習管理
 */

import type { LessonCard } from './types'

export class SRSEngine {
  private cards: Map<string, LessonCard> = new Map()

  loadCards(cards: LessonCard[]): void {
    cards.forEach((card) => {
      this.cards.set(card.id, card)
    })
  }

  getCard(id: string): LessonCard | undefined {
    return this.cards.get(id)
  }

  getDueCards(): LessonCard[] {
    const now = new Date()
    return Array.from(this.cards.values()).filter((card) => {
      if (!card.intervals.nextReview) return true
      return new Date(card.intervals.nextReview) <= now
    })
  }

  reviewCard(id: string, quality: number): void {
    // quality: 0-5 (0=完全に忘れた, 5=完璧に覚えている)
    const card = this.cards.get(id)
    if (!card) return

    const { ease, streak } = card.intervals
    let newEase = ease
    let newStreak = streak

    if (quality < 3) {
      // 失敗
      newStreak = 0
      newEase = Math.max(1.3, ease - 0.2)
    } else {
      // 成功
      newStreak++
      newEase = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    }

    // 次回復習日を計算
    const intervalDays = this.calculateInterval(newStreak, newEase)
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + intervalDays)

    card.intervals = {
      ease: Math.max(1.3, Math.min(2.5, newEase)),
      streak: newStreak,
      lastReview: new Date(),
      nextReview,
    }
  }

  private calculateInterval(streak: number, ease: number): number {
    if (streak === 0) return 0
    if (streak === 1) return 1
    if (streak === 2) return 3

    // SM-2: interval = previous_interval * ease
    let interval = 3
    for (let i = 2; i < streak; i++) {
      interval = Math.round(interval * ease)
    }

    return Math.min(interval, 365) // 最大1年
  }

  getStats(): {
    total: number
    due: number
    new: number
    learning: number
  } {
    const cards = Array.from(this.cards.values())
    const now = new Date()

    return {
      total: cards.length,
      due: cards.filter(
        (c) => c.intervals.nextReview && new Date(c.intervals.nextReview) <= now
      ).length,
      new: cards.filter((c) => !c.intervals.lastReview).length,
      learning: cards.filter((c) => c.intervals.streak > 0 && c.intervals.streak < 3)
        .length,
    }
  }
}
