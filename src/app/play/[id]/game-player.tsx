"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { gameSupport } from "../../game-support.mjs";
import { canDownload, checkDownload, getDownload, megabytes, pauseDownload, removeDownload, startDownload, subscribe } from "../../offline";

type PlayerGame = { id: string; name: [string, string]; source: string; download: string; creator: string; notice?: string; launch?: "embed" | "tab"; broken?: boolean; host?: string; specs: { label: string; value: string }[] };

export default function GamePlayer({ game }: { game: PlayerGame }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [started, setStarted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState("");
  const title = game.name.join(" ").trim();
  const support = gameSupport(game);
  // a web port lives on its maker's site: shown in our player, or in its own tab when the site refuses to be embedded
  const web = /^https?:/.test(game.source);
  const newTab = web && game.launch === "tab";

  const [immersive, setImmersive] = useState(false);
  // a copy downloaded to this device plays without the network (src/app/offline.ts, public/sw.js)
  const local = useSyncExternalStore(subscribe, () => getDownload(game.id), () => getDownload(game.id));
  useEffect(() => { void checkDownload(game.id); }, [game.id]);

  // While immersive, drop the CRT layers and let Escape bring the toolbar back.
  useEffect(() => {
    document.documentElement.classList.toggle("game-immersive", immersive);
    if (!immersive) return;
    const exit = (event: KeyboardEvent) => { if (event.key === "Escape") setImmersive(false); };
    addEventListener("keydown", exit);
    return () => { removeEventListener("keydown", exit); document.documentElement.classList.remove("game-immersive"); };
  }, [immersive]);

  async function fullscreen() {
    const target = frame.current;
    setMessage("");
    try {
      if (!target?.requestFullscreen) throw new Error("Fullscreen unavailable");
      // some browsers and embedded views never answer the request, so don't wait forever
      await Promise.race([target.requestFullscreen({ navigationUI: "hide" }), new Promise((_, reject) => setTimeout(reject, 1200))]);
    } catch {
      // iPhone Safari and locked-down browsers: fill the whole window instead
      setImmersive(true);
    }
    target?.focus();
  }

  return (
    <main className={`game-player${immersive ? " is-immersive" : ""}`}>
      {immersive && <button className="immersive-exit" onClick={() => setImmersive(false)}>EXIT FULL SCREEN <kbd>Esc</kbd></button>}
      <nav className="player-toolbar" aria-label="Game controls">
        <Link href="/collection">← COLLECTION</Link>
        <span>{title}</span>
        <button disabled={!started} onClick={() => { setAttempt(attempt + 1); setMessage(""); }}>RELOAD</button>
        <button disabled={!started} onClick={fullscreen}>FULL SCREEN ↗</button>
        {web && <a href={game.source} target="_blank" rel="noopener noreferrer">NEW TAB ↗</a>}
      </nav>
      <p className="player-message" role="status">{message}</p>
      {started ? (
        <iframe key={attempt} ref={frame} src={game.source} title={title} allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write; cross-origin-isolated; xr-spatial-tracking" allowFullScreen onLoad={() => frame.current?.focus()} />
      ) : (
        <section className="player-start">
          <p className="eyebrow">{web ? "WEB PORT" : "BROWSER EDITION"} · {game.creator}</p>
          <h1>{title}</h1>
          <div className={`device-badge device-${support.devices}`}>{support.label}</div>
          {canDownload(game.id) && <div className="device-badge is-download">↓ Downloadable to your PC · plays offline</div>}
          {web && <div className="device-badge is-online">{game.broken ? "✕ Not working right now" : `● Online only · not downloadable`}</div>}
          <p className="device-note">{support.note}</p>
          <p>{web
            ? `It runs on ${game.host}, the site of the people who ported it, so it needs an internet connection and cannot be downloaded to this device.${newTab ? " It opens in its own tab." : ""}`
            : local.status === "done" ? "Installed on this device: it plays from the downloaded copy, no internet needed." : `${game.download}. The game downloads after you press play, or download it first and play it later from this device.`}</p>
          {game.notice && <p>{game.notice}</p>}
          {!newTab && <p>Keyboard and mouse recommended. Use Full Screen after launch; Escape returns to this player.</p>}
          {newTab
            ? <a className="retro-button" href={game.source} target="_blank" rel="noopener noreferrer">{game.broken ? "TRY IT ANYWAY" : "PLAY IN A NEW TAB"} <b>↗</b></a>
            : <button className="retro-button" onClick={() => setStarted(true)}>PLAY NOW <b>↗</b></button>}
          {web && !newTab && <a className="retro-button is-quiet" href={game.source} target="_blank" rel="noopener noreferrer">OPEN IN ITS OWN TAB <b>↗</b></a>}
          {canDownload(game.id) && <div className="local-copy">
            {local.status === "done"
              ? <button className="retro-button is-quiet" onClick={() => { if (confirm(`Remove ${title} from this device? You will need to download ${megabytes(local.total)} again to play it offline.`)) void removeDownload(game.id); }}>INSTALLED ON THIS DEVICE · REMOVE <b>✓</b></button>
              : local.status === "downloading"
                ? <button className="retro-button is-quiet" onClick={() => pauseDownload(game.id)}>PAUSE DOWNLOAD <b>❚❚</b></button>
                : <button className="retro-button is-quiet" onClick={() => startDownload(game.id, [`/play/${game.id}`, game.source, "/retro-player.css", "/ad-boot-logo.svg"])}>
                    {local.status === "paused" ? `${local.message ? "RETRY" : "RESUME"} FROM ${megabytes(local.done)} OF ${megabytes(local.total)}` : `DOWNLOAD TO THIS DEVICE · ${megabytes(local.total)}`} <b>{local.status === "paused" && local.message ? "↻" : "↓"}</b>
                  </button>}
            {(local.status === "downloading" || local.status === "paused") && <>
              <progress value={local.done} max={local.total} aria-label="Download progress" />
              <p>{megabytes(local.done)} of {megabytes(local.total)}{local.status === "downloading" ? " · keep this tab open; you can browse the arcade meanwhile" : " · paused"}</p>
            </>}
            {local.message && <p role="alert">{local.message}</p>}
            {local.status === "paused" && <button className="text-button" onClick={() => removeDownload(game.id)}>Delete the partial download</button>}
          </div>}
        </section>
      )}
    </main>
  );
}
