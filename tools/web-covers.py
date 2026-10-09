"""Box art for the web ports (src/app/web-games.ts): one A&D "web port" series, 768x1152 like the other covers.
A retro sunset and perspective grid in each game's own colours, the title, tagline and the site it runs on.
Run: python tools/web-covers.py   (reads the list straight from web-games.ts)"""
import colorsys, hashlib, math, re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = Path("C:/Windows/Fonts")
W, H = 768, 1152
source = (ROOT / "src/app/web-games.ts").read_text(encoding="utf8")
games = re.findall(r'\{ id: "([^"]+)", title: \["([^"]*)", "([^"]*)"\], url: "([^"]+)", genre: "([^"]+)", tagline: "([^"]+)"', source)
font = lambda name, size: ImageFont.truetype(str(FONTS / name), size)

def fit(draw, text, name, size, width):
    while size > 20 and draw.textlength(text, font=font(name, size)) > width: size -= 4
    return font(name, size)

def cover(game_id, top, bottom, url, genre, tagline):
    hue = int(hashlib.md5(game_id.encode()).hexdigest()[:4], 16) / 65535
    rgb = lambda h, s, v: tuple(int(c * 255) for c in colorsys.hsv_to_rgb(h % 1, s, v))
    sky_top, sky_low, sun, grid = rgb(hue, .75, .16), rgb(hue + .08, .8, .55), rgb(hue + .12, .55, 1), rgb(hue + .5, .6, 1)
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    horizon = 700
    for y in range(horizon):  # sky
        t = y / horizon
        d.line([(0, y), (W, y)], fill=tuple(int(a + (b - a) * t ** 1.6) for a, b in zip(sky_top, sky_low)))
    d.rectangle([0, horizon, W, H], fill=rgb(hue, .7, .08))
    # striped sun, half under the horizon
    glow = Image.new("RGB", (W, H)); ImageDraw.Draw(glow).ellipse([W / 2 - 300, horizon - 330, W / 2 + 300, horizon + 270], fill=sun)
    img = Image.blend(img, Image.composite(glow, img, glow.convert("L").point(lambda v: 90 if v else 0)).filter(ImageFilter.GaussianBlur(40)), .55)
    d = ImageDraw.Draw(img)
    d.ellipse([W / 2 - 210, horizon - 230, W / 2 + 210, horizon + 190], fill=sun)
    for i in range(7):
        y = horizon - 110 + i * 18
        d.rectangle([0, y, W, y + 3 + i * 2], fill=sky_low)
    d.rectangle([0, horizon, W, H], fill=rgb(hue, .7, .08))
    # perspective grid floor
    for i in range(1, 16):
        y = horizon + (H - horizon) * (i / 15) ** 2
        d.line([(0, y), (W, y)], fill=grid, width=2)
    for i in range(-12, 13):
        d.line([(W / 2 + i * 14, horizon), (W / 2 + i * 150, H)], fill=grid, width=2)
    # scanlines over everything
    over = Image.new("RGBA", (W, H), (0, 0, 0, 0)); od = ImageDraw.Draw(over)
    for y in range(0, H, 4): od.line([(0, y), (W, y)], fill=(0, 0, 0, 38))
    img = Image.alpha_composite(img.convert("RGBA"), over)
    d = ImageDraw.Draw(img)
    # top band
    d.rectangle([0, 0, W, 64], fill=(236, 232, 218))
    d.text((32, 18), "A&D ARCADE", font=font("ariblk.ttf", 24), fill=(26, 26, 26))
    d.text((W - 32, 20), "WEB PORT", font=font("consolab.ttf", 22), fill=(26, 26, 26), anchor="ra")
    d.text((32, 92), genre.upper(), font=font("consolab.ttf", 26), fill=(255, 255, 255, 220))
    # title block, shadowed
    y = 140
    for text, size in ((top, 78), (bottom, 150)):
        if not text: continue
        f = fit(d, text, "impact.ttf", size, W - 64)
        for dx, dy in ((6, 6), (3, 3)): d.text((32 + dx, y + dy), text, font=f, fill=(0, 0, 0, 160))
        d.text((32, y), text, font=f, fill=(255, 250, 235))
        y += f.size * 1.02
    d.text((34, y + 10), tagline, font=fit(d, tagline, "georgiai.ttf", 34, W - 68), fill=(255, 245, 225))
    # footer band
    d.rectangle([0, H - 70, W, H], fill=(20, 20, 20))
    host = re.sub(r"^https?://(www\.)?", "", url).split("/")[0]
    d.text((32, H - 48), f"PLAYS ONLINE · {host}", font=font("consolab.ttf", 24), fill=(236, 232, 218))
    img.convert("RGB").save(ROOT / "public" / f"{game_id}-cover-box-art.png", optimize=True)

for game in games: cover(*game)
print(f"{len(games)} covers written")
assert len(games) == 25, len(games)
