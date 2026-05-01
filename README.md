# Cat Companion

A small macOS desktop pet app. Cats live in the Dock, wander around the desktop, nap for long stretches, and occasionally remind you to drink water or take a break.

The current build is photo-based: each pose is a PNG asset extracted from real cat photos, with CSS "puppet" animation layered on top.

## Features

- Desktop cats: drag them around, let them wander, or close a cat back to the Dock.
- Multi-cat mode: enable one cat or several cats at the same time.
- Dock presence: the app icon uses a curled sleeping cat image.
- Photo-based poses: idle, walk, sleep, stretch, roll, belly-up, grooming, and alert poses.
- Long naps: sleep can last 3 hours, rotating sleep poses hourly.
- Break reminder: fullscreen non-locking reminder with a countdown.
- Custom reminder copy: supports a nickname and `{name}` template variable.
- Extensible cats: add a JS cat definition and PNG pose assets.

## Included Cats

| ID | Name | Notes |
| --- | --- | --- |
| `momo` | 馍馍 / Momo | Ragdoll, blue eyes, pink nose, fluffy long body, big paws |
| `java` | Java | Blue-gray short hair, small head, wide body, black nose, round eyes |

## Quick Start

Requirements:

- macOS
- Node.js 18+

```bash
git clone <your-repo-url> cat-companion
cd cat-companion
npm install
npm start
```

`npm start` intentionally clears `ELECTRON_RUN_AS_NODE` because some local shells set it and make Electron behave like plain Node.

## Build a macOS App

For local/private distribution:

```bash
npm run dist:mac:local
```

Outputs are written to `dist/`:

- `Cat Companion-<version>-arm64.dmg`
- `Cat Companion-<version>.dmg`
- matching `.zip` files

The app is not signed/notarized. On another Mac, if Gatekeeper blocks it:

```bash
xattr -dr com.apple.quarantine "/Applications/Cat Companion.app"
open "/Applications/Cat Companion.app"
```

More release notes: [`docs/PUBLISHING.md`](docs/PUBLISHING.md).

## Controls

| Action | Behavior |
| --- | --- |
| Drag a cat | Move it anywhere on screen |
| Double-click a cat | Trigger reminder now |
| Cmd/Ctrl-click a cat | Close that cat window |
| Dock right-click | Toggle cats, open settings, trigger reminder |
| Esc in reminder | Dismiss reminder |

## Settings

Settings are stored at:

```text
~/Library/Application Support/cat-companion/cat-companion-settings.json
```

Settings include active cats, reminder interval, reminder duration, nickname, reminder text, and cat scale.

## Replacing Cat Photos

Final app assets live in:

```text
src/assets/cats/momo
src/assets/cats/java
```

Use transparent PNGs when possible. Longest side around `800-1200px` works well. Keep the same filename to replace a pose, then restart the app.

See [`docs/ASSETS.md`](docs/ASSETS.md) for the pose filenames and asset guidelines.

## Adding New Cats

See [`docs/ADDING_CATS.md`](docs/ADDING_CATS.md).

Short version:

1. Add PNG pose assets under `src/assets/cats/<cat-id>/`.
2. Add `src/cats/<cat-id>.js`.
3. Register it in `src/cats/index.js`.

## Public Repo Notes

Do commit:

- `src/`
- `docs/`
- `scripts/`
- `package.json`
- `package-lock.json`
- `README.md`
- `LICENSE`

Do not commit:

- `node_modules/`
- `dist/`
- `art/generated/`
- `art/references/`
- local source photos or temporary extraction files
