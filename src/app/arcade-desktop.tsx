"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  AppWindow, ArrowLeft, ArrowRight, ArrowUp, BookOpen, CassetteTape, ChefHat, CircleDot, Columns2, Disc3, Download, FileText, Flag, Folder, Gamepad2, HardDrive,
  House, ImageIcon, ImagePlus, Info, Laptop, ListPlus, Menu, Music, MousePointerClick, Power, Radio, RotateCcw, Save, Search, Settings, Share2, Smartphone, Terminal,
  Trash2, User, Volume2, X, type LucideIcon,
} from "lucide-react";
import type { Game } from "./catalog";
import { canDownload, checkDownload, downloadsVersion, getDownload, megabytes, removeDownload, subscribe, totalBytes } from "./offline";
import BootScreen from "./boot-screen";
import BoxViewer from "./box-viewer";
import CrtOverlay from "./crt-overlay";
import DeviceLock from "./device-lock";
import MusicPlayer, { trackName, type PlayRequest, type Track } from "./music-player";
import TapeDeck from "./tape-deck";
import HomeGrid, { type HomeApp } from "./home-grid";
import { listTapes, removeTape, saveCopy, subscribeTapes, type Tape } from "./tapes";
import { devices, type Device } from "./devices";
import { gameSupport } from "./game-support.mjs";
import { thumb } from "./thumbs";

const screens = ["/", "/collection", "/files", "/about", "/terminal", "/settings"];
const dock = [
  { href: "/files", icon: Folder, label: "Files" },
  { href: "/about", icon: User, label: "About" },
  { href: "/collection", icon: BookOpen, label: "Collection" },
  { href: "/terminal", icon: Terminal, label: "Terminal" },
  { href: "/settings", icon: Settings, label: "Settings" },
];
const gameIcons: Record<string, LucideIcon> = { pong: Columns2, kart: Flag, puck: CircleDot, chefs: ChefHat };
const wallpapers = [{ id: "arcade", label: "A&D" }, { id: "paper", label: "Paper" }, { id: "blue", label: "BIOS" }, { id: "midnight", label: "Midnight" }, { id: "teal", label: "1996" }];
type WallFit = "fill" | "fit" | "center" | "tile";
const fits: Record<WallFit, React.CSSProperties> = { fill: { backgroundSize: "cover" }, fit: { backgroundSize: "contain" }, center: { backgroundSize: "auto" }, tile: { backgroundSize: "auto", backgroundRepeat: "repeat", backgroundPosition: "0 0" } };
const walls: Record<string, string> = { custom: "#1a1a1a", arcade: "#1a1a1a", teal: "#008080", paper: "#ddd9c8", blue: "#0000a8", midnight: "#141414" };
type Sound = { boot: boolean; click: boolean; hum: boolean };
type Line = { text: ReactNode; tone?: string };

