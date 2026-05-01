# Cat Asset Guide

Cat Companion uses PNG images for each pose. The renderer wraps each image in a transparent Electron window and applies CSS animation.

## Where Assets Live

```text
src/assets/cats/momo
src/assets/cats/java
```

## Current Pose Filenames

Momo:

```text
momo_idle.png
momo_walk.png
momo_sleep.png
momo_alert.png
momo_stretch.png
momo_sideLie.png
momo_roll.png
momo_reachUp.png
```

Java:

```text
java_idle.png
java_walk.png
java_sleep.png
java_alert.png
java_bellyUp.png
java_sitLegUp.png
java_groom.png
```

## Recommended Format

- PNG.
- Transparent background is preferred.
- A little furniture/background is acceptable if transparency would cut off the cat.
- Longest side around `800-1200px`.
- Full cat body should be visible for the pose.
- Add 5-10% transparent padding around the cat where possible.
- Keep pose filenames unchanged when replacing images.

## iPhone Sticker Workflow

This is often better than automatic segmentation:

1. Open a cat photo on iPhone.
2. Long-press the cat subject.
3. Save/share the extracted subject as a PNG if possible.
4. AirDrop it to the Mac.
5. Rename it to the target pose filename.
6. Replace the file under `src/assets/cats/<cat-id>/`.
7. Restart the app.

## Live Photo Workflow

Live Photos cannot be used directly by the app.

For a static pose:

1. Edit the Live Photo.
2. Pick the best Key Photo.
3. Export/extract the cat as a PNG.

For an animated pose, export the Live Photo as a short video and split it into PNG frames. The current app does not yet play frame sequences, but the renderer can be extended to support that later.

## Local Extraction Scripts

The repo includes helper scripts used during prototyping:

```text
scripts/extract-pet.swift
scripts/pad-transparent.py
scripts/crop-photo.py
scripts/make-photo-icon.py
```

They are optional. The app itself only needs the final files under `src/assets/cats/` and `src/assets/icons/`.
