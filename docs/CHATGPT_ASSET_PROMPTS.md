# ChatGPT asset prompts — A&D Arcade portal

These follow the language of the reference site (leonardomoreira.com.br) and of our own covers:
the reference shows **flatbed scans of real 1990s big boxes** and its wallpapers are **flat 1970s
stripe graphics on aged paper** and a **pixel-art blueprint**. Our covers add the cream A&D frame.
Prompts below lock both in.

All files are optional — the site uses each one automatically as soon as it exists.

## How to use (important)

1. **Start one ChatGPT chat per game.** First paste the **Style guide** below on its own, then attach that game's
   front cover (path given) **and** `public/kart-cover-box-art.png` as the house-style reference.
2. Then paste the asset prompts for that game one at a time, re-attaching the cover each time.
3. Pick the size written on each prompt. Download PNG, save under the exact file name in `lmogolyan-arcade/public/`.
4. If a result shows a 3D box, a hand, a table, or misspelled text, reply: *“Redo it as a flat, straight-on flatbed scan of the printed panel only, edge to edge, and spell the text exactly as given.”*
5. Tell me when they're in; I'll compress them for the web.

Priority: **back covers → spines → wallpapers → box scans.** The share image I make from a real screenshot of the site, like the reference does, so it isn't listed here.

---

## Style guide — paste this first in every chat

```
A&D ARCADE STYLE GUIDE — follow it for every image in this chat.
World: a late-1990s PC games collector's archive. Every image must look like a real, physical, printed object or a real period graphic — never like modern digital art, a 3D render or a mockup.
Box packaging language (match the attached cover exactly): a cream, slightly yellowed paper frame around a hand-painted illustration; a top band reading “A&D ARCADE” between small diamond ornaments in a dark ink serif; a tiny “PC / BROWSER EDITION” mark in the top-right corner; a bottom band reading “THE A&D COLLECTION” between thin rules; big chunky retro title lettering with a dark outline and drop shadow, copied from the cover.
Print and finish: offset-printed cardboard seen in a flatbed scan — flat even light, no glare, true colours, faint halftone dots, soft scuffs and creases, rubbed edges and corners, a little ink wear. Slightly warm, aged, but clean and legible.
Palette: take the colours from the attached cover; neutrals are paper cream #ECE8DA / #DDD9C8 and ink #1A1A1A.
Typography: chunky title lettering from the cover; secondary text in a classic bookish serif (like Fraunces or Times); small print in a typewriter-style mono (like IBM Plex Mono). Keep text short and spelled exactly as given.
Never: perspective, 3D box mockups, hands, tables, backgrounds around the artwork, glossy plastic, lens flares, neon purple, modern UI, gradients that look digital, real company logos, ESRB/PEGI marks, watermarks, copyright notices.
```

---

## 1. Wallpapers (one chat, paste the style guide first, no attachments needed)

The reference's wallpapers: neon stripe bands sweeping in from one edge over cream paper (“Clankers”), a faded 1970s sunset landscape made of flat stripes (“Cream Minimal”), and a dark-blue pixel blueprint map (“DHARMA”). Ours are siblings of those, built from the A&D mark (a curved arc ending in a five-pointed star) and our colours: teal #008080, amber #F5B800, phosphor green #5BD25B, signal red #E8432E, paper #ECE8DA, ink #1A1A1A.

### “A&D” — `public/wallpapers/arcade.png` (1536×1024 landscape)
> A flat graphic desktop wallpaper in the style of 1970s–80s retro stripe posters, 1536×1024 landscape. Background: warm cream paper #ECE8DA with a very fine paper grain and faint print mottling. From the bottom-left corner, five thick parallel stripe bands — signal red #E8432E, amber #F5B800, phosphor green #5BD25B, teal #008080 and ink #1A1A1A — sweep upward in one smooth wide arc that curves to the right across the lower third and ends just past the centre in a single bold five-pointed star outlined in the same stripes. The stripes have a soft glow at their edges as if lit like neon tubes, and a slight print misregistration. Everything else is empty cream paper: keep the left 10% above the stripes, the whole top half and the bottom 12% calm and empty because desktop icons and a dock sit there. Flat 2D graphic, no text, no letters, no logos, no objects, no 3D.

