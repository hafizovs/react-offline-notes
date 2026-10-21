import type { NoteRecord } from '@/entities/note/model/types'

const serverNotes = new Map<string, NoteRecord>()

export type SyncResult =
  | { status: 'ok'; note: NoteRecord }
  | { status: 'conflict'; server: NoteRecord }

export function resetMockServer(seed: NoteRecord[] = []) {
  serverNotes.clear()
  for (const note of seed) {
    serverNotes.set(note.id, { ...note })
  }
}

export function mockServerUpsert(
  note: NoteRecord,
  options?: { forceConflict?: boolean },
): SyncResult {
  const existing = serverNotes.get(note.id)
  if (options?.forceConflict && existing && existing.serverRevision >= note.serverRevision) {
    return { status: 'conflict', server: { ...existing } }
  }

  const next: NoteRecord = {
    ...note,
    serverRevision: (existing?.serverRevision ?? 0) + 1,
    pendingSync: false,
  }
  serverNotes.set(note.id, next)
  return { status: 'ok', note: next }
}

export function mockServerDelete(noteId: string): void {
  serverNotes.delete(noteId)
}

export function listMockServerNotes(): NoteRecord[] {
  return [...serverNotes.values()]
}
