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
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <UnsyncedBadge />
      <Button
        className="min-h-11 touch-manipulation sm:min-h-8"
        disabled={isSyncing}
        onClick={() => syncNow()}
        size="sm"
      >
        {isSyncing ? 'Syncing…' : 'Sync now'}
      </Button>
      <label className="flex min-h-11 min-w-0 max-w-full cursor-pointer items-center gap-2 text-xs text-[var(--text)] touch-manipulation sm:min-h-0">
        <input
          checked={forceEnabled}
          className="size-5 shrink-0 sm:size-4"
          disabled={!activeNoteId}
          onChange={(event) =>
            setForceConflictNoteId(event.target.checked ? activeNoteId : null)
          }
          type="checkbox"
        />
        <span className="min-w-0 leading-snug">
          <span className="sm:hidden">Force conflict</span>
          <span className="hidden sm:inline">Force conflict for active note</span>
        </span>
      </label>
    </div>
  )
}
