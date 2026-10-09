"""Static cover thumbnails, so no image goes through Vercel's optimizer (a function, billed as Fast Origin Transfer).
public/<name>-cover-box-art.png -> public/covers/<name>-cover-box-art-384.webp (shelf) and -640.webp (3D box).
Also the About portrait. Run after adding or changing a cover: python tools/cover-thumbs.py"""
from pathlib import Path
from PIL import Image

PUBLIC = Path(__file__).resolve().parent.parent / "public"
out = PUBLIC / "covers"
out.mkdir(exist_ok=True)
covers = sorted(PUBLIC.glob("*-cover-box-art.png"))
for cover in covers:
    image = Image.open(cover).convert("RGB")
    for width in (384, 640):
        thumb = image.resize((width, round(image.height * width / image.width)), Image.LANCZOS)
        thumb.save(out / f"{cover.stem}-{width}.webp", quality=80, method=6)
portrait = Image.open(PUBLIC / "ad-about-cutout.png")
portrait.thumbnail((1600, 1600), Image.LANCZOS)
portrait.save(PUBLIC / "ad-about-cutout.webp", quality=82, method=6)
print(f"{len(covers)} covers -> {sum(f.stat().st_size for f in out.glob('*.webp')) / 1e6:.1f} MB of thumbnails; portrait {(PUBLIC / 'ad-about-cutout.webp').stat().st_size / 1e3:.0f} KB")
