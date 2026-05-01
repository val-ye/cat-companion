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
dist/Purrtners-0.2.0-arm64.dmg
```

For Intel Macs, share:

```text
dist/Purrtners-0.2.0.dmg
```

## GitHub Release Flow

1. Push the repo to GitHub.
2. Create a release, for example `v0.2.0`.
3. Upload the `.dmg` files from `dist/` as release assets.
4. Share the release URL.

## One-Line Install Command

After uploading a DMG somewhere public, users can install with:

```bash
curl -L "YOUR_DMG_URL" -o /tmp/purrtners.dmg && \
MOUNT="$(hdiutil attach /tmp/purrtners.dmg | awk '/\/Volumes\//{print substr($0,index($0,"/Volumes/"))}' | tail -1)" && \
cp -R "$MOUNT/Purrtners.app" /Applications/ && \
hdiutil detach "$MOUNT" && \
open "/Applications/Purrtners.app"
```

If macOS blocks the unsigned app:

```bash
xattr -dr com.apple.quarantine "/Applications/Purrtners.app"
open "/Applications/Purrtners.app"
```

## Source Install

For users comfortable with Node:

```bash
git clone <repo-url> purrtners
cd purrtners
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
