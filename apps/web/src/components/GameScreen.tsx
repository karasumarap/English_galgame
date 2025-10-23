/**
 * GameScreen - メインゲーム画面
 * VNエンジンとUIコンポーネントを統合
 */

import { useEffect, useState } from 'react'
import { VNEngine } from '@engine/runtime'
import { loadScene } from '@engine/loader'
import { loadLessonCards, filterLearnedCards } from '@engine/cardLoader'
import { useGameStore } from '@state/gameStore'
import type { Scene, ScriptCommand, LessonCard } from '@engine/types'
import type { SaveData } from '@systems/saveLoad'
import DialogueBox from './DialogueBox'
import ChoiceList from './ChoiceList'
import Background from './Background'
import ChapterComplete from './ChapterComplete'
import ReviewQuiz from './ReviewQuiz'
import ReviewResults from './ReviewResults'
import SaveLoadMenu from './SaveLoadMenu'
import SettingsMenu from './SettingsMenu'
import VoiceConversation from './VoiceConversation'

const GameScreen = () => {
  const [engine] = useState(() => new VNEngine())
  const [scene, setScene] = useState<Scene | null>(null)
  const [currentCommand, setCurrentCommand] = useState<ScriptCommand | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chapterComplete, setChapterComplete] = useState(false)
  const [learnedCards, setLearnedCards] = useState<LessonCard[]>([])
  const [showReview, setShowReview] = useState(false)
  const [reviewResults, setReviewResults] = useState<{ correct: number; total: number } | null>(
    null
  )
  const [showSaveMenu, setShowSaveMenu] = useState(false)
  const [showLoadMenu, setShowLoadMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showVoiceConversation, setShowVoiceConversation] = useState(false)
  const [allCards, setAllCards] = useState<LessonCard[]>([])

  // ストアから言語を取得
  const language = useGameStore((state) => state.language)

  // 言語が変わったらエンジンに反映
  useEffect(() => {
    engine.setLanguage(language)
  }, [language, engine])

  useEffect(() => {
    // 初期シーンと学習カードをロード
    console.log('🎬 初期化開始')
    Promise.all([
      loadScene('chap1_intro'),
      loadLessonCards('chap1_intro')
    ])
      .then(([loadedScene, cards]) => {
        console.log('🎬 シーンロード完了:', loadedScene.id)
        console.log('🎬 カードロード完了:', cards.length, '枚')
        engine.loadScene(loadedScene)
        setScene(loadedScene)
        setAllCards(cards)
        
        // 最初の表示可能なコマンドを取得
        let cmd = engine.getCurrentCommand()
        while (cmd && (cmd.type === 'label' || cmd.type === 'set')) {
          engine.next()
          cmd = engine.getCurrentCommand()
        }
        setCurrentCommand(cmd)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('❌ Failed to load initial scene:', error)
        setIsLoading(false)
      })
  }, [engine])

  const handleNext = () => {
    engine.next()
    // ラベルなどの非表示コマンドをスキップ
    let nextCmd = engine.getCurrentCommand()
    while (nextCmd && (nextCmd.type === 'label' || nextCmd.type === 'set')) {
      engine.next()
      nextCmd = engine.getCurrentCommand()
    }
    
    // 終了コマンドの場合
    if (nextCmd?.type === 'end') {
      handleChapterEnd()
      return
    }
    
    setCurrentCommand(nextCmd)
  }

  const handleOpenSaveMenu = () => setShowSaveMenu(true)
  const handleOpenLoadMenu = () => setShowLoadMenu(true)
  const handleCloseSaveMenu = () => setShowSaveMenu(false)
  const handleCloseLoadMenu = () => setShowLoadMenu(false)
  const handleOpenSettings = () => setShowSettings(true)
  const handleCloseSettings = () => setShowSettings(false)
  const handleOpenVoiceConversation = () => setShowVoiceConversation(true)
  const handleCloseVoiceConversation = () => setShowVoiceConversation(false)

  const handleAffectionChange = (delta: number) => {
    const state = engine.getState()
    const currentAffection = state.affection['heroine'] || 0
    const newAffection = currentAffection + delta
    engine.setAffection('heroine', newAffection)
  }

    const handleLoadState = async (saveData: SaveData) => {
    console.log('🟡 ロード開始:', {
      currentLine: saveData.currentLine,
      scene: saveData.currentScene,
      flags: saveData.flags
    })
    
    // シーンをロード
    await loadScene(saveData.currentScene)
    
    // エンジン状態を復元
    engine.setState(saveData)
    
    // 現在のコマンドを取得して表示
    const cmd = engine.getCurrentCommand()
    console.log('🟡 ロード後のコマンド:', {
      type: cmd?.type,
      currentLine: engine.getState().currentLine
    })
    setCurrentCommand(cmd)
    
    setShowSaveMenu(false)
  }

  const handleChapterEnd = async () => {
    const state = engine.getState()
    console.log('🎯 チャプター完了処理:')
    console.log('- completedLessons:', state.completedLessons)
    console.log('- allCards.length:', allCards.length)
    console.log('- allCards:', allCards.map(c => c.id))
    
    // 学習カードをフィルタリング
    const learned = filterLearnedCards(allCards, state.completedLessons)
    console.log('- learned.length:', learned.length)
    console.log('- learned:', learned.map(c => c.id))
    
    setLearnedCards(learned)
    setChapterComplete(true)
  }

  const handleReturnToTitle = () => {
    window.location.reload() // 簡易的にリロード
  }

  const handleContinue = () => {
    alert('次のチャプターは準備中です！')
  }

  const handleStartReview = () => {
    setShowReview(true)
    setChapterComplete(false)
    setReviewResults(null)
  }

  const handleReviewComplete = (results: { correct: number; total: number }) => {
    setReviewResults(results)
    setShowReview(false)
  }

  const handleRetryReview = () => {
    setReviewResults(null)
    setShowReview(true)
  }

  const handleExitReview = () => {
    setShowReview(false)
    setReviewResults(null)
    setChapterComplete(true)
  }

  const handleChoice = (optionId: string) => {
    const cmd = currentCommand
    if (cmd?.type === 'choice') {
      engine.executeChoice(optionId, cmd)
      // ラベルなどの非表示コマンドをスキップ
      let nextCmd = engine.getCurrentCommand()
      console.log('After executeChoice, current command:', nextCmd)
      while (nextCmd && (nextCmd.type === 'label' || nextCmd.type === 'set')) {
        engine.next()
        nextCmd = engine.getCurrentCommand()
        console.log('Skipped to:', nextCmd)
      }
      setCurrentCommand(nextCmd)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-vn-bg">
        <div className="text-2xl text-vn-text">Loading...</div>
      </div>
    )
  }

  if (!scene) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-vn-bg">
        <div className="text-2xl text-vn-text">シーンが見つかりません</div>
      </div>
    )
  }

  // チャプター完了画面
  if (chapterComplete) {
    return (
      <ChapterComplete
        chapterNumber={1}
        affection={engine.getState().affection['heroine'] || 0}
        learnedCards={learnedCards}
        onContinue={handleContinue}
        onReturnToTitle={handleReturnToTitle}
        onReview={handleStartReview}
      />
    )
  }

  // 復習画面（後で実装）
  if (showReview) {
    return (
      <ReviewQuiz
        cards={learnedCards}
        onComplete={handleReviewComplete}
        onExit={handleExitReview}
      />
    )
  }

  // 復習結果画面
  if (reviewResults) {
    return (
      <ReviewResults
        correct={reviewResults.correct}
        total={reviewResults.total}
        onRetry={handleRetryReview}
        onExit={handleExitReview}
      />
    )
  }

  // 音声会話画面
  if (showVoiceConversation && scene) {
    const emma = scene.characters.find((c) => c.id === 'emma')
    if (emma) {
      return (
        <VoiceConversation
          character={emma}
          language={language}
          currentAffection={engine.getState().affection['heroine'] || 0}
          onAffectionChange={handleAffectionChange}
          onExit={handleCloseVoiceConversation}
        />
      )
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-vn-bg">
      {/* 背景 */}
      <Background image={scene.background} />

      {/* HUD: セーブ/ロードボタン */}
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <button
          onClick={handleOpenSaveMenu}
          className="px-3 py-2 bg-vn-choice hover:bg-vn-choice-hover text-vn-text rounded-md text-sm font-medium"
        >
          💾 Save
        </button>
        <button
          onClick={handleOpenLoadMenu}
          className="px-3 py-2 bg-vn-choice hover:bg-vn-choice-hover text-vn-text rounded-md text-sm font-medium"
        >
          📂 Load
        </button>
        <button
          onClick={handleOpenSettings}
          className="px-3 py-2 bg-vn-choice hover:bg-vn-choice-hover text-vn-text rounded-md text-sm font-medium"
        >
          ⚙️ Settings
        </button>
        <button
          onClick={handleOpenVoiceConversation}
          className="px-3 py-2 bg-vn-accent hover:bg-vn-accent/80 text-white rounded-md text-sm font-medium"
        >
          🎤 Voice Chat
        </button>
      </div>

      {/* メインコンテンツエリア */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end p-8">
        {/* デバッグ情報 */}
        {!currentCommand && (
          <div className="bg-red-500 p-4 rounded-lg mb-4">
            <p className="text-white">No current command! Scene ended or error occurred.</p>
          </div>
        )}

        {/* セリフ表示 */}
        {currentCommand?.type === 'say' && (
          <DialogueBox
            character={scene.characters.find((c) => c.id === currentCommand.who)}
            text={currentCommand.text}
            language={engine.getLanguage()}
            onNext={handleNext}
          />
        )}

        {/* 選択肢表示 */}
        {currentCommand?.type === 'choice' && (
          <ChoiceList
            prompt={currentCommand.prompt}
            options={currentCommand.options}
            language={engine.getLanguage()}
            onSelect={handleChoice}
          />
        )}

        {/* Quiz は後で実装 */}
        {currentCommand?.type === 'quiz' && (
          <div className="bg-vn-dialog p-6 rounded-lg">
            <p className="text-vn-text">Quiz: {currentCommand.item_key}</p>
            <button
              onClick={() => engine.executeQuiz(true, currentCommand)}
              className="mt-4 px-4 py-2 bg-vn-accent rounded"
            >
              Continue
            </button>
          </div>
        )}
      </div>

      {/* HUD（好感度など） */}
      <div className="absolute top-4 right-4 bg-vn-dialog/80 p-4 rounded-lg">
        <div className="text-vn-text text-sm">
          好感度: {engine.getState().affection['heroine'] || 0}
        </div>
      </div>

      {/* セーブ/ロードメニュー */}
      {showSaveMenu && (
        <SaveLoadMenu
          currentState={engine.getState()}
          mode="save"
          onLoad={() => {}}
          onClose={handleCloseSaveMenu}
        />
      )}

      {showLoadMenu && (
        <SaveLoadMenu
          currentState={engine.getState()}
          mode="load"
          onLoad={(state) => handleLoadState(state)}
          onClose={handleCloseLoadMenu}
        />
      )}

      {/* 設定メニュー */}
      {showSettings && <SettingsMenu onClose={handleCloseSettings} />}
    </div>
  )
}

export default GameScreen
