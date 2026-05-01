#!/usr/bin/env python3
"""Local GrabCut extractor for difficult pet photos."""

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter


def main() -> int:
    if len(sys.argv) != 7:
        print("usage: grabcut-pet.py <input> <output> <x> <y> <w> <h>", file=sys.stderr)
        return 2

    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    x, y, w, h = map(int, sys.argv[3:7])

    bgr = cv2.imread(str(src), cv2.IMREAD_COLOR)
    if bgr is None:
        raise SystemExit(f"could not read {src}")

    mask = np.zeros(bgr.shape[:2], np.uint8)
    bgd_model = np.zeros((1, 65), np.float64)
    fgd_model = np.zeros((1, 65), np.float64)
    cv2.grabCut(bgr, mask, (x, y, w, h), bgd_model, fgd_model, 8, cv2.GC_INIT_WITH_RECT)
    keep = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype("uint8")

    # Smooth the matte enough to avoid jagged fur edges.
    alpha = Image.fromarray(keep, mode="L").filter(ImageFilter.GaussianBlur(1.0))
    rgba = Image.open(src).convert("RGBA")
    rgba.putalpha(alpha)

    bbox = rgba.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        pad = 36
        left = max(0, left - pad)
        top = max(0, top - pad)
        right = min(rgba.width, right + pad)
        bottom = min(rgba.height, bottom + pad)
        rgba = rgba.crop((left, top, right, bottom))

    dst.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(dst)
    print(f"wrote {dst}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
