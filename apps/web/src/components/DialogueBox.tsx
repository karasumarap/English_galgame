/**
 * DialogueBox - セリフ表示コンポーネント
 */

import type { Character, LocalizedText, Language } from '@engine/types'

interface DialogueBoxProps {
  character?: Character
  text: LocalizedText
  language: Language
  onNext: () => void
}

const DialogueBox = ({ character, text, language, onNext }: DialogueBoxProps) => {
  const displayText = language === 'jp' ? text.jp : text.en
  const characterName = character
    ? language === 'jp'
      ? character.name.jp
      : character.name.en
    : ''

  return (
    <div className="bg-vn-dialog border-2 border-vn-accent/30 rounded-lg p-6 shadow-2xl">
      {/* キャラ名 */}
      {characterName && (
        <div className="mb-3 text-vn-accent font-bold text-lg">{characterName}</div>
      )}

      {/* セリフ本文 */}
      <div className="text-vn-text text-base leading-relaxed mb-4 min-h-[4rem]">
        {displayText}
      </div>

      {/* 言語切替ヒント（小さく表示） */}
      {language === 'jp' && (
        <div className="text-vn-text/50 text-xs mb-2">{text.en}</div>
      )}

      {/* 次へボタン */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-vn-accent hover:bg-vn-accent/80 text-white font-medium rounded transition-all"
        >
          次へ ▶
        </button>
      </div>
    </div>
  )
}

export default DialogueBox
