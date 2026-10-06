import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { portedGames } from "./ported-games";

/** Uses the generated PNG cover once it is in /public, else the stand-in SVG. */
const coverArt = (base: string) => existsSync(join(process.cwd(), "public", `${base}.png`)) ? `/${base}.png` : `/${base}.svg`;

export type Game = {
  id: string;
  number: string;
  name: [string, string];
  genre: string;
  tagline: string;
  description: string;
  href: string;
  cta: string;
  tone: "teal" | "orange";
  cover: string;
  focus: string;
  players: string;
  specs: { label: string; value: string }[];
  features: string[];
  source?: string;
  notice?: string;
  /** Optional real box photography; the 3D viewer generates these faces from the cover otherwise. */
  back?: string;
  spine?: string;
  /** Up to four photos of the physical box, shown as thumbnails under the synopsis. */
  photos?: string[];
};

const art = (path: string) => existsSync(join(process.cwd(), "public", path)) ? `/${path}` : undefined;
/** Photos A finds inside each unlocked drive: public/devices/<id>/*.jpg|png|webp */
export const devicePhotos: Record<string, string[]> = Object.fromEntries(["archive", "cdrom", "floppy"].map(id => {
  const folder = join(process.cwd(), "public", "devices", id);
  return [id, existsSync(folder) ? readdirSync(folder).filter(file => /\.(jpe?g|png|webp)$/i.test(file)).sort().map(file => `/devices/${id}/${file}`) : []];
}));
/** Image wallpapers dropped into public/wallpapers replace the flat colours. */
export const wallpaperArt: Record<string, string> = Object.fromEntries(["arcade", "paper", "midnight"].flatMap(id => { const url = art(`wallpapers/${id}.png`); return url ? [[id, url]] : []; }));

const shelf: Game[] = [
  {
    id: "pong",
    number: "01",
    name: ["A&D", "PONG"],
    genre: "Versus paddle duel",
    tagline: "Thunder serves under a travelling storm.",
    description:
      "Classic two-paddle tennis with a twist: every twelve seconds a Film Frenzy gust bends the ball’s path. Share a keyboard or send your partner a four-letter code.",
    href: process.env.NEXT_PUBLIC_PONG_URL ?? "http://localhost:3001",
    cta: "PLAY PONG",
    tone: "teal",
    cover: "/pong-cover-box-art.png",
    focus: "34% 60%",
    players: "1–2",
    specs: [
      { label: "Players", value: "1 vs CPU, or 2 same screen / online" },
      { label: "Match", value: "First to 11" },
      { label: "Controls", value: "W/S · ↑/↓ · drag on touch" },
      { label: "Session", value: "5 to 10 minutes" },
    ],
    features: ["CPU with three levels", "Private four-letter rooms", "Film Frenzy wind storms"],
  },
  {
    id: "kart",
    number: "02",
    name: ["A&D", "KART"],
    genre: "Party kart racer",
    tagline: "Dust clouds, sharp corners, one more lap.",
    description:
      "The full-throttle original. Pick a racer, learn the technical circuits, grab items and drift for boost, then open a room where up to eight friends race the same lap.",
    href: process.env.NEXT_PUBLIC_RACING_URL ?? "http://localhost:5178",
    cta: "START RACE",
    tone: "orange",
    cover: "/kart-cover-box-art.png",
    focus: "66% 50%",
    players: "1–8",
    specs: [
      { label: "Players", value: "Up to 8 online" },
      { label: "Race", value: "3 laps, multiple circuits" },
      { label: "Controls", value: "Keyboard · gamepad · touch" },
      { label: "Session", value: "3 to 5 minutes a race" },
    ],
    features: ["Room codes for friends", "Items and drift boosts", "Leaderboards per track"],
  },
  {
    id: "puck",
    number: "03",
    name: ["A&D", "PUCK"],
    genre: "Air hockey duel",
    tagline: "One puck, two mallets, no mercy at the crease.",
    description:
      "A cushion of air, a puck that never slows down enough, and a centre line neither of you may cross. Take on the CPU at three levels, share one screen, or send a room code.",
    href: process.env.NEXT_PUBLIC_PUCK_URL ?? "http://localhost:3002",
    cta: "FACE OFF",
    tone: "teal",
    cover: coverArt("puck-cover-box-art"),
    focus: "30% 50%",
    players: "1–2",
    specs: [
      { label: "Players", value: "1 vs CPU, or 2 same screen / online" },
      { label: "Match", value: "First to 7" },
      { label: "Controls", value: "Mouse · finger · WASD / arrows" },
      { label: "Session", value: "3 to 6 minutes" },
    ],
    features: ["CPU with three levels", "Hits resolved on your side", "Plays on phones"],
  },
  {
    id: "chefs",
    number: "04",
    name: ["A&D", "CHEFS"],
    genre: "Co-op cooking rush",
    tagline: "Two chefs, one kitchen, orders stacking up.",
    description:
      "Chop tomatoes and lettuce, keep the patties off the flames, plate it up and push it through the pass before the ticket runs out. Cook with your partner or with a CPU chef who plans its own jobs.",
    href: process.env.NEXT_PUBLIC_CHEFS_URL ?? "http://localhost:3003",
    cta: "START SHIFT",
    tone: "orange",
    cover: coverArt("chefs-cover-box-art"),
    focus: "55% 50%",
    players: "1–2",
    specs: [
      { label: "Players", value: "Co-op: with a CPU chef, or 2 same screen / online" },
      { label: "Shift", value: "3 minutes, up to 3 stars" },
      { label: "Controls", value: "WASD / arrows · grab · chop" },
      { label: "Pace", value: "Easy, Normal or Hard kitchen" },
    ],
    features: ["Four recipes", "A CPU chef that helps", "Shared online kitchen"],
  },
  ...portedGames,
];

export const games: Game[] = shelf.map(game => ({
  ...game,
  back: art(`box-art/${game.id}-back.png`),
  spine: art(`box-art/${game.id}-spine.png`),
  photos: [1, 2, 3, 4].flatMap(n => art(`box-art/${game.id}-photo-${n}.png`) ?? []),
}));
