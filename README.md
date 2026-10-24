## Live demo

https://hafizovs.github.io/react-offline-notes/

# Offline notes

## About

Offline-first notes with Dexie, an outbox queue, mock sync, and a conflict dialog, shipped as a Vite PWA. Local saves raise an unsynced badge until **Sync now** replays them to the mock server. A forced conflict asks whether to keep the local copy or the server copy.

## Capabilities

- Local notes with Dexie and an outbox queue
- **Sync now** against a mock server
- Unsynced badge after a local save
- Conflict dialog to keep the local or server copy
- **Force conflict** demo control
- Vite PWA

## Functionality

- Edit a note and save, then read the unsynced badge
- Click **Sync now** and watch the badge clear when the mock server accepts the changes
- Enable **Force conflict**, save, sync, and keep either the local or server copy

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
