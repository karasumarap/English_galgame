/**
 * ChoiceList - 選択肢表示コンポーネント
 */

import type { ChoiceOption, LocalizedText, Language } from '@engine/types'

interface ChoiceListProps {
  prompt: LocalizedText
  options: ChoiceOption[]
  language: Language
  onSelect: (optionId: string) => void
}

const ChoiceList = ({ prompt, options, language, onSelect }: ChoiceListProps) => {
  const promptText = language === 'jp' ? prompt.jp : prompt.en

  return (
    <div className="bg-vn-dialog border-2 border-vn-accent/30 rounded-lg p-6 shadow-2xl">
      {/* プロンプト */}
      <div className="text-vn-text text-lg font-medium mb-4">{promptText}</div>

      {/* 選択肢リスト */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const optionText = language === 'jp' ? option.text.jp : option.text.en
          const secondaryText = language === 'jp' ? option.text.en : option.text.jp

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className="w-full text-left p-4 bg-vn-choice hover:bg-vn-choice-hover border-2 border-transparent hover:border-vn-accent/50 rounded-lg transition-all transform hover:translate-x-2"
            >
              <div className="flex items-start">
                <span className="text-vn-accent font-bold mr-3">{index + 1}.</span>
                <div className="flex-1">
                  <div className="text-vn-text font-medium">{optionText}</div>
                  <div className="text-vn-text/50 text-sm mt-1">{secondaryText}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ChoiceList
