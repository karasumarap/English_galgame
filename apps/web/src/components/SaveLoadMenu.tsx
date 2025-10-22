/**
 * SaveLoadMenu - セーブ/ロード画面
 */

import { useState, useEffect } from 'react'
import { listSaves, saveGame, loadGame, deleteSave, type SaveData } from '@systems/saveLoad'
import type { GameState } from '@engine/types'

interface SaveLoadMenuProps {
  currentState: GameState
  mode: 'save' | 'load'
  onLoad: (state: SaveData) => void
  onClose: () => void
}

const SaveLoadMenu = ({ currentState, mode, onLoad, onClose }: SaveLoadMenuProps) => {
  const [saves, setSaves] = useState<SaveData[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  useEffect(() => {
    loadSaveList()
  }, [])

  const loadSaveList = async () => {
    const saveList = await listSaves()
    setSaves(saveList.sort((a, b) => 
      new Date(b.saveDate).getTime() - new Date(a.saveDate).getTime()
    ))
  }

  const handleSave = async (slotId: string) => {
    console.log('🔵 セーブ実行:', {
      currentLine: currentState.currentLine,
      scene: currentState.currentScene,
      flags: currentState.flags
    })
    await saveGame(slotId, currentState)
    await loadSaveList()
    alert('セーブしました!')
  }

  const handleLoad = async (slotId: string) => {
    const saveData = await loadGame(slotId)
    if (saveData) {
      console.log('🟢 ロード実行:', {
        currentLine: saveData.currentLine,
        scene: saveData.currentScene,
        flags: saveData.flags
      })
      onLoad(saveData)
      onClose()
    }
  }

  const handleDelete = async (slotId: string) => {
    if (confirm('このセーブデータを削除しますか？')) {
      await deleteSave(slotId)
      await loadSaveList()
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const slots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5']

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50">
      <div className="max-w-4xl w-full bg-vn-dialog border-4 border-vn-accent rounded-lg p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-vn-accent">
            {mode === 'save' ? 'セーブ Save' : 'ロード Load'}
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-vn-choice hover:bg-vn-choice-hover text-vn-text rounded-lg"
          >
            ✕ 閉じる
          </button>
        </div>

        {/* セーブスロット */}
        <div className="space-y-3">
          {slots.map((slotId) => {
            const saveData = saves.find((s) => s.id === slotId)
            const isEmpty = !saveData

            return (
              <div
                key={slotId}
                className={`bg-vn-bg border-2 rounded-lg p-4 transition-all ${
                  selectedSlot === slotId
                    ? 'border-vn-accent'
                    : 'border-vn-accent/30 hover:border-vn-accent/60'
                }`}
                onClick={() => setSelectedSlot(slotId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-vn-accent font-bold">
                        {slotId.replace('slot', 'Slot ')}
                      </span>
                      {isEmpty && (
                        <span className="text-vn-text/50 text-sm">（空きスロット）</span>
                      )}
                    </div>

                    {!isEmpty && (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-vn-text/50">シーン</div>
                          <div className="text-vn-text font-medium">
                            {saveData.currentScene}
                          </div>
                        </div>
                        <div>
                          <div className="text-vn-text/50">好感度</div>
                          <div className="text-vn-text font-medium">
                            {saveData.affection['heroine'] || 0}
                          </div>
                        </div>
                        <div>
                          <div className="text-vn-text/50">保存日時</div>
                          <div className="text-vn-text font-medium">
                            {formatDate(saveData.saveDate)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {mode === 'save' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSave(slotId)
                        }}
                        className="px-4 py-2 bg-vn-accent hover:bg-vn-accent/80 text-white rounded-lg font-medium"
                      >
                        セーブ
                      </button>
                    )}

                    {mode === 'load' && !isEmpty && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLoad(slotId)
                          }}
                          className="px-4 py-2 bg-vn-accent hover:bg-vn-accent/80 text-white rounded-lg font-medium"
                        >
                          ロード
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(slotId)
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                        >
                          削除
                        </button>
                      </>
                    )}

                    {mode === 'load' && isEmpty && (
                      <span className="px-4 py-2 text-vn-text/50 text-sm">
                        データなし
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* クイックセーブ・オートセーブ */}
        <div className="mt-6 border-t-2 border-vn-accent/30 pt-6">
          <h3 className="text-xl font-bold text-vn-text mb-3">特殊セーブ</h3>
          <div className="grid grid-cols-2 gap-3">
            {['quicksave', 'autosave'].map((specialId) => {
              const saveData = saves.find((s) => s.id === specialId)
              const isEmpty = !saveData

              return (
                <div
                  key={specialId}
                  className="bg-vn-bg border-2 border-vn-accent/30 rounded-lg p-4"
                >
                  <div className="font-bold text-vn-accent mb-2">
                    {specialId === 'quicksave' ? '⚡ クイックセーブ' : '💾 オートセーブ'}
                  </div>
                  {isEmpty ? (
                    <p className="text-vn-text/50 text-sm">データなし</p>
                  ) : (
                    <>
                      <p className="text-vn-text text-sm mb-2">
                        {formatDate(saveData.saveDate)}
                      </p>
                      {mode === 'load' && (
                        <button
                          onClick={() => handleLoad(specialId)}
                          className="w-full px-3 py-1 bg-vn-accent hover:bg-vn-accent/80 text-white rounded text-sm"
                        >
                          ロード
                        </button>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaveLoadMenu
