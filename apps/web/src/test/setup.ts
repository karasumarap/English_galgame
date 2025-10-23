import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// グローバルクリーンアップ
afterEach(() => {
  cleanup()
})

// IndexedDBのモック
const indexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.indexedDB = indexedDB as any

// Matchmediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
