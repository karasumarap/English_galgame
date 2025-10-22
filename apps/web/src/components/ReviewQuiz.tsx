/**
 * ReviewQuiz - 復習クイズコンポーネント
 */

import { useState, useEffect } from 'react'
import type { LessonCard } from '@engine/types'

type QuizType = 'recall-en-jp' | 'recall-jp-en' | 'fill' | 'order'

interface ReviewQuizProps {
  cards: LessonCard[]
  onComplete: (results: { correct: number; total: number }) => void
  onExit: () => void
}

const ReviewQuiz = ({ cards, onComplete, onExit }: ReviewQuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [quizType, setQuizType] = useState<QuizType>('recall-en-jp')
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [results, setResults] = useState<boolean[]>([])

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100

  useEffect(() => {
    // カードごとにランダムなクイズタイプを選択
    const types: QuizType[] = ['recall-en-jp', 'recall-jp-en', 'fill', 'order']
    setQuizType(types[Math.floor(Math.random() * types.length)])
  }, [currentIndex])

  const handleSubmit = (isCorrect: boolean) => {
    setResults([...results, isCorrect])
    setShowAnswer(true)
  }

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer('')
      setShowAnswer(false)
    } else {
      // クイズ完了
      const correct = results.filter((r) => r).length
      onComplete({ correct, total: cards.length })
    }
  }

  const renderQuiz = () => {
    if (!currentCard) return null

    switch (quizType) {
      case 'recall-en-jp':
        return (
          <div>
            <h3 className="text-2xl font-bold text-vn-text mb-4">
              この英語の意味は？
            </h3>
            <div className="text-3xl text-vn-accent font-bold mb-6">
              {currentCard.en}
            </div>
            {!showAnswer ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="日本語で答えてください"
                  className="w-full px-4 py-3 bg-vn-bg text-vn-text border-2 border-vn-accent/50 rounded-lg focus:outline-none focus:border-vn-accent"
                  autoFocus
                />
                <button
                  onClick={() => handleSubmit(userAnswer.trim() === currentCard.jp)}
                  className="w-full px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white font-bold rounded-lg"
                >
                  答え合わせ
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-vn-bg p-4 rounded-lg border-2 border-vn-accent">
                  <div className="text-sm text-vn-text/70 mb-1">正解:</div>
                  <div className="text-xl text-vn-text">{currentCard.jp}</div>
                </div>
                <div className="bg-vn-bg p-4 rounded-lg">
                  <div className="text-sm text-vn-text/70 mb-1">あなたの答え:</div>
                  <div className="text-xl text-vn-text">{userAnswer || '（未入力）'}</div>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white font-bold rounded-lg"
                >
                  {currentIndex < cards.length - 1 ? '次へ' : '結果を見る'}
                </button>
              </div>
            )}
          </div>
        )

      case 'recall-jp-en':
        return (
          <div>
            <h3 className="text-2xl font-bold text-vn-text mb-4">
              英語で何と言う？
            </h3>
            <div className="text-3xl text-vn-accent font-bold mb-6">
              {currentCard.jp}
            </div>
            {!showAnswer ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="英語で答えてください"
                  className="w-full px-4 py-3 bg-vn-bg text-vn-text border-2 border-vn-accent/50 rounded-lg focus:outline-none focus:border-vn-accent"
                  autoFocus
                />
                <button
                  onClick={() =>
                    handleSubmit(
                      userAnswer.toLowerCase().trim() === currentCard.en.toLowerCase().trim()
                    )
                  }
                  className="w-full px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white font-bold rounded-lg"
                >
                  答え合わせ
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-vn-bg p-4 rounded-lg border-2 border-vn-accent">
                  <div className="text-sm text-vn-text/70 mb-1">正解:</div>
                  <div className="text-xl text-vn-text">{currentCard.en}</div>
                </div>
                <div className="bg-vn-bg p-4 rounded-lg">
                  <div className="text-sm text-vn-text/70 mb-1">あなたの答え:</div>
                  <div className="text-xl text-vn-text">{userAnswer || '（未入力）'}</div>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white font-bold rounded-lg"
                >
                  {currentIndex < cards.length - 1 ? '次へ' : '結果を見る'}
                </button>
              </div>
            )}
          </div>
        )

      case 'fill':
        // 簡易的な穴埋め
        const words = currentCard.en.split(' ')
        const blankIndex = Math.floor(words.length / 2)
        const answer = words[blankIndex]
        const question = words
          .map((w, i) => (i === blankIndex ? '______' : w))
          .join(' ')

        return (
          <div>
            <h3 className="text-2xl font-bold text-vn-text mb-4">穴埋め問題</h3>
            <div className="text-2xl text-vn-accent font-bold mb-2">{question}</div>
            <div className="text-lg text-vn-text/70 mb-6">{currentCard.jp}</div>
            {!showAnswer ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="空欄に入る単語"
                  className="w-full px-4 py-3 bg-vn-bg text-vn-text border-2 border-vn-accent/50 rounded-lg focus:outline-none focus:border-vn-accent"
                  autoFocus
                />
                <button
                  onClick={() =>
                    handleSubmit(userAnswer.toLowerCase().trim() === answer.toLowerCase())
                  }
                  className="w-full px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white font-bold rounded-lg"
                >
                  答え合わせ
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-vn-bg p-4 rounded-lg border-2 border-vn-accent">
                  <div className="text-sm text-vn-text/70 mb-1">正解:</div>
                  <div className="text-xl text-vn-text">{answer}</div>
                  <div className="text-sm text-vn-text/70 mt-2">完全な文:</div>
                  <div className="text-lg text-vn-text">{currentCard.en}</div>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white font-bold rounded-lg"
                >
                  {currentIndex < cards.length - 1 ? '次へ' : '結果を見る'}
                </button>
              </div>
            )}
          </div>
        )

      case 'order':
        // 並べ替え（簡易実装）
        return (
          <div>
            <h3 className="text-2xl font-bold text-vn-text mb-4">並べ替え問題</h3>
            <div className="text-lg text-vn-text/70 mb-4">
              {currentCard.jp}
            </div>
            <div className="bg-vn-bg p-4 rounded-lg mb-6">
              <div className="text-sm text-vn-text/70 mb-2">正しい順序に並べてください:</div>
              <div className="flex flex-wrap gap-2">
                {currentCard.en
                  .split(' ')
                  .sort(() => Math.random() - 0.5)
                  .map((word, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-vn-choice text-vn-text rounded border-2 border-vn-accent/30"
                    >
                      {word}
                    </span>
                  ))}
              </div>
            </div>
            {!showAnswer ? (
              <button
                onClick={() => {
                  setShowAnswer(true)
                  handleSubmit(true) // 並べ替えは手動評価
                }}
                className="w-full px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white font-bold rounded-lg"
              >
                答えを見る
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-vn-bg p-4 rounded-lg border-2 border-vn-accent">
                  <div className="text-sm text-vn-text/70 mb-1">正解:</div>
                  <div className="text-xl text-vn-text">{currentCard.en}</div>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white font-bold rounded-lg"
                >
                  {currentIndex < cards.length - 1 ? '次へ' : '結果を見る'}
                </button>
              </div>
            )}
          </div>
        )
    }
  }

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-vn-bg">
        <div className="text-center">
          <p className="text-2xl text-vn-text mb-4">復習するカードがありません</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-vn-accent text-white rounded-lg"
          >
            戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-vn-bg p-8">
      <div className="max-w-2xl w-full">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-vn-accent">復習クイズ</h2>
            <button
              onClick={onExit}
              className="px-4 py-2 bg-vn-choice hover:bg-vn-choice-hover text-vn-text rounded-lg"
            >
              終了
            </button>
          </div>
          <div className="bg-vn-dialog rounded-full h-2 overflow-hidden">
            <div
              className="bg-vn-accent h-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-vn-text/70 text-sm mt-1">
            {currentIndex + 1} / {cards.length}
          </p>
        </div>

        {/* クイズカード */}
        <div className="bg-vn-dialog border-2 border-vn-accent/30 rounded-lg p-8 shadow-2xl">
          {renderQuiz()}
        </div>

        {/* コンテキストヒント */}
        {currentCard?.context && (
          <div className="mt-4 bg-vn-dialog/50 p-4 rounded-lg">
            <div className="text-xs text-vn-text/50 mb-1">💡 使い方のヒント:</div>
            <div className="text-sm text-vn-text/70">{currentCard.context}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewQuiz
