"""Box art for the web ports (src/app/web-games.ts), 768x1152 like the other covers, from real game art in tools/web-cover-art/:
- official portrait covers (Steam's 600x900 library art, or the Wikipedia infobox cover) fill the box;
- landscape art (a fan site's preview image, or the game's own title screen) sits over a blurred backdrop of itself,
  with the title underneath, since that art carries no box title.
Then run tools/cover-thumbs.py for the shelf thumbnails.   Run: python tools/web-covers.py"""
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "tools/web-cover-art"
FONTS = Path("C:/Windows/Fonts")
W, H = 768, 1152
font = lambda name, size: ImageFont.truetype(str(FONTS / name), size)
games = re.findall(r'\{ id: "([^"]+)", title: \["([^"]*)", "([^"]*)"\], url: "([^"]+)", genre: "([^"]+)", tagline: "([^"]+)"', (ROOT / "src/app/web-games.ts").read_text(encoding="utf8"))
# the runner / cooking / girl-game library (src/app/library-games.ts): its helper calls, then its plain entries
library = (ROOT / "src/app/library-games.ts").read_text(encoding="utf8")
games += [(i, "TEMPLE RUN 2", e, "classic", "Endless runner", "Take the idol, if you dare.") for i, e in re.findall(r'temple\("([^"]+)", "([^"]*)"', library)]
games += [(i, "SUBWAY SURFERS", c, "classic", "Endless runner", t) for i, c, t in re.findall(r'subway\("([^"]+)", "([^"]+)", "([^"]+)"\)', library)]
games += [(i, "PAPA'S", n, "classic", "Restaurant time management", t) for i, n, t in re.findall(r'papas\("([^"]+)", "([^"]+)", "[^"]+", "[^"]+", "([^"]+)"\)', library)]
games += [(i, a, b, "classic", g, t) for i, a, b, g, t in re.findall(r'\{ id: "([^"]+)", title: \["([^"]*)", "([^"]*)"\],[^\n]*? genre: "([^"]+)", tagline: "([^"]+)"', library)]

def fill(image, width, height):
    scale = max(width / image.width, height / image.height)
    image = image.resize((round(image.width * scale), round(image.height * scale)), Image.LANCZOS)
    left, top = (image.width - width) // 2, (image.height - height) // 2
    return image.crop((left, top, left + width, top + height))

def fit(draw, text, name, size, width):
    while size > 20 and draw.textlength(text, font=font(name, size)) > width: size -= 4
    return font(name, size)

def cover(game_id, top, bottom, url, genre, tagline):
    found = [file for file in ART.glob(f"{game_id}.*") if file.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp")]
    if not found: return print("no art yet:", game_id)
    art = Image.open(found[0]).convert("RGB")
    if art.height / art.width >= 1.05:   # a real box cover: let it be the box
        canvas = fill(art, W, H)
    else:
        canvas = ImageEnhance.Brightness(fill(art, W, H).filter(ImageFilter.GaussianBlur(28))).enhance(.45)
        shot = art.resize((W - 64, round(art.height * (W - 64) / art.width)), Image.LANCZOS)
        y = 150
        shadow = Image.new("RGBA", (shot.width + 40, shot.height + 40), (0, 0, 0, 0))
        ImageDraw.Draw(shadow).rectangle([20, 20, shot.width + 20, shot.height + 20], fill=(0, 0, 0, 170))
        canvas.paste(shadow.filter(ImageFilter.GaussianBlur(14)), (12, y - 8), shadow.filter(ImageFilter.GaussianBlur(14)))
        canvas.paste(shot, (32, y))
        d = ImageDraw.Draw(canvas)
        d.text((32, 96), genre.upper(), font=font("consolab.ttf", 26), fill=(236, 232, 218))
        ty = y + shot.height + 40
        for text, size in ((top, 64), (bottom, 120)):
            if not text: continue
            f = fit(d, text, "impact.ttf", size, W - 64)
            d.text((35, ty + 3), text, font=f, fill=(0, 0, 0))
            d.text((32, ty), text, font=f, fill=(255, 250, 235))
            ty += f.size * 1.04
        d.text((34, ty + 8), tagline, font=fit(d, tagline, "georgiai.ttf", 34, W - 68), fill=(236, 232, 218))
        d.rectangle([0, 0, W, 64], fill=(236, 232, 218))
        d.text((32, 18), "A&D ARCADE", font=font("ariblk.ttf", 24), fill=(26, 26, 26))
        d.text((W - 32, 20), "WEB PORT" if url != "classic" else "CLASSIC", font=font("consolab.ttf", 22), fill=(26, 26, 26), anchor="ra")
    canvas.save(ROOT / "public" / f"{game_id}-cover-box-art.png", optimize=True)

for game in games: cover(*game)
print(f"{len(games)} covers written")