### “Paper” — `public/wallpapers/paper.png` (1536×1024 landscape)
> A flat, faded 1970s graphic desktop wallpaper, 1536×1024 landscape, printed on aged cream paper with soft foxing, grain and darker worn edges. A minimal landscape made only of flat stripes and simple shapes in a muted palette of dusty teal #6F9C99, faded amber #D9A845, sage green #A9B48E and warm brown #9A6A3E: a large pale half-circle sun sitting on the horizon on the left, horizontal stripe bands for the sea across the lower third, and on the right a wide road of three parallel stripes rising in a smooth S-curve like a race track bending over a hill. Muted, quiet, low contrast, lots of empty paper in the upper two thirds. Flat 2D print, no text, no logos, no people, no vehicles, no 3D.

### “Midnight” — `public/wallpapers/midnight.png` (1536×1024 landscape)
> A pixel-art blueprint desktop wallpaper, 1536×1024 landscape, chunky visible pixels like a 1990s VGA screen. Deep navy background #0B1240 with a faint pixel grid. In the centre, a top-down floor plan of a small arcade hall drawn in glowing blue-violet pixel lines inside a large octagonal frame: rows of tiny arcade cabinets, a counter, a prize shelf, two player stations facing each other marked “P1” and “P2”, connected by dotted routes and small circular nodes. Around it, scattered phosphor-green #5BD25B pixel annotations: small boxed notes, tiny charts, a radar circle, arrows, coordinates and short unreadable labels, with one small label reading “A&D ARCADE — FLOOR PLAN”. A few salmon-pink accent dots. Calm, dense, technical, low brightness overall. Flat 2D pixel art, no 3D, no photos.

---

## 2. Per-game box assets

For each game, the outputs map onto the 3D box in the Collection:
- **Back** → `public/box-art/<id>-back.png`, **1024×1536 portrait**: the full back panel, edge to edge.
- **Spine** → `public/box-art/<id>-spine.png`, **1024×1536 portrait**: only the middle strip is used; the sides must be pure black.
- **Box scans** (our four originals, optional) → `public/box-art/<id>-photo-1.png` … `-photo-4.png`, **1536×1024 landscape**: the thumbnail row under the synopsis, like the reference's scans of disks, manuals and inserts.

---

### 01 · A&D PONG  (`pong`)
Attach: `public/pong-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/pong-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “A&D PONG” at the top in the cover's exact lettering, smaller; under it the line “Thunder serves under a travelling storm.” in italic serif; three small framed screenshots of the game (versus paddle duel), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “CPU with three levels”, “Private four-letter rooms”, “Film Frenzy wind storms”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1–2 PLAYERS” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/pong-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “A&D PONG” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “01”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

**Box scans** (optional, 1536×1024 each, attach the cover each time). These are flatbed scans like the reference's, laid on a plain warm off-white scanner background #ECE8DA with soft shadows only where paper lifts.
1. `public/box-art/pong-photo-1.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the CD-ROM for the game whose cover is attached, sitting in an open clear jewel case: a silver disc with a printed label using a crop of the cover art, the title “A&D PONG” in the cover lettering and “A&D ARCADE · DISC 1” in small mono text. Plain warm off-white background, flat scanner light, faint scratches on the case. No hands, no table, no perspective.
2. `public/box-art/pong-photo-2.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the slim printed manual for the game whose cover is attached, opened flat to a double page: left page a hand-drawn controls diagram showing “W/S · ↑/↓ · drag on touch”, right page short columns of “How to play” text with small spot illustrations in the cover's style; yellowed paper, staple in the middle, page numbers. Plain warm off-white background, flat scanner light. Only the headings need to be readable.
3. `public/box-art/pong-photo-3.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the paper inserts that came in the box of the game whose cover is attached: a folded fold-out poster of the cover illustration, a small registration card with tick boxes, and a cream “A&D ARCADE” sticker sheet with the A&D arc-and-star mark, arranged neatly and slightly overlapping on a plain warm off-white background. Flat scanner light, slight paper curl and wear.
4. `public/box-art/pong-photo-4.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the front cover attached, scanned flat as a physical box face: the whole cover centred with a narrow margin of plain warm off-white scanner background around it, showing real cardboard wear — rubbed corners, a small crease, a faded price sticker in the top corner reading “$29.99”. Flat light, no perspective.

---

### 02 · A&D KART  (`kart`)
Attach: `public/kart-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/kart-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “A&D KART” at the top in the cover's exact lettering, smaller; under it the line “Dust clouds, sharp corners, one more lap.” in italic serif; three small framed screenshots of the game (party kart racer), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Room codes for friends”, “Items and drift boosts”, “Leaderboards per track”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1–8 PLAYERS” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/kart-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “A&D KART” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “02”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

