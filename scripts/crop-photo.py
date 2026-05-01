#!/usr/bin/env python3
"""Crop a source photo without segmentation, preserving background context."""

import sys
from pathlib import Path
from PIL import Image, ImageOps


def main() -> int:
    if len(sys.argv) != 7:
        print("usage: crop-photo.py <input> <output> <x> <y> <w> <h>", file=sys.stderr)
        return 2

    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    x, y, w, h = map(int, sys.argv[3:7])
    image = ImageOps.exif_transpose(Image.open(src)).convert("RGBA")
    crop = image.crop((x, y, x + w, y + h))
    dst.parent.mkdir(parents=True, exist_ok=True)
    crop.save(dst)
    print(f"wrote {dst}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
