/**
 * セーブ/ロードシステム (IndexedDB)
 */

import { openDB, type IDBPDatabase } from 'idb'
import type { GameState } from '@engine/types'

const DB_NAME = 'EnglishGalgameDB'
const DB_VERSION = 1
const STORE_NAME = 'saves'

export interface SaveData extends GameState {
  id: string
  saveDate: Date
  thumbnail?: string
}

let db: IDBPDatabase | null = null

async function getDB() {
  if (db) return db

  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })

  return db
}

export async function saveGame(
  slotId: string,
  state: GameState,
  thumbnail?: string
): Promise<void> {
  const database = await getDB()
  const saveData: SaveData = {
    ...state,
    id: slotId,
    saveDate: new Date(),
    thumbnail,
  }
  await database.put(STORE_NAME, saveData)
}

export async function loadGame(slotId: string): Promise<SaveData | undefined> {
  const database = await getDB()
  return await database.get(STORE_NAME, slotId)
}

export async function listSaves(): Promise<SaveData[]> {
  const database = await getDB()
  return await database.getAll(STORE_NAME)
}

export async function deleteSave(slotId: string): Promise<void> {
  const database = await getDB()
  await database.delete(STORE_NAME, slotId)
}

export async function autoSave(state: GameState): Promise<void> {
  await saveGame('autosave', state)
}

export async function quickSave(state: GameState): Promise<void> {
  await saveGame('quicksave', state)
}

export async function quickLoad(): Promise<SaveData | undefined> {
  return await loadGame('quicksave')
}
