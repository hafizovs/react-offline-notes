import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'

import type { NoteRecord } from '@/entities/note'
import { noteRepository } from '@/entities/note'
import { notesDb } from '@/shared/db/notes-db'
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

type NoteEditorProps = {
  noteId: string | null
  onBack?: () => void
}

type NoteDraftProps = {
  note: NoteRecord
}

function NoteDraft({ note }: NoteDraftProps) {
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)

  async function save() {
    const updated = {
      ...note,
      title,
      body,
      updatedAt: Date.now(),
      pendingSync: true,
    }
    await noteRepository.saveLocal(updated)
  }

  async function remove() {
    await noteRepository.deleteLocal(note.id)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <Input
        aria-label="Note title"
        className="min-h-11 text-base sm:min-h-9 sm:text-sm"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />
      <Textarea
        aria-label="Note body"
        className="min-h-[min(50svh,20rem)] flex-1 text-base sm:min-h-[160px] sm:flex-none sm:text-sm"
        onChange={(event) => setBody(event.target.value)}
        value={body}
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="min-h-11 touch-manipulation sm:min-h-9" onClick={save}>
          Save locally
        </Button>
        <Button className="min-h-11 touch-manipulation sm:min-h-9" onClick={remove} variant="outline">
          Delete
        </Button>
      </div>
    </div>
  )
}

export function NoteEditor({ noteId, onBack }: NoteEditorProps) {
  const note = useLiveQuery(() => (noteId ? notesDb.notes.get(noteId) : undefined), [noteId])

  if (!noteId) {
    return (
      <p className="text-sm text-[var(--text)] md:block">Select a note or create a new one.</p>
    )
  }

  if (!note) {
    return <p className="text-sm text-[var(--text)]">Loading…</p>
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      {onBack ? (
        <Button
          className="-ml-1 w-fit min-h-11 touch-manipulation px-2 sm:min-h-8 md:hidden"
          onClick={onBack}
          size="sm"
          variant="ghost"
        >
          <ChevronLeft aria-hidden className="h-4 w-4" />
          All notes
        </Button>
      ) : null}
      <NoteDraft key={`${note.id}-${note.updatedAt}`} note={note} />
    </div>
  )
}
