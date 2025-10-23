/**
 * VoiceConversation - 音声会話画面
 * Web Speech APIを使用した音声認識と音声合成機能
 */

import { useState, useEffect, useRef } from 'react'
import type { Character, Language } from '@engine/types'

interface VoiceConversationProps {
  character: Character
  language: Language
  currentAffection: number
  onAffectionChange: (delta: number) => void
  onExit: () => void
}

interface Message {
  speaker: 'user' | 'character'
  text: string
  timestamp: Date
}

const VoiceConversation = ({
  character,
  language,
  currentAffection,
  onAffectionChange,
  onExit,
}: VoiceConversationProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [supported, setSupported] = useState(true)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // グリーティングメッセージ
  const greetingMessages: Record<Language, string[]> = {
    en: [
      "Hi! I'm happy to talk with you!",
      "Hello! Let's practice English together!",
      "Nice to see you! How are you doing?",
    ],
    jp: [
      "こんにちは！お話しできて嬉しいです！",
      "ハロー！一緒に英語の練習をしましょう！",
      "会えて嬉しいです！調子はどうですか？",
    ],
  }

  // 簡単な応答パターン（後でLLM/APIに置き換え可能）
  const responsePatterns: Record<string, { en: string; jp: string; affection: number }> = {
    hello: {
      en: "Hello! I'm glad you're here!",
      jp: "こんにちは！来てくれて嬉しいです！",
      affection: 1,
    },
    'how are you': {
      en: "I'm doing great, thanks for asking!",
      jp: "元気です、聞いてくれてありがとう！",
      affection: 2,
    },
    'i love you': {
      en: "Oh my... that makes me so happy!",
      jp: "えっと...それはとても嬉しいです！",
      affection: 5,
    },
    thank: {
      en: "You're very welcome!",
      jp: "どういたしまして！",
      affection: 1,
    },
    bye: {
      en: "See you later! It was nice talking with you!",
      jp: "またね！お話しできて楽しかったです！",
      affection: 1,
    },
  }

  useEffect(() => {
    // Web Speech API対応チェック
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const speechSynthesis = window.speechSynthesis

    if (!SpeechRecognition || !speechSynthesis) {
      setSupported(false)
      setError('お使いのブラウザは音声機能に対応していません。Chrome、Edge、Safariをお使いください。')
      return
    }

    // 音声認識の初期化
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = language === 'en' ? 'en-US' : 'ja-JP'

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      
      // ユーザーメッセージを追加
      setMessages((prev) => [...prev, { speaker: 'user', text: result, timestamp: new Date() }])
      
      // 簡単なパターンマッチング
      const lowerText = result.toLowerCase()
      let response: string | null = null
      let affectionDelta = 0

      for (const [pattern, data] of Object.entries(responsePatterns)) {
        if (lowerText.includes(pattern)) {
          response = data[language]
          affectionDelta = data.affection
          break
        }
      }

      // デフォルトレスポンス
      if (!response) {
        const defaultResponses = {
          en: [
            "That's interesting! Tell me more.",
            "I see! Thanks for sharing that.",
            "Oh really? That's nice!",
          ],
          jp: [
            "面白いですね！もっと教えてください。",
            "なるほど！教えてくれてありがとう。",
            "本当ですか？それは良いですね！",
          ],
        }
        response = defaultResponses[language][Math.floor(Math.random() * 3)]
        affectionDelta = 1
      }

      // 好感度を更新
      onAffectionChange(affectionDelta)

      // キャラクターの応答
      const finalResponse = response
      setTimeout(() => {
        setMessages((prev) => [...prev, { speaker: 'character', text: finalResponse, timestamp: new Date() }])
        
        // 音声合成
        const utterance = new SpeechSynthesisUtterance(finalResponse)
        utterance.lang = language === 'en' ? 'en-US' : 'ja-JP'
        utterance.rate = 0.9
        utterance.pitch = 1.1

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        speechSynthesis.speak(utterance)
      }, 500)
      
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setError(`音声認識エラー: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    synthesisRef.current = speechSynthesis

    // 初期グリーティング
    const greeting = greetingMessages[language][0]
    setMessages([{ speaker: 'character', text: greeting, timestamp: new Date() }])
    
    const utterance = new SpeechSynthesisUtterance(greeting)
    utterance.lang = language === 'en' ? 'en-US' : 'ja-JP'
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    speechSynthesis.speak(utterance)

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 言語が変わったら音声認識の言語も変更
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 'ja-JP'
    }
  }, [language])

  // メッセージが追加されたらスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startListening = () => {
    if (!recognitionRef.current || isListening) return

    setError(null)
    setTranscript('')
    setIsListening(true)

    try {
      recognitionRef.current.start()
    } catch (err) {
      console.error('Failed to start recognition:', err)
      setError('音声認識を開始できませんでした')
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  if (!supported) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-vn-bg">
        <div className="bg-vn-dialog p-8 rounded-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-vn-accent mb-4">未対応のブラウザ</h2>
          <p className="text-vn-text mb-4">{error}</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white rounded-lg"
          >
            戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-vn-bg">
      {/* ヘッダー */}
      <div className="bg-vn-dialog border-b border-vn-text/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-vn-accent">
            🎤 音声会話 - {character.name[language]}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-vn-text">
            💖 好感度: <span className="font-bold text-vn-accent">{currentAffection}</span>
          </div>
          <button
            onClick={onExit}
            className="px-4 py-2 bg-vn-choice hover:bg-vn-choice-hover text-vn-text rounded-lg"
          >
            終了
          </button>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md px-4 py-3 rounded-lg ${
                msg.speaker === 'user'
                  ? 'bg-vn-accent text-white'
                  : 'bg-vn-dialog text-vn-text border border-vn-text/20'
              }`}
            >
              <div className="font-medium mb-1">
                {msg.speaker === 'user' ? 'あなた' : character.name[language]}
              </div>
              <div>{msg.text}</div>
              <div className="text-xs opacity-70 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* コントロールエリア */}
      <div className="bg-vn-dialog border-t border-vn-text/20 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {transcript && (
          <div className="mb-4 p-3 bg-vn-choice/50 rounded-lg text-vn-text">
            認識: {transcript}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className={`flex-1 px-6 py-4 rounded-lg font-bold text-lg transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : isSpeaking
                ? 'bg-gray-500 text-white cursor-not-allowed'
                : 'bg-vn-accent hover:bg-vn-accent/80 text-white'
            }`}
          >
            {isListening ? '🎤 録音中... (クリックで停止)' : isSpeaking ? '🔊 話しています...' : '🎤 話す'}
          </button>
        </div>

        <div className="mt-4 text-sm text-vn-text/60 text-center">
          {language === 'en'
            ? 'マイクボタンを押して英語で話してください'
            : 'マイクボタンを押して日本語で話してください'}
        </div>
      </div>
    </div>
  )
}

export default VoiceConversation
