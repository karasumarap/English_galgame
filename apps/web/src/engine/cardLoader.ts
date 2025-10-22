/**
 * 学習カードローダー
 */

import type { LessonCard } from './types'
import chap1Cards from '../lessons/chap1_cards.json'

// カードマップ（章IDからカードへのマッピング）
const cardMap: Record<string, LessonCard[]> = {
  'chap1_intro': chap1Cards as LessonCard[]
}

export async function loadLessonCards(chapterId: string): Promise<LessonCard[]> {
  console.log('📚 カード読み込み開始:', chapterId)
  const cards = cardMap[chapterId] || []
  console.log('📚 カード読み込み成功:', cards.length, '枚')
  return cards
}

export function filterLearnedCards(
  allCards: LessonCard[],
  completedLessonIds: string[]
): LessonCard[] {
  return allCards.filter((card) => completedLessonIds.includes(card.id))
}