**Box scans** (optional, 1536×1024 each, attach the cover each time). These are flatbed scans like the reference's, laid on a plain warm off-white scanner background #ECE8DA with soft shadows only where paper lifts.
1. `public/box-art/kart-photo-1.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the CD-ROM for the game whose cover is attached, sitting in an open clear jewel case: a silver disc with a printed label using a crop of the cover art, the title “A&D KART” in the cover lettering and “A&D ARCADE · DISC 1” in small mono text. Plain warm off-white background, flat scanner light, faint scratches on the case. No hands, no table, no perspective.
2. `public/box-art/kart-photo-2.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the slim printed manual for the game whose cover is attached, opened flat to a double page: left page a hand-drawn controls diagram showing “Keyboard · gamepad · touch”, right page short columns of “How to play” text with small spot illustrations in the cover's style; yellowed paper, staple in the middle, page numbers. Plain warm off-white background, flat scanner light. Only the headings need to be readable.
3. `public/box-art/kart-photo-3.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the paper inserts that came in the box of the game whose cover is attached: a folded fold-out poster of the cover illustration, a small registration card with tick boxes, and a cream “A&D ARCADE” sticker sheet with the A&D arc-and-star mark, arranged neatly and slightly overlapping on a plain warm off-white background. Flat scanner light, slight paper curl and wear.
4. `public/box-art/kart-photo-4.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the front cover attached, scanned flat as a physical box face: the whole cover centred with a narrow margin of plain warm off-white scanner background around it, showing real cardboard wear — rubbed corners, a small crease, a faded price sticker in the top corner reading “$29.99”. Flat light, no perspective.

---

### 03 · A&D PUCK  (`puck`)
Attach: `public/puck-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/puck-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “A&D PUCK” at the top in the cover's exact lettering, smaller; under it the line “One puck, two mallets, no mercy at the crease.” in italic serif; three small framed screenshots of the game (air hockey duel), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “CPU with three levels”, “Hits resolved on your side”, “Plays on phones”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1–2 PLAYERS” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/puck-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “A&D PUCK” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “03”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

**Box scans** (optional, 1536×1024 each, attach the cover each time). These are flatbed scans like the reference's, laid on a plain warm off-white scanner background #ECE8DA with soft shadows only where paper lifts.
1. `public/box-art/puck-photo-1.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the CD-ROM for the game whose cover is attached, sitting in an open clear jewel case: a silver disc with a printed label using a crop of the cover art, the title “A&D PUCK” in the cover lettering and “A&D ARCADE · DISC 1” in small mono text. Plain warm off-white background, flat scanner light, faint scratches on the case. No hands, no table, no perspective.
2. `public/box-art/puck-photo-2.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the slim printed manual for the game whose cover is attached, opened flat to a double page: left page a hand-drawn controls diagram showing “Mouse · finger · WASD / arrows”, right page short columns of “How to play” text with small spot illustrations in the cover's style; yellowed paper, staple in the middle, page numbers. Plain warm off-white background, flat scanner light. Only the headings need to be readable.
3. `public/box-art/puck-photo-3.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the paper inserts that came in the box of the game whose cover is attached: a folded fold-out poster of the cover illustration, a small registration card with tick boxes, and a cream “A&D ARCADE” sticker sheet with the A&D arc-and-star mark, arranged neatly and slightly overlapping on a plain warm off-white background. Flat scanner light, slight paper curl and wear.
4. `public/box-art/puck-photo-4.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the front cover attached, scanned flat as a physical box face: the whole cover centred with a narrow margin of plain warm off-white scanner background around it, showing real cardboard wear — rubbed corners, a small crease, a faded price sticker in the top corner reading “$29.99”. Flat light, no perspective.

---

### 04 · A&D CHEFS  (`chefs`)
Attach: `public/chefs-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/chefs-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “A&D CHEFS” at the top in the cover's exact lettering, smaller; under it the line “Two chefs, one kitchen, orders stacking up.” in italic serif; three small framed screenshots of the game (co-op cooking rush), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Four recipes”, “A CPU chef that helps”, “Shared online kitchen”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1–2 PLAYERS” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/chefs-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “A&D CHEFS” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “04”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

