import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'

import type { NoteRecord } from '@/entities/note'
import { noteRepository } from '@/entities/note'
import { notesDb } from '@/shared/db/notes-db'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

type NoteEditorProps = {
  noteId: string | null
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
    <div className="flex h-full flex-col gap-3">
      <Input
        aria-label="Note title"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />
      <Textarea
        aria-label="Note body"
        onChange={(event) => setBody(event.target.value)}
        value={body}
      />
      <div className="flex gap-2">
        <Button onClick={save}>Save locally</Button>
        <Button onClick={remove} variant="outline">
          Delete
        </Button>
      </div>
    </div>
  )
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const note = useLiveQuery(() => (noteId ? notesDb.notes.get(noteId) : undefined), [noteId])

  if (!noteId) {
    return (
      <p className="text-sm text-[var(--text)]">Select a note or create a new one.</p>
    )
  }

  if (!note) {
    return <p className="text-sm text-[var(--text)]">Loading…</p>
  }

  return <NoteDraft key={`${note.id}-${note.updatedAt}`} note={note} />
}
