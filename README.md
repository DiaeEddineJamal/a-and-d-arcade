# Lmongolyan Arcade

The standalone Next.js portal for the Lmongolyan game collection. It links to
Pong, Kart, Puck and Chefs, and launches Cuphead and 20 Minutes Till Dawn browser ports.

## Browser ports

Cover or Play link → `/play/cuphead` or `/play/20-minutes-till-dawn` → Play Now → game frame.
The player fills the page and has Full Screen, Reload and a return to the shelf.
No game files download while browsing the shelf. The launch screen states the approximate first download:
Cuphead 2.1 GB, 20 Minutes Till Dawn 48 MB. Keyboard/mouse and desktop recommended;
responsive player layout does not imply mobile gameplay support.

The small HTML launch wrappers are vendored in `public/ports/`. Existing compiled game assets
are loaded from jsDelivr, pinned to these upstream revisions:

| Game | Wrapper source | Asset revision |
| --- | --- | --- |
| Cuphead | [web-ports/cuphead](https://github.com/web-ports/cuphead/blob/08a62227c742d74092f739b168ee4be1993f8ba5/index.html) | `c9ff1b6b16f9d402b78a42fc2200e1c076c0ab6e` |
| 20 Minutes Till Dawn | [web-ports/20-minutes](https://github.com/web-ports/20-minutes/blob/e82366ecffd3ed46f804da050d02a44422986204/index.html) | `e82366ecffd3ed46f804da050d02a44422986204` |

SolveCalc's catalogue and launch API were inspected as the reference, but its worker URLs returned
403 on direct access. These wrappers come from the port repositories, without a dependency on
SolveCalc's API or ads. Changes to the wrappers: pinned asset source, responsive canvas,
HTTP-error reporting, retry guidance and optional browser caching that tolerates unavailable storage
and quota errors. Both port repositories have no declared license; publisher authorization has
not been verified. Game credits remain Studio MDHR and flanne. This work does not deploy the ports.

Add future browser titles to `src/app/ported-games.ts` with a local wrapper path and cover.
The dynamic player route only accepts registered game IDs; it does not take an arbitrary URL.
Run `npm run check:ports`, `npm run lint` and `npm run build` after changes.

### Download to this device

Ports whose files the portal can fetch (not the ones embedded from another site) have a
"Download to this device" button. `src/app/offline.ts` downloads every file listed in
`src/app/offline-files.json` into browser storage on disk, resuming where it stopped, and
`public/sw.js` serves those files before the network, so the game plays without internet.
After changing a port's source revision run `node tools/offline-manifests.mjs` to regenerate the list.

Local verification (2026-10-06): portal lint, TypeScript, production build and loader checks passed.
20 Minutes Till Dawn reached its title menu, character/weapon selection and an active survival
session; Full Screen, Escape and Reload were exercised. Cuphead downloaded and reached Unity
startup after reducing duplicate chunk allocations, but full gameplay remains unverified.
The original loader crashed its browser tab. Cuphead is labelled experimental in the launcher.
No physical-device or production deployment verification was performed.

## Generated covers

Generated using the built-in imagegen tool and saved as `public/cuphead-cover-box-art.png`
and `public/20-minutes-cover-box-art.png`. Existing covers are preserved.

Cuphead prompt:
> Create a portrait 2:3 game cover illustration for Cuphead for an arcade game-box website. Cuphead and Mugman, the recognizable cheerful cup-headed cartoon heroes with red and blue shorts and striped straws, running and firing finger guns through a hand-painted 1930s cartoon carnival landscape with a looming mischievous devil silhouette. Rich cream paper, orange, muted teal, red and black ink; rubber hose animation illustration, authentic watercolor background, energetic clean premium collectible cover composition. Artwork only, no title, no text, no logo, no border, no actual box mockup. Keep heroes and main action in upper two-thirds, lower fifth darker quieter background for website title overlay.

20 Minutes Till Dawn prompt:
> Create a portrait 2:3 game cover illustration for 20 Minutes Till Dawn for an arcade game-box website. Dark eldritch survival shooter scene, a pale young anime-styled gothic heroine with flowing dark hair, black cloak and a shotgun firing bright turquoise bullets into a swarm of sinister Lovecraftian shadow monsters with red eyes in a moonlit forest. Crisp beautifully controlled pixel-art aesthetic, limited charcoal, ivory, muted cyan and crimson palette, dramatic luminous rim light and bullet trails. Premium collectible cover composition with clear readable silhouette. Artwork only, no title, no text, no logo, no border, no actual box mockup. Main action upper two-thirds; bottom fifth quieter dark forest for title overlay.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3010](http://localhost:3010) with your browser.

Copy `.env.example` to `.env.local` when the games run at different URLs.

## Environment

- `NEXT_PUBLIC_PONG_URL` — Mangolian Pong URL; defaults to `http://localhost:3001`.
- `NEXT_PUBLIC_RACING_URL` — Lmongolyan Kart URL; defaults to `http://localhost:5178`.
