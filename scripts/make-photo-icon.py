#!/usr/bin/env python3
"""Create macOS icon PNGs/ICNS from a transparent cat photo asset."""

from pathlib import Path
from PIL import Image, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ICONS = ROOT / "src" / "assets" / "icons"
SOURCE = ROOT / "src" / "assets" / "cats" / "momo" / "momo_sleep.png"


def centered_icon(size: int) -> Image.Image:
    src = Image.open(SOURCE).convert("RGBA")
    bbox = src.getbbox()
    if bbox:
        src = src.crop(bbox)

    # Soft rounded backdrop helps the curled cat read at small Dock sizes.
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg = Image.new("RGBA", (size, size), (238, 231, 216, 255))
    mask = Image.new("L", (size, size), 0)
    mask = ImageOps.expand(mask.crop((0, 0, size, size)), border=0, fill=0)
    from PIL import ImageDraw

    draw = ImageDraw.Draw(mask)
    pad = int(size * 0.08)
    draw.rounded_rectangle((pad, pad, size - pad, size - pad), radius=int(size * 0.22), fill=255)
    canvas.alpha_composite(Image.composite(bg, Image.new("RGBA", (size, size), (0, 0, 0, 0)), mask))

    shadow = Image.new("RGBA", src.size, (0, 0, 0, 0))
    shadow_alpha = src.getchannel("A").filter(ImageFilter.GaussianBlur(max(2, size // 90)))
    shadow.putalpha(shadow_alpha.point(lambda a: int(a * 0.32)))

    max_dim = int(size * 0.76)
    src.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    shadow.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

    x = (size - src.width) // 2
    y = (size - src.height) // 2 + int(size * 0.03)
    canvas.alpha_composite(shadow, (x + int(size * 0.018), y + int(size * 0.028)))
    canvas.alpha_composite(src, (x, y))
    return canvas


def main() -> None:
    ICONS.mkdir(parents=True, exist_ok=True)
    for name, size in [
        ("dock-sleeping.png", 512),
        ("dock-awake.png", 512),
        ("tray.png", 32),
        ("app.png", 1024),
    ]:
        centered_icon(size).save(ICONS / name)
        print("wrote", ICONS / name)


if __name__ == "__main__":
    main()