const title = (game: Game) => game.name.join(" ").trim();
const modified = (game: Game) => {
  const n = Number(game.number);
  const date = new Date(1996 + (n % 4), (n * 5) % 12, (n * 7) % 27 + 1, (n * 3) % 12 + 8, (n * 13) % 60);
  return `${date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}  ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
};

function CloseButton({ label = "Close window" }: { label?: string }) {
  return <Link href="/" className="win-btn win-close" aria-label={label}><X /></Link>;
}

export default function ArcadeDesktop({ games, wallpaperArt, devicePhotos, deviceTracks, children }: { games: Game[]; wallpaperArt: Record<string, string>; devicePhotos: Record<string, string[]>; deviceTracks: Record<string, string[]>; children: ReactNode }) {
  // locked drives in Files: A answers their questions to open them; the unlock is remembered on her browser
  const [drive, setDrive] = useState<Device | null>(null);
  const [locking, setLocking] = useState<Device | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [note, setNote] = useState<Device | null>(null);
  // the Tape Deck player floats above every window, so a song keeps playing while she browses; the playlist is remembered
  const [player, setPlayer] = useState<PlayRequest | null>(null);
  const [playlist, setPlaylistState] = useState<string[]>([]);
  const [tapes, setTapes] = useState<{ tape: Tape; src: string }[]>([]);
  const [deck, setDeck] = useState(false);
  const [flash, setFlash] = useState("");
  const [welcomed, setWelcomed] = useState(true);
  const deviceIcons = { drive: HardDrive, disc: Disc3, floppy: Save };
  const openDevice = (device: Device) => { setNote(null); if (unlocked.includes(device.id)) setDrive(device); else setLocking(device); };
  const unlock = (device: Device) => {
    const next = [...new Set([...unlocked, device.id])];
    setUnlocked(next); setLocking(null); setDrive(device);
    try { localStorage.setItem("ad-unlocked", JSON.stringify(next)); } catch {}
  };
  const browse = (filter: string) => { setCategory(filter); setDrive(null); setNote(null); };
  // songs recorded on this PC: one object URL per tape for as long as it exists, so a playing song never reloads
  useEffect(() => {
    const urls = new Map<string, string>();
    const load = () => void listTapes().then(list => {
      for (const [id, url] of urls) if (!list.some(tape => tape.id === id)) { URL.revokeObjectURL(url); urls.delete(id); }
      setTapes(list.map(tape => { if (!urls.has(tape.id)) urls.set(tape.id, URL.createObjectURL(tape.blob)); return { tape, src: urls.get(tape.id)! }; }));
    });
    load();
    const off = subscribeTapes(load);
    return () => { off(); urls.forEach(url => URL.revokeObjectURL(url)); };
  }, []);
  // every song she can reach: the unlocked drives, plus the tapes, which live on the CD-ROM
  const library = useMemo<Track[]>(() => [
    ...devices.filter(device => unlocked.includes(device.id)).flatMap(device => (deviceTracks[device.id] ?? []).map(src => ({ key: src, src, ...trackName(src), from: device.label }))),
    ...(unlocked.includes("cdrom") ? tapes.map(({ tape, src }) => ({ key: `tape:${tape.id}`, src, title: tape.title, artist: tape.artist, from: "Tape Deck" })) : []),
  ], [unlocked, deviceTracks, tapes]);
  const setPlaylist = (keys: string[]) => { setPlaylistState(keys); try { localStorage.setItem("ad-playlist", JSON.stringify(keys)); } catch {} };
  const say = (text: string) => { setFlash(text); setTimeout(() => setFlash(value => value === text ? "" : value), 1800); };
  const playTrack = (key: string) => {
    if (!playlist.includes(key)) setPlaylist([...playlist, key]);
    setPlayer(value => ({ key, n: (value?.n ?? 0) + 1, play: true }));
  };
  const queueTrack = (key: string, name: string) => {
    if (!playlist.includes(key)) setPlaylist([...playlist, key]);
    setPlayer(value => value ?? { key, n: 1, play: false });
    say(`Added “${name}” to the playlist`);
  };
  const openMusic = () => setPlayer(value => value ?? { key: null, n: 0, play: false });
  // the A&D picture wallpaper only shows up once its image is in public/wallpapers
  // her own picture as wallpaper: kept in this browser, placed the way she picks in Settings
  const [customWall, setCustomWall] = useState<string | null>(null);
  const [wallFit, setWallFit] = useState<WallFit>("fill");
  const artOf = (id: string) => id === "custom" ? customWall : wallpaperArt[id];
  const choices = [...wallpapers.filter(item => item.id !== "arcade" || wallpaperArt.arcade), ...(customWall ? [{ id: "custom", label: "Yours" }] : [])];
  const [photo, setPhoto] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [booting, setBooting] = useState(true);
  // offline: which games are on this PC, whether we are online, and the browser's "install app" prompt
  const [online, setOnline] = useState(true);
  const [install, setInstall] = useState<(Event & { prompt: () => Promise<unknown> }) | null>(null);
  const [installed, setInstalled] = useState(false);
  const [startup, setStartup] = useState(true);
  const [storage, setStorage] = useState<{ used: number; free: number; persisted: boolean } | null>(null);
  const [persistAsked, setPersistAsked] = useState(false);
  const downloads = useSyncExternalStore(subscribe, downloadsVersion, () => 0);
  useEffect(() => {
    games.forEach(game => void checkDownload(game.id));
    const network = () => setOnline(navigator.onLine);
    const offer = (event: Event) => { event.preventDefault(); setInstall(event as Event & { prompt: () => Promise<unknown> }); };
    const standalone = () => setInstalled(matchMedia("(display-mode: standalone)").matches);
    const justInstalled = () => { setInstalled(true); setInstall(null); };
    network(); standalone();
    // the CRT power-on plays once per visit; later pages in the same visit open straight onto a warm screen
    try { sessionStorage.setItem("ad-warm", "1"); } catch {}
    addEventListener("online", network); addEventListener("offline", network); addEventListener("beforeinstallprompt", offer); addEventListener("appinstalled", justInstalled);
    return () => { removeEventListener("online", network); removeEventListener("offline", network); removeEventListener("beforeinstallprompt", offer); removeEventListener("appinstalled", justInstalled); };
  }, [games]);
  const [bootRun, setBootRun] = useState(0);
  const [mobile, setMobile] = useState<boolean | null>(null);
  const [powered, setPowered] = useState<"on" | "shutting" | "off">("on");
  const [menu, setMenu] = useState(false);
  const [intro, setIntro] = useState(false);
  const [wallpaper, setWallpaper] = useState("teal");
  const [crt, setCrt] = useState(true);
  const [sound, setSound] = useState<Sound>({ boot: true, click: true, hum: false });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [detail, setDetail] = useState<Game | null>(null);
  const [shared, setShared] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);
  const [now, setNow] = useState<Date | null>(null);
  const [command, setCommand] = useState("");
  const [caret, setCaret] = useState(0);
  const [termLines, setTermLines] = useState<Line[][]>([[{ text: "A&D Arcade OS [Version 1.0]" }, { text: <>Welcome, player. Type <b className="t-cyan">help</b> to get started.</> }]]);
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const logIndex = useRef(-1);
  const terminalInput = useRef<HTMLInputElement>(null);
  const terminalEnd = useRef<HTMLDivElement>(null);
  const audio = useRef<AudioContext | null>(null);
  const hum = useRef<{ stop: () => void } | null>(null);
  const [columns, setColumns] = useState(7);
  const shelfGrid = useCallback((grid: HTMLDivElement | null) => {
    if (!grid) return;
    const observer = new ResizeObserver(() => setColumns(getComputedStyle(grid).gridTemplateColumns.split(" ").length || 1));
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  // ---------- sound: tiny synthesized clicks, a POST beep and an optional mains hum
  const context = () => { try { audio.current ??= new AudioContext(); void audio.current.resume(); return audio.current; } catch { return null; } };
  const click = () => {
    const ctx = sound.click && context();
    if (!ctx) return;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * .025, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6);
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    filter.type = "highpass"; filter.frequency.value = 1800; gain.gain.value = .22;
    source.buffer = buffer; source.connect(filter).connect(gain).connect(ctx.destination); source.start();
  };
  const beep = useCallback(() => {
    const ctx = sound.boot && context();
    if (!ctx) return;
    const oscillator = ctx.createOscillator(), gain = ctx.createGain();
    oscillator.type = "square"; oscillator.frequency.value = 1000;
    gain.gain.setValueAtTime(.035, ctx.currentTime); gain.gain.setValueAtTime(0, ctx.currentTime + .14);
    oscillator.connect(gain).connect(ctx.destination); oscillator.start(); oscillator.stop(ctx.currentTime + .15);
  }, [sound.boot]);
  useEffect(() => {
    if (!sound.hum || booting) return;
    const start = () => {
      const ctx = context();
      if (!ctx || hum.current) return;
      const gain = ctx.createGain(); gain.gain.value = .012;
      const mains = ctx.createOscillator(); mains.frequency.value = 50; mains.connect(gain);
      const whine = ctx.createOscillator(); whine.frequency.value = 15734; const whineGain = ctx.createGain(); whineGain.gain.value = .08; whine.connect(whineGain).connect(gain);
      gain.connect(ctx.destination); mains.start(); whine.start();
      hum.current = { stop: () => { mains.stop(); whine.stop(); gain.disconnect(); } };
    };
    start();
    addEventListener("pointerdown", start, { once: true });
    return () => { removeEventListener("pointerdown", start); hum.current?.stop(); hum.current = null; };
  }, [sound.hum, booting]);

  useEffect(() => {
    if (!booting) document.documentElement.dataset.crt = mobile ? "handheld-home" : "desktop";
    // the colour under the screen edge, which the CRT shader paints itself (see crt-overlay)
    document.documentElement.dataset.wall = booting ? (mobile ? "#93a87f" : "#050505") : mobile && wallpaper === "teal" ? "#0e4c49" : walls[wallpaper];
    // a picture wallpaper: paint the rim with the average colour of the picture's own border, or the edge looks torn
    // (a picture that does not fill the screen leaves the plain colour at the rim)
    const art = wallpaper !== "custom" || wallFit === "fill" ? artOf(wallpaper) : null;
    if (booting || !art) return;
    let live = true;
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement("canvas"), g = canvas.getContext("2d", { willReadFrequently: true });
      if (!live || !g) return;
      canvas.width = canvas.height = 32;
      g.drawImage(image, 0, 0, 32, 32);
      const px = g.getImageData(0, 0, 32, 32).data, sum = [0, 0, 0];
      let n = 0;
      for (let i = 0; i < 32 * 32; i++) {
        const x = i % 32, y = (i / 32) | 0;
        if (x > 1 && x < 30 && y > 1 && y < 30) continue;
        sum[0] += px[i * 4]; sum[1] += px[i * 4 + 1]; sum[2] += px[i * 4 + 2]; n++;
      }
      document.documentElement.dataset.wall = "#" + sum.map(value => Math.round(value / n).toString(16).padStart(2, "0")).join("");
    };
    image.src = art;
    return () => { live = false; };
  }, [booting, mobile, wallpaper, wallpaperArt, customWall, wallFit]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- preferences, device class, clock, deep links
  useEffect(() => {
    const query = matchMedia("(max-width: 700px), (max-height: 500px) and (pointer: coarse)");
    // the whole desktop scales with the monitor, like the reference's resolution-based UI unit
    const update = () => {
      setMobile(query.matches);
      const zoom = query.matches ? 1 : Math.max(.9, Math.min(1.8, innerHeight / 860, innerWidth / 1100));
      document.documentElement.style.setProperty("--z", zoom.toFixed(3));
    };
    addEventListener("resize", update);
    const timer = setTimeout(() => {
      // phones show the terminal boot to new players only; everyone after that gets the quick handheld splash
      try {
        setWelcomed(!!localStorage.getItem("ad-welcomed"));
        const list = JSON.parse(localStorage.getItem("ad-playlist") || "[]");
        if (Array.isArray(list)) setPlaylistState(list.filter(item => typeof item === "string"));
      } catch {}
      update();
      try {
        const saved = JSON.parse(localStorage.getItem("ad-preferences") || "{}");
        const id = ({ cream: "paper", night: "midnight" } as Record<string, string>)[saved.wallpaper] ?? saved.wallpaper;
        const mine = localStorage.getItem("ad-wallpaper-custom");
        if (mine) setCustomWall(mine);
        if (["fill", "fit", "center", "tile"].includes(saved.wallFit)) setWallFit(saved.wallFit);
        if (wallpapers.some(item => item.id === id) || (id === "custom" && mine)) setWallpaper(id);
        if (typeof saved.crt === "boolean") setCrt(saved.crt);
        if (saved.sound && typeof saved.sound === "object") setSound(value => ({ ...value, ...saved.sound }));
        if (saved.startup === false) setStartup(false);
        // like the reference, only the front door boots; links straight to a window or game open directly
        const opened = JSON.parse(localStorage.getItem("ad-unlocked") || "[]");
        if (Array.isArray(opened)) setUnlocked(opened.filter(id => devices.some(device => device.id === id)));
        if (saved.startup === false || sessionStorage.getItem("ad-booted") || location.pathname !== "/" || location.search.includes("game=")) setBooting(false);
      } catch {}
      const id = new URLSearchParams(location.search).get("game");
      const game = games.find(game => game.id === id);
      if (game) setDetail(game);
      setNow(new Date());
      // offline: keep every desktop screen and the scripts already loaded (before the worker took over) in the shell cache
      navigator.serviceWorker?.register("/sw.js").then(() => caches.open("shell")).then(cache => cache.addAll([...new Set([location.pathname, "/", "/collection", "/files", "/about", "/terminal", "/settings"]),
        // every shelf cover at its shelf size (static WebP, ~3 MB in all), so the collection looks right offline
        ...games.map(game => thumb(game.cover, 384)),
        ...performance.getEntriesByType("resource").map(entry => entry.name).filter(name => name.startsWith(`${location.origin}/_next/static/`))])).catch(() => {});
    }, 0);
    query.addEventListener("change", update);
    const tick = setInterval(() => setNow(new Date()), 10_000);
    return () => { clearTimeout(timer); clearInterval(tick); query.removeEventListener("change", update); removeEventListener("resize", update); };
  }, [games]);

  // Settings shows how much disk the downloads take and whether the browser promised to keep them
  const readStorage = useCallback(() => {
    void Promise.all([navigator.storage?.estimate?.(), navigator.storage?.persisted?.()])
      .then(([estimate, persisted]) => setStorage({ used: estimate?.usage ?? 0, free: Math.max(0, (estimate?.quota ?? 0) - (estimate?.usage ?? 0)), persisted: !!persisted }))
      .catch(() => {});
  }, []);
  useEffect(() => { if (pathname === "/settings") readStorage(); }, [pathname, downloads, readStorage]);

  function preference(next: { wallpaper?: string; wallFit?: WallFit; crt?: boolean; startup?: boolean; sound?: Partial<Sound> }) {
    const value = { wallpaper, wallFit, crt, startup, ...next, sound: { ...sound, ...next.sound } };
    setWallpaper(value.wallpaper); setWallFit(value.wallFit); setCrt(value.crt); setStartup(value.startup); setSound(value.sound);
    try { localStorage.setItem("ad-preferences", JSON.stringify(value)); } catch {}
  }
  // shrunk to at most 2560px and saved as a JPEG, so it fits the browser's storage and loads fast
  async function ownWallpaper(file: File | undefined) {
    if (!file) return;
    try {
      const bitmap = await createImageBitmap(file), scale = Math.min(1, 2560 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL("image/jpeg", .85);
      localStorage.setItem("ad-wallpaper-custom", url);
      setCustomWall(url); preference({ wallpaper: "custom" });
    } catch { alert("That picture could not be used as a wallpaper. Try another one (JPEG or PNG)."); }
  }
  function dropWallpaper() {
    try { localStorage.removeItem("ad-wallpaper-custom"); } catch {}
    setCustomWall(null);
    if (wallpaper === "custom") preference({ wallpaper: "teal" });
  }
  const finishBoot = useCallback(() => { setBooting(false); try { sessionStorage.setItem("ad-booted", "1"); localStorage.setItem("ad-welcomed", "1"); } catch {} }, []);
  const setupBoot = useCallback(() => { finishBoot(); router.push("/settings"); }, [finishBoot, router]);
  const reboot = () => { delete document.documentElement.dataset.warm; setMenu(false); setPowered("on"); setBooting(true); setBootRun(value => value + 1); };
  const shutdown = () => { setMenu(false); setPowered("shutting"); setTimeout(() => setPowered("off"), 1300); };

  function openDetail(game: Game | null) {
    setDetail(game); setShared(false);
    const url = new URL(location.href);
    if (game) url.searchParams.set("game", game.id); else url.searchParams.delete("game");
    window.history.replaceState(window.history.state, "", url);
  }
  async function share(game: Game) {
    const url = `${location.origin}/collection?game=${game.id}`;
    try {
      if (navigator.share && mobile) await navigator.share({ title: title(game), url });
      else { await navigator.clipboard.writeText(url); setShared(true); setTimeout(() => setShared(false), 1800); }
    } catch {}
  }
  function launch(game: Game) {
    if (game.href.startsWith("/")) router.push(game.href); else location.assign(game.href);
  }

  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (powered === "off") { reboot(); return; }
      // games use Escape themselves (pause menus, leaving full screen), so leave it alone there
      if (booting || event.key !== "Escape" || pathname.startsWith("/play/")) return;
      if (photo) setPhoto(null);
      else if (deck) setDeck(false);
      else if (note) setNote(null);
      else if (drive) setDrive(null);
      else if (detail) openDetail(null);
      else if (menu) setMenu(false);
      else if (intro) setIntro(false);
      else if (pathname !== "/") router.push("/");
    };
    addEventListener("keydown", keyboard);
    return () => removeEventListener("keydown", keyboard);
  });
  useEffect(() => { terminalEnd.current?.scrollIntoView({ block: "end" }); }, [termLines]);
  // on phones the places are one swipeable row: keep the open one in view
  useEffect(() => { document.querySelector(".files-sidebar [aria-pressed=\"true\"]")?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); }, [drive, category, pathname]);
  useEffect(() => { if (pathname === "/terminal" && !mobile) terminalInput.current?.focus({ preventScroll: true }); }, [pathname, mobile, booting]);

  const visibleGames = games.filter(game => (category === "all" || (category === "originals" ? !game.source : !!game.source)) && `${title(game)} ${game.genre}`.toLowerCase().includes(query.toLowerCase()));

  // ---------- terminal
  const commands = ["help", "ls", "open", "play", "info", "whoami", "neofetch", "date", "echo", "history", "clear", "reboot", "shutdown", "exit", "sudo"];
  function print(lines: Line[]) { setTermLines(value => [...value, lines]); }
  function runCommand(event: FormEvent) {
    event.preventDefault();
    const input = command.trim();
    setCommand(""); setCaret(0); logIndex.current = -1;
    const prompt: Line = { text: <><span className="t-cyan">/home/a&amp;d-arcade</span><span className="t-yellow">(main)</span> <span className="t-magenta">»</span> {input}</> };
    if (!input) return print([prompt]);
    setCommandLog(value => [...value, input]);
    const [action, ...args] = input.split(/\s+/);
    const argument = args.join(" ").toLowerCase();
    const find = () => games.find(game => game.id === argument.replace(/\s+/g, "-") || title(game).toLowerCase() === argument);
    let out: Line[] = [];
    switch (action.toLowerCase()) {
      case "help": out = [["help", "this list"], ["ls", "every game on the shelf"], ["open <app>", "files · collection · about · settings"], ["play <game>", "launch a game, e.g. play pong"], ["info <game>", "open the box and read the back"], ["whoami", "who runs this place"], ["neofetch", "system information"], ["history", "commands you typed"], ["clear", "clear the screen"], ["reboot · shutdown", "power options"]].map(([name, about]) => ({ text: <><b className="t-cyan">{name.padEnd(20)}</b>{about}</> })); break;
      case "ls": out = [{ text: <>total {games.length}</> }, ...games.map(game => ({ text: <><span className="t-dim">{game.source ? "-r-xr-xr-x  web " : "-rwxr-xr-x  a&d "}</span><span className={game.source ? "t-blue" : "t-green"}>{game.id}</span><span className="t-dim">  {game.genre.toLowerCase()}</span></> }))]; break;
      case "whoami": out = [{ text: "a&d — A is for her, D is for me." }, { text: "An arcade I built for the games we love, solo or together. Opening About..." }]; setTimeout(() => router.push("/about"), 700); break;
      case "open": {
        const target = { files: "/files", collection: "/collection", about: "/about", settings: "/settings", terminal: "/terminal" }[argument];
        out = target ? [{ text: `Opening ${argument}...` }] : [{ text: "open: try files, collection, about or settings", tone: "t-red" }];
        if (target) setTimeout(() => router.push(target), 350);
        break;
      }
      case "play": case "run": { const game = find(); out = game ? [{ text: <>Loading <b className="t-yellow">{title(game)}</b> ...</> }] : [{ text: `play: ${argument || "?"}: no such game. Type ls.`, tone: "t-red" }]; if (game) setTimeout(() => launch(game), 600); break; }
      case "info": case "cat": { const game = find(); out = game ? [{ text: game.tagline }] : [{ text: `info: ${argument || "?"}: no such game. Type ls.`, tone: "t-red" }]; if (game) { router.push("/collection"); setTimeout(() => openDetail(game), 300); } break; }
      case "neofetch": out = [
        ["    _    ___    ", "", "player@a&d-arcade"], ["   /_\  |   \   ", "", "-----------------"], ["  / _ \ | |) |  ", "OS", "A&D OS 1.0 (Arcade Station)"],
        [" /_/ \_\|___/   ", "Kernel", "2.2.14 on an i586"], ["  two players   ", "Shell", "arcade-sh 0.9"], ["                 ", "Games", `${games.length} boxes on the shelf`],
        ["                 ", "CPU", "Intel Pentium MMX 166MHz"], ["                 ", "Memory", "32768K"],
      ].map(([art, label, value]) => ({ text: <><span className="t-magenta">{art}</span>{label ? <><b className="t-yellow">{label}</b>: {value}</> : <b className="t-cyan">{value}</b>}</> }));
        out.push({ text: <><span>{"                 "}</span><span className="swatches"><i className="bg-red" /><i className="bg-yellow" /><i className="bg-green" /><i className="bg-cyan" /><i className="bg-blue" /><i className="bg-magenta" /></span></> }); break;
      case "date": out = [{ text: new Date().toString().replace(/\d{4}/, "1996") }]; break;
      case "echo": out = [{ text: args.join(" ") }]; break;
      case "history": out = [...commandLog, input].map((line, index) => ({ text: `${String(index + 1).padStart(4)}  ${line}` })); break;
      case "clear": setTermLines([]); return;
      case "reboot": out = [{ text: "The system is going down for reboot NOW!", tone: "t-yellow" }]; setTimeout(reboot, 700); break;
      case "shutdown": out = [{ text: "The system is going down for halt NOW!", tone: "t-yellow" }]; setTimeout(shutdown, 700); break;
      case "exit": router.push("/"); return;
      case "sudo": out = [{ text: "player is not in the sudoers file. This incident will be reported.", tone: "t-red" }]; break;
      default: out = [{ text: `arcade-sh: command not found: ${action}`, tone: "t-red" }, { text: <>Type <b className="t-cyan">help</b> for a list of commands.</> }];
    }
    print([prompt, ...out]);
  }
  function terminalKeys(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      const [action, ...rest] = command.split(" ");
      const pool = rest.length ? games.map(game => game.id) : commands;
      const word = rest.length ? rest.join(" ") : action;
      const match = pool.filter(item => item.startsWith(word.toLowerCase()));
      if (match.length === 1) { const next = rest.length ? `${action} ${match[0]}` : `${match[0]} `; setCommand(next); setCaret(next.length); }
      else if (match.length > 1) print([{ text: match.join("   "), tone: "t-dim" }]);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (!commandLog.length) return;
      const index = event.key === "ArrowUp" ? (logIndex.current < 0 ? commandLog.length - 1 : Math.max(0, logIndex.current - 1)) : logIndex.current + 1;
      logIndex.current = index >= commandLog.length ? -1 : index;
      const next = logIndex.current < 0 ? "" : commandLog[logIndex.current];
      setCommand(next); setCaret(next.length);
    }
    if (event.key === "l" && event.ctrlKey) { event.preventDefault(); setTermLines([]); }
  }

  // ---------- windows
  const clock = now && <><strong className="clock">{now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</strong><span className="date">{now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span></>;

  const detailWindow = detail && <section className="window detail-window" aria-labelledby="detail-title" key={`detail-${detail.id}`}>
    <header className="detail-header">
      <button className="win-btn ghost" onClick={() => openDetail(null)} aria-label="Back"><ArrowLeft /></button>
      <h2 id="detail-title">{title(detail)}</h2>
      <button className="win-btn" onClick={() => share(detail)} aria-label="Copy link to this game"><Share2 /></button>
      <span className={`share-toast${shared ? " is-visible" : ""}`} role="status">{shared ? "Link copied" : ""}</span>
      <button className="win-btn win-close" onClick={() => { openDetail(null); router.push("/"); }} aria-label="Close"><X /></button>
    </header>
    {photo && <div className="photo-view" onClick={() => setPhoto(null)}><Image src={photo} alt={`${title(detail)} box photo`} width={1536} height={1024} sizes="80vw" /><button className="win-btn" aria-label="Close photo"><X /></button></div>}
    <div className="detail-body">
      <BoxViewer game={detail} title={title(detail)} key={detail.id} />
      <div className="detail-info">
        <dl className="detail-specs">
          <div><dt>Genre</dt><dd>{detail.genre}</dd></div>
          {!detail.specs.some(spec => spec.label === "Players") && <div><dt>Players</dt><dd>{detail.players}</dd></div>}
          {detail.specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}
        </dl>
        <h3>Synopsis</h3>
        <p className="synopsis">{detail.description}</p>
        {detail.notice && <p className="detail-notice">{detail.notice}</p>}
        <ul className="feature-chips">{detail.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
        {!!detail.photos?.length && <div className="photo-strip">{detail.photos.map((src, index) => <button key={src} onClick={() => setPhoto(src)} aria-label={`Open box photo ${index + 1}`}><Image src={src} alt="" width={240} height={180} sizes="160px" /></button>)}</div>}
        <div className="detail-actions">
          {detail.source?.startsWith("http") && <p className="device-line is-offline"><span><b>Online only</b> · runs on its maker&rsquo;s site ({new URL(detail.source).host}), so it can&rsquo;t be downloaded</span></p>}
          {canDownload(detail.id) && (getDownload(detail.id).status === "done"
            ? <p className="device-line is-download"><Download /><span><b>On this PC</b> · downloaded, plays offline with no internet</span></p>
            : <p className="device-line is-download"><Download /><span><b>Downloadable to your PC</b> · download it once ({megabytes(totalBytes(detail.id))}) and play it offline, no internet needed</span></p>)}
          {!online && !(canDownload(detail.id) && getDownload(detail.id).status === "done") && <p className="device-line is-offline"><span><b>You are offline</b> · this game needs an internet connection</span></p>}
          <p className="device-line">{gameSupport(detail).devices === "both" ? <Smartphone /> : <Laptop />}<span><b>{gameSupport(detail).label}</b> · {gameSupport(detail).note}</span></p>
          {detail.href.startsWith("/")
            ? <Link className="play-button" href={detail.href} onClick={click}><Gamepad2 />{detail.cta}<ArrowRight className="nudge" /></Link>
            : <a className="play-button" href={detail.href} onClick={click}><Gamepad2 />{detail.cta}<ArrowRight className="nudge" /></a>}
        </div>
      </div>
    </div>
  </section>;

  let windowContent: ReactNode = null;
  if (pathname === "/about") windowContent = <section className="window about-window" aria-labelledby="about-title">
    <header className="about-header"><h1 id="about-title">A is for her. D is for me.</h1><CloseButton /></header>
    <div className="about-copy">
      <p>Hi, I’m Diae, the D. I built this little arcade for my favourite person to play with: A, my girlfriend. The A is hers, the D is mine, and the ampersand in between is every evening we’ve spent side by side with a controller each, arguing about who really won.</p>
      <p>A&amp;D Arcade is our home for the games we love, the ones we play together and the ones we play solo while the other one watches and gives terrible advice. Our own originals live here, <Link href="/collection">Pong, Kart, Puck and Chefs</Link>, made so two people can share one keyboard or play from opposite ends of the city with a four-letter room code. Next to them sits a shelf of browser classics we keep coming back to.</p>
      <p>It’s dressed like the computers we grew up loving: the BIOS beep, the glow of an old monitor, big cardboard boxes you could actually hold. Take your time, open a folder, pick up a box. Play alone, or bring your own player two. Want the short version? Type <Link href="/terminal">whoami</Link> in the terminal.</p>
      <p className="about-signature">Made with love by Diae, for A.</p>
    </div>
    <Image className="about-portrait" src="/ad-about-cutout.webp" alt="The two people behind A&D Arcade leaning on vintage desktop computers" width={1536} height={1024} sizes="(max-width: 700px) 100vw, 70vw" priority />
  </section>;

  if (pathname === "/collection") windowContent = <section className={`window collection-window${intro ? " show-intro" : ""}`} aria-label="Big Box Collection">
    <aside className="collection-intro">
      <CloseButton />
      <button className="win-btn intro-close" onClick={() => setIntro(false)} aria-label="Hide collection info"><X /></button>
      <h1>Big Box<br />Collection,</h1>
      <p className="subtitle">a shelf of favourites from the age of the cardboard box.</p>
      <p>Remember when a game was a box you could hold? Heavy enough to feel like an object, not just software. You explored the box before the game even started.</p>
      <p>Every box on this shelf is one of ours: our own arcade originals beside the browser classics we keep coming back to.</p>
      <p>Pick one up. Turn it around. Then press play.</p>
      <div className="collection-tools">
        <label className="field"><Search /><input aria-label="Search games" placeholder="Search the shelf" value={query} onChange={event => setQuery(event.target.value)} /></label>
        <div className="segmented" role="group" aria-label="Filter">{["all", "originals", "classics"].map(filter => <button key={filter} aria-pressed={category === filter} onClick={() => setCategory(filter)}>{filter}</button>)}</div>
        <span className="count" role="status">{visibleGames.length} of {games.length} boxes</span>
      </div>
    </aside>
    <div className="shelf-frame">
      <div className="shelf-buttons"><button className="win-btn" onClick={() => setIntro(true)} aria-label="About this collection"><Info /></button><CloseButton /></div>
      <div className="shelf">
        <div className="shelf-grid" ref={shelfGrid}>{visibleGames.map((game, index) => <div className="shelf-slot" key={game.id}>
          <button className="big-box" style={{ "--i": index } as React.CSSProperties} onClick={() => { click(); openDetail(game); }} aria-label={`Open ${title(game)}`}>
            <span className="big-box-spine" />
            <span className="big-box-face"><Image src={thumb(game.cover, 384)} alt="" width={240} height={360} sizes="(max-width: 700px) 30vw, 130px" draggable={false} /></span>
            {canDownload(game.id) && (getDownload(game.id).status === "done"
              ? <span className="download-sticker is-saved" title="Downloaded: plays offline on this PC">✓ ON THIS PC</span>
              : <span className="download-sticker" title="Can be downloaded to your PC and played offline"><Download aria-hidden="true" />DOWNLOADABLE</span>)}
          </button>
        </div>)}{Array.from({ length: (columns - visibleGames.length % columns) % columns + columns * Math.max(0, 4 - Math.ceil(visibleGames.length / columns)) }, (_, index) => <div className="shelf-slot is-empty" key={`empty-${index}`} aria-hidden="true" />)}</div>
        {!visibleGames.length && <p className="shelf-empty">No boxes match “{query}”.</p>}
      </div>
    </div>
  </section>;

  if (pathname === "/files") windowContent = <section className="window files-window" aria-label="Files">
    <header className="files-toolbar">
      <div className="nav-buttons"><button className="win-btn ghost" onClick={() => router.back()} aria-label="Back"><ArrowLeft /></button><button className="win-btn ghost" onClick={() => router.forward()} aria-label="Forward"><ArrowRight /></button><Link className="win-btn ghost" href="/" aria-label="Up to desktop"><ArrowUp /></Link><button className="win-btn ghost is-on" onClick={() => browse("all")} aria-label="Home"><House /></button></div>
      <nav className="crumbs" aria-label="Path">{drive ? <><span>/</span><span>dev</span><b>{drive.path.replace("dev://", "")}</b></> : <><span>/</span><span>home</span><span>a&amp;d-arcade</span><b>{category === "all" ? "Collection" : category === "originals" ? "Originals" : "Classics"}</b></>}</nav>
      <CloseButton />
    </header>
    <div className="files-body">
      <aside className="files-sidebar">
        <p>Places</p>
        <button aria-pressed={!drive && category === "all"} onClick={() => browse("all")}><House />Home</button>
        <Link href="/collection"><BookOpen />Collection</Link>
        <Link href="/about"><FileText />readme.txt</Link>
        <p>Libraries</p>
        <button aria-pressed={!drive && category === "originals"} onClick={() => browse("originals")}><Gamepad2 />A&amp;D Originals</button>
        <button aria-pressed={!drive && category === "classics"} onClick={() => browse("classics")}><Disc3 />Browser classics</button>
        <p>Devices</p>
        {devices.map(device => { const Icon = deviceIcons[device.icon]; const open = unlocked.includes(device.id); return <button key={device.id} className={`device${open ? " is-open" : ""}`} aria-pressed={drive?.id === device.id} onClick={() => openDevice(device)} aria-label={`${device.label}${open ? "" : ", locked"}`}><Icon />{device.label}</button>; })}
      </aside>
      {drive ? <div className="files-list drive-list">
        <table>
          <thead><tr><th>Name</th><th className="col-date">Date Modified</th><th className="col-type">Type</th><th className="col-size">Size</th></tr></thead>
          <tbody>
            <tr onClick={() => setNote(drive)}><td><button onClick={event => { event.stopPropagation(); setNote(drive); }}><FileText />{drive.note.name}</button></td><td className="col-date">for A, always</td><td className="col-type">Text Document</td><td className="col-size">♥ KB</td></tr>
            {drive.id === "cdrom" && <tr className="is-app" title="Double-click to open" onClick={() => { if (mobile) setDeck(true); }} onDoubleClick={() => setDeck(true)}>
              <td><button onClick={event => { event.stopPropagation(); if (mobile) setDeck(true); }} onDoubleClick={event => { event.stopPropagation(); setDeck(true); }}><AppWindow />TapeDeck.exe</button></td>
              <td className="col-date">YouTube to tape</td><td className="col-type">Application</td><td className="col-size">64 KB</td></tr>}
            {deviceTracks[drive.id]?.map(src => <tr key={src} onClick={() => playTrack(src)}><td><button onClick={event => { event.stopPropagation(); playTrack(src); }}><Music />{trackName(src).title}</button></td><td className="col-date">{trackName(src).artist || "her favourites"}</td><td className="col-type">Audio</td>
              <td className="col-size"><span className="row-tools" onClick={event => event.stopPropagation()}><button onClick={() => queueTrack(src, trackName(src).title)} aria-label={`Add ${trackName(src).title} to the playlist`} title="Add to playlist"><ListPlus /></button></span></td></tr>)}
            {drive.id === "cdrom" && tapes.map(({ tape }) => { const key = `tape:${tape.id}`; return <tr key={key} onClick={() => playTrack(key)}>
              <td><button onClick={event => { event.stopPropagation(); playTrack(key); }}><CassetteTape />{tape.title}</button></td>
              <td className="col-date">{tape.artist || `recorded ${new Date(tape.added).toLocaleDateString()}`}</td><td className="col-type">Tape · {(tape.blob.size / 1e6).toFixed(1)} MB</td>
              <td className="col-size"><span className="row-tools" onClick={event => event.stopPropagation()}>
                <button onClick={() => queueTrack(key, tape.title)} aria-label={`Add ${tape.title} to the playlist`} title="Add to playlist"><ListPlus /></button>
                <button onClick={() => saveCopy(tape)} aria-label={`Save a copy of ${tape.title} to Downloads`} title="Save a copy to Downloads"><Download /></button>
                <button onClick={() => { if (confirm(`Erase “${tape.title}” from this PC?`)) { void removeTape(tape.id); setPlaylist(playlist.filter(item => item !== key)); } }} aria-label={`Erase ${tape.title}`} title="Erase"><Trash2 /></button>
              </span></td></tr>; })}
            {devicePhotos[drive.id]?.map(src => <tr key={src} onClick={() => setPhoto(src)}><td><button onClick={event => { event.stopPropagation(); setPhoto(src); }}><ImageIcon />{decodeURIComponent(src.split("/").pop() ?? "")}</button></td><td className="col-date">our camera roll</td><td className="col-type">Image</td><td className="col-size">—</td></tr>)}
          </tbody>
        </table>
        {drive.id !== "cdrom" && !devicePhotos[drive.id]?.length && !deviceTracks[drive.id]?.length && <p className="files-empty">No photos or songs on this drive yet.</p>}
      </div> : <div className="files-list">
        <label className="field files-search"><Search /><input aria-label="Search files" placeholder="Search" value={query} onChange={event => setQuery(event.target.value)} /></label>
        <table>
          <thead><tr><th><button onClick={() => setSortAscending(value => !value)}>Name {sortAscending ? "↑" : "↓"}</button></th><th className="col-date">Date Modified</th><th className="col-type">Type</th><th className="col-size">Players</th></tr></thead>
          <tbody>{[...visibleGames].sort((a, b) => title(a).localeCompare(title(b)) * (sortAscending ? 1 : -1)).map(game => <tr key={game.id} onClick={() => { click(); openDetail(game); }}>
            <td><button onClick={event => { event.stopPropagation(); click(); openDetail(game); }}>{game.source ? <Disc3 /> : <Gamepad2 />}{title(game)}</button></td>
            <td className="col-date">{modified(game)}</td><td className="col-type">{game.source ? "Browser Game" : "A&D Original"}</td><td className="col-size">{game.players}</td>
          </tr>)}</tbody>
        </table>
        {!visibleGames.length && <p className="files-empty">No matching files.</p>}
      </div>}
    </div>
    {note && <article className="note-view" aria-labelledby="note-title"><header><FileText /><span>{note.note.name} — Notepad</span><button className="win-btn" onClick={() => setNote(null)} aria-label="Close note"><X /></button></header><div><h2 id="note-title">{note.note.title}</h2>{note.note.body.map((line, index) => <p key={index}>{line}</p>)}</div></article>}
    {photo && pathname === "/files" && <div className="photo-view" onClick={() => setPhoto(null)}><Image src={photo} alt="A photo from our drive" width={1600} height={1200} sizes="80vw" /><button className="win-btn" aria-label="Close photo"><X /></button></div>}
    {deck && <TapeDeck onPlay={tape => { playTrack(`tape:${tape.id}`); setDeck(false); }} onQueue={tape => queueTrack(`tape:${tape.id}`, tape.title)} onClose={() => setDeck(false)} />}
    {locking && <DeviceLock device={locking} onUnlock={() => unlock(locking)} onClose={() => setLocking(null)} />}
    <footer className="files-status"><span role="status">{flash || (drive ? `${1 + (devicePhotos[drive.id]?.length ?? 0) + (deviceTracks[drive.id]?.length ?? 0) + (drive.id === "cdrom" ? 1 + tapes.length : 0)} items` : `${visibleGames.length} items`)}</span><span>{drive ? `${drive.label} · ${drive.path}` : "A&D GAME ARCHIVE · 2.1 GB free"}</span></footer>
  </section>;

  if (pathname === "/terminal") windowContent = <section className="window terminal-window" aria-label="Terminal" onClick={() => { if (!getSelection()?.toString()) terminalInput.current?.focus({ preventScroll: true }); }}>
    <header className="terminal-tabs"><span className="terminal-tab"><Terminal />Terminal</span><Link href="/" className="terminal-x" aria-label="Close terminal"><X /></Link></header>
    <div className="terminal-output" role="log" aria-live="polite">
      {termLines.map((block, b) => <div className="term-block" key={b}>{block.map((line, index) => <pre key={index} className={line.tone} style={{ "--i": index } as React.CSSProperties}>{line.text}</pre>)}</div>)}
      <form onSubmit={runCommand} className="term-prompt">
        <label htmlFor="terminal-command"><span className="t-cyan">/home/a&amp;d-arcade</span><span className="t-yellow">(main)</span> <span className="t-magenta">»</span></label>
        <span className="term-typed" aria-hidden="true">{command.slice(0, caret)}<i className="block-cursor">{command[caret] ?? " "}</i>{command.slice(caret + 1)}</span>
        <input id="terminal-command" ref={terminalInput} value={command} onChange={event => { setCommand(event.target.value); setCaret(event.target.selectionStart ?? event.target.value.length); }} onSelect={event => setCaret(event.currentTarget.selectionStart ?? 0)} onKeyDown={terminalKeys} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="Terminal command" enterKeyHint="go" />
      </form>
      <div ref={terminalEnd} />
    </div>
  </section>;

  if (pathname === "/settings") windowContent = <section className="window settings-window" aria-labelledby="settings-title">
    <header><h1 id="settings-title">Settings</h1><CloseButton /></header>
    <h2>Wallpaper</h2>
    <div className="wallpaper-grid">{choices.map(item => <button key={item.id} aria-pressed={wallpaper === item.id} onClick={() => { click(); preference({ wallpaper: item.id }); }}><span className={`swatch wp-${item.id}`} style={artOf(item.id) ? { backgroundImage: `url(${artOf(item.id)})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />{item.label}</button>)}</div>
    <label className="setting-row"><ImagePlus />{customWall ? "Change my picture" : "Use my own picture"}<b>PICK</b>
      <input className="file-input" type="file" accept="image/*" onChange={event => { void ownWallpaper(event.target.files?.[0]); event.target.value = ""; }} /></label>
    {wallpaper === "custom" && <div className="segmented wall-fit" role="group" aria-label="Picture position">{(["fill", "fit", "center", "tile"] as const).map(fit =>
      <button key={fit} aria-pressed={wallFit === fit} onClick={() => preference({ wallFit: fit })}>{fit}</button>)}</div>}
    {customWall && <button className="setting-row" onClick={dropWallpaper}><Trash2 />Remove my picture<b>RUN</b></button>}
    <h2>Sound</h2>
    {([["boot", "Boot beep", Volume2], ["click", "Mouse click", MousePointerClick], ["hum", "Ambient hum", Radio]] as const).map(([key, label, Icon]) => <button className="setting-row" key={key} role="switch" aria-checked={sound[key]} onClick={() => preference({ sound: { [key]: !sound[key] } })}><Icon />{label}<b>{sound[key] ? "ON" : "OFF"}</b></button>)}
    <h2>Display</h2>
    <button className="setting-row" role="switch" aria-checked={crt} onClick={() => preference({ crt: !crt })}><Laptop />CRT phosphor &amp; grain<b>{crt ? "ON" : "OFF"}</b></button>
    <button className="setting-row" role="switch" aria-checked={startup} onClick={() => preference({ startup: !startup })}><Power />Startup animations<b>{startup ? "ON" : "OFF"}</b></button>
    <h2>Offline &amp; downloads</h2>
    {installed
      ? <p className="setting-row is-static"><Download />Installed as an app<b>YES</b></p>
      : install
        ? <button className="setting-row" onClick={() => { void install.prompt(); setInstall(null); }}><Download />Install as an app (opens offline)<b>RUN</b></button>
        : <p className="setting-row is-static"><Download />Install as an app<b className="setting-hint">Chrome or Edge: install icon in the address bar</b></p>}
    <button className="setting-row" role="switch" aria-checked={!!storage?.persisted} disabled={!!storage?.persisted}
      onClick={() => { void navigator.storage?.persist?.().then(() => { setPersistAsked(true); readStorage(); }); }}><HardDrive />Protect downloads from browser cleanup<b>{storage?.persisted ? "ON" : persistAsked ? "NOT YET" : "ASK"}</b></button>
    {persistAsked && !storage?.persisted && <p className="settings-note">The browser decides this on its own. Installing the arcade as an app, or visiting it regularly, usually makes it say yes.</p>}
    {storage && <p className="setting-row is-static"><Save />Space used<b className="setting-hint">{megabytes(storage.used)} used · {megabytes(storage.free)} free</b></p>}
    {(() => {
      const saved = games.filter(game => canDownload(game.id) && getDownload(game.id).status !== "none");
      if (!saved.length) return <p className="settings-note">No games downloaded yet. Open a game from the Collection and choose “Download to this device”.</p>;
      return <>
        <ul className="download-list" key={downloads}>{saved.map(game => { const state = getDownload(game.id); return <li key={game.id}>
          <span>{title(game)}<small>{state.status === "done" ? `On this PC · ${megabytes(state.total)}` : `${state.status === "downloading" ? "Downloading" : "Paused"} · ${megabytes(state.done)} of ${megabytes(state.total)}`}</small></span>
          <button onClick={() => { if (confirm(`Remove ${title(game)} from this device?`)) void removeDownload(game.id); }}>REMOVE</button>
        </li>; })}</ul>
        <button className="setting-row" onClick={() => { if (confirm(`Remove all ${saved.length} downloaded games from this device? You will need to download them again to play offline.`)) saved.forEach(game => void removeDownload(game.id)); }}><Trash2 />Remove all downloads<b>RUN</b></button>
      </>;
    })()}
    <h2>System</h2>
    <button className="setting-row" onClick={reboot}><RotateCcw />Replay startup<b>RUN</b></button>
    <button className="setting-row" onClick={() => { try { localStorage.removeItem("ad-preferences"); sessionStorage.clear(); } catch {} window.history.replaceState(null, "", "/"); location.reload(); }}><Trash2 />Clear temp files (keeps downloads)<b>RUN</b></button>
    <p className="settings-foot">A&amp;D ARCADE OS 1.0 · EST. 1996 / 2026<br />Animation follows your device’s reduced-motion setting. Downloaded games stay on this device until you remove them or clear the browser’s site data.</p>
  </section>;

  // the phone home screen; the cells are where each icon starts before she moves it
  const homeApps: HomeApp[] = [
    ...games.filter(game => gameIcons[game.id]).map((game, n) => ({ id: game.id, label: game.name[1].charAt(0) + game.name[1].slice(1).toLowerCase(), icon: gameIcons[game.id], href: game.href, external: true, cell: n })),
    { id: "music", label: "Music", icon: Music, onOpen: openMusic, cell: 4 },
    { id: "terminal", label: "Terminal", icon: Terminal, href: "/terminal", cell: 7 },
    { id: "about", label: "About", icon: User, href: "/about", cell: 16 },
    // Games opens the game library (the Big Box shelf); Files is the file explorer
    { id: "collection", label: "Games", icon: Gamepad2, href: "/collection", cell: 17 },
    { id: "files", label: "Files", icon: Folder, href: "/files", cell: 19 },
  ];
  const windowKey = detail ? `detail` : pathname;
  const showDesktop = pathname === "/" || pathname === "/settings";

  return <div className={`monitor wp-${wallpaper}${crt ? " crt-on" : ""}${booting ? " is-booting" : ""} power-${powered}`} onPointerDown={event => { if ((event.target as HTMLElement).closest("button, a")) click(); }}>
    <svg className="svg-defs" aria-hidden="true"><defs><filter id="crt-chroma" x="-2%" y="-2%" width="104%" height="104%"><feOffset in="SourceGraphic" dx=".7" result="r" /><feColorMatrix in="r" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="ro" /><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="go" /><feOffset in="SourceGraphic" dx="-.7" result="b" /><feColorMatrix in="b" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="bo" /><feBlend in="go" in2="ro" mode="screen" result="rg" /><feBlend in="rg" in2="bo" mode="screen" /></filter></defs></svg>
    <a className="skip-link" href="#desktop-content" hidden={booting}>Skip to content</a>
    <div className="screen" inert={booting || powered !== "on"} style={artOf(wallpaper) ? { backgroundImage: `url(${artOf(wallpaper)})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundColor: walls.custom, ...(wallpaper === "custom" && fits[wallFit]) } : undefined}>
      <main id="desktop-content" className="desktop">
        {showDesktop && <section className="home" aria-label="Desktop">
          <div className="home-clock">{clock}</div>
          <Link className="home-terminal" href="/terminal" aria-label="Terminal"><Terminal /></Link>
          <nav className="shortcuts" aria-label="Games">{games.filter(game => gameIcons[game.id]).map(game => { const Icon = gameIcons[game.id]; return <a key={game.id} href={game.href} className="shortcut"><span><Icon /></span>{game.name[1].charAt(0) + game.name[1].slice(1).toLowerCase()}</a>; })}</nav>
          {mobile && <HomeGrid apps={homeApps} />}
          <nav className="home-apps" aria-label="Apps">
            <Link href="/about" className="app-tile"><span><User /></span>About</Link>
            <Link href="/collection" className="app-tile"><span><BookOpen /></span>Collection</Link>
            <Link href="/files" className="app-tile push"><span><Gamepad2 /></span>Games</Link>
          </nav>
        </section>}
        {(detail || (windowContent && pathname !== "/")) && <div className={`window-layer layer-${detail ? "detail" : pathname.slice(1)}`} key={windowKey}>{detailWindow ?? windowContent}</div>}
        {!screens.includes(pathname) && <div className="window-layer layer-page">{children}</div>}
      </main>
      {player && <MusicPlayer library={library} playlist={playlist} onPlaylist={setPlaylist} request={player} onClose={() => setPlayer(null)} />}
      {menu && <nav className="start-menu" aria-label="Start menu">
        <div className="menu-head"><div>{clock}</div><button className="win-btn win-close" onClick={() => setMenu(false)} aria-label="Close menu"><X /></button></div>
        <p>Apps</p>
        {[{ href: "/files", icon: Folder, label: "Files" }, { href: "/collection", icon: BookOpen, label: "Collection" }, { href: "/about", icon: User, label: "About" }, { href: "/terminal", icon: Terminal, label: "Terminal" }].map(item => <Link key={item.href} href={item.href} onClick={() => { setMenu(false); openDetail(null); }}><item.icon />{item.label}</Link>)}
        <button onClick={() => { setMenu(false); openMusic(); }}><Music />Music</button>
        <p>Games</p>
        {games.filter(game => gameIcons[game.id]).map(game => { const Icon = gameIcons[game.id]; return <a key={game.id} href={game.href}><Icon />{title(game).replace("A&D ", "").toLowerCase().replace(/^\w/, letter => letter.toUpperCase())}</a>; })}
        <p className="menu-system">System</p>
        <Link href="/settings" onClick={() => setMenu(false)}><Settings />Settings</Link>
        <button onClick={reboot}><RotateCcw />Restart</button>
        <button onClick={shutdown}><Power />Shut down</button>
      </nav>}
      <nav className="dock" aria-label="Dock">
        <button aria-label="Start menu" aria-expanded={menu} onClick={() => setMenu(value => !value)}><Menu /><span className="tip">Menu</span></button>
        {dock.map(item => <Link key={item.href} href={item.href} className={item.href === "/terminal" ? "dock-terminal" : undefined} aria-label={item.label} aria-current={pathname === item.href && !detail ? "page" : undefined} onClick={() => { setMenu(false); openDetail(null); }}><item.icon /><span className="tip">{item.label}</span></Link>)}
      </nav>
    </div>
    {powered === "off" && <button className="power-off" onClick={reboot}><span>It’s now safe to turn off<br />your computer.</span><small>Press any key to power on</small></button>}
    {booting && (mobile === null ? <div className="boot" /> : <BootScreen key={bootRun} mobile={mobile} terminal={!mobile || !welcomed || bootRun > 0} onFinish={finishBoot} onSetup={setupBoot} onBeep={beep} />)}
    <CrtOverlay enabled={crt} />
  </div>;
}
