import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import type { ConflictRecord } from '@/entities/note'
import { applyConflictResolution } from '@/features/sync-notes'

type ConflictDialogProps = {
  conflict: ConflictRecord | null
  onResolved: () => void
}

export function ConflictDialog({ conflict, onResolved }: ConflictDialogProps) {
  const open = Boolean(conflict)

  async function resolve(choice: 'local' | 'server') {
    if (!conflict) {
      return
    }
    await applyConflictResolution(conflict.noteId, choice)
    onResolved()
  }

  return (
    <Dialog onOpenChange={() => undefined} open={open}>
      <DialogContent aria-describedby="conflict-desc">
        <DialogHeader>
          <DialogTitle>Sync conflict</DialogTitle>
          <DialogDescription id="conflict-desc">
            The mock server has a newer revision. Choose which version to keep.
          </DialogDescription>
        </DialogHeader>
        {conflict ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-md border border-[var(--border)] p-3">
              <h3 className="mb-1 text-sm font-medium text-[var(--text-h)]">Local</h3>
              <p className="text-sm font-semibold">{conflict.local.title}</p>
              <p className="text-xs text-[var(--text)]">{conflict.local.body || '(empty)'}</p>
            </article>
            <article className="rounded-md border border-[var(--border)] p-3">
              <h3 className="mb-1 text-sm font-medium text-[var(--text-h)]">Server</h3>
              <p className="text-sm font-semibold">{conflict.server.title}</p>
              <p className="text-xs text-[var(--text)]">{conflict.server.body || '(empty)'}</p>
            </article>
          </div>
        ) : null}
        <DialogFooter>
          <Button onClick={() => resolve('local')} variant="outline">
            Keep local
          </Button>
          <Button onClick={() => resolve('server')}>Keep server</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
