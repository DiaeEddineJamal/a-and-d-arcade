// Songs recorded with the Tape Deck app (CD-ROM drive): the audio files are kept on this PC, in the browser's IndexedDB.
export type Tape = { id: string; title: string; artist: string; type: string; added: number; blob: Blob };

const SERVER = (process.env.NEXT_PUBLIC_RACING_SERVER_URL ?? "http://localhost:3000").replace(/\/$/, "");
const listeners = new Set<() => void>();
let cached: Tape[] | null = null;

function db() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const open = indexedDB.open("ad-tapes", 1);
    open.onupgradeneeded = () => open.result.createObjectStore("tapes", { keyPath: "id" });
    open.onsuccess = () => resolve(open.result);
    open.onerror = () => reject(open.error);
  });
}
async function run<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>) {
  const base = await db();
  return new Promise<T>((resolve, reject) => {
    const request = work(base.transaction("tapes", mode).objectStore("tapes"));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }).finally(() => base.close());
}
const changed = () => { cached = null; listeners.forEach(listener => listener()); };

export const subscribeTapes = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export async function listTapes() {
  cached ??= (await run<Tape[]>("readonly", store => store.getAll()).catch(() => [])).sort((a, b) => a.added - b.added);
  return cached;
}
export async function saveTape(tape: Omit<Tape, "id" | "added">) {
  const saved = { ...tape, id: crypto.randomUUID(), added: Date.now() };
  await run("readwrite", store => store.put(saved));
  void navigator.storage?.persist?.().catch(() => {});
  changed();
  return saved;
}
export async function removeTape(id: string) { await run("readwrite", store => store.delete(id)); changed(); }

/** asks the arcade server to fetch the song's audio from a YouTube link; the error text is fit to show */
export async function recordFromYoutube(link: string, onProgress: (share: number | null) => void) {
  const response = await fetch(`${SERVER}/api/yt?url=${encodeURIComponent(link)}`).catch(() => null);
  if (!response) throw new Error("Could not reach the arcade server. It may be waking up: try again in a minute.");
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? `The server said ${response.status}.`);
  const total = Number(response.headers.get("content-length")) || 0, chunks: Uint8Array<ArrayBuffer>[] = [];
  const reader = response.body!.getReader();
  for (let done = 0; ;) {
    const { value, done: end } = await reader.read();
    if (end) break;
    chunks.push(value); done += value.length;
    onProgress(total ? done / total : null);
  }
  const type = response.headers.get("content-type") ?? "audio/mp4";
  const header = (name: string) => decodeURIComponent(response.headers.get(name) ?? "");
  return saveTape({ title: header("x-track-title") || "Untitled tape", artist: header("x-track-artist"), type, blob: new Blob(chunks, { type }) });
}

/** "Artist - Title.m4a" into the Downloads folder */
export function saveCopy(tape: Tape) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(tape.blob);
  link.download = `${tape.artist ? `${tape.artist} - ` : ""}${tape.title}.${tape.type.includes("webm") ? "webm" : "m4a"}`.replace(/[\\/:*?"<>|]+/g, "");
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 10_000);
}
