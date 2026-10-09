"use client";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import PixelIcon from "./pixel-icon";
import "./music-player.css";

/** "01 - Artist - Title.mp3" -> { artist, title } */
export const trackName = (src: string) => {
  const parts = decodeURIComponent(src.split("/").pop() ?? "").replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").replace(/^\d+\s*[-.)]\s*/, "").split(" - ");
  return parts.length > 1 ? { artist: parts[0].trim(), title: parts.slice(1).join(" - ").trim() } : { artist: "", title: parts[0].trim() };
};
export type Track = { key: string; src: string; title: string; artist: string; from: string };
export type PlayRequest = { key: string | null; n: number; play: boolean };
type Repeat = "off" | "all" | "one";
type Sleep = { until: number } | "track" | null;

const clock = (seconds: number) => Number.isFinite(seconds) && seconds > 0 ? `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}` : "00:00";
const SLEEPS = [15, 30, 45, 60, 90];
const BARS = 16, ROWS = 12;
// one Web Audio graph per <audio>: an element can only ever be wired to a single source node
const graphs = new WeakMap<HTMLAudioElement, { context: AudioContext; analyser: AnalyserNode }>();
const wire = (element: HTMLAudioElement) => {
  let graph = graphs.get(element);
  if (!graph) {
    const context = new AudioContext(), analyser = context.createAnalyser();
    analyser.fftSize = 256; analyser.smoothingTimeConstant = .7;
    context.createMediaElementSource(element).connect(analyser).connect(context.destination);
    graphs.set(element, graph = { context, analyser });
  }
  graph.context.resume().catch(() => {});
  return graph;
};

// the pixel cassette at the top of the screen: reels turn and the tape winds across as the song plays
function drawCassette(g: CanvasRenderingContext2D, turn: number, progress: number) {
  const px = (x: number, y: number, w: number, h: number, color: string) => { g.fillStyle = color; g.fillRect(x, y, w, h); };
  g.clearRect(0, 0, 44, 28);
  px(1, 1, 42, 26, "#d9d3bf"); px(0, 2, 44, 22, "#d9d3bf"); px(2, 0, 40, 28, "#d9d3bf");
  px(4, 3, 36, 2, "#e2604a"); px(4, 5, 36, 2, "#f5b800"); px(4, 7, 36, 2, "#2f9d5a");
  px(8, 11, 28, 10, "#1a1820");
  px(15, 24, 14, 4, "#8f8a77");
  for (const [cx, share] of [[14, 1 - progress], [30, progress]] as const) {
    const tape = 2 + share * 3;
    for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) {
      const r = Math.hypot(x, y);
      if (cx + x < 9 || cx + x > 35 || 16 + y < 12 || 16 + y > 20) continue;
      if (r <= tape + 1.6 && r > 2.6) px(cx + x, 16 + y, 1, 1, "#5b3a28");
    }
    px(cx - 2, 14, 4, 4, "#f2efe4");
    const a = turn + (cx === 14 ? 0 : .6);
    px(cx + Math.round(Math.cos(a) * 1.4) - .5, 16 + Math.round(Math.sin(a) * 1.4) - .5, 1, 1, "#1a1820");
  }
}

