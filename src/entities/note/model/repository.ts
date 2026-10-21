import { v4 as uuid } from 'uuid'

import type { NoteRecord, OutboxRecord } from '@/entities/note/model/types'
import { notesDb } from '@/shared/db/notes-db'

export function createEmptyNote(): NoteRecord {
  const now = Date.now()
  return {
    id: uuid(),
    title: 'Untitled',
    body: '',
    updatedAt: now,
    serverRevision: 0,
    pendingSync: true,
  }
}

export const noteRepository = {
  async listNotes(): Promise<NoteRecord[]> {
    return notesDb.notes.orderBy('updatedAt').reverse().toArray()
  },

  async getNote(id: string): Promise<NoteRecord | undefined> {
    return notesDb.notes.get(id)
  },

  async saveLocal(note: NoteRecord, enqueue = true): Promise<void> {
    await notesDb.notes.put({ ...note, pendingSync: enqueue })
    if (enqueue) {
      const outbox: OutboxRecord = {
        id: uuid(),
        noteId: note.id,
        op: 'upsert',
        payload: {
          title: note.title,
          body: note.body,
          updatedAt: note.updatedAt,
        },
        createdAt: Date.now(),
      }
      await notesDb.outbox.add(outbox)
    }
  },

  async deleteLocal(id: string): Promise<void> {
    await notesDb.notes.delete(id)
    await notesDb.outbox.add({
      id: uuid(),
      noteId: id,
      op: 'delete',
      payload: { title: '', body: '', updatedAt: Date.now() },
      createdAt: Date.now(),
    })
  },

  async listOutbox(): Promise<OutboxRecord[]> {
    return notesDb.outbox.toArray()
  },

  async clearOutboxIds(ids: string[]): Promise<void> {
    await notesDb.outbox.bulkDelete(ids)
  },
}
