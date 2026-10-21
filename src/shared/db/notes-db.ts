import Dexie, { type EntityTable } from 'dexie'

import type { ConflictRecord, NoteRecord, OutboxRecord } from '@/entities/note/model/types'

class NotesDatabase extends Dexie {
  notes!: EntityTable<NoteRecord, 'id'>
  outbox!: EntityTable<OutboxRecord, 'id'>
  conflicts!: EntityTable<ConflictRecord, 'noteId'>

  constructor() {
    super('offline-notes')
    this.version(1).stores({
      notes: 'id, updatedAt, pendingSync',
      outbox: 'id, noteId, createdAt',
      conflicts: 'noteId',
    })
  }
}

export const notesDb = new NotesDatabase()