export default function MusicPlayer({ library, playlist, onPlaylist, request, onClose }: {
  library: Track[]; playlist: string[]; onPlaylist: (keys: string[]) => void; request: PlayRequest; onClose: () => void;
}) {
  const byKey = new Map(library.map(track => [track.key, track]));
  const queue = playlist.map(key => byKey.get(key)).filter((track): track is Track => !!track);
  const [current, setCurrent] = useState<string | null>(request.key ?? queue[0]?.key ?? null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // settings that outlive the window (the deck only mounts in the browser, after a click)
  const [saved] = useState<{ volume?: unknown; shuffle?: unknown; repeat?: unknown }>(() => { try { return JSON.parse(localStorage.getItem("ad-player") || "{}"); } catch { return {}; } });
  const [volume, setVolume] = useState(typeof saved.volume === "number" ? saved.volume : .8);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(saved.shuffle === true);
  const [repeat, setRepeat] = useState<Repeat>(saved.repeat === "off" || saved.repeat === "one" ? saved.repeat : "all");
  const [seen, setSeen] = useState(request.n);
  const [sleep, setSleep] = useState<Sleep>(null);
  const [sleepMenu, setSleepMenu] = useState(false);
  const [tab, setTab] = useState<"playlist" | "library">(queue.length ? "playlist" : "library");
  const [mini, setMini] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [now, setNow] = useState(0);
  const audio = useRef<HTMLAudioElement>(null);
  const meter = useRef<HTMLCanvasElement>(null);
  const tape = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const wantPlay = useRef(request.play);
  const track = (current && byKey.get(current)) || null;
  const index = queue.findIndex(item => item.key === current);
  const progress = duration ? time / duration : 0;

  useEffect(() => { try { localStorage.setItem("ad-player", JSON.stringify({ volume, shuffle, repeat })); } catch {} }, [volume, shuffle, repeat]);
  useEffect(() => { const element = audio.current; if (element) { element.volume = volume; element.muted = muted; } }, [volume, muted]);
  useEffect(() => {
    const element = audio.current!, { context } = wire(element);
    return () => { element.pause(); setTimeout(() => { if (!element.isConnected) context.close().catch(() => {}); }); };
  }, []);

  // a click in Files (or the Tape Deck) asks for a song
  if (seen !== request.n) { setSeen(request.n); if (request.key) setCurrent(request.key); }
  useEffect(() => {
    wantPlay.current = request.play;
    const element = audio.current;
    if (request.play && element) { wire(element); void element.play().catch(() => {}); }
  }, [request.n, request.play]);
  // a new tape in the deck: roll it if we were rolling
  useEffect(() => { const element = audio.current; if (element && track && wantPlay.current) { wire(element); void element.play().catch(() => setPlaying(false)); } }, [track?.src]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggle() {
    const element = audio.current;
    if (!element || !track) { if (!track && queue[0]) { wantPlay.current = true; setCurrent(queue[0].key); } return; }
    wire(element);   // a browser that blocked the autoplay lets Web Audio start from this click
    if (element.paused) { wantPlay.current = true; element.play().catch(() => setPlaying(false)); } else { wantPlay.current = false; element.pause(); }
  }
  function go(by: 1 | -1, auto = false) {
    if (!queue.length) return;
    const element = audio.current;
    // like every deck: "previous" a few seconds into a song plays it again from the top
    if (by < 0 && element && element.currentTime > 3) { element.currentTime = 0; return; }
    let next = shuffle && queue.length > 1 ? (index + 1 + Math.floor(Math.random() * (queue.length - 1))) % queue.length : index + by;
    if (next >= queue.length || next < 0) {
      if (auto && repeat === "off") { wantPlay.current = false; setCurrent(queue[0].key); return; }
      next = (next + queue.length) % queue.length;
    }
    wantPlay.current = auto || playing;
    if (queue[next].key === current && element) { element.currentTime = 0; if (wantPlay.current) void element.play(); }
    setCurrent(queue[next].key);
  }
  function stop() { const element = audio.current; if (!element) return; wantPlay.current = false; element.pause(); element.currentTime = 0; }
  function ended() {
    if (sleep === "track") { setSleep(null); wantPlay.current = false; return; }
    go(1, true);
  }

  // sleep timer: counts down on the screen, fades the last ten seconds, then stops the tape
  useEffect(() => {
    if (!sleep || sleep === "track") return;
    const tick = setInterval(() => {
      const left = (sleep.until - Date.now()) / 1000, element = audio.current;
      setNow(Date.now());
      if (!element) return;
      if (left <= 0) { element.pause(); element.volume = volume; wantPlay.current = false; setSleep(null); }
      else if (left < 10) element.volume = volume * left / 10;
    }, 250);
    const element = audio.current;
    return () => { clearInterval(tick); if (element) element.volume = volume; };
  }, [sleep, volume]);
  const sleepLeft = sleep && sleep !== "track" ? Math.max(0, (sleep.until - now) / 1000) : 0;

  // the screen: a 16-band pixel spectrum with falling peak dots, and the cassette
  useEffect(() => {
    let frame = 0, turn = 0;
    const peaks = new Float32Array(BARS), data = new Uint8Array(128);
    const draw = () => {
      const c = meter.current, t = tape.current, element = audio.current;
      if (t) { const g = t.getContext("2d")!; if (playing) turn += .18; drawCassette(g, Math.round(turn / (Math.PI / 4)) * (Math.PI / 4), progress); }
      if (c && element) {
        const g = c.getContext("2d")!;
        if (playing) wire(element).analyser.getByteFrequencyData(data); else data.fill(0);
        g.clearRect(0, 0, c.width, c.height);
        for (let bar = 0; bar < BARS; bar++) {
          const from = Math.floor((bar / BARS) ** 1.7 * 90), to = Math.max(from + 1, Math.floor(((bar + 1) / BARS) ** 1.7 * 90));
          let sum = 0; for (let i = from; i < to; i++) sum += data[i];
          const level = Math.round(sum / (to - from) / 255 * ROWS);
          peaks[bar] = Math.max(level, peaks[bar] - .2);
          for (let row = 0; row < ROWS; row++) {
            const lit = row < level;
            g.fillStyle = lit ? (row >= ROWS - 2 ? "#ff6b4a" : row >= ROWS - 5 ? "#ffd04a" : "#7dff8a") : "#7dff8a14";
            g.fillRect(bar * 4, ROWS * 2 - (row + 1) * 2, 3, 1);
          }
          if (peaks[bar] >= 1) { g.fillStyle = "#e9ffe9"; g.fillRect(bar * 4, ROWS * 2 - Math.ceil(peaks[bar]) * 2, 3, 1); }
        }
      }
      if (playing) frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [playing, progress, mini]);

  // the phone's lock screen and headphone buttons drive the deck too
  const controls = useRef({ toggle, go, stop });
  useEffect(() => { controls.current = { toggle, go, stop }; });
  useEffect(() => {
    const session = navigator.mediaSession;
    if (!session || !track) return;
    session.metadata = new MediaMetadata({ title: track.title, artist: track.artist || track.from, album: "A&D Arcade" });
    session.setActionHandler("play", () => controls.current.toggle());
    session.setActionHandler("pause", () => controls.current.toggle());
    session.setActionHandler("previoustrack", () => controls.current.go(-1));
    session.setActionHandler("nexttrack", () => controls.current.go(1));
    session.setActionHandler("stop", () => controls.current.stop());
    session.setActionHandler("seekto", details => { if (audio.current && details.seekTime != null) audio.current.currentTime = details.seekTime; });
  }, [track]);
  useEffect(() => { if (navigator.mediaSession) navigator.mediaSession.playbackState = playing ? "playing" : "paused"; }, [playing]);

  const edit = (keys: string[]) => onPlaylist(keys);
  function remove(key: string) {
    if (key === current) { if (queue.length > 1) go(1); else stop(); }
    edit(playlist.filter(item => item !== key));
  }
  function move(key: string, by: number) {
    const from = playlist.indexOf(key), to = from + by;
    if (to < 0 || to >= playlist.length) return;
    const next = [...playlist]; [next[from], next[to]] = [next[to], next[from]]; edit(next);
  }
  const grab = (event: ReactPointerEvent) => {
    if ((event.target as HTMLElement).closest("button")) return;
    drag.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };
  const moveWindow = (event: ReactPointerEvent) => { if (drag.current) setOffset({ x: event.clientX - drag.current.x, y: event.clientY - drag.current.y }); };
  const name = track ? (track.artist ? `${track.artist} - ${track.title}` : track.title) : "NO TAPE - PICK A SONG";
  const sleepLabel = sleep === "track" ? "END" : sleep ? clock(sleepLeft) : "OFF";

  return <section className={`music-player${playing ? " is-playing" : ""}${mini ? " is-mini" : ""}`} aria-label="Music player" style={mini ? undefined : { translate: `${offset.x}px ${offset.y}px` }}
    onKeyDown={event => {
      if ((event.target as HTMLElement).closest("input")) return;
      if (event.key === " " && !(event.target as HTMLElement).closest("button")) { event.preventDefault(); toggle(); }
      if (event.key === "ArrowRight" && audio.current) audio.current.currentTime += 5;
      if (event.key === "ArrowLeft" && audio.current) audio.current.currentTime -= 5;
    }}>
    <header className="mp-title" onPointerDown={grab} onPointerMove={moveWindow} onPointerUp={() => { drag.current = null; }}>
      <PixelIcon name="note" /><span>A&amp;D TAPE DECK</span><i aria-hidden="true" />
      <button onClick={() => setMini(true)} aria-label="Minimise music player"><PixelIcon name="minimize" /></button>
      <button onClick={onClose} aria-label="Close music player"><PixelIcon name="close" /></button>
    </header>

    {mini && <div className="mp-mini">
      <button className="mp-mini-open" onClick={() => setMini(false)} aria-label={`Open music player: ${track?.title ?? "no song"}`}>
        <canvas ref={tape} width={44} height={28} aria-hidden="true" />
        <span><b>{track?.title ?? "No song"}</b><small>{track ? track.artist || track.from : "open the deck"}</small></span>
      </button>
      <button className="mp-key is-main" onClick={toggle} aria-label={playing ? "Pause" : "Play"}><PixelIcon name={playing ? "pause" : "play"} /></button>
      <button className="mp-key" onClick={() => go(1)} aria-label="Next song"><PixelIcon name="next" /></button>
      <button className="mp-key" onClick={() => setMini(false)} aria-label="Expand music player"><PixelIcon name="expand" /></button>
      <i className="mp-mini-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </div>}

    <div className="mp-body">
      <div className="mp-screen">
        <div className="mp-screen-top">
          {!mini && <canvas ref={tape} className="mp-tape" width={44} height={28} aria-hidden="true" />}
          <div className="mp-time" aria-label={`${clock(time)} of ${clock(duration)}`}><span className="mp-state">{playing ? "▶" : time ? "‖" : "■"}</span>{clock(time)}</div>
          <ul className="mp-lamps" aria-label="Modes">
            <li className={shuffle ? "is-lit" : undefined}>SHUF</li>
            <li className={repeat !== "off" ? "is-lit" : undefined}>{repeat === "one" ? "RPT 1" : "RPT"}</li>
            <li className={sleep ? "is-lit" : undefined}>zZ {sleepLabel}</li>
            <li className="is-lit">{String(index + 1 || 0).padStart(2, "0")}/{String(queue.length).padStart(2, "0")}</li>
          </ul>
        </div>
        <div className="mp-marquee" aria-live="polite"><span key={name}>{name}&nbsp;&nbsp;***&nbsp;&nbsp;{name}&nbsp;&nbsp;***&nbsp;&nbsp;</span></div>
        <canvas ref={meter} className="mp-meter" width={BARS * 4 - 1} height={ROWS * 2} aria-hidden="true" />
      </div>

      <input className="mp-seek" type="range" min={0} max={duration || 1} step={.1} value={time} aria-label="Seek" disabled={!track} style={{ "--p": `${progress * 100}%` } as CSSProperties}
        onChange={event => { const element = audio.current; if (element) element.currentTime = +event.target.value; setTime(+event.target.value); }} />

      <div className="mp-keys">
        <button className="mp-key" onClick={() => go(-1)} aria-label="Previous song (or replay this one)"><PixelIcon name="prev" /></button>
        <button className="mp-key is-main" onClick={toggle} aria-label={playing ? "Pause" : "Play"}><PixelIcon name={playing ? "pause" : "play"} /></button>
        <button className="mp-key" onClick={stop} aria-label="Stop"><PixelIcon name="stop" /></button>
        <button className="mp-key" onClick={() => go(1)} aria-label="Next song"><PixelIcon name="next" /></button>
        <span className="mp-gap" />
        <button className="mp-key" onClick={() => { const element = audio.current; if (element) { element.currentTime = 0; wantPlay.current = true; void element.play().catch(() => {}); } }} aria-label="Replay this song"><PixelIcon name="replay" /></button>
        <button className="mp-key" aria-pressed={shuffle} onClick={() => setShuffle(value => !value)} aria-label="Shuffle"><PixelIcon name="shuffle" /></button>
        <button className="mp-key" aria-pressed={repeat !== "off"} onClick={() => setRepeat(value => value === "off" ? "all" : value === "all" ? "one" : "off")}
          aria-label={`Repeat: ${repeat === "one" ? "this song" : repeat === "all" ? "whole playlist" : "off"}`}><PixelIcon name="repeat" />{repeat === "one" && <b className="mp-badge">1</b>}</button>
        <button className="mp-key" aria-pressed={!!sleep} aria-expanded={sleepMenu} onClick={() => setSleepMenu(value => !value)} aria-label="Sleep timer"><PixelIcon name="moon" /></button>
      </div>

      {sleepMenu && <div className="mp-sleep" role="group" aria-label="Stop playing after">
        <span>SLEEP IN</span>
        {SLEEPS.map(minutes => <button key={minutes} onClick={() => { setSleep({ until: Date.now() + minutes * 60_000 }); setNow(Date.now()); setSleepMenu(false); }}>{minutes}m</button>)}
        <button aria-pressed={sleep === "track"} onClick={() => { setSleep("track"); setSleepMenu(false); }}>END OF SONG</button>
        <button aria-pressed={!sleep} onClick={() => { setSleep(null); setSleepMenu(false); }}>OFF</button>
      </div>}

      <div className="mp-volume">
        <button className="mp-key is-flat" onClick={() => setMuted(value => !value)} aria-label={muted ? "Unmute" : "Mute"}><PixelIcon name={muted || !volume ? "mute" : "volume"} /></button>
        <input type="range" min={0} max={1} step={.01} value={muted ? 0 : volume} aria-label="Volume" style={{ "--p": `${(muted ? 0 : volume) * 100}%` } as CSSProperties} onChange={event => { setVolume(+event.target.value); setMuted(false); }} />
      </div>
    </div>

    <div className="mp-tabs" role="tablist">
      <button role="tab" aria-selected={tab === "playlist"} onClick={() => setTab("playlist")}><PixelIcon name="list" />PLAYLIST <small>{queue.length}</small></button>
      <button role="tab" aria-selected={tab === "library"} onClick={() => setTab("library")}><PixelIcon name="tape" />LIBRARY <small>{library.length}</small></button>
    </div>
    {tab === "playlist" ? <ol className="mp-list">
      {queue.map((item, n) => <li key={item.key} aria-current={item.key === current ? "true" : undefined}>
        <button className="mp-row" onClick={() => { if (item.key === current) toggle(); else { wantPlay.current = true; setCurrent(item.key); } }}>
          <span className="mp-num">{item.key === current && playing ? <span className="mp-eq" aria-hidden="true"><i /><i /><i /></span> : String(n + 1).padStart(2, "0")}</span>
          <b>{item.title}</b><small>{item.artist || item.from}</small>
        </button>
        <span className="mp-row-tools">
          <button onClick={() => move(item.key, -1)} disabled={!n} aria-label={`Move ${item.title} up`}><PixelIcon name="up" /></button>
          <button onClick={() => move(item.key, 1)} disabled={n === queue.length - 1} aria-label={`Move ${item.title} down`}><PixelIcon name="down" /></button>
          <button onClick={() => remove(item.key)} aria-label={`Remove ${item.title} from the playlist`}><PixelIcon name="close" /></button>
        </span>
      </li>)}
      {!queue.length && <li className="mp-empty">The playlist is empty. Add songs from the LIBRARY tab, or from a drive in Files.</li>}
    </ol> : <ul className="mp-list">
      {library.map(item => { const added = playlist.includes(item.key); return <li key={item.key} aria-current={item.key === current ? "true" : undefined}>
        <button className="mp-row" onClick={() => { if (!added) edit([...playlist, item.key]); wantPlay.current = true; setCurrent(item.key); }}>
          <span className="mp-num"><PixelIcon name="note" /></span><b>{item.title}</b><small>{item.artist ? `${item.artist} · ` : ""}{item.from}</small>
        </button>
        <span className="mp-row-tools is-shown">
          <button onClick={() => edit(added ? playlist.filter(key => key !== item.key) : [...playlist, item.key])} aria-label={added ? `Remove ${item.title} from the playlist` : `Add ${item.title} to the playlist`}>
            <PixelIcon name={added ? "close" : "plus"} /></button>
        </span>
      </li>; })}
      {!library.length && <li className="mp-empty">No songs yet. Unlock a drive in Files, or record one with the Tape Deck on the CD-ROM.</li>}
    </ul>}

    <audio ref={audio} src={track?.src} preload="metadata" loop={repeat === "one"} onLoadStart={() => { setTime(0); setDuration(0); }}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
      onLoadedMetadata={event => setDuration(event.currentTarget.duration)} onEnded={ended} />
  </section>;
}
