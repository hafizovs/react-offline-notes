# 10 Offline notes

**Live:** https://hafizovs.github.io/react-offline-notes/

Offline-first notes with Dexie, an outbox queue, mock sync, and conflict resolution UI.

## Stack

- Vite, Dexie, Zustand, Radix dialog, Tailwind
- **PWA:** `vite-plugin-pwa` (service worker + web manifest). Data still works offline via Dexie if the SW is unavailable in dev.

## Features

- Local note list and editor persisted in IndexedDB
- Outbox records replayed on **Sync now**
- Unsynced badge driven by compacted outbox size
- Conflict dialog: keep local or server copy
- Checkbox to force a conflict for the active note (demo)


## How to run

```bash
# from portfolio_react/
pnpm install
pnpm dev
```

Open **http://localhost:5010**

See also [docs/RUNBOOK.md](../docs/RUNBOOK.md).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Port **5010** (strict) |
| `pnpm check` | Typecheck, Vitest, oxlint |

## Manual check

1. Edit a note and save — badge shows unsynced entries.
2. Click **Sync now** — badge clears when the mock server accepts changes.
3. Enable **Force conflict**, save, sync — pick local or server in the dialog.
