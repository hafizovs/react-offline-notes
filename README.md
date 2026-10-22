## Live demo

https://hafizovs.github.io/react-offline-notes/

# Offline notes

Offline-first notes with Dexie, an outbox queue, mock sync, and conflict resolution UI — Vite PWA.

## Scripts

```bash
pnpm install
pnpm dev          # http://localhost:5010
pnpm check
pnpm build
```

## Manual demo

1. Edit a note and save — badge shows unsynced entries.
2. Click **Sync now** — badge clears when the mock server accepts changes.
3. Enable **Force conflict**, save, sync — pick local or server in the dialog.
