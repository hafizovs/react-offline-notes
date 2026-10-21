import { useLiveQuery } from 'dexie-react-hooks'

import { notesDb } from '@/shared/db/notes-db'
import { countUnsyncedOutbox } from '@/shared/lib/outbox'

export function UnsyncedBadge() {
  const outboxCount = useLiveQuery(async () => {
    const items = await notesDb.outbox.toArray()
    return countUnsyncedOutbox(items)
  }, [])

  const total = outboxCount ?? 0
  if (total === 0) {
    return (
      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
        Synced
      </span>
    )
  }

  return (
    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-200">
      {total} unsynced
    </span>
  )
}
