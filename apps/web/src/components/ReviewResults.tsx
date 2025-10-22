/**
 * ReviewResults - 復習結果画面
 */

interface ReviewResultsProps {
  correct: number
  total: number
  onRetry: () => void
  onExit: () => void
}

const ReviewResults = ({ correct, total, onRetry, onExit }: ReviewResultsProps) => {
  const percentage = Math.round((correct / total) * 100)
  
  const getMessage = () => {
    if (percentage >= 90) return { text: 'Perfect! 完璧です！', emoji: '🌟' }
    if (percentage >= 70) return { text: 'Great! よくできました！', emoji: '🎉' }
    if (percentage >= 50) return { text: 'Good! いい調子です！', emoji: '👍' }
    return { text: 'Keep practicing! 練習を続けましょう！', emoji: '💪' }
  }

  const message = getMessage()

  return (
    <div className="flex items-center justify-center min-h-screen bg-vn-bg p-8">
      <div className="max-w-2xl w-full bg-vn-dialog border-4 border-vn-accent rounded-lg p-8 shadow-2xl text-center">
        {/* 結果 */}
        <div className="text-6xl mb-4">{message.emoji}</div>
        <h2 className="text-3xl font-bold text-vn-accent mb-2">{message.text}</h2>
        
        {/* スコア */}
        <div className="my-8">
          <div className="text-6xl font-bold text-vn-text mb-2">
            {correct} / {total}
          </div>
          <div className="text-2xl text-vn-text/70">{percentage}%</div>
        </div>

        {/* 詳細 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-vn-bg p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{correct}</div>
            <div className="text-sm text-vn-text/70">正解</div>
          </div>
          <div className="bg-vn-bg p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{total - correct}</div>
            <div className="text-sm text-vn-text/70">不正解</div>
          </div>
        </div>

        {/* ボタン */}
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white font-bold rounded-lg transition-all"
          >
            もう一度復習する
          </button>
          <button
            onClick={onExit}
            className="w-full px-6 py-3 bg-vn-choice hover:bg-vn-choice-hover text-vn-text font-bold rounded-lg transition-all"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewResults
