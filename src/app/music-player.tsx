"use client";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronUp, Minus, Music, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";

/** "01 - Artist - Title.mp3" -> { artist, title } */
export const trackName = (src: string) => {
  const parts = decodeURIComponent(src.split("/").pop() ?? "").replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").replace(/^\d+\s*[-.)]\s*/, "").split(" - ");
  return parts.length > 1 ? { artist: parts[0].trim(), title: parts.slice(1).join(" - ").trim() } : { artist: "", title: parts[0].trim() };
};
const clock = (seconds: number) => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}` : "0:00";
const BARS = 18, CELLS = 9;
// one Web Audio graph per <audio>: an element can only ever be wired to a single source node
const graphs = new WeakMap<HTMLAudioElement, { context: AudioContext; analyser: AnalyserNode }>();
const wire = (element: HTMLAudioElement) => {
  let graph = graphs.get(element);
  if (!graph) {
    const context = new AudioContext(), analyser = context.createAnalyser();
    analyser.fftSize = 512; analyser.smoothingTimeConstant = .72;
    context.createMediaElementSource(element).connect(analyser).connect(context.destination);
    graphs.set(element, graph = { context, analyser });
  }
  graph.context.resume().catch(() => {});
  return graph;
};

/** A cassette Walkman in the desktop's language: tape reels that wind, an LCD and a stepped spectrum. */
export default function MusicPlayer({ tracks, start, label, onClose }: { tracks: string[]; start: number; label: string; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(.8);
  const [muted, setMuted] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // minimised: a slim bar above the dock, so the music keeps going while she plays or browses
  const [mini, setMini] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const track = tracks[index], { artist, title } = trackName(track);
  const progress = duration ? time / duration : 0;

  useEffect(() => { const element = audio.current; if (element) { element.volume = volume; element.muted = muted; } }, [volume, muted]);
  // opened from a click in Files, so the tape may start rolling right away (autoPlay), through the meter
  useEffect(() => {
    const element = audio.current!, { context } = wire(element);
    return () => { element.pause(); setTimeout(() => { if (!element.isConnected) context.close().catch(() => {}); }); };
  }, []);

  // the spectrum: lit cells climb and fall in steps, like a hi-fi deck's LED meter
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const peaks = new Float32Array(BARS), data = new Uint8Array(256);
    const draw = () => {
      frame = requestAnimationFrame(draw);
      const c = canvas.current, element = audio.current;
      if (!c || !element) return;
      const { analyser } = wire(element);
      const g = c.getContext("2d")!;
      analyser.getByteFrequencyData(data);
      g.clearRect(0, 0, c.width, c.height);
      const w = c.width / BARS, h = c.height / CELLS;
      for (let bar = 0; bar < BARS; bar++) {
        // low frequencies get more room, the way ears hear them
        const from = Math.floor((bar / BARS) ** 1.6 * 160), to = Math.max(from + 1, Math.floor(((bar + 1) / BARS) ** 1.6 * 160));
        let sum = 0; for (let i = from; i < to; i++) sum += data[i];
        const level = Math.round((sum / (to - from) / 255) * CELLS);
        peaks[bar] = Math.max(level, peaks[bar] - .15);
        for (let cell = 0; cell < CELLS; cell++) {
          const lit = cell < level, peak = cell === Math.ceil(peaks[bar]) - 1;
          g.fillStyle = lit || peak ? (cell >= CELLS - 2 ? "#e2604a" : "#c8f0a0") : "#c8f0a014";
          g.fillRect(bar * w + 1, c.height - (cell + 1) * h + 1, w - 2, h - 2);
        }
      }
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  function toggle() {
    const element = audio.current;
    if (!element) return;
    wire(element);   // a browser that blocked the autoplay lets Web Audio start from this click
    if (element.paused) element.play().catch(() => setPlaying(false)); else element.pause();
  }
  const step = (by: number) => setIndex(value => (value + by + tracks.length) % tracks.length);
  const grab = (event: ReactPointerEvent) => {
    if ((event.target as HTMLElement).closest("button")) return;
    drag.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };
  const move = (event: ReactPointerEvent) => { if (drag.current) setOffset({ x: event.clientX - drag.current.x, y: event.clientY - drag.current.y }); };

  // tape winds from the left spool onto the right one as the song plays
  const reel = (share: number) => ({ "--tape": `${15 + share * 13}px` }) as CSSProperties;

  return <section className={`music-player${playing ? " is-playing" : ""}${mini ? " is-mini" : ""}`} aria-label="Music player" style={mini ? undefined : { translate: `${offset.x}px ${offset.y}px` }}
    onKeyDown={event => { if (event.key === " " && !(event.target as HTMLElement).closest("button, input")) { event.preventDefault(); toggle(); } }}>
    <header onPointerDown={grab} onPointerMove={move} onPointerUp={() => { drag.current = null; }}>
      <Music /><span>Walkman — {label}</span>
      <button className="win-btn ghost" onClick={() => setMini(true)} aria-label="Minimise music player"><Minus /></button>
      <button className="win-btn" onClick={onClose} aria-label="Close music player"><X /></button>
    </header>
    {mini && <div className="mini-bar">
      <button className="mini-open" onClick={() => setMini(false)} aria-label={`Open music player: ${title}`}>
        <i className="mini-reel" aria-hidden="true"><span /></i>
        <span className="mini-text"><b>{title}</b><small>{artist || label}</small></span>
      </button>
      <button className="mini-btn mini-play" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause /> : <Play />}</button>
      <button className="mini-btn" onClick={() => setMini(false)} aria-label="Expand music player"><ChevronUp /></button>
      <button className="mini-btn" onClick={onClose} aria-label="Close music player"><X /></button>
      <i className="mini-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </div>}
    <div className="deck">
      <div className="cassette" aria-hidden="true">
        <div className="cassette-label"><b>{title}</b><span>{artist || "for A, on repeat"}</span></div>
        <div className="cassette-window">
          <i className="reel" style={reel(1 - progress)}><span /></i>
          <i className="tape-run" />
          <i className="reel" style={reel(progress)}><span /></i>
        </div>
        <div className="cassette-foot"><i /><i /><i /><i /></div>
      </div>
      <div className="lcd">
        <div className="lcd-row"><span>{String(index + 1).padStart(2, "0")}/{String(tracks.length).padStart(2, "0")}</span><span className="lcd-state">{playing ? "▶ PLAY" : "‖ PAUSE"}</span></div>
        <div className="lcd-marquee"><span key={track}>{artist ? `${artist} — ${title}` : title}&nbsp;&nbsp;★&nbsp;&nbsp;{artist ? `${artist} — ${title}` : title}&nbsp;&nbsp;★&nbsp;&nbsp;</span></div>
        <canvas ref={canvas} width={216} height={54} />
        <div className="lcd-row"><span>{clock(time)}</span><span>-{clock(duration - time)}</span></div>
      </div>
      <input className="seek" type="range" min={0} max={duration || 1} step={.1} value={time} aria-label="Seek" style={{ "--p": `${progress * 100}%` } as CSSProperties}
        onChange={event => { const element = audio.current; if (element) element.currentTime = +event.target.value; setTime(+event.target.value); }} />
      <div className="transport">
        <button onClick={() => step(-1)} aria-label="Previous track"><SkipBack /></button>
        <button className="play" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause /> : <Play />}</button>
        <button onClick={() => step(1)} aria-label="Next track"><SkipForward /></button>
        <span className="volume">
          <button onClick={() => setMuted(value => !value)} aria-label={muted ? "Unmute" : "Mute"}>{muted || !volume ? <VolumeX /> : <Volume2 />}</button>
          <input type="range" min={0} max={1} step={.01} value={muted ? 0 : volume} aria-label="Volume" style={{ "--p": `${(muted ? 0 : volume) * 100}%` } as CSSProperties} onChange={event => { setVolume(+event.target.value); setMuted(false); }} />
        </span>
      </div>
    </div>
    {tracks.length > 1 && <ol className="playlist">
      {tracks.map((src, n) => { const name = trackName(src); return <li key={src}><button aria-current={n === index ? "true" : undefined} onClick={() => { if (n === index) toggle(); else setIndex(n); }}>
        <span className="eq" aria-hidden="true"><i /><i /><i /></span><b>{name.title}</b><small>{name.artist}</small>
      </button></li>; })}
    </ol>}
    <audio ref={audio} src={track} preload="metadata" autoPlay loop={tracks.length === 1} onLoadStart={() => { setTime(0); setDuration(0); }}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
      onLoadedMetadata={event => setDuration(event.currentTarget.duration)} onEnded={() => { if (tracks.length > 1) step(1); else setPlaying(false); }} />
  </section>;
}
