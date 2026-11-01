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
    <main className="mx-auto grid min-h-svh w-full min-w-0 max-w-5xl grid-rows-[auto_1fr] gap-3 overflow-x-clip px-3 py-4 sm:gap-4 sm:px-4 sm:py-6 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] md:grid-rows-[auto_minmax(0,1fr)]">
      <header className="min-w-0 md:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-[var(--text-h)] sm:text-2xl">Offline notes</h1>
            <p className="text-sm text-[var(--text)]">
              Dexie storage, outbox queue, and mock sync with conflict resolution.
            </p>
          </div>
          <SyncToolbar activeNoteId={selectedId} />
        </div>
      </header>
      <aside
        className={`min-h-0 min-w-0 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 md:max-h-none ${
          selectedId ? 'max-md:hidden' : 'max-md:min-h-[min(70svh,32rem)]'
        }`}
      >
        <NotesList onSelect={setSelectedId} selectedId={selectedId} />
      </aside>
      <section
        className={`flex min-h-0 min-w-0 flex-col rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 sm:p-4 ${
          selectedId ? '' : 'max-md:hidden'
        }`}
      >
        <NoteEditor noteId={selectedId} onBack={() => setSelectedId(null)} />
      </section>
      <ConflictDialog conflict={conflict ?? null} onResolved={() => bump((n) => n + 1)} />
    </main>
  )
}
