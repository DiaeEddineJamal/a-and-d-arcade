"use client";
import { useState, type FormEvent } from "react";
import { CassetteTape, Circle, ClipboardPaste, Link2, Play, Plus, X } from "lucide-react";
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
    const name = file.name.replace(/\.[^.]+$/, "");
    const [artist, title] = name.includes(" - ") ? name.split(/ - (.*)/) : ["", name];
    setState({ step: "done", tape: await saveTape({ title, artist, type: file.type || "audio/mpeg", blob: file }) });
  }
  async function paste() { try { setLink((await navigator.clipboard.readText()).trim()); } catch {} }

  return <article className="tape-deck" role="dialog" aria-labelledby="tape-deck-title">
    <header><i aria-hidden="true" /><span id="tape-deck-title"><CassetteTape />TapeDeck.exe</span><i aria-hidden="true" />
      <button className="win-btn" onClick={onClose} aria-label="Close Tape Deck"><X /></button></header>
    <div className="tape-deck-screen" role="status">
      {state.step === "idle" && <p>&gt; READY. Paste a YouTube link and press REC.</p>}
      {state.step === "recording" && <>
        <p>&gt; {state.share === null ? "Asking YouTube for the song… (up to a minute)" : `Saving to this PC… ${Math.round(state.share * 100)}%`}</p>
        <div className={`tape-deck-bar${state.share === null ? " is-waiting" : ""}`}><span style={{ width: `${(state.share ?? 0) * 100}%` }} /></div>
      </>}
      {state.step === "done" && <p>&gt; Saved <b>{state.tape.title}</b> to the CD-ROM.</p>}
      {state.step === "error" && <p className="is-error">&gt; {state.message}</p>}
    </div>
    <div className="tape-deck-body">
      <form onSubmit={record}>
        <p>The song is kept on this PC, inside this CD-ROM, ready for your playlist.</p>
        <div className="tape-deck-row">
          <label className="field"><Link2 /><input id="tape-link" type="url" inputMode="url" placeholder="https://youtu.be/…" aria-label="YouTube link" value={link} onChange={event => setLink(event.target.value)} disabled={busy} autoFocus autoComplete="off" /></label>
          <button type="button" className="tape-deck-btn" onClick={paste} disabled={busy}><ClipboardPaste />Paste</button>
        </div>
        <label className="tape-deck-check"><input type="checkbox" checked={copy} onChange={event => setCopy(event.target.checked)} />Also save a copy to my Downloads folder</label>
        <button className="tape-deck-btn is-rec" disabled={busy || !link.trim()}><Circle />{busy ? "Recording…" : "REC"}</button>
      </form>
      {state.step === "done" && <div className="tape-deck-actions">
        <button className="tape-deck-btn" onClick={() => onPlay(state.tape)}><Play />Play now</button>
        <button className="tape-deck-btn" onClick={() => { onQueue(state.tape); onClose(); }}><Plus />Add to playlist</button>
      </div>}
      <label className="tape-deck-file">…or add a song file from this PC<input type="file" accept="audio/*" onChange={event => void fromFile(event.target.files?.[0])} /></label>
    </div>
  </article>;
}
