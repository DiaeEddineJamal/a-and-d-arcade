// Downloads a ported game to this device (browser storage on disk) so it plays from the local copy.
// public/sw.js answers from the "offline:<id>" cache before the network. File lists: tools/offline-manifests.mjs.
import manifests from "./offline-files.json";

export type Download = { status: "none" | "downloading" | "paused" | "done"; done: number; total: number; message?: string };

const files = manifests as unknown as Record<string, [string, number][]>;
const store = (id: string) => `offline:${id}`;
const marker = (id: string) => `/offline-ready/${id}`;
const states = new Map<string, Download>();
const listeners = new Set<() => void>();
const running = new Map<string, AbortController>();
// downloads the network broke (not the ones she paused): they pick up again by themselves when the connection is back
const interrupted = new Map<string, string[]>();
const PIECE = 4 << 20, STALL_MS = 20_000, TRIES = 8;
let version = 0;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// jsDelivr refuses files it has not cached yet from repos over 50 MB (HTTP 403); GitHub's raw mirror has the same pinned commit
const mirror = (url: string) => url.replace(/^https:\/\/cdn\.jsdelivr\.net\/gh\/([^/]+)\/([^@/]+)@([^/]+)\//, "https://raw.githubusercontent.com/$1/$2/$3/");
// a file cut off halfway stays on disk as pieces, "<url>?ad-part=<from>-<to>", until the rest arrives
const partBase = (url: string) => { const href = new URL(url, location.href).href; return `${href}${href.includes("?") ? "&" : "?"}ad-part=`; };
const span = (key: string) => { const m = key.match(/[?&]ad-part=(\d+)-(\d+)$/); return m ? { from: +m[1], to: +m[2] } : null; };
/** the unbroken run of pieces from byte 0: anything after a gap is useless */
function piecesOf(keys: readonly Request[], url: string) {
  const base = partBase(url), found = keys.filter(key => key.url.startsWith(base)).map(request => ({ request, ...span(request.url)! })).sort((a, b) => a.from - b.from);
  const run: typeof found = [];
  for (const piece of found) if (piece.from === (run.at(-1)?.to ?? 0)) run.push(piece);
  return run;
}
// only binary files resume mid-file: a CDN may compress text files, and byte ranges of a compressed body do not line up
const near = (a: number, b: number) => Math.abs(a - b) <= Math.max(1024, b * .002);
const resumable = (url: string) => !/\.(m?js|json|css|html?|txt|xml|svg)(\?|$)/i.test(url);
const online = (signal: AbortSignal) => new Promise<void>(resolve => {
  addEventListener("online", () => resolve(), { once: true });
  signal.addEventListener("abort", () => resolve(), { once: true });
});
const types: Record<string, string> = { wasm: "application/wasm", js: "text/javascript", json: "application/json", css: "text/css", html: "text/html" };

export const canDownload = (id: string) => id in files;
export const totalBytes = (id: string) => (files[id] ?? []).reduce((sum, [, bytes]) => sum + bytes, 0);
export const megabytes = (bytes: number) => bytes >= 1e9 ? `${(bytes / 1e9).toFixed(2)} GB` : `${Math.round(bytes / 1e6)} MB`;
export const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
/** bumps on every download change: lets one component follow every game at once */
export const downloadsVersion = () => version;
export function getDownload(id: string) {
  if (!states.has(id)) states.set(id, { status: "none", done: 0, total: totalBytes(id) });
  return states.get(id)!;
}
function update(id: string, patch: Partial<Download>) {
  states.set(id, { ...getDownload(id), ...patch });
  version++;
  listeners.forEach(listener => listener());
}

export async function checkDownload(id: string) {
  if (running.has(id) || !canDownload(id)) return;
  const finished = await caches.match(marker(id)).catch(() => null);
  if (finished) return update(id, { status: "done", done: totalBytes(id) });
  // a download left unfinished in an earlier visit: count what is already on disk so Resume shows it
  if (!await caches.has(store(id)).catch(() => false)) return;
  const cache = await caches.open(store(id));
  const keys = await cache.keys(), saved = new Set(keys.map(request => request.url));
  const whole = files[id].reduce((sum, [url, bytes]) => sum + (saved.has(new URL(url, location.href).href) ? bytes : 0), 0);
  const halves = files[id].reduce((sum, [url]) => sum + (piecesOf(keys, url).at(-1)?.to ?? 0), 0);
  update(id, { status: "paused", done: whole + halves });
}

/** `pages`: same-origin pages the game needs (its wrapper and styles), kept in the shell cache */
export async function startDownload(id: string, pages: string[]) {
  if (running.has(id) || !canDownload(id)) return;
  const abort = new AbortController();
  running.set(id, abort);
  const total = totalBytes(id);
  try {
    await navigator.serviceWorker?.ready;
    await navigator.storage?.persist?.().catch(() => false);
    const cache = await caches.open(store(id));
    const keys = await cache.keys(), saved = new Set(keys.map(request => request.url));
    const todo = files[id].filter(([url]) => !saved.has(new URL(url, location.href).href));
    // files already whole, plus the first part of any file that was cut off last time
    let done = total - todo.reduce((sum, [, bytes]) => sum + bytes, 0) + todo.reduce((sum, [url]) => sum + (piecesOf(keys, url).at(-1)?.to ?? 0), 0);
    const { quota, usage = 0 } = await navigator.storage?.estimate?.() ?? {};
    if (quota && quota - usage < total - done) throw new Error(`Not enough free space: this game needs ${megabytes(total - done)} more.`);
    interrupted.delete(id);
    update(id, { status: "downloading", done, message: undefined });
    await (await caches.open("shell")).addAll(pages);

    let shown = 0, troubled = false;
    const progress = (bytes: number) => {
      done += bytes;
      if (troubled && bytes > 0) { troubled = false; update(id, { message: undefined }); }
      if (performance.now() - shown > 250) { shown = performance.now(); update(id, { done: Math.min(done, total) }); }
    };
    const fetchFile = async ([url, bytes]: [string, number]) => {
      const pieces = resumable(url) ? piecesOf(await cache.keys(), url) : [];
      // canRange: pieces from an earlier visit say yes; otherwise the first response decides (see below)
      let onDisk = pieces.at(-1)?.to ?? 0, ranged = false, canRange = pieces.length > 0;
      let buffer: Uint8Array<ArrayBuffer>[] = [], buffered = 0;
      // what arrived so far goes to disk as one more piece, so a retry (even after closing the tab) starts after it
      const flush = async () => {
        if (!buffered) return;
        const request = new Request(`${partBase(url)}${onDisk}-${onDisk + buffered}`);
        await cache.put(request, new Response(new Blob(buffer)));
        pieces.push({ request, from: onDisk, to: onDisk + buffered });
        onDisk += buffered; buffer = []; buffered = 0;
      };
      const forget = async () => { await Promise.all(pieces.map(piece => cache.delete(piece.request))); pieces.length = 0; progress(-onDisk); onDisk = 0; };
      for (let attempt = 1; ; attempt++) {
        const attemptAbort = new AbortController(), cancel = () => attemptAbort.abort("cancel");
        abort.signal.addEventListener("abort", cancel);
        let stall: ReturnType<typeof setTimeout> | undefined;
        // a connection that stops sending without failing: give up on this attempt and try again from here
        const watch = () => { clearTimeout(stall); stall = setTimeout(() => attemptAbort.abort("stalled"), STALL_MS); };
        try {
          const source = attempt % 2 ? url : mirror(url);
          watch();
          ranged = ranged || onDisk > 0;
          const response = await fetch(source, { signal: attemptAbort.signal, headers: onDisk ? { range: `bytes=${onDisk}-` } : undefined });
          if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
          const length = Number(response.headers.get("content-length"));
          if (onDisk && (response.status !== 206 || !near(length, bytes - onDisk))) {
            // the server cannot hand over just the rest of this file (416, the whole file, or a compressed remainder):
            // it starts over cleanly, which does not count as a failed try
            await forget(); ranged = false; canRange = false;
            if (response.status !== 200) { attempt--; continue; }
          }
          // only a reply that is the file byte for byte (not compressed on the way) can be resumed by byte offset
          if (!onDisk) canRange = resumable(url) && near(length, bytes);
          const reader = (response.body as ReadableStream<Uint8Array<ArrayBuffer>>).getReader();
          for (;;) {
            const { value, done: end } = await reader.read();
            if (end) break;
            watch();
            buffer.push(value); buffered += value.length; progress(value.length);
            if (canRange && buffered >= PIECE) await flush();
          }
          clearTimeout(stall);
          const parts = await Promise.all(pieces.map(piece => cache.match(piece.request).then(found => found!.blob())));
          const file = new Blob([...parts, ...buffer]);
          // a resumed file must come out the size the list says; if not, the pieces did not line up: fetch it whole
          if (ranged && Math.abs(file.size - bytes) > 1024) { buffer = []; buffered = 0; await forget(); ranged = false; throw new Error("resumed file did not match"); }
          // the body is already decoded, so keep only the type: a stale Content-Encoding would confuse loaders
          // stored under the original URL, which is what the game asks for; the mirror labels everything text/plain
          const type = source === url && !ranged ? response.headers.get("content-type") : types[url.split(".").pop()!];
          await cache.put(url, new Response(file, { headers: { "content-type": type ?? "application/octet-stream" } }));
          progress(bytes - file.size);   // the list's size and the real one can differ slightly
          await Promise.all(pieces.map(piece => cache.delete(piece.request)));
          return;
        } catch (error) {
          clearTimeout(stall);
          // keep every byte that arrived; text files are small and simply start over
          if (canRange) await flush().catch(() => {}); else { progress(-buffered); buffer = []; buffered = 0; }
          if (abort.signal.aborted) throw error;
          if (!navigator.onLine) {
            troubled = true;
            update(id, { message: `You are offline. ${megabytes(done)} is saved; the download continues by itself when the connection is back.` });
            await online(abort.signal);
            if (abort.signal.aborted) throw error;
            attempt = 0;
            continue;
          }
          if (attempt >= TRIES) throw error;
          const delay = Math.min(30_000, 2000 * 2 ** (attempt - 1));
          troubled = true;
          update(id, { message: `The connection ${attemptAbort.signal.reason === "stalled" ? "is too slow" : "dropped"}. Retrying in ${delay / 1000}s (try ${attempt + 1} of ${TRIES}); ${megabytes(done)} is saved and will not download again.` });
          await Promise.race([wait(delay), online(abort.signal).then(() => wait(250))]);
          if (abort.signal.aborted) throw error;
        } finally {
          abort.signal.removeEventListener("abort", cancel);
        }
      }
    };
    const worker = async () => { for (let item; (item = todo.shift());) await fetchFile(item); };
    await Promise.all(Array.from({ length: 6 }, worker));
    await cache.put(marker(id), new Response("ok"));
    update(id, { status: "done", done: total });
  } catch (error) {
    if (abort.signal.reason === "removed") return;
    if (abort.signal.reason !== "paused") interrupted.set(id, pages);
    update(id, {
      status: "paused",
      message: abort.signal.reason === "paused" ? undefined : `The download stopped (${error instanceof Error ? error.message : error}). Nothing is lost: ${megabytes(getDownload(id).done)} is saved. Press Retry to continue from there; it also continues by itself when the connection comes back.`,
    });
  } finally {
    running.delete(id);
  }
}

export const pauseDownload = (id: string) => running.get(id)?.abort("paused");
if (typeof window !== "undefined") addEventListener("online", () => interrupted.forEach((pages, id) => void startDownload(id, pages)));

export async function removeDownload(id: string) {
  running.get(id)?.abort("removed");
  interrupted.delete(id);
  await caches.delete(store(id)).catch(() => {});
  update(id, { status: "none", done: 0, message: undefined });
}
