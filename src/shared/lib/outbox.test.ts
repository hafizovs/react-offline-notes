import { describe, expect, it } from 'vitest'

import type { OutboxRecord } from '@/entities/note/model/types'

import { compactOutbox, countUnsyncedOutbox, sortOutboxByCreatedAt } from './outbox'

const base = (partial: Partial<OutboxRecord> & Pick<OutboxRecord, 'id' | 'noteId'>): OutboxRecord => ({
  op: 'upsert',
  payload: { title: 't', body: 'b', updatedAt: 1 },
  createdAt: 1,
  ...partial,
})

describe('outbox helpers', () => {
  it('sorts by createdAt ascending', () => {
    const sorted = sortOutboxByCreatedAt([
      base({ id: '2', noteId: 'n1', createdAt: 20 }),
      base({ id: '1', noteId: 'n1', createdAt: 10 }),
    ])
    expect(sorted.map((item) => item.id)).toEqual(['1', '2'])
  })

  it('compacts multiple upserts for one note', () => {
    const compacted = compactOutbox([
      base({
        id: '1',
        noteId: 'n1',
        createdAt: 10,
        payload: { title: 'old', body: 'a', updatedAt: 10 },
      }),
      base({
        id: '2',
        noteId: 'n1',
        createdAt: 20,
        payload: { title: 'new', body: 'b', updatedAt: 20 },
      }),
    ])
    expect(compacted).toHaveLength(1)
    expect(compacted[0]?.payload.title).toBe('new')
    expect(countUnsyncedOutbox(compacted)).toBe(1)
  })

  it('prefers delete over upsert for the same note', () => {
    const compacted = compactOutbox([
      base({ id: '1', noteId: 'n1', createdAt: 10 }),
      base({ id: '2', noteId: 'n1', op: 'delete', createdAt: 15 }),
    ])
    expect(compacted).toHaveLength(1)
    expect(compacted[0]?.op).toBe('delete')
  })
})
