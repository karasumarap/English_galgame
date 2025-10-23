import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChoiceList from '../ChoiceList'
import type { ChoiceOption, LocalizedText } from '@engine/types'

describe('ChoiceList', () => {
  const mockPrompt: LocalizedText = {
    en: 'What do you want to say?',
    jp: '何と言いますか?',
  }

  const mockOptions: ChoiceOption[] = [
    {
      id: 'option1',
      text: { en: 'Hello', jp: 'こんにちは' },
    },
    {
      id: 'option2',
      text: { en: 'Good morning', jp: 'おはよう' },
    },
    {
      id: 'option3',
      text: { en: 'Thank you', jp: 'ありがとう' },
    },
  ]

  const mockOnSelect = vi.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  describe('rendering', () => {
    it('日本語でプロンプトと選択肢を表示する', () => {
      render(
        <ChoiceList
          prompt={mockPrompt}
          options={mockOptions}
          language="jp"
          onSelect={mockOnSelect}
        />
      )

      expect(screen.getByText('何と言いますか?')).toBeInTheDocument()
      expect(screen.getByText('こんにちは')).toBeInTheDocument()
      expect(screen.getByText('おはよう')).toBeInTheDocument()
      expect(screen.getByText('ありがとう')).toBeInTheDocument()
    })

    it('英語でプロンプトと選択肢を表示する', () => {
      render(
        <ChoiceList
          prompt={mockPrompt}
          options={mockOptions}
          language="en"
          onSelect={mockOnSelect}
        />
      )

      expect(screen.getByText('What do you want to say?')).toBeInTheDocument()
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('Good morning')).toBeInTheDocument()
      expect(screen.getByText('Thank you')).toBeInTheDocument()
    })

    it('各選択肢に番号が表示される', () => {
      render(
        <ChoiceList
          prompt={mockPrompt}
          options={mockOptions}
          language="jp"
          onSelect={mockOnSelect}
        />
      )

      expect(screen.getByText('1.')).toBeInTheDocument()
      expect(screen.getByText('2.')).toBeInTheDocument()
      expect(screen.getByText('3.')).toBeInTheDocument()
    })

    it('副言語のテキストも表示される', () => {
      render(
        <ChoiceList
          prompt={mockPrompt}
          options={mockOptions}
          language="jp"
          onSelect={mockOnSelect}
        />
      )

      // 日本語モードでは英語がサブテキストとして表示される
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('Good morning')).toBeInTheDocument()
      expect(screen.getByText('Thank you')).toBeInTheDocument()
    })

    it('すべての選択肢がボタンとしてレンダリングされる', () => {
      render(
        <ChoiceList
          prompt={mockPrompt}
          options={mockOptions}
          language="jp"
          onSelect={mockOnSelect}
        />
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3)
    })
  })

  describe('interaction', () => {
    it('選択肢をクリックするとonSelectが呼ばれる', async () => {
      const user = userEvent.setup()

      render(
        <ChoiceList
          prompt={mockPrompt}
          options={mockOptions}
          language="jp"
          onSelect={mockOnSelect}
        />
      )

      const firstOption = screen.getByText('こんにちは').closest('button')
      if (firstOption) {
        await user.click(firstOption)
      }

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
      expect(mockOnSelect).toHaveBeenCalledWith('option1')
    })

    it('異なる選択肢をクリックすると異なるIDが渡される', async () => {
      const user = userEvent.setup()

      render(
        <ChoiceList
          prompt={mockPrompt}
          options={mockOptions}
          language="jp"
          onSelect={mockOnSelect}
        />
      )

      const secondOption = screen.getByText('おはよう').closest('button')
      if (secondOption) {
        await user.click(secondOption)
      }

      expect(mockOnSelect).toHaveBeenCalledWith('option2')
    })

    it('複数の選択肢を順にクリックできる', async () => {
      const user = userEvent.setup()

      render(
        <ChoiceList
          prompt={mockPrompt}
          options={mockOptions}
          language="jp"
          onSelect={mockOnSelect}
        />
      )

      const option1 = screen.getByText('こんにちは').closest('button')
      const option2 = screen.getByText('おはよう').closest('button')
      const option3 = screen.getByText('ありがとう').closest('button')

      if (option1) await user.click(option1)
      if (option2) await user.click(option2)
      if (option3) await user.click(option3)

      expect(mockOnSelect).toHaveBeenCalledTimes(3)
      expect(mockOnSelect).toHaveBeenNthCalledWith(1, 'option1')
      expect(mockOnSelect).toHaveBeenNthCalledWith(2, 'option2')
      expect(mockOnSelect).toHaveBeenNthCalledWith(3, 'option3')
    })
  })

  describe('edge cases', () => {
    it('選択肢が空の配列でもレンダリングできる', () => {
      render(
        <ChoiceList
          prompt={mockPrompt}
          options={[]}
          language="jp"
          onSelect={mockOnSelect}
        />
      )

      expect(screen.getByText('何と言いますか?')).toBeInTheDocument()
      const buttons = screen.queryAllByRole('button')
      expect(buttons).toHaveLength(0)
    })

    it('1つだけの選択肢でも正しく動作する', async () => {
      const user = userEvent.setup()
      const singleOption: ChoiceOption[] = [
        {
          id: 'only',
          text: { en: 'Only choice', jp: '唯一の選択肢' },
        },
      ]

      render(
        <ChoiceList
          prompt={mockPrompt}
          options={singleOption}
          language="jp"
          onSelect={mockOnSelect}
        />
      )

      const button = screen.getByText('唯一の選択肢').closest('button')
      if (button) {
        await user.click(button)
      }

      expect(mockOnSelect).toHaveBeenCalledWith('only')
    })
  })
})
