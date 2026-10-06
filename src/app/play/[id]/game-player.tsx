"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gameSupport } from "../../game-support.mjs";

type PlayerGame = { name: [string, string]; source: string; download: string; creator: string; notice?: string; specs: { label: string; value: string }[] };

export default function GamePlayer({ game }: { game: PlayerGame }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [started, setStarted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState("");
  const title = game.name.join(" ").trim();
  const support = gameSupport(game);

  const [immersive, setImmersive] = useState(false);

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
      </nav>
      <p className="player-message" role="status">{message}</p>
      {started ? (
        <iframe key={attempt} ref={frame} src={game.source} title={title} allow="autoplay; fullscreen; gamepad" allowFullScreen onLoad={() => frame.current?.focus()} />
      ) : (
        <section className="player-start">
          <p className="eyebrow">BROWSER EDITION · {game.creator}</p>
          <h1>{title}</h1>
          <div className={`device-badge device-${support.devices}`}>{support.label}</div>
          <p className="device-note">{support.note}</p>
          <p>{game.download}. The game downloads after you press play.</p>
          {game.notice && <p>{game.notice}</p>}
          <p>Keyboard and mouse recommended. Use Full Screen after launch; Escape returns to this player.</p>
          <button className="retro-button" onClick={() => setStarted(true)}>PLAY NOW <b>↗</b></button>
        </section>
      )}
    </main>
  );
}
