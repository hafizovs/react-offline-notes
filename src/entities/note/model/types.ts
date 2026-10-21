export type NoteRecord = {
  id: string
  title: string
  body: string
  updatedAt: number
  serverRevision: number
  pendingSync: boolean
}

export type OutboxOp = 'upsert' | 'delete'

export type OutboxRecord = {
  id: string
  noteId: string
  op: OutboxOp
  payload: Pick<NoteRecord, 'title' | 'body' | 'updatedAt'>
  createdAt: number
}

export type ConflictRecord = {
  noteId: string
  local: NoteRecord
  server: NoteRecord
}
