import { useState } from 'react'
import GameScreen from '@components/GameScreen'

function App() {
  const [gameStarted, setGameStarted] = useState(false)

  if (!gameStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-vn-bg">
        <div className="text-center space-y-6 p-8">
          <h1 className="text-5xl font-bold text-vn-accent mb-4">
            English Learning Visual Novel
          </h1>
          <p className="text-xl text-vn-text/80 mb-8">
            恋愛シミュレーションで英語を学ぼう
          </p>
          <button
            onClick={() => setGameStarted(true)}
            className="px-8 py-4 bg-vn-accent hover:bg-vn-accent/80 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105"
          >
            ゲームを始める
          </button>
        </div>
      </div>
    )
  }

  return <GameScreen />
}

export default App
