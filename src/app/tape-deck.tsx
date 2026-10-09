"use client";
import { useState, type FormEvent } from "react";
import PixelIcon from "./pixel-icon";
import { recordFromYoutube, saveCopy, saveTape, type Tape } from "./tapes";

type State = { step: "idle" } | { step: "recording"; share: number | null } | { step: "done"; tape: Tape } | { step: "error"; message: string };

/** TapeDeck.exe on the CD-ROM: paste a YouTube link, get the song kept on this PC and playable from the Tape Deck player */
export default function TapeDeck({ onPlay, onQueue, onClose }: { onPlay: (tape: Tape) => void; onQueue: (tape: Tape) => void; onClose: () => void }) {
  const [link, setLink] = useState("");
  const [copy, setCopy] = useState(true);
  const [state, setState] = useState<State>({ step: "idle" });
  const busy = state.step === "recording";

  async function record(event: FormEvent) {
    event.preventDefault();
    if (busy || !link.trim()) return;
    setState({ step: "recording", share: null });
    try {
      const tape = await recordFromYoutube(link, share => setState({ step: "recording", share }));
      if (copy) saveCopy(tape);
      setState({ step: "done", tape }); setLink("");
    } catch (error) { setState({ step: "error", message: (error as Error).message }); }
  }
  async function fromFile(file: File | undefined) {
    if (!file) return;
    const [artist, title] = file.name.replace(/\.[^.]+$/, "").includes(" - ") ? file.name.replace(/\.[^.]+$/, "").split(/ - (.*)/) : ["", file.name.replace(/\.[^.]+$/, "")];
    setState({ step: "done", tape: await saveTape({ title, artist, type: file.type || "audio/mpeg", blob: file }) });
  }
  async function paste() { try { setLink((await navigator.clipboard.readText()).trim()); } catch {} }

  return <article className="tape-deck" role="dialog" aria-labelledby="tape-deck-title">
    <header><PixelIcon name="tape" /><span id="tape-deck-title">TapeDeck.exe — YouTube to tape</span>
      <button onClick={onClose} aria-label="Close Tape Deck"><PixelIcon name="close" /></button></header>
    <div className="tape-deck-body">
      <div className={`tape-deck-art${busy ? " is-rolling" : ""}`} aria-hidden="true"><i /><i /></div>
      <form onSubmit={record}>
        <label htmlFor="tape-link">Paste a YouTube link and press REC. The song is saved on this PC, inside this CD-ROM, ready for your playlist.</label>
        <div className="tape-deck-input">
          <input id="tape-link" type="url" inputMode="url" placeholder="https://youtu.be/…" value={link} onChange={event => setLink(event.target.value)} disabled={busy} autoFocus autoComplete="off" />
          <button type="button" onClick={paste} disabled={busy}>PASTE</button>
        </div>
        <label className="tape-deck-check"><input type="checkbox" checked={copy} onChange={event => setCopy(event.target.checked)} />Also save a copy to my Downloads folder</label>
        <button className="tape-deck-rec" disabled={busy || !link.trim()}><PixelIcon name="rec" />{busy ? "RECORDING…" : "REC"}</button>
      </form>
      {state.step === "recording" && <div className="tape-deck-status" role="status">
        <p>{state.share === null ? "Asking YouTube for the song… (up to a minute)" : `Saving to this PC… ${Math.round(state.share * 100)}%`}</p>
        <div className={`tape-deck-bar${state.share === null ? " is-waiting" : ""}`}><span style={{ width: `${(state.share ?? 0) * 100}%` }} /></div>
      </div>}
      {state.step === "done" && <div className="tape-deck-status is-done" role="status">
        <p>Saved <b>{state.tape.title}</b> to the CD-ROM.</p>
        <div className="tape-deck-actions">
          <button onClick={() => onPlay(state.tape)}><PixelIcon name="play" />PLAY NOW</button>
          <button onClick={() => { onQueue(state.tape); onClose(); }}><PixelIcon name="plus" />ADD TO PLAYLIST</button>
        </div>
      </div>}
      {state.step === "error" && <p className="tape-deck-status is-error" role="alert">{state.message}</p>}
      <label className="tape-deck-file">…or add a song file from this PC<input type="file" accept="audio/*" onChange={event => void fromFile(event.target.files?.[0])} /></label>
    </div>
  </article>;
}