**Box scans** (optional, 1536×1024 each, attach the cover each time). These are flatbed scans like the reference's, laid on a plain warm off-white scanner background #ECE8DA with soft shadows only where paper lifts.
1. `public/box-art/chefs-photo-1.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the CD-ROM for the game whose cover is attached, sitting in an open clear jewel case: a silver disc with a printed label using a crop of the cover art, the title “A&D CHEFS” in the cover lettering and “A&D ARCADE · DISC 1” in small mono text. Plain warm off-white background, flat scanner light, faint scratches on the case. No hands, no table, no perspective.
2. `public/box-art/chefs-photo-2.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the slim printed manual for the game whose cover is attached, opened flat to a double page: left page a hand-drawn controls diagram showing “WASD / arrows · grab · chop”, right page short columns of “How to play” text with small spot illustrations in the cover's style; yellowed paper, staple in the middle, page numbers. Plain warm off-white background, flat scanner light. Only the headings need to be readable.
3. `public/box-art/chefs-photo-3.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the paper inserts that came in the box of the game whose cover is attached: a folded fold-out poster of the cover illustration, a small registration card with tick boxes, and a cream “A&D ARCADE” sticker sheet with the A&D arc-and-star mark, arranged neatly and slightly overlapping on a plain warm off-white background. Flat scanner light, slight paper curl and wear.
4. `public/box-art/chefs-photo-4.png`
> Following the style guide, a flatbed scan, 1536×1024 landscape, of the front cover attached, scanned flat as a physical box face: the whole cover centred with a narrow margin of plain warm off-white scanner background around it, showing real cardboard wear — rubbed corners, a small crease, a faded price sticker in the top corner reading “$29.99”. Flat light, no perspective.

---

### 05 · CUPHEAD  (`cuphead`)
Attach: `public/cuphead-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/cuphead-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “CUPHEAD” at the top in the cover's exact lettering, smaller; under it the line “Don't deal with the devil.” in italic serif; three small framed screenshots of the game (run-and-gun platformer), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Hand-drawn animation”, “Boss battles”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1–2 PLAYERS” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/cuphead-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “CUPHEAD” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “05”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 06 · 20 MINUTES TILL DAWN  (`20-minutes-till-dawn`)
Attach: `public/20-minutes-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/20-minutes-till-dawn-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “20 MINUTES TILL DAWN” at the top in the cover's exact lettering, smaller; under it the line “Survive the night. Build something devastating.” in italic serif; three small framed screenshots of the game (survival roguelite), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Upgrade combinations”, “Eldritch hordes”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/20-minutes-till-dawn-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “20 MINUTES TILL DAWN” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “06”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 07 · HOLLOW KNIGHT  (`hollow-knight`)
Attach: `public/hollow-knight-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/hollow-knight-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “HOLLOW KNIGHT” at the top in the cover's exact lettering, smaller; under it the line “Descend into the ruined kingdom of Hallownest.” in italic serif; three small framed screenshots of the game (metroidvania), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Hand-drawn kingdom”, “Tough-as-nails bosses”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/hollow-knight-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “HOLLOW KNIGHT” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “07”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 08 · ANGRY BIRDS  (`angry-birds-chrome`)
Attach: `public/angry-birds-chrome-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/angry-birds-chrome-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “ANGRY BIRDS” at the top in the cover's exact lettering, smaller; under it the line “Pull back. Let fly. Topple the pigs.” in italic serif; three small framed screenshots of the game (physics puzzler), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Classic episodes”, “Chrome-exclusive levels”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/angry-birds-chrome-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “ANGRY BIRDS” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “08”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 09 · ANGRY BIRDS EPIC  (`angry-birds-epic`)
Attach: `public/angry-birds-epic-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/angry-birds-epic-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “ANGRY BIRDS EPIC” at the top in the cover's exact lettering, smaller; under it the line “Swords, spatulas and pigs that need a beating.” in italic serif; three small framed screenshots of the game (turn-based rpg), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Turn-based battles”, “Crafting and gear”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/angry-birds-epic-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “ANGRY BIRDS EPIC” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “09”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 10 · ANGRY BIRDS HATCHERY  (`angry-birds-hatchery-island`)
Attach: `public/angry-birds-hatchery-island-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/angry-birds-hatchery-island-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “ANGRY BIRDS HATCHERY” at the top in the cover's exact lettering, smaller; under it the line “Hatch a flock. Then launch it.” in italic serif; three small framed screenshots of the game (island builder + slingshot), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Unreleased prototype”, “Hatch your own birds”, “325 recovered levels”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/angry-birds-hatchery-island-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “ANGRY BIRDS HATCHERY” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “10”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 11 · ANGRY BIRDS CLASSIC  (`angry-birds-chrome-flash`)
Attach: `public/angry-birds-chrome-flash-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/angry-birds-chrome-flash-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “ANGRY BIRDS CLASSIC” at the top in the cover's exact lettering, smaller; under it the line “The original slingshot, in Flash.” in italic serif; three small framed screenshots of the game (physics puzzler), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Classic levels”, “Flash classic”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/angry-birds-chrome-flash-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “ANGRY BIRDS CLASSIC” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “11”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 12 · ANGRY BIRDS SPACE  (`angry-birds-space`)
Attach: `public/angry-birds-space-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/angry-birds-space-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “ANGRY BIRDS SPACE” at the top in the cover's exact lettering, smaller; under it the line “Fling birds through zero gravity.” in italic serif; three small framed screenshots of the game (gravity puzzler), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Gravity shots”, “Timed levels”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/angry-birds-space-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “ANGRY BIRDS SPACE” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “12”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 13 · ANGRY BIRDS HALLOWEEN  (`angry-birds-halloween`)
Attach: `public/angry-birds-halloween-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/angry-birds-halloween-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “ANGRY BIRDS HALLOWEEN” at the top in the cover's exact lettering, smaller; under it the line “Pumpkins, full moons and pigs hiding in graveyards.” in italic serif; three small framed screenshots of the game (physics puzzler), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Halloween levels”, “Three bird types”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/angry-birds-halloween-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “ANGRY BIRDS HALLOWEEN” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “13”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 14 · CUT THE ROPE  (`cut-the-rope`)
Attach: `public/cut-the-rope-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/cut-the-rope-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “CUT THE ROPE” at the top in the cover's exact lettering, smaller; under it the line “Feed Om Nom the candy. Cut the right rope.” in italic serif; three small framed screenshots of the game (physics puzzler), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Every box, Cardboard to Mechanical”, “Stars and progress saved”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/cut-the-rope-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “CUT THE ROPE” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “14”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 15 · HELLTAKER  (`helltaker`)
Attach: `public/helltaker-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/helltaker-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “HELLTAKER” at the top in the cover's exact lettering, smaller; under it the line “A short game about sharply dressed demon girls.” in italic serif; three small framed screenshots of the game (puzzle adventure), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Chapters I–X + EX”, “Chapter select”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/helltaker-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “HELLTAKER” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “15”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 16 · ZUMA LOST TREASURE  (`zuma-the-lost-treasure`)
Attach: `public/zuma-the-lost-treasure-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/zuma-the-lost-treasure-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “ZUMA LOST TREASURE” at the top in the cover's exact lettering, smaller; under it the line “Stop the chain before it reaches the skull.” in italic serif; three small framed screenshots of the game (marble shooter), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Classic Zuma chains”, “Power-up balls”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/zuma-the-lost-treasure-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “ZUMA LOST TREASURE” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “16”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 17 · HILL CLIMB RACING  (`hill-climb-racing`)
Attach: `public/hill-climb-racing-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/hill-climb-racing-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “HILL CLIMB RACING” at the top in the cover's exact lettering, smaller; under it the line “Gas, brake, and try not to land on your head.” in italic serif; three small framed screenshots of the game (physics driving), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Every vehicle and stage”, “Upgrades and coins”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/hill-climb-racing-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “HILL CLIMB RACING” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “17”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 18 · SONIC THE HEDGEHOG 4 EPISODE I  (`sonic-4-episode-1`)
Attach: `public/sonic-4-episode-1-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/sonic-4-episode-1-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “SONIC THE HEDGEHOG 4 EPISODE I” at the top in the cover's exact lettering, smaller; under it the line “Picks up right where Sonic & Knuckles left off.” in italic serif; three small framed screenshots of the game (platformer), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “All four zones + final boss”, “Spin Dash and Homing Attack”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/sonic-4-episode-1-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “SONIC THE HEDGEHOG 4 EPISODE I” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “18”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 19 · ESCAPE ROAD  (`escape-road`)
Attach: `public/escape-road-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/escape-road-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “ESCAPE ROAD” at the top in the cover's exact lettering, smaller; under it the line “Steal a car. Lose the cops.” in italic serif; three small framed screenshots of the game (police chase), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Endless police chase”, “Unlockable cars”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/escape-road-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “ESCAPE ROAD” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “19”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 20 · ESCAPE ROAD 2  (`escape-road-2`)
Attach: `public/escape-road-2-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/escape-road-2-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “ESCAPE ROAD 2” at the top in the cover's exact lettering, smaller; under it the line “Bigger maps, angrier police.” in italic serif; three small framed screenshots of the game (police chase), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Endless police chase”, “Unlockable cars”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/escape-road-2-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “ESCAPE ROAD 2” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “20”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 21 · ESCAPE ROAD 3  (`escape-road-3`)
Attach: `public/escape-road-3-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/escape-road-3-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “ESCAPE ROAD 3” at the top in the cover's exact lettering, smaller; under it the line “The chase goes further.” in italic serif; three small framed screenshots of the game (police chase), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Endless police chase”, “Unlockable cars”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/escape-road-3-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “ESCAPE ROAD 3” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “21”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 22 · HOBO  (`hobo-1`)
Attach: `public/hobo-1-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/hobo-1-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “HOBO” at the top in the cover's exact lettering, smaller; under it the line “Brawl through the city as the filthiest fighter alive.” in italic serif; three small framed screenshots of the game (beat 'em up), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Full original game”, “Gross-out special moves”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/hobo-1-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “HOBO” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “22”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 23 · HOBO 2 PRISON BRAWL  (`hobo-2`)
Attach: `public/hobo-2-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/hobo-2-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “HOBO 2 PRISON BRAWL” at the top in the cover's exact lettering, smaller; under it the line “Locked up. Fighting out.” in italic serif; three small framed screenshots of the game (beat 'em up), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Full original game”, “Gross-out special moves”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/hobo-2-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “HOBO 2 PRISON BRAWL” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “23”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 24 · HOBO 3 WANTED  (`hobo-3`)
Attach: `public/hobo-3-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/hobo-3-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “HOBO 3 WANTED” at the top in the cover's exact lettering, smaller; under it the line “The whole city wants him gone.” in italic serif; three small framed screenshots of the game (beat 'em up), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Full original game”, “Gross-out special moves”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/hobo-3-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “HOBO 3 WANTED” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “24”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 25 · HOBO 4 TOTAL WAR  (`hobo-4`)
Attach: `public/hobo-4-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/hobo-4-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “HOBO 4 TOTAL WAR” at the top in the cover's exact lettering, smaller; under it the line “Hobo takes on the army.” in italic serif; three small framed screenshots of the game (beat 'em up), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Full original game”, “Gross-out special moves”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/hobo-4-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “HOBO 4 TOTAL WAR” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “25”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 26 · HOBO 5 SPACE BRAWLS  (`hobo-5`)
Attach: `public/hobo-5-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/hobo-5-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “HOBO 5 SPACE BRAWLS” at the top in the cover's exact lettering, smaller; under it the line “Abducted, and furious about it.” in italic serif; three small framed screenshots of the game (beat 'em up), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Full original game”, “Gross-out special moves”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/hobo-5-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “HOBO 5 SPACE BRAWLS” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “26”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 27 · HOBO 6 HELL  (`hobo-6`)
Attach: `public/hobo-6-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/hobo-6-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “HOBO 6 HELL” at the top in the cover's exact lettering, smaller; under it the line “Fighting through the underworld.” in italic serif; three small framed screenshots of the game (beat 'em up), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Full original game”, “Gross-out special moves”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/hobo-6-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “HOBO 6 HELL” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “27”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.

