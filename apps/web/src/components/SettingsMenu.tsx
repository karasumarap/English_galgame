/**
 * SettingsMenu - 設定画面
 */

import { useState, useEffect } from 'react'
import { useGameStore } from '@state/gameStore'
import type { Language } from '@engine/types'

interface SettingsMenuProps {
  onClose: () => void
}

const SettingsMenu = ({ onClose }: SettingsMenuProps) => {
  const {
    language,
    textSpeed,
    volume,
    setLanguage,
    setTextSpeed,
    setVolume,
  } = useGameStore()

  const [tempLanguage, setTempLanguage] = useState<Language>(language)
  const [tempTextSpeed, setTempTextSpeed] = useState(textSpeed)
  const [tempVolumeBgm, setTempVolumeBgm] = useState(volume.bgm)
  const [tempVolumeVoice, setTempVolumeVoice] = useState(volume.voice)
  const [tempVolumeSe, setTempVolumeSe] = useState(volume.se)

  useEffect(() => {
    setTempLanguage(language)
    setTempTextSpeed(textSpeed)
    setTempVolumeBgm(volume.bgm)
    setTempVolumeVoice(volume.voice)
    setTempVolumeSe(volume.se)
  }, [language, textSpeed, volume])

  const handleSave = () => {
    setLanguage(tempLanguage)
    setTextSpeed(tempTextSpeed)
    setVolume('bgm', tempVolumeBgm)
    setVolume('voice', tempVolumeVoice)
    setVolume('se', tempVolumeSe)
    onClose()
  }

  const handleReset = () => {
    setTempLanguage('jp')
    setTempTextSpeed(50)
    setTempVolumeBgm(0.7)
    setTempVolumeVoice(1.0)
    setTempVolumeSe(0.8)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50">
      <div className="max-w-2xl w-full bg-vn-dialog border-4 border-vn-accent rounded-lg p-8 shadow-2xl">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-vn-accent">設定 Settings</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-vn-choice hover:bg-vn-choice-hover text-vn-text rounded-lg"
          >
            ✕ 閉じる
          </button>
        </div>

        <div className="space-y-8">
          {/* 言語設定 */}
          <div>
            <h3 className="text-xl font-bold text-vn-text mb-4">
              🌐 言語 / Language
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => setTempLanguage('jp')}
                className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all ${
                  tempLanguage === 'jp'
                    ? 'bg-vn-accent text-white border-2 border-vn-accent'
                    : 'bg-vn-choice text-vn-text border-2 border-vn-accent/30 hover:border-vn-accent/60'
                }`}
              >
                日本語
              </button>
              <button
                onClick={() => setTempLanguage('en')}
                className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all ${
                  tempLanguage === 'en'
                    ? 'bg-vn-accent text-white border-2 border-vn-accent'
                    : 'bg-vn-choice text-vn-text border-2 border-vn-accent/30 hover:border-vn-accent/60'
                }`}
              >
                English
              </button>
            </div>
            <p className="text-vn-text/60 text-sm mt-2">
              ※ メインの表示言語を選択します（両言語は常に表示されます）
            </p>
          </div>

          {/* テキスト速度 */}
          <div>
            <h3 className="text-xl font-bold text-vn-text mb-4">
              ⚡ テキスト速度 / Text Speed
            </h3>
            <div className="space-y-3">
              <input
                type="range"
                min="10"
                max="100"
                value={tempTextSpeed}
                onChange={(e) => setTempTextSpeed(Number(e.target.value))}
                className="w-full h-2 bg-vn-bg rounded-lg appearance-none cursor-pointer accent-vn-accent"
              />
              <div className="flex justify-between text-vn-text/70 text-sm">
                <span>遅い Slow</span>
                <span className="font-bold text-vn-accent">{tempTextSpeed}</span>
                <span>速い Fast</span>
              </div>
            </div>
          </div>

          {/* 音量設定 */}
          <div>
            <h3 className="text-xl font-bold text-vn-text mb-4">
              🔊 音量 / Volume
            </h3>
            <div className="space-y-4">
              {/* BGM */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-vn-text">BGM</span>
                  <span className="text-vn-accent font-bold">
                    {Math.round(tempVolumeBgm * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={tempVolumeBgm}
                  onChange={(e) => setTempVolumeBgm(Number(e.target.value))}
                  className="w-full h-2 bg-vn-bg rounded-lg appearance-none cursor-pointer accent-vn-accent"
                />
              </div>

              {/* Voice */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-vn-text">Voice ボイス</span>
                  <span className="text-vn-accent font-bold">
                    {Math.round(tempVolumeVoice * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={tempVolumeVoice}
                  onChange={(e) => setTempVolumeVoice(Number(e.target.value))}
                  className="w-full h-2 bg-vn-bg rounded-lg appearance-none cursor-pointer accent-vn-accent"
                />
              </div>

              {/* SE */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-vn-text">SE 効果音</span>
                  <span className="text-vn-accent font-bold">
                    {Math.round(tempVolumeSe * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={tempVolumeSe}
                  onChange={(e) => setTempVolumeSe(Number(e.target.value))}
                  className="w-full h-2 bg-vn-bg rounded-lg appearance-none cursor-pointer accent-vn-accent"
                />
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-4 border-t-2 border-vn-accent/30">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 bg-vn-choice hover:bg-vn-choice-hover text-vn-text font-bold rounded-lg transition-all"
            >
              デフォルトに戻す Reset
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-vn-accent hover:bg-vn-accent/80 text-white font-bold rounded-lg transition-all"
            >
              保存 Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsMenu
