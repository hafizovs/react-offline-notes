import { create } from 'zustand'

import { processOutbox } from '@/features/sync-notes/model/sync-engine'

type SyncState = {
  isSyncing: boolean
  forceConflictNoteId: string | null
  lastSyncedAt: number | null
  setForceConflictNoteId: (id: string | null) => void
  syncNow: () => Promise<void>
}

export const useSyncStore = create<SyncState>((set, get) => ({
  isSyncing: false,
  forceConflictNoteId: null,
  lastSyncedAt: null,
  setForceConflictNoteId: (id) => set({ forceConflictNoteId: id }),
  syncNow: async () => {
    if (get().isSyncing) {
      return
    }
    set({ isSyncing: true })
    try {
      await processOutbox({ forceConflictNoteId: get().forceConflictNoteId })
      set({ lastSyncedAt: Date.now(), forceConflictNoteId: null })
    } finally {
      set({ isSyncing: false })
    }
  },
}))
