import { useLiveQuery } from 'dexie-react-hooks'

import { createEmptyNote, noteRepository } from '@/entities/note'
import { notesDb } from '@/shared/db/notes-db'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/cn'

type NotesListProps = {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function NotesList({ selectedId, onSelect }: NotesListProps) {
  const notes = useLiveQuery(() => notesDb.notes.orderBy('updatedAt').reverse().toArray(), [])

  async function handleCreate() {
    const note = createEmptyNote()
    await noteRepository.saveLocal(note)
    onSelect(note.id)
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <Button onClick={handleCreate} size="sm">
        New note
      </Button>
      <ul className="flex-1 space-y-1 overflow-auto">
        {(notes ?? []).map((note) => (
          <li key={note.id}>
            <button
              className={cn(
                'w-full rounded-md px-2 py-2 text-left text-sm transition-colors',
                selectedId === note.id
                  ? 'bg-[var(--accent-bg)] text-[var(--text-h)]'
                  : 'text-[var(--text)] hover:bg-[var(--accent-bg)]/60',
              )}
              onClick={() => onSelect(note.id)}
              type="button"
            >
              <span className="block font-medium">{note.title || 'Untitled'}</span>
              {note.pendingSync ? (
                <span className="text-xs text-amber-300">Pending sync</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
