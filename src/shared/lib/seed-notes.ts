import { createEmptyNote, noteRepository } from '@/entities/note'
import { resetMockServer } from '@/shared/api/mock-server'

export async function seedNotesIfEmpty(): Promise<void> {
  const existing = await noteRepository.listNotes()
  if (existing.length > 0) {
    return
  }

  const welcome = createEmptyNote()
  welcome.title = 'Welcome'
  welcome.body = 'Edits are stored in Dexie and queued in the outbox until sync runs.'
  welcome.pendingSync = false
  welcome.serverRevision = 1

  await noteRepository.saveLocal(welcome, false)
  resetMockServer([welcome])
}
