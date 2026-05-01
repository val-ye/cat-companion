#!/usr/bin/env python3
"""Add transparent padding around a PNG asset."""

import sys
from pathlib import Path
from PIL import Image


def main() -> int:
    if len(sys.argv) < 4:
        print("usage: pad-transparent.py <input.png> <output.png> <bottom-px> [top-px] [left-px] [right-px]", file=sys.stderr)
        return 2

    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    bottom = int(sys.argv[3])
    top = int(sys.argv[4]) if len(sys.argv) > 4 else 0
    left = int(sys.argv[5]) if len(sys.argv) > 5 else 0
    right = int(sys.argv[6]) if len(sys.argv) > 6 else 0

    image = Image.open(src).convert("RGBA")
    canvas = Image.new("RGBA", (image.width + left + right, image.height + top + bottom), (0, 0, 0, 0))
    canvas.alpha_composite(image, (left, top))
    dst.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dst)
    print(f"wrote {dst}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
