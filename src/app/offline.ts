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
let version = 0;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// jsDelivr refuses files it has not cached yet from repos over 50 MB (HTTP 403); GitHub's raw mirror has the same pinned commit
const mirror = (url: string) => url.replace(/^https:\/\/cdn\.jsdelivr\.net\/gh\/([^/]+)\/([^@/]+)@([^/]+)\//, "https://raw.githubusercontent.com/$1/$2/$3/");
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
  const saved = new Set((await cache.keys()).map(request => request.url));
  update(id, { status: "paused", done: files[id].reduce((sum, [url, bytes]) => sum + (saved.has(new URL(url, location.href).href) ? bytes : 0), 0) });
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
    const saved = new Set((await cache.keys()).map(request => request.url));
    const todo = files[id].filter(([url]) => !saved.has(new URL(url, location.href).href));
    let done = total - todo.reduce((sum, [, bytes]) => sum + bytes, 0);
    const { quota, usage = 0 } = await navigator.storage?.estimate?.() ?? {};
    if (quota && quota - usage < total - done) throw new Error(`Not enough free space: this game needs ${megabytes(total - done)} more.`);
    update(id, { status: "downloading", done, message: undefined });
    await (await caches.open("shell")).addAll(pages);

    let shown = 0;
    const progress = (bytes: number) => {
      done += bytes;
      if (performance.now() - shown > 250) { shown = performance.now(); update(id, { done: Math.min(done, total) }); }
    };
    const fetchFile = async ([url, bytes]: [string, number]) => {
      for (let attempt = 1; ; attempt++) {
        let received = 0;
        try {
          const source = attempt % 2 ? url : mirror(url);
          const response = await fetch(source, { signal: abort.signal });
          if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
          const counted = response.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({ transform(chunk, controller) { received += chunk.length; progress(chunk.length); controller.enqueue(chunk); } }));
          // the body is already decoded, so keep only the type: a stale Content-Encoding would confuse loaders
          // stored under the original URL, which is what the game asks for; the mirror labels everything text/plain
          const type = source === url ? response.headers.get("content-type") : types[url.split(".").pop()!];
          await cache.put(url, new Response(counted, { headers: { "content-type": type ?? "application/octet-stream" } }));
          progress(bytes - received);   // the list's size and the real one can differ slightly
          return;
        } catch (error) {
          progress(-received);
          if (abort.signal.aborted || attempt === 6) throw error;
          await wait(1500 * (attempt >> 1));   // alternate CDN and mirror, backing off on a slow or flaky connection
        }
      }
    };
    const worker = async () => { for (let item; (item = todo.shift());) await fetchFile(item); };
    await Promise.all(Array.from({ length: 6 }, worker));
    await cache.put(marker(id), new Response("ok"));
    update(id, { status: "done", done: total });
  } catch (error) {
    if (abort.signal.reason === "removed") return;
    update(id, {
      status: "paused",
      message: abort.signal.reason === "paused" ? undefined : `Download stopped: ${error instanceof Error ? error.message : error}. Files already saved are kept; press Resume to continue.`,
    });
  } finally {
    running.delete(id);
  }
}

export const pauseDownload = (id: string) => running.get(id)?.abort("paused");

export async function removeDownload(id: string) {
  running.get(id)?.abort("removed");
  await caches.delete(store(id)).catch(() => {});
  update(id, { status: "none", done: 0, message: undefined });
}
