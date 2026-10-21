import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'

import { ConflictDialog } from '@/features/resolve-conflict/ui/conflict-dialog'
import { notesDb } from '@/shared/db/notes-db'
import { NoteEditor, NotesList } from '@/widgets/notes-panel'
import { SyncToolbar } from '@/widgets/sync-status'

export function NotesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const conflict = useLiveQuery(() => notesDb.conflicts.toCollection().first(), [])
  const [, bump] = useState(0)

  return (
    <main className="mx-auto grid min-h-svh max-w-5xl gap-4 px-4 py-6 md:grid-cols-[240px_1fr]">
      <header className="md:col-span-2">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-h)]">Offline notes</h1>
            <p className="text-sm text-[var(--text)]">
              Dexie storage, outbox queue, and mock sync with conflict resolution.
            </p>
          </div>
          <SyncToolbar activeNoteId={selectedId} />
        </div>
      </header>
      <aside className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
        <NotesList onSelect={setSelectedId} selectedId={selectedId} />
      </aside>
      <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
        <NoteEditor noteId={selectedId} />
      </section>
      <ConflictDialog conflict={conflict ?? null} onResolved={() => bump((n) => n + 1)} />
    </main>
  )
}