---

### 28 · HOBO 7 HEAVEN  (`hobo-7`)
Attach: `public/hobo-7-cover-box-art.png` (+ `public/kart-cover-box-art.png` as the house-style reference)

**Back** → `public/box-art/hobo-7-back.png` (1024×1536)
> Following the style guide, create the BACK PANEL of the big box whose front cover is attached, as a flat, straight-on flatbed scan of the printed cardboard, filling the 1024×1536 canvas edge to edge. Same cream paper frame as the front: top band “A&D ARCADE” with diamond ornaments, bottom band “THE A&D COLLECTION”. Inside the frame, a classic 1996 big-box back layout on the cover's palette: the title “HOBO 7 HEAVEN” at the top in the cover's exact lettering, smaller; under it the line “The final brawl at the pearly gates.” in italic serif; three small framed screenshots of the game (beat 'em up), painted in the same illustration style as the cover, each with a thin cream border and a tiny caption; a short paragraph of blurb; three bullet points with small diamond bullets reading “Full original game”, “Gross-out special moves”, “Full-screen player”; a small boxed “SYSTEM REQUIREMENTS” panel in mono type reading “Windows 95/98 · Pentium 166 MHz · 16 MB RAM · Any modern browser”; at the bottom a white barcode label, a small square badge reading “1 PLAYER” and the line “PC / BROWSER EDITION”. Scanner-flat lighting, faint halftone, soft wear on the corners. No perspective, no mockup, no real logos or rating marks.

**Spine** → `public/box-art/hobo-7-spine.png` (1024×1536)
> Following the style guide, create the SPINE (the narrow side panel) of the big box whose front cover is attached, as a flat flatbed scan. Canvas 1024×1536 portrait: the spine occupies ONLY a centred vertical strip 330 pixels wide running the full height; everything to the left and right of the strip is flat pure black #000000. Inside the strip, top to bottom: the cream paper frame continues as a thin border; a small cream block with “A&D” in italic dark serif; the cover's background illustration wrapping around the corner; the title “HOBO 7 HEAVEN” running vertically (reading top to bottom) in the cover's exact chunky lettering with its outline and shadow; and at the bottom a small cream box with the number “28”. Scanner-flat lighting, rubbed edges, faint halftone. No perspective, no mockup, nothing outside the strip.
