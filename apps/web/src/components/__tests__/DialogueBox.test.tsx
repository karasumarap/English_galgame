import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DialogueBox from '../DialogueBox'
import type { Character, LocalizedText } from '@engine/types'

describe('DialogueBox', () => {
  const mockCharacter: Character = {
    id: 'emma',
    name: { en: 'Emma', jp: 'エマ' },
  }

  const mockText: LocalizedText = {
    en: 'Hello, how are you?',
    jp: 'こんにちは、元気ですか?',
  }

  const mockOnNext = vi.fn()

  beforeEach(() => {
    mockOnNext.mockClear()
  })

  describe('rendering', () => {
    it('日本語でテキストを表示する', () => {
      render(
        <DialogueBox
          character={mockCharacter}
          text={mockText}
          language="jp"
          onNext={mockOnNext}
        />
      )

      expect(screen.getByText('こんにちは、元気ですか?')).toBeInTheDocument()
      expect(screen.getByText('エマ')).toBeInTheDocument()
    })

    it('英語でテキストを表示する', () => {
      render(
        <DialogueBox
          character={mockCharacter}
          text={mockText}
          language="en"
          onNext={mockOnNext}
        />
      )

      expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
      expect(screen.getByText('Emma')).toBeInTheDocument()
    })

    it('キャラクターなしでレンダリングできる', () => {
      render(
        <DialogueBox text={mockText} language="jp" onNext={mockOnNext} />
      )

      expect(screen.getByText('こんにちは、元気ですか?')).toBeInTheDocument()
      expect(screen.queryByText('エマ')).not.toBeInTheDocument()
    })

    it('日本語モードでは英語のヒントも表示される', () => {
      render(
        <DialogueBox
          character={mockCharacter}
          text={mockText}
          language="jp"
          onNext={mockOnNext}
        />
      )

      expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
    })

    it('次へボタンが表示される', () => {
      render(
        <DialogueBox
          character={mockCharacter}
          text={mockText}
          language="jp"
          onNext={mockOnNext}
        />
      )

      expect(screen.getByRole('button', { name: /次へ/ })).toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('次へボタンをクリックするとonNextが呼ばれる', async () => {
      const user = userEvent.setup()

      render(
        <DialogueBox
          character={mockCharacter}
          text={mockText}
          language="jp"
          onNext={mockOnNext}
        />
      )

      const nextButton = screen.getByRole('button', { name: /次へ/ })
      await user.click(nextButton)

      expect(mockOnNext).toHaveBeenCalledTimes(1)
    })

    it('複数回クリックできる', async () => {
      const user = userEvent.setup()

      render(
        <DialogueBox
          character={mockCharacter}
          text={mockText}
          language="jp"
          onNext={mockOnNext}
        />
      )

      const nextButton = screen.getByRole('button', { name: /次へ/ })
      await user.click(nextButton)
      await user.click(nextButton)
      await user.click(nextButton)

      expect(mockOnNext).toHaveBeenCalledTimes(3)
    })
  })
})
