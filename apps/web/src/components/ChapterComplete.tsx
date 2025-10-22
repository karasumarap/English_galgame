/**
 * ChapterComplete - チャプター完了画面
 */

import type { LessonCard } from '@engine/types'

interface ChapterCompleteProps {
  chapterNumber: number
  affection: number
  learnedCards: LessonCard[]
  onContinue: () => void
  onReturnToTitle: () => void
  onReview: () => void
}

const ChapterComplete = ({
  chapterNumber,
  affection,
  learnedCards,
  onContinue,
  onReturnToTitle,
  onReview,
}: ChapterCompleteProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-vn-bg p-8">
      <div className="max-w-2xl w-full bg-vn-dialog border-4 border-vn-accent rounded-lg p-8 shadow-2xl">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-vn-accent mb-2">
            Chapter {chapterNumber} Complete!
          </h1>
          <p className="text-xl text-vn-text">チャプター{chapterNumber}クリア！</p>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-vn-bg p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-vn-accent mb-1">{affection}</div>
            <div className="text-sm text-vn-text/70">好感度</div>
          </div>
          <div className="bg-vn-bg p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-vn-accent mb-1">
              {learnedCards.length}
            </div>
            <div className="text-sm text-vn-text/70">習得した表現</div>
          </div>
        </div>

        {/* 習得した表現リスト */}
        <div className="mb-8 max-h-64 overflow-y-auto">
          <h3 className="text-lg font-bold text-vn-text mb-3">習得した表現:</h3>
          <div className="space-y-2">
            {learnedCards.map((card) => (
              <div
                key={card.id}
                className="bg-vn-bg p-3 rounded-lg border border-vn-accent/30"
              >
                <div className="text-vn-text font-medium">{card.en}</div>
                <div className="text-vn-text/60 text-sm">{card.jp}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ボタン */}
        <div className="space-y-3">
          <button
            onClick={onReview}
            className="w-full px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white font-bold rounded-lg transition-all"
          >
            復習する Review
          </button>
          <button
            onClick={onContinue}
            className="w-full px-6 py-3 bg-vn-choice hover:bg-vn-choice-hover text-vn-text font-bold rounded-lg transition-all"
          >
            次のチャプターへ（準備中）
          </button>
          <button
            onClick={onReturnToTitle}
            className="w-full px-6 py-3 bg-vn-choice hover:bg-vn-choice-hover text-vn-text font-bold rounded-lg transition-all"
          >
            タイトルに戻る Return to Title
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChapterComplete
