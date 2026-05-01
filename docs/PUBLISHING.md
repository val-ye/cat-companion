# Publishing and Sharing

This app is intended for lightweight personal/public sharing. It is not currently signed or notarized.

## Build Locally

```bash
npm install
npm run dist:mac:local
```

Artifacts are written to `dist/`.

For Apple Silicon Macs, share:

```text
dist/Cat Companion-0.1.0-arm64.dmg
```

For Intel Macs, share:

```text
dist/Cat Companion-0.1.0.dmg
```

## GitHub Release Flow

1. Push the repo to GitHub.
2. Create a release, for example `v0.1.0`.
3. Upload the `.dmg` files from `dist/` as release assets.
4. Share the release URL.

## One-Line Install Command

After uploading a DMG somewhere public, users can install with:

```bash
curl -L "YOUR_DMG_URL" -o /tmp/cat-companion.dmg && \
hdiutil attach /tmp/cat-companion.dmg && \
cp -R "/Volumes/Cat Companion/Cat Companion.app" /Applications/ && \
hdiutil detach "/Volumes/Cat Companion" && \
open "/Applications/Cat Companion.app"
```

If macOS blocks the unsigned app:

```bash
xattr -dr com.apple.quarantine "/Applications/Cat Companion.app"
open "/Applications/Cat Companion.app"
```

## Source Install

For users comfortable with Node:

```bash
git clone <repo-url> cat-companion
cd cat-companion
npm install
npm start
```

## What Not to Upload

Do not upload these to GitHub:

- `node_modules/`
- `dist/`
- `art/generated/`
- `art/references/`
- `art/contact-candidates/`
- local raw photos
