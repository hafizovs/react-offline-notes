import type { OutboxRecord } from '@/entities/note/model/types'

/** Sort outbox rows oldest-first for deterministic replay. */
export function sortOutboxByCreatedAt(items: OutboxRecord[]): OutboxRecord[] {
  return [...items].sort((a, b) => a.createdAt - b.createdAt)
}

/** Merge duplicate upserts for the same note, keeping the latest payload. */
export function compactOutbox(items: OutboxRecord[]): OutboxRecord[] {
  const sorted = sortOutboxByCreatedAt(items)
  const byNote = new Map<string, OutboxRecord>()

  for (const entry of sorted) {
    if (entry.op === 'delete') {
      byNote.set(entry.noteId, entry)
      continue
    }
    const existing = byNote.get(entry.noteId)
    if (!existing || existing.createdAt <= entry.createdAt) {
      byNote.set(entry.noteId, entry)
    }
  }

  return sortOutboxByCreatedAt([...byNote.values()])
}

export function countUnsyncedOutbox(items: OutboxRecord[]): number {
  return compactOutbox(items).length
}
