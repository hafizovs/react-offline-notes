import { useSyncStore } from '@/features/sync-notes'
import { Button } from '@/shared/ui/button'
import { UnsyncedBadge } from '@/widgets/sync-status/ui/unsynced-badge'

type SyncToolbarProps = {
  activeNoteId: string | null
}

export function SyncToolbar({ activeNoteId }: SyncToolbarProps) {
  const isSyncing = useSyncStore((s) => s.isSyncing)
  const syncNow = useSyncStore((s) => s.syncNow)
  const forceConflictNoteId = useSyncStore((s) => s.forceConflictNoteId)
  const setForceConflictNoteId = useSyncStore((s) => s.setForceConflictNoteId)

  const forceEnabled = activeNoteId !== null && forceConflictNoteId === activeNoteId

  return (
    <div className="flex flex-wrap items-center gap-2">
      <UnsyncedBadge />
      <Button disabled={isSyncing} onClick={() => syncNow()} size="sm">
        {isSyncing ? 'Syncing…' : 'Sync now'}
      </Button>
      <label className="flex items-center gap-2 text-xs text-[var(--text)]">
        <input
          checked={forceEnabled}
          disabled={!activeNoteId}
          onChange={(event) =>
            setForceConflictNoteId(event.target.checked ? activeNoteId : null)
          }
          type="checkbox"
        />
        Force conflict for active note
      </label>
    </div>
  )
}
