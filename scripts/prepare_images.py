"""Crop + resize the source stills listed in scripts/images.json into assets/img/*.jpg.

Dev-time only (CI never runs it). Sources are not committed; download them from the
`wallhaven` link of each entry into a folder and pass that folder:

    python scripts/prepare_images.py path/to/sources
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageFile, PngImagePlugin

# Some wallpaper PNGs carry huge metadata chunks and a corrupt colour-profile CRC.
PngImagePlugin.MAX_TEXT_CHUNK = 200 * 1024 * 1024
ImageFile.LOAD_TRUNCATED_IMAGES = True

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img"


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src_dir = Path(sys.argv[1])
    OUT.mkdir(parents=True, exist_ok=True)
    for entry in json.loads((ROOT / "scripts" / "images.json").read_text(encoding="utf-8")):
        src = src_dir / entry["source"]
        if not src.exists():
            sys.exit(f"missing source {src} — download it from {entry['wallhaven']}")
        im = Image.open(src).convert("RGB")
        x0, y0, x1, y1 = entry["crop"]
        im = im.crop((round(x0 * im.width), round(y0 * im.height), round(x1 * im.width), round(y1 * im.height)))
        w = entry["width"]
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        dest = OUT / f"{entry['id']}.jpg"
        im.save(dest, "JPEG", quality=80, optimize=True, progressive=True)
        print(f"{dest.name:16} {im.width}x{im.height}  {dest.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
