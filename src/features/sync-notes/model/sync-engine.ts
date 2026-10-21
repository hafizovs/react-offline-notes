import type { ConflictRecord, NoteRecord } from '@/entities/note'
import { noteRepository } from '@/entities/note'
import { mockServerDelete, mockServerUpsert } from '@/shared/api/mock-server'
import { notesDb } from '@/shared/db/notes-db'
import { compactOutbox } from '@/shared/lib/outbox'

export type SyncEngineOptions = {
  forceConflictNoteId?: string | null
}

export async function processOutbox(options: SyncEngineOptions = {}): Promise<void> {
  const outbox = compactOutbox(await noteRepository.listOutbox())
  const processedIds: string[] = []

  for (const entry of outbox) {
    if (entry.op === 'delete') {
      mockServerDelete(entry.noteId)
      await notesDb.notes.delete(entry.noteId)
      processedIds.push(entry.id)
      continue
    }

    const local = await noteRepository.getNote(entry.noteId)
    if (!local) {
      processedIds.push(entry.id)
      continue
    }

    const result = mockServerUpsert(local, {
      forceConflict: options.forceConflictNoteId === local.id,
    })

    if (result.status === 'conflict') {
      const conflict: ConflictRecord = {
        noteId: local.id,
        local,
        server: result.server,
      }
      await notesDb.conflicts.put(conflict)
      processedIds.push(entry.id)
      continue
    }

    await notesDb.notes.put(result.note)
    processedIds.push(entry.id)
  }

  if (processedIds.length > 0) {
    await noteRepository.clearOutboxIds(processedIds)
  }
}

export async function applyConflictResolution(
  noteId: string,
  choice: 'local' | 'server',
): Promise<void> {
  const conflict = await notesDb.conflicts.get(noteId)
  if (!conflict) {
    return
  }

  const chosen: NoteRecord =
    choice === 'local'
      ? { ...conflict.local, pendingSync: true }
      : { ...conflict.server, pendingSync: false }

  await notesDb.notes.put(chosen)
  await notesDb.conflicts.delete(noteId)

  if (choice === 'local') {
    await noteRepository.saveLocal(chosen, true)
  }
}
